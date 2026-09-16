import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from 'motion/react'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'

import { SCROLLER_PANELS } from '../data.js'
import CanvasBoundary, { hasWebGL } from '../three/CanvasBoundary.jsx'
const JourneyCanvas = lazy(() => import('../three/JourneyCanvas.jsx'))

gsap.registerPlugin(ScrollTrigger)

/* A tall section with a sticky stage: scrolling down it travels the
   panels sideways. The WebGL scenes behind the panels read the same
   progress value, so the 3D and the copy stay in step.

   Phones get a native snap carousel instead — sticky + scrub fights
   with mobile address-bar resizing and is not worth it. */
export default function HorizontalScroller({ dark }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [webgl] = useState(hasWebGL)
  const inView = useInView(sectionRef, { margin: '200px 0px 200px 0px' })

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      /* No ScrollTrigger pin here on purpose: the page sets
         `overflow-x: clip`, which clips position:fixed descendants and
         makes pinning unreliable. The stage is CSS-sticky instead and
         GSAP only drives the track's x from the scroll progress. */
      const distance = () => Math.max(track.scrollWidth - window.innerWidth + 96, 1)
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(track, { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [])

  /* Mobile: report progress from the native horizontal scroll. */
  const onViewportScroll = (e) => {
    if (window.innerWidth > 900) return
    const el = e.currentTarget
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }

  return (
    <section className="horizontal-scroller" id="journey" ref={sectionRef}>
      <div className="horizontal-scroller__stage">
        <header className="horizontal-scroller__head">
          <h1 className="fixed-heading">
            <span className="orange">How </span>
            <span>a product gets built.</span>
          </h1>
          <p className="horizontal-scroller__hint">
            <span className="desktop-only">Keep scrolling — this moves sideways.</span>
            <span className="mobile-only">Swipe →</span>
          </p>
        </header>

        {inView && webgl && (
          <CanvasBoundary>
            <Suspense fallback={<div className="journey-canvas" />}>
              <JourneyCanvas progress={progress} dark={dark} />
            </Suspense>
          </CanvasBoundary>
        )}
        {!webgl && <div className="journey-canvas journey-canvas--fallback" aria-hidden="true" />}

        <div className="horizontal-scroller__viewport" ref={viewportRef} onScroll={onViewportScroll}>
          <div className="horizontal-scroller__track" ref={trackRef}>
            {SCROLLER_PANELS.map((panel, i) => (
              <article className="horizontal-scroller__panel" key={panel.kicker}>
                <p className="horizontal-scroller__kicker">{panel.kicker}</p>
                <h2 className="horizontal-scroller__title">{panel.title}</h2>
                <p className="horizontal-scroller__body">{panel.body}</p>
                <ul className="horizontal-scroller__tags">
                  {panel.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <span className="horizontal-scroller__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="progress-bar" aria-hidden="true">
          <span className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  )
}
