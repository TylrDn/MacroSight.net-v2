// Hardened postMessage injection for Wix Velo
const ALLOWED_ORIGINS = [
  "https://www.macrosight.net",
  "https://macrosight.netlify.app",
];

function safeInject(html) {
  // Never replace <head>, only <body> content
  if (typeof html !== "string" || /<head[\s>]/i.test(html)) return false;

  // Strip out any <script> tags to avoid executing arbitrary code
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const scripts = doc.querySelectorAll("script");
  scripts.forEach((s) => s.remove());
  document.body.innerHTML = doc.body.innerHTML;
  return true;
}

window.addEventListener(
  "message",
  (event) => {
    if (!ALLOWED_ORIGINS.includes(event.origin)) return;
    if (safeInject(event.data)) {
      const loader = document.querySelector(".loader");
      if (loader) loader.style.display = "none";
    } else {
      document.body.innerHTML =
        '<div style="padding:2em;text-align:center;color:#c00;">Sorry, content failed to load. Please try again later.</div>';
    }
  },
  false,
);

