'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import type { UserProfile } from '@/lib/data';

// Isolate server initialization to prevent conflicts.
// Memoization ensures this only runs once per server instance.
let app: admin.app.App | null = null;
function initializeAdminApp() {
  if (app) {
    return {
      app,
      auth: admin.auth(app),
      firestore: admin.firestore(app),
    };
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin credentials not found in environment variables.');
  }
  
  const credentials = { privateKey, clientEmail, projectId };

  app = admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });

  return {
    app,
    auth: admin.auth(app),
    firestore: admin.firestore(app),
  };
}

function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  // Re-throwing is important for the client to catch the failure.
  throw new Error(message);
}


export async function createUser(userData: Omit<UserProfile, 'id' | 'status' | 'classIds'> & { password?: string }) {
  try {
    const { auth, firestore } = initializeAdminApp();
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

    await firestore.collection('actionLogs').add({
      details: `New user '${email}' created with role '${role}'.`,
      actionType: 'user_created',
      adminId: 'admin-system', // Placeholder for authenticated admin
      timestamp: new Date(),
    });

    revalidatePath('/dashboard/admin');

    return { ...newUserProfile, id: userRecord.uid };
  } catch (error) {
    handleError(error, 'create-user');
  }
}

export async function updateUserStatus(userId: string, status: 'approved' | 'rejected', role: UserProfile['role']) {
  try {
    const { auth, firestore } = initializeAdminApp();

    await firestore.collection('users').doc(userId).update({ status });

    if (role === 'admin' && status === 'approved') {
      await auth.setCustomUserClaims(userId, { admin: true });
    }

    await firestore.collection('actionLogs').add({
      details: `User status for ${userId} updated to '${status}'.`,
      actionType: 'user_status_update',
      adminId: 'admin-system', // Placeholder for authenticated admin
      timestamp: new Date(),
    });

    revalidatePath('/dashboard/admin');

    return { success: true, userId, status };
  } catch (error) {
    handleError(error, 'update-user-status');
  }
}
