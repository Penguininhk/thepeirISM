'use server';
/**
 * @fileOverview A flow for updating a user's status and logging the action.
 *
 * - updateUserStatus - Updates a user's status, sets admin claims if needed, and simulates a notification.
 * - UpdateUserStatusInput - The input type for the updateUserStatus function.
 * - UpdateUserStatusOutput - The return type for the updateUserStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { UpdateUserStatusInput, UpdateUserStatusInputSchema } from '@/lib/data';

const UpdateUserStatusOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type UpdateUserStatusOutput = z.infer<typeof UpdateUserStatusOutputSchema>;


export async function updateUserStatus(input: UpdateUserStatusInput): Promise<UpdateUserStatusOutput> {
  return updateUserStatusFlow(input);
}


const updateUserStatusFlow = ai.defineFlow(
  {
    name: 'updateUserStatusFlow',
    inputSchema: UpdateUserStatusInputSchema,
    outputSchema: UpdateUserStatusOutputSchema,
  },
  async (input) => {
    const { userId, status, email, role } = input;
    const { auth, firestore } = initializeServerFirebase();

    try {
      // Step 1: Update the user's status in the Firestore document.
      const userRef = firestore.collection('users').doc(userId);
      await userRef.update({ status: status });

      // Step 2: If an 'admin' role is approved, set their custom claim.
      if (status === 'approved' && role === 'admin') {
        await auth.setCustomUserClaims(userId, { isAdmin: true });
        console.log(`Successfully set custom claim { isAdmin: true } for user ${userId}`);
      }

      // Step 3: Log the administrative action.
      const logDetails = `User '${email}' status updated to '${status}'.`;
      await firestore.collection('actionLogs').add({
        timestamp: new Date(),
        adminId: 'admin', // In a real app, this would be the UID of the logged-in admin.
        actionType: 'user_status_update',
        details: logDetails,
      });

      // Step 4: Simulate sending a notification email.
      console.log('--- Sending Email (Simulation) ---');
      console.log(`To: ${email}`);
      console.log(`Subject: Your Account Status has been updated`);
      console.log(`Body: Hello, your account status has been updated to: ${status}.`);
      console.log('------------------------------------');

      return { success: true, message: `User status updated and action logged successfully.` };
    } catch (error) {
      console.error('Error in updateUserStatusFlow: ', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      return { success: false, message: errorMessage };
    }
  }
);
