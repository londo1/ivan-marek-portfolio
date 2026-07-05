import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoGrid from "@/components/PhotoGrid";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  return pageMetadata(params.locale, "/gallery", dict.gallery.metaTitle, dict.gallery.sub);
}

export default function GalleryPage({ params }: { params: { locale: Locale } }) {
  const { gallery } = getDictionary(params.locale);

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
