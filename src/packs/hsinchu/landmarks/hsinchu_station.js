/**
 * @file packs/hsinchu/landmarks/hsinchu_station.js — Roll Formosa Hsinchu pack.
 *
 * 新竹火車站 (Hsinchu Railway Station). A historic baroque-style railway station
 * built during the Japanese colonial era (1913). Features a prominent central
 * clock tower, red brick facade, arched windows, and white trim. One of the most
 * beautiful preserved railway stations in Taiwan, with distinctive European
 * architectural influences blended with tropical adaptations.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges -> recenters -> normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS — the
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { cyl, box, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Japanese colonial baroque railway station.
const BRICK = 0xb85c3d;      // red brick facade
const BRICK_D = 0x944830;    // darker brick shadow
const TRIM = 0xf5f0e6;       // white trim / window frames
const ROOF = 0x4a4540;       // dark grey/brown tile roof
const ROOF_D = 0x3a3530;     // roof shadow
const WINDOW = 0x2a3540;     // dark window glazing
const CLOCK = 0xf8f4e8;      // white clock face
const CLOCK_HANDS = 0x2a2520; // black clock hands
const PLINTH = 0xc8c0b4;     // stone foundation

export const NM_HSINCHU_STATION = {
  id: 'hsinchu_station',
  name: '新竹火車站',
  landmarkId: 10,
  dioramaRHint: 15,
  colorHex: 0xb85c3d, // red brick — the station's signature color

  buildGeometry(rng) {
    void rng;
    const parts = [];

    // ---- 1) Stone foundation / plinth ----------------------------------------
    parts.push(box(2.4, 0.12, 1.2, PLINTH, { y: 0.06 }));

    // ---- 2) Main building body (long rectangular red brick) ------------------
    const mainH = 0.55;
    const mainW = 2.2;
    const mainD = 1.0;
    parts.push(box(mainW, mainH, mainD, BRICK_D, { y: 0.12 + mainH * 0.5, hex2: BRICK }));

    // White trim band at top of main building
    parts.push(box(mainW + 0.02, 0.06, mainD + 0.02, TRIM, { y: 0.12 + mainH }));

    // ---- 3) Arched windows on front facade -----------------------------------
    const winY = 0.12 + mainH * 0.5;
    const winZ = mainD * 0.5 + 0.01;
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue; // center is for the entrance
      parts.push(box(0.14, 0.22, 0.02, WINDOW, { x: i * 0.28, y: winY, z: winZ }));
      // arched top
      parts.push(cyl(0.07, 0.07, 0.02, 6, WINDOW, {
        x: i * 0.28, y: winY + 0.11, z: winZ, rx: HALF_PI, thetaLen: PI
      }));
    }

    // Central entrance arch
    parts.push(box(0.22, 0.32, 0.04, WINDOW, { x: 0, y: winY - 0.02, z: winZ + 0.02 }));
    parts.push(cyl(0.11, 0.11, 0.04, 6, WINDOW, {
      x: 0, y: winY + 0.14, z: winZ + 0.02, rx: HALF_PI, thetaLen: PI
    }));

    // ---- 4) Main roof (hip roof style) ---------------------------------------
    const roofY = 0.12 + mainH + 0.03;
    // Front and back slopes
    for (const s of [-1, 1]) {
      parts.push(box(mainW * 0.95, 0.06, mainD * 0.55, ROOF, {
        rx: s * 0.45,
        y: roofY + 0.14,
        z: s * mainD * 0.22,
        hex2: ROOF_D,
      }));
    }

    // ---- 5) Central clock tower (the hero element) ---------------------------
    const towerX = 0;
    const towerBase = roofY + 0.08;
    const towerW = 0.42;
    const towerH = 0.48;

    // Tower body
    parts.push(box(towerW, towerH, towerW, BRICK_D, {
      x: towerX, y: towerBase + towerH * 0.5, hex2: BRICK
    }));

    // White trim bands on tower
    parts.push(box(towerW + 0.02, 0.04, towerW + 0.02, TRIM, {
      x: towerX, y: towerBase + towerH * 0.3
    }));
    parts.push(box(towerW + 0.02, 0.04, towerW + 0.02, TRIM, {
      x: towerX, y: towerBase + towerH
    }));

    // Clock face on front of tower
    const clockY = towerBase + towerH * 0.7;
    const clockZ = towerW * 0.5 + 0.01;
    parts.push(cyl(0.12, 0.12, 0.02, 8, CLOCK, {
      x: towerX, y: clockY, z: clockZ, rx: HALF_PI
    }));
    // Clock hands (simple cross)
    parts.push(box(0.015, 0.08, 0.005, CLOCK_HANDS, {
      x: towerX, y: clockY, z: clockZ + 0.015
    }));
    parts.push(box(0.06, 0.015, 0.005, CLOCK_HANDS, {
      x: towerX, y: clockY, z: clockZ + 0.015
    }));

    // ---- 6) Tower roof (pyramidal with finial) -------------------------------
    const towerRoofY = towerBase + towerH + 0.02;
    parts.push(cone(towerW * 0.7, 0.32, 4, ROOF, {
      x: towerX, y: towerRoofY + 0.16, ry: PI / 4, hex2: ROOF_D
    }));

    // Finial on top
    parts.push(cyl(0.02, 0.03, 0.08, 5, TRIM, {
      x: towerX, y: towerRoofY + 0.36
    }));
    parts.push(cone(0.04, 0.06, 5, ROOF_D, {
      x: towerX, y: towerRoofY + 0.43
    }));

    // ---- 7) Side wings -------------------------------------------------------
    for (const sx of [-1, 1]) {
      const wingX = sx * 0.85;
      // Small wing tower
      parts.push(box(0.28, 0.3, 0.28, BRICK_D, {
        x: wingX, y: roofY + 0.15, hex2: BRICK
      }));
      // Wing tower roof
      parts.push(cone(0.22, 0.18, 4, ROOF, {
        x: wingX, y: roofY + 0.39, ry: PI / 4
      }));
    }

    return finish(parts);
  },
};

export default NM_HSINCHU_STATION;
