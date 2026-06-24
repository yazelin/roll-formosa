/**
 * @file packs/taipei/landmarks/xingtian.js — Roll Formosa Taipei pack, hero landmark.
 *
 * 行天宮 (Xingtian Temple / Hsing Tian Kong, 中山區). The Guan Gong temple of
 * old Taipei: NOT a stacked pagoda but ONE broad, low, single-hall block fronting
 * a very wide open courtyard, a long row of red columns across the porch, and a
 * single dominant DARK-GREEN glazed swallowtail-eave (燕尾) tile roof whose four
 * corners fork up into points. A small free-standing entry gate sits ahead of the
 * hall, reinforcing the wide horizontal courtyard read.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct temple
 * PROPORTIONS — WIDE + LOW, a single broad roof (distinct from Longshan's two
 * stacked tiers). rng is tiny non-structural jitter only.
 */

import { box, cyl, finish } from '../geomHelpers.js';

// Palette — Xingtian materials (red + dark-green glazed tile).
const STONE = 0xc3bdae; // pale stone courtyard / base
const STONE_D = 0xa39d8e; // darker stone for steps / shadow gradient
const RED = 0xb22a26; // 朱紅 lacquered red column / wall
const RED_D = 0x8a1f1d; // deeper red shadow side / recess
const GREEN = 0x2c5a3f; // 墨綠 glazed roof tile (the signature dark-green)
const GREEN_D = 0x1f4530; // deeper green underside of eave
const GOLD = 0xcfa247; // 燙金 ridge spine / finial
const WHITE = 0xe9e3d6; // plastered wall / pale stone

/**
 * Author one broad swallowtail (燕尾) tile roof tier centered at (0,y), pushing
 * parts into `out`. A low wide dark-green tile mass with a wider darker eave band,
 * a sloped two-plane crown, a gold ridge spine, and four corner spurs that sweep
 * UP and OUT into forked gold tips — the unmistakable Taiwanese-temple silhouette.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} y       roof-base height
 * @param {number} hw      half-width (x span / 2)
 * @param {number} hd      half-depth (z span / 2)
 * @param {number} th      roof slab thickness
 * @param {number} ridgeH  central ridge crest height above the slab
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  // Wide shallow tile slab + a slightly wider darker band reading as the eave.
  out.push(box(hw * 2, th * 0.55, hd * 2, GREEN, { y: y + th * 0.72 }));
  out.push(box(hw * 2 + 0.12, th * 0.42, hd * 2 + 0.12, GREEN_D, { y: y + th * 0.2 }));
  // Sloped ridge crown: two long tile planes leaning together to the spine.
  const slopeLen = hd * 1.2;
  for (const s of [-1, 1]) {
    out.push(
      box(hw * 2 - 0.06, 0.04, slopeLen, GREEN, {
        rx: s * 0.6,
        y: y + th + ridgeH * 0.5,
        z: s * hd * 0.42,
      })
    );
  }
  // Central main ridge — the ornate gold spine running side-to-side.
  out.push(box(hw * 2 - 0.04, ridgeH * 0.5, 0.12, GOLD, { y: y + th + ridgeH * 0.75 }));

  // Four swallowtail corner spurs: thin tile bar sweeping up-and-out, then a gold
  // forked prong tip continuing the upward sweep — the 燕尾 corner that defines it.
  const sweep = 0.58;
  const spurLen = hw * 0.66;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerX = sx * hw;
      const cornerZ = sz * hd;
      out.push(
        box(spurLen, 0.07, 0.12, GREEN, {
          rz: sx * sweep,
          x: cornerX - sx * spurLen * 0.32,
          y: y + th * 0.5 + spurLen * 0.2,
          z: cornerZ,
        })
      );
      out.push(
        box(0.2, 0.06, 0.1, GOLD, {
          rz: sx * (sweep + 0.32),
          x: cornerX + sx * 0.18,
          y: y + th * 0.5 + spurLen * 0.48,
          z: cornerZ,
        })
      );
    }
  }
}

export const NM_XINGTIAN = {
  id: 'xingtian_temple',
  name: '行天宮',
  landmarkId: 9,
  dioramaRHint: 34, // ~ courtyard-to-eave footprint radius in metres
  colorHex: 0xb22a26, // 朱紅 — the temple's signature lacquer red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the finial
    const parts = [];

    // ---- Wide stone courtyard platform (very broad + low) ---------------
    parts.push(box(5.0, 0.3, 3.4, STONE, { y: 0.15, hex2: STONE_D })); // courtyard slab
    parts.push(box(3.6, 0.24, 2.2, STONE_D, { y: 0.32 })); // raised inner terrace under hall
    parts.push(box(3.0, 0.14, 0.42, STONE, { y: 0.39, z: 1.18 })); // front entry steps

    // ---- Free-standing entry gate ahead of the hall (courtyard read) ----
    // two short red gate columns + a beam, set forward on the courtyard.
    const gateY = 0.3;
    for (const cx of [-1.05, 1.05]) {
      parts.push(cyl(0.1, 0.11, 0.95, 5, RED, { x: cx, y: gateY + 0.475, z: 2.45, hex2: RED_D }));
    }
    parts.push(box(2.5, 0.18, 0.16, RED, { y: gateY + 0.95, z: 2.45 })); // gate lintel
    parts.push(box(2.7, 0.05, 0.2, GOLD, { y: gateY + 1.05, z: 2.45 })); // gold trim on lintel
    parts.push(box(2.7, 0.16, 0.7, GREEN, { y: gateY + 1.18, z: 2.45 })); // little gate roof
    parts.push(box(2.8, 0.1, 0.8, GREEN_D, { y: gateY + 1.06, z: 2.45 })); // gate eave band

    // ---- Single broad hall body: pale plaster wall + deep-red shrine ----
    const bodyY = 0.44;
    const bodyH = 1.0;
    parts.push(box(3.4, bodyH, 1.9, WHITE, { y: bodyY + bodyH / 2 })); // hall wall mass
    parts.push(box(3.0, bodyH, 1.6, RED_D, { y: bodyY + bodyH / 2 })); // recessed inner shrine

    // ---- Long row of red columns across the porch (the temple read) -----
    const porchZ = 0.93;
    const colSpan = 3.0;
    const nCol = 6;
    for (let i = 0; i < nCol; i++) {
      const cx = -colSpan / 2 + (colSpan / (nCol - 1)) * i;
      parts.push(cyl(0.11, 0.12, bodyH + 0.05, 5, RED, { x: cx, y: bodyY + bodyH / 2 + 0.02, z: porchZ, hex2: RED_D }));
    }
    // two rear corner columns for depth read
    for (const cx of [-1.5, 1.5]) {
      parts.push(cyl(0.1, 0.11, bodyH + 0.05, 5, RED, { x: cx, y: bodyY + bodyH / 2 + 0.02, z: -0.85, hex2: RED_D }));
    }
    // column-head beam (架枋) tying the colonnade — red with a gold band.
    parts.push(box(3.5, 0.16, 0.16, RED, { y: bodyY + bodyH + 0.04, z: porchZ }));
    parts.push(box(3.5, 0.06, 0.18, GOLD, { y: bodyY + bodyH + 0.14, z: porchZ }));

    // ---- THE single dominant swallowtail roof (visual hero) -------------
    swallowRoof(parts, bodyY + bodyH + 0.16, 2.35, 1.42, 0.2, 0.56);

    // ---- Crowning ridge ornament (寶塔/葫蘆 gourd finial) ---------------
    const topY = bodyY + bodyH + 0.16 + 0.2 + 0.56;
    parts.push(box(0.8, 0.12, 0.2, GOLD, { y: topY + 0.06 })); // ornate ridge cap base
    parts.push(cyl(0.05, 0.09, 0.24, 6, GOLD, { y: topY + 0.22 })); // gourd finial body
    parts.push(cyl(0.07, 0.0, 0.18, 6, GOLD, { y: topY + 0.42 + r })); // gourd finial crown

    return finish(parts);
  },
};

export default NM_XINGTIAN;
