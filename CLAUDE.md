# CLAUDE.md

EXOARCHIVE (formerly "Abandoned // Not Forgotten"). NASA Space Apps 2026 project (Bangladesh local event): an interactive space-archaeology museum of
hardware left on the Moon and Mars. React 19 + Vite 8 + Tailwind v4 + Three.js, Express for production.

## Read first
- `README.md` has the code map, section table, data model and known issues. Use it instead of
  re-reading every component.
- `docs/BUILD_GUIDE.md` has the phased plan and which phase we are in.

## Commands
- `bun run dev`: dev server on :3000
- `bun run lint`: type check (must pass)
- `bun run build`: production build (must pass before any commit)

## Non-negotiables
- Offline-first: every live NASA call goes through the server cache with a fixture fallback, and the
  UI shows its source (`LIVE` / `CACHED` / `OFFLINE`). Support `OFFLINE=1`.
- Deterministic numbers (distances, light-time, day counts, sols) live in pure, tested functions,
  never produced by a model.
- Every fact or number shown should carry a source URL. Do not invent data.
- Apache-2.0, public repo, no images of people under 18.
- Record AI tool use in `docs/AI_USE.md`.

## Style
- Colours, fonts, radii and easing are tokens in `src/index.css` (see README "Design tokens"). Use the
  token classes (`bg-page`, `text-fg-2`, `border-line`, `accent` …), not new hex values. One accent
  (rust), no glows, gradients, tracked uppercase or bold weights; sentence case everywhere.
  Two team-requested exceptions: the violet `state-*` tokens (Status list) and the `journey` progress
  colour (blue light / green dark), and the quiz's `ok` / `bad` (green / red) answer colours; see README "Brand".
- Catalogue card copy is the artifact's `hook` (en + bn): facts from its own dossier only, no clamp.
- Every interactive click plays `spaceAudio.playTelemetryPing(freq, duration)` (silent until the visitor turns sound on).
- Both themes must pass AA: dark stages use `bg-ink` (or `.theme-dark`), which keeps dark tokens in light theme.
- Respect `prefers-reduced-motion` for any new animation.
