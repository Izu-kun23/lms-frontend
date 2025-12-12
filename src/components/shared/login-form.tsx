"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { getSchools } from "@/lib/school-service"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [schools, setSchools] = React.useState<Array<{ id: string; name: string; slug: string }>>([])
  const [isLoadingSchools, setIsLoadingSchools] = React.useState(true)
  const [schoolsError, setSchoolsError] = React.useState<string>("")
  const { login } = useAuth()

  // Load schools from cache (optional for login)
  React.useEffect(() => {
    let isMounted = true

    const loadSchools = async () => {
      setIsLoadingSchools(true)
      setSchoolsError("")

      try {
        const { schools: fetchedSchools, fromCache, stale } = await getSchools()
        if (!isMounted) return

        if (fetchedSchools.length > 0) {
          setSchools(fetchedSchools.map((school) => ({ id: school.id, name: school.name, slug: school.slug })))
        } else {
          setSchools([])
          // Don't show error - school selection is optional
        }

        if (stale && fromCache) {
          // Don't show error, just log it
          console.warn("School list may be outdated")
        }
      } catch (error) {
        console.error("Error loading schools:", error)
        if (isMounted) {
          setSchools([])
          // Don't show error - school selection is optional for login
        }
      } finally {
        if (isMounted) {
          setIsLoadingSchools(false)
        }
      }
    }

    loadSchools()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const schoolId = formData.get("schoolId") as string
      
      await login({ 
        email, 
        password,
        schoolId: schoolId || undefined 
      })
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your credentials to access your dashboard
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="student@university.edu"
            required
            className="rounded-full focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="rounded-full focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        {schools.length > 0 && (
          <Field>
            <FieldLabel htmlFor="schoolId">School (Optional)</FieldLabel>
            <select
              id="schoolId"
              name="schoolId"
              className="flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoadingSchools}
            >
              <option value="">
                {isLoadingSchools ? "Loading schools..." : "Select your school (optional)"}
              </option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field>
          <div className="flex items-center gap-2">
            <input id="remember" name="remember" type="checkbox" className="h-4 w-4 rounded border" />
            <label htmlFor="remember" className="text-sm">Remember me</label>
          </div>
        </Field>
        {error ? (
          <FieldDescription className="text-center text-red-600">
            {error}
          </FieldDescription>
        ) : null}
        <Field>
          <Button
            type="submit"
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login to Dashboard"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16 18.8 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.1 4 9.3 8.5 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 13.9-5.5l-6.4-5.2C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.4-11.2-8l-6.6 5.1C9.2 39.5 16.1 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.3-2.3 4.2-4.3 5.5l6.4 5.2C39.6 36.1 44 30.6 44 24c0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Login with Google
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="/signup" className="underline underline-offset-4">Sign up</a>
          </FieldDescription>
        </Field>
        <FieldSeparator>Or</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Admin or super admin? <a href="/admin/login" className="underline underline-offset-4 font-medium">Admin Login</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
