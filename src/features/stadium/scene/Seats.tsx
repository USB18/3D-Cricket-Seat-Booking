import { useLayoutEffect, useMemo, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/store'
import { useScenePalette } from '@/shared/theme/useTheme'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import { cameraControls } from './cameraControls'
import {
  BOOKED_BY_OTHERS_OPACITY,
  SEAT_COLORS,
  createSeatGeometry,
  createSeatMaterial,
  getSeatAlphaAttribute,
} from './seatAppearance'

/** A pointer movement beyond this (px) between press and release is a drag, not a click. */
const CLICK_DRAG_TOLERANCE = 6
/** How far seats of non-focused stands fade towards the background. */
const UNFOCUSED_FADE = 0.6
const HOVER_BRIGHTEN = 0.55

/** Every seat in the stadium, drawn as ONE instanced mesh so thousands stay fast. */
export default function Seats() {
  const { seats } = useStadiumLayout()
  const palette = useScenePalette()
  const mesh = useRef<THREE.InstancedMesh>(null!)

  const geometry = useMemo(() => createSeatGeometry(seats.length), [seats])
  const material = useMemo(() => createSeatMaterial(), [])

  const bookings = useStore((state) => state.bookings)
  const selectedSeatIds = useStore((state) => state.selectedSeatIds)
  const hoveredSeatId = useStore((state) => state.hoveredSeatId)
  const userId = useStore((state) => state.userId)
  const focusedSector = useStore((state) => state.focusedSector)

  // Positions never change after the layout is built.
  useLayoutEffect(() => {
    const instances = mesh.current
    const placeholder = new THREE.Object3D()
    seats.forEach((seat, index) => {
      placeholder.position.set(seat.x, seat.y, seat.z)
      placeholder.rotation.set(0, seat.facingAngle, 0)
      placeholder.updateMatrix()
      instances.setMatrixAt(index, placeholder.matrix)
    })
    instances.instanceMatrix.needsUpdate = true
    instances.computeBoundingSphere()
  }, [seats])

  // Colour and opacity follow booking / selection / hover state.
  useLayoutEffect(() => {
    const instances = mesh.current
    const opacity = getSeatAlphaAttribute(geometry)
    const color = new THREE.Color()
    const fadeTarget = new THREE.Color(palette.background)

    seats.forEach((seat, index) => {
      const owner = bookings[seat.id]
      const bookedByOther = owner !== undefined && owner !== userId

      if (owner) {
        color.copy(bookedByOther ? SEAT_COLORS.bookedByOthers : SEAT_COLORS.bookedByMe)
      } else if (selectedSeatIds.includes(seat.id)) {
        color.copy(SEAT_COLORS.selected)
      } else {
        color.copy(SEAT_COLORS.priceTier[seat.priceTier])
        if (focusedSector !== null && seat.sector !== focusedSector) color.lerp(fadeTarget, UNFOCUSED_FADE)
      }
      if (seat.id === hoveredSeatId && !owner) color.lerp(SEAT_COLORS.hoverTint, HOVER_BRIGHTEN)

      instances.setColorAt(index, color)
      opacity.setX(index, bookedByOther ? BOOKED_BY_OTHERS_OPACITY : 1)
    })

    if (instances.instanceColor) instances.instanceColor.needsUpdate = true
    opacity.needsUpdate = true
  }, [seats, geometry, bookings, selectedSeatIds, hoveredSeatId, userId, focusedSector, palette.background])

  const seatIdAt = (event: ThreeEvent<PointerEvent | MouseEvent>) =>
    event.instanceId !== undefined ? seats[event.instanceId]?.id : undefined

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const state = useStore.getState()
    if (!state.hasEntered) return
    event.stopPropagation()

    const seatId = seatIdAt(event)
    state.setHoveredSeat(seatId ?? null)

    const owner = seatId ? state.bookings[seatId] : undefined
    const blocked = owner !== undefined && owner !== state.userId
    document.body.style.cursor = seatId && !blocked ? 'pointer' : 'not-allowed'
  }

  const handlePointerOut = () => {
    useStore.getState().setHoveredSeat(null)
    document.body.style.cursor = ''
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > CLICK_DRAG_TOLERANCE) return // a drag, not a click
    if (!useStore.getState().hasEntered) return // the first click only enters the stadium
    event.stopPropagation()

    const seatId = seatIdAt(event)
    if (!seatId) return

    const wasSelected = useStore.getState().selectedSeatIds.includes(seatId)
    useStore.getState().toggleSeat(seatId)
    const after = useStore.getState()

    if (after.selectedSeatIds.includes(seatId)) {
      cameraControls.viewFromSeat(seatId) // sit in the seat they just picked
    } else if (wasSelected && after.seatViewId === seatId) {
      cameraControls.leaveSeatView()
    }
  }

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, seats.length]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={material} attach="material" />
    </instancedMesh>
  )
}
