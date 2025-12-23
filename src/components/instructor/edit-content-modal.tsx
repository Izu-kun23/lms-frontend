"use client"

import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import type { Content, ContentType } from "@/types/course"

interface EditContentModalProps {
  content: Content
  open: boolean
  onOpenChange: (open: boolean) => void
  onContentUpdated?: (content: Content) => void
}

export function EditContentModal({
  content,
  open,
  onOpenChange,
  onContentUpdated,
}: EditContentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    kind: content.type,
    text: content.text || "",
    mediaUrl: content.mediaUrl || "",
    index: content.order,
    metadata: content.metadata ? JSON.stringify(content.metadata, null, 2) : "",
  })

  // Update form data when content changes
  useEffect(() => {
    if (content) {
      setFormData({
        kind: content.type,
        text: content.text || "",
        mediaUrl: content.mediaUrl || "",
        index: content.order,
        metadata: content.metadata ? JSON.stringify(content.metadata, null, 2) : "",
      })
    }
  }, [content, open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Parse metadata if provided
      let parsedMetadata: Record<string, any> | undefined
      if (formData.metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(formData.metadata)
        } catch {
          toast.error("Invalid JSON format for metadata")
          setIsSubmitting(false)
          return
        }
      }

      // Build request data based on content type
      const requestData: {
        kind?: ContentType
        text?: string
        mediaUrl?: string
        metadata?: Record<string, any>
        index?: number
      } = {}

      // Always include kind if it changed
      if (formData.kind !== content.type) {
        requestData.kind = formData.kind
      }

      // For TEXT content, text is required
      if (formData.kind === "TEXT") {
        if (!formData.text.trim()) {
          toast.error("Text content is required for TEXT type")
          setIsSubmitting(false)
          return
        }
        requestData.text = formData.text.trim()
      } else if (formData.text.trim() && formData.text !== content.text) {
        // Allow text for other types if it exists
        requestData.text = formData.text.trim()
      }

      // For VIDEO, AUDIO, FILE - mediaUrl is required
      if (formData.kind === "VIDEO" || formData.kind === "AUDIO" || formData.kind === "FILE") {
        if (!formData.mediaUrl.trim()) {
          toast.error("Media URL is required for this content type")
          setIsSubmitting(false)
          return
        }
        requestData.mediaUrl = formData.mediaUrl.trim()
      } else if (formData.mediaUrl.trim() && formData.mediaUrl !== content.mediaUrl) {
        // Allow mediaUrl for other types if it exists
        requestData.mediaUrl = formData.mediaUrl.trim()
      }

      // For LIVE - might not need mediaUrl
      if (formData.kind === "LIVE" && formData.mediaUrl.trim()) {
        requestData.mediaUrl = formData.mediaUrl.trim()
      }

      // Only include metadata if provided and not TEXT
      if (formData.kind !== "TEXT" && parsedMetadata && Object.keys(parsedMetadata).length > 0) {
        requestData.metadata = parsedMetadata
      }

      // Include index if it changed
      if (formData.index !== content.order) {
        requestData.index = formData.index
      }

      const updatedContent = await apiClient.updateLectureContent(content.id, requestData)

      toast.success("Content updated successfully!")
      onContentUpdated?.(updatedContent)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to update content:", error)
      console.error("Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      })
      
      let errorMessage = "Failed to update content. Please try again."
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Content</SheetTitle>
          <SheetDescription>
            Update the content details. Changes will be saved immediately.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="kind" className="text-sm font-semibold">
                Content Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.kind}
                onValueChange={(value) => handleInputChange("kind", value as ContentType)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="mt-2 rounded-lg">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                  <SelectItem value="FILE">File</SelectItem>
                  <SelectItem value="LIVE">Live Session</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Select the type of content
              </p>
            </div>

            {formData.kind === "TEXT" && (
              <div>
                <Label htmlFor="text" className="text-sm font-semibold">
                  Text Content <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="text"
                  rows={6}
                  value={formData.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  required={formData.kind === "TEXT"}
                  placeholder="Enter your text content here..."
                  className="mt-2 flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {(formData.kind === "VIDEO" || formData.kind === "AUDIO" || formData.kind === "FILE" || formData.kind === "LIVE") && (
              <div>
                <Label htmlFor="mediaUrl" className="text-sm font-semibold">
                  Media URL {formData.kind !== "LIVE" && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="mediaUrl"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={formData.mediaUrl}
                  onChange={(e) => handleInputChange("mediaUrl", e.target.value)}
                  required={formData.kind !== "LIVE"}
                  className="mt-2 rounded-lg"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the URL for your {formData.kind.toLowerCase()} content
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="index" className="text-sm font-semibold">
                Content Order
              </Label>
              <Input
                id="index"
                type="number"
                min="1"
                value={formData.index}
                onChange={(e) => handleInputChange("index", parseInt(e.target.value) || 1)}
                className="mt-2 rounded-lg"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                The position of this content in the lecture (1 = first content)
              </p>
            </div>

            {formData.kind !== "TEXT" && (
              <div>
                <Label htmlFor="metadata" className="text-sm font-semibold">
                  Metadata (JSON, optional)
                </Label>
                <textarea
                  id="metadata"
                  rows={4}
                  value={formData.metadata}
                  onChange={(e) => handleInputChange("metadata", e.target.value)}
                  placeholder='{"duration": 300, "quality": "HD"}'
                  className="mt-2 flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional JSON metadata (e.g., duration, quality, etc.)
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (formData.kind === "TEXT" && !formData.text.trim()) ||
                ((formData.kind === "VIDEO" || formData.kind === "AUDIO" || formData.kind === "FILE") && !formData.mediaUrl.trim())
              }
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Content
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

