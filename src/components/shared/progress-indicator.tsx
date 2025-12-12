"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type ProgressIndicatorProps = {
  value: number // 0-100
  variant?: "circular" | "linear"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressIndicator({
  value,
  variant = "linear",
  size = "md",
  showLabel = true,
  label,
  className,
}: ProgressIndicatorProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  if (variant === "circular") {
    const sizeClasses = {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
    }

    const strokeWidth = size === "sm" ? 4 : size === "md" ? 6 : 8
    const radius = size === "sm" ? 28 : size === "md" ? 40 : 56
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (clampedValue / 100) * circumference

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
          className={cn("transform -rotate-90", sizeClasses[size])}
          viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-neutral-200 dark:text-neutral-800"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-orange-500 dark:text-orange-600 transition-all duration-500"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {Math.round(clampedValue)}%
              </p>
              {label && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Linear variant
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-600 dark:text-neutral-400">
            {label || "Progress"}
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}
      <Progress value={clampedValue} className={cn(heightClasses[size])} />
    </div>
  )
}

