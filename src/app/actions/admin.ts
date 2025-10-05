'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import type { UserProfile, ActionLog } from '@/lib/data';
import { Timestamp } from 'firebase-admin/firestore';


function initializeAdminApp() {
  const appName = 'firebase-admin-app-for-server-actions';
  
  // Check if the app is already initialized
  if (admin.apps.some(app => app?.name === appName)) {
    return admin.app(appName);
  }

  // This is the only way to safely parse the private key from an env var
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin credentials not found in environment variables. Please ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are set.');
  }
  
  // Construct the full service account object
  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  // Initialize the app with the service account and a unique name
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, appName);
}

function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  // Re-throwing the error is important for the client to catch it
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
    return []; // This line won't be reached due to throw in handleError
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
        // Safely convert Firestore Timestamp to a serializable string
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
      } as ActionLog;
    });
  } catch (error) {
    handleError(error, 'get-action-logs');
    return []; // This line won't be reached
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

    // Set the user profile document in Firestore
    await firestore.collection('users').doc(userRecord.uid).set(newUserProfile);

    // Set custom claims if the user is an admin
    if (role === 'admin') {
      await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    }

    // Log the creation action
    await firestore.collection('actionLogs').add({
      details: `New user '${email}' created with role '${role}'.`,
      actionType: 'user_created',
      adminId: 'admin-system', // In a real app, this would be the current admin's ID
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

    // Update the user's status in their Firestore document
    await firestore.collection('users').doc(userId).update({ status });

    // Update custom claims based on role and status
    if (role === 'admin' && status === 'approved') {
      await auth.setCustomUserClaims(userId, { admin: true });
    } else {
       // Ensure non-admins or rejected admins don't have the claim
       await auth.setCustomUserClaims(userId, { admin: false });
    }

    // Log the status update action
    await firestore.collection('actionLogs').add({
      details: `User status for ${userId} updated to '${status}'.`,
      actionType: 'user_status_update',
      adminId: 'admin-system', // In a real app, this would be the current admin's ID
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard/admin');

    return { success: true, userId, status };
  } catch (error) {
    handleError(error, 'update-user-status');
  }
}
