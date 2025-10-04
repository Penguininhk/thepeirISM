'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLogo from "@/components/app-logo";
import { useAuth, useUser } from "@/firebase";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function TeacherLoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState("e.reed@school.edu");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth || !firestore) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.status === 'pending') {
          setError("Your account is pending approval.");
          await auth.signOut();
        } else if (userData.status === 'rejected') {
           setError("Your account has been rejected.");
          await auth.signOut();
        } else if (userData.role !== 'teacher') {
          setError("You are not authorized to log in as a teacher.");
          await auth.signOut();
        }
        // Approved teachers will be redirected by the useEffect
      } else {
        setError("No user profile found for this account.");
        await auth.signOut();
      }

    } catch (err) {
      if (err instanceof FirebaseError) {
         if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
          setError("Invalid email or password. Please try again or sign up.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };
  
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard/teacher');
    }
  }, [user, isUserLoading, router]);

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
          <CardTitle className="text-2xl font-headline">Teacher Login</CardTitle>
          <CardDescription>Enter your credentials to access the faculty portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              {error && <div className="rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-500">{error}</div>}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.reed@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup/teacher" className="underline">
              Sign up
            </Link>
          </div>
          <div className="mt-2 text-center text-sm">
            Not a teacher?{" "}
            <Link href="/login/student" className="underline">
              Login as a student
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
