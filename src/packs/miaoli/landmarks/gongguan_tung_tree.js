/**
 * @file packs/miaoli/landmarks/gongguan_tung_tree.js — Roll Formosa Miaoli pack.
 *
 * NM_GONGGUAN_TUNG — 公館桐花步道 (Gongguan Tung Blossom Trail), one of the best
 * spots in Miaoli to see the "April Snow" (四月雪) — the oil tung tree blossoms
 * that blanket the mountains in white each spring. 公館鄉 is famous for these
 * trails through tung tree forests, with petals falling like snow. The trail
 * features mature tung trees (油桐樹), wooden walkways, and viewing platforms.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, sph, ico, finish, PI } from '../geomHelpers.js';

// Palette — Gongguan Tung Blossom Trail materials.
const TRUNK = 0x5a4030; // tree trunk brown
const TRUNK_D = 0x3a2820; // darker trunk
const LEAF = 0x4a8a4a; // green leaves
const LEAF_D = 0x2a5a2a; // darker leaves
const BLOSSOM = 0xffffff; // white tung blossoms
const BLOSSOM_P = 0xfff0f5; // pinkish-white petals
const WOOD = 0x9a7a50; // wooden walkway
const WOOD_D = 0x6a5030; // darker wood
const STONE = 0x908878; // stone path
const EARTH = 0x6a5a40; // earth/soil
const PETAL = 0xfaf8f0; // fallen petals on ground

export const NM_GONGGUAN_TUNG = {
  id: 'gongguan_tung',
  name: '公館桐花步道',
  dioramaRHint: 55, // ~ trail area footprint radius in metres
  colorHex: 0xffffff, // signature white tung blossoms
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Ground / earth base with fallen petals --------------------------
    parts.push(
      box(3.5, 0.1, 2.5, EARTH, { y: 0.05, hex2: 0x5a4a30 })
    );

    // Fallen petals on the ground (the "April snow" carpet)
    for (let i = 0; i < 4; i++) {
      const px = (rng() - 0.5) * 2.5;
      const pz = (rng() - 0.5) * 1.8;
      parts.push(
        box(0.4 + rng() * 0.3, 0.02, 0.35 + rng() * 0.2, PETAL, {
          x: px,
          y: 0.11,
          z: pz,
          ry: rng() * PI,
        })
      );
    }

    // ---- Wooden walkway through the forest -------------------------------
    const walkwayY = 0.1;

    // Main boardwalk
    parts.push(
      box(2.8, 0.06, 0.45, WOOD, {
        y: walkwayY + 0.03,
        z: -0.4,
        hex2: WOOD_D,
      })
    );

    // Walkway support posts (reduced from 7 to 4)
    for (let i = -1; i <= 2; i++) {
      parts.push(
        cyl(0.04, 0.04, 0.12, 4, WOOD_D, {
          x: i * 0.7,
          y: walkwayY - 0.03,
          z: -0.4,
        })
      );
    }

    // Wooden railing on one side (reduced from 7 to 4)
    for (let i = -1; i <= 2; i++) {
      parts.push(
        cyl(0.025, 0.025, 0.25, 4, WOOD, {
          x: i * 0.7,
          y: walkwayY + 0.06 + 0.125,
          z: -0.6,
        })
      );
    }
    parts.push(
      box(2.6, 0.03, 0.04, WOOD, {
        y: walkwayY + 0.06 + 0.22,
        z: -0.6,
      })
    );

    // ---- Oil tung trees (油桐樹) with white blossoms (reduced from 4 to 3)
    const treePositions = [
      { x: -1.0, z: 0.5 },
      { x: 0.4, z: 0.7 },
      { x: 1.0, z: 0.2 },
    ];

    for (const pos of treePositions) {
      const treeH = 0.9 + rng() * 0.3;
      const canopyR = 0.4 + rng() * 0.15;

      // Tree trunk
      parts.push(
        cyl(0.06, 0.08, treeH * 0.6, 5, TRUNK, {
          x: pos.x,
          y: walkwayY + treeH * 0.3,
          z: pos.z,
          hex2: TRUNK_D,
        })
      );

      // Green leaf canopy with blossoms (combined for fewer primitives)
      parts.push(
        ico(canopyR, 0, LEAF, {
          x: pos.x,
          y: walkwayY + treeH * 0.7,
          z: pos.z,
          hex2: LEAF_D,
        })
      );

      // White tung blossoms covering the canopy
      parts.push(
        sph(canopyR * 1.1, BLOSSOM, {
          ws: 5,
          hs: 3,
          x: pos.x + (rng() - 0.5) * 0.1,
          y: walkwayY + treeH * 0.75,
          z: pos.z,
          hex2: BLOSSOM_P,
        })
      );
    }

    // ---- Viewing platform / rest area ------------------------------------
    parts.push(
      box(0.6, 0.08, 0.5, WOOD, {
        x: 1.4,
        y: walkwayY + 0.04,
        z: -0.3 + r,
        hex2: WOOD_D,
      })
    );

    // Bench on the platform
    parts.push(
      box(0.4, 0.08, 0.15, WOOD, {
        x: 1.4,
        y: walkwayY + 0.08 + 0.04,
        z: -0.35,
      })
    );
    // Bench legs
    for (const dx of [-0.12, 0.12]) {
      parts.push(
        box(0.04, 0.08, 0.12, WOOD_D, {
          x: 1.4 + dx,
          y: walkwayY + 0.04,
          z: -0.35,
        })
      );
    }

    // ---- Trail marker stone ----------------------------------------------
    parts.push(
      box(0.12, 0.25, 0.08, STONE, {
        x: -1.4,
        y: walkwayY + 0.125,
        z: -0.5,
      })
    );

    return finish(parts);
  },
};

export default NM_GONGGUAN_TUNG;
