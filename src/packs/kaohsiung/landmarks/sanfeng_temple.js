/**
 * @file packs/kaohsiung/landmarks/sanfeng_temple.js — Roll Formosa Kaohsiung pack landmark.
 *
 * 三鳳宮 (Sanfeng Temple, 高雄三民區). A curated hero geometry, not a repeatable
 * chunk archetype: a wide stone courtyard platform, a 三川殿 front face of THREE
 * bays divided by red lacquer columns, and a sweeping 燕尾 (swallowtail) tile roof
 * whose four corners fork up-and-out into gold finials — the 飛簷翹脊 silhouette of
 * a southern-Fujian 媽祖/王爺 temple. Red columns, dark-green glazed tile, gold ridge.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct temple
 * PROPORTIONS (wide + low, ONE big horizontal swallowtail roof — NOT a tower). The
 * integration step owns the size-ladder; dioramaRHint is the real-world hint.
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish } from '../geomHelpers.js';

// Palette — temple materials.
const STONE = 0xbab3a4; // 觀音山石 grey courtyard / base stone
const STONE_D = 0x9d9587; // darker stone for steps / shadow gradient
const RED = 0xc0303a; // 朱紅 lacquered red column / wall (signature hue)
const RED_D = 0x931f27; // deeper red shadow side
const GREEN = 0x2f5d44; // 墨綠 glazed roof tile
const GREEN_D = 0x224534; // deeper green under-eave
const GOLD = 0xd4a64a; // 燙金 ornate ridge / finial
const WHITE = 0xece6da; // plastered wall / pale lattice stone

/**
 * Author one swallowtail (燕尾) tile roof tier centered at (0,y), pushing parts
 * into `out`. A low hipped tile mass; each of the four corners gets a thin tile
 * spur sweeping UP and OUT into a forked gold finial — the 飛簷翹脊 corner.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} y       roof-base height
 * @param {number} hw      half-width (x span / 2)
 * @param {number} hd      half-depth (z span / 2)
 * @param {number} th      roof slab thickness
 * @param {number} ridgeH  central ridge crest height above the slab
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  // Main tile slab + a slightly wider darker underside band reading as the eave.
  out.push(box(hw * 2, th * 0.6, hd * 2, GREEN, { y: y + th * 0.7, hex2: GREEN }));
  out.push(box(hw * 2 + 0.12, th * 0.45, hd * 2 + 0.12, GREEN_D, { y: y + th * 0.22 }));
  // Sloped ridge crown: two long tile planes leaning together to a central spine.
  const slopeLen = hd * 1.2;
  for (const s of [-1, 1]) {
    out.push(
      box(hw * 2 - 0.06, 0.04, slopeLen, GREEN, {
        rx: s * 0.6,
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
  const spurLen = hw * 0.66;
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

export const NM_SANFENG = {
  id: 'sanfeng_temple',
  name: '三鳳宮',
  landmarkId: 8,
  dioramaRHint: 85, // ~ courtyard-to-eave footprint hint
  colorHex: 0xc0303a, // 朱紅 — the temple's signature lacquer red
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on ridge gold
    const parts = [];

    // ---- Stone base / courtyard platform (wide + low) -------------------
    parts.push(box(4.0, 0.32, 2.7, STONE, { y: 0.16, hex2: STONE_D })); // courtyard slab
    parts.push(box(3.2, 0.24, 2.0, STONE_D, { y: 0.32 })); // raised inner terrace
    parts.push(box(2.6, 0.13, 0.38, STONE, { y: 0.40, z: 1.05 })); // front entry steps

    // ---- 三川殿 front body: plastered wall + recessed shrine + red colonnade
    const bodyY = 0.45;
    parts.push(box(2.9, 0.92, 1.85, WHITE, { y: bodyY + 0.46 })); // hall wall mass (pale plaster)
    parts.push(box(2.5, 0.92, 1.55, RED_D, { y: bodyY + 0.46 })); // recessed inner shrine (deep red)

    // three-bay (三川) doorway: two dark door openings flanking a wider central bay
    parts.push(box(0.46, 0.62, 0.08, 0x3a1417, { y: bodyY + 0.31, z: 0.94 })); // central main door
    for (const dx of [-0.86, 0.86]) {
      parts.push(box(0.34, 0.5, 0.08, 0x3a1417, { x: dx, y: bodyY + 0.25, z: 0.94 })); // side dragon/tiger door
    }

    // front colonnade of red lacquer columns — the four 三川殿 columns + flanks
    for (const cx of [-1.28, -0.42, 0.42, 1.28]) {
      parts.push(cyl(0.11, 0.12, 1.02, 5, RED, { x: cx, y: bodyY + 0.51, z: 0.95, hex2: RED_D }));
    }
    // a rear corner column for depth read
    parts.push(cyl(0.1, 0.11, 1.02, 5, RED, { x: -1.28, y: bodyY + 0.51, z: -0.85, hex2: RED_D }));

    // column-head beam (架枋) tying the colonnade — red with a gold trim band
    parts.push(box(3.0, 0.16, 0.14, RED, { y: bodyY + 0.99, z: 0.95 }));
    parts.push(box(3.0, 0.05, 0.16, GOLD, { y: bodyY + 1.07, z: 0.95 + r })); // gold trim

    // ---- Big swallowtail roof (the 飛簷翹脊 eave) ------------------------
    swallowRoof(parts, bodyY + 1.07, 2.0, 1.35, 0.18, 0.5);

    // ---- Crowning ridge ornament (寶塔/葫蘆 gourd finial on the central ridge)
    const topY = bodyY + 1.07 + 0.18 + 0.5;
    parts.push(box(0.66, 0.12, 0.18, GOLD, { y: topY + 0.06 })); // ornate ridge cap base
    parts.push(cyl(0.05, 0.09, 0.22, 6, GOLD, { y: topY + 0.2 })); // gourd finial body
    parts.push(cyl(0.07, 0.0, 0.16, 6, GOLD, { y: topY + 0.38 + r })); // gourd finial crown

    return finish(parts);
  },
};

export default NM_SANFENG;
