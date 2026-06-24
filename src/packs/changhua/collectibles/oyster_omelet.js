/**
 * @file packs/changhua/collectibles/oyster_omelet.js — Roll Formosa Changhua pack, COLLECTIBLE.
 *
 * COL_OYSTER_OMELET — 蚵仔煎 (oyster omelet), a coastal specialty of Lukang.
 * Silhouette: a round, pan-fried omelet with a crispy starchy batter base,
 * studded with plump oysters, eggs, and leafy greens (小白菜), topped with
 * sweet red sauce. The gooey texture and red sauce drizzle are distinctive.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { sph, cyl, box, finish, HALF_PI, PI } from '../geomHelpers.js';

const BATTER = 0xe8dcc0;      // starchy batter (slightly translucent)
const EGG = 0xf8e080;         // egg yellow
const OYSTER = 0x9a9088;      // oyster grey
const GREENS = 0x68a858;      // leafy greens
const SAUCE = 0xc83020;       // sweet red sauce
const PLATE = 0xf0e8dc;       // plate

export const COL_OYSTER_OMELET = {
  id: 'oyster_omelet',
  name: '蚵仔煎',
  collectibleId: 3,
  colorHex: EGG,

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x020202);
    const parts = [];

    // Plate (reduced segments)
    parts.push(cyl(0.95, 0.95, 0.08, 8, PLATE, { y: 0.04 }));

    // Main omelet base
    parts.push(sph(0.72, BATTER + t, { ws: 8, hs: 3, y: 0.22, sy: 0.30, thetaLen: HALF_PI }));

    // Egg layer
    parts.push(sph(0.60, EGG, { ws: 8, hs: 3, y: 0.30, sy: 0.18, thetaLen: HALF_PI }));

    // Oysters (reduced to 2)
    parts.push(sph(0.12, OYSTER, { ws: 4, hs: 3, x: -0.18, y: 0.32, z: 0.08 }));
    parts.push(sph(0.11, OYSTER, { ws: 4, hs: 3, x: 0.12, y: 0.32, z: -0.10 }));

    // Leafy greens (single)
    parts.push(box(0.18, 0.04, 0.12, GREENS, { x: 0.22, y: 0.34, z: 0.12 }));

    // Sweet red sauce drizzle
    parts.push(box(0.45, 0.02, 0.06, SAUCE, { y: 0.40 }));

    return finish(parts);
  },
};

export default COL_OYSTER_OMELET;
