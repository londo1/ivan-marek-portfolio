import { defineQuery } from "next-sanity";

// GROQ lives here, and only here.
//
// Bilingual fields are `{ en, bg }` objects in Sanity, and the locale is
// resolved inside the query rather than in the component:
//
//   "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en)
//
// i.e. Bulgarian when asked for and present, English otherwise. The expression
// is written out in full every time on purpose — TypeGen only reads plain
// string literals, so a `loc()` helper interpolating into the template would
// cost us the generated types, which are the thing keeping this app and the
// Studio schema from drifting apart.
//
// Every query takes `$locale`. Photo projections return the whole `image`
// object (asset ref + hotspot + crop) because the URL builder needs it, plus
// the LQIP data URI and aspect ratio from the asset's metadata.

// The singletons are pinned to a fixed document id by the Studio structure, so
// there is only ever one of each; querying by `_type` rather than `_id` is what
// gives TypeGen a single result shape instead of a union of every document type
// that could theoretically hold that id.
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    gallerySort,
    "reelPhotos": reelPhotos[]->{
      _id,
      image,
      "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en),
      "caption": select($locale == "bg" => coalesce(caption.bg, caption.en), caption.en),
      "lqip": image.asset->metadata.lqip,
      "aspectRatio": image.asset->metadata.dimensions.aspectRatio
    },
    "selectedSeries": selectedSeries[]->{
      _id,
      "slug": slug.current,
      "title": select($locale == "bg" => coalesce(title.bg, title.en), title.en),
      "coverPhoto": coverPhoto->{
        _id,
        image,
        "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en),
        "caption": select($locale == "bg" => coalesce(caption.bg, caption.en), caption.en),
        "lqip": image.asset->metadata.lqip,
        "aspectRatio": image.asset->metadata.dimensions.aspectRatio
      }
    }
  }
`);

export const GALLERY_PHOTOS_QUERY = defineQuery(`
  *[_type == "photo" && showInGallery == true] | order(orderRank asc){
    _id,
    image,
    takenAt,
    "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en),
    "caption": select($locale == "bg" => coalesce(caption.bg, caption.en), caption.en),
    "lqip": image.asset->metadata.lqip,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio
  }
`);

// A photograph is in a category when either its primary category or one of its
// extra categories points at it.
export const CATEGORY_PHOTOS_QUERY = defineQuery(`
  *[_type == "photo"
    && showInGallery == true
    && (primaryCategory._ref == $categoryId || $categoryId in categories[]._ref)
  ] | order(orderRank asc){
    _id,
    image,
    takenAt,
    "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en),
    "caption": select($locale == "bg" => coalesce(caption.bg, caption.en), caption.en),
    "lqip": image.asset->metadata.lqip,
    "aspectRatio": image.asset->metadata.dimensions.aspectRatio
  }
`);

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(orderRank asc){
    _id,
    "slug": slug.current,
    "title": select($locale == "bg" => coalesce(title.bg, title.en), title.en),
    "description": select($locale == "bg" => coalesce(description.bg, description.en), description.en)
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    "title": select($locale == "bg" => coalesce(title.bg, title.en), title.en),
    "description": select($locale == "bg" => coalesce(description.bg, description.en), description.en),
    "photoOrder": photoOrder[]._ref
  }
`);

// Slugs are locale-independent, so this one takes no $locale.
export const CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)].slug.current
`);

export const JOURNAL_POSTS_QUERY = defineQuery(`
  *[_type == "journalPost"] | order(date desc){
    _id,
    date,
    "title": select($locale == "bg" => coalesce(title.bg, title.en), title.en),
    "excerpt": select($locale == "bg" => coalesce(excerpt.bg, excerpt.en), excerpt.en),
    "category": select($locale == "bg" => coalesce(category.bg, category.en), category.en),
    "photo": photo->{
      _id,
      image,
      "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en),
      "caption": select($locale == "bg" => coalesce(caption.bg, caption.en), caption.en),
      "lqip": image.asset->metadata.lqip,
      "aspectRatio": image.asset->metadata.dimensions.aspectRatio
    }
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0]{
    "name": select($locale == "bg" => coalesce(name.bg, name.en), name.en),
    "lead": select($locale == "bg" => coalesce(lead.bg, lead.en), lead.en),
    "text": select($locale == "bg" => coalesce(text.bg, text.en), text.en),
    "portrait": portrait{
      ...,
      "alt": select($locale == "bg" => coalesce(alt.bg, alt.en), alt.en),
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    "services": services[]{
      "value": select($locale == "bg" => coalesce(bg, en), en)
    },
    "recognition": recognition[]{
      "value": select($locale == "bg" => coalesce(bg, en), en)
    },
    "seo": seo{
      "metaTitle": select($locale == "bg" => coalesce(metaTitle.bg, metaTitle.en), metaTitle.en),
      "metaDescription": select($locale == "bg" => coalesce(metaDescription.bg, metaDescription.en), metaDescription.en)
    }
  }
`);

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0]{
    "lead": select($locale == "bg" => coalesce(lead.bg, lead.en), lead.en),
    "details": details[]{
      _key,
      "label": select($locale == "bg" => coalesce(label.bg, label.en), label.en),
      "value": select($locale == "bg" => coalesce(value.bg, value.en), value.en)
    },
    "seo": seo{
      "metaTitle": select($locale == "bg" => coalesce(metaTitle.bg, metaTitle.en), metaTitle.en),
      "metaDescription": select($locale == "bg" => coalesce(metaDescription.bg, metaDescription.en), metaDescription.en)
    }
  }
`);
