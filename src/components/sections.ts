/**
 * Section renderers — each returns an HTML string injected into the page.
 * Uses the guidebook data from config.ts and icons from icons.ts.
 */

import { guidebook } from "../data/config";
import type {
  Attraction,
  Beach,
  DepartureItem,
  Facility,
  Restaurant,
  Shop,
} from "../data/types";
import { getIcon } from "../icons/icons";

// ---- shared helpers ----

function iconBadge(icon: string, bgColor: string, size = "3rem"): string {
  return `<span class="icon-badge" style="background:${bgColor};width:${size};height:${size}" aria-hidden="true">${getIcon(icon)}</span>`;
}

function detailParagraphs(items: string[]): string {
  return items.map((t) => `<p>${t}</p>`).join("");
}

function modalTrigger(
  id: string,
  title: string,
  iconHtml: string,
  bodyHtml: string,
): string {
  const safeIcon = iconHtml.replace(/"/g, "&quot;").replace(/\n/g, " ");
  return `
    <button
      class="btn-more"
      onclick="document.getElementById('${id}').showModal()"
      aria-label="More information: ${title}"
    >${getIcon("arrow-right")}</button>
    <guide-modal id="${id}" title="${title}" icon-html="${safeIcon}">
      ${bodyHtml}
    </guide-modal>
  `;
}

function sectionRow(
  icon: string,
  title: string,
  summary: string,
  modalId: string,
  iconHtml: string,
  bodyHtml: string,
): string {
  return `
    <div class="section-row">
      <div class="section-row-main">
        <div class="section-row-icon" aria-hidden="true">${getIcon(icon)}</div>
        <div class="section-row-text">
          <p class="row-title">${title}</p>
          <span>${summary}</span>
        </div>
      </div>
      <div>
        ${modalTrigger(modalId, title, iconHtml, bodyHtml)}
      </div>
    </div>
    <hr class="section-divider" />
  `;
}

function sectionCard(
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

// ---- domain extraction ----
function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ================================================================
// CHECK-IN SECTION
// ================================================================
export function renderCheckIn(): string {
  const { arrival } = guidebook;
  const rows = [
    sectionRow(
      "badge-check",
      "Check In",
      arrival.checkIn.summary,
      "modal-checkin",
      getIcon("badge-check"),
      detailParagraphs(arrival.checkIn.detail),
    ),
    sectionRow(
      "key-round",
      "Gaining Access",
      arrival.access.summary,
      "modal-access",
      getIcon("key-round"),
      detailParagraphs(arrival.access.detail),
    ),
    sectionRow(
      "shopping-basket",
      "Welcome Pack",
      arrival.welcomePack.summary,
      "modal-welcomepack",
      getIcon("shopping-basket"),
      detailParagraphs(arrival.welcomePack.detail),
    ),
    sectionRow(
      "wifi",
      "WiFi",
      arrival.wifi.summary,
      "modal-wifi",
      getIcon("wifi"),
      detailParagraphs(arrival.wifi.detail),
    ),
  ].join("");

  return sectionCard(
    "var(--color-arrival)",
    "book-check",
    "Check In",
    "Arrival",
    rows,
  );
}

// ================================================================
// DIRECTIONS SECTION
// ================================================================
export function renderDirections(): string {
  const c = guidebook.contact;
  const contactRows = c.contacts
    .map(
      (p) =>
        `<p class="mb-2"><strong>${p.name}'s Phone:</strong> <a href="tel:${p.phoneHref}" class="text-primary">${p.phone}</a></p>`,
    )
    .join("");

  const addressBody = `
    <p>${c.addressFull}</p>
    <br/>
    <p><strong>Email:</strong> <a href="mailto:${c.email}" class="text-primary">${c.email}</a></p>
    <p><strong>Home Phone:</strong> <a href="tel:${c.homePhoneHref}" class="text-primary">${c.homePhone}</a></p>
    ${contactRows}
  `;

  const mapEmbed = `
    <div style="margin-top:1.5rem">
      <iframe
        src="${c.mapEmbed}"
        width="100%" height="250"
        style="border:0;border-radius:0.375rem;box-shadow:0 4px 12px rgba(0,0,0,0.15)"
        allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
        title="Map to ${guidebook.property.name}"
      ></iframe>
    </div>
  `;

  const directionsBody = `
    <p><a href="${c.what3wordsUrl}" target="_blank" rel="noopener" class="underline"><span style="display:inline-block; vertical-align:top">${getIcon("what3words")}</span> ${c.what3words}</a> is the <a href="${c.what3wordsSiteUrl}" target="_blank" rel="noopener" class="underline">what3words</a> address for ${guidebook.property.name}.</p>
    <p>More accurate than a street address — enter it into the free what3words app to find us easily.</p>
    <br/>
    <p>${c.directions}</p>
    ${mapEmbed}
  `;

  const directionsSummary = `
    <span><a href="${c.what3wordsUrl}" target="_blank" rel="noopener" class="underline" style="font-size:1.1rem"><span style="display:inline-block; vertical-align:top">${getIcon("what3words")}</span> ${c.what3words}</a> is the <a href="${c.what3wordsSiteUrl}" target="_blank" rel="noopener" class="underline">what3words</a> address for ${guidebook.property.name}.</span>
    ${mapEmbed}
  `;

  const parkingBody = detailParagraphs(c.parking.detail);

  const rows = [
    sectionRow(
      "map",
      "Address & Contact",
      c.address,
      "modal-address",
      getIcon("map"),
      addressBody,
    ),
    sectionRow(
      "signpost",
      "Directions",
      directionsSummary,
      "modal-directions",
      getIcon("signpost"),
      directionsBody,
    ),
    sectionRow(
      "circle-parking",
      "Parking",
      c.parking.summary,
      "modal-parking",
      getIcon("circle-parking"),
      parkingBody,
    ),
  ].join("");

  return sectionCard(
    "var(--color-arrival)",
    "plane-landing",
    "Getting Here",
    "Arrival",
    rows,
  );
}

// ================================================================
// FOOD SHOPPING SECTION
// ================================================================
export function renderFoodShopping(): string {
  const meta = guidebook.sections?.shopping;
  const label = meta?.label ?? "Supermarkets & Fish Shops";
  const title = meta?.title ?? "Food Shopping";
  const intro =
    meta?.intro ??
    "Here are some links and directions to the main supermarkets and fishmongers in the area.";

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
    <section class="section-card fadein" id="food-shopping" style="--section-accent:var(--icon-shopping)">
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

// ================================================================
// HOUSE MANUAL SECTION
// ================================================================
export function renderHouseManual(): string {
  const { houseManual } = guidebook;

  const rows = houseManual.facilities
    .map((f: Facility) => {
      const linksHtml = f.links
        ? `<ul style="list-style:none;padding:0;margin-top:0.5rem">${f.links
            .map(
              (l) => `
          <li style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">
            ${getIcon("car")}
            <a href="${l.url}" target="_blank" rel="noopener" style="text-decoration:underline">${l.label}</a>
            ${l.phone ? `<a href="tel:${l.phoneHref}" class="text-primary">${l.phone}</a>` : ""}
          </li>`,
            )
            .join("")}</ul>`
        : "";
      const body = detailParagraphs(f.detail) + linksHtml;
      return sectionRow(
        f.icon,
        f.title,
        f.summary,
        `modal-manual-${f.id}`,
        getIcon(f.icon),
        body,
      );
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
      <p style="font-size:0.875rem">${houseManual.intro}</p>
      ${rows}
    </section>
  `;
}

// ================================================================
// EMERGENCY SECTION
// ================================================================
export function renderEmergency(): string {
  const { emergency } = guidebook;

  const fireInline = `
    <ul style="list-style:disc;padding-left:1.25rem;margin-bottom:0.5rem">
      ${(emergency.fire.steps ?? []).map((s) => `<li>${s}</li>`).join("")}
    </ul>
    <p>${emergency.fire.note ?? ""}</p>
  `;
  const fireModal = fireInline;

  const medicalInline = detailParagraphs(
    emergency.medical.detail ?? [emergency.medical.summary],
  );
  const policeInline = detailParagraphs(
    emergency.police.detail ?? [emergency.police.summary],
  );

  // Emergency rows show full detail inline (not just summary), matching the Astro original
  function emergencyRow(
    icon: string,
    title: string,
    inlineHtml: string,
    modalId: string,
    modalHtml: string,
  ): string {
    const iconHtml = `<span style="color:#b91c1c">${getIcon(icon)}</span>`;
    const safeIcon = iconHtml.replace(/"/g, "&quot;").replace(/\n/g, " ");
    return `
      <div class="section-row">
        <div class="section-row-main" style="align-items:flex-start">
          <div class="section-row-icon" aria-hidden="true" style="color:#b91c1c;margin-top:0.25rem">${getIcon(icon)}</div>
          <div class="section-row-text">
            <p class="row-title">${title}</p>
            ${inlineHtml}
          </div>
        </div>
        <div style="align-self:flex-end">
          <button class="btn-more" onclick="document.getElementById('${modalId}').showModal()" aria-label="More information: ${title}">${getIcon("arrow-right")}</button>
          <guide-modal id="${modalId}" title="${title}" icon-html="${safeIcon}">${modalHtml}</guide-modal>
        </div>
      </div>
      <hr class="section-divider" />
    `;
  }

  const rows = [
    emergencyRow(
      "fire-extinguisher",
      "Fire Procedures",
      fireInline,
      "modal-fire",
      fireModal,
    ),
    emergencyRow(
      "hospital",
      "Medical",
      medicalInline,
      "modal-medical",
      medicalInline,
    ),
    emergencyRow("siren", "Police", policeInline, "modal-police", policeInline),
  ].join("");

  return sectionCard(
    "var(--color-emergency)",
    "shield-plus",
    "Procedures & Urgencies",
    "Emergency",
    rows,
  );
}

// ================================================================
// DEPARTURE SECTION
// ================================================================
export function renderDeparture(): string {
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
      <p style="font-size:0.875rem">${departure.intro}</p>
      ${rows}
    </section>
  `;
}

// ================================================================
// PLACES TO EAT SECTION
// ================================================================
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
        (_, i) =>
          `<span class="${i < r.hearts ? "heart" : "heart-empty"}" aria-hidden="true">♥</span>`,
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

// ================================================================
// BEACHES SECTION
// ================================================================
export function renderBeaches(): string {
  const meta = guidebook.sections?.beaches;
  const label = meta?.label ?? "Nearby beaches";
  const title = meta?.title ?? "Beaches & Coves";
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

// ================================================================
// ATTRACTIONS SECTION
// ================================================================
export function renderAttractions(): string {
  const meta = guidebook.sections?.attractions;
  const label = meta?.label ?? "Things to do";
  const title = meta?.title ?? "Visits - Attractions - Gardens";
  const intro = meta?.intro ?? "";

  const cards = guidebook.attractions
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
