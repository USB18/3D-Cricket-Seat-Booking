import { create } from 'zustand'
import { startBookingSync } from '@/features/booking/syncAcrossTabs'
import { createAuthSlice } from './authSlice'
import { createBookingSlice } from './bookingSlice'
import { createViewSlice } from './viewSlice'
import type { AppState } from './types'

/** One app-wide store, assembled from three focused slices. */
export const useStore = create<AppState>()((...args) => ({
  ...createAuthSlice(...args),
  ...createBookingSlice(...args),
  ...createViewSlice(...args),
}))

startBookingSync(useStore)
