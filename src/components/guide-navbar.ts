import { guidebook, ui } from "../data/config";
import { icons } from "../icons/icons";

/**
 * <guide-navbar title="Page Title" gradient="from-gray-800/90 to-primary">
 *
 * Renders a fixed top navbar with logo, hamburger (opens guide-drawer), and title.
 * SPA-aware: updates title dynamically when the 'title' attribute changes.
 */
class GuideNavbar extends HTMLElement {
  private _pageTitleEl: HTMLElement | null = null;

  static get observedAttributes() {
    return ["title"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    if (name === "title") {
      this.updateTitle();
    }
  }

  private render() {
    // Page-specific title from attribute
    const pageTitle = this.getAttribute("title") ?? "Guidebook";
    // Full title for desktop, just page title for mobile (via CSS)
    const propertyName = guidebook.property.name;

    this.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="navbar-left">
          <a href="/" data-route="/" aria-label="${ui.navbar.homeAriaLabel}" title="${guidebook.property.subtitle}">
            <img
              src="${guidebook.property.logo}"
              alt="${guidebook.property.name} logo"
              class="navbar-logo"
              width="48" height="48"
            />
          </a>
          <button
            class="navbar-menu-btn"
            title="${ui.navbar.menuTooltip}"
            aria-label="${ui.navbar.menuAriaLabel}"
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

    this._pageTitleEl = this.querySelector(".navbar-title-page");

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

  private updateTitle() {
    const pageTitle = this.getAttribute("title") ?? "Guidebook";
    if (this._pageTitleEl) {
      this._pageTitleEl.textContent = pageTitle;
    } else {
      // Re-render if element not found
      this.render();
    }
  }
}

customElements.define("guide-navbar", GuideNavbar);
