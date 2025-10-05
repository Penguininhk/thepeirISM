'use client';

import type { UserProfile } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import StatusActionButtons from './status-action-buttons';

interface UserManagementProps {
  initialUsers: UserProfile[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const pendingUsers = initialUsers.filter(u => u.status === 'pending');
  const otherUsers = initialUsers.filter(u => u.status !== 'pending');

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review and approve or reject new account requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'student' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <StatusActionButtons userId={user.id} userRole={user.role} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No pending requests.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                       <TableCell>
                        <Badge variant={user.role === 'student' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Badge
                          className={cn({
                            "bg-green-500 text-white": user.status === "approved",
                            "bg-red-500 text-white": user.status === "rejected",
                          })}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </>
  );
}
