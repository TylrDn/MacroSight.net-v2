function initMobileNav() {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('hidden');
    });
  }
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
