/**
 * @file packs/yilan/landmarks/yilan_station.js — Roll Formosa Yilan pack.
 *
 * 宜蘭火車站 (Yilan Railway Station). The whimsical station designed with
 * Jimmy Liao's (幾米) artwork themes — featuring a giant giraffe sculpture
 * and colorful murals, making it Taiwan's most artistic railway station.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette
const STATION_WALL = 0xe8e0d0; // cream station walls
const ROOF = 0x3a3a3a;         // dark roof
const GIRAFFE_BODY = 0xd4a020; // giraffe yellow
const GIRAFFE_SPOT = 0x6a4010; // giraffe spots
const WINDOW = 0x5080a0;       // blue windows
const PLATFORM = 0x909090;     // concrete platform
const GRASS = 0x4a7a3a;        // station garden

export const NM_YILAN_STATION = {
  id: 'yilan_station',
  name: '宜蘭火車站',
  landmarkId: 3,  // Yilan landmark #3 — dioramaRHint 30
  dioramaRHint: 30,
  colorHex: 0xd4a020, // giraffe yellow — the read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Station main building ------------------------------
    parts.push(box(0.9, 0.35, 0.5, STATION_WALL, { y: 0.25 }));
    // Roof
    parts.push(box(1.0, 0.06, 0.6, ROOF, { y: 0.46 }));

    // ---- 2) Windows --------------------------------------------
    for (let i = 0; i < 4; i++) {
      parts.push(
        box(0.12, 0.15, 0.02, WINDOW, {
          x: -0.3 + i * 0.2,
          y: 0.28,
          z: 0.26,
        })
      );
    }

    // ---- 3) Giant giraffe sculpture (幾米長頸鹿) ----------------
    // Body
    parts.push(
      cyl(0.08, 0.1, 0.3, 8, GIRAFFE_BODY, {
        x: 0.55,
        y: 0.25,
        z: 0.3,
      })
    );
    // Neck (tilted)
    parts.push(
      cyl(0.04, 0.05, 0.4, 6, GIRAFFE_BODY, {
        x: 0.55,
        y: 0.55,
        z: 0.25,
        rx: -0.3,
      })
    );
    // Head
    parts.push(
      sph(0.07, GIRAFFE_BODY, {
        x: 0.55,
        y: 0.78,
        z: 0.15,
      })
    );
    // Ears
    parts.push(cone(0.02, 0.05, 4, GIRAFFE_SPOT, { x: 0.50, y: 0.86, z: 0.14 }));
    parts.push(cone(0.02, 0.05, 4, GIRAFFE_SPOT, { x: 0.60, y: 0.86, z: 0.14 }));
    // Legs
    for (let i = 0; i < 4; i++) {
      const lx = 0.55 + (i % 2 === 0 ? -0.05 : 0.05);
      const lz = 0.3 + (i < 2 ? -0.05 : 0.05);
      parts.push(cyl(0.02, 0.025, 0.15, 5, GIRAFFE_BODY, { x: lx, y: 0.08, z: lz }));
    }

    // ---- 4) Platform -------------------------------------------
    parts.push(box(1.2, 0.06, 0.8, PLATFORM, { y: 0.03 }));

    // ---- 5) Station garden area --------------------------------
    parts.push(cyl(0.15, 0.15, 0.04, 8, GRASS, { x: -0.5, y: 0.05, z: 0.3 }));

    return finish(parts);
  },
};

export default NM_YILAN_STATION;
