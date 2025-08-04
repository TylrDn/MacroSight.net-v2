import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const embedHtml = readFileSync(join(__dirname, '../public/embed.html'), 'utf8');

assert.ok(
  embedHtml.includes('./iframe-loader.js'),
  'embed page should load iframe loader script',
);

console.log('✅ iframe pages test passed');
