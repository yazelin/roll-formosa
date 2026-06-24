/**
 * @file packs/kinmen/landmarks/kinmen_national_park.js — Roll Formosa Kinmen pack.
 *
 * 金門國家公園 (Kinmen National Park). Taiwan's sixth national park,
 * featuring historic battlefields, traditional villages, and unique ecology.
 * Represented by the visitor center and a symbolic wetland landscape.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

const BUILDING_CREAM = 0xf0e6d0;
const BUILDING_ACCENT = 0xe0d4c0;
const ROOF_BROWN = 0x6a4a2a;
const GRASS_GREEN = 0x4a7a3a;
const GRASS_LIGHT = 0x6a9a5a;
const WATER_BLUE = 0x4a7a9a;
const WOOD_BROWN = 0x5a4020;
const PATH_TAN = 0xc0a080;
const BIRD_WHITE = 0xf8f8f8;

export const NM_KINMEN_NATIONAL_PARK = {
  id: 'kinmen_national_park',
  name: '金門國家公園',
  landmarkId: 6,
  dioramaRHint: 30,
  colorHex: GRASS_GREEN,

  buildGeometry(rng) {
    const parts = [];

    // Ground base with varied terrain
    parts.push(box(2.4, 0.08, 2.0, GRASS_GREEN, { y: 0.04, hex2: GRASS_LIGHT }));

    // Wetland pond
    parts.push(sph(0.5, WATER_BLUE, { ws: 8, hs: 4, x: 0.6, z: 0.4, y: 0.06, sy: 0.1, hex2: 0x3a6a8a }));

    // Visitor center building
    parts.push(box(0.7, 0.35, 0.5, BUILDING_CREAM, { y: 0.255, z: -0.5, x: -0.4, hex2: BUILDING_ACCENT }));
    // Sloped roof
    parts.push(box(0.8, 0.08, 0.55, ROOF_BROWN, { y: 0.47, z: -0.5, x: -0.4 }));
    parts.push(cone(0.3, 0.15, 4, ROOF_BROWN, { y: 0.54, z: -0.5, x: -0.4, ry: PI / 4 }));
    // Entrance
    parts.push(box(0.15, 0.22, 0.02, 0x4a3020, { y: 0.2, z: -0.24, x: -0.4 }));
    // Windows
    parts.push(box(0.08, 0.1, 0.02, 0x6a9ac0, { y: 0.28, z: -0.24, x: -0.55 }));
    parts.push(box(0.08, 0.1, 0.02, 0x6a9ac0, { y: 0.28, z: -0.24, x: -0.25 }));

    // Wooden boardwalk through wetland
    parts.push(box(0.12, 0.04, 0.9, WOOD_BROWN, { y: 0.1, x: 0.3, z: 0.1 }));
    parts.push(box(0.5, 0.04, 0.1, WOOD_BROWN, { y: 0.1, x: 0.5, z: 0.55 }));

    // Bird observation hut
    parts.push(box(0.25, 0.2, 0.2, WOOD_BROWN, { y: 0.18, x: 0.75, z: 0.55 }));
    parts.push(box(0.3, 0.05, 0.25, ROOF_BROWN, { y: 0.32, x: 0.75, z: 0.55 }));

    // Migratory birds (egrets on water)
    parts.push(cone(0.03, 0.08, 4, BIRD_WHITE, { y: 0.15, x: 0.5, z: 0.35, rx: -0.1 }));
    parts.push(cone(0.03, 0.07, 4, BIRD_WHITE, { y: 0.14, x: 0.7, z: 0.5, rx: -0.1 }));

    // Trees / vegetation
    // Casuarina trees (typical Kinmen)
    for (let i = 0; i < 3; i++) {
      const tx = -0.8 + i * 0.3 + (rng() - 0.5) * 0.1;
      const tz = 0.4 + (rng() - 0.5) * 0.2;
      parts.push(cyl(0.03, 0.02, 0.25, 4, 0x4a3020, { x: tx, z: tz, y: 0.2 }));
      parts.push(cone(0.12, 0.35, 6, 0x2a5a2a, { x: tx, z: tz, y: 0.42, hex2: 0x3a6a3a }));
    }

    // Path from parking to center
    parts.push(box(0.15, 0.02, 0.6, PATH_TAN, { y: 0.06, x: -0.4, z: 0.2 }));

    // Park entrance sign
    parts.push(box(0.25, 0.15, 0.04, 0x4a3a2a, { y: 0.15, z: 0.75, x: 0 }));
    parts.push(box(0.05, 0.2, 0.04, 0x4a3a2a, { y: 0.1, z: 0.75, x: -0.15 }));
    parts.push(box(0.05, 0.2, 0.04, 0x4a3a2a, { y: 0.1, z: 0.75, x: 0.15 }));

    // Bench near pond
    parts.push(box(0.2, 0.06, 0.08, WOOD_BROWN, { y: 0.11, x: 0.15, z: 0.7 }));

    return finish(parts);
  },
};

export default NM_KINMEN_NATIONAL_PARK;
