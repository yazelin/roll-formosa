/**
 * @file packs/kaohsiung/landmarks/foguangshan.js — Roll Formosa Kaohsiung pack.
 *
 * 佛光山佛陀紀念館 (Fo Guang Shan Buddha Museum, 大樹 Dashu, 高雄 Kaohsiung). A
 * curated hero geometry built around the museum's unmistakable axial silhouette:
 * a colossal seated bronze 大佛 (the 108 m Fo Guang Big Buddha) enthroned on a
 * tall plinth at the far end, fronted by EIGHT matching pagodas (八塔) lined up in
 * two facing rows of four down the central plaza, with the 本館 main hall — a
 * broad pyramid-roofed temple block flanked by its own four corner stupas —
 * sitting at the near end of the avenue. 金身大佛 + 白塔成列 + 黃瓦本館: the
 * golden Buddha, the white pagoda colonnade, and the yellow-tiled main hall.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct
 * PROPORTIONS (one towering seated figure dominating an axial plaza of small
 * pagodas, hall at the front — NOT a single tower). The integration step owns the
 * size-ladder; dioramaRHint is the real-world footprint hint. <= 600 triangles
 * (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Buddha Museum materials (金身大佛 / 白塔 / 黃瓦本館).
const PLAZA = 0xd9cdaf; // pale stone plaza deck (the central 成佛大道)
const PLAZA_D = 0xb8ac8f; // shadow seam of the plaza paving
const GOLD = 0xd8b048; // 金身 — gilt bronze of the seated Buddha
const GOLD_D = 0xb08c2c; // shadow side of the gilt bronze
const PLINTH = 0xc7c0ad; // pale stone Buddha plinth / lotus throne base
const ROBE = 0xc89a3a; // deeper bronze of the draped robe / lap fold
const PAGODA = 0xefe9da; // 白塔 — white plastered pagoda body
const PAGODA_D = 0xcfc8b8; // shadow side of the white pagoda
const ROOF = 0xc9a93f; // golden-yellow glazed pagoda/hall roof tile
const ROOF_D = 0x9c7f28; // eave-shadow underside of the tile roof
const WALL = 0xe6c659; // 黃瓦本館 yellow plastered main-hall wall
const WALL_D = 0xc9a93f; // shadow side of the hall wall
const SPIRE = 0xe8c14a; // gold finial / stupa cap ornament

// Square cross-sections come from cyl(seg=4) rotated PI/8 to read as a chamfered
// octagon footprint; OCT orients a flat face toward the viewer.
const OCT = HALF_PI / 4; // PI/8

/**
 * Author one small white tiered pagoda centered at (cx,cz) into `out`. A short
 * white octagonal drum, a wide golden flared tile roof, and a slim gold finial —
 * the repeated module of the eight-pagoda colonnade.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx pagoda center x
 * @param {number} cz pagoda center z
 * @param {number} baseY plaza-top height the pagoda springs from
 */
function pagoda(out, cx, cz, baseY) {
  // White square wall drum (白塔) — cyl(seg4) rotated PI/8 to read as a
  // chamfered tower; cheap, the eight-pagoda colonnade is the costly motif.
  out.push(
    cyl(0.1, 0.13, 0.4, 4, PAGODA, { ry: OCT, x: cx, z: cz, y: baseY + 0.23, hex2: PAGODA_D })
  );
  // Wide golden flared tile roof tapering straight up into a slender finial —
  // one tall cone does both the eave cap and the spire (cheap silhouette).
  out.push(
    cone(0.21, 0.34, 4, ROOF, { ry: OCT, x: cx, z: cz, y: baseY + 0.6, hex2: SPIRE })
  );
}

export const NM_FOGUANGSHAN = {
  id: 'foguangshan',
  name: '佛光山佛陀紀念館',
  landmarkId: 0,
  dioramaRHint: 120, // Buddha Museum axial complex footprint radius in metres
  colorHex: 0xd8b048, // the gilt bronze of the Big Buddha
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the finials
    const parts = [];

    // ---- Central plaza deck (成佛大道 — long axial paving slab) -----------
    parts.push(box(1.5, 0.1, 2.7, PLAZA, { y: 0.05, hex2: PLAZA_D }));

    // ====================================================================
    // 大佛 — the colossal seated golden Buddha, enthroned at the FAR end
    // (−Z), towering over the whole complex.
    // ====================================================================
    const bx = 0; // Buddha center x (on the axis)
    const bz = -1.05; // Buddha center z (far end of the plaza)

    // Stepped stone plinth + lotus throne the figure sits on.
    parts.push(box(0.95, 0.34, 0.95, PLINTH, { x: bx, y: 0.27, z: bz })); // tall base block
    parts.push(box(0.78, 0.18, 0.78, PLINTH, { x: bx, y: 0.5, z: bz, hex2: PAGODA })); // upper step
    parts.push(cyl(0.42, 0.46, 0.16, 6, PLINTH, { x: bx, y: 0.66, z: bz, hex2: PAGODA_D })); // lotus throne ring

    // Crossed-legs lap — a wide low golden block (the seated base of the body).
    parts.push(box(0.66, 0.26, 0.46, ROBE, { x: bx, y: 0.86, z: bz, hex2: GOLD })); // folded lap
    parts.push(box(0.7, 0.1, 0.5, ROBE, { x: bx, y: 0.74, z: bz + 0.04, hex2: GOLD_D })); // draped robe hem over the throne

    // Torso — tapered golden trunk rising from the lap.
    parts.push(cyl(0.24, 0.34, 0.5, 6, GOLD, { x: bx, y: 1.24, z: bz, hex2: GOLD_D })); // robed torso
    // Shoulders — a slightly wider golden band capping the torso.
    parts.push(cyl(0.27, 0.27, 0.12, 6, GOLD, { x: bx, y: 1.5, z: bz })); // shoulder line

    // Hands resting in the lap (dhyana mudra) — small golden dome.
    parts.push(sph(0.12, GOLD, { ws: 5, hs: 3, x: bx, y: 0.98, z: bz + 0.2, hex2: GOLD_D }));

    // Neck + head + ushnisha crown.
    parts.push(cyl(0.1, 0.12, 0.1, 6, GOLD, { x: bx, y: 1.6, z: bz })); // neck
    parts.push(sph(0.2, GOLD, { ws: 7, hs: 4, x: bx, y: 1.78, z: bz, hex2: 0xe8c860 })); // head (brow→gilt highlight)
    parts.push(sph(0.1, GOLD, { ws: 6, hs: 4, x: bx, y: 1.93, z: bz })); // ushnisha (cranial crown bump)
    parts.push(cone(0.05, 0.12, 6, SPIRE, { x: bx, y: 2.04, z: bz })); // flame finial atop the crown

    // ====================================================================
    // 八塔 — eight white pagodas in two facing rows of four down the plaza.
    // ====================================================================
    const rowX = 0.58; // half-width between the two rows
    const zFront = 0.05; // near-end pagoda z
    const zStep = 0.42; // spacing between pagodas along the avenue
    for (let i = 0; i < 4; i++) {
      const pz = zFront - i * zStep; // march from front toward the Buddha
      pagoda(parts, -rowX, pz, 0.1); // west-row pagoda
      pagoda(parts, rowX, pz, 0.1); // east-row pagoda
    }

    // ====================================================================
    // 本館 — the broad main hall at the NEAR end (+Z), a yellow-walled temple
    // block under a wide pyramid tile roof, flanked by four corner stupas.
    // ====================================================================
    const hz = 1.2; // hall center z (near end)
    parts.push(box(1.2, 0.1, 0.5, PLAZA, { y: 0.1, z: hz, hex2: PLAZA_D })); // hall terrace
    parts.push(box(1.0, 0.5, 0.42, WALL, { y: 0.4, z: hz, hex2: WALL_D })); // yellow hall body
    parts.push(cone(0.84, 0.4, 4, ROOF, { ry: OCT, y: 0.85, z: hz, hex2: ROOF_D })); // wide overhanging pyramid tile roof
    parts.push(cone(0.07, 0.2 + r, 5, SPIRE, { y: 1.12, z: hz })); // gold roof finial

    // Four corner stupas of the main hall (small white domed posts).
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const cx = sx * 0.52;
        const cz = hz + sz * 0.22;
        parts.push(cyl(0.07, 0.08, 0.3, 4, PAGODA, { x: cx, y: 0.3, z: cz, hex2: PAGODA_D })); // stupa post
        parts.push(cone(0.085, 0.18, 4, SPIRE, { x: cx, y: 0.54, z: cz, hex2: SPIRE })); // stupa gold cap + spire
      }
    }

    return finish(parts);
  },
};

export default NM_FOGUANGSHAN;
