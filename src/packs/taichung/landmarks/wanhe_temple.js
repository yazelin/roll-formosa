/**
 * @file packs/taichung/landmarks/wanhe_temple.js — Roll Formosa Taichung pack, hero landmark.
 *
 * 萬和宮 (Wanhe Temple, 南屯 — 台中最古老的媽祖廟之一). A curated hero geometry, not
 * a repeatable chunk archetype: a wide red-walled single hall (三川殿) fronted by a
 * red lacquer colonnade, capped by ONE broad low 燕尾翹脊 (swallowtail) tile roof whose
 * four corners sweep up-and-out into forked gold-tipped horns, with a gold gourd ridge
 * ornament. A small pair of stone 石獅 (guardian lions) flank the front steps. The
 * unmistakable southern-Fujian 媽祖廟 silhouette: red wall + dark wide eave + gold spine.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding sphere
 * (radius 1), so this is authored in unit-ish space with correct temple PROPORTIONS
 * (WIDE + LOW, ONE big horizontal swallowtail roof — NOT a tower). The integration step
 * owns the size-ladder; dioramaRHint is the real-world footprint hint. <= 600 triangles.
 */

import { box, cyl, finish } from '../geomHelpers.js';

// Palette — temple materials.
const STONE = 0xbcb4a3; // 砂岩 grey courtyard / base stone
const STONE_D = 0x9c9483; // darker stone for steps / shadow gradient
const RED = 0xb23a2e; // 朱紅 lacquered red wall / column (signature hue)
const RED_D = 0x8c2a20; // deeper red shadow side
const ROOF = 0x33312e; // 深灰黑 glazed roof tile (the wide dark eave)
const ROOF_D = 0x26241f; // deeper tile under-eave shadow
const GOLD = 0xcaa24a; // 燙金 ornate ridge / finial / corner tips
const WHITE = 0xe7e0d2; // plastered wall / pale lattice stone

/**
 * Author one swallowtail (燕尾) tile roof tier centered at (0,y), pushing parts into
 * `out`. A low hipped tile mass; each of the four corners gets a thin tile spur that
 * sweeps UP and OUT into a forked gold tip — the 飛簷翹脊 corner that defines the read.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} y       roof-base height
 * @param {number} hw      half-width (x span / 2)
 * @param {number} hd      half-depth (z span / 2)
 * @param {number} th      roof slab thickness
 * @param {number} ridgeH  central ridge crest height above the slab
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  // Main tile slab — wide, shallow; a slightly wider darker underside reads as the
  // over-hanging eave.
  out.push(box(hw * 2, th * 0.6, hd * 2, ROOF, { y: y + th * 0.7, hex2: ROOF }));
  out.push(box(hw * 2 + 0.14, th * 0.45, hd * 2 + 0.14, ROOF_D, { y: y + th * 0.22 }));
  // Sloped ridge crown: two long tile planes leaning together toward a central spine.
  const slopeLen = hd * 1.22;
  for (const s of [-1, 1]) {
    out.push(
      box(hw * 2 - 0.06, 0.04, slopeLen, ROOF, {
        rx: s * 0.6,
        y: y + th + ridgeH * 0.5,
        z: s * hd * 0.42,
        hex2: ROOF,
      })
    );
  }
  // Central main ridge — the ornate gold spine running front-to-back.
  out.push(box(hw * 2 - 0.04, ridgeH * 0.55, 0.13, GOLD, { y: y + th + ridgeH * 0.75 }));

  // Four swallowtail corner spurs: a thin tile bar sweeping up-and-out, then a forked
  // gold tip continuing the upward sweep — the unmistakable 燕尾 corner.
  const sweep = 0.58; // up-tilt angle of the eave horn
  const spurLen = hw * 0.66;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerX = sx * hw;
      const cornerZ = sz * hd;
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
 * One small stone guardian lion (石獅): a low plinth, a seated body, a head, and a
 * pricked-up tail nub — just enough mass to read as a lion sitting by the steps.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} x  base-center x
 * @param {number} z  base-center z
 * @param {number} face  +1 / -1 sign — which way the head turns (inward)
 */
function stoneLion(out, x, z, face) {
  out.push(box(0.28, 0.12, 0.28, STONE_D, { x, y: 0.06, z })); // plinth
  out.push(box(0.18, 0.26, 0.2, STONE, { x, y: 0.25, z, hex2: STONE_D })); // seated haunches
  out.push(box(0.15, 0.12, 0.13, STONE, { x: x - face * 0.02, y: 0.42, z: z + 0.04 })); // head
  out.push(box(0.06, 0.18, 0.07, STONE, { x: x + face * 0.09, y: 0.3, z: z - 0.07, rz: face * 0.4 })); // tail
}

export const NM_WANHE_TEMPLE = {
  id: 'wanhe_temple',
  name: '萬和宮',
  landmarkId: 5,
  dioramaRHint: 15, // ~ courtyard-to-eave footprint hint in metres
  colorHex: 0xb23a2e, // 朱紅 — the temple's signature lacquer red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the ridge gold
    const parts = [];

    // ---- Stone base / courtyard platform (wide + low) -------------------
    parts.push(box(3.9, 0.3, 2.6, STONE, { y: 0.15, hex2: STONE_D })); // courtyard slab
    parts.push(box(3.1, 0.22, 1.95, STONE_D, { y: 0.31 })); // raised inner terrace
    parts.push(box(2.4, 0.12, 0.36, STONE, { y: 0.38, z: 1.02 })); // front entry steps

    // ---- 三川殿 front body: red plastered wall + recessed shrine ---------
    const bodyY = 0.42;
    parts.push(box(2.8, 0.88, 1.78, RED, { y: bodyY + 0.44, hex2: RED_D })); // red hall wall mass
    parts.push(box(2.4, 0.88, 1.5, RED_D, { y: bodyY + 0.44 })); // recessed inner shrine (deeper red)
    parts.push(box(2.0, 0.5, 0.06, WHITE, { y: bodyY + 0.32, z: 0.9 })); // pale plaster panel band

    // three-bay (三川) doorway: a wider central main door flanked by two side doors
    parts.push(box(0.46, 0.6, 0.08, 0x34120f, { y: bodyY + 0.3, z: 0.92 })); // central main door
    for (const dx of [-0.82, 0.82]) {
      parts.push(box(0.32, 0.48, 0.08, 0x34120f, { x: dx, y: bodyY + 0.24, z: 0.92 })); // side door (龍門/虎門)
    }

    // front colonnade of red lacquer columns — the recognizable temple porch
    for (const cx of [-1.22, -0.4, 0.4, 1.22]) {
      parts.push(cyl(0.1, 0.11, 0.98, 6, RED, { x: cx, y: bodyY + 0.49, z: 0.92, hex2: RED_D }));
    }
    // one rear corner column for depth read
    parts.push(cyl(0.09, 0.1, 0.98, 6, RED, { x: -1.22, y: bodyY + 0.49, z: -0.82, hex2: RED_D }));

    // column-head beam (架枋) tying the colonnade — red with a gold trim band
    parts.push(box(2.9, 0.15, 0.14, RED, { y: bodyY + 0.95, z: 0.92 }));
    parts.push(box(2.9, 0.05, 0.16, GOLD, { y: bodyY + 1.03, z: 0.92 + r })); // gold trim

    // ---- The big swallowtail roof (the 燕尾翹脊 wide dark eave) ----------
    swallowRoof(parts, bodyY + 1.03, 1.95, 1.3, 0.18, 0.48);

    // ---- Crowning ridge ornament (寶塔/葫蘆 gourd finial on the spine) ---
    const topY = bodyY + 1.03 + 0.18 + 0.48;
    parts.push(box(0.62, 0.12, 0.18, GOLD, { y: topY + 0.06 })); // ornate ridge cap base
    parts.push(cyl(0.05, 0.085, 0.2, 6, GOLD, { y: topY + 0.19 })); // gourd finial body
    parts.push(cyl(0.07, 0.0, 0.15, 6, GOLD, { y: topY + 0.36 + r })); // gourd finial crown

    // ---- A small pair of stone guardian lions flanking the front steps --
    stoneLion(parts, -1.05, 1.22, 1);
    stoneLion(parts, 1.05, 1.22, -1);

    return finish(parts);
  },
};

export default NM_WANHE_TEMPLE;
