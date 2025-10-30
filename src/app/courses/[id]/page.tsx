type Props = { params: { id: string } }

export default function CourseDetailPage({ params }: Props) {
  const { id } = params;
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Course Details</h1>
      <p className="text-muted-foreground mt-2">Course ID: {id}</p>
    </main>
  );
}


