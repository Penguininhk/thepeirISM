'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useFirestore, useAuth } from '@/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc,
  query, 
  orderBy, 
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';


type ActionLogWithDate = Omit<ActionLog, 'timestamp'> & { timestamp: Date };

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  
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
  
  const [actionLogs, setActionLogs] = useState<ActionLogWithDate[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!firestore) return;
    setIsLoadingUsers(true);
    setIsLoadingLogs(true);
    setUsersError(null);
    setLogsError(null);

    try {
      const usersCol = collection(firestore, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({ ...(doc.data() as UserProfile), id: doc.id }));
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
    
    try {
      const logsCol = collection(firestore, 'actionLogs');
      const logsQuery = query(logsCol, orderBy('timestamp', 'desc'), limit(10));
      const logsSnapshot = await getDocs(logsQuery);
      const logsList = logsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore timestamps need to be converted to JS Dates
        return {
          ...data,
          id: doc.id,
          timestamp: (data.timestamp as Timestamp).toDate(),
        } as ActionLogWithDate;
      });
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

  useEffect(() => {
    fetchData();
  }, [firestore]);
  
  const logAction = async (details: string, actionType: 'user_status_update' | 'user_created') => {
    if (!firestore) return;
    try {
        await addDoc(collection(firestore, "actionLogs"), {
            timestamp: new Date(),
            adminId: auth?.currentUser?.email || 'admin',
            actionType,
            details,
        });
    } catch (error) {
        console.error("Failed to log action:", error);
        toast({
            variant: "destructive",
            title: "Logging Failed",
            description: "Could not save the action to the log."
        });
    }
  };


  const handleUpdateStatus = async (user: UserProfile, newStatus: 'approved' | 'rejected') => {
    if (!firestore) return;
    const originalUsers = users;
    setUsers(users.map(u => u.id === user.id ? {...u, status: newStatus} : u));

    try {
      const userRef = doc(firestore, 'users', user.id);
      await updateDoc(userRef, { status: newStatus });
      
      // In a real app with server-side logic, you would set custom claims here.
      // This client-side code can't set claims. We'll log the action.
      await logAction(`User '${user.email}' status updated to '${newStatus}'.`, 'user_status_update');

      toast({
        title: 'User Status Updated',
        description: `User ${user.firstName} ${user.lastName} has been ${newStatus}.`,
      });
      
      fetchData(); // Refresh data

    } catch (e) {
      setUsers(originalUsers);
      console.error('Failed to update user status:', e);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: (e as Error).message || 'Could not update the user status.',
      });
    }
  };


  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
      toast({ variant: "destructive", title: "Auth not ready", description: "Firebase is not available."});
      return;
    }

    try {
       // This approach creates the user on the client, which requires email/password auth to be enabled.
       // For security, this is typically done on a backend, but we'll do it here for simplicity.
       // NOTE: This will sign the admin out and sign the new user in. This is a known limitation of using client-side SDK for this.
       // A proper implementation would use a server-side function to create the user without affecting admin's session.
       // However, since the goal is to get the app working, we accept this limitation.
        
        // This is a placeholder for a more secure backend function.
        // We're creating a dummy user object for the UI for now.
        const mockNewUserId = `new-user-${Date.now()}`;
        const newUserProfile: UserProfile = {
            id: mockNewUserId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            status: 'approved',
            classIds: [],
        };
       
        await setDoc(doc(firestore, "users", mockNewUserId), newUserProfile);
        await logAction(`New user '${newUser.email}' created with role '${newUser.role}'.`, 'user_created');
      
      toast({
        title: "User Created (Simulated)",
        description: `Account for ${newUser.firstName} ${newUser.lastName} has been added.`,
      });

      setUsers([...users, newUserProfile]);
      fetchData();

      setCreateUserOpen(false);
      setNewUser({ firstName: '', lastName: '', email: '', password: 'password123', role: 'student' });

    } catch (err) {
       toast({ 
         variant: "destructive", 
         title: "Creation Failed", 
         description: (err as Error).message || "An unexpected error occurred." 
       });
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
                {/* 
                  Password field is removed from UI for simulation. 
                  In a real app, you would have a secure way to set an initial password.
                */}
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
                            {log.timestamp ? `${formatDistanceToNow(log.timestamp)} ago` : 'just now'} by {log.adminId}
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

    