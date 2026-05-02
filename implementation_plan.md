# Goodreads to Infographic — Implementation Plan

## Overview

A standalone, fully client-side React + Vite app that turns a Goodreads reading history CSV into premium, downloadable book infographics powered by the Gemini AI text API.

**No backend. No server costs. No data leaves the browser.**

---

## Current Architecture (Stable)

```
public/goodreads_export.csv
        │
        ▼  Auto-fetched + PapaParse'd on mount
    App.jsx  ──── user clicks book ────▶  geminiService.js
        │                                       │
        │                             gemini-2.5-flash (text)
        │                             returns structured JSON
        │                             saved to localStorage cache
        │                             auto-retries on 429
        │                                       │
        ▼                                       ▼
  BookGallery.jsx                   BookInfographic.jsx
  (searchable card grid)            (HTML/CSS infographic layout)
                                            │
                                    html-to-image (toPng)
                                            │
                                    PNG download (2× pixel ratio)
```

---

## Core Components

### `src/services/geminiService.js`
- `analyzeBook(title, author, bookId)` — calls `gemini-2.5-flash`, returns JSON
- `localStorage` cache keyed by `bookId` — persists across sessions
- `callGemini()` helper — handles 429 with auto-retry using API-suggested delay

### `src/components/BookInfographic.jsx`
Renders the full infographic as HTML/CSS with inline styles (for reliable `html-to-image` capture):
- **Banner**: colored header, title, author, book icon
- **Quote + Formula bar**: key quote with left accent, formula with top border
- **Framework table**: 4-column table with emoji icons and alternating rows
- **5 Key Takeaways**: pastel color-coded boxes (pink/blue/purple/yellow/orange)
- **5 Mistakes**: red-tinted cards with ❌ wrong / ✅ right approach
- **Footer**: dark bar with branding

### `src/components/BookGallery.jsx`
- Responsive grid (1→2→3→4 columns)
- Real-time search by title or author
- Staggered entrance animation
- `onBookSelect` callback — triggers analysis in `App.jsx`

### `src/App.jsx`
- Fetches `public/goodreads_export.csv` on mount via `fetch()` + PapaParse
- "Change CSV" nav button — hidden `<input type=file>` ref
- Analysis modal with loading/error/success states
- Hardcoded `SAMPLE` data for instant preview (no API call)

---

## Data Flow: Gemini JSON Schema

```json
{
  "quote": "string",
  "formula": "string",
  "bannerColor": "#hexcode",
  "framework": {
    "title": "string",
    "columns": ["c1", "c2", "c3", "c4"],
    "rows": [{ "icon": "emoji", "cells": ["v","v","v","v"] }]
  },
  "takeaways": [{ "headline": "string", "explanation": "string", "icon": "emoji" }],
  "mistakes": [{ "wrong": "string", "right": "string" }]
}
```

---

## Image Generation — Attempted & Blocked

> All options were explored. The HTML/CSS approach was chosen as the definitive solution.

| Service | Model | Outcome |
|---|---|---|
| Gemini API | `gemini-2.0-flash-preview-image-generation` | Model not found (v1beta) |
| Gemini API | `gemini-2.5-flash-image` | Free quota = 0 |
| Google | `imagen-4.0-fast-generate-001` | Paid only |
| Pollinations.ai | Flux via fetch() | 403 Forbidden |
| Pollinations.ai | Flux via Image() tag | Silent onerror, no CORS |

**Verdict**: HTML/CSS rendering via `html-to-image` produces professional, pixel-perfect, text-accurate infographics with no quota, no cost, and reliable 2× PNG export.

---

## Future Roadmap

### Phase 1 — UX Polish
- "✓ Analyzed" badge on cached gallery cards
- Genre/mood filter chips (Fiction, Business, Mystery…)
- Star rating display from Goodreads `My Rating` field
- Reading stats bar in infographic (year read, personal rating)
- Dark mode

### Phase 2 — Infographic Quality
- Color theme picker (auto / warm / cool) per infographic
- "Regenerate" button to get a fresh analysis
- Richer layout using user's custom prompt template:
  - Historical timeline of plot events
  - Main character profile
  - Character trio / factions
  - Location cross-section map
  - Journey/trial flow at the bottom
  *(All rendered in HTML/CSS, content extracted by Gemini)*
- Portrait vs. landscape export toggle

### Phase 3 — Data & Export
- Bulk analyze top-rated books with rate-limit queue
- Export all as ZIP of PNGs
- Shareable link (analysis encoded in URL params)

### Phase 4 — Hosting
- Deploy to GitHub Pages (static, zero cost)
- `.env.example` for API key setup
- Consider Electron packaging for offline use
