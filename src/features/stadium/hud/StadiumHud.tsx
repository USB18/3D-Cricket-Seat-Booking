import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import AppHeader from '@/shared/components/AppHeader'
import { formatNumber } from '@/shared/lib/format'
import { useStore } from '@/store'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import EnterHint from './EnterHint'
import SeatTooltip from './SeatTooltip'
import SeatViewBar from './SeatViewBar'
import SelectionPanel from './SelectionPanel'
import StandsPanel from './StandsPanel'
import Toast from './Toast'
import ViewControls from './ViewControls'

/** Header showing the stadium name and how many seats are still free. */
function StadiumHeader() {
  const { venue } = useStadiumLayout()
  const bookedCount = useStore((state) => Object.keys(state.bookings).length)
  const selectedCount = useStore((state) => state.selectedSeatIds.length)
  const available = venue.capacity - bookedCount - selectedCount

  return (
    <AppHeader
      variant="overlay"
      title={`🏏 ${venue.shortName} · ${venue.stadiumName}`}
      subtitle={`${formatNumber(available)} of ${formatNumber(venue.capacity)} seats available`}
    >
      <Link className="btn-ghost" to={ROUTES.stadiums}>
        <span className="label-full">Change stadium</span>
        <span className="label-short">Stadiums</span>
      </Link>
    </AppHeader>
  )
}

/** All on-screen controls layered over the 3D stadium. */
export default function StadiumHud() {
  const hasEntered = useStore((state) => state.hasEntered)
  const seatViewId = useStore((state) => state.seatViewId)

  return (
    <>
      <StadiumHeader />

      {!hasEntered && <EnterHint />}
      {hasEntered && <StandsPanel />}
      {hasEntered && !seatViewId && <ViewControls />}
      {hasEntered && <SelectionPanel />}
      {seatViewId && <SeatViewBar />}
      {!seatViewId && <SeatTooltip />}
      <Toast />
    </>
  )
}
