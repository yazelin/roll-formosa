/**
 * @file packs/miaoli/landmarks/longteng_bridge.js — Roll Formosa Miaoli pack.
 *
 * NM_LONGTENG_BRIDGE — 龍騰斷橋 (Longteng Bridge Ruins), the iconic 1908
 * Japanese-era red brick railway bridge in 三義鄉 Sanyi Township. Originally
 * built for the Western Trunk Line, it was severely damaged in the 1935
 * Hsinchu-Taichung earthquake and left as a ruin. The remaining structure
 * features multiple tall red brick arches (4 main arches still standing)
 * rising dramatically from the valley — a must-see heritage site and the
 * signature silhouette of Miaoli's mountain railway heritage.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so this is authored in unit-ish space with
 * correct PROPORTIONS (wide horizontal span of arched piers — NOT a tower).
 * The integration step owns the size-ladder; dioramaRHint is the real-world
 * footprint hint. <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Longteng Bridge materials (Japanese-era red brick masonry).
const BRICK = 0xb04a38; // 紅磚 warm red brick (signature color of the ruin)
const BRICK_D = 0x8c3828; // shadow side / weathered lower courses
const BRICK_L = 0xc45a48; // sunlit upper brick (top gradient)
const MOSS = 0x5a6644; // moss / vegetation on the weathered ruins
const STONE = 0xa09080; // grey stone foundation / base
const STONE_D = 0x807060; // darker stone shadow

/**
 * Author one brick pier (橋墩) with an arched opening into `out`. Each pier is
 * a tall rectangular brick pillar with a rounded arch cut through the base.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx     pier center x
 * @param {number} baseY  height of the foundation
 * @param {number} pierH  total pier height
 * @param {number} pierW  pier width (x)
 * @param {number} pierD  pier depth (z)
 */
function brickPier(out, cx, baseY, pierH, pierW, pierD) {
  // Main pier body — tall red brick pillar
  out.push(
    box(pierW, pierH, pierD, BRICK, {
      x: cx,
      y: baseY + pierH / 2,
      hex2: BRICK_L,
    })
  );

  // Arch opening at the base — represented by a darker recessed box
  // The arch is approximately 1/3 the pier height
  const archH = pierH * 0.35;
  const archW = pierW * 0.7;
  out.push(
    box(archW, archH, pierD + 0.02, BRICK_D, {
      x: cx,
      y: baseY + archH / 2 + 0.05,
    })
  );

  // Curved arch top (semicircular) — using a half-cylinder rotated
  const archR = archW / 2;
  out.push(
    cyl(archR * 0.95, archR * 0.95, pierD + 0.02, 8, BRICK_D, {
      rx: HALF_PI,
      x: cx,
      y: baseY + archH + archR * 0.7,
      thetaLen: PI,
      theta0: 0,
    })
  );

  // Weathered top edge with moss patches
  out.push(
    box(pierW * 1.02, 0.06, pierD * 1.02, MOSS, {
      x: cx,
      y: baseY + pierH - 0.03,
    })
  );

  // Brick corbel/ledge detail partway up the pier
  out.push(
    box(pierW * 1.08, 0.08, pierD * 1.08, BRICK, {
      x: cx,
      y: baseY + pierH * 0.6,
      hex2: BRICK_D,
    })
  );
}

/**
 * Author a broken pier stub (斷墩) — a shorter ruined pier
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx     pier center x
 * @param {number} baseY  height of the foundation
 * @param {number} stubH  stub height (shorter than full pier)
 * @param {number} pierW  pier width (x)
 * @param {number} pierD  pier depth (z)
 */
function brokenStub(out, cx, baseY, stubH, pierW, pierD) {
  // Main stub body — shorter, weathered
  out.push(
    box(pierW, stubH, pierD, BRICK, {
      x: cx,
      y: baseY + stubH / 2,
      hex2: MOSS,
    })
  );

  // Irregular broken top surface
  out.push(
    box(pierW * 0.8, 0.1, pierD * 0.8, BRICK_D, {
      x: cx + 0.02,
      y: baseY + stubH - 0.05,
    })
  );
}

export const NM_LONGTENG_BRIDGE = {
  id: 'longteng_bridge',
  name: '龍騰斷橋',
  dioramaRHint: 80, // ~ bridge footprint radius in metres
  colorHex: 0xb04a38, // the bridge's signature warm red brick
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter
    const parts = [];

    const baseY = 0.0;
    const pierH = 1.8; // full pier height
    const pierW = 0.35; // pier width
    const pierD = 0.5; // pier depth
    const spacing = 0.7; // spacing between piers

    // ---- Valley ground / foundation base ---------------------------------
    parts.push(
      box(4.5, 0.15, 1.2, STONE, { y: baseY + 0.075, hex2: STONE_D })
    );

    // ---- Four main arched piers (the surviving section) ------------------
    // These are the iconic standing arches of the bridge
    brickPier(parts, -spacing * 1.5, baseY + 0.15, pierH, pierW, pierD);
    brickPier(parts, -spacing * 0.5, baseY + 0.15, pierH, pierW, pierD);
    brickPier(parts, spacing * 0.5, baseY + 0.15, pierH, pierW, pierD);
    brickPier(parts, spacing * 1.5, baseY + 0.15, pierH, pierW, pierD);

    // ---- Connecting arch spans between piers (the bridge deck level) -----
    // Brick arches spanning between the piers
    const deckY = baseY + 0.15 + pierH;
    const deckThick = 0.12;

    for (let i = 0; i < 3; i++) {
      const startX = -spacing * 1.5 + spacing * i;
      const endX = startX + spacing;
      const midX = (startX + endX) / 2;

      // Arch span base
      parts.push(
        box(spacing * 0.9, deckThick, pierD * 0.9, BRICK, {
          x: midX,
          y: deckY - deckThick / 2,
          hex2: BRICK_L,
        })
      );
    }

    // ---- Broken stub piers on the ends (earthquake damage) ---------------
    // Left broken stub
    brokenStub(parts, -spacing * 2.5, baseY + 0.15, pierH * 0.4, pierW, pierD);
    // Right broken stub
    brokenStub(parts, spacing * 2.5 + r, baseY + 0.15, pierH * 0.5, pierW, pierD);

    // ---- Fallen brick debris on the ground -------------------------------
    parts.push(
      box(0.3, 0.08, 0.25, BRICK_D, {
        x: -spacing * 2.2,
        y: baseY + 0.19,
        ry: 0.3,
      })
    );
    parts.push(
      box(0.25, 0.06, 0.2, BRICK_D, {
        x: spacing * 2.1,
        y: baseY + 0.18,
        ry: -0.4,
      })
    );

    // ---- Vegetation / moss on the ruins ----------------------------------
    parts.push(
      box(0.4, 0.1, 0.3, MOSS, {
        x: -spacing * 0.5,
        y: deckY + 0.05,
      })
    );

    return finish(parts);
  },
};

export default NM_LONGTENG_BRIDGE;
