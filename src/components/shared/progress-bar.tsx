"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  showLabel?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  className,
  size = "md",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }[size]

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <Progress value={percentage} className={heightClass} />
    </div>
  )
}

