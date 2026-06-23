import {
  detailParagraphs,
  getGuidebook,
  getIcon,
  getUI,
  sectionCard,
  sectionRow,
  setAccent,
} from "./helpers";

export function renderCheckIn(): string {
  setAccent("var(--icon-arrival)");
  const { arrival } = getGuidebook();
  const s = getUI().sections.arrival;
  const rows = [
    sectionRow(
      "badge-check",
      s.checkIn,
      arrival.checkIn.summary,
      "modal-checkin",
      getIcon("badge-check"),
      detailParagraphs(arrival.checkIn.detail),
    ),
    sectionRow(
      "key-round",
      s.access,
      arrival.access.summary,
      "modal-access",
      getIcon("key-round"),
      detailParagraphs(arrival.access.detail),
    ),
    sectionRow(
      "shopping-basket",
      s.welcomePack,
      arrival.welcomePack.summary,
      "modal-welcomepack",
      getIcon("shopping-basket"),
      detailParagraphs(arrival.welcomePack.detail),
    ),
    sectionRow(
      "wifi",
      s.wifi,
      arrival.wifi.summary,
      "modal-wifi",
      getIcon("wifi"),
      detailParagraphs(arrival.wifi.detail),
    ),
  ].join("");

  return sectionCard(
    "var(--color-arrival)",
    "book-check",
    s.sectionTitle,
    s.pageTitle,
    rows,
  );
}
