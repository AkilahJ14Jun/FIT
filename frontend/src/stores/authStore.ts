import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  login: (user: { name: string; email: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: true, // Default to true for single-user system
  user: { name: 'Admin', email: 'admin@fishtrader.com' },
  login: user => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}))
