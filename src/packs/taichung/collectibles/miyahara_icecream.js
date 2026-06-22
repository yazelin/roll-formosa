/**
 * @file packs/taichung/collectibles/miyahara_icecream.js — Roll Formosa
 * Taichung pack, COLLECTIBLE item (the rare rolled-up treats).
 *
 * 宮原眼科冰淇淋 (Miyahara Ophthalmology ice cream). Taichung's famously OTT
 * gelato: a tall waffle cone crowned with a teetering stack of three colourful
 * scoops (strawberry pink, mango yellow, matcha green), bristling with crisp
 * wafer rolls / biscuit sticks and topped with a glacé cherry. Small hand-held
 * street treat, but flamboyantly TALL — the silhouette is a bright, top-heavy
 * tower balanced on a slender cone.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) are authored
 * here: a narrow cone carrying a fat triple stack, wafers fanning out the top.
 * <= 350 triangles. rng() only nudges scoop tints, never structure.
 */

import { cyl, cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

// Palette — gelato + waffle-cone materials.
const CONE = 0xc88a3a; // 餅乾甜筒 toasted waffle cone
const CONE_HI = 0xe3b066; // lighter waffle highlight near the rim
const PINK = 0xf0a8c0; // 草莓 strawberry scoop
const YELLOW = 0xf3cf66; // 芒果 mango scoop
const GREEN = 0x9fc56a; // 抹茶 matcha scoop
const WAFER = 0xe7c98c; // 餅棒 / 捲心酥 crisp biscuit stick
const WAFER_D = 0xc69a52; // darker baked wafer edge
const CHERRY = 0xd23a4a; // glacé cherry crown

export const COL_MIYAHARA_ICECREAM = {
  id: 'miyahara_icecream',
  name: '宮原眼科冰淇淋',
  collectibleId: 3,
  colorHex: 0xf0a8c0, // strawberry-pink signature scoop

  buildGeometry(rng) {
    const t = (rng() - 0.5) * 0.04; // tiny non-structural scoop-tint nudge
    const pink = PINK + Math.round(t * 0x101010);
    const yellow = YELLOW + Math.round(t * 0x101010);
    const green = GREEN + Math.round(t * 0x101010);
    const parts = [];

    // ---- Waffle CONE: a slender toasted cone carrying the whole stack ------
    // Narrow + tall so the colourful scoops read as flamboyantly top-heavy.
    parts.push(cone(0.6, 1.9, 8, CONE, { rx: PI, y: 0.95, hex2: CONE_HI }));
    // Crisp rim lip where the cone opens to the first scoop.
    parts.push(cyl(0.62, 0.5, 0.14, 8, CONE_HI, { y: 1.86, hex2: CONE }));

    // ---- Triple SCOOP stack — pink, then yellow, then green ----------------
    // Each scoop a near-round ball; stacked with shrinking radius up the tower.
    // Lower hemisphere flattened slightly (sy) so they nestle, not roll off.
    const scoops = [
      { c: pink, r: 0.78, y: 2.5 },
      { c: yellow, r: 0.66, y: 3.5 },
      { c: green, r: 0.56, y: 4.36 },
    ];
    for (const s of scoops) {
      parts.push(sph(s.r, s.c, { ws: 8, hs: 4, y: s.y, sy: 0.96 }));
    }
    // A soft melt-drip down the side of the bottom scoop (read: gelato).
    parts.push(sph(0.2, pink, { ws: 5, hs: 3, x: 0.62, y: 2.18, z: 0.1, sy: 1.4 }));

    // ---- WAFER rolls / biscuit sticks bristling out of the stack -----------
    // Thin cylinders fanned at jaunty angles + one crisp cone wafer up top.
    const wafers = [
      { x: 0.5, y: 3.95, z: 0.3, rz: 0.5, rx: 0.2, h: 1.5 },
      { x: -0.46, y: 3.8, z: -0.24, rz: -0.62, rx: -0.18, h: 1.35 },
      { x: 0.1, y: 4.1, z: -0.5, rz: 0.18, rx: -0.55, h: 1.2 },
    ];
    for (const w of wafers) {
      parts.push(
        cyl(0.085, 0.085, w.h, 6, WAFER, {
          x: w.x, y: w.y, z: w.z, rz: w.rz, rx: w.rx, hex2: WAFER_D,
        }),
      );
    }
    // A single crisp wafer CONE poking straight up out of the top scoop.
    parts.push(cone(0.16, 0.95, 6, WAFER, { y: 5.2, hex2: WAFER_D }));

    // ---- Glacé CHERRY crown perched on the top scoop -----------------------
    parts.push(sph(0.2, CHERRY, { ws: 6, hs: 3, y: 4.82, z: 0.18 }));
    // tiny stem nub on the cherry.
    parts.push(cyl(0.03, 0.04, 0.16, 4, 0x5a3a1e, { y: 4.98, z: 0.18, rz: 0.3 }));

    return finish(parts);
  },
};

export default COL_MIYAHARA_ICECREAM;
