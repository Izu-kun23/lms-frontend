"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CourseSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CourseSearch({
  value,
  onChange,
  placeholder = "Search courses...",
  className,
}: CourseSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

