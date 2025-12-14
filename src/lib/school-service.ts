import { apiClient } from "@/lib/api"
import type { School } from "@/lib/types"
import {
  DEFAULT_SCHOOL_CACHE_TTL_MS,
  getCachedSchools,
  hasCachedAccessToken,
  isSchoolCacheFresh,
  markSchoolCacheStale,
  mergeCachedSchools,
  removeSchoolFromCache,
  setCachedSchools,
} from "@/lib/school-store"

export async function fetchSchoolsFromServer(): Promise<School[]> {
  if (!hasCachedAccessToken()) {
    throw new Error("No access token available for fetching schools")
  }

  const schools = await apiClient.getSchools()
  setCachedSchools(schools)
  return schools
}

export async function getSchools(options: {
  forceRefresh?: boolean
  ttlMs?: number
} = {}): Promise<{ schools: School[]; fromCache: boolean; stale: boolean }> {
  const { forceRefresh = false, ttlMs = DEFAULT_SCHOOL_CACHE_TTL_MS } = options
  const cache = getCachedSchools()
  const cacheFresh = isSchoolCacheFresh(ttlMs)

  if (!forceRefresh && cache.schools.length > 0 && cacheFresh) {
    return { schools: cache.schools, fromCache: true, stale: false }
  }

  if (!forceRefresh && cache.schools.length > 0 && !hasCachedAccessToken()) {
    return { schools: cache.schools, fromCache: true, stale: true }
  }

  try {
    const schools = await fetchSchoolsFromServer()
    return { schools, fromCache: false, stale: false }
  } catch (error: any) {
    // Don't log refresh token expiration errors - they're expected
    const isRefreshTokenExpired = (error as any)?.isRefreshTokenExpired
    if (!isRefreshTokenExpired) {
      console.warn("[SchoolService] Failed to refresh schools from server", error)
    }
    return {
      schools: cache.schools,
      fromCache: true,
      stale: !cacheFresh,
    }
  }
}

export function mergeSchoolsIntoCache(schools: School[]) {
  mergeCachedSchools(schools)
}

export function handleSchoolDeleted(schoolId: string) {
  removeSchoolFromCache(schoolId)
  markSchoolCacheStale()
}

