import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getJournalPosts } from "@/lib/data";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, Locale } from "@/lib/i18n";
import { squareUrl } from "@/lib/sanity/image";
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
  return pageMetadata(locale, "/journal", dict.journal.metaTitle);
}

const THUMB_SOURCE = 500;

export default async function JournalPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { journal } = getDictionary(locale);
  const posts = await getJournalPosts(locale);

  return (
    <main className="page">
      <h1 className="display page__title" style={{ marginBottom: 40 }}>
        {journal.title}
      </h1>

      {posts.length === 0 ? (
        <p className="empty">{journal.empty}</p>
      ) : (
        <div className="journal__list">
          {posts.map((post) => (
            <article key={post.id} className="journal__item">
              <div className="journal__thumb">
                {post.photo && (
                  <Image
                    className="tile__img"
                    src={squareUrl(post.photo.image, THUMB_SOURCE)}
                    alt={post.photo.alt}
                    width={THUMB_SOURCE}
                    height={THUMB_SOURCE}
                    sizes="200px"
                    placeholder={post.photo.lqip ? "blur" : "empty"}
                    blurDataURL={post.photo.lqip ?? undefined}
                  />
                )}
              </div>
              <div>
                <span className="journal__cat">{post.category}</span>
                <span className="display journal__title">{post.title}</span>
                <span className="journal__excerpt">{post.excerpt}</span>
              </div>
              {/* Formatted per locale from a real datetime, not typed as text. */}
              <time className="journal__date" dateTime={post.date}>
                {post.dateLabel}
              </time>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
