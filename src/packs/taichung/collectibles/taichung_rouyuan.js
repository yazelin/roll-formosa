/**
 * @file packs/taichung/collectibles/taichung_rouyuan.js — Roll Formosa Taichung
 * pack, COLLECTIBLE (album item the ball rolls up).
 *
 * COL_TAICHUNG_ROUYUAN — 台中肉圓 (Taichung-style rou-yuan / meatball dumpling).
 * Silhouette: a shallow RED plastic plate (a wide, flat, low disc) holding TWO
 * plump rou-yuan — rounded, slightly-flattened glossy domes of pale, translucent-
 * looking beige skin — each drizzled with a short stroke of red/orange sauce on
 * top. From a 3/4 view it reads unmistakably as two glossy dumplings sitting on a
 * red dish.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so PROPORTIONS (not absolute size) carry the read: a wide low
 * red plate, two squashed beige domes side by side, each capped with a thin
 * reddish sauce patch. <= 350 triangles.
 *
 * Palette: glossy translucent-beige rou-yuan skin (0xd8c8a8 body / 0xe6dcc4 glossy
 * highlight), a bright red plastic plate (0xcf3a3a / 0xb83030 deeper rim), and a
 * reddish-orange sauce stroke (0xc23a1e). rng() only nudges the bake/skin tone a
 * hair and a faint dumpling lean — never structure.
 */

import { cyl, sph, finish } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

// Concrete hexes — translucent dumpling skin, red plate, reddish sauce stroke.
const SKIN = 0xd8c8a8; // pale translucent-beige rou-yuan skin (body read color)
const SKIN_HI = 0xe6dcc4; // glossy top highlight on the dumpling dome
const PLATE = 0xcf3a3a; // bright red plastic plate
const PLATE_LO = 0xb83030; // deeper red toward the plate rim
const SAUCE = 0xc23a1e; // reddish-orange sauce drizzle

export const COL_TAICHUNG_ROUYUAN = {
  id: 'taichung_rouyuan',
  name: '台中肉員',
  collectibleId: 9,
  colorHex: 0xd8c8a8, // pale translucent dumpling skin — the body read color

  /**
   * Build the rou-yuan geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (skin tone, lean).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Faint per-instance variation so a tray of plates isn't identical.
    const bake = rng() < 0.5 ? 0x000000 : 0x040302; // skin a hair warmer/darker
    const skin = SKIN - bake;
    const lean = (rng() - 0.5) * 0.1; // tiny asymmetric dumpling lean

    // --- RED PLATE: a wide, very low disc — far wider than it is tall — the
    //     shallow plastic dish. A slight taper (rTop > rBot) lifts the rim so it
    //     reads as a plate with a raised edge, not a flat coin. Vertical gradient
    //     deeper toward the rim. Highest segment count (main round read). ---
    parts.push(cyl(1.9, 1.74, 0.34, 22, PLATE_LO, { y: 0.17, hex2: PLATE }));
    // Inset well: a slightly smaller, lighter disc sunk into the plate so the
    //     two dumplings appear to sit in a shallow bowl, not on a flat top.
    parts.push(cyl(1.5, 1.62, 0.16, 16, PLATE, { y: 0.3, hex2: PLATE }));

    // --- TWO ROU-YUAN: plump, slightly-flattened glossy domes sitting side by
    //     side in the well. Each is a sphere squashed in Y (sy < 1) so it reads
    //     as a soft, settled dumpling rather than a marble. Vertical gradient to
    //     a brighter highlight on top sells the glossy translucent skin. The
    //     lean nudges them a hair apart so the pair isn't a mirror clone. ---
    parts.push(
      sph(0.72, skin, {
        ws: 9, hs: 6, sx: 1.04, sy: 0.6, sz: 1.0,
        x: -0.62, y: 0.5, rz: lean, hex2: SKIN_HI,
      }),
    );
    parts.push(
      sph(0.72, skin, {
        ws: 9, hs: 6, sx: 1.04, sy: 0.6, sz: 1.0,
        x: 0.62, y: 0.52, rz: -lean, hex2: SKIN_HI,
      }),
    );

    // --- SAUCE DRIZZLE: a short, thin reddish-orange patch laid over the top of
    //     each dumpling — a flattened low disc (rTop < rBot) hugging the dome so
    //     it reads as a stroke of sauce, the signature 醬汁 over the rou-yuan. ---
    parts.push(cyl(0.34, 0.5, 0.08, 12, SAUCE, { x: -0.6, y: 0.82, hex2: SAUCE }));
    parts.push(cyl(0.34, 0.5, 0.08, 12, SAUCE, { x: 0.64, y: 0.84, hex2: SAUCE }));

    return finish(parts);
  },
};

export default COL_TAICHUNG_ROUYUAN;
