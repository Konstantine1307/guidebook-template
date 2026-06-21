/**
 * Shared helpers used by all section renderers.
 */

import { guidebook } from "../../data/config";
import { getIcon } from "../../icons/icons";

// Module-level accent colour, set before building rows so modals inherit it
export let _currentAccent = "var(--color-primary)";
export function setAccent(val: string) { _currentAccent = val; }

export function iconBadge(icon: string, bgColor: string, size = "3rem"): string {
  return `<span class="icon-badge" style="background:${bgColor};width:${size};height:${size}" aria-hidden="true">${getIcon(icon)}</span>`;
}

export function detailParagraphs(items: string[]): string {
  return items.map((t) => `<p>${t}</p>`).join("");
}

export function modalTrigger(
  id: string,
  title: string,
  iconName: string,
  bodyHtml: string,
  accentColor = "var(--color-primary)",
): string {
  return `
    <button
      class="btn-more"
      onclick="document.getElementById('${id}').showModal()"
      aria-label="More information: ${title}"
    >${getIcon("arrow-right")}</button>
    <guide-modal id="${id}" title="${title}" data-icon="${iconName}" data-accent="${accentColor}">
      ${bodyHtml}
    </guide-modal>
  `;
}

export function sectionRow(
  icon: string,
  title: string,
  summary: string,
  modalId: string,
  _iconHtml: string,
  bodyHtml: string,
): string {
  return `
    <div class="section-row">
      <div class="section-row-main">
        <div class="section-row-icon" style="color:var(--section-accent)" aria-hidden="true">${getIcon(icon)}</div>
        <div class="section-row-text">
          <p class="row-title">${title}</p>
          <span>${summary}</span>
        </div>
      </div>
      <div>
        ${modalTrigger(modalId, title, icon, bodyHtml, _currentAccent)}
      </div>
    </div>
    <hr class="section-divider" />
  `;
}

export function sectionCard(
  accentBg: string,
  iconName: string,
  sectionLabel: string,
  sectionTitle: string,
  rows: string,
): string {
  const badge = iconBadge(iconName, accentBg);
  // Derive a solid icon colour from the accent (replace var(--color-X) → var(--icon-X))
  const iconAccent = accentBg.replace("--color-", "--icon-");
  return `
    <section class="section-card fadein" style="--section-accent:${iconAccent}">
      <div class="section-header">
        ${badge}
        <div class="section-header-text">
          <p>${sectionLabel}</p>
          <p class="section-title">${sectionTitle}</p>
        </div>
      </div>
      ${rows}
    </section>
  `;
}

export function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export { guidebook, getIcon };
