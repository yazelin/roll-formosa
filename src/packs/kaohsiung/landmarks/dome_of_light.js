/**
 * @file packs/kaohsiung/landmarks/dome_of_light.js — Roll Formosa Kaohsiung pack.
 *
 * 美麗島站光之穹頂 (Dome of Light, Formosa Boulevard MRT Station). The world's
 * largest single public glass-art installation: a LOW, WIDE circular stained-
 * glass dome resting on a ring of columns at the station concourse. The read is
 * a shallow saucer cap of radial colored-glass "ribs" radiating from a bright
 * central oculus, sitting on a low cylindrical drum + a broad stone plaza ring —
 * NOT a tower. Cool aqua-blue glass with warm amber/red/violet rib accents, the
 * signature swirl of the 水 / 土 / 光 / 火 four-element panels.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored with correct PROPORTIONS (wide + low,
 * one shallow dome) — the integration step owns the size-ladder; dioramaRHint is
 * the real-world footprint hint. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — the光之穹頂 glass-art read.
const STONE = 0x9fa6ac; // grey plaza ring / concourse stone
const STONE_D = 0x7d848a; // darker stone shadow band
const DRUM = 0x8ba6b4; // pale glazed drum wall under the dome
const GLASS_LO = 0x3f7e9c; // cool aqua-blue glass (dome lower, in shadow)
const GLASS_HI = 0x6fb8d8; // bright cyan glass (dome catching light) — read color
const OCULUS = 0xfff1c4; // warm glowing central oculus (the光 source)
const RIB_AMBER = 0xe0a23c; // amber radial rib (火 / 土 warm panels)
const RIB_RED = 0xc24a3e; // crimson radial rib accent
const RIB_VIOLET = 0x7d5aa8; // violet radial rib accent (水 cool panels)
const COL = 0xb8c0c6; // steel concourse columns under the dome

export const NM_DOME_OF_LIGHT = {
  id: 'dome_of_light',
  name: '美麗島站光之穹頂',
  landmarkId: 10,
  dioramaRHint: 11, // ~30 m glass-art dome span; r ~ 11 m (integration may override)
  colorHex: 0x6fb8d8, // bright cyan stained glass — the dome read color

  buildGeometry(rng) {
    const FACE = HALF_PI / 2; // PI/4 (unused-axis spare; kept for clarity)
    void FACE;
    const parts = [];

    // ---- 1) Broad stone plaza ring + low concourse drum (wide + low) -------
    parts.push(cyl(1.05, 1.15, 0.14, 12, STONE, { y: 0.07, hex2: STONE_D })); // plaza slab ring
    parts.push(cyl(0.92, 0.98, 0.06, 12, STONE_D, { y: 0.16 })); // inner terrace lip
    // low glazed drum wall the dome springs from
    parts.push(cyl(0.86, 0.9, 0.26, 12, DRUM, { y: 0.30, hex2: GLASS_LO })); // drum wall

    // ---- 2) Ring of concourse support columns under the rim ----------------
    const colN = 6;
    const colR = 0.74; // radius the columns stand on
    const colY = 0.30; // column mid-height (inside the drum)
    for (let i = 0; i < colN; i++) {
      const a = (i / colN) * PI * 2;
      parts.push(
        cyl(0.05, 0.055, 0.3, 4, COL, {
          x: Math.cos(a) * colR,
          z: Math.sin(a) * colR,
          y: colY,
        }) // concourse column
      );
    }

    // ---- 3) Shallow stained-glass dome cap (the hero saucer) --------------
    const domeY = 0.43; // y where the dome springs from the drum
    const domeR = 0.88; // dome footprint radius
    // A low spherical cap: a full sphere squashed flat (sy) so it reads as a
    // shallow saucer, gradient aqua → bright cyan toward the rim.
    parts.push(
      sph(domeR, GLASS_LO, {
        ws: 14,
        hs: 4,
        thetaLen: HALF_PI, // top hemisphere-cap only
        sy: 0.42, // squash to a shallow saucer
        y: domeY,
        hex2: GLASS_HI,
      }) // shallow glass dome shell
    );
    // thin rim ring tying the dome edge to the drum
    parts.push(cyl(domeR * 0.99, domeR * 1.02, 0.05, 12, COL, { y: domeY + 0.01 })); // dome rim ring

    // ---- 4) Radial colored-glass ribs sweeping over the dome --------------
    // Slim tapered bars laid along the dome surface from rim toward the oculus,
    // tilted up to follow the saucer curve — the radial stained-glass pattern.
    const ribN = 8;
    const ribCols = [RIB_AMBER, GLASS_HI, RIB_VIOLET, RIB_RED];
    const ribLen = domeR * 0.82;
    const ribTilt = 0.52; // up-tilt to ride the shallow dome curve
    for (let i = 0; i < ribN; i++) {
      const a = (i / ribN) * PI * 2;
      const col = ribCols[i % ribCols.length];
      // place the rib bar pointing outward along +X then rotate around Y by a.
      const midR = domeR * 0.5;
      parts.push(
        box(ribLen, 0.035, 0.05, col, {
          rz: ribTilt, // lift the outer end down / inner end up along the curve
          ry: -a, // spin the rib around the dome
          x: Math.cos(a) * midR,
          z: Math.sin(a) * midR,
          y: domeY + 0.13,
        }) // radial glass rib
      );
    }

    // ---- 5) Bright central oculus + crowning finial -----------------------
    const topY = domeY + 0.42 * domeR; // dome crown height (sy-squashed)
    parts.push(cyl(0.16, 0.2, 0.06, 8, COL, { y: topY + 0.01 })); // oculus collar ring
    parts.push(
      sph(0.15, OCULUS, { ws: 8, hs: 4, thetaLen: HALF_PI, sy: 0.7, y: topY + 0.02 })
    ); // glowing oculus dome (the光 source)
    parts.push(cone(0.06, 0.14, 7, OCULUS, { y: topY + 0.13 })); // small crowning finial

    return finish(parts);
  },
};

export default NM_DOME_OF_LIGHT;
