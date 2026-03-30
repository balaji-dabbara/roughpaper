# Contributing to Rough Paper

Thank you for taking the time to contribute! 🎉

## Getting started

1. **Fork** the repository and clone your fork.
2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes, then open a Pull Request against `main`.

## Development setup

No build tools or package manager required. Serve the project with any local HTTP server:

```bash
# Node.js (npx, no install needed)
npx serve .

# Python 3
python -m http.server 8080
```

Then open `http://localhost:3000` (or the printed URL) in your browser.

## Guidelines

- Keep the project **dependency-free** — no npm packages, no bundler.
- Use **native ES Modules** (`import`/`export`) consistent with the existing `js/` structure.
- Follow the existing module boundaries:
  | Module | Owns |
  |---|---|
  | `js/state.js` | Shared state mutations |
  | `js/canvas.js` | Canvas/context operations |
  | `js/storage.js` | Persistence |
  | `js/drawing.js` | Draw logic & input events |
  | `js/toolbar.js` | Toolbar UI events |
  | `js/main.js` | Initialisation only |
- Write clean, readable code. Comment only where intent isn't obvious.
- Test your changes manually in at least one modern browser before opening a PR.

## Reporting bugs

Open a [GitHub Issue](../../issues) with:
- Steps to reproduce
- Expected vs actual behaviour
- Browser and OS version

## Suggesting features

Open a [GitHub Issue](../../issues) with the label `enhancement` and describe the use case.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).  
By participating, you agree to uphold it.
