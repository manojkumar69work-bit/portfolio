export const EMAIL = 'manojkumar69.work@gmail.com'
export const GITHUB = 'https://github.com/manojkumar69work-bit'
export const LINKEDIN = 'https://linkedin.com/in/manoj-kumar-ethini'
export const SITE = 'https://manoj-kumarrr.vercel.app'

export const PROFILE = {
  name: 'Manoj Kumar Ethini',
  role: 'Fullstack Developer',
  tagline: 'Backend-heavy fullstack developer. Python-first. Ships and deploys end to end.',
  location: 'Hyderabad, India',
  education: 'B.Tech Computer Science — MLR Institute of Technology · Expected 2028 · CGPA 7.8/10',
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
    name: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'C'],
  },
  {
    name: 'Backend',
    items: ['FastAPI', 'Django', 'NestJS', 'PostgreSQL', 'MySQL', 'SQLite', 'SQLAlchemy', 'Alembic', 'REST APIs', 'JWT auth', 'psycopg2 pooling', 'Rate limiting', 'Webhooks', 'Celery-style cron jobs'],
  },
  {
    name: 'Frontend',
    items: ['Next.js', 'React 19', 'Tailwind CSS v4', 'Shadcn UI', 'TanStack Query', 'Zustand', 'Motion', 'Three.js', 'Flutter'],
  },
  {
    name: 'AI & Speech',
    items: ['OpenRouter', 'Groq', 'Sarvam AI', 'edge-tts', 'Silero VAD', 'LiveKit / WebRTC', 'MediaPipe', 'scikit-learn', 'Streamlit'],
  },
  {
    name: 'Infra & Tools',
    items: ['Render', 'Vercel', 'Railway', 'Supabase', 'AWS RDS', 'Firebase', 'Google Cloud', 'Docker', 'Git', 'GitHub Actions', 'NextAuth', 'Razorpay', 'n8n', 'BeautifulSoup', 'feedparser'],
  },
  {
    name: 'Data & Geo',
    items: ['Leaflet', 'OpenStreetMap (OSRM, Overpass)', 'Zerodha Kite Connect', 'yfinance', 'NSE disclosure feeds'],
  },
]

/* Parked for now — not rendered anywhere. Add it back to a tab in `workTabs`
   below to put it on the site again. */
export const BUNKMAX = {
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
}

const RED4CE_URL = {
  liveUrl: 'https://red4ce.com',
}

const RED4CE_MODAL = {
  title: 'Red4ce',
  desc: 'A Telugu news website. Breaking news, business, sports, movies, crime and education — short, easy-to-read Telugu stories, updated through the day.',
  infoHeading: 'On the site',
  infoArr: [
    'Six sections: Breaking, Business, Sports, Movies, Crime and Education',
    'Short Telugu stories you can read at a glance, on a TV-style front page',
    'Fresh news every 30 minutes',
    'Red4ce’s own original reporting alongside news from other Telugu publishers, always credited',
  ],
}

const APEX_URL = {
  liveUrl: 'https://apex-automotive-lilac.vercel.app',
}

const VOICE_AGENT_URL = {}

export const workTabs = [
  {
    name: 'Projects',
    items: [
      {
        title: 'Red4ce',
        img: '/work/red4ce.svg',
        url: RED4CE_URL,
        modalData: RED4CE_MODAL,
      },
      {
        title: 'Multi-lingual Voice Agent',
        img: '/work/voiceagent.svg',
        url: VOICE_AGENT_URL,
        modalData: {
          title: 'Multi-lingual Voice Agent',
          desc: 'Real-time AI phone agent for real-estate lead capture that speaks Hinglish and understands mixed Hindi/English speech, built as a multi-tenant product.',
          infoHeading: 'Key Highlights',
          infoArr: [
            'Tenant isolation — each agency gets its own prompt, language, agent name, minute quota and login, with no cross-tenant access',
            'Per-call automatic summary, structured lead extraction and transcript, with CSV export and delivery to Google Sheets / WhatsApp',
            'Sentence-level TTS streaming, barge-in via Silero VAD at 0.4s endpointing, Hindi language hint on ASR for code-switched speech',
            'Speech pipeline falls back Sarvam AI → edge-tts, the same multi-provider pattern the LLM side uses (OpenRouter → Groq), so no single vendor can take a call down',
            'Auth via signed-cookie JWT sessions; admin portal for onboarding and quota management',
          ],
        },
      },
      {
        title: 'APEX Automotive',
        img: '/work/apex.jpg',
        url: APEX_URL,
        modalData: {
          title: 'APEX Automotive',
          desc: 'Cinematic 3D scroll experience for a concept supercar, built with a teammate. One pinned scroll drives the camera, the car and its environments through a nine-shot story.',
          infoHeading: 'Key Highlights',
          infoArr: [
            'Rebuilt the 3D cinematic scene — car rig, procedural environments and a shared scroll timeline that the DOM panels, camera and car all read from',
            'Exploded view — bumper, hood, doors, roof and rear clamshell lift off the carbon cell in sequence, then reassemble',
            'X-ray pass — bodywork fades to glass while a scan sweeps nose to tail and lights up the structure, powertrain and brakes',
            'Wheel assembly — the front corner comes toward the camera and the rim slides off to show disc, caliper and wishbones',
            'Playwright scripts for shot capture, cinematic QA and performance checks',
          ],
        },
      },
    ],
  },
  {
    name: 'Live',
    items: [
      {
        title: 'Red4ce',
        img: '/work/red4ce.svg',
        url: RED4CE_URL,
        modalData: RED4CE_MODAL,
      },
      {
        title: 'APEX Automotive',
        img: '/work/apex.jpg',
        url: APEX_URL,
        modalData: {
          title: 'APEX Automotive',
          desc: 'Cinematic 3D scroll experience for a concept supercar — exploded view, X-ray scan and wheel teardown, all driven by one scroll timeline.',
          infoHeading: 'Stack',
          infoArr: ['React 19', 'Three.js', 'React Three Fiber', 'drei', 'GSAP', 'Motion', 'Vite', 'Playwright'],
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
    stack: 'Next.js 16 · TypeScript · PostgreSQL · Shadcn UI · campushub.mlrit.ac.in',
    points: [
      "Feature owner on a live college ERP spanning <span class='black'>17 role-based portals</span> — team of 7, <span class='black'>115 commits</span>, shipped through PR review",
      "Own the <span class='black'>attendance and HR/leave domain</span> end to end — schema, migrations, API, UI and release",
      "Encoded <span class='black'>payroll-affecting policy</span> in SQL — LOP and half-day rules, week-offs excluded, leave-aware punch summary",
      "Built the faculty <span class='black'>leave system</span> — snapshot cutoffs, CCL proof upload, Academic Leave and OD under a shared cap",
      "Re-architected attendance into <span class='black'>per-period sessions</span> so every hour of a lab block marks and reports on its own",
      "Shipped the <span class='black'>monthly attendance report</span> — theory/lab split with CSV and Excel export",
      "Delivered through the team's <span class='black'>Supabase → AWS RDS migration</span>, merging it into production",
      "Led the <span class='black'>mobile experience</span> for both portals, folding duplicate flows into one shared dialog",
    ],
  },
]

export const STATS = [
  { value: '17', label: 'Portals in a Live ERP', icon: 'rocket' },
  { value: '6', label: 'News Sections on Red4ce', icon: 'server' },
  { value: '115', label: 'Commits on Campus ERP', icon: 'git' },
  { value: '2', label: 'Live Products', icon: 'sparkles' },
]

export const HERO_WORDS = ['Fullstack', 'App', 'Web', 'AI']

export const BOTTOM_TEXTS = [
  `Manoj currently interns on his college's <span class="black"> production ERP </span> system (Campus Companion).`,
  `He ships and deploys on <span class="black"> free tiers </span> — Render, Vercel and Railway — with real users.`,
  `He built <span class="black"> Red4ce </span>, a Telugu news website.`,
  `Interests: <span class="black"> Backend Engineering, AI Products, and Shipping. </span>`,
]

/* Panels for the GSAP-pinned horizontal scroller. `scene` names the 3D scene that
   plays behind each panel — the actual wiring is LAYOUT order in three/JourneyCanvas.jsx,
   so the two lists must stay in the same order. */
export const SCROLLER_PANELS = [
  {
    kicker: '01 — Backend',
    title: 'FastAPI, then Postgres.',
    body: 'Every product starts as a schema and a set of endpoints, built to survive a single free-tier instance.',
    tags: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic'],
    scene: 'stack',
  },
  {
    kicker: '02 — AI',
    title: 'Never one provider.',
    body: 'LLM and speech pipelines are built with fallback chains — OpenRouter to Groq, Sarvam to edge-tts — so one outage never drops a call.',
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
    body: 'Render, Vercel and Railway. Real users and real cron jobs — running on the free tier and staying up.',
    tags: ['Render', 'Vercel', 'Railway', 'GitHub Actions'],
    scene: 'ship',
  },
]
