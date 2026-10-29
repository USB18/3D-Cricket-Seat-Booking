import { useMemo } from 'react'
import { Stars } from '@react-three/drei'
import { useTheme } from '@/shared/theme/useTheme'
import { createRandom } from '@/shared/lib/random'
import { createGlowTexture } from './textures'
import SkyDome from './SkyDome'

type Vec3 = [number, number, number]

interface Cloud {
  position: Vec3
  size: [number, number]
  opacity: number
}

function createClouds(cameraScale: number): Cloud[] {
  const random = createRandom(7)
  return Array.from({ length: 16 }, () => {
    const angle = random() * Math.PI * 2
    const distance = (420 + random() * 260) * cameraScale
    return {
      position: [Math.cos(angle) * distance, (70 + random() * 120) * cameraScale, Math.sin(angle) * distance],
      size: [(150 + random() * 160) * cameraScale, (45 + random() * 45) * cameraScale],
      opacity: 0.55 + random() * 0.35,
    }
  })
}

/** Sky gradient plus stars and a moon at night, or sun and clouds by day. */
export default function Sky({ cameraScale }: { cameraScale: number }) {
  const isNight = useTheme((state) => state.theme) === 'dark'

  const clouds = useMemo(() => createClouds(cameraScale), [cameraScale])
  const cloudTexture = useMemo(() => createGlowTexture('rgba(255,255,255,0.95)', 'rgba(255,255,255,0)'), [])
  const sunTexture = useMemo(() => createGlowTexture('rgba(255,244,200,1)', 'rgba(255,230,160,0)', 256), [])
  const moonTexture = useMemo(() => createGlowTexture('rgba(255,255,255,1)', 'rgba(190,210,255,0)', 256), [])

  return (
    <>
      <SkyDome radius={900 * cameraScale} />

      {isNight ? (
        <>
          <Stars
            radius={600 * cameraScale}
            depth={90}
            count={2600}
            factor={7}
            saturation={0}
            fade
            speed={0.5}
          />
          <sprite
            position={[-380 * cameraScale, 230 * cameraScale, -520 * cameraScale]}
            scale={[110 * cameraScale, 110 * cameraScale, 1]}
          >
            <spriteMaterial map={moonTexture} fog={false} depthWrite={false} transparent />
          </sprite>
        </>
      ) : (
        <>
          <sprite
            position={[420 * cameraScale, 260 * cameraScale, -560 * cameraScale]}
            scale={[330 * cameraScale, 330 * cameraScale, 1]}
          >
            <spriteMaterial map={sunTexture} fog={false} depthWrite={false} transparent />
          </sprite>
          {clouds.map((cloud, index) => (
            <sprite key={index} position={cloud.position} scale={[cloud.size[0], cloud.size[1], 1]}>
              <spriteMaterial
                map={cloudTexture}
                fog={false}
                depthWrite={false}
                transparent
                opacity={cloud.opacity}
              />
            </sprite>
          ))}
        </>
      )}
    </>
  )
}
