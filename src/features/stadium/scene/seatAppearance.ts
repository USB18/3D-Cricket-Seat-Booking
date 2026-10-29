import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { PriceTier } from '../layout/types'

/** Colour of a seat for every state it can be in. */
export const SEAT_COLORS = {
  priceTier: {
    0: new THREE.Color('#a78bfa'),
    1: new THREE.Color('#4f8cff'),
    2: new THREE.Color('#2dd4bf'),
  } satisfies Record<PriceTier, THREE.Color>,
  bookedByOthers: new THREE.Color('#8a93a3'),
  bookedByMe: new THREE.Color('#facc15'),
  selected: new THREE.Color('#fb923c'),
  hoverTint: new THREE.Color('#ffffff'),
}

/** Seats booked by someone else are drawn at half opacity. */
export const BOOKED_BY_OTHERS_OPACITY = 0.5

const ALPHA_ATTRIBUTE = 'seatAlpha'

/** One seat: a cushion plus a backrest, merged into a single geometry. */
export function createSeatGeometry(seatCount: number): THREE.BufferGeometry {
  const cushion = new THREE.BoxGeometry(0.72, 0.28, 0.62)
  cushion.translate(0, 0.2, 0)
  const backrest = new THREE.BoxGeometry(0.72, 0.55, 0.12)
  backrest.translate(0, 0.5, -0.25)

  const geometry = mergeGeometries([cushion, backrest])!
  // One opacity value per seat instance, read by the patched material below.
  geometry.setAttribute(
    ALPHA_ATTRIBUTE,
    new THREE.InstancedBufferAttribute(new Float32Array(seatCount).fill(1), 1),
  )
  return geometry
}

export const getSeatAlphaAttribute = (geometry: THREE.BufferGeometry) =>
  geometry.getAttribute(ALPHA_ATTRIBUTE) as THREE.InstancedBufferAttribute

/** Standard material, patched so each instance can have its own opacity. */
export function createSeatMaterial(): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.55,
    metalness: 0.1,
    transparent: true,
  })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>\nattribute float ${ALPHA_ATTRIBUTE};\nvarying float vSeatAlpha;`,
      )
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvSeatAlpha = ${ALPHA_ATTRIBUTE};`)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vSeatAlpha;')
      .replace('#include <opaque_fragment>', 'diffuseColor.a *= vSeatAlpha;\n#include <opaque_fragment>')
  }
  return material
}
