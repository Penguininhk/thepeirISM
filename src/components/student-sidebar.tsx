'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, CalendarCheck, LayoutDashboard, ListPlus, Megaphone, FileText, Calendar, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import AppLogo from "./app-logo";

export function StudentSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/student/announcements", label: "Announcements", icon: Megaphone },
    { href: "/dashboard/student/classwork", label: "Classwork", icon: BookOpenCheck },
    { href: "/dashboard/student/reports", label: "Report Cards", icon: FileText },
    { href: "/dashboard/student/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/dashboard/student/schedule", label: "My Schedule", icon: Calendar },
    { href: "/dashboard/student/courses", label: "Course Selection", icon: ListPlus },
    { href: "/dashboard/forums", label: "Forums", icon: MessageSquare },
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
                  isActive={item.href === '/dashboard/student' ? pathname === item.href : pathname.startsWith(item.href)}
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
      <SidebarFooter className="p-0 overflow-hidden h-20">
        <svg className="waves-svg h-full w-full" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="waves">
            <use href="#gentle-wave" x="48" y="0" fill="hsl(var(--sidebar-accent) / 0.7)" />
            <use href="#gentle-wave" x="48" y="3" fill="hsl(var(--sidebar-accent) / 0.5)" />
            <use href="#gentle-wave" x="48" y="5" fill="hsl(var(--sidebar-accent) / 0.3)" />
            <use href="#gentle-wave" x="48" y="7" fill="hsl(var(--sidebar-background))" />
          </g>
        </svg>
      </SidebarFooter>
    </Sidebar>
  );
}
