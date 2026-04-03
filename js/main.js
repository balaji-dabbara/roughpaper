import { canvas, applyPenStyle, resizeCanvas } from './canvas.js';
import { initPages, loadActivePage } from './pages.js';
import { registerDrawingEvents } from './drawing.js';
import { registerToolbarEvents } from './toolbar.js';
import { renderSidebar } from './tabs.js';

const canvasArea  = document.getElementById('canvas-area');
canvas.width  = canvasArea.clientWidth;
canvas.height = canvasArea.clientHeight;

initPages();
renderSidebar();
loadActivePage();
applyPenStyle();

registerDrawingEvents();
registerToolbarEvents();

window.addEventListener('resize', resizeCanvas);
