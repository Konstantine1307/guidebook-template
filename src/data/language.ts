/**
 * Runtime language management.
 * Supports EN and DE. Persists choice to localStorage.
 * Dispatches 'language-changed' on window when toggled.
 */

import uiEn from "./ui.json";
import uiDe from "./ui-de.json";
import type { UiStrings } from "./types";

export type Language = "en" | "de";

const STORAGE_KEY = "guidebook-language";

const languages: Record<Language, UiStrings> = {
  en: uiEn as UiStrings,
  de: uiDe as UiStrings,
};

let _current: Language = "en";

/** Call once at app startup — reads localStorage then URL param */
export function initLanguage(): void {
  // URL param takes priority: ?lang=de
  const param = new URLSearchParams(window.location.search).get(
    "lang",
  ) as Language | null;
  if (param && param in languages) {
    _current = param;
    localStorage.setItem(STORAGE_KEY, _current);
    return;
  }
  // Saved preference
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved && saved in languages) {
    _current = saved;
    return;
  }
  // Browser language auto-detection
  _current = navigator.language.startsWith("de") ? "de" : "en";
}

/** Returns the current UI strings */
export function getUI(): UiStrings {
  return languages[_current];
}

/** Returns the current language code */
export function getLanguage(): Language {
  return _current;
}

/** Toggle between EN and DE, persist, update <html lang>, dispatch event */
export function toggleLanguage(): void {
  _current = _current === "en" ? "de" : "en";
  localStorage.setItem(STORAGE_KEY, _current);
  document.documentElement.lang = _current;
  window.dispatchEvent(new CustomEvent("language-changed", { detail: { lang: _current } }));
}
