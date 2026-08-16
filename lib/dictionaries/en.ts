import type { Dictionary } from "./types";

const en: Dictionary = {
  meta: {
    title: "Ivan Hristov — Photographer",
    description:
      "Portrait, landscape and still-life photography by Ivan Hristov. Available for commissions worldwide.",
  },
  nav: {
    "/": "Work",
    "/gallery": "Gallery",
    "/journal": "Journal",
    "/about": "About",
    "/contact": "Contact",
  },
  header: {
    role: "Photographer",
    name: "Ivan Hristov",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
  footer: { note: "© 2026 — Available for commissions worldwide" },
  theme: { dark: "☾ Dark", light: "☀ Light", ariaLabel: "Toggle colour theme" },
  home: {
    kicker: "Selected work — 2021–2026",
    title: "Made to be looked at slowly.",
    lead: "A mixed body of portrait, landscape and still-life work, kept deliberately quiet so the frames can speak. Scroll the reel, or step into the full archive.",
    reelAriaLabel: "Featured photographs",
    selectedTitle: "Selected series",
    viewAll: "View all →",
    aboutKicker: "About",
    aboutTitle:
      "Ivan is a photographer working across editorial, portrait and personal projects.",
    aboutText:
      "Based between the studio and wherever the work takes him. Available for commissions, prints and collaborations.",
    cta: "Start a project",
  },
  about: {
    metaTitle: "About — Ivan Hristov",
    servicesHead: "Services",
    recognitionHead: "Recognition",
    cta: "Get in touch",
    empty: "This page hasn't been written yet.",
  },
  gallery: {
    metaTitle: "Gallery — Ivan Hristov",
    title: "Gallery",
    sub: "The complete archive, updated as new frames are made.",
    count: "{count} frames",
    all: "All",
    tabsAriaLabel: "Gallery categories",
    empty: "No photographs here yet.",
  },
  journal: {
    metaTitle: "Journal — Ivan Hristov",
    title: "Journal",
    empty: "No journal entries yet.",
  },
  contact: {
    metaTitle: "Contact — Ivan Hristov",
    title: "Let's work together",
    form: {
      name: "Your name",
      email: "Email address",
      projectType: "Project type — portrait, editorial, print…",
      message: "Tell me about it",
      submit: "Send inquiry",
    },
    detailsKicker: "Studio",
    empty: "Contact details are on their way.",
  },
};

export default en;
