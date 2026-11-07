# Use of AI in this project

Keep this file current as you build. Match the wording to the official Project Submission Guide
(published 13 November 2026).

## Tools
- Google AI Studio (Gemini): initial scaffold of the app. **TODO (team): confirm what it generated and
  which prompts were used.**
- Claude Code (Claude Opus 5.5): codebase review, README and build guide, performance and
  accessibility fixes, image compression, live NASA data layer.

## What the AI did
- 6 Nov 2026: reviewed the code, wrote `README.md` and `docs/BUILD_GUIDE.md`.
- 6 Nov 2026: Phase 0/1 polish: Timeline3D rewrite (scene built once, lazy-loaded), scroll reveal
  animations, responsive navbar with active-section highlight, accessible modal and slider, audio
  context fix, WebP image compression.

- 7 Nov 2026: visual redesign so the site stops looking AI-generated, following the unslop method
  (https://github.com/heydamir/unslop, by Damir Sokolovsky, CC BY 4.0): one neutral palette and one
  accent, Newsreader/Inter/JetBrains Mono, sentence-case UI copy in English and Bangla, the catalogue
  tag signature, quieter 3D timeline. No facts, data or sources were changed. Audit and before/after
  screenshots: `docs/unslop/`.

- 7 Nov 2026: renamed the project EXOARCHIVE and added the team's logo to the header with an Apollo 11
  Earthrise photo strip (AS11-44-6550); sliding menu underline and a section "arrival" rule; a
  dark/light theme toggle; fonts changed to Public Sans, IBM Plex Mono and Noto Serif Bengali; photos
  (PIA14011, PIA00407) on the live Moon and Mars tiles; fixed the sound system (levels were near silent
  and the drones were below what small speakers can play); a 50-question quiz drawn from the archive's
  own facts, 5 per round with no repeats for 5 rounds. The quiz questions were written by the AI from
  `src/data/missionsData.ts`. **TODO (team): read all 50 questions once before submission.**

## What the AI did not do
- **TODO (team):** the concept, the choice of artifacts and the storytelling are the team's own work;
  describe your own contributions here.

## Prompts
- **TODO (team):** list key prompts, or link to `docs/prompts_used.md`.
