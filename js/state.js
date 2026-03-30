// Shared drawing state. Consumers import the live bindings directly;
// mutations must go through the setters so all modules see the same value.

export let currentColor = '#1a1a1a';
export let currentSize = 4;
export let isDrawing = false;
export let lastX = 0;
export let lastY = 0;

export function setColor(color)  { currentColor = color; }
export function setSize(size)    { currentSize = size; }
export function setIsDrawing(v)  { isDrawing = v; }
export function setLastPos(x, y) { lastX = x; lastY = y; }
