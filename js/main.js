import { canvas, applyPenStyle, resizeCanvas, CANVAS_WIDTH } from './canvas.js';
import { initPages, loadActivePage } from './pages.js';
import { registerDrawingEvents } from './drawing.js';
import { registerToolbarEvents } from './toolbar.js';
import { renderSidebar, initSidebarToggle } from './tabs.js';

// Apply sidebar collapsed state before sizing canvas so clientWidth is accurate
initSidebarToggle();

const canvasArea  = document.getElementById('canvas-area');
canvas.width  = CANVAS_WIDTH;
canvas.height = canvasArea.clientHeight;

initPages();
renderSidebar();
loadActivePage();
applyPenStyle();

registerDrawingEvents();
registerToolbarEvents();

window.addEventListener('resize', resizeCanvas);
