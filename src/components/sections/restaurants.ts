import type { Restaurant } from "../../data/types";
import { guidebook, iconBadge, domain } from "./helpers";

export function renderRestaurants(): string {
  const meta = guidebook.sections?.restaurants;
  const label = meta?.label ?? "Places to Eat";
  const title = meta?.title ?? "Restaurants, Cafes, Bars & Eateries";
  const intro = meta?.intro ?? "";
  const MAX_HEARTS = 3;

  const cards = guidebook.restaurants
    .map((r: Restaurant) => {
      const hearts = Array.from(
        { length: MAX_HEARTS },
        (_, i) => `<span class="${i < r.hearts ? "heart" : "heart-empty"}" aria-hidden="true">♥</span>`,
      ).join("");

      return `
      <div class="restaurant-card">
        <div class="link-card-body">
          <a href="${r.url}" target="_blank" rel="noopener" class="link-card-name">${r.name}</a>
          <p class="link-card-location">${r.location}</p>
          <p class="link-card-desc">${r.description}</p>
          <p class="link-card-domain">${domain(r.url)}</p>
          <div class="hearts" aria-label="${r.hearts} of ${MAX_HEARTS} hearts">${hearts}</div>
        </div>
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
