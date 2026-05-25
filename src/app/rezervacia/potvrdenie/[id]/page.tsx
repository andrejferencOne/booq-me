import { db } from '@/db';
import { bookings, services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { formatBratislavaDateTime } from '@/lib/timezone';
import { formatPriceFromCents, formatDuration } from '@/lib/format';
import { CheckCircle } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PotvrdeniePage({ params }: Props) {
  const { id } = await params;

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id));

  if (!booking) notFound();

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, booking.serviceId));

  return (
    <div className="max-w-lg mx-auto py-16 text-center space-y-6">
      <CheckCircle className="mx-auto size-16 text-green-500" />
      <h1 className="text-3xl font-bold">Rezervácia potvrdená!</h1>
      <p className="text-muted-foreground">
        Ďakujeme, {booking.customerName}. Tešíme sa na vás.
      </p>

      <div className="text-left border rounded-xl p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Služba</span>
          <span className="font-medium">{service?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dátum a čas</span>
          <span className="font-medium">{formatBratislavaDateTime(booking.startTime)}</span>
        </div>
        {service && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trvanie</span>
              <span className="font-medium">{formatDuration(service.durationMinutes)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cena</span>
              <span className="font-medium">{formatPriceFromCents(service.priceCents)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">E-mail</span>
          <span className="font-medium">{booking.customerEmail}</span>
        </div>
      </div>

      <a
        href="/"
        className="inline-block mt-4 text-sm text-muted-foreground underline underline-offset-4"
      >
        Späť na hlavnú stránku
      </a>
    </div>
  );
}
