'use client';

  import { useTransition } from 'react';
  import { useRouter } from 'next/navigation';
  import { toast } from 'sonner';
  import { Button } from '@/components/ui/button';
  import { toggleServiceStatus } from './actions';

  type Props = { serviceId: string; currentStatus: 'ACTIVE' | 'INACTIVE' };

  export const ToggleStatusButton = ({ serviceId, currentStatus }: Props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        variant="outline" size="sm" disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await toggleServiceStatus(serviceId);
            if (!result.ok) { toast.error(result.error); return; }
            toast.success(currentStatus === 'ACTIVE' ? 'Deaktivované' : 'Aktivované');
            router.refresh();
          });
        }}
      >
        {currentStatus === 'ACTIVE' ? 'Deaktivovať' : 'Aktivovať'}
      </Button>
    );
  };
