
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/data";

interface StatusActionButtonsProps {
  user: User;
}

export function StatusActionButtons({ user }: StatusActionButtonsProps) {
  const { toast } = useToast();

  const handleStatusChange = (status: 'approved' | 'rejected' | 'pending') => {
    // In a real app, this would call a server action
    toast({
      title: "User Status Updated",
      description: `${user.name}'s status has been changed to ${status}.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
          <XCircle className="mr-2 h-4 w-4 text-red-500" />
          Reject
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
          <HelpCircle className="mr-2 h-4 w-4 text-yellow-500" />
          Mark as Pending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
