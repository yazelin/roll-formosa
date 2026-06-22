/**
 * @file packs/taoyuan/landmarks/shimen_reservoir.js — Roll Formosa Taoyuan pack.
 *
 * 石門水庫 (Shimen Reservoir) — the largest reservoir in northern Taiwan, built
 * in 1964. The dam structure is an arch dam with a distinctive curved concrete
 * face and spillway gates. It's an iconic landmark of Taoyuan, providing water
 * to the greater Taipei metropolitan area.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: warm concrete dam face, dark spillway gates, water blue.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const CONCRETE = 0xc8c0b0; // warm concrete dam face
const CONCRETE_D = 0xa8a090; // shadowed concrete
const CONCRETE_L = 0xe0d8c8; // sunlit concrete crest
const GATE = 0x3a4048; // dark steel spillway gates
const WATER = 0x4a7898; // reservoir water (blue-green)
const RAIL = 0x606870; // guardrail

export const NM_SHIMEN_RESERVOIR = {
  id: 'shimen_reservoir',
  name: '石門水庫',
  landmarkId: 7, // largest Taoyuan landmark (before goal)
  dioramaRHint: 200, // ~240 m wide dam structure
  colorHex: CONCRETE,

  buildGeometry(rng) {
    const parts = [];

    // === DAM STRUCTURE (curved arch dam) =====================================
    // Main curved dam body: wide, gently arched concrete wall
    parts.push(cyl(3.2, 3.2, 1.8, 16, CONCRETE, {
      rx: HALF_PI,
      theta0: -PI * 0.25,
      thetaLen: PI * 0.5,
      y: 0.9,
      z: -0.5,
      hex2: CONCRETE_L,
    }));

    // Dam crest (top road surface)
    parts.push(cyl(3.4, 3.4, 0.16, 16, CONCRETE_L, {
      rx: HALF_PI,
      theta0: -PI * 0.25,
      thetaLen: PI * 0.5,
      y: 1.82,
      z: -0.5,
    }));

    // Guardrail along dam crest
    parts.push(cyl(3.5, 3.5, 0.1, 16, RAIL, {
      rx: HALF_PI,
      theta0: -PI * 0.25,
      thetaLen: PI * 0.5,
      y: 1.92,
      z: -0.5,
      open: true,
    }));

    // === SPILLWAY GATES ======================================================
    // Three main spillway gates (the iconic feature)
    for (let i = 0; i < 3; i++) {
      const angle = (-0.12 + i * 0.12) * PI;
      const gx = Math.sin(angle) * 2.8;
      const gz = -0.5 + Math.cos(angle) * 2.8;
      parts.push(box(0.5, 1.2, 0.2, GATE, { x: gx, y: 0.7, z: gz, ry: angle }));
      // Gate pillars
      parts.push(box(0.12, 1.6, 0.12, CONCRETE_D, { x: gx - 0.35, y: 0.8, z: gz }));
      parts.push(box(0.12, 1.6, 0.12, CONCRETE_D, { x: gx + 0.35, y: 0.8, z: gz }));
    }

    // === CONTROL TOWER (spillway control building) ===========================
    parts.push(box(0.6, 0.8, 0.4, CONCRETE, { y: 2.2, z: -0.5, hex2: CONCRETE_L }));
    parts.push(box(0.7, 0.1, 0.5, CONCRETE_L, { y: 2.65 }));

    // === WATER SURFACE (reservoir side) ======================================
    parts.push(cyl(2.6, 2.6, 0.08, 12, WATER, {
      rx: HALF_PI,
      theta0: -PI * 0.2,
      thetaLen: PI * 0.4,
      y: 1.6,
      z: -1.8,
    }));

    // === DAM BASE / FOUNDATION ===============================================
    parts.push(box(4.5, 0.2, 2.0, CONCRETE_D, { y: 0.1 }));

    return finish(parts);
  },
};

export default NM_SHIMEN_RESERVOIR;
