import {
  detailParagraphs,
  getGuidebook,
  getIcon,
  getUI,
  sectionCard,
  sectionRow,
  setAccent,
} from "./helpers";

export function renderDirections(): string {
  setAccent("var(--icon-arrival)");
  const gb = getGuidebook();
  const c = gb.contact;
  const s = getUI().sections.directions;

  const contactRows = c.contacts
    .map(
      (p: { name: string; phone: string; phoneHref: string }) =>
        `<p style="margin-bottom:0.5rem"><strong>${p.name}'s Phone:</strong> <a href="tel:${p.phoneHref}" style="color:var(--color-primary)">${p.phone}</a></p>`,
    )
    .join("");

  const addressBody = `
    <p>${c.addressFull}</p>
    <br/>
    <p><strong>Email:</strong> <a href="mailto:${c.email}" style="color:var(--color-primary)">${c.email}</a></p>
    ${contactRows}
  `;

  const mapEmbed = `
    <div style="margin-top:1.5rem">
      <iframe
        src="${c.mapEmbed}"
        width="100%" height="250"
        style="border:0;border-radius:0.375rem;box-shadow:0 4px 12px rgba(0,0,0,0.15)"
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
        title="Map to ${gb.property.name}"
      ></iframe>
    </div>
  `;

  // First item in directions array is the intro paragraph; the rest are step-by-step directions
  const [directionsIntro, ...directionSteps] = c.directions;
  const directionDetails = detailParagraphs(directionSteps);

  const directionsBody = `
    <p><a href="${c.what3wordsUrl}" target="_blank" rel="noopener" class="underline"><span style="display:inline-block; vertical-align:top">${getIcon("what3words")}</span> ${c.what3words}</a> is the <a href="${c.what3wordsSiteUrl}" target="_blank" rel="noopener" class="underline">what3words</a> address for ${gb.property.name}.</p>
    <p>${directionsIntro}</p>
    <br/>
    ${directionDetails}
    ${mapEmbed}
  `;

  const directionsSummary = `
    <span><a href="${c.what3wordsUrl}" target="_blank" rel="noopener" class="underline" style="font-size:1.1rem"><span style="display:inline-block; vertical-align:top">${getIcon("what3words")}</span> ${c.what3words}</a> is the <a href="${c.what3wordsSiteUrl}" target="_blank" rel="noopener" class="underline">what3words</a> address for ${gb.property.name}.</span>
    ${mapEmbed}
  `;

  const rows = [
    sectionRow(
      "map",
      s.addressContact,
      c.address,
      "modal-address",
      getIcon("map"),
      addressBody,
    ),
    sectionRow(
      "signpost",
      s.directions,
      directionsSummary,
      "modal-directions",
      getIcon("signpost"),
      directionsBody,
    ),
    sectionRow(
      "circle-parking",
      s.parking,
      c.parking.summary,
      "modal-parking",
      getIcon("circle-parking"),
      detailParagraphs(c.parking.detail),
    ),
  ].join("");

  return sectionCard(
    "var(--color-arrival)",
    "plane-landing",
    s.sectionTitle,
    s.pageTitle,
    rows,
  );
}
