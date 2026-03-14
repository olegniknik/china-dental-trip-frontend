import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getToken, setToken as saveToken, removeToken } from './auth'

type AuthContextValue = {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken)
  const setToken = useCallback((t: string) => {
    saveToken(t)
    setTokenState(t)
  }, [])
  const logout = useCallback(() => {
    removeToken()
    setTokenState(null)
  }, [])
  return <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth used outside AuthProvider')
  return ctx
}
