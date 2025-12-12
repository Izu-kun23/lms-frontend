import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  return <>{children}</>
}

