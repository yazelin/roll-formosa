/* Post-build: list every cacheable file in dist/ and inject it into dist/sw.js's
 * PRECACHE array, so the service worker precaches the WHOLE game on install
 * (fully offline immediately, not just what the player opened). Run after vite build. */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');
const SKIP = /\.(map)$/;                          // skip sourcemaps; everything else is gameplay-relevant
const SHELL = new Set(['index.html', 'preview.html', 'manifest.webmanifest', 'sw.js']);

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(dist)
  .map((p) => relative(dist, p).split('\\').join('/'))
  .filter((f) => !SKIP.test(f) && f !== 'sw.js' && !SHELL.has(f)); // SHELL handled separately; sw.js never caches itself

const swPath = join(dist, 'sw.js');
let sw = readFileSync(swPath, 'utf8');
sw = sw.replace(/const PRECACHE = \[\];/, `const PRECACHE = ${JSON.stringify(files)};`);
writeFileSync(swPath, sw);
console.log(`gen-precache: injected ${files.length} files into dist/sw.js`);
