import { db } from '@/db';
import { services } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ServicePicker } from './service-picker';
import { DateTimePicker } from './date-time-picker';
import { CustomerForm } from './customer-form';

type Props = {
  searchParams: Promise<{ serviceId?: string; date?: string; time?: string }>;
};

export default async function RezervaciaPage({ searchParams }: Props) {
  const params = await searchParams;
  const allServices = await db
    .select()
    .from(services)
    .where(eq(services.status, 'ACTIVE'));

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-12">
      <h1 className="text-4xl font-bold text-center">Rezervácia termínu</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Vyberte si službu</h2>
        <ServicePicker services={allServices} selectedId={params.serviceId} />
      </section>

      {params.serviceId && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Vyberte dátum a čas</h2>
          <DateTimePicker
            serviceId={params.serviceId}
            selectedDate={params.date}
            selectedTime={params.time}
          />
        </section>
      )}

      {params.serviceId && params.date && params.time && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Vaše údaje</h2>
          <CustomerForm
            serviceId={params.serviceId}
            date={params.date}
            time={params.time}
          />
        </section>
      )}
    </div>
  );
}
