# manoj-kumarrr.vercel.app

My portfolio. A normal scrolling page with a full desktop OS layered on top of it —
draggable windows, a magnifying dock, an xterm terminal, and an optional webcam mode
that turns your hand into the cursor.

**Live:** https://manoj-kumarrr.vercel.app

---

## What's in it

**The page.** Hero → skills → work → a scroll-driven 3D journey → stats → experience →
contact. Motion drives the section transitions; GSAP drives the horizontal journey
scrubber; Three.js and React Three Fiber render the 3D scenes behind it.

**The desktop layer.** A window manager (`src/windows/`) with drag, resize from any edge,
maximise, minimise-to-dock and a macOS-style dock with Gaussian cursor magnification.
Project cards open as real windows with live thumbnails in the dock.

**The terminal.** An xterm.js window with 31 commands — `help`, `about`, `projects`,
`open <project>`, `experience`, `skills`, `theme`, `neofetch`, a small virtual filesystem
for `ls`/`cat`, and an `ai` command backed by a local retrieval index. There's no pty:
line editing, tab completion, history and cursor movement are all implemented in
`src/terminal/TerminalWindow.jsx`. Commands themselves are a pure
`(ctx, args) => string[]` layer with no React imports. `Ctrl/Cmd+J` toggles it.

**Gesture control.** Opt-in, on-device hand and face tracking via MediaPipe
(`src/gesture/`). Point to move the cursor, pinch to click, make a fist and move to
scroll, tilt your head to scroll slowly. Clicks are synthesised as real pointer events,
so pinching works on dock tiles, window controls and links alike. Nothing touches the
camera until you explicitly enable it.

---

## Running it

```bash
npm install
npm run dev      # vite dev server
npm run build    # production build
npm run preview  # serve the build
npm run lint     # oxlint
```

Requires Node 20+.

Optional: set `VITE_AI_ENDPOINT` to point the terminal's `ai` command at a real LLM
endpoint (`POST {question}` → `{answer}`). Without it, the command falls back to the
local keyword index in `src/terminal/knowledge.js`.

---

## Layout

```
src/
  data.js              all site content — profile, skills, projects, experience, stats
  App.jsx              composition; wires sections, windows, terminal and gestures
  components/          page sections, horizontal scroller, cursor, matrix easter egg
  windows/             window manager, draggable window chrome, dock
  terminal/            xterm host, command definitions, ai knowledge index
  gesture/             MediaPipe provider, loader, tutorial, camera preview
  three/               R3F canvas and the four journey scenes
```

`src/data.js` is the single source of truth for content — the page and the terminal both
read from it, so a change shows up in both.

---

## Performance notes

Three.js, xterm and MediaPipe are all lazy-loaded and split into their own chunks
(`vite.config.js`), so none of them are in the entry bundle. The 3D journey only mounts
when it scrolls into view and WebGL is actually available — `src/three/CanvasBoundary.jsx`
degrades to a static fallback rather than taking the page down with it.

---

## Stack

React 19 · Vite · Motion · GSAP · Three.js + React Three Fiber · xterm.js ·
MediaPipe Tasks Vision · hand-written CSS
