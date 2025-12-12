export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER"

export interface Quiz {
  id: string
  courseId: string
  title: string
  description?: string
  timeLimit?: number // in minutes
  passingScore?: number // percentage
  isPublished: boolean
  createdAt: string
  updatedAt: string
  questions?: Question[]
}

export interface Question {
  id: string
  quizId: string
  quiz?: Quiz
  text: string
  type: QuestionType
  points: number
  order: number
  createdAt: string
  updatedAt: string
  options?: Option[]
  correctAnswer?: string // For SHORT_ANSWER
}

export interface Option {
  id: string
  questionId: string
  question?: Question
  text: string
  isCorrect: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  quiz?: Quiz
  userId: string
  answers: Record<string, string> // questionId -> answer
  score?: number
  totalPoints?: number
  percentage?: number
  passed?: boolean
  timeSpent?: number // in seconds
  submittedAt?: string
  createdAt: string
  updatedAt: string
}

export interface QuizResult {
  attempt: QuizAttempt
  feedback: QuestionFeedback[]
  correctAnswers: number
  totalQuestions: number
}

export interface QuestionFeedback {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  points: number
  feedback?: string
}

export interface Answer {
  questionId: string
  answer: string
}

// Request types
export interface CreateQuizInput {
  title: string
  description?: string
  timeLimit?: number
  passingScore?: number
  isPublished?: boolean
}

export interface UpdateQuizInput {
  title?: string
  description?: string
  timeLimit?: number
  passingScore?: number
  isPublished?: boolean
}

export interface CreateQuestionInput {
  text: string
  type: QuestionType
  points: number
  order?: number
  correctAnswer?: string // For SHORT_ANSWER
}

export interface UpdateQuestionInput {
  text?: string
  type?: QuestionType
  points?: number
  order?: number
  correctAnswer?: string
}

export interface CreateOptionInput {
  text: string
  isCorrect: boolean
  order?: number
}

export interface UpdateOptionInput {
  text?: string
  isCorrect?: boolean
  order?: number
}

export interface SubmitQuizInput {
  answers: Answer[]
  timeSpent: number
}

export interface ValidateQuizInput {
  answers: Answer[]
}

