'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLogo from '@/components/app-logo';
import { ShieldCheck } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


export default function AdminLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const createAdminUser = async () => {
    if (!auth || !firestore) return null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const adminUser = userCredential.user;
      
      // Create a profile for the admin user in Firestore.
      await setDoc(doc(firestore, "users", adminUser.uid), {
        id: adminUser.uid,
        firstName: 'Admin',
        lastName: 'User',
        email: adminUser.email,
        role: 'admin',
        status: 'approved',
      });
      
      return userCredential;
    } catch (creationError) {
      // If creation fails (e.g. email already exists from a failed previous attempt),
      // it's okay, we'll just try to sign in.
      console.error("Admin user creation might have failed or user already exists:", creationError);
      return null;
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle redirection on successful login
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/user-not-found') {
          // If the admin user does not exist, create it.
          const newUser = await createAdminUser();
          if (newUser) {
            // New user created, sign-in is implicit, useEffect will redirect.
          } else {
             setError("Could not create or sign in as admin.");
          }
        } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          setError("Invalid admin credentials.");
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  useEffect(() => {
    if (!isUserLoading && user) {
       // A simple check to see if the logged-in user is the admin
      if (user.email === 'admin@school.edu') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, isUserLoading, router, auth]);


  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AppLogo className="h-12 w-12" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
            <ShieldCheck /> Admin Login
          </CardTitle>
          <CardDescription>Enter the administrator credentials to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin}>
            <div className="grid gap-4">
              {error && (
                <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
               <div className="grid gap-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
