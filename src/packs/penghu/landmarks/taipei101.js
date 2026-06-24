/**
 * @file packs/penghu/landmarks/cross_sea_bridge.js — Roll Formosa Penghu pack.
 *
 * NM_CROSS_SEA_BRIDGE — 澎湖跨海大橋, THE GOAL MONUMENT. The iconic bridge
 * connecting 白沙鄉 and 西嶼鄉 across 吼門水道, at 2,494m one of the longest
 * inter-island bridges in East Asia. The distinctive central arch allows
 * fishing boats to pass beneath. Classic white concrete with a sweeping arc.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — 跨海大橋 read
const CONCRETE = 0xd0d4d8;    // light grey bridge deck
const CONCRETE_D = 0xb0b4b8;  // darker concrete shadow
const ARCH_WHITE = 0xf0f4f8;  // white arch pylon
const ARCH_HI = 0xffffff;     // bright arch highlight
const RAIL = 0xc8ccd0;        // railing grey
const PIER = 0x909498;        // pier column grey
const WATER = 0x4a8eae;       // sea blue accent
const LIGHT = 0xffd84d;       // beacon/light

export const NM_CROSS_SEA_BRIDGE = {
  id: 'cross_sea_bridge',
  name: '澎湖跨海大橋',
  landmarkId: 8,
  dioramaRHint: 280,
  colorHex: 0xf0f4f8,

  buildGeometry(rng) {
    const parts = [];

    // ---- Main bridge deck (long horizontal span) ----
    parts.push(box(3.2, 0.12, 0.6, CONCRETE, { y: 0.5, hex2: CONCRETE_D }));

    // Road surface markings
    parts.push(box(3.0, 0.02, 0.08, 0xffffff, { y: 0.56, z: 0 }));

    // Railings on both sides
    parts.push(box(3.2, 0.06, 0.03, RAIL, { y: 0.58, z: 0.28 }));
    parts.push(box(3.2, 0.06, 0.03, RAIL, { y: 0.58, z: -0.28 }));

    // ---- Central arch pylon (the iconic curved structure) ----
    const archH = 1.3;
    const archW = 0.9;
    const archSegs = 8;

    for (let i = 0; i < archSegs; i++) {
      const t = i / (archSegs - 1);
      const angle = t * PI;
      const x = (t - 0.5) * archW;
      const y = 0.5 + Math.sin(angle) * (archH - 0.5);
      const nextT = (i + 1) / (archSegs - 1);
      const nextAngle = nextT * PI;
      const nextX = (nextT - 0.5) * archW;
      const nextY = 0.5 + Math.sin(nextAngle) * (archH - 0.5);

      if (i < archSegs - 1) {
        const segLen = Math.hypot(nextX - x, nextY - y);
        const segAngle = Math.atan2(nextY - y, nextX - x);
        parts.push(
          box(segLen, 0.08, 0.1, ARCH_WHITE, {
            x: (x + nextX) / 2,
            y: (y + nextY) / 2,
            rz: segAngle,
            hex2: ARCH_HI,
          })
        );
      }
    }

    // Arch support legs
    parts.push(box(0.08, 0.5, 0.1, ARCH_WHITE, { x: -archW / 2, y: 0.75 }));
    parts.push(box(0.08, 0.5, 0.1, ARCH_WHITE, { x: archW / 2, y: 0.75 }));

    // ---- Suspension cables from arch ----
    const cableN = 6;
    for (let i = 0; i < cableN; i++) {
      const t = (i + 0.5) / cableN;
      const xPos = (t - 0.5) * archW * 1.6;
      const archY = 0.5 + Math.sin(t * PI) * (archH - 0.5);
      parts.push(cyl(0.015, 0.015, archY - 0.56, 4, RAIL, {
        x: xPos,
        y: (archY + 0.56) / 2,
      }));
    }

    // ---- Support piers beneath deck ----
    const pierN = 4;
    for (let i = 0; i < pierN; i++) {
      const xPos = ((i + 0.5) / pierN - 0.5) * 3.0;
      parts.push(cyl(0.08, 0.1, 0.5, 6, PIER, { x: xPos, y: 0.25 }));
      parts.push(cyl(0.14, 0.16, 0.1, 6, PIER, { x: xPos, y: 0.02 }));
    }

    // ---- Water surface hint at base ----
    parts.push(box(3.4, 0.04, 1.0, WATER, { y: 0.0, sy: 0.3 }));

    // ---- Beacon lights on arch top ----
    parts.push(sph(0.06, LIGHT, { ws: 6, hs: 4, y: archH + 0.06 }));
    parts.push(cyl(0.025, 0.025, 0.08, 6, ARCH_WHITE, { y: archH + 0.12 }));

    return finish(parts);
  },
};

// Keep the legacy export name for backward compatibility with scaffolded imports
export const NM_TAIPEI101 = NM_CROSS_SEA_BRIDGE;

export default NM_CROSS_SEA_BRIDGE;
