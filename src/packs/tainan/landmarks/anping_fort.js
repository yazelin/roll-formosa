/**
 * @file packs/tainan/landmarks/anping_fort.js — Roll Formosa Tainan pack.
 *
 * NM_ANPING_FORT — 安平古堡 (Anping Fort / Fort Zeelandia). Tainan's oldest
 * Dutch-era fortress, re-read as a whitewashed silhouette: a square white-walled
 * fort base with a BATTERED (outward-sloping) outer wall, an old red-brick wall
 * fragment surviving at the foot, and the unmistakable WHITE cylindrical lookout
 * tower rising from one corner — capped by a small observation deck and a
 * red-tipped white lighthouse-style mast.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (broad low fort + one tall corner
 * tower) carry the read. Whitewashed walls, brick fragment, red mast tip.
 * Hero budget: <= 600 triangles.
 */

import { box, cyl, cone, finish, PI } from '../geomHelpers.js';

const WHITE = 0xeae3d2; // whitewashed plaster wall
const WHITE_HI = 0xf3eee0; // sunlit top of the wall
const WHITE_SH = 0xcfc7b2; // wall base shading
const BRICK = 0xa6543a; // old red-brick wall fragment
const BRICK2 = 0x8c4530; // darker brick course
const RED = 0xc23a2e; // red mast / lighthouse cap tip
const GREY = 0xb6afa0; // deck / shadow trim

export const NM_ANPING_FORT = {
  id: 'anping_fort',
  name: '安平古堡',
  landmarkId: 4,
  dioramaRHint: 140, // broad fort footprint with one tall corner lookout tower
  colorHex: WHITE,
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.01; // micro jitter, never structural
    const parts = [];

    /* ---- square whitewashed fort base with battered (sloping) walls ---- */
    // Lower battered course: wider at the bottom, narrowing upward (cyl seg=4
    // gives a square prism; rt < rb → outward-sloping batter).
    parts.push(cyl(1.55, 1.85, 0.85, 4, WHITE, { y: 0.42, ry: PI / 4, hex2: WHITE_SH }));
    // Upper straight rampart band sitting on the batter.
    parts.push(box(2.5, 0.55, 2.5, WHITE, { y: 1.12, hex2: WHITE_HI }));
    // Crowning parapet lip running around the top of the rampart.
    parts.push(box(2.66, 0.12, 2.66, WHITE_HI, { y: 1.42 }));
    // Small crenellation merlons along the front parapet edge.
    for (const mx of [-0.9, -0.3, 0.3, 0.9]) {
      parts.push(box(0.22, 0.18, 0.16, WHITE_HI, { x: mx, y: 1.52, z: 1.28 }));
    }

    /* ---- surviving old red-brick wall fragment at the base ------------- */
    // A weathered brick stub leaning against the front-left foot of the fort.
    parts.push(box(1.5, 0.7, 0.34, BRICK, { x: -0.7, y: 0.35, z: 1.62, hex2: BRICK2 }));
    // A couple of broken brick blocks giving the ruin an uneven crest.
    parts.push(box(0.42, 0.26, 0.34, BRICK, { x: -1.3, y: 0.83, z: 1.62, hex2: BRICK2 }));
    parts.push(box(0.42, 0.16, 0.34, BRICK2, { x: -0.1, y: 0.78, z: 1.62 }));

    /* ---- white cylindrical lookout tower on the right-rear corner ------ */
    const tx = 1.05, tz = -1.05; // tower planted on one corner of the rampart
    // Tall white round shaft.
    parts.push(cyl(0.48, 0.54, 2.4, 12, WHITE, { x: tx, y: 2.6, hex2: WHITE_HI }));
    // Observation-deck collar partway up.
    parts.push(cyl(0.62, 0.62, 0.12, 12, GREY, { x: tx, y: 3.5, z: tz }));
    parts.push(cyl(0.6, 0.6, 0.34, 12, WHITE_HI, { x: tx, y: 3.7, z: tz })); // glazed lookout drum
    // Deck-rail ring just below the cap.
    parts.push(cyl(0.66, 0.66, 0.08, 12, GREY, { x: tx, y: 3.9, z: tz }));

    /* ---- red-tipped white lighthouse-style cap + mast ------------------ */
    // White conical cap over the lookout.
    parts.push(cone(0.5, 0.46, 12, WHITE_HI, { x: tx, y: 4.18, z: tz }));
    // Slim white mast.
    parts.push(cyl(0.05, 0.06, 0.7, 8, WHITE_HI, { x: tx, y: 4.72, z: tz }));
    // Red lighthouse-style tip.
    parts.push(cone(0.1, 0.24, 8, RED, { x: tx, y: 5.14 + j, z: tz }));

    return finish(parts);
  },
};

export default NM_ANPING_FORT;
