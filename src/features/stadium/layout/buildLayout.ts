import { SPECTATORS_PER_SEAT } from '@/config/constants'
import { findVenue, VENUES, type Venue } from '@/config/venues'
import type { PriceTier, Seat, StadiumLayout } from './types'

/** Radial depth of one row of seating. */
const ROW_DEPTH = 1.15
/** Height gained per row. */
const ROW_RISE = 0.55
/** Height of the first row's floor. */
const FIRST_ROW_HEIGHT = 0.5
/** Arc length given to each seat. */
const SEAT_PITCH = 0.9
/** Share of a sector's width left empty on each side as an aisle. */
const AISLE_SHARE = 0.1
/** Share of a sector's width that holds seats. */
const SEATED_SHARE = 0.8

const MIN_SECTORS = 8
const MAX_SECTORS = 24
const MIN_ROWS = 6
const MAX_ROWS = 45
/** Outer radius of the default-sized stadium, used to scale the camera. */
const REFERENCE_OUTER_RADIUS = 45.5

const SECTOR_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('')

function priceForRow(row: number, rowCount: number): { price: number; priceTier: PriceTier } {
  const share = row / rowCount
  if (share < 0.3) return { price: 3500, priceTier: 0 }
  if (share < 0.7) return { price: 2000, priceTier: 1 }
  return { price: 1200, priceTier: 2 }
}

function buildLayout(venue: Venue): StadiumLayout {
  const { groundRadiusX, groundRadiusZ } = venue

  // The number of drawn seats follows the real capacity.
  const targetSeatCount = Math.round(venue.capacity / SPECTATORS_PER_SEAT)
  const sectorCount = Math.min(
    MAX_SECTORS,
    Math.max(MIN_SECTORS, 2 * Math.round(Math.sqrt(targetSeatCount) / 7)),
  )
  const sectorSpan = (Math.PI * 2) / sectorCount

  // Outer rows are longer, so they hold more seats than inner rows.
  const seatsInRow = (row: number) => {
    const meanRadius = (groundRadiusX + groundRadiusZ) / 2 + row * ROW_DEPTH
    return Math.max(4, Math.floor((sectorSpan * SEATED_SHARE * meanRadius) / SEAT_PITCH))
  }

  // Pick the number of rows that lands closest to the target seat count.
  let rowCount = MIN_ROWS
  let smallestGap = Infinity
  for (let rows = MIN_ROWS; rows <= MAX_ROWS; rows++) {
    let total = 0
    for (let row = 0; row < rows; row++) total += seatsInRow(row) * sectorCount
    const gap = Math.abs(total - targetSeatCount)
    if (gap < smallestGap) {
      smallestGap = gap
      rowCount = rows
    }
  }

  const outerRadiusX = groundRadiusX + rowCount * ROW_DEPTH + 0.5
  const outerRadiusZ = groundRadiusZ + rowCount * ROW_DEPTH + 0.5

  const pointOnRing = (angle: number, rowPosition: number): [number, number] => [
    (groundRadiusX + rowPosition * ROW_DEPTH) * Math.cos(angle),
    (groundRadiusZ + rowPosition * ROW_DEPTH) * Math.sin(angle),
  ]
  const rowHeight = (row: number) => FIRST_ROW_HEIGHT + row * ROW_RISE
  const sectorArc = (sector: number): [number, number] => [sector * sectorSpan, (sector + 1) * sectorSpan]

  const seats: Seat[] = []
  for (let sector = 0; sector < sectorCount; sector++) {
    const [arcStart, arcEnd] = sectorArc(sector)
    const seatedStart = arcStart + sectorSpan * AISLE_SHARE
    const seatedEnd = arcEnd - sectorSpan * AISLE_SHARE

    for (let row = 0; row < rowCount; row++) {
      const { price, priceTier } = priceForRow(row, rowCount)
      const seatCount = seatsInRow(row)

      for (let index = 0; index < seatCount; index++) {
        const angle = seatedStart + ((index + 0.5) / seatCount) * (seatedEnd - seatedStart)
        const [x, z] = pointOnRing(angle, row)
        const distanceFromCentre = Math.hypot(x, z)
        seats.push({
          id: `${SECTOR_LETTERS[sector]}${row + 1}-${index + 1}`,
          sector,
          row: row + 1,
          number: index + 1,
          x,
          y: rowHeight(row),
          z,
          facingAngle: Math.atan2(-x / distanceFromCentre, -z / distanceFromCentre),
          price,
          priceTier,
        })
      }
    }
  }

  return {
    venue,
    sectorCount,
    rowCount,
    groundRadiusX,
    groundRadiusZ,
    outerRadiusX,
    outerRadiusZ,
    cameraScale: outerRadiusX / REFERENCE_OUTER_RADIUS,
    sectorNames: SECTOR_LETTERS.slice(0, sectorCount),
    seats,
    seatIndexById: new Map(seats.map((seat, index) => [seat.id, index])),
    pointOnRing,
    rowHeight,
    sectorArc,
  }
}

const layoutCache = new Map<string, StadiumLayout>()

/** Layouts are built once per stadium and reused. Unknown ids fall back to the first venue. */
export function getStadiumLayout(venueId: string): StadiumLayout {
  let layout = layoutCache.get(venueId)
  if (!layout) {
    layout = buildLayout(findVenue(venueId) ?? VENUES[0])
    layoutCache.set(venueId, layout)
  }
  return layout
}
