import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOURNAL_PHOTOS } from "@/lib/data";
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
  return pageMetadata(locale, "/journal", dict.journal.metaTitle);
}

export default async function JournalPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { journal } = getDictionary(locale);

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
