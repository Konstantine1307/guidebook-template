/**
 * SPA Entry Point
 * Initializes layout, components, and router
 */

// Import global styles
import "../styles/global.css";

// Import web components
import "../components/guide-drawer";
import "../components/guide-modal";
import "../components/guide-navbar";

// Import PWA
import { initPWA } from "../components/guide-pwa";

// Import router
import { initRouter } from "./router";

// Import guidebook data and language init
import { getUI, guidebook, initLanguage } from "../data/config";

// Initialize language before anything else renders
initLanguage();
document.documentElement.lang =
  (localStorage.getItem("guidebook-language") as string) || "en";

// Initialize PWA functionality
initPWA();

// Initialize page meta information
function initPageMeta(): void {
  const propertyName = guidebook.property.name;
  const path = window.location.pathname;

  // Get page name from current route
  const t = getUI().routes;
  const routeMap: Record<string, string> = {
    "/": t.welcome,
    "/arrival": t.arrival,
    "/house-manual": t.houseManual,
    "/places-to-eat": t.restaurants,
    "/beaches": t.beaches,
    "/attractions": t.attractions,
    "/emergency": t.emergency,
    "/departure": t.departure,
  };
  const pageName = routeMap[path] ?? t.welcome;

  // Update title
  document.title = `${propertyName} | ${pageName}`;

  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const desc = guidebook.property.description;
    metaDesc.setAttribute(
      "content",
      `${pageName} information for ${propertyName}. ${desc}`,
    );
  }

  // Update theme-color meta
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta && guidebook.property.themeColor) {
    themeMeta.setAttribute("content", guidebook.property.themeColor);
  }
}

// Initialize everything when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initPageMeta();
    initRouter();
  });
} else {
  initPageMeta();
  initRouter();
}
