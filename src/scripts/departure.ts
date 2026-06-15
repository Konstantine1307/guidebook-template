import { renderDeparture } from "../components/sections";
import { guidebook } from "../data/config";
import "../scripts/layout";

const mount = document.getElementById("page-content")!;
mount.innerHTML = renderDeparture();

// Use the property exterior photo as background, same as the Astro original
const wrapper = document.getElementById("page-wrapper-departure");
if (wrapper && guidebook.property.heroImage) {
  wrapper.style.backgroundImage = `url('${guidebook.property.heroImage}')`;
  wrapper.style.backgroundSize = "cover";
  wrapper.style.backgroundPosition = "center";
}
