/**
 * @file geometryFactory.js — Builds all 99 merged vertex-colored composite
 * archetype geometries from catalog recipes ONCE at boot (~80ms during the
 * title screen).
 *
 * NORMALIZATION CONTRACT (binding for spawner / instances / ball):
 * every geometry returned by buildAllGeometries() is recentered and uniformly
 * scaled so its bounding sphere is EXACTLY center=(0,0,0), radius=1.0.
 * Therefore an object with bounding radius `r` sim units renders as:
 *   instance scale  = r
 *   instance pos.y  = r * (1 + archetype.yOffset)   // yOffset 0 = sphere sits on ground
 * This decouples catalog modeling units from spawn scaling entirely.
 *
 * TRI CAPS: ARCHETYPE_TRI_CAP (350) default; entries carrying
 * `heroTriCap` (the 12 frozen HERO_ARCHETYPE_IDS, = HERO_TRI_CAP 600) are
 * asserted per id.
 *
 * BAKED VERTEX AO (bakeSimpleAO, boot-time only, zero runtime cost):
 * applied to EVERY archetype after normalization with k = entry.aoK ??
 * AO_BAKE_DEFAULT (tuning.js). GLOBAL KILL SWITCH: AO_BAKE_DEFAULT = 0
 * (a per-entry aoK: 0 kills one entry). Separable change.
 *
 * Each recipe gets a DETERMINISTIC PRNG seeded from (GEOMETRY_SEED, id, tier)
 * so geometry detail jitter is identical across boots and machines (the
 * per-instance size/yaw/palette jitter is the spawner's job, not ours).
 *
 * Boot-time allocation is fine here; nothing in this file runs per frame.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { mulberry32, hash } from '../core/rng.js';
import { ARCHETYPE_TRI_CAP, HERO_TRI_CAP, AO_BAKE_DEFAULT } from '../config/tuning.js';

/** @typedef {import('../types.js').Archetype} Archetype */

/** Vite dev-build flag (false / undefined in prod and plain node). */
const DEV = !!(import.meta.env && import.meta.env.DEV);

/** Domain seed for deterministic per-archetype geometry rngs ('GEO\0'). */
const GEOMETRY_SEED = 0x47454f00;

/**
 * FNV-1a 32-bit string hash (id -> uint32) for per-archetype rng seeding.
 * @param {string} str
 * @returns {number} uint32
 */
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x01000193);
  }
  return h >>> 0;
}

/**
 * Triangle count of a BufferGeometry (indexed or not).
 * @param {THREE.BufferGeometry} geometry
 * @returns {number}
 */
export function triangleCount(geometry) {
  const index = geometry.getIndex();
  if (index !== null) return index.count / 3;
  const pos = geometry.getAttribute('position');
  return pos !== undefined ? pos.count / 3 : 0;
}

/**
 * Bake a flat vertex color over an entire geometry ('color' attribute,
 * 3 floats/vertex). Overwrites any existing color attribute.
 * Catalog recipes use this to tint each primitive part before merging.
 * @param {THREE.BufferGeometry} geometry Mutated in place.
 * @param {number} hex Color, e.g. 0xff8844.
 * @returns {THREE.BufferGeometry} The same geometry (chainable).
 */
export function bakeVertexColors(geometry, hex) {
  const c = new THREE.Color(hex);
  const count = geometry.getAttribute('position').count;
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geometry;
}

/**
 * Convenience for catalog recipes: tint each part then merge into one
 * composite via BufferGeometryUtils.mergeGeometries. Part geometries are
 * consumed (disposed) — the merged copy owns the data.
 * @param {Array<{ geometry: THREE.BufferGeometry, color: number }>} parts
 *   Each part is pre-transformed (translate/rotate/scale already applied).
 * @returns {THREE.BufferGeometry} Merged vertex-colored composite.
 */
export function mergeColoredParts(parts) {
  const geos = [];
  for (let i = 0; i < parts.length; i++) {
    const g = parts[i].geometry;
    bakeVertexColors(g, parts[i].color);
    geos.push(g);
  }
  const merged = mergeGeometries(geos, false);
  if (merged === null) {
    throw new Error('[geometryFactory] mergeGeometries failed (mismatched attributes across parts)');
  }
  for (let i = 0; i < geos.length; i++) geos[i].dispose();
  return merged;
}

/**
 * Recenter + uniformly rescale a geometry so boundingSphere = {center: origin,
 * radius: 1}. Bakes the transform into positions (normals are unaffected by
 * uniform scale + translation). Recomputes bounding volumes.
 * @param {THREE.BufferGeometry} geometry Mutated in place.
 * @returns {THREE.BufferGeometry} The same geometry.
 */
export function normalizeToUnitRadius(geometry) {
  geometry.computeBoundingSphere();
  const bs = geometry.boundingSphere;
  if (bs !== null && bs.radius > 1e-8) {
    geometry.translate(-bs.center.x, -bs.center.y, -bs.center.z);
    const inv = 1 / bs.radius;
    geometry.scale(inv, inv, inv);
  }
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  return geometry;
}

/**
 * v4: bake a cheap vertex-color ambient-occlusion pass into a geometry
 * (docs/DESIGN-V4.md モデル品質パス technique 1 — boot-time only, zero
 * runtime cost, independent kill switch AO_BAKE_DEFAULT = 0):
 *   - VERTICAL OCCLUSION GRADIENT: every vertex color is multiplied by
 *     (1 - k * e^(-(y - minY) / h)) with h = max(span, eps)/3 — feet/bases
 *     darken toward (1-k), tops stay ~unchanged;
 *   - UNDERSIDE FACES: vertices whose normal points down (ny < -0.5) get an
 *     extra -25% value (eaves, chins, chassis read as occluded).
 * Multiplies INTO the existing 'color' attribute (call after colors exist).
 * No-op when k <= 0 (the kill switch) or the geometry has no color attribute.
 * @param {THREE.BufferGeometry} geo Mutated in place.
 * @param {number} k01 AO strength 0..1 (typically AO_BAKE_DEFAULT 0.3).
 * @returns {THREE.BufferGeometry} The same geometry (chainable).
 */
export function bakeSimpleAO(geo, k01) {
  if (!(k01 > 0)) return geo;
  const color = geo.getAttribute('color');
  if (color === undefined) return geo;
  const pos = geo.getAttribute('position');
  const normal = geo.getAttribute('normal');
  geo.computeBoundingBox();
  const minY = geo.boundingBox.min.y;
  const span = Math.max(1e-6, geo.boundingBox.max.y - minY);
  const hFall = span / 3; // gradient falloff length (bottom third carries it)
  const n = pos.count;
  for (let i = 0; i < n; i++) {
    let f = 1 - k01 * Math.exp(-(pos.getY(i) - minY) / hFall);
    if (normal !== undefined && normal.getY(i) < -0.5) f *= 0.75; // underside -25%
    color.setXYZ(i, color.getX(i) * f, color.getY(i) * f, color.getZ(i) * f);
  }
  color.needsUpdate = true;
  return geo;
}

/**
 * Build every archetype geometry from the catalog, once, at boot.
 *
 * Pipeline per archetype: buildGeometry(deterministic rng) -> ensure normals
 * -> ensure 'color' attribute (white fallback + dev warn) -> normalize to
 * unit bounding sphere -> bake vertex AO (aoK ?? AO_BAKE_DEFAULT)
 * -> dev tri-cap assert (350 / heroTriCap 600).
 *
 * @param {Record<string, Archetype>} catalog The 99-entry CATALOG.
 * @returns {Record<string, THREE.BufferGeometry>} id -> normalized geometry.
 */
export function buildAllGeometries(catalog) {
  /** @type {Record<string, THREE.BufferGeometry>} */
  const out = Object.create(null);
  const ids = Object.keys(catalog);
  let totalTris = 0;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const arch = catalog[id];
    const rng = mulberry32(hash(GEOMETRY_SEED, fnv1a(id) | 0, 0, arch.tier));
    const geometry = arch.buildGeometry(rng);

    if (geometry.getAttribute('normal') === undefined) {
      geometry.computeVertexNormals();
    }
    if (geometry.getAttribute('color') === undefined) {
      if (DEV) console.warn(`[geometryFactory] '${id}' has no vertex colors — baking white fallback`);
      bakeVertexColors(geometry, 0xffffff);
    }

    normalizeToUnitRadius(geometry);

    // Baked vertex AO (boot-time; kill switch AO_BAKE_DEFAULT = 0,
    // per-entry override via aoK).
    bakeSimpleAO(geometry, arch.aoK !== undefined ? arch.aoK : AO_BAKE_DEFAULT);

    const tris = triangleCount(geometry);
    totalTris += tris;
    if (DEV) {
      let cap = ARCHETYPE_TRI_CAP;
      if (arch.heroTriCap !== undefined) {
        if (arch.heroTriCap > HERO_TRI_CAP) {
          throw new Error(
            `[geometryFactory] '${id}' heroTriCap ${arch.heroTriCap} > HERO_TRI_CAP (${HERO_TRI_CAP})`
          );
        }
        cap = arch.heroTriCap;
      }
      if (tris > cap) {
        throw new Error(
          `[geometryFactory] '${id}' has ${tris} tris > cap ${cap} ` +
            `(${arch.heroTriCap !== undefined ? 'heroTriCap' : 'ARCHETYPE_TRI_CAP'})`
        );
      }
    }

    out[id] = geometry;
  }

  if (DEV) {
    console.log(`[geometryFactory] built ${ids.length} archetype geometries, ${totalTris} tris total`);
  }
  return out;
}

/**
 * Dispose every geometry in a buildAllGeometries() result (game teardown / tests).
 * @param {Record<string, THREE.BufferGeometry>} geometries
 */
export function disposeGeometries(geometries) {
  for (const id in geometries) geometries[id].dispose();
}
