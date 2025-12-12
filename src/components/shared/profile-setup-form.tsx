"use client"

import React from "react"
import { useState } from "react"
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
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/lib/api"
import type { UpdateProfileRequest } from "@/lib/types"

export function ProfileSetupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Form state
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    studentId: user?.studentId,
    notificationPreferences: {
      email: true,
      push: true,
      inApp: true,
    },
    learningPreferences: {
      theme: "auto",
      language: "en",
      accessibility: {
        fontSize: "medium",
        highContrast: false,
        screenReader: false,
      },
    },
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof UpdateProfileRequest] as any || {}),
          [child]: value,
        },
      }))
    } else if (field.includes("-")) {
      const parts = field.split("-")
      if (parts.length === 3) {
        const [parent, child, grandchild] = parts
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof UpdateProfileRequest] as any || {}),
            [child]: {
              ...((prev[parent as keyof UpdateProfileRequest] as any)?.[child] || {}),
              [grandchild]: value,
            },
          },
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await apiClient.updateProfile(formData)
      await refreshUser()
      router.push("/student/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    router.push("/student/dashboard")
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Let's set up your profile to personalize your learning experience
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={cn("h-2 w-16 rounded-full", currentStep >= 1 ? "bg-blue-500" : "bg-gray-200")} />
          <div className={cn("h-2 w-16 rounded-full", currentStep >= 2 ? "bg-blue-500" : "bg-gray-200")} />
          <div className={cn("h-2 w-16 rounded-full", currentStep >= 3 ? "bg-blue-500" : "bg-gray-200")} />
        </div>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal details and identification information
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
              <Input
                id="studentId"
                name="studentId"
                type="number"
                placeholder="2023001"
                min="1"
                value={formData.studentId || ""}
                onChange={(e) => {
                  const value = e.target.value.trim()
                  if (value === "") {
                    handleInputChange("studentId", undefined)
                  } else {
                    const numValue = Number.parseInt(value, 10)
                    if (!isNaN(numValue)) {
                      handleInputChange("studentId", numValue)
                    }
                  }
                }}
              />
              <FieldDescription>
                Your student identification number (optional)
              </FieldDescription>
            </Field>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip for now
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex-1"
              >
                Next: Preferences
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Notification Preferences */}
        {currentStep === 2 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Choose how you want to receive updates and notifications
              </p>
            </div>
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="email-notifications">Email Notifications</FieldLabel>
                  <FieldDescription>
                    Receive course updates and announcements via email
                  </FieldDescription>
                </div>
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={formData.notificationPreferences?.email ?? true}
                  onChange={(e) => handleInputChange("notificationPreferences.email", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="push-notifications">Push Notifications</FieldLabel>
                  <FieldDescription>
                    Receive real-time notifications on your device
                  </FieldDescription>
                </div>
                <input
                  id="push-notifications"
                  type="checkbox"
                  checked={formData.notificationPreferences?.push ?? true}
                  onChange={(e) => handleInputChange("notificationPreferences.push", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="inapp-notifications">In-App Notifications</FieldLabel>
                  <FieldDescription>
                    Show notifications within the application
                  </FieldDescription>
                </div>
                <input
                  id="inapp-notifications"
                  type="checkbox"
                  checked={formData.notificationPreferences?.inApp ?? true}
                  onChange={(e) => handleInputChange("notificationPreferences.inApp", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </Field>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1"
              >
                Next: Learning Preferences
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Learning Preferences */}
        {currentStep === 3 && (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Learning Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Customize your learning environment and accessibility settings
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="theme">Theme Preference</FieldLabel>
              <select
                id="theme"
                name="theme"
                value={formData.learningPreferences?.theme || "auto"}
                onChange={(e) => handleInputChange("learningPreferences.theme", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
              <FieldDescription>
                Choose your preferred color theme
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="fontSize">Font Size</FieldLabel>
              <select
                id="fontSize"
                name="fontSize"
                value={formData.learningPreferences?.accessibility?.fontSize || "medium"}
                onChange={(e) => handleInputChange("learningPreferences-accessibility-fontSize", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <FieldDescription>
                Adjust text size for better readability
              </FieldDescription>
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="highContrast">High Contrast Mode</FieldLabel>
                  <FieldDescription>
                    Increase contrast for better visibility
                  </FieldDescription>
                </div>
                <input
                  id="highContrast"
                  type="checkbox"
                  checked={formData.learningPreferences?.accessibility?.highContrast ?? false}
                  onChange={(e) => handleInputChange("learningPreferences-accessibility-highContrast", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel htmlFor="screenReader">Screen Reader Support</FieldLabel>
                  <FieldDescription>
                    Optimize interface for screen readers
                  </FieldDescription>
                </div>
                <input
                  id="screenReader"
                  type="checkbox"
                  checked={formData.learningPreferences?.accessibility?.screenReader ?? false}
                  onChange={(e) => handleInputChange("learningPreferences-accessibility-screenReader", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </Field>
            {error ? (
              <FieldDescription className="text-center text-red-600">
                {error}
              </FieldDescription>
            ) : null}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </>
        )}
      </FieldGroup>
    </form>
  )
}

