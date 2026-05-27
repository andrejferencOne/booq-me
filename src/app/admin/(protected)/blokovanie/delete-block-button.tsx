 'use client';

  import { useTransition } from 'react';
  import { useRouter } from 'next/navigation';
  import { toast } from 'sonner';
  import { Button } from '@/components/ui/button';
  import { deleteBlock } from './actions';

  export const DeleteBlockButton = ({ id }: { id: string }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
    return (
      <Button
        variant="outline" size="sm" disabled={isPending}
        onClick={() => {
          if (!confirm('Naozaj odstrániť toto blokovanie?')) return;
          startTransition(async () => {
            const result = await deleteBlock(id);
            if (!result.ok) return toast.error(result.error);
            toast.success('Blokovanie odstránené');
            router.refresh();
          });
        }}
      >
        Odstrániť
      </Button>
    );
  };
