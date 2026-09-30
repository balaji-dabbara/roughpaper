# Rough Paper ✏️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Live](https://img.shields.io/badge/Live-roughpaper.online-4361ee)](https://www.roughpaper.online/)

A minimal, browser-based freehand drawing canvas — like a digital rough paper or notepad you can scribble on.

🌐 **Live app:** [roughpaper.online](https://www.roughpaper.online/)

## Features

- 🖊️ Freehand drawing (mouse + touch)
- 🎨 10 pen colours and 3 brush sizes
- 🧹 Eraser, clear, export-as-PNG
- ↩️ Undo / redo (Ctrl+Z, Ctrl+Shift+Z) — including undoing a clear
- 📄 Multi-page support with auto-save to localStorage
- 📱 Mobile-first responsive UI
- ✅ Installable PWA with offline support (service worker + manifest)

## Project structure (high level)

```
roughpaper/
├── index.html
├── style.css
├── assets/
│   └── icons/
│       ├── icon.png
│       ├── icon-192.png
│       └── icon-512.png
├── js/
│   ├── main.js       ← entry point
│   ├── pwa.js        ← service worker register & install modal
│   ├── canvas.js     ← canvas setup, resize & pen/eraser styles
│   ├── drawing.js    ← draw/erase logic & input events
│   ├── toolbar.js    ← colour, size, eraser & clear controls
│   ├── pages.js      ← multi-page state & per-page persistence
│   ├── storage.js    ← localStorage helpers
│   └── tabs.js       ← page sidebar UI rendering
└── pwa/
    ├── manifest.json
    └── sw.js         ← service worker (caching/offline)
```

## PWA & icons

- Manifest: `pwa/manifest.json`
- Service worker: `pwa/sw.js` (registered from `js/pwa.js`)
- Icons: `assets/icons/icon-192.png`, `assets/icons/icon-512.png` (used in manifest and apple-touch-icon)

Notes:
- Service worker enables offline caching and faster loads.
- Install prompt: a custom modal is shown using the `beforeinstallprompt` event; users can install via that modal or the browser UI.

## Running & testing PWA locally

Service workers and the install flow require HTTPS OR `localhost`. Recommended steps:

1. Serve the repo with a local server (Live Server, `python -m http.server`, or `npx serve`).
2. Open DevTools → Application:
   - Manifest: verify icons and display: standalone
   - Service Workers: confirm `/pwa/sw.js` is registered and active
3. To test offline: enable "Offline" in DevTools → Network and reload — app should still load from cache.
4. To test install flow: either accept the browser install prompt or click the app's install button (modal will appear when `beforeinstallprompt` fires).

## Developer notes

- This repo is primarily client-side; Node is not required to run the app in the browser.
- A small Node helper used for icon resizing was removed. To regenerate icons programmatically later, add a script and reinstall dependencies.
- Whenever you update assets referenced by the service worker, increment `CACHE_NAME` in `pwa/sw.js` so clients refresh their cache.

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Balaji Dabbara
