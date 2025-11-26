

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, LayoutDashboard, Megaphone, MessageSquare, Coffee, FileText, Settings, FileSignature, Sparkles } from "lucide-react";
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
import { HkoClock } from "./hko-clock";
import { Separator } from "./ui/separator";

export function TeacherSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/teacher/classwork", label: "Classwork", icon: BookMarked },
    { href: "/dashboard/teacher/reports", label: "Report Cards", icon: FileText },
    { href: "/dashboard/teacher/announcements", label: "Announcements", icon: Megaphone },
    { href: "/dashboard/sea", label: "Extension Activities", icon: Sparkles },
    { href: "/dashboard/forums", label: "Forums", icon: MessageSquare },
    { href: "/dashboard/teacher/lounge", label: "Faculty Lounge", icon: Coffee },
    { href: "/dashboard/forms", label: "Forms", icon: FileSignature },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
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
            <p className="text-xs text-sidebar-foreground">Teacher Portal</p>          </div>
        </div>
        <Separator className="my-2 bg-sidebar-border" />
        <div className="px-2">
          <HkoClock />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={item.href === '/dashboard/teacher' ? pathname === item.href : pathname.startsWith(item.href)}
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
          </g>
        </svg>
      </SidebarFooter>
    </Sidebar>
  );
}

    