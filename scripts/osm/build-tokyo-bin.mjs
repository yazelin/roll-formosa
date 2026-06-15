/**
 * build-tokyo-bin.mjs — v4 deterministic converter (Stream P,
 * docs/DESIGN-V4.md データパイプライン §2 — PIPELINE ORDER IS BINDING).
 *
 * Same committed raw -> byte-identical bins (asserted by osm:verify
 * double-run). Steps:
 *   0 DEDUPE+ASSEMBLE (global (type,id) map across cells AND fetch sets,
 *     tower wins; multipolygon outer-ring stitch, inners ignored,
 *     unstitchable drop+log; member ways consumed)
 *   1 PROJECT (geo.toGame)            2 COVERAGE CLIP (centroid; towers exempt)
 *   3 EXCLUSIONS (shop rect +2 m, curated strip, landmark circles, skytree)
 *   4 OBB (hull + rotating calipers; NO composite decomposition — affected
 *     rate measured + logged)         5 HEIGHT (tags else type defaults,
 *     suffix-safe parse; client-side tower threshold h>=50 || levels>=13)
 *   6 QUANTIZE (0.05/0.25/0.5 m, yaw pi/128)
 *   7 MERGE (>=60% shared edge, same type class, both w,d < 4 game m)
 *   8 CLEARANCE BAKE (road corridors halfwidth = width/2 + 1.0 game m, ALL
 *     fetched classes incl. unshipped residential; inset <=30%/axis else drop)
 *   9 BAND+THIN (r_eff edges [1.2,1.6,10,60]; mulberry32(wayId) < KEEP_K)
 *  10 TYPE->code (16 archetypes 94..109) + tint
 *  11 ROADS (shipped classes, DP eps 1/2, tile clip, major/minor) +
 *     WATER/PARKS (DP-then-earcut, u16 indices, park >= 5,000 real m^2)
 *  12 EMIT shards + manifest (per-band histogram, extraction timestamp from
 *     data/osm-raw/fetch-meta.json, ODbL attribution)
 *
 * Output dir override for the verify double-run: OSM_OUT_DIR env.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';
import {
  RAW_DIR, OUT_DIR, toGame, inCoverage, inRect, inExclusion,
  reconcileLandmarks, buildExclusions, mulberry32, reconciliationTableText,
  OSM_HORIZ_K, OSM_HEIGHT_K, SHIBUYA_BBOX, ASAKUSA_BBOX, MAP_BOUNDS_GAME,
} from './geo.mjs';
import { LANDMARKS, SHOP } from '../../src/config/cityMap.js';

const OUT = process.env.OSM_OUT_DIR || OUT_DIR;
const QUIET = !!process.env.OSM_QUIET;
const log = (...a) => { if (!QUIET) console.log(...a); };

/* ===================== tuning (FROZEN, mirrors design) ===================== */

const Q_CENTER = 0.05, Q_WD = 0.25, Q_H = 0.5, Q_H_TOWER = 0.25, Q_YAW = Math.PI / 128;
/* PHASE-3 RETUNE (integration, 2026-06-12): KEEP_K[4] 1.0 -> 0.53 — the
 * pre-approved band-4 data lever (pacing-model output: band-4 worst-window
 * 1,437 OVER OSM_ALIVE_CAP.b4 768; driven T4 segment confirmed the tower
 * ΣR³ cascade). 0.53 brings the worst window under the cap (~760 <= 768)
 * and halves the absorbable band-4 volume per area. Deterministic re-run.
 * PHASE-3 RETUNE 2 (integration, 2026-06-12 evening): KEEP_K[2] 0.35 -> 1.0
 * — the pre-approved band-2 data lever. Driven typical-proxy run plateaued
 * 348 s at r=2.27 (just under the band-3 absorbability threshold
 * 1.6/0.65=2.46): the r_eff [1.2,1.6) bridge supply was only 102 records
 * over the whole 0.93 km^2 coverage. 1.0 ships all ~291 band-2 records
 * (alive bounded by OSM_ALIVE_CAP.b2 192 + the admission check; band-2
 * worst-window per pacing model ~0 — structurally safe; gz cost ~+2 KB). */
const KEEP_K = [0, 0, 1.0, 0.6, 0.53, 1.0];
const BAND_EDGES = [1.2, 1.6, 10, 60];
const CLEARANCE_GAME_M = 1.0;
const MERGE_MAX_WD = 4, MERGE_EDGE_FRAC = 0.6, MERGE_GAP = 0.6, MERGE_ANGLE = (10 * Math.PI) / 180;
const INSET_MAX_FRAC = 0.3, MIN_WD_AFTER_INSET = 0.5;
const PARK_MIN_REAL_M2 = 5000, WATER_MIN_REAL_M2 = 500;
const DP_EPS_IN = 1.0, DP_EPS_OUT = 2.0;
const DETAIL_TILE = 100, TOWER_TILE = 400, GROUND_TILE = 200;
const ROAD_MAX_PTS = 31;
/** real widths m: motorway/trunk/primary/secondary/tertiary + rail (game = /5). */
const ROAD_CLASS = { motorway: 0, trunk: 1, primary: 2, secondary: 3, tertiary: 4, rail: 5 };
const ROAD_WIDTH_REAL = [25, 18, 14, 10, 8, 10];
const CLEARANCE_WIDTH_REAL = { motorway: 25, trunk: 18, primary: 14, secondary: 10, tertiary: 8, residential: 6, unclassified: 6 };
/** Default real heights by type class (design step 5 + sensible extras). */
const H_DEFAULT = { osm_house: 6.5, osm_shop_low: 9, osm_zakkyo: 12, osm_office_mid: 18, osm_office_tower: 60, osm_apartment_tower: 45, osm_hotel: 30, osm_school: 12, osm_temple: 8, osm_shrine: 8, osm_station: 12, osm_warehouse: 10, osm_parking: 15, osm_merged_block: 9, osm_tower_generic: 60, osm_stepped_roof: 12, generic: 9 };
const CODE_BASE = 94;
const CODE_BY_ID = Object.fromEntries(['osm_house', 'osm_shop_low', 'osm_zakkyo', 'osm_office_mid', 'osm_office_tower', 'osm_apartment_tower', 'osm_hotel', 'osm_school', 'osm_temple', 'osm_shrine', 'osm_station', 'osm_warehouse', 'osm_parking', 'osm_merged_block', 'osm_tower_generic', 'osm_stepped_roof'].map((id, i) => [id, CODE_BASE + i]));

/* ===================== small geometry helpers ===================== */

function polygonArea(pts) { // signed, game m^2
  let s = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    s += a.x * b.z - b.x * a.z;
  }
  return s / 2;
}
function polygonCentroid(pts) {
  const a = polygonArea(pts);
  if (Math.abs(a) < 1e-9) {
    let x = 0, z = 0;
    for (const p of pts) { x += p.x; z += p.z; }
    return { x: x / pts.length, z: z / pts.length };
  }
  let cx = 0, cz = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    const f = p.x * q.z - q.x * p.z;
    cx += (p.x + q.x) * f; cz += (p.z + q.z) * f;
  }
  return { x: cx / (6 * a), z: cz / (6 * a) };
}
/** Andrew monotone chain convex hull. */
function convexHull(pts) {
  const p = [...pts].sort((a, b) => a.x - b.x || a.z - b.z);
  const n = p.length;
  if (n < 3) return p;
  const cross = (o, a, b) => (a.x - o.x) * (b.z - o.z) - (a.z - o.z) * (b.x - o.x);
  const lo = [], hi = [];
  for (const pt of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], pt) <= 0) lo.pop();
    lo.push(pt);
  }
  for (let i = n - 1; i >= 0; i--) {
    const pt = p[i];
    while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], pt) <= 0) hi.pop();
    hi.push(pt);
  }
  lo.pop(); hi.pop();
  return lo.concat(hi);
}
/** Min-area OBB via rotating calipers over hull edges. Canonical yaw [0,pi/2). */
function minAreaOBB(pts) {
  const hull = convexHull(pts);
  if (hull.length === 0) return null;
  if (hull.length === 1) return { cx: hull[0].x, cz: hull[0].z, w: 0, d: 0, yaw: 0 };
  let best = null;
  const n = hull.length;
  for (let i = 0; i < n; i++) {
    const a = hull[i], b = hull[(i + 1) % n];
    const ang = Math.atan2(b.z - a.z, b.x - a.x);
    const c = Math.cos(-ang), s = Math.sin(-ang);
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const p of hull) {
      const x = p.x * c - p.z * s, z = p.x * s + p.z * c;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    const area = (maxX - minX) * (maxZ - minZ);
    if (!best || area < best.area - 1e-12) {
      const mx = (minX + maxX) / 2, mz = (minZ + maxZ) / 2;
      best = {
        area, w: maxX - minX, d: maxZ - minZ, yaw: ang,
        cx: mx * Math.cos(ang) - mz * Math.sin(ang),
        cz: mx * Math.sin(ang) + mz * Math.cos(ang),
      };
    }
  }
  // canonicalize: yaw in [0, pi/2) (box symmetric mod pi; swap w/d for mod pi/2)
  let { yaw, w, d } = best;
  yaw = ((yaw % Math.PI) + Math.PI) % Math.PI;
  if (yaw >= Math.PI / 2) { yaw -= Math.PI / 2; const t = w; w = d; d = t; }
  return { cx: best.cx, cz: best.cz, w, d, yaw };
}
/** OBB corners (game m). */
function obbCorners(o) {
  const c = Math.cos(o.yaw), s = Math.sin(o.yaw), hw = o.w / 2, hd = o.d / 2;
  const out = [];
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    out.push({ x: o.cx + sx * hw * c - sz * hd * s, z: o.cz + sx * hw * s + sz * hd * c });
  }
  return out;
}
/**
 * Liang-Barsky: parametric interval [t0,t1] of segment a->b INSIDE an
 * axis-aligned rect, or null when disjoint (clamped to [0,1]).
 */
function segRectInsideInterval(a, b, rect) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  let t0 = 0;
  let t1 = 1;
  if (Math.abs(dx) < 1e-12) {
    if (a.x < rect.x0 || a.x > rect.x1) return null;
  } else {
    let ta = (rect.x0 - a.x) / dx;
    let tb = (rect.x1 - a.x) / dx;
    if (ta > tb) { const tmp = ta; ta = tb; tb = tmp; }
    t0 = Math.max(t0, ta);
    t1 = Math.min(t1, tb);
  }
  if (Math.abs(dz) < 1e-12) {
    if (a.z < rect.z0 || a.z > rect.z1) return null;
  } else {
    let ta = (rect.z0 - a.z) / dz;
    let tb = (rect.z1 - a.z) / dz;
    if (ta > tb) { const tmp = ta; ta = tb; tb = tmp; }
    t0 = Math.max(t0, ta);
    t1 = Math.min(t1, tb);
  }
  if (t0 > t1 || t1 <= 0 || t0 >= 1) return null;
  return [Math.max(0, t0), Math.min(1, t1)];
}

/**
 * Clip a road/rail polyline so its rendered RIBBON (half-width halfW,
 * square caps extending halfW past segment ends) never intrudes into any
 * rect exclusion. Rects are inflated by halfW for the width; kept portions
 * are additionally pulled back by halfW along the segment for the caps.
 * Returns an array of >=2-point sub-polylines (possibly empty).
 *
 * WHY (v4 hotfix): exclusions were applied to building OBBs only — the
 * 総武線 rail viaduct ribbons pass directly over the shop ball-start and
 * painted the whole 2 cm opening view brown (issue: invisible first stage).
 */
function clipPolylineOutsideRects(pts, halfW, rects) {
  let pieces = [pts];
  for (const rect of rects) {
    const inf = { x0: rect.x0 - halfW, x1: rect.x1 + halfW, z0: rect.z0 - halfW, z1: rect.z1 + halfW };
    const next = [];
    for (const piece of pieces) {
      let cur = [];
      const flush = () => {
        if (cur.length >= 2) next.push(cur);
        cur = [];
      };
      for (let i = 1; i < piece.length; i++) {
        const a = piece[i - 1];
        const b = piece[i];
        const iv = segRectInsideInterval(a, b, inf);
        if (iv === null) {
          if (cur.length === 0) cur.push(a);
          cur.push(b);
          continue;
        }
        const len = Math.hypot(b.x - a.x, b.z - a.z);
        const pad = len > 1e-9 ? halfW / len : 1;
        const tHead = iv[0] - pad;
        const tTail = iv[1] + pad;
        if (tHead > 0) {
          if (cur.length === 0) cur.push(a);
          cur.push({ x: a.x + (b.x - a.x) * tHead, z: a.z + (b.z - a.z) * tHead });
        }
        flush();
        if (tTail < 1) {
          cur.push({ x: a.x + (b.x - a.x) * tTail, z: a.z + (b.z - a.z) * tTail });
          cur.push(b);
        }
      }
      flush();
    }
    pieces = next;
  }
  return pieces;
}

/** Does OBB intersect exclusion shape (rect or circle)? Conservative exact-ish. */
function obbIntersectsExclusion(o, ex) {
  const corners = obbCorners(o);
  if (ex.kind === 'circle') {
    const dx = o.cx - ex.x, dz = o.cz - ex.z;
    if (dx * dx + dz * dz <= ex.r * ex.r) return true;
    // closest point on each edge to circle center
    for (let i = 0; i < 4; i++) {
      const a = corners[i], b = corners[(i + 1) % 4];
      const abx = b.x - a.x, abz = b.z - a.z;
      const t = Math.max(0, Math.min(1, ((ex.x - a.x) * abx + (ex.z - a.z) * abz) / (abx * abx + abz * abz || 1)));
      const px = a.x + t * abx, pz = a.z + t * abz;
      const ddx = px - ex.x, ddz = pz - ex.z;
      if (ddx * ddx + ddz * ddz <= ex.r * ex.r) return true;
    }
    return false;
  }
  // rect: SAT on the two rect axes + the two OBB axes
  const rcs = [{ x: ex.x0, z: ex.z0 }, { x: ex.x1, z: ex.z0 }, { x: ex.x1, z: ex.z1 }, { x: ex.x0, z: ex.z1 }];
  const axes = [{ x: 1, z: 0 }, { x: 0, z: 1 }, { x: Math.cos(o.yaw), z: Math.sin(o.yaw) }, { x: -Math.sin(o.yaw), z: Math.cos(o.yaw) }];
  for (const ax of axes) {
    let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
    for (const p of corners) { const v = p.x * ax.x + p.z * ax.z; if (v < aMin) aMin = v; if (v > aMax) aMax = v; }
    for (const p of rcs) { const v = p.x * ax.x + p.z * ax.z; if (v < bMin) bMin = v; if (v > bMax) bMax = v; }
    if (aMax < bMin || bMax < aMin) return false;
  }
  return true;
}
/** Douglas-Peucker on {x,z} points. */
function dpSimplify(pts, eps) {
  if (pts.length <= 2) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const A = pts[a], B = pts[b];
    const dx = B.x - A.x, dz = B.z - A.z;
    const len2 = dx * dx + dz * dz;
    let maxD = -1, maxI = -1;
    for (let i = a + 1; i < b; i++) {
      const P = pts[i];
      let d;
      if (len2 < 1e-12) d = Math.hypot(P.x - A.x, P.z - A.z);
      else {
        const t = ((P.x - A.x) * dx + (P.z - A.z) * dz) / len2;
        const tc = Math.max(0, Math.min(1, t));
        d = Math.hypot(P.x - (A.x + tc * dx), P.z - (A.z + tc * dz));
      }
      if (d > maxD) { maxD = d; maxI = i; }
    }
    if (maxD > eps) { keep[maxI] = 1; stack.push([a, maxI], [maxI, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
/** Sutherland-Hodgman clip of a polygon to an axis-aligned rect. */
function clipPolyToRect(pts, x0, z0, x1, z1) {
  let out = pts;
  const clipEdge = (poly, inside, intersect) => {
    const res = [];
    for (let i = 0, n = poly.length; i < n; i++) {
      const cur = poly[i], prev = poly[(i + n - 1) % n];
      const cin = inside(cur), pin = inside(prev);
      if (cin) {
        if (!pin) res.push(intersect(prev, cur));
        res.push(cur);
      } else if (pin) res.push(intersect(prev, cur));
    }
    return res;
  };
  const ix = (a, b, x) => ({ x, z: a.z + ((b.z - a.z) * (x - a.x)) / (b.x - a.x) });
  const iz = (a, b, z) => ({ z, x: a.x + ((b.x - a.x) * (z - a.z)) / (b.z - a.z) });
  out = clipEdge(out, (p) => p.x >= x0, (a, b) => ix(a, b, x0));
  if (out.length) out = clipEdge(out, (p) => p.x <= x1, (a, b) => ix(a, b, x1));
  if (out.length) out = clipEdge(out, (p) => p.z >= z0, (a, b) => iz(a, b, z0));
  if (out.length) out = clipEdge(out, (p) => p.z <= z1, (a, b) => iz(a, b, z1));
  return out;
}
/** Simple ear-clipping triangulation; returns flat index list (CCW input). */
function earcut(pts) {
  const n = pts.length;
  if (n < 3) return [];
  const idx = [];
  for (let i = 0; i < n; i++) idx.push(i);
  if (polygonArea(pts) < 0) idx.reverse(); // ensure CCW order
  const tris = [];
  const area2 = (a, b, c) => (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
  const inTri = (p, a, b, c) =>
    area2(a, b, p) >= -1e-9 && area2(b, c, p) >= -1e-9 && area2(c, a, p) >= -1e-9;
  let guard = 0;
  while (idx.length > 3 && guard < 10000) {
    guard++;
    let clipped = false;
    for (let i = 0; i < idx.length; i++) {
      const ia = idx[(i + idx.length - 1) % idx.length], ib = idx[i], ic = idx[(i + 1) % idx.length];
      const a = pts[ia], b = pts[ib], c = pts[ic];
      if (area2(a, b, c) <= 1e-12) continue; // reflex or degenerate
      let ok = true;
      for (const j of idx) {
        if (j === ia || j === ib || j === ic) continue;
        if (inTri(pts[j], a, b, c)) { ok = false; break; }
      }
      if (!ok) continue;
      tris.push(ia, ib, ic);
      idx.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) { // degenerate fallback: fan
      for (let i = 1; i + 1 < idx.length; i++) tris.push(idx[0], idx[i], idx[i + 1]);
      return tris;
    }
  }
  if (idx.length === 3) tris.push(idx[0], idx[1], idx[2]);
  return tris;
}

/** Coverage area (game m^2) by 5 m grid integration over geo.inCoverage —
 *  derived, never hand-computed (disc + patch rects minus their overlap). */
function coverageAreaGameM2() {
  const step = 5;
  let n = 0;
  for (let x = -1500; x <= 700; x += step) {
    for (let z = -600; z <= 1100; z += step) {
      if (inCoverage(x + step / 2, z + step / 2)) n++;
    }
  }
  return n * step * step;
}

/* ===================== raw loading + ring assembly ===================== */

function loadRaw(prefixes) {
  const files = readdirSync(RAW_DIR).filter((f) => prefixes.some((p) => f.startsWith(p + '-')) && f.endsWith('.json.gz')).sort();
  const out = [];
  for (const f of files) {
    const json = JSON.parse(gunzipSync(readFileSync(join(RAW_DIR, f))).toString());
    out.push({ file: f, kind: json.kind, elements: json.elements });
  }
  return out;
}

/** Stitch multipolygon member ways (role outer) into closed rings.
 *  Returns {rings: [[{lat,lon}...]], consumed:Set<wayId>} or null. */
function stitchOuterRings(rel) {
  const segs = [];
  for (const m of rel.members || []) {
    if (m.role !== 'outer' && m.role !== '') continue;
    if (!m.geometry || m.geometry.length < 2) continue;
    segs.push({ ref: m.ref, pts: m.geometry.map((p) => ({ lat: p.lat, lon: p.lon })) });
  }
  if (!segs.length) return null;
  const key = (p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)}`;
  const used = new Array(segs.length).fill(false);
  const rings = [];
  const consumed = new Set();
  for (let s = 0; s < segs.length; s++) {
    if (used[s]) continue;
    used[s] = true;
    let ring = [...segs[s].pts];
    const refs = [segs[s].ref];
    let closedGuard = 0;
    while (key(ring[0]) !== key(ring[ring.length - 1]) && closedGuard++ < segs.length + 2) {
      const tail = key(ring[ring.length - 1]);
      let found = -1, rev = false;
      for (let t = 0; t < segs.length; t++) {
        if (used[t]) continue;
        if (key(segs[t].pts[0]) === tail) { found = t; rev = false; break; }
        if (key(segs[t].pts[segs[t].pts.length - 1]) === tail) { found = t; rev = true; break; }
      }
      if (found < 0) break;
      used[found] = true;
      const add = rev ? [...segs[found].pts].reverse() : segs[found].pts;
      ring = ring.concat(add.slice(1));
      refs.push(segs[found].ref);
    }
    if (ring.length >= 4 && key(ring[0]) === key(ring[ring.length - 1])) {
      ring.pop(); // drop closing duplicate
      rings.push(ring);
      for (const r of refs) consumed.add(r);
    } else {
      return null; // unstitchable -> caller drops + logs (consumes nothing)
    }
  }
  if (!rings.length) return null;
  // ALL member ways of a successfully assembled relation are consumed
  for (const m of rel.members || []) consumed.add(m.ref);
  return { rings, consumed };
}

/* ===================== height + type classification ===================== */

const parseNum = (v) => {
  if (v === undefined || v === null) return NaN;
  const m = String(v).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

/** type class id (one of the 16 archetype ids) from tags + real height. */
function typeClassOf(tags, hReal, id) {
  const b = String(tags.building || 'yes').toLowerCase();
  if (b === 'temple' || tags['building:use'] === 'temple') return 'osm_temple';
  if (b === 'shrine') return 'osm_shrine';
  if (b === 'train_station' || b === 'station' || b === 'transportation') return 'osm_station';
  if (b === 'warehouse' || b === 'industrial' || b === 'factory') return 'osm_warehouse';
  if (b === 'parking' || b === 'garage' || b === 'garages' || b === 'carport') return 'osm_parking';
  if (b === 'hotel') return 'osm_hotel';
  if (b === 'school' || b === 'university' || b === 'college' || b === 'kindergarten') return 'osm_school';
  if (b === 'apartments' || b === 'dormitory') {
    if (hReal >= 40) return 'osm_apartment_tower';
    return hReal <= 12 ? 'osm_house' : 'osm_zakkyo';
  }
  if (b === 'house' || b === 'detached' || b === 'residential' || b === 'terrace' || b === 'semidetached_house' || b === 'hut' || b === 'bungalow') return 'osm_house';
  if (b === 'retail' || b === 'shop' || b === 'kiosk' || b === 'supermarket' || b === 'convenience') {
    return hReal < 10 ? 'osm_shop_low' : 'osm_zakkyo';
  }
  if (b === 'office' || b === 'civic' || b === 'public' || b === 'government') {
    return hReal >= 50 ? 'osm_office_tower' : 'osm_office_mid';
  }
  if (b === 'commercial' || b === 'mixed' || b === 'mixed_use') {
    if (hReal < 10) return 'osm_shop_low';
    if (hReal < 30) return 'osm_zakkyo';
    return hReal >= 50 ? 'osm_office_tower' : 'osm_office_mid';
  }
  // generic 'yes' & everything else: by height, with a deterministic
  // stepped-roof fraction for mid-rises (roofline variety)
  if (hReal <= 7) return 'osm_house';
  if (hReal < 30) {
    return mulberry32((Number(id) ^ 0x5bd1e995) | 0)() < 0.25 && hReal >= 8 ? 'osm_stepped_roof' : 'osm_zakkyo';
  }
  if (hReal < 50) return 'osm_office_mid';
  return 'osm_tower_generic';
}
/** Tower-set class override (keeps tower-ish classes, else generic tower). */
function towerClassOf(cls) {
  return ['osm_office_tower', 'osm_apartment_tower', 'osm_hotel', 'osm_station'].includes(cls) ? cls : 'osm_tower_generic';
}

/* ===================== main convert ===================== */

function main() {
  mkdirSync(OUT, { recursive: true });
  const t0 = Date.now();
  const report = {
    unstitchableRelations: 0, dedupedAcrossSets: 0, coverageClipped: 0,
    exclusionDropped: 0, clearanceInset: 0, clearanceDropped: 0,
    merged: 0, thinned: 0, droppedSmall: 0, towerFolded: 0, towerDroppedOutside: 0,
    wouldDecomposeAreaFrac: 0, heightDefaultedByDistrict: {}, clampedWD: 0,
  };

  /* ---- step 0: load + global dedupe + ring assembly ---- */
  log('step 0: load + dedupe + assemble');
  const byKey = new Map(); // "type/id" -> {id, tags, set, ringsLL|ptsLL}
  let dupCells = 0;
  for (const setName of ['detail', 'tower']) {
    const files = loadRaw([setName === 'detail' ? 'buildings' : 'towers']);
    for (const { elements } of files) {
      for (const el of elements) {
        if (el.type !== 'way' && el.type !== 'relation') continue;
        const k = `${el.type}/${el.id}`;
        const prev = byKey.get(k);
        if (prev) {
          dupCells++;
          if (prev.set === 'detail' && setName === 'tower') { report.dedupedAcrossSets++; prev.set = 'tower'; }
          continue;
        }
        byKey.set(k, { type: el.type, id: el.id, tags: el.tags || {}, set: setName, raw: el });
      }
    }
  }
  // relations first: assemble + consume member ways
  const buildings = [];
  const consumedWays = new Set();
  const rels = [...byKey.values()].filter((e) => e.type === 'relation').sort((a, b) => a.id - b.id);
  for (const rel of rels) {
    const st = stitchOuterRings(rel.raw);
    if (!st) { report.unstitchableRelations++; continue; }
    for (const ref of st.consumed) consumedWays.add(ref);
    const ptsLL = st.rings.flat();
    buildings.push({ id: rel.id, srcKey: `relation/${rel.id}`, tags: rel.tags, set: rel.set, ptsLL });
  }
  for (const e of [...byKey.values()].filter((v) => v.type === 'way').sort((a, b) => a.id - b.id)) {
    if (consumedWays.has(e.id)) continue;
    const g = e.raw.geometry || [];
    if (g.length < 3) continue;
    const pts = [...g];
    // drop closing duplicate
    if (pts.length > 1 && pts[0].lat === pts[pts.length - 1].lat && pts[0].lon === pts[pts.length - 1].lon) pts.pop();
    if (pts.length < 3) continue;
    buildings.push({ id: e.id, srcKey: `way/${e.id}`, tags: e.tags, set: e.set, ptsLL: pts });
  }
  log(`  ${buildings.length} candidate buildings (${rels.length} relations, ${report.unstitchableRelations} unstitchable, ${dupCells} cross-cell dups)`);

  /* ---- step 1: project ---- */
  for (const b of buildings) {
    b.pts = b.ptsLL.map((p) => toGame(p.lat, p.lon));
    b.centroid = polygonCentroid(b.pts);
    b.ptsLL = undefined;
  }

  /* ---- step 2: coverage clip (towers exempt) ---- */
  let kept = [];
  for (const b of buildings) {
    if (b.set === 'detail' && !inCoverage(b.centroid.x, b.centroid.z)) { report.coverageClipped++; continue; }
    kept.push(b);
  }
  log(`step 2: coverage clip -> ${kept.length} (clipped ${report.coverageClipped})`);

  /* ---- step 4 (before 3 for exactness): OBB; then step 3 exclusions on OBBs ---- */
  const rec = reconcileLandmarks();
  const dioramaRByKey = {};
  const KEY_BY_LM_ID = { 3: 'radio_kaikan', 4: 'shibuya109', 7: 'tokyo_station', 8: 'diet', 6: 'dome', 2: 'kaminarimon' };
  for (const ld of LANDMARKS) { const k = KEY_BY_LM_ID[ld.landmarkId]; if (k) dioramaRByKey[k] = ld.dioramaR; }
  const exclusions = buildExclusions({ rec, dioramaRByKey, shopRect: SHOP.interior });
  /* Ground-occluding RECT exclusions also clip road/rail ribbons (step 11a)
   * — the shop interior and the curated 中央通り strip must keep a clean
   * floor. Landmark CIRCLES stay road-permissive on purpose: real streets
   * passing 雷門/東京駅 etc. look right and never occlude the opening. */
  const roadExclusionRects = exclusions.filter((e) => e.kind === 'rect');

  let totalArea = 0, decompArea = 0;
  const survivors = [];
  for (const b of kept) {
    const obb = minAreaOBB(b.pts);
    if (!obb || obb.w < 1e-6 || obb.d < 1e-6) continue;
    const polyA = Math.abs(polygonArea(b.pts));
    const obbA = obb.w * obb.d;
    totalArea += obbA;
    if (polyA / obbA < 0.65 && obbA > 80) decompArea += obbA; // measured-only (COMPOSITE cut from v1)
    b.obb = obb;
    let excluded = false;
    for (const ex of exclusions) {
      if (obbIntersectsExclusion(obb, ex)) { excluded = true; break; }
    }
    if (excluded) { report.exclusionDropped++; continue; }
    survivors.push(b);
  }
  report.wouldDecomposeAreaFrac = totalArea > 0 ? decompArea / totalArea : 0;
  kept = survivors;
  log(`step 3/4: OBB + exclusions -> ${kept.length} (excluded ${report.exclusionDropped}; would-decompose area ${(report.wouldDecomposeAreaFrac * 100).toFixed(1)}%)`);

  /* ---- step 5: height + tower threshold ---- */
  const districtOf = (b) => {
    const { x, z } = b.obb ? { x: b.obb.cx, z: b.obb.cz } : b.centroid;
    if (inRect(x, z, { x0: -120, x1: 60, z0: 300, z1: 480 })) return 'marunouchi';
    if (x * x + z * z < 250 * 250) return 'akihabara';
    if (inRect(x, z, bboxRect(SHIBUYA_BBOX))) return 'shibuya';
    if (inRect(x, z, bboxRect(ASAKUSA_BBOX))) return 'asakusa_shitamachi';
    return 'other';
  };
  const bboxRectCache = new Map();
  function bboxRect(bb) {
    if (!bboxRectCache.has(bb)) {
      const nw = toGame(bb.n, bb.w), se = toGame(bb.s, bb.e);
      bboxRectCache.set(bb, { x0: nw.x, x1: se.x, z0: nw.z, z1: se.z });
    }
    return bboxRectCache.get(bb);
  }
  const next = [];
  for (const b of kept) {
    const tagH = parseNum(b.tags.height);
    const levels = parseNum(b.tags['building:levels']);
    let hReal, defaulted = false;
    if (tagH > 0) hReal = tagH;
    else if (levels > 0) hReal = levels * 3.2;
    else { defaulted = true; hReal = NaN; }
    // provisional class for default height (class is height-dependent; use 9 m provisional)
    let cls = typeClassOf(b.tags, defaulted ? 9 : hReal, b.id);
    if (defaulted) {
      hReal = H_DEFAULT[cls] ?? H_DEFAULT.generic;
      cls = typeClassOf(b.tags, hReal, b.id); // re-resolve with the defaulted height
    }
    const isTower = hReal >= 50 || levels >= 13;
    if (b.set === 'tower') {
      if (!isTower) {
        if (inCoverage(b.centroid.x, b.centroid.z)) { b.set = 'detail'; report.towerFolded++; }
        else { report.towerDroppedOutside++; continue; }
      } else cls = towerClassOf(cls);
    }
    b.hReal = hReal; b.cls = cls; b.defaulted = defaulted;
    const d = districtOf(b);
    const hd = (report.heightDefaultedByDistrict[d] ??= { total: 0, defaulted: 0 });
    hd.total++; if (defaulted) hd.defaulted++;
    next.push(b);
  }
  kept = next;
  log(`step 5: height + tower threshold -> ${kept.length} (folded ${report.towerFolded}, dropped-outside ${report.towerDroppedOutside})`);

  /* ---- step 6: quantize (the voxel law) ---- */
  const quantize = (b) => {
    const qh = b.set === 'tower' ? Q_H_TOWER : Q_H;
    b.q = {
      cx: Math.round(b.obb.cx / Q_CENTER) * Q_CENTER,
      cz: Math.round(b.obb.cz / Q_CENTER) * Q_CENTER,
      w: Math.max(Q_WD, Math.round(b.obb.w / Q_WD) * Q_WD),
      d: Math.max(Q_WD, Math.round(b.obb.d / Q_WD) * Q_WD),
      h: Math.max(qh, Math.round((b.hReal * OSM_HEIGHT_K) / qh) * qh),
      yaw: Math.round(b.obb.yaw / Q_YAW) * Q_YAW,
    };
  };
  for (const b of kept) quantize(b);

  /* ---- step 7: MERGE small same-class neighbors (before thin/band) ---- */
  const hash = new Map(); // 8 m cell -> indices
  const cellKey = (x, z) => `${Math.floor(x / 8)},${Math.floor(z / 8)}`;
  kept.sort((a, b) => a.id - b.id);
  kept.forEach((b, i) => {
    const k = cellKey(b.q.cx, b.q.cz);
    if (!hash.has(k)) hash.set(k, []);
    hash.get(k).push(i);
  });
  const dead = new Uint8Array(kept.length);
  const edgeOf = (b, e) => { // edge e of quantized OBB: [pointA, pointB]
    const cs = obbCorners({ cx: b.q.cx, cz: b.q.cz, w: b.q.w, d: b.q.d, yaw: b.q.yaw });
    return [cs[e], cs[(e + 1) % 4]];
  };
  const edgeShared = (A, B) => {
    for (let i = 0; i < 4; i++) {
      const [a1, a2] = edgeOf(A, i);
      const angA = Math.atan2(a2.z - a1.z, a2.x - a1.x);
      for (let j = 0; j < 4; j++) {
        const [b1, b2] = edgeOf(B, j);
        const angB = Math.atan2(b2.z - b1.z, b2.x - b1.x);
        let dAng = Math.abs(angA - angB) % Math.PI;
        if (dAng > Math.PI / 2) dAng = Math.PI - dAng;
        if (dAng > MERGE_ANGLE) continue;
        // perpendicular distance between the two edge lines (use midpoint of B)
        const mx = (b1.x + b2.x) / 2, mz = (b1.z + b2.z) / 2;
        const nx = -(a2.z - a1.z), nz = a2.x - a1.x;
        const nl = Math.hypot(nx, nz) || 1;
        const dist = Math.abs(((mx - a1.x) * nx + (mz - a1.z) * nz) / nl);
        if (dist > MERGE_GAP) continue;
        // overlap along edge A direction
        const dx = (a2.x - a1.x), dz = (a2.z - a1.z);
        const len = Math.hypot(dx, dz) || 1;
        const ux = dx / len, uz = dz / len;
        const pr = (p) => (p.x - a1.x) * ux + (p.z - a1.z) * uz;
        const aLo = 0, aHi = len;
        const b1p = pr(b1), b2p = pr(b2);
        const bLo = Math.min(b1p, b2p), bHi = Math.max(b1p, b2p);
        const ov = Math.min(aHi, bHi) - Math.max(aLo, bLo);
        const minLen = Math.min(len, bHi - bLo);
        if (ov >= MERGE_EDGE_FRAC * minLen && minLen > 0) return true;
      }
    }
    return false;
  };
  let mergedCount = 0;
  for (let pass = 0; pass < 4; pass++) {
    let any = false;
    for (let i = 0; i < kept.length; i++) {
      const A = kept[i];
      if (dead[i] || A.set === 'tower' || A.q.w >= MERGE_MAX_WD || A.q.d >= MERGE_MAX_WD) continue;
      const ci = Math.floor(A.q.cx / 8), cj = Math.floor(A.q.cz / 8);
      for (let oi = -1; oi <= 1 && !dead[i]; oi++) {
        for (let oj = -1; oj <= 1 && !dead[i]; oj++) {
          for (const j of hash.get(`${ci + oi},${cj + oj}`) || []) {
            if (j <= i || dead[j]) continue;
            const B = kept[j];
            if (B.set === 'tower' || B.q.w >= MERGE_MAX_WD || B.q.d >= MERGE_MAX_WD) continue;
            if (A.cls !== B.cls) continue;
            if (!edgeShared(A, B)) continue;
            // merge B into A
            const corners = obbCorners({ cx: A.q.cx, cz: A.q.cz, w: A.q.w, d: A.q.d, yaw: A.q.yaw })
              .concat(obbCorners({ cx: B.q.cx, cz: B.q.cz, w: B.q.w, d: B.q.d, yaw: B.q.yaw }));
            const obb = minAreaOBB(corners);
            const aA = A.q.w * A.q.d, aB = B.q.w * B.q.d;
            const hGame = (A.q.h * aA + B.q.h * aB) / (aA + aB);
            A.obb = obb;
            A.hReal = hGame / OSM_HEIGHT_K;
            A.cls = 'osm_merged_block';
            A.mergedFlag = true;
            A.id = Math.min(A.id, B.id);
            quantize(A);
            dead[j] = 1;
            mergedCount++;
            any = true;
            const k = cellKey(A.q.cx, A.q.cz);
            if (!hash.has(k)) hash.set(k, []);
            hash.get(k).push(i);
            if (A.q.w >= MERGE_MAX_WD || A.q.d >= MERGE_MAX_WD) break;
          }
        }
      }
    }
    if (!any) break;
  }
  kept = kept.filter((_, i) => !dead[i]);
  report.merged = mergedCount;
  log(`step 7: merge -> ${kept.length} (${mergedCount} merges)`);

  /* ---- step 8: clearance bake ---- */
  // corridors: all fetched road classes inside coverage (major + residential)
  const roadFiles = loadRaw(['roads', 'roadsres']);
  const corridorSegs = []; // {ax,az,bx,bz,half}
  const roadWaysShipped = new Map(); // for step 11 (dedupe by id)
  for (const { elements } of roadFiles) {
    for (const el of elements) {
      if (el.type !== 'way' || !el.geometry || el.geometry.length < 2) continue;
      const hw = el.tags?.highway, rw = el.tags?.railway;
      let clsName = null;
      if (hw && CLEARANCE_WIDTH_REAL[hw] !== undefined) clsName = hw;
      else if (rw === 'rail' || rw === 'subway') clsName = 'rail';
      if (!clsName) continue;
      if (!roadWaysShipped.has(el.id)) roadWaysShipped.set(el.id, { id: el.id, tags: el.tags, geometry: el.geometry, clsName });
      if (clsName === 'rail') continue; // rail is not a navigability corridor
      const widthGame = (CLEARANCE_WIDTH_REAL[clsName] * OSM_HORIZ_K);
      const half = widthGame / 2 + CLEARANCE_GAME_M;
      const pts = el.geometry.map((p) => toGame(p.lat, p.lon));
      for (let i = 0; i + 1 < pts.length; i++) {
        const a = pts[i], b = pts[i + 1];
        // corridors only matter inside/near coverage
        if (!inCoverage(a.x, a.z) && !inCoverage(b.x, b.z) && !inCoverage((a.x + b.x) / 2, (a.z + b.z) / 2)) continue;
        corridorSegs.push({ ax: a.x, az: a.z, bx: b.x, bz: b.z, half });
      }
    }
  }
  // segment spatial hash (16 m cells)
  const segHash = new Map();
  const SEG_CELL = 16;
  corridorSegs.forEach((s, i) => {
    const x0 = Math.min(s.ax, s.bx) - s.half, x1 = Math.max(s.ax, s.bx) + s.half;
    const z0 = Math.min(s.az, s.bz) - s.half, z1 = Math.max(s.az, s.bz) + s.half;
    for (let cx = Math.floor(x0 / SEG_CELL); cx <= Math.floor(x1 / SEG_CELL); cx++) {
      for (let cz = Math.floor(z0 / SEG_CELL); cz <= Math.floor(z1 / SEG_CELL); cz++) {
        const k = `${cx},${cz}`;
        if (!segHash.has(k)) segHash.set(k, []);
        segHash.get(k).push(i);
      }
    }
  });
  /** Max penetration of corridor seg into OBB along OBB local axes.
   *  Returns null or {axis:'w'|'d', amount} (game m). */
  const segObbPenetration = (b, s) => {
    const c = Math.cos(-b.q.yaw), sn = Math.sin(-b.q.yaw);
    const loc = (x, z) => ({ x: (x - b.q.cx) * c - (z - b.q.cz) * sn, z: (x - b.q.cx) * sn + (z - b.q.cz) * c });
    const A = loc(s.ax, s.az), B = loc(s.bx, s.bz);
    const hw = b.q.w / 2, hd = b.q.d / 2;
    // closest point between segment AB and box [-hw,hw]x[-hd,hd] (sampled)
    let minD = Infinity, bestT = 0;
    const N = 8;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const px = A.x + (B.x - A.x) * t, pz = A.z + (B.z - A.z) * t;
      const dx = Math.max(Math.abs(px) - hw, 0), dz = Math.max(Math.abs(pz) - hd, 0);
      const d = Math.hypot(dx, dz);
      if (d < minD) { minD = d; bestT = t; }
    }
    if (minD >= s.half) return null;
    const px = A.x + (B.x - A.x) * bestT, pz = A.z + (B.z - A.z) * bestT;
    // intrusion depth per axis: how much the box face must move inward
    const needX = s.half - (Math.abs(px) - hw); // >0 -> shrink w by needX (if |px|>hw it's lateral)
    const needZ = s.half - (Math.abs(pz) - hd);
    // choose the axis with the smaller required inset
    const insetX = Math.max(0, Math.min(needX, s.half + hw));
    const insetZ = Math.max(0, Math.min(needZ, s.half + hd));
    return insetX <= insetZ ? { axis: 'w', amount: insetX, side: Math.sign(px) || 1 } : { axis: 'd', amount: insetZ, side: Math.sign(pz) || 1 };
  };
  const next8 = [];
  for (const b of kept) {
    if (!inCoverage(b.q.cx, b.q.cz)) { next8.push(b); continue; } // corridors only defined inside coverage
    const w0 = b.q.w, d0 = b.q.d;
    let insetW = 0, insetD = 0, touched = false, dropped = false;
    for (let iter = 0; iter < 4; iter++) {
      let worst = null;
      const ci = Math.floor(b.q.cx / SEG_CELL), cj = Math.floor(b.q.cz / SEG_CELL);
      const reach = Math.ceil((Math.max(b.q.w, b.q.d) / 2 + 8) / SEG_CELL);
      const seen = new Set();
      for (let oi = -reach; oi <= reach; oi++) {
        for (let oj = -reach; oj <= reach; oj++) {
          for (const si of segHash.get(`${ci + oi},${cj + oj}`) || []) {
            if (seen.has(si)) continue;
            seen.add(si);
            const pen = segObbPenetration(b, corridorSegs[si]);
            if (pen && pen.amount > 1e-4 && (!worst || pen.amount > worst.amount)) worst = pen;
          }
        }
      }
      if (!worst) break;
      touched = true;
      // inset the intruding face toward the centroid (center shifts by half the inset)
      const cs = Math.cos(b.q.yaw), ss = Math.sin(b.q.yaw);
      if (worst.axis === 'w') {
        const maxIn = INSET_MAX_FRAC * w0 - insetW;
        const amt = Math.min(worst.amount, maxIn);
        if (amt <= 1e-4) { dropped = true; break; }
        insetW += amt;
        b.q.w -= amt;
        b.q.cx -= worst.side * (amt / 2) * cs;
        b.q.cz -= worst.side * (amt / 2) * ss;
      } else {
        const maxIn = INSET_MAX_FRAC * d0 - insetD;
        const amt = Math.min(worst.amount, maxIn);
        if (amt <= 1e-4) { dropped = true; break; }
        insetD += amt;
        b.q.d -= amt;
        b.q.cx -= worst.side * (amt / 2) * -ss;
        b.q.cz -= worst.side * (amt / 2) * cs;
      }
      // re-quantize to the voxel law
      b.q.w = Math.max(Q_WD, Math.floor(b.q.w / Q_WD) * Q_WD);
      b.q.d = Math.max(Q_WD, Math.floor(b.q.d / Q_WD) * Q_WD);
      b.q.cx = Math.round(b.q.cx / Q_CENTER) * Q_CENTER;
      b.q.cz = Math.round(b.q.cz / Q_CENTER) * Q_CENTER;
      if (iter === 3) {
        // final check: still intersecting?
        const ci2 = Math.floor(b.q.cx / SEG_CELL), cj2 = Math.floor(b.q.cz / SEG_CELL);
        let still = false;
        outer: for (let oi = -reach; oi <= reach; oi++) {
          for (let oj = -reach; oj <= reach; oj++) {
            for (const si of segHash.get(`${ci2 + oi},${cj2 + oj}`) || []) {
              const pen = segObbPenetration(b, corridorSegs[si]);
              if (pen && pen.amount > 1e-3) { still = true; break outer; }
            }
          }
        }
        if (still) dropped = true;
      }
    }
    if (!dropped && (b.q.w < MIN_WD_AFTER_INSET || b.q.d < MIN_WD_AFTER_INSET)) dropped = true;
    if (dropped) { report.clearanceDropped++; continue; }
    if (touched) report.clearanceInset++;
    next8.push(b);
  }
  kept = next8;
  log(`step 8: clearance bake -> ${kept.length} (inset ${report.clearanceInset}, dropped ${report.clearanceDropped})`);

  /* ---- step 9: band + thin ---- */
  const bandOf = (rEff) => {
    if (rEff < BAND_EDGES[0]) return -1;
    if (rEff < BAND_EDGES[1]) return 2;
    if (rEff < BAND_EDGES[2]) return 3;
    if (rEff < BAND_EDGES[3]) return 4;
    return 5;
  };
  const next9 = [];
  for (const b of kept) {
    const rEff = 0.5 * Math.sqrt(b.q.w ** 2 + b.q.d ** 2 + b.q.h ** 2);
    b.band = bandOf(rEff);
    b.rEff = rEff;
    if (b.band < 0) { report.droppedSmall++; continue; }
    // shard/band consistency: outer-shard TOWER records must be band >= 4
    // (osmPools large-pool membership = bands 4/5); a levels>=13 but short
    // candidate folds into the detail shard inside coverage, else drops.
    if (b.set === 'tower' && b.band < 4) {
      if (inCoverage(b.q.cx, b.q.cz)) {
        b.set = 'detail'; report.towerFolded++;
        b.q.h = Math.max(Q_H, Math.round(b.q.h / Q_H) * Q_H); // re-quantize to the detail h law
        b.rEff = 0.5 * Math.sqrt(b.q.w ** 2 + b.q.d ** 2 + b.q.h ** 2);
        b.band = bandOf(b.rEff);
        if (b.band < 0) { report.droppedSmall++; continue; }
      } else { report.towerDroppedOutside++; continue; }
    }
    if (mulberry32(Number(b.id) | 0)() >= KEEP_K[b.band]) { report.thinned++; continue; }
    next9.push(b);
  }
  kept = next9;
  log(`step 9: band+thin -> ${kept.length} (dropped<1.2 ${report.droppedSmall}, thinned ${report.thinned})`);

  /* ---- step 9.5: FINAL RE-CLIP (merge + clearance insets move centers/OBBs
   * AFTER the step-2/3 checks ran — re-assert coverage, MAP_BOUNDS and
   * exclusion invariants on the final quantized OBBs so verify's
   * zero-violation gates hold by construction) ---- */
  const next95 = [];
  for (const b of kept) {
    if (b.set === 'detail' && !inCoverage(b.q.cx, b.q.cz)) { report.coverageClipped++; continue; }
    if (b.q.cx < MAP_BOUNDS_GAME.x[0] || b.q.cx > MAP_BOUNDS_GAME.x[1] ||
        b.q.cz < MAP_BOUNDS_GAME.z[0] || b.q.cz > MAP_BOUNDS_GAME.z[1]) { report.coverageClipped++; continue; }
    const obbQ = { cx: b.q.cx, cz: b.q.cz, w: b.q.w, d: b.q.d, yaw: b.q.yaw };
    let excluded = false;
    for (const ex of exclusions) {
      if (obbIntersectsExclusion(obbQ, ex)) { excluded = true; break; }
    }
    if (excluded) { report.exclusionDropped++; continue; }
    next95.push(b);
  }
  kept = next95;
  log(`step 9.5: final re-clip -> ${kept.length}`);

  /* ---- step 10: type -> code + tint ---- */
  for (const b of kept) {
    b.code = CODE_BY_ID[b.mergedFlag ? 'osm_merged_block' : b.cls];
    b.tint = Math.floor(mulberry32((Number(b.id) ^ 0x51ab) | 0)() * 256) & 0xff;
  }

  /* ---- step 11a: roads (shipped) ---- */
  log('step 11: roads + polys');
  const shippedRoads = [];
  for (const way of [...roadWaysShipped.values()].sort((a, b) => a.id - b.id)) {
    const cn = way.clsName;
    let cls;
    if (cn === 'rail') cls = ROAD_CLASS.rail;
    else if (ROAD_CLASS[cn] !== undefined) cls = ROAD_CLASS[cn];
    else continue; // residential/unclassified: clearance-only, never shipped
    let pts = way.geometry.map((p) => toGame(p.lat, p.lon));
    const isMinor = cls === ROAD_CLASS.secondary || cls === ROAD_CLASS.tertiary;
    if (isMinor) {
      // secondary|tertiary shipped ONLY inside detail coverage: split runs
      let run = [];
      const runs = [];
      for (let i = 0; i < pts.length; i++) {
        if (inCoverage(pts[i].x, pts[i].z)) run.push(pts[i]);
        else { if (run.length >= 2) runs.push(run); run = []; }
      }
      if (run.length >= 2) runs.push(run);
      for (const r of runs) shippedRoads.push({ id: way.id, cls, pts: r });
    } else {
      shippedRoads.push({ id: way.id, cls, pts });
    }
  }
  // DP simplify (eps by coverage), split to ground tiles, then to <=31 pts
  const roadSections = new Map(); // tileKey -> records[]
  let roadRecordCount = 0;
  for (const r of shippedRoads) {
    const mid = r.pts[Math.floor(r.pts.length / 2)];
    const eps = inCoverage(mid.x, mid.z) ? DP_EPS_IN : DP_EPS_OUT;
    const simplified = dpSimplify(r.pts, eps);
    if (simplified.length < 2) continue;
    // v4 hotfix: clip the rendered ribbon out of the ground-occluding
    // exclusion rects (shop interior / curated strip) BEFORE tiling.
    // +0.25 game m safety: the bin quantizes verts to 0.1 m tile-local, so a
    // kept endpoint exactly on the inflated boundary can round back inside.
    const clipHalfW = (ROAD_WIDTH_REAL[r.cls] * OSM_HORIZ_K) / 2 + 0.25;
    const pieces = clipPolylineOutsideRects(simplified, clipHalfW, roadExclusionRects);
    for (const pts of pieces) {
    // split at ground-tile boundaries
    const sections = [];
    let cur = [pts[0]];
    const tileOf = (p) => `${Math.floor(p.x / GROUND_TILE)},${Math.floor(p.z / GROUND_TILE)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      // subdivide the segment at every tile boundary crossing
      const crossings = [];
      for (const [getC, tile] of [[(p) => p.x, GROUND_TILE], [(p) => p.z, GROUND_TILE]]) {
        const ca = getC(a), cb = getC(b);
        const lo = Math.min(ca, cb), hi = Math.max(ca, cb);
        for (let g = Math.ceil(lo / tile) * tile; g < hi; g += tile) {
          if (g === lo) continue;
          crossings.push((g - ca) / (cb - ca));
        }
      }
      crossings.sort((x, y) => x - y);
      let prev = a;
      for (const t of crossings) {
        if (t <= 1e-9 || t >= 1 - 1e-9) continue;
        const p = { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
        cur.push(p);
        if (tileOf({ x: (prev.x + p.x) / 2, z: (prev.z + p.z) / 2 }) !== tileOf({ x: (p.x + b.x) / 2, z: (p.z + b.z) / 2 })) {
          sections.push(cur);
          cur = [p];
        }
        prev = p;
      }
      cur.push(b);
      prev = b;
    }
    if (cur.length >= 2) sections.push(cur);
    for (let sec of sections) {
      while (sec.length > ROAD_MAX_PTS) {
        const head = sec.slice(0, ROAD_MAX_PTS);
        roadPush(head);
        sec = sec.slice(ROAD_MAX_PTS - 1);
      }
      if (sec.length >= 2) roadPush(sec);
    }
    } // end pieces loop (exclusion-clipped sub-polylines)
    function roadPush(secPts) {
      const midp = { x: (secPts[0].x + secPts[secPts.length - 1].x) / 2, z: (secPts[0].z + secPts[secPts.length - 1].z) / 2 };
      const tx = Math.floor(midp.x / GROUND_TILE), tz = Math.floor(midp.z / GROUND_TILE);
      const k = `${tx},${tz}`;
      if (!roadSections.has(k)) roadSections.set(k, []);
      roadSections.get(k).push({ cls: r.cls, widthGame: ROAD_WIDTH_REAL[r.cls] * OSM_HORIZ_K, pts: secPts, tx, tz });
      roadRecordCount++;
    }
  }

  /* ---- step 11b: water + park polys ---- */
  const polyTiles = new Map(); // tileKey -> records[]
  let polyCount = 0, polyMaxN = 0;
  const polyNHist = {};
  let unstitchableWater = 0;
  const pushPoly = (ringGame, kindId, layer) => {
    // DP first, then tile clip, then earcut per clipped piece
    let ring = dpSimplify([...ringGame, ringGame[0]], DP_EPS_IN);
    ring.pop();
    if (ring.length < 3) return;
    const xs = ring.map((p) => p.x), zs = ring.map((p) => p.z);
    const tx0 = Math.floor(Math.min(...xs) / GROUND_TILE), tx1 = Math.floor(Math.max(...xs) / GROUND_TILE);
    const tz0 = Math.floor(Math.min(...zs) / GROUND_TILE), tz1 = Math.floor(Math.max(...zs) / GROUND_TILE);
    for (let tx = tx0; tx <= tx1; tx++) {
      for (let tz = tz0; tz <= tz1; tz++) {
        const clipped = clipPolyToRect(ring, tx * GROUND_TILE, tz * GROUND_TILE, (tx + 1) * GROUND_TILE, (tz + 1) * GROUND_TILE);
        if (clipped.length < 3 || Math.abs(polygonArea(clipped)) < 1) continue; // <1 game m^2 sliver
        // quantize verts to 0.1 m + drop consecutive dups
        const verts = [];
        for (const p of clipped) {
          const q = { x: Math.round(p.x * 10) / 10, z: Math.round(p.z * 10) / 10 };
          const last = verts[verts.length - 1];
          if (!last || last.x !== q.x || last.z !== q.z) verts.push(q);
        }
        while (verts.length > 1 && verts[0].x === verts[verts.length - 1].x && verts[0].z === verts[verts.length - 1].z) verts.pop();
        if (verts.length < 3) continue;
        const tris = earcut(verts);
        if (!tris.length) continue;
        if (verts.length > 65535 || tris.length > 65535) { console.warn('  POLY u16 overflow — dropped'); continue; }
        const k = `${tx},${tz}`;
        if (!polyTiles.has(k)) polyTiles.set(k, []);
        polyTiles.get(k).push({ kind: kindId | (layer << 4), verts, tris, tx, tz });
        polyCount++;
        polyMaxN = Math.max(polyMaxN, verts.length);
        const bucket = verts.length <= 8 ? '<=8' : verts.length <= 16 ? '<=16' : verts.length <= 32 ? '<=32' : verts.length <= 64 ? '<=64' : verts.length <= 128 ? '<=128' : verts.length <= 255 ? '<=255' : '>255';
        polyNHist[bucket] = (polyNHist[bucket] || 0) + 1;
      }
    }
  };
  const polySets = [
    { prefixes: ['water'], kindId: 1, layer: 0, minRealM2: WATER_MIN_REAL_M2 },
    { prefixes: ['parks'], kindId: 2, layer: 1, minRealM2: PARK_MIN_REAL_M2 },
  ];
  for (const { prefixes, kindId, layer, minRealM2 } of polySets) {
    const seen = new Set();
    const files = loadRaw(prefixes);
    const consumedPolyWays = new Set();
    const ringsOut = []; // collect, relations first
    for (const pass of ['relation', 'way']) {
      for (const { elements } of files) {
        for (const el of elements) {
          if (el.type !== pass) continue;
          const k = `${el.type}/${el.id}`;
          if (seen.has(k)) continue;
          seen.add(k);
          if (el.type === 'relation') {
            const st = stitchOuterRings(el);
            if (!st) { unstitchableWater++; continue; }
            for (const ref of st.consumed) consumedPolyWays.add(ref);
            for (const ring of st.rings) ringsOut.push({ id: el.id, ring });
          } else {
            if (consumedPolyWays.has(el.id)) continue;
            const g = el.geometry || [];
            if (g.length < 4) continue;
            const pts = [...g];
            if (pts[0].lat === pts[pts.length - 1].lat && pts[0].lon === pts[pts.length - 1].lon) pts.pop();
            else continue; // unclosed standalone way -> not a polygon
            if (pts.length < 3) continue;
            ringsOut.push({ id: el.id, ring: pts });
          }
        }
      }
    }
    ringsOut.sort((a, b) => a.id - b.id);
    for (const { ring } of ringsOut) {
      const game = ring.map((p) => toGame(p.lat, p.lon));
      const realArea = Math.abs(polygonArea(game)) / (OSM_HORIZ_K * OSM_HORIZ_K);
      if (realArea < minRealM2) continue;
      pushPoly(game, kindId, layer);
    }
  }
  log(`  roads: ${roadRecordCount} records in ${roadSections.size} tiles; polys: ${polyCount} in ${polyTiles.size} tiles (max n ${polyMaxN}; unstitchable water/park rels ${unstitchableWater})`);

  /* ---- step 12: emit ---- */
  // detail/tower tiling
  const detailTiles = new Map(), towerTiles = new Map();
  for (const b of kept) {
    const isTower = b.set === 'tower';
    const tile = isTower ? TOWER_TILE : DETAIL_TILE;
    const tx = Math.floor(b.q.cx / tile), tz = Math.floor(b.q.cz / tile);
    const m = isTower ? towerTiles : detailTiles;
    const k = `${tx},${tz}`;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(b);
  }
  // band-sort within tile (then id for determinism)
  for (const m of [detailTiles, towerTiles]) {
    for (const list of m.values()) list.sort((a, b) => a.band - b.band || a.id - b.id);
  }
  const sortedTileKeys = (m) => [...m.keys()].sort((a, b) => {
    const [ax, az] = a.split(',').map(Number), [bx, bz] = b.split(',').map(Number);
    return ax - bx || az - bz;
  });

  /** Section-based shard writer. */
  function buildShard(sections) {
    const headerLen = 16, secLen = 16;
    let offset = headerLen + sections.length * secLen;
    const chunks = [];
    const secEntries = [];
    for (const s of sections) {
      secEntries.push({ ...s, byteOffset: offset, byteLen: s.payload.length });
      chunks.push(s.payload);
      offset += s.payload.length;
    }
    const buf = Buffer.alloc(offset);
    buf.write('FKT4', 0, 'ascii');
    buf.writeUInt16LE(1, 4); // version
    buf.writeUInt16LE(sections.length, 6);
    buf.writeUInt32LE(0, 8); // flags
    buf.writeUInt32LE(0, 12); // reserved
    let p = headerLen;
    for (const s of secEntries) {
      buf.writeUInt8(s.type, p);
      buf.writeUInt8(0, p + 1);
      buf.writeInt16LE(s.tileX, p + 2);
      buf.writeInt16LE(s.tileZ, p + 4);
      buf.writeUInt16LE(s.count, p + 6);
      buf.writeUInt32LE(s.byteOffset, p + 8);
      buf.writeUInt32LE(s.byteLen, p + 12);
      p += secLen;
    }
    for (const s of secEntries) s.payload.copy(buf, s.byteOffset);
    return buf;
  }

  // --- core.bin: detail sections ---
  const clampLog = { wd: 0, h: 0 };
  const coreSections = [];
  const shippedIds = [];
  for (const k of sortedTileKeys(detailTiles)) {
    const list = detailTiles.get(k);
    const [tx, tz] = k.split(',').map(Number);
    const payload = Buffer.alloc(list.length * 10);
    list.forEach((b, i) => {
      const o = i * 10;
      const lx = (b.q.cx - tx * DETAIL_TILE) / Q_CENTER, lz = (b.q.cz - tz * DETAIL_TILE) / Q_CENTER;
      payload.writeUInt16LE(Math.max(0, Math.min(65535, Math.round(lx))), o);
      payload.writeUInt16LE(Math.max(0, Math.min(65535, Math.round(lz))), o + 2);
      let wq = Math.round(b.q.w / Q_WD), dq = Math.round(b.q.d / Q_WD), hq = Math.round(b.q.h / Q_H);
      if (wq > 255 || dq > 255) { clampLog.wd++; wq = Math.min(wq, 255); dq = Math.min(dq, 255); }
      if (hq > 255) { clampLog.h++; hq = 255; }
      payload.writeUInt8(wq, o + 4);
      payload.writeUInt8(dq, o + 5);
      payload.writeUInt8(hq, o + 6);
      payload.writeUInt8(Math.round(b.q.yaw / Q_YAW) & 0xff, o + 7);
      payload.writeUInt8(((b.code - CODE_BASE) & 0x1f) | (b.mergedFlag ? 0x20 : 0), o + 8);
      payload.writeUInt8(b.tint, o + 9);
      shippedIds.push(b.srcKey);
    });
    coreSections.push({ type: 1, tileX: tx, tileZ: tz, count: list.length, payload });
  }
  const coreBuf = buildShard(coreSections);

  // --- outer.bin: tower + road + poly sections ---
  const outerSections = [];
  for (const k of sortedTileKeys(towerTiles)) {
    const list = towerTiles.get(k);
    const [tx, tz] = k.split(',').map(Number);
    const payload = Buffer.alloc(list.length * 12);
    list.forEach((b, i) => {
      const o = i * 12;
      const lx = (b.q.cx - tx * TOWER_TILE) / Q_CENTER, lz = (b.q.cz - tz * TOWER_TILE) / Q_CENTER;
      payload.writeUInt16LE(Math.max(0, Math.min(65535, Math.round(lx))), o);
      payload.writeUInt16LE(Math.max(0, Math.min(65535, Math.round(lz))), o + 2);
      let wq = Math.round(b.q.w / Q_WD), dq = Math.round(b.q.d / Q_WD);
      if (wq > 255 || dq > 255) { clampLog.wd++; wq = Math.min(wq, 255); dq = Math.min(dq, 255); }
      payload.writeUInt8(wq, o + 4);
      payload.writeUInt8(dq, o + 5);
      payload.writeUInt16LE(Math.min(65535, Math.round(b.q.h / Q_H_TOWER)), o + 6);
      payload.writeUInt8(Math.round(b.q.yaw / Q_YAW) & 0xff, o + 8);
      payload.writeUInt8(((b.code - CODE_BASE) & 0x1f) | (b.mergedFlag ? 0x20 : 0), o + 9);
      payload.writeUInt8(b.tint, o + 10);
      payload.writeUInt8(0, o + 11);
      shippedIds.push(b.srcKey);
    });
    outerSections.push({ type: 2, tileX: tx, tileZ: tz, count: list.length, payload });
  }
  for (const k of [...roadSections.keys()].sort((a, b) => {
    const [ax, az] = a.split(',').map(Number), [bx, bz] = b.split(',').map(Number);
    return ax - bx || az - bz;
  })) {
    const list = roadSections.get(k);
    list.sort((a, b) => a.cls - b.cls || a.pts[0].x - b.pts[0].x || a.pts[0].z - b.pts[0].z);
    const [tx, tz] = k.split(',').map(Number);
    const bufs = [];
    for (const rsec of list) {
      const n = rsec.pts.length;
      const head = Buffer.alloc(8);
      head.writeUInt8((rsec.cls & 0x7) | ((n & 0x1f) << 3), 0);
      head.writeUInt8(Math.min(255, Math.round(rsec.widthGame / 0.25)), 1);
      head.writeUInt16LE(0, 2);
      const fx = Math.round((rsec.pts[0].x - tx * GROUND_TILE) / 0.1);
      const fz = Math.round((rsec.pts[0].z - tz * GROUND_TILE) / 0.1);
      head.writeUInt16LE(Math.max(0, Math.min(65535, fx)), 4);
      head.writeUInt16LE(Math.max(0, Math.min(65535, fz)), 6);
      const rest = Buffer.alloc(4 * (n - 1));
      let px = rsec.pts[0].x, pz = rsec.pts[0].z;
      for (let i = 1; i < n; i++) {
        const dx = Math.round((rsec.pts[i].x - px) / 0.1), dz = Math.round((rsec.pts[i].z - pz) / 0.1);
        rest.writeInt16LE(Math.max(-32768, Math.min(32767, dx)), (i - 1) * 4);
        rest.writeInt16LE(Math.max(-32768, Math.min(32767, dz)), (i - 1) * 4 + 2);
        px += dx * 0.1; pz += dz * 0.1;
      }
      bufs.push(head, rest);
    }
    outerSections.push({ type: 3, tileX: tx, tileZ: tz, count: list.length, payload: Buffer.concat(bufs) });
  }
  for (const k of [...polyTiles.keys()].sort((a, b) => {
    const [ax, az] = a.split(',').map(Number), [bx, bz] = b.split(',').map(Number);
    return ax - bx || az - bz;
  })) {
    const list = polyTiles.get(k);
    list.sort((a, b) => a.kind - b.kind || a.verts[0].x - b.verts[0].x || a.verts[0].z - b.verts[0].z);
    const [tx, tz] = k.split(',').map(Number);
    const bufs = [];
    for (const poly of list) {
      const n = poly.verts.length, t = poly.tris.length;
      const head = Buffer.alloc(6);
      head.writeUInt8(poly.kind, 0);
      head.writeUInt8(0, 1);
      head.writeUInt16LE(n, 2);
      head.writeUInt16LE(t, 4);
      const vbuf = Buffer.alloc(4 * n);
      const fx = Math.round((poly.verts[0].x - tx * GROUND_TILE) / 0.1);
      const fz = Math.round((poly.verts[0].z - tz * GROUND_TILE) / 0.1);
      vbuf.writeUInt16LE(Math.max(0, Math.min(65535, fx)), 0);
      vbuf.writeUInt16LE(Math.max(0, Math.min(65535, fz)), 2);
      let px = poly.verts[0].x, pz = poly.verts[0].z;
      for (let i = 1; i < n; i++) {
        const dx = Math.round((poly.verts[i].x - px) / 0.1), dz = Math.round((poly.verts[i].z - pz) / 0.1);
        vbuf.writeInt16LE(Math.max(-32768, Math.min(32767, dx)), i * 4);
        vbuf.writeInt16LE(Math.max(-32768, Math.min(32767, dz)), i * 4 + 2);
        px += dx * 0.1; pz += dz * 0.1;
      }
      const tbuf = Buffer.alloc(2 * t);
      poly.tris.forEach((ti, i) => tbuf.writeUInt16LE(ti, i * 2));
      bufs.push(head, vbuf, tbuf);
    }
    outerSections.push({ type: 4, tileX: tx, tileZ: tz, count: list.length, payload: Buffer.concat(bufs) });
  }
  const outerBuf = buildShard(outerSections);

  /* ---- manifest ---- */
  const bandHistogram = [0, 0, 0, 0, 0, 0];
  const bandStats = {};
  for (const b of kept) {
    bandHistogram[b.band]++;
    const s = (bandStats[`band${b.band}`] ??= { count: 0, sumR3: 0, sumR: 0 });
    s.count++; s.sumR3 += b.rEff ** 3; s.sumR += b.rEff;
  }
  for (const s of Object.values(bandStats)) {
    s.meanREff = Math.round((s.sumR / s.count) * 1000) / 1000;
    s.sumR3 = Math.round(s.sumR3 * 10) / 10;
    delete s.sumR;
  }
  const meta = existsSync(join(RAW_DIR, 'fetch-meta.json'))
    ? JSON.parse(readFileSync(join(RAW_DIR, 'fetch-meta.json'), 'utf8'))
    : { extractionDate: 'UNKNOWN — run osm:fetch' };
  const coreGz = gzipSync(coreBuf, { level: 9 }), outerGz = gzipSync(outerBuf, { level: 9 });
  const manifest = {
    version: 1,
    shardGzBytes: { core: coreGz.length, outer: outerGz.length },
    perBandCounts: Object.fromEntries([2, 3, 4, 5].map((b) => [`band${b}`, bandHistogram[b]])),
    bandHistogram,
    bandStats, // supply/r^3 input for scripts/pacing-model.mjs (additive field)
    coverageAreaGameM2: coverageAreaGameM2(), // derived by grid integration over geo.inCoverage
    tileIndexSummary: {
      detailTiles: detailTiles.size, towerTiles: towerTiles.size,
      roadTiles: roadSections.size, polyTiles: polyTiles.size,
      roadRecords: roadRecordCount, polyRecords: polyCount,
      maxDetailPerTile: Math.max(0, ...[...detailTiles.values()].map((l) => l.length)),
      maxPolyN: polyMaxN, polyNHist,
    },
    extractionDate: meta.extractionDate,
    attribution: '© OpenStreetMap contributors',
    license: 'ODbL',
    licenseUrl: 'https://opendatacommons.org/licenses/odbl/',
  };
  writeFileSync(join(OUT, 'tokyo-v4-core.bin'), coreBuf);
  writeFileSync(join(OUT, 'tokyo-v4-outer.bin'), outerBuf);
  writeFileSync(join(OUT, 'tokyo-v4-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  // build report (verify inputs: shipped source ids, drop stats, district histogram)
  report.shippedIds = shippedIds;
  report.clampedWD = clampLog.wd + clampLog.h;
  writeFileSync(join(RAW_DIR, 'build-report.json'), JSON.stringify(report, null, 2));

  log(`step 12: emit -> ${OUT}`);
  log(`  core.bin ${(coreBuf.length / 1024).toFixed(0)} KB raw / ${(coreGz.length / 1024).toFixed(0)} KB gz; outer.bin ${(outerBuf.length / 1024).toFixed(0)} KB raw / ${(outerGz.length / 1024).toFixed(0)} KB gz`);
  log(`  band histogram: ${bandHistogram.join(',')} (sum ${kept.length})`);
  log(`  clamps: ${JSON.stringify(clampLog)}`);
  log(`  height-defaulted by district: ${JSON.stringify(report.heightDefaultedByDistrict)}`);
  if (!QUIET) console.log('\n' + reconciliationTableText(rec));
  log(`convert done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main();
