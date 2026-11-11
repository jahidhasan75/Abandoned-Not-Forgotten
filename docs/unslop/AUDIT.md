# Unslop audit and plan: Abandoned // Not Forgotten

Method: the [unslop](https://github.com/heydamir/unslop) skill by Damir Sokolovsky (CC BY 4.0).
Before screenshots: `docs/unslop/before/` (1280×800 hero, globe, timeline, machines, dossier over map; 375×812 hero).
Full per-line list (763 lines, one sign per line with file:line): [audit-lines.md](audit-lines.md).

**Verdict: heavy slop.** Run all nine passes.

## Direction (as agreed)

- **Product:** a cited, bilingual (English/Bangla) archive of hardware left on the Moon and Mars, for students and teachers in Bangladesh.
- **Character:** archival, exact, quietly elegiac.
- **World:** museum object labels, NASA mission reports, the 1975 NASA Graphics Standards Manual, grey regolith and rust dust.
- **Moments:** the globes and map on real NASA mosaics, and the dossier's then-and-now photo pair.
- **Signature:** a mono catalogue tag on every object: `ARCH/MOON/001 · 0.67416° N 23.47314° E · 1969 → 1969`.

## Audit summary (counts in src/components + App.tsx)

| Sign | Count | Worst offenders |
|---|---|---|
| Tracked uppercase labels | 78 | YoungExplorers 13, ArchaeologyMap 11, MachineDetailModal 10 |
| Bold/extrabold | 101 | YoungExplorers 33, MachineDetailModal 15 |
| pulse/ping | 17 | ArchaeologyMap.tsx:230 (marker ping), ScienceConstellation.tsx:109,136, StatusSystem.tsx:130, Hero.tsx:97, Timeline3D.tsx:358. Keep only SourceBadge.tsx:45 (LIVE dot) |
| transition-all | 40 | YoungExplorers 15 |
| Hue gradients / gradient text | 10 + 1 | Hero.tsx:107 gradient "Forgotten", Hero.tsx:130 and Footer.tsx:37 gradient buttons, YoungExplorers.tsx:525. Image scrims (Hero:88, MachineCards:117, Modal:117, Slider:107,135) are tone-only and stay as neutral scrims |
| shadow-xl/2xl + coloured glows | 20 + 7 | index.css:147–159 `space/mars/moon-radial-glow`, `subtle-scanlines`; Hero.tsx:89; ScienceConstellation.tsx:77 `nodeGlow` |
| Hover scale/lift | 6 | ArchaeologyMap.tsx:225, MachineCards.tsx:105,115,185, OneMachineJourney.tsx:206, Hero.tsx:130 |
| Arbitrary px | 23 | ArchaeologyMap 5, PlanetSelector 3, Slider 3, Soundscape 3 |
| Sci-fi display font | 150 uses | `.font-hud` (index.css:7,137), Chakra Petch in index.html:14 |
| Four accents | 166 cyan, 56 silver, 28 amber, 27 rust | everywhere |
| HUD jargon | ~25 strings | strings.json:35,54,77,82,83,102,103,109,123,147,187,209,217; Timeline3D.tsx:359,361; SoundscapeController.tsx:227,233; OneMachineJourney.tsx:48–128 badges; YoungExplorers.tsx:268 |
| One template for every section | 12 sections | kicker → huge uppercase title → grey paragraph → bordered dark card |
| Timeline3D glow | — | Timeline3D.tsx:52 tinted fog, :114–137 cyan/rust wireframe spheres + rings, :153 cyan line |

Seen in the screenshots as well: centred stacked hero with a three-colour headline, uppercase CTA labels, a big orange
shadowed CTA, cyan pills in the timeline year row, cyan-bordered modal, and the "MISSION CONTROL AUDIO" pill on every screen.

## Contrast checks for the new palette

| Pair | Ratio | Result |
|---|---|---|
| rust #D0704A on page #0b0d14 / card #11141c / raised #1a1e28 | 5.64 / 5.35 / 4.84 | passes as text |
| white on rust #D0704A | 3.44 | **fails** for button text |
| dark #07080d on rust | 5.81 | passes |
| off-white #eef0f5 button, dark text | 17.55 | passes |
| muted #7a8296 on page / card / raised | 5.05 / 4.79 / 4.33 | **fails on raised**: use secondary text on raised surfaces |

So the primary button will be off-white with dark text, and rust marks the current selection, the active nav underline
and one key figure per screen.

## Plan

1. **Tokens first.** Add the ink ramp, text roles, hairline, accent, radii, easing and font stacks as CSS variables
   and a few Tailwind theme tokens in `src/index.css`. Swap fonts in `index.html` (Newsreader, Inter, JetBrains Mono,
   Hind Siliguri; drop Chakra Petch and Space Grotesk). Delete the glow and scanline helpers.
2. **Nine passes in order, each across the whole site before the next:**
   spacing (4px grid, section rhythm 80–96 / 48–64, card padding 20–24) → colour (one accent, status colours for
   dots only, no glows or hue gradients) → icons (lucide only, one size and stroke, drop decorative icons) → copy
   (rewrite the HUD strings in `strings.json` **en and bn**, plus the inline strings in Timeline3D,
   SoundscapeController, OneMachineJourney and YoungExplorers) → type (Newsreader headlines in sentence case, Inter
   interface, mono figures with tabular-nums, weights 400/500) → layout (left-aligned hero on the calm part of the
   photo, vary the section templates: e.g. split header for globe, full-bleed map, catalogue list for machines,
   editorial dossier) → details (catalogue-tag component used everywhere, nested radii, surface-step active states) →
   visuals (Timeline3D matte markers, neutral hairline path, dimmer neutral stars, no fog tint) → motion (one easing,
   150 ms colour/opacity/transform transitions, one entrance, keep the reduced-motion rules and a subtle section reveal).
3. **Verify:** `lint`, `test`, `build`; browser at 1280×800 and 375×812, English and Bangla, `?offline=1`; the unslop
   checklist and the template check. After screenshots go in `docs/unslop/after/`.
4. **Docs:** update the README "Design tokens" and fonts lines and the CLAUDE.md style line to the new palette, and log
   the tool use in `docs/AI_USE.md`. No commit.

## Open questions for you

- The hero quote "NASA's machines may have stopped moving. Their stories never did." has no speaker. Keep it as a
  plain line (no quote marks), or leave it as is?
- Status names (ACTIVE, SILENT …) are data enums. Plan: show them in sentence case ("Silent") in the UI, keep the
  enum values unchanged.
- This machine has no bun, so I ran `npm run dev` under Node 24. I will run lint, build and the tests with
  `npx tsc` / `npx vite build`. `bun test` needs bun; if you want it run, install bun or run it yourself.
