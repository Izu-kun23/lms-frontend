"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBook,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconHelp,
  IconMessageCircle,
  IconSettings,
  IconUser,
} from "@tabler/icons-react"

import { StudentNavMain } from "@/components/student/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: IconDashboard,
  },
  {
    title: "My Courses",
    url: "/student/courses",
    icon: IconBook,
  },
  {
    title: "Progress",
    url: "/student/progress",
    icon: IconChartBar,
  },
  {
    title: "Assignments",
    url: "/student/assignments",
    icon: IconFileText,
  },
  {
    title: "Messages",
    url: "/student/messages",
    icon: IconMessageCircle,
  },
]

const navSecondary = [
  {
    title: "Profile",
    url: "/student/profile",
    icon: IconUser,
  },
  {
    title: "Settings",
    url: "/student/settings",
    icon: IconSettings,
  },
  {
    title: "Get Help",
    url: "/student/help",
    icon: IconHelp,
  },
]

export function StudentAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const pathname = usePathname()

  // Update nav items to include active state
  const navItemsWithActive = navItems.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname?.startsWith(item.url + "/"),
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/student/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                  <span className="text-lg font-bold text-white">G</span>
                </div>
                <span className="text-base font-semibold">GLACQ LMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <StudentNavMain items={navItemsWithActive} />
        <div className="mt-auto">
          <StudentNavMain items={navSecondary} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              avatar: "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

