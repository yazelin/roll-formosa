/**
 * @file packs/tainan/landmarks/taipei101.js — Roll Formosa hero landmark.
 *
 * NM_TAIPEI101 — 林百貨, THE GOAL MONUMENT. Tainan's 1932 art-deco department
 * store, beloved as 「五層樓仔」(the six-storey block): a stocky, near-cubic
 * tan-tiled mass — taller than wide but emphatically NOT a slender tower. Its
 * facade is a regular grid of rectangular windows on every floor, ringed by
 * horizontal cornice bands of cream stone between floor groups. One front
 * corner is rounded into a curved entrance bay (a quarter-cylinder turret that
 * rises the full height). On the flat roof: a parapet railing, a small machine
 * room, a flagpole, and — the signature — a tiny rooftop shrine pavilion
 * (末廣社) rendered as a dark plinth under a small tiled roof.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, towerBanded, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Warm tan tiled facade (面磚) palette — the building's signature ochre tile,
// lightened toward the upper floors for the sunlit feel; cream stone cornices.
const TILE_LO = 0xb08c5c; // tan tile (lower floors, in shadow)
const TILE_HI = 0xc6a878; // warm ochre tile (upper floors, catching light)
const WIN = 0x4a4036; // dark recessed window
const WIN_LIT = 0xe8c87a; // warm lit window
const CORNICE = 0xe2d3b0; // cream stone cornice band
const ROOF_DK = 0x3a3026; // dark plinth / parapet
const SHRINE_ROOF = 0x5a4a3a; // shrine pavilion tiled roof (dark brown)
const STONE = 0xcfc2a4; // pale stone trim / machine room

export const NM_TAIPEI101 = {
  id: 'taipei101',
  name: '林百貨',
  landmarkId: 8,
  dioramaRHint: 508, // hero diorama hint (kept from goal-monument scale)
  colorHex: TILE_HI,

  buildGeometry(rng) {
    // goalTower.js calls buildGeometry(null) — guard rng for towerBanded.
    const _rng = typeof rng === 'function' ? rng : () => 0.5;
    const parts = [];

    // Stocky footprint: deeper in Z (front) than wide in X, six storeys tall.
    const W = 1.05; // width  (X)
    const D = 0.92; // depth  (Z)
    const FLOORS = 6;
    const bodyH = 1.7; // total body height — taller than wide, but blocky
    const bodyBot = 0.0;
    const bodyMid = bodyBot + bodyH / 2;

    // ---- 1) Ground plinth ---------------------------------------------------
    parts.push(box(W + 0.18, 0.14, D + 0.18, ROOF_DK, { y: 0.07 })); // street plinth
    parts.push(box(W + 0.06, 0.10, D + 0.06, STONE, { y: 0.19, hex2: CORNICE })); // base stone course

    // ---- 2) Main blocky body — tiled facade with window grid ----------------
    // towerBanded paints alternating wall/window rows per floor; rng lights some.
    parts.push(
      towerBanded(W, bodyH, D, FLOORS * 2, TILE_LO, WIN, WIN_LIT, _rng, {
        y: 0.24 + bodyMid,
      })
    ); // main facade

    const bodyTop = 0.24 + bodyH;

    // ---- 3) Horizontal cornice bands between floor groups -------------------
    // Cream stone string-courses that wrap the building (the art-deco banding).
    const corniceYs = [0.24 + bodyH * 0.34, 0.24 + bodyH * 0.67, bodyTop - 0.02];
    for (let i = 0; i < corniceYs.length; i++) {
      parts.push(box(W + 0.05, 0.06, D + 0.05, CORNICE, { y: corniceYs[i] })); // cornice band
    }
    // Slim vertical pilaster strips on the front (+Z) face for art-deco rhythm.
    for (let i = -1; i <= 1; i++) {
      parts.push(box(0.07, bodyH - 0.1, 0.05, CORNICE, { x: i * 0.34, y: 0.24 + bodyMid, z: D / 2 + 0.005 })); // pilaster
    }

    // ---- 4) Rounded corner entrance bay (curved turret) ---------------------
    // A quarter-cylinder hugging the +X/+Z front corner, rising the full height.
    const cx = W / 2 - 0.04;
    const cz = D / 2 - 0.04;
    const cornerR = 0.30;
    parts.push(
      cyl(cornerR, cornerR, bodyH + 0.06, 12, TILE_HI, {
        x: cx,
        z: cz,
        y: 0.24 + bodyMid,
        hex2: TILE_LO,
        theta0: 0,
        thetaLen: HALF_PI, // quarter wedge facing the +X/+Z corner
        ry: PI, // orient the open quarter outward toward the corner
      })
    ); // curved corner bay
    // Cream banding on the curved corner to match the cornices.
    parts.push(cyl(cornerR + 0.015, cornerR + 0.015, 0.05, 12, CORNICE, { x: cx, z: cz, y: corniceYs[0], theta0: 0, thetaLen: HALF_PI, ry: PI }));
    parts.push(cyl(cornerR + 0.015, cornerR + 0.015, 0.05, 12, CORNICE, { x: cx, z: cz, y: corniceYs[1], theta0: 0, thetaLen: HALF_PI, ry: PI }));
    // Corner entrance canopy at street level.
    parts.push(cyl(cornerR + 0.06, cornerR + 0.06, 0.05, 12, ROOF_DK, { x: cx, z: cz, y: 0.42, theta0: 0, thetaLen: HALF_PI, ry: PI }));

    // ---- 5) Flat roof + parapet railing -------------------------------------
    parts.push(box(W + 0.04, 0.06, D + 0.04, STONE, { y: bodyTop + 0.03 })); // roof slab
    // Parapet rail: four thin walls around the roof edge.
    const pY = bodyTop + 0.12;
    parts.push(box(W + 0.04, 0.10, 0.04, ROOF_DK, { y: pY, z: (D + 0.04) / 2 })); // front parapet
    parts.push(box(W + 0.04, 0.10, 0.04, ROOF_DK, { y: pY, z: -(D + 0.04) / 2 })); // back parapet
    parts.push(box(0.04, 0.10, D + 0.04, ROOF_DK, { y: pY, x: (W + 0.04) / 2 })); // right parapet
    parts.push(box(0.04, 0.10, D + 0.04, ROOF_DK, { y: pY, x: -(W + 0.04) / 2 })); // left parapet

    // ---- 6) Rooftop machine room + flagpole ---------------------------------
    parts.push(box(0.30, 0.22, 0.26, STONE, { x: -0.28, z: -0.22, y: bodyTop + 0.17, hex2: CORNICE })); // machine room
    parts.push(cyl(0.012, 0.012, 0.36, 8, STONE, { x: 0.40, z: 0.30, y: bodyTop + 0.22 })); // flagpole
    parts.push(box(0.10, 0.06, 0.01, 0xc23a2a, { x: 0.455, z: 0.30, y: bodyTop + 0.36 })); // small flag

    // ---- 7) Rooftop shrine pavilion (末廣社) --------------------------------
    // Tiny dark plinth + four corner posts + a small tiled hip roof.
    const sX = 0.18, sZ = 0.18; // shrine center (front-ish)
    const sBase = bodyTop + 0.06;
    parts.push(box(0.26, 0.06, 0.22, ROOF_DK, { x: sX, z: sZ, y: sBase + 0.03 })); // shrine plinth
    parts.push(box(0.22, 0.14, 0.18, 0x2c241c, { x: sX, z: sZ, y: sBase + 0.13 })); // shrine body (dark wood)
    // Tiny tiled hip roof (a flattened cone reads as a小 pavilion roof).
    parts.push(cyl(0.02, 0.20, 0.10, 4, SHRINE_ROOF, { x: sX, z: sZ, y: sBase + 0.25, ry: HALF_PI / 2, hex2: 0x6a5848 })); // shrine roof
    parts.push(sph(0.018, CORNICE, { ws: 6, hs: 4, x: sX, z: sZ, y: sBase + 0.31 })); // roof finial

    return finish(parts);
  },
};

export default NM_TAIPEI101;
