import type { StateCreator } from 'zustand'
import { validateLogin } from '@/features/auth/validation'
import { sessionStore } from '@/shared/lib/storage'
import type { AppState, AuthSlice } from './types'

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set, get) => ({
  userId: sessionStore.getUserId(),
  displayName: sessionStore.getDisplayName(),

  login: (nameOrEmail, phone) => {
    const result = validateLogin(nameOrEmail, phone)
    if (!result.ok) return result.message

    sessionStore.setUserId(result.userId)
    sessionStore.setDisplayName(result.displayName)
    set({ userId: result.userId, displayName: result.displayName })
    get().closeVenue() // start from a clean slate
    return null
  },

  logout: () => {
    sessionStore.setUserId(null)
    sessionStore.setDisplayName(null)
    set({ userId: null, displayName: null })
    get().closeVenue()
  },
})
