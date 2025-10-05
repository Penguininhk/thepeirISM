'use server';

import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import type { UserProfile } from '@/lib/data';

// This function initializes the Firebase Admin SDK.
// It's designed to be idempotent, meaning it can be called multiple times without re-initializing.
function initializeAdminApp() {
  const appName = 'firebase-admin-app-for-server-actions';
  
  // Check if the app is already initialized to prevent errors.
  if (admin.apps.some(app => app?.name === appName)) {
    return admin.app(appName);
  }

  // These credentials should be stored securely as environment variables.
  // The private key needs special handling to parse newlines correctly.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error('Firebase Admin credentials not found in environment variables. Please ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID are set.');
  }
  
  // Construct the full service account object from the environment variables.
  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  // Initialize the app with the service account and a unique name.
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  }, appName);
}

// A generic error handler to avoid repetitive try/catch blocks.
function handleError(error: any, action: string) {
  console.error(`Error during ${action}:`, error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  // Re-throwing the error is important for the client-side to catch and display it.
  throw new Error(message);
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
