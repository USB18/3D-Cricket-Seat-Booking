import type { StateCreator } from 'zustand'
import type { AppState, ViewSlice } from './types'

const TOAST_DURATION_MS = 3200
let toastTimer: number | undefined

export const createViewSlice: StateCreator<AppState, [], [], ViewSlice> = (set, get) => ({
  hoveredSeatId: null,
  hasEntered: false,
  focusedSector: null,
  seatViewId: null,
  toast: null,

  setHoveredSeat: (seatId) => {
    if (get().hoveredSeatId !== seatId) set({ hoveredSeatId: seatId })
  },
  enterStadium: () => set({ hasEntered: true }),
  setFocusedSector: (sector) => set({ focusedSector: sector }),
  setSeatView: (seatId) => set({ seatViewId: seatId }),

  showToast: (message) => {
    set({ toast: message })
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => set({ toast: null }), TOAST_DURATION_MS)
  },

  resetView: () => set({ hoveredSeatId: null, hasEntered: false, focusedSector: null, seatViewId: null }),
})
