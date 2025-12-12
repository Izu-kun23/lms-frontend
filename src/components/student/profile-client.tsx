"use client"

import { useState } from "react"
import Image from "next/image"
import { User } from "@/lib/types"
import { Plus } from "lucide-react"
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

interface ProfileClientProps {
  user: User
}

export function ProfileClient({ user }: ProfileClientProps) {
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
    <div className="min-h-screen bg-white">
      {/* Subtle Top Accent */}
      <div className="h-1 bg-brand"></div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/avatar.png"
              alt={`${user.firstName} ${user.lastName}`}
              width={64}
              height={64}
              className="rounded-full border border-gray-200 object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        <div className="border-t pt-8 space-y-10">
          {/* Personal Info */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <Label className="mb-2 block">Full Name</Label>
                <Input
                  value={formData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              {/* Nickname */}
              <div>
                <Label className="mb-2 block">Nick Name</Label>
                <Input
                  value={formData.nickName}
                  disabled={!isEditing}
                  onChange={(e) => handleInputChange("nickName", e.target.value)}
                />
              </div>

              {/* Gender */}
              <div>
                <Label className="mb-2 block">Gender</Label>
                <Select
                  value={formData.gender}
                  disabled={!isEditing}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <Label className="mb-2 block">Language</Label>
                <Select
                  value={formData.language}
                  disabled={!isEditing}
                  onValueChange={(value) => handleInputChange("language", value)}
                >
                  <SelectTrigger>
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
              </div>

              {/* Country */}
              <div>
                <Label className="mb-2 block">Country</Label>
                <Select
                  value={formData.country}
                  disabled={!isEditing}
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger>
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
              </div>

              {/* Timezone */}
              <div>
                <Label className="mb-2 block">Time Zone</Label>
                <Select
                  value={formData.timeZone}
                  disabled={!isEditing}
                  onValueChange={(value) => handleInputChange("timeZone", value)}
                >
                  <SelectTrigger>
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
              </div>
            </div>
          </section>

          {/* Emails Section */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Email Address</h2>

            <div className="space-y-4">
              {emails.map((item, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <p className="font-medium text-gray-900">{item.email}</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(item.addedAt)}</p>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={handleAddEmail}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Email Address
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}