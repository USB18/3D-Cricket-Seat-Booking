import { persistentStore } from '@/shared/lib/storage'
import type { AppState } from '@/store/types'
import { bookingsStorageKey, readBookings } from './bookingStorage'
import { findLostSeats } from './rules'

interface StoreLike {
  getState: () => AppState
  setState: (partial: Partial<AppState>) => void
}

/**
 * Keeps the open stadium in sync with bookings made in other tabs. If someone
 * books a seat the user has selected, that seat is dropped and the user is told.
 */
export function startBookingSync(store: StoreLike) {
  return persistentStore.subscribe((changedKey) => {
    const { userId, venueId, selectedSeatIds, showToast } = store.getState()
    if (!venueId || changedKey !== bookingsStorageKey(venueId)) return

    const bookings = readBookings(venueId)
    const lostSeats = findLostSeats(selectedSeatIds, bookings, userId)
    store.setState({
      bookings,
      selectedSeatIds: selectedSeatIds.filter((id) => !lostSeats.includes(id)),
    })
    if (lostSeats.length) {
      showToast(`${lostSeats.join(', ')} was just booked by another user. Please select another seat.`)
    }
  })
}
