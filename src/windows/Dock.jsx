import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { BriefcaseIcon, CameraIcon, HandIcon, TerminalIcon } from '../icons.jsx'
import { useWindows } from './WindowManager.jsx'

const MAX_VISIBLE = 8
const MAGNIFY_AMPLITUDE = 0.55
const MAGNIFY_SIGMA = 70

/* macOS-style dock. Launchers are always present; every open window
   also gets a tile, so a minimised window can be brought back by
   clicking its thumbnail. */
export default function Dock({ launchers }) {
  const { windows, openWindow, closeWindow, restoreWindow, minimizeWindow } = useWindows()
  const [pointerX, setPointerX] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(null)
  const railRef = useRef(null)
  const itemRefs = useRef({})

  const windowTiles = windows.map((w) => ({
    key: `win:${w.id}`,
    id: w.id,
    kind: w.kind,
    label: w.title,
    thumbnail: w.thumbnail,
    running: true,
    minimized: w.minimized,
  }))

  const launcherTiles = launchers
    .filter((l) => !windows.some((w) => w.id === l.id))
    .map((l) => ({
      key: `launch:${l.id}`,
      id: l.id,
      kind: l.kind,
      label: l.label,
      launcher: l,
      running: false,
      minimized: false,
    }))

  const all = [...launcherTiles, ...windowTiles]
  const visible = all.slice(0, MAX_VISIBLE)
  const overflow = all.length - visible.length

  const handleMove = useCallback((e) => {
    const rect = railRef.current?.getBoundingClientRect()
    if (rect) setPointerX(e.clientX - rect.left)
  }, [])

  const handleLeave = useCallback(() => {
    setPointerX(null)
    setExpanded(false)
    setHovered(null)
  }, [])

  /* Scale each tile by its distance from the cursor along the rail. */
  const scaleFor = (key) => {
    if (pointerX == null) return 1
    const node = itemRefs.current[key]
    const rail = railRef.current
    if (!node || !rail) return 1
    const center = node.offsetLeft + node.offsetWidth / 2
    const d = Math.abs(center - pointerX)
    return 1 + MAGNIFY_AMPLITUDE * Math.exp(-((d / MAGNIFY_SIGMA) ** 2))
  }

  const activate = (tile) => {
    if (tile.launcher) {
      openWindow(tile.launcher.window())
      return
    }
    if (tile.minimized) restoreWindow(tile.id)
    else minimizeWindow(tile.id)
  }

  /* Keep the dock out of the way while a window is being dragged. */
  const [dragging, setDragging] = useState(false)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDragging(document.body.classList.contains('window-dragging'))
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav
      className={`dock${expanded ? ' dock--expanded' : ''}`}
      aria-label="Application dock"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: dragging ? 0.35 : 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="dock__rail" ref={railRef}>
        {visible.map((tile) => {
          const scale = scaleFor(tile.key)
          return (
            <div
              className="dock__item"
              key={tile.key}
              ref={(node) => {
                if (node) itemRefs.current[tile.key] = node
                else delete itemRefs.current[tile.key]
              }}
              onMouseEnter={() => setHovered(tile.key)}
              onFocus={() => setHovered(tile.key)}
              onBlur={() => setHovered(null)}
            >
              <AnimatePresence>
                {hovered === tile.key && expanded && (
                  <motion.span
                    className="dock__label"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tile.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {hovered === tile.key && tile.thumbnail && (
                <motion.div
                  className="dock__preview"
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <img src={tile.thumbnail} alt="" className="dock__thumbnail" />
                </motion.div>
              )}

              <motion.button
                type="button"
                className="dock__button"
                onClick={() => activate(tile)}
                animate={{ scale, y: (scale - 1) * 14 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26, mass: 0.4 }}
                aria-label={tile.label}
              >
                {tile.thumbnail ? (
                  <img src={tile.thumbnail} alt="" className="dock__thumbnail" />
                ) : (
                  <span className={`dock__placeholder dock__placeholder--${tile.kind}`}>
                    <DockGlyph kind={tile.kind} />
                    <span className="dock__placeholder-title">{tile.label}</span>
                  </span>
                )}
              </motion.button>

              {tile.running && (
                <button
                  className="dock__close"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeWindow(tile.id)
                  }}
                  aria-label={`Close ${tile.label}`}
                >
                  ✕
                </button>
              )}
              <span className={`dock__dot${tile.running ? ' dock__dot--on' : ''}`} aria-hidden="true" />
            </div>
          )
        })}

        {overflow > 0 && <span className="dock__overflow-badge">+{overflow}</span>}
      </div>
    </motion.nav>
  )
}

function DockGlyph({ kind }) {
  if (kind === 'terminal') return <TerminalIcon size={24} />
  if (kind === 'gesture-tutorial') return <HandIcon size={24} />
  if (kind === 'handsfree-intro') return <CameraIcon size={24} />
  return <BriefcaseIcon size={24} />
}
