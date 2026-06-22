/**
 * @file packs/hualien/landmarks/taroko_gate.js — Roll Formosa hero landmark.
 *
 * NM_TAROKO_GATE — 太魯閣牌樓 (Taroko Arch / East-West Cross-Island Highway Gate),
 * THE GOAL MONUMENT. The iconic red-pillared Chinese archway marking the entrance
 * to Taroko Gorge and the eastern terminus of the Central Cross-Island Highway.
 * Four massive red columns support a triple-tiered green glazed-tile roof with
 * upturned eaves, golden dragon ornamentation, and the "東西橫貫公路" plaque.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Traditional Chinese gate colors
const PILLAR_RED = 0xb82020; // classic vermillion red pillars
const PILLAR_BASE = 0x4a4a4a; // grey stone base
const ROOF_GREEN = 0x1a5a3a; // glazed green tile roof
const ROOF_GOLD = 0xd4a820; // gold trim/dragon ornamentation
const PLAQUE_BG = 0x2a1a0a; // dark wood plaque background
const PLAQUE_GOLD = 0xf0c840; // gold characters
const EAVE_UNDER = 0x6a3020; // underside of eaves (dark red/brown)

export const NM_TAROKO_GATE = {
  id: 'taroko_gate',
  name: '太魯閣牌樓',
  landmarkId: 8,
  dioramaRHint: 25, // real gate height ~12-15m, scaled for game feel
  colorHex: PILLAR_RED,

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Stone foundation platform --------------------------------------
    parts.push(box(3.6, 0.12, 1.2, PILLAR_BASE, { y: 0.06 })); // stone platform
    parts.push(box(3.8, 0.05, 1.3, 0x3a3a3a, { y: 0.025 })); // ground step

    // ---- 2) Four red pillars (two outer pairs) -----------------------------
    const pillarH = 2.2;
    const pillarR = 0.14;
    const outerX = 1.35; // outer pillar x positions
    const innerX = 0.55; // inner pillar x positions
    const pillarZ = 0.0;

    // Stone bases for pillars
    for (const x of [-outerX, -innerX, innerX, outerX]) {
      parts.push(box(0.38, 0.18, 0.38, PILLAR_BASE, { x, z: pillarZ, y: 0.21 })); // stone pedestal
      parts.push(cyl(pillarR, pillarR, pillarH, 10, PILLAR_RED, { x, z: pillarZ, y: 0.30 + pillarH / 2 })); // red pillar
      parts.push(cyl(pillarR * 1.15, pillarR * 1.15, 0.08, 10, PILLAR_RED, { x, z: pillarZ, y: 0.32 })); // pillar base ring
      parts.push(cyl(pillarR * 1.1, pillarR * 1.1, 0.06, 10, ROOF_GOLD, { x, z: pillarZ, y: 2.50 })); // pillar top ring
    }

    // ---- 3) Horizontal beams connecting pillars ----------------------------
    const beamY = 2.0;
    // Outer spans (between outer and inner pillars)
    parts.push(box(outerX - innerX + 0.1, 0.18, 0.24, PILLAR_RED, { x: -(outerX + innerX) / 2, y: beamY }));
    parts.push(box(outerX - innerX + 0.1, 0.18, 0.24, PILLAR_RED, { x: (outerX + innerX) / 2, y: beamY }));
    // Center span (between inner pillars - the main passage)
    parts.push(box(innerX * 2 + 0.1, 0.18, 0.24, PILLAR_RED, { x: 0, y: beamY }));

    // Upper beam
    const upperBeamY = 2.35;
    parts.push(box(outerX * 2 + 0.3, 0.12, 0.20, PILLAR_RED, { x: 0, y: upperBeamY }));

    // ---- 4) Central plaque (東西橫貫公路) -----------------------------------
    const plaqueY = 2.55;
    parts.push(box(1.1, 0.42, 0.08, PLAQUE_BG, { y: plaqueY })); // plaque background
    parts.push(box(1.0, 0.36, 0.09, PLAQUE_GOLD, { y: plaqueY })); // gold inner field (characters implied)
    parts.push(box(1.14, 0.04, 0.10, ROOF_GOLD, { y: plaqueY + 0.22 })); // top border
    parts.push(box(1.14, 0.04, 0.10, ROOF_GOLD, { y: plaqueY - 0.22 })); // bottom border

    // ---- 5) Triple-tiered roof with upturned eaves -------------------------
    // Bottom tier (widest, over the full span)
    const roofY1 = 2.80;
    parts.push(box(3.4, 0.08, 1.0, EAVE_UNDER, { y: roofY1 })); // eave underside
    parts.push(box(3.5, 0.16, 1.1, ROOF_GREEN, { y: roofY1 + 0.08 })); // main roof surface
    // Upturned corners (simplified as tilted boxes)
    for (const sx of [-1, 1]) {
      parts.push(box(0.35, 0.12, 0.15, ROOF_GREEN, { x: sx * 1.85, y: roofY1 + 0.16, rz: sx * 0.25 })); // corner upturn
    }
    parts.push(box(3.6, 0.05, 0.06, ROOF_GOLD, { y: roofY1 + 0.18, z: 0.55 })); // gold ridge front
    parts.push(box(3.6, 0.05, 0.06, ROOF_GOLD, { y: roofY1 + 0.18, z: -0.55 })); // gold ridge back

    // Middle tier (over center section)
    const roofY2 = 3.05;
    parts.push(box(2.0, 0.06, 0.7, EAVE_UNDER, { y: roofY2 })); // eave underside
    parts.push(box(2.1, 0.14, 0.8, ROOF_GREEN, { y: roofY2 + 0.06 })); // roof surface
    for (const sx of [-1, 1]) {
      parts.push(box(0.25, 0.10, 0.12, ROOF_GREEN, { x: sx * 1.1, y: roofY2 + 0.12, rz: sx * 0.25 })); // corner upturn
    }
    parts.push(box(2.2, 0.04, 0.05, ROOF_GOLD, { y: roofY2 + 0.14, z: 0.42 })); // gold ridge

    // Top tier (smallest, crowning element)
    const roofY3 = 3.25;
    parts.push(box(1.0, 0.05, 0.45, EAVE_UNDER, { y: roofY3 })); // eave underside
    parts.push(box(1.1, 0.12, 0.55, ROOF_GREEN, { y: roofY3 + 0.05 })); // roof surface
    for (const sx of [-1, 1]) {
      parts.push(box(0.18, 0.08, 0.10, ROOF_GREEN, { x: sx * 0.58, y: roofY3 + 0.10, rz: sx * 0.25 })); // corner upturn
    }
    parts.push(box(1.2, 0.03, 0.04, ROOF_GOLD, { y: roofY3 + 0.12, z: 0.28 })); // gold ridge

    // ---- 6) Roof ridge ornaments (dragon finials) --------------------------
    // Central ridge ornament
    parts.push(cyl(0.08, 0.04, 0.22, 6, ROOF_GOLD, { y: 3.48 })); // central finial
    parts.push(sph(0.06, ROOF_GOLD, { ws: 6, hs: 4, y: 3.62 })); // finial ball top

    // Side dragon head ornaments (simplified as small pointed shapes)
    for (const sx of [-1, 1]) {
      parts.push(cone(0.06, 0.15, 6, ROOF_GOLD, { x: sx * 0.45, y: 3.35, rz: sx * 0.4 })); // dragon head
    }

    return finish(parts);
  },
};

export default NM_TAROKO_GATE;
