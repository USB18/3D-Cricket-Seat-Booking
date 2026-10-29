import * as THREE from 'three'

/** Point the default view looks at. */
export const SCENE_CENTER = new THREE.Vector3(0, 3, 0)
/** Default view once the user is inside the stadium. */
export const DEFAULT_VIEW_POSITION = new THREE.Vector3(0, 44, 54)
/** Slowly rotating view shown before the user enters. */
export const INTRO_VIEW_POSITION = new THREE.Vector3(0, 46, 112)
/** Where the camera starts the opening fly-in (scaled by stadium size). */
export const FLY_IN_START_POSITION = new THREE.Vector3(0, 190, 230)

/** Seated eye height above the row floor. */
export const SEAT_EYE_HEIGHT = 0.95

export const STADIUM_MIN_DISTANCE = 6
/** Zoom limit while the user has not entered yet (effectively unlimited). */
export const UNRESTRICTED_MAX_DISTANCE = 600
/** How far past the default distance zooming out is allowed. */
export const DEFAULT_DISTANCE_TOLERANCE = 1.02

/** Camera distance within which a focused stand stays highlighted (share of max distance). */
export const FOCUS_RELEASE_DISTANCE_SHARE = 0.78
/** Below this distance zooming out does not pull the view back to the centre. */
export const RECENTRE_START_DISTANCE = 24
/** Lowest the camera may go in the stadium view. */
export const MIN_CAMERA_HEIGHT = 1.5

/** Pull the camera back on tall, narrow screens so the whole bowl still fits. */
export function aspectFitScale(aspect: number): number {
  return aspect >= 1.3 ? 1 : Math.min(2.2, 1.3 / aspect)
}
