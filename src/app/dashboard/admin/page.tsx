'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
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
import { UserProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updateUserStatus, UpdateUserStatusInput } from '@/ai/flows/update-user-status-flow';
import { PlusCircle } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

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

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading, error } = useCollection<UserProfile>(usersQuery);

  const handleUpdateStatus = async (user: UserProfile, newStatus: 'approved' | 'rejected') => {
    if (!firestore) return;

    try {
      const userRef = doc(firestore, 'users', user.id);
      await updateDoc(userRef, { status: newStatus });
      
      const flowInput: UpdateUserStatusInput = {
        userId: user.id,
        status: newStatus,
        email: user.email,
      };

      await updateUserStatus(flowInput);
      
      toast({
        title: 'User Status Updated',
        description: `User ${user.firstName} ${user.lastName} has been ${newStatus}.`,
      });
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
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: "approved",
        classIds: [],
      });
      
      toast({
        title: "User Created",
        description: `Account for ${newUser.firstName} ${newUser.lastName} has been created and approved.`,
      });
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  const pendingUsers = users?.filter(u => u.status === 'pending') || [];
  const otherUsers = users?.filter(u => u.status !== 'pending') || [];

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
  );

    