"use client"

import React from "react"
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

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = React.useState<string>("")
  const [success, setSuccess] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email") as string
      await apiClient.forgotPassword(email)
      setSuccess("Password reset instructions have been sent to your email.")
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send password reset email. Please try again.")
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
            Enter your email address and we'll send you instructions to reset your password
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
          />
          <FieldDescription>
            Enter the email address associated with your account.
          </FieldDescription>
        </Field>
        {error && (
          <FieldDescription className="text-center text-red-600">
            {error}
          </FieldDescription>
        )}
        {success && (
          <FieldDescription className="text-center text-green-600">
            {success}
          </FieldDescription>
        )}
        <Field>
          <Button
            type="submit"
            className="bg-black text-white hover:bg-black/90 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Remember your password? <Link href="/login" className="underline underline-offset-4">Back to login</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

