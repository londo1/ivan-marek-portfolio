# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # dev server, http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint
```

Requires Node 18.17+. There is no test suite configured.

## Architecture

Next.js 14 App Router, TypeScript, no CSS framework — plain CSS custom
properties in `app/globals.css`. Every page is a Server Component except
`components/Header.tsx` and `components/ThemeToggle.tsx`, which are the only
two Client Components (`"use client"`) in the codebase.

**Routes** (`app/*/page.tsx`): `/` (landing — hero, `Reel`, selected series,
about strip), `/gallery` (`PhotoGrid`), `/journal`, `/about`, `/contact`.

**SSR theme switching** — the site has two themes, `minimal` and `cinematic`,
defined in `lib/theme.ts` and scoped via `[data-theme="…"]` blocks in
`app/globals.css`:
- `app/layout.tsx` reads the `theme` cookie server-side (`cookies()` from
  `next/headers`) via `normalizeTheme()` and stamps `data-theme` on `<html>`,
  so the correct palette is in the first HTML response (no flash of wrong
  theme).
- `components/ThemeToggle.tsx` flips `document.documentElement.dataset.theme`
  on click for an instant client-side switch and writes the `theme` cookie so
  the next server render matches.
- Adding a third theme = another `[data-theme="…"]` block in `globals.css`
  plus an entry in `lib/theme.ts`.

**Content/data seam** — `lib/data.ts` is the single place holding all site
content (`PHOTOS`, `SELECTED`, `JOURNAL`, `GALLERY`, `NAV`) and is the
intended integration point for a future CMS: fetch in a Server Component and
map records into the existing `Photo`/`JournalPost` shapes.

**Placeholder imagery** — there are no real photo assets yet. Every `Photo`
is a CSS gradient (`Photo.grad` field) rendered as a plain `<div>` with an
inline `background`, in `components/Reel.tsx` and `components/PhotoGrid.tsx`.
Going live means giving `Photo` a real `src`/`width`/`height` and swapping
those `<div>` tiles for `next/image` `<Image>` (comments in those files mark
exactly where).

**Fonts** — Archivo (body/UI), Instrument Serif (display headings), Space
Mono (mono labels/kickers), loaded via `next/font/google` and exposed as CSS
variables (`--font-archivo`, `--font-serif`, `--font-mono`) set on `<html>`
in `app/layout.tsx`.

**Contact form** (`app/contact/page.tsx`) is presentational only — not wired
to a Server Action or endpoint.
