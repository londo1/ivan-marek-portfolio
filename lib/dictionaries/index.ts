import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "./types";
import en from "./en";
import bg from "./bg";

const dictionaries: Record<Locale, Dictionary> = { en, bg };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
