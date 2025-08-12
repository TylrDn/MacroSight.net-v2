import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));

// CSS breakpoint checks
const css = readFileSync(join(__dirname, '../public/styles.css'), 'utf8');
assert.ok(/@media \(max-width: 375px\)/.test(css), 'missing 375px breakpoint');
assert.ok(/@media \(min-width: 768px\)/.test(css), 'missing 768px breakpoint');
assert.ok(/@media \(min-width: 1024px\)/.test(css), 'missing 1024px breakpoint');
assert.ok(/@media \(min-width: 1280px\)/.test(css), 'missing 1280px breakpoint');
assert.ok(/position:\s*sticky/.test(css), 'header not sticky');

// Interaction checks using minimal DOM
class Element {
  constructor(id = '', tag = 'div', children = []) {
    this.id = id;
    this.tag = tag;
    this.children = children;
    this.attributes = {};
    this.events = {};
    this.classList = {
      list: new Set(),
      add: (c) => this.classList.list.add(c),
      remove: (c) => this.classList.list.delete(c),
      toggle: (c) => (this.classList.list.has(c) ? this.classList.list.delete(c) : this.classList.list.add(c)),
      contains: (c) => this.classList.list.has(c),
    };
  }
  setAttribute(n, v) { this.attributes[n] = String(v); }
  getAttribute(n) { return this.attributes[n]; }
  addEventListener(t, h) { this.events[t] = h; }
  dispatchEvent(e) { this.events[e.type]?.(e); }
  click() { this.dispatchEvent({ type: 'click' }); }
  focus() { document.activeElement = this; }
  querySelector(sel) { return this.querySelectorAll(sel)[0]; }
  querySelectorAll(sel) {
    return sel === 'a' ? this.children.filter((c) => c.tag === 'a') : [];
  }
}

const links = [new Element('', 'a'), new Element('', 'a')];
const menu = new Element('menu', 'nav', links);
menu.classList.add('hidden');
const menuBtn = new Element('menu-btn', 'button');
menuBtn.setAttribute('aria-expanded', 'false');
const status = new Element('menu-status', 'span');
const body = new Element('body', 'body');

const document = {
  activeElement: null,
  body,
  getElementById(id) {
    return { 'menu': menu, 'menu-btn': menuBtn, 'menu-status': status }[id] || null;
  },
  querySelector() { return null; },
  addEventListener(type, handler) { document.events[type] = handler; },
  events: {},
};
const windowObj = { addEventListener(type, handler) { if (type === 'DOMContentLoaded') handler(); } };

const sandbox = { document, window: windowObj, fetch: async () => ({ ok: false }), console };
vm.createContext(sandbox);
const code = readFileSync(join(__dirname, '../public/include-header.js'), 'utf8');
vm.runInContext(code, sandbox);

// DOMContentLoaded already ran; test interactions
menuBtn.click();
assert.ok(!menu.classList.contains('hidden'), 'menu should be visible after click');
assert.equal(menuBtn.getAttribute('aria-expanded'), 'true');
assert.ok(body.classList.contains('no-scroll'));

// Tab trapping
const first = links[0];
const last = links[1];
last.focus();
document.events['keydown']({ type: 'keydown', key: 'Tab', shiftKey: false, preventDefault() {} });
assert.strictEqual(document.activeElement, first, 'tab should wrap to first link');
first.focus();
document.events['keydown']({ type: 'keydown', key: 'Tab', shiftKey: true, preventDefault() {} });
assert.strictEqual(document.activeElement, last, 'shift+tab should wrap to last link');

// ESC to close
menuBtn.focus();
document.events['keydown']({ type: 'keydown', key: 'Escape' });
assert.ok(menu.classList.contains('hidden'), 'menu should hide on ESC');
assert.equal(menuBtn.getAttribute('aria-expanded'), 'false');
assert.strictEqual(document.activeElement, menuBtn, 'focus should return to button');
assert.ok(!body.classList.contains('no-scroll'));

console.log('✅ header tests passed');
