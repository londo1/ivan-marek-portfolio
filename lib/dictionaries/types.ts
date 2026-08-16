import type { Route } from "@/lib/i18n";

// UI chrome only.
//
// Since the Sanity integration, this file holds the text the *interface* needs
// — nav labels, buttons, form placeholders, section headings, aria-labels and
// empty states. Editorial content (prose, photographs and their captions,
// journal entries, contact details) lives in Sanity and arrives through
// lib/data.ts. The split is what keeps `Dictionary["nav"]` a compile-time
// check on `ROUTES` while still letting the photographer rewrite his own copy.
export type Dictionary = {
  meta: { title: string; description: string };
  nav: Record<Route, string>;
  header: { role: string, name: string, menuOpen: string; menuClose: string };
  footer: { note: string };
  theme: { dark: string; light: string; ariaLabel: string };
  home: {
    kicker: string;
    title: string;
    lead: string;
    reelAriaLabel: string;
    selectedTitle: string;
    viewAll: string;
    aboutKicker: string;
    aboutTitle: string;
    aboutText: string;
    cta: string;
  };
  about: {
    metaTitle: string;
    servicesHead: string;
    recognitionHead: string;
    cta: string;
    empty: string;
  };
  gallery: {
    metaTitle: string;
    title: string;
    sub: string;
    /** Template filled with the real number of frames — contains "{count}". */
    count: string;
    all: string;
    tabsAriaLabel: string;
    empty: string;
  };
  journal: {
    metaTitle: string;
    title: string;
    empty: string;
  };
  contact: {
    metaTitle: string;
    title: string;
    form: {
      name: string;
      email: string;
      projectType: string;
      message: string;
      submit: string;
    };
    detailsKicker: string;
    empty: string;
  };
};
