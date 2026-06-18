#!/usr/bin/env node
/**
 * new-city.mjs — scaffold a new StagePack city from the taipei template.
 *
 *   node scripts/new-city.mjs <id> <displayName> <tagline>
 *   node scripts/new-city.mjs taichung 台中 "歌劇院終點"
 *
 * Does ONLY the mechanical, error-prone steps:
 *   1. cp -r src/packs/taipei src/packs/<id>
 *   2. rewrite <id>/index.js: id, displayName, seeds (derived from id)
 *   3. register a `status:'soon'` entry in src/packs/manifest.js
 *   4. print the TODO list (content + skyline + verify) → docs/ADD-A-CITY.md
 *
 * Everything else (geometry, tiers, narration, collectibles, tests, the
 * skyline webp) is content work — see docs/ADD-A-CITY.md.
 */
import { existsSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [, , id, displayName, tagline] = process.argv;

function die(msg) {
  console.error(`\n[new-city] ${msg}\n\nusage: node scripts/new-city.mjs <id> <displayName> <tagline>`);
  process.exit(1);
}

if (!id || !displayName || !tagline) die('need <id> <displayName> <tagline>');
if (!/^[a-z][a-z0-9]{1,15}$/.test(id)) die(`id "${id}" must be lowercase ascii (a–z0–9), 2–16 chars`);
if (id === 'taipei') die('cannot overwrite the taipei template');

const packDir = join(ROOT, 'src/packs', id);
if (existsSync(packDir)) die(`src/packs/${id} already exists`);

/** 4-char ASCII → uint32. id padded/truncated to 4 chars, uppercased. */
const ascii4 = (s) => {
  const c = (s + 'xxxx').slice(0, 4).toUpperCase();
  return ((c.charCodeAt(0) << 24) | (c.charCodeAt(1) << 16) | (c.charCodeAt(2) << 8) | c.charCodeAt(3)) >>> 0;
};
const primary = ascii4(id);
const v5 = (primary ^ 0x20202020) >>> 0; // case-bit flip → distinct, still ascii-ish
const hex = (n) => '0x' + n.toString(16).toUpperCase().padStart(8, '0');

// 1) copy the template
cpSync(join(ROOT, 'src/packs/taipei'), packDir, { recursive: true });

// 2) rewrite index.js identity + seeds
const idxPath = join(packDir, 'index.js');
let idx = readFileSync(idxPath, 'utf8');
const before = idx;
idx = idx.replace(/id:\s*'taipei'/, `id: '${id}'`);
idx = idx.replace(/displayName:\s*'台北'/, `displayName: '${displayName}'`);
idx = idx.replace(
  /seeds:\s*\{[^}]*\}.*$/m,
  `seeds: { primary: ${hex(primary)}, v5: ${hex(v5)} }, // ${id} (scaffold — change if it collides)`
);
if (idx === before) die('index.js: expected taipei id/displayName/seeds patterns not found — template changed?');
writeFileSync(idxPath, idx);

// 3) register in manifest.js as 'soon'
const manPath = join(ROOT, 'src/packs/manifest.js');
let man = readFileSync(manPath, 'utf8');
const entry = `  Object.freeze({ id: '${id}', displayName: '${displayName}', tagline: '${tagline}', status: 'soon' }),\n`;
if (man.includes(`id: '${id}'`)) die(`manifest.js already lists '${id}'`);
man = man.replace(/(\n)(\]\);)/, `\n${entry}$2`);
writeFileSync(manPath, man);

console.log(`
[new-city] scaffolded src/packs/${id}/  (seeds primary=${hex(primary)} v5=${hex(v5)})
[new-city] manifest.js: '${id}' added as status:'soon' (not playable until you finish + verify)

NEXT — see docs/ADD-A-CITY.md:
  Phase 2  swap content: tiers / monument / landmarks / collectibles /
           archetypes(t0–t6) / narration / locale / cityMap+cityData / ending
           — and REWRITE *.test.js expectations (still taipei's → will fail).
  Phase 3  make public/assets/title/skyline-${id}.webp via codex-imagegen
           (transparent RGBA, ~3:1, neon silhouette). MISSING => title silently
           shows the taipei skyline.
  Phase 4  npm run build && npx vitest run && npm run dev (check grounded objects
           + city-correct chrome), then flip manifest '${id}' to status:'ready'.
`);
