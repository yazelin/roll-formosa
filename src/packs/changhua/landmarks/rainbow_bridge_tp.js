/**
 * @file packs/taipei/landmarks/rainbow_bridge_tp.js — Roll Formosa Taipei pack.
 *
 * NM_RAINBOW — 彩虹橋 (Rainbow Bridge), the curved pedestrian/bicycle bridge that
 * sweeps across the 基隆河 (Keelung River) between 松山 and 內湖.
 *
 * Signature silhouette: a single bold RED steel arch that sweeps in a wide, low
 * rainbow over a gently bowed walking deck, tied to the deck by a fan of thin
 * vertical hanger cables, grey concrete abutments anchoring each bank. The whole
 * read is WIDE and LOW — the sweeping red arch is the hero.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in a deliberately wide,
 * low aspect and the sweeping red arch carries the read.
 *
 * Hero model budget: <= 600 triangles.
 */

import { box, cyl, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

const RED = 0xd23a2a; // the steel arch — the hero color
const RED_HI = 0xe85a44; // sunlit crown of the arch
const DECK = 0xcfc6b4; // pale stone/concrete walking deck
const DECK_DK = 0xa89f8d; // deck underside / railing / shadow
const CABLE = 0xb8b2a4; // thin pale hanger cables
const PIER = 0x8c8578; // grey concrete abutments at the banks
const WATER = 0x3f78a0; // hint of Keelung River below

export const NM_RAINBOW = {
  id: 'rainbow_bridge_tp',
  name: '彩虹橋',
  landmarkId: 12,
  dioramaRHint: 60, // ~120 m long curved span; r ~ 60 m (integration may override)
  colorHex: RED,

  buildGeometry(rng) {
    const parts = [];

    // Shared layout constants -------------------------------------------------
    const span = 6.4; // total deck/arch footprint along X (WIDE)
    const deckY = -0.02; // walking-deck level
    const archR = 3.5; // arch ring radius (pre-flatten)
    const archFlat = 0.34; // vertical squash -> a LOW, wide rainbow (not a semicircle)
    const archX = 0.1; // tiny asymmetry so the sweep is not dead-centre
    // crown height of the flattened arch above its springing line:
    const crownH = archR * archFlat; // ~1.19

    // ===================================================================
    // RIVER HINT — a thin wide slab under the span so the bridge reads as
    // crossing water (dark/low so the silhouette stays the arch).
    // ===================================================================
    parts.push(box(span + 1.6, 0.1, 2.0, WATER, { y: -0.78 }));

    // ===================================================================
    // WALKING DECK — a wide, low walkway slab spanning the full span. A gently
    // bowed top is hinted by a slightly raised mid section so the deck does not
    // read dead-flat; the arch carries the main curve. Kept cheap (boxes).
    // ===================================================================
    // Main deck slab (full width, thin, wide in Z = the path).
    parts.push(box(span + 0.5, 0.16, 1.4, DECK, { x: 0, y: deckY - 0.04, hex2: 0xe2dac8 }));
    // Underside shadow band so the deck reads as a solid edge from below/side.
    parts.push(box(span + 0.4, 0.07, 1.2, DECK_DK, { x: 0, y: deckY - 0.13 }));
    // Slightly raised crown course mid-span (the gentle bow hint).
    parts.push(box(span * 0.62, 0.1, 1.35, DECK, { x: archX, y: deckY + 0.04, hex2: 0xe7dfcd }));
    // Railings: two slim dark rails along the deck edges (cheap, low contrast).
    for (const sz of [-1, 1]) {
      parts.push(box(span + 0.2, 0.06, 0.05, DECK_DK, { x: 0, y: deckY + 0.14, z: sz * 0.66 }));
    }

    // ===================================================================
    // GREY ABUTMENTS / BANK PIERS — short concrete blocks anchoring each end.
    // ===================================================================
    for (const sx of [-1, 1]) {
      parts.push(box(0.8, 0.62, 1.7, PIER, { x: sx * (span / 2 + 0.2), y: -0.34, hex2: 0xa39c8e }));
    }

    // ===================================================================
    // THE RED STEEL ARCH — the hero. A bold tubular rainbow swept low across
    // the span. A half-ring torus, flattened in Y so it reads WIDE and LOW.
    // ===================================================================
    // Main arch tube. A default TorusGeometry lies in the XY plane; arc=PI is
    // exactly the TOP half ring (feet at ±archR on X, crown at +Y) — already a
    // rainbow, no rotation needed. sy flattens it into a LOW, wide sweep.
    parts.push(
      torus(archR, 0.17, 4, 24, RED, {
        arc: PI,
        sy: archFlat, // FLATTEN -> low wide rainbow
        x: archX,
        y: deckY, // feet land at deck level
      })
    );
    // Crown highlight: a thinner, slightly larger-radius brighter tube laid over
    // the whole arch sweep (same arc=PI, no rotation) so the steel reads sunlit
    // along its top edge. Nudged up a hair so it sits on the crown side.
    parts.push(
      torus(archR + 0.06, 0.06, 3, 16, RED_HI, {
        arc: PI,
        sy: archFlat,
        x: archX,
        y: deckY + 0.04,
      })
    );
    // Arch feet: stubby red posts tying the arch springs into the deck.
    for (const sx of [-1, 1]) {
      parts.push(cyl(0.2, 0.24, 0.5, 6, RED, { x: archX + sx * archR, y: deckY + 0.12, hex2: RED_HI }));
    }

    // ===================================================================
    // HANGER CABLES — a fan of thin pale verticals from the arch to the deck.
    // Heights trace the flattened rainbow profile (tall mid-span, short at the
    // feet) so the cables read the curve.
    // ===================================================================
    const nCable = 7;
    for (let i = 0; i < nCable; i++) {
      const t = (i + 1) / (nCable + 1); // 0..1 across the span, skip the feet
      const cx = -archR + t * (2 * archR); // march foot-to-foot under the arch
      const u = (cx - archX) / archR; // normalized horizontal pos under the arch
      const archY = deckY + crownH * Math.sqrt(Math.max(0, 1 - u * u));
      const len = Math.max(0.16, archY - deckY - 0.1);
      // tiny rng jitter on thickness only — never structure
      const r = 0.015 + rng() * 0.007;
      parts.push(cyl(r, r, len, 3, CABLE, { x: cx + archX, y: deckY + len / 2 }));
    }

    return finish(parts);
  },
};

export default NM_RAINBOW;
