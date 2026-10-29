import type { Bookings } from '@/features/booking/rules'

/** Who is signed in. The phone number is the unique user id. */
export interface AuthSlice {
  userId: string | null
  displayName: string | null
  /** Returns an error message, or null when the user is signed in. */
  login: (nameOrEmail: string, phone: string) => string | null
  logout: () => void
}

/** The open stadium, its bookings, and the seats the user has picked but not yet confirmed. */
export interface BookingSlice {
  venueId: string | null
  bookings: Bookings
  selectedSeatIds: string[]
  openVenue: (venueId: string) => void
  closeVenue: () => void
  toggleSeat: (seatId: string) => void
  deselectSeat: (seatId: string) => void
  confirmSelection: () => void
  releaseSeat: (seatId: string) => void
}

/** Short-lived UI state for the 3D stadium screen. */
export interface ViewSlice {
  hoveredSeatId: string | null
  /** The user has clicked the stadium to go inside from the spinning intro view. */
  hasEntered: boolean
  /** The stand the camera is focused on (highlighted in the UI). */
  focusedSector: number | null
  /** The seat the user is currently looking from, if any. */
  seatViewId: string | null
  toast: string | null
  setHoveredSeat: (seatId: string | null) => void
  enterStadium: () => void
  setFocusedSector: (sector: number | null) => void
  setSeatView: (seatId: string | null) => void
  showToast: (message: string) => void
  resetView: () => void
}

export type AppState = AuthSlice & BookingSlice & ViewSlice
