"use client"

import React from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import type { Organization } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch organization details
  const {
    data: organization,
    isLoading: orgLoading,
  } = useQuery<Organization>({
    queryKey: ["organization", user?.organizationId],
    queryFn: () => apiClient.getOrganization(user?.organizationId || ""),
    enabled: !!user?.organizationId,
  })

  if (authLoading || orgLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>

        {/* Profile Header Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between">
            {/* Left: Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="capitalize">{user.role.toLowerCase().replace("_", " ")}</span>
                  <span className="text-gray-400">|</span>
                  <span>{organization?.name || "Organization"}</span>
                </div>
              </div>
            </div>

            {/* Right: Social Links and Edit Button */}
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  First Name
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{user.firstName}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email address
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Bio</label>
                <p className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                  {user.role.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Name
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{user.lastName}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {user.matricNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">Country</label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {organization?.name || "United States"}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Postal Code
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {organization?.slug?.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                  City/State
                </label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {organization?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">TAX ID</label>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {user.matricNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

