import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface AdminUser {
  username: string
  passwordHash: string
  createdAt: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  currentAdmin: string | null
  isRoot: boolean
  admins: AdminUser[]
  login: (username: string, password: string) => boolean
  logout: () => void
  addAdmin: (username: string, password: string) => boolean
  removeAdmin: (username: string) => void
}

const AuthCtx = createContext<AuthContextValue | null>(null)

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(36)
}

const defaultAdminHash = simpleHash('aventurine2026')

function getDefaultAdmins(): AdminUser[] {
  return [{ username: 'admin', passwordHash: defaultAdminHash, createdAt: '2026-06-09' }]
}

function loadAdmins(): AdminUser[] {
  try {
    const raw = localStorage.getItem('aventurine_admins')
    if (raw) {
      const saved = JSON.parse(raw) as AdminUser[]
      if (saved.length > 0) return saved
    }
  } catch { /* ignore */ }
  return getDefaultAdmins()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admins, setAdmins] = useState<AdminUser[]>(loadAdmins)
  const [currentAdmin, setCurrentAdmin] = useState<string | null>(() => {
    return sessionStorage.getItem('aventurine_admin_session')
  })

  useEffect(() => {
    localStorage.setItem('aventurine_admins', JSON.stringify(admins))
  }, [admins])

  const login = useCallback((username: string, password: string): boolean => {
    const admin = admins.find(a => a.username.toLowerCase() === username.toLowerCase())
    if (!admin) return false
    if (admin.passwordHash !== simpleHash(password)) return false
    setCurrentAdmin(username)
    sessionStorage.setItem('aventurine_admin_session', username)
    return true
  }, [admins])

  const logout = useCallback(() => {
    setCurrentAdmin(null)
    sessionStorage.removeItem('aventurine_admin_session')
  }, [])

  const addAdmin = useCallback((username: string, password: string): boolean => {
    // Only root admin can add other admins
    if (currentAdmin !== 'admin') return false
    if (admins.find(a => a.username.toLowerCase() === username.toLowerCase())) return false
    const newAdmin: AdminUser = {
      username,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setAdmins(prev => [...prev, newAdmin])
    return true
  }, [admins, currentAdmin])

  const removeAdmin = useCallback((username: string) => {
    // Only root admin can remove admins
    if (currentAdmin !== 'admin') return
    if (username === 'admin') return // cannot remove the root admin
    setAdmins(prev => prev.filter(a => a.username !== username))
  }, [currentAdmin])

  return (
    <AuthCtx.Provider value={{ isLoggedIn: currentAdmin !== null, currentAdmin, isRoot: currentAdmin === 'admin', admins, login, logout, addAdmin, removeAdmin }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
