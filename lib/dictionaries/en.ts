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
    seriesCats: [
      "Portraiture",
      "Landscape",
      "Still life",
      "Interiors",
      "Street",
      "Travel",
    ],
    aboutKicker: "About",
    aboutTitle:
      "Ivan is a photographer working across editorial, portrait and personal projects.",
    aboutText:
      "Based between the studio and wherever the work takes him. Available for commissions, prints and collaborations.",
    cta: "Start a project",
  },
  about: {
    metaTitle: "About — Ivan Hristov",
    name: "Ivan Hristov",
    lead: "I'm a photographer with a mixed practice — portraits, landscapes and quiet still life. I care about honest light and the small moments most people walk past.",
    text: "My work has appeared in editorial and commercial projects, and I take on a limited number of commissions each year so every shoot gets full attention.",
    servicesHead: "Services",
    recognitionHead: "Recognition",
    servicesBody: ["Editorial · Portrait", "Commercial · Travel", "Fine-art prints"],
    recognitionBody: [
      "Feature — Frame Journal",
      "Shortlist — LensPrize 25",
      "Group show — Atrium",
    ],
    cta: "Get in touch",
  },
  gallery: {
    metaTitle: "Gallery — Ivan Hristov",
    title: "Gallery",
    sub: "The complete archive, updated as new frames are made.",
    count: "120+ frames",
    cmsNote:
      "CMS-ready — new photographs added here automatically as they're uploaded to the studio library. No redeploy needed.",
  },
  journal: {
    metaTitle: "Journal — Ivan Hristov",
    title: "Journal",
    posts: [
      {
        cat: "Field notes",
        title: "On shooting in flat winter light",
        excerpt: "Why the greyest days often make the most honest portraits.",
        date: "12 · 2025",
      },
      {
        cat: "Gear",
        title: "One lens for a whole trip",
        excerpt: "Packing light forces better decisions in the moment.",
        date: "09 · 2025",
      },
      {
        cat: "Process",
        title: "How I sequence a series",
        excerpt: "Editing down from four hundred frames to twelve.",
        date: "06 · 2025",
      },
    ],
  },
  contact: {
    metaTitle: "Contact — Ivan Hristov",
    title: "Let's work together",
    lead: "Tell me a little about the project and I'll get back to you within a couple of days.",
    form: {
      name: "Your name",
      email: "Email address",
      projectType: "Project type — portrait, editorial, print…",
      message: "Tell me about it",
      submit: "Send inquiry",
    },
    detailsKicker: "Studio",
    details: [
      { label: "Email", value: "studio@ivanmarek.photo" },
      { label: "Based in", value: "Sofia — working worldwide" },
      { label: "Instagram", value: "@ivan94hr" },
      { label: "Availability", value: "Booking Q3–Q4 2026" },
    ],
  },
};

export default en;
