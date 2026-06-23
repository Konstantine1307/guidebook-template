import type { Shop } from "../../data/types";
import { getIcon, getUI, guidebook, iconBadge } from "./helpers";

export function renderFoodShopping(): string {
  const meta = guidebook.sections?.shopping;
  const label = meta?.label ?? getUI().sections.foodShopping.label;
  const title = meta?.title ?? getUI().sections.foodShopping.title;
  const intro = meta?.intro ?? getUI().sections.foodShopping.intro;

  const shopCards = guidebook.shopping
    .map(
      (shop: Shop) => `
    <div class="shop-card">
      <div class="shop-card-header">
        <span class="shop-icon" aria-hidden="true">${getIcon("store")}</span>
        <div class="shop-card-info">
          <p class="shop-location">${shop.location}</p>
          <a href="${shop.url}" target="_blank" rel="noopener" class="shop-name">${shop.name}</a>
        </div>
      </div>
      <iframe
        class="shop-map"
        src="${shop.mapEmbed}"
        title="Map for ${shop.name}"
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  `,
    )
    .join("");

  return `
    <section class="section-card fadein" id="food-shopping" style="--section-accent:var(--icon-shopping); scroll-margin-top: calc(var(--navbar-height) + 1rem)">
      <div class="section-header">
        ${iconBadge("store", "var(--color-shopping)")}
        <div class="section-header-text">
          <p>${label}</p>
          <p class="section-title">${title}</p>
        </div>
      </div>
      <p class="section-subtitle">${intro}</p>
      <div class="card-grid">${shopCards}</div>
    </section>
  `;
}
