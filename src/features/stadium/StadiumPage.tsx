import { lazy, Suspense, useEffect, type MouseEvent } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import { findVenue } from '@/config/venues'
import ErrorBoundary from '@/shared/components/ErrorBoundary'
import LoadingScreen from '@/shared/components/LoadingScreen'
import { useStore } from '@/store'
import StadiumHud from './hud/StadiumHud'
import { cameraControls } from './scene/cameraControls'
import './StadiumPage.css'

// Three.js is large, so the 3D scene is loaded only when a stadium is opened.
const StadiumScene = lazy(() => import('./scene/StadiumScene'))

/** One stadium: the 3D scene with the booking controls layered on top. The URL picks the stadium. */
export default function StadiumPage() {
  const venue = findVenue(useParams().venueId)
  const openVenueId = useStore((state) => state.venueId)
  const hasEntered = useStore((state) => state.hasEntered)

  useEffect(() => {
    if (!venue) return
    useStore.getState().openVenue(venue.id)
    return () => useStore.getState().closeVenue()
  }, [venue])

  if (!venue) return <Navigate to={ROUTES.stadiums} replace />
  if (openVenueId !== venue.id) return <LoadingScreen message={`Opening ${venue.stadiumName}…`} />

  // The first click on the 3D view takes the user inside the stadium.
  const handlePageClick = (event: MouseEvent) => {
    if (hasEntered || (event.target as HTMLElement).tagName !== 'CANVAS') return
    useStore.getState().enterStadium()
    cameraControls.enterStadium()
  }

  return (
    <div className="stadium-page" onClick={handlePageClick}>
      <ErrorBoundary
        title="Can't show the 3D stadium"
        message="Your browser or device may not support WebGL. Try another browser."
      >
        <Suspense fallback={<LoadingScreen message={`Building ${venue.stadiumName}…`} />}>
          <StadiumScene key={venue.id} />
        </Suspense>
      </ErrorBoundary>
      <StadiumHud />
    </div>
  )
}
