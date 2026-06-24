/**
 * @file packs/nantou/collectibles/ropeway_gondola.js — Roll Formosa Nantou pack.
 *
 * 日月潭纜車 (Sun Moon Lake Cable Car) — collectibleId for nantou. A colorful
 * gondola/cable car capsule from the Sun Moon Lake Ropeway. Features:
 * - Rounded capsule shape
 * - Bright red/blue/yellow color options
 * - Windows and cable hanger
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * finish() merges → recenters → normalizes to a UNIT bounding sphere.
 * <= 350 triangles.
 */

import { sph, cyl, box, finish } from '../geomHelpers.js';

const BODY_RED = 0xc03030;     // red gondola body
const BODY_HI = 0xe04040;      // body highlight
const WINDOW = 0x88b8c8;       // glass windows (blue tint)
const FRAME = 0x404040;        // dark frame
const HANGER = 0x505050;       // cable hanger metal
const FLOOR = 0x303030;        // dark floor

export const COL_ROPEWAY_GONDOLA = {
  id: 'ropeway_gondola',
  name: '日月潭纜車',
  collectibleId: 10, // replaces maokong_gondola
  colorHex: 0xc03030,

  buildGeometry(rng) {
    const parts = [];
    const j = (rng ? rng() - 0.5 : 0) * 0.02;

    // --- Main capsule body (rounded box/ellipsoid) ---
    parts.push(sph(0.5, BODY_RED, { ws: 8, hs: 6, y: 0.4, sx: 0.8, sy: 0.9, sz: 0.7, hex2: BODY_HI }));

    // --- Window band (glass strip around middle) ---
    parts.push(cyl(0.42, 0.42, 0.25, 8, WINDOW, { y: 0.5, sx: 0.8, sz: 0.7 }));

    // --- Window frame (dark outline) ---
    parts.push(cyl(0.44, 0.44, 0.04, 8, FRAME, { y: 0.38, sx: 0.8, sz: 0.7 }));
    parts.push(cyl(0.44, 0.44, 0.04, 8, FRAME, { y: 0.62, sx: 0.8, sz: 0.7 }));

    // --- Floor base ---
    parts.push(box(0.55, 0.06, 0.5, FLOOR, { y: -0.02 }));

    // --- Roof (top of capsule) ---
    parts.push(sph(0.35, BODY_RED, { ws: 6, hs: 4, y: 0.85 + j, sy: 0.5, hex2: BODY_HI }));

    // --- Cable hanger arm ---
    parts.push(cyl(0.04, 0.04, 0.3, 6, HANGER, { y: 1.1 }));
    // Hanger wheel housing
    parts.push(box(0.12, 0.08, 0.08, HANGER, { y: 1.28 }));

    // --- Corner accent stripes ---
    for (const sx of [-1, 1]) {
      parts.push(box(0.03, 0.6, 0.02, FRAME, { x: sx * 0.38, y: 0.4, z: 0.34 }));
    }

    return finish(parts);
  },
};

export default COL_ROPEWAY_GONDOLA;
