/**
 * @file packs/tainan/landmarks/maokong_station.js — Roll Formosa Tainan pack.
 *
 * 開元寺 (Kaiyuan Temple) — a large 臺南 Buddhist monastery. Silhouette: a wide,
 * grand main hall with a double-eave hip roof (重簷廡殿) of ochre/yellow tile,
 * yellow-ochre walls, a front row of red columns across a central bay, and a
 * calm, broad, dignified mass. Two stacked sweeping hip tiers crown the read.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the broad low body + dominant double-eave hip
 * roof carry the read. rng() only nudges the finial — never structure. <= 600 tris.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const WALL = 0xd8c98a; // yellow-ochre monastery wall
const WALL_L = 0xe6d9a2; // sunlit wall
const WALL_D = 0xb6a66a; // shadowed plinth
const RED = 0xb23a2e; // red columns / doorway
const RED_D = 0x8a261d; // deep red shadow
const ROOF = 0xc9972f; // ochre/yellow glazed roof tile (hero color)
const ROOF_L = 0xe0b352; // sunlit eave tile
const ROOF_D = 0xa07820; // deep ridge / underside
const RIDGE = 0x8a6418; // ridge cap
const STONE = 0xc6bfa8; // stone base / platform
const STONE_D = 0xa9a288; // stone shadow
const DOOR = 0x3a2818; // dark doorway recess

/**
 * One sweeping HIP roof tier (廡殿頂): a flared eave skirt + a broad low 4-sided
 * pyramid, rectangular footprint via sx/sz, with an eave→ridge tile gradient.
 * Pushes parts into `out`.
 */
function hipTier(out, w, d, rise, y, flare) {
  // Flared eave skirt (upturned-eave shadow line).
  out.push(cone(1.0, 0.13, 4, ROOF_L, { sx: w * (1 + flare), sz: d * (1 + flare), ry: PI / 4, y: y + 0.015, hex2: ROOF }));
  // Main sloped hip mass.
  out.push(cone(1.0, rise, 4, ROOF, { sx: w, sz: d, ry: PI / 4, y: y + rise / 2 + 0.08, hex2: ROOF_D }));
  // Lower gradient re-skin.
  out.push(cone(1.0, rise * 0.4, 4, ROOF_L, { sx: w, sz: d, ry: PI / 4, y: y + rise * 0.2 + 0.08, hex2: ROOF }));
}

export const NM_MK_STATION = {
  id: 'maokong_station',
  name: '開元寺',
  colorHex: ROOF,

  buildGeometry(rng) {
    const r0 = (rng() - 0.5) * 0.02; // tiny non-structural finial jitter
    const parts = [];

    const baseY = -0.7;

    // === STONE PLATFORM (broad, low) ========================================
    parts.push(box(5.2, 0.34, 3.0, STONE_D, { y: baseY + 0.17, hex2: STONE }));
    parts.push(box(4.6, 0.2, 2.6, STONE, { y: baseY + 0.44, hex2: WALL_L }));
    // Front central steps.
    parts.push(box(2.2, 0.16, 0.5, STONE_D, { y: baseY + 0.3, z: 1.5, hex2: STONE }));

    // === MAIN HALL BODY (wide ochre walls) ==================================
    const bodyW = 4.2, bodyH = 1.4, bodyD = 2.0;
    const podTop = baseY + 0.54;
    const bodyY = podTop + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, WALL, { y: bodyY, hex2: WALL_L }));
    // Stone base course + cornice band.
    parts.push(box(bodyW + 0.06, 0.12, bodyD + 0.06, STONE, { y: podTop + 0.06 }));
    parts.push(box(bodyW + 0.04, 0.1, bodyD + 0.04, WALL_D, { y: podTop + bodyH - 0.05 }));

    // === FRONT ROW OF RED COLUMNS across the central bay ====================
    const porchZ = bodyD / 2 + 0.16;
    const colSpan = bodyW - 0.6;
    const nCol = 7;
    for (let i = 0; i < nCol; i++) {
      const cx = -colSpan / 2 + (colSpan / (nCol - 1)) * i;
      parts.push(cyl(0.12, 0.13, bodyH - 0.04, 8, RED, { x: cx, y: bodyY, z: porchZ, hex2: RED_D }));
    }
    // Beam tying the colonnade.
    parts.push(box(colSpan + 0.4, 0.16, 0.16, RED, { y: podTop + bodyH - 0.04, z: porchZ }));
    parts.push(box(colSpan + 0.4, 0.06, 0.18, ROOF_L, { y: podTop + bodyH + 0.06, z: porchZ }));

    // === CENTRAL DOORWAY ====================================================
    parts.push(box(1.1, bodyH * 0.7, 0.12, DOOR, { y: podTop + bodyH * 0.35, z: bodyD / 2 + 0.02 }));
    parts.push(box(1.3, 0.14, 0.14, RED_D, { y: podTop + bodyH * 0.72, z: bodyD / 2 + 0.04 })); // lintel

    // === DOUBLE-EAVE HIP ROOF (重簷廡殿) — the visual hero ==================
    // Lower broad eave tier sheltering the whole hall.
    const lowEave = podTop + bodyH + 0.06;
    hipTier(parts, 2.5, 1.35, 0.5, lowEave, 0.08);

    // Mid ochre drum between the two eaves.
    const drumY = lowEave + 0.3;
    parts.push(box(2.1, 0.42, 1.1, WALL, { y: drumY + 0.21, hex2: WALL_L }));
    parts.push(box(2.16, 0.08, 1.16, WALL_D, { y: drumY + 0.46 }));

    // Upper dominant eave tier.
    const upEave = drumY + 0.5;
    hipTier(parts, 1.75, 0.95, 0.66, upEave, 0.1);

    // Level ridge cap along the top (正脊).
    const ridgeY = upEave + 0.66 + 0.06;
    parts.push(box(1.3, 0.16, 0.2, RIDGE, { y: ridgeY }));
    parts.push(box(1.3, 0.06, 0.24, ROOF_L, { y: ridgeY + 0.11 }));

    // Ridge-end ornaments (鴟吻) at the two ends.
    for (const sx of [-1, 1]) {
      parts.push(box(0.16, 0.24, 0.2, RIDGE, { x: sx * 0.7, y: ridgeY + 0.08 }));
      parts.push(box(0.09, 0.12, 0.1, ROOF_L, { x: sx * 0.78, y: ridgeY + 0.24 + r0 }));
    }

    return finish(parts);
  },
};

export default NM_MK_STATION;
