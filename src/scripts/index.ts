import '../scripts/layout';
import { guidebook } from '../data/config';

// ----- Hero -----
const hero = document.getElementById('hero-mount')!;
hero.innerHTML = `
  <div
    class="hero"
    style="background-image: url(${guidebook.property.heroImage})"
    role="img"
    aria-label="Exterior of ${guidebook.property.name}"
  >
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1>
        Welcome to
        <span>${guidebook.property.name}</span>
        in ${guidebook.property.subtitle}
      </h1>
      <p>${guidebook.hero.body}</p>
      <button
        class="btn-cta"
        onclick="document.querySelector('guide-drawer').open()"
        aria-label="Open navigation menu"
      >
        Get Started
      </button>
    </div>
  </div>
`;
