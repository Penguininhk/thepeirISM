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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function AdminLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle redirection
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
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
      } else {
        // If a non-admin user somehow lands here and logs in,
        // redirect them away. This is a fallback.
        setError("You are not authorized for admin access.");
        auth?.signOut();
      }
    }
  }, [user, isUserLoading, router, auth]);


  if (isUserLoading || user) {
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
