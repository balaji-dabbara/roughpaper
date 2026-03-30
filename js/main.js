import { canvas, fillWhite, applyPenStyle, resizeCanvas } from './canvas.js';
import { loadFromStorage } from './storage.js';
import { registerDrawingEvents } from './drawing.js';
import { registerToolbarEvents } from './toolbar.js';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
fillWhite();
applyPenStyle();
loadFromStorage();

registerDrawingEvents();
registerToolbarEvents();

window.addEventListener('resize', resizeCanvas);
