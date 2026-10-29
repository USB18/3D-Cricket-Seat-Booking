import { MAX_SEATS_PER_USER } from '@/config/constants'

/** seatId -> id of the user who booked it. A seat that is not a key is free. */
export type Bookings = Record<string, string>

export const seatsBookedBy = (bookings: Bookings, userId: string | null): string[] =>
  Object.keys(bookings).filter((seatId) => bookings[seatId] === userId)

export type ToggleResult = { type: 'select' } | { type: 'deselect' } | { type: 'blocked'; message: string }

/** What should happen when the user clicks a seat? */
export function evaluateToggle(input: {
  seatId: string
  userId: string
  bookings: Bookings
  selectedSeatIds: string[]
}): ToggleResult {
  const { seatId, userId, bookings, selectedSeatIds } = input
  const owner = bookings[seatId]

  if (owner && owner !== userId) {
    return { type: 'blocked', message: `Seat ${seatId} is already booked. Please pick another.` }
  }
  if (owner === userId) {
    return {
      type: 'blocked',
      message: `You already booked ${seatId}. Release it from "My bookings" if needed.`,
    }
  }
  if (selectedSeatIds.includes(seatId)) return { type: 'deselect' }

  const alreadyBooked = seatsBookedBy(bookings, userId).length
  if (alreadyBooked + selectedSeatIds.length >= MAX_SEATS_PER_USER) {
    const detail = alreadyBooked ? ` (you have ${alreadyBooked} booked)` : ''
    return { type: 'blocked', message: `You can hold at most ${MAX_SEATS_PER_USER} seats${detail}.` }
  }
  return { type: 'select' }
}

export interface ConfirmResult {
  /** Seats that can be booked right now. */
  toBook: string[]
  /** Seats someone else booked while the user was choosing. */
  conflicts: string[]
  /** Booking everything would exceed the per-user limit. */
  overLimit: boolean
}

/** Splits the current selection into what can and cannot be booked. */
export function evaluateConfirm(input: {
  userId: string
  bookings: Bookings
  selectedSeatIds: string[]
  /** Anything with `has(seatId)` — e.g. the stadium's seat index. */
  knownSeatIds: { has: (seatId: string) => boolean }
}): ConfirmResult {
  const { userId, bookings, selectedSeatIds, knownSeatIds } = input

  const conflicts = selectedSeatIds.filter((seatId) => {
    const owner = bookings[seatId]
    return owner !== undefined && owner !== userId
  })
  const toBook = selectedSeatIds.filter((seatId) => !conflicts.includes(seatId) && knownSeatIds.has(seatId))
  const overLimit = seatsBookedBy(bookings, userId).length + toBook.length > MAX_SEATS_PER_USER

  return { toBook, conflicts, overLimit }
}

/** Selected seats that another user has booked in the meantime. */
export function findLostSeats(
  selectedSeatIds: string[],
  bookings: Bookings,
  userId: string | null,
): string[] {
  return selectedSeatIds.filter((seatId) => {
    const owner = bookings[seatId]
    return owner !== undefined && owner !== userId
  })
}
