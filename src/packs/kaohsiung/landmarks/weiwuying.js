/**
 * @file packs/kaohsiung/landmarks/weiwuying.js — Roll Formosa Kaohsiung pack.
 *
 * 衛武營國家藝術文化中心 (National Kaohsiung Center for the Arts — Weiwuying,
 * 鳳山 Fongshan). A curated hero geometry: ONE enormous free-form white metal
 * canopy (the 樹冠大廳 "banyan crown" roof) — a single sweeping flowing shell —
 * floating low over an open public plaza. Inspiration is the old banyan grove on
 * the former military training ground: the roof dips and rises like a forest
 * canopy, pierced by funnel-like openings (天井) that let daylight onto the
 * 榕樹廣場 below, where slim white columns flare upward like banyan trunks /
 * aerial roots holding the shell aloft. 白色金屬流線 — pale brushed-metal skin,
 * unmistakably a low, wide, organic roof rather than a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct
 * PROPORTIONS (very wide + low flowing roof, NOT a tall building). The integration
 * step owns the size-ladder; dioramaRHint is the real-world footprint hint.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Weiwuying's pale metal skin + open plaza.
const SHELL = 0xe6e6ec; // 白色金屬 brushed-white canopy top
const SHELL_D = 0xc6c6d2; // shaded underside of the flowing shell
const RIB = 0xd2d2dc; // structural seam ribs across the roof
const TRUNK = 0xeaeaf0; // slim white banyan-trunk columns
const PLAZA = 0xb9b3a6; // 榕樹廣場 pale stone paving slab
const PLAZA_D = 0x9c968a; // shadow side of the paving
const WELL = 0x3a4250; // dark recessed funnel openings (天井 light wells)
const GLASS = 0x6f8fa6; // tinted glass of the indoor hall under the canopy
const LEAF = 0x4f7b46; // a few banyan-grove trees on the plaza
const TRNK2 = 0x6b5436; // tree trunks

// Roof is a long shell along X; flat octagon-ish caps read as flowing panels.
const OCT = HALF_PI / 4; // PI/8 — orient flat faces forward

/**
 * Author one flowing white roof "lobe" into `out` — a very flat, wide dome
 * (squashed sphere) reading as a swelling section of the continuous canopy.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx   lobe center x
 * @param {number} cz   lobe center z
 * @param {number} rx   half-width along x
 * @param {number} rz   half-depth along z
 * @param {number} y    top height of this lobe's swell
 */
function roofLobe(out, cx, cz, rx, rz, y) {
  // Squashed half-sphere = a soft swelling panel of the metal canopy.
  out.push(
    sph(1, SHELL, {
      ws: 8,
      hs: 4,
      sx: rx,
      sy: 0.32,
      sz: rz,
      x: cx,
      y,
      z: cz,
      hex2: SHELL_D,
    })
  );
}

/**
 * Author one slim white support column (banyan trunk) flaring up under the roof.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx column x @param {number} cz column z
 * @param {number} topY height the column reaches up to (roof underside)
 */
function trunk(out, cx, cz, topY) {
  // Trunk flares from narrow base to wide top where it fuses into the shell.
  out.push(cyl(0.07, 0.035, topY, 6, TRUNK, { x: cx, y: topY / 2, z: cz, hex2: SHELL_D }));
}

export const NM_WEIWUYING = {
  id: 'weiwuying',
  name: '衛武營國家藝術文化中心',
  landmarkId: 0,
  dioramaRHint: 95, // ~ Weiwuying canopy/plaza footprint radius in metres (huge, low)
  colorHex: 0xe6e6ec, // the signature pale brushed-metal canopy white
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.04; // tiny non-structural jitter on plaza trees
    const parts = [];

    // ---- 榕樹廣場 open plaza paving (very wide + flat) -------------------
    parts.push(box(3.0, 0.1, 2.0, PLAZA, { y: 0.05, hex2: PLAZA_D })); // ground slab

    // ---- Indoor glass concert-hall volumes nestled under the canopy ------
    parts.push(box(0.9, 0.34, 0.7, GLASS, { x: -0.55, y: 0.27, z: -0.1 }));
    parts.push(box(0.8, 0.3, 0.6, GLASS, { x: 0.6, y: 0.25, z: 0.2 }));

    // ---- Slim white banyan-trunk columns holding the shell aloft ---------
    const cols = [
      [-1.05, -0.55],
      [-0.4, 0.55],
      [0.35, -0.55],
      [1.0, 0.45],
      [0.05, 0.0],
      [-0.85, 0.55],
      [0.85, -0.45],
    ];
    for (const [cx, cz] of cols) trunk(parts, cx, cz, 0.62);

    // ---- The enormous flowing white metal canopy (樹冠大廳 banyan crown) --
    // One continuous undulating roof, authored as overlapping flat lobes that
    // dip and rise along the length — the hero silhouette.
    const roofY = 0.66;
    roofLobe(parts, -1.0, 0.0, 0.65, 0.9, roofY - 0.02);
    roofLobe(parts, -0.35, 0.0, 0.6, 1.0, roofY + 0.06);
    roofLobe(parts, 0.35, 0.0, 0.62, 0.95, roofY + 0.02);
    roofLobe(parts, 1.0, 0.0, 0.6, 0.85, roofY - 0.03);

    // A thin continuous skirt eave tying the lobes into one shell edge.
    parts.push(
      cyl(1.5, 1.55, 0.06, 8, RIB, { ry: OCT, sz: 0.62, y: roofY - 0.12, hex2: SHELL_D })
    );

    // ---- Funnel light-wells (天井) punched through the canopy ------------
    for (const [wx, wz] of [
      [-0.55, -0.05],
      [0.2, 0.2],
      [0.75, -0.25],
    ]) {
      out_well(parts, wx, wz, roofY);
    }

    // ---- A few banyan-grove trees scattered on the plaza ----------------
    for (const [tx, tz] of [
      [-1.25, 0.75],
      [1.25, -0.7],
    ]) {
      parts.push(cyl(0.025, 0.04, 0.22, 5, TRNK2, { x: tx + r, y: 0.21, z: tz }));
      parts.push(sph(0.16, LEAF, { ws: 5, hs: 3, x: tx + r, y: 0.38, z: tz }));
    }

    return finish(parts);
  },
};

/**
 * Punch a dark funnel light-well (天井) reading through the canopy top.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} wx @param {number} wz @param {number} roofY
 */
function out_well(out, wx, wz, roofY) {
  // Inverted cone funnel: wide dark mouth at the roof, narrowing downward.
  out.push(cone(0.14, 0.22, 6, WELL, { rx: PI, x: wx, y: roofY - 0.04, z: wz }));
}

export default NM_WEIWUYING;
