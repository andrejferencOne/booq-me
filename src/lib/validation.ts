import { z } from 'zod';

export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, 'Vyberte službu'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Neplatný dátum'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Neplatný čas'),
  customerName: z.string().min(2, 'Meno musí mať aspoň 2 znaky').max(100),
  customerEmail: z.string().email('Neplatná e-mailová adresa'),
  customerPhone: z
    .string()
    .regex(/^\+?[\d\s\-]{9,15}$/, 'Neplatné telefónne číslo'),
  note: z.string().max(500).optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
