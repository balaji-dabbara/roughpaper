import { canvas, ctx } from './canvas.js';

// Undo/redo for the active page, as a stack of canvas snapshots.
// The canvas is raster, so each step is a PNG data URL of the whole bitmap
// taken just before the change. PNG keeps sparse line art small; raw
// ImageData would be several MB per step at paper sizes.
const MAX_STEPS = 30;

let undoStack = [];
let redoStack = [];
let restoring = false;

function notify() {
  document.dispatchEvent(new CustomEvent('historychange', {
    detail: { canUndo: canUndo(), canRedo: canRedo() },
  }));
}

export function canUndo()     { return !restoring && undoStack.length > 0; }
export function canRedo()     { return !restoring && redoStack.length > 0; }
export function isRestoring() { return restoring; }

// Call immediately before any change to the canvas pixels.
export function pushHistory() {
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > MAX_STEPS) undoStack.shift();
  redoStack = [];
  notify();
}

// Snapshots are only valid for the bitmap they were taken from, so history
// is dropped whenever the page or its paper size changes.
export function clearHistory() {
  undoStack = [];
  redoStack = [];
  notify();
}

function restore(dataUrl, onDone) {
  restoring = true;
  notify();
  const img = new Image();
  img.onload = () => {
    // Preserve the current pen/eraser style; the eraser leaves the context in
    // destination-out, which would punch the snapshot out instead of drawing it.
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    restoring = false;
    notify();
    onDone?.();
  };
  img.onerror = () => {
    restoring = false;
    notify();
  };
  img.src = dataUrl;
}

export function undo(onDone) {
  if (!canUndo()) return;
  redoStack.push(canvas.toDataURL());
  restore(undoStack.pop(), onDone);
}

export function redo(onDone) {
  if (!canRedo()) return;
  undoStack.push(canvas.toDataURL());
  restore(redoStack.pop(), onDone);
}
