type Props = { params: { id: string; lectureId: string } }

export default function LecturePage({ params }: Props) {
  const { id, lectureId } = params;
  const syllabus = [
    { id: "1", title: "Introduction" },
    { id: "2", title: "Sorting basics" },
    { id: "3", title: "Searching" },
    { id: "4", title: "Graphs" },
  ]
  return (
    <main className="p-0 lg:p-6">
      <div className="grid lg:grid-cols-12">
        {/* Syllabus rail */}
        <aside className="lg:col-span-3 border-r hidden lg:block min-h-[calc(100svh-64px)]">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Course {id}</h2>
            <p className="text-xs text-muted-foreground">Syllabus</p>
          </div>
          <ul className="p-2">
            {syllabus.map((l) => (
              <li key={l.id}>
                <a href={`/courses/${id}/lecture/${l.id}`} className={`block rounded-md px-3 py-2 text-sm hover:bg-muted ${l.id===lectureId ? "bg-secondary" : ""}`}>
                  {l.id}. {l.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content area */}
        <section className="lg:col-span-9 p-6 space-y-4">
          <h1 className="text-xl font-semibold">Lecture {lectureId}: {syllabus.find(s=>s.id===lectureId)?.title || "Topic"}</h1>
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black/5">
            <div className="flex h-full items-center justify-center text-muted-foreground">Video player placeholder</div>
          </div>
          <article className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              This is placeholder content for the lecture. Replace with text, file embeds, or interactive content.
            </p>
            <ul>
              <li>Key concept A</li>
              <li>Key concept B</li>
              <li>Key concept C</li>
            </ul>
          </article>
          <div className="flex items-center gap-3">
            <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Mark complete</button>
            <a href={`/courses/${id}/lecture/${Number(lectureId)+1}`} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Next lecture</a>
          </div>
        </section>
      </div>
    </main>
  );
}


