import assert from "node:assert";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pages = ["embed.html", "resume.html", "invest.html"];
const payload = "<div>Test Content</div><script>console.log('bad')</script>";

for (const page of pages) {
  const html = readFileSync(path.join(__dirname, "..", "public", page), "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) throw new Error(`No script tag found in ${page}`);
  const scriptContent = scriptMatch[1];

  const document = {
    body: { innerHTML: '<div class="loader">Loading…</div>' },
    querySelector(sel) {
      if (sel === ".loader" && this.body.innerHTML.includes('class="loader"')) {
        return { style: { display: "" } };
      }
      return null;
    },
  };

  class DOMParser {
    parseFromString(html) {
      const doc = {
        body: { innerHTML: html },
        querySelectorAll(selector) {
          if (selector !== "script") return [];
          const scripts = [];
          const regex = /<script[\s\S]*?<\/script>/gi;
          let match;
          while ((match = regex.exec(doc.body.innerHTML))) {
            const scriptText = match[0];
            scripts.push({
              remove() {
                doc.body.innerHTML = doc.body.innerHTML.replace(scriptText, "");
              },
            });
          }
          return scripts;
        },
      };
      return doc;
    }
  }

  const events = {};
  const window = {
    addEventListener(type, handler) {
      events[type] = handler;
    },
    dispatchEvent(event) {
      const handler = events[event.type];
      if (handler) handler(event);
    },
    top: {},
    self: {},
  };

  vm.runInNewContext(scriptContent, { window, document, DOMParser });

  window.dispatchEvent({
    type: "message",
    data: payload,
    origin: "https://www.macrosight.net",
  });

  assert.ok(
    !document.body.innerHTML.includes("<script"),
    `${page}: script tag was not removed`,
  );
  assert.ok(
    !document.body.innerHTML.includes("loader"),
    `${page}: loader was not hidden`,
  );
  console.log(`✅ ${page} script sanitized and loader hidden`);
}
