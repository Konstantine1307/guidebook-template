import type { Beach } from "../../data/types";
import { domain, guidebook, iconBadge, ui } from "./helpers";

export function renderBeaches(): string {
  const meta = guidebook.sections?.beaches;
  const label = meta?.label ?? ui.sections.beaches.label;
  const title = meta?.title ?? ui.sections.beaches.title;
  const intro = meta?.intro ?? "";

  const cards = guidebook.beaches
    .map(
      (b: Beach) => `
    <a href="${b.url}" target="_blank" rel="noopener" class="link-card">
      <div class="link-card-body">
        <p class="link-card-name">${b.name}</p>
        <p class="link-card-location">${b.location}</p>
        <img src="${b.image}" alt="${b.name}" class="link-card-image" loading="lazy" />
        <p class="link-card-desc">${b.description}</p>
        <p class="link-card-domain">${domain(b.url)}</p>
      </div>
    </a>
  `,
    )
    .join("");

  return `
    <section class="section-card fadein" style="--section-accent:var(--icon-beaches)">
      <div class="section-header">
        ${iconBadge("beach", "var(--color-beaches)")}
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
