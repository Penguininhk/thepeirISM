
'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLogo from "@/components/app-logo";

export default function StudentLoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace('/dashboard/student');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AppLogo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@theharbourschool.edu.hk"
                  defaultValue="alice@theharbourschool.edu.hk"
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
                  defaultValue="password123"
                  required 
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Not a student?{" "}
            <Link href="/login/teacher" className="underline">
              Login as a teacher
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden -z-10">
        <svg
          className="waves-svg absolute bottom-0 left-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="waves">
            <use href="#gentle-wave" x="48" y="0" fill="hsl(var(--primary) / 0.1)" />
            <use href="#gentle-wave" x="48" y="3" fill="hsl(var(--primary) / 0.15)" />
            <use href="#gentle-wave" x="48" y="5" fill="hsl(var(--primary) / 0.05)" />
            <use href="#gentle-wave" x="48" y="7" fill="hsl(var(--primary) / 0.2)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
