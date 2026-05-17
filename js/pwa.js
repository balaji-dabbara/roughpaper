// PWA helper: register service worker and present a custom install modal
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // don't annoy users who dismissed before
  if (localStorage.getItem('pwa-install-dismissed')) return;
  showInstallModal();
});

function showInstallModal() {
  const modal = document.getElementById('install-modal');
  if (!modal) return;
  modal.hidden = false;

  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');
  const closeBtn = document.getElementById('install-close');

  const doHide = (dismiss) => {
    modal.hidden = true;
    if (dismiss) localStorage.setItem('pwa-install-dismissed', '1');
  };

  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    doHide(choice.outcome !== 'accepted');
    deferredPrompt = null;
  };

  installBtn.addEventListener('click', onInstall, { once: true });
  dismissBtn.addEventListener('click', () => doHide(true), { once: true });
  closeBtn.addEventListener('click', () => doHide(true), { once: true });
}

// Clean up when app is installed
window.addEventListener('appinstalled', () => {
  localStorage.removeItem('pwa-install-dismissed');
  const modal = document.getElementById('install-modal');
  if (modal) modal.hidden = true;
  console.log('Rough Paper installed');
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('Service worker registered', reg.scope);
  }).catch(err => {
    console.warn('Service worker registration failed', err);
  });
}
