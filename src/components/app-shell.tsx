"use client"
import React from "react"
import { usePathname } from "next/navigation"
import { SidebarLayout } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideOn = ["/login", "/signup", "/auth"]
  const shouldHideChrome = hideOn.some((p) => pathname?.startsWith(p))

  if (shouldHideChrome) {
    return <>{children}</>
  }

  return (
    <SidebarLayout>
      <DashboardHeader />
      {children}
    </SidebarLayout>
  )
}


