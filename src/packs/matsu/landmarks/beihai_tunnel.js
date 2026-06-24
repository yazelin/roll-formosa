/**
 * @file packs/matsu/landmarks/beihai_tunnel.js — Roll Formosa Matsu pack.
 *
 * 北海坑道 (Beihai Tunnel). A famous sea-level military tunnel carved through
 * granite during the Cold War for hiding small boats. The tunnel entrance is
 * a dramatic arch cut into the cliff face, opening to a flooded passageway
 * that glows blue-green from the water. Now a tourist attraction famous for
 * kayaking and the "blue tears" phenomenon.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS.
 * <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the坑道 granite tunnel at sea level.
const GRANITE_DARK = 0x4a4a4a; // dark granite cliff
const GRANITE_MID = 0x5a5a5a; // mid-tone granite
const GRANITE_LIGHT = 0x6a6a6a; // lighter granite surfaces
const WATER_DARK = 0x0a2030; // dark tunnel water
const WATER_GLOW = 0x1a5a7a; // glowing blue-green water
const TUNNEL_DARK = 0x1a1a1a; // deep tunnel interior
const CONCRETE = 0x707070; // reinforced sections

export const NM_BEIHAI_TUNNEL = {
  id: 'beihai_tunnel',
  name: '北海坑道',
  landmarkId: 3,
  dioramaRHint: 15, // tunnel entrance in cliff ~30m scene
  colorHex: WATER_GLOW, // the signature glowing tunnel water

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Ocean water base -----------------------------------------------
    parts.push(box(2.2, 0.10, 1.8, WATER_DARK, { y: 0.05, hex2: WATER_GLOW }));

    // ---- 2) Granite cliff face (the tunnel is carved into this) ------------
    // Main cliff mass - tall and imposing
    parts.push(box(1.6, 0.90, 0.7, GRANITE_DARK, { y: 0.55, z: -0.35, hex2: GRANITE_MID }));
    // Cliff top - irregular
    parts.push(sph(0.6, GRANITE_MID, { ws: 6, hs: 4, y: 1.0, z: -0.4, sy: 0.3, hex2: GRANITE_LIGHT }));
    // Side cliff extensions
    parts.push(box(0.4, 0.7, 0.5, GRANITE_DARK, { x: -0.85, y: 0.45, z: -0.2, hex2: GRANITE_MID }));
    parts.push(box(0.35, 0.65, 0.5, GRANITE_DARK, { x: 0.82, y: 0.42, z: -0.25, hex2: GRANITE_MID }));

    // ---- 3) Tunnel entrance arch (the hero feature) ------------------------
    // Create the arch opening - a dark recessed area
    // Arch frame - concrete reinforced
    parts.push(cyl(0.28, 0.28, 0.15, 8, CONCRETE, {
      y: 0.38, z: 0.0, rx: HALF_PI, thetaLen: PI, theta0: 0,
    })); // top arch
    // Dark tunnel interior
    parts.push(cyl(0.24, 0.24, 0.4, 8, TUNNEL_DARK, {
      y: 0.36, z: -0.15, rx: HALF_PI, thetaLen: PI, theta0: 0,
    }));
    // Tunnel walls going back
    parts.push(box(0.48, 0.35, 0.35, TUNNEL_DARK, { y: 0.28, z: -0.20 }));

    // ---- 4) Glowing water inside tunnel ------------------------------------
    parts.push(box(0.40, 0.06, 0.50, WATER_GLOW, { y: 0.13, z: -0.10, hex2: 0x2a7a9a }));

    // ---- 5) Walkway / dock at tunnel entrance ------------------------------
    parts.push(box(0.65, 0.06, 0.20, CONCRETE, { y: 0.13, z: 0.30, x: -0.35 }));
    // Railing posts
    for (let i = 0; i < 3; i++) {
      parts.push(cyl(0.02, 0.02, 0.15, 4, 0x808080, {
        x: -0.55 + i * 0.15, y: 0.23, z: 0.38,
      }));
    }

    // ---- 6) Rocky outcrops in water ----------------------------------------
    parts.push(sph(0.12, GRANITE_MID, { ws: 5, hs: 4, x: 0.6, y: 0.12, z: 0.5, sy: 0.5 }));
    parts.push(sph(0.09, GRANITE_DARK, { ws: 4, hs: 3, x: -0.7, y: 0.10, z: 0.6, sy: 0.4 }));

    // ---- 7) Cliff texture / cracks -----------------------------------------
    for (let i = 0; i < 4; i++) {
      const x = (rng() - 0.5) * 1.2;
      const y = 0.3 + rng() * 0.5;
      parts.push(box(0.02, 0.15 + rng() * 0.1, 0.03, GRANITE_LIGHT, {
        x, y, z: -0.01, hex2: GRANITE_MID,
      }));
    }

    return finish(parts);
  },
};

export default NM_BEIHAI_TUNNEL;
