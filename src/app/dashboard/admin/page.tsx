import { UserManagement } from "@/components/admin/user-management";
import { ActionLogFeed } from "@/components/admin/action-log-feed";
import { users, actionLogs } from "@/lib/data";

export default function AdminDashboardPage() {
  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <UserManagement users={users} />
      </div>
      <div>
        <ActionLogFeed logs={actionLogs} />
      </div>
    </div>
  );
}
