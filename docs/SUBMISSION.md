# Submission kit — EXOARCHIVE

Drafts for the videos and the NASA project page. Challenge: **Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars** (https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/). Replace every **[TODO]** before submitting, and
match the wording to the official Project Submission Guide published on 13 November 2026.
Numbers below were true on 7 Nov 2026; the live ones (sols, distances) change, so read them off the
site when you record.

---

## 1. 240-second local judging video (script)

| Time | On screen | Voice-over (English; say the NASA dataset names out loud) |
|---|---|---|
| 0:00–0:20 | Team name card, then each member | "We are **[TODO team name]**: [TODO names and roles]. Our challenge is **Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**." |
| 0:20–0:45 | Hero (Apollo 11 shadow over footprints) | "Humanity has left more than [TODO verified figure, or drop the number] of hardware on the Moon and Mars: descent stages, rovers, landers that went quiet. They stopped working. They did not stop meaning something. But today their stories are scattered across catalogues most people never see." |
| 0:45–1:10 | "Where Stories Remain": Earth → fly to the Moon | "EXOARCHIVE puts every object back where it is. These globes are real NASA mosaics: the Moon from the **Lunar Reconnaissance Orbiter Camera via Moon Trek**, Mars from the **Viking MDIM mosaic via Mars Trek**, Earth from **NASA GIBS Blue Marble**." |
| 1:10–1:50 | Click Apollo 11 on the map → dossier | "Click the Apollo 11 descent stage. Its coordinates, 0.67416 north, 23.47314 east, come from the **NSSDCA catalogue**. Here is its final photograph from the surface, and here is the same site from orbit, photographed by LRO. Every fact links to its source: NSSDCA, the **PDS context identifier**, and the Apollo 11 mission report on **NTRS**." |
| 1:50–2:15 | Live panel in the dossier, then the "Still Talking" band | "And it is live. A radio signal from Earth would take about 1.3 seconds to reach it today, computed from **JPL Horizons**. Curiosity and Perseverance are still sending raw images from Mars, so we show today's sol and newest picture. Every number carries a badge: live, cached, or offline copy." |
| 2:15–2:35 | Year scrubber: press play from 1967 | "The timeline replays fifty-nine years of hardware arriving on two worlds." |
| 2:35–2:55 | Toggle বাংলা; reopen the dossier | "For students in Bangladesh, the whole archive switches to Bangla with one click." |
| 2:55–3:20 | Data Sources section; download objects.geojson | "Every object is one record in an open GeoJSON file, with partner data from USGS, Arizona State University and CNES clearly marked. The site is static, works offline, and is open source under Apache 2.0." |
| 3:20–4:00 | Footer line; team | "The machines may be silent. But the questions they helped answer are still moving us forward. Thank you." |

Recording tips: record with `?offline=1` as a backup take; keep the browser at 1280 × 800 so text is
readable; turn on English subtitles.

## 2. 30-second global video (script, English subtitles required)

1. (0–5 s) Team name + "NASA Space Apps 2026, Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars".
2. (5–12 s) Fly from Earth to the Moon on the real LRO mosaic: "Every machine we left on the Moon and Mars, on real NASA maps."
3. (12–22 s) Click Apollo 11: surface photo, orbit photo, source links, live signal time: "Each one with its last photo, its coordinates and its NASA source."
4. (22–27 s) Toggle Bangla, flash the Data Sources: "Bilingual, open data, works offline."
5. (27–30 s) "EXOARCHIVE. Abandoned, not forgotten."

---

## 3. Project page (ready to paste)

Field names follow past Space Apps project pages; check them against the Project Submission Guide
(13 November 2026) and paste each block into the matching field. Only the team captain can submit,
from the team's own Space Apps account.

### Project name
EXOARCHIVE: Abandoned, not forgotten

### Challenge
Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars
https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/

### High-level summary (short)
EXOARCHIVE is an interactive, bilingual (English and Bangla) museum of the hardware NASA left on the
Moon and Mars, made for school students and their teachers. Visitors fly from Earth to the Moon and
Mars on 3D globes built from real NASA mosaics, open each of 20 objects to read its story, see its
last photograph and the same site from orbit, and follow every fact to its NASA record. Rovers that
are still working "talk" through live NASA data, and a signal sent to any machine shows, with
today's distance, whether it could still answer. Games, a lesson plan and a printable worksheet turn
the archive into a ready-made class. The site is static, open source and works offline.

### Link to the project
- Code: https://github.com/jahidhasan75/Abandoned-Not-Forgotten
- Live site: [TODO team: deployed URL, if any; otherwise say it runs from the repository with `bun run dev`]
- Demo video (240 s): [TODO team: video link]
- 30-second video: [TODO team: video link]

### Detailed project description
**The problem.** Since the 1960s NASA has left rovers, landers, descent stages, instruments and
discarded parts on the Moon and Mars. Their stories sit in technical catalogues, mission reports and
image archives that few school students read, and almost none of it is in Bangla. Students mostly hear
about missions that are active today.

**What EXOARCHIVE does.**
- **20 objects, each with a dossier:** what it is, why it was sent, why it stayed, what it discovered,
  its last photograph, its catalogued coordinates and the NASA records behind every fact. Five
  dossiers add "then and now" photos of the same site from orbit (LRO).
- **Stories, not lists:** a one-line hook on every card; "One machine, one journey" tells Sojourner,
  Opportunity, InSight and Ingenuity stage by stage, with a light that follows the reader down the
  timeline; a science constellation links 17 machines to what they taught us.
- **Where they are:** 3D globes and a year-filtered map on NASA Trek and GIBS mosaics (the challenge's
  "clickable ghost rovers"), and a 3D timeline of the missions.
- **Still talking:** today's sol and newest raw image from Curiosity and Perseverance, and today's
  Earth–Moon and Earth–Mars distance from JPL Horizons. Every live number is labelled live, cached or
  offline copy.
- **Five states:** active, silent, inactive, lost and historic, with the objects in each.
- **For students:** a 50-question quiz (five per round; questions do not come back for several rounds), a match-the-machine game,
  "Where did it land?" (find each object on the NASA basemap, scored by great-circle distance), "Send a
  signal" (a light-speed message timed with today's distance, answered by a reply, a laser echo or
  silence) and build-a-mission.
- **For teachers:** a 45-minute lesson plan with learning goals, a printable worksheet with answer key,
  and a link to every dossier that can be shared with a class.
- **For everyone:** English and Bangla throughout, light and dark themes checked for contrast, keyboard
  use, reduced motion respected, and an offline mode for classrooms with weak internet.

**How it works.** React 19, TypeScript and Vite, with Three.js for the globes and timeline and
Tailwind CSS. It is a static site with no server: live NASA calls run in the browser with a cache and
committed offline copies, and `?offline=1` forces the offline copy. Planet textures are stitched from
Trek and GIBS tiles by a script; object data is curated from NSSDCA, PDS and NTRS and exported as
GeoJSON (`public/data/objects.geojson`). Every derived number (signal time, days since contact,
surface distance) comes from unit-tested functions, and the quiz and game rounds from a tested
picker.

**Benefits and intended impact.** Students meet the history of exploration through the machines
themselves, in their own language, and see how engineering choices (solar or nuclear power, wheels or a
fixed lander) led to discoveries. Teachers get a lesson they can run without internet. Every object is
one open record, so the archive can grow to more hardware and more worlds, and the code is Apache-2.0.

**What we did ourselves.** [TODO team: who designed, researched, wrote, tested; who tested it with
students or a teacher, and what changed after that].

### Use of Super Intelligence (SI) tools
[TODO team: summarise `docs/AI_USE.md` here: which SI tools (Google AI Studio for the first scaffold,
Claude Code for review, data layer, accessibility, translations and new features), what they produced,
how the team checked it, and what the team did without them.]

### NASA data
| Dataset | Used for |
|---|---|
| Moon Trek: LRO LROC WAC Global Mosaic | Moon globe and map |
| Mars Trek: Viking MDIM 2.1 colour mosaic | Mars globe and map |
| NASA GIBS: Blue Marble Next Generation | Earth globe |
| NSSDCA Master Catalog | IDs, landing dates, last contact, coordinates |
| PDS Search API; LROC PDS catalog (LRO-L-LROC-2-EDR-V1.0) | Context identifiers; LROC dataset description |
| NTRS (NASA Technical Reports Server) | Mission reports for each object |
| NASA Image and Video Library | Every photograph, including LRO orbital views |
| JPL Horizons API | Live Earth–Moon and Earth–Mars distance, signal time |
| mars.nasa.gov raw-image feeds (Curiosity, Perseverance) | Today's sol and newest image |

### Space agency partner and other data
- CNES (French space agency), with LANL: ChemCam and SuperCam instruments behind some rover images.
- USGS Astrogeology Science Center: the Viking MDIM 2.1 Mars mosaic.
- Arizona State University (LROC Science Operations Center): the LRO camera mosaic and orbital photos.

### References
- All dataset and image IDs: `README.md` (artifact catalogue) and `public/data/objects.geojson`.
- Libraries: React, Vite, TypeScript, Three.js, Tailwind CSS, lucide-react.
- Fonts (Google Fonts): Public Sans, Newsreader, IBM Plex Mono, Hind Siliguri, Noto Serif Bengali.
- [TODO team: any article, paper or tutorial the team used.]

---

## 4. Before you submit (checklist)
- [ ] `bun run fetch:fixtures`, then `bun run build` and a full run with `?offline=1` and Wi-Fi off (by 12 Nov)
- [ ] Every member has commits; README has the team and roles
- [ ] Repository is public; the link opens in a private browser window
- [ ] Challenge category is named on the project page
- [ ] `docs/AI_USE.md` complete and matching the official wording
- [ ] Both videos uploaded, 30-second one with English subtitles
- [ ] Project page submitted
