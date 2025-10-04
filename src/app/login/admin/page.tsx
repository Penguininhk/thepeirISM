'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLogo from '@/components/app-logo';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      // In a real app, you'd use a secure session management system.
      // For this prototype, we'll use sessionStorage.
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      router.push('/dashboard/admin');
    } else {
      setError('Incorrect password.');
    }
  };

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
          <CardDescription>Enter the administrator password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin}>
            <div className="grid gap-4">
              {error && (
                <div className="rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}
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
