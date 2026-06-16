/**
 * @file packs/kaohsiung/landmarks/kaohsiung85.js — Roll Formosa hero landmark.
 *
 * NM_KAOHSIUNG85 — 高雄85大樓 (東帝士85國際廣場 / Tuntex Sky Tower), THE GOAL
 * MONUMENT. The iconic supertall whose silhouette spells the character「高」:
 * two outer leg-towers rise from a shared podium, a wide horizontal bridge band
 * joins them part-way up, and a single tall CENTRAL spire section continues
 * above the join — the legs splay just below the bridge so the negative space
 * reads as the「高」glyph. A slim antenna mast crowns the central spire. Tall +
 * slender so the player can spot the goal from across the 港都 skyline.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. Square cross-sections come from cyl(...) with seg=4, rotated so a
 * flat face points down +Z. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Glass curtain-wall colors — the cool blue-silver harbour tint, brightened
// toward the lit upper floors; darker steel mullions / transom bands between.
const GLASS_LO = 0x33617a; // cool blue glass (lower floors, in shadow)
const GLASS_HI = 0x6cc0d4; // bright cyan glass (upper floors, catching light)
const MULLION = 0x1c3644; // dark steel transom / bridge band
const STEEL = 0xb9c2c8; // light steel for the crown / spire base
const SPIRE = 0xdfe6ea; // pale metallic antenna
const PODIUM = 0x3a4650; // splayed retail podium skirt

export const NM_KAOHSIUNG85 = {
  id: 'kaohsiung_85',
  name: '高雄85大樓',
  landmarkId: 8,
  dioramaRHint: 378, // real structural height ≈ 378 m (roof+spire)
  colorHex: GLASS_HI,

  buildGeometry(rng) {
    // Square cross-section: a 4-sided cyl is a square rotated 45°, so spin it
    // ry = PI/4 to land flat faces on the cardinal directions. r passed to cyl
    // is the circumradius; half-width = r * cos(45°) ≈ r * 0.7071.
    const FACE = HALF_PI / 2; // PI/4 — orient square faces to the axes
    const parts = [];

    // ---- 1) Splayed retail podium + ground plinth --------------------------
    parts.push(box(1.6, 0.12, 1.6, 0x2c343c, { y: 0.06 })); // ground plinth slab
    parts.push(cyl(0.78, 1.05, 0.45, 4, PODIUM, { ry: FACE, y: 0.345, hex2: 0x4a5660 })); // splayed podium
    parts.push(box(1.30, 0.10, 1.30, MULLION, { y: 0.62 })); // podium parapet ring

    // ---- 2) Two outer leg-towers (the legs of「高」) ------------------------
    // They rise from the podium, stay slim, and lean their inner faces toward
    // the centre just below the bridge so the join reads cleanly.
    const legBot = 0.67; // y where the legs spring from the podium
    const bridgeY = 2.05; // y of the horizontal bridge band that joins the legs
    const legH = bridgeY - legBot; // shared leg height up to the bridge
    const legDX = 0.34; // half-spacing of the two legs along X
    const legR = 0.165; // leg circumradius (square)
    for (const sx of [-1, 1]) {
      const x = sx * legDX;
      // Slightly tapering square leg shaft (wider at base) — glass curtain wall.
      parts.push(
        cyl(legR * 0.92, legR, legH, 4, GLASS_LO, {
          ry: FACE, x, y: legBot + legH / 2, hex2: GLASS_HI,
        }) // leg-tower shaft
      );
      // Transom cap at the leg top where it meets the bridge band.
      parts.push(box(legR * 1.6, 0.05, legR * 1.6, MULLION, { x, y: bridgeY })); // leg top transom
    }

    // ---- 3) Horizontal bridge band joining the legs (the crossbar of「高」) -
    // Spans across both legs; this is the visual lock that fuses the silhouette.
    const bridgeW = legDX * 2 + legR * 1.5; // span both legs plus a little overhang
    parts.push(box(bridgeW, 0.22, 0.44, MULLION, { y: bridgeY + 0.05 })); // bridge transom band
    parts.push(box(bridgeW * 0.96, 0.14, 0.34, GLASS_HI, { y: bridgeY + 0.05 })); // bridge glazing inset

    // ---- 4) Central spire section above the bridge -------------------------
    // A single slender square tower continues UP from the bridge — the long
    // stroke of「高」. Several stacked glass bands climb to the crown.
    const coreBot = bridgeY + 0.16; // base of the central spire (just above bridge)
    const coreR = 0.205; // central tower circumradius (square)
    const bandH = 0.50; // height of one glazed band
    const bandGap = 0.045; // thin transom between bands
    const nBands = 4; // four stacked bands up the central spire
    let y = coreBot;
    for (let i = 0; i < nBands; i++) {
      const rBot = coreR * (1 - i * 0.07); // gentle taper as it rises
      const rTop = coreR * (1 - (i + 1) * 0.07);
      parts.push(
        cyl(rTop, rBot, bandH, 4, GLASS_LO, { ry: FACE, y: y + bandH / 2, hex2: GLASS_HI }) // central band
      );
      const lipW = rBot * 1.4142 + 0.02;
      parts.push(box(lipW, 0.05, lipW, MULLION, { y: y + bandH })); // band transom
      y += bandH + bandGap;
    }
    const coreTop = y; // y at the top of the central spire bands

    // ---- 5) Crown housing + tall antenna mast ------------------------------
    const crownR = coreR * (1 - nBands * 0.07);
    parts.push(cyl(crownR * 0.7, crownR, 0.26, 4, STEEL, { ry: FACE, y: coreTop + 0.13 })); // tapered crown
    parts.push(box(crownR * 0.95, 0.10, crownR * 0.95, MULLION, { y: coreTop + 0.26 })); // crown parapet
    parts.push(cyl(0.05, 0.085, 0.28, 8, STEEL, { y: coreTop + 0.40 })); // mast base housing
    parts.push(cyl(0.015, 0.04, 0.95, 6, SPIRE, { y: coreTop + 1.00 })); // tall antenna mast
    parts.push(sph(0.04, 0xff5a4a, { ws: 6, hs: 4, y: coreTop + 1.50 })); // aircraft warning light (lit red)

    return finish(parts);
  },
};

export default NM_KAOHSIUNG85;
