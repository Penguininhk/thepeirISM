'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { StudentSidebar } from '@/components/student-sidebar';
import { TeacherSidebar } from '@/components/teacher-sidebar';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const isStudentPage = pathname.startsWith('/dashboard/student');
  const isTeacherPage = pathname.startsWith('/dashboard/teacher');

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user auth state is determined
    }

    if (!user) {
      router.push('/'); // Not logged in, redirect to home
      return;
    }

    if (!profile) {
      // Profile is still loading or not found, show loading
      // This state is brief, but prevents flicker
      return;
    }
    
    // Check account status
    if (profile.status === 'pending') {
      toast({
        title: 'Account Pending',
        description: 'Your account is awaiting administrator approval.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }
    
    if (profile.status === 'rejected') {
      toast({
        title: 'Account Rejected',
        description: 'Your account registration was not approved.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    // Check role-based access
    if (isStudentPage && profile.role !== 'student') {
       toast({ title: 'Access Denied', description: 'You are not authorized to view this page.', variant: 'destructive'});
       router.push('/login/teacher');
       return;
    }

    if (isTeacherPage && profile.role !== 'teacher') {
       toast({ title: 'Access Denied', description: 'You are not authorized to view this page.', variant: 'destructive'});
       router.push('/login/student');
       return;
    }

  }, [user, profile, isUserLoading, router, pathname, isStudentPage, isTeacherPage, toast]);

  if (isUserLoading || !user || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {profile.role === 'student' ? <StudentSidebar /> : <TeacherSidebar />}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Header content like breadcrumbs or page title can go here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
