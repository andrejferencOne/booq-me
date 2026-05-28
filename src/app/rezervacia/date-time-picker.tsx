
  'use client';

  import { useEffect, useState, useTransition } from 'react';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { format } from 'date-fns';
  import { Calendar } from '@/components/ui/calendar';
  import { Button } from '@/components/ui/button';
  import { getAvailableSlots } from './actions';

  type Props = {
    serviceId: string;
    selectedDate?: string;
    selectedTime?: string;
  };

  export const DateTimePicker = ({ serviceId, selectedDate, selectedTime }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();                                                                                                      
    const [slots, setSlots] = useState<string[]>([]);

    useEffect(() => {
      if (!selectedDate) {
        setSlots([]);
        return;
      }
      startTransition(async () => {
        const result = await getAvailableSlots(serviceId, selectedDate);                                                                                       
        setSlots(result);
      });
    }, [selectedDate, serviceId]);

    const date = selectedDate ? new Date(`${selectedDate}T12:00:00`) : undefined;

    const updateUrl = (key: 'date' | 'time', value: string) => {
      const params = new URLSearchParams(searchParams ?? undefined);
      params.set(key, value);
      if (key === 'date') params.delete('time');
      router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
      <div className="grid md:grid-cols-2 gap-8">                                                                                                              
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && updateUrl('date', format(d, 'yyyy-MM-dd'))}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
        />
        <div>
          <h3 className="font-medium mb-3">Voľné časy</h3>
          {!selectedDate && <p className="text-sm text-muted-foreground">Najprv vyber dátum.</p>}
          {selectedDate && isPending && <p className="text-sm text-muted-foreground">Načítavam...</p>}
          {selectedDate && !isPending && slots.length === 0 && (
            <p className="text-sm text-muted-foreground">V tento deň nie sú voľné termíny.</p>
          )}
          {selectedDate && !isPending && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateUrl('time', time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
