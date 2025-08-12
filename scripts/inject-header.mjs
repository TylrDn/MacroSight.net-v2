import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PUBLIC_DIR = 'public';
const PLACEHOLDER = '<!--#HEADER#-->';
const headerHtml = readFileSync(join(PUBLIC_DIR, 'header.html'), 'utf8');

for (const file of readdirSync(PUBLIC_DIR)) {
  if (!file.endsWith('.html')) continue;
  if (file === 'header.html') continue;
  const filePath = join(PUBLIC_DIR, file);
  let content = readFileSync(filePath, 'utf8');
  if (content.includes(PLACEHOLDER)) {
    content = content.replace(PLACEHOLDER, headerHtml);
    writeFileSync(filePath, content);
  }
}
