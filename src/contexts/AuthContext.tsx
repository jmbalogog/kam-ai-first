import { createContext, useState, useCallback, type ReactNode } from 'react'

interface AuthState {
  isAuthenticated: boolean
  userEmail: string | null
  validatedAt: number | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ valid: boolean; error?: string }>
  logout: () => void
}

const STORAGE_KEY = 'kam_auth'

function getStoredAuth(): AuthState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as AuthState
      if (parsed.isAuthenticated) return parsed
    }
  } catch {
    // ignore parse errors
  }
  return { isAuthenticated: false, userEmail: null, validatedAt: null }
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(getStoredAuth)

  const login = useCallback(async (email: string, password: string): Promise<{ valid: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return { valid: false, error: 'network' }
      }

      const data = await response.json() as { valid: boolean }

      if (data.valid) {
        const newAuth: AuthState = {
          isAuthenticated: true,
          userEmail: email,
          validatedAt: Date.now(),
        }
        setAuth(newAuth)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuth))
        return { valid: true }
      }

      return { valid: false, error: 'invalid' }
    } catch {
      return { valid: false, error: 'network' }
    }
  }, [])

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, userEmail: null, validatedAt: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
