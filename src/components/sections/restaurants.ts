import type { Restaurant } from "../../data/types";
import { domain, getUI, getGuidebook, iconBadge } from "./helpers";

export function renderRestaurants(): string {
  const gb = getGuidebook();
  const meta = gb.sections?.restaurants;
  const label = meta?.label ?? getUI().sections.restaurants.label;
  const title = meta?.title ?? getUI().sections.restaurants.title;
  const intro = meta?.intro ?? "";
  const MAX_HEARTS = 3;

  const cards = gb.restaurants
    .map((r: Restaurant) => {
      const hearts = Array.from(
        { length: MAX_HEARTS },
        (_, i) =>
          `<span class="${i < r.hearts ? "heart" : "heart-empty"}" aria-hidden="true">♥</span>`,
      ).join("");

      return `
      <div class="restaurant-card">
      <a href="${r.url}" target="_blank" rel="noopener" style="text-decoration: none;">
        <div class="link-card-body">
          <p class="link-card-name">${r.name}</p>
          <p class="link-card-location">${r.location}</p>
          <p class="link-card-desc">${r.description}</p>
          <p class="link-card-domain">${domain(r.url)}</p>
          <div class="hearts" aria-label="${r.hearts} of ${MAX_HEARTS} hearts">${hearts}</div>
        </div>
      </a>
      </div>
    `;
    })
    .join("");

  return `
    <section class="section-card fadein" style="--section-accent:var(--icon-food)">
      <div class="section-header">
        ${iconBadge("utensils", "var(--color-food)")}
        <div class="section-header-text">
          <p class="section-title">${label}</p>
          <p>${title}</p>
        </div>
      </div>
      ${intro ? `<p class="section-subtitle">${intro}</p>` : ""}
      <div class="card-grid">${cards}</div>
    </section>
  `;
}
