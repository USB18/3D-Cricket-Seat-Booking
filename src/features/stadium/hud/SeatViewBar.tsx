import { useStore } from '@/store'
import { cameraControls } from '../scene/cameraControls'
import './SeatViewBar.css'

/** Shown while looking from a seat: tells the user which seat, with a way back. */
export default function SeatViewBar() {
  const seatViewId = useStore((state) => state.seatViewId)

  return (
    <div className="seat-view-bar glass">
      <span>
        👁 View from <b>{seatViewId}</b> · drag to look around
      </span>
      <button onClick={() => cameraControls.leaveSeatView()}>← Back to stadium</button>
    </div>
  )
}
