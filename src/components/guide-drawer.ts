import { guidebook } from "../data/config";
import { icons } from "../icons/icons";

interface NavItem {
  route: string;
  icon: string;
  bgColor: string;
  text: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    route: "/arrival",
    icon: "plane-landing",
    bgColor: "var(--color-arrival)",
    text: "Arrival",
  },
  {
    route: "/emergency",
    icon: "shield-plus",
    bgColor: "var(--color-emergency)",
    text: "Emergencies",
  },
  {
    route: "/house-manual",
    icon: "notebook",
    bgColor: "var(--color-manual)",
    text: "House Manual",
  },
  {
    route: "/arrival",
    icon: "store",
    bgColor: "var(--color-shopping)",
    text: "Food Shopping",
  },
  {
    route: "/departure",
    icon: "plane-takeoff",
    bgColor: "var(--color-departure)",
    text: "Departure",
  },
  {
    route: "/places-to-eat",
    icon: "utensils",
    bgColor: "var(--color-food)",
    text: "Places To Eat",
  },
  {
    route: "/attractions",
    icon: "ferris-wheel",
    bgColor: "var(--color-attractions)",
    text: "Attractions",
  },
  {
    route: "/beaches",
    icon: "beach",
    bgColor: "var(--color-beaches)",
    text: "Beaches",
  },
];

/**
 * <guide-drawer>
 *
 * Slide-in sidebar navigation. Opened via open() method (called by navbar).
 * Closed via overlay click, close button, or Escape key.
 */
class GuideDrawer extends HTMLElement {
  private _overlay!: HTMLElement;
  private _panel!: HTMLElement;

  connectedCallback() {
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
                ${item.text}
              </a>
            </li>
          `,
          ).join("")}
        </ul>
      </nav>
    `;

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
