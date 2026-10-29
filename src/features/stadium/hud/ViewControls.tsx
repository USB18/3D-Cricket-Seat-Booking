import { cameraControls } from '../scene/cameraControls'
import './ViewControls.css'

/** Full view / zoom buttons. Kept apart from the stand list so they are always visible on phones. */
export default function ViewControls() {
  return (
    <div className="view-controls glass">
      <button
        className="view-controls__button view-controls__button--full"
        onClick={() => cameraControls.showFullView()}
        title="Full view"
        aria-label="Full view"
      >
        <span className="view-controls__icon">⟲</span>
        <span className="view-controls__label">Full view</span>
      </button>
      <button
        className="view-controls__button"
        onClick={() => cameraControls.zoomIn()}
        title="Zoom in"
        aria-label="Zoom in"
      >
        ＋
      </button>
      <button
        className="view-controls__button"
        onClick={() => cameraControls.showFullView()}
        title="Zoom out"
        aria-label="Zoom out"
      >
        －
      </button>
    </div>
  )
}
