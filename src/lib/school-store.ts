import type { School } from "@/lib/types"

const SCHOOLS_CACHE_KEY = "schools"
const SCHOOLS_META_KEY = "schools:meta"
export const DEFAULT_SCHOOL_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface SchoolCacheMeta {
  lastUpdated: number
}

const isBrowser = typeof window !== "undefined"

function readMeta(): SchoolCacheMeta | null {
  if (!isBrowser) return null
  try {
    const raw = localStorage.getItem(SCHOOLS_META_KEY)
    return raw ? (JSON.parse(raw) as SchoolCacheMeta) : null
  } catch (error) {
    console.warn("[SchoolStore] Failed to read cache metadata", error)
    return null
  }
}

function writeMeta(meta: SchoolCacheMeta | null) {
  if (!isBrowser) return
  try {
    if (meta) {
      localStorage.setItem(SCHOOLS_META_KEY, JSON.stringify(meta))
    } else {
      localStorage.removeItem(SCHOOLS_META_KEY)
    }
  } catch (error) {
    console.warn("[SchoolStore] Failed to write cache metadata", error)
  }
}

export function getCachedSchools(): {
  schools: School[]
  lastUpdated: number | null
} {
  if (!isBrowser) return { schools: [], lastUpdated: null }

  try {
    const raw = localStorage.getItem(SCHOOLS_CACHE_KEY)
    const schools = raw ? (JSON.parse(raw) as School[]) : []
    const meta = readMeta()
    return { schools, lastUpdated: meta?.lastUpdated ?? null }
  } catch (error) {
    console.warn("[SchoolStore] Failed to read cached schools", error)
    return { schools: [], lastUpdated: null }
  }
}

function dedupeSchools(schools: School[]): School[] {
  const seen = new Map<string, School>()
  schools.forEach((school) => {
    if (school?.id) {
      seen.set(school.id, {
        id: school.id,
        name: school.name,
        slug: school.slug,
        domain: school.domain,
        description: school.description,
        settings: school.settings,
        isActive: school.isActive,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
      } as School)
    }
  })
  return Array.from(seen.values())
}

export function setCachedSchools(schools: School[]) {
  if (!isBrowser) return

  try {
    const sanitized = dedupeSchools(schools)
    localStorage.setItem(SCHOOLS_CACHE_KEY, JSON.stringify(sanitized))
    writeMeta({ lastUpdated: Date.now() })
  } catch (error) {
    console.warn("[SchoolStore] Failed to cache schools", error)
  }
}

export function mergeCachedSchools(schools: School[]) {
  if (!isBrowser || schools.length === 0) return
  const current = getCachedSchools().schools
  const merged = dedupeSchools([...current, ...schools])
  setCachedSchools(merged)
}

export function removeSchoolFromCache(id: string) {
  if (!isBrowser) return
  const { schools } = getCachedSchools()
  const filtered = schools.filter((school) => school.id !== id)
  setCachedSchools(filtered)
}

export function clearSchoolCache() {
  if (!isBrowser) return
  localStorage.removeItem(SCHOOLS_CACHE_KEY)
  writeMeta(null)
}

export function markSchoolCacheStale() {
  if (!isBrowser) return
  writeMeta({ lastUpdated: 0 })
}

export function isSchoolCacheFresh(ttlMs: number = DEFAULT_SCHOOL_CACHE_TTL_MS): boolean {
  const meta = readMeta()
  if (!meta?.lastUpdated) return false
  return Date.now() - meta.lastUpdated < ttlMs
}

export function hasCachedAccessToken(): boolean {
  if (!isBrowser) return false
  return !!localStorage.getItem("accessToken")
}

