// The content seam.
//
// Everything the pages render now comes from Sanity (project sk3ctpa6, dataset
// production), edited in the standalone Studio at sk3ctpa6.sanity.studio. This
// module is the only place the app talks to the CMS: pages call these
// fetchers, components take the result as props.
//
// Translatable copy is split in two on purpose. UI chrome — nav labels, button
// text, form placeholders, section headings — stays in lib/dictionaries/{en,bg}.ts
// where the compiler checks it. Editorial content — photographs, captions,
// prose, journal entries, contact details — lives in Sanity so it can change
// without a deploy.
//
// Each fetch is tagged with the Sanity document types it depends on;
// app/api/revalidate/route.ts turns a publish webhook into
// `revalidateTag(_type)`, which is what makes "publish goes live in seconds"
// true.

import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/lib/sanity/client";
import {
  ABOUT_PAGE_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_PHOTOS_QUERY,
  CATEGORY_SLUGS_QUERY,
  CONTACT_PAGE_QUERY,
  GALLERY_PHOTOS_QUERY,
  JOURNAL_POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------- types -- */

export type Photo = {
  id: string;
  /** The full image object — asset ref plus hotspot/crop, which urlFor needs. */
  image: SanityImageSource;
  alt: string;
  caption: string | null;
  /** Base64 data URI from Sanity's LQIP metadata — next/image's blurDataURL. */
  lqip: string | null;
  /** width / height, for reel tile sizing. Falls back to square. */
  aspectRatio: number;
  takenAt: string | null;
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
};

export type SeriesTile = {
  id: string;
  slug: string;
  title: string;
  coverPhoto: Photo | null;
};

export type JournalPost = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  /** Already formatted for the locale — the raw value is a datetime. */
  dateLabel: string;
  date: string;
  photo: Photo | null;
};

export type AboutContent = {
  name: string;
  lead: string;
  text: string | null;
  portrait: Photo | null;
  services: string[];
  recognition: string[];
  seo: { metaTitle: string | null; metaDescription: string | null };
};

export type ContactContent = {
  lead: string;
  details: { key: string; label: string; value: string }[];
  seo: { metaTitle: string | null; metaDescription: string | null };
};

export type GallerySort = "manual" | "newest";

/* ------------------------------------------------------------- fetching -- */

// Belt and braces alongside tag revalidation: even if a webhook is ever
// missed, nothing is more than an hour stale.
const ONE_HOUR = 3600;

function options(...tags: string[]) {
  return { next: { revalidate: ONE_HOUR, tags } };
}

/* -------------------------------------------------------------- mapping -- */

// The generated query types allow null nearly everywhere (a draft can be
// half-filled), so these mappers are where a partially-filled document gets
// turned into something the components can render without null checks. A
// photograph with no image asset is dropped rather than rendered as a hole.

type RawPhoto = {
  _id: string;
  image?: SanityImageSource | null;
  alt?: string | null;
  caption?: string | null;
  lqip?: string | null;
  aspectRatio?: number | null;
  takenAt?: string | null;
} | null;

function toPhoto(raw: RawPhoto): Photo | null {
  if (!raw?.image) return null;
  return {
    id: raw._id,
    image: raw.image,
    alt: raw.alt ?? "",
    caption: raw.caption ?? null,
    lqip: raw.lqip ?? null,
    aspectRatio: raw.aspectRatio ?? 1,
    takenAt: raw.takenAt ?? null,
  };
}

function toPhotos(raw: RawPhoto[] | null | undefined): Photo[] {
  return (raw ?? []).map(toPhoto).filter((p): p is Photo => p !== null);
}

function toLines(raw: { value?: string | null }[] | null | undefined): string[] {
  return (raw ?? []).map((item) => item.value).filter((v): v is string => Boolean(v));
}

const INTL_TAGS: Record<Locale, string> = { en: "en-GB", bg: "bg-BG" };

function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(INTL_TAGS[locale], {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

/* --------------------------------------------------------------- order  -- */

/**
 * Resolution rule for a category page.
 *
 * `photoOrder` on a category is a hint, not a membership list, so it can never
 * drift out of sync with the photographs' own category fields: anything listed
 * there comes first in that order, and everything else follows in the site's
 * global order. A photo added to a category but never dragged simply lands at
 * the end.
 */
function applyPinnedOrder(photos: Photo[], pinnedIds: (string | null)[] | null | undefined): Photo[] {
  const pinned = new Map<string, number>();
  (pinnedIds ?? []).forEach((id, index) => {
    if (id && !pinned.has(id)) pinned.set(id, index);
  });
  if (pinned.size === 0) return photos;

  // Array.prototype.sort is stable, so returning 0 keeps the incoming
  // (global) order for everything unpinned.
  return [...photos].sort((a, b) => {
    const rankA = pinned.get(a.id);
    const rankB = pinned.get(b.id);
    if (rankA !== undefined && rankB !== undefined) return rankA - rankB;
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;
    return 0;
  });
}

function applyGlobalSort(photos: Photo[], sort: GallerySort): Photo[] {
  if (sort !== "newest") return photos; // already ordered by orderRank in GROQ
  return [...photos].sort((a, b) => (b.takenAt ?? "").localeCompare(a.takenAt ?? ""));
}

/* ------------------------------------------------------------- fetchers -- */

export async function getSiteSettings(locale: Locale) {
  const settings = await client.fetch(
    SITE_SETTINGS_QUERY,
    { locale },
    options("siteSettings", "photo", "category")
  );
  return {
    gallerySort: (settings?.gallerySort === "newest" ? "newest" : "manual") as GallerySort,
    reelPhotos: toPhotos(settings?.reelPhotos),
    selectedSeries: (settings?.selectedSeries ?? [])
      .filter((series) => Boolean(series?.slug))
      .map(
        (series): SeriesTile => ({
          id: series._id,
          slug: series.slug as string,
          title: series.title ?? "",
          coverPhoto: toPhoto(series.coverPhoto),
        })
      ),
  };
}

export async function getReelPhotos(locale: Locale): Promise<Photo[]> {
  const { reelPhotos } = await getSiteSettings(locale);
  return reelPhotos;
}

export async function getSelectedSeries(locale: Locale): Promise<SeriesTile[]> {
  const { selectedSeries } = await getSiteSettings(locale);
  return selectedSeries;
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const categories = await client.fetch(CATEGORIES_QUERY, { locale }, options("category"));
  return (categories ?? [])
    .filter((c) => Boolean(c?.slug))
    .map((c) => ({
      id: c._id,
      slug: c.slug as string,
      title: c.title ?? "",
      description: c.description ?? null,
    }));
}

/** Every category slug, for generateStaticParams and the sitemap. */
export async function getCategorySlugs(): Promise<string[]> {
  const slugs = await client.fetch(CATEGORY_SLUGS_QUERY, {}, options("category"));
  return (slugs ?? []).filter((slug): slug is string => Boolean(slug));
}

export async function getCategory(locale: Locale, slug: string) {
  const category = await client.fetch(
    CATEGORY_BY_SLUG_QUERY,
    { locale, slug },
    options("category")
  );
  if (!category?.slug) return null;
  return {
    id: category._id,
    slug: category.slug,
    title: category.title ?? "",
    description: category.description ?? null,
    photoOrder: category.photoOrder ?? [],
  };
}

/**
 * The gallery wall — the whole library, or one category's slice of it.
 *
 * Pass the category returned by `getCategory` (the page needs it anyway for
 * its heading and metadata) to get that category's photographs with its
 * pinned order applied.
 */
export async function getGalleryPhotos({
  locale,
  category,
}: {
  locale: Locale;
  category?: { id: string; photoOrder: (string | null)[] } | null;
}): Promise<Photo[]> {
  const { gallerySort } = await getSiteSettings(locale);

  if (!category) {
    const photos = await client.fetch(
      GALLERY_PHOTOS_QUERY,
      { locale },
      options("photo", "siteSettings")
    );
    return applyGlobalSort(toPhotos(photos), gallerySort);
  }

  const photos = await client.fetch(
    CATEGORY_PHOTOS_QUERY,
    { locale, categoryId: category.id },
    options("photo", "category", "siteSettings")
  );
  return applyPinnedOrder(applyGlobalSort(toPhotos(photos), gallerySort), category.photoOrder);
}

export async function getJournalPosts(locale: Locale): Promise<JournalPost[]> {
  const posts = await client.fetch(
    JOURNAL_POSTS_QUERY,
    { locale },
    options("journalPost", "photo")
  );
  return (posts ?? []).map((post) => ({
    id: post._id,
    category: post.category ?? "",
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    date: post.date ?? "",
    dateLabel: formatDate(post.date, locale),
    photo: toPhoto(post.photo),
  }));
}

export async function getAboutPage(locale: Locale): Promise<AboutContent | null> {
  const about = await client.fetch(ABOUT_PAGE_QUERY, { locale }, options("aboutPage"));
  if (!about) return null;

  const portrait = about.portrait?.asset
    ? {
        id: "about-portrait",
        image: about.portrait as SanityImageSource,
        alt: about.portrait.alt ?? "",
        caption: null,
        lqip: about.portrait.lqip ?? null,
        aspectRatio: about.portrait.aspectRatio ?? 1,
        takenAt: null,
      }
    : null;

  return {
    name: about.name ?? "",
    lead: about.lead ?? "",
    text: about.text ?? null,
    portrait,
    services: toLines(about.services),
    recognition: toLines(about.recognition),
    seo: {
      metaTitle: about.seo?.metaTitle ?? null,
      metaDescription: about.seo?.metaDescription ?? null,
    },
  };
}

export async function getContactPage(locale: Locale): Promise<ContactContent | null> {
  const contact = await client.fetch(CONTACT_PAGE_QUERY, { locale }, options("contactPage"));
  if (!contact) return null;

  return {
    lead: contact.lead ?? "",
    details: (contact.details ?? [])
      .filter((detail) => Boolean(detail?.label))
      .map((detail) => ({
        key: detail._key,
        label: detail.label as string,
        value: detail.value ?? "",
      })),
    seo: {
      metaTitle: contact.seo?.metaTitle ?? null,
      metaDescription: contact.seo?.metaDescription ?? null,
    },
  };
}
