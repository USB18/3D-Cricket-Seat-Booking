import { useMemo } from 'react'
import * as THREE from 'three'
import { useScenePalette } from '@/shared/theme/useTheme'

const VERTEX_SHADER = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`

/** Blends horizon -> middle -> top colour by height in the sky. */
const FRAGMENT_SHADER = `
  uniform vec3 topColor;
  uniform vec3 middleColor;
  uniform vec3 horizonColor;
  varying vec3 vPosition;
  void main() {
    float height = normalize(vPosition).y;
    vec3 color = mix(horizonColor, middleColor, smoothstep(-0.02, 0.22, height));
    color = mix(color, topColor, smoothstep(0.18, 0.75, height));
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`

/** A giant inside-out sphere painted with the sky gradient. */
export default function SkyDome({ radius }: { radius: number }) {
  const palette = useScenePalette()

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          topColor: { value: new THREE.Color(palette.skyTop) },
          middleColor: { value: new THREE.Color(palette.skyMid) },
          horizonColor: { value: new THREE.Color(palette.horizon) },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      }),
    [palette],
  )

  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[radius, 32, 24]} />
    </mesh>
  )
}
