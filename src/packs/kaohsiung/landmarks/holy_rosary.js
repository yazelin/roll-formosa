/**
 * @file packs/kaohsiung/landmarks/holy_rosary.js — Roll Formosa Kaohsiung pack.
 *
 * 玫瑰聖母聖殿主教座堂 (Holy Rosary Cathedral / Minor Basilica, 前金 Qianjin, 高雄).
 * Taiwan's oldest Catholic church — a pale Gothic Revival 哥德式 stone facade facing
 * the 愛河 (Love River). A curated hero geometry: the symmetric western front with a
 * tall central spired bell tower flanked by two shorter octagonal turrets, a pointed
 * arched portal under a circular ROSE WINDOW (玫瑰窗), and a long nave roof running
 * back behind the facade, topped by a small cross at the spire's tip. 米白石牆 —
 * cream limestone walls with grey slate spires.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (a wide symmetric facade with a dominant central spire over a rose window — NOT a
 * round dome). The integration step owns the size-ladder; dioramaRHint is the
 * real-world footprint hint. <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Gothic limestone cathedral materials (米白石牆 + 灰石尖頂).
const STONE = 0xd8d0c0; // 米白石牆 pale cream limestone facade
const STONE_D = 0xb8b0a0; // shadow side of the cream stone
const SLATE = 0x6f7682; // grey slate spire / turret cap stone
const SLATE_D = 0x565c66; // deeper slate underside
const PORTAL = 0x4a3f33; // dark recessed pointed-arch doorway (the entrance)
const ROSE = 0x6fa6c8; // the circular rose window (玫瑰窗) stained-glass blue
const ROSE_RIM = 0xefe9da; // pale tracery rim framing the rose window
const GOLD = 0xe8c14a; // small gilt cross / finial accents

// Octagon turrets: cyl(seg=8) read as round-ish stone, capped by an 8-sided cone.
const OCT = HALF_PI / 4; // PI/8 — orient octagon flat faces forward

/**
 * Author one flanking corner turret into `out`: a slim octagonal stone shaft with
 * a tall pointed slate spire cap and a tiny gold finial.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx   turret center x
 * @param {number} baseY foot of the turret shaft
 */
function turret(out, cx, baseY) {
  // Octagonal stone shaft.
  out.push(cyl(0.13, 0.14, 0.7, 8, STONE, { ry: OCT, x: cx, y: baseY + 0.35, hex2: STONE_D }));
  // Pointed slate spire cap.
  out.push(cone(0.19, 0.36, 8, SLATE, { ry: OCT, x: cx, y: baseY + 0.7 + 0.18, hex2: SLATE_D }));
  // Tiny gold finial dot at the spire tip.
  out.push(sph(0.035, GOLD, { x: cx, y: baseY + 0.7 + 0.36 + 0.02 }));
}

export const NM_HOLY_ROSARY = {
  id: 'holy_rosary_cathedral',
  name: '玫瑰聖母聖殿主教座堂',
  landmarkId: 0,
  dioramaRHint: 80, // ~ cathedral facade + nave footprint radius in metres
  colorHex: 0xd8d0c0, // the cream Gothic limestone facade
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the cross
    const parts = [];

    // ---- Long nave body running back behind the facade ------------------
    parts.push(box(0.96, 0.66, 1.5, STONE, { y: 0.33, z: -0.45, hex2: STONE_D })); // nave walls
    parts.push(cyl(0.0, 0.62, 1.5, 4, SLATE, { rz: HALF_PI, ry: HALF_PI, x: 0, y: 0.66 + 0.18, z: -0.45, hex2: SLATE_D })); // gabled ridge roof over the nave (long triangular prism)

    // ---- Western front facade wall (the symmetric Gothic face) ----------
    parts.push(box(1.2, 0.92, 0.18, STONE, { y: 0.46, z: 0.33, hex2: STONE_D })); // broad facade slab
    // Stepped gable parapet crowning the facade top.
    parts.push(box(1.2, 0.12, 0.14, STONE, { y: 0.98, z: 0.33, hex2: STONE_D }));

    // ---- Pointed-arch portal (the entrance) under the rose window -------
    parts.push(box(0.26, 0.4, 0.1, PORTAL, { y: 0.22, z: 0.43 })); // recessed doorway shaft
    parts.push(cone(0.18, 0.16, 4, PORTAL, { ry: OCT, y: 0.46, z: 0.43 })); // pointed arch head over the door

    // ---- Circular ROSE WINDOW (玫瑰窗) centered above the portal --------
    parts.push(torus(0.17, 0.035, 6, 12, ROSE_RIM, { y: 0.66, z: 0.42 })); // pale tracery rim
    parts.push(cyl(0.15, 0.15, 0.05, 12, ROSE, { rx: HALF_PI, y: 0.66, z: 0.41 })); // blue stained-glass disc

    // ---- Two flanking corner turrets ------------------------------------
    turret(parts, -0.52, 0.0);
    turret(parts, 0.52, 0.0);

    // ---- Dominant central spired bell tower over the facade -------------
    parts.push(box(0.34, 0.5, 0.34, STONE, { y: 0.98 + 0.25, z: 0.28, hex2: STONE_D })); // square bell-tower stage
    parts.push(cone(0.3, 0.78, 4, SLATE, { ry: OCT, y: 0.98 + 0.5 + 0.39, z: 0.28, hex2: SLATE_D })); // tall central spire

    // ---- Gilt cross crowning the central spire --------------------------
    const crossY = 0.98 + 0.5 + 0.78 + 0.08;
    parts.push(box(0.025, 0.18, 0.025, GOLD, { x: r, y: crossY, z: 0.28 })); // vertical bar
    parts.push(box(0.11, 0.025, 0.025, GOLD, { x: r, y: crossY + 0.03, z: 0.28 })); // horizontal bar

    return finish(parts);
  },
};

export default NM_HOLY_ROSARY;
