"use client"

import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import type { Lecture } from "@/types/course"

interface CreateLectureModalProps {
  moduleId: string
  moduleTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onLectureCreated?: (lecture: Lecture) => void
  existingLecturesCount?: number
}

export function CreateLectureModal({
  moduleId,
  moduleTitle,
  open,
  onOpenChange,
  onLectureCreated,
  existingLecturesCount = 0,
}: CreateLectureModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    index: existingLecturesCount + 1,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newLecture = await apiClient.createLecture(moduleId, {
        title: formData.title,
        index: formData.index,
      })

      toast.success("Lecture created successfully!")
      onLectureCreated?.(newLecture)
      
      // Reset form
      setFormData({
        title: "",
        index: existingLecturesCount + 2,
      })
      
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to create lecture:", error)
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create lecture. Please try again."
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
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create New Lecture</SheetTitle>
          <SheetDescription>
            {moduleTitle && (
              <span className="block mb-2">
                Add a new lecture to <strong>{moduleTitle}</strong>
              </span>
            )}
            Lectures are individual learning units within a module. You can add content to lectures after creation.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold">
                Lecture Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Variables and Data Types"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                className="mt-2 rounded-lg"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a descriptive title for this lecture
              </p>
            </div>

            <div>
              <Label htmlFor="index" className="text-sm font-semibold">
                Lecture Order
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
                The position of this lecture in the module (1 = first lecture)
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lecture
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

