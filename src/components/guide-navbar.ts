import { getLanguage, getUI, guidebook, toggleLanguage } from "../data/config";
import { icons } from "../icons/icons";

/**
 * <guide-navbar title="Page Title">
 *
 * Renders a fixed top navbar with logo, hamburger (opens guide-drawer), and title.
 * Includes a language toggle button (EN/DE) in the top-right corner.
 * SPA-aware: updates title dynamically when the 'title' attribute changes.
 */
class GuideNavbar extends HTMLElement {
  private _pageTitleEl: HTMLElement | null = null;

  static get observedAttributes() {
    return ["title"];
  }

  connectedCallback() {
    this.render();
    window.addEventListener("language-changed", () => this.render());
  }

  attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    if (name === "title") {
      this.updateTitle();
    }
  }

  private render() {
    const pageTitle = this.getAttribute("title") ?? "Guidebook";
    const propertyName = guidebook.property.name;
    const t = getUI();
    const lang = getLanguage();
    const langLabel = lang === "en" ? "DE" : "EN";
    const langAriaLabel =
      lang === "en" ? "Switch to German" : "Auf Englisch wechseln";

    this.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="navbar-left">
          <a href="/" data-route="/" aria-label="${t.navbar.homeAriaLabel}" title="${guidebook.property.subtitle}">
            <img
              src="${guidebook.property.logo}"
              alt="${guidebook.property.name} logo"
              class="navbar-logo"
              width="48" height="48"
            />
          </a>
          <button
            class="navbar-menu-btn"
            title="${t.navbar.menuTooltip}"
            aria-label="${t.navbar.menuAriaLabel}"
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
        <div class="navbar-right">
          <button
            class="navbar-lang-btn"
            id="lang-toggle"
            aria-label="${langAriaLabel}"
            title="${langAriaLabel}"
          >${langLabel}</button>
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

    this.querySelector("#lang-toggle")?.addEventListener("click", () => {
      toggleLanguage();
      // Re-render the drawer nav labels too
      const drawer = document.querySelector("guide-drawer") as HTMLElement & {
        rerender: () => void;
      };
      drawer?.rerender?.();
    });
  }

  private updateTitle() {
    const pageTitle = this.getAttribute("title") ?? "Guidebook";
    if (this._pageTitleEl) {
      this._pageTitleEl.textContent = pageTitle;
    } else {
      this.render();
    }
  }
}

customElements.define("guide-navbar", GuideNavbar);
