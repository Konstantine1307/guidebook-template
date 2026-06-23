// ============================================================
// PROPERTY CONFIG — change this one import to switch properties
// ============================================================
import data from "./cottage.json";
// import data from './barn.json';

import type { GuidebookData } from "./types";
export { getLanguage, getUI, initLanguage, toggleLanguage } from "./language";

export const guidebook = data as GuidebookData;
