// ============================================================
// PROPERTY CONFIG — change these imports to switch properties
// ============================================================
// import dataDe from "./barn-de.json";
// import dataEn from "./barn.json";
import dataEn from "./cottage.json";
import dataDe from "./cottage-de.json";

import type { GuidebookData } from "./types";
export { getLanguage, getUI, initLanguage, toggleLanguage } from "./language";

const _data: Record<string, GuidebookData> = {
  en: dataEn as GuidebookData,
  de: dataDe as GuidebookData,
};

export function getGuidebook(): GuidebookData {
  const lang = localStorage.getItem("guidebook-language") ?? "en";
  return _data[lang] ?? _data["en"];
}

// Keep static export for navbar/drawer which use property.name/logo (same in both languages)
export const guidebook = dataEn as GuidebookData;
