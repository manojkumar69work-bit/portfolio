import { AnimatePresence, motion, useInView } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BOTTOM_TEXTS, EMAIL, GITHUB, HERO_WORDS, STATS, WORK_EXPERIENCE, workTabs } from '../data.js'
import { ArrowRightIcon, GithubIcon, LinkIcon, LiveIcon, MoonIcon, StatIcon, SunIcon } from '../icons.jsx'

import l_icon1 from '../assets/skills/light/icon1.webp'
import l_icon2 from '../assets/skills/light/icon2.webp'
import l_icon3 from '../assets/skills/light/icon3.webp'
import l_icon4 from '../assets/skills/light/icon4.webp'
import l_icon5 from '../assets/skills/light/icon5.webp'
import l_icon6 from '../assets/skills/light/icon6.webp'
import l_icon7 from '../assets/skills/light/icon7.webp'
import l_icon8 from '../assets/skills/light/icon8.webp'
import l_icon9 from '../assets/skills/light/icon9.webp'
import l_icon10 from '../assets/skills/light/icon10.webp'
import l_icon11 from '../assets/skills/light/icon11.webp'
import l_icon12 from '../assets/skills/light/icon12.webp'
import l_icon13 from '../assets/skills/light/icon13.webp'
import d_icon1 from '../assets/skills/dark/icon1.webp'
import d_icon2 from '../assets/skills/dark/icon2.webp'
import d_icon3 from '../assets/skills/dark/icon3.webp'
import d_icon4 from '../assets/skills/dark/icon4.webp'
import d_icon5 from '../assets/skills/dark/icon5.webp'
import d_icon6 from '../assets/skills/dark/icon6.webp'
import d_icon7 from '../assets/skills/dark/icon7.webp'
import d_icon8 from '../assets/skills/dark/icon8.webp'
import d_icon9 from '../assets/skills/dark/icon9.webp'
import d_icon10 from '../assets/skills/dark/icon10.webp'
import d_icon11 from '../assets/skills/dark/icon11.webp'
import d_icon12 from '../assets/skills/dark/icon12.webp'
import d_icon13 from '../assets/skills/dark/icon13.webp'

export const LIGHT_ICONS = [l_icon1, l_icon2, l_icon3, l_icon4, l_icon5, l_icon6, l_icon7, l_icon8, l_icon9, l_icon10, l_icon11, l_icon12, l_icon13]
export const DARK_ICONS = [d_icon1, d_icon2, d_icon3, d_icon4, d_icon5, d_icon6, d_icon7, d_icon8, d_icon9, d_icon10, d_icon11, d_icon12, d_icon13]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

/* ---------- Scramble text ---------- */

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function ScrambleText({ texts, speed = 100, pauseDuration = 1000, style }) {
  const [display, setDisplay] = useState(texts[0])
  const indexRef = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const total = () => texts[indexRef.current % texts.length].length + 6

    const scramble = () => {
      const text = texts[indexRef.current % texts.length]
      if (frame >= total()) {
        setDisplay(text)
        timeoutRef.current = setTimeout(() => {
          indexRef.current += 1
          startCycle()
        }, pauseDuration)
        return
      }
      const progress = Math.min(1, frame / total())
      const revealed = Math.floor(progress * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          out += text[i]
        } else {
          out += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
        }
      }
      setDisplay(out)
      frame += 1
      timeoutRef.current = setTimeout(scramble, speed)
    }

    const startCycle = () => {
      frame = 0
      scramble()
    }

    startCycle()
    return () => clearTimeout(timeoutRef.current)
  }, [texts, speed, pauseDuration])

  return <span className="scramble-word" style={style}>{display}</span>
}

/* ---------- Navbar ---------- */

export function Navbar({ dark, onToggleTheme }) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isMobile) {
      document.body.classList.toggle('nav-expanded', isHovered)
    }
    return () => document.body.classList.remove('nav-expanded')
  }, [isHovered, isMobile])

  const links = [
    { name: 'Skills.', href: '#skills' },
    { name: 'Work.', href: '#work' },
    { name: 'Email.', href: `mailto:${EMAIL}` },
    { name: 'Github.', href: GITHUB },
  ]

  const handleLinkClick = (link) => {
    if (link.href.startsWith('#')) {
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
    } else if (link.href.startsWith('mailto')) {
      window.location.href = link.href
    } else {
      window.open(link.href, '_blank')
    }
  }

  const collapsedWidth = isMobile ? '175px' : 'auto'
  const expandedWidth = isMobile ? 'calc(100vw - 32px)' : '700px'

  return (
    <motion.div
      className={`navbar${isHovered ? ' nav-open' : ''}`}
      onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
      onClick={() => setIsHovered(!isHovered)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, width: isHovered ? expandedWidth : collapsedWidth }}
      style={{ justifyContent: isHovered ? 'flex-start' : 'center' }}
      transition={{
        opacity: { delay: 0.5, duration: 0.6, ease: 'easeOut' },
        width: isMobile
          ? { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
          : { type: 'spring', stiffness: 100, damping: 15 },
      }}
    >
      <div className="menu-icon" aria-hidden="true">
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
      {isMobile ? (
        <h1 className="heading" style={{ visibility: isHovered ? 'hidden' : 'visible' }}>
          Manoj Kumar Ethini.
        </h1>
      ) : (
        <motion.h1 className="heading" layout transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
          Manoj Kumar Ethini.
        </motion.h1>
      )}
      <motion.div
        className="links"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ delay: isHovered ? 0.15 : 0, duration: 0.2 }}
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        {links.map((link, i) => (
          <p onClick={() => handleLinkClick(link)} key={`link-${i}`}>
            {link.name}
          </p>
        ))}
      </motion.div>
      {isMobile && (
        <motion.div
          className="navbar-toggles"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ delay: isHovered ? 0.15 : 0, duration: 0.2 }}
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          <button
            className={`navbar-toggle-btn${dark ? ' active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleTheme()
            }}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

/* ---------- Hero ---------- */

export function Hero() {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 1900)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!introDone) return
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % BOTTOM_TEXTS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [introDone])

  const scrollToWork = () => {
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="hero-section">
      <div className="heading-section">
        <motion.div
          className="heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
        >
          <ScrambleText
            style={{ fontSize: isMobile ? '36px' : '64px', fontStyle: 'italic' }}
            texts={HERO_WORDS}
            speed={100}
            pauseDuration={1000}
          />
          <h1 className="heading">Developer.</h1>
        </motion.div>
        <motion.p
          className="desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
        >
          Third-year CSE student who ships and deploys full-stack products end to end — FastAPI + PostgreSQL backends, Next.js frontends, and LLM/speech pipelines running live on Render, Vercel and Railway. Python-first.
        </motion.p>
        <motion.div
          className="btn-flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4, ease: 'easeOut' }}
        >
          <button
            className="btn primary"
            style={{ flexDirection: 'row-reverse' }}
            onClick={() => (window.location.href = `mailto:${EMAIL}`)}
          >
            <LinkIcon />
            <p className="text">Connect</p>
          </button>
          <button
            className="btn outline"
            style={{ flexDirection: 'row-reverse' }}
            onClick={scrollToWork}
          >
            <ArrowRightIcon />
            <p className="text">See Work</p>
          </button>
        </motion.div>
        <motion.p
          key={currentTextIndex}
          className="bottom-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            introDone
              ? { duration: 0.5 }
              : { delay: 1.4, duration: 0.6, ease: 'easeOut' }
          }
          dangerouslySetInnerHTML={{ __html: BOTTOM_TEXTS[currentTextIndex] }}
        />
      </div>
    </div>
  )
}

/* ---------- Skills canvas ---------- */

const SPRING_K = 0.08
const DAMPING = 0.82
const TRAIL_LERP = 0.14
const TRAIL_SPACING = 7
const MOUSE_HISTORY_SIZE = 160
const ENTRANCE_DURATION = 500
const STAGGER = 75
const LOOP_PERIOD = 18
const LOOP_SPEED = (2 * Math.PI) / LOOP_PERIOD
const LOOP_RX = 390
const LOOP_RY = 350
const LOOP_RX_MOBILE = 195
const LOOP_RY_MOBILE = 265

const easeOutBack = (t) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

const lerp = (a, b, t) => a + (b - a) * t

function SkillsCanvas({ iconUrls, isMobile, triggerEntrance, active }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const imagesRef = useRef([])
  const iconsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const returningRef = useRef(false)
  const phaseRef = useRef('waiting')
  const entranceStartRef = useRef(0)
  const entranceEndRef = useRef(0)
  const canvasSizeRef = useRef({ w: 0, h: 0, cssW: 0, cssH: 0 })
  const rafRef = useRef(0)
  const mouseHistoryRef = useRef([])
  const chainOrderRef = useRef([])

  const iconSize = isMobile ? 60 : 80
  const rx = isMobile ? LOOP_RX_MOBILE : LOOP_RX
  const ry = isMobile ? LOOP_RY_MOBILE : LOOP_RY

  const loopPos = useCallback((i, count, tAbs) => {
    const theta = LOOP_SPEED * tAbs + (2 * Math.PI * i) / count
    return { x: rx * Math.cos(theta), y: ry * Math.sin(theta) }
  }, [rx, ry])

  useEffect(() => {
    let cancelled = false
    Promise.all(
      iconUrls.map(
        (url) =>
          new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = url
          })
      )
    ).then((imgs) => {
      if (!cancelled) imagesRef.current = imgs
    })
    return () => {
      cancelled = true
    }
  }, [iconUrls])

  useEffect(() => {
    const existing = iconsRef.current
    if (existing.length === iconUrls.length && existing.length > 0) {
      for (const icon of existing) {
        icon.vx = 0
        icon.vy = 0
      }
      return
    }
    iconsRef.current = iconUrls.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      scale: 0,
      image: null,
    }))
  }, [iconUrls])

  useEffect(() => {
    const syncImages = () => {
      const imgs = imagesRef.current
      const icons = iconsRef.current
      if (imgs.length > 0 && icons.length > 0) {
        for (let i = 0; i < icons.length; i++) {
          if (i < imgs.length) icons[i].image = imgs[i]
        }
        return true
      }
      return false
    }
    if (syncImages()) return
    const interval = setInterval(() => {
      if (syncImages()) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [iconUrls])

  useEffect(() => {
    if (triggerEntrance && phaseRef.current === 'waiting') {
      phaseRef.current = 'entering'
      entranceStartRef.current = performance.now()
      entranceEndRef.current =
        entranceStartRef.current + ENTRANCE_DURATION + (iconsRef.current.length - 1) * STAGGER
    }
  }, [triggerEntrance])

  // When the section scrolls out of view, settle icons back onto the loop
  useEffect(() => {
    if (active) return
    mouseRef.current.active = false
    returningRef.current = true
    chainOrderRef.current = []
    mouseHistoryRef.current = []
  }, [active])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvasSizeRef.current = {
        w: width * dpr,
        h: height * dpr,
        cssW: width,
        cssH: height,
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = (timestamp) => {
      const { w, h, cssW, cssH } = canvasSizeRef.current
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const dpr = window.devicePixelRatio || 1
      const icons = iconsRef.current
      const mouse = mouseRef.current
      const phase = phaseRef.current
      const mouseHistory = mouseHistoryRef.current
      const chainOrder = chainOrderRef.current

      if (phase === 'entering') {
        const elapsed = timestamp - entranceStartRef.current
        const tEnd = entranceEndRef.current / 1000
        const count = icons.length
        let allDone = true
        for (let i = 0; i < icons.length; i++) {
          const iconElapsed = elapsed - i * STAGGER
          if (iconElapsed < 0) {
            allDone = false
            continue
          }
          const t = Math.min(iconElapsed / ENTRANCE_DURATION, 1)
          if (t < 1) allDone = false
          const eased = easeOutBack(t)
          const target = loopPos(i, count, tEnd)
          icons[i].x = target.x * eased
          icons[i].y = target.y * eased
          icons[i].scale = t < 0.5 ? lerp(0, 1.5, t * 2) : lerp(1.5, 1, (t - 0.5) * 2)
        }
        if (allDone) {
          phaseRef.current = 'idle'
          const tAbs = timestamp / 1000
          for (let i = 0; i < icons.length; i++) {
            const target = loopPos(i, icons.length, tAbs)
            icons[i].x = target.x
            icons[i].y = target.y
            icons[i].scale = 1
            icons[i].vx = 0
            icons[i].vy = 0
          }
        }
      }

      if (phase === 'idle') {
        const count = icons.length
        const tAbs = timestamp / 1000
        if (mouse.active && !returningRef.current) {
          mouseHistory.push({ x: mouse.x, y: mouse.y })
          if (mouseHistory.length > MOUSE_HISTORY_SIZE) {
            mouseHistory.shift()
          }
          if (chainOrder.length === 0 && mouseHistory.length > 0) {
            const sorted = icons
              .map((icon, i) => ({ i, dist: Math.hypot(icon.x - mouse.x, icon.y - mouse.y) }))
              .sort((a, b) => a.dist - b.dist)
              .map((e) => e.i)
            chainOrderRef.current.push(...sorted)
          }
          for (let rank = 0; rank < chainOrder.length; rank++) {
            const icon = icons[chainOrder[rank]]
            const histIdx = mouseHistory.length - 1 - rank * TRAIL_SPACING
            if (histIdx >= 0) {
              const target = mouseHistory[histIdx]
              icon.x = lerp(icon.x, target.x, TRAIL_LERP)
              icon.y = lerp(icon.y, target.y, TRAIL_LERP)
              icon.vx = 0
              icon.vy = 0
            }
          }
        } else if (returningRef.current) {
          let settled = true
          for (let i = 0; i < icons.length; i++) {
            const icon = icons[i]
            const target = loopPos(i, count, tAbs)
            const restDx = target.x - icon.x
            const restDy = target.y - icon.y
            icon.vx += restDx * SPRING_K
            icon.vy += restDy * SPRING_K
            icon.vx *= DAMPING
            icon.vy *= DAMPING
            icon.x += icon.vx
            icon.y += icon.vy
            if (Math.abs(restDx) + Math.abs(restDy) > 2) settled = false
          }
          if (settled) {
            returningRef.current = false
            for (let i = 0; i < icons.length; i++) {
              const target = loopPos(i, count, tAbs)
              icons[i].x = target.x
              icons[i].y = target.y
              icons[i].vx = 0
              icons[i].vy = 0
            }
          }
        } else {
          for (let i = 0; i < icons.length; i++) {
            const target = loopPos(i, count, tAbs)
            icons[i].x = target.x
            icons[i].y = target.y
            icons[i].scale = 1
          }
        }
      }

      ctx.clearRect(0, 0, w, h)
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.translate(cssW / 2, cssH / 2)
      for (const icon of icons) {
        if (icon.scale <= 0 || !icon.image) continue
        ctx.save()
        ctx.translate(icon.x, icon.y)
        ctx.scale(icon.scale, icon.scale)
        ctx.drawImage(icon.image, -iconSize / 2, -iconSize / 2, iconSize, iconSize)
        ctx.restore()
      }
      ctx.restore()

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [iconSize, isMobile, loopPos])

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left - rect.width / 2
      mouseRef.current.y = e.clientY - rect.top - rect.height / 2
      mouseRef.current.active = true
      returningRef.current = false
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
    chainOrderRef.current = []
    mouseHistoryRef.current = []
  }, [])

  const handleClick = useCallback(() => {
    mouseRef.current.active = false
    returningRef.current = true
    chainOrderRef.current = []
    mouseHistoryRef.current = []
  }, [])

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0]
    if (!touch) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseRef.current.x = touch.clientX - rect.left - rect.width / 2
      mouseRef.current.y = touch.clientY - rect.top - rect.height / 2
      mouseRef.current.active = true
      returningRef.current = false
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.active = false
    returningRef.current = true
    chainOrderRef.current = []
    mouseHistoryRef.current = []
  }, [])

  return (
    <div
      ref={containerRef}
      className="skills-canvas-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

export function Skills() {
  const isMobile = useIsMobile()
  const dark = document.documentElement.getAttribute('data-theme') === 'dark'
  const [themeDark, setThemeDark] = useState(dark)
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '0px 0px 40% 0px', amount: 0 })
  const active = useInView(ref, { margin: '0px 0px 0px 0px', amount: 0 })
  const entranceDoneRef = useRef(false)

  useEffect(() => {
    if (inView && !entranceDoneRef.current) entranceDoneRef.current = true
  }, [inView])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeDark(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const iconUrls = themeDark ? DARK_ICONS : LIGHT_ICONS

  return (
    <div className="skills-container" ref={ref} id="skills">
      <p className="main-text">
        Build. Break. Learn.
      </p>
      <SkillsCanvas
        iconUrls={iconUrls}
        isMobile={isMobile}
        triggerEntrance={inView && !entranceDoneRef.current}
        active={active}
      />
    </div>
  )
}

/* ---------- Find my work ---------- */

function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={tab.name}
          role="tab"
          aria-selected={activeTab === i}
          className={`tab${activeTab === i ? ' active' : ''}`}
          onClick={() => setActiveTab(i)}
        >
          {activeTab === i && <motion.div layoutId="active-tab" className="active-tab-indicator" />}
          <span className="tab__label">{tab.name}</span>
          <span className="tab-badge">{tab.count}</span>
        </button>
      ))}
    </div>
  )
}

function WorkCard({ data, onOpen }) {
  const { title, img, url } = data
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '0px 0px 200px 0px', once: true })

  return (
    <div className="card-modal-component">
      <motion.div
        className="main-card"
        initial={{ scale: 0.99, opacity: 0, y: 100 }}
        animate={inView ? { scale: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        ref={ref}
      >
        <motion.img
          src={img}
          alt={title}
          className="card-img"
          onClick={() => onOpen(data)}
          whileTap={{ scale: 0.95 }}
        />
        <div className="card-heading-flex">
          <h2 className="heading">{title}</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            {url?.liveUrl && (
              <span className="icon" onClick={() => window.open(url.liveUrl, '_blank', 'noopener')} aria-label="Live site">
                <LiveIcon />
              </span>
            )}
            {url?.githubUrl && (
              <span className="icon" onClick={() => window.open(url.githubUrl, '_blank', 'noopener')} aria-label="GitHub">
                <GithubIcon />
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function FindMyWork({ onOpenProject }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = workTabs.map((t) => ({ name: t.name, count: t.items.length }))

  return (
    <div className="find-my-work" id="work">
      <h1 className="heading">Find My Work</h1>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="work-content">
        {workTabs[activeTab]?.items.map((data) => (
          <WorkCard key={data.title} data={data} onOpen={onOpenProject} />
        ))}
      </div>
    </div>
  )
}

/* ---------- Numbers and stats ---------- */

function NumberStatsCard({ icon, frontCard }) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
  return (
    <motion.div
      className={`card ${frontCard ? 'front-card' : 'back-card'}`}
      initial={frontCard ? { opacity: 0, scale: 0.6 } : { scale: 0, y: isMobile ? 80 : 105, opacity: 0 }}
      animate={frontCard ? { opacity: 1, scale: 1, y: 0 } : { scale: 0.75, y: isMobile ? 20 : 30, opacity: 0.5 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
      transition={
        frontCard
          ? { type: 'spring', stiffness: 300, damping: 20 }
          : { scale: { duration: 0.5 }, opacity: { duration: 0.4 } }
      }
    >
      <div className="card-content">
        <StatIcon name={icon} />
      </div>
    </motion.div>
  )
}

export function Numbers() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % STATS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const current = STATS[index]
  const previous = STATS[(index - 1 + STATS.length) % STATS.length]

  return (
    <motion.div className="numbers-and-stats">
      <div className="center-text">
        <p className="text-p">Some Of My Interesting Stats</p>
      </div>
      <motion.div className="card-container">
        <NumberStatsCard key={`back-${previous.icon}`} icon={previous.icon} frontCard={false} />
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={`front-${current.icon}`}
            className="card front-card"
            initial={{ x: 250, rotate: 20, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, rotate: 0, opacity: 1, scale: 1 }}
            exit={{ x: -250, rotate: -20, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <div className="card-content">
              <StatIcon name={current.icon} />
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="card-text"
      >
        <span className="orange">{current.value}</span> {current.label}
      </motion.div>
    </motion.div>
  )
}

/* ---------- Horizontal skills ---------- */

function HorizontalSkillsRow({ icons, reverse }) {
  return (
    <div className="horizontal-skills-wrapper">
      <div className={`horizontal-skills-track${reverse ? ' reverse' : ''}`}>
        {[0, 1].map((setIdx) => (
          <div className="horizontal-skills-set" key={`set-${setIdx}`}>
            {icons.map((icon, i) => (
              <img key={`${setIdx}-${i}`} src={icon} alt="" className="icon" draggable="false" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HorizontalSkills() {
  const [dark, setDark] = useState(
    typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.getAttribute('data-theme') === 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const icons = dark ? DARK_ICONS : LIGHT_ICONS
  const row1 = useMemo(() => [...icons.slice(0, 6), ...icons.slice(0, 6)], [icons])
  const row2 = useMemo(() => [...icons.slice(6, 13), ...icons.slice(6, 13)], [icons])

  return (
    <div className="horizontal-skills-parent">
      <HorizontalSkillsRow icons={row1} reverse={false} />
      <HorizontalSkillsRow icons={row2} reverse={true} />
    </div>
  )
}

/* ---------- Work experience ---------- */

function WorkExperienceSection({ exp }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '0px 0px -20% 0px', once: true })

  return (
    <motion.div
      ref={ref}
      className="work-experience-section"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'power2.out' }}
    >
      <h2 className="job-title">
        {exp.title} @ <span className="orange">{exp.company}</span>
      </h2>
      <div className="duration">{exp.date}</div>
      <ul className="work-ex-points">
        {exp.points.map((point, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: point }} />
        ))}
      </ul>
    </motion.div>
  )
}

export function WorkExperience() {
  return (
    <div className="work-experience-main-wrapper">
      <h1 className="fixed-heading">
        <span className="orange">Destructuring </span>
        <span>My Work Experience.</span>
      </h1>
      <div className="left-column">
        <div className="left-inner">
          <p className="left-quote">
            "Python-first, <span className="orange">ships</span> end to end."
          </p>
          <p className="left-sub">
            Currently interning on the live Campus Companion ERP used by students and faculty across MLR Institute of Technology.
          </p>
        </div>
      </div>
      <div className="right-column">
        {WORK_EXPERIENCE.map((exp, index) => (
          <WorkExperienceSection key={index} exp={exp} />
        ))}
      </div>
    </div>
  )
}

/* ---------- Footer ---------- */

export function Footer() {
  const links = [
    { name: 'Email.', href: `mailto:${EMAIL}` },
    { name: 'Github.', href: GITHUB },
    { name: 'Resume.', href: '/resume.html' },
  ]

  return (
    <div className="footer">
      <div className="links">
        {links.map((link, i) => (
          <a
            href={link.href}
            target={link.href.startsWith('/') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            key={`footer-link-${i}`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  )
}
