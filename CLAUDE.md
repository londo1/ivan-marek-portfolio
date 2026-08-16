# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # dev server, http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint . (flat config, eslint-config-next core-web-vitals)
npm run typecheck  # tsc --noEmit
```

Requires Node 20+. **There is no test suite.** `npm run typecheck` is the
primary correctness check — always run it after editing, because the i18n
layer encodes most of its invariants in the type system (see below) and a
missed translation key is a compile error, not a runtime one.

## Architecture

Next.js 16 App Router, TypeScript, no CSS framework — plain CSS custom
properties in `app/globals.css`. Every page is a Server Component. The only
Client Components (`"use client"`) are `components/Header.tsx` and
`components/ThemeToggle.tsx`.

### Locale routing

Every page lives under `app/[locale]/`, and **every URL carries a locale
segment** (`/en/gallery`, `/bg/gallery`). This is deliberate: it makes each
language a distinct, crawlable URL rather than a cookie-only client switch.

- `proxy.ts` redirects unprefixed requests to a negotiated locale —
  `locale` cookie → `Accept-Language` header → `DEFAULT_LOCALE`. Its matcher
  skips `_next`, `api`, `favicon.ico`, and anything with a file extension.
  (This is the file convention formerly called `middleware.ts`; Next 16
  renamed it, and the exported function is now `proxy`.)
- `lib/i18n.ts` is the source of truth: `LOCALES` (`en`, `bg`),
  `DEFAULT_LOCALE` (`bg`), `ROUTES`, and `localizedPath(locale, route)`.
- Route slugs in `ROUTES` are locale-independent by design — only the locale
  segment changes, never the slug.

### Copy lives in dictionaries, not components

All translatable text is in `lib/dictionaries/{en,bg}.ts`, typed by
`Dictionary` in `lib/dictionaries/types.ts` and retrieved with
`getDictionary(locale)`. Pages take `params.locale`, pull their slice of the
dictionary, and render from it. Never hardcode user-facing strings in a
component.

`Dictionary["nav"]` is `Record<Route, string>`, so `ROUTES` and the nav labels
are kept in sync by the compiler — add a route and both dictionaries fail to
typecheck until you add its label.

### Adding a route — the full ritual

`ROUTES` is load-bearing; four things derive from it. Missing a step is
usually a type error, but not always:

1. Add the slug to `ROUTES` in `lib/i18n.ts`.
2. Create `app/[locale]/<slug>/page.tsx`.
3. Add the `nav` label **and** the page's copy section to *both*
   `lib/dictionaries/en.ts` and `bg.ts`, plus the section's shape in
   `types.ts`.
4. Export `generateMetadata` from the page, built with `pageMetadata()` from
   `lib/seo.ts` — this is the step the compiler will *not* catch, and skipping
   it silently drops the page's canonical + hreflang tags.

`app/sitemap.ts` and `app/robots.ts` derive from `ROUTES`/`LOCALES`
automatically — no edit needed.

Every page and the layout must `notFound()` on a non-locale `params.locale`
before using it; that guard is what narrows `string` to `Locale`.

### SSR theme switching

Two themes, `minimal` and `cinematic`, scoped via `[data-theme="…"]` blocks in
`app/globals.css`:

- `app/[locale]/layout.tsx` reads the `theme` cookie server-side (`cookies()`
  from `next/headers`) via `normalizeTheme()` and stamps `data-theme` on
  `<html>`, so the correct palette is in the first HTML response (no flash of
  wrong theme).
- `components/ThemeToggle.tsx` flips `document.documentElement.dataset.theme`
  on click for an instant client-side switch and writes the `theme` cookie so
  the next server render matches.
- Adding a third theme = another `[data-theme="…"]` block in `globals.css`
  plus an entry in `lib/theme.ts`.

**Gotcha:** `THEMES` and `DEFAULT_THEME` in `lib/theme.ts` are currently dead
exports, and `DEFAULT_THEME` (`"cinematic"`) contradicts the real fallback —
`normalizeTheme()` returns `"minimal"` for anything that isn't exactly
`"cinematic"`. Trust `normalizeTheme()`, not `DEFAULT_THEME`. Don't
reconcile them without asking; which theme is the default is a design call.

### SEO

`lib/seo.ts` exposes `pageMetadata(locale, route, title, description?)`,
which builds the canonical URL plus an hreflang entry per locale and an
`x-default`. `SITE_URL` in `lib/i18n.ts` is a placeholder
(`https://ivanmarek.photo`) overridable via `NEXT_PUBLIC_SITE_URL`.

### Content/data seam

`lib/data.ts` holds only **language-independent** visuals — `PHOTOS`,
`SELECTED_PHOTOS`, `JOURNAL_PHOTOS`, `GALLERY` — indexed in the same order
the dictionary entries expect (e.g. `SELECTED_PHOTOS[i]` pairs with
`dict.home.seriesCats[i]`, `JOURNAL_PHOTOS[i]` with `dict.journal.posts[i]`).
Reordering one side without the other silently mismatches captions to images.
This module is the intended CMS integration point.

### Placeholder imagery

There are no real photo assets yet. Every `Photo` is a CSS gradient
(`Photo.grad`) rendered as a plain `<div>` with an inline `background`, in
`components/Reel.tsx` and `components/PhotoGrid.tsx`. Going live means giving
`Photo` a real `src`/`width`/`height` and swapping those `<div>` tiles for
`next/image` `<Image>` (comments in those files mark exactly where).

### Fonts

Archivo (body/UI), Instrument Serif (display headings), Space Mono (mono
labels/kickers), loaded via `next/font/google` and exposed as CSS variables
(`--font-archivo`, `--font-serif`, `--font-mono`) set on `<html>` in
`app/[locale]/layout.tsx`.

### Not yet wired

The contact form (`app/[locale]/contact/page.tsx`) is presentational only —
no Server Action or endpoint behind it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
