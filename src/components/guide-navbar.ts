import { getLanguage, getUI, guidebook, toggleLanguage } from "../data/config";
import { icons } from "../icons/icons";

/**
 * <guide-navbar title="Page Title">
 *
 * Renders a fixed top navbar with logo, hamburger (opens guide-drawer), and title.
 * Includes a language dropdown (EN/DE) in the top-right corner.
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
    const currentLabel = lang === "en" ? "English" : "Deutsch";

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
          <div class="lang-dropdown" id="lang-dropdown">
            <button class="lang-dropdown-btn" id="lang-dropdown-btn" aria-haspopup="listbox" aria-expanded="false">
              <span class="lang-icon">${icons["languages"]}</span>
              <span class="lang-label">${currentLabel}</span>
              <span class="lang-chevron">${icons["chevron-down"]}</span>
            </button>
            <ul class="lang-dropdown-menu" id="lang-dropdown-menu" role="listbox" aria-label="Select language">
              <li role="option" aria-selected="${lang === "en"}" data-lang="en" class="lang-option${lang === "en" ? " active" : ""}">English</li>
              <li role="option" aria-selected="${lang === "de"}" data-lang="de" class="lang-option${lang === "de" ? " active" : ""}">Deutsch</li>
            </ul>
          </div>
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

    const dropdownBtn = this.querySelector("#lang-dropdown-btn") as HTMLElement;
    const dropdownMenu = this.querySelector(
      "#lang-dropdown-menu",
    ) as HTMLElement;

    dropdownBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.toggle("open");
      dropdownBtn.setAttribute("aria-expanded", String(isOpen));
    });

    this.querySelectorAll(".lang-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const selected = (opt as HTMLElement).dataset.lang as "en" | "de";
        if (selected !== getLanguage()) {
          toggleLanguage();
          const drawer = document.querySelector(
            "guide-drawer",
          ) as HTMLElement & { rerender: () => void };
          drawer?.rerender?.();
        }
        dropdownMenu.classList.remove("open");
        dropdownBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener(
      "click",
      () => {
        dropdownMenu?.classList.remove("open");
        dropdownBtn?.setAttribute("aria-expanded", "false");
      },
      { once: false },
    );
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
