/**
 * @file packs/hsinchu/collectibles/train_model.js — Roll Formosa Hsinchu pack, COLLECTIBLE.
 *
 * COL_TRAIN — 蒸汽火車模型 (Steam Train Model). Commemorating Hsinchu's historic
 * railway station and the Neiwan Line. Silhouette: a cute miniature steam
 * locomotive with boiler, smokestack, and wheels - the nostalgic old Taiwan
 * railway icon.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1). <= 350 triangles. rng() only nudges color tint.
 */

import { box, cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BODY = 0x2a2a2a;        // dark locomotive body
const BOILER = 0x1a1a1a;      // black boiler
const RED = 0xb03030;         // red accent
const BRASS = 0xc0a040;       // brass fittings
const WHEEL = 0x3a3a3a;       // wheel dark
const STEAM = 0xe8e8e8;       // steam white

export const COL_TRAIN = {
  id: 'steam_train_model',
  name: '蒸汽火車模型',
  collectibleId: 6,
  colorHex: BODY,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202);
    const body = BODY + t;
    const parts = [];

    // --- WHEEL base frame ---
    parts.push(box(1.6, 0.1, 0.5, body, { y: 0.15, hex2: 0x3a3a3a }));

    // --- WHEELS (3 pairs) ---
    // front wheel
    parts.push(cyl(0.18, 0.18, 0.08, 8, WHEEL, { x: -0.5, y: 0.18, z: 0.3, rx: HALF_PI }));
    parts.push(cyl(0.18, 0.18, 0.08, 8, WHEEL, { x: -0.5, y: 0.18, z: -0.3, rx: HALF_PI }));
    // middle wheel (larger drive wheel)
    parts.push(cyl(0.22, 0.22, 0.1, 8, RED, { x: 0.1, y: 0.22, z: 0.32, rx: HALF_PI, hex2: 0xd04040 }));
    parts.push(cyl(0.22, 0.22, 0.1, 8, RED, { x: 0.1, y: 0.22, z: -0.32, rx: HALF_PI, hex2: 0xd04040 }));
    // rear wheel
    parts.push(cyl(0.2, 0.2, 0.08, 8, WHEEL, { x: 0.55, y: 0.2, z: 0.3, rx: HALF_PI }));
    parts.push(cyl(0.2, 0.2, 0.08, 8, WHEEL, { x: 0.55, y: 0.2, z: -0.3, rx: HALF_PI }));

    // --- BOILER (horizontal cylinder) ---
    parts.push(cyl(0.28, 0.28, 0.9, 10, BOILER, { x: -0.15, y: 0.52, rz: HALF_PI, hex2: 0x2a2a2a }));
    // boiler front dome
    parts.push(sph(0.28, BOILER, { ws: 6, hs: 4, x: -0.6, y: 0.52, hex2: 0x2a2a2a }));
    // boiler bands
    parts.push(cyl(0.3, 0.3, 0.04, 8, BRASS, { x: -0.3, y: 0.52, rz: HALF_PI }));
    parts.push(cyl(0.3, 0.3, 0.04, 8, BRASS, { x: 0.1, y: 0.52, rz: HALF_PI }));

    // --- SMOKESTACK ---
    parts.push(cyl(0.1, 0.14, 0.28, 6, BOILER, { x: -0.4, y: 0.92, hex2: 0x2a2a2a }));
    parts.push(cyl(0.16, 0.1, 0.06, 6, BRASS, { x: -0.4, y: 1.08 }));

    // --- STEAM DOME (on top of boiler) ---
    parts.push(cyl(0.1, 0.12, 0.12, 6, BRASS, { x: 0.05, y: 0.86 }));
    parts.push(sph(0.1, BRASS, { ws: 5, hs: 3, x: 0.05, y: 0.94 }));

    // --- CAB (engineer's compartment) ---
    parts.push(box(0.4, 0.4, 0.44, body, { x: 0.6, y: 0.52, hex2: 0x3a3a3a }));
    // cab roof
    parts.push(box(0.45, 0.06, 0.5, body, { x: 0.6, y: 0.76 }));
    // cab windows (cutouts represented as lighter panels)
    parts.push(box(0.02, 0.15, 0.2, 0x6080a0, { x: 0.42, y: 0.52, hex2: 0x80a0c0 }));

    // --- COW CATCHER (front) ---
    parts.push(box(0.08, 0.12, 0.35, RED, { x: -0.84, y: 0.12, hex2: 0xd04040 }));

    // --- HEADLIGHT ---
    parts.push(cyl(0.06, 0.06, 0.04, 5, BRASS, { x: -0.72, y: 0.72, hex2: 0xffee88 }));

    return finish(parts);
  },
};

export default COL_TRAIN;
