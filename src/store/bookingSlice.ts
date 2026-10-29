import type { StateCreator } from 'zustand'
import { readBookings, writeBookings } from '@/features/booking/bookingStorage'
import { evaluateConfirm, evaluateToggle } from '@/features/booking/rules'
import { getStadiumLayout } from '@/features/stadium/layout/buildLayout'
import { MAX_SEATS_PER_USER } from '@/config/constants'
import type { AppState, BookingSlice } from './types'

export const createBookingSlice: StateCreator<AppState, [], [], BookingSlice> = (set, get) => ({
  venueId: null,
  bookings: {},
  selectedSeatIds: [],

  openVenue: (venueId) => {
    set({ venueId, bookings: readBookings(venueId), selectedSeatIds: [] })
    get().resetView()
  },

  closeVenue: () => {
    set({ venueId: null, bookings: {}, selectedSeatIds: [] })
    get().resetView()
  },

  toggleSeat: (seatId) => {
    const { userId, venueId, selectedSeatIds, showToast } = get()
    if (!userId || !venueId) return

    // Read fresh data: another tab may have booked seats since the last render.
    const bookings = readBookings(venueId)
    set({ bookings })

    const result = evaluateToggle({ seatId, userId, bookings, selectedSeatIds })
    if (result.type === 'blocked') return showToast(result.message)
    set({
      selectedSeatIds:
        result.type === 'select'
          ? [...selectedSeatIds, seatId]
          : selectedSeatIds.filter((id) => id !== seatId),
    })
  },

  deselectSeat: (seatId) => set({ selectedSeatIds: get().selectedSeatIds.filter((id) => id !== seatId) }),

  confirmSelection: () => {
    const { userId, venueId, selectedSeatIds, showToast } = get()
    if (!userId || !venueId || selectedSeatIds.length === 0) return

    const bookings = readBookings(venueId)
    const { toBook, conflicts, overLimit } = evaluateConfirm({
      userId,
      bookings,
      selectedSeatIds,
      knownSeatIds: getStadiumLayout(venueId).seatIndexById,
    })
    if (overLimit) return showToast(`Limit is ${MAX_SEATS_PER_USER} seats per user.`)

    toBook.forEach((seatId) => (bookings[seatId] = userId))
    writeBookings(venueId, bookings)
    set({ bookings: { ...bookings }, selectedSeatIds: [] })

    if (conflicts.length) {
      showToast(`${conflicts.join(', ')} was just taken by someone else. Pick another seat.`)
    } else {
      showToast(`Booked ${toBook.join(', ')} 🎉`)
    }
  },

  releaseSeat: (seatId) => {
    const { userId, venueId } = get()
    if (!venueId) return
    const bookings = readBookings(venueId)
    if (bookings[seatId] !== userId) return // only the owner can release a seat
    delete bookings[seatId]
    writeBookings(venueId, bookings)
    set({ bookings: { ...bookings } })
  },
})
