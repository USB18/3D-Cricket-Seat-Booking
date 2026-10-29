import { Html } from '@react-three/drei'
import { useStore } from '@/store'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import { cameraControls } from './cameraControls'
import './SectorLabels.css'

/** Floating letter pills above each stand. Clicking one flies the camera to that stand. */
export default function SectorLabels() {
  const { rowCount, sectorCount, sectorNames, pointOnRing, rowHeight, sectorArc } = useStadiumLayout()
  const focusedSector = useStore((state) => state.focusedSector)
  const labelHeight = rowHeight(rowCount - 1) + 2.2

  return (
    <>
      {Array.from({ length: sectorCount }, (_, sector) => {
        const [arcStart, arcEnd] = sectorArc(sector)
        const [x, z] = pointOnRing((arcStart + arcEnd) / 2, rowCount + 0.2)
        return (
          <Html key={sector} position={[x, labelHeight, z]} center zIndexRange={[5, 0]}>
            <button
              className={`sector-pill${focusedSector === sector ? ' sector-pill--active' : ''}`}
              onClick={() => cameraControls.focusSector(sector)}
              title={`Zoom to Stand ${sectorNames[sector]}`}
            >
              {sectorNames[sector]}
            </button>
          </Html>
        )
      })}
    </>
  )
}
