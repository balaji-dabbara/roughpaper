import { currentColor, currentSize, currentBgColor } from './state.js';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

// Sets the CSS background colour of the canvas element (keeps canvas context transparent)
export function fillBackground() {
  canvas.style.backgroundColor = currentBgColor;
}

// Clears all strokes from the canvas context (CSS bg remains visible)
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function applyPenStyle() {
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function resizeCanvas() {
  // Snapshot strokes before resize clears the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const area = canvas.parentElement;
  canvas.width  = area.clientWidth;
  canvas.height = area.clientHeight;
  // CSS background-color covers the canvas element - no fill needed in context
  ctx.putImageData(imageData, 0, 0);
  applyPenStyle();
}
