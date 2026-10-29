import { MAX_SEATS_PER_USER } from '@/config/constants'
import { formatRupees } from '@/shared/lib/format'
import { useStore } from '@/store'
import { useMyBookedSeatIds } from '@/store/selectors'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import { cameraControls } from '../scene/cameraControls'
import { BOOKED_BY_OTHERS_OPACITY, SEAT_COLORS } from '../scene/seatAppearance'
import './SelectionPanel.css'

interface SeatListItemProps {
  seatId: string
  price: number
  variant: 'selected' | 'booked'
  actionLabel: string
  actionTitle: string
  onAction: () => void
}

/** One row in a seat list: seat id (click to view from it), price, and an action button. */
function SeatListItem({ seatId, price, variant, actionLabel, actionTitle, onAction }: SeatListItemProps) {
  return (
    <li className={`seat-list__item seat-list__item--${variant}`}>
      <button
        className="seat-list__link"
        onClick={() => cameraControls.viewFromSeat(seatId)}
        title="View from this seat"
      >
        {seatId}
      </button>
      <span className="seat-list__price">{formatRupees(price)}</span>
      <button className="seat-list__action" onClick={onAction} aria-label={actionTitle} title={actionTitle}>
        {actionLabel}
      </button>
    </li>
  )
}

/** Legend entries use the same colours as the seats in the 3D scene. */
const LEGEND: { color: string; label: string; opacity?: number }[] = [
  { color: SEAT_COLORS.priceTier[0].getStyle(), label: 'Premium ₹3,500' },
  { color: SEAT_COLORS.priceTier[1].getStyle(), label: 'Standard ₹2,000' },
  { color: SEAT_COLORS.priceTier[2].getStyle(), label: 'Economy ₹1,200' },
  { color: SEAT_COLORS.selected.getStyle(), label: 'Selected' },
  { color: SEAT_COLORS.bookedByMe.getStyle(), label: 'Yours' },
  { color: SEAT_COLORS.bookedByOthers.getStyle(), label: 'Booked', opacity: BOOKED_BY_OTHERS_OPACITY },
]

/** The user's pending selection (with Confirm), their confirmed bookings, and a colour legend. */
export default function SelectionPanel() {
  const { seats, seatIndexById } = useStadiumLayout()
  const selectedSeatIds = useStore((state) => state.selectedSeatIds)
  const seatViewId = useStore((state) => state.seatViewId)
  const deselectSeat = useStore((state) => state.deselectSeat)
  const confirmSelection = useStore((state) => state.confirmSelection)
  const releaseSeat = useStore((state) => state.releaseSeat)
  const myBookedSeatIds = useMyBookedSeatIds()

  const priceOf = (seatId: string) => seats[seatIndexById.get(seatId)!].price
  const total = selectedSeatIds.reduce((sum, seatId) => sum + priceOf(seatId), 0)
  const seatsLeft = MAX_SEATS_PER_USER - myBookedSeatIds.length - selectedSeatIds.length

  const handleConfirm = () => {
    confirmSelection()
    cameraControls.showFullView()
  }
  const handleDeselect = (seatId: string) => {
    deselectSeat(seatId)
    if (seatViewId === seatId) cameraControls.leaveSeatView()
  }

  return (
    <aside className="selection-panel glass">
      <h3 className="panel-heading">
        Your selection
        <span className="selection-panel__count">
          {selectedSeatIds.length + myBookedSeatIds.length}/{MAX_SEATS_PER_USER}
        </span>
      </h3>

      {selectedSeatIds.length === 0 && (
        <p className="muted">Click seats in the stadium. {seatsLeft} more allowed.</p>
      )}
      <ul className="seat-list">
        {selectedSeatIds.map((seatId) => (
          <SeatListItem
            key={seatId}
            seatId={seatId}
            price={priceOf(seatId)}
            variant="selected"
            actionLabel="✕"
            actionTitle={`Remove ${seatId}`}
            onAction={() => handleDeselect(seatId)}
          />
        ))}
      </ul>

      {selectedSeatIds.length > 0 && (
        <>
          <div className="selection-panel__total">
            <span>Total</span>
            <b>{formatRupees(total)}</b>
          </div>
          <button className="btn-primary" onClick={handleConfirm}>
            Confirm {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? 's' : ''}
          </button>
        </>
      )}

      <h3 className="panel-heading">My bookings</h3>
      {myBookedSeatIds.length === 0 && <p className="muted">Nothing booked yet.</p>}
      <ul className="seat-list">
        {myBookedSeatIds.map((seatId) => (
          <SeatListItem
            key={seatId}
            seatId={seatId}
            price={priceOf(seatId)}
            variant="booked"
            actionLabel="Release"
            actionTitle="Release seat"
            onAction={() => releaseSeat(seatId)}
          />
        ))}
      </ul>

      <div className="selection-panel__legend">
        <h3 className="panel-heading">Legend</h3>
        <div className="legend">
          {LEGEND.map(({ color, label, opacity }) => (
            <span className="legend__entry" key={label}>
              <i className="legend__swatch" style={{ background: color, opacity }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
