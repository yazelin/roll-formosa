/**
 * @file packs/kaohsiung/collectibles/big_bowl_ice.js — Roll Formosa Kaohsiung pack, COLLECTIBLE.
 *
 * COL_BIG_BOWL_ICE — 大碗公冰 (giant "big bowl" shaved ice). Silhouette: an
 * oversized wide ceramic bowl (the classic 碗公) holding a tall heaped mound of
 * white shaved ice, drizzled with a glossy red-bean / condensed-milk topping
 * and a scatter of dark red beans settling down the slopes. A short ridged foot
 * grounds the bowl. The read at thumbnail size: "huge bowl, big white snow
 * mound, red drizzle on top" — a Kaohsiung summer-market staple.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the geometry
 * math is an engine red line. finish() merges → recenters → normalizes to a
 * UNIT bounding sphere (radius 1), so proportions (not absolute size) are what
 * we author here. <= 600 tris (collectible budget; this aims ~150-400). rng()
 * only nudges the drizzle tint + topping placement, never structure.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

/** Concrete hexes — porcelain bowl, snow ice, red-bean drizzle, dark beans. */
const BOWL = 0xf2c9d2; // soft pink-white porcelain (matches colorHex read)
const BOWL_HI = 0xfbe6ea; // lighter rim sheen
const ICE = 0xf6fbff; // white shaved ice
const ICE_HI = 0xffffff; // bright snow peak
const SYRUP = 0xb3273a; // glossy red-bean / strawberry drizzle
const SYRUP_HI = 0xd84a5c; // lighter drizzle highlight
const BEAN = 0x5a1f1c; // dark red-bean brown
const MILK = 0xfff4e6; // condensed-milk cream pool

export const COL_BIG_BOWL_ICE = {
  id: 'big_bowl_ice',
  name: '大碗公冰',
  colorHex: 0xf2c9d2, // soft porcelain pink — the bowl read color

  /**
   * Build the dessert geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (drizzle tint, topping jitter).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    // Tiny per-instance nudge so a shelf of bowls isn't identical (tint + lean only).
    const t = Math.floor(rng() * 0x040201); // small syrup-tint nudge
    const syrup = SYRUP + t;
    const beanJit = (rng() - 0.5) * 0.1; // small symmetric bean shuffle

    const parts = [];

    // --- BOWL: a wide shallow 碗公 — broad open mouth, tapered base. -------
    // Outer wall (wider at the rim than the base = the classic flared bowl).
    parts.push(cyl(1.05, 0.5, 0.78, 12, BOWL, { y: 0.5, hex2: BOWL_HI }));
    // Inner liner (slightly smaller, so the rim reads as a thin lip).
    parts.push(cyl(0.95, 0.42, 0.7, 12, BOWL_HI, { y: 0.56, open: true }));
    // Bright rounded rim ring at the mouth.
    parts.push(cyl(1.08, 1.0, 0.08, 12, BOWL_HI, { y: 0.88 }));
    // Closed bowl bottom disc.
    parts.push(cyl(0.5, 0.5, 0.06, 8, BOWL, { y: 0.13 }));
    // Short ridged foot ring grounding the bowl.
    parts.push(cyl(0.46, 0.4, 0.14, 10, BOWL, { y: 0.05, hex2: BOWL_HI }));

    // --- ICE: a tall heaped snow mound rising well above the rim. ---------
    // Lower wide dome filling the bowl mouth.
    parts.push(sph(0.92, ICE, { ws: 8, hs: 4, sy: 0.85, y: 0.92, hex2: ICE_HI }));
    // Upper packed peak (smaller dome stacked on top for the heaped read).
    parts.push(sph(0.62, ICE, { ws: 8, hs: 4, sy: 1.1, y: 1.5, hex2: ICE_HI }));

    // --- CONDENSED-MILK pool catching in a ring just inside the rim. ------
    parts.push(sph(0.86, MILK, { ws: 9, hs: 3, thetaLen: PI * 0.42, sy: 0.32, y: 0.84 }));

    // --- SYRUP DRIZZLE: a glossy cap of red topping over the peak, ---------
    //     dripping down the front of the mound.
    parts.push(sph(0.5, syrup, { ws: 8, hs: 4, sy: 0.6, y: 1.78, hex2: SYRUP_HI }));
    // Drips running down the slope (thin tapered cylinders = pour streaks).
    parts.push(cyl(0.07, 0.11, 0.62, 6, syrup, { x: 0.18, y: 1.4, z: 0.36, rx: 0.42, hex2: SYRUP_HI }));
    parts.push(cyl(0.06, 0.1, 0.5, 6, syrup, { x: -0.26, y: 1.42, z: 0.22, rx: 0.3, rz: 0.2, hex2: SYRUP_HI }));
    parts.push(cyl(0.06, 0.1, 0.46, 6, syrup, { x: 0.04, y: 1.38, z: -0.34, rx: -0.36, hex2: SYRUP_HI }));

    // --- RED BEANS: dark dots scattered over the mound + drizzle. ---------
    parts.push(sph(0.13, BEAN, { ws: 4, hs: 3, x: 0.22 + beanJit, y: 1.92, z: 0.18 }));
    parts.push(sph(0.12, BEAN, { ws: 4, hs: 3, x: -0.18, y: 1.86, z: 0.24 + beanJit }));
    parts.push(sph(0.12, BEAN, { ws: 4, hs: 3, x: 0.06, y: 1.98, z: -0.16 }));
    parts.push(sph(0.11, BEAN, { ws: 4, hs: 3, x: 0.34, y: 1.5, z: 0.42 + beanJit }));
    parts.push(sph(0.11, BEAN, { ws: 4, hs: 3, x: -0.36 + beanJit, y: 1.46, z: 0.3 }));
    parts.push(sph(0.1, BEAN, { ws: 4, hs: 3, x: 0.1, y: 1.44, z: -0.46 }));

    return finish(parts);
  },
};

export default COL_BIG_BOWL_ICE;
