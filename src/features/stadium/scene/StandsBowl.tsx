import { useMemo } from 'react'
import * as THREE from 'three'
import { useScenePalette } from '@/shared/theme/useTheme'
import { useStadiumLayout } from '../layout/useStadiumLayout'

/** How finely each ring is cut into straight segments. */
const SEGMENTS_AROUND = 180

/**
 * The concrete stands: a stepped bowl with a flat "tread" and a vertical "riser"
 * for every row, alternating two shades so the rows are easy to see.
 */
export default function StandsBowl() {
  const { rowCount, pointOnRing, rowHeight } = useStadiumLayout()
  const palette = useScenePalette()

  const geometry = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []
    const rowColorA = new THREE.Color(palette.standRowA)
    const rowColorB = new THREE.Color(palette.standRowB)
    const riserColor = new THREE.Color(palette.standRiser)

    const addQuad = (corners: number[][], color: THREE.Color) => {
      for (const index of [0, 1, 2, 0, 2, 3]) {
        positions.push(...corners[index])
        colors.push(color.r, color.g, color.b)
      }
    }
    const point = (angle: number, rowPosition: number, height: number) => {
      const [x, z] = pointOnRing(angle, rowPosition)
      return [x, height, z]
    }

    for (let row = 0; row < rowCount; row++) {
      const floor = rowHeight(row)
      const floorBelow = row === 0 ? 0 : rowHeight(row - 1)

      for (let segment = 0; segment < SEGMENTS_AROUND; segment++) {
        const angleStart = (segment / SEGMENTS_AROUND) * Math.PI * 2
        const angleEnd = ((segment + 1) / SEGMENTS_AROUND) * Math.PI * 2

        // Tread (where people sit)
        addQuad(
          [
            point(angleStart, row - 0.5, floor),
            point(angleEnd, row - 0.5, floor),
            point(angleEnd, row + 0.5, floor),
            point(angleStart, row + 0.5, floor),
          ],
          row % 2 ? rowColorA : rowColorB,
        )
        // Riser (the step up from the row below)
        addQuad(
          [
            point(angleStart, row - 0.5, floorBelow),
            point(angleEnd, row - 0.5, floorBelow),
            point(angleEnd, row - 0.5, floor),
            point(angleStart, row - 0.5, floor),
          ],
          riserColor,
        )
      }
    }

    const bowl = new THREE.BufferGeometry()
    bowl.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    bowl.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    bowl.computeVertexNormals()
    return bowl
  }, [palette, rowCount, pointOnRing, rowHeight])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  )
}
