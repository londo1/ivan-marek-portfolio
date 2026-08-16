import type { MetadataRoute } from "next";
import { getCategorySlugs } from "@/lib/data";
import {
  DEFAULT_LOCALE,
  LOCALES,
  ROUTES,
  SITE_URL,
  localizedPath,
  type Locale,
  type Route,
} from "@/lib/i18n";

function entry(locale: Locale, route: Route, subPath?: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${localizedPath(locale, route, subPath)}`,
    alternates: {
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, `${SITE_URL}${localizedPath(l, route, subPath)}`]),
        ["x-default", `${SITE_URL}${localizedPath(DEFAULT_LOCALE, route, subPath)}`],
      ]),
    },
  };
}

// Static routes still derive from ROUTES; gallery categories come from Sanity,
// which is why this is now async.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categorySlugs = await getCategorySlugs();

  return [
    ...ROUTES.flatMap((route) => LOCALES.map((locale) => entry(locale, route))),
    ...categorySlugs.flatMap((slug) => LOCALES.map((locale) => entry(locale, "/gallery", slug))),
  ];
}
