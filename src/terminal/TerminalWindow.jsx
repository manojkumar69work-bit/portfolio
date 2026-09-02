import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { useEffect, useRef } from 'react'

import { BANNER, COMMANDS, COMMAND_NAMES } from './commands.js'

const PROMPT = '\x1b[38;2;240;115;45mmanoj\x1b[0m\x1b[2m@\x1b[0m\x1b[38;2;86;182;194mportfolio\x1b[0m\x1b[2m:~$\x1b[0m '
const PROMPT_LEN = 'manoj@portfolio:~$ '.length

const THEMES = {
  light: {
    background: '#fffaf7',
    foreground: '#2b2b30',
    cursor: '#f0732d',
    cursorAccent: '#fffaf7',
    selectionBackground: '#ffd9c2',
    black: '#2b2b30',
    brightBlack: '#8b8b94',
  },
  dark: {
    background: '#0d0b14',
    foreground: '#e8e6ef',
    cursor: '#f0732d',
    cursorAccent: '#0d0b14',
    selectionBackground: '#4a2a1a',
    black: '#0d0b14',
    brightBlack: '#8b8b94',
  },
}

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark'

/* xterm.js host. All line editing (history, tab completion, cursor
   movement) is handled here — there is no pty behind it. */
export default function TerminalWindow({ hooks }) {
  const hostRef = useRef(null)
  const termRef = useRef(null)
  const stateRef = useRef({ buffer: '', cursor: 0, history: [], historyIndex: -1, busy: false })
  const hooksRef = useRef(hooks)
  hooksRef.current = hooks

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const term = new Terminal({
      convertEol: true,
      cursorBlink: true,
      fontSize: 13,
      fontFamily: '"SFMono-Regular", "JetBrains Mono", Menlo, Consolas, monospace',
      lineHeight: 1.35,
      letterSpacing: 0.2,
      theme: isDark() ? THEMES.dark : THEMES.light,
      allowProposedApi: true,
      scrollback: 2000,
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(host)
    termRef.current = term

    const safeFit = () => {
      try {
        fit.fit()
      } catch {
        /* container not laid out yet */
      }
    }
    requestAnimationFrame(safeFit)

    const state = stateRef.current
    const writeLines = (lines) => {
      for (const line of lines) term.write(`${line}\r\n`)
    }

    const prompt = () => {
      state.buffer = ''
      state.cursor = 0
      term.write(`\r\n${PROMPT}`)
    }

    const redraw = () => {
      term.write('\x1b[2K\r')
      term.write(PROMPT + state.buffer)
      const back = state.buffer.length - state.cursor
      if (back > 0) term.write(`\x1b[${back}D`)
    }

    const ctx = {
      write: (line) => term.write(`${line}\r\n`),
      clear: () => term.write('\x1b[2J\x1b[3J\x1b[H'),
      close: () => hooksRef.current.close(),
      navigate: (id) => hooksRef.current.navigate(id),
      setTheme: (next) => hooksRef.current.setTheme(next),
      openProject: (p) => hooksRef.current.openProject(p),
      openGestureTutorial: () => hooksRef.current.openGestureTutorial(),
      openHandsfree: () => hooksRef.current.openHandsfree(),
      startMatrix: () => hooksRef.current.startMatrix(),
      setBusy: (v) => {
        state.busy = v
      },
      get history() {
        return state.history
      },
    }

    const run = async (raw) => {
      const input = raw.trim()
      if (!input) {
        prompt()
        return
      }
      state.history.push(input)
      state.historyIndex = state.history.length

      const [name, ...args] = input.split(/\s+/)
      const command = COMMANDS[name.toLowerCase()]
      term.write('\r\n')

      if (!command) {
        const guess = COMMAND_NAMES.find((c) => c.startsWith(name.slice(0, 2).toLowerCase()))
        writeLines([
          `\x1b[38;2;140;140;150mcommand not found: ${name}\x1b[0m`,
          guess ? `\x1b[2mDid you mean \x1b[0m\x1b[38;2;240;115;45m${guess}\x1b[0m\x1b[2m? Type \x1b[0m\x1b[38;2;240;115;45mhelp\x1b[0m\x1b[2m for the full list.\x1b[0m` : '',
        ])
        prompt()
        return
      }

      let spinner = null
      try {
        const result = command.run(ctx, args)
        if (result instanceof Promise) {
          const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
          let i = 0
          spinner = setInterval(() => {
            term.write(`\x1b[2K\r\x1b[38;2;240;115;45m${frames[i++ % frames.length]}\x1b[0m \x1b[2mthinking…\x1b[0m`)
          }, 80)
          const lines = await result
          clearInterval(spinner)
          spinner = null
          term.write('\x1b[2K\r')
          writeLines(lines)
        } else {
          writeLines(result)
        }
      } catch (error) {
        if (spinner) clearInterval(spinner)
        writeLines([`\x1b[38;2;220;90;90m${error?.message ?? 'command failed'}\x1b[0m`])
      }
      prompt()
    }

    const complete = () => {
      const parts = state.buffer.split(/\s+/)
      if (parts.length > 1) return
      const matches = COMMAND_NAMES.filter((c) => c.startsWith(parts[0]))
      if (matches.length === 0) return
      if (matches.length === 1) {
        state.buffer = `${matches[0]} `
        state.cursor = state.buffer.length
        redraw()
        return
      }
      term.write(`\r\n  ${matches.join('   ')}\r\n`)
      term.write(PROMPT + state.buffer)
    }

    const onData = term.onData((data) => {
      if (state.busy) return

      if (data === '\r') {
        void run(state.buffer)
        return
      }
      if (data === '\x7f') {
        if (state.cursor > 0) {
          state.buffer = state.buffer.slice(0, state.cursor - 1) + state.buffer.slice(state.cursor)
          state.cursor -= 1
          redraw()
        }
        return
      }
      if (data === '\t') {
        complete()
        return
      }
      if (data === '\x03') {
        term.write('^C')
        prompt()
        return
      }
      if (data === '\x0c') {
        ctx.clear()
        term.write(PROMPT + state.buffer)
        return
      }
      if (data === '\x1b[A' || data === '\x1b[B') {
        if (state.history.length === 0) return
        state.historyIndex = Math.min(
          Math.max(state.historyIndex + (data === '\x1b[A' ? -1 : 1), 0),
          state.history.length
        )
        state.buffer = state.history[state.historyIndex] ?? ''
        state.cursor = state.buffer.length
        redraw()
        return
      }
      if (data === '\x1b[D') {
        if (state.cursor > 0) {
          state.cursor -= 1
          term.write('\x1b[1D')
        }
        return
      }
      if (data === '\x1b[C') {
        if (state.cursor < state.buffer.length) {
          state.cursor += 1
          term.write('\x1b[1C')
        }
        return
      }
      if (data === '\x1b[H' || data === '\x1b[F') {
        state.cursor = data === '\x1b[H' ? 0 : state.buffer.length
        redraw()
        return
      }
      // Ignore any other control sequence.
      if (data.charCodeAt(0) < 32 || data === '\x1b') return

      state.buffer = state.buffer.slice(0, state.cursor) + data + state.buffer.slice(state.cursor)
      state.cursor += data.length
      redraw()
    })

    writeLines(BANNER)
    writeLines([
      `  \x1b[2mType \x1b[0m\x1b[38;2;240;115;45mhelp\x1b[0m\x1b[2m to begin, or \x1b[0m\x1b[38;2;240;115;45mai <question>\x1b[0m\x1b[2m to ask about my work.\x1b[0m`,
      `  \x1b[2mCtrl+J closes this window.\x1b[0m`,
    ])
    term.write(`\r\n${PROMPT}`)
    setTimeout(() => term.focus(), 60)

    const observer = new ResizeObserver(safeFit)
    observer.observe(host)

    const themeWatcher = new MutationObserver(() => {
      term.options.theme = isDark() ? THEMES.dark : THEMES.light
    })
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      onData.dispose()
      observer.disconnect()
      themeWatcher.disconnect()
      term.dispose()
      termRef.current = null
    }
  }, [])

  return (
    <div className="terminal-window">
      <div className="terminal-body" ref={hostRef} onClick={() => termRef.current?.focus()}>
        <div className="xterm-container" />
      </div>
    </div>
  )
}

export { PROMPT_LEN }
