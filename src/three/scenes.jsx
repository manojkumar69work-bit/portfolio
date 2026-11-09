import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

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

const smooth = (v) => v * v * (3 - 2 * v)

function shadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

const EQ_BARS = 7

/* A hovering assistant: it tracks the cursor with its body, head and eyes,
   blinks, talks on its chest screen and waves harder the further the
   panel has scrolled in. */
export function RobotScene({ t, dark }) {
  const root = useRef(null)
  const bot = useRef(null)
  const head = useRef(null)
  const eyes = useRef(null)
  const antenna = useRef(null)
  const antennaTip = useRef(null)
  const waveShoulder = useRef(null)
  const waveElbow = useRef(null)
  const idleShoulder = useRef(null)
  const flame = useRef(null)
  const shadow = useRef(null)
  const eq = useRef([])
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

  const geo = useMemo(
    () => ({
      head: new RoundedBoxGeometry(1.42, 1.02, 1.06, 5, 0.26),
      visor: new RoundedBoxGeometry(1.14, 0.58, 0.1, 4, 0.045),
      screen: new RoundedBoxGeometry(0.78, 0.46, 0.08, 3, 0.035),
    }),
    []
  )
  const shadowMap = useMemo(shadowTexture, [])
  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose())
      shadowMap.dispose()
    },
    [geo, shadowMap]
  )

  const mat = useMemo(() => {
    const shell = new THREE.MeshPhysicalMaterial({
      color: dark ? '#3b3252' : '#fffaf5',
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.22,
    })
    const trim = new THREE.MeshStandardMaterial({ color: dark ? '#5a4c74' : '#ece4dc', roughness: 0.45, metalness: 0.2 })
    const joint = new THREE.MeshStandardMaterial({ color: dark ? '#1c1828' : '#3a3440', roughness: 0.35, metalness: 0.55 })
    const glass = new THREE.MeshPhysicalMaterial({ color: '#0d0b14', roughness: 0.08, metalness: 0.3, clearcoat: 1 })
    const glow = new THREE.MeshBasicMaterial({ color: ORANGE, toneMapped: false })
    const soft = new THREE.MeshStandardMaterial({ color: ORANGE, emissive: ORANGE, emissiveIntensity: 1.6 })
    const blush = new THREE.MeshBasicMaterial({ color: '#ff8fa3', transparent: true, opacity: dark ? 0.35 : 0.5 })
    const fire = new THREE.MeshBasicMaterial({
      color: '#ff9a4a',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
    return { shell, trim, joint, glass, glow, soft, blush, fire }
  }, [dark])
  useEffect(() => () => Object.values(mat).forEach((m) => m.dispose()), [mat])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const { x: px, y: py } = pointer.current
    const wave = smooth(t)

    if (root.current) root.current.scale.setScalar(0.72 + t * 0.3)

    const hover = Math.sin(time * 1.6)
    if (bot.current) {
      bot.current.position.y = hover * 0.12
      bot.current.rotation.y = lerp(bot.current.rotation.y, px * 0.35, 0.05)
      bot.current.rotation.z = lerp(bot.current.rotation.z, -px * 0.06 + Math.sin(time * 0.8) * 0.03, 0.05)
    }
    if (shadow.current) {
      const s = 1 - hover * 0.08
      shadow.current.scale.set(1.9 * s, 0.42 * s, 1)
      shadow.current.material.opacity = (dark ? 0.5 : 0.32) * (1.08 - hover * 0.12)
    }
    if (head.current) {
      head.current.rotation.y = lerp(head.current.rotation.y, px * 0.45, 0.08)
      head.current.rotation.x = lerp(head.current.rotation.x, -py * 0.3, 0.08)
      head.current.rotation.z = Math.sin(time * 1.3) * 0.04 + wave * Math.sin(time * 3) * 0.04
    }
    if (eyes.current) {
      eyes.current.position.x = lerp(eyes.current.position.x, px * 0.09, 0.15)
      eyes.current.position.y = lerp(eyes.current.position.y, py * 0.05, 0.15)
      // Quick double-blink every few seconds.
      const c = time % 4.2
      const closed = c < 0.12 || (c > 0.28 && c < 0.38)
      eyes.current.scale.y = lerp(eyes.current.scale.y, closed ? 0.08 : 1, 0.5)
    }
    if (antenna.current) {
      antenna.current.rotation.z = Math.sin(time * 3.2) * 0.12 - (bot.current?.rotation.y ?? 0) * 0.25
      antenna.current.rotation.x = Math.cos(time * 2.4) * 0.08
    }
    if (antennaTip.current) antennaTip.current.material.emissiveIntensity = 1.2 + Math.sin(time * 5) * 0.8

    if (waveShoulder.current) waveShoulder.current.rotation.z = lerp(0.28, 2.55, wave) + Math.sin(time * 1.4) * 0.05
    if (waveElbow.current) waveElbow.current.rotation.z = wave * (0.35 + Math.sin(time * 7) * 0.55)
    if (idleShoulder.current) idleShoulder.current.rotation.z = -0.28 - Math.sin(time * 1.6 + 1) * 0.07

    for (let i = 0; i < EQ_BARS; i++) {
      const bar = eq.current[i]
      if (!bar) continue
      const level = 0.25 + Math.abs(Math.sin(time * (5 + i * 0.9) + i * 1.7)) * 0.75 * (0.4 + 0.6 * wave)
      bar.scale.y = level
    }
    if (flame.current) {
      flame.current.scale.y = 0.85 + Math.sin(time * 24) * 0.08 + Math.sin(time * 9) * 0.1 - hover * 0.1
      flame.current.scale.x = flame.current.scale.z = 0.95 + Math.sin(time * 18) * 0.05
    }
  })

  return (
    <group ref={root} position={[0, 0.1, 0]}>
      <pointLight position={[2.2, 2.6, 4]} intensity={dark ? 18 : 26} distance={14} />
      <pointLight position={[-2.6, 1.2, -2]} intensity={10} distance={10} color={ORANGE} />

      {/* soft floor shadow, stays put while the body hovers */}
      <mesh ref={shadow} position={[0, -2.35, -0.4]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowMap} transparent depthWrite={false} />
      </mesh>

      <group ref={bot}>
        {/* torso */}
        <mesh position={[0, -0.45, 0]} scale={[1, 1.08, 0.86]} material={mat.shell}>
          <sphereGeometry args={[0.85, 48, 32]} />
        </mesh>
        <mesh position={[0, -0.58, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.86, 1]} material={mat.trim}>
          <torusGeometry args={[0.85, 0.045, 12, 64]} />
        </mesh>

        {/* chest screen with a talking equalizer */}
        <group position={[0, -0.24, 0.68]} rotation={[-0.2, 0, 0]}>
          <mesh geometry={geo.screen} material={mat.glass} />
          {Array.from({ length: EQ_BARS }, (_, i) => (
            <mesh
              key={i}
              ref={(node) => (eq.current[i] = node)}
              position={[(i - (EQ_BARS - 1) / 2) * 0.09, 0, 0.045]}
              material={mat.glow}
            >
              <planeGeometry args={[0.045, 0.3]} />
            </mesh>
          ))}
        </group>

        {/* thruster */}
        <mesh position={[0, -1.38, 0]} material={mat.joint}>
          <cylinderGeometry args={[0.24, 0.32, 0.16, 32]} />
        </mesh>
        <mesh position={[0, -1.47, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat.glow}>
          <torusGeometry args={[0.25, 0.03, 10, 40]} />
        </mesh>
        <group ref={flame} position={[0, -1.47, 0]}>
          <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]} material={mat.fire}>
            <coneGeometry args={[0.2, 0.6, 24, 1, true]} />
          </mesh>
        </group>

        {/* neck */}
        <mesh position={[0, 0.47, 0]} material={mat.joint}>
          <cylinderGeometry args={[0.17, 0.22, 0.24, 24]} />
        </mesh>

        {/* head */}
        <group ref={head} position={[0, 0.98, 0]}>
          <mesh geometry={geo.head} material={mat.shell} />
          <mesh geometry={geo.visor} position={[0, 0.04, 0.5]} material={mat.glass} />
          <group ref={eyes} position={[0, 0.04, 0.56]}>
            {[-0.24, 0.24].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <mesh scale={[0.8, 1, 1]} material={mat.glow}>
                  <circleGeometry args={[0.12, 32]} />
                </mesh>
                <mesh position={[0.035, 0.045, 0.002]}>
                  <circleGeometry args={[0.03, 16]} />
                  <meshBasicMaterial color="#fff6ee" toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
          {[-0.42, 0.42].map((x) => (
            <mesh key={x} position={[x, -0.33, 0.531]} scale={[1, 0.6, 1]} material={mat.blush}>
              <circleGeometry args={[0.09, 24]} />
            </mesh>
          ))}
          {/* ears */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.73, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <mesh material={mat.trim}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
              </mesh>
              <mesh position={[0, side * 0.055, 0]} material={mat.soft}>
                <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
              </mesh>
            </group>
          ))}
          {/* springy antenna */}
          <group ref={antenna} position={[0, 0.5, 0]}>
            <mesh position={[0, 0.06, 0]} material={mat.joint}>
              <cylinderGeometry args={[0.09, 0.11, 0.08, 20]} />
            </mesh>
            <mesh position={[0, 0.25, 0]} material={mat.trim}>
              <cylinderGeometry args={[0.025, 0.025, 0.36, 10]} />
            </mesh>
            <mesh ref={antennaTip} position={[0, 0.47, 0]}>
              <sphereGeometry args={[0.1, 24, 24]} />
              <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.6} />
            </mesh>
          </group>
        </group>

        {/* waving arm (viewer's right) */}
        <group ref={waveShoulder} position={[0.86, -0.12, 0]}>
          <mesh material={mat.joint}>
            <sphereGeometry args={[0.17, 24, 24]} />
          </mesh>
          <mesh position={[0, -0.3, 0]} material={mat.trim}>
            <capsuleGeometry args={[0.12, 0.34, 6, 16]} />
          </mesh>
          <group ref={waveElbow} position={[0, -0.56, 0]}>
            <mesh material={mat.joint}>
              <sphereGeometry args={[0.12, 20, 20]} />
            </mesh>
            <mesh position={[0, -0.24, 0]} material={mat.trim}>
              <capsuleGeometry args={[0.11, 0.28, 6, 16]} />
            </mesh>
            <mesh position={[0, -0.5, 0]} material={mat.shell}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
          </group>
        </group>

        {/* resting arm (viewer's left) */}
        <group ref={idleShoulder} position={[-0.86, -0.12, 0]}>
          <mesh material={mat.joint}>
            <sphereGeometry args={[0.17, 24, 24]} />
          </mesh>
          <mesh position={[0, -0.3, 0]} material={mat.trim}>
            <capsuleGeometry args={[0.12, 0.34, 6, 16]} />
          </mesh>
          <group position={[0, -0.56, 0]} rotation={[0, 0, 0.25]}>
            <mesh material={mat.joint}>
              <sphereGeometry args={[0.12, 20, 20]} />
            </mesh>
            <mesh position={[0, -0.24, 0]} material={mat.trim}>
              <capsuleGeometry args={[0.11, 0.28, 6, 16]} />
            </mesh>
            <mesh position={[0, -0.5, 0]} material={mat.shell}>
              <sphereGeometry args={[0.16, 24, 24]} />
            </mesh>
          </group>
        </group>
      </group>
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
