"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LOCALES, Locale, ROUTES } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import ThemeToggle from "./ThemeToggle";

const INSTAGRAM_URL = "https://instagram.com/ivan94hr";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const localePrefix = `/${locale}`;
  const rest = pathname === localePrefix ? "" : pathname.slice(localePrefix.length);
  const [menuOpen, setMenuOpen] = useState(false);

  // A route or locale change means navigation already happened — close the
  // mobile menu so it doesn't stay open over the new page. Adjusting state
  // during render rather than in an effect is React's documented way to reset
  // state on a changed input: it settles before the browser paints, so the menu
  // never flashes open on the new page.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header__brand">
        <Link href={localePrefix} style={{ lineHeight: 1 }}>
          <span className="header__name">{dict.header.name}</span>
          <span className="header__role">{dict.header.role}</span>
        </Link>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="header__social"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
            <circle cx="12" cy="12" r="4.6" />
            <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>

      <button
        type="button"
        className={`header__burger${menuOpen ? " header__burger--open" : ""}`}
        aria-label={menuOpen ? dict.header.menuClose : dict.header.menuOpen}
        aria-expanded={menuOpen}
        aria-controls="primary-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="primary-nav" className={`nav${menuOpen ? " nav--open" : ""}`}>
        {ROUTES.map((route) => {
          const href = route === "/" ? localePrefix : `${localePrefix}${route}`;
          const active = route === "/" ? pathname === localePrefix : pathname.startsWith(href);
          return (
            <Link
              key={route}
              href={href}
              className={`nav__link${active ? " nav__link--active" : ""}`}
            >
              {dict.nav[route]}
            </Link>
          );
        })}
        <span className="lang-switch">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={`/${l}${rest}`}
              hrefLang={l}
              prefetch={false}
              className={`lang-switch__link${l === locale ? " lang-switch__link--active" : ""}`}
              aria-current={l === locale ? "true" : undefined}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </span>
        <ThemeToggle labels={dict.theme} />
      </nav>
    </header>
  );
}
