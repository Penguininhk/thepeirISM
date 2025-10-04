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

  const createAdminUserAndProfile = async () => {
    if (!auth || !firestore) return null;
    try {
      // First, create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const adminUser = userCredential.user;
      
      // IMPORTANT: Immediately create the user's profile document in Firestore.
      // The security rules rely on this document existing to grant permissions.
      await setDoc(doc(firestore, "users", adminUser.uid), {
        id: adminUser.uid,
        firstName: 'Admin',
        lastName: 'User',
        email: adminUser.email,
        role: 'admin',
        status: 'approved',
      });
      
      console.log('Admin user and profile created successfully.');
      return userCredential;
    } catch (creationError) {
      console.error("Fatal: Admin user creation failed:", creationError);
      // This is a critical failure, as the app can't function without the admin.
      setError('A critical error occurred while setting up the admin account. Please refresh and try again.');
      return null;
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;

    try {
      // Attempt to sign in first.
      await signInWithEmailAndPassword(auth, email, password);
      // If successful, the useEffect will handle redirection.
    } catch (err) {
      if (err instanceof FirebaseError) {
        // If sign-in fails because the user doesn't exist, create the user and their profile.
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          console.log('Admin user not found, attempting to create...');
          const newUser = await createAdminUserAndProfile();
          if (newUser) {
            // After creation, the onAuthStateChanged listener will pick up the new user,
            // and the useEffect below will redirect.
          } else {
             // The createAdminUserAndProfile function sets its own specific error message.
          }
        } else if (err.code === 'auth/wrong-password') {
           setError("Invalid admin credentials.");
        } else {
          console.error("Admin login error:", err);
          setError(err.message);
        }
      } else {
        console.error("Unexpected admin login error:", err);
        setError('An unexpected error occurred.');
      }
    }
  };

  useEffect(() => {
    // Redirect if the user is loaded and is the admin
    if (!isUserLoading && user && user.email === 'admin@school.edu') {
      router.push('/dashboard/admin');
    }
  }, [user, isUserLoading, router]);


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
