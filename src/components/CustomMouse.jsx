import { useEffect, useRef, useState } from 'react'

import { useHandsfree } from '../gesture/HandsfreeProvider.jsx'

const HOVER_SELECTOR =
  'a, button, .card-img, .tab, .main-card, .dock__button, .mac-button, .toggle-button, [role="button"], .navbar'

/* Trailing ring + dot cursor. When camera control is on it stops
   following the mouse and follows the tracked fingertip instead. */
export default function CustomMouse() {
  const { status, pointerRef, gesture } = useHandsfree()
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setEnabled(fine)
    if (!fine) return
    document.body.classList.add('has-custom-mouse')
    return () => document.body.classList.remove('has-custom-mouse')
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      if (status === 'ready') return
      target.current = { x: e.clientX, y: e.clientY }
      const el = e.target instanceof Element ? e.target.closest(HOVER_SELECTOR) : null
      setHovering(Boolean(el))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, status])

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (status === 'ready' && pointerRef.current.active) {
        target.current = { x: pointerRef.current.x, y: pointerRef.current.y }
        const el = document.elementFromPoint(target.current.x, target.current.y)
        const hit = el instanceof Element ? el.closest(HOVER_SELECTOR) : null
        setHovering((prev) => (prev !== Boolean(hit) ? Boolean(hit) : prev))
      }
      ring.current.x += (target.current.x - ring.current.x) * 0.18
      ring.current.y += (target.current.y - ring.current.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [enabled, pointerRef, status])

  if (!enabled) return null

  const mode = status === 'ready' ? `custom-mouse--gesture custom-mouse--${gesture}` : ''

  return (
    <div className={`custom-mouse ${mode}${hovering ? ' custom-mouse--hover' : ''}`} aria-hidden="true">
      <span className="custom-mouse__ring" ref={ringRef} />
      <span className="custom-mouse__dot" ref={dotRef} />
    </div>
  )
}
