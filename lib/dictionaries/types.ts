import type { Route } from "@/lib/i18n";

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
    seriesCats: string[];
    aboutKicker: string;
    aboutTitle: string;
    aboutText: string;
    cta: string;
  };
  about: {
    metaTitle: string;
    name: string;
    lead: string;
    text: string;
    servicesHead: string;
    recognitionHead: string;
    servicesBody: string[];
    recognitionBody: string[];
    cta: string;
  };
  gallery: {
    metaTitle: string;
    title: string;
    sub: string;
    count: string;
    cmsNote: string;
  };
  journal: {
    metaTitle: string;
    title: string;
    posts: { cat: string; title: string; excerpt: string; date: string }[];
  };
  contact: {
    metaTitle: string;
    title: string;
    lead: string;
    form: {
      name: string;
      email: string;
      projectType: string;
      message: string;
      submit: string;
    };
    detailsKicker: string;
    details: { label: string; value: string }[];
  };
};
