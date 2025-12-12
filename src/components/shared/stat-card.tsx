"use client"

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  growth?: number
  variant?: "orange" | "blue" | "purple" | "green" | "teal"
  className?: string
}

const variantStyles = {
  orange: {
    card: "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10",
    label: "text-orange-700 dark:text-orange-300",
    value: "text-orange-900 dark:text-orange-100",
    iconBg: "bg-orange-500",
    badge: "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
  },
  blue: {
    card: "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
    label: "text-blue-700 dark:text-blue-300",
    value: "text-blue-900 dark:text-blue-100",
    iconBg: "bg-blue-500",
    badge: "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
  },
  purple: {
    card: "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10",
    label: "text-purple-700 dark:text-purple-300",
    value: "text-purple-900 dark:text-purple-100",
    iconBg: "bg-purple-500",
    badge: "border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  },
  green: {
    card: "border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
    label: "text-green-700 dark:text-green-300",
    value: "text-green-900 dark:text-green-100",
    iconBg: "bg-green-500",
    badge: "border-green-300 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300",
  },
  teal: {
    card: "border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/20 dark:to-teal-900/10",
    label: "text-teal-700 dark:text-teal-300",
    value: "text-teal-900 dark:text-teal-100",
    iconBg: "bg-teal-500",
    badge: "border-teal-300 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300",
  },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  growth,
  variant = "orange",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant]
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value

  return (
    <Card className={cn("rounded-2xl p-6", styles.card, className)}>
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className={cn("text-xs font-medium", styles.label)}>{label}</p>
            <p className={cn("text-xl font-bold", styles.value)}>
              {formattedValue}
            </p>
          </div>
          <div className={cn("rounded-full p-2 shrink-0", styles.iconBg)}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        {growth !== undefined && (
          <Badge variant="outline" className={cn("w-fit text-xs rounded-full", styles.badge)}>
            {growth >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {growth >= 0 ? "+" : ""}
            {growth}%
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

