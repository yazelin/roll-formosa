/**
 * @file packs/keelung/landmarks/keelung_station.js — Roll Formosa Keelung pack.
 *
 * 基隆火車站 — Keelung Railway Station, the northern terminus of Taiwan's
 * Western Line. The current station building features a modern design with
 * a distinctive curved roof resembling ocean waves, reflecting Keelung's
 * maritime identity as Taiwan's major northern port.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js). finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette
const STATION_BLUE = 0x3a6a8a;  // Blue-grey station exterior
const GLASS = 0x6ab8d8;          // Glass curtain wall
const STEEL = 0x8a9098;          // Steel structure
const ROOF_WHITE = 0xf0f4f6;     // White curved roof
const CONCRETE = 0xa8a4a0;       // Concrete base
const SIGN_RED = 0xc42a28;       // TRA red
const PLATFORM = 0x5a5a5e;       // Platform grey

export const NM_KEELUNG_STATION = {
  id: 'keelung_station',
  name: '基隆火車站',
  landmarkId: 3,
  dioramaRHint: 35,
  colorHex: STATION_BLUE,

  buildGeometry(rng) {
    const parts = [];

    // ---- Base platform ----
    parts.push(box(3.2, 0.2, 1.8, CONCRETE, { y: 0.1 }));
    parts.push(box(3.4, 0.08, 2.0, PLATFORM, { y: 0.24 }));

    // ---- Main station building ----
    // Two-story station body
    parts.push(box(2.6, 0.8, 1.4, STATION_BLUE, { y: 0.68 }));

    // Glass facade (front)
    parts.push(box(2.4, 0.6, 0.06, GLASS, { y: 0.62, z: 0.73 }));

    // Vertical mullions
    for (let i = -4; i <= 4; i++) {
      parts.push(box(0.04, 0.64, 0.08, STEEL, { x: i * 0.28, y: 0.62, z: 0.74 }));
    }

    // Horizontal bands
    parts.push(box(2.5, 0.08, 0.1, STEEL, { y: 0.36, z: 0.74 }));
    parts.push(box(2.5, 0.06, 0.1, STEEL, { y: 0.94, z: 0.74 }));

    // ---- Curved wave roof ----
    // Main wave-like roof sections
    parts.push(box(3.0, 0.1, 1.6, ROOF_WHITE, { y: 1.14 }));

    // Wave peaks (curved roof effect using multiple boxes)
    parts.push(box(2.8, 0.12, 0.5, ROOF_WHITE, { y: 1.22, z: 0.4 }));
    parts.push(box(2.6, 0.14, 0.4, ROOF_WHITE, { y: 1.3, z: 0.3 }));
    parts.push(box(2.8, 0.12, 0.5, ROOF_WHITE, { y: 1.22, z: -0.4 }));
    parts.push(box(2.6, 0.14, 0.4, ROOF_WHITE, { y: 1.3, z: -0.3 }));

    // Central ridge
    parts.push(box(2.4, 0.08, 0.2, ROOF_WHITE, { y: 1.38 }));

    // Roof edge trim
    parts.push(box(3.1, 0.04, 0.06, STEEL, { y: 1.16, z: 0.83 }));
    parts.push(box(3.1, 0.04, 0.06, STEEL, { y: 1.16, z: -0.83 }));

    // ---- Canopy over entrance ----
    parts.push(box(1.8, 0.06, 0.6, ROOF_WHITE, { y: 1.06, z: 1.1 }));
    // Canopy supports
    parts.push(cyl(0.05, 0.05, 0.78, 6, STEEL, { x: -0.7, y: 0.64, z: 1.0 }));
    parts.push(cyl(0.05, 0.05, 0.78, 6, STEEL, { x: 0.7, y: 0.64, z: 1.0 }));

    // ---- Station sign ----
    parts.push(box(0.8, 0.18, 0.04, SIGN_RED, { y: 0.98, z: 0.76 }));

    // ---- Side wings ----
    parts.push(box(0.5, 0.6, 1.2, STATION_BLUE, { x: 1.55, y: 0.58, hex2: GLASS }));
    parts.push(box(0.5, 0.6, 1.2, STATION_BLUE, { x: -1.55, y: 0.58, hex2: GLASS }));

    // Wing roofs
    parts.push(box(0.6, 0.08, 1.3, ROOF_WHITE, { x: 1.55, y: 0.92 }));
    parts.push(box(0.6, 0.08, 1.3, ROOF_WHITE, { x: -1.55, y: 0.92 }));

    return finish(parts);
  },
};

export default NM_KEELUNG_STATION;
