import { useScenePalette } from '@/shared/theme/useTheme'
import { useStadiumLayout } from '../../layout/useStadiumLayout'
import { ROAD_WIDTH, type CityPlan } from './cityPlan'

/**
 * Heights of the stacked ground layers. They are spaced well apart so layers never
 * flicker ("z-fight") when viewed from far away. Lower = further down.
 */
const LAYER = {
  terrain: -0.6,
  roadBed: -0.45,
  openLand: -0.35,
  plaza: -0.25,
  ringRoad: -0.15,
  avenue: -0.1,
} as const

const PLAZA_MARGIN = 40
const RING_ROAD_MARGIN = 34
/** Avenues start this far beyond the stadium wall (just past the ring road). */
const AVENUE_START_MARGIN = 38

const flat = -Math.PI / 2 // rotate a plane so it lies on the ground

/** Terrain, the road bed under the city, the open land and plaza, ring road and four avenues. */
export default function Ground({ plan, cameraScale }: { plan: CityPlan; cameraScale: number }) {
  const palette = useScenePalette()
  const { outerRadiusX, outerRadiusZ } = useStadiumLayout()
  const { outerRadius, clearRadiusX, clearRadiusZ } = plan

  const alongX = clearRadiusX - outerRadiusX - AVENUE_START_MARGIN + 2
  const alongZ = clearRadiusZ - outerRadiusZ - AVENUE_START_MARGIN + 2
  const midX = (outerRadiusX + AVENUE_START_MARGIN + clearRadiusX) / 2
  const midZ = (outerRadiusZ + AVENUE_START_MARGIN + clearRadiusZ) / 2

  const avenues: { position: [number, number, number]; size: [number, number] }[] = [
    { position: [midX, LAYER.avenue, 0], size: [alongX, ROAD_WIDTH] },
    { position: [-midX, LAYER.avenue, 0], size: [alongX, ROAD_WIDTH] },
    { position: [0, LAYER.avenue, midZ], size: [ROAD_WIDTH, alongZ] },
    { position: [0, LAYER.avenue, -midZ], size: [ROAD_WIDTH, alongZ] },
  ]

  return (
    <group>
      <mesh rotation-x={flat} position-y={LAYER.terrain}>
        <circleGeometry args={[1000 * cameraScale, 64]} />
        <meshStandardMaterial color={palette.terrain} roughness={1} />
      </mesh>

      {/* Road bed under the whole city grid */}
      <mesh rotation-x={flat} position-y={LAYER.roadBed}>
        <circleGeometry args={[outerRadius + 30, 64]} />
        <meshStandardMaterial color={palette.road} roughness={1} />
      </mesh>

      {/* Open land around the stadium */}
      <mesh rotation-x={flat} position-y={LAYER.openLand} scale={[clearRadiusX, clearRadiusZ, 1]}>
        <circleGeometry args={[1, 96]} />
        <meshStandardMaterial color={palette.terrain} roughness={1} />
      </mesh>

      <mesh
        rotation-x={flat}
        position-y={LAYER.plaza}
        scale={[outerRadiusX + PLAZA_MARGIN, outerRadiusZ + PLAZA_MARGIN, 1]}
      >
        <circleGeometry args={[1, 96]} />
        <meshStandardMaterial color={palette.plaza} roughness={1} />
      </mesh>

      <mesh
        rotation-x={flat}
        position-y={LAYER.ringRoad}
        scale={[outerRadiusX + RING_ROAD_MARGIN, outerRadiusZ + RING_ROAD_MARGIN, 1]}
      >
        <ringGeometry args={[0.9, 1, 96]} />
        <meshStandardMaterial color={palette.road} roughness={1} />
      </mesh>

      {/* Avenues leading from the plaza into the city */}
      {avenues.map((avenue, index) => (
        <mesh key={index} rotation-x={flat} position={avenue.position}>
          <planeGeometry args={avenue.size} />
          <meshStandardMaterial color={palette.road} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
