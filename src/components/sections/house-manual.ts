import type { Facility } from "../../data/types";
import { guidebook, getIcon, iconBadge, detailParagraphs, sectionRow, setAccent } from "./helpers";

export function renderHouseManual(): string {
  setAccent("var(--icon-manual)");
  const { houseManual } = guidebook;

  const rows = houseManual.facilities
    .map((f: Facility) => {
      const linksHtml = f.links
        ? `<ul style="list-style:none;padding:0;margin-top:0.5rem">${f.links
            .map(
              (l) => `
          <li style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
            <span style="flex-shrink:0;width:1.5rem;height:1.5rem;color:var(--section-accent)">${getIcon(f.icon)}</span>
            <span>
              <a href="${l.url}" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:600">${l.label}</a>
              ${l.phone ? `&nbsp;&mdash;&nbsp;<a href="tel:${l.phoneHref}" style="color:var(--color-primary)">${l.phone}</a>` : ""}
            </span>
          </li>`,
            )
            .join("")}</ul>`
        : "";
      const body = detailParagraphs(f.detail) + linksHtml;
      return sectionRow(f.icon, f.title, f.summary, `modal-manual-${f.id}`, getIcon(f.icon), body);
    })
    .join("");

  return `
    <section class="section-card fadein" style="--section-accent:var(--icon-manual)">
      <div class="section-header">
        ${iconBadge("book-user", "var(--color-manual)")}
        <div class="section-header-text">
          <p>Facilities &amp; amenities</p>
          <p class="section-title">House Manual</p>
        </div>
      </div>
      <p class="section-subtitle">${houseManual.intro}</p>
      ${rows}
    </section>
  `;
}
