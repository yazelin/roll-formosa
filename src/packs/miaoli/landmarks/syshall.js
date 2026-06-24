/**
 * @file packs/taipei/landmarks/syshall.js — Roll Formosa Taipei pack.
 *
 * NM_SYSHALL — 國父紀念館 (Sun Yat-sen Memorial Hall). One of the curated hero
 * LANDMARK geometries. The unmistakable silhouette: a large, almost cubic white
 * hall sitting on a wide, low stepped plaza, crowned by ONE enormous sweeping
 * golden-yellow flying-eave HIP roof (黃琉璃瓦 廡殿頂) whose four corners flare
 * dramatically upward (起翹) — a single bold curved tile cap, not a tiered
 * pagoda. Yellow roof + white walls is the whole read.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * the integration layer drops it onto the ground plane. We author the correct
 * PROPORTIONS: a broad squat hall where the giant low-pitched golden roof, with
 * its upturned eave corners, is the dominant mass — NOT a slender tower.
 *
 * The flying-eave read comes from: a wide flat-ish 4-sided hip cap (cone, 4
 * radial seg, ry=PI/4 so flat faces front), a flared eave skirt below it, a
 * gold eave rim, and four small upturned corner blocks (戧脊起翹) at the eave
 * corners. Tri budget: hero models <= 600.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Hip roofs are square; rotate by half a 4-seg segment (PI/4) so a flat roof
// face — not an edge — points toward the camera/front.
const HIP_PHASE = PI / 4;

// Palette anchors.
const WHITE = 0xf0f1ec; // 白牆 / 石材牆面 (off-white stone walls)
const WHITE_SHADE = 0xd8dad2; // step-tread / base shading for gradients
const YELLOW = 0xe8b62a; // 黃琉璃瓦 (golden-yellow glazed roof tile)
const YELLOW_DK = 0xc8941c; // eave underside / shadow
const YELLOW_LT = 0xf3cf55; // ridge / sunlit upper tile
const GOLD = 0xd8a838; // ridge caps + eave gold rim + finial
const GREY = 0xc2c4bc; // 台基緣石 / cornice shadow
const DOOR = 0x6e5a36; // dark bronze entry recess

export const NM_SYSHALL = {
  id: 'sun_yat_sen_hall',
  name: '國父紀念館',
  landmarkId: 4,
  dioramaRHint: 30, // hall ~30 m tall incl. base + roof (real ~30 m)
  colorHex: YELLOW, // golden roof — the hero read color
  buildGeometry(rng) {
    const r0 = rng() * 0.02; // tiny non-structural jitter
    const parts = [];

    /* ---- wide low stepped plaza / 台基 -------------------------------- */
    // Two broad shallow tiers — the open paved platform the hall stands on.
    parts.push(box(4.0, 0.22, 4.0, WHITE, { y: 0.11, hex2: WHITE_SHADE })); // plaza tier 1 (widest)
    parts.push(box(3.3, 0.2, 3.3, WHITE, { y: 0.32, hex2: WHITE_SHADE })); // plaza tier 2 (plinth)
    // Front approach steps centred on the entry face.
    for (let i = 0; i < 4; i++) {
      parts.push(box(1.9 - i * 0.08, 0.1, 0.24, WHITE, { y: 0.05 + i * 0.1, z: 1.7 + i * 0.12, hex2: WHITE_SHADE })); // approach step
    }

    /* ---- white hall body (主堂體) ------------------------------------ */
    // Broad squat near-cubic white block — the main hall volume.
    const bodyW = 2.6, bodyH = 1.3, bodyD = 2.6, bodyY = 0.42 + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, WHITE, { y: bodyY, hex2: 0xe6e8e2 })); // main hall wall mass
    // Tall recessed entry colonnade hint on the front face (deep portico shadow).
    parts.push(box(1.7, bodyH - 0.18, 0.16, DOOR, { y: bodyY - 0.04, z: bodyD / 2 + 0.0 })); // portico recess
    // Slim square columns across the front portico — flat-front, low tri.
    const nCol = 5;
    const colSpan = 1.6;
    for (let i = 0; i < nCol; i++) {
      const cx = -colSpan / 2 + (colSpan / (nCol - 1)) * i;
      parts.push(box(0.16, bodyH - 0.16, 0.16, WHITE, { x: cx, y: bodyY - 0.02, z: bodyD / 2 + 0.06, hex2: WHITE_SHADE })); // portico column
    }
    // Cornice band where wall meets the roof springing.
    parts.push(box(bodyW + 0.16, 0.1, bodyD + 0.16, GREY, { y: 0.42 + bodyH })); // cornice band

    /* ---- the GIANT golden flying-eave hip roof (黃琉璃瓦 廡殿頂) ------- */
    // This single sweeping cap is the visual hero: very wide footprint, low
    // pitch, dominating the whole silhouette.
    const eaveY = 0.42 + bodyH + 0.05; // base Y of the roof eave line

    // Flared eave skirt: a short, very wide downward-flaring 4-sided frustum
    // (cone) casts the deep upturned-eave shadow line under the roof.
    parts.push(cone(2.5, 0.34, 4, YELLOW, { y: eaveY + 0.05, ry: HIP_PHASE, hex2: YELLOW_DK })); // flared eave skirt
    // Gold eave rim sitting on the cornice — the bright tile drip edge.
    parts.push(cyl(2.5, 2.5, 0.07, 4, GOLD, { y: eaveY, ry: HIP_PHASE })); // eave gold rim

    // Main sweeping hip mass: a broad, low 4-sided pyramid — wide and short so
    // the roof reads as a sprawling golden cap, not a spire.
    parts.push(cone(2.18, 0.92, 4, YELLOW, { y: eaveY + 0.34 + 0.46, ry: HIP_PHASE, hex2: YELLOW_DK })); // main hip mass (eave→ridge gradient)
    // Lighter sunlit re-skin over the upper third of the hip for tile sheen.
    parts.push(cone(1.1, 0.5, 4, YELLOW_LT, { y: eaveY + 0.34 + 0.9, ry: HIP_PHASE, hex2: YELLOW })); // sunlit upper tile

    // Flat golden ridge cap (正脊) running along the top — gives the hip roof
    // its characteristic horizontal ridge instead of a sharp point.
    const ridgeY = eaveY + 0.34 + 0.92 + 0.02;
    parts.push(box(0.95, 0.14, 0.22, GOLD, { y: ridgeY })); // main ridge cap
    // Small finials at the two ridge ends (吻獸 hints).
    for (const sx of [-1, 1]) {
      parts.push(box(0.16, 0.2, 0.24, YELLOW_LT, { x: sx * 0.5, y: ridgeY + 0.05 })); // ridge-end ornament
    }

    /* ---- upturned eave corners (起翹) — the SIGNATURE flying eaves ----- */
    // Four small wedge blocks lifted at the eave corners read as the dramatic
    // sweeping-up corners of the roof. Placed at the 4 hip-skirt corners.
    const cd = 2.0; // corner offset along X/Z
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        // angled little cone tip flicking upward at each corner
        parts.push(cone(0.2, 0.34, 4, YELLOW_LT, {
          ry: HIP_PHASE,
          rz: sx * 0.5,
          rx: -sz * 0.5,
          x: sx * cd,
          y: eaveY + 0.18,
          z: sz * cd,
          hex2: YELLOW,
        })); // upturned corner eave (起翹)
        parts.push(box(0.12, 0.08, 0.12, GOLD, { x: sx * (cd - 0.02), y: eaveY + 0.3 + r0, z: sz * (cd - 0.02) })); // gold corner tip
      }
    }

    return finish(parts);
  },
};

export default NM_SYSHALL;
