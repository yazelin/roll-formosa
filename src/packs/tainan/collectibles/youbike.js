/**
 * @file packs/tainan/collectibles/youbike.js — Roll Formosa Tainan collectible.
 *
 * 豆花 (douhua / silky tofu pudding) — the cooling Tainan street dessert: a wide
 * shallow bowl holding pale ivory soybean pudding, crowned with a little mound of
 * toppings (peanuts, tapioca pearls) and a pool of amber syrup. As a small
 * hand-rollable collectible it reads as a low bowl brimming with pale pudding and
 * round toppings — the unmistakable 豆花 silhouette.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read: a wide low bowl,
 * pudding filling it flush, small spherical toppings clustered on top. rng only
 * scatters the toppings a hair — never structure. Budget kept under 350 tris.
 */

import { cyl, sph, finish, PI } from '../geomHelpers.js';

// Palette — tofu-pudding materials.
const BOWL = 0xf6f1e3; // pale ceramic bowl
const BOWL_D = 0xd8d2c0; // bowl shadow / inner wall
const PUDD = 0xf2ead2; // silky ivory soybean pudding
const PUDD_T = 0xfaf5e6; // glossy pudding highlight
const SYRUP = 0xc98a3a; // amber sugar syrup
const PEANUT = 0xd9a85f; // boiled peanut
const PEARL = 0xbfae8a; // tapioca / barley pearl

export const COL_YOUBIKE = {
  id: 'youbike',
  name: '豆花',
  collectibleId: 8,
  colorHex: 0xf2ead2, // ivory soybean pudding

  buildGeometry(rng) {
    const parts = [];

    // ---- Bowl (wide shallow vessel) --------------------------------------
    // A flared open cylinder gives the bowl wall; a thin disc closes the base.
    parts.push(cyl(1.0, 0.62, 0.62, 8, BOWL, { y: -0.18, open: true, hex2: BOWL_D }));
    parts.push(cyl(0.62, 0.62, 0.08, 8, BOWL_D, { y: -0.46 })); // base disc

    // ---- Pudding (filling the bowl flush) --------------------------------
    // A short wide cylinder for the body plus a slightly domed top read as the
    // silky tofu surface brimming to the rim.
    parts.push(cyl(0.92, 0.6, 0.34, 8, PUDD, { y: -0.05, hex2: PUDD_T }));
    parts.push(
      sph(0.9, PUDD, { y: 0.12, sy: 0.34, ws: 8, hs: 3, thetaLen: PI / 2, hex2: PUDD_T })
    );

    // ---- Amber syrup pool over the pudding -------------------------------
    parts.push(cyl(0.5, 0.5, 0.05, 7, SYRUP, { y: 0.2 }));

    // ---- Toppings (peanuts + tapioca pearls) -----------------------------
    // A small mound of round toppings clustered at the centre, scattered a hair.
    const tops = [
      [PEANUT, 0.15, 0.0, 0.0],
      [PEANUT, 0.13, 0.22, 0.1],
      [PEARL, 0.1, 0.05, 0.24],
      [PEARL, 0.1, -0.22, 0.16],
    ];
    for (const [hex, r, dx, dz] of tops) {
      const jx = (rng() - 0.5) * 0.05;
      const jz = (rng() - 0.5) * 0.05;
      parts.push(sph(r, hex, { x: dx + jx, z: dz + jz, y: 0.28, ws: 6, hs: 3 }));
    }

    return finish(parts);
  },
};

export default COL_YOUBIKE;
