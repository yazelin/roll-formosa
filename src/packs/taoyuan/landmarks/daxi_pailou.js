/**
 * @file packs/taoyuan/landmarks/daxi_pailou.js — Roll Formosa hero landmark.
 *
 * NM_DAXI_PAILOU — 大溪老街牌樓, THE GOAL MONUMENT. The iconic Baroque-style
 * stone arch gate that marks the entrance to Daxi Old Street. Features a
 * three-bay design with a tall central arch flanked by two lower side arches,
 * ornate Western-influenced parapets with Chinese elements, and decorative
 * bas-relief patterns typical of the Japanese colonial period architecture
 * blended with local Hokkien styles (閩南巴洛克).
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Baroque pailou colors — warm stone tones with terracotta accents
const STONE_LO = 0x8a7a6a; // aged stone base (lower / shadowed)
const STONE_HI = 0xb8a898; // lighter stone (upper / sunlit)
const TERRACOTTA = 0xc85a3a; // terracotta roof tiles
const GOLD_TRIM = 0xd8a840; // gold decorative trim
const DARK_TRIM = 0x4a3a2a; // dark wood / iron details
const PLAQUE = 0xeae0d0; // pale plaque for signage

export const NM_DAXI_PAILOU = {
  id: 'daxi_pailou',
  name: '大溪老街牌樓',
  landmarkId: 8,
  dioramaRHint: 18, // real height ≈ 18 m (typical historic pailou)
  colorHex: STONE_HI,

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ground base / plinth ----
    parts.push(box(4.8, 0.2, 1.4, DARK_TRIM, { y: 0.1 })); // ground plinth

    // ---- 2) Four main pillars ----
    // Two outer pillars and two inner pillars define the three bays
    const pillarH = 3.0;
    const pillarW = 0.5;
    const pillarD = 0.6;
    const outerX = 1.9; // outer pillar positions
    const innerX = 0.7; // inner pillar positions

    // Outer pillars (shorter, supporting side arches)
    for (const sx of [-1, 1]) {
      parts.push(box(pillarW, pillarH * 0.8, pillarD, STONE_LO, {
        x: sx * outerX, y: pillarH * 0.4, hex2: STONE_HI,
      }));
      // Pillar capital decoration
      parts.push(box(pillarW + 0.1, 0.15, pillarD + 0.1, GOLD_TRIM, {
        x: sx * outerX, y: pillarH * 0.8,
      }));
    }

    // Inner pillars (taller, supporting central arch)
    for (const sx of [-1, 1]) {
      parts.push(box(pillarW, pillarH, pillarD, STONE_LO, {
        x: sx * innerX, y: pillarH * 0.5, hex2: STONE_HI,
      }));
      // Pillar capital decoration
      parts.push(box(pillarW + 0.1, 0.18, pillarD + 0.1, GOLD_TRIM, {
        x: sx * innerX, y: pillarH,
      }));
    }

    // ---- 3) Arches ----
    // Central arch (taller and wider)
    const centralArchH = 2.0;
    const centralArchW = 1.2;
    parts.push(box(centralArchW, 0.3, pillarD, STONE_HI, {
      y: pillarH + 0.15,
    })); // arch top beam

    // Side arches (lower)
    const sideArchH = 1.5;
    for (const sx of [-1, 1]) {
      const sideX = (outerX + innerX) / 2;
      parts.push(box(0.8, 0.25, pillarD * 0.9, STONE_HI, {
        x: sx * sideX, y: pillarH * 0.8 + 0.12,
      }));
    }

    // ---- 4) Baroque parapet / crown section (閩南巴洛克立面) ----
    // Central raised parapet with curved top
    const parapetY = pillarH + 0.3;
    parts.push(box(2.0, 1.2, 0.35, STONE_LO, {
      y: parapetY + 0.6, hex2: STONE_HI,
    })); // main parapet wall

    // Curved pediment top (simplified as a half-cylinder)
    parts.push(cyl(0.5, 0.5, 2.0, 8, STONE_HI, {
      rx: HALF_PI, y: parapetY + 1.2, thetaLen: PI,
    }));

    // Central name plaque area
    parts.push(box(1.2, 0.5, 0.1, PLAQUE, {
      y: parapetY + 0.5, z: 0.2,
    }));
    // Characters "大溪" suggestion (two small boxes)
    parts.push(box(0.25, 0.3, 0.05, DARK_TRIM, { x: -0.2, y: parapetY + 0.5, z: 0.26 }));
    parts.push(box(0.25, 0.3, 0.05, DARK_TRIM, { x: 0.2, y: parapetY + 0.5, z: 0.26 }));

    // ---- 5) Decorative finials / ornaments ----
    // Central top finial (a stylized flame or floral motif)
    parts.push(cone(0.2, 0.5, 6, TERRACOTTA, { y: parapetY + 1.7 }));
    parts.push(sph(0.15, GOLD_TRIM, { ws: 6, hs: 4, y: parapetY + 2.0 }));

    // Side parapet wings (lower than center)
    for (const sx of [-1, 1]) {
      parts.push(box(0.7, 0.7, 0.3, STONE_LO, {
        x: sx * 1.3, y: parapetY + 0.35, hex2: STONE_HI,
      }));
      // Small finials on side wings
      parts.push(cone(0.12, 0.3, 5, TERRACOTTA, {
        x: sx * 1.3, y: parapetY + 0.85,
      }));
    }

    // ---- 6) Terracotta roof tiles (mini eaves over pillars) ----
    // Small decorative overhangs typical of the style
    parts.push(box(2.4, 0.12, 0.8, TERRACOTTA, {
      y: pillarH + 0.22, z: 0.1,
    }));

    // ---- 7) Additional Baroque details ----
    // Rosette / circular decorations on parapet
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.15, 0.15, 0.08, 8, GOLD_TRIM, {
        x: sx * 0.7, y: parapetY + 0.9, z: 0.2, rx: HALF_PI,
      }));
    }

    // Horizontal molding lines
    parts.push(box(2.8, 0.08, 0.5, GOLD_TRIM, { y: pillarH * 0.5 }));
    parts.push(box(4.2, 0.06, 0.45, STONE_HI, { y: pillarH * 0.3 }));

    return finish(parts);
  },
};

export default NM_DAXI_PAILOU;
