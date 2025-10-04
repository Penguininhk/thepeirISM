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
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait for the user status to be determined
    }

    if (!user) {
      // If no user is logged in, redirect to the admin login page
      router.push('/login/admin');
      return;
    }

    // Check if the logged-in user is the admin.
    // The UID 'V5h753v5w5d8Y3Z1U5g8x5Yv4P92' is for admin@school.edu.
    if (user.uid !== 'V5h753v5w5d8Y3Z1U5g8x5Yv4P92') {
      // If the user is not the admin, sign them out and redirect
      if (auth) {
        signOut(auth);
      }
      router.push('/login/admin');
    }
  }, [user, isUserLoading, router, auth]);

  if (isUserLoading || !user || user.uid !== 'V5h753v5w5d8Y3Z1U5g8x5Yv4P92') {
    // While loading or if not the correct admin user, show a loading state
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
