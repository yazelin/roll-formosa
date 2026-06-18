/**
 * @file packs/taichung/landmarks/opera_house.js — Roll Formosa Taichung pack.
 *
 * NM_OPERA_HOUSE — 國家歌劇院 (National Taichung Theater, 伊東豊雄 / Toyo Ito).
 * The unmistakable silhouette is the "sound cave" (聲音涵洞 / Catenoid)
 * curved-wall building: a LOW, WIDE, rounded off-white concrete mass with NO
 * sharp corners, its flat front face cut by a row of CAVE-LIKE arched
 * mouths — dark catenary grottoes flowing continuously between floor, wall and
 * ceiling. The read is "soft white acoustic grotto", so every plane is
 * rounded: the body is a high-segment cylinder SHELL (no box edges) stretched
 * broad, capped by a flattened domed roof, and the cave mouths are dark
 * recessed half-tubes whose round profile reads as the arch.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the
 * geometry math is an engine red line. finish() merges → recenters →
 * normalizes to a UNIT bounding sphere (radius 1), so the recipe is authored
 * in unit-ish space and the silhouette (wide low white organic block + dark
 * arched cave mouths) carries the read from a 3/4 view.
 *
 * Curved-surface technique (no sharp angles): high-seg OPEN cyl shells = a
 * continuous rounded wall; a flattened top-cap sph = the soft roof; each cave
 * is an OPEN cyl laid on its side (round cross-section faces front) so the
 * mouth is a smooth arch, with a dark back disc for grotto depth and deep-set
 * glazing. Verified <= 600 tris (~470).
 */

import { box, cyl, sph, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — off-white architectural concrete + dark cave interiors.
const SKIN = 0xece9e1; // 曲牆白混凝土 (off-white curved concrete skin)
const SKIN_HI = 0xf6f4ee; // sunlit upper skin (top of body gradient)
const SKIN_LO = 0xd6d2c8; // shaded lower skin / wall-thickness liner
const ROOF = 0xf2efe8; // rounded roof dome (slightly brighter)
const CAVE = 0x2b2723; // deep cave interior (dark recess)
const CAVE_HI = 0x4a443c; // softer cave shoulder catching a little light
const GLASS = 0x6f7d80; // grey-green glazing set deep inside the caves
const GROUND = 0xbfbcb2; // pale plaza apron the block sits on

export const NM_OPERA_HOUSE = {
  id: 'opera_house',
  name: '國家歌劇院',
  landmarkId: 2,
  dioramaRHint: 37, // hall ~37.7 m tall (low, broad civic block)
  colorHex: SKIN, // off-white skin — the body read color

  buildGeometry(rng) {
    const r0 = rng() * 0.015; // tiny non-structural jitter
    const parts = [];
    const SEG = 14; // high seg → smooth, edge-free curved wall
    const XW = 1.34; // X-stretch → broad oval footprint (low + wide)

    /* ---- pale plaza apron (the block sits low and wide) --------------- */
    parts.push(cyl(2.1, 2.18, 0.16, 10, GROUND, { sx: XW, y: 0.08, hex2: 0xb0ada3 })); // rounded plaza pad

    /* ---- main rounded white mass (低而寬的圓潤量體) ------------------- */
    // WIDE, LOW oval block: a high-seg OPEN cyl shell stretched on X so the
    // walls read as one continuous curved skin (no box corners). open:true
    // keeps it a shell; the dome supplies the rounded top.
    const BODY_Y = 0.16, BODY_H = 1.5, R = 1.95;
    parts.push(cyl(R, R + 0.07, BODY_H, SEG, SKIN, {
      open: true, sx: XW, y: BODY_Y + BODY_H / 2, hex2: SKIN_HI,
    })); // continuous curved wall skin (broad oval)
    // Inner liner just inside the shell → the skin has visible thickness at the
    // cave mouths (reads solid, not paper-thin), kept slightly darker.
    parts.push(cyl(R - 0.16, R - 0.09, BODY_H, SEG, SKIN_LO, {
      open: true, sx: XW, y: BODY_Y + BODY_H / 2, hex2: SKIN,
    })); // wall-thickness liner

    /* ---- rounded roof (flattened dome — no flat lid) ----------------- */
    const ROOF_Y = BODY_Y + BODY_H;
    parts.push(sph(R + 0.05, ROOF, {
      ws: SEG, hs: 3, thetaLen: HALF_PI, // top hemisphere cap only
      sx: XW, sy: 0.4, y: ROOF_Y, hex2: SKIN_HI,
    })); // main rounded roof dome
    // Two soft skylight blisters bulging from the roof (organic curve cues).
    parts.push(sph(0.5, ROOF, { ws: 6, hs: 2, thetaLen: HALF_PI, sy: 0.8, x: -0.9, y: ROOF_Y + 0.12, z: 0.1 })); // roof blister L
    parts.push(sph(0.42, ROOF, { ws: 6, hs: 2, thetaLen: HALF_PI, sy: 0.8, x: 0.95, y: ROOF_Y + 0.12, z: -0.2 + r0 })); // roof blister R

    /* ---- front "sound cave" mouths (洞窟狀拱形開口) ------------------ */
    // The signature front face cut by THREE cave-like arched mouths. Each cave
    // is an OPEN cyl laid on its side so the ROUND cross-section faces front =
    // a smooth arch; a dark back disc gives grotto depth, deep-set glazing sits
    // behind. Painted dark, so the white skin reads as punched by soft caves.
    const FRONT_Z = R * 0.985; // front face plane (+Z; only X was stretched)
    const mouths = [
      { x: -1.5, w: 0.62, h: 0.96, depth: 0.5 }, // left cave
      { x: 0.0, w: 0.94, h: 1.2, depth: 0.62 }, // central grand cave (tallest)
      { x: 1.5, w: 0.62, h: 0.96, depth: 0.5 }, // right cave
    ];
    for (const m of mouths) {
      const cy = 0.18 + m.h / 2; // mouth springs from near ground
      const zc = FRONT_Z - 0.12; // recessed slightly into the wall
      // Arched grotto tube: open cyl, axis laid along Z (rx=HALF_PI), round
      // profile = the arch. sx=width radius, sy=height radius → a tall arch.
      parts.push(cyl(1, 1, m.depth, 8, CAVE, {
        open: true, rx: HALF_PI, sx: m.w, sy: m.h, x: m.x, y: cy, z: zc - m.depth / 2,
      })); // cave interior tube (dark recess)
      // Dark back disc closing the tube → grotto depth (no see-through hole).
      parts.push(cyl(1, 1, 0.02, 6, CAVE_HI, {
        rx: HALF_PI, sx: m.w * 0.94, sy: m.h * 0.94, x: m.x, y: cy, z: zc - m.depth,
      })); // cave back wall
      // Deep-set glazing inside the cave (grey-green, behind the rim plane).
      parts.push(sph(1, GLASS, {
        ws: 6, hs: 2, thetaLen: HALF_PI, sx: m.w * 0.72, sy: m.h * 0.72,
        x: m.x, y: cy - m.h * 0.18, z: zc - m.depth * 0.55,
      })); // recessed glazing
      // Dark sill flooring the mouth so floor flows into the grotto.
      parts.push(box(m.w * 1.85, 0.07, m.depth * 0.9, CAVE, { x: m.x, y: 0.2, z: zc - m.depth * 0.45 })); // cave floor lip
    }

    /* ---- continuous-curve hints on the long sides -------------------- */
    // Two shallow rounded bays so the block never reads as a plain cylinder —
    // Ito's walls undulate. Soft vertical lobes at the broad ends.
    for (const sxn of [-1, 1]) {
      parts.push(cyl(0.42, 0.44, BODY_H * 0.96, 8, SKIN, {
        open: true, x: sxn * (R * XW - 0.05), y: BODY_Y + BODY_H / 2 - 0.02, hex2: SKIN_HI,
      })); // side curved bay lobe
    }
    // Low soft entrance fascia wrapping the front base (rounded, no edge).
    parts.push(cyl(R * 0.7, R * 0.74, 0.18, 10, SKIN_LO, {
      open: true, sx: XW, y: 0.3, z: 0.0, hex2: SKIN,
    })); // front base soft fascia

    return finish(parts);
  },
};

export default NM_OPERA_HOUSE;
