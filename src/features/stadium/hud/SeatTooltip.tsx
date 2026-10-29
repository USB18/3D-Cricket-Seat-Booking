import { formatRupees } from '@/shared/lib/format'
import { useStore } from '@/store'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import './SeatTooltip.css'

/** Details of the seat under the mouse pointer (desktop only — phones have no hover). */
export default function SeatTooltip() {
  const { seats, seatIndexById, sectorNames } = useStadiumLayout()
  const hoveredSeatId = useStore((state) => state.hoveredSeatId)
  const owner = useStore((state) => (state.hoveredSeatId ? state.bookings[state.hoveredSeatId] : undefined))
  const userId = useStore((state) => state.userId)

  if (!hoveredSeatId) return null
  const seat = seats[seatIndexById.get(hoveredSeatId)!]

  return (
    <div className="seat-tooltip glass">
      Stand <b>{sectorNames[seat.sector]}</b> · Row <b>{seat.row}</b> · Seat <b>{seat.number}</b> ·{' '}
      {formatRupees(seat.price)}
      {owner && (
        <em className="seat-tooltip__status"> — {owner === userId ? 'booked by you' : 'already booked'}</em>
      )}
    </div>
  )
}
