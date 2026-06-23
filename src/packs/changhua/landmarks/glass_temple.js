/**
 * @file packs/changhua/landmarks/glass_temple.js — Roll Formosa Changhua pack.
 *
 * 鹿港玻璃廟 (Lukang Glass Mazu Temple / Taiwan Glass Gallery Temple).
 * A modern temple built entirely of glass panels, opened in 2012. Features
 * a traditional temple structure with swallowtail roof, but constructed
 * with 70,000+ pieces of cut glass creating a dazzling, translucent effect.
 * The glass panels catch light creating a sparkling appearance.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, sph, finish, HALF_PI, PI } from '../geomHelpers.js';

const GLASS_CLEAR = 0xa8d8e8;   // clear glass
const GLASS_BLUE = 0x70b8d8;   // blue-tinted glass
const GLASS_AMBER = 0xe8c078;  // amber glass accents
const STEEL = 0x909898;        // steel frame
const GOLD = 0xd8b848;         // gold trim
const WHITE = 0xf0f4f8;        // white base

export const NM_GLASS_TEMPLE = {
  id: 'glass_temple',
  name: '鹿港玻璃廟',
  landmarkId: 10,
  dioramaRHint: 35,
  colorHex: GLASS_BLUE,

  buildGeometry(rng) {
    const parts = [];

    // White base platform
    parts.push(box(2.8, 0.18, 2.2, WHITE, { y: 0.09 }));
    parts.push(box(2.4, 0.12, 1.8, STEEL, { y: 0.21 }));

    // Main temple body - glass panels
    const bodyY = 0.27;
    const bodyH = 0.90;

    // Front glass panel wall
    parts.push(box(2.2, bodyH, 0.06, GLASS_CLEAR, { z: 0.85, y: bodyY + bodyH / 2, hex2: GLASS_BLUE }));
    // Back glass panel
    parts.push(box(2.2, bodyH, 0.06, GLASS_CLEAR, { z: -0.85, y: bodyY + bodyH / 2, hex2: GLASS_BLUE }));
    // Side glass panels
    parts.push(box(0.06, bodyH, 1.7, GLASS_CLEAR, { x: -1.05, y: bodyY + bodyH / 2, hex2: GLASS_BLUE }));
    parts.push(box(0.06, bodyH, 1.7, GLASS_CLEAR, { x: 1.05, y: bodyY + bodyH / 2, hex2: GLASS_BLUE }));

    // Steel frame structure
    // Corner posts
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(cyl(0.05, 0.05, bodyH, 6, STEEL, {
          x: sx * 1.00, z: sz * 0.82, y: bodyY + bodyH / 2,
        }));
      }
    }
    // Top frame
    parts.push(box(2.1, 0.06, 0.06, STEEL, { z: 0.82, y: bodyY + bodyH + 0.03 }));
    parts.push(box(2.1, 0.06, 0.06, STEEL, { z: -0.82, y: bodyY + bodyH + 0.03 }));
    parts.push(box(0.06, 0.06, 1.64, STEEL, { x: -1.00, y: bodyY + bodyH + 0.03 }));
    parts.push(box(0.06, 0.06, 1.64, STEEL, { x: 1.00, y: bodyY + bodyH + 0.03 }));

    // Glass columns (traditional temple style, but glass)
    for (const cx of [-0.60, 0.60]) {
      parts.push(cyl(0.08, 0.09, bodyH * 0.9, 6, GLASS_AMBER, {
        x: cx, z: 0.75, y: bodyY + bodyH * 0.45,
      }));
    }

    // Glass swallowtail roof
    const roofY = bodyY + bodyH + 0.06;
    // Main roof panels
    parts.push(box(2.4, 0.10, 1.9, GLASS_CLEAR, { y: roofY + 0.08, hex2: GLASS_BLUE }));
    // Eave overhang (glass with steel edge)
    parts.push(box(2.6, 0.04, 2.1, GLASS_BLUE, { y: roofY + 0.02 }));

    // Ridge
    parts.push(box(2.2, 0.05, 0.08, GOLD, { y: roofY + 0.16 }));
    // Sloped roof panels
    for (const s of [-1, 1]) {
      parts.push(box(2.2, 0.03, 0.80, GLASS_CLEAR, {
        rx: s * 0.45, y: roofY + 0.20, z: s * 0.60, hex2: GLASS_AMBER,
      }));
    }

    // Swallowtail corners (simplified for glass temple)
    const spurLen = 0.35;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(box(spurLen, 0.03, 0.08, GLASS_AMBER, {
          rz: sx * 0.4, x: sx * 1.15 - sx * spurLen * 0.3,
          y: roofY + spurLen * 0.15, z: sz * 0.88,
        }));
        parts.push(box(0.10, 0.04, 0.06, GOLD, {
          rz: sx * 0.5, x: sx * 1.20, y: roofY + spurLen * 0.28, z: sz * 0.88,
        }));
      }
    }

    // Central finial (glass gourd shape)
    const topY = roofY + 0.25;
    parts.push(cyl(0.06, 0.08, 0.15, 6, GLASS_AMBER, { y: topY + 0.08 }));
    parts.push(sph(0.07, GLASS_CLEAR, { ws: 6, hs: 4, y: topY + 0.20 }));

    return finish(parts);
  },
};

export default NM_GLASS_TEMPLE;
