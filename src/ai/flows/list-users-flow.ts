'use server';
/**
 * @fileOverview A flow for listing all users in the system.
 * This flow is intended to be called from the admin dashboard.
 *
 * - listUsers - Retrieves a list of all user profiles from Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { UserProfile } from '@/lib/data';

// Define a tool that can fetch all users.
// This will run with server-side privileges, bypassing client-side security rules.
const getUsers = ai.defineTool(
  {
    name: 'getUsers',
    description: 'Retrieves a list of all user profiles from Firestore.',
    inputSchema: z.void(),
    outputSchema: z.array(z.any()), // We'll cast this to UserProfile[] later.
  },
  async () => {
    // We must initialize a server-side instance of Firebase here.
    const { firestore } = initializeServerFirebase();
    const usersCol = firestore.collection('users');
    const userSnapshot = await usersCol.get();

    if (userSnapshot.empty) {
      return [];
    }

    const userList = userSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return userList;
  }
);

// Define the schema for the output of the main flow function.
// This uses the Zod schema generated from the UserProfile type for strong typing.
const ListUsersOutputSchema = z.custom<UserProfile[]>();
export type ListUsersOutput = z.infer<typeof ListUsersOutputSchema>;

// This is the main function that will be exported and called by the client.
export async function listUsers(): Promise<ListUsersOutput> {
  return listUsersFlow();
}

// Define the Genkit flow.
const listUsersFlow = ai.defineFlow(
  {
    name: 'listUsersFlow',
    inputSchema: z.void(),
    outputSchema: ListUsersOutputSchema,
  },
  async () => {
    // Run the getUsers tool to fetch the data.
    const users = await getUsers();
    // The tool returns `any[]`, so we cast it to the expected `UserProfile[]`.
    return users as UserProfile[];
  }
);
