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
    // Format: "Property Name | Page Title"
    const mainTitle = `${guidebook.property.name} | ${pageTitle}`;

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
          <div class="navbar-title-main">${mainTitle}</div>
          <span class="navbar-title-sub">${guidebook.property.subtitle}</span>
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
