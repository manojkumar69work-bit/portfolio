import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/* Central registry for every floating window on the page: the terminal,
   project detail windows, the gesture tutorial and the handsfree intro.
   The dock renders from this same state, so minimising a window and
   clicking its dock tile stay in sync. */

const WindowContext = createContext(null)

export function useWindows() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindows must be used inside <WindowProvider>')
  return ctx
}

const BASE_Z = 500

/* Opening geometry per window kind. Windows cascade so a second
   project window never lands exactly on top of the first. */
const DEFAULT_GEOMETRY = {
  terminal: { width: 760, height: 460 },
  workcard: { width: 560, height: 520 },
  'gesture-tutorial': { width: 620, height: 486 },
  'handsfree-intro': { width: 520, height: 452 },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function initialPosition(kind, index) {
  const size = DEFAULT_GEOMETRY[kind] ?? { width: 560, height: 480 }
  const vw = typeof window === 'undefined' ? 1280 : window.innerWidth
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight
  const width = Math.min(size.width, vw - 40)
  const height = Math.min(size.height, vh - 140)
  const offset = (index % 6) * 28
  return {
    width,
    height,
    x: clamp(Math.round((vw - width) / 2) + offset, 12, Math.max(12, vw - width - 12)),
    y: clamp(Math.round((vh - height) / 2) - 40 + offset, 12, Math.max(12, vh - height - 100)),
  }
}

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState([])
  const [topZ, setTopZ] = useState(BASE_Z)
  const [openedCount, setOpenedCount] = useState(0)

  const focusWindow = useCallback((id) => {
    setTopZ((z) => {
      const next = z + 1
      setWindows((list) => list.map((w) => (w.id === id ? { ...w, zIndex: next, minimized: false } : w)))
      return next
    })
  }, [])

  const openWindow = useCallback(
    (config) => {
      const { id } = config
      let existed = false
      setWindows((list) => {
        const found = list.find((w) => w.id === id)
        if (found) {
          existed = true
          return list
        }
        const geometry = initialPosition(config.kind, list.length)
        return [
          ...list,
          {
            minimized: false,
            maximized: false,
            ...config,
            ...geometry,
            zIndex: BASE_Z + list.length + 1,
          },
        ]
      })
      setOpenedCount((c) => c + 1)
      // A re-open of a live window is really a focus + un-minimise.
      requestAnimationFrame(() => {
        if (existed) focusWindow(id)
        else setTopZ((z) => z + 1)
      })
    },
    [focusWindow]
  )

  const closeWindow = useCallback((id) => {
    setWindows((list) => list.filter((w) => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows((list) => list.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
  }, [])

  const restoreWindow = useCallback(
    (id) => {
      focusWindow(id)
    },
    [focusWindow]
  )

  const toggleMaximize = useCallback((id) => {
    setWindows((list) => list.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)))
  }, [])

  const setGeometry = useCallback((id, patch) => {
    setWindows((list) => list.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }, [])

  const isOpen = useCallback((id) => windows.some((w) => w.id === id), [windows])

  /* Esc closes the front-most window. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setWindows((list) => {
        const visible = list.filter((w) => !w.minimized)
        if (visible.length === 0) return list
        const front = visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
        return list.filter((w) => w.id !== front.id)
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* A visible window means the page behind it should not scroll on mobile. */
  useEffect(() => {
    const anyVisible = windows.some((w) => !w.minimized)
    const isMobile = window.matchMedia('(max-width: 700px)').matches
    document.body.classList.toggle('no-scroll', anyVisible && isMobile)
    return () => document.body.classList.remove('no-scroll')
  }, [windows])

  const value = useMemo(
    () => ({
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      setGeometry,
      isOpen,
      topZ,
      openedCount,
    }),
    [
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      setGeometry,
      isOpen,
      topZ,
      openedCount,
    ]
  )

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
}
