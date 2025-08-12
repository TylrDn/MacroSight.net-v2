async function loadHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;
  try {
    const res = await fetch('/header.html');
    if (!res.ok) throw new Error('Header fetch failed');
    const html = await res.text();
    placeholder.outerHTML = html;
  } catch (err) {
    placeholder.removeAttribute('hidden');
  }
}
window.addEventListener('DOMContentLoaded', loadHeader);
