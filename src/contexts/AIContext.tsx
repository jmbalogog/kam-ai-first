import { createContext, useState, useCallback, type ReactNode } from 'react'

const MAX_REQUESTS = 10
const STORAGE_KEY = 'kam_ai_count'

interface AIContextType {
  requestCount: number
  maxRequests: number
  hasReachedLimit: boolean
  remainingRequests: number
  incrementCount: () => void
}

function getStoredCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return parseInt(stored, 10) || 0
  } catch {
    // ignore
  }
  return 0
}

export const AIContext = createContext<AIContextType | null>(null)

export function AIProvider({ children }: { children: ReactNode }) {
  const [requestCount, setRequestCount] = useState(getStoredCount)

  const incrementCount = useCallback(() => {
    setRequestCount((prev) => {
      const next = prev + 1
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const hasReachedLimit = requestCount >= MAX_REQUESTS
  const remainingRequests = Math.max(0, MAX_REQUESTS - requestCount)

  return (
    <AIContext.Provider
      value={{
        requestCount,
        maxRequests: MAX_REQUESTS,
        hasReachedLimit,
        remainingRequests,
        incrementCount,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}
