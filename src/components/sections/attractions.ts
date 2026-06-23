import type { Attraction } from "../../data/types";
import { domain, getUI, getGuidebook, iconBadge } from "./helpers";

export function renderAttractions(): string {
  const gb = getGuidebook();
  const meta = gb.sections?.attractions;
  const label = meta?.label ?? getUI().sections.attractions.label;
  const title = meta?.title ?? getUI().sections.attractions.title;
  const intro = meta?.intro ?? "";

  const cards = gb.attractions
    .map(
      (a: Attraction) => `
    <a href="${a.url}" target="_blank" rel="noopener" class="link-card">
      <div class="link-card-body">
        <p class="link-card-name">${a.name}</p>
        <p class="link-card-location">${a.location}</p>
        <img src="${a.image}" alt="${a.name}" class="link-card-image" loading="lazy" />
        <h3 class="link-card-title">${a.title}</h3>
        <p class="link-card-desc">${a.description}</p>
        <p class="link-card-domain">${domain(a.url)}</p>
      </div>
    </a>
  `,
    )
    .join("");

  return `
    <section class="section-card fadein" style="--section-accent:var(--icon-attractions)">
      <div class="section-header">
        ${iconBadge("ferris-wheel", "var(--color-attractions)")}
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
