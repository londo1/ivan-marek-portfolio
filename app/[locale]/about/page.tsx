import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  return pageMetadata(locale, "/about", dict.about.metaTitle, dict.about.lead);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { about } = getDictionary(locale);

  return (
    <main className="page">
      <div className="about__grid">
        <div className="about__portrait" />
        <div>
          <h1 className="display about__title">{about.name}</h1>
          <p className="about__lead">{about.lead}</p>
          <p className="about__text">{about.text}</p>
          <div className="about__specs">
            <div className="head">{about.servicesHead}</div>
            <div className="head">{about.recognitionHead}</div>
            <div className="body">
              {about.servicesBody.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < about.servicesBody.length - 1 && <br />}
                </span>
              ))}
            </div>
            <div className="body">
              {about.recognitionBody.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < about.recognitionBody.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
          <Link href={`/${locale}/contact`} className="cta">
            {about.cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
