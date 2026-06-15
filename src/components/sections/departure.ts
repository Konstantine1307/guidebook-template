import type { DepartureItem } from "../../data/types";
import { guidebook, getIcon, iconBadge, detailParagraphs, sectionRow, setAccent } from "./helpers";

export function renderDeparture(): string {
  setAccent("var(--icon-departure)");
  const { departure } = guidebook;
  const label = departure.label ?? "Checkout";
  const title = departure.title ?? "Departure";

  const rows = departure.items
    .map((item: DepartureItem) =>
      sectionRow(
        item.icon,
        item.title,
        item.summary,
        `modal-dep-${item.id}`,
        getIcon(item.icon),
        detailParagraphs(item.detail),
      ),
    )
    .join("");

  return `
    <section class="section-card fadein" style="--section-accent:var(--icon-departure)">
      <div class="section-header">
        ${iconBadge("badge-alert", "var(--color-departure)")}
        <div class="section-header-text">
          <p>${label}</p>
          <p class="section-title">${title}</p>
        </div>
      </div>
      <p style="font-size:1rem;text-align:center;font-style:italic;padding:0 1rem">${departure.intro}</p>
      ${rows}
    </section>
  `;
}
