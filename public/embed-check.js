window.addEventListener('DOMContentLoaded', () => {
  if (window.top === window.self) {
    document.body.innerHTML =
      "<p style='text-align:center;padding:2em;'>This page is meant to be embedded in a Wix iframe. Visit <a href='https://www.macrosight.net'>macrosight.net</a> to view.</p>";
  }
});
