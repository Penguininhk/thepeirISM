'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { createUser } from '@/app/actions/admin'; // Calling the server action

export default function CreateUserDialog() {
  const { toast } = useToast();
  
  const [isCreateUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'password123',
    role: 'student' as 'student' | 'teacher' | 'admin',
  });
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
   
    try {
        // Calling a server action is like calling an async function
        await createUser(newUser);
      
        toast({
            title: "User Created",
            description: `Account for ${newUser.firstName} ${newUser.lastName} has been created.`,
        });

        setCreateUserOpen(false);
        setNewUser({ firstName: '', lastName: '', email: '', password: 'password123', role: 'student' });
        // The page will revalidate automatically via the revalidatePath in the server action
    } catch (err) {
       toast({ 
         variant: "destructive", 
         title: "Creation Failed", 
         description: (err as Error).message || "An unexpected error occurred." 
       });
    }
  };

  return (
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
              <Select value={newUser.role} onValueChange={(value: 'student' | 'teacher' | 'admin') => setNewUser({...newUser, role: value})}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
  );
}
