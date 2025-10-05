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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StatusActionButtons } from "./status-action-buttons";
import { users as defaultUsers } from "@/lib/data";
import type { User } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, FileUp, Trash2, Users, Edit, ChevronDown, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UserManagementProps {
  users: User[];
}

export function UserManagement({ users: initialUsers = defaultUsers }: UserManagementProps) {
  const [users, setUsers] = React.useState(initialUsers);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [isImportOpen, setImportOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredUsers.map((user) => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, userId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== userId));
    }
  };

  const filteredUsers = React.useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || user.status === statusFilter) &&
      (roleFilter === 'all' || user.role === roleFilter)
    );
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleBatchDelete = () => {
    // In a real app, this would be an API call
    setUsers(prev => prev.filter(user => !selectedRows.includes(user.id)));
    toast({ title: `${selectedRows.length} users deleted.` });
    setSelectedRows([]);
  };
  
  const handleBatchStatusChange = (status: 'approved' | 'rejected' | 'pending') => {
    // In a real app, this would be an API call
    setUsers(prev => prev.map(user => 
      selectedRows.includes(user.id) ? { ...user, status } : user
    ));
    toast({ title: `${selectedRows.length} users updated to ${status}.` });
    setSelectedRows([]);
  }

  const handleImport = () => {
     toast({
      title: "File Processed",
      description: "User accounts have been successfully created from the CSV file.",
    });
    setImportOpen(false);
  }

  const handleSaveUser = () => {
    if (!editUser) return;
     toast({
      title: "User Updated",
      description: `${editUser.name}'s information has been successfully updated.`,
    });
    setEditUser(null);
  }

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
          <Input 
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2">
            {selectedRows.length > 0 ? (
               <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground">{selectedRows.length} selected</span>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Actions <ChevronDown className="ml-2 h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleBatchStatusChange('approved')}><CheckCircle className="mr-2 h-4 w-4 text-green-500"/>Approve</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBatchStatusChange('rejected')}><XCircle className="mr-2 h-4 w-4 text-red-500"/>Reject</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBatchStatusChange('pending')}><HelpCircle className="mr-2 h-4 w-4 text-yellow-500"/>Mark as Pending</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={handleBatchDelete}><Trash2 className="mr-2 h-4 w-4"/>Delete Selected</DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
               </div>
            ) : (
              <>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Role: {roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)} <ChevronDown className="ml-2 h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setRoleFilter('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter('student')}>Student</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter('teacher')}>Teacher</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} <ChevronDown className="ml-2 h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('approved')}>Approved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isImportOpen} onOpenChange={setImportOpen}>
                    <DialogTrigger asChild>
                        <Button><FileUp className="mr-2 h-4 w-4" /> Bulk Import</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bulk Import Users</DialogTitle>
                            <DialogDescription>
                                Upload a CSV file to create multiple user accounts at once.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Format your CSV with the following columns: `email`, `firstName`, `lastName`, `role` (student/teacher).
                            </p>
                            <div className="p-6 border-2 border-dashed rounded-lg text-center">
                                <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Click or drag file to this area to upload</p>
                                <Input id="csv-upload" type="file" className="sr-only" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setImportOpen(false)}>Cancel</Button>
                            <Button onClick={handleImport}>Import</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead padding="checkbox">
                    <Checkbox
                        checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        aria-label="Select all"
                    />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredUsers.map((user) => (
                <TableRow key={user.id} data-state={selectedRows.includes(user.id) && "selected"}>
                    <TableCell padding="checkbox">
                       <Checkbox
                          checked={selectedRows.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectRow(user.id, !!checked)}
                          aria-label={`Select user ${user.name}`}
                        />
                    </TableCell>
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
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <StatusActionButtons user={user} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>

      {editUser && (
        <Dialog open={!!editUser} onOpenChange={(isOpen) => !isOpen && setEditUser(null)}>
           <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update the details for {editUser.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" defaultValue={editUser.name} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" defaultValue={editUser.email} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <select id="role" defaultValue={editUser.role} className="col-span-3 border-input bg-background border rounded-md p-2 text-sm">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
                    <Button onClick={handleSaveUser}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
