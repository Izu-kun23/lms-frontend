export default function AdminUsersPage() {
  const users = [
    { id: "u_01", name: "Ada Lovelace", email: "ada@glacq.edu", role: "Admin", orgs: 2 },
    { id: "u_02", name: "Alan Turing", email: "alan@glacq.edu", role: "Instructor", orgs: 1 },
    { id: "u_03", name: "Grace Hopper", email: "grace@glacq.edu", role: "Student", orgs: 1 },
    { id: "u_04", name: "Edsger Dijkstra", email: "edsger@glacq.edu", role: "Student", orgs: 1 },
  ]
  return (
    <main className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-2">Manage users, roles, and access.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
          placeholder="Search users by name or email"
        />
        <select className="h-9 rounded-md border bg-background px-3 text-sm">
          <option value="">All roles</option>
          <option>Student</option>
          <option>Instructor</option>
          <option>Admin</option>
          <option>Super Admin</option>
        </select>
        <button className="ml-auto rounded-md border px-3 py-2 text-sm hover:bg-muted">Invite user</button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Orgs</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs">{u.role}</span>
                </td>
                <td className="px-4 py-3">{u.orgs}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-muted">Change role</button>
                    <button className="rounded-md border px-2 py-1 text-xs hover:bg-muted">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


