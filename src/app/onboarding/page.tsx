"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { mergeCachedSchools } from "@/lib/school-store"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Building2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const adminStudentIdValue = formData.get("adminStudentId") as string
      const rawSlug = formData.get("slug") as string
      
      // Sanitize slug: lowercase and remove invalid characters
      const sanitizedSlug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, "")
      
      const data = {
        name: formData.get("name") as string,
        slug: sanitizedSlug,
        domain: formData.get("domain") as string || undefined,
        description: formData.get("description") as string || undefined,
        adminEmail: formData.get("adminEmail") as string,
        adminFirstName: formData.get("adminFirstName") as string,
        adminLastName: formData.get("adminLastName") as string,
        adminPassword: formData.get("adminPassword") as string,
        adminStudentId: adminStudentIdValue ? Number.parseInt(adminStudentIdValue) : undefined,
      }

      const org = await apiClient.createSchool(data)
      
      // Store school in localStorage for login dropdown
      mergeCachedSchools([org])
      
      // Show success message and redirect to login
      alert(`School "${org.name}" created successfully!\n\nYou can now login with your admin credentials.`)
      
      router.push("/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create school. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome to LMS</h1>
            <p className="text-muted-foreground mt-2">
              Create your first school and admin account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">
                School Name <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Tech University"
                required
              />
              <FieldDescription>
                The display name for your school
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">
                School Slug <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="slug"
                name="slug"
                type="text"
                placeholder="tech-university"
                required
                pattern="[a-z0-9-]+"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement
                  target.value = target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                }}
              />
              <FieldDescription>
                URL-friendly identifier (lowercase, numbers, hyphens)
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="domain">Domain (Optional)</FieldLabel>
              <Input
                id="domain"
                name="domain"
                type="text"
                placeholder="techuniversity.edu"
              />
              <FieldDescription>
                Email domain for automatic school assignment
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Brief description of your school"
              />
            </Field>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Admin Account</h3>
              <FieldDescription className="mb-4">
                Create your administrator account for this school
              </FieldDescription>
              
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="adminEmail">
                    Admin Email <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    placeholder="admin@techuniversity.edu"
                    required
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="adminFirstName">
                      First Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="adminFirstName"
                      name="adminFirstName"
                      type="text"
                      placeholder="John"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="adminLastName">
                      Last Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="adminLastName"
                      name="adminLastName"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="adminPassword">
                    Admin Password <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="adminPassword"
                    name="adminPassword"
                    type="password"
                    placeholder="Enter secure password"
                    required
                    minLength={6}
                  />
                  <FieldDescription>
                    Must be at least 6 characters long
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="adminStudentId">
                    Admin Student ID (Optional)
                  </FieldLabel>
                  <Input
                    id="adminStudentId"
                    name="adminStudentId"
                    type="number"
                    placeholder="2023001"
                  />
                  <FieldDescription>
                    Student/employee ID number
                  </FieldDescription>
                </Field>
              </div>
            </div>

            {error && (
              <FieldDescription className="text-red-600">
                {error}
              </FieldDescription>
            )}

            <Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create School & Admin Account"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  )
}

