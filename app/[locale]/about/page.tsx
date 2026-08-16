import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAboutPage } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath, Locale } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity/image";
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
  const about = await getAboutPage(locale);
  return pageMetadata(
    locale,
    "/about",
    about?.seo.metaTitle ?? dict.about.metaTitle,
    about?.seo.metaDescription ?? about?.lead
  );
}

// The portrait column is a 4:5 crop.
const PORTRAIT_WIDTH = 900;
const PORTRAIT_HEIGHT = 1125;

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { about: ui } = getDictionary(locale);
  const about = await getAboutPage(locale);

  return (
    <main className="page">
      <div className="about__grid">
        <div className="about__portrait">
          {about?.portrait && (
            <Image
              className="tile__img"
              src={urlFor(about.portrait.image)
                .width(PORTRAIT_WIDTH)
                .height(PORTRAIT_HEIGHT)
                .fit("crop")
                .url()}
              alt={about.portrait.alt}
              width={PORTRAIT_WIDTH}
              height={PORTRAIT_HEIGHT}
              sizes="(max-width: 900px) 100vw, 33vw"
              placeholder={about.portrait.lqip ? "blur" : "empty"}
              blurDataURL={about.portrait.lqip ?? undefined}
              priority
            />
          )}
        </div>

        {about ? (
          <div>
            <h1 className="display about__title">{about.name}</h1>
            <p className="about__lead">{about.lead}</p>
            {about.text && <p className="about__text">{about.text}</p>}
            <div className="about__specs">
              <div className="head">{ui.servicesHead}</div>
              <div className="head">{ui.recognitionHead}</div>
              <div className="body">
                {about.services.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < about.services.length - 1 && <br />}
                  </span>
                ))}
              </div>
              <div className="body">
                {about.recognition.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < about.recognition.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
            <Link href={localizedPath(locale, "/contact")} className="cta">
              {ui.cta}
            </Link>
          </div>
        ) : (
          <p className="empty">{ui.empty}</p>
        )}
      </div>
    </main>
  );
}
