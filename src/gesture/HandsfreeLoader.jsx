import { AnimatePresence, motion } from 'motion/react'

import { useHandsfree } from './HandsfreeProvider.jsx'

const STEPS = [
  [0, 'Loading the vision runtime…'],
  [18, 'Downloading the hand landmarker…'],
  [60, 'Downloading the face landmarker…'],
  [88, 'Warming up the models…'],
  [94, 'Asking for your camera…'],
  [100, 'Ready. Point your index finger at the screen.'],
]

function label(progress) {
  let text = STEPS[0][1]
  for (const [at, message] of STEPS) if (progress >= at) text = message
  return text
}

/* Full-screen overlay shown while the MediaPipe models download.
   The percentage is real: the provider streams the .task files itself. */
export default function HandsfreeLoader() {
  const { status, progress, error, disable } = useHandsfree()
  const visible = status === 'loading' || status === 'error'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="handsfree-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="handsfree-loader-card"
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            {status === 'error' ? (
              <>
                <p className="handsfree-loader-text error">{error}</p>
                <button className="btn outline" onClick={disable}>
                  Close
                </button>
              </>
            ) : (
              <>
                <span className="handsfree-loader-spinner" aria-hidden="true" />
                <p className="handsfree-loader-percent">{Math.round(progress)}%</p>
                <div className="handsfree-loader-bar">
                  <motion.div
                    className="handsfree-loader-fill"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.25 }}
                  />
                </div>
                <p className="handsfree-loader-text">{label(progress)}</p>
                <p className="handsfree-loader-text subtle">
                  Everything runs on your device — no frame is uploaded anywhere.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
