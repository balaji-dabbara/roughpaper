import { setColor, setSize } from './state.js';
import { fillWhite, applyPenStyle } from './canvas.js';
import { STORAGE_KEY } from './storage.js';

export function registerToolbarEvents() {
  // Color swatches
  document.querySelectorAll('.swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      setColor(swatch.dataset.color);
      applyPenStyle();
    });
  });

  // Brush size buttons
  document.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      setSize(parseInt(btn.dataset.size, 10));
      applyPenStyle();
    });
  });

  // Clear button
  document.getElementById('clear-btn').addEventListener('click', () => {
    fillWhite();
    applyPenStyle();
    localStorage.removeItem(STORAGE_KEY);
  });
}
