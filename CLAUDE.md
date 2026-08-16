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

The Studio is a separate app in `../studio-photography` with its own commands
(see its README) — including `npm run typegen`, which regenerates this repo's
`sanity.types.ts`.

Requires Node 20+. **There is no test suite.** `npm run typecheck` is the
primary correctness check — always run it after editing, because the i18n
layer and the CMS queries both encode their invariants in the type system (see
below): a missed translation key or a renamed Sanity field is a compile error,
not a runtime one.

`.env.local` holds `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
and `SANITY_REVALIDATE_SECRET`; the same three must exist in the Vercel project.

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

**UI chrome** — nav labels, buttons, form placeholders, section headings,
aria-labels, empty states — is in `lib/dictionaries/{en,bg}.ts`, typed by
`Dictionary` in `lib/dictionaries/types.ts` and retrieved with
`getDictionary(locale)`. Pages take `params.locale`, pull their slice of the
dictionary, and render from it. Never hardcode user-facing strings in a
component.

**Editorial content** — prose, photographs and their captions, journal
entries, contact details, per-page SEO copy — is in Sanity instead, so the
photographer can change it without a deploy. See "Content from Sanity" below.
The dividing line: if a redesign would rewrite it, it's chrome; if only the
photographer would rewrite it, it's content.

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

Gallery categories are **not** routes. `/[locale]/gallery/[category]` is one
page whose slugs come from Sanity, reached through the optional `subPath`
argument on `localizedPath()` and `pageMetadata()`. That's what keeps `Route` a
closed union — and `Dictionary["nav"]` a compile-time check — while still
generating canonical and hreflang tags for CMS-driven URLs.

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

`lib/seo.ts` exposes `pageMetadata(locale, route, title, description?, subPath?)`,
which builds the canonical URL plus an hreflang entry per locale and an
`x-default`. About and contact take their title and description from Sanity
when set, falling back to the dictionary. `SITE_URL` in `lib/i18n.ts` is a placeholder
(`https://ivanmarek.photo`) overridable via `NEXT_PUBLIC_SITE_URL`.

### Content from Sanity

Content lives in Sanity project `sk3ctpa6`, dataset `production`, edited in a
**standalone Studio** at `../studio-photography` (deployed to
`sk3ctpa6.sanity.studio`). Nothing Studio-side is imported here — the app only
reads.

- `lib/sanity/client.ts` — the read client (`useCdn`, `perspective: "published"`,
  pinned `apiVersion`).
- `lib/sanity/image.ts` — `urlFor` / `squareUrl` / `heightUrl`, hotspot-aware.
- `lib/sanity/queries.ts` — every GROQ query, and the only place GROQ appears.
- `lib/data.ts` — the seam. Pages call its async fetchers
  (`getGalleryPhotos`, `getSiteSettings`, `getJournalPosts`, `getAboutPage`, …);
  components take the result as props and stay Server Components.
- `sanity.types.ts` — **generated**, do not edit. Run `npm run typegen` in
  `../studio-photography` after any schema or query change, then `npm run
  typecheck` here. A renamed CMS field becomes a compile error, the same way a
  missing translation key does.

**Bilingual fields** are `{ en, bg }` objects, resolved inside GROQ with
`select($locale == "bg" => coalesce(f.bg, f.en), f.en)`. The expression is
written out per field on purpose: TypeGen only reads plain string literals, so
a helper interpolating into the query template would cost the generated types.

**Revalidation.** Each fetch is tagged with the document types it reads;
`app/api/revalidate/route.ts` verifies the Sanity webhook and calls
`revalidateTag(_type, "max")`, so publishing goes live in seconds without a
redeploy. `export const revalidate = 3600` on each page is the fallback if a
webhook is ever missed.

**Everything is server-rendered per request**, not prerendered: the layout
reads the `theme` cookie (see SSR theme switching), which rules out static
generation app-wide. Don't add `generateStaticParams` to a page under
`app/[locale]/` — it fails with `DYNAMIC_SERVER_USAGE`. Speed comes from the
tagged fetch cache, not from prerendering. `app/sitemap.ts` is the exception
that still prerenders, and it pulls category slugs from Sanity.

### Imagery

Every image is a real photograph from Sanity's CDN, rendered with `next/image`
and `placeholder="blur"` fed by the asset's LQIP data URI. Tiles are fixed
shapes (square, 4:5, fixed height) and the photographs are not, so the crop is
hotspot-aware — the focal point is set per photo in the Studio. `.tile__img` in
`globals.css` is the shared fill/`object-fit` rule; `cdn.sanity.io` is
allow-listed in `next.config.mjs`.

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
