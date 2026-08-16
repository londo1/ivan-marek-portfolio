// Locale routing config — every page lives under app/[locale]/, with
// proxy.ts redirecting unprefixed requests to the negotiated locale.
// This (rather than a cookie-only switch) is what makes each language a
// distinct, crawlable URL that Google can index and hreflang-link together.

export const LOCALES = ["en", "bg"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "bg";
export const LOCALE_COOKIE = "locale";

// Locale-independent route slugs. Kept unprefixed by design — only the
// locale segment changes (/en/gallery, /bg/gallery), not the slug itself.
export const ROUTES = ["/", "/gallery", "/journal", "/about", "/contact"] as const;
export type Route = (typeof ROUTES)[number];

// Placeholder production origin, used to build absolute canonical/hreflang
// URLs. Override with NEXT_PUBLIC_SITE_URL once the real domain is live.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivanmarek.photo";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

// `subPath` is for URLs that hang off a route but aren't routes themselves —
// gallery categories, whose slugs come from the CMS (/en/gallery/portraits).
// Keeping it a separate argument is what lets `Route` stay a closed union, so
// `Dictionary["nav"] = Record<Route, string>` still catches a missing nav label
// at compile time.
export function localizedPath(locale: Locale, route: Route, subPath?: string): string {
  const base = route === "/" ? `/${locale}` : `/${locale}${route}`;
  return subPath ? `${base}/${subPath}` : base;
}
