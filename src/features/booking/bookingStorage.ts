import { persistentStore } from '@/shared/lib/storage'
import type { Bookings } from './rules'

/** Each stadium keeps its own bookings under its own key. */
export const bookingsStorageKey = (venueId: string) => `bookings:${venueId}`

export const readBookings = (venueId: string | null): Bookings =>
  venueId ? persistentStore.getJSON<Bookings>(bookingsStorageKey(venueId), {}) : {}

export const writeBookings = (venueId: string, bookings: Bookings) =>
  persistentStore.setJSON(bookingsStorageKey(venueId), bookings)
