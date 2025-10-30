type Props = { params: { id: string } }

export default function CourseQuizzesPage({ params }: Props) {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Quizzes</h1>
      <p className="text-muted-foreground mt-2">Manage and attempt quizzes for course {params.id}.</p>
    </main>
  );
}


