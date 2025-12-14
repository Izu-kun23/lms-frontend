"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import type { User, LoginRequest, RegisterRequest } from "@/lib/types"
import { clearSchoolCache } from "@/lib/school-store"
import { fetchSchoolsFromServer, mergeSchoolsIntoCache } from "@/lib/school-service"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get user info from stored token
        const token = localStorage.getItem("accessToken")
        if (token) {
          try {
            // Try to fetch current user to validate token
            const currentUser = await apiClient.getCurrentUser()
            setUser(currentUser)
          } catch (error: any) {
            // Token might be invalid or expired, clear it silently
            // Don't log errors for 401s or refresh token expiration as they're expected when tokens expire
            const isRefreshTokenExpired = (error as any)?.isRefreshTokenExpired
            if (error.response?.status !== 401 && !isRefreshTokenExpired) {
              console.error("Auth check failed:", error)
            }
            apiClient.clearTokens()
            setUser(null)
          }
        } else {
          // No token, ensure user is null
          setUser(null)
        }
      } catch (error) {
        // Unexpected error during auth check
        console.error("Unexpected error during auth check:", error)
        apiClient.clearTokens()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const isProfileComplete = useCallback((user: User): boolean => {
    // Check if profile is complete
    // Profile is considered complete if firstName and lastName exist
    // studentId is optional
    return !!(user.firstName && user.lastName)
  }, [])

  const getRedirectPath = useCallback((user: User, skipProfileCheck = false) => {
    // Check if profile setup is needed (for students)
    if (!skipProfileCheck && user.role.toUpperCase() === "STUDENT" && !isProfileComplete(user)) {
      return "/student/profile-setup"
    }

    // Role-based redirect
    switch (user.role.toUpperCase()) {
      case "SUPER_ADMIN":
        return "/super-admin"
      case "ADMIN":
        return "/admin"
      case "INSTRUCTOR":
        return "/instructor/dashboard"
      case "STUDENT":
      default:
        return "/student/dashboard"
    }
  }, [isProfileComplete])

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials)
      
      // Handle MFA if required
      if (response.mfaRequired) {
        // TODO: Implement MFA flow
        throw new Error("Multi-factor authentication is required. This feature is not yet implemented.")
      }

      // If response has schools array but no accessToken, user needs to select a school
      if (response.schools && response.schools.length > 0 && !response.accessToken) {
        // Store schools and credentials for school selection
        mergeSchoolsIntoCache(response.schools)
        throw new Error("SCHOOL_SELECTION_REQUIRED") // Special error code for school selection
      }

      // If we have schools in response, merge them into cache
      if (response.schools) {
        mergeSchoolsIntoCache(response.schools)
      }

      // If no access token or user, something went wrong
      if (!response.accessToken || !response.user) {
        throw new Error("Login failed. Please try again.")
      }

      try {
        await fetchSchoolsFromServer()
      } catch (refreshError) {
        console.warn("[Auth] Could not refresh school cache after login", refreshError)
      }
      setUser(response.user)
      
      // Only allow STUDENT and INSTRUCTOR roles to login
      const role = response.user.role.toUpperCase()
      if (role !== "STUDENT" && role !== "INSTRUCTOR") {
        throw new Error("Access denied. Only students and instructors can login through this portal.")
      }
      
      // Show success toast
      const roleName = role === "STUDENT" ? "Student" : "Instructor"
      toast.success(`Welcome back, ${response.user.firstName}!`, {
        description: `Successfully logged in as ${roleName}`,
      })
      
      // Small delay to show toast before redirect
      setTimeout(() => {
        router.push(getRedirectPath(response.user))
      }, 500)
    } catch (error: any) {
      console.error("Login failed:", error)
      
      // Re-throw school selection error as-is
      if (error.message === "SCHOOL_SELECTION_REQUIRED") {
        throw error
      }
      
      // Check if it's a timeout error
      if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. The server may be slow to respond. Please check your connection and try again.')
      }
      // Check if it's a network error
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection and try again.')
      }
      // The error message should already be formatted by the API client
      throw error
    }
  }, [router, getRedirectPath, mergeSchoolsIntoCache, fetchSchoolsFromServer])

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await apiClient.register(data)
      if (response.schools) {
        mergeSchoolsIntoCache(response.schools)
      }

      try {
        await fetchSchoolsFromServer()
      } catch (refreshError) {
        console.warn("[Auth] Could not refresh school cache after registration", refreshError)
      }
      setUser(response.user)
      router.push(getRedirectPath(response.user))
    } catch (error: any) {
      console.error("Registration failed:", error)
      // Check if it's a timeout error
      if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
        throw new Error('Connection timeout. The server may be slow to respond. Please check your connection and try again.')
      }
      // Check if it's a network error
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection and try again.')
      }
      // Use the error message from the API client or fallback to default
      throw new Error(error.message || error.response?.data?.message || "Registration failed. Please try again.")
    }
  }, [router, getRedirectPath])

  const logout = useCallback(async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      apiClient.clearTokens()
      clearSchoolCache()
      router.push("/login")
    }
  }, [router])

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await apiClient.getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (error: any) {
      // Don't log refresh token expiration errors - they're expected when tokens expire
      const isRefreshTokenExpired = (error as any)?.isRefreshTokenExpired
      if (!isRefreshTokenExpired) {
        console.error("Failed to refresh user:", error)
      }
      // If refresh fails, user might be logged out
      apiClient.clearTokens()
      setUser(null)
      throw error
    }
  }, [])

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

