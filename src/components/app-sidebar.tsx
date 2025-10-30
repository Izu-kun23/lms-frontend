"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  MessagesSquare,
  ListChecks,
  FileText,
  User,
  Shield,
} from "lucide-react"

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "My Courses", icon: BookOpen },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/courses/1/threads", label: "Discussions", icon: MessagesSquare },
  { href: "/courses/1/quizzes", label: "Quizzes", icon: ListChecks },
  { href: "/assignments/1", label: "Assignments", icon: FileText },
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/security", label: "Security", icon: Shield },
]

type SidebarContextValue = { collapsed: boolean; setCollapsed: (v: boolean) => void }
const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarLayout")
  return ctx
}

export function AppSidebar() {
  const pathname = usePathname()
  const { collapsed } = useSidebar()

  return (
    <aside className={`hidden lg:flex lg:flex-col lg:min-h-svh lg:border-r transition-[width] duration-200 ${collapsed ? "w-16" : "w-64"}`}>
      <div className="px-4 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted font-semibold">G</span>
          <span className={`font-bebas text-3xl leading-none tracking-wide ${collapsed ? "hidden" : "block"}`}>GLACQ</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 pb-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm " +
                (isActive
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-muted")
              }
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={collapsed ? "hidden" : "block"}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className={`px-4 py-4 text-xs text-muted-foreground ${collapsed ? "hidden" : "block"}`}>
        © {new Date().getFullYear()} GLACQ
      </div>
    </aside>
  )
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(true)
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 min-h-svh">{children}</div>
      </div>
    </SidebarContext.Provider>
  )
}

