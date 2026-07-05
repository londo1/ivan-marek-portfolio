// Theme definitions — the two directions ("minimal" / "cinematic").
// Values are applied as CSS custom properties in app/globals.css, scoped by
// the `data-theme` attribute on <html>. The attribute is set on the server
// (app/layout.tsx) from the `theme` cookie, so there is no flash of the wrong
// theme on first paint (true SSR theming).

export type Theme = "minimal" | "cinematic";

export const THEMES: Theme[] = ["minimal", "cinematic"];
export const DEFAULT_THEME: Theme = "cinematic";
export const THEME_COOKIE = "theme";

export function normalizeTheme(value: string | undefined | null): Theme {
  return value === "cinematic" ? "cinematic" : "minimal";
}
