import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

import { AmbientField, BallText, GridScene, PartsAssembling, RobotScene, slice } from './scenes.jsx'

/* One WebGL context for the whole journey section. Each panel owns a
   slice of the scroll progress; a scene is mounted only inside its own
   slice and scales in and out at the edges, so consecutive scenes
   dissolve into each other instead of colliding in the same volume. */
const LAYOUT = [
  { key: 'parts-assembling', from: 0.0, to: 0.28 },
  { key: 'ball-text', from: 0.26, to: 0.52 },
  { key: 'grid-scene', from: 0.5, to: 0.76 },
  { key: 'robot-scene', from: 0.74, to: 1.0 },
]

const RAMP = 0.2

/* Ramps to zero at both ends of a slice so neighbours cross-dissolve —
   except at the very start and very end of the section, where there is
   no neighbour and fading out would just leave the stage empty. */
function presence(t, isFirst, isLast) {
  const fadeIn = isFirst ? 1 : Math.min(1, t / RAMP)
  const fadeOut = isLast ? 1 : Math.min(1, (1 - t) / RAMP)
  return fadeIn * fadeOut
}

function Scenes({ progress, dark }) {
  return LAYOUT.map(({ key, from, to }, index) => {
    if (progress < from || progress > to) return null
    const isFirst = index === 0
    const isLast = index === LAYOUT.length - 1
    const t = slice(progress, from, to)
    const p = presence(t, isFirst, isLast)
    if (p <= 0.001) return null
    return (
      <group key={key} scale={p}>
        {key === 'parts-assembling' && <PartsAssembling t={t} dark={dark} />}
        {key === 'ball-text' && <BallText t={t} dark={dark} />}
        {key === 'grid-scene' && <GridScene t={t} dark={dark} />}
        {key === 'robot-scene' && <RobotScene t={t} dark={dark} />}
      </group>
    )
  })
}

export default function JourneyCanvas({ progress, dark }) {
  return (
    <div className="journey-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={dark ? 0.55 : 0.85} />
        <directionalLight position={[4, 6, 5]} intensity={dark ? 1.4 : 1.1} />
        <directionalLight position={[-5, -2, -4]} intensity={0.35} color="#f0732d" />
        <Suspense fallback={null}>
          {/* Always on, so the stage is never blank between hand-offs. */}
          <AmbientField dark={dark} />
          <Scenes progress={progress} dark={dark} />
        </Suspense>
      </Canvas>
    </div>
  )
}
