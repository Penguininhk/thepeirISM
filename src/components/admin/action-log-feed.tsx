
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { actionLogs as defaultLogs } from "@/lib/data";
import type { ActionLog } from "@/lib/data";

interface ActionLogFeedProps {
  logs: ActionLog[];
}

export function ActionLogFeed({ logs = defaultLogs }: ActionLogFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Action Log
        </CardTitle>
        <CardDescription>A feed of recent administrative actions.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[calc(100vh-16rem)]">
          <div className="space-y-6">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="pt-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/50"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{log.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })} by {log.admin.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
