import { setColor, setSize, setBgColor, setIsErasing, currentColor, currentBgColor } from './state.js';
import { canvas, fillBackground, clearCanvas, applyPenStyle, applyEraserStyle } from './canvas.js';
import { saveCurrentPageData } from './pages.js';

export function registerToolbarEvents() {
  const colorBtn   = document.getElementById('color-btn');
  const colorDot   = document.getElementById('color-btn-dot');
  const colorPanel = document.getElementById('color-panel');

  // Initialise dot and active states from current state
  colorDot.style.background = currentColor;
  document.querySelectorAll('.pen-swatch').forEach((s) => {
    if (s.dataset.color === currentColor) s.classList.add('active');
  });
  document.querySelectorAll('.bg-chip').forEach((c) => {
    if (c.dataset.color === currentBgColor) c.classList.add('active');
  });

  // Toggle colour panel below the button
  colorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = colorBtn.getBoundingClientRect();
    colorPanel.style.top  = `${rect.bottom + 10}px`;
    colorPanel.style.left = `${rect.left + rect.width / 2}px`;
    colorPanel.classList.toggle('open');
  });

  // Pen swatches — apply immediately, also deactivate eraser
  document.querySelectorAll('.pen-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.pen-swatch').forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      setColor(swatch.dataset.color);
      colorDot.style.background = swatch.dataset.color;
      setIsErasing(false);
      document.getElementById('eraser-btn').classList.remove('active');
      applyPenStyle();
    });
  });

  // Background chips — apply immediately
  document.querySelectorAll('.bg-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.bg-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      setBgColor(chip.dataset.color);
      fillBackground();
      saveCurrentPageData();
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

  // Eraser button
  const eraserBtn = document.getElementById('eraser-btn');
  eraserBtn.addEventListener('click', () => {
    const erasing = eraserBtn.classList.toggle('active');
    setIsErasing(erasing);
    if (erasing) {
      applyEraserStyle();
    } else {
      applyPenStyle();
    }
  });

  // Clear button
  document.getElementById('clear-btn').addEventListener('click', () => {
    clearCanvas();
    applyPenStyle();
    saveCurrentPageData();
  });

  // Export button — composite CSS bg + canvas strokes into a single image
  document.getElementById('export-btn').addEventListener('click', () => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.fillStyle = currentBgColor;
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tCtx.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = `roughpaper-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  });

  // About panel toggle
  const aboutBtn   = document.getElementById('about-btn');
  const aboutPanel = document.getElementById('about-panel');
  const aboutClose = document.getElementById('about-close');

  aboutBtn.addEventListener('click', () => aboutPanel.classList.add('open'));
  aboutClose.addEventListener('click', () => aboutPanel.classList.remove('open'));
  aboutPanel.addEventListener('click', (e) => {
    if (e.target === aboutPanel) aboutPanel.classList.remove('open');
  });

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (!colorPanel.contains(e.target) && e.target !== colorBtn) {
      colorPanel.classList.remove('open');
    }
  });

  // Sync bg-chip active state when page switches
  document.addEventListener('pageloaded', ({ detail: { page } }) => {
    document.querySelectorAll('.bg-chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.color === page.bgColor);
    });
  });
}
