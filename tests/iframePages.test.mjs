import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import vm from "node:vm";

const pages = ["embed.html", "resume.html", "invest.html"];

for (const page of pages) {
  const filePath = path.join("public", page);
  const html = fs.readFileSync(filePath, "utf8");
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match, `${page} missing inline script`);
  const scriptContent = match[1];

  let bodyHTML = '<div class="loader">Loading…</div>';
  const document = {
    get body() {
      return {
        get innerHTML() {
          return bodyHTML;
        },
        set innerHTML(value) {
          bodyHTML = value;
        },
      };
    },
    querySelector(selector) {
      if (selector === ".loader") {
        if (bodyHTML.includes('class="loader"')) {
          return { style: { display: "" } };
        }
        return null;
      }
      return null;
    },
  };

  class DOMParser {
    parseFromString(str) {
      const scripts = [];
      const scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
      const sanitized = str.replace(scriptRegex, () => {
        scripts.push({ remove() {} });
        return "";
      });
      return {
        body: { innerHTML: sanitized },
        querySelectorAll(sel) {
          if (sel === "script") return scripts;
          return [];
        },
      };
    }
  }

  const window = {
    handlers: {},
    addEventListener(type, handler) {
      this.handlers[type] = handler;
    },
    dispatchEvent(event) {
      const handler = this.handlers[event.type];
      if (handler) handler(event);
    },
  };

  const context = { window, document, DOMParser };
  vm.createContext(context);
  vm.runInContext(scriptContent, context);

  const maliciousHtml = '<div>hi<script>alert(1)</script></div>';
  window.dispatchEvent({
    type: "message",
    data: maliciousHtml,
    origin: "https://www.macrosight.net",
  });

  assert.ok(
    !document.body.innerHTML.includes("<script"),
    `${page} failed to strip scripts`,
  );
  const loader = document.querySelector(".loader");
  assert.ok(
    !loader || loader.style.display === "none",
    `${page} failed to hide loader`,
  );
}

console.log("✅ iframe pages test passed");

