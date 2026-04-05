import { setColor, setSize, setBgColor, setIsErasing, setIsPanning, currentColor, currentBgColor } from './state.js';
import { canvas, fillBackground, clearCanvas, applyPenStyle, applyEraserStyle } from './canvas.js';
import { saveCurrentPageData } from './pages.js';

function closePanels(...panels) {
  panels.forEach(p => p.classList.remove('open'));
}

function activatePen(penBtn, eraserBtn, panBtn) {
  penBtn.classList.add('active');
  eraserBtn.classList.remove('active');
  panBtn.classList.remove('active');
  setIsErasing(false);
  setIsPanning(false);
  canvas.style.cursor = '';
  applyPenStyle();
}

export function registerToolbarEvents() {
  const colorBtn   = document.getElementById('color-btn');
  const colorDot   = document.getElementById('color-btn-dot');
  const colorPanel = document.getElementById('color-panel');
  const penBtn     = document.getElementById('pen-btn');
  const penPanel   = document.getElementById('pen-panel');
  const eraserBtn  = document.getElementById('eraser-btn');
  const panBtn     = document.getElementById('pan-btn');
  const toolbar    = document.getElementById('toolbar');

  // Initialise dot and active states from current state
  colorDot.style.background = currentColor;
  document.querySelectorAll('.pen-swatch').forEach((s) => {
    if (s.dataset.color === currentColor) s.classList.add('active');
  });
  document.querySelectorAll('.bg-chip').forEach((c) => {
    if (c.dataset.color === currentBgColor) c.classList.add('active');
  });

  // Mark default active size option
  const defaultSize = '4';
  document.querySelectorAll('.pen-size-opt').forEach((o) => {
    if (o.dataset.size === defaultSize) o.classList.add('active');
  });

  function positionPanel(panel) {
    const tbRect = toolbar.getBoundingClientRect();
    panel.style.top  = `${tbRect.bottom + 10}px`;
    panel.style.left = `${tbRect.left + tbRect.width / 2}px`;
  }

  // Colour button — toggle colour panel
  colorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanels(penPanel);
    positionPanel(colorPanel);
    colorPanel.classList.toggle('open');
  });

  // Pen button — toggle pen size panel
  penBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePanels(colorPanel);
    positionPanel(penPanel);
    penPanel.classList.toggle('open');
    // Also switch to pen mode if another tool was active
    activatePen(penBtn, eraserBtn, panBtn);
  });

  // Pen size options
  document.querySelectorAll('.pen-size-opt').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.pen-size-opt').forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      setSize(parseInt(opt.dataset.size, 10));
      applyPenStyle();
      closePanels(penPanel);
    });
  });

  // Pen swatches — apply colour, switch to pen mode
  document.querySelectorAll('.pen-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.pen-swatch').forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      setColor(swatch.dataset.color);
      colorDot.style.background = swatch.dataset.color;
      activatePen(penBtn, eraserBtn, panBtn);
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

  // Eraser button
  eraserBtn.addEventListener('click', () => {
    closePanels(colorPanel, penPanel);
    const erasing = eraserBtn.classList.toggle('active');
    setIsErasing(erasing);
    setIsPanning(false);
    panBtn.classList.remove('active');
    canvas.style.cursor = '';
    if (erasing) {
      penBtn.classList.remove('active');
      applyEraserStyle();
    } else {
      penBtn.classList.add('active');
      applyPenStyle();
    }
  });

  // Pan button
  panBtn.addEventListener('click', () => {
    closePanels(colorPanel, penPanel);
    const panning = panBtn.classList.toggle('active');
    setIsPanning(panning);
    setIsErasing(false);
    eraserBtn.classList.remove('active');
    canvas.style.cursor = panning ? 'grab' : '';
    if (panning) {
      penBtn.classList.remove('active');
    } else {
      penBtn.classList.add('active');
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

  // Close floating panels on outside click
  document.addEventListener('click', (e) => {
    if (!colorPanel.contains(e.target) && e.target !== colorBtn) {
      colorPanel.classList.remove('open');
    }
    if (!penPanel.contains(e.target) && e.target !== penBtn) {
      penPanel.classList.remove('open');
    }
  });

  // Sync bg-chip active state when page switches
  document.addEventListener('pageloaded', ({ detail: { page } }) => {
    document.querySelectorAll('.bg-chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.color === page.bgColor);
    });
  });
}
