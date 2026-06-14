/**
 * <guide-modal id="my-modal" title="My Section" icon-html="<svg...>">
 *   Slot content goes here (innerHTML before upgrade, or set via setContent())
 * </guide-modal>
 *
 * Opened via: document.getElementById('my-modal').showModal()
 * Or via the trigger button rendered by renderModalTrigger().
 */
class GuideModal extends HTMLElement {
  private _dialog!: HTMLDialogElement;

  connectedCallback() {
    const title   = this.getAttribute('title') ?? '';
    const iconHtml = this.getAttribute('icon-html') ?? '';
    const body    = this.innerHTML;

    this.innerHTML = `
      <dialog class="guide-dialog">
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

    this._dialog = this.querySelector('dialog') as HTMLDialogElement;

    this.querySelector('.btn-close')?.addEventListener('click', () => this.closeModal());

    this._dialog.addEventListener('click', (e) => {
      if (e.target === this._dialog) this.closeModal();
    });

    this._dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); this.closeModal(); }
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
    const body = this._dialog?.querySelector('.dialog-body');
    if (body) body.innerHTML = html;
  }
}

customElements.define('guide-modal', GuideModal);

// ---- Helper: render a trigger button + modal pair from data ----

interface ModalOptions {
  id: string;
  title: string;
  iconHtml: string;
  bodyHtml: string;
}

export function renderModal({ id, title, iconHtml, bodyHtml }: ModalOptions): string {
  return `
    <button
      class="btn-more"
      onclick="document.getElementById('${id}-modal').showModal()"
      aria-label="More information about ${title}"
    >
      ${`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>`}
    </button>
    <guide-modal
      id="${id}-modal"
      title="${title}"
      icon-html="${encodeForAttr(iconHtml)}"
    >${bodyHtml}</guide-modal>
  `;
}

function encodeForAttr(html: string): string {
  return html.replace(/"/g, '&quot;').replace(/\n/g, '');
}
