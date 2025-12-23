"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2, CalendarClock, FileText, Upload, CheckCircle2, XCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

interface AssignmentDetailClientProps {
  assignment: AssignmentWithCourse
}

const DUE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

const SUBMISSION_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

export function StudentAssignmentDetailClient({ assignment }: AssignmentDetailClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submission, setSubmission] = useState<SubmissionWithDetails | null>(null)
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(true)
  const [formData, setFormData] = useState({
    text: "",
    files: [] as File[],
  })

  // Load existing submission
  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const submissions = await apiClient.getMySubmissions(assignment.id)
        if (submissions && submissions.length > 0) {
          // Map AssignmentSubmission to SubmissionWithDetails format
          const submissionData = submissions[0]
          setSubmission({
            id: submissionData.id,
            assignmentId: submissionData.assignmentId || assignment.id,
            userId: submissionData.userId,
            text: submissionData.text,
            fileUrl: submissionData.fileUrl,
            submittedAt: submissionData.submittedAt,
            grade: submissionData.grade,
            feedback: submissionData.feedback,
            status: submissionData.status,
            createdAt: submissionData.createdAt,
            updatedAt: submissionData.updatedAt,
            gradedAt: submissionData.gradedAt,
            assignment: assignment,
          })
          // Pre-fill form with existing submission
          if (submissionData.text) {
            setFormData((prev) => ({ ...prev, text: submissionData.text || "" }))
          }
        }
      } catch (error) {
        console.error("Failed to load submission:", error)
        // It's okay if there's no submission yet
      } finally {
        setIsLoadingSubmission(false)
      }
    }

    loadSubmission()
  }, [assignment.id])

  const handleInputChange = (field: keyof typeof formData, value: string | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({ ...prev, files }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.text.trim() && formData.files.length === 0) {
      toast.error("Please provide either text or file submission")
      return
    }

    setIsSubmitting(true)
    try {
      // Submit or update submission
      await apiClient.submitAssignment(assignment.id, {
        text: formData.text.trim() || undefined,
        files: formData.files.length > 0 ? formData.files : undefined,
      })
      toast.success(submission ? "Submission updated successfully" : "Assignment submitted successfully")
      router.refresh()
    } catch (error: any) {
      console.error("Failed to submit assignment", error)
      const message = error?.response?.data?.message || error?.message || "Failed to submit assignment"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dueDateLabel = assignment.dueAt
    ? DUE_DATE_FORMATTER.format(new Date(assignment.dueAt))
    : "No deadline"
  const isPastDue = assignment.dueAt ? new Date(assignment.dueAt).getTime() < Date.now() : false
  const submittedDateLabel = submission?.submittedAt
    ? SUBMISSION_DATE_FORMATTER.format(new Date(submission.submittedAt))
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student/assignments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Assignment Details</p>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Assignment Instructions</CardTitle>
            <CardDescription>Read the requirements and submit your work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {assignment.description || "No description provided."}
              </p>
            </div>

            {assignment.course && (
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Course</p>
                <p className="text-base font-medium">
                  {assignment.course.title}
                  {assignment.course.code && ` (${assignment.course.code})`}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Due Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{dueDateLabel}</span>
                  {isPastDue && !submission && (
                    <Badge variant="destructive">Overdue</Badge>
                  )}
                </div>
              </div>

              {assignment.maxScore && (
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Maximum Score</span>
                  </div>
                  <span className="text-sm font-medium">{assignment.maxScore} points</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="order-1 space-y-6 lg:order-2">
          {/* Submission Status */}
          {isLoadingSubmission ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading submission...</span>
                </div>
              </CardContent>
            </Card>
          ) : submission ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Submission Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-4">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Submitted on {submittedDateLabel}
                  </p>
                </div>

                {submission.text && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Your Submission
                    </p>
                    <p className="text-sm whitespace-pre-wrap rounded-lg border p-3 bg-muted/40">
                      {submission.text}
                    </p>
                  </div>
                )}

                {submission.grade !== undefined && submission.grade !== null && (
                  <div className="rounded-lg border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                      Grade
                    </p>
                    <p className="text-2xl font-bold">
                      {submission.grade}
                      {assignment.maxScore && ` / ${assignment.maxScore}`}
                    </p>
                    {submission.feedback && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {submission.feedback}
                      </p>
                    )}
                  </div>
                )}

                {(!submission.grade || submission.grade === null) && (
                  <div className="rounded-lg border bg-yellow-50 dark:bg-yellow-950/20 p-4">
                    <p className="text-sm text-yellow-900 dark:text-yellow-100">
                      Your submission is pending grading
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  Not Submitted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You haven't submitted this assignment yet.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {submission ? "Update Submission" : "Submit Assignment"}
              </CardTitle>
              <CardDescription>
                {submission
                  ? "You can update your submission before the due date"
                  : "Upload your files or enter your response"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="submission-text">
                      Text Response
                    </FieldLabel>
                    <textarea
                      id="submission-text"
                      rows={8}
                      value={formData.text}
                      onChange={(event) => handleInputChange("text", event.target.value)}
                      placeholder="Enter your assignment response here..."
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide your assignment response as text, or upload files below.
                    </p>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="submission-files">
                      Files (Optional)
                    </FieldLabel>
                    <Input
                      id="submission-files"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="rounded-full"
                    />
                    {formData.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {formData.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{file.name}</span>
                            <span className="text-xs">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload assignment files (PDF, DOC, images, etc.)
                    </p>
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={isSubmitting || (!formData.text.trim() && formData.files.length === 0)}
                  className="w-full bg-orange-500 hover:bg-orange-600 rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {submission ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {submission ? "Update Submission" : "Submit Assignment"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


