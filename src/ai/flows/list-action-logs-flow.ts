'use server';
/**
 * @fileOverview A flow for listing all action logs in the system.
 * This flow is intended to be called from the admin dashboard.
 *
 * - listActionLogs - Retrieves a list of all action logs from Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { ActionLog } from '@/lib/data';

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
    outputSchema: ListActionLogsOutputSchema,
  },
  async () => {
    const { firestore } = initializeServerFirebase();
    const logsCol = firestore.collection('actionLogs');
    const logsQuery = logsCol.orderBy('timestamp', 'desc').limit(10);
    const logsSnapshot = await logsQuery.get();

    if (logsSnapshot.empty) {
      return [];
    }
    
    const logsList = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore timestamps need to be converted to a serializable format.
      // We'll convert them to ISO strings. The client can parse them back to Date objects.
      return { 
        ...data, 
        id: doc.id,
        timestamp: data.timestamp.toDate().toISOString(),
      } as ActionLog;
    });
    return logsList;
  }
);
