'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, CalendarCheck, LayoutDashboard, ListPlus, Megaphone } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import AppLogo from "./app-logo";

export function StudentSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/student/announcements", label: "Announcements", icon: Megaphone },
    { href: "/dashboard/student/classwork", label: "Classwork", icon: BookOpenCheck },
    { href: "/dashboard/student/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/dashboard/student/courses", label: "Course Selection", icon: ListPlus },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <AppLogo className="h-8 w-8" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-sidebar-primary font-headline">
              The PIER
            </h2>
            <p className="text-xs text-sidebar-foreground">Student Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
