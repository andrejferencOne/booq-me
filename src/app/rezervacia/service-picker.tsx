'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatPriceFromCents, formatDuration } from '@/lib/format';
import type { Service } from '@/db/schema';

type Props = {
  services: Service[];
  selectedId?: string;
};

export const ServicePicker = ({ services, selectedId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('serviceId', id);
    params.delete('date');
    params.delete('time');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <Card
          key={service.id}
          onClick={() => handleSelect(service.id)}
          className={cn(
            'cursor-pointer transition hover:border-primary',
            selectedId === service.id && 'border-primary ring-2 ring-primary/20',
          )}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{service.name}</CardTitle>
              <div className="text-right">
                <div className="font-semibold">{formatPriceFromCents(service.priceCents)}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(service.durationMinutes)}
                </div>
              </div>
            </div>
          </CardHeader>
          {service.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
