import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const ORANGE = '#f0732d'

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => Math.min(Math.max(v, 0), 1)

/* Windowed progress: each scene gets its own slice of the 0..1
   horizontal-scroll progress and maps it back to its own 0..1. */
export function slice(progress, from, to) {
  return clamp01((progress - from) / (to - from))
}

function labelTexture(text, dark) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = dark ? '#16111f' : '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = dark ? '#3a2a44' : '#e7e7e7'
  ctx.lineWidth = 8
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)
  ctx.fillStyle = dark ? '#f4f1f8' : '#16141a'
  ctx.font = 'bold 62px "DM Sans", Helvetica, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4)
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function ringTexture(text, dark) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = dark ? '#f6f2fb' : '#1a1720'
  ctx.font = 'bold 120px "DM Sans", Helvetica, Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const unit = `${text}   ·   `
  let x = 0
  while (x < canvas.width) {
    ctx.fillText(unit, x, canvas.height / 2)
    x += ctx.measureText(unit).width
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.repeat.x = 3
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/* ---------- Scene 1: parts assembling into a stack ---------- */

const STACK = ['Next.js', 'FastAPI', 'PostgreSQL', 'Render']

export function PartsAssembling({ t, dark }) {
  const group = useRef(null)
  const textures = useMemo(() => STACK.map((label) => labelTexture(label, dark)), [dark])
  useEffect(() => () => textures.forEach((tex) => tex.dispose()), [textures])

  const parts = useMemo(
    () =>
      STACK.map((label, i) => ({
        label,
        target: [0, (STACK.length - 1) / 2 - i, 0],
        from: [
          Math.cos(i * 2.4) * 3.6,
          (STACK.length - 1) / 2 - i + Math.sin(i * 1.7) * 1.35,
          Math.sin(i * 2.4) * 2.6,
        ],
        drift: [0.5 + i * 0.27, 0.34 + i * 0.19],
        spin: [Math.PI * (0.9 + i * 0.3), Math.PI * (1.4 - i * 0.25), 0],
      })),
    []
  )

  const meshRefs = useRef([])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.35) * 0.32 + (1 - t) * 0.5
      group.current.position.y = Math.sin(time * 0.7) * 0.08
    }
    // Loose parts bob independently; the bob fades out as they lock into
    // the stack, so the assembled state stays perfectly aligned.
    const loose = 1 - t
    for (let i = 0; i < parts.length; i++) {
      const mesh = meshRefs.current[i]
      if (!mesh) continue
      const [a, b] = parts[i].drift
      mesh.position.y = mesh.userData.baseY + Math.sin(time * a + i) * 0.18 * loose
      mesh.rotation.z = Math.sin(time * b + i * 1.4) * 0.12 * loose
    }
  })

  return (
    <group ref={group}>
      {parts.map((part, i) => {
        const local = clamp01((t - i * 0.09) / 0.62)
        const ease = 1 - Math.pow(1 - local, 3)
        return (
          <mesh
            key={part.label}
            ref={(node) => {
              meshRefs.current[i] = node
              if (node) node.userData.baseY = lerp(part.from[1], part.target[1], ease)
            }}
            position={[
              lerp(part.from[0], part.target[0], ease),
              lerp(part.from[1], part.target[1], ease),
              lerp(part.from[2], part.target[2], ease),
            ]}
            rotation={[lerp(part.spin[0], 0, ease), lerp(part.spin[1], 0, ease), lerp(part.spin[2], 0, ease)]}
          >
            <boxGeometry args={[3.1, 0.86, 1.5]} />
            <meshStandardMaterial
              map={textures[i]}
              roughness={0.45}
              metalness={0.15}
              transparent
              opacity={0.62 + ease * 0.38}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ---------- Scene 2: the ball with an orbiting text ring ---------- */

export function BallText({ t, dark }) {
  const ball = useRef(null)
  const ring = useRef(null)
  const texture = useMemo(() => ringTexture('OPENROUTER · GROQ · SARVAM · EDGE-TTS', dark), [dark])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    if (ball.current) {
      ball.current.rotation.y += delta * 0.25
      ball.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.18
      const s = 0.75 + t * 0.45
      ball.current.scale.setScalar(s)
    }
    if (ring.current) {
      ring.current.rotation.y -= delta * 0.45
      ring.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.22
    }
  })

  return (
    <group>
      <mesh ref={ball}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshStandardMaterial
          color={ORANGE}
          flatShading
          roughness={0.35}
          metalness={0.3}
          emissive={ORANGE}
          emissiveIntensity={dark ? 0.28 : 0.08}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.6, 0, 0]}>
        <cylinderGeometry args={[3.05, 3.05, 0.85, 64, 1, true]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} opacity={0.2 + t * 0.8} />
      </mesh>
    </group>
  )
}

/* ---------- Scene 3: displaced wireframe grid ---------- */

export function GridScene({ t, dark }) {
  const mesh = useRef(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(11, 7, 44, 28), [])
  const base = useMemo(() => geometry.attributes.position.array.slice(), [geometry])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state) => {
    const position = geometry.attributes.position
    const time = state.clock.elapsedTime
    for (let i = 0; i < position.count; i++) {
      const x = base[i * 3]
      const y = base[i * 3 + 1]
      position.array[i * 3 + 2] =
        Math.sin(x * 0.7 + time * 1.1) * 0.34 * t + Math.cos(y * 0.9 - time * 0.8) * 0.28 * t
    }
    position.needsUpdate = true
    if (mesh.current) mesh.current.rotation.z = Math.sin(time * 0.2) * 0.06
  })

  return (
    <mesh ref={mesh} geometry={geometry} rotation={[-Math.PI / 3.1, 0, 0]} position={[0, -0.4, 0]}>
      <meshBasicMaterial color={dark ? '#8b6cff' : ORANGE} wireframe transparent opacity={0.28 + t * 0.5} />
    </mesh>
  )
}

/* ---------- Scene 4: the shipping robot ---------- */

export function RobotScene({ t, dark }) {
  const group = useRef(null)
  const head = useRef(null)
  const arm = useRef(null)
  const antenna = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (group.current) {
      group.current.position.y = -0.3 + Math.sin(time * 1.1) * 0.14
      group.current.scale.setScalar(0.72 + t * 0.3)
    }
    if (head.current) {
      head.current.rotation.y = lerp(head.current.rotation.y, pointer.current.x * 0.6, 0.08)
      head.current.rotation.x = lerp(head.current.rotation.x, -pointer.current.y * 0.35, 0.08)
    }
    if (arm.current) arm.current.rotation.z = -0.5 + Math.sin(time * 4) * 0.7 * t
    if (antenna.current) antenna.current.scale.y = 1 + Math.sin(time * 6) * 0.18
  })

  const body = dark ? '#2a2436' : '#f4f0ec'
  const trim = dark ? '#4a3f60' : '#d9d2cc'

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* torso */}
      <mesh position={[0, -0.35, 0]}>
        <capsuleGeometry args={[0.78, 0.85, 6, 18]} />
        <meshStandardMaterial color={body} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* chest light */}
      <mesh position={[0, -0.2, 0.74]}>
        <circleGeometry args={[0.22, 24]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.4} />
      </mesh>
      {/* head */}
      <group ref={head} position={[0, 0.82, 0]}>
        <mesh>
          <boxGeometry args={[1.28, 0.98, 1.0]} />
          <meshStandardMaterial color={body} roughness={0.42} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.02, 0.52]}>
          <boxGeometry args={[0.96, 0.44, 0.06]} />
          <meshStandardMaterial color="#14121c" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[-0.2, 0.02, 0.57]}>
          <circleGeometry args={[0.1, 20]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0.2, 0.02, 0.57]}>
          <circleGeometry args={[0.1, 20]} />
          <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.8} />
        </mesh>
        <group ref={antenna} position={[0, 0.49, 0]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.44, 8]} />
            <meshStandardMaterial color={trim} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>
      {/* waving arm */}
      <group ref={arm} position={[0.86, -0.1, 0]}>
        <mesh position={[0.28, 0.1, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.16, 0.62, 4, 12]} />
          <meshStandardMaterial color={trim} roughness={0.5} />
        </mesh>
      </group>
      {/* still arm */}
      <mesh position={[-1.02, -0.42, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.16, 0.62, 4, 12]} />
        <meshStandardMaterial color={trim} roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ---------- Always-on ambient field ---------- */

export function AmbientField({ dark }) {
  const points = useRef(null)
  const geometry = useMemo(() => {
    const count = 150
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.45
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 3
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * 0.035
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={dark ? 0.55 : 0.35}
        color={dark ? '#b39dff' : ORANGE}
      />
    </points>
  )
}
