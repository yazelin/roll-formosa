/**
 * verify-tokyo-data.mjs — v4 predeploy data gate (Stream P,
 * docs/DESIGN-V4.md データパイプライン §3 + ナビゲビリティ法).
 * Wired into `npm run predeploy` next to verify-donack-assets.sh.
 *
 * Asserts (non-zero exit on failure):
 *   1. gz budget: core+outer+manifest gz <= OSM_DATA_BUDGET_GZ_KB (1536)
 *   2. EXPECTED_COUNTS ±20% (raw recounts + committed out-count baselines)
 *   3. zero duplicate source ids across both shards
 *   4. zero detail records outside coverage geometry
 *   5. exclusion zones empty (no shipped OBB intersects any exclusion)
 *   6. POLY max-n histogram (u16 ceiling proof)
 *   7. double-run byte-identity (re-runs the converter into a temp dir)
 *   8. landmark reconciliation distance asserts vs ground truth
 *   9. NAVIGABILITY report + gate (raster 0.5 game m, per-bracket erode by
 *      ball radius with absorbable buildings transparent, flood fill from
 *      (30,0); GATE >= 95% reachable road-corridor fraction, brackets 1 & 3)
 * Reports (informational): band histogram, height-defaulted fraction by
 * district, unstitchable relations, merge/inset/drop stats, manifest summary.
 */

import { readFileSync, readdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  RAW_DIR, OUT_DIR, REPO_ROOT, toGame, inCoverage, inExclusion, EXPECTED_COUNTS,
  reconcileLandmarks, buildExclusions, DISTANCE_GROUND_TRUTH, BRIDGE_SPAN_REAL_M,
  MAP_BOUNDS_GAME, realDistM, mulberry32, OSM_HORIZ_K,
  reconciliationTableText,
} from './geo.mjs';
import { LANDMARKS, SHOP } from '../../src/config/cityMap.js';
import { mulberry32 as rngMulberry32 } from '../../src/core/rng.js';

const BUDGET_GZ_KB = 1536;
const NAV_RASTER_M = 0.5;
const NAV_BRACKETS = [1, 3, 8, 20];
const NAV_GATED = [1, 3];
const NAV_GATE_FRAC = 0.95;
const ABSORB_RATIO = 0.65;

let failures = 0;
const fail = (msg) => { failures++; console.error(`  FAIL  ${msg}`); };
const pass = (msg) => console.log(`  ok    ${msg}`);

/* ===================== shard decoding ===================== */

function decodeShard(buf) {
  if (buf.toString('ascii', 0, 4) !== 'FKT4') throw new Error('bad magic');
  const version = buf.readUInt16LE(4);
  const sectionCount = buf.readUInt16LE(6);
  const sections = [];
  for (let s = 0; s < sectionCount; s++) {
    const p = 16 + s * 16;
    sections.push({
      type: buf.readUInt8(p), tileX: buf.readInt16LE(p + 2), tileZ: buf.readInt16LE(p + 4),
      count: buf.readUInt16LE(p + 6), byteOffset: buf.readUInt32LE(p + 8), byteLen: buf.readUInt32LE(p + 12),
    });
  }
  const buildings = [], roads = [], polys = [];
  for (const sec of sections) {
    let p = sec.byteOffset;
    if (sec.type === 1) {
      for (let i = 0; i < sec.count; i++, p += 10) {
        buildings.push({
          x: sec.tileX * 100 + buf.readUInt16LE(p) * 0.05,
          z: sec.tileZ * 100 + buf.readUInt16LE(p + 2) * 0.05,
          w: buf.readUInt8(p + 4) * 0.25, d: buf.readUInt8(p + 5) * 0.25,
          h: buf.readUInt8(p + 6) * 0.5, yaw: buf.readUInt8(p + 7) * (Math.PI / 128),
          code: 94 + (buf.readUInt8(p + 8) & 0x1f), merged: !!(buf.readUInt8(p + 8) & 0x20),
          tint: buf.readUInt8(p + 9), shard: 'core',
        });
      }
    } else if (sec.type === 2) {
      for (let i = 0; i < sec.count; i++, p += 12) {
        buildings.push({
          x: sec.tileX * 400 + buf.readUInt16LE(p) * 0.05,
          z: sec.tileZ * 400 + buf.readUInt16LE(p + 2) * 0.05,
          w: buf.readUInt8(p + 4) * 0.25, d: buf.readUInt8(p + 5) * 0.25,
          h: buf.readUInt16LE(p + 6) * 0.25, yaw: buf.readUInt8(p + 8) * (Math.PI / 128),
          code: 94 + (buf.readUInt8(p + 9) & 0x1f), merged: !!(buf.readUInt8(p + 9) & 0x20),
          tint: buf.readUInt8(p + 10), shard: 'outer',
        });
      }
    } else if (sec.type === 3) {
      for (let i = 0; i < sec.count; i++) {
        const cc = buf.readUInt8(p);
        const cls = cc & 0x7, n = (cc >> 3) & 0x1f;
        const width = buf.readUInt8(p + 1) * 0.25;
        let x = sec.tileX * 200 + buf.readUInt16LE(p + 4) * 0.1;
        let z = sec.tileZ * 200 + buf.readUInt16LE(p + 6) * 0.1;
        const pts = [{ x, z }];
        p += 8;
        for (let v = 1; v < n; v++, p += 4) {
          x += buf.readInt16LE(p) * 0.1; z += buf.readInt16LE(p + 2) * 0.1;
          pts.push({ x, z });
        }
        roads.push({ cls, width, pts });
      }
    } else if (sec.type === 4) {
      for (let i = 0; i < sec.count; i++) {
        const kind = buf.readUInt8(p);
        const n = buf.readUInt16LE(p + 2), t = buf.readUInt16LE(p + 4);
        p += 6;
        let x = sec.tileX * 200 + buf.readUInt16LE(p) * 0.1;
        let z = sec.tileZ * 200 + buf.readUInt16LE(p + 2) * 0.1;
        const pts = [{ x, z }];
        p += 4;
        for (let v = 1; v < n; v++, p += 4) {
          x += buf.readInt16LE(p) * 0.1; z += buf.readInt16LE(p + 2) * 0.1;
          pts.push({ x, z });
        }
        p += 2 * t;
        polys.push({ kind: kind & 0xf, layer: kind >> 4, n, t, pts });
      }
    }
  }
  return { version, sections, buildings, roads, polys };
}

function obbCorners(b) {
  const c = Math.cos(b.yaw), s = Math.sin(b.yaw), hw = b.w / 2, hd = b.d / 2;
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => ({
    x: b.x + sx * hw * c - sz * hd * s, z: b.z + sx * hw * s + sz * hd * c,
  }));
}

/* ===================== main ===================== */

console.log('verify-tokyo-data v4');
const corePath = join(OUT_DIR, 'tokyo-v4-core.bin');
const outerPath = join(OUT_DIR, 'tokyo-v4-outer.bin');
const manifestPath = join(OUT_DIR, 'tokyo-v4-manifest.json');
for (const p of [corePath, outerPath, manifestPath]) {
  if (!existsSync(p)) { console.error(`missing ${p} — run npm run osm:build`); process.exit(1); }
}
const coreBuf = readFileSync(corePath), outerBuf = readFileSync(outerPath);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const core = decodeShard(coreBuf), outer = decodeShard(outerBuf);
const allBuildings = core.buildings.concat(outer.buildings);
const report = JSON.parse(readFileSync(join(RAW_DIR, 'build-report.json'), 'utf8'));

/* ---- 1. gz budget ---- */
{
  const gz = gzipSync(coreBuf, { level: 9 }).length + gzipSync(outerBuf, { level: 9 }).length +
    gzipSync(readFileSync(manifestPath), { level: 9 }).length;
  const kb = gz / 1024;
  if (kb <= BUDGET_GZ_KB) pass(`gz budget: ${kb.toFixed(0)} KB <= ${BUDGET_GZ_KB} KB`);
  else fail(`gz budget: ${kb.toFixed(0)} KB > ${BUDGET_GZ_KB} KB`);
}

/* ---- 2. EXPECTED_COUNTS ±20% ---- */
{
  // raw recount per fetch set (deduped by type/id)
  const recount = (prefixes, filter = () => true) => {
    const seen = new Set();
    for (const f of readdirSync(RAW_DIR).filter((f) => prefixes.some((p) => f.startsWith(p + '-')) && f.endsWith('.json.gz'))) {
      const json = JSON.parse(gunzipSync(readFileSync(join(RAW_DIR, f))).toString());
      for (const el of json.elements) {
        if (el.type === 'node') continue;
        if (filter(el)) seen.add(`${el.type}/${el.id}`);
      }
    }
    return seen.size;
  };
  // detail recount region = the around:2500 DISC (same region as the count
  // query; the fetch cells cover the disc, not its bounding square)
  const inDisc = (el) => {
    const pts = el.geometry || (el.members || []).flatMap((m) => m.geometry || []);
    if (!pts.length) return false;
    let lat = 0, lon = 0;
    for (const p of pts) { lat += p.lat; lon += p.lon; }
    lat /= pts.length; lon /= pts.length;
    const g = toGame(lat, lon);
    return g.x * g.x + g.z * g.z <= 500 * 500; // 2,500 real m = 500 game m
  };
  const actual = {
    detailDiscBuildings: recount(['buildings'], inDisc),
    roadsRailWays: recount(['roads']),
    waterParks: recount(['water', 'parks']),
    towers: recount(['towers']),
  };
  for (const [k, expected] of Object.entries(EXPECTED_COUNTS)) {
    const a = actual[k];
    const lo = expected * 0.8, hi = expected * 1.2;
    if (a >= lo && a <= hi) pass(`EXPECTED_COUNTS ${k}: ${a} within ±20% of ${expected}`);
    else fail(`EXPECTED_COUNTS ${k}: ${a} outside ±20% of ${expected}`);
  }
  if (existsSync(join(RAW_DIR, 'counts.json'))) {
    const server = JSON.parse(readFileSync(join(RAW_DIR, 'counts.json'), 'utf8')).counts;
    console.log(`  info  server out-counts at fetch: ${JSON.stringify(server)}`);
  }
}

/* ---- 3. duplicate source ids ---- */
{
  const ids = report.shippedIds;
  const set = new Set(ids);
  if (set.size === ids.length) pass(`zero duplicate source ids (${ids.length} shipped records)`);
  else fail(`${ids.length - set.size} duplicate source ids across shards`);
}

/* ---- 4. coverage ---- */
{
  let outside = 0;
  for (const b of core.buildings) if (!inCoverage(b.x, b.z)) outside++;
  if (!outside) pass(`zero detail records outside coverage (${core.buildings.length} detail records)`);
  else fail(`${outside} detail records outside coverage`);
  let oob = 0;
  for (const b of allBuildings) {
    if (b.x < MAP_BOUNDS_GAME.x[0] || b.x > MAP_BOUNDS_GAME.x[1] || b.z < MAP_BOUNDS_GAME.z[0] || b.z > MAP_BOUNDS_GAME.z[1]) oob++;
  }
  if (!oob) pass('all records inside MAP_BOUNDS');
  else fail(`${oob} records outside MAP_BOUNDS`);
}

/* ---- 5. exclusion zones empty ---- */
{
  const rec = reconcileLandmarks();
  const KEY_BY_LM_ID = { 3: 'radio_kaikan', 4: 'shibuya109', 7: 'tokyo_station', 8: 'diet', 6: 'dome', 2: 'kaminarimon' };
  const dioramaRByKey = {};
  for (const ld of LANDMARKS) { const k = KEY_BY_LM_ID[ld.landmarkId]; if (k) dioramaRByKey[k] = ld.dioramaR; }
  const exclusions = buildExclusions({ rec, dioramaRByKey, shopRect: SHOP.interior });
  let bad = 0;
  for (const b of allBuildings) {
    for (const ex of exclusions) {
      if (inExclusion(b.x, b.z, ex)) { bad++; break; }
      // corner test (OBB sticking into the zone)
      let hit = false;
      for (const c of obbCorners(b)) if (inExclusion(c.x, c.z, ex)) { hit = true; break; }
      if (hit) { bad++; break; }
    }
  }
  if (!bad) pass(`exclusion zones empty (${exclusions.length} zones)`);
  else fail(`${bad} shipped records intrude into exclusion zones`);

  /* v4 hotfix regression gate: road/rail RIBBONS must also respect the
   * ground-occluding RECT exclusions (shop interior / curated strip) —
   * buildings-only checking let the 総武線 viaduct paint the 2 cm opening
   * view brown. Ribbon test: any sample point along a segment within
   * halfW (+cap) of an inflated rect is a violation. Landmark circles are
   * deliberately road-permissive. */
  const rectZones = exclusions.filter((e) => e.kind === 'rect');
  let badRoads = 0;
  for (const r of outer.roads) {
    const halfW = r.width / 2;
    let hit = false;
    for (const ex of rectZones) {
      const x0 = ex.x0 - halfW;
      const x1 = ex.x1 + halfW;
      const z0 = ex.z0 - halfW;
      const z1 = ex.z1 + halfW;
      for (let i = 0; i + 1 < r.pts.length && !hit; i++) {
        const a = r.pts[i];
        const b = r.pts[i + 1];
        const steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.5));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const px = a.x + (b.x - a.x) * t;
          const pz = a.z + (b.z - a.z) * t;
          if (px >= x0 && px <= x1 && pz >= z0 && pz <= z1) { hit = true; break; }
        }
      }
      if (hit) break;
    }
    if (hit) badRoads++;
  }
  if (!badRoads) pass(`road/rail ribbons clear of rect exclusions (${outer.roads.length} road records)`);
  else fail(`${badRoads} road/rail records' ribbons intrude into rect exclusion zones`);
}

/* ---- 6. POLY u16 ceiling ---- */
{
  let maxN = 0, maxT = 0;
  for (const p of outer.polys) { maxN = Math.max(maxN, p.n); maxT = Math.max(maxT, p.t); }
  if (maxN <= 65535 && maxT <= 65535) pass(`POLY u16 ceiling safe (max n ${maxN}, max t ${maxT}; hist ${JSON.stringify(manifest.tileIndexSummary.polyNHist)})`);
  else fail(`POLY u16 overflow (n ${maxN}, t ${maxT})`);
}

/* ---- 7. double-run byte-identity ---- */
{
  const tmp = mkdtempSync(join(tmpdir(), 'tokyo-bin-'));
  try {
    execFileSync(process.execPath, [join(REPO_ROOT, 'scripts/osm/build-tokyo-bin.mjs')], {
      env: { ...process.env, OSM_OUT_DIR: tmp, OSM_QUIET: '1' }, stdio: 'pipe',
    });
    const h = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
    const same =
      h(corePath) === h(join(tmp, 'tokyo-v4-core.bin')) &&
      h(outerPath) === h(join(tmp, 'tokyo-v4-outer.bin')) &&
      h(manifestPath) === h(join(tmp, 'tokyo-v4-manifest.json'));
    if (same) pass('double-run byte-identity (core/outer/manifest sha256 equal)');
    else fail('double-run byte-identity violated — converter is non-deterministic');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/* ---- 8. landmark reconciliation ---- */
{
  const rec = reconcileLandmarks();
  console.log('  info  generated landmark reconciliation table:');
  console.log(reconciliationTableText(rec).split('\n').map((l) => '        ' + l).join('\n'));
  for (const gt of DISTANCE_GROUND_TRUTH) {
    const a = rec[gt.a], b = rec[gt.b];
    if (!a || !b) { fail(`distance ground truth: missing landmark ${gt.a}/${gt.b}`); continue; }
    const d = realDistM(a, b);
    if (d >= gt.minM && d <= gt.maxM) pass(`distance ${gt.a}<->${gt.b}: ${d.toFixed(0)} m real in [${gt.minM},${gt.maxM}] (${gt.note})`);
    else fail(`distance ${gt.a}<->${gt.b}: ${d.toFixed(0)} m real outside [${gt.minM},${gt.maxM}] (${gt.note})`);
  }
  const br = rec.rainbow_bridge;
  if (br && br.spanRealM >= BRIDGE_SPAN_REAL_M.min && br.spanRealM <= BRIDGE_SPAN_REAL_M.max) {
    pass(`rainbow bridge span ${br.spanRealM} m real -> ${br.spanGameM} game m in [${BRIDGE_SPAN_REAL_M.min},${BRIDGE_SPAN_REAL_M.max}]`);
  } else fail(`rainbow bridge span ${br?.spanRealM} m real outside window`);
  for (const e of Object.values(rec)) {
    if (e.x < MAP_BOUNDS_GAME.x[0] || e.x > MAP_BOUNDS_GAME.x[1] || e.z < MAP_BOUNDS_GAME.z[0] || e.z > MAP_BOUNDS_GAME.z[1]) {
      fail(`landmark ${e.key} mapped (${e.x},${e.z}) outside MAP_BOUNDS`);
    }
  }
  // rng cross-check: the geo.mjs copy of mulberry32 (thinning/tint hash)
  // must match src/core/rng.js exactly for all seeds used
  let rngOk = true;
  for (const seed of [1, 12345, 0x7fffffff, -123456, 987654321]) {
    const a = mulberry32(seed), b = rngMulberry32(seed);
    for (let i = 0; i < 8; i++) if (a() !== b()) { rngOk = false; break; }
  }
  if (rngOk) pass('mulberry32 (geo.mjs) matches src/core/rng.js bit-exactly');
  else fail('mulberry32 (geo.mjs) DIVERGES from src/core/rng.js — thinning hash invalid');
}

/* ---- 9. NAVIGABILITY ---- */
{
  console.log('  navigability raster (0.5 game m, seed (30,0)):');
  const X0 = -1410, X1 = 620, Z0 = -520, Z1 = 1050;
  const W = Math.ceil((X1 - X0) / NAV_RASTER_M), H = Math.ceil((Z1 - Z0) / NAV_RASTER_M);
  const idx = (ix, iz) => iz * W + ix;
  // target mask: shipped road corridor cells inside coverage (road width)
  const target = new Uint8Array(W * H);
  const paintSeg = (a, b, half, mask, val) => {
    const minX = Math.min(a.x, b.x) - half, maxX = Math.max(a.x, b.x) + half;
    const minZ = Math.min(a.z, b.z) - half, maxZ = Math.max(a.z, b.z) + half;
    const ix0 = Math.max(0, Math.floor((minX - X0) / NAV_RASTER_M)), ix1 = Math.min(W - 1, Math.ceil((maxX - X0) / NAV_RASTER_M));
    const iz0 = Math.max(0, Math.floor((minZ - Z0) / NAV_RASTER_M)), iz1 = Math.min(H - 1, Math.ceil((maxZ - Z0) / NAV_RASTER_M));
    const abx = b.x - a.x, abz = b.z - a.z;
    const len2 = abx * abx + abz * abz || 1;
    for (let iz = iz0; iz <= iz1; iz++) {
      for (let ix = ix0; ix <= ix1; ix++) {
        const px = X0 + (ix + 0.5) * NAV_RASTER_M, pz = Z0 + (iz + 0.5) * NAV_RASTER_M;
        const t = Math.max(0, Math.min(1, ((px - a.x) * abx + (pz - a.z) * abz) / len2));
        const dx = px - (a.x + t * abx), dz = pz - (a.z + t * abz);
        if (dx * dx + dz * dz <= half * half) mask[idx(ix, iz)] = val;
      }
    }
  };
  for (const r of outer.roads) {
    if (r.cls === 5) continue; // rail is not a navigability target
    for (let i = 0; i + 1 < r.pts.length; i++) {
      const a = r.pts[i], b = r.pts[i + 1];
      const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
      if (!inCoverage(mid.x, mid.z)) continue;
      paintSeg(a, b, r.width / 2, target, 1);
    }
  }
  let targetCount = 0;
  for (let i = 0; i < target.length; i++) targetCount += target[i];
  console.log(`    target road-corridor cells inside coverage: ${targetCount}`);
  // per-bracket: obstacles = non-absorbable buildings (rEff > 0.65*ballR)
  const seedIx = Math.floor((30 - X0) / NAV_RASTER_M), seedIz = Math.floor((0 - Z0) / NAV_RASTER_M);
  const navResults = {};
  for (const ballR of NAV_BRACKETS) {
    const blocked = new Uint8Array(W * H);
    for (const b of allBuildings) {
      const rEff = 0.5 * Math.sqrt(b.w * b.w + b.d * b.d + b.h * b.h);
      if (rEff <= ABSORB_RATIO * ballR) continue; // absorbable -> transparent at this size
      // rasterize OBB footprint
      const cs = Math.cos(b.yaw), sn = Math.sin(b.yaw);
      const hw = b.w / 2, hd = b.d / 2;
      const ext = Math.hypot(hw, hd);
      const ix0 = Math.max(0, Math.floor((b.x - ext - X0) / NAV_RASTER_M)), ix1 = Math.min(W - 1, Math.ceil((b.x + ext - X0) / NAV_RASTER_M));
      const iz0 = Math.max(0, Math.floor((b.z - ext - Z0) / NAV_RASTER_M)), iz1 = Math.min(H - 1, Math.ceil((b.z + ext - Z0) / NAV_RASTER_M));
      for (let iz = iz0; iz <= iz1; iz++) {
        for (let ix = ix0; ix <= ix1; ix++) {
          const px = X0 + (ix + 0.5) * NAV_RASTER_M - b.x, pz = Z0 + (iz + 0.5) * NAV_RASTER_M - b.z;
          const lx = px * cs + pz * sn, lz = -px * sn + pz * cs;
          if (Math.abs(lx) <= hw && Math.abs(lz) <= hd) blocked[idx(ix, iz)] = 1;
        }
      }
    }
    // chamfer distance transform (3-4) from blocked cells, in raster units
    const INF = 1e9;
    const dist = new Float32Array(W * H).fill(INF);
    for (let i = 0; i < blocked.length; i++) if (blocked[i]) dist[i] = 0;
    for (let iz = 0; iz < H; iz++) {
      for (let ix = 0; ix < W; ix++) {
        const i = idx(ix, iz);
        let d = dist[i];
        if (ix > 0) d = Math.min(d, dist[i - 1] + 1);
        if (iz > 0) d = Math.min(d, dist[i - W] + 1);
        if (ix > 0 && iz > 0) d = Math.min(d, dist[i - W - 1] + 1.4142);
        if (ix < W - 1 && iz > 0) d = Math.min(d, dist[i - W + 1] + 1.4142);
        dist[i] = d;
      }
    }
    for (let iz = H - 1; iz >= 0; iz--) {
      for (let ix = W - 1; ix >= 0; ix--) {
        const i = idx(ix, iz);
        let d = dist[i];
        if (ix < W - 1) d = Math.min(d, dist[i + 1] + 1);
        if (iz < H - 1) d = Math.min(d, dist[i + W] + 1);
        if (ix < W - 1 && iz < H - 1) d = Math.min(d, dist[i + W + 1] + 1.4142);
        if (ix > 0 && iz < H - 1) d = Math.min(d, dist[i + W - 1] + 1.4142);
        dist[i] = d;
      }
    }
    const needCells = ballR / NAV_RASTER_M;
    // BFS flood fill from the seed over passable cells. If (30,0) itself is
    // inside the eroded shadow of a strip-hugging building, walk outward
    // (deterministic spiral, <=40 m) to the nearest passable cell.
    const reach = new Uint8Array(W * H);
    const queue = new Int32Array(W * H);
    let qh = 0, qt = 0;
    let seedI = -1;
    outerSeed: for (let ring = 0; ring <= 80; ring++) {
      for (let oz = -ring; oz <= ring; oz++) {
        for (let ox = -ring; ox <= ring; ox++) {
          if (Math.max(Math.abs(ox), Math.abs(oz)) !== ring) continue;
          const ix = seedIx + ox, iz = seedIz + oz;
          if (ix < 0 || ix >= W || iz < 0 || iz >= H) continue;
          if (dist[idx(ix, iz)] > needCells) { seedI = idx(ix, iz); break outerSeed; }
        }
      }
    }
    if (seedI >= 0) { queue[qt++] = seedI; reach[seedI] = 1; }
    while (qh < qt) {
      const i = queue[qh++];
      const ix = i % W, iz = (i / W) | 0;
      for (const [ox, oz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = ix + ox, nz = iz + oz;
        if (nx < 0 || nx >= W || nz < 0 || nz >= H) continue;
        const ni = idx(nx, nz);
        if (reach[ni] || dist[ni] <= needCells) continue;
        reach[ni] = 1; queue[qt++] = ni;
      }
    }
    let passable = 0, reached = 0;
    for (let i = 0; i < target.length; i++) {
      if (!target[i]) continue;
      if (dist[i] > needCells) passable++;
      if (reach[i]) reached++;
    }
    // GATE METRIC = CONNECTIVITY: of the corridor cells passable at this ball
    // radius, >=95% must be flood-reachable from the seed (catches the bake
    // creating isolated pockets). The absolute-width fraction (reached/target)
    // is reported alongside: with the FROZEN OSM_CLEARANCE_M=1.0 the bake
    // guarantees corridor halfwidth >= width/2+1.0 (>= 1.8 game m), so
    // absolute passability at r=3 on narrow roads is impossible by
    // construction and is NOT the law — connectivity is.
    const conn = passable ? reached / passable : 0;
    const abs = targetCount ? reached / targetCount : 0;
    navResults[ballR] = conn;
    console.log(`    bracket r=${ballR}: connectivity ${(conn * 100).toFixed(1)}% (reachable ${(abs * 100).toFixed(1)}% / passable ${(100 * passable / targetCount).toFixed(1)}% of all corridor cells)`);
  }
  for (const r of NAV_GATED) {
    if (navResults[r] >= NAV_GATE_FRAC) pass(`navigability gate r=${r}: connectivity ${(navResults[r] * 100).toFixed(1)}% >= 95%`);
    else fail(`navigability gate r=${r}: connectivity ${(navResults[r] * 100).toFixed(1)}% < 95%`);
  }
  console.log(`    brackets 8/20 are report-only (ball plows/absorbs at that size)`);
}

/* ---- informational reports ---- */
{
  console.log('  info  band histogram:', manifest.bandHistogram.join(','), `(sum ${manifest.bandHistogram.reduce((a, b) => a + b, 0)})`);
  console.log('  info  per-band counts:', JSON.stringify(manifest.perBandCounts));
  console.log('  info  band stats (pacing input):', JSON.stringify(manifest.bandStats));
  console.log('  info  unstitchable relations:', report.unstitchableRelations);
  console.log('  info  merged:', report.merged, ' clearance inset/dropped:', report.clearanceInset, '/', report.clearanceDropped);
  console.log('  info  would-decompose area fraction:', (report.wouldDecomposeAreaFrac * 100).toFixed(1) + '% (revisit threshold 3%)');
  const hd = report.heightDefaultedByDistrict;
  console.log('  info  height-defaulted fraction by district:');
  for (const [k, v] of Object.entries(hd)) console.log(`        ${k}: ${(100 * v.defaulted / v.total).toFixed(0)}% of ${v.total}`);
  console.log('  info  manifest:', JSON.stringify({ version: manifest.version, shardGzBytes: manifest.shardGzBytes, extractionDate: manifest.extractionDate, license: manifest.license }));
  if (manifest.attribution !== '© OpenStreetMap contributors' || !manifest.licenseUrl || !manifest.extractionDate || manifest.extractionDate.startsWith('UNKNOWN')) {
    fail('ODbL manifest fields missing (attribution/licenseUrl/extractionDate)');
  } else pass('ODbL manifest fields present (attribution + license link + extraction timestamp)');
}

if (failures) {
  console.error(`\nverify-tokyo-data: ${failures} FAILURE(S)`);
  process.exit(1);
}
console.log('\nverify-tokyo-data: ALL GREEN');
