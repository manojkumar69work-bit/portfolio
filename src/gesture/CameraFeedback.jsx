import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useHandsfree } from './HandsfreeProvider.jsx'

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
]

const GESTURE_COPY = {
  none: 'Show your hand',
  point: 'Pointing',
  pinch: 'Pinch — click',
  fist: 'Fist — scrolling',
}

/* Mirrored camera preview with the tracked skeleton drawn over it, so
   you can see exactly what the model is picking up. */
export default function CameraFeedback() {
  const { status, gesture, videoRef, landmarksRef, disable, recalibrate } = useHandsfree()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (status !== 'ready') return
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')
    let raf = 0

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const { width, height } = canvas
      ctx.save()
      ctx.clearRect(0, 0, width, height)
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
      if (video.readyState >= 2) ctx.drawImage(video, 0, 0, width, height)
      const marks = landmarksRef.current
      if (marks) {
        ctx.strokeStyle = 'rgba(240,115,45,0.9)'
        ctx.lineWidth = 2
        for (const [a, b] of CONNECTIONS) {
          ctx.beginPath()
          ctx.moveTo(marks[a].x * width, marks[a].y * height)
          ctx.lineTo(marks[b].x * width, marks[b].y * height)
          ctx.stroke()
        }
        ctx.fillStyle = '#fff'
        for (const m of marks) {
          ctx.beginPath()
          ctx.arc(m.x * width, m.y * height, 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.restore()
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [status, videoRef, landmarksRef])

  return (
    <AnimatePresence>
      {status === 'ready' && (
        <motion.aside
          className="camera-feedback"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <canvas ref={canvasRef} width={192} height={144} />
          <div className="camera-feedback__bar">
            <span className={`camera-feedback__chip camera-feedback__chip--${gesture}`}>
              {GESTURE_COPY[gesture] ?? GESTURE_COPY.none}
            </span>
            <div className="camera-feedback__actions">
              <button onClick={recalibrate} title="Reset head-tilt centre">
                ⟳
              </button>
              <button onClick={disable} title="Turn off camera control">
                ✕
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
