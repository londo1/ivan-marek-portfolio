import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOURNAL_PHOTOS } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) notFound();
  const dict = getDictionary(params.locale);
  return pageMetadata(params.locale, "/journal", dict.journal.metaTitle);
}

export default function JournalPage({ params }: { params: { locale: Locale } }) {
  const { journal } = getDictionary(params.locale);

  return (
    <main className="page">
      <h1 className="display page__title" style={{ marginBottom: 40 }}>
        {journal.title}
      </h1>
      <div className="journal__list">
        {journal.posts.map((post, i) => (
          <article key={post.title} className="journal__item">
            <div
              className="journal__thumb"
              style={{ background: JOURNAL_PHOTOS[i].grad }}
            />
            <div>
              <span className="journal__cat">{post.cat}</span>
              <span className="display journal__title">{post.title}</span>
              <span className="journal__excerpt">{post.excerpt}</span>
            </div>
            <span className="journal__date">{post.date}</span>
          </article>
        ))}
      </div>
    </main>
  );
}
