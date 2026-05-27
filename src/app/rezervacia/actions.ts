'use server';

import { and, eq, gte, lt, lte, or } from 'drizzle-orm';
import { addMinutes } from 'date-fns';
import { db } from '@/db';
import { bookings, blockedSlots, services } from '@/db/schema';
import { computeAvailableSlots } from '@/lib/booking-logic';
import { startOfDayBratislava, endOfDayBratislava, buildBratislavaDateTime } from '@/lib/timezone';
import { bookingFormSchema } from '@/lib/validation';
import type { ActionResult } from '@/lib/action-result';
import { sendBookingConfirmationToCustomer, sendNewBookingToAdmin } from '@/lib/email';

export const getAvailableSlots = async (
  serviceId: string,
  dateStr: string,
): Promise<string[]> => {
  const [service] = await db.select().from(services).where(eq(services.id, serviceId));
  if (!service) return [];

  const dayStart = startOfDayBratislava(dateStr);
  const dayEnd = endOfDayBratislava(dateStr);

  const existingBookings = await db
    .select({ startTime: bookings.startTime, endTime: bookings.endTime })
    .from(bookings)
    .where(
      and(
        eq(bookings.canceled, false),
        gte(bookings.startTime, dayStart),
        lte(bookings.startTime, dayEnd),
      ),
    );

  const blocks = await db
    .select({ startTime: blockedSlots.startTime, endTime: blockedSlots.endTime })
    .from(blockedSlots)
    .where(
      or(
        and(gte(blockedSlots.startTime, dayStart), lte(blockedSlots.startTime, dayEnd)),
        and(gte(blockedSlots.endTime, dayStart), lte(blockedSlots.endTime, dayEnd)),
        and(lt(blockedSlots.startTime, dayStart), gte(blockedSlots.endTime, dayEnd)),
      ),
    );

  return computeAvailableSlots(dateStr, service.durationMinutes, [...existingBookings, ...blocks]);
};

export const createBooking = async (
  raw: unknown,
): Promise<ActionResult<{ id: string }>> => {
  const parsed = bookingFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'Neplatné údaje formulára.' };
  }

  const { serviceId, date, time, customerName, customerEmail, customerPhone, note } = parsed.data;

  const [service] = await db.select().from(services).where(eq(services.id, serviceId));
  if (!service) return { ok: false, error: 'Služba neexistuje.' };

  const startTime = buildBratislavaDateTime(date, time);
  const endTime = addMinutes(startTime, service.durationMinutes);

  const conflict = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.canceled, false),
        lt(bookings.startTime, endTime),
        gte(bookings.endTime, startTime),
      ),
    )
    .limit(1);

  if (conflict.length > 0) {
    return { ok: false, error: 'Tento termín bol práve zarezervovaný. Vyberte iný čas.' };
  }

  const [booking] = await db
    .insert(bookings)
    .values({ serviceId, startTime, endTime, customerName, customerEmail, customerPhone, note })
    .returning({ id: bookings.id });

  await Promise.allSettled([
    sendBookingConfirmationToCustomer({
      to: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
      serviceName: service.name,
      startTime,
      priceCents: service.priceCents,
      durationMinutes: service.durationMinutes,
    }),
    sendNewBookingToAdmin({
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      serviceName: service.name,
      startTime,
      note: parsed.data.note,
    }),
  ]);

  return { ok: true, data: { id: booking.id } };
};
