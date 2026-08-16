import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reel from "@/components/Reel";
import { getAboutPage, getSiteSettings } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath, Locale } from "@/lib/i18n";
import { squareUrl } from "@/lib/sanity/image";
import { pageMetadata } from "@/lib/seo";

// Belt and braces behind the Sanity webhook: even a missed revalidation call
// leaves nothing more than an hour stale.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/", dict.meta.title, dict.meta.description);
}

const TILE_SOURCE = 900;

export default async function WorkPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { home } = getDictionary(locale);
  const [{ reelPhotos, selectedSeries }, about] = await Promise.all([
    getSiteSettings(locale),
    getAboutPage(locale),
  ]);

  return (
    <main>
      <section className="hero">
        <div className="kicker">{home.kicker}</div>
        <h1 className="display hero__title">{home.title}</h1>
        <p className="hero__lead">{home.lead}</p>
      </section>

      <Reel photos={reelPhotos} ariaLabel={home.reelAriaLabel} />

      {selectedSeries.length > 0 && (
        <section className="selected">
          <div className="selected__head">
            <h2 className="display selected__title">{home.selectedTitle}</h2>
            <Link href={localizedPath(locale, "/gallery")} className="link-btn">
              {home.viewAll}
            </Link>
          </div>
          <div className="selected__grid">
            {selectedSeries.map((series, i) => (
              // Each tile carries its own image and label as one object now, so
              // there is no index pairing between a photo list and a label list
              // to keep in sync.
              <Link
                key={series.id}
                href={localizedPath(locale, "/gallery", series.slug)}
                className="selected__item"
              >
                <div className="selected__tile">
                  {series.coverPhoto && (
                    <Image
                      className="tile__img"
                      src={squareUrl(series.coverPhoto.image, TILE_SOURCE)}
                      alt={series.coverPhoto.alt}
                      width={TILE_SOURCE}
                      height={TILE_SOURCE}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder={series.coverPhoto.lqip ? "blur" : "empty"}
                      blurDataURL={series.coverPhoto.lqip ?? undefined}
                    />
                  )}
                </div>
                <div className="selected__meta">
                  <span className="selected__cat">{series.title}</span>
                  <span className="selected__num">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="about-strip">
        <div className="about-strip__inner">
          <div className="about-strip__portrait">
            {about?.portrait && (
              <Image
                className="tile__img"
                src={squareUrl(about.portrait.image, TILE_SOURCE)}
                alt={about.portrait.alt}
                width={TILE_SOURCE}
                height={TILE_SOURCE}
                sizes="(max-width: 900px) 100vw, 40vw"
                placeholder={about.portrait.lqip ? "blur" : "empty"}
                blurDataURL={about.portrait.lqip ?? undefined}
              />
            )}
          </div>
          <div>
            <div className="kicker" style={{ marginBottom: 20 }}>
              {home.aboutKicker}
            </div>
            <p className="display about-strip__title">{home.aboutTitle}</p>
            <p className="about-strip__text">{home.aboutText}</p>
            <Link href={localizedPath(locale, "/contact")} className="cta">
              {home.cta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
