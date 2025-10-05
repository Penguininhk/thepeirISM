'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { StudentSidebar } from '@/components/student-sidebar';
import { TeacherSidebar } from '@/components/teacher-sidebar';
import { studentProfile, teacherProfile } from '@/lib/data';
import { StudyBuddyBubble } from '@/components/study-buddy-bubble';

type Role = 'student' | 'teacher' | 'admin';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = React.useState<Role>('student');

  React.useEffect(() => {
    if (pathname.startsWith('/dashboard/student')) {
      setRole('student');
    } else if (pathname.startsWith('/dashboard/teacher')) {
      setRole('teacher');
    } else if (pathname.startsWith('/dashboard/admin')) {
      setRole('admin');
    }
    // If it's a shared page like /dashboard/forums, the role will persist from the last page.
  }, [pathname]);

  if (role === 'admin') {
    return <>{children}</>
  }
  
  const user = role === 'student' ? studentProfile : teacherProfile;

  return (
    <SidebarProvider>
      {role === 'student' ? <StudentSidebar /> : <TeacherSidebar />}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Header content like breadcrumbs or page title can go here */}
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        {role === 'student' && <StudyBuddyBubble />}
      </SidebarInset>
    </SidebarProvider>
  );
}
