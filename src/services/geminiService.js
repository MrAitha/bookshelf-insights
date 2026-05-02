const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const CACHE_PREFIX = 'bsi_analysis_';

function getCached(bookId) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + bookId);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setCache(bookId, data) {
  try { localStorage.setItem(CACHE_PREFIX + bookId, JSON.stringify(data)); }
  catch { /* storage full — skip */ }
}

async function callGemini(prompt) {
  const response = await fetch(TEXT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: 'application/json', temperature: 0.7 },
    }),
  });

  if (response.status === 429) {
    const err = await response.json();
    const msg = err?.error?.message || '';
    // Parse "Please retry in Xs" from the error message
    const match = msg.match(/retry in (\d+(\.\d+)?)s/i);
    const waitSec = match ? Math.ceil(parseFloat(match[1])) + 1 : 20;
    await new Promise(r => setTimeout(r, waitSec * 1000));
    // Single retry
    const retry = await fetch(TEXT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: 'application/json', temperature: 0.7 },
      }),
    });
    if (!retry.ok) {
      const retryErr = await retry.json();
      throw new Error(retryErr?.error?.message || `API error ${retry.status}`);
    }
    return retry;
  }

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  return response;
}

export async function analyzeBook(title, author, bookId) {
  if (bookId) {
    const cached = getCached(bookId);
    if (cached) return cached;
  }

  const prompt = `Create professional book summary infographic data for "${title}" by ${author}.
Return ONLY this JSON structure, no markdown:
{
  "quote": "One iconic quote from the book",
  "formula": "Key concept as a formula e.g. Success = Habit x Time",
  "bannerColor": "#hexcode matching the book theme (rich, professional color)",
  "framework": {
    "title": "The [Name] Framework",
    "columns": ["Column1", "Column2", "Column3", "Column4"],
    "rows": [
      { "icon": "emoji", "cells": ["val","val","val","val"] },
      { "icon": "emoji", "cells": ["val","val","val","val"] },
      { "icon": "emoji", "cells": ["val","val","val","val"] },
      { "icon": "emoji", "cells": ["val","val","val","val"] }
    ]
  },
  "takeaways": [
    { "headline": "Short Headline", "explanation": "2-3 sentences.", "icon": "emoji" },
    { "headline": "Short Headline", "explanation": "2-3 sentences.", "icon": "emoji" },
    { "headline": "Short Headline", "explanation": "2-3 sentences.", "icon": "emoji" },
    { "headline": "Short Headline", "explanation": "2-3 sentences.", "icon": "emoji" },
    { "headline": "Short Headline", "explanation": "2-3 sentences.", "icon": "emoji" }
  ],
  "mistakes": [
    { "wrong": "Wrong approach", "right": "Right approach" },
    { "wrong": "Wrong approach", "right": "Right approach" },
    { "wrong": "Wrong approach", "right": "Right approach" },
    { "wrong": "Wrong approach", "right": "Right approach" },
    { "wrong": "Wrong approach", "right": "Right approach" }
  ]
}`;

  const response = await callGemini(prompt);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini.');

  const result = JSON.parse(text);
  if (bookId) setCache(bookId, result);
  return result;
}

/* ── Artistic infographic image via Pollinations.ai (free, no key) ── */
const imageCache = new Map();

export async function generateArtisticInfographic(title, author, bookId) {
  const cacheKey = `artistic_${bookId || title}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const seed = bookId
    ? Math.abs([...String(bookId)].reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0)) % 999999
    : Math.floor(Math.random() * 999999);

  const prompt = `Horizontal educational infographic for book '${title}' by ${author}. `
    + `Professional graphic design styled to match the book's genre theme (grimoire for fantasy, data terminal for sci-fi, weathered journal for historical). `
    + `Sections: (1) historical timeline of key plot events with icons, (2) main character profile with traits and conflicts, `
    + `(3) character trio or key factions with portraits, (4) cross-section map of a key location with labels, `
    + `(5) linear journey/trial progression at the bottom showing sequential obstacles. `
    + `High quality illustration style matching the genre. Vibrant harmonious colors. Legible English text throughout.`;

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1400&height=900&model=flux&seed=${seed}&nologo=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Pollinations error ${res.status}: ${res.statusText}`);
    const blob = await res.blob();
    if (blob.size < 1000) throw new Error('Invalid image returned. Try again.');
    const blobUrl = URL.createObjectURL(blob);
    imageCache.set(cacheKey, blobUrl);
    return blobUrl;
  } catch (err) {
    throw new Error(`Image generation failed: ${err.message}`);
  }
}

