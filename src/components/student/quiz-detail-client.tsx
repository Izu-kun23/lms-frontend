"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2, Clock, CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import type { Quiz, Question, Option, QuizAttempt, SubmitQuizInput } from "@/types/quiz"
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
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface QuizDetailClientProps {
  quiz: Quiz
}

export function StudentQuizDetailClient({ quiz }: QuizDetailClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [quizWithQuestions, setQuizWithQuestions] = useState<Quiz | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Load quiz with questions
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const fullQuiz = await apiClient.getQuizDetails(quiz.id)
        setQuizWithQuestions(fullQuiz)
      } catch (error) {
        console.error("Failed to load quiz:", error)
        toast.error("Failed to load quiz details")
      } finally {
        setIsLoading(false)
      }
    }

    loadQuiz()
  }, [quiz.id])

  // Timer for quiz
  useEffect(() => {
    if (!isStarted || !quiz.timeLimit || timeRemaining === null) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isStarted, timeRemaining])

  const handleStartQuiz = () => {
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60) // Convert minutes to seconds
    }
    setIsStarted(true)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleAutoSubmit = async () => {
    if (isSubmitting) return
    await handleSubmit(true)
  }

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      const unanswered = quizWithQuestions?.questions?.filter(
        (q) => !answers[q.id]
      )
      if (unanswered && unanswered.length > 0) {
        const confirmed = window.confirm(
          `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
        )
        if (!confirmed) return
      }
    }

    setIsSubmitting(true)
    try {
      const submitData: SubmitQuizInput = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
        timeSpent: quiz.timeLimit
          ? (quiz.timeLimit * 60) - (timeRemaining || 0)
          : 0,
      }

      const result = await apiClient.submitQuizAttempt(quiz.id, submitData)
      setAttempt(result)
      setShowResults(true)
      toast.success("Quiz submitted successfully!")
    } catch (error: any) {
      console.error("Failed to submit quiz:", error)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit quiz"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!quizWithQuestions) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/student/quizzes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Quiz not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show results if quiz is submitted
  if (showResults && attempt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/student/quizzes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quiz Results</h1>
            <p className="text-muted-foreground">{quiz.title}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {attempt.passed ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              {attempt.passed ? "Passed" : "Not Passed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-1">Score</p>
                <p className="text-2xl font-bold">
                  {attempt.score || 0}
                  {attempt.totalPoints && ` / ${attempt.totalPoints}`}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                <p className="text-2xl font-bold">
                  {attempt.percentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
            {quiz.passingScore && (
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Passing Score: {quiz.passingScore}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button asChild className="w-full">
          <Link href="/student/quizzes">Back to Quizzes</Link>
        </Button>
      </div>
    )
  }

  // Show quiz start screen
  if (!isStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/student/quizzes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground">Quiz Details</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quiz Instructions</CardTitle>
            <CardDescription>Read the instructions before starting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {quiz.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Questions</span>
                </div>
                <span className="text-sm font-medium">
                  {quizWithQuestions.questions?.length || 0}
                </span>
              </div>

              {quiz.timeLimit && (
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Time Limit</span>
                  </div>
                  <span className="text-sm font-medium">{quiz.timeLimit} minutes</span>
                </div>
              )}

              {quiz.passingScore && (
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Passing Score</span>
                  </div>
                  <span className="text-sm font-medium">{quiz.passingScore}%</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleStartQuiz}
              className="w-full bg-orange-500 hover:bg-orange-600 rounded-full"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show quiz questions
  const questions = quizWithQuestions.questions || []
  const currentQuestionIndex = 0 // For now, show all questions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/student/quizzes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        {timeRemaining !== null && (
          <div className="flex items-center gap-2 rounded-lg border px-4 py-2 bg-muted/40">
            <Clock className="h-4 w-4" />
            <span className="font-mono font-semibold">
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {index + 1} ({question.points} points)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base">{question.text}</p>

              {question.type === "MCQ" && question.options && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                      <Label htmlFor={`${question.id}-${option.id}`} className="cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "TRUE_FALSE" && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${question.id}-true`} />
                    <Label htmlFor={`${question.id}-true`} className="cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${question.id}-false`} />
                    <Label htmlFor={`${question.id}-false`} className="cursor-pointer">
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {question.type === "SHORT_ANSWER" && (
                <Input
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer"
                  className="rounded-full"
                />
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
