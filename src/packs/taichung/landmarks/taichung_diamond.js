/**
 * @file packs/taichung/landmarks/taichung_diamond.js — Roll Formosa hero landmark.
 *
 * NM_TAICHUNG_DIAMOND — 台中之鑽 (the Taichung Diamond, 七期 / Xitun), THE GOAL
 * MONUMENT. 台中 has no 101/85-class supertall, so the city's TALLEST tower
 * (225 m, completed 2025) is the finale — keeping the 2cm→兩百多米 climb intact.
 * Silhouette: a splayed podium, a slender glass shaft in three setback sections
 * (the slim luxury-residential supertall look), crowned by a faceted crystal
 * "鑽" — a hexagonal gem (flared girdle → tapering to a point) in icy blue so it
 * reads as a jewel atop the tower from across the city.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere, so proportions
 * (not absolute size) carry the silhouette. Square cross-sections come from
 * cyl(...) with seg=4 rotated PI/4 so flat faces point at the axes. <= 600 tris.
 */

import { cyl, box, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

const GLASS_LO = 0x1f3a52; // deep blue curtain glass (in shadow)
const GLASS_HI = 0x4f86b8; // brighter blue glass (catching light)
const MULLION = 0x14202e; // dark steel transom between setbacks
const GEM_LO = 0x7fcfff; // crystalline crown — icy blue
const GEM_HI = 0xd8f2ff; // bright facet highlight
const STEEL = 0xb9c2c8; // crown base ring steel

export const NM_TAICHUNG_DIAMOND = {
  id: 'taichung_diamond',
  name: '台中之鑽',
  landmarkId: 8,
  dioramaRHint: 225, // real height ≈ 225 m (台中第一高樓, 2025)
  colorHex: GLASS_HI,

  buildGeometry(rng) {
    const FACE = HALF_PI / 2; // PI/4 — orient square faces to the axes
    const parts = [];

    // ---- 1) Splayed podium base ------------------------------------------
    parts.push(cyl(0.55, 0.82, 0.5, 4, 0x2c3a48, { ry: FACE, y: 0.25, hex2: 0x3a4a5a })); // podium skirt
    parts.push(box(1.35, 0.12, 1.35, 0x222c36, { y: 0.06 })); // ground plinth
    parts.push(cyl(0.42, 0.55, 0.45, 4, GLASS_LO, { ry: FACE, y: 0.72, hex2: 0x356a86 })); // glass collar

    // ---- 2) Slender shaft — three setback sections (slim supertall) -------
    const secs = [
      { y0: 0.95, h: 1.5, rBot: 0.40, rTop: 0.34 },
      { y0: 2.45, h: 1.5, rBot: 0.32, rTop: 0.27 },
      { y0: 3.95, h: 1.3, rBot: 0.25, rTop: 0.20 },
    ];
    for (const s of secs) {
      parts.push(cyl(s.rTop, s.rBot, s.h, 4, GLASS_LO, { ry: FACE, y: s.y0 + s.h / 2, hex2: GLASS_HI })); // glass section
      const lip = s.rTop * 1.4142 + 0.04;
      parts.push(box(lip, 0.05, lip, MULLION, { y: s.y0 + s.h })); // setback transom
    }
    const top = secs[2].y0 + secs[2].h; // top of the shaft

    // ---- 3) The 鑽 — faceted crystal crown --------------------------------
    parts.push(cyl(0.22, 0.20, 0.10, 8, STEEL, { y: top + 0.05 })); // crown base ring
    parts.push(cyl(0.24, 0.16, 0.16, 6, GEM_LO, { y: top + 0.20, hex2: GEM_HI })); // gem girdle (flares up)
    parts.push(cyl(0.02, 0.24, 0.44, 6, GEM_LO, { y: top + 0.50, hex2: GEM_HI })); // gem crown → a point

    // ---- 4) Tip warning light ---------------------------------------------
    parts.push(sph(0.04, 0xff5a4a, { ws: 6, hs: 4, y: top + 0.76 })); // aircraft warning light

    return finish(parts);
  },
};

export default NM_TAICHUNG_DIAMOND;
