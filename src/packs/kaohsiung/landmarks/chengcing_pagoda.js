/**
 * @file packs/kaohsiung/landmarks/chengcing_pagoda.js — Roll Formosa Kaohsiung pack.
 *
 * 澄清湖中興塔 (Chengcing Lake Zhongxing Pagoda, 鳥松 Niaosong, 高雄). A curated hero
 * geometry: a many-tier HEXAGONAL pavilion-pagoda standing on the lakeshore — slim
 * red lacquer column drums (紅柱) stacked and stepped in as they rise, each tier
 * crowned by a wide flared GREEN glazed tile eave roof (綠頂) with upturned corners,
 * topped by a gold spire finial. It springs from a low stone terrace at the edge of
 * a teal lake platform, the classic 中興塔 silhouette reflected in 澄清湖.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (one tall slender hexagonal tiered tower over a flat water terrace — NOT a wide
 * block). The integration step owns the size-ladder; dioramaRHint is the real-world
 * footprint hint. <= 600 triangles (hero budget).
 */

import { box, cyl, cone, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — Chengcing Lake pavilion-pagoda materials (綠頂紅柱 green roof + red column).
const WATER = 0x2f6f7a; // 澄清湖 lake platform (teal water)
const STONE = 0xc7c0ad; // pale terrace / balustrade stone
const COLUMN = 0xb83a2c; // 紅柱 bright red lacquer column drum
const COLUMN_D = 0x8d2818; // shadow side of the red column
const ROOF = 0x3f9468; // 綠頂 green glazed tile eave roof
const ROOF_D = 0x2c6e4c; // deeper green roof underside / eave shadow
const GOLD = 0xe8c14a; // gold spire finial / ridge ornament

// Hexagonal cross-sections use cyl(seg=6); rotate HALF_PI/3 (= PI/6 = 30°) so a flat
// face of the hexagon reads forward instead of a corner.
const HEX = HALF_PI / 3; // PI/6 — orient hexagon flat faces forward

/**
 * Author one stepped multi-tier hexagonal pagoda centered at (cx,0) into `out`.
 * Each tier is a slim red lacquer hexagonal column drum capped by a wide flared
 * green tile roof; the body steps in as it rises, crowned by a gold spire finial.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} cx     pagoda center x
 * @param {number} baseY  height of the terrace top the pagoda springs from
 */
function pagoda(out, cx, baseY) {
  const nTiers = 6; // 六層 hexagonal pavilion-pagoda
  const r0 = 0.26; // ground-tier hexagon circumradius
  const tierH = 0.32; // wall height of one column drum
  const taper = 0.86; // each tier shrinks to 86% of the one below

  // Stone plinth the tower stands on (hexagonal stone base).
  out.push(cyl(r0 * 1.18, r0 * 1.28, 0.1, 6, STONE, { ry: HEX, x: cx, y: baseY + 0.05 }));

  let y = baseY + 0.1;
  let r = r0;
  for (let i = 0; i < nTiers; i++) {
    // Red lacquer hexagonal column drum (紅柱).
    out.push(
      cyl(r * 0.96, r, tierH, 6, COLUMN, { ry: HEX, x: cx, y: y + tierH / 2, hex2: COLUMN_D })
    );
    // Green flared tile eave roof (綠頂) — a wide shallow hexagonal cap over the drum.
    out.push(
      cone(r * 1.55, 0.15, 6, ROOF, { ry: HEX, x: cx, y: y + tierH + 0.055, hex2: ROOF_D })
    );
    y += tierH + 0.1;
    r *= taper;
  }

  // Gold spire finial crowning the topmost green roof.
  out.push(cone(0.06, 0.3, 6, GOLD, { x: cx, y: y + 0.15 }));
}

export const NM_CHENGCING = {
  id: 'chengcing_pagoda',
  name: '澄清湖中興塔',
  landmarkId: 0,
  dioramaRHint: 70, // ~ Chengcing Lake pagoda terrace footprint radius in metres
  colorHex: 0xc8a840, // the pagoda's signature warm gold (finial + red/green accent)
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the terrace
    const parts = [];

    // ---- Lake terrace over 澄清湖 (wide + low water base) -----------------
    parts.push(box(2.2, 0.12, 1.6, WATER, { y: 0.06, hex2: STONE })); // water/terrace slab (stone rim baked as top gradient)

    // ---- Single six-tier hexagonal pagoda (中興塔) ------------------------
    pagoda(parts, 0, 0.12);

    // ---- Short stone causeway linking the terrace to the shore -----------
    parts.push(box(0.42, 0.08, 0.5, STONE, { y: 0.16, z: 1.0 + r })); // causeway deck segment

    return finish(parts);
  },
};

export default NM_CHENGCING;
