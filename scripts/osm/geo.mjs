/**
 * geo.mjs — v4 Real-Tokyo SINGLE SOURCE OF GEOGRAPHIC TRUTH (Stream P,
 * docs/DESIGN-V4.md 地理マッピング — constants FROZEN Phase 0).
 *
 * Owns: anchor lat/lon, projection math (toGame/toReal), scale Ks, coverage
 * geometry (detail disc r=500 game m + Shibuya/Asakusa patch rects GENERATED
 * from their frozen bboxes), fetch-cell derivation (never hand-listed),
 * EXPECTED_COUNTS (committed out-count baselines, refreshed at fetch time),
 * landmark real coords (loaded from data/osm-raw/landmarks.json, fetched by
 * element resolution ONCE) + the generated reconciliation table with
 * inter-landmark distance cross-checks, and the exclusion-zone builder.
 *
 * src/config/tuning.js mirrors the runtime-needed values;
 * src/config/cityMap.js re-exports the generated coverage/exclusion
 * constants and cross-check-asserts them. NEVER hand-edit one side alone.
 * HAND ARITHMETIC ON GEO VALUES IS BANNED — everything below derives from
 * ANCHOR_* + the frozen bboxes + landmarks.json.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
/** Repo root (scripts/osm/ -> ../..). */
export const REPO_ROOT = join(__dir, '..', '..');
export const RAW_DIR = join(REPO_ROOT, 'data', 'osm-raw');
export const OUT_DIR = join(REPO_ROOT, 'public', 'assets', 'tokyo');

/* ================================================================== */
/* Anchor + projection (FROZEN Phase 0)                                */
/* ================================================================== */

export const ANCHOR_LAT = 35.6987;
export const ANCHOR_LON = 139.7693;
export const M_PER_DEG_LAT = 110941;
export const M_PER_DEG_LON = 111320 * Math.cos((ANCHOR_LAT * Math.PI) / 180);
/** Horizontal 1:5 — positions AND footprints (XZ). */
export const OSM_HORIZ_K = 0.2;
/** Vertical 1:2.5. */
export const OSM_HEIGHT_K = 0.4;

/** real lat/lon -> game meters (+X east, +Z south; origin = anchor = ball start). */
export function toGame(lat, lon) {
  return {
    x: (lon - ANCHOR_LON) * M_PER_DEG_LON * OSM_HORIZ_K,
    z: (ANCHOR_LAT - lat) * M_PER_DEG_LAT * OSM_HORIZ_K,
  };
}
/** game meters -> real lat/lon (inverse of toGame). */
export function toReal(x, z) {
  return {
    lat: ANCHOR_LAT - z / (M_PER_DEG_LAT * OSM_HORIZ_K),
    lon: ANCHOR_LON + x / (M_PER_DEG_LON * OSM_HORIZ_K),
  };
}
/** Real-meter distance between two lat/lon points (equirectangular at anchor). */
export function realDistM(a, b) {
  const dx = (a.lon - b.lon) * M_PER_DEG_LON;
  const dz = (a.lat - b.lat) * M_PER_DEG_LAT;
  return Math.hypot(dx, dz);
}

/* ================================================================== */
/* Coverage geometry (FROZEN Phase 0 — disc + 2 GENERATED patch rects) */
/* ================================================================== */

export const DETAIL_RADIUS_GAME_M = 500; // = 2,500 real m
export const DETAIL_RADIUS_REAL_M = DETAIL_RADIUS_GAME_M / OSM_HORIZ_K;

/** Frozen real bboxes {s,w,n,e}. */
export const SHIBUYA_BBOX = Object.freeze({ s: 35.652, w: 139.692, n: 35.666, e: 139.709 });
export const ASAKUSA_BBOX = Object.freeze({ s: 35.705, w: 139.789, n: 35.717, e: 139.803 });

/** bbox {s,w,n,e} -> game rect {x0,x1,z0,z1} (x0<x1, z0<z1). GENERATED. */
export function bboxToGameRect(bb) {
  const nw = toGame(bb.n, bb.w);
  const se = toGame(bb.s, bb.e);
  return { x0: nw.x, x1: se.x, z0: nw.z, z1: se.z };
}
/** game rect -> real bbox (inverse). */
export function gameRectToBbox(r) {
  const a = toReal(r.x0, r.z1); // south-west
  const b = toReal(r.x1, r.z0); // north-east
  return { s: a.lat, w: a.lon, n: b.lat, e: b.lon };
}

export const SHIBUYA_RECT = Object.freeze(bboxToGameRect(SHIBUYA_BBOX));
export const ASAKUSA_RECT = Object.freeze(bboxToGameRect(ASAKUSA_BBOX));

/** MAP_BOUNDS mirror (tuning.js is the runtime source; identical by contract). */
export const MAP_BOUNDS_GAME = Object.freeze({ x: [-1800, 1800], z: [-1800, 2000] });
/** Full map real bbox (GENERATED from MAP_BOUNDS_GAME). */
export const FULL_BBOX = Object.freeze(
  gameRectToBbox({ x0: MAP_BOUNDS_GAME.x[0], x1: MAP_BOUNDS_GAME.x[1], z0: MAP_BOUNDS_GAME.z[0], z1: MAP_BOUNDS_GAME.z[1] }),
);
/** Detail-disc bounding square real bbox (EXPECTED_COUNTS query bbox). */
export const DETAIL_SQUARE_BBOX = Object.freeze(
  gameRectToBbox({
    x0: -DETAIL_RADIUS_GAME_M, x1: DETAIL_RADIUS_GAME_M,
    z0: -DETAIL_RADIUS_GAME_M, z1: DETAIL_RADIUS_GAME_M,
  }),
);

export function inRect(x, z, r) {
  return x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1;
}
/** The coverage law: detail disc OR one of the two patch rects (game m). */
export function inCoverage(x, z) {
  if (x * x + z * z <= DETAIL_RADIUS_GAME_M * DETAIL_RADIUS_GAME_M) return true;
  return inRect(x, z, SHIBUYA_RECT) || inRect(x, z, ASAKUSA_RECT);
}
/** Min distance from a game rect to the origin (for disc-cell coverage tests). */
function rectDistToOrigin(r) {
  const dx = Math.max(r.x0, Math.min(0, r.x1));
  const dz = Math.max(r.z0, Math.min(0, r.z1));
  return Math.hypot(dx, dz);
}
function rectsIntersect(a, b) {
  return a.x0 <= b.x1 && a.x1 >= b.x0 && a.z0 <= b.z1 && a.z1 >= b.z0;
}

/* ================================================================== */
/* Fetch-cell derivation (DERIVED — never hand-listed)                 */
/* ================================================================== */

const CELL_M = 1000; // 1x1 km detail fetch cells
const D_LAT = CELL_M / M_PER_DEG_LAT;
const D_LON = CELL_M / M_PER_DEG_LON;

/** 1 km cell (i east, j north, anchored at the anchor) -> real bbox. */
export function cellBbox(i, j) {
  return {
    s: ANCHOR_LAT + j * D_LAT, n: ANCHOR_LAT + (j + 1) * D_LAT,
    w: ANCHOR_LON + i * D_LON, e: ANCHOR_LON + (i + 1) * D_LON,
  };
}

/**
 * The 1x1 km cell set covering the coverage geometry (detail disc + the two
 * patch rects). Used for: detail-building fetch AND the clearance-bake
 * residential/unclassified road fetch. Deterministic order (j, then i).
 * @returns {{id:string,i:number,j:number,bbox:{s,w,n,e}}[]}
 */
export function detailCells() {
  const out = [];
  const span = 12; // generous scan window (covers disc + both patches)
  for (let j = -span; j <= span; j++) {
    for (let i = -span; i <= span; i++) {
      const bb = cellBbox(i, j);
      const rect = bboxToGameRect(bb);
      const covers =
        rectDistToOrigin(rect) <= DETAIL_RADIUS_GAME_M ||
        rectsIntersect(rect, SHIBUYA_RECT) ||
        rectsIntersect(rect, ASAKUSA_RECT);
      if (covers) out.push({ id: `c${i}_${j}`, i, j, bbox: bb });
    }
  }
  return out;
}

/** Split FULL_BBOX into nx * nz cells (towers/roads 4x3=12, water+parks 3x2=6). */
export function fullBboxCells(nx, nz, prefix) {
  const out = [];
  const dLat = (FULL_BBOX.n - FULL_BBOX.s) / nz;
  const dLon = (FULL_BBOX.e - FULL_BBOX.w) / nx;
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      out.push({
        id: `${prefix}${i}_${j}`, i, j,
        bbox: {
          s: FULL_BBOX.s + j * dLat, n: FULL_BBOX.s + (j + 1) * dLat,
          w: FULL_BBOX.w + i * dLon, e: FULL_BBOX.w + (i + 1) * dLon,
        },
      });
    }
  }
  return out;
}

/* ================================================================== */
/* EXPECTED_COUNTS (committed out-count baselines, verify gate ±20%)   */
/* ================================================================== */

/**
 * Re-derived by `node scripts/osm/fetch-osm.mjs --set counts` (writes
 * data/osm-raw/counts.json) and COMMITTED here. Design-doc reference
 * baselines (slightly different hand bbox): 58,155 / 16,712 / 4,272 / 1,946.
 * Values below are the 2026-06-11 out-count results on the geo.mjs-exact
 * bboxes. verify-tokyo-data.mjs asserts raw recounts within ±20%.
 */
export const EXPECTED_COUNTS = Object.freeze({
  detailDiscBuildings: 43851, //   way+mp-relation buildings within around:2500 of the anchor (the detail DISC, not its bounding square — the fetch cells cover the disc, so count and recount measure the same region)
  roadsRailWays: 16654, //         major-class highways + rail|subway non-tunnel, FULL_BBOX
  waterParks: 4265, //             natural=water ways/relations + riverbank + park/garden, FULL_BBOX
  towers: 2034, //                 coarse-regex tower candidates (height>=50-ish OR levels>=13-ish), FULL_BBOX
});

/* ================================================================== */
/* Landmarks (resolution specs -> data/osm-raw/landmarks.json -> table) */
/* ================================================================== */

/**
 * Landmark RESOLUTION specs: each landmark is resolved against Overpass ONCE
 * (fetch-osm.mjs --set landmarks) by a name/tag query inside a tiny bbox
 * around the reference coordinate, and the resolved OSM element id + centroid
 * are committed to data/osm-raw/landmarks.json. refLat/refLon are the design
 * review references (NOT shipped); verify asserts the resolved position is
 * within `refTolM` real meters of the reference, so a mis-resolved element
 * can never silently move a landmark.
 */
export const LANDMARK_SPECS = Object.freeze([
  { key: 'hachiko', landmarkId: 0, nameJa: 'ハチ公像', refLat: 35.65905, refLon: 139.70054, refTolM: 120, query: 'nwr["name"~"ハチ公"]' },
  { key: 'saigo', landmarkId: 1, nameJa: '西郷さん像', refLat: 35.71126, refLon: 139.77425, refTolM: 150, query: 'nwr["name"~"西郷隆盛"]' },
  { key: 'kaminarimon', landmarkId: 2, nameJa: '雷門', refLat: 35.711, refLon: 139.7964, refTolM: 120, query: 'nwr["name"="雷門"]' },
  { key: 'radio_kaikan', landmarkId: 3, nameJa: 'ラジオ会館', refLat: 35.69842, refLon: 139.77133, refTolM: 120, query: 'nwr["building"]["name"~"ラジオ会館"]' },
  { key: 'shibuya109', landmarkId: 4, nameJa: '渋谷109', refLat: 35.65977, refLon: 139.69856, refTolM: 120, query: 'nwr["building"]["name"~"109"]' },
  // スクランブル交差点 has no named OSM element (probed 2026-06-11: only the
  // unrelated スクランブルスクエア tower matches) — falls back to the reference
  // coordinate, committed with osmType:'reference' so the provenance is explicit.
  { key: 'scramble', landmarkId: 5, nameJa: 'スクランブル交差点', refLat: 35.65946, refLon: 139.70057, refTolM: 150, query: 'nwr["name"~"スクランブル交差点"]', fallbackToRef: true },
  { key: 'dome', landmarkId: 6, nameJa: '東京ドーム', refLat: 35.70564, refLon: 139.75193, refTolM: 200, query: 'nwr["building"]["name"="東京ドーム"]' },
  { key: 'tokyo_station', landmarkId: 7, nameJa: '東京駅丸の内駅舎', refLat: 35.68124, refLon: 139.76712, refTolM: 250, query: 'nwr["building"]["name"~"東京駅"]' },
  { key: 'diet', landmarkId: 8, nameJa: '国会議事堂', refLat: 35.67587, refLon: 139.74504, refTolM: 200, query: 'nwr["building"]["name"~"国会議事堂"]' },
  // レインボーブリッジ exists in OSM only as a man_made=bridge RELATION
  // (18497742). Two-stage fetch pulls its member ways with geometry; the two
  // COMPACT members (the anchor towers) define the span (the giant outline
  // way includes the ~1.7 km approach loops and is excluded by span filter).
  { key: 'rainbow_bridge', landmarkId: 9, nameJa: 'レインボーブリッジ', refLat: 35.63655, refLon: 139.7632, refTolM: 1200, query: 'relation["man_made"="bridge"]["name"~"レインボーブリッジ|Rainbow Bridge"]', wantGeom: true, twoStage: true, searchHalfDeg: 0.012 },
  { key: 'tokyo_tower', landmarkId: 10, nameJa: '東京タワー', refLat: 35.65858, refLon: 139.74543, refTolM: 150, query: 'nwr["name"="東京タワー"]["man_made"]' },
  { key: 'skytree', landmarkId: -1, nameJa: '東京スカイツリー', refLat: 35.71006, refLon: 139.81072, refTolM: 150, query: 'nwr["name"="東京スカイツリー"]["man_made"]' },
]);

/** Loads the committed landmark resolution file. */
export function loadLandmarks() {
  const p = join(RAW_DIR, 'landmarks.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

/**
 * GENERATED landmark reconciliation table: real lat/lon (from landmarks.json)
 * -> mapped game coords. Rainbow Bridge additionally carries span/direction
 * derived from its actual way geometry. @returns map key -> entry.
 */
export function reconcileLandmarks(landmarks = loadLandmarks()) {
  const out = {};
  for (const lm of landmarks.landmarks) {
    const g = toGame(lm.lat, lm.lon);
    const e = {
      key: lm.key, landmarkId: lm.landmarkId, nameJa: lm.nameJa,
      osmType: lm.osmType, osmId: lm.osmId, lat: lm.lat, lon: lm.lon,
      x: Math.round(g.x * 10) / 10, z: Math.round(g.z * 10) / 10,
    };
    if (lm.key === 'rainbow_bridge' && lm.memberWays && lm.memberWays.length) {
      // span = distance between the farthest pair of COMPACT member-structure
      // centroids (the anchor towers); the >400 m-real outline way (incl.
      // approach loops) is excluded so the span is the bridge proper.
      const centroids = [];
      for (const w of lm.memberWays) {
        if (w.points.length < 3) continue;
        let span = 0;
        for (let a = 0; a < w.points.length; a++) {
          for (let b = a + 1; b < w.points.length; b++) span = Math.max(span, realDistM(w.points[a], w.points[b]));
        }
        if (span > 400) continue; // outline / approach way
        let lat = 0, lon = 0;
        for (const p of w.points) { lat += p.lat; lon += p.lon; }
        centroids.push({ lat: lat / w.points.length, lon: lon / w.points.length });
      }
      if (centroids.length >= 2) {
        let best = 0, pa = centroids[0], pb = centroids[1];
        for (let a = 0; a < centroids.length; a++) {
          for (let b = a + 1; b < centroids.length; b++) {
            const d = realDistM(centroids[a], centroids[b]);
            if (d > best) { best = d; pa = centroids[a]; pb = centroids[b]; }
          }
        }
        const ga = toGame(pa.lat, pa.lon), gb = toGame(pb.lat, pb.lon);
        e.spanRealM = Math.round(best);
        e.spanGameM = Math.round(Math.hypot(gb.x - ga.x, gb.z - ga.z) * 10) / 10;
        e.x = Math.round(((ga.x + gb.x) / 2) * 10) / 10;
        e.z = Math.round(((ga.z + gb.z) / 2) * 10) / 10;
        e.endA = { x: Math.round(ga.x * 10) / 10, z: Math.round(ga.z * 10) / 10 };
        e.endB = { x: Math.round(gb.x * 10) / 10, z: Math.round(gb.z * 10) / 10 };
        const { lat, lon } = toReal(e.x, e.z);
        e.lat = lat; e.lon = lon;
      }
    }
    out[lm.key] = e;
  }
  return out;
}

/**
 * Inter-landmark REAL-distance ground truth (real meters, [min,max] windows).
 * Asserted by verify-tokyo-data.mjs AND by cityMap.validateCityMap() v4 so
 * hand-arithmetic errors are structurally impossible.
 */
export const DISTANCE_GROUND_TRUTH = Object.freeze([
  { a: 'hachiko', b: 'shibuya109', minM: 60, maxM: 200, note: 'ハチ公<->109 ~120 m real' },
  { a: 'hachiko', b: 'scramble', minM: 10, maxM: 150, note: 'ハチ公<->スクランブル交差点 (adjacent)' },
  { a: 'tokyo_station', b: 'radio_kaikan', minM: 1500, maxM: 2500, note: '東京駅<->秋葉原ラジオ会館 ~1.9 km real' },
  { a: 'kaminarimon', b: 'skytree', minM: 900, maxM: 1700, note: '雷門<->スカイツリー ~1.3 km real' },
  { a: 'tokyo_tower', b: 'diet', minM: 1500, maxM: 2500, note: '東京タワー<->国会議事堂 ~1.9 km real' },
  { a: 'dome', b: 'radio_kaikan', minM: 1400, maxM: 2400, note: '東京ドーム<->ラジオ会館 ~1.8 km real' },
]);
/** Rainbow Bridge span window (real m; design: ~798 m -> ~160 game m). */
export const BRIDGE_SPAN_REAL_M = Object.freeze({ min: 650, max: 950 });

/** Pretty reconciliation table (review artifact — generated, never hand-typed). */
export function reconciliationTableText(rec = reconcileLandmarks()) {
  const rows = ['| key | landmark | real (lat,lon) | v4 mapped (x,z) |', '|---|---|---|---|'];
  for (const e of Object.values(rec)) {
    const extra = e.spanRealM ? ` span ${e.spanRealM} m real -> ${e.spanGameM} game m` : '';
    rows.push(`| ${e.key} | ${e.nameJa} | ${e.lat.toFixed(5)},${e.lon.toFixed(5)} | (${e.x},${e.z})${extra} |`);
  }
  return rows.join('\n');
}

/* ================================================================== */
/* Exclusion zones (convert-baked, verify-asserted empty)              */
/* ================================================================== */

/** Curated 中央通り strip (FROZEN; byte-identical opening minute). */
export const CURATED_STRIP_RECT = Object.freeze({ x0: 0, x1: 25, z0: -190, z1: 190 });
/** Landmarks whose REAL footprints are deduped out of BOTH shards. */
export const EXCLUSION_LANDMARK_KEYS = Object.freeze([
  'radio_kaikan', 'shibuya109', 'tokyo_station', 'diet', 'dome', 'kaminarimon',
]);
export const SKYTREE_EXCLUSION_R_GAME = 110;

/**
 * Builds the full exclusion-zone list. dioramaRByKey comes from cityMap
 * LANDMARKS (sizes unchanged from v3); shopRect from cityMap SHOP.interior.
 * @returns {Array<{kind:'rect',x0,x1,z0,z1,label}|{kind:'circle',x,z,r,label}>}
 */
export function buildExclusions({ rec = reconcileLandmarks(), dioramaRByKey, shopRect }) {
  const out = [];
  out.push({ kind: 'rect', x0: shopRect.x0 - 2, x1: shopRect.x1 + 2, z0: shopRect.z0 - 2, z1: shopRect.z1 + 2, label: 'shop interior +2m' });
  out.push({ kind: 'rect', ...CURATED_STRIP_RECT, label: '中央通り curated strip' });
  for (const key of EXCLUSION_LANDMARK_KEYS) {
    const e = rec[key];
    const dr = dioramaRByKey[key];
    if (!e || !(dr > 0)) throw new Error(`buildExclusions: missing landmark/dioramaR for ${key}`);
    out.push({ kind: 'circle', x: e.x, z: e.z, r: dr * 1.2, label: `landmark ${key} dioramaR*1.2` });
  }
  const sky = rec.skytree;
  out.push({ kind: 'circle', x: sky.x, z: sky.z, r: SKYTREE_EXCLUSION_R_GAME, label: 'skytree base' });
  return out;
}

export function inExclusion(x, z, ex) {
  if (ex.kind === 'rect') return x >= ex.x0 && x <= ex.x1 && z >= ex.z0 && z <= ex.z1;
  const dx = x - ex.x, dz = z - ex.z;
  return dx * dx + dz * dz <= ex.r * ex.r;
}

/* ================================================================== */
/* Shared deterministic hash (thinning + tint)                         */
/* ================================================================== */

/** mulberry32 — identical to src/core/rng.js (duplicated to keep scripts/osm
 *  free of src/ imports; verify cross-checks one known vector). */
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* CLI: `node scripts/osm/geo.mjs` prints derived geography for review. */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const f = (v) => v.toFixed(4);
  console.log('ANCHOR', ANCHOR_LAT, ANCHOR_LON, ' M_PER_DEG_LON', M_PER_DEG_LON.toFixed(1));
  console.log('FULL_BBOX', f(FULL_BBOX.s), f(FULL_BBOX.w), f(FULL_BBOX.n), f(FULL_BBOX.e));
  console.log('DETAIL_SQUARE_BBOX', f(DETAIL_SQUARE_BBOX.s), f(DETAIL_SQUARE_BBOX.w), f(DETAIL_SQUARE_BBOX.n), f(DETAIL_SQUARE_BBOX.e));
  const r = (rc) => `x[${rc.x0.toFixed(0)},${rc.x1.toFixed(0)}] z[${rc.z0.toFixed(0)},${rc.z1.toFixed(0)}]`;
  console.log('SHIBUYA_RECT', r(SHIBUYA_RECT));
  console.log('ASAKUSA_RECT', r(ASAKUSA_RECT));
  console.log('detailCells:', detailCells().length, detailCells().map((c) => c.id).join(' '));
  try {
    console.log('\n' + reconciliationTableText());
  } catch {
    console.log('\n(landmarks.json not fetched yet — run npm run osm:fetch)');
  }
}
