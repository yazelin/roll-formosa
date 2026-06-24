/**
 * @file packs/miaoli/landmarks/mingde_reservoir.js — Roll Formosa Miaoli pack.
 *
 * NM_MINGDE_RESERVOIR — 明德水庫 (Mingde Reservoir), a scenic dam and reservoir
 * located in 頭屋鄉 Touyu Township. Built in 1970, it provides water supply
 * and flood control for central Miaoli. The reservoir is known for its
 * beautiful lake scenery, the 日新島 (Rixin Island) accessible by suspension
 * bridge, and the surrounding hills. A popular spot for fishing, cycling,
 * and enjoying the lakeside 客家 cafes.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Mingde Reservoir materials.
const WATER = 0x4080c0; // reservoir water (blue)
const WATER_D = 0x3060a0; // deeper water shadow
const WATER_L = 0x50a0d0; // sunlit water surface
const CONCRETE = 0xa8a098; // dam concrete
const CONCRETE_D = 0x888078; // darker concrete
const GATE = 0x606068; // spillway gate metal
const MOUNTAIN = 0x4a7a4a; // green mountain slopes
const MOUNTAIN_D = 0x2a5a2a; // darker mountain
const BRIDGE = 0xc04030; // suspension bridge (red)
const BRIDGE_D = 0x902020; // darker bridge
const DECK = 0x9a8a6a; // bridge deck wood
const ISLAND = 0x5a8a5a; // island vegetation
const WHITE = 0xf0ece8; // white railings / structures
const SOIL = 0x786048; // shoreline / exposed earth
const CABLE = 0x505050; // bridge cables

export const NM_MINGDE_RESERVOIR = {
  id: 'mingde_reservoir',
  landmarkId: 7,
  name: '明德水庫',
  dioramaRHint: 120, // ~ reservoir area footprint radius in metres
  colorHex: 0x4080c0, // signature reservoir blue water
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Reservoir water body --------------------------------------------
    parts.push(
      box(3.5, 0.15, 2.2, WATER, { y: 0.075, hex2: WATER_D })
    );

    // ---- Dam structure (concrete gravity dam) ----------------------------
    const damY = 0.15;
    const damW = 2.0;
    const damH = 0.7;
    const damD = 0.4;

    // Main dam wall (curved slightly - approximated as angled sections)
    parts.push(
      box(damW, damH, damD, CONCRETE, {
        y: damY + damH / 2,
        z: -0.85,
        hex2: CONCRETE_D,
      })
    );

    // Dam buttress / downstream face (sloped)
    parts.push(
      box(damW, damH * 0.8, damD * 0.5, CONCRETE_D, {
        y: damY + damH * 0.4,
        z: -0.85 - damD / 2 - 0.1,
        hex2: CONCRETE,
      })
    );

    // Spillway gates (three gates)
    for (let i = -1; i <= 1; i++) {
      const gx = i * 0.5;
      parts.push(
        box(0.35, 0.5, 0.08, GATE, {
          x: gx,
          y: damY + 0.25,
          z: -0.85 + damD / 2 + 0.04,
        })
      );
      // Gate frame
      parts.push(
        box(0.4, 0.06, 0.1, CONCRETE, {
          x: gx,
          y: damY + 0.52,
          z: -0.85 + damD / 2 + 0.04,
        })
      );
    }

    // Dam crest / roadway on top
    parts.push(
      box(damW + 0.2, 0.06, damD + 0.15, CONCRETE, {
        y: damY + damH + 0.03,
        z: -0.85,
      })
    );

    // Railings on dam crest
    for (const dz of [-1, 1]) {
      parts.push(
        box(damW, 0.12, 0.03, WHITE, {
          y: damY + damH + 0.12,
          z: -0.85 + dz * (damD / 2 + 0.05),
        })
      );
    }

    // ---- 日新島 (Rixin Island) in the reservoir ---------------------------
    const islandX = 0.6;
    const islandZ = 0.4;

    // Island base
    parts.push(
      cyl(0.35, 0.4, 0.12, 8, MOUNTAIN, {
        x: islandX,
        y: 0.21,
        z: islandZ,
        hex2: MOUNTAIN_D,
      })
    );

    // Island vegetation
    parts.push(
      sph(0.25, ISLAND, {
        ws: 6,
        hs: 4,
        x: islandX,
        y: 0.35,
        z: islandZ,
        hex2: MOUNTAIN,
      })
    );

    // Small pavilion on the island
    parts.push(
      cyl(0.12, 0.12, 0.15, 6, CONCRETE, {
        x: islandX + r,
        y: 0.35,
        z: islandZ,
        hex2: WHITE,
      })
    );
    parts.push(
      cone(0.18, 0.12, 6, 0x6a3a2a, {
        x: islandX,
        y: 0.48,
        z: islandZ,
      })
    );

    // ---- Suspension bridge (吊橋) to the island --------------------------
    const bridgeStartZ = -0.3;
    const bridgeEndZ = islandZ - 0.3;
    const bridgeLen = bridgeEndZ - bridgeStartZ;

    // Bridge towers
    for (const tz of [bridgeStartZ, bridgeEndZ]) {
      parts.push(
        cyl(0.04, 0.05, 0.45, 4, BRIDGE, {
          x: 0.1,
          y: 0.15 + 0.225,
          z: tz,
          hex2: BRIDGE_D,
        })
      );
    }

    // Main cables (catenary approximated as straight)
    parts.push(
      box(0.02, 0.02, bridgeLen * 1.1, BRIDGE_D, {
        x: 0.1,
        y: 0.15 + 0.4,
        z: (bridgeStartZ + bridgeEndZ) / 2,
      })
    );

    // Bridge deck
    parts.push(
      box(0.18, 0.04, bridgeLen, DECK, {
        x: 0.1,
        y: 0.17,
        z: (bridgeStartZ + bridgeEndZ) / 2,
      })
    );

    // Vertical suspenders
    for (let i = 0; i < 4; i++) {
      const sz = bridgeStartZ + 0.1 + i * (bridgeLen / 4);
      parts.push(
        cyl(0.01, 0.01, 0.2, 3, BRIDGE_D, {
          x: 0.1,
          y: 0.15 + 0.27,
          z: sz,
        })
      );
    }

    // ---- Surrounding mountains -------------------------------------------
    // Mountain backdrop
    for (const mx of [-1.3, -0.7, 1.1, 1.5]) {
      const mh = 0.5 + rng() * 0.3;
      parts.push(
        cone(0.4 + rng() * 0.2, mh, 6, MOUNTAIN, {
          x: mx,
          y: 0.15 + mh / 2,
          z: 0.85,
          hex2: MOUNTAIN_D,
        })
      );
    }

    // ---- Shoreline vegetation --------------------------------------------
    for (let i = 0; i < 3; i++) {
      const vx = -1.2 + i * 0.5;
      parts.push(
        sph(0.12, ISLAND, {
          ws: 5,
          hs: 3,
          x: vx,
          y: 0.21,
          z: 0.6,
          hex2: MOUNTAIN_D,
        })
      );
    }

    return finish(parts);
  },
};

export default NM_MINGDE_RESERVOIR;
