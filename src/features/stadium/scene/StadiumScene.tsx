import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useStore } from '@/store'
import { useScenePalette } from '@/shared/theme/useTheme'
import { useStadiumLayout } from '../layout/useStadiumLayout'
import CameraRig from './CameraRig'
import Environment from './environment/Environment'
import PlayingField from './PlayingField'
import Seats from './Seats'
import SectorLabels from './SectorLabels'
import StadiumShell from './StadiumShell'
import StandsBowl from './StandsBowl'

/** Distance (in scene units, scaled by stadium size) where haze starts / fully hides things. */
const FOG_NEAR = 220
const FOG_FAR = 760

/** The whole 3D view: lights, scenery, stadium, seats and the camera. */
export default function StadiumScene() {
  const { cameraScale } = useStadiumLayout()
  const palette = useScenePalette()
  const hasEntered = useStore((state) => state.hasEntered)
  const seatViewId = useStore((state) => state.seatViewId)

  return (
    <Canvas
      camera={{ position: [0, 190, 230], fov: 45, near: 0.5, far: 3500 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      onPointerMissed={() => (document.body.style.cursor = '')}
    >
      <color attach="background" args={[palette.horizon]} />
      <fog attach="fog" args={[palette.horizon, FOG_NEAR * cameraScale, FOG_FAR * cameraScale]} />
      <hemisphereLight args={[palette.hemisphereSky, palette.hemisphereGround, palette.ambientIntensity]} />
      <directionalLight position={[40, 80, 30]} intensity={palette.sunIntensity} />

      <Environment />
      <StadiumShell />
      <PlayingField />
      <StandsBowl />
      <Seats />
      {hasEntered && !seatViewId && <SectorLabels />}

      {/* Before entering the stadium slowly spins on its own; zoom and pan unlock after. */}
      <OrbitControls
        makeDefault
        autoRotate={!hasEntered}
        autoRotateSpeed={1.1}
        enableDamping
        dampingFactor={0.08}
        zoomToCursor
        panSpeed={0.8}
      />
      <CameraRig />
    </Canvas>
  )
}
