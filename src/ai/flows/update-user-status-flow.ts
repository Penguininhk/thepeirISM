'use server';

import { ai } from '@/ai/genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { z } from 'zod';

const UpdateUserStatusInputSchema = z.object({
  userId: z.string(),
  status: z.enum(['approved', 'rejected']),
  isAdmin: z.boolean().optional(),
});

export const updateUserStatus = ai.defineFlow(
  {
    name: 'updateUserStatusFlow',
    inputSchema: UpdateUserStatusInputSchema,
    outputSchema: z.any(),
  },
  async ({ userId, status, isAdmin }) => {
    const { auth, firestore } = initializeServerFirebase();

    const userRef = firestore.collection('users').doc(userId);
    await userRef.update({ status });
    
    if (isAdmin) {
      await auth.setCustomUserClaims(userId, { admin: true });
    }

    await firestore.collection('actionLogs').add({
        details: `User status for ${userId} updated to '${status}'.`,
        actionType: 'user_status_update',
        adminId: 'admin-system', // In a real app, you'd get the current admin's ID
        timestamp: new Date(),
    });
    
    return { success: true, userId, status };
  }
);
