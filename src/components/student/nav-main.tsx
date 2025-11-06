"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function StudentNavMain({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    isActive?: boolean
  }[]
  className?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-5">
        <SidebarMenu className="gap-3">
          {items.map((item) => {
            const isActive = item.isActive ?? (pathname === item.url || pathname?.startsWith(item.url + "/"))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

