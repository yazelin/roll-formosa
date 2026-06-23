/**
 * @file packs/hsinchu/landmarks/glass_museum.js — Roll Formosa Hsinchu pack.
 *
 * 新竹市玻璃工藝博物館 (Hsinchu Glass Museum). Located in Hsinchu Park, this museum
 * is housed in a historic Japanese-era building (1936) that was originally a
 * civic guest house. Features Art Deco influences with Japanese colonial style,
 * large glass windows, and a distinctive entrance. Now dedicated to showcasing
 * Hsinchu's famous glass industry heritage.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Art Deco meets Japanese colonial, glass museum.
const WALL = 0xe8e0d4;       // cream/off-white walls
const WALL_D = 0xd0c8bc;     // wall shadow
const GLASS = 0x7ab8d4;      // light blue glass windows (museum theme)
const GLASS_D = 0x5a98b4;    // darker glass
const FRAME = 0x4a4540;      // dark window frames
const ROOF = 0x5a5550;       // grey tile roof
const ROOF_D = 0x4a4540;     // roof shadow
const TRIM = 0xc8c0b0;       // decorative trim
const ENTRY = 0x8a7a68;      // entrance portico
const GRASS = 0x5a8a50;      // park lawn
const CRYSTAL = 0xa0d8f0;    // decorative glass crystal (museum symbol)
const CRYSTAL_D = 0x70b8e0;  // crystal shadow

export const NM_GLASS_MUSEUM = {
  id: 'glass_museum',
  name: '新竹市玻璃工藝博物館',
  landmarkId: 12,
  dioramaRHint: 40,
  colorHex: 0x7ab8d4, // light blue glass — the museum's glass heritage

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Park lawn base ---------------------------------------------------
    parts.push(cyl(1.4, 1.5, 0.06, 10, GRASS, { y: 0.03 }));

    // ---- 2) Paved plaza around the building ----------------------------------
    parts.push(box(2.0, 0.04, 1.4, TRIM, { y: 0.05 }));

    // ---- 3) Main building body (long rectangular, Art Deco proportions) ------
    const mainW = 1.6;
    const mainD = 0.9;
    const mainH = 0.5;
    const mainY = 0.07;

    parts.push(box(mainW, mainH, mainD, WALL_D, { y: mainY + mainH * 0.5, hex2: WALL }));

    // Horizontal Art Deco trim bands
    parts.push(box(mainW + 0.02, 0.03, mainD + 0.02, TRIM, { y: mainY + mainH * 0.3 }));
    parts.push(box(mainW + 0.02, 0.03, mainD + 0.02, TRIM, { y: mainY + mainH }));

    // ---- 4) Large glass windows (signature feature) --------------------------
    const winY = mainY + mainH * 0.55;
    const winZ = mainD * 0.5 + 0.01;

    // Front facade windows
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue; // center entrance
      // Window frame
      parts.push(box(0.2, 0.28, 0.02, FRAME, { x: i * 0.3, y: winY, z: winZ }));
      // Glass pane
      parts.push(box(0.16, 0.24, 0.015, GLASS, { x: i * 0.3, y: winY, z: winZ + 0.01, hex2: GLASS_D }));
    }

    // Side windows
    for (const sx of [-1, 1]) {
      const sideX = sx * (mainW * 0.5 + 0.01);
      for (let i = -1; i <= 1; i++) {
        parts.push(box(0.02, 0.24, 0.18, FRAME, { x: sideX, y: winY, z: i * 0.28 }));
        parts.push(box(0.015, 0.2, 0.14, GLASS, { x: sideX + sx * 0.01, y: winY, z: i * 0.28, hex2: GLASS_D }));
      }
    }

    // ---- 5) Central entrance portico -----------------------------------------
    const entryY = mainY;
    const entryW = 0.4;
    const entryD = 0.2;
    const entryH = mainH * 0.8;

    // Projecting entrance structure
    parts.push(box(entryW, entryH, entryD, ENTRY, {
      y: entryY + entryH * 0.5,
      z: mainD * 0.5 + entryD * 0.5
    }));

    // Entrance door (glass)
    parts.push(box(0.2, 0.35, 0.02, GLASS_D, {
      y: entryY + 0.2,
      z: mainD * 0.5 + entryD + 0.01
    }));

    // Entrance canopy
    parts.push(box(entryW + 0.1, 0.04, entryD + 0.15, WALL, {
      y: entryY + entryH,
      z: mainD * 0.5 + entryD * 0.5
    }));

    // ---- 6) Main roof (hip roof style) ---------------------------------------
    const roofY = mainY + mainH + 0.02;

    // Front and back slopes
    for (const s of [-1, 1]) {
      parts.push(box(mainW * 0.96, 0.05, mainD * 0.52, ROOF, {
        rx: s * 0.42,
        y: roofY + 0.12,
        z: s * mainD * 0.22,
        hex2: ROOF_D,
      }));
    }

    // Ridge
    parts.push(box(mainW * 0.8, 0.04, 0.06, ROOF_D, { y: roofY + 0.18 }));

    // ---- 7) Decorative glass crystal sculpture (museum symbol) ---------------
    // A stylized glass crystal in front of the museum
    const crystalX = 0.6;
    const crystalZ = mainD * 0.5 + 0.45;
    const crystalY = 0.07;

    // Pedestal
    parts.push(cyl(0.1, 0.12, 0.12, 6, TRIM, { x: crystalX, y: crystalY + 0.06, z: crystalZ }));

    // Crystal form (elongated octahedron shape using spheres)
    parts.push(sph(0.12, CRYSTAL_D, {
      ws: 6, hs: 4,
      x: crystalX, y: crystalY + 0.22, z: crystalZ,
      sy: 1.8,
      hex2: CRYSTAL
    }));

    // Second smaller crystal
    parts.push(cyl(0.06, 0.08, 0.08, 6, TRIM, { x: -0.55, y: crystalY + 0.04, z: crystalZ }));
    parts.push(sph(0.08, CRYSTAL_D, {
      ws: 5, hs: 3,
      x: -0.55, y: crystalY + 0.15, z: crystalZ,
      sy: 1.6,
      hex2: CRYSTAL
    }));

    // ---- 8) Art Deco corner pilasters ----------------------------------------
    for (const sx of [-1, 1]) {
      parts.push(box(0.06, mainH + 0.04, 0.06, TRIM, {
        x: sx * mainW * 0.5,
        y: mainY + mainH * 0.5 + 0.02,
        z: mainD * 0.5
      }));
      parts.push(box(0.06, mainH + 0.04, 0.06, TRIM, {
        x: sx * mainW * 0.5,
        y: mainY + mainH * 0.5 + 0.02,
        z: -mainD * 0.5
      }));
    }

    return finish(parts);
  },
};

export default NM_GLASS_MUSEUM;
