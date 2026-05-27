 'use server';

  import { eq } from 'drizzle-orm';
  import { revalidatePath } from 'next/cache';
  import { headers } from 'next/headers';
  import { z } from 'zod';
  import { db } from '@/db';
  import { blockedSlots } from '@/db/schema';
  import { auth } from '@/lib/auth';
  import { ok, fail, type ActionResult } from '@/lib/action-result';
  import { parseLocalToBratislava } from '@/lib/timezone';

  const requireAdmin = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error('Unauthorized');
  };

  const blockSchema = z.object({
    startLocal: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Neplatny format datumu'),
    endLocal: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Neplatny format datumu'),
    reason: z.string().max(200).optional().transform((v) => v?.trim() || null),
  });

  export const createBlock = async (input: z.infer<typeof blockSchema>): Promise<ActionResult> => {
    try {
      await requireAdmin();
      const parsed = blockSchema.parse(input);

      const startTime = parseLocalToBratislava(parsed.startLocal);
      const endTime = parseLocalToBratislava(parsed.endLocal);

      if (endTime <= startTime) return fail('Koniec musí byť po začiatku');
      if (startTime < new Date()) return fail('Nemôžeš blokovať čas v minulosti');

      await db.insert(blockedSlots).values({ startTime, endTime, reason: parsed.reason });
      revalidatePath('/admin/blokovanie');
      revalidatePath('/rezervacia');
      return ok(undefined);
    } catch (err) {
      return fail((err as Error).message);
    }
  };
  
  export const deleteBlock = async (id: string): Promise<ActionResult> => {
    try {
      await requireAdmin();
      await db.delete(blockedSlots).where(eq(blockedSlots.id, id));
      revalidatePath('/admin/blokovanie');
      revalidatePath('/rezervacia');
      return ok(undefined);
    } catch (err) {
      return fail((err as Error).message);
    }
  };
