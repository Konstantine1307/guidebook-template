import { guidebook } from "../data/config";
import { icons } from "../icons/icons";

interface NavItem {
  href: string;
  icon: string;
  bgColor: string;
  text: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/arrival.html",
    icon: "plane-landing",
    bgColor: "var(--color-arrival)",
    text: "Arrival",
  },
  {
    href: "/emergency.html",
    icon: "shield-plus",
    bgColor: "var(--color-emergency)",
    text: "Emergencies",
  },
  {
    href: "/house-manual.html",
    icon: "notebook",
    bgColor: "var(--color-manual)",
    text: "House Manual",
  },
  {
    href: "/arrival.html#food-shopping",
    icon: "store",
    bgColor: "var(--color-shopping)",
    text: "Food Shopping",
  },
  {
    href: "/departure.html",
    icon: "plane-takeoff",
    bgColor: "var(--color-departure)",
    text: "Departure",
  },
  {
    href: "/places-to-eat.html",
    icon: "utensils",
    bgColor: "var(--color-food)",
    text: "Places To Eat",
  },
  {
    href: "/attractions.html",
    icon: "ferris-wheel",
    bgColor: "var(--color-attractions)",
    text: "Attractions",
  },
  {
    href: "/beaches.html",
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
          <a href="/" class="drawer-home-link" aria-label="Home">
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
              <a href="${item.href}">
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
