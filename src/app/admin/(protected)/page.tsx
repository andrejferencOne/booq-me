 import Link from 'next/link';
  import { and, eq, gte, lte } from 'drizzle-orm';
  import { endOfDay, addDays } from 'date-fns';
  import { db } from '@/db';
  import { bookings, services } from '@/db/schema';
  import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import { formatBratislavaDateTime } from '@/lib/timezone';
  import { formatPriceFromCents, formatDuration } from '@/lib/format';
  import { CancelButton } from './cancel-button';

  type Props = { searchParams: Promise<{ filter?: 'today' | 'week' | 'all' }> };

  export default async function AdminBookingsPage({ searchParams }: Props) {
    const params = await searchParams;
    const filter = params.filter ?? 'today';

    const now = new Date();
    let toDate = endOfDay(now);

    if (filter === 'week') toDate = endOfDay(addDays(now, 7));
    if (filter === 'all') toDate = addDays(now, 365);

    const rows = await db
      .select({ booking: bookings, service: services })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .where(and(gte(bookings.endTime, now), lte(bookings.startTime, toDate)))
      .orderBy(bookings.startTime);

    return (
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Rezervácie</h1>
          <div className="flex gap-2">
            <FilterLink current={filter} value="today" label="Dnes" />
            <FilterLink current={filter} value="week" label="Týždeň" />
            <FilterLink current={filter} value="all" label="Všetky" />
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            Žiadne nadchádzajúce rezervácie pre tento filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dátum a čas</TableHead>
                  <TableHead>Služba</TableHead>
                  <TableHead>Zákazník</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Stav</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ booking, service }) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {formatBratislavaDateTime(booking.startTime)}
                    </TableCell>
                    <TableCell>
                      {service.name}
                      <div className="text-xs text-muted-foreground">
                        {formatDuration(service.durationMinutes)} · {formatPriceFromCents(service.priceCents)}
                      </div>
                    </TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>
                      <div className="text-sm">{booking.customerEmail}</div>
                      <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                    </TableCell>
                    <TableCell>
                      {booking.canceled ? (
                        <Badge variant="destructive">Zrušená</Badge>
                      ) : (
                        <Badge>Aktívna</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!booking.canceled && <CancelButton bookingId={booking.id} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  }
  
  const FilterLink = ({ current, value, label }: {
    current: string;
    value: string;
    label: string;
  }) => (
    <Link
      href={`/admin?filter=${value}`}
      className={`px-3 py-1.5 text-sm rounded-md border ${
        current === value ? 'bg-primary text-primary-foreground' : ''
      }`}
    >
      {label}
    </Link>
  );
