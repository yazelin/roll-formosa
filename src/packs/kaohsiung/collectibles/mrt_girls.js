/**
 * @file packs/kaohsiung/collectibles/mrt_girls.js — Roll Formosa Kaohsiung pack.
 *
 * 高捷少女 (Kaohsiung MRT Girls) — a chibi figurine of the Kaohsiung Rapid Transit
 * mascots: an anthropomorphized "transit girl" doll in a station-attendant pose.
 * This is a STYLIZED Q-version TOY silhouette, never a realistic person — read as a
 * rounded plush figurine: oversized round head with a low-poly hair cap and a pair of
 * side hair bobbles, two big dot eyes, a uniform dress with a contrast collar/skirt,
 * stubby arms, and tiny feet. Chibi proportions (head ~= body) so the read is clearly
 * "cute mascot figure" at thumbnail size.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding sphere
 * (radius 1), so the recipe is authored in unit-ish space; the silhouette (round head +
 * hair bobbles + flared uniform skirt) carries the read. <= 600 triangles (aim ~150-400).
 *
 * Palette: KRTC magenta uniform (0xc05a80 dress / 0xd87aa0 highlight) + cream skin
 * (0xf6e3d4) + dark hair (0x3a2e3a) + white collar/trim (0xf4f0f4) + dot eyes.
 * rng adds only a faint hair/dress tint and a tiny hair-bobble tilt — never structure.
 */

import { sph, box, cyl, finish } from '../geomHelpers.js';

/** Concrete hexes — magenta KRTC uniform, cream skin, dark hair, white trim. */
const DRESS = 0xc05a80; // KRTC magenta — the body read color
const DRESS_HI = 0xd87aa0; // lighter magenta highlight (gradient top)
const SKIN = 0xf6e3d4; // pale cream skin
const HAIR = 0x3a2e3a; // dark plum-brown hair
const HAIR_HI = 0x4c3c4c; // faint hair highlight
const TRIM = 0xf4f0f4; // white collar / skirt trim
const EYE = 0x141018; // dark dot eyes

export const COL_MRT_GIRLS = {
  id: 'mrt_girls',
  name: '高捷少女',
  collectibleId: 13,
  colorHex: 0xc05a80, // KRTC magenta uniform — the body read color

  /**
   * Build the figurine geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (tint, bobble tilt).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Faint, deterministic-ish jitter so a shelf of figurines isn't identical.
    const tintJit = (rng() - 0.5) * 0.06; // +-3% on the dress highlight blend
    const dressHi = tintJit > 0 ? DRESS_HI : DRESS;
    const bobTilt = (rng() - 0.5) * 0.2; // small symmetric hair-bobble lean

    // --- Skirt: a short flared magenta cone-ish base (wider at the hem). -------
    parts.push(cyl(0.34, 0.6, 0.5, 8, DRESS, { y: 0.3, hex2: dressHi }));
    // White skirt-hem trim ring at the bottom of the dress.
    parts.push(cyl(0.62, 0.62, 0.08, 8, TRIM, { y: 0.05 }));

    // --- Torso / bodice: a rounded magenta upper body sitting on the skirt. ----
    parts.push(sph(0.42, DRESS, { ws: 6, hs: 4, sx: 1.0, sy: 1.0, sz: 0.86, y: 0.74, hex2: dressHi }));
    // White collar: a thin flattened ring just under the head (station-uniform read).
    parts.push(cyl(0.3, 0.34, 0.1, 8, TRIM, { y: 1.0 }));

    // --- Head: big round cream ball (chibi: nearly as large as the body). ------
    parts.push(sph(0.56, SKIN, { ws: 7, hs: 5, sx: 1.0, sy: 1.02, sz: 0.98, y: 1.5 }));

    // --- Hair cap: a dark dome over the top/back of the head. ------------------
    parts.push(sph(0.6, HAIR, { ws: 7, hs: 4, sx: 1.04, sy: 1.0, sz: 1.02, y: 1.56, z: -0.06, hex2: HAIR_HI }));
    // Front fringe: a short dark flattened cap across the forehead.
    parts.push(sph(0.36, HAIR, { ws: 6, hs: 3, sx: 1.05, sy: 0.55, sz: 0.7, y: 1.74, z: 0.3, hex2: HAIR_HI }));

    // --- Side hair bobbles: two round dark balls beside the head (the mascot cue). -
    const bobY = 1.46;
    const bobX = 0.6;
    parts.push(sph(0.22, HAIR, { ws: 5, hs: 3, rz: bobTilt, x: -bobX, y: bobY, z: -0.02, hex2: HAIR_HI }));
    parts.push(sph(0.22, HAIR, { ws: 5, hs: 3, rz: -bobTilt, x: bobX, y: bobY, z: -0.02, hex2: HAIR_HI }));

    // --- Eyes: two big dark dots low on the face. ------------------------------
    parts.push(box(0.1, 0.14, 0.07, EYE, { x: -0.2, y: 1.46, z: 0.5 }));
    parts.push(box(0.1, 0.14, 0.07, EYE, { x: 0.2, y: 1.46, z: 0.5 }));

    // --- Arms: stubby magenta sleeves hugging the sides, cream hand tips. ------
    parts.push(sph(0.16, DRESS, { ws: 5, hs: 3, sx: 0.85, sy: 1.2, sz: 0.85, x: -0.5, y: 0.76, z: 0.06, hex2: dressHi }));
    parts.push(sph(0.16, DRESS, { ws: 5, hs: 3, sx: 0.85, sy: 1.2, sz: 0.85, x: 0.5, y: 0.76, z: 0.06, hex2: dressHi }));
    parts.push(sph(0.12, SKIN, { ws: 5, hs: 3, x: -0.54, y: 0.52, z: 0.08 }));
    parts.push(sph(0.12, SKIN, { ws: 5, hs: 3, x: 0.54, y: 0.52, z: 0.08 }));

    // --- Feet: two tiny dark shoes peeking out under the skirt hem. ------------
    parts.push(sph(0.14, HAIR, { ws: 5, hs: 3, sx: 1.0, sy: 0.7, sz: 1.3, x: -0.18, y: -0.02, z: 0.16, hex2: HAIR_HI }));
    parts.push(sph(0.14, HAIR, { ws: 5, hs: 3, sx: 1.0, sy: 0.7, sz: 1.3, x: 0.18, y: -0.02, z: 0.16, hex2: HAIR_HI }));

    return finish(parts);
  },
};

export default COL_MRT_GIRLS;
