import { canvas, ctx } from './canvas.js';

export const STORAGE_KEY = 'roughpaper-canvas';
export const BG_KEY = 'roughpaper-bgcolor';

export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, canvas.toDataURL());
  } catch {
    // Storage quota exceeded or unavailable — fail silently
  }
}

export function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  const img = new Image();
  img.onload = () => { ctx.drawImage(img, 0, 0); };
  img.src = saved;
}

export function saveBgColor(color) {
  try {
    localStorage.setItem(BG_KEY, color);
  } catch { /* fail silently */ }
}

export function loadBgColor() {
  return localStorage.getItem(BG_KEY) || '#ffffff';
}
