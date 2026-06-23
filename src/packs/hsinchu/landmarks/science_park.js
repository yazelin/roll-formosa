/**
 * @file packs/hsinchu/landmarks/science_park.js — Roll Formosa Hsinchu pack.
 *
 * 新竹科學園區探索館 (Hsinchu Science Park Discovery Center). The Hsinchu Science
 * Park, established in 1980, is Taiwan's Silicon Valley - home to TSMC, UMC, and
 * hundreds of tech companies. The Discovery Center showcases the park's history
 * and technological achievements with a modern, futuristic building design
 * featuring glass curtain walls and angular metallic forms.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — high-tech modern architecture.
const GLASS = 0x6090b0;      // blue-tinted glass curtain wall
const GLASS_D = 0x4070a0;    // darker glass
const METAL = 0xa8b0b8;      // brushed steel/aluminum cladding
const METAL_D = 0x889098;    // metal shadow
const FRAME = 0x505860;      // structural steel frames
const CONCRETE = 0xc8c4bc;   // concrete base
const CONCRETE_D = 0xa8a49c; // concrete shadow
const ACCENT = 0x2080c0;     // tech blue accent lighting
const PLAZA = 0xb8b4ac;      // paved plaza
const GREEN = 0x5a8a50;      // landscaping
const WHITE = 0xf0f4f8;      // white panels

export const NM_SCIENCE_PARK = {
  id: 'science_park_center',
  name: '新竹科學園區探索館',
  landmarkId: 15,
  dioramaRHint: 115,
  colorHex: 0x6090b0, // tech blue glass — modern high-tech aesthetic

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Plaza and landscaping base ---------------------------------------
    parts.push(box(2.6, 0.04, 2.0, PLAZA, { y: 0.02 }));
    // Landscape strips
    for (const sx of [-1, 1]) {
      parts.push(box(0.25, 0.06, 1.4, GREEN, { x: sx * 1.1, y: 0.05 }));
    }

    // ---- 2) Main building - angular modern form ------------------------------
    const baseY = 0.04;
    const mainW = 1.5;
    const mainD = 1.0;
    const mainH = 0.7;

    // Concrete plinth base
    parts.push(box(mainW + 0.1, 0.1, mainD + 0.1, CONCRETE_D, {
      y: baseY + 0.05, hex2: CONCRETE
    }));

    // Main glass box body
    parts.push(box(mainW, mainH, mainD, GLASS_D, {
      y: baseY + 0.1 + mainH * 0.5, hex2: GLASS
    }));

    // Structural frame grid on facade
    const frameY = baseY + 0.1;
    for (let i = 0; i <= 4; i++) {
      // Horizontal frames
      parts.push(box(mainW + 0.02, 0.02, 0.02, FRAME, {
        y: frameY + i * mainH * 0.25, z: mainD * 0.5 + 0.01
      }));
    }
    for (let i = -2; i <= 2; i++) {
      // Vertical frames
      parts.push(box(0.02, mainH, 0.02, FRAME, {
        x: i * mainW * 0.25, y: frameY + mainH * 0.5, z: mainD * 0.5 + 0.01
      }));
    }

    // ---- 3) Angular cantilevered section (futuristic element) ----------------
    const cantY = baseY + mainH * 0.6;
    const cantW = 0.6;
    const cantH = 0.4;
    const cantD = 0.5;

    // Cantilevered box projecting forward
    parts.push(box(cantW, cantH, cantD, METAL_D, {
      x: -mainW * 0.35,
      y: cantY + cantH * 0.5,
      z: mainD * 0.5 + cantD * 0.4,
      rz: -0.1,
      hex2: METAL
    }));
    // Glass face on cantilever
    parts.push(box(cantW * 0.85, cantH * 0.7, 0.02, GLASS, {
      x: -mainW * 0.35,
      y: cantY + cantH * 0.5,
      z: mainD * 0.5 + cantD * 0.85
    }));

    // ---- 4) Roof structure with skylights ------------------------------------
    const roofY = baseY + 0.1 + mainH;
    parts.push(box(mainW + 0.06, 0.06, mainD + 0.06, METAL, { y: roofY + 0.03 }));

    // Skylight strips
    for (const sx of [-1, 0, 1]) {
      parts.push(box(0.25, 0.08, mainD * 0.7, GLASS, {
        x: sx * 0.4, y: roofY + 0.08, hex2: GLASS_D
      }));
    }

    // ---- 5) Entrance canopy --------------------------------------------------
    const canopyY = baseY + 0.35;
    const canopyW = 0.8;
    const canopyD = 0.5;

    // Support columns
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.04, 0.05, 0.3, 5, METAL, {
        x: sx * canopyW * 0.4, y: canopyY - 0.15, z: mainD * 0.5 + canopyD * 0.7
      }));
    }
    // Canopy roof (angled)
    parts.push(box(canopyW, 0.04, canopyD, WHITE, {
      y: canopyY, z: mainD * 0.5 + canopyD * 0.5, rx: 0.1
    }));

    // ---- 6) Tech sculpture in plaza (semiconductor wafer inspired) -----------
    const sculptX = 0.75;
    const sculptZ = 0.6;
    const sculptY = 0.04;

    // Pedestal
    parts.push(cyl(0.12, 0.15, 0.1, 6, CONCRETE, {
      x: sculptX, y: sculptY + 0.05, z: sculptZ
    }));
    // Wafer disc
    parts.push(cyl(0.2, 0.2, 0.03, 12, METAL_D, {
      x: sculptX, y: sculptY + 0.16, z: sculptZ, rx: 0.3, hex2: METAL
    }));
    // Circuit pattern (simplified lines)
    parts.push(box(0.3, 0.01, 0.01, ACCENT, {
      x: sculptX, y: sculptY + 0.18, z: sculptZ
    }));
    parts.push(box(0.01, 0.01, 0.25, ACCENT, {
      x: sculptX, y: sculptY + 0.18, z: sculptZ
    }));

    // ---- 7) Second smaller tech building (representing the park complex) -----
    const bldg2X = 0.85;
    const bldg2Y = 0.04;
    const bldg2H = 0.45;
    const bldg2W = 0.5;

    parts.push(box(bldg2W, 0.06, 0.4, CONCRETE_D, {
      x: bldg2X, y: bldg2Y + 0.03, z: -0.35
    }));
    parts.push(box(bldg2W, bldg2H, 0.35, GLASS_D, {
      x: bldg2X, y: bldg2Y + 0.06 + bldg2H * 0.5, z: -0.35, hex2: GLASS
    }));
    // Accent stripe
    parts.push(box(bldg2W + 0.02, 0.03, 0.01, ACCENT, {
      x: bldg2X, y: bldg2Y + 0.06 + bldg2H * 0.5, z: -0.165
    }));

    // ---- 8) LED information pillar -------------------------------------------
    parts.push(cyl(0.06, 0.06, 0.5, 6, FRAME, {
      x: -0.85, y: 0.29, z: 0.7
    }));
    parts.push(box(0.14, 0.25, 0.04, ACCENT, {
      x: -0.85, y: 0.35, z: 0.72, hex2: GLASS
    }));

    // ---- 9) Parking/access road markings -------------------------------------
    for (let i = 0; i < 4; i++) {
      parts.push(box(0.08, 0.01, 0.03, WHITE, {
        x: -0.4 + i * 0.25, y: 0.045, z: -0.85
      }));
    }

    return finish(parts);
  },
};

export default NM_SCIENCE_PARK;
