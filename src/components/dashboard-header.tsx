"use client"
import { SearchBar } from "@/components/ui/search"
import { Avatar } from "@/components/ui/avatar"
import { Mail } from "lucide-react"
import { PanelLeft } from "lucide-react"
import { useSidebar } from "@/components/app-sidebar"
import React from "react"

export function DashboardHeader() {
  const { collapsed, setCollapsed } = useSidebar()
  const [menuOpen, setMenuOpen] = React.useState(false)
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
      <div className="flex items-center gap-3 px-6 py-3">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 max-w-xl">
          <SearchBar placeholder="Search courses, lectures, threads..." />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <a href="/notifications" className="relative rounded-md p-2 hover:bg-muted" aria-label="Open messages">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </a>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-md p-1 hover:bg-muted"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar fallback="IU" />
            </button>
            {menuOpen ? (
              <div role="menu" className="absolute right-0 mt-2 w-40 rounded-md border bg-background p-1 shadow-sm">
                <a
                  role="menuitem"
                  href="/login"
                  className="block rounded-sm px-3 py-2 text-sm hover:bg-muted"
                >
                  Logout
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}


