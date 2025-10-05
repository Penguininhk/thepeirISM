'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import type { UserProfile, ActionLog } from '@/lib/data';
import { Timestamp } from 'firebase-admin/firestore';


// This function must be defined within the Server Component that uses it
// to avoid bundling issues with the 'firebase-admin' package.
function initializeAdminApp() {
  // Use a unique name for the admin app to avoid conflicts
  const appName = 'firebase-admin-app-for-server-actions';
  
  if (admin.apps.some(app => app?.name === appName)) {
    return admin.app(appName);
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin credentials not found in environment variables.');
  }
  
  const credentials = { privateKey, clientEmail, projectId };

  return admin.initializeApp({
    credential: admin.credential.cert(credentials),
  }, appName);
}

function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  // Re-throwing is important for the client to catch the failure.
  throw new Error(message);
}


export async function getUsers(): Promise<UserProfile[]> {
  try {
    const app = initializeAdminApp();
    const firestore = app.firestore();
    const usersSnapshot = await firestore.collection('users').get();
    return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    handleError(error, 'get-users');
    return []; // Return empty array on error
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
    console.error('Failed to fetch action logs:', error);
    handleError(error, 'get-action-logs');
    return []; // Return empty array on error
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
      status: 'approved', // Directly approve user created by admin
      classIds: [],
    };

    await firestore.collection('users').doc(userRecord.uid).set(newUserProfile);

    // Set custom claim if the user is an admin
    if (role === 'admin') {
      await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    }

    await firestore.collection('actionLogs').add({
      details: `New user '${email}' created with role '${role}'.`,
      actionType: 'user_created',
      adminId: 'admin-system', // Placeholder for authenticated admin
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
      // Ensure the user has the admin custom claim.
      await auth.setCustomUserClaims(userId, { admin: true });
    } else {
      // If user is not an admin or is rejected, remove the claim.
       await auth.setCustomUserClaims(userId, { admin: false });
    }

    await firestore.collection('actionLogs').add({
      details: `User status for ${userId} updated to '${status}'.`,
      actionType: 'user_status_update',
      adminId: 'admin-system', // Placeholder for authenticated admin
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard/admin');

    return { success: true, userId, status };
  } catch (error) {
    handleError(error, 'update-user-status');
  }
}
