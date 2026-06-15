// Shared layout bootstrap — imported in every page's <script type="module">
import "../components/guide-drawer";
import "../components/guide-modal";
import "../components/guide-navbar";
import { initPWA } from "../components/guide-pwa";
import { guidebook } from "../data/config";
import "../styles/global.css";

// Update page title and meta description dynamically
function initPageMeta() {
  const propertyName = guidebook.property.name;

  // Extract page name from existing title (format: "Page | ...")
  const currentTitle = document.title;
  const pageName = currentTitle.split(" | ")[0] || "Guidebook";

  // Update title: "Property Name | Page"
  document.title = `${propertyName} | ${pageName}`;

  // Update meta description if it exists
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const desc = guidebook.property.description;
    metaDesc.setAttribute(
      "content",
      `${pageName} information for ${propertyName}. ${desc}`,
    );
  }

  // Update theme-color meta to match property theme
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta && guidebook.property.themeColor) {
    themeMeta.setAttribute("content", guidebook.property.themeColor);
  }
}

// Update navbar title for landing page (uses hero.navbarTitle from JSON)
function initNavbarTitle() {
  const navbar = document.querySelector("guide-navbar");
  if (!navbar) return;

  // Check if this is the landing page (index.html or /)
  const path = window.location.pathname;
  const isLandingPage = path === "/" || path.endsWith("index.html");

  if (isLandingPage && guidebook.hero.navbarTitle) {
    const propertyName = guidebook.property.name;
    const landingTitle = guidebook.hero.navbarTitle;

    // Update the navbar title element
    const titleEl = navbar.querySelector(".navbar-title-main");
    if (titleEl) {
      titleEl.textContent = `${propertyName} | ${landingTitle}`;
    }
  }
}

initPWA();
initPageMeta();
initNavbarTitle();
