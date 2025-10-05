import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/user-management';
import ActionLogFeed from '@/components/admin/action-log-feed';
import CreateUserDialog from '@/components/admin/create-user-dialog';
import { getUsers, getActionLogs } from '@/app/actions/admin';
import type { UserProfile, ActionLog } from '@/lib/data';

export default async function AdminDashboardPage() {
  const users = await getUsers();
  const actionLogs = await getActionLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage user accounts and school settings.</p>
        </div>
        <CreateUserDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <React.Suspense fallback={<Card><CardHeader><CardTitle>Loading Users...</CardTitle></CardHeader></Card>}>
            <UserManagement initialUsers={users} />
          </React.Suspense>
        </div>

        <div className="lg:col-span-1">
           <React.Suspense fallback={<Card><CardHeader><CardTitle>Loading Log...</CardTitle></CardHeader></Card>}>
            <ActionLogFeed initialLogs={actionLogs} />
           </React.Suspense>
        </div>
      </div>
    </div>
  );
}
