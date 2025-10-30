type Props = { params: { id: string } }

export default function ThreadDetailPage({ params }: Props) {
  return (
    <main className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Thread</h1>
      <p className="text-muted-foreground mt-2">Thread ID: {params.id}</p>
    </main>
  );
}


