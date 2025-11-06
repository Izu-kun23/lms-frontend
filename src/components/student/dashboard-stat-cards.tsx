"use client"

import React from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardStatCardProps {
  title: string
  value: string | number
  detail: string
  icon: React.ReactNode
  gradient: "blue" | "green" | "purple" | "orange"
}

export function DashboardStatCard({ title, value, detail, icon, gradient }: DashboardStatCardProps) {
  const gradientClasses = {
    blue: "from-blue-500/5 to-card dark:from-blue-500/10",
    green: "from-green-500/5 to-card dark:from-green-500/10",
    purple: "from-purple-500/5 to-card dark:from-purple-500/10",
    orange: "from-orange-500/5 to-card dark:from-orange-500/10",
  }

  const iconBgClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  }

  return (
    <Card className={cn("bg-linear-to-t shadow-xs", gradientClasses[gradient])} data-slot="card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{value}</CardTitle>
        <div className="mt-2">
          <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg text-white", iconBgClasses[gradient])}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">{detail}</div>
      </CardFooter>
    </Card>
  )
}

