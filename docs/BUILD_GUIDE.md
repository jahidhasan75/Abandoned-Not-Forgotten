# Building Guide — ABANDONED // NOT FORGOTTEN

এই guide টা team আর Claude দুজনের জন্য। এখানে event এর requirement (Space Apps 2026 Build Guide,
Bangladesh Local) আমাদের project এর সাথে মিলিয়ে ধাপে ধাপে সাজানো হয়েছে। প্রতিটা ধাপে লেখা আছে
**কী করব**, **আপনার কাছ থেকে কী লাগবে**, আর **কখন শেষ ধরা হবে**।

Code বোঝার জন্য আগে [README.md](../README.md) পড়ুন। সেখানে code map, data structure আর known issues আছে।

---

## ১. Requirement বনাম আমাদের বর্তমান অবস্থা

### Judging score sheet

| Criterion | Points | এখন কেমন আছে | কী করলে top band এ যাবে |
|---|---|---|---|
| Impact | 1–20 | শিক্ষামূলক museum, শক্ত গল্প | কাদের জন্য (student/teacher), কীভাবে scale হবে, তা page এ ও video তে স্পষ্ট বলা |
| Creativity | 1–20 | ✅ শক্ত: 3D timeline, soundscape, before/after, constellation | একটা "killer demo" moment ঠিক করা (নিচে দেখুন) |
| Validity | 1–20 | ⚠️ দুর্বল: সব data hard-coded, কোনো source link নেই, ছবি AI-made | প্রতি artifact এ source link, আসল NASA ছবি, live data সাথে source badge |
| Relevance | 1–20 | ⚠️ NASA এর নাম আছে, কিন্তু NASA data সরাসরি ব্যবহার হচ্ছে না | NASA Image Library, Treks map, Mars raw image feed, Horizons ব্যবহার করে তাদের নাম UI তে দেখানো |
| Presentation | 1–20 | ✅ design ভালো | 240-second আর 30-second video, শুরু-মাঝ-শেষ সহ |
| Teamwork | 1–5 | ? | commit history তে সবার কাজ, README তে roles |
| User experience | 1–5 | ✅ Phase 1 এ polish হয়েছে (mobile, keyboard, animation)। Page এখনো ১৭,৬০০ px লম্বা | কিছু section ছোট করা বা একসাথে করা |
| NASA data usage | 1–5 | ⚠️ প্রায় শূন্য | NASA + অন্য একটি সংস্থার data (যেমন LROC/ASU বা ESA) দেখানো |
| Category named / Repo open / Page submitted | 0/1 each | ? | সবার আগে নিশ্চিত করুন, ১৫ মিনিটের কাজ |

### Build Guide এর নিয়ম, আমাদের project এ কীভাবে খাটবে

| Guide এর নিয়ম | আমাদের জন্য মানে | অবস্থা |
|---|---|---|
| Offline-first, `OFFLINE=1` flag | live data না পেলে cache বা fixture থেকে দেখাবে। Demo wifi ছাড়া চলবে | ❌ এখনো live data নেই |
| Frontend কখনো NASA কে সরাসরি call করবে না | `server.ts` (Express) হবে API layer, সে cache রাখবে। Python/FastAPI লাগবে না, আমাদের stack Node | ❌ |
| `src/compute` আলাদা, model কোনো সংখ্যা বানাবে না | light-time, "শেষ যোগাযোগের পর কত দিন", sol হিসাব এগুলো tested pure function এ থাকবে | ❌ |
| প্রতিটি সংখ্যার source | প্রতি artifact এ `sources[]` (URL + dataset id), UI তে "Sources" drawer | ❌ |
| Source label দেখানো | ছোট badge: `LIVE` / `CACHED 2h ago` / `OFFLINE FIXTURE` | ❌ |
| LICENSE Apache-2.0, public repo | App.tsx এ header আছে, কিন্তু LICENSE file নেই | ⚠️ |
| `docs/AI_USE.md` | কোন AI tool কী করেছে (AI Studio দিয়ে শুরু, Claude Code দিয়ে polish) | ❌ |
| `CLAUDE.md`, `AGENTS.md` | coding agent এর নিয়ম | ❌ |
| কোনো under-18 এর ছবি নয় | এখন নেই ✅। "Young Explorers" section এ ভবিষ্যতে শিশুর ছবি দেবেন না | ✅ |
| Agent (optional) | "Ask the Archive" chat, শুধু tool result থেকে উত্তর দেবে। সময় থাকলে করব, না হলে বাদ | optional |

---

## ২. Killer demo (যেটা judge মনে রাখবে)

প্রস্তাব: **"Then and Now" dossier।** একটা artifact খুললে (যেমন Surveyor 3) দেখা যাবে:
1. আসল NASA archival ছবি (Apollo 12 থেকে তোলা Surveyor 3, `AS12-48-7121`), NASA Image Library থেকে।
2. আসল Moon/Mars map এ তার অবস্থান (Solar System Treks tiles)।
3. Live হিসাব: "শেষ যোগাযোগের পর ৫৯ বছর, পৃথিবী থেকে এখন ৩৮৪,xxx km, আলো যেতে ১.২৮ s" (JPL Horizons)।
4. Status এর ACTIVE অংশে আজকের Curiosity/Perseverance sol আর সর্বশেষ ছবি: "এরা এখনো কথা বলছে।"
5. প্রতিটি সংখ্যার পাশে source badge, আর click করলে raw JSON দেখা যাবে।

এটা Validity, Relevance আর NASA data usage তিনটাতেই point আনবে।

---

## ৩. ধাপে ধাপে পরিকল্পনা

প্রতিটি ধাপ শেষে আমি build আর browser এ চালিয়ে যাচাই করব, তারপর আপনাকে দেখাব।

### Phase 0 — Hygiene ✅ (৭ নভেম্বর শেষ)
- [x] `LICENSE` (Apache-2.0), `package.json` name → `abandoned-not-forgotten`, `start` → `node server.js`
- [x] অব্যবহৃত `@google/genai`, `motion`, `dotenv` সরানো (যদি agent না করি), `public/assets/images` এর ডুপ্লিকেট মুছে ফেলা
- [x] `.env.example` নতুন করে (`NASA_API_KEY`, `OFFLINE`), `metadata.json` সরানো
- [x] `CLAUDE.md`, `AGENTS.md`, `docs/AI_USE.md` তৈরি

**এখনো বাকি (আপনার কাছ থেকে):** `docs/AI_USE.md` এর TODO অংশ, team সদস্যদের নাম ও roles, আগে কোন AI tool ব্যবহার করেছেন (AI Studio/Gemini?) আর কোন কাজে।

### Phase 1 — Polish ও smoothness ✅ (৭ নভেম্বর শেষ)
- [x] Timeline3D: scene একবারই তৈরি হবে, শুধু camera সরবে; geometry dispose; `THREE.Timer`
- [x] `fadeIn`/`shake` animation define করা, scroll-এ section reveal (`prefers-reduced-motion` মেনে)
- [x] Navbar: 1024 px এ ভাঙা ঠিক করা, scroll করলে active section highlight
- [x] Soundscape: প্রথম click এর আগে AudioContext তৈরি না করা, mobile এ ছোট pill হয়ে থাকা
- [x] Modal: backdrop click এ বন্ধ হওয়া, focus trap, open/close animation
- [x] Before/After: keyboard (← →) আর click-to-jump
- [x] MachineCards planet sync, filter গুলো এক রকম করা
- [x] ছবি WebP এ compress (১ MB থেকে ~১৫০ KB), Three.js lazy-load (bundle 952 kB থেকে কমানো)
- [x] Mobile (375 px) এ পুরো page পরীক্ষা

**আপনার কাছ থেকে লাগবে:** কিছু না। শুধু শেষে দেখে বলবেন design ঠিক আছে কিনা।

### Phase 2 — আসল NASA content ✅ (৭ নভেম্বর শেষ)
- [x] প্রতি artifact এ `nasaImageId` আর `sources[]` field; NASA Image Library থেকে আসল ছবি
- [x] Coordinates ঠিক করা (Surveyor 3 আর ALSEP আলাদা; ALSEP কে ৫টা site হিসেবে দেখানো)
- [x] নতুন artifact: Apollo 11/14/15 Laser Retroreflector (ACTIVE), Curiosity ও Perseverance (ACTIVE), Mars Polar Lander বা Beagle 2 (LOST)
- [x] Dossier এ "Sources" অংশ

**সিদ্ধান্ত নেওয়া হয়েছে (পরামর্শ অনুযায়ী):** আসল NASA ছবি ব্যবহার করা হয়েছে, AI ছবি শুধু hero/planet/map/slider-এ। Beagle 2-এর বদলে Mars Polar Lander (NASA mission) LOST হিসেবে যোগ হয়েছে। আগের প্রশ্ন: নতুন artifact যোগ করব কিনা, আর এখনকার AI ছবিগুলো রাখবেন নাকি আসল NASA ছবি দিয়ে বদলাবেন (আমার পরামর্শ: আসল ছবি main, AI ছবি শুধু hero তে)।

### Phase 2.5 — NASA dataset ও 3D globe ✅ (৭ নভেম্বর শেষ)
- [x] Challenge-এর record format অনুযায়ী `public/data/objects.geojson` (`bun run export:data`)
- [x] NSSDCA থেকে তারিখ ও coordinates, PDS Search API থেকে ১২টা context LID, NTRS থেকে ১৩টা mission report
- [x] Local LROC PDS catalog (`data/pds/lroc/`) parse করে Data Sources section
- [x] Moon Trek, Mars Trek ও GIBS থেকে আসল texture; Earth → Moon → Mars 3D globe-এ smooth flight
- [x] 2D map-এ আসল NASA basemap আর year scrubber (challenge brief-এর timeline filter)
- [x] বাংলা toggle (`src/data/strings.json` + `src/data/artifacts.bn.json`), navbar-এ, পছন্দ মনে রাখে
- [ ] বাকি: live data (Phase 3), কিছু section-এর মূল লেখার বাংলা অনুবাদ

### Phase 3 — Live data ✅ (৭ নভেম্বর শেষ)
- [x] Backend ছাড়া browser থেকেই NASA call (brief অনুযায়ী static site); live → cache → offline fixture
- [x] "এখনো কথা বলছে" band: Curiosity ও Perseverance-এর আজকের sol ও raw ছবি, চাঁদ ও মঙ্গলের এখনকার দূরত্ব (JPL Horizons)
- [x] প্রতিটি dossier-এ: কত দিন নীরব, আর আজ পৃথিবী থেকে রেডিও সংকেত পৌঁছাতে কত সময় লাগবে
- [x] প্রতিটি সংখ্যার পাশে LIVE / CACHED / OFFLINE COPY badge
- [x] `src/lib/compute.ts`-এ tested function (১৩টা test), `bun run fetch:fixtures`
- [x] Demo-র আগে: `bun run fetch:fixtures` চালান; wifi ছাড়া দেখাতে ঠিকানায় `?offline=1`
- [ ] APOD: code তৈরি, কিন্তু ৭ নভেম্বর API ভুল (placeholder) data দিচ্ছে; ঠিক হলে নিজে থেকেই দেখাবে

### Phase 4b — নতুন ৬টা object ✅ (৭ নভেম্বর শেষ, মোট ২০)
- [x] Viking 2, Opportunity-র heat shield, Perseverance-এর backshell ও parachute, Ingenuity, Apollo 17 Challenger, Apollo 14 S-IVB-এর গর্ত
- [x] নতুন category (অবতরণের সরঞ্জাম, আছড়ে পড়ার স্থান, আকাশযান) আর "ফেলে দেওয়া অংশ" filter
- [x] সব NSSDCA/PDS/NTRS source, বাংলা অনুবাদ, Apollo 17-এর কক্ষপথের ছবি, Constellation-এ নতুন সংযোগ

### Phase 4 — Score বাড়ানোর সহজ কাজ ✅ (৭ নভেম্বর শেষ)
- [x] AI ছবি সরিয়ে নাসার আসল ছবি (hero: AS11-37-5505; before/after: InSight 2018 বনাম 2022)
- [x] Apollo 11 ও 12-এর dossier-এ LRO-র কক্ষপথ থেকে তোলা "তখন ও এখন" ছবি (PIA12909, PIA12922)
- [x] Data Sources-এ partner/third-party ট্যাগ (USGS, ASU, CNES/LANL)
- [x] দুর্বল ৪টা section বাদ, সন্দেহজনক তথ্য ও উদ্ধৃতি ঠিক বা বাদ
- [x] "এটি কাদের জন্য" Impact অংশ
- [x] Video script ও project page-এর খসড়া: [docs/SUBMISSION.md](SUBMISSION.md)
- "Ask the Archive" (AI chat) বাদ: API key নেই

### Phase 4 — Optional: "Ask the Archive" agent (≈ ৩ ঘণ্টা, সময় থাকলে)
- Claude API দিয়ে প্রশ্নের উত্তর, শুধু আমাদের data/tool result থেকে, প্রতিটি উত্তরে source।
- **আপনার কাছ থেকে লাগবে:** Anthropic API key, আর এটা চান কিনা।

### Phase 5 — Submission (শেষ ৪ ঘণ্টা, অন্য কিছু নয়)
- [ ] `OFFLINE=1` দিয়ে wifi বন্ধ করে পুরো demo rehearsal
- [ ] 240-second video (team, problem, solution, demo, NASA dataset এর নাম মুখে বলা)
- [ ] 30-second global video, English subtitle সহ
- [ ] Project page এর সব field, private window এ repo link পরীক্ষা
- [ ] `docs/AI_USE.md` official wording এর সাথে মিলানো (guides ১৩ নভেম্বর প্রকাশ হবে)

---

## ৪. সময়সূচি (আজ ৬ নভেম্বর ২০২৬)

| তারিখ | কাজ |
|---|---|
| ৬–৭ নভেম্বর | Phase 0 + Phase 1 ✅ |
| ৮–৯ নভেম্বর | Phase 2 ✅ (৭ নভেম্বরেই শেষ) |
| ১০–১১ নভেম্বর | Phase 3 + cache তৈরি |
| **১২ নভেম্বর** | **পুরো offline dry run সফল হতে হবে** (guide এর deadline) |
| ১৩ নভেম্বর | official guides পড়া, AI disclosure মিলানো |
| ১৪ নভেম্বর ১২:০০ | 30-second global video জমা |

পিছিয়ে পড়লে cut order (guide অনুযায়ী): আগে artifact সংখ্যা কমান, তারপর interactivity, তারপর live query।
Killer demo শেষ পর্যন্ত রাখবেন।

---

## ৫. আমাকে কীভাবে তথ্য দেবেন (token বাঁচাতে)

- প্রতিবার শুধু ধাপের নম্বর বলুন, যেমন "Phase 1 শুরু করো"। আমি README থেকে context নেব, পুরো code আবার পড়ব না।
- নতুন content (fact, ছবি, source) দিলে এই format এ দিন: `artifact id → field → value → source URL`।
- Design পরিবর্তন চাইলে section এর নাম (README এর table থেকে) আর screenshot দিন।
- কোনো API key chat এ পেস্ট করবেন না। `.env` file এ নিজে বসান।

## ৬. খোলা প্রশ্ন (উত্তর দিলে কাজ দ্রুত হবে)

1. আমাদের official challenge এর নাম/নম্বর কী, আর statement এর মূল অংশ কী? (project page এ লিখতে হবে)
2. Local judging (Day one) কবে? ১২ নভেম্বরের আগে নাকি পরে?
3. Team members ও roles?
4. Deploy কোথায় হবে, বা শুধু local demo?
5. AI ছবিগুলো বদলে আসল NASA ছবি দেব? (পরামর্শ: হ্যাঁ)
6. নতুন artifact (retroreflector, Curiosity, Perseverance, একটা LOST mission) যোগ করব?
7. "Ask the Archive" AI agent চান কিনা? চাইলে Anthropic API key লাগবে।
8. Interface শুধু English, নাকি বাংলাও? (Bangladesh local judging এর জন্য বাংলা toggle ভালো plus হতে পারে)
