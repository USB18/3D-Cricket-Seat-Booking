import * as THREE from 'three'
import { createRandom } from '@/shared/lib/random'

function canvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return { canvas, context: canvas.getContext('2d')! }
}

/** Mowed-lawn stripes for the outfield. */
export function createGrassTexture(): THREE.CanvasTexture {
  const size = 512
  const stripes = 16
  const { canvas, context } = createCanvas(size, size)
  for (let i = 0; i < stripes; i++) {
    context.fillStyle = i % 2 ? '#2f8f3e' : '#37a048'
    context.fillRect((i * size) / stripes, 0, size / stripes, size)
  }
  return canvasTexture(canvas)
}

/** Soft round glow, used for the sun, moon and clouds. */
export function createGlowTexture(inner: string, outer: string, size = 128): THREE.CanvasTexture {
  const { canvas, context } = createCanvas(size, size)
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, inner)
  gradient.addColorStop(1, outer)
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)
  return canvasTexture(canvas)
}

/** A grid of windows — lit at night, glassy blue by day. */
export function createWindowTexture(night: boolean): THREE.CanvasTexture {
  const columns = 8
  const rows = 16
  const cell = 12
  const { canvas, context } = createCanvas(columns * cell, rows * cell)
  const random = createRandom(11)

  context.fillStyle = night ? '#0d1424' : '#b5c3d6'
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const lit = random() < (night ? 0.42 : 0.55)
      if (night) {
        context.fillStyle = lit ? (random() < 0.2 ? '#ffffff' : '#ffd27a') : '#141c30'
      } else {
        context.fillStyle = lit ? '#8db4e0' : '#9fb0c6'
      }
      context.fillRect(column * cell + 2, row * cell + 3, cell - 4, cell - 6)
    }
  }

  const texture = canvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}
