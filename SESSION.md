# Session State: Goodreads to Infographic App

**Session Date**: 2026-05-02 (Session 2)
**Status**: Core Functionality Complete & Stable
**Repository**: `c:\dev\antigravity\book-infographics`

## Tech Stack
- React 18, Vite 5, Tailwind 3, Framer Motion, Lucide React
- `html-to-image` for PNG export
- Gemini 2.5 Flash (text API) for book analysis
- PapaParse for CSV parsing

## File Map

| File | Purpose |
|---|---|
| `src/App.jsx` | State controller — auto-loads CSV, manages modal, calls analysis |
| `src/services/geminiService.js` | Gemini text API + localStorage cache + auto-retry on 429 |
| `src/components/BookGallery.jsx` | Searchable grid of book cards |
| `src/components/BookInfographic.jsx` | HTML/CSS infographic renderer + `html-to-image` PNG export |
| `src/components/CSVUploader.jsx` | Drag-and-drop CSV uploader (used as fallback) |
| `public/goodreads_export.csv` | Default library — auto-loaded on startup |
| `scripts/analyze_books.py` | Python bulk analyzer (offline tool, not used in UI) |

## What Was Built This Session

### Core Features (Working)
- [x] Auto-load `goodreads_export.csv` from `public/` on app startup
- [x] Show full book gallery immediately (no landing page required)
- [x] Searchable book grid with staggered animation
- [x] "Change CSV" button in nav to hot-swap to any Goodreads export
- [x] Click any book → Gemini analyzes it → renders full infographic
- [x] Infographic sections: banner, key quote, formula, framework table, 5 takeaways, 5 mistake boxes
- [x] `html-to-image` exports infographic as 2× high-res PNG download
- [x] `localStorage` cache — analyzed books load instantly on repeat clicks
- [x] Auto-retry on 429 rate-limit errors (reads suggested delay from API response)
- [x] "Preview Sample Infographic" button using hardcoded Intelligent Investor data

## What We Tried (Image Generation — All Blocked)

| Approach | Outcome |
|---|---|
| `gemini-2.0-flash-preview-image-generation` | Model not found on v1beta |
| `gemini-2.5-flash-image` | Free tier quota = 0 (exhausted) |
| `imagen-4.0-fast-generate-001` | Paid plans only |
| Pollinations.ai (fetch) | 403 Forbidden — content filter / CORS block |
| Pollinations.ai (Image tag) | `onerror` with no useful info |

**Decision**: Stayed with HTML/CSS + `html-to-image`. Produces professional, pixel-perfect output with zero quota constraints and reliable PNG export.

## API Key Notes
- Key: `AIzaSyBQksZfC9CkrN6-2ks5tRxLxQZY-nhIC44`
- Free tier: `gemini-2.5-flash` — 20 RPM, resets per minute
- Image generation models: all at 0 free-tier quota or paid-only
- Auto-retry is now built in for 429 errors

## Current Progress
- [x] Auto-load default CSV on startup
- [x] Per-book on-click AI analysis (not bulk)
- [x] localStorage cache for analyzed books
- [x] Full infographic layout (banner, quote, formula, framework, takeaways, mistakes)
- [x] 2× high-res PNG download
- [x] Rate-limit auto-retry
- [x] "Change CSV" nav button

## Future State Plan

### Phase 1 — UX Polish (Next Session)
- [ ] Show a "✓ Analyzed" badge on gallery cards that are already cached
- [ ] Add genre/mood filter chips to the gallery (filter by Fiction, Business, etc.)
- [ ] Add a star rating display on each card from `My Rating` CSV field
- [ ] Improve infographic: add a reading stats bar (pages, year read, personal rating)
- [ ] Dark mode toggle

### Phase 2 — Infographic Quality
- [ ] Let user pick from 3 color themes for the infographic (auto, warm, cool)
- [ ] Add a "Regenerate" button to get a fresh AI analysis for the same book
- [ ] Improve the infographic layout to use the user's **custom prompt template** (timeline, character profile, map, journey flow) — rendered in HTML/CSS, data extracted by Gemini
- [ ] Support portrait vs. landscape export orientation

### Phase 3 — Data & Export
- [ ] Bulk analyze top 10 rated books in one click (with rate-limit queuing)
- [ ] Export all analyzed books as a ZIP of PNGs
- [ ] Share infographic as a link (encode analysis data in URL)

### Phase 4 — Hosting
- [ ] Deploy to GitHub Pages (static, free)
- [ ] Add `VITE_GEMINI_API_KEY` to GitHub Secrets for CI
- [ ] Or: keep as a local tool and ship as an Electron app
