'use server';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/user-management';
import ActionLogFeed from '@/components/admin/action-log-feed';
import CreateUserDialog from '@/components/admin/create-user-dialog';
import type { UserProfile, ActionLog } from '@/lib/data';
import { Timestamp } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// This function must be defined within the Server Component that uses it
// to avoid bundling issues with the 'firebase-admin' package.
function initializeAdminApp() {
  if (admin.apps.some(app => app?.name === 'admin-dashboard-page')) {
    return admin.app('admin-dashboard-page').firestore();
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    console.error('Firebase Admin credentials not found in environment variables.');
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({ privateKey, clientEmail, projectId }),
  }, 'admin-dashboard-page').firestore();
}


async function getUsers(): Promise<UserProfile[]> {
  const firestore = initializeAdminApp();
  if (!firestore) return [];
  try {
    const usersSnapshot = await firestore.collection('users').get();
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return []; // Return empty array on error
  }
}

async function getActionLogs(): Promise<ActionLog[]> {
    const firestore = initializeAdminApp();
    if (!firestore) return [];
  try {
    const logsSnapshot = await firestore.collection('actionLogs').orderBy('timestamp', 'desc').limit(10).get();
    return logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
      } as ActionLog;
    });
  } catch (error) {
    console.error('Failed to fetch action logs:', error);
    return []; // Return empty array on error
  }
}

export default async function AdminDashboardPage() {
  // Fetch data directly on the server
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
            {/* UserManagement is a Client Component receiving server-fetched data */}
            <UserManagement initialUsers={users} />
          </React.Suspense>
        </div>

        <div className="lg:col-span-1">
           <React.Suspense fallback={<Card><CardHeader><CardTitle>Loading Log...</CardTitle></CardHeader></Card>}>
            {/* ActionLogFeed is a Client Component receiving server-fetched data */}
            <ActionLogFeed initialLogs={actionLogs} />
           </React.Suspense>
        </div>
      </div>
    </div>
  );
}
