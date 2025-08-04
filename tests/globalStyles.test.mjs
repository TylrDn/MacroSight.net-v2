import assert from 'node:assert';
import { injectGlobalStyles } from '../public/globalStyles.js';

// Minimal mock of the DOM APIs used in injectGlobalStyles
global.document = {
  elements: {},
  getElementById(id) {
    return this.elements[id] || null;
  },
  createElement(tag) {
    return { tagName: tag, id: '', textContent: '' };
  },
  head: {
    appendChild(el) {
      document.elements[el.id] = el;
    }
  }
};

injectGlobalStyles();

assert.ok(document.getElementById('macrosight-global-styles'), 'global styles were not injected');

console.log('✅ globalStyles test passed');

