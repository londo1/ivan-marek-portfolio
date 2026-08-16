import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryTabs from "@/components/CategoryTabs";
import PhotoGrid from "@/components/PhotoGrid";
import { getCategories, getCategory, getGalleryPhotos } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

// No generateStaticParams here, deliberately. The layout reads the `theme`
// cookie to render the right palette in the first HTML response, which makes
// every page in this app server-rendered per request — prerendering a category
// would fail with DYNAMIC_SERVER_USAGE. What keeps it fast is the data layer:
// the Sanity fetches are cached and tagged (see lib/data.ts), so a request
// costs a render, not a round trip to the CMS.
//
// The slugs still reach the sitemap via getCategorySlugs() in app/sitemap.ts.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category: slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const category = await getCategory(locale, slug);
  if (!category) notFound();

  return pageMetadata(
    locale,
    "/gallery",
    `${category.title} — ${dict.gallery.metaTitle}`,
    category.description ?? dict.gallery.sub,
    category.slug
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category: slug } = await params;
  const { gallery } = getDictionary(locale);

  const category = await getCategory(locale, slug);
  if (!category) notFound();

  const [photos, categories] = await Promise.all([
    getGalleryPhotos({ locale, category }),
    getCategories(locale),
  ]);

  return (
    <main className="page">
      <div className="gallery__head">
        <div>
          <h1 className="display page__title">{category.title}</h1>
          <p className="gallery__sub">{category.description ?? gallery.sub}</p>
        </div>
        <span className="gallery__count">
          {gallery.count.replace("{count}", String(photos.length))}
        </span>
      </div>

      <CategoryTabs
        locale={locale}
        categories={categories}
        activeSlug={category.slug}
        allLabel={gallery.all}
        ariaLabel={gallery.tabsAriaLabel}
      />

      <PhotoGrid photos={photos} emptyLabel={gallery.empty} />
    </main>
  );
}
