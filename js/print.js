import { getPages, getActivePageId, saveCurrentPageData } from './pages.js';

// Matches the 96 DPI assumption PAPER_SIZES (canvas.js) is defined at, so
// the printed sheet comes out at the same physical size as the paper preset.
const DPI = 96;
const pxToIn = (px) => px / DPI;

// Composites the active page's background colour + strokes into a single PNG
// at its own paper size.
function compositePageImage(page) {
  const width  = page.paperWidth  || 794;
  const height = page.paperHeight || 1123;
  const temp = document.createElement('canvas');
  temp.width  = width;
  temp.height = height;
  const tctx = temp.getContext('2d');

  return new Promise((resolve) => {
    const finish = () => resolve({ dataUrl: temp.toDataURL('image/png'), width, height });
    tctx.fillStyle = page.bgColor || '#ffffff';
    tctx.fillRect(0, 0, width, height);
    if (!page.canvasData) { finish(); return; }
    const img = new Image();
    img.onload  = () => { tctx.drawImage(img, 0, 0, width, height); finish(); };
    img.onerror = finish;
    img.src = page.canvasData;
  });
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

// Populates #print-area and waits until the inserted <img> has actually been
// decoded AND painted — img.decode() alone only guarantees the bitmap is
// ready, not that the browser has presented it yet, and window.print() can
// otherwise snapshot the page before it's on screen, leaving a blank preview.
async function buildPrintArea({ dataUrl, width, height }) {
  const area = document.getElementById('print-area');
  area.innerHTML = '';

  const img = document.createElement('img');
  img.style.width  = `${pxToIn(width)}in`;
  img.style.height = `${pxToIn(height)}in`;
  area.appendChild(img);
  img.src = dataUrl;

  if (img.decode) await img.decode().catch(() => {});
  else await new Promise((res) => { img.onload = res; img.onerror = res; });

  let pageStyle = document.getElementById('print-page-style');
  if (!pageStyle) {
    pageStyle = document.createElement('style');
    pageStyle.id = 'print-page-style';
    document.head.appendChild(pageStyle);
  }
  pageStyle.textContent = `@page { size: ${pxToIn(width)}in ${pxToIn(height)}in; margin: 0; }`;

  await nextFrame();
  await nextFrame();
}

export async function printCurrentPage() {
  saveCurrentPageData();
  const page = getPages().find((p) => p.id === getActivePageId());
  if (!page) return;
  await buildPrintArea(await compositePageImage(page));
  window.print();
}
