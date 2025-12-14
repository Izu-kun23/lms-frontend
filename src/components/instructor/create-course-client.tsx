"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient } from "@/lib/api"
import type { User } from "@/lib/types"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface CreateCourseClientProps {
  schoolId: string
  userRole?: string
  userId?: string
}

export function CreateCourseClient({ schoolId, userRole, userId }: CreateCourseClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [instructors, setInstructors] = useState<User[]>([])
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(false)
  const isAdmin = userRole?.toUpperCase() === "ADMIN" || userRole?.toUpperCase() === "SUPER_ADMIN"
  
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    summary: "",
    coverUrl: "",
    instructorId: "",
  })

  // Fetch instructors if user is an admin
  useEffect(() => {
    if (isAdmin && schoolId) {
      setIsLoadingInstructors(true)
      apiClient.getAllUsers(schoolId)
        .then((users) => {
          // Filter to only instructors
          const instructorUsers = users.filter((user) => 
            user.role.toUpperCase() === "INSTRUCTOR"
          )
          setInstructors(instructorUsers)
        })
        .catch((err) => {
          console.error("Failed to fetch instructors:", err)
          toast.error("Failed to load instructors")
        })
        .finally(() => {
          setIsLoadingInstructors(false)
        })
    }
  }, [isAdmin, schoolId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const courseData: any = {
        title: formData.title,
        code: formData.code,
        summary: formData.summary,
        schoolId,
        coverUrl: formData.coverUrl || undefined,
      }

      // Only include instructorId if:
      // 1. User is admin and explicitly selected an instructor, OR
      // 2. User is instructor (backend will auto-assign them, but we can be explicit)
      // For admins: if no instructor selected, don't send instructorId (let backend handle it or leave empty)
      if (isAdmin && formData.instructorId) {
        courseData.instructorId = formData.instructorId
      } else if (!isAdmin && userId) {
        // For instructors, backend will auto-assign, but we can be explicit
        // Actually, let's not send it - let backend handle auto-assignment for instructors
      }

      const course = await apiClient.createCourse(courseData)

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

              {isAdmin && (
                <Field>
                  <FieldLabel htmlFor="instructorId">
                    Instructor {!isLoadingInstructors && instructors.length === 0 && "(No instructors available)"}
                  </FieldLabel>
                  {isLoadingInstructors ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading instructors...
                    </div>
                  ) : instructors.length > 0 ? (
                    <Select
                      value={formData.instructorId}
                      onValueChange={(value) => handleInputChange("instructorId", value)}
                    >
                      <SelectTrigger className="w-full rounded-full">
                        <SelectValue placeholder="Select an instructor (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Leave empty to assign later</SelectItem>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.firstName} {instructor.lastName} ({instructor.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No instructors available. Leave empty to assign later.
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAdmin 
                      ? "Select an instructor for this course. Leave empty if you want to assign one later."
                      : "Instructors are automatically assigned when they create courses."}
                  </p>
                </Field>
              )}
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

