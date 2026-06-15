/**
 * @file packs/taipei/landmarks/main_station.js — Roll Formosa Taipei pack.
 *
 * 台北車站 (Taipei Main Station) — the 1989 civic terminal at the heart of the
 * city. Silhouette: a BROAD, low, symmetrical six-storey cream/tan masonry block
 * with strong horizontal floor banding and a rhythm of tall windows, crowned by
 * a single very distinctive TEAL-GREEN pyramidal / hipped roof whose four eaves
 * sweep up at the corners (a modern nod to a Chinese 攢尖頂). The wide civic body
 * + dominant green pyramid cap is the whole read.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read: much wider than
 * tall body, then a broad green pyramid that owns the top third. rng() is used
 * only for a hair of roof-ridge jitter — never for structure. <= 600 triangles.
 *
 * Palette: cream/tan stone facade, brown window mullion recesses, and the
 * signature teal-green glazed-tile pyramid roof (深→淺 eave gradient).
 */

import { box, cone, cyl, finish, PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const STONE = 0xd8cdb4; // cream / tan facade ashlar (body read color)
const STONE_L = 0xe4dcc6; // sunlit cornice / coping (lighter)
const STONE_D = 0xc2b89e; // shadowed plinth / string course
const WIN = 0x4f5b63; // dark glazed window glass (recessed bays)
const WIN_FRAME = 0xb9ac90; // pale stone window mullion/pier
const BASE = 0xada288; // granite podium base
const ROOF = 0x2f7d6e; // teal-green glazed pyramid roof (the hero green)
const ROOF_EAVE = 0x4fae98; // lit eave / lower roof slope (lighter teal)
const ROOF_D = 0x245f54; // deep roof shadow / underside
const RIDGE = 0x6fc4ad; // ridge highlight + finial gleam

export const NM_STATION = {
  id: 'taipei_main_station',
  name: '台北車站',
  landmarkId: 1,
  dioramaRHint: 75, // ~149 m wide x ~50 m tall civic block (integration may rescale)
  colorHex: ROOF, // the teal-green cap is the signature color

  buildGeometry(rng) {
    const parts = [];

    // === GRANITE PODIUM BASE =================================================
    // Wide, low base course — broader than the body so the building "sits".
    parts.push(box(5.4, 0.34, 2.5, BASE, { y: 0.17, hex2: STONE_D }));
    parts.push(box(5.2, 0.22, 2.34, STONE_D, { y: 0.45, hex2: STONE })); // plinth band

    // === MAIN BODY (broad six-storey block) ==================================
    // Clearly much wider than tall: a civic terminal, never a tower.
    const bodyW = 5.0, bodyH = 1.7, bodyD = 2.2, bodyY = 0.56 + bodyH / 2;
    parts.push(box(bodyW, bodyH, bodyD, STONE, { y: bodyY, hex2: STONE_L }));

    // Strong horizontal floor string courses (the banded facade read).
    const floorTop = 0.56 + bodyH;
    for (let f = 1; f <= 4; f++) {
      const fy = 0.56 + (bodyH * f) / 5;
      parts.push(box(bodyW + 0.05, 0.06, bodyD + 0.05, STONE_D, { y: fy }));
    }

    // Window grid on the broad front (+Z): one tall slab per bay (ground→upper)
    // reads as the stacked-window rhythm for a fraction of the tri cost of
    // per-row boxes; the horizontal string courses crossing them give the rows.
    const nBays = 9;
    const baySpan = bodyW - 0.7;
    const frontZ = bodyD / 2 + 0.01;
    for (let i = 0; i < nBays; i++) {
      const cx = -baySpan / 2 + (baySpan / (nBays - 1)) * i;
      parts.push(box(0.3, bodyH - 0.4, 0.06, WIN, { x: cx, y: bodyY + 0.04, z: frontZ }));
    }
    // Rear (−Z): a single recessed window band slab (cheap) so the back is not blank.
    parts.push(box(baySpan + 0.2, bodyH - 0.5, 0.05, WIN, { y: bodyY + 0.04, z: -(bodyD / 2 + 0.01) }));
    // Vertical cream pier strips between bays on the FRONT face only, to break
    // the window band into articulated masonry bays.
    for (let i = 0; i < nBays + 1; i++) {
      const cx = -baySpan / 2 - 0.18 + ((baySpan + 0.36) / nBays) * i;
      parts.push(box(0.1, bodyH - 0.2, 0.05, WIN_FRAME, { x: cx, y: bodyY, z: bodyD / 2 + 0.02 }));
    }

    // Central entrance: a taller, slightly proud porch bay on the front face.
    parts.push(box(1.3, bodyH * 0.7, 0.18, STONE_L, { y: 0.56 + bodyH * 0.35, z: bodyD / 2 + 0.05 }));
    parts.push(box(1.0, bodyH * 0.55, 0.1, WIN, { y: 0.56 + bodyH * 0.3, z: bodyD / 2 + 0.13 })); // glazed entry
    parts.push(box(1.4, 0.14, 0.22, STONE_D, { y: 0.56 + bodyH * 0.7, z: bodyD / 2 + 0.05 })); // entry lintel

    // Top cornice / parapet capping the body just under the roof seat.
    parts.push(box(bodyW + 0.12, 0.16, bodyD + 0.12, STONE_L, { y: floorTop + 0.02 }));
    parts.push(box(bodyW + 0.22, 0.1, bodyD + 0.22, STONE_D, { y: floorTop + 0.13 })); // wide drip (roof seat)

    // Set-back attic storey the green roof springs from (a touch narrower).
    const atticH = 0.34;
    const atticY = floorTop + 0.18 + atticH / 2;
    parts.push(box(bodyW - 0.5, atticH, bodyD - 0.45, STONE, { y: atticY, hex2: STONE_L }));

    // === TEAL-GREEN PYRAMID ROOF (the visual hero) ==========================
    // A single broad four-sided pyramid (攢尖頂) owning the top third, with a
    // flared eave skirt and upturned corner spurs. This green cap IS the
    // landmark's identity.
    const eaveY = floorTop + 0.18 + atticH; // roof seat height
    const roofW = (bodyW - 0.5) / 2; // half footprint (cone is scaled by sx/sz)
    const roofD = (bodyD - 0.45) / 2;
    const ridgeH = 1.55; // pyramid rise — tall enough to dominate, not a needle

    // Broad flared eave skirt (deep overhang shadow + lit lower slope).
    parts.push(cone(1.0, 0.22, 4, ROOF_D, { sx: roofW + 0.35, sz: roofD + 0.35, ry: PI / 4, y: eaveY + 0.04 }));
    parts.push(cone(1.0, 0.5, 4, ROOF_EAVE, { sx: roofW + 0.22, sz: roofD + 0.22, ry: PI / 4, y: eaveY + 0.27, hex2: ROOF }));
    // Main sweeping pyramid mass (eave→apex gradient, deeper green toward top).
    parts.push(cone(1.0, ridgeH, 4, ROOF_EAVE, { sx: roofW, sz: roofD, ry: PI / 4, y: eaveY + ridgeH / 2 + 0.06, hex2: ROOF }));
    // Re-skin the apex darker so the very top reads as deep teal in shadow.
    parts.push(cone(1.0, ridgeH * 0.5, 4, ROOF, { sx: roofW * 0.62, sz: roofD * 0.62, ry: PI / 4, y: eaveY + ridgeH * 0.72 + 0.06, hex2: ROOF_D }));

    // Hip ridge lines: thin lighter bars climbing the four pyramid arrises so the
    // faceted hips of the green roof catch light (silhouette definition).
    const apexY = eaveY + ridgeH + 0.06;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(box(0.07, ridgeH * 1.05, 0.07, RIDGE, {
          rz: sx * 0.26, rx: -sz * 0.26,
          x: sx * roofW * 0.5, y: eaveY + ridgeH * 0.5 + 0.06, z: sz * roofD * 0.5,
        }));
      }
    }

    // Upturned corner eave spurs (翹角) at the four roof corners — the flick that
    // makes the green roof unmistakably this station.
    const ex = roofW + 0.34;
    const ez = roofD + 0.34;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(box(0.34, 0.09, 0.09, ROOF, {
          rz: sx * 0.5, ry: sx * sz * 0.5,
          x: sx * ex, y: eaveY + 0.16, z: sz * ez, hex2: RIDGE,
        }));
      }
    }

    // Apex finial: small stacked cap + spike crowning the pyramid.
    const j = (rng() - 0.5) * 0.015; // tiny finial jitter (variation only)
    parts.push(box(0.2, 0.14, 0.2, ROOF_D, { y: apexY + 0.05 + j })); // ridge boss
    parts.push(cone(0.12, 0.3, 6, RIDGE, { y: apexY + 0.27 + j })); // finial spike
    parts.push(cyl(0.03, 0.04, 0.16, 6, RIDGE, { y: apexY + 0.5 + j })); // tip mast

    return finish(parts);
  },
};

export default NM_STATION;
