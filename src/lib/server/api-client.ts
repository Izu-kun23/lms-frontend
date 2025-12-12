import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://lmsbackend-dev.up.railway.app/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: string | FormData
  headers?: Record<string, string>
  requireAuth?: boolean
  cache?: RequestCache
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    requireAuth = true,
    cache = "no-store",
  } = options

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  }

  // Add authentication token from cookies if required
  if (requireAuth) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) {
      throw new ApiError(401, "Authentication required")
    }

    requestHeaders.Authorization = `Bearer ${accessToken}`
  }

  // Remove Content-Type for FormData
  if (body instanceof FormData) {
    delete requestHeaders["Content-Type"]
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body,
      cache,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || `API request failed: ${response.statusText}`,
        data
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw new ApiError(500, `Network error: ${error.message}`)
    }

    throw new ApiError(500, "Unknown error occurred")
  }
}

// Helper function for GET requests
export async function apiGet<T>(endpoint: string, options?: Omit<ApiFetchOptions, "method" | "body">): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: "GET" })
}

// Helper function for POST requests
export async function apiPost<T>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiFetchOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

// Helper function for PUT requests
export async function apiPut<T>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiFetchOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

// Helper function for DELETE requests
export async function apiDelete<T>(
  endpoint: string,
  options?: Omit<ApiFetchOptions, "method" | "body">
): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: "DELETE" })
}

