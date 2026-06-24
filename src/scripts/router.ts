/**
 * SPA Router with History API
 * Handles client-side navigation without page reloads
 */

import { renderCheckIn } from "../components/sections/arrival";
import { renderAttractions } from "../components/sections/attractions";
import { renderBeaches } from "../components/sections/beaches";
import { renderDeparture } from "../components/sections/departure";
import { renderDirections } from "../components/sections/directions";
import { renderEmergency } from "../components/sections/emergency";
import { renderFoodShopping } from "../components/sections/food-shopping";
import { renderHouseManual } from "../components/sections/house-manual";
import { renderRestaurants } from "../components/sections/restaurants";
import { getGuidebook, getUI, guidebook } from "../data/config";

// Home / welcome page
function renderHome(): string {
  const gb = getGuidebook();
  const { name, heroImage } = gb.property;
  const { body, heading, subheading } = gb.hero;
  return `
    <div
      class="hero"
      style="background-image: url(${heroImage})"
      role="img"
      aria-label="Exterior of ${name}"
    >
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>${heading.replace(name, `<span>${name}</span>`)}</h1>
        <h2 class="subheading">${subheading}</h2>
        <p>${body}</p>
        <button
          class="btn-cta"
          onclick="document.querySelector('guide-drawer').open()"
          aria-label="${getUI().hero.openMenuAriaLabel}"
        >
          ${getUI().hero.getStarted}
        </button>
      </div>
    </div>
  `;
}

// Route definitions: path -> render function and metadata
type RouteHandler = () => string;

interface Route {
  path: string;
  render: RouteHandler;
  title: string;
  bodyClass: string;
}

// Routes are built fresh on each call so titles reflect the current language
function getRoutes(): Route[] {
  const t = getUI().routes;
  return [
    {
      path: "/",
      render: () => renderHome(),
      title: t.welcome,
      bodyClass: "bg-home",
    },
    {
      path: "/arrival",
      render: () => renderDirections() + renderCheckIn() + renderFoodShopping(),
      title: t.arrival,
      bodyClass: "bg-arrival",
    },
    {
      path: "/house-manual",
      render: () => renderHouseManual(),
      title: t.houseManual,
      bodyClass: "bg-manual",
    },
    {
      path: "/places-to-eat",
      render: () => renderRestaurants(),
      title: t.restaurants,
      bodyClass: "bg-food",
    },
    {
      path: "/beaches",
      render: () => renderBeaches(),
      title: t.beaches,
      bodyClass: "bg-beaches",
    },
    {
      path: "/attractions",
      render: () => renderAttractions(),
      title: t.attractions,
      bodyClass: "bg-attractions",
    },
    {
      path: "/emergency",
      render: () => renderEmergency(),
      title: t.emergency,
      bodyClass: "bg-emergency",
    },
    {
      path: "/departure",
      render: () => renderDeparture(),
      title: t.departure,
      bodyClass: "bg-departure",
    },
  ];
}

// Keep a module-level reference for external use (e.g. export)
let routes: Route[] = [];

// Get current route based on pathname
function getCurrentRoute(): Route {
  const path = window.location.pathname;
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  const r = getRoutes();
  return r.find((rt) => rt.path === normalizedPath) || r[0];
}

// Update page content - NO view transitions to prevent navbar flash
async function navigateTo(path: string, pushState = true): Promise<void> {
  // Parse path and hash (e.g., "/arrival#food-shopping")
  const [pathname, hash] = path.split("#");
  const r = getRoutes();
  const route = r.find((rt) => rt.path === pathname) || r[0];

  // Instant update - no view transitions to avoid navbar flash
  updatePageContent(route, hash);

  // Update browser history
  if (pushState) {
    history.pushState({ path }, "", path);
  }

  // Update page title
  const propertyName = guidebook.property.name;
  document.title = `${propertyName} | ${route.title}`;

  // Update active state in drawer (use pathname without hash)
  updateDrawerActiveState(pathname);

  // Close the drawer after navigation
  const drawer = document.querySelector("guide-drawer") as HTMLElement & {
    close: () => void;
  };
  drawer?.close?.();
}

// Update DOM for the route
function updatePageContent(route: Route, hash?: string): void {
  const contentContainer = document.getElementById("page-content");
  const pageWrapper = document.querySelector(".page-wrapper") as HTMLElement;
  const navbar = document.querySelector("guide-navbar") as HTMLElement;

  if (!contentContainer || !pageWrapper) return;

  // Update body class for background (CSS expects .bg-xxx .page-wrapper)
  document.body.className = route.bodyClass;

  // page-wrapper stays as just 'page-wrapper' - background comes from body class
  pageWrapper.className = "page-wrapper";

  // Update navbar title
  if (navbar) {
    navbar.setAttribute("title", route.title);
  }

  // Update content
  contentContainer.innerHTML = route.render();

  // Home page: let hero fill full width via CSS class
  contentContainer.classList.toggle("is-home", route.path === "/");

  // Scroll to hash element or top
  if (hash) {
    setTimeout(() => {
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Update active state in drawer links
function updateDrawerActiveState(currentPath: string): void {
  const drawer = document.querySelector("guide-drawer");
  if (!drawer) return;

  // Remove active class from all links
  drawer.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current route
  const activeLink = drawer.querySelector(`[data-route="${currentPath}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Initialize router
export function initRouter(): void {
  // Build initial routes
  routes = getRoutes();

  // Handle initial page load (including hash)
  const initialRoute = getCurrentRoute();
  const initialHash = window.location.hash.replace("#", "");
  updatePageContent(initialRoute, initialHash);

  // Update page title for initial load
  const propertyName = guidebook.property.name;
  document.title = `${propertyName} | ${initialRoute.title}`;

  // Listen for popstate (back/forward buttons)
  window.addEventListener("popstate", (e) => {
    const fullPath =
      e.state?.path || window.location.pathname + window.location.hash;
    const [pathname, hash] = fullPath.split("#");
    const r = getRoutes();
    const route = r.find((rt) => rt.path === pathname) || r[0];
    updatePageContent(route, hash);
  });

  // Re-render current page when language changes
  window.addEventListener("language-changed", () => {
    routes = getRoutes();
    const route = getCurrentRoute();
    updatePageContent(route);
    document.title = `${guidebook.property.name} | ${route.title}`;
  });

  // Intercept all navigation clicks
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest("[data-route]") as HTMLElement;

    if (link) {
      e.preventDefault();
      const path = link.getAttribute("data-route") || "/";
      navigateTo(path);
    }
  });
}

// Export for manual navigation if needed
export { navigateTo, routes };
