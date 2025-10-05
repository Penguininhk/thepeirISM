'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile, ActionLog } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updateUserStatus, UpdateUserStatusInput } from '@/ai/flows/update-user-status-flow';
import { listUsers } from '@/ai/flows/list-users-flow';
import { listActionLogs } from '@/ai/flows/list-action-logs-flow';
import { PlusCircle, History } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboardPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  
  const [isCreateUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'password123',
    role: 'student' as 'student' | 'teacher',
  });
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<Error | null>(null);
  
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUsersError(null);
      try {
        const userList = await listUsers();
        setUsers(userList);
      } catch (e) {
        setUsersError(e as Error);
        toast({
          variant: 'destructive',
          title: 'Failed to load users',
          description: (e as Error).message,
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchLogs = async () => {
      setIsLoadingLogs(true);
      setLogsError(null);
      try {
        const logsList = await listActionLogs();
        setActionLogs(logsList);
      } catch (e) {
        setLogsError(e as Error);
        toast({
          variant: 'destructive',
          title: 'Failed to load action logs',
          description: (e as Error).message,
        });
      } finally {
        setIsLoadingLogs(false);
      }
    };
    
    fetchUsers();
    fetchLogs();
  }, [toast]);
  
  const logAction = async (actionType: ActionLog['actionType'], details: string) => {
    if (!firestore) return;
    try {
      const newLog = {
        timestamp: serverTimestamp(),
        adminId: 'admin', // In a real app, this would be the logged-in admin's ID
        actionType,
        details,
      };
      const docRef = await addDoc(collection(firestore, 'actionLogs'), newLog);
      
      // Manually add the new log to the local state to avoid a refetch
      setActionLogs(prevLogs => [{ id: docRef.id, ...newLog, timestamp: new Date().toISOString() } as ActionLog, ...prevLogs]);

    } catch (e) {
      console.error("Failed to log action:", e);
      // Optional: show a toast that logging failed, but don't block main action
    }
  };


  const handleUpdateStatus = async (user: UserProfile, newStatus: 'approved' | 'rejected') => {
    if (!firestore) return;

    try {
      const userRef = doc(firestore, 'users', user.id);
      await updateDoc(userRef, { status: newStatus });
      
      const flowInput: UpdateUserStatusInput = {
        userId: user.id,
        status: newStatus,
        email: user.email,
        role: user.role,
      };

      await updateUserStatus(flowInput);
      
      toast({
        title: 'User Status Updated',
        description: `User ${user.firstName} ${user.lastName} has been ${newStatus}.`,
      });

      setUsers(users.map(u => u.id === user.id ? {...u, status: newStatus} : u));
      
      const logDetails = `User '${user.firstName} ${user.lastName}' (${user.email}) was ${newStatus}.`;
      await logAction('user_status_update', logDetails);

    } catch (e) {
      console.error('Failed to update user status:', e);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the user status.',
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    try {
      // We create a temporary auth instance to create the user without signing out the admin
      const tempAuth = auth;
      const userCredential = await createUserWithEmailAndPassword(tempAuth, newUser.email, newUser.password);
      const user = userCredential.user;

      const newUserProfile: UserProfile = {
        id: user.uid,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: "approved",
        classIds: [],
      };

      await setDoc(doc(firestore, "users", user.uid), newUserProfile);
      
      toast({
        title: "User Created",
        description: `Account for ${newUser.firstName} ${newUser.lastName} has been created and approved.`,
      });

      setUsers([...users, newUserProfile]);

      const logDetails = `New ${newUser.role} account created for '${newUser.firstName} ${newUser.lastName}' (${newUser.email}).`;
      await logAction('user_created', logDetails);

      setCreateUserOpen(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: 'password123', role: 'student' });

    } catch (err) {
       if (err instanceof FirebaseError) {
        if (err.code === 'auth/email-already-in-use') {
          toast({ variant: "destructive", title: "Creation Failed", description: "This email is already in use." });
        } else if (err.code === 'auth/weak-password') {
          toast({ variant: "destructive", title: "Creation Failed", description: "The password is too weak." });
        } else {
           toast({ variant: "destructive", title: "Creation Failed", description: err.message });
        }
      } else {
        toast({ variant: "destructive", title: "Creation Failed", description: "An unexpected error occurred." });
      }
    }
  };

  if (isLoadingUsers || isLoadingLogs) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  if (usersError || logsError) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-red-500">Error loading data: {usersError?.message || logsError?.message}</p>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const otherUsers = users.filter(u => u.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage user accounts and school settings.</p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Create New User Account</DialogTitle>
                <DialogDescription>
                  Enter the details for the new user. Their account will be automatically approved.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" value={newUser.firstName} onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} required/>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" value={newUser.lastName} onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} required/>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value: 'student' | 'teacher') => setNewUser({...newUser, role: value})}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setCreateUserOpen(false)}>Cancel</Button>
                <Button type="submit">Create Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(user, 'approved')}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(user, 'rejected')}>Reject</Button>
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
        </div>

        <div className="lg:col-span-1">
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
        </div>
      </div>
    </div>
  );
}
