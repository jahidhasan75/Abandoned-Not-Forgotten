# Unslop redesign prompt

Paste everything inside the box below into Claude Code (or any coding agent) from the
`Nasa Space Challenges` folder. It restyles the site so it stops looking AI-generated, keeps every
section, widget, fact and feature, and stops for your approval before editing.

````text
Use the unslop skill (https://github.com/heydamir/unslop, by Damir Sokolovsky, CC BY 4.0) to redesign
the website in ./Abandoned-Not-Forgotten so it stops looking AI-generated. Read CLAUDE.md and README.md
first: they hold the code map, data model and rules. This is a heavy-slop screen: run the full nine
passes in order (spacing, color, icons, copy, type, layout, details, visuals, motion) across the whole
site, finishing each pass everywhere before starting the next.

## Product and direction (already agreed, do not reinvent)
- Product: a cited, bilingual (English/Bangla) archive of the hardware humanity left on the Moon and
  Mars, built for students and teachers in Bangladesh, for NASA Space Apps 2026.
- Character: archival, exact, quietly elegiac. Not futuristic, not "sci-fi HUD".
- World: museum object labels, NASA mission reports, the 1975 NASA Graphics Standards Manual
  (unity, precision, Helvetica-like grotesk), grey lunar regolith and rust-coloured Martian dust.
- Moments (the only rich, colourful places): (1) the 3D globes and the map built from real NASA
  mosaics, (2) the dossier's "then and now" photo pair (surface photo + LRO orbital view).
- Signature: a museum-style catalogue tag on every object, in mono, used the same way everywhere:
  `ARCH/MOON/001 · 0.67416° N 23.47314° E · 1969 → 1969`.

## Audit findings to fix (counted in src/components)
- 78 uppercase labels with wide tracking (tracking-wider/widest + uppercase), e.g. kickers like
  "PLANETARY EXPLORATION SECTOR". → sentence case, normal tracking, or delete the kicker.
- 101 font-bold/extrabold. → weights 400 and 500 only, 600 for rare emphasis; hierarchy from size and colour.
- 17 animate-pulse/animate-ping. → remove all except the dot inside the LIVE source badge (truly live).
- 40 transition-all. → transition-colors or transition-[opacity,transform], 150ms, one easing
  cubic-bezier(0.22, 1, 0.36, 1).
- 10 hue gradients (bg-gradient-to-*) incl. hero buttons; 1 gradient text ("Forgotten" in the hero). → solid.
- Coloured glows/shadows and 20 shadow-2xl/xl. → no glows; depth from surface steps + hairlines
  (primary text colour at 8% opacity).
- 6 hover:scale / hover:-translate on cards and globes. → hover is a colour/surface change only.
- 23 arbitrary px values ([..px]). → 4px grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128).
- Pseudo-HUD jargon in src/data/strings.json and components: "TEMPORAL MORPHOLOGY COMPARISON",
  "OPERATIONAL TAXONOMY", "3D CHRONOLOGICAL FLIGHT TRAJECTORY", "3D SPATIAL CHRONOMETER",
  "WARP VECTOR Z", "AREOGRAPHIC CARTOGRAPHY", "SOLAR SYSTEM ARCHAEOLOGY MANIFESTO", etc.
  → plain, specific words using the page's own facts (e.g. "Before and after: InSight, 2018 and 2022").
- Four competing accents (cyan #62D9FF, rust, amber #F3B562, silver #D9DDE3) used everywhere. → one accent.
- Every section uses the same template (tiny uppercase kicker → huge uppercase bold title → grey
  paragraph → bordered dark card with big shadow). → vary the layouts.
- Sci-fi display font Chakra Petch (.font-hud). → replace (see Type).

## Exact values
- Colour ("ink" ramp, dark): deepest #07080d, page #0b0d14, card #11141c, raised #1a1e28,
  hairline = primary text at 8%, text primary #eef0f5, secondary #a3a9b8, muted #7a8296.
  One accent: rust #D0704A, only for the primary button, the current selection and one key figure.
  Keep STATUS_COLORS (src/data/status.ts) for status dots only. Primary button on dark may be off-white
  #eef0f5 with dark text if that reads better.
- Type: headlines in Newsreader (serif, 400–500, sentence case); interface text in Inter; figures,
  coordinates and catalogue IDs in JetBrains Mono with tabular-nums; Bangla keeps Hind Siliguri as the
  fallback in every stack. Remove Chakra Petch from index.html and index.css. Scale: 12/14/15/18/28/36,
  hero 56–72 desktop and 36–44 mobile. No negative tracking under 16px. No italics for emphasis.
- Radius: buttons 8, cards 12, panels/modal 16; nested radius = outer − padding (min 4). Not everything
  is rounded-full.
- Spacing: sections 80–96 vertical on desktop, 48–64 mobile; card padding 20–24; one gap per list.
- Motion: one optional entrance (short fade + 8px rise) for main content; keep the existing
  prefers-reduced-motion rules and the scroll-driven section reveal only if it stays subtle.

## Section by section (keep EVERY section and widget; only the theme changes)
- Navbar: wordmark as plain text in Inter 500, quiet links, the active-link underline in the accent,
  the language toggle and Moon/Mars switch as quiet controls.
- Hero: keep the Apollo 11 shadow photo (AS11-37-5505); headline on the calm part of the image,
  left-aligned, solid colour, sentence case; one primary + one secondary action; the stat row keeps
  its figures in neutral colour and mono.
- Impact strip, Live band ("Still Talking"), Data Sources: quiet cards, mono catalogue-style meta;
  the LIVE/CACHED/OFFLINE badges stay (they are real provenance).
- Globe section and map: these are the moment — keep the real textures; make the HUD overlays quiet
  (small sentence-case labels, no uppercase jargon); markers keep status colours, no ping animation.
- 3D Timeline (src/components/Timeline3D.tsx): keep the Three.js flight and all controls. Replace the
  glowing cyan/rust wireframe spheres and rings with quiet solid markers (small matte spheres or flat
  discs in the neutral ramp, the current mission in the accent #D0704A), drop the additive glow and
  coloured fog tint, make the connecting line a thin neutral hairline, keep the starfield but dimmer
  and neutral. Replace "3D SPATIAL CHRONOMETER" / "WARP VECTOR Z" with plain labels (year and mission
  name). The mission card uses the catalogue-tag signature. Keep the year scrubber, keyboard access
  and prefers-reduced-motion behaviour.
- Machine cards and Archive: present them like a museum catalogue — the photo, the object name, the
  catalogue tag, status as a small dot + word; no hover lift.
- Dossier modal: editorial layout — Newsreader title, then the catalogue tag, then the then-and-now
  pair as the visual centre, then story, sources. Quiet section headings.
- Status, One Machine Journey, Before/After, Constellation, Young Explorers, Footer: same pass rules;
  simplify the chrome, keep all content and interactions.
- Audio widget (src/components/SoundscapeController.tsx): keep it and all its functions (environment
  switch, volume, Quindar tone, ping, waveform). Restyle as a quiet control: neutral card surface with
  a hairline border, no glow or coloured shadow, sentence-case labels instead of
  "MISSION CONTROL AUDIO" / "LUNAR ENVIRONMENT:", waveform bars neutral with the accent only while
  playing, no pulsing icon. Collapsed by default and compact on mobile.

## Hard rules (must not break)
- Do not remove any section, widget, content, data, source or feature, and keep the section order.
  Facts in src/data/missionsData.ts, artifacts.bn.json and strings.json stay true; only reword UI
  chrome strings, and update BOTH the en and bn tables in src/data/strings.json for every string you
  change (keys stay the same).
- Keep accessibility: focus-visible rings, aria labels, keyboard slider, modal focus trap,
  prefers-reduced-motion, WCAG AA contrast (4.5:1 for text, check the accent on dark).
- Keep offline-first: no new runtime network dependencies besides the existing Google Fonts link;
  no new npm packages unless essential.
- Do not add new decoration (no glass, grain, noise, neon, bento grids) to replace removed decoration.
- Do not invent claims or numbers.

## Workflow
1. Start the dev server (bun run dev), screenshot the hero, globe, map, a dossier, and mobile 375px
   before changing anything.
2. Write the audit list, one line per sign with file:line, then the plan. Wait for my "go".
3. Apply the nine passes. Prefer shared tokens (CSS variables / a small set of classes in index.css)
   over repeating hex values in every component.
4. Verify: bun run lint, bun test, bun run build all pass; check in the browser at 1280×800 and
   375×812, in English and Bangla (toggle in the navbar), and with ?offline=1. Run the unslop
   checklist, including the template check ("would this screen fit another product if I swapped the
   name?").
5. Report: the direction, a few lines per pass, before/after screenshots, and anything you could not
   verify. Do not commit; I will review first.
````

Credit: the unslop method is by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.
