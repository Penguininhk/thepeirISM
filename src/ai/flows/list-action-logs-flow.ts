'use server';
/**
 * @fileOverview A flow for listing all action logs in the system.
 * This flow is intended to be called from the admin dashboard.
 *
 * - listActionLogs - Retrieves a list of all action logs from Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { ActionLog } from '@/lib/data';

// Define a tool that can fetch all action logs.
// This will run with server-side privileges, bypassing client-side security rules.
const getActionLogs = ai.defineTool(
  {
    name: 'getActionLogs',
    description: 'Retrieves a list of all action logs from Firestore.',
    inputSchema: z.void(),
    outputSchema: z.array(z.any()), // We'll cast this to ActionLog[] later.
  },
  async () => {
    const { firestore } = initializeFirebase();
    const logsCol = collection(firestore, 'actionLogs');
    const logsQuery = query(logsCol, orderBy('timestamp', 'desc'), limit(10));
    const logsSnapshot = await getDocs(logsQuery);
    const logsList = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore timestamps need to be converted to a serializable format.
      // We'll convert them to ISO strings. The client can parse them back to Date objects.
      return { 
        ...data, 
        id: doc.id,
        timestamp: data.timestamp.toDate().toISOString(),
      };
    });
    return logsList;
  }
);

// Define the schema for the output of the main flow function.
const ListActionLogsOutputSchema = z.custom<ActionLog[]>();
export type ListActionLogsOutput = z.infer<typeof ListActionLogsOutputSchema>;

// This is the main function that will be exported and called by the client.
export async function listActionLogs(): Promise<ListActionLogsOutput> {
  return listActionLogsFlow();
}

// Define the Genkit flow.
const listActionLogsFlow = ai.defineFlow(
  {
    name: 'listActionLogsFlow',
    inputSchema: z.void(),
    outputSchema: z.custom<any[]>(), // Output as any[] and cast on client.
  },
  async () => {
    // Run the getActionLogs tool to fetch the data.
    const logs = await getActionLogs();
    // The tool returns data with ISO string timestamps.
    // The client will need to parse these strings back into Date objects for formatting.
    // We also need to map the Firestore Timestamps to a serializable format.
    return logs.map(log => ({
      ...log,
      // The client-side ActionLog type expects a Timestamp object,
      // so we convert it back here for type consistency, though it's not a real Timestamp.
      // A better approach would be to have separate client/server types.
      timestamp: {
        toDate: () => new Date(log.timestamp)
      }
    }));
  }
);
