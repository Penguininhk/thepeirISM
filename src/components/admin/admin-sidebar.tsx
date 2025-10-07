'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Megaphone, BookOpen, Shield, FileText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import AppLogo from "../app-logo";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/admin/reports", label: "Report Cards", icon: FileText },
    { href: "/dashboard/admin/logs", label: "Action Logs", icon: Shield },
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
            <p className="text-xs text-sidebar-foreground">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={item.href === '/dashboard/admin' ? pathname === item.href : pathname.startsWith(item.href)}
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
