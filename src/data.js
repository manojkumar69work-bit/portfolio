export const EMAIL = 'manojkumar69.work@gmail.com'
export const GITHUB = 'https://github.com/manojkumar69work-bit'
export const LINKEDIN = 'https://linkedin.com/in/manoj-kumar-ethini'
export const SITE = 'https://www.manojethini.com'

export const PROFILE = {
  name: 'Manoj Kumar Ethini',
  role: 'Fullstack Developer',
  tagline: 'Backend-heavy fullstack developer. Python-first. Ships and deploys end to end.',
  location: 'Hyderabad, India',
  education: 'B.Tech Computer Science — MLR Institute of Technology (III year)',
  interests: ['Backend Engineering', 'AI Products', 'Shipping'],
}

/* Skill icon order must stay in sync with src/assets/skills/{light,dark}/icon<N>.webp */
export const SKILL_NAMES = [
  'PostgreSQL',
  'JavaScript',
  'TypeScript',
  'Django',
  'Python',
  'MySQL',
  'Flutter',
  'Google Cloud',
  'Next.js',
  'GitHub',
  'NestJS',
  'Firebase',
  'React',
]

export const SKILL_GROUPS = [
  {
    name: 'Backend',
    items: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'MySQL', 'SQLAlchemy', 'Alembic', 'REST APIs', 'Celery-style cron jobs'],
  },
  {
    name: 'Frontend',
    items: ['Next.js', 'React 19', 'TypeScript', 'JavaScript', 'Tailwind CSS v4', 'Motion', 'Three.js'],
  },
  {
    name: 'AI & Speech',
    items: ['OpenRouter', 'Groq', 'Sarvam AI', 'edge-tts', 'Silero VAD', 'LiveKit / WebRTC', 'MediaPipe'],
  },
  {
    name: 'Infra & Tools',
    items: ['Render', 'Vercel', 'Railway', 'Supabase', 'Firebase', 'Google Cloud', 'Docker', 'Git', 'GitHub Actions', 'Razorpay'],
  },
]

export const workTabs = [
  {
    name: 'Projects',
    items: [
      {
        title: 'BunkMax',
        img: '/work/bunkmax.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/BunkMax',
          liveUrl: 'https://bunk-max.vercel.app',
        },
        modalData: {
          title: 'BunkMax',
          desc: 'Attendance tracker with automated college-ERP sync. Subscription SaaS that tells students exactly how many classes they can miss — replacing manual attendance math for the whole campus.',
          infoHeading: 'Key Highlights',
          infoArr: [
            'Reverse-engineered the college ERP’s undocumented API by decoding its shipped JS bundles — base64 payloads, nested session cookie, Origin/Referer guards',
            'Migrated the sync to the replacement portal (CampusHub) behind an unchanged client interface — one login imports attendance and the weekly timetable',
            'Fernet-encrypted ERP credentials for daily automated re-sync; Razorpay orders, checkout and signature-verified webhooks',
            '30+ REST endpoints plus morning/evening push-notification cron jobs',
            'Tuned for Render’s free tier — single uvicorn worker, capped DB pool, /health keep-warm ping',
          ],
        },
      },
      {
        title: 'TruthVortex',
        img: '/work/truthvortex.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/truthvortex',
          liveUrl: 'https://truthvortex-sigma.vercel.app',
        },
        modalData: {
          title: 'TruthVortex',
          desc: 'AI Telugu news aggregator. TV-style news dashboard that scrapes ~30 RSS sources across 5 categories and summarizes each article into 5–8 line Telugu summaries.',
          infoHeading: 'Key Highlights',
          infoArr: [
            'Multi-provider AI pipeline (OpenRouter primary, Groq fallback) so a single provider outage or rate limit can’t stall the feed',
            'Background scraper thread every 30 min with fuzzy deduplication and category normalization',
            'Automatic deletion of articles older than 2 days to stay inside free-tier storage',
            'Hardened for production — fixed a DB connection-pool race condition, per-IP rate limiting (slowapi), CSP headers, image proxy fallback, React error boundary',
          ],
        },
      },
      {
        title: 'Multi-lingual Voice Agent',
        img: '/work/voiceagent.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/Multi-lingual-Voice-Agents',
        },
        modalData: {
          title: 'Multi-lingual Voice Agent',
          desc: 'Real-time AI phone agent for real-estate lead capture that speaks Hinglish and understands mixed Hindi/English speech, built as a multi-tenant product.',
          infoHeading: 'Key Highlights',
          infoArr: [
            'Tenant isolation — each agency gets its own prompt, language, agent name, minute quota and login, with no cross-tenant access',
            'Per-call automatic summary, structured lead extraction and transcript, with CSV export and delivery to Google Sheets / WhatsApp',
            'Sentence-level TTS streaming, barge-in via Silero VAD at 0.4s endpointing, Hindi language hint on ASR for code-switched speech',
            'Auth via signed-cookie JWT sessions; admin portal for onboarding and quota management',
          ],
        },
      },
    ],
  },
  {
    name: 'Live',
    items: [
      {
        title: 'BunkMax',
        img: '/work/bunkmax.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/BunkMax',
          liveUrl: 'https://bunk-max.vercel.app',
        },
        modalData: {
          title: 'BunkMax',
          desc: 'Attendance tracker with automated college-ERP sync. Subscription SaaS that tells students exactly how many classes they can miss.',
          infoHeading: 'Stack',
          infoArr: ['Python', 'FastAPI', 'PostgreSQL (Supabase)', 'Next.js 16', 'NextAuth', 'Firebase', 'Razorpay'],
        },
      },
      {
        title: 'TruthVortex',
        img: '/work/truthvortex.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/truthvortex',
          liveUrl: 'https://truthvortex-sigma.vercel.app',
        },
        modalData: {
          title: 'TruthVortex',
          desc: 'AI Telugu news aggregator — ~30 RSS sources summarized into 5–8 line Telugu summaries by a multi-provider LLM fallback chain.',
          infoHeading: 'Stack',
          infoArr: ['FastAPI', 'PostgreSQL', 'Next.js 15', 'React 19', 'Tailwind v4', 'OpenRouter', 'Groq'],
        },
      },
    ],
  },
  {
    name: 'Open Source',
    items: [
      {
        title: 'BunkMax',
        img: '/work/bunkmax.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/BunkMax',
          liveUrl: 'https://bunk-max.vercel.app',
        },
        modalData: {
          title: 'BunkMax',
          desc: 'Attendance tracker with automated college-ERP sync.',
          infoHeading: 'Stack',
          infoArr: ['Python', 'FastAPI', 'PostgreSQL (Supabase)', 'Next.js 16', 'NextAuth', 'Firebase', 'Razorpay'],
        },
      },
      {
        title: 'TruthVortex',
        img: '/work/truthvortex.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/truthvortex',
          liveUrl: 'https://truthvortex-sigma.vercel.app',
        },
        modalData: {
          title: 'TruthVortex',
          desc: 'AI Telugu news aggregator.',
          infoHeading: 'Stack',
          infoArr: ['FastAPI', 'PostgreSQL', 'Next.js 15', 'React 19', 'Tailwind v4'],
        },
      },
      {
        title: 'Multi-lingual Voice Agent',
        img: '/work/voiceagent.svg',
        url: {
          githubUrl: 'https://github.com/manojkumar69work-bit/Multi-lingual-Voice-Agents',
        },
        modalData: {
          title: 'Multi-lingual Voice Agent',
          desc: 'Multi-tenant real-time AI phone agent — Telugu and mixed Hindi/English, with mid-call lead extraction.',
          infoHeading: 'Stack',
          infoArr: ['Python', 'FastAPI', 'WebRTC / LiveKit', 'Groq', 'Sarvam AI', 'edge-tts', 'Docker'],
        },
      },
    ],
  },
]

export const WORK_EXPERIENCE = [
  {
    title: 'Software Development Intern',
    company: 'MLR Institute of Technology',
    date: 'Jul 2026 - Present',
    points: [
      "Building features in a live college ERP (Campus Companion) used by students and faculty across the college, in a team of <span class='black'>6 developers</span>",
      "Built the <span class='black'>HR/faculty attendance module</span> — late and LOP columns, alternating-LOP and half-day cost rules, faculty punch aggregation in SQL, pending-regularization dashboard queue",
      "Fixed faculty workload reporting to measure weekly load in <span class='black'>distinct slots</span> and surface timetable conflicts; corrected Sundays being counted absent",
      "Resolved biometric employee-code mapping against faculty records so <span class='black'>punch data reconciled</span> correctly",
      "Led the <span class='black'>mobile experience</span> for student and faculty portals — greeting headers, vertical home layouts, collapsible profiles, frosted nav, shared page-search dialog",
      "Authored the <span class='black'>CSE III-I (Sem V) timetable SQL seed</span> covering all 7 sections",
    ],
  },
]

export const STATS = [
  { value: '3+', label: 'Live Products', icon: 'rocket' },
  { value: '30+', label: 'REST Endpoints', icon: 'server' },
  { value: '79+', label: 'Commits on BunkMax', icon: 'git' },
  { value: '4', label: 'AI Fallback Providers', icon: 'sparkles' },
]

export const HERO_WORDS = ['Fullstack', 'App', 'Web', 'AI']

export const BOTTOM_TEXTS = [
  `Manoj currently interns on his college's <span class="black"> production ERP </span> system (Campus Companion).`,
  `He ships and deploys on <span class="black"> free tiers </span> — Render, Vercel and Railway — with real users.`,
  `He reverse-engineered his college portal's <span class="black"> undocumented API </span> for BunkMax.`,
  `Interests: <span class="black"> Backend Engineering, AI Products, and Shipping. </span>`,
]

/* Panels for the GSAP-pinned horizontal scroller */
export const SCROLLER_PANELS = [
  {
    kicker: '01 — Backend',
    title: 'FastAPI, then Postgres.',
    body: 'Every product starts as a schema and a set of endpoints. 30+ routes on BunkMax alone, tuned to survive a single free-tier uvicorn worker.',
    tags: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic'],
    scene: 'stack',
  },
  {
    kicker: '02 — AI',
    title: 'Never one provider.',
    body: 'LLM and speech pipelines are built with fallback chains — OpenRouter to Groq, Sarvam to edge-tts — so one outage never stalls the product.',
    tags: ['OpenRouter', 'Groq', 'Sarvam AI', 'Silero VAD'],
    scene: 'orbit',
  },
  {
    kicker: '03 — Frontend',
    title: 'Next.js that ships.',
    body: 'App Router, React 19 and Tailwind v4 — built so the interesting work on the backend actually reaches a person on a phone.',
    tags: ['Next.js', 'React 19', 'Tailwind v4', 'Motion'],
    scene: 'grid',
  },
  {
    kicker: '04 — Ship',
    title: 'Live, or it did not happen.',
    body: 'Render, Vercel and Railway. Real users, real cron jobs, real payment webhooks — running on the free tier and staying up.',
    tags: ['Render', 'Vercel', 'Railway', 'Razorpay'],
    scene: 'ship',
  },
]
