"use client";

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

      <nav className="nav">
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
