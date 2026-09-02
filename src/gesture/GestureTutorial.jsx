import { motion } from 'motion/react'

import { FistIcon, HandIcon, HeadIcon, PinchIcon } from '../icons.jsx'
import { useHandsfree } from './HandsfreeProvider.jsx'

const GESTURES = [
  {
    icon: <HandIcon size={26} />,
    name: 'Point',
    desc: 'Raise your index finger. The ring on screen follows your fingertip.',
  },
  {
    icon: <PinchIcon size={26} />,
    name: 'Pinch',
    desc: 'Touch your thumb to your index finger to click whatever the ring is over.',
  },
  {
    icon: <FistIcon size={26} />,
    name: 'Fist + move',
    desc: 'Close your hand and move it up or down to scroll the page.',
  },
  {
    icon: <HeadIcon size={26} />,
    name: 'Head tilt',
    desc: 'Tip your head up or down for slow, hands-free scrolling.',
  },
]

/* Body of the gesture-tutorial window. */
export default function GestureTutorial({ onDismiss }) {
  const { status, enable } = useHandsfree()

  return (
    <div className="gesture-tutorial-body">
      <h2 className="gesture-tutorial-body__title">Four gestures, one camera.</h2>
      <p className="gesture-tutorial-body__subtitle">
        Hand and face landmarks are computed on your device with MediaPipe. Nothing is recorded and
        nothing is uploaded.
      </p>

      <div className="gesture-tutorial-body__grid">
        {GESTURES.map((g, i) => (
          <motion.div
            className="gesture-card"
            key={g.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.35 }}
          >
            <span className="gesture-card__icon" aria-hidden="true">
              {g.icon}
            </span>
            <div className="gesture-card__info">
              <p className="gesture-card__name">{g.name}</p>
              <p className="gesture-card__desc">{g.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="gesture-tutorial-body__dismiss">
        <button className="btn primary enable-button" onClick={enable} disabled={status === 'ready' || status === 'loading'}>
          {status === 'ready' ? 'Camera is on' : status === 'loading' ? 'Starting…' : 'Turn on camera control'}
        </button>
        <button className="btn outline" onClick={onDismiss}>
          Maybe later
        </button>
      </div>
    </div>
  )
}
