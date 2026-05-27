import { db } from '@/db';
import { services } from '@/db/schema';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { formatPriceFromCents, formatDuration } from '@/lib/format';
import { ServiceFormDialog } from './service-form-dialog';
import { ToggleStatusButton } from './toggle-status-button';

export default async function AdminServicesPage() {
  const allServices = await db.select().from(services).orderBy(services.name);

  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Služby</h1>
        <ServiceFormDialog mode="create" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Názov</TableHead>
            <TableHead>Dĺžka</TableHead>
            <TableHead>Cena</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{formatDuration(service.durationMinutes)}</TableCell>
              <TableCell>{formatPriceFromCents(service.priceCents)}</TableCell>
              <TableCell>
                <Badge variant={service.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {service.status === 'ACTIVE' ? 'Aktívna' : 'Neaktívna'}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2">
                <ServiceFormDialog mode="edit" service={service} />
                <ToggleStatusButton serviceId={service.id} currentStatus={service.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
