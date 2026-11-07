# Submission kit — ABANDONED // NOT FORGOTTEN

Drafts for the videos and the NASA project page. Replace every **[TODO]** before submitting, and
match the wording to the official Project Submission Guide published on 13 November 2026.
Numbers below were true on 7 Nov 2026; the live ones (sols, distances) change, so read them off the
site when you record.

---

## 1. 240-second local judging video (script)

| Time | On screen | Voice-over (English; say the NASA dataset names out loud) |
|---|---|---|
| 0:00–0:20 | Team name card, then each member | "We are **[TODO team name]**: [TODO names and roles]. Our challenge is **[TODO official challenge name]**." |
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

1. (0–5 s) Team name + "NASA Space Apps 2026, [TODO challenge]".
2. (5–12 s) Fly from Earth to the Moon on the real LRO mosaic: "Every machine we left on the Moon and Mars, on real NASA maps."
3. (12–22 s) Click Apollo 11: surface photo, orbit photo, source links, live signal time: "Each one with its last photo, its coordinates and its NASA source."
4. (22–27 s) Toggle Bangla, flash the Data Sources: "Bilingual, open data, works offline."
5. (27–30 s) "EXOARCHIVE. Abandoned, not forgotten."

---

## 3. Project page fields (drafts)

### High-Level Summary
EXOARCHIVE is an interactive, bilingual (English and Bangla) museum of the hardware
NASA left on the Moon and Mars. Visitors fly between 3D globes built from real NASA mosaics, open
each object to see its last photograph, catalogued coordinates, the date contact ended and links to
the NASA records behind every fact, and watch live data from the rovers that are still working. It
is built for students and teachers, runs as a static site, and works offline.
Video: [TODO 240-second video link] · Code: [TODO public GitHub link]

### Project Details
**Why.** The story of humanity's first artifacts on other worlds is spread across technical
catalogues, mission reports and image archives that few people read, and almost none of it is in
Bangla.

**What.** 20 objects (descent stages, rovers, landers, jettisoned heat shield and backshell, a rocket-stage
impact crater, the Ingenuity helicopter, a still-active laser retroreflector, a lost lander) on interactive 3D globes and a year-filtered map; a dossier for each with sources; a live
"Still Talking" band; a quiz and mission builder for classrooms; a full Bangla mode.

**How.** React + TypeScript + Three.js, static and offline-first. Planet textures are stitched from
NASA Trek and GIBS tiles by a script; object data is curated from NSSDCA, PDS and NTRS and exported
as GeoJSON; live values come from JPL Horizons and the mars.nasa.gov raw-image feeds with a cache
and committed offline fixtures; all derived numbers come from unit-tested functions.

**Community and features.** [TODO: who tested it, e.g. classmates or a teacher, and what changed].
Highlights: Earth → Moon → Mars flight, then-and-now orbital photos, source badges on every live
number, one-click Bangla.

**Tools.** React 19, Vite, TypeScript, Tailwind CSS, Three.js, lucide-react, Bun, Python/Pillow
(texture and image processing). [TODO: design tools, video tools].

### Use of AI
See `docs/AI_USE.md`. [TODO: complete the team sections there first, then summarise here: which
tools, why, the key prompts, and what the team did themselves.]

### NASA data sources used
| Dataset | Used for |
|---|---|
| Moon Trek: LRO LROC WAC Global Mosaic (ASU) | Moon globe and map |
| Mars Trek: Viking MDIM 2.1 colour mosaic (USGS) | Mars globe and map |
| NASA GIBS: Blue Marble Next Generation | Earth globe |
| NSSDCA Master Catalog | IDs, landing dates, last contact, coordinates |
| PDS Search API / LROC PDS catalog (LRO-L-LROC-2-EDR-V1.0) | Context identifiers; LROC dataset description |
| NTRS | Mission reports for each object |
| NASA Image and Video Library | Every photograph (surface, orbit, hero, InSight before/after) |
| JPL Horizons API | Live Earth–Moon and Earth–Mars distance and signal time |
| mars.nasa.gov raw-image feeds (Curiosity, Perseverance; CNES/LANL instruments) | Today's sol and newest image |

### References
All dataset and image IDs are listed in `README.md` (artifact catalogue table) and in
`public/data/objects.geojson`. Libraries: React, Vite, Three.js, Tailwind CSS, lucide-react.
Fonts: Space Grotesk, Chakra Petch, JetBrains Mono, Hind Siliguri (Google Fonts).
[TODO: add any article, paper or tutorial the team used.]

---

## 4. Before you submit (checklist)
- [ ] `bun run fetch:fixtures`, then `bun run build` and a full run with `?offline=1` and Wi-Fi off (by 12 Nov)
- [ ] Every member has commits; README has the team and roles
- [ ] Repository is public; the link opens in a private browser window
- [ ] Challenge category is named on the project page
- [ ] `docs/AI_USE.md` complete and matching the official wording
- [ ] Both videos uploaded, 30-second one with English subtitles
- [ ] Project page submitted
