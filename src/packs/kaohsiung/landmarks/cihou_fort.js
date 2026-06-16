/**
 * @file packs/kaohsiung/landmarks/cihou_fort.js — Roll Formosa Kaohsiung pack.
 *
 * 旗后炮台 (Cihou Fort, 旗津 Qijin, 高雄). A curated hero geometry: a squat
 * SQUARE red-brick coastal battery from the 1875 self-strengthening era. Thick
 * crenellated rampart walls (紅磚城牆) ring a slightly sunken parade ground, with
 * the famous 「威震天南」 八字門 entrance — a pair of splayed brick gate piers
 * forming the character 八 (eight) — set into the seaward wall. Inside, fat
 * round gun emplacements (炮位) sit on raised brick mounts, their stubby black
 * iron muzzles poking over the parapet toward the strait.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so this is authored in unit-ish space with correct
 * PROPORTIONS (a low broad fortified square — NOT a tower). The integration step
 * owns the size-ladder; dioramaRHint is the real-world footprint hint.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Cihou Fort coastal battery materials (紅磚 red brick + iron).
const BRICK = 0xb05a44; // 紅磚 warm red-brick rampart wall (signature color)
const BRICK_D = 0x8a4233; // shadow side / weathered lower courses of the brick
const MERLON = 0xc06a52; // sunlit crenellation merlon caps (a touch lighter)
const GROUND = 0x9c8f74; // packed-earth parade ground inside the fort
const MOUNT = 0x9a4a3a; // raised brick gun-emplacement mount (deeper brick)
const IRON = 0x2b2b2e; // black cast-iron cannon barrel
const IRON_H = 0x46464c; // top highlight on the iron barrel
const STONE = 0xbdb29a; // pale stone gate lintel / coping

// Square cross-sections come from cyl(seg=4) rotated PI/8 so the flat faces read
// square-on; round gun mounts use seg=8.
const SQ = HALF_PI / 4; // PI/8 — orient a 4-seg cylinder flat-face-forward

/**
 * Author one crenellated rampart wall segment along the X axis into `out`: a
 * long low brick wall topped by a row of square merlons (the gaps between are
 * the crenels the cannon fire through).
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx     wall center x
 * @param {number} cz     wall center z
 * @param {number} len    wall length (along x)
 * @param {number} thick  wall thickness (along z)
 * @param {number} baseY  height of the platform top the wall springs from
 * @param {number} nMerl  number of merlon teeth along the run
 */
function rampart(out, cx, cz, len, thick, baseY, nMerl) {
  const wallH = 0.34;
  // Solid brick wall body (紅磚城牆) — dark weathered base graduating up.
  out.push(box(len, wallH, thick, BRICK, { x: cx, y: baseY + wallH / 2, z: cz, hex2: BRICK_D }));
  // Crenellation merlons sitting on the wall crown, evenly spaced with gaps.
  const merlW = (len / nMerl) * 0.55;
  for (let i = 0; i < nMerl; i++) {
    const t = (i + 0.5) / nMerl - 0.5; // -0.5..0.5
    out.push(
      box(merlW, 0.12, thick * 0.96, MERLON, {
        x: cx + t * len,
        y: baseY + wallH + 0.06,
        z: cz,
        hex2: BRICK,
      })
    );
  }
}

/**
 * Author one gun emplacement (炮位) into `out`: a round raised brick mount with
 * a stubby black iron cannon barrel angled up over the parapet.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx    emplacement center x
 * @param {number} cz    emplacement center z
 * @param {number} baseY parade-ground top height
 * @param {number} face  +1 barrel points +z, -1 points -z
 */
function gunPit(out, cx, cz, baseY, face) {
  // Raised circular brick mount the cannon pivots on.
  out.push(cyl(0.18, 0.2, 0.16, 6, MOUNT, { x: cx, y: baseY + 0.08, z: cz, hex2: BRICK_D }));
  // Iron cannon barrel — a tapered tube laid almost flat, tipped up toward sea.
  out.push(
    cyl(0.045, 0.06, 0.34, 6, IRON, {
      rx: face * (HALF_PI - 0.35),
      x: cx,
      y: baseY + 0.2,
      z: cz + face * 0.12,
      hex2: IRON_H,
    })
  );
  // Cascabel knob at the breech end of the barrel.
  out.push(box(0.08, 0.08, 0.08, IRON, { x: cx, y: baseY + 0.17, z: cz - face * 0.04 }));
}

export const NM_CIHOU_FORT = {
  id: 'cihou_fort',
  name: '旗后炮台',
  landmarkId: 0,
  dioramaRHint: 50, // ~ Cihou Fort square footprint radius in metres
  colorHex: 0xb05a44, // the fort's signature warm red-brick wall
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on a gun mount
    const parts = [];

    const half = 1.0; // half-extent of the square fort footprint
    const wallT = 0.18; // rampart wall thickness
    const baseY = 0.1; // top of the foundation plinth

    // ---- Earth foundation plinth + sunken parade ground -------------------
    parts.push(box(2.2, 0.1, 2.2, BRICK_D, { y: 0.05, hex2: STONE })); // brick foundation slab
    parts.push(box(1.5, 0.06, 1.5, GROUND, { y: baseY + 0.03 })); // packed-earth parade ground inside

    // ---- Square crenellated brick ramparts on all four sides --------------
    // Side walls (run along z) — built as x-runs then rotated into place.
    rampart(parts, 0, half, 2.0, wallT, baseY, 5); // landward (back, +z) full wall
    parts.push(box(wallT, 0.34, 2.0, BRICK, { x: half, y: baseY + 0.17, hex2: BRICK_D })); // east wall body
    parts.push(box(wallT, 0.34, 2.0, BRICK, { x: -half, y: baseY + 0.17, hex2: BRICK_D })); // west wall body
    // Merlons along the two side walls.
    for (let i = 0; i < 5; i++) {
      const t = (i + 0.5) / 5 - 0.5;
      parts.push(box(wallT * 0.96, 0.12, 0.16, MERLON, { x: half, y: baseY + 0.4, z: t * 2.0, hex2: BRICK }));
      parts.push(box(wallT * 0.96, 0.12, 0.16, MERLON, { x: -half, y: baseY + 0.4, z: t * 2.0, hex2: BRICK }));
    }

    // ---- Seaward wall with the 八字門 splayed-pier entrance (front, -z) ----
    // Two short wall stubs flanking a central gap.
    parts.push(box(0.7, 0.34, wallT, BRICK, { x: -0.65, y: baseY + 0.17, z: -half, hex2: BRICK_D }));
    parts.push(box(0.7, 0.34, wallT, BRICK, { x: 0.65, y: baseY + 0.17, z: -half, hex2: BRICK_D }));
    // The 八字 splayed gate piers — two angled brick blocks forming 「八」.
    parts.push(box(0.16, 0.44, 0.5, BRICK, { ry: 0.4, x: -0.32, y: baseY + 0.22, z: -half + 0.1, hex2: BRICK_D }));
    parts.push(box(0.16, 0.44, 0.5, BRICK, { ry: -0.4, x: 0.32, y: baseY + 0.22, z: -half + 0.1, hex2: BRICK_D }));
    // Pale stone lintel bridging the gate piers (the 「威震天南」 plaque band).
    parts.push(box(0.6, 0.1, 0.14, STONE, { y: baseY + 0.45, z: -half + 0.02 }));

    // ---- Corner bastion piers thickening the four corners -----------------
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(cyl(0.16, 0.18, 0.42, 4, BRICK, { ry: SQ, x: sx * half, y: baseY + 0.21, z: sz * half, hex2: BRICK_D }));
      }
    }

    // ---- Gun emplacements (炮位) on the parade ground, facing the strait ---
    gunPit(parts, -0.45, -0.45 + r, baseY + 0.06, -1); // west gun facing sea
    gunPit(parts, 0.45, -0.45, baseY + 0.06, -1); // east gun facing sea
    gunPit(parts, 0.0, 0.45, baseY + 0.06, 1); // rear gun facing landward

    // ---- Flagstaff in the parade ground centre ----------------------------
    parts.push(cyl(0.012, 0.012, 0.5, 4, STONE, { y: baseY + 0.28 })); // flag pole
    parts.push(cone(0.03, 0.06, 4, BRICK, { y: baseY + 0.55 })); // pole finial

    return finish(parts);
  },
};

export default NM_CIHOU_FORT;
