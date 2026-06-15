/**
 * fetch-osm.mjs — v4 resumable Overpass fetcher (Stream P, BUILD-TIME ONLY;
 * docs/DESIGN-V4.md データパイプライン §1). Deploys never touch Overpass.
 *
 * - GET with `User-Agent: fable-katamari-v4-pipeline/1.0 (...)` — the UA
 *   header is the documented fix for the observed 406 (not the verb).
 * - RESUMABLE: a cell whose data/osm-raw/<kind>-<cell>.json.gz already exists
 *   is skipped (incremental commits, crash-safe).
 * - Rate-limit protocol: poll /api/status before each request and sleep until
 *   a slot is free; HTTP 429 / Dispatcher_Client rate_limited sleeps the
 *   advertised retry-after WITHOUT consuming one of the 3 hard retries; bulk
 *   runs default to the kumi mirror with overpass-api.de fallback; >=2 s
 *   spacing floor.
 * - Raw responses committed TAG-PRUNED (building, height, building:levels,
 *   building:&ast;, highway, railway, tunnel, natural, water, waterway,
 *   leisure, name).
 *
 * Usage:
 *   node scripts/osm/fetch-osm.mjs                 # everything (resumable)
 *   node scripts/osm/fetch-osm.mjs --set counts    # refresh EXPECTED_COUNTS inputs
 *   node scripts/osm/fetch-osm.mjs --set detail|towers|roads|roadsres|water|parks|landmarks
 */

import { mkdirSync, existsSync, writeFileSync, renameSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import {
  RAW_DIR, detailCells, fullBboxCells, FULL_BBOX,
  DETAIL_RADIUS_REAL_M, ANCHOR_LAT, ANCHOR_LON,
  LANDMARK_SPECS, toGame,
} from './geo.mjs';

const UA = 'fable-katamari-v4-pipeline/1.0 (contact: claude@syn-gr.com)';
/** overpass-api.de primary (measured ~3 s/dense-cell vs kumi ~3 min on the
 *  2026-06-11 run; the /api/status slot-poll protocol keeps it polite),
 *  kumi mirror as the bulk fallback. */
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const SPACING_MS = 2000; // >=2 s floor between requests
const HARD_RETRIES = 3;

const KEEP_TAGS = ['building', 'height', 'building:levels', 'highway', 'railway', 'tunnel', 'natural', 'water', 'waterway', 'leisure', 'name'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastReqAt = 0;

/**
 * HTTP GET transport via curl (this build machine firewalls Node's outbound
 * sockets while curl is allowed; semantics are identical — GET + UA header).
 * @returns {Promise<{status:number, headers:string, body:string}>}
 */
function httpGet(url, timeoutS = 300) {
  const tag = `osmfetch-${process.pid}-${Math.random().toString(36).slice(2)}`;
  const bodyFile = join(tmpdir(), `${tag}.body`);
  const hdrFile = join(tmpdir(), `${tag}.hdr`);
  return new Promise((resolve, reject) => {
    execFile('curl', [
      '-sS', '--max-time', String(timeoutS), '--get', url,
      '-A', UA, '-H', 'Accept: application/json',
      '-D', hdrFile, '-o', bodyFile, '-w', '%{http_code}',
    ], { timeout: (timeoutS + 30) * 1000 }, (err, stdout) => {
      try {
        const status = +String(stdout).trim();
        if (err && !status) { reject(new Error(`curl: ${err.message}`)); return; }
        const body = existsSync(bodyFile) ? readFileSync(bodyFile, 'utf8') : '';
        const headers = existsSync(hdrFile) ? readFileSync(hdrFile, 'utf8') : '';
        resolve({ status, headers, body });
      } catch (e) {
        reject(e);
      } finally {
        rmSync(bodyFile, { force: true }); rmSync(hdrFile, { force: true });
      }
    });
  });
}

function bboxStr(bb) {
  return `${bb.s.toFixed(6)},${bb.w.toFixed(6)},${bb.n.toFixed(6)},${bb.e.toFixed(6)}`;
}

/** Poll /api/status on the chosen endpoint; sleep until a slot is free. */
async function waitForSlot(endpoint) {
  const statusUrl = endpoint.replace(/interpreter$/, 'status');
  for (let i = 0; i < 30; i++) {
    let txt = '';
    try {
      txt = (await httpGet(statusUrl, 20)).body;
    } catch { return; } // status endpoint unusable (e.g. kumi) -> spacing floor only
    if (!txt || !/Rate limit/i.test(txt)) return; // mirror without slot accounting
    const m = txt.match(/(\d+)\s+slots? available now/i);
    if (m && +m[1] > 0) return;
    if (/Rate limit:\s*0/i.test(txt)) return; // unlimited
    const after = txt.match(/available after.*?in (\d+) seconds/i);
    const waitS = after ? Math.min(+after[1] + 1, 120) : 10;
    process.stdout.write(`  [status] no slot, waiting ${waitS}s\n`);
    await sleep(waitS * 1000);
  }
}

/** Per-run endpoint health: a mirror that times out is demoted for the run. */
const demoted = new Set();

/** One Overpass GET with the full retry/rate-limit protocol. */
async function overpass(query, _opts = {}) {
  let order = [...ENDPOINTS];
  if (order.some((e) => !demoted.has(e))) order = [...order.filter((e) => !demoted.has(e)), ...order.filter((e) => demoted.has(e))];
  let hardFails = 0;
  for (let attempt = 0; attempt < 12; attempt++) {
    const endpoint = order[Math.min(hardFails, order.length - 1) % order.length];
    await waitForSlot(endpoint);
    const since = Date.now() - lastReqAt;
    if (since < SPACING_MS) await sleep(SPACING_MS - since);
    lastReqAt = Date.now();
    let status, headers, body;
    try {
      ({ status, headers, body } = await httpGet(`${endpoint}?data=${encodeURIComponent(query)}`, 300));
    } catch (e) {
      hardFails++;
      if (/timed out/i.test(e.message)) demoted.add(endpoint);
      if (hardFails > HARD_RETRIES) throw new Error(`overpass: network failure after ${HARD_RETRIES} retries: ${e.message}`);
      process.stdout.write(`  [retry ${hardFails}/${HARD_RETRIES}] ${e.message.split('\n').pop().slice(0, 120)}\n`);
      await sleep(5000 * hardFails);
      continue;
    }
    if (status === 429 || /rate_limited|Dispatcher_Client/i.test(body.slice(0, 2000))) {
      // does NOT consume a hard retry
      const ram = headers.match(/^retry-after:\s*(\d+)/im);
      const ra = ram ? +ram[1] : 30;
      process.stdout.write(`  [429/rate_limited] sleeping ${ra}s (no retry consumed)\n`);
      await sleep(ra * 1000);
      continue;
    }
    if (status >= 500 || status === 0 || (/timed out|timeout/i.test(body.slice(0, 400)) && !body.startsWith('{'))) {
      hardFails++;
      if (hardFails > HARD_RETRIES) throw new Error(`overpass: HTTP ${status} after ${HARD_RETRIES} retries`);
      process.stdout.write(`  [retry ${hardFails}/${HARD_RETRIES}] HTTP ${status}\n`);
      await sleep(8000 * hardFails);
      continue;
    }
    if (status < 200 || status >= 300) throw new Error(`overpass: HTTP ${status}: ${body.slice(0, 300)}`);
    try {
      return JSON.parse(body);
    } catch {
      hardFails++;
      if (hardFails > HARD_RETRIES) throw new Error(`overpass: unparseable body after ${HARD_RETRIES} retries: ${body.slice(0, 200)}`);
      await sleep(8000 * hardFails);
    }
  }
  throw new Error('overpass: attempt budget exhausted');
}

/** Tag-prune + strip an Overpass element list (committed raw shape). */
function pruneElements(elements) {
  const out = [];
  for (const el of elements) {
    const tags = {};
    if (el.tags) {
      for (const k of Object.keys(el.tags)) {
        if (KEEP_TAGS.includes(k) || k.startsWith('building:')) tags[k] = el.tags[k];
      }
    }
    if (el.type === 'way') {
      out.push({ type: 'way', id: el.id, tags, geometry: el.geometry || [] });
    } else if (el.type === 'relation') {
      const members = (el.members || [])
        .filter((m) => m.type === 'way')
        .map((m) => ({ type: 'way', ref: m.ref, role: m.role, geometry: m.geometry || [] }));
      out.push({ type: 'relation', id: el.id, tags, members });
    } else if (el.type === 'node') {
      out.push({ type: 'node', id: el.id, tags, lat: el.lat, lon: el.lon });
    }
  }
  return out;
}

/** Resumable cell fetch -> data/osm-raw/<kind>-<id>.json.gz (atomic rename). */
async function fetchCell(kind, id, query) {
  const file = join(RAW_DIR, `${kind}-${id}.json.gz`);
  if (existsSync(file)) { process.stdout.write(`  [skip] ${kind}-${id}\n`); return false; }
  process.stdout.write(`  [GET ] ${kind}-${id} ...`);
  const json = await overpass(query);
  const pruned = { kind, cell: id, generator: json.generator || '', osm3s: json.osm3s || {}, elements: pruneElements(json.elements || []) };
  const tmp = file + '.tmp';
  writeFileSync(tmp, gzipSync(Buffer.from(JSON.stringify(pruned)), { level: 9 }));
  renameSync(tmp, file);
  process.stdout.write(` ${pruned.elements.length} elements\n`);
  return true;
}

/* ====================== query builders (per spec) ====================== */

// NOTE: `out body geom;` (NOT `out geom tags;`) — the 'tags' verbosity strips
// relation MEMBERS from the response, which silently breaks multipolygon
// ring assembly (observed empirically on overpass-api.de 0.7.62). 'body'
// verbosity + geom modificator returns members with per-member geometry;
// pruneElements() strips node-ref arrays before commit so raw stays small.
const Q = (body) => `[out:json][timeout:120];${body}`;
const qDetail = (bb) => Q(`(way["building"](${bb});relation["building"]["type"="multipolygon"](${bb}););out body geom;`);
const qTowers = (bb) => Q(
  `(way["building"]["height"~"^([5-9][0-9]|[1-9][0-9]{2,})"](${bb});` +
  `way["building"]["building:levels"~"^(1[3-9]|[2-9][0-9])"](${bb});` +
  `relation["building"]["type"="multipolygon"]["height"~"^([5-9][0-9]|[1-9][0-9]{2,})"](${bb});` +
  `relation["building"]["type"="multipolygon"]["building:levels"~"^(1[3-9]|[2-9][0-9])"](${bb}););out body geom;`,
);
const qRoads = (bb) => Q(
  `(way["highway"~"^(motorway|trunk|primary|secondary|tertiary)$"](${bb});` +
  `way["railway"~"^(rail|subway)$"]["tunnel"!="yes"](${bb}););out body geom;`,
);
const qRoadsRes = (bb) => Q(`way["highway"~"^(residential|unclassified)$"](${bb});out body geom;`);
const qWater = (bb) => Q(`(way["natural"="water"](${bb});relation["natural"="water"](${bb});way["waterway"="riverbank"](${bb}););out body geom;`);
const qParks = (bb) => Q(`(way["leisure"~"^(park|garden)$"](${bb});relation["leisure"="park"](${bb}););out body geom;`);

/* ====================== fetch sets ====================== */

async function fetchDetail() {
  console.log('== DETAIL BUILDINGS (coverage cells) ==');
  for (const c of detailCells()) await fetchCell('buildings', c.id, qDetail(bboxStr(c.bbox)));
}
async function fetchTowers() {
  console.log('== TOWERS (full bbox, coarse regex) ==');
  for (const c of fullBboxCells(4, 3, 't')) await fetchCell('towers', c.id, qTowers(bboxStr(c.bbox)));
}
async function fetchRoads() {
  console.log('== ROADS+RAIL (full bbox, major classes) ==');
  for (const c of fullBboxCells(4, 3, 'r')) await fetchCell('roads', c.id, qRoads(bboxStr(c.bbox)));
}
async function fetchRoadsRes() {
  console.log('== RESIDENTIAL/UNCLASSIFIED (coverage cells, clearance bake only — never shipped) ==');
  for (const c of detailCells()) await fetchCell('roadsres', c.id, qRoadsRes(bboxStr(c.bbox)));
}
async function fetchWater() {
  console.log('== WATER (full bbox; the SEA/coastline is explicitly NOT fetched) ==');
  for (const c of fullBboxCells(3, 2, 'w')) await fetchCell('water', c.id, qWater(bboxStr(c.bbox)));
}
async function fetchParks() {
  console.log('== PARKS (full bbox) ==');
  for (const c of fullBboxCells(3, 2, 'w')) await fetchCell('parks', c.id, qParks(bboxStr(c.bbox)));
}

/** Landmark resolution: tiny per-landmark query around the reference coord;
 *  resolved element id + centroid committed to landmarks.json. */
async function fetchLandmarks() {
  const file = join(RAW_DIR, 'landmarks.json');
  if (existsSync(file)) { console.log('== LANDMARKS == [skip] landmarks.json exists'); return; }
  console.log('== LANDMARKS (12, resolved once by element query) ==');
  const out = [];
  for (const spec of LANDMARK_SPECS) {
    const half = spec.searchHalfDeg || 0.006; // ~600 m search box default
    const bb = `${spec.refLat - half},${spec.refLon - half},${spec.refLat + half},${spec.refLon + half}`;
    const outClause = spec.wantGeom ? 'out geom tags;' : 'out center tags;';
    const body = spec.twoStage
      ? `${spec.query}(${bb});way(r);${outClause}` // relation -> member ways w/ geometry
      : `${spec.query}(${bb});${outClause}`;
    const json = await overpass(Q(body), { bulk: false });
    const els = (json.elements || []).filter((e) => e.type !== 'node' || e.lat !== undefined);
    if (!els.length && spec.fallbackToRef) {
      const entry = {
        key: spec.key, landmarkId: spec.landmarkId, nameJa: spec.nameJa,
        osmType: 'reference', osmId: 0, lat: spec.refLat, lon: spec.refLon, refDistM: 0,
        note: 'no named OSM element — design reference coordinate (explicit fallback)',
      };
      out.push(entry);
      console.log(`  ${spec.key}: REFERENCE fallback @ ${spec.refLat},${spec.refLon}`);
      continue;
    }
    if (!els.length) throw new Error(`landmark ${spec.key}: no element resolved — adjust LANDMARK_SPECS.query`);
    // nearest element centroid to the reference wins
    const centroidOf = (el) => {
      if (el.type === 'node') return { lat: el.lat, lon: el.lon };
      if (el.center) return { lat: el.center.lat, lon: el.center.lon };
      const pts = el.geometry || (el.members || []).flatMap((m) => m.geometry || []);
      const n = pts.length || 1;
      return { lat: pts.reduce((s, p) => s + p.lat, 0) / n, lon: pts.reduce((s, p) => s + p.lon, 0) / n };
    };
    let best = null, bd = Infinity;
    for (const el of els) {
      const c = centroidOf(el);
      const d = Math.hypot((c.lat - spec.refLat) * 111000, (c.lon - spec.refLon) * 90400);
      if (d < bd) { bd = d; best = { el, c }; }
    }
    const entry = {
      key: spec.key, landmarkId: spec.landmarkId, nameJa: spec.nameJa,
      osmType: best.el.type, osmId: best.el.id, lat: best.c.lat, lon: best.c.lon,
      refDistM: Math.round(bd),
    };
    if (spec.wantGeom) {
      // commit member-way geometry grouped per way (span derivation in geo.mjs)
      entry.memberWays = els
        .filter((el) => el.type === 'way' && el.geometry && el.geometry.length)
        .map((el) => ({ id: el.id, points: el.geometry.map((p) => ({ lat: p.lat, lon: p.lon })) }));
      // entry centroid = mean of all member points (relation 'out geom' lacks center)
      const all = entry.memberWays.flatMap((w) => w.points);
      if (all.length) {
        entry.lat = all.reduce((s, p) => s + p.lat, 0) / all.length;
        entry.lon = all.reduce((s, p) => s + p.lon, 0) / all.length;
        entry.refDistM = Math.round(Math.hypot((entry.lat - spec.refLat) * 111000, (entry.lon - spec.refLon) * 90400));
      }
      entry.osmType = 'relation-members'; // osmId = nearest member way (provenance)
    }
    out.push(entry);
    const g = toGame(entry.lat, entry.lon);
    console.log(`  ${spec.key}: ${entry.osmType}/${entry.osmId} @ ${entry.lat.toFixed(5)},${entry.lon.toFixed(5)} -> game (${g.x.toFixed(0)},${g.z.toFixed(0)}) [refDist ${entry.refDistM}m]`);
  }
  writeFileSync(file, JSON.stringify({ fetchedAt: new Date().toISOString(), landmarks: out }, null, 2));
}

/** EXPECTED_COUNTS refresh: out-count queries per fetch set -> counts.json.
 *  Resumable like cells; delete counts.json to force a refresh. */
async function fetchCounts() {
  if (existsSync(join(RAW_DIR, 'counts.json'))) { console.log('== COUNTS == [skip] counts.json exists (delete to refresh)'); return; }
  console.log('== EXPECTED_COUNTS out-count queries ==');
  const full = bboxStr(FULL_BBOX);
  const around = `around:${DETAIL_RADIUS_REAL_M.toFixed(0)},${ANCHOR_LAT},${ANCHOR_LON}`;
  const count = async (label, body) => {
    const json = await overpass(`[out:json][timeout:300];${body}out count;`, { bulk: true });
    const el = (json.elements || []).find((e) => e.type === 'count');
    const total = el ? +el.tags.total : NaN;
    console.log(`  ${label}: ${total}`);
    return total;
  };
  const counts = {
    detailDiscBuildings: await count('detailDiscBuildings', `(way["building"](${around});relation["building"]["type"="multipolygon"](${around}););`),
    roadsRailWays: await count('roadsRailWays', `(way["highway"~"^(motorway|trunk|primary|secondary|tertiary)$"](${full});way["railway"~"^(rail|subway)$"]["tunnel"!="yes"](${full}););`),
    waterParks: await count('waterParks', `(way["natural"="water"](${full});relation["natural"="water"](${full});way["waterway"="riverbank"](${full});way["leisure"~"^(park|garden)$"](${full});relation["leisure"="park"](${full}););`),
    towers: await count('towers', `(way["building"]["height"~"^([5-9][0-9]|[1-9][0-9]{2,})"](${full});way["building"]["building:levels"~"^(1[3-9]|[2-9][0-9])"](${full});relation["building"]["type"="multipolygon"]["height"~"^([5-9][0-9]|[1-9][0-9]{2,})"](${full});relation["building"]["type"="multipolygon"]["building:levels"~"^(1[3-9]|[2-9][0-9])"](${full}););`),
  };
  writeFileSync(join(RAW_DIR, 'counts.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), counts }, null, 2));
  console.log('-> data/osm-raw/counts.json — commit these into geo.mjs EXPECTED_COUNTS');
}

/* ====================== main ====================== */

async function main() {
  mkdirSync(RAW_DIR, { recursive: true });
  const setArg = process.argv.includes('--set') ? process.argv[process.argv.indexOf('--set') + 1] : null;
  const sets = {
    counts: fetchCounts, landmarks: fetchLandmarks, detail: fetchDetail,
    towers: fetchTowers, roads: fetchRoads, roadsres: fetchRoadsRes,
    water: fetchWater, parks: fetchParks,
  };
  if (setArg) {
    if (!sets[setArg]) throw new Error(`unknown --set ${setArg}`);
    await sets[setArg]();
  } else {
    await fetchCounts().catch((e) => console.warn(`counts failed (non-fatal): ${e.message}`));
    await fetchLandmarks();
    await fetchDetail();
    await fetchTowers();
    await fetchRoads();
    await fetchRoadsRes();
    await fetchWater();
    await fetchParks();
  }
  // fetch-meta.json: extractionDate for the manifest (deterministic convert)
  const metaFile = join(RAW_DIR, 'fetch-meta.json');
  if (!existsSync(metaFile)) {
    writeFileSync(metaFile, JSON.stringify({ extractionDate: new Date().toISOString(), userAgent: UA }, null, 2));
  }
  console.log('fetch-osm: done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
