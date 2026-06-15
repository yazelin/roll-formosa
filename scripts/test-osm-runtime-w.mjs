/**
 * test-osm-runtime-w.mjs — Stream W headless tests (docs/DESIGN-V4.md
 * 並列作業分割 STREAM W). Run: `node scripts/test-osm-runtime-w.mjs`
 *
 * Covers:
 *  1. Decode of the SHIPPED Stream-P bins (count/band histogram vs manifest,
 *     bandStart contract, nearest-first ring ordering).
 *  2. Activation/deactivation determinism across forced TIER_UP / RESCALE /
 *     REBASE (two identical perturbed runs -> identical alive sets).
 *  3. 3-spawner ownership identity (chunk + curated + osm === store.alive,
 *     300 frames, with mixed simulated absorbs).
 *  4. HARD ADMISSION check under artificial store pressure.
 *  5. One-way deadline latch (late data discarded; OSM_READY at most once).
 *  6. cityMap geo cross-checks + the one-shot coverage latch (fresh process
 *     via child import is NOT needed — the latch test runs LAST).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const ASSETS = join(ROOT, 'public', 'assets', 'tokyo');

const { EventBus, EVT } = await import(join(ROOT, 'src/core/events.js'));
const { OsmWorld } = await import(join(ROOT, 'src/world/osmWorld.js'));
const { OsmSpawner } = await import(join(ROOT, 'src/world/osmSpawner.js'));
const { ObjectStore, FLAG_OSM, FLAG_CURATED } = await import(join(ROOT, 'src/world/objects.js'));
const { SpatialHash } = await import(join(ROOT, 'src/world/spatialHash.js'));
const { Spawner } = await import(join(ROOT, 'src/world/spawner.js'));
const { CuratedSpawner } = await import(join(ROOT, 'src/world/curated.js'));
const { CATALOG } = await import(join(ROOT, 'src/config/catalog.js'));
const { TIERS } = await import(join(ROOT, 'src/config/tiers.js'));
const tuning = await import(join(ROOT, 'src/config/tuning.js'));
const cityMap = await import(join(ROOT, 'src/config/cityMap.js'));
const geo = await import(join(ROOT, 'scripts/osm/geo.mjs'));

let passed = 0;
function ok(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
  passed++;
}

function loadShard(name) {
  const b = readFileSync(join(ASSETS, name));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
const CORE = loadShard('tokyo-v4-core.bin');
const OUTER = loadShard('tokyo-v4-outer.bin');
const MANIFEST = JSON.parse(readFileSync(join(ASSETS, 'tokyo-v4-manifest.json'), 'utf8'));

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function mkPool(cap = 8192) {
  let next = 0;
  const free = [];
  return {
    alloc() { return free.length > 0 ? free.pop() : next < cap ? next++ : -1; },
    free(s) { free.push(s); },
    fadeOut(s) { free.push(s); }, // immediate reclaim (render-less harness)
    fadeIn() {},
    setColor() {},
    setTransform() {},
    getColorHex() { return -1; },
    rescaleAll() {},
    rebaseAll() {},
    reset() { next = 0; free.length = 0; },
    update() {},
    mesh: null,
  };
}

/** worldScale snap for a true radius (devTeleport math). */
function wsFor(rM) {
  let ws = tuning.START_RADIUS_M / tuning.SIM_RADIUS_MIN;
  while (rM / ws >= tuning.SIM_RADIUS_MAX) ws *= 5;
  return ws;
}
function tierFor(rM) {
  let t = 0;
  while (t < TIERS.length - 1 && rM >= TIERS[t + 1].enterTrueRadius) t++;
  return t;
}

function mkHarness() {
  const bus = new EventBus();
  const store = new ObjectStore();
  const hashes = [new SpatialHash(10), new SpatialHash(10), new SpatialHash(10)];
  const scaleMgr = { worldScale: 1, tierIndex: 0, rescaleCount: 0 };
  const osmWorld = new OsmWorld(bus);
  const osmPools = { detail: mkPool(tuning.OSM_POOL_DETAIL_CAP), large: mkPool(tuning.OSM_POOL_LARGE_CAP) };
  const osm = new OsmSpawner(store, hashes, osmPools, bus, scaleMgr, osmWorld);
  osmWorld.decodeBuffers(CORE.slice(0), OUTER.slice(0)); // emits OSM_READY -> arms osm
  return { bus, store, hashes, scaleMgr, osmWorld, osm, osmPools };
}

/** Signature of all FLAG_OSM store slots (order-independent). */
function osmSignature(store) {
  const rows = [];
  for (let i = 0; i < store.capacity; i++) {
    if ((store.flags[i] & 1) === 0 || (store.flags[i] & FLAG_OSM) === 0) continue;
    rows.push(
      `${store.archetype[i]}:${store.px[i].toFixed(5)}:${store.pz[i].toFixed(5)}:` +
      `${store.radius[i].toFixed(5)}:${store.tierOf[i]}`
    );
  }
  rows.sort();
  return rows.join('|');
}

/* ------------------------------------------------------------------ */
/* 1. decode                                                           */
/* ------------------------------------------------------------------ */
{
  const bus = new EventBus();
  let readyEvents = 0;
  let readyBuildings = -1;
  bus.on(EVT.OSM_READY, (p) => { readyEvents++; readyBuildings = p.buildings; });
  const w = new OsmWorld(bus);
  w.decodeBuffers(CORE.slice(0), OUTER.slice(0));
  ok(w.ready && !w.failed, 'decode: ready latched');
  ok(readyEvents === 1, 'decode: OSM_READY emitted exactly once');
  const histSum = MANIFEST.bandHistogram.reduce((a, b) => a + b, 0);
  ok(w.count === histSum, `decode: count ${w.count} === manifest histogram sum ${histSum}`);
  ok(readyBuildings === w.count, 'decode: OSM_READY.buildings matches');
  const hist = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < w.count; i++) hist[w.bband[i]]++;
  for (let b = 2; b <= 5; b++) {
    ok(hist[b] === MANIFEST.bandHistogram[b], `decode: band${b} ${hist[b]} === manifest ${MANIFEST.bandHistogram[b]}`);
  }
  // bandStart contract on every tile
  let tiles = 0;
  for (let t = 0; ; t++) {
    let tr;
    try { tr = w.tileRecords(t); } catch (_) { break; }
    if (tr === undefined) break;
    tiles++;
    ok(tr.bandStart.length === 7, 'decode: bandStart length 7');
    for (let b = 0; b < 6; b++) ok(tr.bandStart[b] <= tr.bandStart[b + 1], 'decode: bandStart monotonic');
    ok(tr.bandStart[0] === tr.offset, 'decode: bandStart[0] === offset');
    ok(tr.bandStart[6] === tr.offset + tr.count, 'decode: bandStart[6] sentinel === offset+count');
    for (let r = tr.offset; r < tr.offset + tr.count; r++) {
      if (w.tileOf(r) !== t) { ok(false, 'decode: tileOf mapping'); }
    }
  }
  ok(tiles === MANIFEST.tileIndexSummary.detailTiles + MANIFEST.tileIndexSummary.towerTiles,
    `decode: ${tiles} building tiles === manifest detail+tower`);
  // nearest-first ring ordering (tiles 0..detailTiles-1 are 100 m detail
  // tiles, the rest 400 m tower tiles — the decode order contract)
  const nDetail = MANIFEST.tileIndexSummary.detailTiles;
  const center = (ti) => {
    const tr = w.tileRecords(ti);
    const size = ti < nDetail ? 100 : 400;
    return [tr.tileX * size + size / 2, tr.tileZ * size + size / 2];
  };
  let lastD2 = -1;
  let ordered = true;
  let visited = 0;
  w.forEachTileInRing(3, 30, 0, 400, (ti) => {
    const [cx, cz] = center(ti);
    const d2 = (cx - 30) * (cx - 30) + cz * cz;
    if (d2 < lastD2) ordered = false;
    lastD2 = d2;
    visited++;
  });
  ok(visited > 0, `decode: ring visits tiles (${visited})`);
  ok(ordered, 'decode: forEachTileInRing is nearest-first (nondecreasing center distance)');
  // consumed mask roundtrip
  const rec = w.tileRecords(0).offset;
  ok(!w.isConsumedRec(rec), 'decode: consumed bit starts clear');
  w.markConsumedRec(rec);
  ok(w.isConsumedRec(rec), 'decode: consumed bit set');
  w.resetConsumedMasks();
  ok(!w.isConsumedRec(rec), 'decode: resetConsumedMasks clears');
  console.log(`decode OK — ${w.count} buildings, ${tiles} tiles, ${w.groundSections.length} ground sections`);
}

/* ------------------------------------------------------------------ */
/* 2. determinism across TIER_UP / RESCALE / REBASE                    */
/* ------------------------------------------------------------------ */
{
  const R_TRUE = 4; // ueno-scale ball, inside coverage
  const runOnce = () => {
    const h = mkHarness();
    const ws0 = wsFor(R_TRUE);
    h.scaleMgr.worldScale = ws0;
    h.scaleMgr.tierIndex = tierFor(R_TRUE);
    const pos = { x: 88 / ws0, y: 0, z: -292 / ws0 }; // near 西郷さん像 (band-3 supply)
    let rSim = R_TRUE / ws0;
    for (let f = 0; f < 300; f++) {
      if (f === 100) {
        // forced RESCALE (ScaleManager semantics: mutate, then emit)
        const S = 0.2;
        h.scaleMgr.worldScale /= S;
        h.store.rescaleAll(S);
        pos.x *= S; pos.z *= S; rSim *= S;
        h.bus.emit(EVT.RESCALE, { S });
      }
      if (f === 150) {
        const sx = Math.round(pos.x);
        const sz = Math.round(pos.z);
        pos.x -= sx; pos.z -= sz;
        for (let i = 0; i < h.store.capacity; i++) { h.store.px[i] -= sx; h.store.pz[i] -= sz; }
        h.bus.emit(EVT.REBASE, { sx, sz });
      }
      if (f === 200) {
        h.scaleMgr.tierIndex += 1;
        h.bus.emit(EVT.TIER_UP, { tierIndex: h.scaleMgr.tierIndex, name: 't', trueRadius: rSim * h.scaleMgr.worldScale });
      }
      h.osm.update(pos, h.scaleMgr.tierIndex, rSim, 1 / 60);
    }
    return { sig: osmSignature(h.store), alive: h.osm.aliveCount, h };
  };
  const a = runOnce();
  const b = runOnce();
  ok(a.alive > 0, `determinism: OSM activated (${a.alive} alive)`);
  ok(a.sig === b.sig, 'determinism: identical alive sets across two perturbed runs');
  ok(a.alive === b.alive, 'determinism: identical alive counts');
  // teleport resync: onTeleport + forceScan, then a full pass with a new pose
  const h = a.h;
  h.osm.onTeleport();
  h.osm.forceScan();
  ok(h.osm.aliveCount === 0, 'teleport: all actives deactivated');
  const ws2 = wsFor(40);
  h.scaleMgr.worldScale = ws2;
  h.scaleMgr.tierIndex = tierFor(40);
  const pos2 = { x: -20 / ws2, y: 0, z: 387 / ws2 }; // 丸の内 (band-4 towers)
  h.osm.update(pos2, h.scaleMgr.tierIndex, 40 / ws2, 1 / 60);
  ok(h.osm.aliveCount > 0, `teleport: full pass re-materialized (${h.osm.aliveCount})`);
  console.log('determinism OK');
}

/* ------------------------------------------------------------------ */
/* 3. 3-spawner ownership identity (300 frames, mixed absorbs)         */
/* ------------------------------------------------------------------ */
{
  const R_TRUE = 4;
  const bus = new EventBus();
  const store = new ObjectStore();
  const hashes = [new SpatialHash(10), new SpatialHash(10), new SpatialHash(10)];
  const ws = wsFor(R_TRUE);
  const scaleMgr = { worldScale: ws, tierIndex: tierFor(R_TRUE), rescaleCount: Math.round(Math.log(ws / 0.04) / Math.log(5)) };
  const poolByName = new Map();
  const instances = {
    get(id) {
      let p = poolByName.get(id);
      if (!p) { p = mkPool(); poolByName.set(id, p); }
      return p;
    },
  };
  const extraPools = [mkPool(), mkPool(), mkPool(), mkPool()];
  // FROZEN construction order: chunk -> curated -> osm (ABSORB dispatch order)
  const chunk = new Spawner(12345, store, hashes, instances, bus, CATALOG, scaleMgr);
  const curated = new CuratedSpawner(store, hashes, instances, extraPools, bus, scaleMgr);
  const osmWorld = new OsmWorld(bus);
  const osm = new OsmSpawner(store, hashes, { detail: mkPool(), large: mkPool() }, bus, scaleMgr, osmWorld);
  osmWorld.decodeBuffers(CORE.slice(0), OUTER.slice(0));
  // main attach-handler stand-in (slot-steal convention)
  bus.on(EVT.ABSORB, (p) => { store.instanceSlot[p.objIndex] = -1; });

  const pos = { x: 88 / ws, y: 0, z: -292 / ws };
  const rSim = R_TRUE / ws;
  const absorbPayload = {
    objIndex: 0, archetypeId: '', sizeReal: 0, combo: 0, trueRadius: 0,
    count: 0, rare: false, archetypeCode: -1, collectibleId: -1,
  };
  let absorbed = { chunk: 0, curated: 0, osm: 0 };
  let cursor = 0;
  for (let f = 0; f < 300; f++) {
    chunk.update(pos, scaleMgr.tierIndex, rSim, 1 / 60);
    curated.update(pos, scaleMgr.tierIndex, rSim, 1 / 60);
    osm.update(pos, scaleMgr.tierIndex, rSim, 1 / 60);
    /* Identity is checked HERE — the settled point: chunk absorbs decrement
       synchronously, curated/osm absorbs flush their deferred bookkeeping at
       the START of their next update() (slot-steal convention). A check
       between an ABSORB emit and the next update is legitimately +1 per
       in-flight deferral — exactly like the in-game DEV check, which runs
       inside the update chain. */
    const sum = chunk.aliveCount + curated.aliveCount + osm.aliveCount;
    ok(sum === store.aliveCount,
      `identity frame ${f}: chunk ${chunk.aliveCount} + curated ${curated.aliveCount} + osm ${osm.aliveCount} === store ${store.aliveCount}`);
    ok(store.aliveCount < tuning.ALIVE_TOTAL_BUDGET, `identity frame ${f}: alive < ALIVE_TOTAL_BUDGET`);
    // simulate one absorb every 4 frames (absorb.js order: emit BEFORE free)
    if (f % 4 === 3) {
      for (let n = 0; n < store.capacity; n++) {
        const i = (cursor + n) % store.capacity;
        if ((store.flags[i] & 1) === 0) continue;
        cursor = i + 1;
        absorbPayload.objIndex = i;
        absorbPayload.archetypeCode = store.archetype[i];
        if ((store.flags[i] & FLAG_OSM) !== 0) absorbed.osm++;
        else if ((store.flags[i] & FLAG_CURATED) !== 0) absorbed.curated++;
        else absorbed.chunk++;
        bus.emit(EVT.ABSORB, absorbPayload);
        store.free(i);
        break;
      }
    }
  }
  ok(osm.aliveCount > 0, `identity: osm participated (${osm.aliveCount} alive)`);
  ok(absorbed.osm > 0, `identity: osm absorbs exercised (${absorbed.osm})`);
  console.log(`identity OK — final chunk ${chunk.aliveCount} / curated ${curated.aliveCount} / osm ${osm.aliveCount} / store ${store.aliveCount}; absorbs ${JSON.stringify(absorbed)}`);
}

/* ------------------------------------------------------------------ */
/* 4. HARD ADMISSION under store pressure                              */
/* ------------------------------------------------------------------ */
{
  const R_TRUE = 4;
  const h = mkHarness();
  const ws = wsFor(R_TRUE);
  h.scaleMgr.worldScale = ws;
  h.scaleMgr.tierIndex = tierFor(R_TRUE);
  const pos = { x: 88 / ws, y: 0, z: -292 / ws };
  const rSim = R_TRUE / ws;
  // artificial pressure: fill the store ABOVE the admission limit
  const limit = tuning.ALIVE_TOTAL_BUDGET - tuning.OSM_ADMISSION_HEADROOM;
  const dummies = [];
  while (h.store.aliveCount <= limit + 10) {
    const i = h.store.alloc();
    if (i < 0) break;
    h.store.radius[i] = 1e6; // never sub-pixel; never touched by osm
    dummies.push(i);
  }
  for (let f = 0; f < 60; f++) h.osm.update(pos, h.scaleMgr.tierIndex, rSim, 1 / 60);
  ok(h.osm.aliveCount === 0, `admission: zero OSM activations at alive ${h.store.aliveCount} > ${limit}`);
  // release the pressure -> activation resumes
  while (h.store.aliveCount > 3000) h.store.free(dummies.pop());
  for (let f = 0; f < 60; f++) h.osm.update(pos, h.scaleMgr.tierIndex, rSim, 1 / 60);
  ok(h.osm.aliveCount > 0, `admission: resumed after pressure released (${h.osm.aliveCount})`);
  ok(h.store.aliveCount < tuning.ALIVE_TOTAL_BUDGET, 'admission: total stays under budget');
  console.log('admission OK');
}

/* ------------------------------------------------------------------ */
/* 5. one-way deadline latch                                           */
/* ------------------------------------------------------------------ */
{
  const bus = new EventBus();
  let readyEvents = 0;
  bus.on(EVT.OSM_READY, () => readyEvents++);
  const w = new OsmWorld(bus);
  w.abortAndFail();
  ok(w.failed && !w.ready, 'latch: failed latched, ready false');
  w.decodeBuffers(CORE.slice(0), OUTER.slice(0)); // late data
  ok(!w.ready && readyEvents === 0, 'latch: late data discarded, no OSM_READY');
  w.abortAndFail(); // idempotent
  ok(w.failed, 'latch: idempotent');
  // spawner stays forever inert on a failed world
  const store = new ObjectStore();
  const hashes = [new SpatialHash(10), new SpatialHash(10), new SpatialHash(10)];
  const scaleMgr = { worldScale: 5, tierIndex: 2 };
  const osm = new OsmSpawner(store, hashes, { detail: mkPool(), large: mkPool() }, bus, scaleMgr, w);
  osm.update({ x: 0, y: 0, z: 0 }, 2, 1, 1 / 60);
  ok(osm.aliveCount === 0 && store.aliveCount === 0, 'latch: spawner inert on failed world');
  // ready-once: a healthy world ignores a second decode
  const bus2 = new EventBus();
  let ready2 = 0;
  bus2.on(EVT.OSM_READY, () => ready2++);
  const w2 = new OsmWorld(bus2);
  w2.decodeBuffers(CORE.slice(0), OUTER.slice(0));
  w2.decodeBuffers(CORE.slice(0), OUTER.slice(0));
  ok(ready2 === 1, 'latch: OSM_READY at most once');
  console.log('deadline latch OK');
}

/* ------------------------------------------------------------------ */
/* 6. cityMap geo cross-checks + one-shot coverage latch (runs LAST —  */
/*    the latch is per-process)                                        */
/* ------------------------------------------------------------------ */
{
  cityMap.validateCityMap();
  for (const k of ['x0', 'x1', 'z0', 'z1']) {
    ok(cityMap.OSM_COVERAGE.shibuyaRect[k] === geo.SHIBUYA_RECT[k], `geo xcheck shibuya ${k}`);
    ok(cityMap.OSM_COVERAGE.asakusaRect[k] === geo.ASAKUSA_RECT[k], `geo xcheck asakusa ${k}`);
  }
  const rec = geo.reconcileLandmarks();
  for (const key of Object.keys(cityMap.OSM_GEN)) {
    ok(Math.abs(rec[key].x - cityMap.OSM_GEN[key].x) < 1e-9 &&
       Math.abs(rec[key].z - cityMap.OSM_GEN[key].z) < 1e-9,
      `geo xcheck landmark ${key} (${rec[key].x},${rec[key].z}) vs OSM_GEN`);
  }
  ok(cityMap.SKYTREE_POS.x === 749 && cityMap.SKYTREE_POS.z === -252, 'geo xcheck SKYTREE_POS');
  // coverage latch (one-shot)
  ok(cityMap.bandAllowedAt(100, -300, 3) === true, 'latch: band3 procedural pre-decision');
  cityMap.setOsmCoverageActive(true);
  ok(cityMap.bandAllowedAt(100, -300, 3) === false, 'latch: band3 masked inside coverage');
  ok(cityMap.bandAllowedAt(100, -300, 4) === false, 'latch: band4 masked inside coverage');
  ok(cityMap.bandAllowedAt(100, 100, 2) === true, 'latch: band2 clutter unaffected');
  ok(cityMap.bandAllowedAt(-1450, 800, 3) === true, 'latch: band3 outside coverage unaffected');
  ok(cityMap.bandAllowedAt(1500, 0, 6) === true, 'latch: T6 map-wide unaffected');
  cityMap.setOsmCoverageActive(false); // prod path: ignored (no DEV in node)
  ok(cityMap.bandAllowedAt(100, -300, 3) === false, 'latch: second call ignored (one-shot)');
  console.log('cityMap geo cross-checks + coverage latch OK');
}

console.log(`\nALL STREAM-W TESTS PASSED (${passed} assertions)`);
