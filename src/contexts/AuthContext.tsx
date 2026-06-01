import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { AuthUser } from '../types/auth'
import * as authService from '../services/auth'
import { ApiError } from '../services/api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tmc_token'))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Restore user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tmc_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('tmc_user')
        localStorage.removeItem('tmc_token')
      }
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.login(username, password)
      localStorage.setItem('tmc_token', res.token)
      localStorage.setItem('tmc_user', JSON.stringify(res.user))
      setToken(res.token)
      setUser(res.user)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro de conexão com o servidor.')
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // token may already be invalid
    } finally {
      localStorage.removeItem('tmc_token')
      localStorage.removeItem('tmc_user')
      setToken(null)
      setUser(null)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
