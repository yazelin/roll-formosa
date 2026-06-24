/**
 * @file packs/miaoli/landmarks/gongguan_tung_trail.js — Roll Formosa Miaoli pack.
 *
 * NM_GONGGUAN_TUNG_TRAIL — 公館桐花步道 (Gongguan Tung Blossom Trail), one of
 * Miaoli's famous trails for viewing 油桐花 (tung tree blossoms) in late April
 * to early May. The trail in 公館鄉 winds through hillsides covered with tung
 * trees that bloom white flowers, creating a "May snow" (五月雪) effect. Fallen
 * petals carpet the path in white, a signature Hakka county spring spectacle.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Gongguan Tung Trail materials.
const WHITE = 0xf8f4f0; // tung blossoms (白色油桐花)
const WHITE_D = 0xe8e4e0; // shadowed white
const CREAM = 0xfff8e8; // lighter blossom
const GREEN = 0x3a6a3a; // tung tree foliage
const GREEN_D = 0x285028; // darker canopy
const GREEN_L = 0x4a7a4a; // lighter green
const BARK = 0x5a4030; // tree trunk bark
const BARK_D = 0x402820; // darker bark
const PATH = 0xb0a080; // dirt trail path
const PATH_D = 0x908060; // darker path
const SOIL = 0x6a5040; // forest floor
const FALLEN = 0xf0ece8; // fallen petals on ground

export const NM_GONGGUAN_TUNG_TRAIL = {
  id: 'gongguan_tung_trail',
  landmarkId: 5,
  name: '公館桐花步道',
  dioramaRHint: 80, // ~ trail area footprint radius in metres
  colorHex: 0xf8f4f0, // signature white blossom color
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    // ---- Forest floor / hillside base --------------------------------------
    parts.push(
      box(4.0, 0.12, 3.0, SOIL, { y: 0.06, hex2: 0x584838 })
    );

    // ---- Winding trail path ------------------------------------------------
    // Main path curves through the scene
    parts.push(
      box(0.6, 0.05, 2.8, PATH, { y: 0.1, x: -0.3, hex2: PATH_D })
    );
    // Path curve segment
    parts.push(
      box(1.2, 0.05, 0.5, PATH, {
        y: 0.1,
        x: 0.3,
        z: 1.0,
        ry: 0.3,
        hex2: PATH_D,
      })
    );

    // ---- Fallen petals on the path (五月雪 "May snow") ---------------------
    for (let i = 0; i < 8; i++) {
      const px = -0.3 + (rng() - 0.5) * 0.5;
      const pz = -1.2 + i * 0.35 + (rng() - 0.5) * 0.2;
      parts.push(
        box(0.25, 0.02, 0.2, FALLEN, {
          y: 0.11,
          x: px,
          z: pz,
          ry: rng() * PI,
        })
      );
    }

    // ---- Tung trees (油桐) lining the trail --------------------------------
    /**
     * Helper: create a blooming tung tree
     * @param {number} cx tree center x
     * @param {number} cz tree center z
     * @param {number} treeH tree height
     */
    function tungTree(cx, cz, treeH) {
      // Tree trunk
      parts.push(
        cyl(0.08, 0.1, treeH * 0.5, 6, BARK, {
          x: cx,
          y: 0.12 + treeH * 0.25,
          z: cz,
          hex2: BARK_D,
        })
      );

      // Canopy (green foliage)
      parts.push(
        ico(treeH * 0.35, 1, GREEN, {
          x: cx,
          y: 0.12 + treeH * 0.65,
          z: cz,
          hex2: GREEN_D,
        })
      );

      // White tung blossoms clustered on canopy
      const blossomCount = 3 + Math.floor(rng() * 3);
      for (let b = 0; b < blossomCount; b++) {
        const bx = cx + (rng() - 0.5) * treeH * 0.4;
        const by = 0.12 + treeH * 0.6 + rng() * treeH * 0.25;
        const bz = cz + (rng() - 0.5) * treeH * 0.4;
        const blossomColor = rng() > 0.3 ? WHITE : CREAM;
        parts.push(
          sph(0.08 + rng() * 0.04, blossomColor, {
            ws: 5,
            hs: 4,
            x: bx,
            y: by,
            z: bz,
            hex2: WHITE_D,
          })
        );
      }
    }

    // Place tung trees along the trail
    tungTree(-1.2, -0.8, 1.2);
    tungTree(-1.0, 0.6, 1.0);
    tungTree(-1.4, 1.3, 1.1);
    tungTree(0.8, -0.5, 1.3);
    tungTree(1.0, 0.3, 0.9);
    tungTree(0.6, 1.2 + r, 1.1);

    // ---- Background tree (larger, further) ---------------------------------
    parts.push(
      cyl(0.12, 0.15, 0.8, 6, BARK, {
        x: 1.6,
        y: 0.12 + 0.4,
        z: -0.2,
        hex2: BARK_D,
      })
    );
    parts.push(
      ico(0.5, 1, GREEN_D, {
        x: 1.6,
        y: 0.12 + 1.0,
        z: -0.2,
        hex2: 0x1a3018,
      })
    );

    // ---- Trail marker / signpost -------------------------------------------
    parts.push(
      box(0.06, 0.5, 0.06, BARK, {
        x: 0.1,
        y: 0.12 + 0.25,
        z: -1.2,
      })
    );
    parts.push(
      box(0.25, 0.12, 0.04, 0xc0a060, {
        x: 0.1,
        y: 0.12 + 0.45,
        z: -1.2,
      })
    );

    // ---- Fallen petals scattered around trees ------------------------------
    for (let i = 0; i < 6; i++) {
      const fx = -1.0 + rng() * 2.0;
      const fz = -0.5 + rng() * 1.5;
      parts.push(
        sph(0.03, WHITE, {
          ws: 4,
          hs: 3,
          x: fx,
          y: 0.13,
          z: fz,
        })
      );
    }

    return finish(parts);
  },
};

export default NM_GONGGUAN_TUNG_TRAIL;
