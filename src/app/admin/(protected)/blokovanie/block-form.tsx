 'use client';

  import { useTransition } from 'react';
  import { useRouter } from 'next/navigation';
  import { toast } from 'sonner';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { createBlock } from './actions';

  export const BlockForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const startLocal = String(formData.get('start'));
      const endLocal = String(formData.get('end'));
      const reason = String(formData.get('reason') ?? '');

      startTransition(async () => {
        const result = await createBlock({ startLocal, endLocal, reason });
        if (!result.ok) return toast.error(result.error);
        toast.success('Blokovanie pridané');
        (e.target as HTMLFormElement).reset();
        router.refresh();
      });
    };
  
    return (
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="start">Od</Label>
          <Input id="start" name="start" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="end">Do</Label>
          <Input id="end" name="end" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="reason">Dôvod (voliteľné)</Label>
          <Input id="reason" name="reason" placeholder="Dovolenka, Sviatok..." />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Ukladám...' : 'Pridať'}
          </Button>
        </div>
      </form>
    );
  };
