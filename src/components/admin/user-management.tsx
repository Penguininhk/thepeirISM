
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StatusActionButtons } from "./status-action-buttons";
import { users as defaultUsers } from "@/lib/data";
import type { User } from "@/lib/data";

interface UserManagementProps {
  users: User[];
}

export function UserManagement({ users = defaultUsers }: UserManagementProps) {

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Approve, reject, or manage users for the portal.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                <TableRow key={user.id}>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 truncate">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell>
                    <Badge variant={user.role === 'teacher' ? 'secondary' : 'outline'}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Badge
                        className={cn({
                        "bg-green-100 text-green-800 border-green-200": user.status === "approved",
                        "bg-yellow-100 text-yellow-800 border-yellow-200": user.status === "pending",
                        "bg-red-100 text-red-800 border-red-200": user.status === "rejected",
                        })}
                    >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <StatusActionButtons user={user} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
