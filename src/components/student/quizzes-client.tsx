"use client"

import { HelpCircle, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Quiz } from "@/types/quiz"
import Link from "next/link"

interface QuizzesClientProps {
  quizzes: Quiz[]
}

export function QuizzesClient({ quizzes }: QuizzesClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground">
          Take quizzes to test your knowledge
        </p>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quizzes available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  {quiz.isPublished && (
                    <Badge variant="default">Published</Badge>
                  )}
                </div>
                {quiz.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {quiz.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quiz.timeLimit && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} minutes</span>
                    </div>
                  )}
                  {quiz.passingScore && (
                    <div className="text-sm text-muted-foreground">
                      Passing score: {quiz.passingScore}%
                    </div>
                  )}
                  <Button asChild className="w-full">
                    <Link href={`/student/quizzes/${quiz.id}`}>
                      Take Quiz
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

