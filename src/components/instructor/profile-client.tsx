"use client"

import Image from "next/image"
import { User } from "@/lib/types"
import { Mail, MapPin, Calendar, CheckCircle2, XCircle, Edit2, LogOut, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface ProfileClientProps {
  user: User
}

export function ProfileClient({ user }: ProfileClientProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-brand to-brand-strong shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-brand-medium text-sm mt-1">Manage your account settings and information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sidebar - User Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs overflow-hidden lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
              {/* Background */}
              <div className="h-20 bg-linear-to-r from-brand/20 to-brand-medium/20"></div>

              {/* Content */}
              <div className="px-6 pb-6 -mt-10 relative">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-base overflow-hidden border-4 border-neutral-primary-soft shadow-md mx-auto mb-4">
                  <Image
                    src="/assets/avatar.png"
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="text-center space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-heading">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-xs text-fg-neutral-soft mt-0.5">{user.email}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="inline-flex justify-center items-center px-3 py-1.5 rounded-sm text-xs font-medium bg-brand-softer border border-brand-subtle text-fg-brand-strong uppercase">
                      {user.role}
                    </span>
                    
                    {user.emailVerified !== undefined && (
                      <div className={`inline-flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border ${
                        user.emailVerified 
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-300"
                          : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900 text-yellow-700 dark:text-yellow-300"
                      }`}>
                        {user.emailVerified ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Unverified
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-4 inline-flex justify-center items-center text-fg-neutral bg-neutral-primary box-border border border-default hover:bg-neutral-secondary focus:ring-4 focus:ring-neutral-medium shadow-xs font-medium rounded-base text-sm px-4 py-2.5">
                    <Edit2 className="w-4 h-4 me-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6 pb-8">
            {/* Personal Information Widget */}
            <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs p-6">
              <h3 className="text-lg font-semibold text-heading mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-brand-softer rounded-base">
                  <Mail className="w-5 h-5 text-brand" />
                </div>
                Personal Information
              </h3>

              <div className="space-y-0 divide-y divide-default">
                <div className="py-4 first:pt-0 last:pb-0">
                  <label className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">Email Address</label>
                  <p className="text-body font-medium mt-2">{user.email}</p>
                </div>

                <div className="py-4">
                  <label className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">Full Name</label>
                  <p className="text-body font-medium mt-2">{user.firstName} {user.lastName}</p>
                </div>

                <div className="py-4">
                  <label className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">Role</label>
                  <p className="text-body font-medium mt-2 capitalize">{user.role}</p>
                </div>

                <div className="py-4">
                  <label className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">Email Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    {user.emailVerified ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-body font-medium text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-fg-warning" />
                        <span className="text-body font-medium text-fg-warning">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* School Information Widget */}
            {user.school && (
              <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs p-6">
                <h3 className="text-lg font-semibold text-heading mb-6 flex items-center gap-3">
                  <div className="p-2.5 bg-brand-softer rounded-base">
                    <MapPin className="w-5 h-5 text-brand" />
                  </div>
                  School Information
                </h3>

                <div className="space-y-0 divide-y divide-default">
                  <div className="py-4 first:pt-0">
                    <label className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">School Name</label>
                    <p className="text-body font-medium mt-2">{user.school.name}</p>
                  </div>

                </div>
              </div>
            )}

            {/* Account Timeline Widget */}
            <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs p-6">
              <h3 className="text-lg font-semibold text-heading mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-brand-softer rounded-base">
                  <Calendar className="w-5 h-5 text-brand" />
                </div>
                Account Timeline
              </h3>

              <div className="space-y-6">
                {/* Member Since */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-brand border-4 border-neutral-primary-soft"></div>
                    {user.updatedAt && <div className="w-1 h-12 bg-default my-2"></div>}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">Member Since</p>
                    <p className="text-body font-medium mt-1">{formatDate(user.createdAt)}</p>
                    <p className="text-xs text-fg-neutral-soft mt-1">Account creation date</p>
                  </div>
                </div>

                {/* Last Updated */}
                {user.updatedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-4 h-4 rounded-full bg-brand border-4 border-neutral-primary-soft"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-fg-neutral-soft uppercase tracking-wide">Last Updated</p>
                      <p className="text-body font-medium mt-1">{formatDate(user.updatedAt)}</p>
                      <p className="text-xs text-fg-neutral-soft mt-1">Profile last modified</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings Widget */}
            <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs p-6">
              <h3 className="text-lg font-semibold text-heading mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-brand-softer rounded-base">
                  <Lock className="w-5 h-5 text-brand" />
                </div>
                Account Settings
              </h3>

              <div className="space-y-3">
                <Button className="w-full inline-flex justify-start items-center text-fg-neutral bg-neutral-primary box-border border border-default hover:bg-neutral-secondary focus:ring-4 focus:ring-neutral-medium shadow-xs font-medium rounded-base text-sm px-4 py-3">
                  <Lock className="w-4 h-4 me-2" />
                  Change Password
                </Button>
                <Button className="w-full inline-flex justify-start items-center text-fg-neutral bg-neutral-primary box-border border border-default hover:bg-neutral-secondary focus:ring-4 focus:ring-neutral-medium shadow-xs font-medium rounded-base text-sm px-4 py-3">
                  <Mail className="w-4 h-4 me-2" />
                  Update Email Address
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-base shadow-xs p-6">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-3">
                <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-base">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                Danger Zone
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">Actions in this section cannot be undone. Please proceed with caution.</p>
              <Button 
                onClick={handleLogout}
                className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 border border-transparent focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 shadow-xs font-medium rounded-base text-sm px-4 py-2.5"
              >
                <LogOut className="w-4 h-4 me-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}