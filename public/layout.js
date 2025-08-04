async function injectLayout() {
  const [headerRes, footerRes] = await Promise.all([
    fetch('./header.html'),
    fetch('./footer.html'),
  ]);
  const headerHtml = await headerRes.text();
  const footerHtml = await footerRes.text();
  document.body.insertAdjacentHTML('afterbegin', headerHtml);
  document.body.insertAdjacentHTML('beforeend', footerHtml);

  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => menu.classList.toggle('hidden'));
  }
}

window.addEventListener('DOMContentLoaded', injectLayout);
