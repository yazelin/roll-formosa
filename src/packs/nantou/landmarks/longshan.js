/**
 * @file packs/taipei/landmarks/longshan.js — Roll Formosa Taipei pack, hero landmark.
 *
 * 龍山寺 (Lungshan / Longshan Temple, 萬華 Wanhua). A curated hero geometry, not a
 * repeatable chunk archetype: a wide stone base/courtyard, a colonnade of red
 * columns, and TWO stacked swallowtail-eave (燕尾) tile roofs whose corners sweep
 * up into forked points, crowned by an ornate gold ridge. Red + gold + dark-green
 * glazed tile — the southern-Fujian temple silhouette of old Taipei.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct temple
 * PROPORTIONS (wide + low, two horizontal roofs — NOT a tower). The integration
 * step owns the size-ladder; dioramaRHint is the real-world footprint hint.
 */

import { box, cyl, finish } from '../geomHelpers.js';

// Palette — temple materials.
const STONE = 0xb9b2a4; // 觀音山石 grey courtyard / base stone
const STONE_D = 0x9c9587; // darker stone for steps / shadow gradient
const RED = 0xb4262a; // 朱紅 lacquered red column / wall
const RED_D = 0x8e1d22; // deeper red shadow side
const GREEN = 0x2f5d44; // 墨綠 glazed roof tile
const GREEN_D = 0x224534; // deeper green underside of eave
const GOLD = 0xd4a64a; // 燙金 ornate ridge / finial
const WHITE = 0xece6da; // plastered wall / lattice pale stone

/**
 * Author one swallowtail (燕尾) tile roof tier centered at (0,y) with the given
 * half-spans, pushing parts into `out`. The roof is a low hipped tile mass; each
 * of the four corners gets a thin tile spur that sweeps UP and OUT into the forked
 * swallowtail point that defines the silhouette.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} y       roof-base height
 * @param {number} hw      half-width (x span / 2)
 * @param {number} hd      half-depth (z span / 2)
 * @param {number} th      roof slab thickness
 * @param {number} ridgeH  central ridge crest height above the slab
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  // Main tile slab — wide, shallow; a slightly wider darker underside band reads
  // as the over-hanging eave.
  out.push(box(hw * 2, th * 0.6, hd * 2, GREEN, { y: y + th * 0.7 }));
  out.push(box(hw * 2 + 0.1, th * 0.45, hd * 2 + 0.1, GREEN_D, { y: y + th * 0.22 }));
  // Sloped ridge crown: two long tile planes leaning together to a central spine.
  const slopeLen = hd * 1.18;
  for (const s of [-1, 1]) {
    out.push(
      box(hw * 2 - 0.06, 0.04, slopeLen, GREEN, {
        rx: s * 0.62,
        y: y + th + ridgeH * 0.5,
        z: s * hd * 0.42,
        hex2: GREEN,
      })
    );
  }
  // Central main ridge — the ornate gold spine running front-to-back.
  out.push(box(hw * 2 - 0.04, ridgeH * 0.55, 0.12, GOLD, { y: y + th + ridgeH * 0.75 }));

  // Four swallowtail corner spurs: a thin tile bar sweeping up-and-out, then a
  // forked gold finial tip — the unmistakable 燕尾 corner.
  const sweep = 0.55; // up-tilt angle of the eave horn
  const spurLen = hw * 0.7;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerX = sx * hw;
      const cornerZ = sz * hd;
      // rising tile spur along the eave line toward the corner
      out.push(
        box(spurLen, 0.07, 0.12, GREEN, {
          rz: sx * sweep,
          x: cornerX - sx * spurLen * 0.32,
          y: y + th * 0.5 + spurLen * 0.18,
          z: cornerZ,
        })
      );
      // swallowtail tip — a slim gold prong continuing the upward sweep into the
      // forked point that crowns the corner.
      const tipX = cornerX + sx * 0.18;
      const tipY = y + th * 0.5 + spurLen * 0.46;
      out.push(box(0.2, 0.06, 0.1, GOLD, { rz: sx * (sweep + 0.3), x: tipX, y: tipY, z: cornerZ }));
    }
  }
}

export const NM_LONGSHAN = {
  id: 'longshan_temple',
  name: '龍山寺',
  landmarkId: 1,
  dioramaRHint: 28, // ~ courtyard-to-eave footprint radius in metres
  colorHex: 0xb4262a, // 朱紅 — the temple's signature lacquer red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on ridge gold
    const parts = [];

    // ---- Stone base / courtyard platform (wide + low) -------------------
    parts.push(box(4.2, 0.34, 3.0, STONE, { y: 0.17, hex2: STONE_D })); // courtyard slab
    parts.push(box(3.4, 0.26, 2.3, STONE_D, { y: 0.34 })); // raised inner terrace
    parts.push(box(2.9, 0.14, 0.4, STONE, { y: 0.41, z: 1.16 })); // front entry steps

    // ---- Lower hall body: plastered wall + red column colonnade ---------
    const bodyY = 0.47;
    parts.push(box(3.0, 0.95, 2.0, WHITE, { y: bodyY + 0.475 })); // hall wall mass (pale plaster)
    parts.push(box(2.6, 0.95, 1.7, RED_D, { y: bodyY + 0.475 })); // recessed inner shrine (deep red)
    // front colonnade of red columns (the recognizable temple porch)
    for (const cx of [-1.35, -0.45, 0.45, 1.35]) {
      parts.push(cyl(0.12, 0.13, 1.05, 5, RED, { x: cx, y: bodyY + 0.525, z: 0.98, hex2: RED_D }));
    }
    // one rear corner column for depth read
    parts.push(cyl(0.11, 0.12, 1.05, 5, RED, { x: -1.35, y: bodyY + 0.525, z: -0.9, hex2: RED_D }));
    // column-head beam (架枋) tying the colonnade — red with gold trim
    parts.push(box(3.1, 0.16, 0.14, RED, { y: bodyY + 1.02, z: 0.98 }));
    parts.push(box(3.1, 0.05, 0.16, GOLD, { y: bodyY + 1.1, z: 0.98 }));

    // ---- Lower swallowtail roof (the big eave) --------------------------
    swallowRoof(parts, bodyY + 1.1, 2.05, 1.45, 0.18, 0.5);

    // ---- Upper hall (setback) + second stacked swallowtail roof --------
    const upperY = bodyY + 1.1 + 0.18 + 0.4; // sit above lower ridge
    parts.push(box(1.9, 0.6, 1.25, RED, { y: upperY + 0.3, hex2: RED_D })); // upper drum-tower body
    // upper short columns
    for (const cx of [-0.7, 0.7]) {
      parts.push(cyl(0.08, 0.09, 0.6, 4, RED, { x: cx, y: upperY + 0.3, z: 0.6, hex2: RED_D }));
    }
    parts.push(box(2.0, 0.05, 1.3, GOLD, { y: upperY + 0.6 })); // gold cornice band under upper eave
    swallowRoof(parts, upperY + 0.62, 1.35, 0.95, 0.15, 0.42);

    // ---- Crowning ridge ornament (寶塔/葫蘆 gourd finial) ---------------
    const topY = upperY + 0.62 + 0.15 + 0.42;
    parts.push(box(0.7, 0.12, 0.18, GOLD, { y: topY + 0.06 })); // ornate ridge cap base
    parts.push(cyl(0.05, 0.09, 0.22, 6, GOLD, { y: topY + 0.2 })); // gourd finial body
    parts.push(cyl(0.07, 0.0, 0.16, 6, GOLD, { y: topY + 0.38 + r })); // gourd finial crown

    return finish(parts);
  },
};
