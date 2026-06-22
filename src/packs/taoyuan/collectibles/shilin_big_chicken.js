/**
 * @file packs/taipei/collectibles/shilin_big_chicken.js — Roll Formosa Taipei
 * pack, COLLECTIBLE item (the rare rolled-up treats).
 *
 * 士林大雞排 (Shilin extra-large fried chicken cutlet). A small hand-held snack:
 * one BIG flat breaded golden cutlet — "bigger than your face" — standing up out
 * of a kraft-paper sleeve. The silhouette is a wide, thin, rounded golden slab
 * (crispy breaded crust, deep-fried amber) poking out of a pale paper bag that
 * the hand grips. Sprinkled with pepper flecks. Low-poly + cute.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere, so this is authored
 * in unit-ish space for correct PROPORTIONS: the cutlet is WIDE + FLAT (a
 * paddle, not a block), sleeve hugs its lower third. <= 350 tris.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

// Palette — fried-chicken snack materials.
const CRUST = 0xc77a2c; // 酥脆金黃 deep-fried breaded crust (front face)
const CRUST_D = 0x8f5218; // darker fried edge / underside of breading
const CRUST_HI = 0xe0a04e; // lighter crispy highlight on crumb bumps
const PAPER = 0xf2ead3; // kraft / wax sleeve pale cream
const PAPER_D = 0xd8c79a; // sleeve shadow + folded crease
const PEPPER = 0x3a2a1c; // 胡椒 black-pepper / spice fleck
const SALT = 0xf7f2e6; // tiny pale seasoning fleck

export const COL_BIGCHICKEN = {
  id: 'shilin_big_chicken',
  name: '士林大雞排',
  collectibleId: 11,
  colorHex: 0xc77a2c, // 金黃 — the signature fried-crust gold
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.04; // tiny non-structural jitter on crumb scatter
    const parts = [];

    // ---- The cutlet: a wide, FLAT, rounded golden paddle --------------------
    // Core slab — thin in z (depth), broad in x, tall in y. This is the
    // "bigger than a face" breaded cutlet that defines the silhouette.
    const W = 1.9; // width
    const H = 1.55; // height of the cutlet body
    const T = 0.26; // thickness (kept small → reads as flat)
    const cy = 0.55; // lift so the sleeve can hug the bottom

    // Front + back breaded faces (vertical gradient: amber top → fried-dark base).
    parts.push(box(W, H, T, CRUST, { y: cy, hex2: CRUST_D }));
    // Rounded shoulders — soften the rectangle into the lumpy cutlet outline.
    for (const sx of [-1, 1]) {
      parts.push(sph(0.42, CRUST, { ws: 4, hs: 3, x: sx * (W * 0.5 - 0.18), y: cy + H * 0.34, sz: 0.55, hex2: CRUST_D }));
    }
    // Top rounded edge — the crispy bulging top of the cutlet.
    parts.push(cyl(0.34, 0.34, W * 0.82, 6, CRUST, { rz: PI / 2, y: cy + H * 0.5 - 0.04, sz: 0.42, hex2: CRUST_HI }));
    // Bottom rounded edge (mostly hidden by the sleeve, gives weight).
    parts.push(cyl(0.3, 0.3, W * 0.78, 6, CRUST_D, { rz: PI / 2, y: cy - H * 0.5 + 0.06, sz: 0.42 }));

    // ---- Crispy breading texture: scattered crumb bumps on the front face ----
    // Fixed lattice (structure is deterministic); rng only nudges scale slightly.
    const bumps = [
      [-0.55, 0.95, 0.18], [0.1, 1.05, 0.15], [0.62, 0.88, 0.17],
      [-0.7, 0.45, 0.16], [-0.05, 0.5, 0.2], [0.6, 0.42, 0.15],
      [-0.4, 0.05, 0.17],
    ];
    for (const [bx, by, br] of bumps) {
      const s = br * (1 + r * 2);
      parts.push(sph(s, CRUST_HI, { ws: 4, hs: 3, x: bx, y: by, z: T * 0.5 + s * 0.35, sz: 0.5, hex2: CRUST }));
    }

    // ---- Seasoning flecks: black pepper + a little salt ---------------------
    const flecks = [
      [-0.3, 1.15, PEPPER], [0.45, 1.0, PEPPER], [-0.6, 0.7, SALT],
      [0.2, 0.6, PEPPER], [-0.15, 0.3, PEPPER],
    ];
    for (const [fx, fy, fc] of flecks) {
      parts.push(box(0.07, 0.07, 0.04, fc, { x: fx, y: fy, z: T * 0.5 + 0.18 }));
    }

    // ---- Kraft-paper sleeve hugging the bottom third of the cutlet ----------
    // A flat-fronted bag, slightly wider than the cutlet, open V at the top so
    // the golden crust pokes out — the classic night-market hand-grip.
    const sleeveY = 0.08;
    const sleeveH = 0.95;
    const sw = W * 0.62; // sleeve half-width-ish
    // Front + back paper panels (vertical gradient → shadow at the fold base).
    parts.push(box(sw * 2, sleeveH, 0.07, PAPER, { y: sleeveY, z: T * 0.5 + 0.07, hex2: PAPER_D }));
    parts.push(box(sw * 2, sleeveH, 0.07, PAPER_D, { y: sleeveY, z: -T * 0.5 - 0.07 }));
    // Side gusset walls closing the bag.
    for (const sx of [-1, 1]) {
      parts.push(box(0.07, sleeveH, T + 0.18, PAPER, { x: sx * sw, y: sleeveY, hex2: PAPER_D }));
    }
    // Two angled top flaps forming the open-V mouth of the sleeve.
    for (const sx of [-1, 1]) {
      parts.push(box(sw * 1.05, 0.16, 0.07, PAPER, { rz: sx * 0.42, x: sx * sw * 0.5, y: sleeveY + sleeveH * 0.5 + 0.06, z: T * 0.5 + 0.07, hex2: PAPER_D }));
    }
    // A folded crease band across the front of the sleeve for that paper read.
    parts.push(box(sw * 2 - 0.04, 0.06, 0.02, PAPER_D, { y: sleeveY - 0.1, z: T * 0.5 + 0.11 }));

    return finish(parts);
  },
};
