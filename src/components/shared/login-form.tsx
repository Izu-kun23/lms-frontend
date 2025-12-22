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
import { Eye, EyeOff } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [schools, setSchools] = React.useState<Array<{ id: string; name: string; slug: string }>>([])
  const [isLoadingSchools, setIsLoadingSchools] = React.useState(true)
  const [schoolsError, setSchoolsError] = React.useState<string>("")
  const [showPassword, setShowPassword] = React.useState(false)
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
      } catch (error: any) {
        // Don't log refresh token expiration errors - they're expected when not logged in
        const isRefreshTokenExpired = (error as any)?.isRefreshTokenExpired
        if (!isRefreshTokenExpired) {
          console.error("Error loading schools:", error)
        }
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
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="rounded-full focus-visible:ring-orange-500 focus-visible:border-orange-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
      </FieldGroup>
    </form>
  )
}
