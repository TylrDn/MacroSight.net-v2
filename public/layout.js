import { injectGlobalStyles } from '/globalStyles.js';

async function injectLayout() {
  await injectGlobalStyles();
  const [headerRes, footerRes] = await Promise.all([
    fetch('/header.html'),
    fetch('/footer.html'),
  ]);
  const headerHtml = await headerRes.text();
  const footerHtml = await footerRes.text();
  document.body.insertAdjacentHTML('afterbegin', headerHtml);
  document.body.insertAdjacentHTML('beforeend', footerHtml);
}

window.addEventListener('DOMContentLoaded', injectLayout);
