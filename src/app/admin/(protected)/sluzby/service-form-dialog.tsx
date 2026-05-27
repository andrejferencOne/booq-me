'use client';

  import { useState, useTransition } from 'react';
  import { useRouter } from 'next/navigation';
  import { toast } from 'sonner';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  } from '@/components/ui/dialog';
  import { createService, updateService } from './actions';
  import type { Service } from '@/db/schema';

  type Props = { mode: 'create' } | { mode: 'edit'; service: Service };

  export const ServiceFormDialog = (props: Props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const input = {
        name: String(formData.get('name')),
        description: String(formData.get('description') ?? ''),
        durationMinutes: Number(formData.get('durationMinutes')),
        priceEur: Number(formData.get('priceEur')),
      };

      startTransition(async () => {
        const result = props.mode === 'create'
          ? await createService(input)
          : await updateService(props.service.id, input);

        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(props.mode === 'create' ? 'Služba pridaná' : 'Služba upravená');
        setOpen(false);
        router.refresh();
      });
    };
  
    const defaultPriceEur = props.mode === 'edit' ? props.service.priceCents / 100 : 15;
    const defaults = props.mode === 'edit' ? props.service : null;

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={props.mode === 'create' ? 'default' : 'outline'} size="sm">
            {props.mode === 'create' ? 'Pridať službu' : 'Upraviť'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.mode === 'create' ? 'Nová služba' : 'Úprava služby'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Názov</Label>
              <Input id="name" name="name" required defaultValue={defaults?.name} />
            </div>
            <div>
              <Label htmlFor="description">Popis</Label>
              <Textarea id="description" name="description" defaultValue={defaults?.description ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="durationMinutes">Dĺžka (min)</Label>
                <Input
                  id="durationMinutes" name="durationMinutes" type="number" required
                  min={5} max={480}
                  defaultValue={defaults?.durationMinutes ?? 30}
                />
              </div>
              <div>
                <Label htmlFor="priceEur">Cena (€)</Label>
                <Input
                  id="priceEur" name="priceEur" type="number" step="0.5" required
                  min={0}
                  defaultValue={defaultPriceEur}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Ukladám...' : 'Uložiť'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
