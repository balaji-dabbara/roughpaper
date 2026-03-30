import { canvas, fillBackground, applyPenStyle, resizeCanvas } from './canvas.js';
import { loadFromStorage, loadBgColor } from './storage.js';
import { setBgColor } from './state.js';
import { registerDrawingEvents } from './drawing.js';
import { registerToolbarEvents } from './toolbar.js';

const canvasArea = document.getElementById('canvas-area');
canvas.width  = canvasArea.clientWidth;
canvas.height = canvasArea.clientHeight;

const savedBg = loadBgColor();
setBgColor(savedBg);

fillBackground();
applyPenStyle();
loadFromStorage();

registerDrawingEvents();
registerToolbarEvents();

window.addEventListener('resize', resizeCanvas);
