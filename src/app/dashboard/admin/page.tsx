import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/user-management';
import ActionLogFeed from '@/components/admin/action-log-feed';
import CreateUserDialog from '@/components/admin/create-user-dialog';
import type { UserProfile, ActionLog } from '@/lib/data';

// Because this is a server component, we can use the CLIENT sdk here safely
// and it will only execute on the server. This avoids the `firebase-admin`
// bundling issues that have been causing the `INTERNAL` error.
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Helper function to get a firestore instance on the server
function getDb() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  return getFirestore();
}

async function getUsers(): Promise<UserProfile[]> {
  const db = getDb();
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
}

async function getActionLogs(): Promise<ActionLog[]> {
  const db = getDb();
  const logsQuery = query(collection(db, 'actionLogs'), orderBy('timestamp', 'desc'), limit(10));
  const logsSnapshot = await getDocs(logsQuery);
  return logsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp.toDate().toISOString(), // Convert timestamp to string
    } as ActionLog;
  });
}


export default async function AdminDashboardPage() {
  // Fetch data directly in the Server Component
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
            {/* Pass server-fetched data to the client component */}
            <UserManagement initialUsers={users} />
          </React.Suspense>
        </div>

        <div className="lg:col-span-1">
           <React.Suspense fallback={<Card><CardHeader><CardTitle>Loading Log...</CardTitle></CardHeader></Card>}>
             {/* Pass server-fetched data to the client component */}
            <ActionLogFeed initialLogs={actionLogs} />
           </React.Suspense>
        </div>
      </div>
    </div>
  );
}
