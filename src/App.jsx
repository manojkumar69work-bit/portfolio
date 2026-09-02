import { AnimatePresence, motion } from 'motion/react'
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CustomMouse from './components/CustomMouse.jsx'
import HorizontalScroller from './components/HorizontalScroller.jsx'
import MatrixRain from './components/MatrixRain.jsx'
import {
  FindMyWork,
  Footer,
  Hero,
  HorizontalSkills,
  Navbar,
  Numbers,
  Skills,
  WorkExperience,
} from './components/sections.jsx'
import CameraFeedback from './gesture/CameraFeedback.jsx'
import GestureTutorial from './gesture/GestureTutorial.jsx'
import HandsfreeIntro from './gesture/HandsfreeIntro.jsx'
import HandsfreeLoader from './gesture/HandsfreeLoader.jsx'
import { HandsfreeProvider, useHandsfree } from './gesture/HandsfreeProvider.jsx'
import { MoonIcon, SunIcon, TerminalIcon } from './icons.jsx'
const TerminalWindow = lazy(() => import('./terminal/TerminalWindow.jsx'))
import Dock from './windows/Dock.jsx'
import DraggableWindow from './windows/DraggableWindow.jsx'
import { WindowProvider, useWindows } from './windows/WindowManager.jsx'
import WorkCardWindow from './windows/WorkCardWindow.jsx'

const SECTION_SELECTORS = {
  hero: '.hero-section',
  skills: '#skills',
  work: '#work',
  journey: '#journey',
  stats: '.numbers-and-stats',
  experience: '.work-experience-main-wrapper',
  contact: '.footer',
}

const SEEN_TUTORIAL_KEY = 'gestureTutorialSeen'

function Desktop() {
  const { windows, openWindow, closeWindow, isOpen } = useWindows()
  const { status: handsfreeStatus, enable: enableHandsfree } = useHandsfree()

  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark')
  const [progress, setProgress] = useState(0)
  const [matrixOn, setMatrixOn] = useState(false)
  const greeted = useRef(false)

  /* ---------- theme ---------- */

  const setTheme = useCallback((next) => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark'
    const applied = next === undefined ? !current : next
    if (applied) document.documentElement.setAttribute('data-theme', 'dark')
    else document.documentElement.removeAttribute('data-theme')
    try {
      localStorage.setItem('darkMode', applied ? 'true' : 'false')
    } catch {
      /* private mode — the attribute on <html> is enough */
    }
    setDark(applied)
    return applied
  }, [])

  /* ---------- scroll progress ---------- */

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---------- window openers ---------- */

  const openTerminal = useCallback(() => {
    openWindow({ id: 'terminal', kind: 'terminal', title: 'manoj@portfolio — zsh' })
  }, [openWindow])

  const openProject = useCallback(
    (data) => {
      openWindow({
        id: `work:${data.title}`,
        kind: 'workcard',
        title: data.title,
        payload: data,
        thumbnail: data.img,
      })
    },
    [openWindow]
  )

  const openGestureTutorial = useCallback(() => {
    openWindow({ id: 'gesture-tutorial', kind: 'gesture-tutorial', title: 'Gesture controls' })
  }, [openWindow])

  const openHandsfreeIntro = useCallback(() => {
    openWindow({ id: 'handsfree-intro', kind: 'handsfree-intro', title: 'Camera control' })
  }, [openWindow])

  const navigate = useCallback((section) => {
    const selector = SECTION_SELECTORS[section]
    if (selector) document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /* ---------- Ctrl+J toggles the terminal ---------- */

  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'j') return
      e.preventDefault()
      if (isOpen('terminal')) closeWindow('terminal')
      else openTerminal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeWindow, isOpen, openTerminal])

  /* ---------- first visit: point people at what is here ---------- */

  useEffect(() => {
    if (greeted.current) return
    greeted.current = true

    let firstVisit = true
    try {
      firstVisit = localStorage.getItem(SEEN_TUTORIAL_KEY) !== 'true'
      localStorage.setItem(SEEN_TUTORIAL_KEY, 'true')
    } catch {
      /* private mode — treat every load as a first visit */
    }

    const desktop = window.matchMedia('(min-width: 901px)').matches

    /* A toast rather than an auto-opening window: a recruiter landing
       here should see the hero, not a modal. */
    const timer = setTimeout(() => {
      if (firstVisit && desktop) {
        toast(
          <span className="toast-hint">
            <TerminalIcon size={16} />
            <span>
              This page has a terminal (<kbd>Ctrl</kbd>+<kbd>J</kbd>) and camera gesture controls.
            </span>
            <button className="toast-hint__cta" onClick={openGestureTutorial}>
              Show me
            </button>
          </span>,
          { autoClose: 9000 }
        )
      } else {
        toast(
          <span className="toast-hint">
            <TerminalIcon size={16} />
            <span>
              Press <kbd>Ctrl</kbd>+<kbd>J</kbd> for the terminal
            </span>
          </span>,
          { autoClose: 5200 }
        )
      }
    }, 2800)

    return () => clearTimeout(timer)
  }, [openGestureTutorial])

  /* ---------- hooks handed to the terminal ---------- */

  const terminalHooks = useMemo(
    () => ({
      close: () => closeWindow('terminal'),
      navigate,
      setTheme,
      openProject,
      openGestureTutorial,
      openHandsfree: () => {
        openHandsfreeIntro()
        if (handsfreeStatus === 'idle') enableHandsfree()
      },
      startMatrix: () => setMatrixOn(true),
    }),
    [closeWindow, enableHandsfree, handsfreeStatus, navigate, openGestureTutorial, openHandsfreeIntro, openProject, setTheme]
  )

  const launchers = useMemo(
    () => [
      {
        id: 'terminal',
        kind: 'terminal',
        label: 'Terminal',
        window: () => ({ id: 'terminal', kind: 'terminal', title: 'manoj@portfolio — zsh' }),
      },
      {
        id: 'gesture-tutorial',
        kind: 'gesture-tutorial',
        label: 'Gestures',
        window: () => ({ id: 'gesture-tutorial', kind: 'gesture-tutorial', title: 'Gesture controls' }),
      },
      {
        id: 'handsfree-intro',
        kind: 'handsfree-intro',
        label: 'Camera control',
        window: () => ({ id: 'handsfree-intro', kind: 'handsfree-intro', title: 'Camera control' }),
      },
    ],
    []
  )

  const renderWindowBody = (win) => {
    if (win.kind === 'terminal') {
      return (
        <Suspense fallback={<div className="terminal-window terminal-window--booting">booting…</div>}>
          <TerminalWindow hooks={terminalHooks} />
        </Suspense>
      )
    }
    if (win.kind === 'workcard') return <WorkCardWindow data={win.payload} />
    if (win.kind === 'gesture-tutorial') return <GestureTutorial onDismiss={() => closeWindow(win.id)} />
    return <HandsfreeIntro onDismiss={() => closeWindow(win.id)} />
  }

  const hasVisibleWindow = windows.some((w) => !w.minimized)

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />

      <button
        className="toggle-button"
        onClick={() => setTheme(undefined)}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
      </button>

      <div className="home-wrapper">
        <Navbar dark={dark} onToggleTheme={() => setTheme(undefined)} />
        <Hero />
        <Skills />
        <FindMyWork onOpenProject={openProject} />
      </div>

      <HorizontalScroller dark={dark} />

      <div className="home-wrapper home-wrapper--lower">
        <Numbers />
        <HorizontalSkills />
        <WorkExperience />
        <Footer />
      </div>

      {/* ---- desktop layer ---- */}

      <AnimatePresence>
        {hasVisibleWindow && (
          <motion.div
            className="window-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {windows.map((win) => (
          <DraggableWindow key={win.id} win={win}>
            {renderWindowBody(win)}
          </DraggableWindow>
        ))}
      </AnimatePresence>

      <Dock launchers={launchers} />

      {/* ---- gesture layer ---- */}

      <HandsfreeLoader />
      <CameraFeedback />
      <CustomMouse />

      <MatrixRain active={matrixOn} onDismiss={() => setMatrixOn(false)} />

      <ToastContainer
        position="bottom-right"
        theme={dark ? 'dark' : 'light'}
        transition={Bounce}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        limit={3}
      />
    </>
  )
}

export default function App() {
  return (
    <HandsfreeProvider>
      <WindowProvider>
        <Desktop />
      </WindowProvider>
    </HandsfreeProvider>
  )
}
