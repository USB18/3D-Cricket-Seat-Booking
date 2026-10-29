import type { Venue } from '@/config/venues'

/** 0 = premium (front rows), 1 = standard, 2 = economy (back rows). */
export type PriceTier = 0 | 1 | 2

export interface Seat {
  /** Unique within a stadium, e.g. "D5-9" = stand D, row 5, seat 9. */
  id: string
  sector: number
  row: number
  number: number
  x: number
  y: number
  z: number
  /** Rotation around the vertical axis so the seat faces the pitch. */
  facingAngle: number
  price: number
  priceTier: PriceTier
}

/**
 * Everything needed to draw and navigate one stadium. The stands are concentric
 * elliptical rings around the pitch, split into numbered/lettered sectors.
 */
export interface StadiumLayout {
  venue: Venue
  sectorCount: number
  rowCount: number
  /** Inner ellipse (playing area). */
  groundRadiusX: number
  groundRadiusZ: number
  /** Outer ellipse (back of the stands). */
  outerRadiusX: number
  outerRadiusZ: number
  /** Camera distance multiplier relative to a default-sized stadium. */
  cameraScale: number
  sectorNames: string[]
  seats: Seat[]
  seatIndexById: Map<string, number>
  /** Point on the ring for a row position (0 = first row, fractions allowed). */
  pointOnRing: (angle: number, rowPosition: number) => [x: number, z: number]
  /** Height of a row's floor. */
  rowHeight: (row: number) => number
  /** Start and end angle (radians) of a sector. */
  sectorArc: (sector: number) => [start: number, end: number]
}
