import { ctx, canvas, fillBackground, applyPenStyle, applyEraserStyle } from './canvas.js';
import { setBgColor, currentBgColor, isErasing } from './state.js';

export const MAX_PAGES = 10;

const PAGES_KEY  = 'roughpaper-pages';
const ACTIVE_KEY = 'roughpaper-activepage';

let pages        = [];
let activePageId = null;

function newPage(id, index) {
  return { id, label: `Page ${index}`, bgColor: '#1a1a1a', canvasData: null };
}

export function initPages() {
  const saved = localStorage.getItem(PAGES_KEY);
  if (saved) {
    try { pages = JSON.parse(saved); } catch { pages = [newPage(1, 1)]; }
  } else {
    // Migrate from old single-canvas storage
    const oldBg   = localStorage.getItem('roughpaper-bgcolor') || '#1a1a1a';
    const oldData = localStorage.getItem('roughpaper-canvas')  || null;
    pages = [{ id: 1, label: 'Page 1', bgColor: oldBg, canvasData: oldData }];
  }

  const savedId = localStorage.getItem(ACTIVE_KEY);
  const parsed  = savedId ? Number(savedId) : null;
  activePageId  = (parsed && pages.find(p => p.id === parsed))
    ? parsed
    : pages[0].id;
}

export function getPages()        { return pages; }
export function getActivePageId() { return activePageId; }
export function canAddPage()      { return pages.length < MAX_PAGES; }

function persistPages() {
  try {
    localStorage.setItem(PAGES_KEY,  JSON.stringify(pages));
    localStorage.setItem(ACTIVE_KEY, String(activePageId));
  } catch { /* quota exceeded — fail silently */ }
}

export function renamePage(id, newLabel) {
  const page = pages.find(p => p.id === id);
  if (!page || !newLabel.trim()) return;
  page.label = newLabel.trim();
  persistPages();
}

export function saveCurrentPageData() {
  const page = pages.find(p => p.id === activePageId);
  if (!page) return;
  page.bgColor = currentBgColor;
  try { page.canvasData = canvas.toDataURL(); } catch { /* fail silently */ }
  persistPages();
}

function applyPageToCanvas(page) {
  setBgColor(page.bgColor);
  fillBackground(page.bgColor);   // explicit — avoids any stale-binding edge case
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (page.canvasData) {
    const img   = new Image();
    img.onload  = () => {
      ctx.drawImage(img, 0, 0);
      isErasing ? applyEraserStyle() : applyPenStyle();
    };
    img.src = page.canvasData;
  } else {
    isErasing ? applyEraserStyle() : applyPenStyle();
  }
  // Notify other modules (e.g. toolbar) that a new page is now active
  document.dispatchEvent(new CustomEvent('pageloaded', { detail: { page } }));
}

export function loadActivePage() {
  const page = pages.find(p => p.id === activePageId);
  if (page) applyPageToCanvas(page);
}

export function switchPage(id) {
  if (id === activePageId) return;
  saveCurrentPageData();
  activePageId = id;
  persistPages();
  applyPageToCanvas(pages.find(p => p.id === id));
}

export function addPage() {
  if (!canAddPage()) return null;
  saveCurrentPageData();
  const maxId = pages.reduce((m, p) => Math.max(m, p.id), 0);
  const newId = maxId + 1;
  const pg    = newPage(newId, pages.length + 1);
  pages.push(pg);
  activePageId = newId;
  persistPages();
  applyPageToCanvas(pg);
  return newId;
}

export function deletePage(id) {
  if (pages.length <= 1) return false;
  const idx = pages.findIndex(p => p.id === id);
  if (idx === -1) return false;
  pages.splice(idx, 1);
  pages.forEach((p, i) => { p.label = `Page ${i + 1}`; });
  if (activePageId === id) {
    activePageId = pages[Math.min(idx, pages.length - 1)].id;
    applyPageToCanvas(pages.find(p => p.id === activePageId));
  }
  persistPages();
  return true;
}
