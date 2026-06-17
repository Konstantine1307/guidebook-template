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
import { guidebook } from "../data/config";

// Route definitions: path -> render function and metadata
type RouteHandler = () => string;

interface Route {
  path: string;
  render: RouteHandler;
  title: string;
  bodyClass: string;
}

const routes: Route[] = [
  {
    path: "/",
    render: () => renderHouseManual(),
    title: "House Manual",
    bodyClass: "bg-manual",
  },
  {
    path: "/arrival",
    render: () => renderDirections() + renderCheckIn() + renderFoodShopping(),
    title: "Arrival",
    bodyClass: "bg-arrival",
  },
  {
    path: "/house-manual",
    render: () => renderHouseManual(),
    title: "House Manual",
    bodyClass: "bg-manual",
  },
  {
    path: "/places-to-eat",
    render: () => renderRestaurants(),
    title: "Places to Eat",
    bodyClass: "bg-food",
  },
  {
    path: "/beaches",
    render: () => renderBeaches(),
    title: "Beaches",
    bodyClass: "bg-beaches",
  },
  {
    path: "/attractions",
    render: () => renderAttractions(),
    title: "Attractions",
    bodyClass: "bg-attractions",
  },
  {
    path: "/emergency",
    render: () => renderEmergency(),
    title: "Emergency",
    bodyClass: "bg-emergency",
  },
  {
    path: "/departure",
    render: () => renderDeparture(),
    title: "Departure",
    bodyClass: "bg-departure",
  },
];

// Get current route based on pathname
function getCurrentRoute(): Route {
  const path = window.location.pathname;
  // Remove trailing slash and handle root
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  return routes.find((r) => r.path === normalizedPath) || routes[0];
}

// Update page content with view transition
async function navigateTo(path: string, pushState = true): Promise<void> {
  const route = routes.find((r) => r.path === path) || routes[0];

  // Use View Transitions API for smooth animation
  if (document.startViewTransition) {
    await document.startViewTransition(() => {
      updatePageContent(route);
    }).ready;
  } else {
    updatePageContent(route);
  }

  // Update browser history
  if (pushState) {
    history.pushState({ path }, "", path);
  }

  // Update page title
  const propertyName = guidebook.property.name;
  document.title = `${propertyName} | ${route.title}`;

  // Update active state in drawer
  updateDrawerActiveState(path);
}

// Update DOM for the route
function updatePageContent(route: Route): void {
  const contentContainer = document.getElementById("page-content");
  const pageWrapper = document.querySelector(".page-wrapper") as HTMLElement;
  const navbar = document.querySelector("guide-navbar") as HTMLElement;

  if (!contentContainer || !pageWrapper) return;

  // Update body class for background
  document.body.className = route.bodyClass;

  // Update page wrapper background class
  pageWrapper.className = `page-wrapper ${route.bodyClass}`;

  // Update navbar title
  if (navbar) {
    navbar.setAttribute("title", route.title);
  }

  // Update content
  contentContainer.innerHTML = route.render();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
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
  // Handle initial page load
  const initialRoute = getCurrentRoute();
  updatePageContent(initialRoute);

  // Update page title for initial load
  const propertyName = guidebook.property.name;
  document.title = `${propertyName} | ${initialRoute.title}`;

  // Listen for popstate (back/forward buttons)
  window.addEventListener("popstate", (e) => {
    const path = e.state?.path || window.location.pathname;
    const route = routes.find((r) => r.path === path) || routes[0];
    updatePageContent(route);
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
