 'use client';

  import { useTransition } from 'react';
  import { useRouter } from 'next/navigation';
  import { toast } from 'sonner';
  import { Button } from '@/components/ui/button';
  import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
  import { cancelBooking } from '@/app/admin/actions';

  export const CancelButton = ({ bookingId }: { bookingId: string }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
      startTransition(async () => {
        const result = await cancelBooking(bookingId);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success('Rezervácia zrušená');
        router.refresh();
      });
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            Zrušiť
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zrušiť rezerváciu?</AlertDialogTitle>
            <AlertDialogDescription>
              Túto akciu nie je možné vrátiť. Termín sa uvoľní pre nových zákazníkov.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Späť</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Zrušiť rezerváciu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
