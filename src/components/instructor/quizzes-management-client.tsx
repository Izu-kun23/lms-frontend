"use client"

import { Plus, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Quiz } from "@/types/quiz"
import Link from "next/link"

interface QuizzesManagementClientProps {
  quizzes: Quiz[]
}

export function QuizzesManagementClient({
  quizzes,
}: QuizzesManagementClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="text-muted-foreground">
            Create and manage course quizzes
          </p>
        </div>
        <Button asChild>
          <Link href="/instructor/quizzes/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quizzes found</p>
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
                <div className="flex gap-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/instructor/quizzes/${quiz.id}`}>
                      Manage
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/instructor/quizzes/${quiz.id}/attempts`}>
                      View Attempts
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

