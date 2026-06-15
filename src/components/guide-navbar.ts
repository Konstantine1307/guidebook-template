import { guidebook } from "../data/config";
import { icons } from "../icons/icons";

/**
 * <guide-navbar title="Page Title" gradient="from-gray-800/90 to-primary">
 *
 * Renders a fixed top navbar with logo, hamburger (opens guide-drawer), and title.
 */
class GuideNavbar extends HTMLElement {
  connectedCallback() {
    // Page-specific title from attribute
    const pageTitle = this.getAttribute("title") ?? "Guidebook";
    // Full title for desktop, just page title for mobile (via CSS)
    const propertyName = guidebook.property.name;

    this.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="navbar-left">
          <a href="/" aria-label="Home">
            <img
              src="${guidebook.property.logo}"
              alt="${guidebook.property.name} logo"
              class="navbar-logo"
              width="48" height="48"
            />
          </a>
          <button
            class="navbar-menu-btn"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="guide-drawer"
            id="drawer-toggle"
          >
            ${icons["menu"]}
          </button>
        </div>
        <div class="navbar-title">
          <div class="navbar-title-main">
            <span class="navbar-title-property">${propertyName}</span>
            <span class="navbar-title-separator"> | </span>
            <span class="navbar-title-page">${pageTitle}</span>
          </div>
          <span class="navbar-title-sub" style="color:var(--color-heading-1)">${guidebook.property.subtitle}</span>
        </div>
      </nav>
    `;

    this.querySelector("#drawer-toggle")?.addEventListener("click", () => {
      const drawer = document.querySelector("guide-drawer") as HTMLElement & {
        open: () => void;
      };
      drawer?.open?.();
      this.querySelector("#drawer-toggle")?.setAttribute(
        "aria-expanded",
        "true",
      );
    });
  }
}

customElements.define("guide-navbar", GuideNavbar);
