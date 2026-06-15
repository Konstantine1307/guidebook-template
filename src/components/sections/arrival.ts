import { guidebook, getIcon, detailParagraphs, sectionRow, sectionCard, setAccent } from "./helpers";

export function renderCheckIn(): string {
  setAccent("var(--icon-arrival)");
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

  return sectionCard("var(--color-arrival)", "book-check", "Check In", "Arrival", rows);
}
