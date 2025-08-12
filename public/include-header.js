function initMobileNav() {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  const status = document.getElementById('menu-status');
  if (!menuBtn || !menu) return;

  let lastFocused = null;

  function announce(msg) {
    if (status) status.textContent = msg;
  }

  function openMenu() {
    lastFocused = document.activeElement;
    menuBtn.setAttribute('aria-expanded', 'true');
    menu.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    const first = menu.querySelector('a');
    first && first.focus();
    announce('Navigation menu opened');
  }

  function closeMenu() {
    menuBtn.setAttribute('aria-expanded', 'false');
    menu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    announce('Navigation menu closed');
    (lastFocused || menuBtn).focus();
  }

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key === 'Tab' && !menu.classList.contains('hidden')) {
      const items = menu.querySelectorAll('a');
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

async function loadHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;
  try {
    const res = await fetch('/header.html');
    if (!res.ok) throw new Error('Header fetch failed');
    const html = await res.text();
    const existing = document.querySelector('.site-header');
    if (existing) {
      existing.outerHTML = html;
    } else {
      placeholder.outerHTML = html;
    }
    initMobileNav();
  } catch (err) {
    placeholder.removeAttribute('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  loadHeader();
});
