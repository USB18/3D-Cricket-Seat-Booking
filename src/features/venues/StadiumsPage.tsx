import AppHeader from '@/shared/components/AppHeader'
import { VENUES } from '@/config/venues'
import VenueCard from './VenueCard'
import './StadiumsPage.css'

/** Pick an IPL home ground. The header stays put; only the list of teams scrolls. */
export default function StadiumsPage() {
  return (
    <div className="stadiums-page">
      <div className="stadiums-page__fixed">
        <AppHeader title="🏏 Cricket Arena" />
        <div className="stadiums-page__intro">
          <h1>Choose your IPL stadium</h1>
          <p className="muted">Pick a home ground to explore it in 3D and book up to 3 seats.</p>
        </div>
      </div>

      <main className="stadiums-page__scroll">
        <div className="venue-grid">
          {VENUES.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </main>
    </div>
  )
}
