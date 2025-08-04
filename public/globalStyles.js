export function injectGlobalStyles() {
  if (document.getElementById("macrosight-global-styles")) return;
  const style = document.createElement("style");
  style.id = "macrosight-global-styles";
  style.textContent = `
    :root {
      --ms-font: system-ui, sans-serif;
    }
    body {
      margin: 0;
      font-family: var(--ms-font);
    }
    header, footer {
      background: #0d0d0d;
      color: #fff;
    }
  `;
  document.head.appendChild(style);
}
