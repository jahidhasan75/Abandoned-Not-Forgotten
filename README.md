# EXOARCHIVE

*Abandoned, not forgotten.*

An interactive space-archaeology museum for the **NASA Space Apps Challenge 2026**. It tells the story of the
machines humanity left on the Moon and Mars: where each one rests, what it discovered, why it was left behind,
and what it still teaches us.

> Status (7 Nov 2026, v0.8.0): 20 catalogued objects (landers, rovers, entry hardware, an impact site, an aircraft) on real NASA basemaps. Includes 3D Earth, Moon
> and Mars globes built from NASA Trek and GIBS mosaics, a year-filtered map, and a citation trail
> (NSSDCA, PDS, NTRS, NASA Image Library) for every object, an English/Bangla toggle, and live NASA
> data (rovers, JPL Horizons) with cache and offline fallback. Every image is a real NASA photo. v0.7.0.
> Submission drafts: [docs/SUBMISSION.md](docs/SUBMISSION.md). See [Roadmap](#roadmap) and
> [docs/BUILD_GUIDE.md](docs/BUILD_GUIDE.md).

---

## Quick start

```bash
bun install          # or: npm install
bun run dev          # Vite dev server on http://localhost:3000
bun run lint         # tsc --noEmit (type check only)
bun run build        # vite build -> dist/, and bundles server.ts -> server.js
node server.js       # serve dist/ in production (Express, /health endpoint)
```

Requires Node 22+ (tested on Node 24, Bun 1.4). No API keys are needed today.

---

## Live data (offline-first, no backend)

| Value | Source (called from the browser, no key) | Cache | Where shown |
|---|---|---|---|
| Curiosity / Perseverance latest sol and raw image | mars.nasa.gov raw-image feeds | 1 h | "Still Talking" band, rover dossiers |
| Earth–Moon / Earth–Mars range and range-rate | JPL Horizons API (`QUANTITIES=20`) | 10 / 30 min | band, every dossier ("radio signal would take …") |
| Astronomy Picture of the Day | api.nasa.gov APOD (`VITE_NASA_API_KEY`, default `DEMO_KEY`) | 12 h | band; hidden while the API returns placeholder data (as on 7 Nov 2026) |
| Days since last contact / since landing | computed locally from `leftBehind` / `lastContact` | — | every dossier |

- `src/lib/live/live.ts` `liveFetch()`: **live → browser cache (localStorage `anf-live:*`) → committed
  fixture**. The result's `source` is always rendered by `SourceBadge` as LIVE / CACHED · age /
  OFFLINE COPY · date.
- **Offline demo:** open the site with `?offline=1` (or build with `VITE_OFFLINE=1`); nothing calls
  NASA, everything comes from `src/data/fixtures/live.json` and `public/data/fixtures/*.jpg`.
- **Before the demo:** `bun run fetch:fixtures` refreshes the fixtures (and downloads the latest
  rover images).
- `src/lib/compute.ts`: deterministic helpers (AU→km, light-time, days since, Horizons parser), tested
  in `src/lib/compute.test.ts` (`bun test`, 13 tests). No number on screen is produced any other way.
- `src/lib/live/useLive.ts`: one request per key per page load, shared across components. The live
  band starts fetching when it nears the screen (or after 4 s as a fallback).

## Languages (English / বাংলা)

- Toggle in the navbar (`Languages` icon). The choice is saved in `localStorage` (`anf-lang`) and
  sets `<html lang>`.
- `src/i18n/I18nProvider.tsx` provides `useI18n()` → `t(key, vars)` for UI strings,
  `tx(artifact, field)` and `txScience(artifact)` for artifact text.
- UI strings: `src/data/strings.json` (`en` and `bn` tables, same keys, `{placeholders}`).
- Artifact text in Bangla: `src/data/artifacts.bn.json`, keyed by artifact id (role, statusDescription,
  story, whyLeftBehind, imageCaption, locationName, scienceContribution). Missing fields fall back to
  English.
- Font: Hind Siliguri (Google Fonts) is a fallback in every font stack. `:lang(bn)` rules in `index.css`
  relax letter-spacing and line-height for Bangla.
- Still English in Bangla mode: subsystems, trivia, and the body content of One Machine Journey,
  What Did It Teach Us, Hardware Anatomy, Why Leave It Behind, Did You Know, and the quiz (their section
  titles and intros are translated). The dossier shows a note about this.
- To add a string: add the key to both `en` and `bn` in `strings.json`, then call `t('your.key')`.

## Data pipeline (all scripts are re-runnable)

| Command | What it does | Output |
|---|---|---|
| `bun run export:data` | Exports the curated objects in the challenge record format (id, name, mission, body, lat, lon, left_behind, last_contact, why_left, science_enabled, image, image_credit, source_url, dataset_id, plus pds_lid, ntrs_id, sources) | `public/data/objects.geojson` (downloadable from the site) |
| `bun run fetch:fixtures` | Fetches the latest rover images, Moon/Mars range and APOD for the offline demo | `src/data/fixtures/live.json`, `public/data/fixtures/*.jpg` |
| `bun test` | Unit tests for the science helpers | — |
| `bun run parse:pds` | Parses the local LROC PDS3 catalog files in `data/pds/lroc/` | `src/data/pdsCatalog.json` |
| `bun run build:textures` | Downloads Moon Trek (LRO LROC WAC), Mars Trek (Viking MDIM 2.1) and GIBS Blue Marble tiles, and stitches them into equirectangular textures (tiles cached in `.tile-cache/`) | `src/assets/textures/{earth,moon,mars}_{4k,2k}.webp` |

Source of truth for object data: `src/data/missionsData.ts`. Re-run `export:data` after editing it.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript, single page, no router |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`), custom classes in `src/index.css` |
| 3D | Three.js (only in `Timeline3D.tsx`) |
| Icons | lucide-react |
| Audio | Web Audio API, procedurally synthesised (`src/utils/audio.ts`), no audio files |
| Build | Vite 8 |
| Prod server | Express (`server.ts`, compiled to `server.js`) serving `dist/` with SPA fallback |

---

## Code map (read this before opening files)

All app code is in `src/` (about 5,600 lines). Each section of the page is one self-contained component.
Most components hold their own content in a constant at the top of the file.

```
src/
├─ main.tsx                    mounts <App/>
├─ App.tsx                     page order, shared state, scroll-progress bar
├─ index.css                   Tailwind import, fonts, glow/scanline helper classes
├─ types/mission.ts            MissionArtifact, ConstellationNode/Link, QuizQuestion types
├─ data/missionsData.ts        THE DATA: MISSIONS_DATA (10 artifacts), CONSTELLATION_NODES/LINKS,
│                              QUIZ_QUESTIONS (5, no longer shown), WHY_LEAVE_IT_REASONS (4)
├─ assets/images.ts            ASSET_IMAGES map -> 5 illustrative WebP images in src/assets/images/
├─ utils/audio.ts              spaceAudio singleton: ambient Moon/Mars soundscapes, Quindar tone, UI pings
└─ components/                 one file per page section (order = App.tsx order)
```

### Shared state (App.tsx)

| State | Type | Used by |
|---|---|---|
| `activePlanet` | `'MOON' \| 'MARS'` (default `MARS`) | Navbar, PlanetSelector, ArchaeologyMap, MachineCards (initial only), SoundscapeController |
| `selectedArtifact` | `MissionArtifact \| null` | Opens `MachineDetailModal`; set from Map, Timeline3D, MachineCards, StatusSystem, Archive |
| `scrollProgress` | number 0-100 | Gradient bar at top of page |

### Page sections, in render order

| # | Component | Anchor id | What it does | Content source |
|---|---|---|---|---|
| 1 | `Navbar` | — | Fixed header, nav links, Moon/Mars switch, audio toggle, mobile drawer | inline |
| 2 | `Hero` | `hero` | Canvas starfield, headline, 2 CTAs, 4 stat tiles | inline |
| 3 | `PlanetSelector` + `PlanetGlobe` | `explore` | 3D Earth/Moon/Mars globes on real NASA mosaics; camera flies between worlds; markers at catalogued lat/lon; site list; click opens dossier. Launches Earth → active planet once visible and loaded. | `MISSIONS_DATA`, textures |
| 4 | `ArchaeologyMap` | `archaeology-map` | Markers on the real equirectangular Moon/Mars mosaic with a 15° graticule; year scrubber (with play) filters by `leftBehind`; side dossier panel | `MISSIONS_DATA`, textures |
| 5 | `Timeline3D` | `timeline-3d` | Three.js fly-through of missions by year, auto-cruise | `MISSIONS_DATA` |
| 6 | `MachineCards` | `machines` | Filterable card grid | `MISSIONS_DATA` |
| 7 | `StatusSystem` | — | 5 status tabs (ACTIVE/SILENT/INACTIVE/LOST/HISTORIC) + matching artifacts | inline + `MISSIONS_DATA` |
| 8 | `OneMachineJourney` | `journey` | 6-step biography of Sojourner, Opportunity, InSight or Ingenuity (en + bn), with that object's sources and a dossier link | `src/data/journeys.ts` |
| 10 | `BeforeAfterSlider` | — | Drag slider: InSight's first selfie (2018, PIA22876) vs final selfie (2022, PIA25287) | `ASSET_IMAGES` |
| 11 | `ScienceConstellation` | `science` | SVG graph linking 17 machines to 9 themes (en + bn, keyboard-operable); a machine node opens its dossier | `CONSTELLATION_*` in `missionsData.ts` |
| 14 | `ArchaeologyArchive` | `archive` | Searchable, filterable table of all artifacts | `MISSIONS_DATA` |
| 14b | `DataSources` | `data-sources` | Every NASA dataset and what it is used for; featured LROC dataset read from the local PDS catalog; GeoJSON download | `pdsCatalog.json`, `MISSIONS_DATA` |
| 16 | `YoungExplorers` | `explorers` | Mission quiz (the 50-question `QuizPanel`), Match-the-Machine, Build-a-Mission (lists real archive machines like your design), For teachers (`TeacherKit`) — all en + bn | `src/data/quiz.ts` + `strings.json` |
| 16c | `MatchGame` (the Match the machine tab) | — | 4 pairs per round from a bank of 15 (each a fact from that machine's dossier, en + bn); a pair seen in the last 2 rounds is not picked again (`exoarchive-match-history`); confetti and dossier links when a round is done | `src/data/matchPairs.ts`, `pickRound` from `src/lib/quizPick.ts` |
| 16b | `TeacherKit` (the For teachers tab) | — | 45-minute lesson plan, learning goals, a printable 10-question worksheet with answer key (`#print-root`, print CSS in `index.css`), how to share a dossier link | `src/data/quiz.ts` |
| 16a | `QuizPanel` (the Mission quiz tab inside `YoungExplorers`) | `quiz` | 5 questions per round from a bank of 50 (en + bn); a question does not return for the next 5 rounds (history in `localStorage`, `exoarchive-quiz-history`); each answer links to its dossier | `src/data/quiz.ts`, `src/lib/quizPick.ts` (tested) |
| 17 | `Footer` | — | Closing message, data accuracy notice | inline |
| — | `MachineDetailModal` | — | Full dossier dialog (Esc to close) | the selected artifact |
| — | `SoundscapeController` | — | Fixed bottom-right audio widget with live waveform | `spaceAudio` |

### Artifact catalogue (`MISSIONS_DATA`)

| id | Name | Dest. | Landed | Status | NSSDCA | Photo |
|---|---|---|---|---|---|---|
| `sojourner` | Sojourner Rover | Mars | 1997 | SILENT | 1996-068A | PIA04318 |
| `opportunity` | Opportunity Rover (MER-B) | Mars | 2004 | SILENT | 2003-032A | PIA17759 |
| `spirit` | Spirit Rover (MER-A) | Mars | 2004 | SILENT | 2003-027A | PIA11804 |
| `phoenix` | Phoenix Mars Lander | Mars | 2008 | SILENT | 2007-034A | PIA10793 |
| `insight` | InSight Lander | Mars | 2018 | SILENT | 2018-042A | PIA25287 |
| `viking1` | Viking 1 Lander | Mars | 1976 | HISTORIC | 1975-075C | PIA00563 |
| `curiosity` | Curiosity Rover | Mars | 2012 | ACTIVE | 2011-070A | PIA24173 |
| `perseverance` | Perseverance Rover | Mars | 2021 | ACTIVE | 2020-052A | PIA24542 |
| `mars-polar-lander` | Mars Polar Lander | Mars | 1999 | LOST | 1999-001A | KSC-98pc1212 |
| `viking2` | Viking 2 Lander | Mars | 1976 | SILENT | 1975-083C | PIA00571 |
| `opportunity-heatshield` | Opportunity's Heat Shield (entry hardware) | Mars | 2004 | HISTORIC | 2003-032A | PIA07223 |
| `perseverance-backshell` | Perseverance's Backshell and Parachute (entry hardware) | Mars | 2021 | HISTORIC | 2020-052A | PIA25219 |
| `ingenuity` | Ingenuity Mars Helicopter (aircraft) | Mars | 2021 (final flight 2024) | INACTIVE | 2020-052A | PIA26237 |
| `apollo17-challenger` | Apollo 17 Challenger Descent Stage and Rover | Moon | 1972 | HISTORIC | 1972-096C | as17-134-20382 (orbit: PIA12920) |
| `apollo14-sivb` | Apollo 14 S-IVB Impact Crater (impact site) | Moon | 1971 | HISTORIC | 1971-008B | PIA12911 |
| `apollo11-descent` | Apollo 11 LM Descent Stage | Moon | 1969 | HISTORIC | 1969-059C | as11-40-5902 |
| `apollo11-lrrr` | Apollo 11 Laser Ranging Retroreflector | Moon | 1969 | ACTIVE | 1969-059C | as11-40-5948 |
| `apollo15-lrv` | Lunar Roving Vehicle 1 | Moon | 1971 | HISTORIC | 1971-063C | as15-86-11602 |
| `alsep-instruments` | Apollo ALSEP Science Stations | Moon | 1969 | INACTIVE | 1969-099C | as12-47-6918 |
| `surveyor3` | Surveyor 3 Robot Lander | Moon | 1967 | HISTORIC | 1967-035A | AS12-48-7133 |

Every artifact carries `image` (local WebP in `src/assets/images/nasa/`), `imageNasaId`, `nssdcId`
and `sources[]` (built with the `nssdc()` and `nasaImage()` helpers at the top of
`missionsData.ts`). The dossier modal lists the sources. `shortName` is the map-marker label.
Categories: ROVER, LANDER, INSTRUMENT, HISTORIC_SITE, ENTRY_HARDWARE, IMPACT_SITE, AIRCRAFT
("Discarded parts" filter = entry hardware + impact sites). Positions marked "approximate" (heat shield,
backshell, Ingenuity) have no catalogue coordinates and use the nearest catalogued landing site.
Status colours come from `src/data/status.ts` (`STATUS_COLORS`), and the status word is always shown
beside the colour. All NSSDCA ids were checked against the catalogue on 7 Nov 2026, and
landing coordinates for Pathfinder, Viking 1, Apollo 11 and Apollo 12 match NSSDCA.

To add an artifact: add one object to `MISSIONS_DATA` that matches `MissionArtifact` in `types/mission.ts`.
Map, timeline, cards, status, archive and modal all pick it up automatically. Constellation nodes,
journeys, facts and quiz are separate lists and must be edited by hand.

### Design tokens (`@theme` in `src/index.css`)

Direction: archival, exact, quietly elegiac (museum object labels, NASA mission reports). The only
rich colour is in the globes, the map and the dossier photos. Use the Tailwind classes, not raw hex.

| Class | Value | Meaning |
|---|---|---|
| `bg-ink` | `#07080d` | deepest: map, globe and timeline stages, image wells |
| `bg-page` | `#0b0d14` | page |
| `bg-card` | `#11141c` | cards, panels, modal |
| `bg-raised` | `#1a1e28` | hover and active surfaces |
| `text-fg` / `text-fg-2` / `text-fg-3` | `#eef0f5` / `#a3a9b8` / `#7a8296` | primary / secondary / muted text. `fg-3` fails on `raised` (4.33:1), so use `fg-2` there |
| `border-line` / `border-line-strong` | text at 8% / 16% | hairlines (no shadows, no glows) |
| `accent` | `#d0704a` | the one accent (5.6:1 on page): current selection, active nav underline, one key figure. Dark text on it, never white (3.4:1) |
| status dots | `src/data/status.ts` | status dots only, always with the status word |

Radius: buttons 8, cards 12, panels and modal 16. Motion: one easing `cubic-bezier(0.22, 1, 0.36, 1)`,
150 ms colour/opacity/transform transitions, no looping animation except the LIVE dot in `SourceBadge`.
Shared classes: `.btn-primary` (off-white, dark text), `.btn-secondary`, `.section-label`,
`.catalogue-tag`.

Signature: every object carries a mono catalogue tag, `ARCH/MOON/001 · 0.67416° N 23.47314° E · 1969 → 1969`,
from `src/components/CatalogueTag.tsx` (cards, map panel, globe list, timeline card, dossier).

Fonts (Google Fonts in `index.html`): Newsreader (h1/h2 and display headings, 400–500, sentence case),
Public Sans (interface; the US government's open typeface), IBM Plex Mono (`.font-mono-data`,
`.catalogue-tag`: figures, coordinates, IDs, with tabular numbers). Bangla: Hind Siliguri in the sans and
mono stacks, Noto Serif Bengali in the serif stack, so Bangla headlines are serif too. Every click calls
`spaceAudio.playTelemetryPing(freq, dur)`; it is silent until the visitor turns sound on (one switch
for the ambient sound and the clicks).

**Light theme.** `:root[data-theme='light']` re-values the same tokens (paper `#f3f1ea`, ink text
`#15171d`, accent `#9a4a27`; all text pairs checked for AA). The header, the hero photo and every
`bg-ink` stage (globes, map, timeline, constellation) stay dark in both themes: `.theme-dark` and
`[data-theme='light'] .bg-ink` bring the dark values back inside them. The toggle is in the header
(`src/lib/theme.ts`); the choice is stored in `localStorage` (`exoarchive-theme`), otherwise the system
setting decides, and `index.html` applies it before the first paint.

**Brand.** Logo: `src/assets/brand/exoarchive-logo.webp` (the team's EXOARCHIVE wordmark, black
background removed). Header background: `src/assets/brand/header-earth-limb.webp`, a thin band
cropped from the team's Earth-limb artwork (not a NASA photograph; the footer says so), under a neutral
scrim so the menu stays readable. The hero is a split page: text on
the page colour (so it follows the theme) and two photo plates from the archive, Apollo 15's rover
(AS15-86-11602) and Curiosity (PIA24173); each plate opens that object's dossier. Light theme: the map
section uses `bg-deep` (ink in dark, a deeper paper in light); only the map well itself stays dark.

**Two team-requested colour exceptions** (outside the one-accent rule, both tokens in both themes):
`state-sel` / `state-hover` / `state-bar` take the team's violet palette (#0E0B1D to #C9C2E3) for the
chosen row in the Status list (selected #2A1E4D with a #8B7CC7 bar in dark, #C9C2E3 with a #5A3B8C bar
in light). `journey` is the scroll progress light on the "One machine, one journey" timeline: green
(#4ade80) in dark, blue (#2563eb) in light; it runs down the line as the middle of the screen passes
each stage (`OneMachineJourney.tsx`).

**Catalogue cards** show `hook` (en in `missionsData.ts`, bn in `artifacts.bn.json`): one or two
complete sentences built only from facts already in that artifact's dossier, never clamped. Cards lift
2 px on hover. Live tiles are clickable: rover tiles open their dossier, the Moon and Mars tiles open a
detail dialog with the photo, the three numbers and how each is worked out.

---

## Polish done in v0.2.0 (7 Nov 2026)

- **Timeline3D:** the scene is built once and the render loop reads refs, so changing missions just
  glides the camera. All geometries are disposed, it renders only while on screen, uses `THREE.Timer`,
  has a WebGL fallback, and is lazy-loaded in its own chunk (initial JS 952 kB → 405 kB).
- **Motion system in `index.css`:** `animate-fadeIn`, `animate-shake`, `animate-modalIn`,
  `animate-backdropIn`, and a CSS scroll-driven section reveal (`animation-timeline: view()`). All
  motion is disabled under `prefers-reduced-motion`.
- **Scroll progress bar** is its own component and writes to the DOM, so scrolling no longer
  re-renders the whole app.
- **Navbar:** links show from 1280 px (`xl`), with a hamburger below that. The active section is
  highlighted (IntersectionObserver). On phones the Moon/Mars switch moves into the drawer. Esc closes
  the drawer.
- **Modal:** closes on a backdrop click, traps focus, restores focus and scroll, has an open
  animation, and resets to the top for each artifact.
- **Before/After slider:** pointer events (mouse, touch, pen), click to jump, ← → / Shift / Home / End
  keys, `role="slider"`, and `clip-path` instead of a stale width calculation.
- **Audio:** no `AudioContext` before the first user click (`spaceAudio.peekAnalyser()`), and the
  waveform loop runs only while playing. The widget collapses to a small pill on phones.
- **Data and filters:** MachineCards follows the global planet switch, and "Landers" means the same
  thing in Cards and Archive.
- **Accessibility:** skip link, global `:focus-visible` ring, keyboard-operable cards and status
  items, `aria-current` / `aria-expanded` / `aria-pressed` where relevant.
- **Assets:** JPG → WebP (4.4 MB → 0.6 MB), lazy/async image loading, hero has `fetchPriority="high"`.
  Unused `public/assets/images` copies and the `@google/genai`, `motion` and `dotenv` dependencies
  were removed.
- **UI/UX Pro Max audit (WCAG 2.2):** rust text `#B85C38` → `#D0704A` (4.2:1 → 5.5:1 on cards; rust
  stays for backgrounds, borders and buttons). No text under 12 px (56 uses of 10–11 px raised to
  `text-xs`). Hand cursor on every button (Tailwind v4 removes it). Icon buttons are at least 32 px.
  `scroll-padding` keeps keyboard focus clear of the navbar and audio widget.
- **Housekeeping:** LICENSE (Apache-2.0), package name, `start` → `node server.js`, new
  `.env.example`, `CLAUDE.md`, `AGENTS.md`, `docs/AI_USE.md`.

## Known issues still open

Data and credibility
10. Markers that share a site are fanned out on the 2D map; the dossier keeps the true
    coordinates. On the 3D globe, Apollo 11's descent stage and retroreflector share one point.
11. Curiosity and Perseverance use their landing coordinates and fixed "5,000+ sols" style counts;
    live position and sol come in Phase 3.
12. (fixed) The constellation and "One Machine, One Journey" now include the newer artifacts.
16. Deep links: `#machine=<id>` opens that dossier, and the dossier has a Copy link button. Sections below
    the status list load as separate chunks right after first paint (main chunk 625 kB → 306 kB).
18. Quiz: right and wrong answers use the `ok` (green) and `bad` (red) tokens in both themes, the
    progress bar records each answer, and a perfect round gets a short confetti burst (off with reduced
    motion). Young Explorers keeps every tab mounted, so a round in progress survives a tab switch
    until the page is reloaded. The archive table shows 6 rows until "Show all" (a search shows all matches).
17. Check against the Apollo 12 mission report: the English Surveyor 3 story, hook and quiz say Apollo 12
    landed 160 m away, the Bangla story says 180 m.
13. Removed in v0.7.0: the AI-generated images (replaced by NASA photos), four unsourced sections (Hardware
    Anatomy, Why Leave It Behind, Did You Know, What Did It Teach Us), AI Studio leftovers, and several
    unverifiable claims and quotes.

Other
14. (removed) AI Studio leftovers are gone.
15. Every section has an anchor id. The page is about 15,300 px at 1280 px wide (was 17,600): the
    catalogue shows 6 cards and the data sources 5 rows until "Show all", and Three.js loads only when
    the 3D timeline is about a screen away.

---

## Live NASA data: what works (tested 6 Nov 2026)

| Source | Endpoint | Key | CORS | Use in this app |
|---|---|---|---|---|
| NASA Image & Video Library | `images-api.nasa.gov/search?q=...` | none | `*` | Real archival photos for each artifact (e.g. `as12-48-7121`, Surveyor 3 seen by Apollo 12) |
| Mars raw images, Curiosity | `mars.nasa.gov/api/v1/raw_image_items/?order=sol desc&condition_1=msl:mission` | none | `*` | ACTIVE status: latest sol and image (sol 5066 on test day) |
| Mars raw images, Perseverance | `mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json` | none | `*` | ACTIVE status: latest sol and image (sol 2031) |
| JPL Horizons | `ssd.jpl.nasa.gov/api/horizons.api` | none | yes | Live Earth to Moon/Mars distance and light-time |
| Solar System Treks tiles | `trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/...`, `trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/...` | none | `*` | Real Moon/Mars basemap for the archaeology map |
| NTRS | `ntrs.nasa.gov/api/citations/search?q=...` | none | no | Citations per artifact (needs a server proxy) |
| APOD | `api.nasa.gov/planetary/apod` | `DEMO_KEY` / key | yes | Returned HTTP 500 on test day, so it is unreliable |
| Mars Rover Photos | `api.nasa.gov/mars-photos/...` | — | — | **Dead (HTTP 404). Do not use.** Use the mars.nasa.gov raw image feeds instead. |

Rule (from the event build guide): the UI must keep working offline. Every live call needs a
cached or fixture fallback, and the UI should show whether a value is `live`, `cache` or `fixture`.

---

## Roadmap

See [docs/BUILD_GUIDE.md](docs/BUILD_GUIDE.md) for the step-by-step plan. Summary:

- ✅ **Phase 0. Hygiene** and ✅ **Phase 1. Polish:** done in v0.2.0 (see above).
- ✅ **Phase 2.5. NASA datasets + 3D:** done in v0.4.0. Data comes from Treks, GIBS, NSSDCA, PDS, NTRS and the
  local LROC PDS catalog; adds 3D globes, a real-basemap map, the year scrubber, Data Sources and
  `objects.geojson`.
- ✅ **Phase 2. Real NASA content:** done in v0.3.0: 14 real NASA photos, sources, 4 new artifacts
  (retroreflector, Curiosity, Perseverance, Mars Polar Lander), status colours, Viking 1 coordinates.
- **Phase 3. Live data layer:** `src/lib/nasa/` fetchers with a cache, fixture fallback and source badge,
  live rover sol feed, live Earth-Moon/Mars distance, Treks basemap on the archaeology map.
- **Phase 4. Submission:** offline demo mode, 240-second and 30-second videos, project page, public repo check.

---

## Data and credits

Mission facts are drawn from NASA JPL, NSSDCA, the Apollo Lunar Surface Journal and mission pages.
Every image is a public-domain NASA photograph in `src/assets/images/nasa/`: artifact photos (ids in the
table above), the hero (AS11-37-5505), InSight before/after (PIA22876, PIA25287) and LRO orbital views of
the Apollo 11 and 12 sites (PIA12909, PIA12922, credit NASA/GSFC/Arizona State University).

Built for the NASA International Space Apps Challenge 2026.
