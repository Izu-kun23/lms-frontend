import type { Assignment, AssignmentSubmission } from "@/lib/types"

export interface AssignmentWithCourse extends Omit<Assignment, "course"> {
  course?: {
    id: string
    title: string
    code: string
  }
}

export interface SubmissionWithDetails extends Omit<AssignmentSubmission, "assignment"> {
  assignment?: AssignmentWithCourse
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  
  }
}

export interface AssignmentStats {
  totalAssignments: number
  pendingAssignments: number
  submittedAssignments: number
  gradedAssignments: number
  averageScore?: number
  assignment?: AssignmentWithCourse
}

export interface SubmissionStats {
  totalSubmissions: number
  pendingGrading: number
  graded: number
  averageGrade?: number
  
}

// Request types
export interface CreateAssignmentInput {
  title: string
  description: string
  dueDate?: string
  maxScore?: number
  files?: string[] // URLs
}

export interface UpdateAssignmentInput {
  title?: string
  description?: string
  dueDate?: string
  maxScore?: number
  files?: string[]
}

export interface SubmitAssignmentInput {
  files?: File[]
  fileUrls?: string[]
  text?: string
  notes?: string
}

export interface GradeSubmissionInput {
  score: number
  feedback?: string
  maxScore?: number
}

