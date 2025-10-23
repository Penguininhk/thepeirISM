import { ActionLogFeed } from "@/components/admin/action-log-feed";
import { actionLogs } from "@/lib/data";

export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Action Logs</h1>
        <p className="text-muted-foreground">A detailed feed of all administrative actions.</p>
      </div>
      <div>
         <ActionLogFeed logs={actionLogs} />
      </div>
    </div>
  );
}
