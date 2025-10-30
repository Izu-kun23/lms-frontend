type Props = { params: { id: string } }

export default function QuizAttemptPage({ params }: Props) {
  const questions = [
    { id: "q1", type: "mcq", title: "Which algorithm is stable?", options: ["Quick sort", "Merge sort", "Heap sort", "Selection sort"] },
    { id: "q2", type: "tf", title: "DFS uses a stack.", options: ["True", "False"] },
  ]
  return (
    <main className="p-0 lg:p-6">
      <div className="grid lg:grid-cols-12">
        {/* Navigator */}
        <aside className="lg:col-span-3 border-r hidden lg:block min-h-[calc(100svh-64px)] p-4 space-y-3">
          <div>
            <h2 className="font-semibold">Quiz {params.id}</h2>
            <p className="text-xs text-muted-foreground">Time left: 23:15</p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <a key={q.id} href={`#${q.id}`} className="rounded-md border px-2 py-1 text-center text-xs hover:bg-muted">
                {i + 1}
              </a>
            ))}
          </div>
          <button className="w-full rounded-md border px-3 py-2 text-sm hover:bg-muted">Submit quiz</button>
        </aside>

        {/* Question area */}
        <section className="lg:col-span-9 p-6 space-y-6">
          {questions.map((q, i) => (
            <div id={q.id} key={q.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{i + 1}. {q.title}</h3>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-sm">
                    <input name={q.id} type="radio" className="h-4 w-4" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Save</button>
            <button className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Submit</button>
          </div>
        </section>
      </div>
    </main>
  );
}


