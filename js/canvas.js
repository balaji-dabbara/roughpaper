import { currentColor, currentSize, currentBgColor, currentPaperSize } from './state.js';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d', { willReadFrequently: true });

export const CANVAS_WIDTH = 5000;

// Standard paper sizes in CSS px at 96 DPI, portrait orientation.
// Kept as pixel dimensions (rather than mm/in) so the canvas can size to
// them directly today, and so a future print feature can map px -> physical
// units using the same DPI constant.
export const PAPER_SIZES = {
  a4:     { label: 'A4',     width: 794,  height: 1123 },
  letter: { label: 'Letter', width: 816,  height: 1056 },
  legal:  { label: 'Legal',  width: 816,  height: 1344 },
  a3:     { label: 'A3',     width: 1123, height: 1587 },
  a5:     { label: 'A5',     width: 559,  height: 794  },
};

// Sets the CSS background colour of the canvas element (keeps canvas context transparent)
export function fillBackground(color) {
  canvas.style.backgroundColor = color ?? currentBgColor;
}

// Clears all strokes from the canvas context (CSS bg remains visible)
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function applyPenStyle() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = currentColor;
  ctx.fillStyle   = currentColor;
  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function applyEraserStyle() {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.fillStyle   = 'rgba(0,0,0,1)';
  ctx.lineWidth = currentSize * 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function resizeCanvas() {
  // Fixed paper sizes ignore window resizes — only the infinite canvas tracks it
  if (currentPaperSize !== 'infinite') return;
  // Snapshot strokes before resize clears the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const area = canvas.parentElement;
  // Preserve the wide canvas width — only update height
  canvas.height = area.clientHeight;
  ctx.putImageData(imageData, 0, 0);
  applyPenStyle();
  area.classList.remove('fixed-page');
}

// Sets the canvas pixel dimensions directly, preserving existing strokes
// where they still fit, and centers the canvas within its area whenever
// it's smaller than the viewport (fixed paper sizes) rather than infinite.
function resizeCanvasTo(width, height) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width  = width;
  canvas.height = height;
  ctx.putImageData(imageData, 0, 0);
  applyPenStyle();
  canvas.parentElement.classList.toggle('fixed-page', currentPaperSize !== 'infinite');
}

// Resizes the canvas to a named paper size (or back to the infinite scroll
// canvas).
export function applyPaperSize(size, orientation) {
  if (size === 'infinite') {
    resizeCanvasTo(CANVAS_WIDTH, canvas.parentElement.clientHeight);
    return;
  }
  const dims = PAPER_SIZES[size];
  if (!dims) return;
  const landscape = orientation === 'landscape';
  resizeCanvasTo(landscape ? dims.height : dims.width, landscape ? dims.width : dims.height);
}

// Sets exact canvas dimensions, e.g. to restore a page's custom-nudged size.
export function setCanvasDimensions(width, height) {
  resizeCanvasTo(width, height);
}

const PAPER_MIN_PX = 100;
const PAPER_MAX_PX = 3000;
export const PAPER_STEP_PX = 20;

// Nudges the current fixed paper size up/down by PAPER_STEP_PX in one dimension.
export function nudgePaperSize(dimension, delta) {
  if (currentPaperSize === 'infinite') return;
  const clamp = (v) => Math.min(PAPER_MAX_PX, Math.max(PAPER_MIN_PX, v));
  const width  = dimension === 'width'  ? clamp(canvas.width + delta)  : canvas.width;
  const height = dimension === 'height' ? clamp(canvas.height + delta) : canvas.height;
  resizeCanvasTo(width, height);
}
