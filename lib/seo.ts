import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, Locale, Route, SITE_URL, localizedPath } from "@/lib/i18n";

// Shared alternates block for a given route: canonical for the current
// locale, plus an hreflang entry per locale and an x-default fallback — the
// three signals search engines need to index and cross-link the language
// versions instead of treating them as duplicate content.
export function pageMetadata(
  locale: Locale,
  route: Route,
  title: string,
  description?: string
): Metadata {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}${localizedPath(l, route)}`;
  }
  languages["x-default"] = `${SITE_URL}${localizedPath(DEFAULT_LOCALE, route)}`;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: `${SITE_URL}${localizedPath(locale, route)}`,
      languages,
    },
  };
}
