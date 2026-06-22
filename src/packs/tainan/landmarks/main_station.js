/**
 * @file packs/tainan/landmarks/main_station.js — Roll Formosa Tainan pack.
 *
 * 臺南火車站 (Tainan Station) — the 1936 station building. Silhouette: a
 * symmetrical two-storey cream/tan modern block with a flat roof, a central
 * entrance fronted by a row of tall rectangular windows, a horizontal canopy
 * jutting over the entrance, and a small clock / sign band crowning the centre.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so the broad symmetric civic proportions carry the read.
 * rng() is used only for hair-fine clock-hand jitter — never structure. Hero
 * model budget: <= 600 triangles.
 */

import { box, cyl, finish, HALF_PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const WALL = 0xcdbb94; // cream / tan modern facade (hero color)
const WALL_L = 0xdccaa4; // sunlit upper wall
const WALL_D = 0xa89878; // shadowed plinth / string course
const WIN = 0x3f4a52; // dark glazed tall window
const FRAME = 0xb9a880; // pale window mullion / pier
const ROOF = 0x8f8169; // flat roof slab / parapet
const CANOPY = 0xb6a583; // entrance canopy
const SIGN = 0xb24a36; // sign / clock band accent
const CLOCK = 0xf0ead8; // clock face

export const NM_STATION = {
  id: 'main_station',
  name: '臺南火車站',
  landmarkId: 1,
  dioramaRHint: 70,
  colorHex: WALL,

  buildGeometry(rng) {
    const parts = [];

    const baseY = -0.6;

    // === PLINTH / BASE COURSE ===============================================
    parts.push(box(5.2, 0.3, 2.4, WALL_D, { y: baseY + 0.15, hex2: WALL }));

    // === MAIN TWO-STOREY BODY (broad, symmetric) ============================
    const bodyW = 4.8, bodyH = 1.7, bodyD = 2.1;
    const bodyY = baseY + 0.3 + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, WALL, { y: bodyY, hex2: WALL_L }));

    // Horizontal floor string course between the two storeys.
    const midY = baseY + 0.3 + bodyH * 0.5;
    parts.push(box(bodyW + 0.06, 0.07, bodyD + 0.06, WALL_D, { y: midY }));

    // === FLAT ROOF + PARAPET ================================================
    const topY = baseY + 0.3 + bodyH;
    parts.push(box(bodyW + 0.12, 0.14, bodyD + 0.12, ROOF, { y: topY + 0.07, hex2: WALL_L }));
    parts.push(box(bodyW + 0.04, 0.08, bodyD + 0.04, WALL_D, { y: topY + 0.18 })); // parapet cap

    // === WINDOW RHYTHM on the front face (+Z) ===============================
    // Symmetric rows of tall rectangular windows, upper + lower storey.
    const frontZ = bodyD / 2 + 0.02;
    const nBays = 11;
    const baySpan = bodyW - 0.7;
    for (let i = 0; i < nBays; i++) {
      const cx = -baySpan / 2 + (baySpan / (nBays - 1)) * i;
      // Skip the central bays — those belong to the entrance below.
      if (Math.abs(cx) < 0.85) continue;
      // Upper-storey window.
      parts.push(box(0.26, bodyH * 0.32, 0.06, WIN, { x: cx, y: baseY + 0.3 + bodyH * 0.74, z: frontZ }));
      // Lower-storey window.
      parts.push(box(0.26, bodyH * 0.32, 0.06, WIN, { x: cx, y: baseY + 0.3 + bodyH * 0.28, z: frontZ }));
    }
    // Pale piers between window bays (front only).
    for (let i = 0; i < nBays + 1; i++) {
      const px = -baySpan / 2 - 0.18 + ((baySpan + 0.36) / nBays) * i;
      if (Math.abs(px) < 0.95) continue;
      parts.push(box(0.08, bodyH - 0.2, 0.04, FRAME, { x: px, y: bodyY, z: frontZ + 0.01 }));
    }

    // === CENTRAL ENTRANCE ===================================================
    // A taller central bay with a row of tall windows above the doorway.
    const cBayW = 1.7;
    parts.push(box(cBayW, bodyH + 0.2, 0.18, WALL_L, { y: bodyY + 0.1, z: frontZ }));
    // Tall rectangular entrance windows (a row).
    const nEntW = 5;
    const entSpan = cBayW - 0.5;
    for (let i = 0; i < nEntW; i++) {
      const cx = -entSpan / 2 + (entSpan / (nEntW - 1)) * i;
      parts.push(box(0.16, bodyH * 0.7, 0.06, WIN, { x: cx, y: bodyY + 0.18, z: frontZ + 0.1 }));
    }
    // Ground-floor doorway (dark recess).
    parts.push(box(cBayW - 0.5, bodyH * 0.4, 0.1, WIN, { y: baseY + 0.3 + bodyH * 0.22, z: frontZ + 0.1 }));

    // === HORIZONTAL CANOPY over the entrance ================================
    const canopyY = baseY + 0.3 + bodyH * 0.46;
    parts.push(box(cBayW + 0.7, 0.1, 0.55, CANOPY, { y: canopyY, z: frontZ + 0.32, hex2: WALL_L }));
    // Two slim canopy posts.
    for (const sx of [-1, 1]) {
      parts.push(box(0.07, 0.5, 0.07, WALL_D, { x: sx * (cBayW / 2 + 0.25), y: canopyY - 0.3, z: frontZ + 0.5 }));
    }

    // === CLOCK / SIGN BAND crowning the centre ==============================
    const signY = topY + 0.28;
    parts.push(box(cBayW + 0.2, 0.4, 0.16, SIGN, { y: signY, z: frontZ - 0.02, hex2: 0xc85a44 }));
    // Round clock face on the sign band.
    parts.push(cyl(0.18, 0.18, 0.06, 12, CLOCK, { rx: HALF_PI, y: signY + 0.02, z: frontZ + 0.08 }));
    // Clock hands (tiny rng jitter on angle, variation only).
    const j = (rng() - 0.5) * 0.2;
    parts.push(box(0.015, 0.13, 0.02, WIN, { y: signY + 0.06, z: frontZ + 0.11, rz: 0.3 + j }));
    parts.push(box(0.015, 0.09, 0.02, WIN, { y: signY + 0.06, z: frontZ + 0.11, rz: -1.1 + j }));

    return finish(parts);
  },
};

export default NM_STATION;
