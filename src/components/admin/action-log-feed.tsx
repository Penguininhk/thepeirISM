import { initializeServerFirebase } from '@/firebase/server-config';
import type { ActionLog } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from 'firebase-admin/firestore';

async function getActionLogs() {
  const { firestore } = initializeServerFirebase();
  const logsSnapshot = await firestore.collection('actionLogs').orderBy('timestamp', 'desc').limit(10).get();
  const logsList = logsSnapshot.docs.map(doc => {
    const data = doc.data() as ActionLog;
    // Firestore Timestamps need to be converted to a serializable format (e.g., ISO string)
    // for the Server Component to pass to the client component if needed.
    // Here we'll convert it for direct rendering.
    if (data.timestamp && data.timestamp instanceof Timestamp) {
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp.toDate().toISOString(),
      };
    }
    return { id: doc.id, ...data, timestamp: new Date().toISOString() };
  });
  return logsList;
}

export default async function ActionLogFeed() {
  const actionLogs = await getActionLogs();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Action Log
        </CardTitle>
        <CardDescription>A log of recent administrative actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actionLogs && actionLogs.length > 0 ? (
            actionLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3">
                 <div className="flex-shrink-0 pt-1">
                   <div className="h-2 w-2 rounded-full bg-accent" />
                 </div>
                 <div>
                  <p className="text-sm">{log.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.timestamp ? `${formatDistanceToNow(new Date(log.timestamp))} ago` : 'just now'} by {log.adminId}
                  </p>
                 </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground py-4">No actions logged yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}