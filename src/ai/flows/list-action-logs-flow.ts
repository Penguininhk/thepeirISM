'use server';

import { ai } from '@/ai/genkit';
import { initializeServerFirebase } from '@/firebase/server-config';
import { ActionLog } from '@/lib/data';
import { z } from 'zod';
import { Timestamp } from 'firebase-admin/firestore';

export const listActionLogs = ai.defineFlow(
  {
    name: 'listActionLogsFlow',
    inputSchema: z.void(),
    outputSchema: z.array(z.any()),
  },
  async () => {
    const { firestore } = initializeServerFirebase();
    const logsSnapshot = await firestore.collection('actionLogs').orderBy('timestamp', 'desc').limit(10).get();
    
    const logsList = logsSnapshot.docs.map(doc => {
      const data = doc.data() as ActionLog;
      // Convert Firestore Timestamp to a serializable format (ISO string)
      if (data.timestamp && data.timestamp instanceof Timestamp) {
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate().toISOString(),
        };
      }
      return { id: doc.id, ...data };
    });

    return logsList;
  }
);
