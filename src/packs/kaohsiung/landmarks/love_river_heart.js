/**
 * @file packs/kaohsiung/landmarks/love_river_heart.js — Roll Formosa Kaohsiung pack.
 *
 * 愛河之心 (Love River Heart, 龍子湖 / 博愛路 Bo'ai Rd, 高雄 Kaohsiung). A curated
 * hero geometry: the signature HEART-SHAPED twin water pool — two round teal pools
 * sitting side by side, their inner edges nuzzling into a shared point so the pair
 * reads as a single 心形 heart from above — set inside a pale stone embankment.
 * Spanning the water is the famous curved white pedestrian bridge (弧形人行橋), a
 * shallow arch on slim piers that lets you walk out over the heart. A row of low
 * lamp posts lines the rim; the calm river plane stretches behind it.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (two round pools meeting at a point + a slim arched footbridge over them — NOT a
 * single basin). The integration step owns the size-ladder; dioramaRHint is the
 * real-world footprint hint. <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Love River Heart waterscape materials.
const WATER = 0x2f6f7a; // 愛河 teal river water surface (the heart pools)
const WATER_D = 0x1f4f58; // deeper water shadow toward the rim
const STONE = 0xc7c0ad; // pale stone embankment / plaza paving
const STONE_D = 0x9d9784; // shadow side of the embankment
const KERB = 0xb8b1a0; // raised kerb ring framing each pool
const BRIDGE = 0xefe9da; // white curved footbridge deck / arch
const BRIDGE_D = 0xcfc9ba; // bridge underside / pier shadow
const RAIL = 0xb8c4d8; // pale steel handrail / cable stay
const LAMP = 0x4a4a52; // dark lamp post
const GLOW = 0xffe9a8; // warm lamp glow head

/**
 * Author one round pool of the heart into `out`: a low teal water disc dropped
 * into the stone plaza, ringed by a raised pale kerb.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx   pool center x
 * @param {number} y    plaza top height
 */
function pool(out, cx, y) {
  const r = 0.5; // pool radius (the two overlap toward center to form the point)
  // Raised stone kerb ring framing the water.
  out.push(torus(r, 0.06, 3, 9, KERB, { rx: HALF_PI, x: cx, y: y + 0.01 }));
  // Teal water disc, sunk just below the kerb (deeper color toward the rim).
  out.push(cyl(r * 0.94, r * 0.94, 0.05, 9, WATER, { x: cx, y: y - 0.02, hex2: WATER_D }));
}

export const NM_LOVE_RIVER_HEART = {
  id: 'love_river_heart',
  name: '愛河之心',
  landmarkId: 0,
  dioramaRHint: 45, // ~ Love River Heart pool-and-bridge footprint radius in metres
  colorHex: 0x7088c0, // the cool blue-steel of the curved footbridge / water
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the lamp row
    const parts = [];

    // ---- Stone embankment plaza the heart sits in (wide + low base) -------
    parts.push(box(2.6, 0.12, 1.9, STONE, { y: 0.06, hex2: STONE_D })); // paved plaza slab
    // Calm river plane stretching behind the heart (slightly lower water sheet).
    parts.push(box(2.6, 0.06, 0.7, WATER, { y: 0.03, z: -1.0, hex2: WATER_D }));

    // ---- Heart-shaped twin water pools (the two lobes nuzzling at a point) -
    const dx = 0.42; // pools overlap toward center → the two lobes of the heart
    pool(parts, -dx, 0.12);
    pool(parts, dx, 0.12);
    // The downward POINT of the heart — a teal wedge fanning south of the lobes.
    parts.push(cone(0.46, 0.05, 4, WATER, { ry: HALF_PI / 2, x: 0, y: 0.1, z: -0.42, hex2: WATER_D }));
    // Stone kerb edging the heart's point to match the lobe kerbs.
    parts.push(box(0.5, 0.06, 0.5, KERB, { ry: HALF_PI / 2, x: 0, y: 0.12, z: -0.42 }));

    // ---- Curved white footbridge spanning the water (弧形人行橋) -----------
    // Shallow arch deck — a half-torus laid across the heart, rising in the middle.
    parts.push(
      torus(0.62, 0.05, 3, 9, BRIDGE, { x: 0, y: 0.22, z: 0.1, arc: PI, hex2: BRIDGE_D })
    );
    // Walking deck slab riding the crown of the arch.
    parts.push(box(1.3, 0.04, 0.18, BRIDGE, { y: 0.44, z: 0.1, hex2: BRIDGE_D }));
    // Two slim piers carrying the arch down to the embankment.
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.045, 0.06, 0.32, 6, BRIDGE_D, { x: sx * 0.6, y: 0.22, z: 0.1 }));
    }
    // Pale handrail line skimming the deck edge.
    parts.push(box(1.24, 0.025, 0.02, RAIL, { y: 0.48, z: 0.18 }));
    // Inclined cable-stay mast leaning over the crown (the bridge's signature curve).
    parts.push(cyl(0.025, 0.03, 0.5, 6, RAIL, { rz: PI / 7, x: 0.1, y: 0.6, z: 0.0 }));

    // ---- Row of low lamp posts lining the rim ----------------------------
    for (const sx of [-1, 0, 1]) {
      const px = sx * 0.78 + r;
      parts.push(cyl(0.018, 0.02, 0.26, 4, LAMP, { x: px, y: 0.25, z: 0.78 })); // post
      parts.push(sph(0.045, GLOW, { x: px, y: 0.4, z: 0.78, ws: 5, hs: 3 })); // warm lamp head
    }

    return finish(parts);
  },
};

export default NM_LOVE_RIVER_HEART;
