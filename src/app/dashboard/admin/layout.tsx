'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuth();
  const { user, profile, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait for the user status to be determined
    }

    if (!user) {
      // If no user is logged in, redirect to the admin login page
      router.push('/login/admin');
      return;
    }
    
    // This is the primary admin user, allow access even if profile is loading or lacks role initially.
    // This breaks the chicken-and-egg problem of needing admin role to get the admin role.
    if (user.email === 'admin@school.edu') {
      return;
    }

    // For any other user, check if they are an admin by role
    if (profile?.role !== 'admin') {
       // If the user is not an admin, sign them out and redirect
       if (auth) {
        signOut(auth);
      }
      router.push('/login/admin');
    }

  }, [user, profile, isUserLoading, router, auth]);

  if (isUserLoading || !user || (user.email !== 'admin@school.edu' && profile?.role !== 'admin')) {
    // While loading or if not an authorized admin, show a loading state
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted/40">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  // A simple layout for the admin section without the main sidebar or user nav
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
