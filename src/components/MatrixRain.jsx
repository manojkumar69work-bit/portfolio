import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ﾊﾋﾌﾍﾎABCDEF'

/* `matrix` in the terminal turns this on. Click or Esc to dismiss. */
export default function MatrixRain({ active, onDismiss }) {
  const canvasRef = useRef(null)

  /* Held in a ref and kept out of the effect deps: the parent re-renders on every
     scroll event, and a fresh onDismiss closure would otherwise tear down the
     effect mid-animation, re-randomising the drops and restarting the rain. */
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let columns = 0
    let drops = []
    const fontSize = 15

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.ceil(window.innerWidth / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -60)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let last = 0
    const draw = (ts) => {
      raf = requestAnimationFrame(draw)
      if (ts - last < 45) return
      last = ts
      ctx.fillStyle = 'rgba(4, 6, 10, 0.09)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < columns; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillStyle = Math.random() > 0.975 ? '#f0732d' : '#5ef08a'
        ctx.fillText(char, x, y)
        if (y > window.innerHeight && Math.random() > 0.972) drops[i] = 0
        drops[i] += 1
      }
    }
    raf = requestAnimationFrame(draw)

    const onKey = (e) => {
      if (e.key === 'Escape') onDismissRef.current()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKey)
    }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="matrix-rain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onDismiss}
        >
          <canvas ref={canvasRef} />
          <button className="matrix-dismiss" onClick={onDismiss}>
            Esc to wake up
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
