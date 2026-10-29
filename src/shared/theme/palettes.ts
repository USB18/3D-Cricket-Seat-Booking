import type { Theme } from './useTheme'

/** Colours and light levels used by the 3D scene for one theme. */
export interface ScenePalette {
  /** Colour seats fade towards when another stand is focused. */
  background: string
  // Sky
  skyTop: string
  skyMid: string
  horizon: string
  // Ground and city
  terrain: string
  plaza: string
  road: string
  block: string
  park: string
  laneMarking: string
  // Stadium structure
  outerWall: string
  standRowA: string
  standRowB: string
  standRiser: string
  floodlightPole: string
  // Lighting
  hemisphereSky: string
  hemisphereGround: string
  ambientIntensity: number
  sunIntensity: number
}

export const SCENE_PALETTES: Record<Theme, ScenePalette> = {
  dark: {
    background: '#070b14',
    skyTop: '#02040c',
    skyMid: '#0c1838',
    horizon: '#2b3f7a',
    terrain: '#2a5a44',
    plaza: '#3b4a73',
    road: '#1c2236',
    block: '#2c3552',
    park: '#1f4a38',
    laneMarking: '#cdb760',
    outerWall: '#1a1f2b',
    standRowA: '#2b3140',
    standRowB: '#353c4d',
    standRiser: '#1c212c',
    floodlightPole: '#3b4252',
    hemisphereSky: '#bcd0ff',
    hemisphereGround: '#1a1f2b',
    ambientIntensity: 0.9,
    sunIntensity: 1.4,
  },
  light: {
    background: '#dfe9f6',
    skyTop: '#3f86d6',
    skyMid: '#8dc0f2',
    horizon: '#e3f1ff',
    terrain: '#86b57a',
    plaza: '#cfd3da',
    road: '#5d6573',
    block: '#d9dde3',
    park: '#7fb06f',
    laneMarking: '#ffffff',
    outerWall: '#8f9aab',
    standRowA: '#c9d1dd',
    standRowB: '#b9c2d0',
    standRiser: '#8d98a9',
    floodlightPole: '#6b7385',
    hemisphereSky: '#ffffff',
    hemisphereGround: '#8f9aab',
    ambientIntensity: 1.25,
    sunIntensity: 1.7,
  },
}
