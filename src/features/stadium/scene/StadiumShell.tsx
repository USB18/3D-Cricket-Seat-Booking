import { useMemo } from 'react'
import * as THREE from 'three'
import { useScenePalette } from '@/shared/theme/useTheme'
import { useStadiumLayout } from '../layout/useStadiumLayout'

const WALL_EXTRA_HEIGHT = 3.5
const TOWER_HEIGHT = 26
/** Floodlight towers stand this far beyond the outer wall. */
const TOWER_DISTANCE = 5
/** Stadiums with more towers split the light between them. */
const LIGHT_INTENSITY_FEW_TOWERS = 900
const LIGHT_INTENSITY_MANY_TOWERS = 600

/** The outer wall with a team-colour band, and the floodlight towers. */
export default function StadiumShell() {
  const { outerRadiusX, outerRadiusZ, rowCount, rowHeight, venue } = useStadiumLayout()
  const palette = useScenePalette()

  const wallHeight = rowHeight(rowCount - 1) + WALL_EXTRA_HEIGHT
  const wallColor = useMemo(
    () => new THREE.Color(palette.outerWall).lerp(new THREE.Color(venue.primaryColor), 0.28),
    [palette.outerWall, venue.primaryColor],
  )
  const towerAngles = Array.from(
    { length: venue.floodlightTowers },
    (_, index) => Math.PI / venue.floodlightTowers + (index * Math.PI * 2) / venue.floodlightTowers,
  )
  const lightIntensity = venue.floodlightTowers > 4 ? LIGHT_INTENSITY_MANY_TOWERS : LIGHT_INTENSITY_FEW_TOWERS

  return (
    <group>
      {/* Outer wall */}
      <mesh position-y={wallHeight / 2} scale={[outerRadiusX, 1, outerRadiusZ]}>
        <cylinderGeometry args={[1, 1, wallHeight, 120, 1, true]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} roughness={0.95} />
      </mesh>

      {/* Team-colour band along the top of the wall */}
      <mesh position-y={wallHeight + 0.2} scale={[outerRadiusX + 0.1, 1, outerRadiusZ + 0.1]}>
        <cylinderGeometry args={[1, 1, 1.4, 120, 1, true]} />
        <meshStandardMaterial
          color={venue.primaryColor}
          emissive={venue.primaryColor}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floodlight towers */}
      {towerAngles.map((angle) => {
        const x = (outerRadiusX + TOWER_DISTANCE) * Math.cos(angle)
        const z = (outerRadiusZ + TOWER_DISTANCE) * Math.sin(angle)
        return (
          <group key={angle} position={[x, 0, z]} rotation-y={Math.atan2(-x, -z)}>
            <mesh position-y={TOWER_HEIGHT / 2}>
              <cylinderGeometry args={[0.35, 0.6, TOWER_HEIGHT, 8]} />
              <meshStandardMaterial color={palette.floodlightPole} />
            </mesh>
            <mesh position-y={TOWER_HEIGHT + 0.5}>
              <boxGeometry args={[7, 3.4, 0.6]} />
              <meshStandardMaterial color="#fff7d6" emissive="#fff1b8" emissiveIntensity={2.2} />
            </mesh>
            <spotLight
              position={[0, TOWER_HEIGHT + 1, 2]}
              angle={0.9}
              penumbra={0.8}
              intensity={lightIntensity}
              distance={170}
              color="#fff4d0"
            />
          </group>
        )
      })}
    </group>
  )
}
