/**
 * <guide-modal id="my-modal" title="My Section" data-icon="icon-name">
 *   Body content (innerHTML before upgrade)
 * </guide-modal>
 *
 * Opened via: document.getElementById('my-modal').showModal()
 * Or via the trigger button rendered by sectionRow() in sections.ts.
 *
 * NOTE: Icon is passed as a name via data-icon (not raw SVG) to avoid
 * HTML attribute encoding issues with SVG strings.
 */

import { getIcon } from "../icons/icons";

class GuideModal extends HTMLElement {
  private _dialog!: HTMLDialogElement;

  connectedCallback() {
    const title = this.getAttribute("title") ?? "";
    // Look up icon by name — avoids SVG/HTML-attribute encoding issues
    const iconName = this.dataset.icon ?? "";
    const iconHtml = iconName ? getIcon(iconName) : "";
    // Accent colour passed as data-accent — applied as inline CSS var on the dialog
    // (dialogs render in the top layer and don't inherit CSS vars from their DOM parent)
    const accent = this.dataset.accent ?? "var(--color-primary)";
    const body = this.innerHTML;

    this.innerHTML = `
      <dialog class="guide-dialog" style="--section-accent:${accent}">
        <div class="dialog-inner">
          <div class="dialog-header">
            <span class="dialog-icon" aria-hidden="true">${iconHtml}</span>
            <span class="dialog-title">${title}</span>
          </div>
          <div class="dialog-body">${body}</div>
          <div class="dialog-footer">
            <button class="btn-close" autofocus>Close</button>
          </div>
        </div>
      </dialog>
    `;

    this._dialog = this.querySelector("dialog") as HTMLDialogElement;

    this.querySelector(".btn-close")?.addEventListener("click", () =>
      this.closeModal(),
    );

    this._dialog.addEventListener("click", (e) => {
      if (e.target === this._dialog) this.closeModal();
    });

    this._dialog.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this.closeModal();
      }
    });
  }

  showModal() {
    this._dialog?.showModal();
  }

  closeModal() {
    this._dialog?.close();
  }

  /** Replace the body content after initial render */
  setContent(html: string) {
    const body = this._dialog?.querySelector(".dialog-body");
    if (body) body.innerHTML = html;
  }
}

customElements.define("guide-modal", GuideModal);
