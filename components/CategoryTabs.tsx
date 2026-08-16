import Link from "next/link";
import type { Category } from "@/lib/data";
import { localizedPath, type Locale } from "@/lib/i18n";

// Category chips above the gallery wall.
//
// Deliberately a Server Component: each chip is a real <Link> to a real URL,
// and the page tells us which one is active rather than the component reading
// usePathname(). That keeps every category server-rendered and crawlable, and
// App Router prefetching still makes switching feel instant.
export default function CategoryTabs({
  locale,
  categories,
  activeSlug,
  allLabel,
  ariaLabel,
}: {
  locale: Locale;
  categories: Category[];
  /** Undefined on /gallery itself, where the "All" chip is the active one. */
  activeSlug?: string;
  allLabel: string;
  ariaLabel: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav className="tabs" aria-label={ariaLabel}>
      <Link
        href={localizedPath(locale, "/gallery")}
        className={`tab${activeSlug ? "" : " tab--active"}`}
        aria-current={activeSlug ? undefined : "page"}
      >
        {allLabel}
      </Link>
      {categories.map((category) => {
        const active = category.slug === activeSlug;
        return (
          <Link
            key={category.id}
            href={localizedPath(locale, "/gallery", category.slug)}
            className={`tab${active ? " tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {category.title}
          </Link>
        );
      })}
    </nav>
  );
}
