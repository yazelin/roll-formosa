/**
 * @file packs/taipei/landmarks/cks_memorial.js — Roll Formosa Taipei pack.
 *
 * NM_CKS — 中正紀念堂 (Chiang Kai-shek Memorial Hall). One of the curated hero
 * LANDMARK geometries. The unmistakable silhouette: a white square memorial
 * hall on a tall, broad, stepped white base, crowned by a deep-blue OCTAGONAL
 * double-eaved tile roof (two flaring tiers) that tapers to a gold-tipped
 * pointed apex. White walls + blue roof — Taiwan's most recognizable
 * national monument.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * the integration layer drops it onto the ground plane. We author the correct
 * PROPORTIONS: the monument reads as a squat pyramidal mass (wide stepped base,
 * narrowing toward a tall pointed crown) — NOT a slender tower.
 *
 * Octagon trick: cyl/cone with 8 radial segments give true octagonal prisms /
 * cones, matching the real 八角攢尖頂 roof. Tri budget: hero models <= 600.
 */

import { box, cyl, cone, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Octagons are aligned flat-to-front: rotate by half a segment (PI/8).
const OCT_PHASE = Math.PI / 8;

// Palette anchors.
const WHITE = 0xeef0ee; // 白牆 / 漢白玉石階 (off-white concrete/marble)
const WHITE_SHADE = 0xd6dad6; // step-tread shading for the gradient
const BLUE = 0x2f5fa8; // 琉璃瓦藍 (cobalt glazed roof tile)
const BLUE_DK = 0x244c88; // deep underside / eave shadow
const BLUE_LT = 0x3d72bc; // upper roof catching light
const GOLD = 0xd8b24a; // 寶頂 finial + ridge accents
const GREY = 0xb8bcb4; // 階基緣石 / arch shadow

export const NM_CKS = {
  id: 'cks_memorial',
  name: '中正紀念堂',
  landmarkId: 5,
  dioramaRHint: 70, // hall ~70 m tall incl. base+roof (real ~70 m)
  colorHex: BLUE,
  buildGeometry(rng) {
    const r0 = rng() * 0.02; // tiny non-structural jitter
    const parts = [];

    /* ---- tall stepped white base (階梯式台基) ---------------------------- */
    // Three broad recessed tiers — the wide platform the hall stands on.
    parts.push(box(3.6, 0.34, 3.6, WHITE, { y: 0.17, hex2: WHITE_SHADE })); // base tier 1 (widest)
    parts.push(box(3.0, 0.34, 3.0, WHITE, { y: 0.51, hex2: WHITE_SHADE })); // base tier 2
    parts.push(box(2.5, 0.32, 2.5, WHITE, { y: 0.84, hex2: WHITE_SHADE })); // base tier 3 (plinth top)
    // Front grand staircase (the famous 89-step approach) — stacked treads.
    for (let i = 0; i < 5; i++) {
      const w = 1.7 - i * 0.06;
      parts.push(box(w, 0.12, 0.26, WHITE, { y: 0.06 + i * 0.12, z: 1.86 + i * 0.13, hex2: WHITE_SHADE })); // stair tread
    }

    /* ---- white hall body (主堂體) ------------------------------------- */
    // Square white block — the main hall volume.
    parts.push(box(2.0, 1.5, 2.0, WHITE, { y: 1.75, hex2: 0xe6e8e6 })); // main hall wall mass
    // Slim cornice line where wall meets the roof springing.
    parts.push(box(2.16, 0.1, 2.16, GREY, { y: 2.52 })); // cornice band

    // Tall arched entry (the blue-glass main doorway) centred on the front.
    parts.push(box(0.7, 1.1, 0.12, BLUE_DK, { y: 1.55, z: 1.02 })); // arched doorway recess
    parts.push(box(0.5, 0.85, 0.08, GREY, { y: 1.5, z: 1.06 })); // door inner shadow
    // Faint pilaster shadows on the side faces for vertical rhythm.
    for (const sx of [-0.62, 0.62]) {
      parts.push(box(0.1, 1.2, 0.04, GREY, { x: sx, y: 1.7, z: 1.02 })); // front pilaster
    }

    /* ---- blue octagonal double-eaved roof (八角重簷攢尖頂) ------------- */
    // Transition collar: square hall top → octagonal roof drum.
    parts.push(cyl(1.18, 1.22, 0.26, 8, BLUE_DK, { y: 2.66, ry: OCT_PHASE })); // roof drum / lower eave wall

    // LOWER eave: a wide flaring octagonal skirt (first tier of double-eave).
    parts.push(cone(1.62, 0.6, 8, BLUE, { y: 2.95, ry: OCT_PHASE, hex2: BLUE_DK })); // lower eave (flared)
    parts.push(cyl(1.62, 1.66, 0.06, 8, GOLD, { y: 2.66, ry: OCT_PHASE })); // lower eave gold rim

    // Mid octagonal wall between the two eaves.
    parts.push(cyl(0.92, 1.0, 0.4, 8, BLUE_LT, { y: 3.42, ry: OCT_PHASE, hex2: BLUE })); // upper octagonal drum

    // UPPER eave: second flaring octagonal skirt, narrower.
    parts.push(cone(1.18, 0.46, 8, BLUE, { y: 3.78, ry: OCT_PHASE, hex2: BLUE_DK })); // upper eave (flared)
    parts.push(cyl(1.18, 1.2, 0.05, 8, GOLD, { y: 3.6, ry: OCT_PHASE })); // upper eave gold rim

    // Pointed octagonal crown (攢尖頂) rising to the apex.
    parts.push(cone(0.78, 1.1, 8, BLUE_LT, { y: 4.5, ry: OCT_PHASE, hex2: BLUE })); // pointed roof cap

    // Gold 寶頂 finial spike at the very top.
    parts.push(cone(0.16, 0.34, 8, GOLD, { y: 5.18, ry: OCT_PHASE })); // finial base
    parts.push(cone(0.07, 0.26, 6, GOLD, { y: 5.5 + r0 })); // finial spike

    return finish(parts);
  },
};

export default NM_CKS;
