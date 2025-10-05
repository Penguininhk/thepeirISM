'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import type { UserProfile, ActionLog } from '@/lib/data';
import { Timestamp } from 'firebase-admin/firestore';


function initializeAdminApp() {
  const appName = 'firebase-admin-app-for-server-actions';
  
  if (admin.apps.some(app => app?.name === appName)) {
    return admin.app(appName);
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin credentials not found in environment variables. Please ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are set.');
  }
  
  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, appName);
}

function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  throw new Error(message);
}


export async function getUsers(): Promise<UserProfile[]> {
  try {
    const app = initializeAdminApp();
    const firestore = app.firestore();
    const usersSnapshot = await firestore.collection('users').get();
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
  } catch (error) {
    handleError(error, 'get-users');
    return []; // Should not be reached due to throw in handleError
  }
}

export async function getActionLogs(): Promise<ActionLog[]> {
  try {
    const app = initializeAdminApp();
    const firestore = app.firestore();
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
    handleError(error, 'get-action-logs');
    return []; // Should not be reached
  }
}


export async function createUser(userData: Omit<UserProfile, 'id' | 'status' | 'classIds'> & { password?: string }) {
  try {
    const app = initializeAdminApp();
    const auth = app.auth();
    const firestore = app.firestore();
    const { email, password, firstName, lastName, role } = userData;

    if (!email || !password || !firstName || !lastName || !role) {
      throw new Error('Missing required fields for user creation.');
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const newUserProfile: Omit<UserProfile, 'id'> = {
      firstName,
      lastName,
      email,
      role,
      status: 'approved',
      classIds: [],
    };

    await firestore.collection('users').doc(userRecord.uid).set(newUserProfile);

    if (role === 'admin') {
      await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    }

    await firestore.collection('actionLogs').add({
      details: `New user '${email}' created with role '${role}'.`,
      actionType: 'user_created',
      adminId: 'admin-system',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard/admin');

    return { ...newUserProfile, id: userRecord.uid };
  } catch (error) {
    handleError(error, 'create-user');
  }
}

export async function updateUserStatus(userId: string, status: 'approved' | 'rejected', role: UserProfile['role']) {
  try {
    const app = initializeAdminApp();
    const auth = app.auth();
    const firestore = app.firestore();

    await firestore.collection('users').doc(userId).update({ status });

    if (role === 'admin' && status === 'approved') {
      await auth.setCustomUserClaims(userId, { admin: true });
    } else {
       await auth.setCustomUserClaims(userId, { admin: false });
    }

    await firestore.collection('actionLogs').add({
      details: `User status for ${userId} updated to '${status}'.`,
      actionType: 'user_status_update',
      adminId: 'admin-system',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard/admin');

    return { success: true, userId, status };
  } catch (error) {
    handleError(error, 'update-user-status');
  }
}
