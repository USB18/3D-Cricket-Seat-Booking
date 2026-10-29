import { useMemo } from 'react'
import * as THREE from 'three'
import { useScenePalette, useTheme } from '@/shared/theme/useTheme'
import { BLOCK_SIZE, type CityPlan } from './cityPlan'
import { createWindowTexture } from './textures'

/** Heights (scene units) of the flat layers drawn just above the ground. */
const LANE_MARKING_HEIGHT = -0.3
const SIDEWALK_HEIGHT = 0.02

/** Builds an InstancedMesh from per-instance transforms (and optional colours). */
function createInstances(
  geometry: THREE.BufferGeometry,
  count: number,
  place: (index: number, object: THREE.Object3D) => THREE.Color | void,
) {
  const mesh = new THREE.InstancedMesh(geometry, undefined, count)
  const placeholder = new THREE.Object3D()
  for (let index = 0; index < count; index++) {
    placeholder.rotation.set(0, 0, 0)
    placeholder.scale.set(1, 1, 1)
    const color = place(index, placeholder)
    placeholder.updateMatrix()
    mesh.setMatrixAt(index, placeholder.matrix)
    if (color) mesh.setColorAt(index, color)
  }
  mesh.frustumCulled = false
  return mesh
}

/** Sidewalk blocks, parks, lane markings and lot-aligned buildings. */
export default function City({ plan }: { plan: CityPlan }) {
  const isNight = useTheme((state) => state.theme) === 'dark'
  const palette = useScenePalette()
  const windowTexture = useMemo(() => createWindowTexture(isNight), [isNight])

  const buildings = useMemo(() => {
    const tint = new THREE.Color()
    return createInstances(new THREE.BoxGeometry(1, 1, 1), plan.lots.length, (index, object) => {
      const lot = plan.lots[index]
      object.position.set(lot.x, lot.height / 2, lot.z)
      object.scale.set(lot.width, lot.height, lot.depth)
      return tint.setScalar(lot.tint)
    })
  }, [plan])

  const sidewalks = useMemo(() => {
    const sidewalk = new THREE.Color(palette.block)
    const park = new THREE.Color(palette.park)
    return createInstances(
      new THREE.BoxGeometry(BLOCK_SIZE, 0.2, BLOCK_SIZE),
      plan.blocks.length,
      (index, object) => {
        const block = plan.blocks[index]
        object.position.set(block.x, SIDEWALK_HEIGHT, block.z)
        return block.isPark ? park : sidewalk
      },
    )
  }, [plan, palette.block, palette.park])

  const laneMarkings = useMemo(
    () =>
      createInstances(new THREE.BoxGeometry(4, 0.05, 0.45), plan.laneDashes.length, (index, object) => {
        const dash = plan.laneDashes[index]
        object.position.set(dash.x, LANE_MARKING_HEIGHT, dash.z)
        object.rotation.y = dash.rotation
      }),
    [plan],
  )

  return (
    <>
      <primitive object={sidewalks}>
        <meshStandardMaterial roughness={1} />
      </primitive>
      <primitive object={laneMarkings}>
        <meshBasicMaterial color={palette.laneMarking} />
      </primitive>
      <primitive object={buildings}>
        <meshStandardMaterial
          map={windowTexture}
          emissiveMap={isNight ? windowTexture : null}
          emissive={isNight ? '#ffffff' : '#000000'}
          emissiveIntensity={isNight ? 0.9 : 0}
          roughness={0.9}
        />
      </primitive>
    </>
  )
}
