# Ivan Hristov — Photographer Portfolio (Next.js, SSR)

A server-rendered React portfolio site with a **switchable theme** (Minimal /
Gallery-White ↔ Cinematic / Dark). Built with the Next.js App Router.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production
```

Requires Node 18.17+.

## What's inside

| Route        | File                       | Purpose                                            |
| ------------ | -------------------------- | -------------------------------------------------- |
| `/`          | `app/page.tsx`             | Landing — hero, auto-scrolling reel, selected series, about strip |
| `/gallery`   | `app/gallery/page.tsx`     | Uniform square grid (the CMS-fed "all photos" wall) |
| `/journal`   | `app/journal/page.tsx`     | Writing list                                        |
| `/about`     | `app/about/page.tsx`       | Bio + services                                      |
| `/contact`   | `app/contact/page.tsx`     | Inquiry form + studio details                       |

Shared UI lives in `components/` (`Header`, `Footer`, `ThemeToggle`, `Reel`,
`PhotoGrid`). Content and placeholder imagery are in `lib/data.ts`. Theme
constants are in `lib/theme.ts`.

## How the SSR theming works

- The two themes are plain **CSS custom properties**, scoped by
  `[data-theme="minimal"]` / `[data-theme="cinematic"]` in `app/globals.css`.
- On every request, the server reads a `theme` **cookie** in `app/layout.tsx`
  (`cookies()` from `next/headers`) and stamps `data-theme` on `<html>`. The
  correct palette is therefore in the **first HTML response** — no flash of the
  wrong theme.
- `components/ThemeToggle.tsx` (a small Client Component) flips the attribute on
  `<html>` for an instant, no-reload switch **and** writes the cookie so the
  next server render matches. All other components stay Server Components.

Because theming is 100% CSS variables, adding a third theme is just another
`[data-theme="…"]` block plus an entry in `lib/theme.ts`.

## Placeholder imagery → real photos / CMS

Every photo is currently a CSS gradient (`Photo.grad` in `lib/data.ts`) so the
layout is reviewable without assets. To go live:

1. Give each `Photo` a real `src` (and `width`/`height`).
2. Swap the plain `<div>` tiles in `components/Reel.tsx` and
   `components/PhotoGrid.tsx` for `next/image` `<Image>` (see the inline
   comments marking exactly where).
3. Point `GALLERY` / `PHOTOS` at your CMS. `lib/data.ts` is the single
   integration seam — fetch the library (Sanity, Contentful, a headless setup,
   etc.) in a Server Component and map records into the `Photo` shape. Because
   pages are server-rendered, new uploads appear on next request with no
   redeploy (add `revalidate` / on-demand revalidation to taste).

## Design tokens

| Token           | Minimal   | Cinematic |
| --------------- | --------- | --------- |
| `--bg`          | `#f3efe7` | `#111214` |
| `--panel`       | `#ffffff` | `#17191d` |
| `--fg`          | `#1b1917` | `#ece6db` |
| `--muted`       | `#736b5f` | `#8b857a` |
| `--line`        | `#e2dccf` | `#2a2d33` |
| `--accent`      | `#1b1917` | `#d68a4c` |
| Display face    | Instrument Serif 400 | Archivo 800, uppercase |

Body/UI face is **Archivo**; mono labels use **Space Mono**. Fonts are loaded
with `next/font/google` (self-hosted at build, no layout shift).

## Notes

- The contact form is presentational — wire it to a Server Action or form
  endpoint before shipping.
- This project mirrors the HTML design prototype reviewed in the design tool;
  it is production-oriented React, not a copy of the prototype's runtime.
