// Static content + placeholder imagery for the portfolio.
//
// The `grad` values are CSS gradients standing in for real photographs so the
// layout can be reviewed without assets. In production, replace `Photo.grad`
// with a real `src` and swap the plain <div> tiles for next/image <Image>
// components (see components/Reel.tsx / PhotoGrid.tsx for where they render).
// This module is where a CMS integration would plug in — fetch the library and
// map it into these same shapes.
//
// Translatable copy (nav labels, series/journal titles, contact details, …)
// lives in lib/dictionaries/{en,bg}.ts instead of here — this file only holds
// the language-independent visuals, indexed in the same order the dictionary
// entries expect.

export type Photo = { grad: string; ar: number };

export const PHOTOS: Photo[] = [
  { grad: "linear-gradient(160deg,#3a4a5c,#8a9bab)", ar: 0.78 },
  { grad: "linear-gradient(200deg,#b0824f,#e6d1ac)", ar: 1.35 },
  { grad: "linear-gradient(160deg,#2f3d34,#728064)", ar: 0.8 },
  { grad: "linear-gradient(180deg,#8a877f,#cbc6bd)", ar: 1.5 },
  { grad: "linear-gradient(200deg,#2c474f,#7fa0a1)", ar: 0.75 },
  { grad: "linear-gradient(160deg,#79484f,#d4a09d)", ar: 1.3 },
  { grad: "linear-gradient(200deg,#845527,#dcb277)", ar: 0.82 },
  { grad: "linear-gradient(160deg,#33405a,#8390ad)", ar: 1.4 },
  { grad: "linear-gradient(180deg,#575534,#aba875)", ar: 0.78 },
  { grad: "linear-gradient(160deg,#423150,#9280a4)", ar: 1.32 },
  { grad: "linear-gradient(200deg,#985c43,#e0ae8d)", ar: 0.8 },
  { grad: "linear-gradient(160deg,#26443f,#75a498)", ar: 1.45 },
  { grad: "linear-gradient(180deg,#312f2c,#7a756e)", ar: 0.76 },
  { grad: "linear-gradient(200deg,#586f83,#c0cfd9)", ar: 1.36 },
];

// Landing "selected series" teaser — paired with dictionary.home.seriesCats
// by index.
export const SELECTED_PHOTOS: Photo[] = PHOTOS.slice(0, 6);

// Journal thumbnails, in the same order as dictionary.journal.posts.
export const JOURNAL_PHOTOS: Photo[] = [PHOTOS[4], PHOTOS[1], PHOTOS[9]];

// The gallery grid (would be the full CMS library in production).
export const GALLERY: Photo[] = Array.from(
  { length: 16 },
  (_, i) => PHOTOS[i % PHOTOS.length]
);
