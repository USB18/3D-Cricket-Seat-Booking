import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import type { Venue } from '@/config/venues'
import { formatNumber } from '@/shared/lib/format'
import './VenueCard.css'

/** One stadium in the list, styled with its team's colours. */
export default function VenueCard({ venue }: { venue: Venue }) {
  const teamColors = {
    '--team-primary': venue.primaryColor,
    '--team-secondary': venue.secondaryColor,
  } as CSSProperties

  return (
    <Link to={ROUTES.stadium(venue.id)} className="venue-card" style={teamColors}>
      <div className="venue-card__top">
        <span className="venue-card__badge">{venue.shortName}</span>
        <span className="venue-card__capacity">~{formatNumber(venue.capacity)} capacity</span>
      </div>
      <div className="venue-card__team">{venue.team}</div>
      <div className="venue-card__stadium">{venue.stadiumName}</div>
      <div className="venue-card__city">📍 {venue.city}</div>
    </Link>
  )
}
