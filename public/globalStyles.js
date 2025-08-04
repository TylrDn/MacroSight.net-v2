export function injectGlobalStyles() {
  if (document.getElementById("macrosight-global-styles")) return;
  const link = document.createElement("link");
  link.id = "macrosight-global-styles";
  link.rel = "stylesheet";
  link.href = "/styles.css";
  document.head.appendChild(link);
}
