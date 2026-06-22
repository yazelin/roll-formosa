/**
 * @file packs/chiayi/landmarks/sun_shooting_tower.js — Roll Formosa Chiayi pack, GOAL LANDMARK.
 *
 * NM_SUN_SHOOTING_TOWER — 射日塔 (Sun-Shooting Tower), THE GOAL MONUMENT for Chiayi.
 * A cylindrical observation tower in 嘉義公園, ~62 m tall, featuring:
 * - A circular tower body of aluminum panels with a dramatic CENTRAL SKY-OPENING
 *   (oval hole cut through the tower revealing the sky)
 * - A 「一線天」(sliver of sky) vertical slit running down the tower face
 * - Tribal bronze reliefs depicting the legend of shooting down extra suns
 * - An observation deck at top with bronze archer sculpture
 *
 * The aboriginal legend: long ago, two suns scorched the earth; a brave man shot
 * one down, and the wounded sun became the moon. The tower commemorates this myth.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1). Hero budget: <= 600 triangles.
 */

import { cyl, box, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Material palette — metallic aluminum panels, bronze accents, warm tribal tones
const ALU_LO = 0x8a9298;    // aluminum panel lower shade
const ALU_HI = 0xbcc5cb;    // aluminum panel highlight
const BRONZE = 0x7a5c3a;    // bronze sculpture / reliefs
const BRONZE_HI = 0xa8845a; // bronze highlight
const DECK = 0x5a6268;      // observation deck grey
const WINDOW = 0x2a3844;    // dark glass / openings
const BASE = 0x4a4a4a;      // concrete base

export const NM_SUN_SHOOTING_TOWER = {
  id: 'sun_shooting_tower',
  name: '射日塔',
  landmarkId: 8,
  dioramaRHint: 62, // 射日塔 ~62 m tall
  colorHex: ALU_HI,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.008; // micro jitter
    const parts = [];

    /* ---- 1) Ground plaza / podium ---------------------------------------- */
    parts.push(cyl(1.2, 1.25, 0.14, 10, BASE, { y: 0.07 })); // circular plaza
    parts.push(cyl(0.92, 0.98, 0.2, 10, 0x5e5e5e, { y: 0.2 })); // stepped base

    /* ---- 2) Main cylindrical tower body ---------------------------------- */
    // The tower: a tall cylinder with aluminum cladding
    const towerBot = 0.3;
    const towerH = 3.6;
    const towerR = 0.6;
    // Main cylinder - tapers slightly toward top
    parts.push(cyl(towerR * 0.88, towerR, towerH, 12, ALU_LO, {
      y: towerBot + towerH / 2, hex2: ALU_HI,
    }));

    /* ---- 3) Horizontal band rings (floor divisions visible outside) ------ */
    const ringY = [0.9, 1.6, 2.3, 3.0];
    for (const ry of ringY) {
      parts.push(torus(towerR * 0.89, 0.035, 4, 10, ALU_HI, {
        rx: HALF_PI, y: towerBot + ry,
      }));
    }

    /* ---- 4) The「一線天」vertical slit (sky sliver) on the tower face ---- */
    // A dark vertical groove running down the front of the tower
    parts.push(box(0.08, towerH * 0.7, 0.15, WINDOW, {
      y: towerBot + towerH * 0.4, z: towerR - 0.02,
    }));

    /* ---- 5) Central oval sky-opening (the tower's signature feature) ----- */
    // An oval-shaped opening through the tower - represented by a dark recessed oval
    const openingY = towerBot + towerH * 0.55;
    // Dark elliptical cavity representing the sky-through opening
    parts.push(cyl(0.35, 0.38, 0.65, 8, WINDOW, {
      y: openingY, z: towerR * 0.3, sy: 1.4, sz: 0.4, rx: 0.15,
    }));
    // Bronze rim around the opening
    parts.push(torus(0.38, 0.04, 4, 8, BRONZE, {
      rx: HALF_PI - 0.15, y: openingY, z: towerR * 0.42, sy: 1.3,
    }));

    /* ---- 6) Bronze tribal reliefs around the tower ----------------------- */
    // Represented as small bronze bands/plates at various heights
    for (const ang of [PI * 0.3, PI * 0.7, PI * 1.3, PI * 1.7]) {
      const px = Math.sin(ang) * (towerR + 0.02);
      const pz = Math.cos(ang) * (towerR + 0.02);
      parts.push(box(0.12, 0.45, 0.04, BRONZE, {
        x: px, y: towerBot + 1.1, z: pz, ry: ang, hex2: BRONZE_HI,
      }));
    }

    /* ---- 7) Observation deck at top -------------------------------------- */
    const deckY = towerBot + towerH;
    parts.push(cyl(towerR * 0.95, towerR * 0.86, 0.18, 10, DECK, { y: deckY + 0.09 }));
    parts.push(cyl(towerR * 1.02, towerR * 0.98, 0.08, 10, ALU_HI, { y: deckY + 0.22 })); // deck rim
    // Railing posts around the deck
    for (let a = 0; a < PI * 2; a += PI / 4) {
      const rx = Math.sin(a) * towerR * 0.9;
      const rz = Math.cos(a) * towerR * 0.9;
      parts.push(cyl(0.02, 0.02, 0.2, 4, ALU_HI, { x: rx, y: deckY + 0.36, z: rz }));
    }
    // Top railing ring
    parts.push(torus(towerR * 0.9, 0.02, 3, 10, ALU_HI, { rx: HALF_PI, y: deckY + 0.46 }));

    /* ---- 8) Crown structure / lantern ------------------------------------ */
    const crownY = deckY + 0.52;
    parts.push(cyl(0.25, 0.35, 0.3, 8, ALU_LO, { y: crownY + 0.15, hex2: ALU_HI }));
    parts.push(cone(0.22, 0.25, 8, DECK, { y: crownY + 0.42, hex2: ALU_HI }));

    /* ---- 9) Bronze archer sculpture at top (the sun-shooter) ------------- */
    // Simplified figure of a person drawing a bow, aiming at the sky
    const archerY = crownY + 0.55;
    // Body (torso)
    parts.push(cyl(0.05, 0.06, 0.16, 5, BRONZE, { y: archerY + 0.08, hex2: BRONZE_HI }));
    // Head
    parts.push(sph(0.045, BRONZE, { ws: 5, hs: 3, y: archerY + 0.2 + j, hex2: BRONZE_HI }));
    // Bow arm extended (simplified as angled cylinder)
    parts.push(cyl(0.015, 0.015, 0.14, 4, BRONZE, {
      x: 0.06, y: archerY + 0.12, rz: -0.4, rx: 0.2,
    }));
    // Bow (arc shape - small torus segment)
    parts.push(torus(0.08, 0.01, 3, 6, BRONZE_HI, {
      x: 0.12, y: archerY + 0.14, rx: HALF_PI, rz: -0.3,
    }));
    // Arrow pointing skyward
    parts.push(cyl(0.008, 0.008, 0.18, 3, BRONZE_HI, {
      y: archerY + 0.25, rx: -0.3,
    }));

    return finish(parts);
  },
};

export default NM_SUN_SHOOTING_TOWER;
