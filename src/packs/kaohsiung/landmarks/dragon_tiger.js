/**
 * @file packs/kaohsiung/landmarks/dragon_tiger.js — Roll Formosa Kaohsiung pack.
 *
 * 龍虎塔 (Dragon & Tiger Pagodas, 蓮池潭 Lotus Pond, 左營 Zuoying). A curated hero
 * geometry: TWO matching seven-tier (七層) octagonal pagodas standing side by side
 * over the lake, each crowned by a slim gold finial, joined to the shore by a short
 * zig-zag causeway. In front of the pair sit the two giant guardian-beast portals —
 * a green-scaled DRAGON head (you enter through the 龍口) and a yellow TIGER head
 * (you exit through the 虎口). 黃牆紅瓦 — yellow plastered walls with red glazed
 * tile roofs, the unmistakable Lotus Pond silhouette.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (two slim stacked-tier towers over a flat water platform, beast heads in front —
 * NOT a single tower). The integration step owns the size-ladder; dioramaRHint is
 * the real-world footprint hint. <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Lotus Pond temple materials (黃牆紅瓦 yellow wall + red tile).
const WATER = 0x2f6f7a; // 蓮池潭 lake platform (teal water)
const STONE = 0xc7c0ad; // pale balustrade / causeway stone
const WALL = 0xe6c659; // 黃牆 bright yellow plastered pagoda body
const WALL_D = 0xc9a93f; // shadow side of the yellow wall
const TILE = 0xb22f24; // 紅瓦 red glazed tile roof
const TILE_D = 0x8d2018; // deeper red roof underside / eave shadow
const GOLD = 0xe8c14a; // gold finial / ridge ornament
const DRAGON = 0x3f8f54; // green-scaled dragon guardian head
const TIGER = 0xe2a13c; // yellow-orange tiger guardian head
const MAW = 0x7a1714; // dark red open mouth (the 龍口 / 虎口 entrance)
const WHITE = 0xefe9da; // teeth / eye whites

// Square cross-sections come from cyl(seg=4) rotated PI/8 to read as a chamfered
// octagon-ish footprint; octagon towers use seg=8.
const OCT = HALF_PI / 4; // PI/8 — orient octagon flat faces forward

/**
 * Author one seven-tier pagoda centered at (cx,0) into `out`. Each tier is a slim
 * yellow octagonal drum capped by a wide red flared tile roof; the body steps in
 * as it rises, crowned by a gold spire finial.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx     pagoda center x
 * @param {number} baseY  height of the platform top the pagoda springs from
 */
function pagoda(out, cx, baseY) {
  const nTiers = 7; // 七層寶塔
  const r0 = 0.22; // ground-tier octagon circumradius
  const tierH = 0.34; // wall height of one tier
  const taper = 0.86; // each tier shrinks to 86% of the one below

  // Stone plinth the tower stands on (square block, cheap).
  out.push(cyl(r0 * 1.15, r0 * 1.25, 0.1, 4, STONE, { ry: OCT, x: cx, y: baseY + 0.05 }));

  let y = baseY + 0.1;
  let r = r0;
  for (let i = 0; i < nTiers; i++) {
    // Yellow square wall drum (黃牆) — rotated so chamfered corners face front.
    out.push(
      cyl(r * 0.97, r, tierH, 4, WALL, { ry: OCT, x: cx, y: y + tierH / 2, hex2: WALL_D })
    );
    // Red flared tile eave roof (紅瓦) — a wide shallow pyramidal cap over the drum.
    out.push(
      cone(r * 1.5, 0.14, 4, TILE, { ry: OCT, x: cx, y: y + tierH + 0.05, hex2: TILE_D })
    );
    y += tierH + 0.1;
    r *= taper;
  }

  // Gold spire finial crowning the seventh roof.
  out.push(cone(0.055, 0.26, 5, GOLD, { x: cx, y: y + 0.13 }));
}

/**
 * Author one guardian-beast head portal into `out`: a blocky animal head with a
 * dark open maw you walk through (the 龍口 / 虎口 entrance) and two eyes.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx    head center x
 * @param {number} y     head center y
 * @param {number} hex   beast body color
 */
function beastHead(out, cx, y, hex) {
  // Main rounded head block.
  out.push(box(0.34, 0.4, 0.42, hex, { x: cx, y, z: 0.55 }));
  // Dark open mouth maw — the entrance archway (recessed front face).
  out.push(box(0.22, 0.2, 0.18, MAW, { x: cx, y: y - 0.06, z: 0.78 }));
  // Upper jaw / brow ridge above the maw.
  out.push(box(0.36, 0.1, 0.3, hex, { x: cx, y: y + 0.16, z: 0.62 }));
  // Two eyes — a white sclera box with a dark pupil baked as a top gradient.
  for (const sx of [-1, 1]) {
    out.push(box(0.07, 0.07, 0.05, WHITE, { x: cx + sx * 0.12, y: y + 0.18, z: 0.73, hex2: 0x1a1a1a }));
  }
  // A row of white fang teeth framing the top of the maw (single cheap bar).
  out.push(box(0.2, 0.03, 0.02, WHITE, { x: cx, y: y + 0.03, z: 0.82 }));
}

export const NM_DRAGON_TIGER = {
  id: 'dragon_tiger_towers',
  name: '龍虎塔',
  landmarkId: 0,
  dioramaRHint: 60, // ~ Lotus Pond pagoda-pair footprint radius in metres
  colorHex: 0xe0b84a, // the pagodas' signature yellow-gold wall
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the finials
    const parts = [];

    // ---- Lake platform over 蓮池潭 (wide + low water base) ----------------
    parts.push(box(2.5, 0.12, 1.7, WATER, { y: 0.06, hex2: STONE })); // water/jetty platform slab (stone rim baked as top gradient)

    // ---- Twin seven-tier pagodas (the 龍塔 / 虎塔) -------------------------
    const dx = 0.6; // half-spacing of the two towers
    pagoda(parts, -dx, 0.12);
    pagoda(parts, dx, 0.12);

    // ---- Guardian-beast head portals in front (龍口 enter / 虎口 exit) -----
    beastHead(parts, -dx, 0.42, DRAGON); // green dragon head (entrance)
    beastHead(parts, dx, 0.42, TIGER); // yellow tiger head (exit)

    // ---- Short zig-zag causeway linking the pair to the shore -------------
    parts.push(box(0.32, 0.08, 0.5, STONE, { y: 0.16, z: 1.0 })); // causeway deck segment
    parts.push(box(0.5, 0.08, 0.3, STONE, { x: -0.25 + r, y: 0.16, z: 1.25 })); // zig-zag kink to shore

    return finish(parts);
  },
};

export default NM_DRAGON_TIGER;
