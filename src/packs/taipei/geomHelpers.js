/**
 * @file geomHelpers.js — Taipei pack geometry vocabulary.
 *
 * VERBATIM copy of the Fable engine's boot-time geometry helpers
 * (reference src/config/catalog.js lines 77–273): the primitive builders
 * box/cyl/cone/sph/ico/torus/towerBanded, the paint/xf vertex-color bakers,
 * and finish() (merge → recenter → normalize to a UNIT bounding sphere of
 * radius 1.0). The geometry MATH is an engine red line (spec §9) — we only
 * author content with it, never change it. `finishUnitBox` is intentionally
 * NOT copied (OSM-only; no chunk archetype uses it).
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const _CA = new THREE.Color();
const _CB = new THREE.Color();
const _CC = new THREE.Color();

export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;

/**
 * Bake a flat (or vertical-gradient) vertex-color attribute onto a geometry.
 * @param {THREE.BufferGeometry} geo Geometry to paint (mutated).
 * @param {number} hex Base color (sRGB hex; converted to linear).
 * @param {number} [hex2] Optional second color — vertical gradient bottom(hex)->top(hex2).
 * @returns {THREE.BufferGeometry} The same geometry.
 */
export function paint(geo, hex, hex2) {
  const pos = geo.getAttribute('position');
  const n = pos.count;
  const arr = new Float32Array(n * 3);
  _CA.setHex(hex);
  if (hex2 !== undefined && hex2 !== hex) {
    geo.computeBoundingBox();
    const minY = geo.boundingBox.min.y;
    const span = Math.max(1e-6, geo.boundingBox.max.y - minY);
    _CB.setHex(hex2);
    for (let i = 0; i < n; i++) {
      const t = (pos.getY(i) - minY) / span;
      _CC.copy(_CA).lerp(_CB, t);
      arr[i * 3] = _CC.r;
      arr[i * 3 + 1] = _CC.g;
      arr[i * 3 + 2] = _CC.b;
    }
  } else {
    for (let i = 0; i < n; i++) {
      arr[i * 3] = _CA.r;
      arr[i * 3 + 1] = _CA.g;
      arr[i * 3 + 2] = _CA.b;
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

/**
 * Transform options for a part.
 * @typedef {Object} XfOpts
 * @property {number} [x] @property {number} [y] @property {number} [z]
 * @property {number} [rx] @property {number} [ry] @property {number} [rz]
 * @property {number} [sx] @property {number} [sy] @property {number} [sz]
 * @property {number} [hex2] Vertical gradient top color.
 */

/**
 * Apply scale -> rotation -> translation, then bake the vertex color.
 * @param {THREE.BufferGeometry} geo @param {number} hex @param {XfOpts} [o]
 * @returns {THREE.BufferGeometry}
 */
export function xf(geo, hex, o) {
  if (o !== undefined) {
    if (o.sx !== undefined || o.sy !== undefined || o.sz !== undefined) {
      geo.scale(o.sx !== undefined ? o.sx : 1, o.sy !== undefined ? o.sy : 1, o.sz !== undefined ? o.sz : 1);
    }
    if (o.rx) geo.rotateX(o.rx);
    if (o.ry) geo.rotateY(o.ry);
    if (o.rz) geo.rotateZ(o.rz);
    if (o.x || o.y || o.z) geo.translate(o.x || 0, o.y || 0, o.z || 0);
  }
  return paint(geo, hex, o !== undefined ? o.hex2 : undefined);
}

/** @param {number} w @param {number} h @param {number} d @param {number} hex @param {XfOpts} [o] */
export function box(w, h, d, hex, o) {
  return xf(new THREE.BoxGeometry(w, h, d), hex, o);
}

/** @param {number} rt @param {number} rb @param {number} h @param {number} seg @param {number} hex @param {XfOpts & {theta0?:number, thetaLen?:number, open?:boolean}} [o] */
export function cyl(rt, rb, h, seg, hex, o) {
  const theta0 = o !== undefined && o.theta0 !== undefined ? o.theta0 : 0;
  const thetaLen = o !== undefined && o.thetaLen !== undefined ? o.thetaLen : PI * 2;
  const open = o !== undefined && o.open === true;
  return xf(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open, theta0, thetaLen), hex, o);
}

/** @param {number} r @param {number} h @param {number} seg @param {number} hex @param {XfOpts} [o] */
export function cone(r, h, seg, hex, o) {
  return xf(new THREE.ConeGeometry(r, h, seg), hex, o);
}

/** @param {number} r @param {number} hex @param {XfOpts & {ws?:number, hs?:number, theta0?:number, thetaLen?:number}} [o] */
export function sph(r, hex, o) {
  const ws = o !== undefined && o.ws !== undefined ? o.ws : 7;
  const hs = o !== undefined && o.hs !== undefined ? o.hs : 5;
  const theta0 = o !== undefined && o.theta0 !== undefined ? o.theta0 : 0;
  const thetaLen = o !== undefined && o.thetaLen !== undefined ? o.thetaLen : PI;
  return xf(new THREE.SphereGeometry(r, ws, hs, 0, PI * 2, theta0, thetaLen), hex, o);
}

/** @param {number} r @param {0|1} detail @param {number} hex @param {XfOpts} [o] */
export function ico(r, detail, hex, o) {
  return xf(new THREE.IcosahedronGeometry(r, detail), hex, o);
}

/** @param {number} r @param {number} tube @param {number} rs @param {number} ts @param {number} hex @param {XfOpts & {arc?:number}} [o] */
export function torus(r, tube, rs, ts, hex, o) {
  const arc = o !== undefined && o.arc !== undefined ? o.arc : PI * 2;
  return xf(new THREE.TorusGeometry(r, tube, rs, ts, arc), hex, o);
}

/**
 * Banded tower: one BoxGeometry with heightSegments=floors and vertex colors
 * alternating wall / window rows; rng lights up random window bands.
 * @param {number} w @param {number} h @param {number} d
 * @param {number} floors Height segments (one band boundary per floor).
 * @param {number} wallHex @param {number} winHex @param {number} litHex
 * @param {() => number} rng Boot rng for lit-window variation.
 * @param {XfOpts} [o]
 * @returns {THREE.BufferGeometry}
 */
export function towerBanded(w, h, d, floors, wallHex, winHex, litHex, rng, o) {
  const geo = new THREE.BoxGeometry(w, h, d, 1, floors, 1);
  const lit = new Array(floors + 1);
  for (let f = 0; f <= floors; f++) lit[f] = rng() < 0.4 ? 0.4 + rng() * 0.6 : 0;
  const pos = geo.getAttribute('position');
  const n = pos.count;
  const arr = new Float32Array(n * 3);
  const wall = new THREE.Color(wallHex);
  const win = new THREE.Color(winHex);
  const litC = new THREE.Color(litHex);
  for (let i = 0; i < n; i++) {
    const t = pos.getY(i) / h + 0.5; // 0 bottom .. 1 top
    const row = Math.max(0, Math.min(floors, Math.round(t * floors)));
    if (row % 2 === 1) {
      _CC.copy(win).lerp(litC, lit[row]);
    } else {
      _CC.copy(wall);
    }
    arr[i * 3] = _CC.r;
    arr[i * 3 + 1] = _CC.g;
    arr[i * 3 + 2] = _CC.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  if (o !== undefined) {
    if (o.rx) geo.rotateX(o.rx);
    if (o.ry) geo.rotateY(o.ry);
    if (o.rz) geo.rotateZ(o.rz);
    if (o.x || o.y || o.z) geo.translate(o.x || 0, o.y || 0, o.z || 0);
  }
  return geo;
}

/**
 * Merge parts, recenter on the bounding-sphere center and normalize to a
 * unit bounding sphere (radius exactly 1.0). Disposes the input parts.
 * @param {THREE.BufferGeometry[]} parts
 * @returns {THREE.BufferGeometry}
 */
export function finish(parts) {
  const flat = new Array(parts.length);
  for (let i = 0; i < parts.length; i++) {
    flat[i] = parts[i].index !== null ? parts[i].toNonIndexed() : parts[i];
  }
  const merged = mergeGeometries(flat, false);
  for (let i = 0; i < parts.length; i++) {
    if (flat[i] !== parts[i]) flat[i].dispose();
    parts[i].dispose();
  }
  merged.computeBoundingSphere();
  const bs = merged.boundingSphere;
  merged.translate(-bs.center.x, -bs.center.y, -bs.center.z);
  const inv = 1 / Math.max(1e-6, bs.radius);
  merged.scale(inv, inv, inv);
  merged.computeBoundingSphere();
  merged.computeBoundingBox();
  return merged;
}
