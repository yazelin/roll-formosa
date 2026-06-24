/**
 * @file packs/keelung/collectibles/water_lantern.js — Roll Formosa Keelung pack, COLLECTIBLE.
 *
 * COL_LANTERN — 中元祭水燈 (Keelung 雞籠中元祭 floating water-lantern house). The
 * iconic ornate paper "house" floated out to sea during the Ghost Festival:
 * a warm-glowing cream paper body with a red door panel, sitting on a little
 * float, crowned by a two-tier swallowtail red roof with gold eaves and a gold
 * finial. A small hand-held shrine-house — squat and ornate, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the read. <= 350 triangles
 * (collectible budget). rng() only nudges the paper glow tint, never structure.
 */

import { box, cyl, cone, sph, finish, PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

export const COL_LANTERN = {
  id: 'water_lantern',
  name: '中元祭水燈',
  collectibleId: 9,
  colorHex: 0xf2d98a, // warm glowing paper

  buildGeometry(rng) {
    const t = Math.floor(rng() * 0x040402); // tiny per-instance glow tint nudge
    const paper = 0xf2d98a + t; // warm cream glowing paper
    const paperHi = 0xfaeeb6; // brighter lit window
    const red = 0xc23a2f; // festival red roof / door
    const redHi = 0xd9534a; // roof highlight
    const gold = 0xe0b54e; // gold eaves + finial
    const wood = 0x8a6a45; // banana-trunk float
    const woodHi = 0xa07f54;

    const Q = PI / 4; // rotate square pyramids 45° to align with the box body

    const parts = [];

    // --- FLOAT raft the lantern sits on --------------------------------
    parts.push(box(1.9, 0.2, 1.9, wood, { y: 0.12, hex2: woodHi }));
    parts.push(box(2.0, 0.08, 0.34, wood, { y: 0.2, z: 0.0, hex2: woodHi })); // cross spar
    parts.push(box(0.34, 0.08, 2.0, wood, { y: 0.2, x: 0.0, hex2: woodHi }));

    // --- BODY: warm paper house block ----------------------------------
    parts.push(box(1.3, 1.0, 1.3, paper, { y: 0.85, hex2: paperHi }));
    // lit window panels (brighter) on the two side faces
    parts.push(box(0.7, 0.6, 0.03, paperHi, { x: 0.66, y: 0.9 }));
    parts.push(box(0.7, 0.6, 0.03, paperHi, { x: -0.66, y: 0.9 }));
    // red door panel on the front
    parts.push(box(0.5, 0.74, 0.04, red, { z: 0.67, y: 0.77, hex2: redHi }));
    // gold sill line under the body
    parts.push(box(1.4, 0.08, 1.4, gold, { y: 0.34 }));

    // --- ROOF: two-tier red pyramid with gold eaves --------------------
    // lower eave (overhanging gold rim)
    parts.push(box(1.66, 0.09, 1.66, gold, { y: 1.4 }));
    // lower roof pyramid (4-sided cone, rotated to align)
    parts.push(cone(1.16, 0.62, 4, red, { y: 1.74, ry: Q, hex2: redHi }));
    // upper eave
    parts.push(box(0.92, 0.07, 0.92, gold, { y: 2.0 }));
    // upper roof pyramid
    parts.push(cone(0.66, 0.5, 4, red, { y: 2.28, ry: Q, hex2: redHi }));

    // --- gold FINIAL crowning the roof ---------------------------------
    parts.push(cyl(0.06, 0.09, 0.26, 6, gold, { y: 2.62 }));
    parts.push(sph(0.12, gold, { ws: 7, hs: 5, y: 2.82 }));

    return finish(parts);
  },
};

export default COL_LANTERN;
