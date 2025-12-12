export interface CourseAnalytics {
  courseId: string
  courseTitle: string
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  averageProgress: number
  averageScore?: number
  completionRate: number
  averageTimeSpent: number // in seconds
  studentEngagement: {
    activeStudents: number
    inactiveStudents: number
    averageSessionsPerStudent: number
  }
  modulePerformance: ModulePerformance[]
  assignmentPerformance: AssignmentPerformance[]
  quizPerformance: QuizPerformance[]
}

export interface ModulePerformance {
  moduleId: string
  moduleTitle: string
  totalLectures: number
  completedLectures: number
  completionRate: number
  averageTimeSpent: number
}

export interface AssignmentPerformance {
  assignmentId: string
  assignmentTitle: string
  totalSubmissions: number
  averageScore?: number
  submissionRate: number
  onTimeSubmissions: number
  lateSubmissions: number
}

export interface QuizPerformance {
  quizId: string
  quizTitle: string
  totalAttempts: number
  averageScore?: number
  passRate: number
  averageTimeSpent: number
}

export interface StudentStatistics {
  userId: string
  firstName: string
  lastName: string
  email: string
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  overallProgress: number
  averageScore?: number
  totalTimeSpent: number
  lastActivity?: string
  courseStats: StudentCourseStats[]
}

export interface StudentCourseStats {
  courseId: string
  courseTitle: string
  progress: number
  timeSpent: number
  assignmentsCompleted: number
  assignmentsTotal: number
  quizzesCompleted: number
  quizzesTotal: number
  averageScore?: number
}

export interface QuizStatistics {
  quizId: string
  quizTitle: string
  totalAttempts: number
  uniqueStudents: number
  averageScore: number
  passRate: number
  averageTimeSpent: number
  questionStatistics: QuestionStatistics[]
  scoreDistribution: ScoreDistribution[]
}

export interface QuestionStatistics {
  questionId: string
  questionText: string
  correctAnswers: number
  incorrectAnswers: number
  averageScore: number
  difficulty: "EASY" | "MEDIUM" | "HARD"
}

export interface ScoreDistribution {
  range: string // e.g., "0-20", "21-40", etc.
  count: number
  percentage: number
}

export interface InstructorDashboardStats {
  totalCourses: number
  totalStudents: number
  totalEnrollments: number
  activeCourses: number
  pendingGradings: number
  recentEnrollments: number
  averageCourseProgress: number
  courseStats: CourseAnalytics[]
}

