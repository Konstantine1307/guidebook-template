import { registerSW } from 'virtual:pwa-register';

/**
 * PWA service worker registration + reload toast UI.
 * Mounted once in the shared layout script.
 */
export function initPWA() {
  const toast = document.getElementById('pwa-toast');
  const toastMsg = document.getElementById('pwa-toast-msg');
  const btnReload = document.getElementById('pwa-btn-reload');
  const btnDismiss = document.getElementById('pwa-btn-dismiss');

  const updateSW = registerSW({
    onNeedRefresh() {
      if (toast && toastMsg) {
        toastMsg.textContent = 'New version available.';
        toast.classList.add('show');
      }
    },
    onOfflineReady() {
      if (toast && toastMsg) {
        toastMsg.textContent = 'App ready to work offline.';
        toast.classList.add('show');
      }
    },
  });

  btnReload?.addEventListener('click', () => {
    toast?.classList.remove('show');
    updateSW(true);
  });

  btnDismiss?.addEventListener('click', () => {
    toast?.classList.remove('show');
  });
}
