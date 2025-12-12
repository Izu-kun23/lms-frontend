import axios, { AxiosInstance, AxiosError } from "axios"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  School,
  User,
  GlobalStats,
  SystemHealth,
  ApiResponse,
  PaginatedResponse,
  Course,
  CourseProgress,
  ResumeData,
  Assignment,
  AssignmentSubmission,
  MessageThread,
  Message,
} from "./types"
import type { Lecture } from "@/types/course"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://lmsbackend-dev.up.railway.app/api"

class ApiClient {
  private client: AxiosInstance
  private refreshTokenPromise: Promise<string> | null = null
  private readonly schoolListParams = { page: 1, limit: 100 }

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 seconds - increased for better reliability on slow connections/hosting
    })

    this.setupInterceptors()
  }

  private normalizeSchoolsResponse(data: any): School[] {
    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.data)) {
      return data.data as School[]
    }

    if (Array.isArray(data?.items)) {
      return data.items as School[]
    }

    if (Array.isArray(data?.schools)) {
      return data.schools as School[]
    }

    if (data?.data?.items && Array.isArray(data.data.items)) {
      return data.data.items as School[]
    }

    if (data?.results && Array.isArray(data.results)) {
      return data.results as School[]
    }

    return []
  }

  private setupInterceptors() {
    // Request interceptor - attach auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // If error is 401 and not already trying to refresh
        // Skip token refresh for auth endpoints (login, register, forgot-password, refresh)
        const isAuthEndpoint = originalRequest.url?.includes("/auth/login") || 
                               originalRequest.url?.includes("/auth/register") ||
                               originalRequest.url?.includes("/auth/forgot-password") ||
                               originalRequest.url?.includes("/auth/refresh")
        
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          const storedRefreshToken = this.getRefreshToken()
          if (!storedRefreshToken) {
            this.clearTokens()
            return Promise.reject(error)
          }

          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError: any) {
            // Refresh failed - clear tokens and handle gracefully
            this.clearTokens()
            
            // If refresh token is invalid/expired, don't try to redirect on auth pages
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname
              const isAuthPage = currentPath.includes("/login") || 
                                currentPath.includes("/signup") || 
                                currentPath.includes("/onboarding") ||
                                currentPath.includes("/forgot-password")
              
              // Only redirect if we're not on an auth page and not already handling the error
              if (!isAuthPage && !originalRequest._skipRedirect) {
                // Set flag to prevent multiple redirects
                originalRequest._skipRedirect = true
                window.location.href = "/login"
              }
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refreshToken")
  }

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    
    // Also set cookies for server-side API access
    // Set cookie with 7 days expiry (same as typical refresh token)
    const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`
  }

  clearTokens() {
    if (typeof window === "undefined") return
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    
    // Clear cookies
    document.cookie = "accessToken=; path=/; max-age=0"
    document.cookie = "refreshToken=; path=/; max-age=0"
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }

    this.refreshTokenPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            // Don't retry refresh token calls
            timeout: 10000,
          }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        if (!accessToken) {
          throw new Error("No access token received from refresh")
        }

        this.setTokens(accessToken, newRefreshToken || refreshToken)

        return accessToken
      } catch (error: any) {
        // If refresh token is invalid/expired (401), clear tokens
        if (error.response?.status === 401) {
          this.clearTokens()
          throw new Error("Refresh token expired. Please login again.")
        }
        
        // Handle other errors
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          throw new Error("Token refresh timed out. Please try again.")
        }
        
        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
          throw new Error("Network error during token refresh. Please check your connection.")
        }
        
        throw error
      } finally {
        this.refreshTokenPromise = null
      }
    })()

    return this.refreshTokenPromise
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // If schoolId is provided, use select-school endpoint directly
      if (credentials.schoolId) {
        console.log("[API] Attempting login with school selection:", {
          endpoint: "/auth/login/select-school",
          email: credentials.email,
          hasSchoolId: !!credentials.schoolId,
        })
        
        const response = await this.client.post<LoginResponse>(
          "/auth/login/select-school",
          {
            email: credentials.email,
            password: credentials.password,
            schoolId: credentials.schoolId,
          }
        )
        const { accessToken, refreshToken } = response.data
        if (accessToken && refreshToken) {
          this.setTokens(accessToken, refreshToken)
        }
        return response.data
      }

      // Otherwise, try regular login first
      console.log("[API] Attempting regular login:", {
        endpoint: "/auth/login",
        email: credentials.email,
      })
      
      const response = await this.client.post<LoginResponse>(
        "/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      )

      // If response has tokens, login is complete
      if (response.data.accessToken && response.data.refreshToken) {
        this.setTokens(response.data.accessToken, response.data.refreshToken)
        return response.data
      }

      // If response has schools array but no tokens, user needs to select a school
      // Return the response so the UI can handle school selection
      return response.data
    } catch (error: any) {
      console.error("[API] Login error:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      })
      
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('Request timed out. The server may be slow to respond. Please try again.')
      }
      
      // Handle network errors
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        const fullUrl = error.config?.baseURL 
          ? `${error.config.baseURL}${error.config.url || '/auth/login'}`
          : 'the API endpoint'
        throw new Error(`Network error. Could not reach ${fullUrl}. Please check your internet connection and ensure the API server is running.`)
      }
      
      // Extract error message from API response
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials and try again.')
      }
      
      throw error
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.client.post<RegisterResponse>("/auth/register", data)
      const { accessToken, refreshToken } = response.data
      this.setTokens(accessToken, refreshToken)
      return response.data
    } catch (error: any) {
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw new Error('Request timed out. The server may be slow to respond. Please try again.')
      }
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post("/auth/logout")
    } finally {
      this.clearTokens()
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await this.client.post<{ message: string }>("/auth/forgot-password", { email })
    return response.data
  }

  // Schools
  async getSchools(): Promise<School[]> {
    const response = await this.client.get("/schools", {
      params: this.schoolListParams,
    })
    return this.normalizeSchoolsResponse(response.data)
  }

  async getSchool(id: string): Promise<School> {
    const response = await this.client.get<School>(`/schools/${id}`)
    return response.data
  }

  async getSchoolBySlug(slug: string): Promise<School> {
    const response = await this.client.get<School>(`/schools/slug/${slug}`)
    return response.data
  }

  async createSchool(data: CreateSchoolRequest): Promise<School> {
    const response = await this.client.post<School>("/schools", data)
    return response.data
  }

  async updateSchool(id: string, data: UpdateSchoolRequest): Promise<School> {
    const response = await this.client.put<School>(`/schools/${id}`, data)
    return response.data
  }

  async deleteSchool(id: string): Promise<void> {
    await this.client.delete(`/schools/${id}`)
  }

  async getSchoolStats(id: string): Promise<any> {
    const response = await this.client.get(`/schools/${id}/stats`)
    return response.data
  }

  // Admin & Stats
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await this.client.get<GlobalStats>("/admin/stats")
    return response.data
  }

  async getUserStats(schoolId?: string): Promise<any> {
    const url = schoolId ? `/admin/stats/users?schoolId=${schoolId}` : "/admin/stats/users"
    const response = await this.client.get(url)
    return response.data
  }

  async getCourseStats(schoolId?: string): Promise<any> {
    const url = schoolId ? `/admin/stats/courses?schoolId=${schoolId}` : "/admin/stats/courses"
    const response = await this.client.get(url)
    return response.data
  }

  async getAllUsers(schoolId?: string): Promise<User[]> {
    const url = schoolId === "all" ? `/admin/users?schoolId=all` : schoolId ? `/admin/users?schoolId=${schoolId}` : "/admin/users"
    const response = await this.client.get<User[]>(url)
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>("/users/me")
    return response.data
  }

  async getUser(id: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`)
    return response.data
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await this.client.put<User>("/users/profile", data)
    return response.data
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const response = await this.client.put<User>(`/admin/users/${id}/role`, { role })
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/admin/users/${id}`)
  }

  async createEnrollment(userId: string, courseId: string): Promise<any> {
    const response = await this.client.post("/admin/enrollments", { userId, courseId })
    return response.data
  }

  // Courses
  async getCourses(schoolId?: string, instructorId?: string): Promise<Course[]> {
    const params = new URLSearchParams()
    if (schoolId) {
      params.append("schoolId", schoolId)
    }
    if (instructorId) {
      params.append("instructorId", instructorId)
    }
    params.append("include", "instructor")
    const url = `/courses${params.toString() ? `?${params.toString()}` : ""}`
    const response = await this.client.get<Course[]>(url)
    return response.data
  }

  async getCourse(id: string): Promise<Course> {
    const response = await this.client.get<Course>(`/courses/${id}?include=instructor`)
    return response.data
  }

  async getModuleLectures(moduleId: string): Promise<Lecture[]> {
    const response = await this.client.get<Array<{
      id: string
      title: string
      index: number
      moduleId: string
      description?: string
      type?: "TEXT" | "VIDEO" | "AUDIO" | "FILE" | "LIVE"
      createdAt?: string
      updatedAt?: string
    }>>(`/courses/modules/${moduleId}/lectures`)
    // Map API response (with 'index') to Lecture type (with 'order')
    return response.data.map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      moduleId: lecture.moduleId,
      order: lecture.index,
      description: lecture.description,
      type: lecture.type || "TEXT",
      createdAt: lecture.createdAt || new Date().toISOString(),
      updatedAt: lecture.updatedAt || new Date().toISOString(),
    }))
  }

  // Progress
  async getMyProgress(): Promise<CourseProgress[]> {
    const response = await this.client.get<CourseProgress[]>("/progress/me")
    return response.data
  }

  async getResumeData(): Promise<ResumeData[]> {
    const response = await this.client.get<ResumeData[]>("/progress/resume")
    return response.data
  }

  async updateLectureProgress(lectureId: string, completed: boolean): Promise<any> {
    const response = await this.client.put(`/progress/lectures/${lectureId}`, { completed })
    return response.data
  }

  async getCourseProgress(courseId: string): Promise<any> {
    const response = await this.client.get(`/progress/courses/${courseId}`)
    return response.data
  }

  // Assignments
  async getAssignments(courseId: string): Promise<Assignment[]> {
    const response = await this.client.get<Assignment[]>(`/assignments/courses/${courseId}`)
    return response.data
  }

  async getAssignment(id: string): Promise<Assignment> {
    const response = await this.client.get<Assignment>(`/assignments/${id}`)
    return response.data
  }

  async getMySubmissions(assignmentId?: string): Promise<AssignmentSubmission[]> {
    const url = assignmentId ? `/assignments/${assignmentId}/submissions` : "/assignments/submissions"
    const response = await this.client.get<AssignmentSubmission[]>(url)
    return response.data
  }

  async submitAssignment(assignmentId: string, data: { fileUrl?: string; text?: string }): Promise<AssignmentSubmission> {
    const response = await this.client.post<AssignmentSubmission>(`/assignments/${assignmentId}/submit`, data)
    return response.data
  }

  // Messages
  async getThreads(courseId?: string): Promise<MessageThread[]> {
    const url = courseId ? `/messaging/threads?courseId=${courseId}` : "/messaging/threads"
    const response = await this.client.get<MessageThread[]>(url)
    return response.data
  }

  async getThread(id: string): Promise<MessageThread> {
    const response = await this.client.get<MessageThread>(`/messaging/threads/${id}`)
    return response.data
  }

  async createThread(data: { courseId: string; title: string }): Promise<MessageThread> {
    const response = await this.client.post<MessageThread>("/messaging/threads", data)
    return response.data
  }

  async getMessages(threadId: string): Promise<Message[]> {
    const response = await this.client.get<Message[]>(`/messaging/threads/${threadId}/messages`)
    return response.data
  }

  async sendMessage(threadId: string, body: string): Promise<Message> {
    const response = await this.client.post<Message>(`/messaging/threads/${threadId}/messages`, { body })
    return response.data
  }

  // Health
  async getHealth(): Promise<SystemHealth> {
    const response = await this.client.get<SystemHealth>("/health")
    return response.data
  }

  async getGlobalHealth(): Promise<any> {
    const response = await this.client.get("/health/global")
    return response.data
  }

  // Generic HTTP methods for flexibility
  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export for direct use in components
export default apiClient

