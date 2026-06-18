/**
 * @file packs/taichung/landmarks/lecheng_temple.js — Roll Formosa Taichung pack, hero landmark.
 *
 * 樂成宮 (Lecheng Temple, 旱溪媽祖 — 台中東區百年媽祖廟). A curated hero geometry, not a
 * repeatable chunk archetype: the grand TWO-HALL southern-Fujian 媽祖廟 read. A wide red
 * lacquer 三川殿 (front hall) fronted by a red column colonnade and three-bay doors, capped
 * by a broad dark 燕尾翹脊 (swallowtail) tile roof; behind and ABOVE it a taller, setback
 * 正殿 (main hall) with its own higher swallowtail roof crowned by a gold 葫蘆 gourd finial.
 * Gold ridge spines + a pair of stone 石獅 guardian lions flank the front steps. The
 * unmistakable layered red-wall / wide-dark-eave / gold-spine temple silhouette.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an engine
 * red line. finish() merges → recenters → normalizes to a UNIT bounding sphere (radius 1),
 * so this is authored in unit-ish space with correct temple PROPORTIONS (WIDE + LOW, two
 * stacked horizontal swallowtail roofs — NOT a tower). The integration step owns the
 * size-ladder; dioramaRHint is the real-world footprint hint. <= 600 triangles.
 */

import { box, cyl, finish, PI } from '../geomHelpers.js';

// Palette — temple materials.
const STONE = 0xbcb4a3; // 砂岩 grey courtyard / base stone
const STONE_D = 0x9c9483; // darker stone for steps / shadow gradient
const RED = 0xb23a2e; // 朱紅 lacquered red wall / column (signature hue)
const RED_D = 0x8c2a20; // deeper red shadow side
const ROOF = 0x33312e; // 深灰黑 glazed roof tile (the wide dark eave)
const ROOF_D = 0x26241f; // deeper tile under-eave shadow
const GOLD = 0xcaa24a; // 燙金 ornate ridge / finial / corner tips
const DOOR = 0x34120f; // dark lacquer door panel

/**
 * Author one swallowtail (燕尾) tile roof tier centered at (0,y), pushing parts into
 * `out`. A low, wide hipped tile slab whose four corners sweep UP-and-OUT into a thin
 * tile spur tipped by a forked gold prong — the 飛簷翹脊 corner that defines the read —
 * with an ornate gold ridge spine running front-to-back along the crest.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} y       roof-base height
 * @param {number} hw      half-width (x span / 2)
 * @param {number} hd      half-depth (z span / 2)
 * @param {number} th      roof slab thickness
 * @param {number} ridgeH  central ridge crest height above the slab
 * @param {number} [zc]    z-center of the roof (so a setback hall's roof sits over it)
 */
function swallowRoof(out, y, hw, hd, th, ridgeH, zc = 0) {
  // Main tile slab — wide, shallow; a slightly wider darker underside reads as the
  // over-hanging eave.
  out.push(box(hw * 2, th * 0.62, hd * 2, ROOF, { y: y + th * 0.7, z: zc, hex2: ROOF }));
  out.push(box(hw * 2 + 0.16, th * 0.44, hd * 2 + 0.16, ROOF_D, { y: y + th * 0.2, z: zc }));
  // Central main ridge — the ornate gold spine running front-to-back along the crest.
  out.push(box(hw * 2 - 0.04, ridgeH * 0.6, 0.14, GOLD, { y: y + th + ridgeH * 0.55, z: zc }));

  // Four swallowtail corner spurs: a thin tile bar sweeping up-and-out, then a forked
  // gold tip continuing the upward sweep — the unmistakable 燕尾 corner.
  const sweep = 0.58; // up-tilt angle of the eave horn
  const spurLen = hw * 0.68;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerX = sx * hw;
      const cornerZ = zc + sz * hd;
      // rising tile spur along the eave line toward the corner
      out.push(
        box(spurLen, 0.07, 0.13, ROOF, {
          rz: sx * sweep,
          x: cornerX - sx * spurLen * 0.32,
          y: y + th * 0.5 + spurLen * 0.18,
          z: cornerZ,
        })
      );
      // swallowtail tip — a slim gold prong crowning the corner fork
      const tipX = cornerX + sx * 0.18;
      const tipY = y + th * 0.5 + spurLen * 0.46;
      out.push(box(0.2, 0.06, 0.11, GOLD, { rz: sx * (sweep + 0.3), x: tipX, y: tipY, z: cornerZ }));
    }
  }
}

/**
 * One small stone guardian lion (石獅): a low plinth, a seated body, and a turned head —
 * just enough mass to read as a lion sitting by the steps.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} x  base-center x
 * @param {number} z  base-center z
 * @param {number} face  +1 / -1 — which way the head turns (inward)
 */
function stoneLion(out, x, z, face) {
  out.push(box(0.28, 0.12, 0.28, STONE_D, { x, y: 0.06, z })); // plinth
  out.push(box(0.18, 0.27, 0.2, STONE, { x, y: 0.255, z, hex2: STONE_D })); // seated haunches
  out.push(box(0.15, 0.12, 0.13, STONE, { x: x - face * 0.02, y: 0.43, z: z + 0.04 })); // turned head
}

export const NM_LECHENG_TEMPLE = {
  id: 'lecheng_temple',
  name: '樂成宮',
  landmarkId: 9,
  dioramaRHint: 15, // ~ courtyard-to-eave footprint hint in metres
  colorHex: 0xb23a2e, // 朱紅 — the temple's signature lacquer red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the ridge gold
    const parts = [];

    // ---- Stone base / courtyard platform (wide + low) -------------------
    parts.push(box(4.0, 0.3, 3.0, STONE, { y: 0.15, hex2: STONE_D })); // courtyard slab
    parts.push(box(3.2, 0.22, 2.3, STONE_D, { y: 0.31 })); // raised inner terrace
    parts.push(box(2.4, 0.12, 0.36, STONE, { y: 0.38, z: 1.22 })); // front entry steps

    // ---- 三川殿 front hall: red plastered wall + three-bay doorway -------
    const bodyY = 0.42;
    parts.push(box(2.9, 0.86, 1.0, RED, { y: bodyY + 0.43, z: 0.55, hex2: RED_D })); // red front wall mass

    // three-bay (三川) doorway: a wider central main door flanked by two side doors
    parts.push(box(0.46, 0.6, 0.08, DOOR, { y: bodyY + 0.3, z: 1.06 })); // central main door
    for (const dx of [-0.82, 0.82]) {
      parts.push(box(0.32, 0.48, 0.08, DOOR, { x: dx, y: bodyY + 0.24, z: 1.06 })); // side door (龍門/虎門)
    }

    // front colonnade of red lacquer columns — the recognizable temple porch
    for (const cx of [-1.26, -0.42, 0.42, 1.26]) {
      parts.push(cyl(0.1, 0.11, 0.96, 4, RED, { x: cx, y: bodyY + 0.48, z: 1.0, ry: PI / 4, hex2: RED_D }));
    }
    // column-head beam (架枋) tying the colonnade — red with a gold trim band
    parts.push(box(3.0, 0.15, 0.14, RED, { y: bodyY + 0.93, z: 1.0 }));
    parts.push(box(3.0, 0.05, 0.16, GOLD, { y: bodyY + 1.0, z: 1.0 + r })); // gold trim

    // ---- 三川殿 swallowtail roof (the wide dark front eave) --------------
    const frontRoofY = bodyY + 1.0;
    swallowRoof(parts, frontRoofY, 1.95, 0.92, 0.17, 0.42);

    // ---- 正殿 main hall (setback + TALLER) behind the front hall --------
    const mainY = bodyY; // shares the terrace level
    parts.push(box(2.5, 1.42, 1.05, RED, { y: mainY + 0.71, z: -0.55, hex2: RED_D })); // tall main hall wall
    parts.push(box(2.0, 1.42, 0.95, RED_D, { y: mainY + 0.71, z: -0.58 })); // recessed deep-red interior
    parts.push(box(1.5, 0.7, 0.08, DOOR, { y: mainY + 0.45, z: -0.02 })); // tall central shrine door
    // gold cornice band under the upper eave
    parts.push(box(2.6, 0.06, 1.15, GOLD, { y: mainY + 1.46, z: -0.55 }));

    // ---- 正殿 swallowtail roof (the higher, grander eave, set back over the hall) --
    const mainRoofY = mainY + 1.46;
    swallowRoof(parts, mainRoofY, 1.65, 1.05, 0.2, 0.52, -0.55);

    // ---- Crowning ridge ornament (葫蘆 gourd finial on the main spine) --
    const topY = mainRoofY + 0.2 + 0.52;
    parts.push(box(0.66, 0.12, 0.18, GOLD, { y: topY + 0.06, z: -0.55 })); // ornate ridge cap base
    parts.push(cyl(0.055, 0.09, 0.22, 5, GOLD, { y: topY + 0.2, z: -0.55 })); // gourd finial body
    parts.push(cyl(0.075, 0.0, 0.16, 5, GOLD, { y: topY + 0.38 + r, z: -0.55 })); // gourd finial crown

    // ---- A small pair of stone guardian lions flanking the front steps --
    stoneLion(parts, -1.08, 1.32, 1);
    stoneLion(parts, 1.08, 1.32, -1);

    return finish(parts);
  },
};

export default NM_LECHENG_TEMPLE;
