'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateUserStatus } from '@/app/actions/admin';
import type { UserProfile } from '@/lib/data';

interface StatusActionButtonsProps {
  userId: string;
  userRole: UserProfile['role'];
}

export default function StatusActionButtons({ userId, userRole }: StatusActionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleUpdate = (newStatus: 'approved' | 'rejected') => {
    startTransition(async () => {
      try {
        await updateUserStatus(userId, newStatus, userRole);
        toast({
          title: 'User Status Updated',
          description: `User has been ${newStatus}.`,
        });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'Could not update user status.';
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: errorMsg,
        });
      }
    });
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => handleUpdate('approved')} disabled={isPending}>
        {isPending ? '...' : 'Approve'}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleUpdate('rejected')} disabled={isPending}>
        {isPending ? '...' : 'Reject'}
      </Button>
    </>
  );
}