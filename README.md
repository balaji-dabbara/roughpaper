# Rough Paper ✏️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Live](https://img.shields.io/badge/Live-roughpaper.online-4361ee)](https://www.roughpaper.online/)

A minimal, browser-based freehand drawing canvas — like a digital rough paper or notepad you can scribble on.

🌐 **Live app:** [roughpaper.online](https://www.roughpaper.online/)

## Features

- 🖊️ **Freehand drawing** — smooth pen strokes with touch & mouse support
- 🎨 **10 pen colour swatches** — black, white, red, orange, yellow, green, teal, blue, purple, pink
- 🖼️ **8 background colours** — white, cream, warm paper, sand, sky, pale yellow, gray, black
- ✏️ **3 brush sizes** — thin, medium, thick
- 🧹 **Eraser tool** — wipe strokes without clearing the whole canvas
- 📄 **Multi-page support** — up to 10 pages per session, each with independent canvas & background
- 🏷️ **Rename pages** — double-click any page label in the sidebar to rename it
- 💾 **Auto-save to localStorage** — all pages persist across page refreshes
- 📤 **Export as PNG** — download the current page as a PNG image
- 🗑️ **Clear button** — wipe the current page clean
- 📱 **Mobile friendly** — responsive layout with horizontal page strip on small screens

## Project structure

```
roughpaper/
├── index.html
├── style.css
├── icon.png
└── js/
    ├── main.js       ← entry point
    ├── state.js      ← shared drawing state
    ├── canvas.js     ← canvas setup, resize & pen/eraser styles
    ├── storage.js    ← localStorage helpers
    ├── drawing.js    ← draw/erase logic & input events
    ├── toolbar.js    ← colour, size, eraser & clear controls
    ├── pages.js      ← multi-page state & per-page persistence
    └── tabs.js       ← page sidebar UI rendering
```

## Running locally

The app is purely client-side — no build step, no package manager, no dependencies.

### Option 1 — VS Code Live Server (recommended)

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. The app opens at `http://127.0.0.1:5500`.

### Option 2 — Any local HTTP server

**Node.js** (`npx`, no install needed):
```bash
npx serve .
# → http://localhost:3000
```

**Python 3:**
```bash
python -m http.server 8080
# → http://localhost:8080
```

**PHP:**
```bash
php -S localhost:8080
# → http://localhost:8080
```

> ⚠️ Opening `index.html` directly via `file://` may block ES module imports in some browsers. Use a local server if the canvas doesn't load.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) © 2026 Balaji Dabbara
