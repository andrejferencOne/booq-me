  'use server';

  import { eq } from 'drizzle-orm';
  import { revalidatePath } from 'next/cache';
  import { headers } from 'next/headers';
  import { db } from '@/db';
  import { bookings } from '@/db/schema';
  import { auth } from '@/lib/auth';
  import { ok, fail, type ActionResult } from '@/lib/action-result';

  const requireAdmin = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');
    return session.user;
  };

  export const cancelBooking = async (bookingId: string): Promise<ActionResult> => {
    try {
      await requireAdmin();
      await db
        .update(bookings)
        .set({ canceled: true })
        .where(eq(bookings.id, bookingId));
      revalidatePath('/admin');
      revalidatePath('/rezervacia');
      return ok(undefined);
    } catch (err) {
      return fail((err as Error).message);
    }
  };
