#!/usr/bin/env node
/**
 * check-city.mjs — flag a StagePack city that still ships taipei's chunk objects.
 *
 *   node scripts/check-city.mjs <id>
 *
 * The 70 chunk archetypes (tiers.js archetypeIds, slots 0-9 x 7 tiers) are the
 * street objects the player actually rolls up — and the thing most easily left as
 * taipei's after `cp -r taipei`. A freshly-scaffolded city is 70/70 identical to
 * taipei; a properly localized city keeps only the pan-Taiwan generics (彈珠 /
 * 寶特瓶 / 三角錐…) and swaps the rest, so it lands far lower (高雄 ≈ 38/70).
 *
 * Compares the city's archetypeIds against taipei per tier, prints the breakdown,
 * and EXITS 1 if the city looks un-localized — so a Phase-4 verify step fails loudly
 * instead of shipping three cities whose streets look identical. Advisory only:
 * reads tiers.js (no geometry / THREE), so it runs fast in plain node.
 *
 * Threshold note: per-tier "100% identical" is NOT used as the fail signal because
 * legit localized tiers can share most generics (高雄 T2/T4 are 7/8 taipei). The
 * fail signal is the aggregate: >= 60/70 identical (well above any real city, well
 * below a fresh 70/70 copy).
 */
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2];
if (!id) { console.error('usage: node scripts/check-city.mjs <id>'); process.exit(1); }
if (id === 'taipei') { console.error('[check-city] taipei is the template — nothing to compare'); process.exit(1); }

const FAIL_TOTAL = 45; // >= this many of 70 identical to taipei => too shallow (floor = 台中 44; aim ~37 高雄). Kept in lockstep with src/packs/localization.test.js

const loadTiers = async (city) => {
  const url = pathToFileURL(join(ROOT, 'src/packs', city, 'tiers.js')).href;
  const mod = await import(url);
  return mod.TIERS;
};

const [city, taipei] = await Promise.all([loadTiers(id), loadTiers('taipei')]).catch((e) => {
  console.error(`[check-city] could not load tiers for '${id}':`, e.message);
  process.exit(1);
});

let total = 0;
let fullTiers = 0;
let N = 0;
console.log(`\n[check-city] ${id} — chunk archetypeIds vs taipei (per tier):`);
for (let t = 0; t < city.length; t++) {
  const a = city[t].archetypeIds;
  const b = taipei[t].archetypeIds;
  let same = 0;
  for (let s = 0; s < a.length; s++) if (a[s] === b[s]) same++;
  total += same;
  N += a.length;
  if (same === a.length) fullTiers++;
  const flag = same === a.length ? '  <-- 整階 100% 台北' : '';
  console.log(`  T${t}  ${String(city[t].name).padEnd(12)} ${same}/${a.length} 同台北${flag}`);
}
console.log(`  ----  共 ${total}/${N} 與台北相同 (${Math.round((total / N) * 100)}%)\n`);

if (total >= FAIL_TOTAL || fullTiers >= 5) {
  console.error(
    `[check-city] FAIL: '${id}' 看起來沒在地化 chunk 物件 (${total}/${N} 同台北、${fullTiers} 階整階照抄)。\n` +
      `  chunk 物件是玩家一路滾到的街頭小物,要換成這座城市的版本(保留泛台灣通用物即可)。\n` +
      `  見 docs/ADD-A-CITY.md Phase 2、參考 src/packs/kaohsiung/archetypes/。`
  );
  process.exit(1);
}
console.log(`[check-city] OK: '${id}' 的 chunk 物件已在地化(保留 ${total} 個泛台灣通用物,換掉 ${N - total} 個)。\n`);
