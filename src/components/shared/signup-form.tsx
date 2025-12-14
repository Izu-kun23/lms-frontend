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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [schools, setSchools] = React.useState<Array<{ id: string; name: string; slug: string }>>([])
  const [isLoadingSchools, setIsLoadingSchools] = React.useState(true)
  const [schoolsError, setSchoolsError] = React.useState<string>("")
  const { register } = useAuth()

  // Load schools via shared school store
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
          setSchoolsError("No schools found. Please create a school first.")
        }

        if (stale && fromCache) {
          setSchoolsError(
            "School list may be outdated. Sign in as an administrator to refresh the list if changes were made recently."
          )
        }
      } catch (error: any) {
        // Don't log refresh token expiration errors - they're expected when not logged in
        const isRefreshTokenExpired = (error as any)?.isRefreshTokenExpired
        if (!isRefreshTokenExpired) {
          console.error("Error loading schools:", error)
        }
        if (isMounted) {
          setSchools([])
          // Only show error if it's not a refresh token expiration (which is expected)
          if (!isRefreshTokenExpired) {
            setSchoolsError("Unable to load schools. Please contact support.")
          }
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
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password") || "")
    const confirmPassword = String(formData.get("confirm-password") || "")
    const schoolId = formData.get("schoolId") as string

    if (!schoolId) {
      setError("Please select a school")
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsSubmitting(false)
      return
    }

    try {
      const email = formData.get("email") as string
      const firstName = formData.get("firstName") as string
      const lastName = formData.get("lastName") as string
      const studentIdValue = formData.get("studentId") as string

      if (!firstName || !lastName) {
        setError("Please enter both first and last name")
        setIsSubmitting(false)
        return
      }

      // Convert studentId to number if provided
      const studentId = studentIdValue ? Number.parseInt(studentIdValue, 10) : undefined
      if (studentIdValue && isNaN(studentId!)) {
        setError("Student ID must be a valid number")
        setIsSubmitting(false)
        return
      }

      await register({
        email,
        password,
        firstName,
        lastName,
        role: "STUDENT", // Automatically set to STUDENT for registration
        schoolId,
        studentId,
      })
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your student account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Register to access courses and start your learning journey
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input 
            id="firstName" 
            name="firstName" 
            type="text" 
            placeholder="John" 
            required
            className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input 
            id="lastName" 
            name="lastName" 
            type="text" 
            placeholder="Doe" 
            required
            className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="student@university.edu" 
            required
            className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="Enter a secure password"
            required
            className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input 
            id="confirm-password" 
            name="confirm-password" 
            type="password" 
            placeholder="Confirm your password"
            required
            className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="schoolId">School</FieldLabel>
          <select
            id="schoolId"
            name="schoolId"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={isLoadingSchools}
          >
            <option value="">
              {isLoadingSchools ? "Loading schools..." : "Select your school"}
            </option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
          {schoolsError && (
            <FieldDescription className="text-red-600">
              {schoolsError}
              {" "}
              <a href="/onboarding" className="underline underline-offset-4 font-medium">
                Create a school here
              </a>
            </FieldDescription>
          )}
          {!isLoadingSchools && !schoolsError && schools.length === 0 && (
            <FieldDescription className="text-amber-600">
              No schools found.{" "}
              <a href="/onboarding" className="underline underline-offset-4 font-medium">
                Create one here
              </a>
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="studentId">Student ID (Optional)</FieldLabel>
          <Input 
            id="studentId" 
            name="studentId" 
            type="number" 
            placeholder="2023001" 
            min="1"
            className="focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </Field>
        {error ? (
          <FieldDescription className="text-center text-red-600">
            {error}
          </FieldDescription>
        ) : null}
        <Field>
          <Button
            type="submit"
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Student Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16 18.8 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.1 4 9.3 8.5 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 13.9-5.5l-6.4-5.2C29.6 35.4 26.9 36 24 36c-5.2 0-9.6-3.4-11.2-8l-6.6 5.1C9.2 39.5 16.1 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.3-2.3 4.2-4.3 5.5l6.4 5.2C39.6 36.1 44 30.6 44 24c0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Sign up with Google
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
