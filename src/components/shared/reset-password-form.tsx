"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { toast } from "sonner"

interface ResetPasswordFormProps {
  token: string
  className?: string
}

export function ResetPasswordForm({ token, className, ...props }: ResetPasswordFormProps & React.ComponentProps<"form">) {
  const router = useRouter()
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const newPassword = formData.get("newPassword") as string
      const confirmPassword = formData.get("confirmPassword") as string

      if (!newPassword || newPassword.length < 6) {
        setError("Password must be at least 6 characters long")
        setIsSubmitting(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match")
        setIsSubmitting(false)
        return
      }

      await apiClient.resetPassword(token, newPassword)
      toast.success("Password reset successfully! Redirecting to login...")
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to reset password. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            required
            minLength={6}
            className="rounded-full focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
          <FieldDescription>
            Password must be at least 6 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            required
            minLength={6}
            className="rounded-full focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
          <FieldDescription>
            Re-enter your new password to confirm.
          </FieldDescription>
        </Field>
        {error && (
          <FieldDescription className="text-center text-red-600">
            {error}
          </FieldDescription>
        )}
        <Field>
          <Button
            type="submit"
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Remember your password? <Link href="/login" className="underline underline-offset-4 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">Back to login</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}


