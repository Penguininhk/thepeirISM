'use server';

import { ai } from '@/ai/genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { z } from 'zod';

const CreateUserInputSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['student', 'teacher', 'admin']),
});

export const createUser = ai.defineFlow(
  {
    name: 'createUserFlow',
    inputSchema: CreateUserInputSchema,
    outputSchema: z.any(),
  },
  async ({ email, password, firstName, lastName, role }) => {
    const { auth, firestore } = initializeServerFirebase();

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const newUserProfile = {
      id: userRecord.uid,
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
        adminId: 'admin-system',
        timestamp: new Date(),
    });
    
    return newUserProfile;
  }
);
