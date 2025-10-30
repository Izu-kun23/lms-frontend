 

export default function DashboardPage() {
  return (
      <main className="p-6 md:p-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">Resume learning, track progress, and see what’s next.</p>
        </div>

        {/* Top cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Continue learning</p>
            <h3 className="mt-2 font-semibold">Intro to Algorithms</h3>
            <p className="text-xs text-muted-foreground mt-1">Lecture 3 • Sorting basics</p>
            <a href="/courses/1/lecture/3" className="mt-3 inline-block text-sm underline underline-offset-4">Resume</a>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Overall progress</p>
            <h3 className="mt-2 font-semibold">3 courses in progress</h3>
            <div className="mt-3 h-2 w-full rounded bg-muted">
              <div className="h-2 rounded bg-black" style={{ width: "48%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Avg. completion 48%</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <h3 className="mt-2 font-semibold">2 assignments due</h3>
            <ul className="mt-2 text-sm list-disc pl-4">
              <li>DB Systems • ER Diagram — Tomorrow</li>
              <li>Calculus • Problem Set 4 — Fri</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Notifications</p>
            <h3 className="mt-2 font-semibold">3 unread</h3>
            <a href="/notifications" className="mt-3 inline-block text-sm underline underline-offset-4">View all</a>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* My Courses */}
          <div className="lg:col-span-2 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">My Courses</h2>
              <a href="/courses" className="text-sm underline underline-offset-4">See all</a>
            </div>
            <div className="mt-4 space-y-4">
              {[1,2,3].map((i) => (
                <a key={i} href={`/courses/${i}`} className="block rounded-md border p-3 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Course {i}</p>
                      <p className="text-xs text-muted-foreground">Module {i} • Lecture {i+1}</p>
                    </div>
                    <span className="text-xs">{30*i}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded bg-muted">
                    <div className="h-2 rounded bg-black" style={{ width: `${30*i}%` }} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tasks & Discussions */}
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">Tasks due</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Quiz 1 • Algorithms</span>
                  <span className="text-xs text-muted-foreground">Today</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Assignment • Databases</span>
                  <span className="text-xs text-muted-foreground">Fri</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="font-semibold">Recent discussions</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a className="underline underline-offset-4" href="/threads/1">Sorting vs Searching — new reply</a>
                </li>
                <li>
                  <a className="underline underline-offset-4" href="/threads/2">Normalization tips — 2 new</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
  );
}


