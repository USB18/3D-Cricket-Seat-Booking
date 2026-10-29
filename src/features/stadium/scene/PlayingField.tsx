import { useMemo } from 'react'
import * as THREE from 'three'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import { createGrassTexture } from './environment/textures'

/** Margin between the stands and the boundary rope. */
const BOUNDARY_INSET = 3
/** The 30-yard circle as a share of the boundary size. */
const INNER_CIRCLE_SHARE = 0.55
/** Real pitch dimensions in scene units (22 yards x 10 feet). */
const PITCH_LENGTH = 20.12
const PITCH_WIDTH = 3.05
/** Distance of each set of stumps from the pitch centre. */
const STUMPS_OFFSET = 8.8

const flat = -Math.PI / 2 // rotate a plane so it lies on the ground

/** Outfield, pitch with creases and stumps, boundary rope and the team-coloured ad boards. */
export default function PlayingField() {
  const { groundRadiusX, groundRadiusZ, venue } = useStadiumLayout()
  const grass = useMemo(() => createGrassTexture(), [])
  const boundaryX = groundRadiusX - BOUNDARY_INSET
  const boundaryZ = groundRadiusZ - BOUNDARY_INSET

  return (
    <group>
      {/* Outfield */}
      <mesh rotation-x={flat} scale={[boundaryX, boundaryZ, 1]} position-y={0.01}>
        <circleGeometry args={[1, 96]} />
        <meshStandardMaterial map={grass} roughness={1} />
      </mesh>

      {/* 30-yard circle */}
      <mesh
        rotation-x={flat}
        scale={[boundaryX * INNER_CIRCLE_SHARE, boundaryZ * INNER_CIRCLE_SHARE, 1]}
        position-y={0.03}
      >
        <ringGeometry args={[0.985, 1, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>

      {/* Pitch */}
      <mesh rotation-x={flat} position-y={0.04}>
        <planeGeometry args={[PITCH_LENGTH, PITCH_WIDTH]} />
        <meshStandardMaterial color="#c9b27c" roughness={1} />
      </mesh>

      {/* Creases and stumps at both ends */}
      {[-1, 1].map((end) => (
        <group key={end} position-x={end * STUMPS_OFFSET}>
          <mesh rotation-x={flat} position-y={0.05}>
            <planeGeometry args={[0.05, PITCH_WIDTH]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
          <mesh rotation-x={flat} position={[-end * 0.6, 0.05, 0]}>
            <planeGeometry args={[0.05, 2.6]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
          {[-0.11, 0, 0.11].map((offset) => (
            <mesh key={offset} position={[end * 1.2, 0.35, offset]}>
              <cylinderGeometry args={[0.025, 0.025, 0.7, 6]} />
              <meshStandardMaterial color="#f5e7b2" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Boundary rope */}
      <mesh rotation-x={flat} scale={[boundaryX, boundaryZ, 1]} position-y={0.08}>
        <torusGeometry args={[1, 0.004, 6, 160]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Advertising boards in the team's colour */}
      <mesh position-y={0.4} scale={[groundRadiusX - 0.8, 1, groundRadiusZ - 0.8]}>
        <cylinderGeometry args={[1, 1, 0.8, 120, 1, true]} />
        <meshStandardMaterial
          color={venue.primaryColor}
          emissive={venue.primaryColor}
          emissiveIntensity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
