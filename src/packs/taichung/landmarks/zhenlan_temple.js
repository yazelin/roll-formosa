/**
 * @file packs/taichung/landmarks/zhenlan_temple.js — Roll Formosa Taichung pack, hero landmark.
 *
 * 大甲鎮瀾宮 (Dajia Zhenlan Temple — the great 大甲媽祖 mother temple of Dajia). A curated
 * hero geometry, not a repeatable chunk archetype: a grand, imposing 媽祖廟 far larger and
 * taller than an ordinary village temple. A wide red-walled hall fronted by a broad
 * 牌樓 (paifang) gateway facade with a gold name plaque and a colonnade of red dragon
 * columns, then THREE stacked 燕尾翹脊 (swallowtail) glazed-tile roofs that step UP and
 * narrow as they rise, each corner sweeping out into a forked gold-tipped horn, crowned by
 * an ornate gold ridge gourd. A pair of stone 石獅 (guardian lions) flank the front steps.
 * Red wall + many-layered dark-gold eaves + gold spine = 金碧輝煌, 氣勢恢宏.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an engine
 * red line. finish() merges → recenters → normalizes to a UNIT bounding sphere (radius 1),
 * so this is authored in unit-ish space with correct temple PROPORTIONS — WIDE base, MORE
 * roof tiers than a small temple, stepping upward (a grand multi-eave hall, NOT a tower).
 * The integration step owns the size-ladder; dioramaRHint is the real-world footprint hint.
 * <= 600 triangles.
 */

import { box, cyl, finish, PI } from '../geomHelpers.js';

// Palette — grand temple materials.
const STONE = 0xc0b8a6; // 砂岩 grey forecourt / base stone
const STONE_D = 0xa19984; // darker stone for steps / shadow gradient
const RED = 0xb5302a; // 朱紅 lacquered red wall / column (signature hue)
const RED_D = 0x8c241e; // deeper red shadow side
const ROOF = 0x3a3630; // 深褐黑 glazed roof tile (the layered dark eaves)
const ROOF_D = 0x2a2722; // deeper tile under-eave shadow
const GOLD = 0xcfa648; // 燙金 ornate ridge / finial / swallowtail tips / plaque
const DOOR = 0x33120f; // dark lacquered door

/**
 * Author one swallowtail (燕尾) glazed-tile roof tier centered at (0,y), pushing parts
 * into `out`. A low hipped tile slab with a wider darker overhang reading as the eave, a
 * gold main ridge front-to-back, and four corners each finished with a slim gold prong
 * that sweeps UP and OUT — the unmistakable 飛簷翹脊 corner. Lean (7 boxes) so the temple
 * can carry THREE stacked tiers within the triangle budget.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} y       roof-base height
 * @param {number} hw      half-width (x span / 2)
 * @param {number} hd      half-depth (z span / 2)
 * @param {number} th      roof slab thickness
 * @param {number} ridgeH  central ridge crest height above the slab
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  // Main tile slab — wide, shallow.
  out.push(box(hw * 2, th * 0.6, hd * 2, ROOF, { y: y + th * 0.7, hex2: ROOF }));
  // Slightly wider darker underside = the over-hanging eave.
  out.push(box(hw * 2 + 0.16, th * 0.45, hd * 2 + 0.16, ROOF_D, { y: y + th * 0.22 }));
  // Central main ridge — the ornate gold spine running front-to-back.
  out.push(box(hw * 2 - 0.04, ridgeH * 0.6, 0.13, GOLD, { y: y + th + ridgeH * 0.55 }));
  // Four swallowtail corner prongs sweeping up-and-out into forked gold tips.
  const sweep = 0.62; // up-tilt angle of the eave horn
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      out.push(
        box(hw * 0.5, 0.07, 0.12, GOLD, {
          rz: sx * sweep,
          x: sx * (hw + 0.12),
          y: y + th * 0.55 + hw * 0.16,
          z: sz * hd,
        })
      );
    }
  }
}

/**
 * One stone guardian lion (石獅): a seated body and a turned head atop the plinth edge,
 * just enough mass to read as a lion sitting by the temple steps.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} x     base-center x
 * @param {number} z     base-center z
 * @param {number} face  +1 / -1 — which way the head turns (inward)
 */
function stoneLion(out, x, z, face) {
  out.push(box(0.2, 0.3, 0.22, STONE, { x, y: 0.28, z, hex2: STONE_D })); // seated body
  out.push(box(0.16, 0.13, 0.14, STONE, { x: x - face * 0.03, y: 0.47, z: z + 0.05 })); // head
}

export const NM_ZHENLAN_TEMPLE = {
  id: 'zhenlan_temple',
  name: '大甲鎮瀾宮',
  landmarkId: 9,
  dioramaRHint: 20, // ~ forecourt-to-eave footprint hint in metres (grand temple)
  colorHex: 0xb5302a, // 朱紅 — the temple's signature lacquer red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the ridge gold
    const parts = [];

    // ---- Stone forecourt / platform (wide + low) ------------------------
    parts.push(box(4.6, 0.32, 3.0, STONE, { y: 0.16, hex2: STONE_D })); // 前埕 forecourt slab
    parts.push(box(3.7, 0.24, 2.3, STONE_D, { y: 0.34 })); // raised inner terrace
    parts.push(box(2.8, 0.13, 0.42, STONE, { y: 0.42, z: 1.18 })); // broad front steps

    // ---- Main hall body: wide red plastered wall + recessed shrine ------
    const bodyY = 0.46;
    parts.push(box(3.4, 1.0, 2.1, RED, { y: bodyY + 0.5, hex2: RED_D })); // red hall wall mass
    parts.push(box(2.9, 1.0, 1.8, RED_D, { y: bodyY + 0.5 })); // recessed inner shrine (deeper red)
    parts.push(box(0.5, 0.66, 0.08, DOOR, { y: bodyY + 0.33, z: 1.06 })); // central main door
    // three-bay flanking side doors (龍門 / 虎門)
    parts.push(box(0.34, 0.5, 0.08, DOOR, { x: -0.95, y: bodyY + 0.25, z: 1.06 }));
    parts.push(box(0.34, 0.5, 0.08, DOOR, { x: 0.95, y: bodyY + 0.25, z: 1.06 }));

    // ---- 牌樓 gateway facade: tall front pillars + lintel + gold plaque --
    // Two imposing front gate pillars rising past the wall (the wide paifang front).
    parts.push(cyl(0.13, 0.15, 1.5, 4, RED, { x: -1.5, y: bodyY + 0.75, z: 1.12, ry: PI / 4, hex2: RED_D }));
    parts.push(cyl(0.13, 0.15, 1.5, 4, RED, { x: 1.5, y: bodyY + 0.75, z: 1.12, ry: PI / 4, hex2: RED_D }));
    parts.push(box(3.3, 0.2, 0.16, RED, { y: bodyY + 1.42, z: 1.12 })); // gateway lintel beam
    parts.push(box(1.1, 0.34, 0.06, GOLD, { y: bodyY + 1.18, z: 1.16 + r })); // gold name plaque (鎮瀾宮)

    // ---- Front colonnade of red dragon columns (龍柱) -------------------
    for (const cx of [-1.0, 0.0, 1.0]) {
      parts.push(cyl(0.1, 0.11, 1.04, 4, RED, { x: cx, y: bodyY + 0.52, z: 0.86, ry: PI / 4, hex2: RED_D }));
    }
    // column-head tie-beam (架枋) with a gold trim band
    parts.push(box(3.5, 0.16, 0.15, RED, { y: bodyY + 1.02, z: 0.86 }));
    parts.push(box(3.5, 0.06, 0.17, GOLD, { y: bodyY + 1.1, z: 0.86 }));

    // ---- THREE stacked swallowtail roofs stepping UP and narrowing ------
    // Tier 1 — the broad lower eave over the whole hall.
    const roof1Y = bodyY + 1.1;
    swallowRoof(parts, roof1Y, 2.25, 1.6, 0.2, 0.42);

    // Tier 2 — setback hall + second eave.
    const mid2Y = roof1Y + 0.2 + 0.34;
    parts.push(box(2.5, 0.62, 1.55, RED, { y: mid2Y + 0.31, hex2: RED_D })); // setback hall body
    parts.push(box(2.55, 0.06, 1.6, GOLD, { y: mid2Y + 0.62 })); // gold cornice under eave
    const roof2Y = mid2Y + 0.62;
    swallowRoof(parts, roof2Y, 1.7, 1.18, 0.17, 0.36);

    // Tier 3 — top setback hall + crowning eave.
    const top3Y = roof2Y + 0.17 + 0.3;
    parts.push(box(1.6, 0.5, 1.0, RED, { y: top3Y + 0.25, hex2: RED_D })); // top setback hall body
    const roof3Y = top3Y + 0.5;
    swallowRoof(parts, roof3Y, 1.15, 0.78, 0.14, 0.3);

    // ---- Crowning gold gourd ridge ornament (寶塔/葫蘆 finial) ----------
    const topY = roof3Y + 0.14 + 0.3;
    parts.push(box(0.66, 0.12, 0.18, GOLD, { y: topY + 0.06 })); // ornate ridge cap base
    parts.push(cyl(0.045, 0.085, 0.34, 5, GOLD, { y: topY + 0.26 + r })); // gourd finial spire

    // ---- A pair of stone guardian lions flanking the front steps -------
    stoneLion(parts, -1.2, 1.32, 1);
    stoneLion(parts, 1.2, 1.32, -1);

    return finish(parts);
  },
};

export default NM_ZHENLAN_TEMPLE;
