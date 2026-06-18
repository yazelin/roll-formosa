/**
 * @file packs/taichung/collectibles/tetrapod.js — Roll Formosa Taichung pack, COLLECTIBLE.
 *
 * COL_TETRAPOD — 消波塊 (tetrapod / 四腳錐). The grey cast-concrete armour block
 * stacked in their thousands along Taiwan's wave-battered coastlines. Form: four
 * IDENTICAL stubby tapered legs splaying out from a fused central hub toward the
 * vertices of a regular tetrahedron — three legs angling down-and-out as a tripod
 * base, one pointing straight up — each leg flaring to a blunt foot. Bare,
 * weathered grey concrete. The iconic Taiwanese seawall block.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the geometry
 * math is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (chunky legs, fat fused core, splayed
 * tetrahedral stance) carry the read — never absolute size. All four legs share a
 * central hub sphere so the block is one connected solid, never floating pieces.
 * ~144 triangles. rng() only nudges the concrete tint, never structure.
 */

import { cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// ---- weathered concrete palette --------------------------------------------
const CONCRETE = 0x9a9a92; // body grey
const CONCRETE_HI = 0xb2b2a8; // sun-bleached top (vertical gradient)
const CORE = 0x8c8c84; // slightly darker fused hub

// ---- tetrahedral geometry ---------------------------------------------------
// Four leg directions toward the vertices of a regular tetrahedron: one up,
// three forming a tripod 120° apart. The default cone points its apex at +Y, so
// to splay a leg outward along `dir` (wide foot out, narrow apex into the hub)
// we rotate the apex to point INWARD (toward -dir) then push the cone out.
const APEX_POLAR = PI - Math.acos(-1 / 3); // 70.53° — apex-from-+Y for a down leg
const FZ = Math.sqrt(8) / 3; // 0.9428  front-leg +Z reach (down-leg horizontal span)
const RX = Math.sqrt(2 / 3); // 0.8165  rear-leg ±X reach
const RZ = Math.sqrt(2) / 3; // 0.4714  rear-leg -Z reach
// All four `dir` vectors are UNIT length and exactly 109.47° apart (regular
// tetrahedron). dir = outward foot direction; rx/ry orient the cone apex to
// -dir so the wide foot points out and the narrow apex sinks into the hub.
const LEGS = [
  { dir: [0, 1, 0], rx: PI, ry: 0 }, // straight up
  { dir: [0, -1 / 3, FZ], rx: APEX_POLAR, ry: PI }, // front, down-out
  { dir: [RX, -1 / 3, -RZ], rx: APEX_POLAR, ry: -PI / 3 }, // rear-right, down-out
  { dir: [-RX, -1 / 3, -RZ], rx: APEX_POLAR, ry: PI / 3 }, // rear-left, down-out
];

export const COL_TETRAPOD = {
  id: 'tetrapod',
  name: '消波塊',
  collectibleId: 11,
  colorHex: CONCRETE,

  /**
   * Build the tetrapod geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny concrete tint nudge only, never structure.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const tint = Math.floor(rng() * 0x030303); // faint per-instance weathering nudge
    const body = CONCRETE - tint;

    const parts = [];

    // ---- Fused central HUB --------------------------------------------------
    // A chunky core where all four legs meet — guarantees one connected solid.
    parts.push(sph(0.48, CORE, { ws: 6, hs: 4 })); // (48)

    // ---- Four identical splayed LEGS ---------------------------------------
    const LEG_LEN = 1.38; // leg length (cone height)
    const LEG_R = 0.46; // foot (base) radius — fat, blunt concrete limb
    const OVERLAP = 0.22; // how far the narrow apex buries into the hub
    const cDist = LEG_LEN / 2 - OVERLAP; // cone-center distance from origin
    const fDist = LEG_LEN - OVERLAP; // outer foot-cap distance from origin

    for (const L of LEGS) {
      const [dx, dy, dz] = L.dir;
      // Tapered limb: wide blunt foot outward, narrow apex sunk into the hub.
      parts.push(
        cone(LEG_R, LEG_LEN, 6, body, {
          rx: L.rx,
          ry: L.ry,
          x: dx * cDist,
          y: dy * cDist,
          z: dz * cDist,
          hex2: CONCRETE_HI,
        }),
      ); // (12 each)

      // Blunt flared FOOT cap — short reversed cone closing the limb's wide end
      // (apex points back outward), giving the characteristic stubby pad. It
      // overlaps the limb's base so it stays fused to the leg.
      parts.push(
        cone(LEG_R * 1.04, 0.34, 6, body, {
          rx: L.rx + PI, // flip so the cap's wide rim meets the limb base
          ry: L.ry,
          x: dx * fDist,
          y: dy * fDist,
          z: dz * fDist,
          hex2: CONCRETE_HI,
        }),
      ); // (12 each)
    }

    return finish(parts);
  },
};

export default COL_TETRAPOD;
