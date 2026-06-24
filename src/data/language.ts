/**
 * Runtime language management.
 * Supports EN and DE. Persists choice to localStorage.
 * Dispatches 'language-changed' on window when toggled.
 */

import type { UiStrings } from "./types";
import uiDe from "./ui-de.json";
import uiEn from "./ui.json";

export type Language = "en" | "de";

const STORAGE_KEY = "guidebook-language";

const languages: Record<Language, UiStrings> = {
  en: uiEn as UiStrings,
  de: uiDe as UiStrings,
};

const _savedAtLoad = localStorage.getItem(STORAGE_KEY) as Language | null;
let _current: Language =
  _savedAtLoad && _savedAtLoad in languages ? _savedAtLoad : "en";

/** Call once at app startup — reads URL param then browser language as fallback */
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
  // Already loaded from localStorage at module init — only fall through to
  // browser detection if nothing was saved
  if (_savedAtLoad && _savedAtLoad in languages) {
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
  window.dispatchEvent(
    new CustomEvent("language-changed", { detail: { lang: _current } }),
  );
}
