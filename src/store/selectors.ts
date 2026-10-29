import { useMemo } from 'react'
import { seatsBookedBy } from '@/features/booking/rules'
import { useStore } from './index'

/** Ids of the seats the signed-in user has booked at the open stadium. */
export function useMyBookedSeatIds(): string[] {
  const bookings = useStore((state) => state.bookings)
  const userId = useStore((state) => state.userId)
  return useMemo(() => seatsBookedBy(bookings, userId), [bookings, userId])
}
