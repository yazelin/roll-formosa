/**
 * @file packs/taipei/landmarks/national_theater.js — Roll Formosa Taipei pack.
 *
 * NM_THEATER — 國家戲劇院 (National Theater, 兩廳院). One of the curated hero
 * LANDMARK geometries, flanking 自由廣場 beside the CKS Memorial. The
 * unmistakable silhouette: a broad palatial hall ringed by RED columns on a
 * WHITE stepped base, crowned by a grand golden-yellow glazed DOUBLE-EAVE HIP
 * roof (重簷廡殿頂 — the highest-rank palace roof), wide and rectangular with
 * two flaring tiers, upturned eave corners and ridge-end ornaments (鴟吻).
 *
 * Distinct from its neighbours: a RECTANGULAR golden double-eave HIP roof (not
 * the CKS Memorial's blue octagonal attic, not the Grand Hotel's single orange
 * 歇山). Red + yellow palace = imperial palace temple read.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js): the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * the silhouette (wide low colonnaded body + dominant golden double-eave hip
 * roof) carries the read. Tri budget: hero models <= 600.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette anchors — concrete hexes (red lacquer body + golden glazed roof).
const WHITE = 0xeae6da; // 白石台基 (off-white stone base)
const WHITE_SHADE = 0xcdc8ba; // step-tread shading for the gradient
const RED_BODY = 0x9c2a24; // 朱牆 (red lacquer wall behind the colonnade)
const RED_COL = 0xc23a30; // 紅柱 (brighter red columns catching light)
const RED_DK = 0x5a1714; // arcade shadow recess
const ROOF_TOP = 0xe2a416; // 黃琉璃瓦 ridge (deep golden yellow)
const ROOF_EAVE = 0xf4c542; // eave (lighter golden yellow)
const ROOF_RIDGE = 0xc89a2e; // ridge cap / 鴟吻 (darker antique gold)
const TRIM_GOLD = 0xd8a838; // golden cornice trim band

/**
 * One flaring HIP-roof tier (廡殿頂): a flattened 4-ridge hip block built from a
 * 4-sided pyramid for the sloped planes plus a thin downward-flaring eave skirt
 * that gives the upturned-eave shadow line. Rectangular footprint via sx/sz.
 * @param {number} w half-footprint width (X, the long axis)
 * @param {number} d half-footprint depth (Z)
 * @param {number} rise roof rise (ridge height above eave)
 * @param {number} y eave height (base Y of the tier)
 * @param {number} flare extra eave overhang fraction
 * @returns {import('three').BufferGeometry[]}
 */
function hipTier(w, d, rise, y, flare) {
  const parts = [];
  // Flared eave skirt: short very-wide downward-flaring frustum → upturned eave.
  parts.push(cone(1.0, 0.13, 4, ROOF_EAVE, { sx: w * (1 + flare), sz: d * (1 + flare), ry: PI / 4, y: y + 0.015 }));
  // Main sloped hip mass: a broad, low 4-sided pyramid (ridge runs along X).
  // A hip roof has a SHORT level ridge — approximate with the pyramid apex; the
  // wide rectangular footprint (w >> d) reads as a long ridge, not a point.
  parts.push(cone(1.0, rise, 4, ROOF_TOP, { sx: w, sz: d, ry: PI / 4, y: y + rise / 2 + 0.08, hex2: ROOF_TOP }));
  // Lower-roof gold gradient: a second shallow frustum re-skins the bottom so
  // the slope reads eave(light)→ridge(deep) gold.
  parts.push(cone(1.0, rise * 0.4, 4, ROOF_EAVE, { sx: w, sz: d, ry: PI / 4, y: y + rise * 0.2 + 0.08, hex2: ROOF_TOP }));
  return parts;
}

export const NM_THEATER = {
  id: 'national_theater',
  name: '國家戲劇院',
  landmarkId: 9,
  dioramaRHint: 50, // hall ~46 m tall incl. base + double-eave roof
  colorHex: RED_COL, // red columns — the body read color
  buildGeometry(rng) {
    const r0 = rng() * 0.02; // tiny non-structural jitter
    const parts = [];

    /* ---- white stepped stone base (白石台基) -------------------------- */
    parts.push(box(5.0, 0.34, 3.0, WHITE, { y: 0.17, hex2: WHITE_SHADE })); // base tier 1 (widest)
    parts.push(box(4.5, 0.30, 2.6, WHITE, { y: 0.49, hex2: WHITE_SHADE })); // base tier 2
    parts.push(box(4.1, 0.22, 2.3, WHITE, { y: 0.75, hex2: WHITE_SHADE })); // plinth top
    // Front grand staircase — stacked treads up the centre of the long face.
    for (let i = 0; i < 4; i++) {
      const w = 1.9 - i * 0.08;
      parts.push(box(w, 0.11, 0.24, WHITE, { y: 0.06 + i * 0.11, z: 1.55 + i * 0.12, hex2: WHITE_SHADE })); // stair tread
    }

    /* ---- red hall body behind the colonnade (朱牆主體) ---------------- */
    const bodyW = 3.7, bodyH = 1.5, bodyD = 1.9, bodyY = 0.86 + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, RED_BODY, { y: bodyY, hex2: 0xb13730 })); // red wall mass
    parts.push(box(bodyW + 0.06, 0.10, bodyD + 0.06, WHITE, { y: 0.92 })); // white base course
    // Golden cornice trim band where wall meets the roof springing.
    parts.push(box(bodyW + 0.08, 0.13, bodyD + 0.08, TRIM_GOLD, { y: 0.86 + bodyH })); // cornice band

    /* ---- red colonnade ringing the hall (紅柱) ----------------------- */
    // Open cylinders (no caps) keep the tri budget low while reading as columns.
    const colH = bodyH - 0.06;
    // Front + back rows (along X), in front of / behind the red wall.
    const nFront = 9;
    const frontSpan = bodyW + 0.5;
    for (let i = 0; i < nFront; i++) {
      const cx = -frontSpan / 2 + (frontSpan / (nFront - 1)) * i;
      for (const cz of [bodyD / 2 + 0.22, -(bodyD / 2 + 0.22)]) {
        parts.push(cyl(0.13, 0.14, colH, 6, RED_COL, { open: true, x: cx, y: bodyY, z: cz }));
      }
    }
    // Side rows (along Z), skipping the corners already placed by the front rows.
    const nSide = 4;
    const sideSpan = bodyD + 0.44;
    for (let i = 1; i < nSide - 1; i++) {
      const cz = -sideSpan / 2 + (sideSpan / (nSide - 1)) * i;
      for (const cx of [frontSpan / 2, -frontSpan / 2]) {
        parts.push(cyl(0.13, 0.14, colH, 6, RED_COL, { open: true, x: cx, y: bodyY, z: cz }));
      }
    }
    // Arcade shadow recess behind the front columns (dark) for depth.
    parts.push(box(frontSpan - 0.3, colH - 0.2, 0.12, RED_DK, { y: bodyY, z: bodyD / 2 + 0.04 }));
    // White column-base platform the colonnade stands on (走馬廊).
    parts.push(box(frontSpan + 0.3, 0.12, sideSpan + 0.3, WHITE, { y: 0.92, hex2: WHITE_SHADE }));

    /* ---- grand golden double-eave HIP roof (重簷廡殿頂) -------------- */
    // LOWER eave tier: very broad, sheltering the whole colonnade — the wide
    // skirt that makes the palace read.
    const lowEave = 0.86 + bodyH + 0.10;
    parts.push(...hipTier(2.95, 1.62, 0.52, lowEave, 0.06));

    // Mid red drum between the two eaves (the 重簷 gap with little brackets).
    const drumY = lowEave + 0.30;
    parts.push(box(2.5, 0.46, 1.35, RED_BODY, { y: drumY + 0.23, hex2: 0xb13730 })); // mid wall
    parts.push(box(2.56, 0.10, 1.41, TRIM_GOLD, { y: drumY + 0.50 })); // mid cornice trim

    // UPPER eave tier: the dominant golden cap, narrower, with the level ridge.
    const upEave = drumY + 0.54;
    parts.push(...hipTier(2.05, 1.10, 0.70, upEave, 0.08));

    // Level ridge cap along the top (the long horizontal 正脊 of a hip roof).
    const ridgeY = upEave + 0.70 + 0.06;
    parts.push(box(1.5, 0.16, 0.20, ROOF_RIDGE, { y: ridgeY })); // main ridge cap
    parts.push(box(1.5, 0.07, 0.26, TRIM_GOLD, { y: ridgeY + 0.11 })); // ridge gold band

    // Ridge-end ornaments (鴟吻) at the two ends of the level ridge.
    for (const sx of [-1, 1]) {
      parts.push(box(0.18, 0.26, 0.24, ROOF_RIDGE, { x: sx * 0.78, y: ridgeY + 0.10 })); // 鴟吻
      parts.push(box(0.10, 0.14, 0.12, TRIM_GOLD, { x: sx * 0.86, y: ridgeY + 0.28 })); // ornament tip
    }
    // Corner eave-ridge ornaments on the lower tier (戧脊走獸 hints) at the two
    // front eave corners — tiny gold caps that read against the sky.
    for (const sx of [-1, 1]) {
      parts.push(box(0.15, 0.18, 0.15, ROOF_RIDGE, { x: sx * 2.84, y: lowEave + 0.05 + r0, z: 1.5 }));
    }

    return finish(parts);
  },
};

export default NM_THEATER;
