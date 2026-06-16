/**
 * @file packs/kaohsiung/collectibles/spring_autumn.js — Roll Formosa Kaohsiung pack.
 *
 * COL_SPRING_AUTUMN — 春秋閣 (Spring & Autumn Pavilions) at Lotus Pond (蓮池潭),
 * Kaohsiung. Silhouette: TWO matching Chinese pavilion-towers side by side, each
 * a stacked pair of yellow-walled stories crowned by upturned red tiled roofs and
 * a gold finial — sitting on a thin green platform that reads as the lotus pond
 * water. Between/above the pair floats a small hint of the 騎龍觀音 (Guanyin
 * riding a dragon): a pale standing figure on a coiled dragon body. The read at
 * thumbnail size is "twin golden pagoda-pavilions on green water."
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so proportions (not absolute size) are what we author here.
 * Collectible budget: well under 600 tris (aim ~150–400). rng() only nudges the
 * roof tile tint, never structure.
 *
 * Palette: yellow walls (0xe0bc54 base / 0xf0d27a highlight) + red tiled roofs
 * (0xc23a2e / 0xd95440) + gold finials (0xf3d877) + green pond platform (0x3f7a52)
 * + pale Guanyin figure (0xeae0c8) + jade dragon (0x5a9e6a).
 */

import { box, cyl, cone, sph, finish, PI } from '../geomHelpers.js';

const WALL = 0xe0bc54; // yellow pavilion wall
const WALL_HI = 0xf0d27a; // lighter top
const ROOF = 0xc23a2e; // red tiled roof
const ROOF_HI = 0xd95440; // roof highlight
const GOLD = 0xf3d877; // finial / ridge gold
const POND = 0x3f7a52; // green lotus-pond platform
const POND_HI = 0x4f9266; // pond rim
const SACRED = 0xeae0c8; // pale Guanyin figure
const DRAGON = 0x5a9e6a; // jade dragon

/** Build one twin-tower pavilion at the given x offset. */
function pavilion(parts, px, roofHi) {
  // Lower story — a yellow box room.
  parts.push(box(0.62, 0.66, 0.62, WALL, { x: px, y: 0.46, hex2: WALL_HI }));
  // Lower eave / roof — broad upturned red cone (low, wide).
  parts.push(cone(0.62, 0.32, 4, ROOF, { x: px, y: 0.94, ry: PI / 4, hex2: roofHi }));
  // Upper story — a smaller yellow box, set back on top.
  parts.push(box(0.42, 0.5, 0.42, WALL, { x: px, y: 1.26, hex2: WALL_HI }));
  // Upper roof — second tier red cone.
  parts.push(cone(0.46, 0.3, 4, ROOF, { x: px, y: 1.66, ry: PI / 4, hex2: roofHi }));
  // Gold finial — small ball on a tiny post crowning the tower.
  parts.push(cyl(0.05, 0.05, 0.16, 6, GOLD, { x: px, y: 1.88 }));
  parts.push(sph(0.11, GOLD, { ws: 6, hs: 4, x: px, y: 2.0 }));
}

export const COL_SPRING_AUTUMN = {
  id: 'spring_autumn_pavilion',
  name: '春秋閣',
  colorHex: 0xe0bc54, // yellow pavilion wall — the body read color

  /**
   * Build the figurine geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny tint variation only, never structure.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Faint per-instance roof tint so a shelf isn't identical.
    const tj = Math.floor(rng() * 0x040200);
    const roofHi = ROOF_HI + tj;

    // --- Green lotus-pond platform (thin disc the towers stand on) ---------
    parts.push(cyl(1.0, 1.05, 0.16, 12, POND, { y: 0.06, hex2: POND_HI }));

    // --- Twin pavilion towers, mirrored across center -----------------------
    pavilion(parts, -0.42, roofHi);
    pavilion(parts, 0.42, roofHi);

    // --- 騎龍觀音 hint: coiled jade dragon + pale standing Guanyin, raised
    //     and centered above/behind the pair so it reads as the shrine motif. -
    // Coiled dragon body — a flattened torus suggesting the dragon mount.
    parts.push(sph(0.3, DRAGON, { ws: 6, hs: 4, sy: 0.5, y: 0.52, z: -0.02 }));
    // Dragon head — a small snout poking forward.
    parts.push(box(0.16, 0.14, 0.22, DRAGON, { y: 0.56, z: 0.34 }));
    // Guanyin — pale tapered standing figure rising from the dragon.
    parts.push(cyl(0.1, 0.2, 0.7, 8, SACRED, { y: 1.0, hex2: SACRED }));
    // Guanyin head — small pale ball on top.
    parts.push(sph(0.14, SACRED, { ws: 6, hs: 4, y: 1.42 }));

    return finish(parts);
  },
};

export default COL_SPRING_AUTUMN;
