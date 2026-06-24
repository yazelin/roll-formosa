/**
 * @file packs/yunlin/collectibles/budaixi.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_BUDAIXI — 布袋戲 (Puppet Theater). Traditional Taiwanese glove puppet theater,
 * for which Yunlin is especially famous. The Yunlin Puppet Theater Museum in Huwei
 * celebrates this art form. An ornate puppet figure with painted opera face and
 * flowing costume.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — opera-puppet materials.
const SKIN = 0xf2d9c0; // pale carved-wood opera face
const SKIN_D = 0xd9b89a; // jaw / shadow side of the face
const BROW = 0x2b1f1a; // dark painted brow / eyes / hair
const LIP = 0xc3303a; // red painted lips
const ROUGE = 0xe06a72; // rouge cheek dab
const CROWN = 0xd4a64a; // 燙金 gold headdress band
const CROWN_J = 0x2f8f7a; // jade-green headdress jewel
const PLUME = 0xc3303a; // red headdress plume / pompom
const ROBE = 0xb4262a; // 朱紅 lacquer-red robe
const ROBE_D = 0x8e1d22; // deeper red robe shadow / gradient
const TRIM = 0xd4a64a; // gold robe collar / hem trim
const SASH = 0x2f5d9a; // blue silk sash accent
const SLEEVE = 0xe0c24a; // golden-yellow flaring sleeves

export const COL_BUDAIXI = {
  id: 'budaixi',
  name: '布袋戲',
  collectibleId: 7,
  colorHex: 0xb4262a, // 朱紅 — the puppet's signature robe red
  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.03; // tiny non-structural plume jitter
    const parts = [];

    // ---- Draped robe body (wide flaring base — the glove sock) -----------
    // A tapered, slightly squashed cylinder: narrow shoulders flaring to a
    // wide skirted hem, the way a puppet's costume drapes over a hand.
    parts.push(
      cyl(0.62, 1.02, 1.5, 8, ROBE, { y: -0.05, sz: 0.74, hex2: ROBE_D })
    );
    // Gold hem band around the flaring bottom.
    parts.push(cyl(1.05, 1.1, 0.16, 6, TRIM, { y: -0.78, sz: 0.74 }));
    // Blue silk sash knotted at the waist.
    parts.push(box(0.9, 0.18, 0.46, SASH, { y: 0.18, z: 0.18, sz: 0.85 }));

    // ---- Two flaring sleeves (the puppet's "arms") -----------------------
    // Wide golden bell sleeves sweeping down-and-out from the shoulders, the
    // gesture pose of a glove puppet.
    for (const sx of [-1, 1]) {
      parts.push(
        cone(0.42, 0.86, 6, SLEEVE, {
          rz: sx * 0.95,
          x: sx * 0.66,
          y: 0.34,
          sz: 0.62,
          hex2: ROBE,
        })
      );
      // little gold cuff at the sleeve mouth
      parts.push(
        cyl(0.2, 0.24, 0.1, 5, TRIM, { rz: sx * 0.95, x: sx * 0.96, y: -0.02 })
      );
    }

    // ---- Collar trim (gold band where head meets robe) -------------------
    parts.push(cyl(0.5, 0.56, 0.16, 6, TRIM, { y: 0.66 }));

    // ---- Carved opera head (big, ornate — the focal point) ---------------
    const headY = 1.18;
    parts.push(
      sph(0.5, SKIN, { y: headY, sz: 0.86, ws: 6, hs: 3, hex2: SKIN_D })
    ); // rounded carved face
    // Jaw / chin slightly narrowed for a carved look.
    parts.push(box(0.5, 0.28, 0.4, SKIN, { y: headY - 0.4, hex2: SKIN_D }));

    // Painted opera face details — flat plaques on the front of the face.
    for (const sx of [-1, 1]) {
      // Dark swept brow with the eye reading as one bold opera stroke.
      parts.push(
        box(0.24, 0.11, 0.04, BROW, {
          rz: sx * 0.45,
          x: sx * 0.17,
          y: headY + 0.08,
          z: 0.42,
        })
      );
      // rouge cheeks
      parts.push(box(0.13, 0.13, 0.03, ROUGE, { x: sx * 0.24, y: headY - 0.1, z: 0.4 }));
    }
    // Red painted lips.
    parts.push(box(0.18, 0.07, 0.03, LIP, { y: headY - 0.24, z: 0.42 }));

    // ---- Ornate headdress (colourful crown over the head) ----------------
    const crownY = headY + 0.42;
    // Gold crown band wrapping the brow.
    parts.push(cyl(0.46, 0.5, 0.18, 6, CROWN, { y: crownY }));
    // Front jewel boss.
    parts.push(sph(0.14, CROWN_J, { y: crownY + 0.02, z: 0.46, sz: 0.6, ws: 5, hs: 3 }));
    // Crown peak — a small gold cone spire.
    parts.push(cone(0.3, 0.4, 6, CROWN, { y: crownY + 0.34, hex2: CROWN_J }));
    // Two red plumes / pompoms springing from the crown sides.
    for (const sx of [-1, 1]) {
      parts.push(
        sph(0.13, PLUME, {
          x: sx * (0.42 + j),
          y: crownY + 0.4,
          z: -0.02,
          sz: 0.8,
          ws: 5,
          hs: 3,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_BUDAIXI;
