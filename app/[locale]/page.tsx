import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reel from "@/components/Reel";
import { SELECTED_PHOTOS } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  return pageMetadata(params.locale, "/", dict.meta.title, dict.meta.description);
}

export default function WorkPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const { home } = getDictionary(locale);

  return (
    <main>
      <section className="hero">
        <div className="kicker">{home.kicker}</div>
        <h1 className="display hero__title">{home.title}</h1>
        <p className="hero__lead">{home.lead}</p>
      </section>

      <Reel ariaLabel={home.reelAriaLabel} />

      <section className="selected">
        <div className="selected__head">
          <h2 className="display selected__title">{home.selectedTitle}</h2>
          <Link href={`/${locale}/gallery`} className="link-btn">
            {home.viewAll}
          </Link>
        </div>
        <div className="selected__grid">
          {SELECTED_PHOTOS.map((photo, i) => (
            <Link key={i} href={`/${locale}/gallery`} className="selected__item">
              <div className="selected__tile" style={{ background: photo.grad }} />
              <div className="selected__meta">
                <span className="selected__cat">{home.seriesCats[i]}</span>
                <span className="selected__num">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-strip">
        <div className="about-strip__inner">
          <div className="about-strip__portrait" />
          <div>
            <div className="kicker" style={{ marginBottom: 20 }}>
              {home.aboutKicker}
            </div>
            <p className="display about-strip__title">{home.aboutTitle}</p>
            <p className="about-strip__text">{home.aboutText}</p>
            <Link href={`/${locale}/contact`} className="cta">
              {home.cta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
