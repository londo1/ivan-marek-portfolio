import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  return pageMetadata(params.locale, "/about", dict.about.metaTitle, dict.about.lead);
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const { about } = getDictionary(params.locale);

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
          <Link href={`/${params.locale}/contact`} className="cta">
            {about.cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
