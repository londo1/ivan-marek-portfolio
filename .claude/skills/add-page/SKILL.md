---
name: add-page
description: Add a new localized route to the portfolio — creates the page under app/[locale]/, wires the slug into ROUTES, and adds nav labels plus a copy section to both the en and bg dictionaries. Use whenever a new page/route/section is requested (e.g. "add a /prints page", "add a services route").
---

# Adding a localized route

Every URL on this site carries a locale segment and every user-facing string
lives in a dictionary. A new route is therefore never just a new `page.tsx` —
it touches five files. `ROUTES` in `lib/i18n.ts` is load-bearing; the nav, the
sitemap, and both dictionaries derive from it.

Ask the user for the slug and the English copy if not given. **Write Bulgarian
copy yourself** — don't leave `TODO` placeholders or copy the English through;
`bg` is the `DEFAULT_LOCALE`, so untranslated strings are what most visitors
see first. If you are unsure of a term, translate it and flag the specific
line for the user to check.

## Steps

### 1. `lib/i18n.ts` — add the slug to `ROUTES`

```ts
export const ROUTES = ["/", "/gallery", "/journal", "/about", "/contact", "/prints"] as const;
```

Order here is nav order — the header renders `ROUTES` in sequence. Put the
slug where it belongs in the menu, not always at the end.

### 2. `lib/dictionaries/types.ts` — declare the copy shape

Add a section to the `Dictionary` type describing the page's strings:

```ts
prints: {
  metaTitle: string;
  title: string;
  lead: string;
};
```

Follow the existing convention: every page section has a `metaTitle` (used for
`<title>`) separate from the on-page `title`.

### 3. Both dictionaries — nav label + copy

In **`en.ts` and `bg.ts` alike**, add the `nav` entry and the new section.
`nav` is `Record<Route, string>`, so both files stop compiling until the label
exists in each:

```ts
nav: { …, "/prints": "Prints" },   // en.ts
nav: { …, "/prints": "Отпечатъци" }, // bg.ts
```

### 4. `app/[locale]/<slug>/page.tsx` — the page

Copy the structure from `app/[locale]/gallery/page.tsx`. Two things are
mandatory:

- **`notFound()` on a bad locale** before using `params.locale` — this guard is
  what narrows `string` to `Locale`.
- **`generateMetadata` built with `pageMetadata()`** from `lib/seo.ts`. This is
  the one step the compiler will *not* catch, and skipping it silently drops
  the page's canonical and hreflang tags.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  return pageMetadata(params.locale, "/prints", dict.prints.metaTitle, dict.prints.lead);
}

export default function PrintsPage({ params }: { params: { locale: Locale } }) {
  const { prints } = getDictionary(params.locale);

  return (
    <main className="page">
      <h1 className="display page__title">{prints.title}</h1>
      <p>{prints.lead}</p>
    </main>
  );
}
```

### 5. Styling

There is no CSS framework. Reuse existing classes from `app/globals.css`
(`page`, `page__title`, `display`, …) before inventing new ones. Any genuinely
new class goes in `globals.css` and must be defined for **both**
`[data-theme="minimal"]` and `[data-theme="cinematic"]` if it carries colour.

### 6. Verify

```bash
npm run typecheck
```

Nothing to do for `app/sitemap.ts` or `app/robots.ts` — both derive from
`ROUTES`/`LOCALES` automatically.

## Checklist

- [ ] Slug in `ROUTES`, positioned for nav order
- [ ] Section added to `Dictionary` in `types.ts`
- [ ] `nav` label + copy section in `en.ts`
- [ ] `nav` label + copy section in `bg.ts`, actually translated
- [ ] `page.tsx` with `notFound()` guard
- [ ] `generateMetadata` via `pageMetadata()` — the compiler won't remind you
- [ ] `npm run typecheck` clean
