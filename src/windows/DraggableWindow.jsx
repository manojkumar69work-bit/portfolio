import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { CollapseIcon, ExpandIcon } from '../icons.jsx'
import { useWindows } from './WindowManager.jsx'

const MIN_W = 320
const MIN_H = 220

function useIsMobileWindow() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 700px)')
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

/* Window chrome: drag by the header, resize from the left/right/bottom
   edges or the bottom-right corner, maximise, and minimise into the dock.
   On phones every window becomes a full-height sheet instead. */
export default function DraggableWindow({ win, children, onMinimizeStart }) {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, setGeometry } = useWindows()
  const isMobile = useIsMobileWindow()
  const nodeRef = useRef(null)
  const dragState = useRef(null)
  const [minimizing, setMinimizing] = useState(false)

  const { id, title, x, y, width, height, maximized, zIndex, minimized } = win

  const commit = useCallback(
    (patch) => setGeometry(id, patch),
    [id, setGeometry]
  )

  /* Shared pointer loop for both dragging and resizing. `edges` is null
     while moving the whole window. */
  const beginPointer = useCallback(
    (e, edges) => {
      if (isMobile || maximized) return
      e.preventDefault()
      e.stopPropagation()
      focusWindow(id)
      const node = nodeRef.current
      if (!node) return
      node.setPointerCapture?.(e.pointerId)
      dragState.current = {
        edges,
        startX: e.clientX,
        startY: e.clientY,
        originX: x,
        originY: y,
        originW: width,
        originH: height,
        next: { x, y, width, height },
      }
      document.body.classList.add('window-dragging')
    },
    [focusWindow, height, id, isMobile, maximized, width, x, y]
  )

  useEffect(() => {
    const onMove = (e) => {
      const state = dragState.current
      const node = nodeRef.current
      if (!state || !node) return
      const dx = e.clientX - state.startX
      const dy = e.clientY - state.startY
      const maxX = window.innerWidth
      const maxY = window.innerHeight

      let nx = state.originX
      let ny = state.originY
      let nw = state.originW
      let nh = state.originH

      if (!state.edges) {
        nx = Math.min(Math.max(state.originX + dx, -state.originW + 120), maxX - 120)
        ny = Math.min(Math.max(state.originY + dy, 8), maxY - 60)
      } else {
        if (state.edges.includes('right')) nw = Math.max(MIN_W, state.originW + dx)
        if (state.edges.includes('bottom')) nh = Math.max(MIN_H, state.originH + dy)
        if (state.edges.includes('left')) {
          nw = Math.max(MIN_W, state.originW - dx)
          nx = state.originX + (state.originW - nw)
        }
      }

      state.next = { x: nx, y: ny, width: nw, height: nh }
      node.style.left = `${nx}px`
      node.style.top = `${ny}px`
      node.style.width = `${nw}px`
      node.style.height = `${nh}px`
    }

    const onUp = () => {
      const state = dragState.current
      if (!state) return
      dragState.current = null
      document.body.classList.remove('window-dragging')
      commit(state.next)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [commit])

  /* Minimise plays a short genie toward the dock before the window
     is flagged minimised in the store. */
  const handleMinimize = () => {
    onMinimizeStart?.(id)
    setMinimizing(true)
    setTimeout(() => {
      setMinimizing(false)
      minimizeWindow(id)
    }, 320)
  }

  const geometry = isMobile
    ? {}
    : maximized
      ? { left: 12, top: 12, width: 'calc(100vw - 24px)', height: 'calc(100vh - 120px)' }
      : { left: x, top: y, width, height }

  const className = [
    'draggable-window',
    minimized ? 'hidden' : '',
    maximized && !isMobile ? 'draggable-window--maximized' : '',
    isMobile ? 'draggable-window--mobile' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.section
      ref={nodeRef}
      className={className}
      style={{ ...geometry, zIndex }}
      onPointerDown={() => focusWindow(id)}
      initial={{ opacity: 0, scale: 0.94, y: isMobile ? 40 : 12 }}
      animate={
        minimizing
          ? { opacity: 0, scale: 0.25, y: -window.innerHeight * 0.42, transition: { duration: 0.3, ease: 'easeIn' } }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      role="dialog"
      aria-label={title}
      aria-hidden={minimized || undefined}
    >
      <span className="window-glow window-glow--left" aria-hidden="true" />
      <span className="window-glow window-glow--right" aria-hidden="true" />

      <header
        className="draggable-window__header"
        onPointerDown={(e) => {
          if (e.target.closest('.mac-button')) return
          beginPointer(e, null)
        }}
        onDoubleClick={() => !isMobile && toggleMaximize(id)}
      >
        <div className="mac-buttons-flex">
          <button className="mac-button red" onClick={() => closeWindow(id)} aria-label="Close">
            ✕
          </button>
          <button className="mac-button yellow" onClick={handleMinimize} aria-label="Minimise">
            –
          </button>
          <button
            className="mac-button green"
            onClick={() => toggleMaximize(id)}
            aria-label={maximized ? 'Restore' : 'Maximise'}
          >
            {maximized ? <CollapseIcon size={9} /> : <ExpandIcon size={9} />}
          </button>
        </div>
        <p className="draggable-window__title">{title}</p>
        <span className="draggable-window__spacer" aria-hidden="true" />
      </header>

      <div className="draggable-window__body">{children}</div>

      {!isMobile && !maximized && (
        <>
          <span className="draggable-window__resize draggable-window__resize--left" onPointerDown={(e) => beginPointer(e, ['left'])} />
          <span className="draggable-window__resize draggable-window__resize--right" onPointerDown={(e) => beginPointer(e, ['right'])} />
          <span className="draggable-window__resize draggable-window__resize--bottom" onPointerDown={(e) => beginPointer(e, ['bottom'])} />
          <span className="draggable-window__resize draggable-window__resize--corner" onPointerDown={(e) => beginPointer(e, ['right', 'bottom'])} />
        </>
      )}
    </motion.section>
  )
}
