import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryTabs from "@/components/CategoryTabs";
import PhotoGrid from "@/components/PhotoGrid";
import { getCategories, getGalleryPhotos } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/gallery", dict.gallery.metaTitle, dict.gallery.sub);
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { gallery } = getDictionary(locale);
  const [photos, categories] = await Promise.all([
    getGalleryPhotos({ locale }),
    getCategories(locale),
  ]);

  return (
    <main className="page">
      <div className="gallery__head">
        <div>
          <h1 className="display page__title">{gallery.title}</h1>
          <p className="gallery__sub">{gallery.sub}</p>
        </div>
        <span className="gallery__count">
          {gallery.count.replace("{count}", String(photos.length))}
        </span>
      </div>

      <CategoryTabs
        locale={locale}
        categories={categories}
        allLabel={gallery.all}
        ariaLabel={gallery.tabsAriaLabel}
      />

      <PhotoGrid photos={photos} emptyLabel={gallery.empty} />
    </main>
  );
}
