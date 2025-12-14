"use client"

import { useState } from "react"
import Image from "next/image"
import { User } from "@/lib/types"
import { 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Edit2, 
  LogOut, 
  Lock,
  User as UserIcon,
  Globe,
  Clock,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"

interface ProfileClientProps {
  user: User
}

export function ProfileClient({ user }: ProfileClientProps) {
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    nickName: "",
    gender: "",
    language: "",
    country: "",
    timeZone: "",
  })

  const [emails] = useState([
    {
      email: user.email,
      isPrimary: true,
      addedAt: user.createdAt,
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddEmail = () => {
    console.log("Add email clicked")
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
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

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMs = now.getTime() - date.getTime()
      const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30))
      
      if (diffInMonths === 0) return "Just now"
      if (diffInMonths === 1) return "1 month ago"
      return `${diffInMonths} months ago`
    } catch {
      return "Recently"
    }
  }

  return (
    <div className="flex flex-1 gap-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 h-full overflow-hidden">
      <div className="flex-1 min-w-0 px-6 pt-6 pb-6 overflow-y-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            My Profile
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your account settings and information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - User Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl overflow-hidden lg:sticky lg:top-8 lg:self-start backdrop-blur-sm">
              {/* Background */}
              <div className="h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>

              {/* Content */}
              <div className="px-6 pb-6 -mt-12 relative">
                {/* Avatar */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-neutral-800 mx-auto mb-4 ring-2 ring-orange-200 dark:ring-orange-900/50">
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
                    <span className="inline-flex justify-center items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                      {user.role}
                    </span>
                    
                    {user.emailVerified !== undefined && (
                      <div className={`inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border ${
                        user.emailVerified 
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-300"
                          : "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300"
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
                  <Button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="w-full mt-4 inline-flex justify-center items-center text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-900 font-medium rounded-xl text-sm px-4 py-2.5 transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4 me-2" />
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Widget */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl">
                  <UserIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="rounded-xl border-neutral-300 dark:border-neutral-600 focus:border-orange-500 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{formData.fullName || `${user.firstName} ${user.lastName}`}</p>
                    )}
                  </div>

                  {/* Nickname */}
                  <div>
                    <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                      Nick Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.nickName}
                        onChange={(e) => handleInputChange("nickName", e.target.value)}
                        placeholder="Enter nickname"
                        className="rounded-xl border-neutral-300 dark:border-neutral-600 focus:border-orange-500 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{formData.nickName || "Not set"}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                      Gender
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{formData.gender || "Not set"}</p>
                    )}
                  </div>

                  {/* Language */}
                  <div>
                    <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                      Language
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.language}
                        onValueChange={(value) => handleInputChange("language", value)}
                      >
                        <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{formData.language || "Not set"}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                      Country
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleInputChange("country", value)}
                      >
                        <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="za">South Africa</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{formData.country || "Not set"}</p>
                    )}
                  </div>

                  {/* Timezone */}
                  <div>
                    <Label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
                      Time Zone
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.timeZone}
                        onValueChange={(value) => handleInputChange("timeZone", value)}
                      >
                        <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">EST</SelectItem>
                          <SelectItem value="pst">PST</SelectItem>
                          <SelectItem value="gmt">GMT</SelectItem>
                          <SelectItem value="cet">CET</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{formData.timeZone || "Not set"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Address Widget */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Email Address
              </h3>

              <div className="space-y-3">
                {emails.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/30 border border-neutral-200 dark:border-neutral-600 rounded-2xl"
                  >
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Email Address</label>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-neutral-900 dark:text-neutral-100 font-medium">{item.email}</p>
                      {item.isPrimary && (
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {item.isPrimary && "Primary • "}
                      Added {formatRelativeTime(item.addedAt)}
                    </p>
                  </div>
                ))}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={handleAddEmail}
                    className="w-full rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Email Address
                  </Button>
                </div>
              </div>
            </div>

            {/* School Information Widget */}
            {user.school && (
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  School Information
                </h3>

                <div className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700/30 dark:to-neutral-800/30 border border-neutral-200 dark:border-neutral-600 rounded-2xl">
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">School Name</label>
                  <p className="text-neutral-900 dark:text-neutral-100 font-medium mt-2">{user.school.name}</p>
                </div>
              </div>
            )}

            {/* Account Timeline Widget */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-2xl">
                  <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                Account Timeline
              </h3>

              <div className="space-y-6">
                {/* Member Since */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 border-4 border-white dark:border-neutral-800 ring-2 ring-teal-200 dark:ring-teal-900/50"></div>
                    {user.updatedAt && <div className="w-1 h-12 bg-gradient-to-b from-teal-300 to-teal-400 dark:from-teal-700 dark:to-teal-800 my-2 rounded-full"></div>}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Member Since</p>
                    <p className="text-neutral-900 dark:text-neutral-100 font-semibold mt-1">{formatDate(user.createdAt)}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Account creation date</p>
                  </div>
                </div>

                {/* Last Updated */}
                {user.updatedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 border-4 border-white dark:border-neutral-800 ring-2 ring-teal-200 dark:ring-teal-900/50"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Last Updated</p>
                      <p className="text-neutral-900 dark:text-neutral-100 font-semibold mt-1">{formatDate(user.updatedAt)}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Profile last modified</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings Widget */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-2xl">
                  <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                Account Settings
              </h3>

              <div className="space-y-3">
                <Button className="w-full inline-flex justify-start items-center text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-700/50 box-border border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-700 font-medium rounded-xl text-sm px-4 py-3 transition-all duration-200">
                  <Lock className="w-4 h-4 me-2" />
                  Change Password
                </Button>
                <Button className="w-full inline-flex justify-start items-center text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-700/50 box-border border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-700 font-medium rounded-xl text-sm px-4 py-3 transition-all duration-200">
                  <Mail className="w-4 h-4 me-2" />
                  Update Email Address
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 rounded-2xl">
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                Danger Zone
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-6">Actions in this section cannot be undone. Please proceed with caution.</p>
              <Button 
                onClick={handleLogout}
                className="inline-flex items-center text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 border border-transparent focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-xl text-sm px-6 py-3 transition-all duration-200"
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
