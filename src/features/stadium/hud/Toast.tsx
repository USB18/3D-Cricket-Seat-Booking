import { useStore } from '@/store'
import './Toast.css'

/** Short message at the bottom of the screen (e.g. "Seat is already booked"). */
export default function Toast() {
  const toast = useStore((state) => state.toast)
  if (!toast) return null
  return (
    <div className="toast" role="status">
      {toast}
    </div>
  )
}
