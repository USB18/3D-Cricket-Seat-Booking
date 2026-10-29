import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '@/store'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import {
  DEFAULT_VIEW_POSITION,
  FLY_IN_START_POSITION,
  INTRO_VIEW_POSITION,
  SCENE_CENTER,
  SEAT_EYE_HEIGHT,
  aspectFitScale,
} from './cameraConfig'
import { cameraControls } from './cameraControls'
import {
  applyModeLimits,
  constrainStadiumView,
  relaxLimits,
  type CameraMode,
  type OrbitControlsLike,
} from './cameraLimits'

/**
 * Owns the camera: moves it between views, enforces zoom / rotation limits for
 * each mode, and keeps the user inside the stadium. Renders nothing.
 */
export default function CameraRig() {
  const layout = useStadiumLayout()
  const { pointOnRing, sectorArc, rowHeight, seats, seatIndexById, outerRadiusX, outerRadiusZ, cameraScale } =
    layout

  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera
  const controls = useThree((state) => state.controls) as unknown as OrbitControlsLike | null

  const mode = useRef<CameraMode>('stadium')
  const isFlying = useRef(false)
  const introPlayed = useRef(false)

  useEffect(() => {
    if (!controls) return

    const store = () => useStore.getState()
    const sizeFit = () => aspectFitScale(camera.aspect)
    const defaultViewPosition = () => DEFAULT_VIEW_POSITION.clone().multiplyScalar(sizeFit() * cameraScale)
    const defaultViewDistance = () => DEFAULT_VIEW_POSITION.distanceTo(SCENE_CENTER) * cameraScale * sizeFit()

    const applyLimits = () =>
      applyModeLimits(controls, camera, mode.current, {
        hasEntered: store().hasEntered,
        defaultViewDistance: defaultViewDistance(),
      })

    const stopFlight = () => {
      gsap.killTweensOf(camera.position)
      gsap.killTweensOf(controls.target)
      isFlying.current = false
    }

    const flyTo = (position: THREE.Vector3, lookAt: THREE.Vector3, seconds: number, nextMode: CameraMode) => {
      stopFlight()
      mode.current = nextMode
      isFlying.current = true
      relaxLimits(controls)

      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: seconds,
        ease: 'power3.inOut',
      })
      gsap.to(controls.target, {
        x: lookAt.x,
        y: lookAt.y,
        z: lookAt.z,
        duration: seconds,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
        onComplete: () => {
          isFlying.current = false
          applyLimits()
        },
      })
    }

    // ---- commands exposed to the HUD -----------------------------------

    cameraControls.showFullView = () => {
      store().setSeatView(null)
      store().setFocusedSector(null)
      flyTo(defaultViewPosition(), SCENE_CENTER, 1.6, 'stadium')
    }

    cameraControls.enterStadium = () => flyTo(defaultViewPosition(), SCENE_CENTER, 2.2, 'stadium')

    cameraControls.focusSector = (sector) => {
      store().setSeatView(null)
      store().setFocusedSector(sector)

      const [arcStart, arcEnd] = sectorArc(sector)
      const [x, z] = pointOnRing((arcStart + arcEnd) / 2, 5)
      const lookAt = new THREE.Vector3(x, rowHeight(5) + 0.4, z)
      const position = new THREE.Vector3(x * 0.3, lookAt.y + 15 * sizeFit(), z * 0.3)
      flyTo(position, lookAt, 1.6, 'stadium')
    }

    // Sit in the seat: eye height, facing the pitch, free to look around.
    cameraControls.viewFromSeat = (seatId) => {
      const seat = seats[seatIndexById.get(seatId) ?? -1]
      if (!seat) return
      store().setSeatView(seatId)
      store().setFocusedSector(seat.sector)

      const distance = Math.hypot(seat.x, seat.z)
      const towardsPitchX = -seat.x / distance
      const towardsPitchZ = -seat.z / distance
      const eye = new THREE.Vector3(
        seat.x + towardsPitchX * 0.05,
        seat.y + SEAT_EYE_HEIGHT,
        seat.z + towardsPitchZ * 0.05,
      )
      const lookAt = new THREE.Vector3(
        eye.x + towardsPitchX * 0.06,
        eye.y - 0.012,
        eye.z + towardsPitchZ * 0.06,
      )
      flyTo(eye, lookAt, 1.5, 'seat')
    }

    // Leaving a seat view goes back to the default view you get on entering.
    cameraControls.leaveSeatView = () => cameraControls.showFullView()

    cameraControls.zoomIn = () => {
      if (mode.current === 'seat') return
      const offset = camera.position.clone().sub(controls.target)
      const distance = THREE.MathUtils.clamp(
        offset.length() * 0.7,
        controls.minDistance,
        controls.maxDistance,
      )
      offset.setLength(distance).add(controls.target)
      gsap.to(camera.position, {
        x: offset.x,
        y: offset.y,
        z: offset.z,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => controls.update(),
      })
    }

    // ---- wiring ---------------------------------------------------------

    // Any user input cancels a running fly-to.
    const onUserInput = () => {
      stopFlight()
      applyLimits()
    }
    controls.addEventListener('start', onUserInput)

    const unsubscribe = useStore.subscribe((state, previous) => {
      if (state.hasEntered !== previous.hasEntered && !isFlying.current) applyLimits()
    })
    applyLimits()

    // Opening shot: swoop in from far away to the slow-rotating intro view.
    if (!introPlayed.current) {
      introPlayed.current = true
      const fit = sizeFit()
      camera.position.copy(FLY_IN_START_POSITION).multiplyScalar(fit * cameraScale)
      controls.target.set(0, 0, 0)
      controls.update()
      flyTo(
        INTRO_VIEW_POSITION.clone().multiplyScalar(fit * cameraScale),
        new THREE.Vector3(0, 0, 0),
        2.6,
        'stadium',
      )
    }

    return () => {
      controls.removeEventListener('start', onUserInput)
      unsubscribe()
    }
  }, [camera, controls, layout, pointOnRing, sectorArc, rowHeight, seats, seatIndexById, cameraScale])

  // Every frame in the stadium view: stay inside the bowl; zooming out clears the focused stand.
  useFrame(() => {
    if (!controls || isFlying.current || mode.current !== 'stadium') return
    const state = useStore.getState()
    if (!state.hasEntered) return

    const { releaseFocusedStand } = constrainStadiumView(controls, camera, {
      outerRadiusX,
      outerRadiusZ,
      maxHeight: rowHeight(layout.rowCount) + 1,
    })
    if (releaseFocusedStand && state.focusedSector !== null) state.setFocusedSector(null)
  })

  return null
}
