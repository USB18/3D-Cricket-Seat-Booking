import * as THREE from 'three'
import {
  DEFAULT_DISTANCE_TOLERANCE,
  FOCUS_RELEASE_DISTANCE_SHARE,
  MIN_CAMERA_HEIGHT,
  RECENTRE_START_DISTANCE,
  SCENE_CENTER,
  STADIUM_MIN_DISTANCE,
  UNRESTRICTED_MAX_DISTANCE,
} from './cameraConfig'

/** The subset of OrbitControls the camera rig drives. */
export interface OrbitControlsLike {
  target: THREE.Vector3
  update: () => void
  minDistance: number
  maxDistance: number
  minPolarAngle: number
  maxPolarAngle: number
  rotateSpeed: number
  enableZoom: boolean
  enablePan: boolean
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

/** "stadium" = orbit around the bowl; "seat" = eye-level look-around from one seat. */
export type CameraMode = 'stadium' | 'seat'

/** Zoom / rotate / pan rules for a mode. */
export function applyModeLimits(
  controls: OrbitControlsLike,
  camera: THREE.PerspectiveCamera,
  mode: CameraMode,
  options: { hasEntered: boolean; defaultViewDistance: number },
) {
  if (mode === 'seat') {
    controls.minDistance = 0.02
    controls.maxDistance = 0.3
    controls.enableZoom = false
    controls.enablePan = false
    controls.minPolarAngle = 0.35
    controls.maxPolarAngle = Math.PI - 0.45
    controls.rotateSpeed = 0.45
    camera.near = 0.1
  } else {
    controls.minDistance = STADIUM_MIN_DISTANCE
    controls.maxDistance = options.hasEntered
      ? options.defaultViewDistance * DEFAULT_DISTANCE_TOLERANCE
      : UNRESTRICTED_MAX_DISTANCE
    controls.enableZoom = options.hasEntered
    controls.enablePan = options.hasEntered
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI / 2 - 0.04
    controls.rotateSpeed = 1
    camera.near = 0.5
  }
  camera.updateProjectionMatrix()
}

/** Wide-open limits while the camera is travelling, so nothing snaps. */
export function relaxLimits(controls: OrbitControlsLike) {
  controls.minDistance = 0.02
  controls.maxDistance = UNRESTRICTED_MAX_DISTANCE
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI
}

interface BowlBounds {
  outerRadiusX: number
  outerRadiusZ: number
  maxHeight: number
}

/**
 * Runs every frame in the stadium view. Keeps the focus point inside the bowl and the
 * camera above ground, and lets zooming out drift back to the default view.
 * Returns true when the camera has zoomed out far enough to release the focused stand.
 */
export function constrainStadiumView(
  controls: OrbitControlsLike,
  camera: THREE.PerspectiveCamera,
  bounds: BowlBounds,
): { releaseFocusedStand: boolean } {
  const target = controls.target

  const maxX = bounds.outerRadiusX * 0.98
  const maxZ = bounds.outerRadiusZ * 0.98
  const outside = (target.x / maxX) ** 2 + (target.z / maxZ) ** 2
  if (outside > 1) {
    const shrink = 1 / Math.sqrt(outside)
    target.x *= shrink
    target.z *= shrink
  }
  target.y = THREE.MathUtils.clamp(target.y, 0, bounds.maxHeight)
  if (camera.position.y < MIN_CAMERA_HEIGHT) camera.position.y = MIN_CAMERA_HEIGHT

  const distance = camera.position.distanceTo(target)
  const maxDistance = controls.maxDistance
  const zoomedOutShare = THREE.MathUtils.clamp(
    (distance - RECENTRE_START_DISTANCE) / (maxDistance - RECENTRE_START_DISTANCE),
    0,
    1,
  )
  if (zoomedOutShare > 0) target.lerp(SCENE_CENTER, zoomedOutShare * zoomedOutShare * 0.06)

  return { releaseFocusedStand: distance > maxDistance * FOCUS_RELEASE_DISTANCE_SHARE }
}
