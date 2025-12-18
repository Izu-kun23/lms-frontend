"use client"

import { useState, type ComponentType, type SVGProps } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Trash2, CalendarClock, Users2, FileText } from "lucide-react"
import type { AssignmentWithCourse, SubmissionWithDetails } from "@/types/assignment"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface AssignmentDetailClientProps {
  assignment: AssignmentWithCourse
}

const DUE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

export function AssignmentDetailClient({ assignment }: AssignmentDetailClientProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState(() => ({
    title: assignment.title,
    description: assignment.description,
    dueAt: assignment.dueAt ? toLocalDateTimeInput(assignment.dueAt) : "",
    maxScore: assignment.maxScore?.toString() ?? "",
  }))

  const submissions = assignment.submissions ?? []
  const dueDateLabel = assignment.dueAt
    ? DUE_DATE_FORMATTER.format(new Date(assignment.dueAt))
    : "No deadline"
  const createdAtLabel = SHORT_DATE_FORMATTER.format(new Date(assignment.createdAt))
  const updatedAtLabel = SHORT_DATE_FORMATTER.format(new Date(assignment.updatedAt))

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSaving(true)
    try {
      const payload: {
        title?: string
        description?: string
        dueAt?: string
        maxScore?: number
      } = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      }

      if (!payload.title || !payload.description) {
        toast.error("Title and description are required")
        setIsSaving(false)
        return
      }

      if (formData.dueAt) {
        payload.dueAt = new Date(formData.dueAt).toISOString()
      }

      if (formData.maxScore) {
        const parsedScore = Number(formData.maxScore)
        if (!Number.isNaN(parsedScore)) {
          payload.maxScore = parsedScore
        }
      }

      await apiClient.updateAssignment(assignment.id, payload)
      toast.success("Assignment updated")
      router.refresh()
    } catch (error: any) {
      console.error("Failed to update assignment", error)
      const message = error?.response?.data?.message || error?.message || "Failed to update assignment"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment? This action cannot be undone."
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    try {
      await apiClient.deleteAssignment(assignment.id)
      toast.success("Assignment deleted")
      router.push("/instructor/assignments")
    } catch (error: any) {
      console.error("Failed to delete assignment", error)
      const message = error?.response?.data?.message || error?.message || "Failed to delete assignment"
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
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
          <p className="text-sm text-muted-foreground">Assignment Detail</p>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Update assignment</CardTitle>
            <CardDescription>Edit instructions, due date, and grading details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="assignment-title">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="assignment-title"
                    value={formData.title}
                    onChange={(event) => handleInputChange("title", event.target.value)}
                    required
                    className="rounded-full"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="assignment-description">
                    Description <span className="text-destructive">*</span>
                  </FieldLabel>
                  <textarea
                    id="assignment-description"
                    rows={6}
                    value={formData.description}
                    onChange={(event) => handleInputChange("description", event.target.value)}
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    required
                  />
                </Field>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="assignment-due">
                      Due date
                    </FieldLabel>
                    <Input
                      id="assignment-due"
                      type="datetime-local"
                      value={formData.dueAt}
                      onChange={(event) => handleInputChange("dueAt", event.target.value)}
                      className="rounded-full"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leave blank to remove the deadline.
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="assignment-max-score">Maximum score</FieldLabel>
                    <Input
                      id="assignment-max-score"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.maxScore}
                      onChange={(event) => handleInputChange("maxScore", event.target.value)}
                      className="rounded-full"
                      placeholder="e.g., 100"
                    />
                  </Field>
                </div>
              </FieldGroup>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-orange-500 hover:bg-orange-600"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete assignment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="order-1 space-y-6 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Key assignment metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Course</p>
                <p className="mt-1 text-base font-medium">
                  {assignment.course?.title || "Unassigned course"}
                </p>
                {assignment.course?.code && (
                  <p className="text-muted-foreground text-sm">{assignment.course.code}</p>
                )}
              </div>

              <div className="space-y-2">
                <InfoRow label="Current due date" value={dueDateLabel} icon={CalendarClock} />
                <InfoRow
                  label="Maximum score"
                  value={assignment.maxScore ? `${assignment.maxScore}` : "Not set"}
                  icon={FileText}
                />
                <InfoRow label="Created" value={createdAtLabel} />
                <InfoRow label="Last updated" value={updatedAtLabel} />
                <InfoRow
                  label="Submissions received"
                  value={`${submissions.length}`}
                  icon={Users2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>Latest student uploads and grades.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              ) : (
                submissions.slice(0, 5).map((submission) => (
                  <SubmissionRow key={submission.id} submission={submission} maxScore={assignment.maxScore} />
                ))
              )}
              {submissions.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  Showing {Math.min(5, submissions.length)} of {submissions.length} submissions.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function toLocalDateTimeInput(value: string) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

interface InfoRowProps {
  label: string
  value: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

function InfoRow({ label, value, icon: Icon }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
      {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
    </div>
  )
}

interface SubmissionRowProps {
  submission: SubmissionWithDetails
  maxScore?: number
}

const SUBMISSION_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

function SubmissionRow({ submission, maxScore }: SubmissionRowProps) {
  const studentName = [submission.user?.firstName, submission.user?.lastName]
    .filter(Boolean)
    .join(" ")
  const identifier = studentName || submission.user?.email || submission.userId || "Student"
  const submittedAt = submission.submittedAt
    ? SUBMISSION_DATE_FORMATTER.format(new Date(submission.submittedAt))
    : "—"
  const gradeLabel =
    submission.grade !== undefined && submission.grade !== null
      ? `${submission.grade}${maxScore ? ` / ${maxScore}` : ""}`
      : "Not graded"

  return (
    <div className="rounded-lg border p-4 text-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">{identifier}</p>
          <p className="text-xs text-muted-foreground">Submitted {submittedAt}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Grade</p>
          <p className="font-semibold">{gradeLabel}</p>
        </div>
      </div>
      {submission.feedback && (
        <p className="mt-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          "{submission.feedback}"
        </p>
      )}
    </div>
  )
}
