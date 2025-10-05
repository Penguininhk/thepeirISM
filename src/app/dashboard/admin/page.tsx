'use server';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/user-management';
import ActionLogFeed from '@/components/admin/action-log-feed';
import CreateUserDialog from '@/components/admin/create-user-dialog';
import type { UserProfile, ActionLog } from '@/lib/data';
import { Timestamp } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Isolate server initialization to prevent conflicts.
// Memoization ensures this only runs once per server instance.
let app: admin.app.App | null = null;
function initializeAdminApp() {
  if (app) {
    return {
      app,
      firestore: admin.firestore(app),
    };
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin credentials not found in environment variables.');
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({ privateKey, clientEmail, projectId }),
  });

  return {
    app,
    firestore: admin.firestore(app),
  };
}


async function getUsers(): Promise<UserProfile[]> {
  const { firestore } = initializeAdminApp();
  const usersSnapshot = await firestore.collection('users').get();
  const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
  return usersList;
}

async function getActionLogs(): Promise<ActionLog[]> {
  const { firestore } = initializeAdminApp();
  const logsSnapshot = await firestore.collection('actionLogs').orderBy('timestamp', 'desc').limit(10).get();
  const logsList = logsSnapshot.docs.map(doc => {
    const data = doc.data();
    if (data.timestamp && data.timestamp instanceof Timestamp) {
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp.toDate().toISOString(),
      } as ActionLog;
    }
    return { 
      id: doc.id, 
      ...data, 
      timestamp: new Date().toISOString() 
    } as ActionLog;
  });
  return logsList;
}

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
