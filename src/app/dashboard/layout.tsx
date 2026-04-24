
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { StudentSidebar } from '@/components/student-sidebar';
import { TeacherSidebar } from '@/components/teacher-sidebar';
import { ParentSidebar } from '@/components/parent-sidebar';
import { studentProfile, teacherProfile, parentProfile } from '@/lib/data';

type Role = 'student' | 'teacher' | 'admin' | 'parent';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = React.useState<Role>('student');

  React.useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/dashboard/student')) {
      setRole('student');
    } else if (pathname.startsWith('/dashboard/teacher')) {
      setRole('teacher');
    } else if (pathname.startsWith('/dashboard/admin')) {
      setRole('admin');
    } else if (pathname.startsWith('/dashboard/parent')) {
      setRole('parent');
    }
  }, [pathname]);

  if (role === 'admin') {
    return <>{children}</>;
  }
  
  const user = role === 'student' ? studentProfile : role === 'teacher' ? teacherProfile : parentProfile;

  const getSidebar = () => {
    switch (role) {
      case 'student':
        return <StudentSidebar />;
      case 'teacher':
        return <TeacherSidebar />;
      case 'parent':
        return <ParentSidebar />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      {getSidebar()}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
          </div>
          <UserNav user={user} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
