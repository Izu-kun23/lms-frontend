"use client"

import { Calendar, Clock, FileText, CheckCircle, XCircle, Award } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

type AssignmentCardProps = {
  id: string
  title: string
  courseName: string
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  score?: number
  maxScore?: number
  submittedAt?: string
  className?: string
}

export function AssignmentCard({
  id,
  title,
  courseName,
  dueDate,
  status,
  score,
  maxScore,
  submittedAt,
  className,
}: AssignmentCardProps) {
  const isOverdue = status === "overdue"
  const isGraded = status === "graded"
  const isSubmitted = status === "submitted"

  const statusConfig = {
    pending: {
      badge: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
      icon: Clock,
      label: "Pending",
      buttonText: "Submit Assignment",
      buttonVariant: "default" as const,
    },
    submitted: {
      badge: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
      icon: CheckCircle,
      label: "Submitted",
      buttonText: "View Submission",
      buttonVariant: "outline" as const,
    },
    graded: {
      badge: "bg-green-100 text-green-700 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
      icon: CheckCircle,
      label: "Graded",
      buttonText: "View Feedback",
      buttonVariant: "outline" as const,
    },
    overdue: {
      badge: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
      icon: XCircle,
      label: "Overdue",
      buttonText: "Submit Late",
      buttonVariant: "destructive" as const,
    },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card
      className={cn(
        "rounded-xl border transition-all duration-200",
        isOverdue
          ? "border-red-200 dark:border-red-900 hover:border-red-300 dark:hover:border-red-800"
          : "border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-orange-700",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              {title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{courseName}</p>
          </div>
          <Badge className={cn("text-xs", config.badge)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>
              Due: {new Date(dueDate).toLocaleDateString()}{" "}
              {new Date(dueDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {submittedAt && (
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
              <FileText className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
              <span>
                Submitted: {new Date(submittedAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {isGraded && score !== undefined && maxScore !== undefined && (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Award className="h-4 w-4 text-green-500" />
              <span className="text-green-700 dark:text-green-400">
                Score: {score}/{maxScore} ({Math.round((score / maxScore) * 100)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          asChild
          variant={config.buttonVariant}
          className={cn(
            "w-full",
            config.buttonVariant === "default" &&
              "bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
          )}
        >
          <Link href={`/student/assignments/${id}`}>{config.buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

