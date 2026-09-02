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
    id: 'bunkmax',
    keywords: 'bunkmax bunk attendance erp college portal reverse engineer api razorpay payments subscription saas campushub cron notifications fernet render',
    lines: [
      `${B}BunkMax${R} — attendance tracker with automated college-ERP sync.`,
      '',
      'I reverse-engineered the college ERP’s undocumented API by reading its shipped',
      'JS bundles — base64 payloads, a nested session cookie and Origin/Referer guards.',
      'One login imports both attendance and the weekly timetable, and credentials are',
      'stored Fernet-encrypted so a daily cron can re-sync on its own.',
      '',
      'Payments run on Razorpay with signature-verified webhooks. 30+ REST endpoints,',
      'morning and evening push-notification jobs, and the whole thing is tuned to live',
      'on Render’s free tier — one uvicorn worker, a capped DB pool, a /health keep-warm.',
      '',
      `${GREY}Stack: FastAPI · PostgreSQL (Supabase) · Next.js 16 · NextAuth · Firebase${R}`,
    ],
  },
  {
    id: 'truthvortex',
    keywords: 'truthvortex truth vortex news telugu rss scraper summaries aggregator openrouter groq llm dedupe deduplication rate limit csp',
    lines: [
      `${B}TruthVortex${R} — an AI Telugu news aggregator.`,
      '',
      'A background thread scrapes ~30 RSS sources across 5 categories every 30 minutes,',
      'fuzzy-deduplicates them, and summarizes each article into a 5–8 line Telugu summary.',
      '',
      'The AI pipeline is multi-provider — OpenRouter first, Groq as fallback — so one',
      'outage or rate limit can’t stall the feed. Articles older than two days are deleted',
      'to stay inside free-tier storage.',
      '',
      'Production hardening: fixed a DB connection-pool race, per-IP rate limiting with',
      'slowapi, CSP headers, an image proxy fallback and a React error boundary.',
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
    keywords: 'internship intern job work experience mlrit mlr campus companion erp hr attendance faculty lop biometric timetable workload team',
    lines: [
      `${B}Software Development Intern — MLR Institute of Technology${R}`,
      '',
      'I work in a team of 6 on Campus Companion, the live college ERP used by students',
      'and faculty across the college.',
      '',
      'I built the HR/faculty attendance module — late and LOP columns, alternating-LOP',
      'and half-day cost rules, faculty punch aggregation in SQL, and the pending-',
      'regularization dashboard queue. I fixed workload reporting to measure weekly load',
      'in distinct slots and surface timetable conflicts, and corrected Sundays being',
      'counted absent. I also reconciled biometric employee codes against faculty records.',
      '',
      'On the frontend I led the mobile experience for both portals, and I authored the',
      'CSE III-I timetable SQL seed covering all 7 sections.',
    ],
  },
  {
    id: 'stack',
    keywords: 'stack tech technology skills tools languages python fastapi postgres postgresql sql next nextjs react tailwind docker git backend frontend framework use',
    lines: [
      `${B}My stack${R}`,
      '',
      `${ORANGE}Backend${R}   Python, FastAPI, Django, PostgreSQL, MySQL, SQLAlchemy, Alembic`,
      `${ORANGE}Frontend${R}  Next.js, React 19, TypeScript, Tailwind v4, Motion, Three.js`,
      `${ORANGE}AI/Speech${R} OpenRouter, Groq, Sarvam AI, edge-tts, Silero VAD, LiveKit`,
      `${ORANGE}Infra${R}     Render, Vercel, Railway, Supabase, Firebase, Docker, GitHub Actions`,
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
  `  ${ORANGE}ai what is BunkMax${R}`,
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
