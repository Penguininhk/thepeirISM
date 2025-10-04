'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updateUserStatus, UpdateUserStatusInput } from '@/ai/flows/update-user-status-flow';

export default function AdminDashboardPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<UserProfile>(usersQuery);

  const handleUpdateStatus = async (user: UserProfile, newStatus: 'approved' | 'rejected') => {
    if (!firestore) return;

    try {
      // 1. Update status in Firestore
      const userRef = doc(firestore, 'users', user.id);
      await updateDoc(userRef, { status: newStatus });
      
      // 2. Trigger the notification flow
      const flowInput: UpdateUserStatusInput = {
        userId: user.id,
        status: newStatus,
        email: user.email,
      };

      await updateUserStatus(flowInput);
      
      toast({
        title: 'User Status Updated',
        description: `User ${user.firstName} ${user.lastName} has been ${newStatus}.`,
      });
    } catch (e) {
      console.error('Failed to update user status:', e);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the user status.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  const pendingUsers = users?.filter(u => u.status === 'pending') || [];
  const otherUsers = users?.filter(u => u.status !== 'pending') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage user accounts and school settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review and approve or reject new account requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'student' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(user, 'approved')}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(user, 'rejected')}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No pending requests.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                       <TableCell>
                        <Badge variant={user.role === 'student' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Badge
                          className={cn({
                            "bg-green-500 text-white": user.status === "approved",
                            "bg-red-500 text-white": user.status === "rejected",
                          })}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
