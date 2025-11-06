"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  className?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: "blue" | "green" | "purple" | "orange" | "pink"
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  className, 
  trend,
  gradient = "blue"
}: StatsCardProps) {
  const gradientClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-500",
    pink: "from-pink-500 to-rose-500",
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all duration-300 dark:bg-gray-800",
        className
      )}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute right-0 top-0 h-32 w-32 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20",
        `bg-linear-to-br ${gradientClasses[gradient]}`
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                  trend.isPositive 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "ml-4 flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110",
            `bg-linear-to-br ${gradientClasses[gradient]}`
          )}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

