import * as React from "react"
import { Input } from "@/components/ui/input"

type SearchBarProps = React.ComponentProps<typeof Input>

export function SearchBar({ className = "", ...props }: SearchBarProps) {
  return (
    <div className="relative">
      <Input className={"pl-9 " + className} {...props} />
      <svg
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    </div>
  )
}


