/**
 * @file packs/kinmen/landmarks/mashan_observation.js — Roll Formosa Kinmen pack.
 *
 * 馬山觀測所 (Mashan Observation Post). A military observation post at the
 * northernmost point of Kinmen, only 2km from mainland China. Features a
 * tunnel leading to an observation bunker overlooking the strait.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

const CONCRETE = 0x707070;
const CONCRETE_DARK = 0x505050;
const BUNKER_GREEN = 0x3a4a3a;
const CAMOUFLAGE_TAN = 0x8a7a5a;
const TUNNEL_DARK = 0x1a1a1a;
const GLASS = 0x4a6a8a;
const METAL_GREY = 0x5a5a5a;

export const NM_MASHAN_OBSERVATION = {
  id: 'mashan_observation',
  name: '馬山觀測所',
  landmarkId: 4,
  dioramaRHint: 18,
  colorHex: BUNKER_GREEN,

  buildGeometry(rng) {
    const parts = [];

    // Hillside base
    parts.push(sph(0.9, 0x5a7a4a, { ws: 7, hs: 5, y: 0.2, sy: 0.3, sz: 0.8, hex2: 0x4a6a3a }));

    // Tunnel entrance (built into hillside)
    parts.push(box(0.4, 0.35, 0.3, CONCRETE, { y: 0.35, z: 0.55, hex2: CONCRETE_DARK }));
    parts.push(box(0.25, 0.28, 0.1, TUNNEL_DARK, { y: 0.32, z: 0.62 })); // entrance
    // Tunnel extends back
    parts.push(box(0.28, 0.26, 0.5, TUNNEL_DARK, { y: 0.31, z: 0.25 }));

    // Main observation bunker (emerges from hill, facing the sea)
    parts.push(box(0.8, 0.35, 0.5, BUNKER_GREEN, { y: 0.55, z: -0.25, hex2: CAMOUFLAGE_TAN }));
    // Observation windows (narrow slits)
    parts.push(box(0.5, 0.08, 0.02, GLASS, { y: 0.6, z: 0.0 }));
    parts.push(box(0.15, 0.06, 0.02, GLASS, { y: 0.6, z: 0.0, x: -0.25 }));
    parts.push(box(0.15, 0.06, 0.02, GLASS, { y: 0.6, z: 0.0, x: 0.25 }));

    // Roof with camouflage
    parts.push(box(0.85, 0.08, 0.55, CAMOUFLAGE_TAN, { y: 0.76, z: -0.25, hex2: BUNKER_GREEN }));

    // Antenna / surveillance equipment
    parts.push(cyl(0.02, 0.02, 0.4, 4, METAL_GREY, { y: 1.0, z: -0.25 }));
    parts.push(box(0.15, 0.04, 0.08, METAL_GREY, { y: 1.15, z: -0.25 }));

    // Guard post / entrance structure
    parts.push(box(0.25, 0.3, 0.2, CONCRETE, { y: 0.33, z: 0.85, x: 0.3 }));
    parts.push(box(0.28, 0.04, 0.22, CONCRETE_DARK, { y: 0.5, z: 0.85, x: 0.3 }));

    // Barrier / gate
    parts.push(cyl(0.02, 0.02, 0.2, 4, 0xc41e3a, { y: 0.28, z: 0.7, x: -0.15, rz: HALF_PI }));

    // Warning signs (small boxes)
    parts.push(box(0.1, 0.08, 0.02, 0xffff00, { y: 0.35, z: 0.65, x: 0.0 }));

    // Ocean / sea at front
    parts.push(box(2.0, 0.04, 0.4, 0x2a4a6a, { y: 0.02, z: -0.7 }));

    return finish(parts);
  },
};

export default NM_MASHAN_OBSERVATION;
