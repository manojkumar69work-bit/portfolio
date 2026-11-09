import { EMAIL, GITHUB, LINKEDIN } from '../data.js'

/* The `ai` command answers from this local index by default, so the
   terminal works with no key and nothing typed here leaves the browser.
   Set VITE_AI_ENDPOINT to a backend of your own to hand questions to a
   real model instead — the endpoint should accept { question } and
   return { answer }. */

const ORANGE = '\x1b[38;2;240;115;45m'
const GREY = '\x1b[38;2;140;140;150m'
const R = '\x1b[0m'
const B = '\x1b[1m'

const DOCS = [
  {
    id: 'red4ce',
    keywords: 'red4ce reforce truthvortex truth vortex news telugu website breaking business sports movies crime education',
    lines: [
      `${B}Red4ce${R} — a Telugu news website at red4ce.com.`,
      '',
      'Breaking news, business, sports, movies, crime and education — short,',
      'easy-to-read Telugu stories on a TV-style front page, updated every 30 minutes.',
      'Red4ce’s own reporting sits alongside news from other Telugu publishers,',
      'always credited.',
    ],
  },
  {
    id: 'apex',
    keywords: 'apex automotive car supercar 3d three.js three cinematic scroll exploded xray x-ray wheel react three fiber gsap playwright mclaren',
    lines: [
      `${B}APEX Automotive${R} — a cinematic 3D scroll experience for a concept supercar.`,
      '',
      'Built with a teammate. One pinned scroll drives the camera, the car and its',
      'environments through a nine-shot story. I rebuilt the 3D scene: the car rig,',
      'procedural environments and a shared timeline that the DOM panels, camera and',
      'car all read from.',
      '',
      'The panels lift off the carbon cell in sequence for an exploded view, the body',
      'fades to glass for an X-ray scan, and the front wheel comes apart to show the',
      'disc, caliper and wishbones. Playwright scripts handle shot capture and QA.',
      '',
      `${GREY}Stack: React 19 · Three.js · React Three Fiber · GSAP · Vite${R}`,
      `${GREY}Live: https://apex-automotive-lilac.vercel.app${R}`,
    ],
  },
  {
    id: 'voiceagent',
    keywords: 'voice agent phone call hinglish hindi english speech tts asr vad silero livekit webrtc multi tenant real estate lead sarvam edge-tts barge in',
    lines: [
      `${B}Multi-lingual Voice Agent${R} — a real-time AI phone agent.`,
      '',
      'Built for real-estate lead capture: it speaks Hinglish and understands mixed',
      'Hindi/English speech. Multi-tenant by design — each agency gets its own prompt,',
      'language, agent name, minute quota and login, with no cross-tenant access.',
      '',
      'Latency work: sentence-level TTS streaming, barge-in via Silero VAD at 0.4s',
      'endpointing, and a Hindi language hint on ASR so code-switching does not break it.',
      '',
      'Every call produces a summary, a structured lead and a transcript, exportable to',
      'CSV, Google Sheets or WhatsApp.',
    ],
  },
  {
    id: 'internship',
    keywords: 'internship intern job work experience mlrit mlr campus companion erp hr attendance faculty lop biometric timetable workload team leave portals commits migration rds',
    lines: [
      `${B}Software Development Intern — MLR Institute of Technology${R}`,
      '',
      'I am a feature owner on Campus Companion, the live college ERP at',
      'campushub.mlrit.ac.in, spanning 17 role-based portals — students, faculty, HODs,',
      'deans and the administrative offices around them. Team of 7, where I am one of the',
      'two most active contributors with 115 commits, working through PR review.',
      '',
      'I own the attendance and HR/leave domain end to end — schema and SQL migrations,',
      'API routes, UI and release. That means payroll-affecting policy in the data layer:',
      'late and LOP columns, alternating-LOP and half-day cost rules, week-offs and',
      'declared holidays excluded from every count, and a leave-aware punch summary so an',
      'approved leave day never reads as absent.',
      '',
      'I built the faculty leave system (ML release schedule with snapshot cutoffs, CCL',
      'proof upload surfaced to the approving HOD, Academic Leave and OD under a shared',
      'yearly cap), re-architected attendance around per-period sessions so each hour of a',
      'multi-period lab block marks and reports independently, and shipped the monthly',
      'attendance report end to end with a theory/lab split and CSV/Excel export.',
      '',
      'I delivered features through the team\'s Supabase to AWS RDS migration, merging the',
      'migration branch into production, and led the mobile experience for both portals.',
      '',
      `${ORANGE}Stack${R} Next.js 16, TypeScript, PostgreSQL (Supabase to AWS RDS), Shadcn UI`,
    ],
  },
  {
    id: 'stack',
    keywords: 'stack tech technology skills tools languages python fastapi postgres postgresql sql next nextjs react tailwind docker git backend frontend framework use',
    lines: [
      `${B}My stack${R}`,
      '',
      `${ORANGE}Languages${R} Python, TypeScript, JavaScript, SQL, Java, C`,
      `${ORANGE}Backend${R}   FastAPI, Django, NestJS, PostgreSQL, MySQL, SQLite, SQLAlchemy, Alembic`,
      `${ORANGE}Frontend${R}  Next.js, React 19, Tailwind v4, Shadcn UI, TanStack Query, Zustand, Motion, Three.js`,
      `${ORANGE}AI/Speech${R} OpenRouter, Groq, Sarvam AI, edge-tts, Silero VAD, LiveKit, scikit-learn`,
      `${ORANGE}Infra${R}     Render, Vercel, Railway, Supabase, AWS RDS, Firebase, Docker, GitHub Actions`,
      `${ORANGE}Data/Geo${R}  Leaflet, OpenStreetMap (OSRM, Overpass), Zerodha Kite Connect, yfinance`,
      '',
      'Python-first. I reach for FastAPI and Postgres before anything else, and I only',
      'add a service when the free tier of the last one runs out.',
    ],
  },
  {
    id: 'about',
    keywords: 'who you yourself about bio background student cse study college year introduce tell me hire why',
    lines: [
      `${B}Manoj Kumar Ethini${R} — fullstack developer, backend-heavy.`,
      '',
      'Third-year CSE student at MLR Institute of Technology, Hyderabad. I ship and',
      'deploy full-stack products end to end: FastAPI + PostgreSQL backends, Next.js',
      'frontends, and LLM/speech pipelines that run live on Render, Vercel and Railway.',
      '',
      'Three products are live and have real users. I currently intern on my college’s',
      'production ERP.',
      '',
      `${GREY}Interested in: backend engineering, AI products, and actually shipping.${R}`,
    ],
  },
  {
    id: 'contact',
    keywords: 'contact email reach hire mail linkedin github social connect message',
    lines: [
      `${B}Get in touch${R}`,
      '',
      `${ORANGE}email${R}     ${EMAIL}`,
      `${ORANGE}github${R}    ${GITHUB}`,
      `${ORANGE}linkedin${R}  ${LINKEDIN}`,
      '',
      `${GREY}Or run ${ORANGE}email${R}${GREY} to open your mail client right now.${R}`,
    ],
  },
  {
    id: 'site',
    keywords: 'site website portfolio built build this page terminal gesture dock three js webgl how made source',
    lines: [
      `${B}About this site${R}`,
      '',
      'React 19 + Vite, styled by hand — no UI kit. Motion drives the section',
      'transitions, GSAP ScrollTrigger drives the pinned horizontal journey, and',
      'Three.js / React Three Fiber render the 3D scenes.',
      '',
      'The desktop layer you are using now — draggable windows, the dock, this terminal',
      '— is custom. Camera control uses MediaPipe hand and face landmarkers, running',
      'entirely on-device.',
      '',
      `${GREY}Press Ctrl+J any time to toggle this terminal.${R}`,
    ],
  },
]

const STOP = new Set('a an the is are was were do does did you your my me i to of on in for with and or what how why when where which that this it about tell can could please'.split(' '))

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
}

function scoreLocal(question) {
  const tokens = tokenize(question)
  if (tokens.length === 0) return null
  let best = null
  for (const doc of DOCS) {
    const bag = new Set(tokenize(doc.keywords))
    let score = 0
    for (const t of tokens) {
      if (bag.has(t)) score += 2
      else if ([...bag].some((k) => k.startsWith(t) || t.startsWith(k))) score += 1
    }
    const normalized = score / Math.sqrt(tokens.length)
    if (!best || normalized > best.score) best = { doc, score: normalized }
  }
  return best && best.score >= 1 ? best.doc : null
}

const FALLBACK = [
  `${GREY}I could not match that to anything I know locally. Try one of:${R}`,
  '',
  `  ${ORANGE}ai what is Red4ce${R}`,
  `  ${ORANGE}ai how does the voice agent handle Hinglish${R}`,
  `  ${ORANGE}ai what is your stack${R}`,
  `  ${ORANGE}ai what do you do at your internship${R}`,
  `  ${ORANGE}ai how was this site built${R}`,
]

export async function answer(question) {
  const endpoint = import.meta.env?.VITE_AI_ENDPOINT
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const text = typeof data === 'string' ? data : (data.answer ?? data.text ?? '')
      if (text) return String(text).split('\n')
    } catch {
      // Fall through to the local index rather than showing an error.
    }
  }
  // Small delay so the "thinking" indicator is visible.
  await new Promise((r) => setTimeout(r, 260))
  const doc = scoreLocal(question)
  return doc ? doc.lines : FALLBACK
}
