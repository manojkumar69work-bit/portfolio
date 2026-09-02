import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/* Camera-driven control. MediaPipe's hand and face landmarkers run
   entirely on-device — no frame ever leaves the browser.

   index fingertip -> pointer
   thumb+index pinch -> click
   closed fist, moved vertically -> scroll
   head tilt up / down -> slow scroll */

const HandsfreeContext = createContext(null)

export function useHandsfree() {
  const ctx = useContext(HandsfreeContext)
  if (!ctx) throw new Error('useHandsfree must be used inside <HandsfreeProvider>')
  return ctx
}

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
const HAND_MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
const FACE_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

const SMOOTHING = 0.35
const PINCH_ON = 0.4
const PINCH_OFF = 0.55
/* A pinch keeps the index extended, a fist folds it into the palm. Measured
   as index-tip-to-wrist distance over palm length. */
const INDEX_EXTENDED = 1.5
/* The hysteresis above already stops repeat clicks, so this only has to
   debounce landmark jitter — anything longer eats deliberate second clicks. */
const CLICK_COOLDOWN = 220
/* Closing the pinch drags the index tip toward the thumb, so click where the
   pointer was aiming a few frames ago rather than where the pinch left it. */
const CLICK_LAG_FRAMES = 4
const POINTER_HISTORY = 8
const FIST_SCROLL_GAIN = 2600
const HEAD_DEADZONE = 0.06
const HEAD_SCROLL_GAIN = 26

async function fetchWithProgress(url, onChunk) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not download model (${res.status})`)
  const total = Number(res.headers.get('content-length')) || 0
  if (!res.body) return new Uint8Array(await res.arrayBuffer())
  const reader = res.body.getReader()
  const chunks = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    onChunk(received, total)
  }
  const out = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

const pushTrail = (rt, x, y) => {
  rt.trail.push({ x, y })
  if (rt.trail.length > POINTER_HISTORY) rt.trail.shift()
}
const trailAt = (rt, back) => rt.trail[Math.max(rt.trail.length - 1 - back, 0)]

/* Synthesised click at viewport coords. Pointer events lead because the
   window manager focuses and drags on pointerdown, not mousedown, and the
   click is dispatched as an event so it carries coordinates. */
function clickAt(x, y) {
  const el = document.elementFromPoint(x, y)
  if (!el) return
  const base = {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y,
  }
  const mouse = { ...base, button: 0, detail: 1 }
  const pointer = { ...base, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0 }
  el.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, buttons: 1 }))
  el.dispatchEvent(new MouseEvent('mousedown', { ...mouse, buttons: 1 }))
  el.closest?.('a, button, input, select, textarea, [tabindex]')?.focus?.({ preventScroll: true })
  el.dispatchEvent(new PointerEvent('pointerup', { ...pointer, buttons: 0 }))
  el.dispatchEvent(new MouseEvent('mouseup', mouse))
  el.dispatchEvent(new MouseEvent('click', mouse))
}

export function HandsfreeProvider({ children }) {
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [gesture, setGesture] = useState('none') // none | point | pinch | fist
  const [handVisible, setHandVisible] = useState(false)

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const handRef = useRef(null)
  const faceRef = useRef(null)
  const rafRef = useRef(0)
  const landmarksRef = useRef(null)
  /* Pointer is a ref so the 30fps loop never re-renders React. */
  const pointerRef = useRef({ x: 0, y: 0, active: false, pinching: false })
  const runtime = useRef({ pinching: false, lastClick: 0, fistY: null, frame: 0, headBase: null, trail: [] })

  const disable = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    landmarksRef.current = null
    pointerRef.current.active = false
    runtime.current = { pinching: false, lastClick: 0, fistY: null, frame: 0, headBase: null, trail: [] }
    setHandVisible(false)
    setGesture('none')
    setStatus('idle')
    setProgress(0)
    document.body.classList.remove('handsfree-active')
  }, [])

  const enable = useCallback(async () => {
    if (status === 'loading' || status === 'ready') return
    setError(null)
    setStatus('loading')
    setProgress(0)

    try {
      const { FaceLandmarker, FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision')
      setProgress(8)

      const vision = await FilesetResolver.forVisionTasks(WASM_BASE)
      setProgress(18)

      /* Download the two .task files ourselves so the loader shows real
         byte progress instead of an indeterminate spinner. */
      const handBuf = await fetchWithProgress(HAND_MODEL, (received, total) => {
        if (total) setProgress(18 + (received / total) * 42)
      })
      setProgress(60)
      const faceBuf = await fetchWithProgress(FACE_MODEL, (received, total) => {
        if (total) setProgress(60 + (received / total) * 28)
      })
      setProgress(88)

      handRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetBuffer: handBuf, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      })
      faceRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetBuffer: faceBuf, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
      setProgress(94)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      streamRef.current = stream
      const video = videoRef.current
      video.srcObject = stream
      await video.play()

      setProgress(100)
      setStatus('ready')
      document.body.classList.add('handsfree-active')
    } catch (e) {
      setError(
        e?.name === 'NotAllowedError'
          ? 'Camera permission was denied. Allow it in your browser and try again.'
          : (e?.message ?? 'Could not start camera control.')
      )
      setStatus('error')
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [status])

  /* Mirror `gesture` into a ref so the loop can read it without deps. */
  const gestureRef = useRef(gesture)
  gestureRef.current = gesture

  /* Detection loop */
  useEffect(() => {
    if (status !== 'ready') return
    const video = videoRef.current
    const hand = handRef.current
    const face = faceRef.current
    if (!video || !hand) return

    let lastTs = -1

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      if (video.readyState < 2) return
      const ts = performance.now()
      if (ts - lastTs < 33) return
      lastTs = ts
      runtime.current.frame += 1

      let result
      try {
        result = hand.detectForVideo(video, ts)
      } catch {
        return
      }
      const marks = result?.landmarks?.[0]
      landmarksRef.current = marks ?? null

      if (!marks) {
        if (pointerRef.current.active) {
          pointerRef.current.active = false
          setHandVisible(false)
          setGesture('none')
        }
        pointerRef.current.pinching = false
        runtime.current.pinching = false
        runtime.current.fistY = null
      } else {
        const scale = Math.max(dist(marks[0], marks[9]), 0.001)
        const pinchRatio = dist(marks[4], marks[8]) / scale
        /* Curl measured against the wrist rather than screen y, so a tilted
           or sideways hand reads the same as an upright one. */
        const curled = [
          [8, 6],
          [12, 10],
          [16, 14],
          [20, 18],
        ].filter(([tip, pip]) => dist(marks[tip], marks[0]) < dist(marks[pip], marks[0])).length
        /* Folding the other three fingers is how most people pinch, so the
           curl count alone cannot separate a pinch from a fist — the index
           reach can, and the thumb gap (small in both) cannot. */
        const indexReach = dist(marks[8], marks[0]) / scale
        const isFist = curled >= 3 && indexReach < INDEX_EXTENDED

        /* Camera is mirrored, so flip x. Map the middle 70% of the frame
           to the full viewport so the edges stay reachable. */
        const nx = 1 - marks[8].x
        const ny = marks[8].y
        const mapped = {
          x: Math.min(Math.max((nx - 0.15) / 0.7, 0), 1) * window.innerWidth,
          y: Math.min(Math.max((ny - 0.15) / 0.7, 0), 1) * window.innerHeight,
        }

        const p = pointerRef.current
        const rt = runtime.current
        if (!p.active) {
          p.x = mapped.x
          p.y = mapped.y
          p.active = true
          rt.trail = [{ x: p.x, y: p.y }]
          setHandVisible(true)
        } else if (!rt.pinching) {
          /* A held pinch freezes the pointer, so the cursor stays put while
             the gesture completes instead of sliding off the target. */
          p.x += (mapped.x - p.x) * SMOOTHING
          p.y += (mapped.y - p.y) * SMOOTHING
          pushTrail(rt, p.x, p.y)
        }

        if (isFist) {
          rt.pinching = false
          p.pinching = false
          if (rt.fistY == null) rt.fistY = marks[0].y
          else {
            const dy = marks[0].y - rt.fistY
            window.scrollBy({ top: dy * FIST_SCROLL_GAIN, behavior: 'instant' })
            rt.fistY = marks[0].y
          }
          if (gestureRef.current !== 'fist') setGesture('fist')
        } else {
          rt.fistY = null
          /* Hysteresis so a hand hovering at the threshold does not
             machine-gun clicks. */
          if (!rt.pinching && pinchRatio < PINCH_ON) {
            rt.pinching = true
            p.pinching = true
            setGesture('pinch')
            if (ts - rt.lastClick > CLICK_COOLDOWN) {
              rt.lastClick = ts
              const aim = trailAt(rt, CLICK_LAG_FRAMES) ?? p
              clickAt(aim.x, aim.y)
            }
          } else if (rt.pinching && pinchRatio > PINCH_OFF) {
            rt.pinching = false
            p.pinching = false
            setGesture('point')
          } else if (!rt.pinching && gestureRef.current !== 'point') {
            setGesture('point')
          }
        }
      }

      /* Head pitch scroll, every third frame — cheap and plenty smooth. */
      if (face && runtime.current.frame % 3 === 0) {
        try {
          const fr = face.detectForVideo(video, ts)
          const fm = fr?.faceLandmarks?.[0]
          if (fm) {
            const top = fm[10]
            const chin = fm[152]
            const nose = fm[1]
            const span = Math.max(chin.y - top.y, 0.001)
            const pitch = (nose.y - (top.y + chin.y) / 2) / span
            const rt = runtime.current
            if (rt.headBase == null) rt.headBase = pitch
            const delta = pitch - rt.headBase
            if (Math.abs(delta) > HEAD_DEADZONE && !pointerRef.current.pinching) {
              window.scrollBy({ top: delta * HEAD_SCROLL_GAIN * 12, behavior: 'instant' })
            }
          }
        } catch {
          /* face model can transiently fail; hands keep working */
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [status])

  useEffect(() => () => disable(), [disable])

  const value = useMemo(
    () => ({
      status,
      progress,
      error,
      gesture,
      handVisible,
      enable,
      disable,
      pointerRef,
      landmarksRef,
      videoRef,
      recalibrate: () => {
        runtime.current.headBase = null
      },
    }),
    [status, progress, error, gesture, handVisible, enable, disable]
  )

  return (
    <HandsfreeContext.Provider value={value}>
      {children}
      {/* Kept in the DOM so the camera panel can draw from it. */}
      <video ref={videoRef} className="handsfree-source" playsInline muted autoPlay aria-hidden="true" />
    </HandsfreeContext.Provider>
  )
}
