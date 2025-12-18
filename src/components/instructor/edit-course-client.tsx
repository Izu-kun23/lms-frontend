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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface EditCourseClientProps {
  course: Course
}

export function EditCourseClient({ course }: EditCourseClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: course.title,
    summary: course.summary,
    coverUrl: course.coverUrl || "",
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)
    setError("")

    try {
      // API only accepts: title, summary, coverUrl
      const payload: {
        title?: string
        summary?: string
        coverUrl?: string
      } = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
      }

      // Only include coverUrl if it's provided
      if (formData.coverUrl.trim()) {
        payload.coverUrl = formData.coverUrl.trim()
      }

      if (!payload.title || !payload.summary) {
        toast.error("Title and summary are required")
        setIsSubmitting(false)
        return
      }

      await apiClient.updateCourse(course.id, payload)

      toast.success("Course updated successfully")
      router.push(`/instructor/courses/${course.id}`)
      router.refresh()
    } catch (err: any) {
      console.error("Failed to update course:", err)
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update course. Please try again."
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/instructor/courses/${course.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground">
            Update course information and details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>
            Update the course title, summary, and cover image. Note: Course code cannot be changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) => handleInputChange("title", event.target.value)}
                  placeholder="e.g., Introduction to Computer Science"
                  required
                  className="rounded-full"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="code">
                  Course Code (Read-only)
                </FieldLabel>
                <Input
                  id="code"
                  value={course.code}
                  disabled
                  className="rounded-full bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Course code cannot be changed after creation.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="summary">
                  Summary <span className="text-destructive">*</span>
                </FieldLabel>
                <textarea
                  id="summary"
                  rows={6}
                  value={formData.summary}
                  onChange={(event) => handleInputChange("summary", event.target.value)}
                  placeholder="A comprehensive introduction to computer science fundamentals..."
                  required
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a brief description of the course content and objectives.
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="coverUrl">Cover Image URL</FieldLabel>
                <Input
                  id="coverUrl"
                  type="url"
                  value={formData.coverUrl}
                  onChange={(event) => handleInputChange("coverUrl", event.target.value)}
                  placeholder="https://example.com/course-cover.jpg"
                  className="rounded-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: URL to the course cover image.
                </p>
                {formData.coverUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-input">
                      <img
                        src={formData.coverUrl}
                        alt="Course cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                )}
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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
