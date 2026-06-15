import { renderDeparture } from "../components/sections";
import { guidebook } from "../data/config";
import "../scripts/layout";

const mount = document.getElementById("page-content")!;
mount.innerHTML = renderDeparture();

// Use the property exterior photo as background on desktop only
const wrapper = document.getElementById("page-wrapper-departure");
if (wrapper && guidebook.property.heroImage && window.innerWidth >= 768) {
  wrapper.style.backgroundImage = `url('${guidebook.property.heroImage}')`;
  wrapper.style.backgroundSize = "cover";
  wrapper.style.backgroundPosition = "center";
}
