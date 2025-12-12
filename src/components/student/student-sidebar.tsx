"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  FileText,
  HelpCircle,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/student/progress", label: "Progress", icon: TrendingUp },
  { href: "/student/assignments", label: "Assignments", icon: FileText },
  { href: "/student/quizzes", label: "Quizzes", icon: HelpCircle },
  { href: "/student/profile", label: "Profile", icon: User },
]

interface StudentSidebarProps {
  role?: string
}

export function StudentSidebar({ role = "Student" }: StudentSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo and Role */}
      <div className="p-6">
        <Link href="/student/dashboard" className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-12 -mt-4 mb-1">
            <Image
              src="/logos/pc_logo.png"
              alt="ProjectCareer Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase tracking-wide">
            {role}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 rounded-full border border-orange-200 dark:border-orange-800"
                  : "text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground rounded-full"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

