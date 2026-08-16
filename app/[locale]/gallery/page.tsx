import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoGrid from "@/components/PhotoGrid";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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

  return (
    <main className="page">
      <div className="gallery__head">
        <div>
          <h1 className="display page__title">{gallery.title}</h1>
          <p className="gallery__sub">{gallery.sub}</p>
        </div>
        <span className="gallery__count">{gallery.count}</span>
      </div>

      <PhotoGrid />

      <div className="cms-note">
        <span className="cms-note__dot" />
        <span className="cms-note__text">{gallery.cmsNote}</span>
      </div>
    </main>
  );
}
