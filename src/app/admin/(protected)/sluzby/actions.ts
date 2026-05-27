'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { db } from '@/db';
import { services } from '@/db/schema';
import { auth } from '@/lib/auth';
import { ok, fail, type ActionResult } from '@/lib/action-result';

const requireAdmin = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
};

const serviceSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().transform((v) => v?.trim() || null),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  priceEur: z.coerce.number().min(0).max(9999),
});

const toCents = (eur: number): number => Math.round(eur * 100);

export const createService = async (input: z.infer<typeof serviceSchema>): Promise<ActionResult> => {
  try {
    await requireAdmin();
    const parsed = serviceSchema.parse(input);
    await db.insert(services).values({
      name: parsed.name,
      description: parsed.description,
      durationMinutes: parsed.durationMinutes,
      priceCents: toCents(parsed.priceEur),
    });
    revalidatePath('/admin/sluzby');
    revalidatePath('/rezervacia');
    revalidatePath('/');
    return ok(undefined);
  } catch (err) {
    return fail((err as Error).message);
  }
};

export const updateService = async (
  id: string,
  input: z.infer<typeof serviceSchema>,
): Promise<ActionResult> => {
  try {
    await requireAdmin();
    const parsed = serviceSchema.parse(input);
    await db.update(services).set({
      name: parsed.name,
      description: parsed.description,
      durationMinutes: parsed.durationMinutes,
      priceCents: toCents(parsed.priceEur),
    }).where(eq(services.id, id));
    revalidatePath('/admin/sluzby');
    revalidatePath('/rezervacia');
    revalidatePath('/');
    return ok(undefined);
  } catch (err) {
    return fail((err as Error).message);
  }
};

export const toggleServiceStatus = async (id: string): Promise<ActionResult> => {
  try {
    await requireAdmin();
    const [current] = await db.select().from(services).where(eq(services.id, id));
    if (!current) return fail('Služba neexistuje');
    await db
      .update(services)
      .set({ status: current.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
      .where(eq(services.id, id));
    revalidatePath('/admin/sluzby');
    revalidatePath('/rezervacia');
    revalidatePath('/');
    return ok(undefined);
  } catch (err) {
    return fail((err as Error).message);
  }
};
