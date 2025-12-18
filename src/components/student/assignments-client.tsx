"use client"

import { useState } from "react"
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AssignmentWithCourse } from "@/types/assignment"
import Link from "next/link"

interface AssignmentsClientProps {
  assignments: AssignmentWithCourse[]
}

export function AssignmentsClient({ assignments }: AssignmentsClientProps) {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "submitted" | "graded"
  >("all")

  const filteredAssignments = assignments.filter((assignment) => {
    if (statusFilter === "all") return true
    // This would need to check submission status - simplified for now
    return true
  })

  const getStatusBadge = (assignment: AssignmentWithCourse) => {
    // Simplified - would need actual submission data
    return <Badge variant="outline">Pending</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">
          View and submit your course assignments
        </p>
      </div>

      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assignments found</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">
                        {assignment.title}
                      </h3>
                      {getStatusBadge(assignment)}
                    </div>
                    {assignment.course && (
                      <p className="text-sm text-muted-foreground">
                        {assignment.course.title}
                      </p>
                    )}
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                    {assignment.dueAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Due: {new Date(assignment.dueAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button asChild>
                    <Link href={`/student/assignments/${assignment.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

