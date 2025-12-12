"use client"

import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { AssignmentWithCourse } from "@/types/assignment"
import Link from "next/link"

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
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    {assignment.course && (
                      <p className="text-sm text-muted-foreground">
                        {assignment.course.title}
                      </p>
                    )}
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/instructor/assignments/${assignment.id}`}>
                      Manage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

