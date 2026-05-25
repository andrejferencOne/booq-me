'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { bookingFormSchema, type BookingFormValues } from '@/lib/validation';
import { createBooking } from './actions';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Props = {
  serviceId: string;
  date: string;
  time: string;
};

export function CustomerForm({ serviceId, date, time }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceId,
      date,
      time,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      note: '',
    },
  });

  const onSubmit = (values: BookingFormValues) => {
    startTransition(async () => {
      const result = await createBooking(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.push(`/rezervacia/potvrdenie/${result.data.id}`);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meno a priezvisko</FormLabel>
              <FormControl>
                <Input placeholder="Ján Novák" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jan@priklad.sk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefón</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+421 900 000 000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poznámka (nepovinné)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Napr. alergie, špeciálne požiadavky..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Rezervujem...' : 'Potvrdiť rezerváciu'}
        </Button>
      </form>
    </Form>
  );
}
