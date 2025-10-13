
'use client';

import * as React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

// Mock admin user for UserNav
const adminUser = {
  id: 'usr-admin-001',
  name: 'Admin User',
  email: 'admin@theharbourschool.edu.hk',
  role: 'admin' as const,
  avatarUrl: '',
  status: 'approved' as const,
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Header content like breadcrumbs or page title can go here */}
          </div>
          <UserNav user={adminUser} />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
