"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Course } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreateAssignmentClientProps {
  courses: Course[]
}

export function CreateAssignmentClient({ courses }: CreateAssignmentClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    courseId: courses[0]?.id ?? "",
    title: "",
    description: "",
    dueAt: "",
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.courseId) {
      toast.error("Select a course for this assignment")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // API only accepts: title, description, dueAt (maxScore not supported in create)
      const payload: {
        title: string
        description: string
        dueAt?: string
      } = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      }

      if (formData.dueAt) {
        const dueAtIso = new Date(formData.dueAt).toISOString()
        payload.dueAt = dueAtIso
      }

      await apiClient.createAssignment(formData.courseId, payload)

      toast.success("Assignment created successfully")
      router.push("/instructor/assignments")
    } catch (err: any) {
      console.error("Failed to create assignment:", err)
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create assignment. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/instructor/assignments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Assignment</h1>
            <p className="text-muted-foreground">
              You need at least one course before creating assignments.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No courses available. Create a course first to add assignments.</p>
            <Button className="mt-6" asChild>
              <Link href="/instructor/courses/new">Create a Course</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/instructor/assignments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Assignment</h1>
          <p className="text-muted-foreground">
            Provide the assignment details and assign it to a course.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="course">
                  Course <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => handleInputChange("courseId", value)}
                >
                  <SelectTrigger className="w-full rounded-full">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) => handleInputChange("title", event.target.value)}
                  placeholder="e.g., Programming Assignment 1"
                  required
                  className="rounded-full"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </FieldLabel>
                <textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={(event) => handleInputChange("description", event.target.value)}
                  placeholder="Outline the assignment requirements..."
                  required
                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include instructions, submission expectations, and grading criteria.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="dueAt">Due Date</FieldLabel>
                <Input
                  id="dueAt"
                  type="datetime-local"
                  value={formData.dueAt}
                  onChange={(event) => handleInputChange("dueAt", event.target.value)}
                  className="rounded-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if there is no deadline.
                </p>
              </Field>
            </FieldGroup>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Assignment"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="rounded-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
