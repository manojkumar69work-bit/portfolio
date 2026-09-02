import { CameraIcon, HandIcon, HeadIcon, PinchIcon } from '../icons.jsx'
import { useHandsfree } from './HandsfreeProvider.jsx'

const FEATURES = [
  { icon: <HandIcon size={20} />, text: 'Your index finger becomes the cursor' },
  { icon: <PinchIcon size={20} />, text: 'Pinch to click any button or card' },
  { icon: <HeadIcon size={20} />, text: 'Tilt your head to scroll the page' },
  { icon: <CameraIcon size={20} />, text: 'Runs on-device — no video leaves this tab' },
]

/* Body of the handsfree-intro window: the consent step before the
   camera is ever requested. */
export default function HandsfreeIntro({ onDismiss }) {
  const { status, enable, error } = useHandsfree()

  return (
    <div className="handsfree-modal-body">
      <h2 className="heading-2">Drive this site without touching it.</h2>
      <p className="small-desc">
        This asks for camera access so MediaPipe can find your hand and face. The video stream stays
        in your browser — it is never recorded, stored or sent anywhere.
      </p>

      <ul className="features">
        {FEATURES.map((f) => (
          <li className="feature" key={f.text}>
            <span className="feature-icon" aria-hidden="true">
              {f.icon}
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      {error && <p className="handsfree-loader-text error">{error}</p>}

      <div className="modal-cta-row">
        <button className="btn primary enable-button handsfree-button" onClick={enable} disabled={status === 'loading' || status === 'ready'}>
          {status === 'ready' ? 'Camera is on' : status === 'loading' ? 'Starting…' : 'Allow camera'}
        </button>
        <button className="btn outline" onClick={onDismiss}>
          Not now
        </button>
      </div>
    </div>
  )
}
