type Props = { params: { id: string } }

export default function AssignmentPage({ params }: Props) {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Assignment</h1>
      <p className="text-muted-foreground mt-2">Assignment ID: {params.id}</p>
    </main>
  );
}


