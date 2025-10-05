'use server';

import { ai } from '@/ai/genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { UserProfile } from '@/lib/data';
import { z } from 'zod';

export const listUsers = ai.defineFlow(
  {
    name: 'listUsersFlow',
    inputSchema: z.void(),
    outputSchema: z.array(z.any()),
  },
  async () => {
    const { firestore } = initializeServerFirebase();
    const usersSnapshot = await firestore.collection('users').get();
    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserProfile[];
    return usersList;
  }
);
