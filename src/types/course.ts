import type { Course } from "@/lib/types"

export interface Module {
  id: string
  courseId: string
  course?: Course
  title: string
  description?: string
  order: number
  createdAt: string
  updatedAt: string
  lectures?: Lecture[]
}

export interface Lecture {
  id: string
  moduleId: string
  module?: Module
  title: string
  description?: string
  type: "TEXT" | "VIDEO" | "AUDIO" | "FILE" | "LIVE"
  order: number
  createdAt: string
  updatedAt: string
  contents?: Content[]
}

export type ContentType = "TEXT" | "VIDEO" | "AUDIO" | "FILE" | "LIVE"

export interface Content {
  id: string
  lectureId: string
  lecture?: Lecture
  type: ContentType
  text?: string
  mediaUrl?: string
  metadata?: Record<string, any>
  order: number
  createdAt: string
  updatedAt: string
}

export interface CourseWithModules extends Course {
  modules?: Module[]
}

export interface ModuleWithLectures extends Module {
  lectures?: Lecture[]
}

export interface LectureWithContents extends Lecture {
  contents?: Content[]
}

// Request types
export interface CreateModuleInput {
  title: string
  description?: string
  order?: number
}

export interface UpdateModuleInput {
  title?: string
  description?: string
  order?: number
}

export interface CreateLectureInput {
  title: string
  description?: string
  type: ContentType
  order?: number
}

export interface UpdateLectureInput {
  title?: string
  description?: string
  type?: ContentType
  order?: number
}

export interface CreateContentInput {
  type: ContentType
  text?: string
  mediaUrl?: string
  metadata?: Record<string, any>
  order?: number
}

export interface UpdateContentInput {
  type?: ContentType
  text?: string
  mediaUrl?: string
  metadata?: Record<string, any>
  order?: number
}

