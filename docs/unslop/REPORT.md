# Unslop redesign report

Method: [unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky (CC BY 4.0). Audit and plan:
[AUDIT.md](AUDIT.md). Screenshots: `before/` and `after/`. Nothing is committed.

## Direction

Archival, exact, quietly elegiac. Museum object labels and NASA mission reports. The only rich colour is
in the globes, the map and the dossier photos. Signature: the mono catalogue tag on every object.

## The nine passes

1. **Spacing:** all 23 arbitrary px values moved onto the 4px scale. Sections use 48/80/96 vertical
   padding (mobile/tablet/desktop) and cards use 20–24 padding. Equal lists share one gap.
2. **Colour:** one ink ramp (`ink/page/card/raised`), three text roles, hairlines at 8%/16%, and one
   accent (rust `#d0704a`). Removed the 4 competing accents, 10 hue gradients, gradient text, the
   radial-glow and scanline helpers, coloured shadows and big shadows. The primary button is off-white
   with dark text (white on rust was 3.4:1). Status colours appear only on status dots.
3. **Icons:** removed the decorative icons beside kickers, headings, buttons and impact cards. The rest
   are lucide with a 1.5 stroke at 16px.
4. **Copy:** rewrote the HUD jargon in `strings.json` (`en` and `bn`, same keys) plus the inline strings
   in Timeline3D, SoundscapeController, OneMachineJourney, ScienceConstellation, YoungExplorers and
   Footer. Everything is sentence case, with no exclamation marks. Quotation marks are gone from the
   hero line, which has no speaker. Facts are untouched.
5. **Type:** Newsreader for headlines (400), Inter for the interface, JetBrains Mono with tabular numbers
   for figures, coordinates and IDs. Hind Siliguri is the fallback in every stack. Chakra Petch and
   Space Grotesk are gone. No bold, no tracked uppercase, no italics.
6. **Layout:** the hero headline is left-aligned on the calm side of the Apollo 11 photo. Sections now
   vary: split header for the globe; deepest surface for the map; the machines as a museum catalogue
   (photo, name, tag, status, no card chrome); status as a map-key legend plus detail; the journey as a
   typeset chronology; the archive as a flat ledger; data sources as a numbered references list; impact
   as three ruled columns; the footer as a left-aligned last page.
7. **Details:** shared `CatalogueTag` component. Active states are surface steps, not glows. Selection
   uses `aria-pressed`. The dossier is editorial: title, then tag, then the then-and-now pair as the
   visual centre, then story with key facts in the margin, then science, subsystems, why it was left,
   notes and sources.
8. **Visuals:** Timeline3D now draws matte Lambert spheres in neutral grey with the current mission in
   rust, a 1px neutral path, dim still neutral stars, and fog the colour of the stage. The wireframes,
   octahedra, rings, the cyan tube and the spinning are gone. The globe markers no longer pulse. The
   hero starfield is drawn once (it no longer drifts).
9. **Motion:** one easing (`cubic-bezier(0.22, 1, 0.36, 1)`), 150 ms colour/opacity/transform. No
   `transition-all`, no hover lift or scale. Only the LIVE dot pulses. The modal and section entrances
   are a short fade with an 8px rise. Reduced-motion rules are unchanged.

## Checklist

- Direction written and followed: yes
- 4px scale; equal things equal: yes
- One ramp, three text roles, one accent with contrast: yes (checked: accent 5.6:1 on page, 4.8:1 on raised)
- No hue gradients, gradient text, glows or coloured shadows: yes (the remaining gradients are neutral photo scrims)
- One icon set, one stroke: yes
- Weights 400–500, no tracked uppercase, no italics: yes (counts: 0 / 0 / 0)
- No exclamation marks or unverified claims in UI chrome: yes (see "Not changed" below for content strings)
- Tabular figures for numbers: yes
- Nested radii: yes (cards 12 with 8 buttons inside; modal 16)
- Hero shows something true: yes, the Apollo 11 photo
- No looping or bouncy motion: yes, except the LIVE dot
- **Template check:** with another product's name swapped in, the catalogue tags, the NASA photo
  hero, the then-and-now dossier and the status legend would not fit, so the screens are specific to
  this archive. The weakest screen is Young Explorers, which is still a generic tabbed card.

## Verified

- `tsc --noEmit` passes; `vite build` and the `esbuild server.ts` step pass (run under Node 24 with npx,
  because bun is not installed on this machine).
- Browser at 375×812 in English and Bangla, with `?offline=1`. There is no horizontal overflow, all four
  live tiles show the OFFLINE COPY badge, the Bangla headings and labels render, the dossier opens with
  focus inside, and Esc closes it. Every section renders and no resources fail on reload. The page is
  about 27,500px tall at 375, down from 30,700.
- 1280×800: hero screenshot plus DOM checks (no overflow, nav fits at 1240px).

## Not verified

- `bun test`: bun is not installed here, and the tests import `bun:test`.
- Full-width screenshots at 1280: the browser pane ran at 1.5× pixel ratio and cropped captures to the
  left 800px, so desktop sections below the hero were checked by DOM and partial captures only.
- Keyboard walk-through of every control, and a screen reader pass.

## Not changed (content, flagged for you)

- OneMachineJourney: unsourced or overstated claims were removed or reworded on request: "conquered the
  Red Planet", "proving … catastrophic floodwaters", "visited only by dust devils", "Olympic marathon",
  "Departure into the Martian night" (the launch was from Florida), "the most lucky geological landing in
  human history", "Water proven" / "standing bodies of water", "dozens of brutal dust storms", and
  "forever etched". Steps that lost their only fact no longer show an empty "Fact:" line.
- The machine cards now show the first "science made possible" item instead of two. The rest are in the
  dossier and the map panel.
- The status section's inline English fallback text for "no active machines" was kept as it is.
