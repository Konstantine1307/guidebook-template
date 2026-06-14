import { renderEmergency } from "../components/sections";
import { guidebook } from "../data/config";
import "../scripts/layout";

const mount = document.getElementById("page-content")!;
mount.innerHTML = renderEmergency();

// Use the property exterior photo as background, same as the Astro original
const wrapper = document.getElementById("page-wrapper-emergency");
if (wrapper && guidebook.property.heroImage) {
  wrapper.style.backgroundImage = `url('${guidebook.property.heroImage}')`;
  wrapper.style.backgroundSize = "cover";
  wrapper.style.backgroundPosition = "center";
}
