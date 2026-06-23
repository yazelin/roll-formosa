/**
 * @file packs/newtaipei/collectibles/miner_lamp.js — Roll Formosa New Taipei pack, COLLECTIBLE.
 *
 * COL_MINER_LAMP — 礦工燈 (Miner's Lamp). Representing the coal mining heritage
 * of the Pingxi/Jiufen/Jinguashi area. A classic carbide or oil miner's lamp
 * with a reflector, brass body, hook for hanging on helmet, and a glowing
 * flame/bulb. Evokes the region's gold and coal mining history.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, sph, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const BRASS = 0xc8a040;      // polished brass body
const BRASS_DK = 0xa08030;   // darker brass shadow
const STEEL = 0x707880;      // steel parts
const REFLECTOR = 0xe0e0e0;  // shiny reflector
const FLAME = 0xffc840;      // carbide flame glow
const GLASS = 0xd0e8f0;      // protective glass

export const COL_MINER_LAMP = {
  id: 'miner_lamp',
  name: '礦工燈',
  colorHex: BRASS, // brass read color

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Main brass body (fuel chamber) -----------------------------
    parts.push(cyl(0.35, 0.38, 0.5, 10, BRASS, { y: 0.25, hex2: BRASS_DK }));
    // Base
    parts.push(cyl(0.4, 0.4, 0.06, 10, BRASS_DK, { y: 0.03 }));
    // Top rim
    parts.push(cyl(0.4, 0.38, 0.05, 10, BRASS, { y: 0.52 }));

    // ---- 2) Upper chamber (water chamber for carbide) ------------------
    parts.push(cyl(0.32, 0.35, 0.25, 10, BRASS, { y: 0.67, hex2: 0xd8b050 }));
    // Control knob on side
    parts.push(cyl(0.06, 0.06, 0.12, 6, STEEL, {
      x: 0.38, y: 0.7, z: 0,
      rz: HALF_PI,
    }));
    parts.push(sph(0.05, BRASS_DK, { ws: 5, hs: 3, x: 0.45, y: 0.7, z: 0 }));

    // ---- 3) Burner tip and flame ---------------------------------------
    parts.push(cyl(0.08, 0.1, 0.1, 8, STEEL, { y: 0.85 }));
    // Burner nozzle
    parts.push(cyl(0.04, 0.05, 0.06, 6, BRASS, { y: 0.93 }));
    // Flame
    parts.push(sph(0.06, FLAME, { ws: 6, hs: 4, y: 1.0 }));
    parts.push(cone(0.04, 0.1, 6, 0xffa020, { y: 1.08 })); // flame tip

    // ---- 4) Reflector (parabolic dish behind flame) --------------------
    // Reflector disc
    parts.push(cyl(0.28, 0.32, 0.04, 10, REFLECTOR, {
      y: 0.9, z: -0.15,
      rx: -0.3,
    }));
    // Concave inner surface
    parts.push(sph(0.22, 0xf8f8f8, {
      ws: 8, hs: 4,
      y: 0.9, z: -0.12,
      rx: -0.3,
      thetaLen: HALF_PI * 0.5,
    }));

    // ---- 5) Protective glass chimney -----------------------------------
    parts.push(cyl(0.12, 0.1, 0.2, 8, GLASS, {
      y: 1.0,
      open: true,
    }));

    // ---- 6) Hook for helmet attachment ---------------------------------
    // Curved hook at top
    parts.push(cyl(0.03, 0.03, 0.15, 6, STEEL, { y: 1.15 }));
    // Hook curve (quarter torus)
    parts.push(cyl(0.04, 0.04, 0.08, 6, STEEL, {
      x: 0.06, y: 1.26,
      rz: -0.8,
    }));
    parts.push(sph(0.035, STEEL, { ws: 4, hs: 3, x: 0.12, y: 1.28 }));

    // ---- 7) Carry handle (bail handle) ---------------------------------
    // Wire handle arching over the top
    parts.push(cyl(0.02, 0.02, 0.25, 4, STEEL, {
      x: -0.25, y: 0.7,
      rz: 0.4,
    }));
    parts.push(cyl(0.02, 0.02, 0.25, 4, STEEL, {
      x: 0.25, y: 0.7,
      rz: -0.4,
    }));
    // Handle top bar
    parts.push(cyl(0.02, 0.02, 0.3, 4, STEEL, {
      y: 0.95,
      rz: HALF_PI,
    }));

    return finish(parts);
  },
};

export default COL_MINER_LAMP;
