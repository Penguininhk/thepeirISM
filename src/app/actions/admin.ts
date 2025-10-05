'use server';

import { revalidatePath } from 'next/cache';
import { initializeServerFirebase, handleError } from '@/firebase/server-config';
import type { UserProfile } from '@/lib/data';

export async function createUser(userData: Omit<UserProfile, 'id' | 'status' | 'classIds'> & { password?: string }) {
  try {
    const { auth, firestore } = initializeServerFirebase();
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
    const { auth, firestore } = initializeServerFirebase();

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
