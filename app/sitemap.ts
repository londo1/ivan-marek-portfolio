import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES, ROUTES, SITE_URL, localizedPath } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${localizedPath(locale, route)}`,
      alternates: {
        languages: Object.fromEntries([
          ...LOCALES.map((l) => [l, `${SITE_URL}${localizedPath(l, route)}`]),
          ["x-default", `${SITE_URL}${localizedPath(DEFAULT_LOCALE, route)}`],
        ]),
      },
    }))
  );
}
