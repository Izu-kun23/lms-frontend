import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  )
}

