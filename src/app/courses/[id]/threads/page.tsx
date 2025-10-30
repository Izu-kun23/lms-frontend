type Props = { params: { id: string } }

export default function CourseThreadsPage({ params }: Props) {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Discussion Threads</h1>
      <p className="text-muted-foreground mt-2">Course {params.id}</p>
    </main>
  );
}


