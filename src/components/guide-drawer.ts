import { getUI, guidebook } from "../data/config";
import { icons } from "../icons/icons";

interface NavItem {
  route: string;
  icon: string;
  bgColor: string;
  textKey: keyof ReturnType<typeof getUI>["nav"];
}

const NAV_ITEMS: NavItem[] = [
  {
    route: "/arrival",
    icon: "plane-landing",
    bgColor: "var(--color-arrival)",
    textKey: "arrival",
  },
  {
    route: "/emergency",
    icon: "shield-plus",
    bgColor: "var(--color-emergency)",
    textKey: "emergencies",
  },
  {
    route: "/house-manual",
    icon: "notebook",
    bgColor: "var(--color-manual)",
    textKey: "houseManual",
  },
  {
    route: "/arrival#food-shopping",
    icon: "store",
    bgColor: "var(--color-shopping)",
    textKey: "foodShopping",
  },
  {
    route: "/departure",
    icon: "plane-takeoff",
    bgColor: "var(--color-departure)",
    textKey: "departure",
  },
  {
    route: "/places-to-eat",
    icon: "utensils",
    bgColor: "var(--color-food)",
    textKey: "restaurants",
  },
  {
    route: "/attractions",
    icon: "ferris-wheel",
    bgColor: "var(--color-attractions)",
    textKey: "attractions",
  },
  {
    route: "/beaches",
    icon: "beach",
    bgColor: "var(--color-beaches)",
    textKey: "beaches",
  },
];

/**
 * <guide-drawer>
 *
 * Slide-in sidebar navigation. Opened via open() method (called by navbar).
 * Closed via overlay click, close button, or Escape key.
 * Exposes rerender() so the navbar lang toggle can refresh nav labels.
 */
class GuideDrawer extends HTMLElement {
  private _overlay!: HTMLElement;
  private _panel!: HTMLElement;

  connectedCallback() {
    this.buildInnerHTML();
    this.attachListeners();
  }

  private buildInnerHTML() {
    const t = getUI();
    this.innerHTML = `
      <div class="drawer-overlay" id="drawer-overlay" aria-hidden="true"></div>
      <nav
        class="drawer-panel"
        id="drawer-panel"
        role="navigation"
        aria-label="Sidebar navigation"
        aria-hidden="true"
      >
        <div class="drawer-top">
          <a href="/" data-route="/" class="drawer-home-link" aria-label="Home">
            <img
              src="${guidebook.property.logo}"
              alt="${guidebook.property.name} logo"
              width="48" height="48"
              style="border-radius:50%"
            />
            <span class="drawer-home-label">${guidebook.property.name}</span>
          </a>
          <button
            class="navbar-menu-btn"
            aria-label="Close navigation menu"
            id="drawer-close"
          >
            ${icons["menu"]}
          </button>
        </div>

        <ul class="drawer-nav" role="list">
          ${NAV_ITEMS.map(
            (item) => `
            <li>
              <a href="${item.route}" data-route="${item.route}">
                <span class="nav-icon" style="background:${item.bgColor}" aria-hidden="true">
                  ${icons[item.icon] ?? ""}
                </span>
                ${t.nav[item.textKey]}
              </a>
            </li>
          `,
          ).join("")}
        </ul>
      </nav>
    `;
  }

  private attachListeners() {
    this._overlay = this.querySelector("#drawer-overlay") as HTMLElement;
    this._panel = this.querySelector("#drawer-panel") as HTMLElement;

    this._overlay.addEventListener("click", () => this.close());
    this.querySelector("#drawer-close")?.addEventListener("click", () =>
      this.close(),
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  }

  /** Re-render nav labels in place (called after language toggle) */
  rerender() {
    const wasOpen = this._panel?.classList.contains("open");
    this.buildInnerHTML();
    this.attachListeners();
    if (wasOpen) {
      this._panel = this.querySelector("#drawer-panel") as HTMLElement;
      this._overlay = this.querySelector("#drawer-overlay") as HTMLElement;
      this._panel?.classList.add("open");
      this._overlay?.classList.add("open");
      this._panel?.setAttribute("aria-hidden", "false");
    }
  }

  open() {
    this._panel?.classList.add("open");
    this._overlay?.classList.add("open");
    this._panel?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    this.querySelector<HTMLElement>("#drawer-close")?.focus();
  }

  close() {
    this._panel?.classList.remove("open");
    this._overlay?.classList.remove("open");
    this._panel?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document
      .querySelector("#drawer-toggle")
      ?.setAttribute("aria-expanded", "false");
    document.querySelector<HTMLElement>("#drawer-toggle")?.focus();
  }
}

customElements.define("guide-drawer", GuideDrawer);
