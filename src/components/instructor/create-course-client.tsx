"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CreateCourseClientProps {
  schoolId: string
}

export function CreateCourseClient({ schoolId }: CreateCourseClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    summary: "",
    coverUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const course = await apiClient.post("/courses", {
        ...formData,
        schoolId,
        coverUrl: formData.coverUrl || undefined,
      })

      toast.success("Course created successfully!")
      router.push(`/instructor/courses/${course.id}`)
    } catch (err: any) {
      console.error("Failed to create course:", err)
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create course. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/instructor/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Fill in the details to create a new course
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">
                  Course Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Introduction to Computer Science"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="rounded-full"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="code">
                  Course Code <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="code"
                  type="text"
                  placeholder="e.g., CS101"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  required
                  className="rounded-full"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="summary">
                  Course Summary <span className="text-destructive">*</span>
                </FieldLabel>
                <textarea
                  id="summary"
                  rows={4}
                  placeholder="A brief description of the course..."
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  required
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="coverUrl">Cover Image URL (Optional)</FieldLabel>
                <Input
                  id="coverUrl"
                  type="url"
                  placeholder="https://example.com/course-cover.jpg"
                  value={formData.coverUrl}
                  onChange={(e) => handleInputChange("coverUrl", e.target.value)}
                  className="rounded-full"
                />
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
                  "Create Course"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="rounded-full"
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

