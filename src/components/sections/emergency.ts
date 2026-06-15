import { guidebook, getIcon, detailParagraphs, sectionCard, setAccent } from "./helpers";

export function renderEmergency(): string {
  setAccent("var(--icon-emergency)");
  const { emergency } = guidebook;

  const fireInline = `
    <ul style="list-style:disc;padding-left:1.25rem;margin-bottom:0.5rem">
      ${(emergency.fire.steps ?? []).map((s) => `<li>${s}</li>`).join("")}
    </ul>
    <p>${emergency.fire.note ?? ""}</p>
  `;

  const medicalInline = detailParagraphs(emergency.medical.detail ?? [emergency.medical.summary]);
  const policeInline = detailParagraphs(emergency.police.detail ?? [emergency.police.summary]);

  function emergencyRow(
    icon: string,
    title: string,
    inlineHtml: string,
    modalId: string,
    modalHtml: string,
  ): string {
    return `
      <div class="section-row">
        <div class="section-row-main" style="align-items:flex-start">
          <div class="section-row-icon" aria-hidden="true" style="color:#b91c1c;margin-top:0.25rem">${getIcon(icon)}</div>
          <div class="section-row-text">
            <p class="row-title" style="font-size:1.1rem;font-weight:700">${title}</p>
            ${inlineHtml}
          </div>
        </div>
        <div style="align-self:flex-end">
          <button class="btn-more" onclick="document.getElementById('${modalId}').showModal()" aria-label="More information: ${title}">${getIcon("arrow-right")}</button>
          <guide-modal id="${modalId}" title="${title}" data-icon="${icon}" data-accent="#b91c1c">${modalHtml}</guide-modal>
        </div>
      </div>
      <hr class="section-divider" />
    `;
  }

  const rows = [
    emergencyRow("fire-extinguisher", "Fire Procedures", fireInline, "modal-fire", fireInline),
    emergencyRow("hospital", "Medical", medicalInline, "modal-medical", medicalInline),
    emergencyRow("siren", "Police", policeInline, "modal-police", policeInline),
  ].join("");

  return sectionCard("var(--color-emergency)", "shield-plus", "Procedures & Urgencies", "Emergency", rows);
}
