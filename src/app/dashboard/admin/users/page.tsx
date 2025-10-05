import { UserManagement } from "@/components/admin/user-management";
import { users } from "@/lib/data";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">User Management</h1>
        <p className="text-muted-foreground">Approve, reject, or manage users for the portal.</p>
      </div>
      <UserManagement users={users} />
    </div>
  );
}
