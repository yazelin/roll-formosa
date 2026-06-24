/**
 * @file packs/matsu/collectibles/military_helmet.js — Roll Formosa Matsu pack.
 *
 * 鋼盔 (Military Helmet) — code 80. An old military steel helmet, a relic from
 * Matsu's decades as a frontline military outpost during the Cold War era.
 * The islands were heavily fortified, and military artifacts are now part of
 * the local heritage. The classic dome-shaped helmet in olive drab green.
 *
 * <= 350 triangles.
 */

import { sph, cyl, box, finish, PI } from '../geomHelpers.js';

const STEEL = 0x4a5a3a;      // olive drab green
const STEEL_HI = 0x5a6a4a;   // lighter highlight
const RIM = 0x3a4830;        // darker rim
const LINER = 0x3a3530;      // inner liner (dark)
const STRAP = 0x5a4a38;      // leather chin strap

export const COL_MILITARY_HELMET = {
  id: 'military_helmet',
  name: '鋼盔',
  colorHex: 0x4a5a3a,

  /**
   * @param {() => number} rng
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Main dome (slightly flattened sphere)
    parts.push(sph(0.75, STEEL, { ws: 10, hs: 6, sy: 0.7, y: 0.35, thetaLen: PI * 0.55, hex2: STEEL_HI }));

    // Brim/rim (extends outward)
    parts.push(cyl(0.82, 0.78, 0.08, 12, RIM, { y: 0.08, hex2: STEEL }));

    // Inner lip
    parts.push(cyl(0.7, 0.72, 0.06, 10, RIM, { y: 0.1, open: true }));

    // Inner liner visible (darker inside)
    parts.push(sph(0.65, LINER, { ws: 8, hs: 4, sy: 0.5, y: 0.25, thetaLen: PI * 0.5 }));

    // Front ridge/crest (subtle)
    parts.push(sph(0.3, STEEL_HI, { ws: 6, hs: 3, sx: 0.3, sy: 0.15, sz: 1.2, y: 0.5, z: 0.25 }));

    // Chin strap attachment points
    parts.push(box(0.08, 0.12, 0.06, STRAP, { x: -0.55, y: 0.15, z: 0.35 }));
    parts.push(box(0.08, 0.12, 0.06, STRAP, { x: 0.55, y: 0.15, z: 0.35 }));

    // Chin strap hanging down
    parts.push(cyl(0.025, 0.025, 0.35, 4, STRAP, { x: -0.55, y: -0.08, z: 0.38 }));
    parts.push(cyl(0.025, 0.025, 0.35, 4, STRAP, { x: 0.55, y: -0.08, z: 0.38 }));

    // Buckle detail
    parts.push(box(0.06, 0.05, 0.03, 0x888888, { x: -0.55, y: -0.2, z: 0.4 }));

    return finish(parts);
  },
};

export default COL_MILITARY_HELMET;
