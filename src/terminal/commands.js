import { EMAIL, GITHUB, LINKEDIN, PROFILE, SKILL_GROUPS, STATS, WORK_EXPERIENCE, workTabs } from '../data.js'
import { answer as aiAnswer } from './knowledge.js'

/* ANSI helpers — xterm renders these directly. */
const R = '\x1b[0m'
const B = '\x1b[1m'
const D = '\x1b[2m'
const ORANGE = '\x1b[38;2;240;115;45m'
const CYAN = '\x1b[38;2;86;182;194m'
const GREEN = '\x1b[38;2;126;200;120m'
const GREY = '\x1b[38;2;140;140;150m'

export const c = { R, B, D, ORANGE, CYAN, GREEN, GREY }

const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, '')

function table(rows, gap = 2) {
  const width = rows.reduce((m, [k]) => Math.max(m, strip(k).length), 0)
  return rows.map(([k, v]) => `  ${ORANGE}${k}${R}${' '.repeat(width - strip(k).length + gap)}${v}`)
}

/* Plain ASCII rather than block glyphs: full-block characters leave
   horizontal gaps at any line-height above 1. */
const BANNER = [
  '',
  ORANGE + ' __  __    _    _   _  ___      _ ' + R,
  ORANGE + '|  \\/  |  / \\  | \\ | |/ _ \\    | |' + R,
  ORANGE + '| |\\/| | / _ \\ |  \\| | | | |_  | |' + R,
  ORANGE + '| |  | |/ ___ \\| |\\  | |_| | |_| |' + R,
  ORANGE + '|_|  |_/_/   \\_\\_| \\_|\\___/ \\___/ ' + R,
  '',
  `  ${B}${PROFILE.name}${R} ${D}— ${PROFILE.role}${R}`,
  `  ${GREY}${PROFILE.tagline}${R}`,
  '',
]

const SECTIONS = ['hero', 'skills', 'work', 'journey', 'stats', 'experience', 'contact']

const FILES = {
  'about.txt': () => [
    `${PROFILE.name} — ${PROFILE.role}`,
    '',
    PROFILE.tagline,
    `Location : ${PROFILE.location}`,
    `Studying : ${PROFILE.education}`,
    `Interests: ${PROFILE.interests.join(', ')}`,
  ],
  'stack.txt': () => SKILL_GROUPS.flatMap((g) => [`${ORANGE}${g.name}${R}`, `  ${g.items.join(', ')}`, '']),
  'contact.txt': () => [`email    ${EMAIL}`, `github   ${GITHUB}`, `linkedin ${LINKEDIN}`],
  'readme.md': () => [
    `${B}# ${PROFILE.name}${R}`,
    '',
    'A portfolio that is also a small desktop. Try:',
    `  ${ORANGE}projects${R}   list what I have shipped`,
    `  ${ORANGE}open bunkmax${R}  launch a project window`,
    `  ${ORANGE}gesture${R}    control this page with your hand`,
    `  ${ORANGE}ai <q>${R}      ask me something`,
  ],
}

/* Every command returns an array of lines (or a promise of one).
   `ctx` carries the side-effect hooks the terminal window supplies. */
export const COMMANDS = {
  help: {
    description: 'List every available command',
    run: () => [
      '',
      `${B}Available commands${R} ${D}— tab completes, ↑/↓ walks history${R}`,
      '',
      ...table(
        Object.entries(COMMANDS)
          .filter(([, v]) => !v.hidden)
          .map(([name, v]) => [v.usage ?? name, `${GREY}${v.description}${R}`])
      ),
      '',
    ],
  },

  about: {
    description: 'Who I am, in four lines',
    run: () => ['', ...FILES['about.txt'](), ''],
  },

  whoami: {
    description: 'Print the current user',
    run: () => [`${ORANGE}manoj${R} ${D}(visitor session)${R}`],
  },

  skills: {
    description: 'Everything I build with, grouped',
    run: () => ['', ...SKILL_GROUPS.flatMap((g) => [`  ${ORANGE}${g.name}${R}`, `    ${GREY}${g.items.join(' · ')}${R}`, ''])],
  },

  projects: {
    description: 'List shipped projects',
    run: () => {
      const seen = new Map()
      for (const tab of workTabs) for (const item of tab.items) if (!seen.has(item.title)) seen.set(item.title, item)
      return [
        '',
        ...[...seen.values()].flatMap((p, i) => [
          `  ${ORANGE}${String(i + 1).padStart(2, '0')}${R} ${B}${p.title}${R}`,
          `     ${GREY}${p.modalData.desc.split('.')[0]}.${R}`,
          `     ${CYAN}${p.url.liveUrl ?? p.url.githubUrl}${R}`,
          '',
        ]),
        `${D}  Tip: ${R}${ORANGE}open ${strip(`${[...seen.keys()][0]}`).toLowerCase()}${R}${D} opens it in a window.${R}`,
        '',
      ]
    },
  },

  open: {
    usage: 'open <project>',
    description: 'Open a project in a draggable window',
    run: (ctx, args) => {
      const query = args.join(' ').toLowerCase().trim()
      if (!query) return [`${GREY}Usage: open <project>. Run ${ORANGE}projects${R}${GREY} for names.${R}`]
      const all = workTabs.flatMap((t) => t.items)
      const match = all.find((p) => p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(query.replace(/[^a-z0-9]/g, '')))
      if (!match) return [`${GREY}No project matching "${query}".${R}`]
      ctx.openProject(match)
      return [`${GREEN}Opening ${match.title}…${R}`]
    },
  },

  experience: {
    description: 'Work history',
    run: () =>
      WORK_EXPERIENCE.flatMap((e) => [
        '',
        `  ${B}${e.title}${R} ${D}@${R} ${ORANGE}${e.company}${R}`,
        `  ${GREY}${e.date}${R}`,
        '',
        ...e.points.map((p) => `   ${ORANGE}•${R} ${strip(p.replace(/<[^>]+>/g, ''))}`),
        '',
      ]),
  },

  education: {
    description: 'Where I study',
    run: () => ['', `  ${PROFILE.education}`, `  ${GREY}${PROFILE.location}${R}`, ''],
  },

  stats: {
    description: 'The numbers section, as text',
    run: () => ['', ...table(STATS.map((s) => [s.value, `${GREY}${s.label}${R}`]), 3), ''],
  },

  contact: {
    description: 'Every way to reach me',
    run: () => ['', ...table([['email', EMAIL], ['github', GITHUB], ['linkedin', LINKEDIN]]), ''],
  },

  email: {
    description: 'Compose an email to me',
    run: () => {
      window.location.href = `mailto:${EMAIL}`
      return [`${GREEN}Opening your mail client → ${EMAIL}${R}`]
    },
  },

  github: {
    description: 'Open my GitHub profile',
    run: () => {
      window.open(GITHUB, '_blank', 'noopener')
      return [`${GREEN}→ ${GITHUB}${R}`]
    },
  },

  linkedin: {
    description: 'Open my LinkedIn profile',
    run: () => {
      window.open(LINKEDIN, '_blank', 'noopener')
      return [`${GREEN}→ ${LINKEDIN}${R}`]
    },
  },

  resume: {
    description: 'Open my resume in a new tab',
    run: () => {
      window.open('/resume.html', '_blank', 'noopener')
      return [`${GREEN}Opening resume…${R}`]
    },
  },

  theme: {
    usage: 'theme [dark|light]',
    description: 'Switch or toggle the colour theme',
    run: (ctx, args) => {
      const mode = args[0]
      const next = mode === 'dark' ? true : mode === 'light' ? false : undefined
      const applied = ctx.setTheme(next)
      return [`${GREEN}Theme → ${applied ? 'dark' : 'light'}${R}`]
    },
  },

  ls: {
    description: 'List the sections of this site',
    run: () => ['', `  ${SECTIONS.map((s) => `${CYAN}${s}/${R}`).join('   ')}`, '', `  ${Object.keys(FILES).map((f) => `${GREY}${f}${R}`).join('   ')}`, ''],
  },

  cd: {
    usage: 'cd <section>',
    description: 'Scroll the page to a section',
    run: (ctx, args) => {
      const target = (args[0] ?? '').replace(/\/$/, '')
      if (!target) return [`${GREY}Usage: cd <section>. Run ${ORANGE}ls${R}${GREY} to see them.${R}`]
      if (!SECTIONS.includes(target)) return [`${GREY}cd: no such section: ${target}${R}`]
      ctx.navigate(target)
      return [`${GREEN}→ /${target}${R}`]
    },
  },

  cat: {
    usage: 'cat <file>',
    description: 'Print one of the files above',
    run: (ctx, args) => {
      const name = args[0]
      if (!name) return [`${GREY}Usage: cat <file>${R}`]
      const file = FILES[name]
      if (!file) return [`${GREY}cat: ${name}: No such file${R}`]
      return ['', ...file(), '']
    },
  },

  pwd: {
    description: 'Print the working directory',
    run: () => [`/home/manoj/portfolio`],
  },

  echo: {
    usage: 'echo <text>',
    description: 'Echo a string back',
    run: (ctx, args) => [args.join(' ')],
  },

  date: {
    description: 'Show the current date and time',
    run: () => [new Date().toString()],
  },

  history: {
    description: 'Show this session’s command history',
    run: (ctx) => (ctx.history.length ? ctx.history.map((h, i) => `  ${GREY}${String(i + 1).padStart(3)}${R}  ${h}`) : [`${GREY}No history yet.${R}`]),
  },

  neofetch: {
    description: 'System info, portfolio edition',
    run: () => {
      const art = [
        ORANGE + '  +-------------------+' + R,
        ORANGE + '  | o  o  o           |' + R,
        ORANGE + '  +-------------------+' + R,
        ORANGE + '  |                   |' + R,
        ORANGE + '  |  manoj@portfolio  |' + R,
        ORANGE + '  |  >_               |' + R,
        ORANGE + '  |                   |' + R,
        ORANGE + '  |                   |' + R,
        ORANGE + '  +-------------------+' + R,
      ]
      const info = [
        `${B}manoj${R}${D}@${R}${B}portfolio${R}`,
        `${GREY}───────────────────────${R}`,
        `${ORANGE}Role${R}     ${PROFILE.role}`,
        `${ORANGE}Studying${R} B.Tech CSE, MLRIT (III yr)`,
        `${ORANGE}Stack${R}    FastAPI · Postgres · Next.js`,
        `${ORANGE}Shipped${R}  3 live products`,
        `${ORANGE}Host${R}     ${navigator.platform ?? 'web'}`,
        `${ORANGE}Shell${R}    manoj-sh 1.0`,
        `${ORANGE}Theme${R}    ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'}`,
      ]
      const rows = Math.max(art.length, info.length)
      return ['', ...Array.from({ length: rows }, (_, i) => `${art[i] ?? ' '.repeat(23)}   ${info[i] ?? ''}`), '']
    },
  },

  banner: {
    description: 'Reprint the welcome banner',
    run: () => BANNER,
  },

  gesture: {
    description: 'Open the hand-gesture tutorial',
    run: (ctx) => {
      ctx.openGestureTutorial()
      return [`${GREEN}Opening gesture tutorial…${R}`]
    },
  },

  handsfree: {
    description: 'Turn on camera hand + head control',
    run: (ctx) => {
      ctx.openHandsfree()
      return [`${GREEN}Requesting camera…${R} ${GREY}Nothing leaves your device.${R}`]
    },
  },

  matrix: {
    description: 'It had to be here',
    run: (ctx) => {
      ctx.startMatrix()
      return [`${GREEN}Wake up, Neo…${R} ${GREY}(click or press Esc to stop)${R}`]
    },
  },

  sudo: {
    usage: 'sudo <anything>',
    description: 'Attempt to elevate privileges',
    run: (ctx, args) => [
      `${GREY}[sudo] password for visitor:${R}`,
      '',
      `${ORANGE}visitor is not in the sudoers file. This incident has been reported.${R}`,
      args.length ? `${D}(…to ${EMAIL})${R}` : '',
    ],
  },

  ai: {
    usage: 'ai <question>',
    description: 'Ask about my work — answers from a local index',
    run: async (ctx, args) => {
      const q = args.join(' ').trim()
      if (!q) return ['', `${GREY}Ask me something: ${ORANGE}ai what did you build for BunkMax?${R}`, '']
      ctx.setBusy(true)
      try {
        const lines = await aiAnswer(q)
        return ['', ...lines, '']
      } finally {
        ctx.setBusy(false)
      }
    },
  },

  clear: {
    description: 'Clear the screen',
    run: (ctx) => {
      ctx.clear()
      return []
    },
  },

  exit: {
    description: 'Close this terminal',
    run: (ctx) => {
      setTimeout(ctx.close, 220)
      return [`${GREY}Bye.${R}`]
    },
  },

  vim: { hidden: true, description: '', run: () => [`${GREY}Nice try. ${ORANGE}:q!${R}`] },
  rm: { hidden: true, description: '', run: () => [`${GREY}rm: this portfolio is read-only.${R}`] },
}

export { BANNER, SECTIONS }
export const COMMAND_NAMES = Object.keys(COMMANDS).filter((k) => !COMMANDS[k].hidden)
