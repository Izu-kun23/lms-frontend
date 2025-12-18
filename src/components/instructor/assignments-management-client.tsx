"use client"

import { Plus, FileText, CalendarClock, BookOpen, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AssignmentWithCourse } from "@/types/assignment"
import Link from "next/link"

const DUE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

const UPDATED_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

interface AssignmentsManagementClientProps {
  assignments: AssignmentWithCourse[]
}

export function AssignmentsManagementClient({
  assignments,
}: AssignmentsManagementClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage course assignments
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/assignments/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Link>
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assignments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => {
            const dueDate = assignment.dueAt ? new Date(assignment.dueAt) : null
            const isPastDue = dueDate ? dueDate.getTime() < Date.now() : false
            const formattedDueDate = dueDate ? DUE_DATE_FORMATTER.format(dueDate) : "No deadline"
            const lastUpdated = assignment.updatedAt
              ? UPDATED_DATE_FORMATTER.format(new Date(assignment.updatedAt))
              : "—"

            return (
              <Card key={assignment.id} className="h-full">
                <CardHeader className="pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      {assignment.course && (
                        <CardDescription className="flex items-center gap-2 mt-2 text-sm">
                          <BookOpen className="h-4 w-4" />
                          <span>
                            {assignment.course.title}
                            {assignment.course.code ? ` • ${assignment.course.code}` : ""}
                          </span>
                        </CardDescription>
                      )}
                    </div>
                    {dueDate ? (
                      <Badge variant={isPastDue ? "destructive" : "secondary"}>
                        {isPastDue ? "Past due" : "Due soon"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">No deadline</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-4">
                  {assignment.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {assignment.description}
                    </p>
                  )}

                  <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarClock className="h-4 w-4" />
                      <span>{formattedDueDate}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-between border-t pt-4">
                  <div className="text-xs text-muted-foreground">
                    Updated <span className="font-medium text-foreground">{lastUpdated}</span>
                  </div>
                  <Button variant="outline" asChild className="group rounded-full">
                    <Link href={`/instructor/assignments/${assignment.id}`}>
                      Manage
                      <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

