import {
  getPages, getActivePageId,
  canAddPage, switchPage, addPage, deletePage, renamePage,
  MAX_PAGES,
} from './pages.js';

const sidebar = document.getElementById('page-sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');

const COLLAPSED_KEY = 'roughpaper-sidebar-collapsed';

export function initSidebarToggle() {
  if (localStorage.getItem(COLLAPSED_KEY) === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }

  const canvasArea = document.getElementById('canvas-area');

  toggleBtn.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
    // Wait for the CSS transition to finish before resizing the canvas
    canvasArea.addEventListener('transitionend', () => {
      window.dispatchEvent(new Event('resize'));
    }, { once: true });
  });
}

function startRename(page, labelEl) {
  const input = document.createElement('input');
  input.className = 'page-card-label-input';
  input.value     = page.label;
  input.maxLength = 24;

  const commit = () => {
    const trimmed = input.value.trim();
    if (trimmed && trimmed !== page.label) {
      renamePage(page.id, trimmed);
      page.label = trimmed;
    }
    renderSidebar();
  };

  input.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Enter')  { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.value = page.label; input.blur(); }
  });
  input.addEventListener('blur', commit);

  labelEl.replaceWith(input);
  input.focus();
  input.select();
}

export function renderSidebar() {
  sidebar.innerHTML = '';
  const pages    = getPages();
  const activeId = getActivePageId();

  pages.forEach((page) => {
    const card = document.createElement('div');
    card.className = 'page-card' + (page.id === activeId ? ' active' : '');
    card.dataset.id = page.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', page.label);

    const preview = document.createElement('div');
    preview.className = 'page-card-preview';
    preview.style.backgroundColor = page.bgColor || '#1a1a1a';
    if (page.canvasData) {
      const img = document.createElement('img');
      img.src = page.canvasData;
      img.className = 'page-card-img';
      img.alt = '';
      preview.appendChild(img);
    }
    card.appendChild(preview);

    const label = document.createElement('span');
    label.className = 'page-card-label';
    label.textContent = page.label;
    label.title = 'Double-click to rename';
    label.addEventListener('dblclick', e => {
      e.stopPropagation();
      startRename(page, label);
    });
    card.appendChild(label);

    if (pages.length > 1) {
      const del = document.createElement('button');
      del.className = 'page-card-delete';
      del.innerHTML = '&times;';
      del.title = 'Delete page';
      del.setAttribute('aria-label', 'Delete ' + page.label);
      del.addEventListener('click', e => {
        e.stopPropagation();
        deletePage(page.id);
        renderSidebar();
      });
      card.appendChild(del);
    }

    card.addEventListener('click', () => {
      if (page.id !== getActivePageId()) {
        switchPage(page.id);
        renderSidebar();
      }
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });

    sidebar.appendChild(card);
  });

  const addBtn = document.createElement('button');
  addBtn.id       = 'add-page-btn';
  addBtn.title    = canAddPage() ? 'Add page' : `Max ${MAX_PAGES} pages`;
  addBtn.setAttribute('aria-label', 'Add page');
  addBtn.disabled = !canAddPage();
  addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>`;
  addBtn.addEventListener('click', () => {
    if (!canAddPage()) return;
    addPage();
    renderSidebar();
  });
  sidebar.appendChild(addBtn);
}
