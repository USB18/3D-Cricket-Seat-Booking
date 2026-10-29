import { useStore } from '@/store'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import { cameraControls } from '../scene/cameraControls'
import './StandsPanel.css'

/** Letter buttons to jump the camera to a stand. A strip on phones, a grid on larger screens. */
export default function StandsPanel() {
  const { sectorNames } = useStadiumLayout()
  const focusedSector = useStore((state) => state.focusedSector)

  return (
    <aside className="stands-panel glass">
      <h3 className="panel-heading">Stands</h3>
      <div className="stands-panel__grid">
        {sectorNames.map((name, sector) => (
          <button
            key={name}
            className={`stands-panel__stand${focusedSector === sector ? ' stands-panel__stand--active' : ''}`}
            onClick={() => cameraControls.focusSector(sector)}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="stands-panel__hint">Drag to rotate · scroll / pinch to zoom · right-drag to pan</p>
    </aside>
  )
}
