import { createRandom } from '@/shared/lib/random'

/** One city block plus the road beside it. */
export const CELL_SIZE = 70
export const ROAD_WIDTH = 14
export const BLOCK_SIZE = CELL_SIZE - ROAD_WIDTH

/** Empty space kept around the stadium for the plaza and ring road. */
const CLEAR_ZONE_MARGIN = 110
const PARK_CHANCE = 0.12
const EMPTY_LOT_CHANCE = 0.1
const DASH_SPACING = 10

export interface CityBlock {
  x: number
  z: number
  isPark: boolean
}

export interface CityLot {
  x: number
  z: number
  width: number
  depth: number
  height: number
  /** Brightness multiplier so neighbouring buildings are not identical. */
  tint: number
}

export interface LaneDash {
  x: number
  z: number
  /** Rotation around the vertical axis (0 = along z, PI/2 = along x). */
  rotation: number
}

export interface CityPlan {
  /** Radius of the whole built-up area. */
  outerRadius: number
  /** Half-size of the open ellipse around the stadium. */
  clearRadiusX: number
  clearRadiusZ: number
  blocks: CityBlock[]
  lots: CityLot[]
  laneDashes: LaneDash[]
}

/**
 * Lays out a street grid around the stadium: sidewalk blocks (some parks),
 * buildings in neat lots (taller towards the centre) and dashed lane markings.
 * Seeded, so the city is identical on every load.
 */
export function buildCityPlan(cameraScale: number, stadiumOuterX: number, stadiumOuterZ: number): CityPlan {
  const random = createRandom(2024)
  const outerRadius = 380 * cameraScale
  const clearRadiusX = stadiumOuterX + CLEAR_ZONE_MARGIN
  const clearRadiusZ = stadiumOuterZ + CLEAR_ZONE_MARGIN

  const isOutsideClearZone = (x: number, z: number, margin = 0) =>
    (x / (clearRadiusX + margin)) ** 2 + (z / (clearRadiusZ + margin)) ** 2 > 1
  const cellsEachSide = Math.ceil(outerRadius / CELL_SIZE)

  const blocks: CityBlock[] = []
  const lots: CityLot[] = []

  for (let i = -cellsEachSide; i < cellsEachSide; i++) {
    for (let j = -cellsEachSide; j < cellsEachSide; j++) {
      const x = (i + 0.5) * CELL_SIZE
      const z = (j + 0.5) * CELL_SIZE
      if (Math.hypot(x, z) > outerRadius || !isOutsideClearZone(x, z, 40)) continue

      const isPark = random() < PARK_CHANCE
      blocks.push({ x, z, isPark })
      if (isPark) continue

      // Buildings get shorter towards the edge of the city.
      const heightFalloff = 1 - 0.55 * (Math.hypot(x, z) / outerRadius)
      for (const offsetX of [-1, 1]) {
        for (const offsetZ of [-1, 1]) {
          if (random() < EMPTY_LOT_CHANCE) continue
          lots.push({
            x: x + offsetX * (BLOCK_SIZE / 4),
            z: z + offsetZ * (BLOCK_SIZE / 4),
            width: 17 + random() * 9,
            depth: 17 + random() * 9,
            height: 12 + Math.pow(random(), 1.8) * 85 * heightFalloff,
            tint: 0.8 + random() * 0.4,
          })
        }
      }
    }
  }

  const laneDashes: LaneDash[] = []
  for (let k = -cellsEachSide; k <= cellsEachSide; k++) {
    const streetPosition = k * CELL_SIZE
    for (let along = -outerRadius; along <= outerRadius; along += DASH_SPACING) {
      if (Math.hypot(streetPosition, along) < outerRadius && isOutsideClearZone(streetPosition, along, 4)) {
        laneDashes.push({ x: streetPosition, z: along, rotation: 0 })
      }
      if (Math.hypot(along, streetPosition) < outerRadius && isOutsideClearZone(along, streetPosition, 4)) {
        laneDashes.push({ x: along, z: streetPosition, rotation: Math.PI / 2 })
      }
    }
  }

  return { outerRadius, clearRadiusX, clearRadiusZ, blocks, lots, laneDashes }
}
