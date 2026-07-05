"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { normalizeTheme, Theme, THEME_COOKIE } from "@/lib/theme";

// Reads the current theme straight from the DOM (set by the server on <html>),
// flips it on click, writes the cookie + localStorage so both the next server
// render and the browser agree, and updates the attribute immediately for an
// instant, no-reload switch.
type Labels = { dark: string; light: string; ariaLabel: string };

function persistTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  window.localStorage.setItem(THEME_COOKIE, next);
}

export default function ThemeToggle({ labels }: { labels: Labels }) {
  const [theme, setTheme] = useState<Theme>("minimal");
  const pathname = usePathname();

  useEffect(() => {
    // A locale switch re-renders the root layout from the server, which reads
    // the theme cookie again — if that request raced a just-written cookie
    // (e.g. a prefetched navigation), it can reapply a stale value to <html>.
    // Re-assert the browser's own record on every navigation so the switch
    // always sticks, falling back to the server-rendered value on first load.
    const stored = window.localStorage.getItem(THEME_COOKIE);
    const resolved = stored
      ? normalizeTheme(stored)
      : normalizeTheme(document.documentElement.dataset.theme);
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    if (!stored) window.localStorage.setItem(THEME_COOKIE, resolved);
  }, [pathname]);

  function toggle() {
    const next: Theme = theme === "minimal" ? "cinematic" : "minimal";
    setTheme(next);
    persistTheme(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={labels.ariaLabel}
    >
      {theme === "minimal" ? labels.dark : labels.light}
    </button>
  );
}
