# Rough Paper ✏️

A minimal, browser-based freehand drawing canvas — like a digital rough paper or notepad you can scribble on.

## Features

- 🎨 **10 preset color swatches** — black, white, red, orange, yellow, green, teal, blue, purple, pink
- ✏️ **3 brush sizes** — thin, medium, thick
- 🗑️ **Clear button** — wipe the canvas clean
- 💾 **Auto-save to localStorage** — your drawing persists across page refreshes
- 📱 **Touch support** — works on tablets and mobile devices

## Project structure

```
roughpaper/
├── index.html
├── style.css
└── js/
    ├── main.js       ← entry point
    ├── state.js      ← shared drawing state
    ├── canvas.js     ← canvas setup & resize
    ├── storage.js    ← localStorage persistence
    ├── drawing.js    ← draw logic & input events
    └── toolbar.js    ← colour, size & clear controls
```

## Running locally

The app is purely client-side — no build step, no package manager, no dependencies.

### Option 1 — Direct file open (simplest)

> ⚠️ Some browsers block ES module imports from `file://` URLs.  
> Use **Option 2 or 3** if the canvas doesn't load.

Double-click `index.html`, or open it from the browser:

```
File → Open File → index.html
```

### Option 2 — VS Code Live Server (recommended)

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. The app opens at `http://127.0.0.1:5500`.

### Option 3 — Any local HTTP server

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

Then open the printed URL in your browser.
