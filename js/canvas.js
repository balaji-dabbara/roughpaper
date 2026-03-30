import { currentColor, currentSize } from './state.js';

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');

export function fillWhite() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function applyPenStyle() {
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function resizeCanvas() {
  // Snapshot the current pixels before resize wipes the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fillWhite();
  ctx.putImageData(imageData, 0, 0);
  applyPenStyle();
}
