'use client';

import type { ActionLog } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActionLogFeedProps {
  initialLogs: ActionLog[];
}

export default function ActionLogFeed({ initialLogs }: ActionLogFeedProps) {
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
          {initialLogs && initialLogs.length > 0 ? (
            initialLogs.map(log => (
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
