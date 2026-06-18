/**
 * @file packs/taichung/collectibles/jiguang_chicken.js — Roll Formosa Taichung
 * pack, COLLECTIBLE item (the rare rolled-up treats).
 *
 * 繼光香香雞 (Taichung-origin fried popcorn-chicken bites in a paper bag). The
 * silhouette: a tall cream/kraft paper bag (a box, taller than wide, beige) with
 * an open top and a slightly flared / folded-out top rim, OVERFLOWING with a heap
 * of small golden-brown fried chicken nuggets spilling out of the mouth. Reads as
 * a night-market paper bag of crispy chicken bites. Low-poly + cute.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere, so this is authored
 * in unit-ish space for correct PROPORTIONS: the bag is TALL + narrow, the chicken
 * pile mounds above and spills over the rim. <= 350 tris.
 */

import { box, sph, finish } from '../geomHelpers.js';

// Palette — fried-chicken-in-a-bag materials.
const PAPER = 0xe7d8b8; // 牛皮紙袋 cream / kraft beige (bag body)
const PAPER_HI = 0xf3e8cd; // lighter top — sun-lit folded rim
const PAPER_D = 0xc9b690; // bag shadow / inside-mouth + crease
const CHICK = 0xd9a14a; // 金黃 fried popcorn-chicken golden
const CHICK_HI = 0xe7b96a; // crispy highlight on a nugget crown
const CHICK_D = 0xc8862f; // 酥脆 deeper fried amber (darker bites)

export const COL_JIGUANG_CHICKEN = {
  id: 'jiguang_chicken',
  name: '繼光香香雞',
  collectibleId: 7,
  colorHex: 0xd9a14a, // 金黃 — the signature fried-chicken gold
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.05; // tiny non-structural jitter on the pile
    const parts = [];

    // ---- The kraft paper bag: tall, narrow, open-topped --------------------
    const BW = 0.92; // bag width (x)
    const BD = 0.7; // bag depth (z) — slightly narrower than wide
    const BH = 1.45; // bag height — TALLER than wide
    const by = -0.05; // body lift so the pile mounds above center

    // Bag body — vertical gradient: shadowed base → sun-lit toward the rim.
    parts.push(box(BW, BH, BD, PAPER_D, { y: by, hex2: PAPER }));

    // Slightly flared / folded-out top rim — a thin band wider than the body,
    // four short folded panels around the open mouth.
    const rimY = by + BH * 0.5;
    const rimW = BW + 0.12;
    const rimD = BD + 0.12;
    // Front + back folded flaps (flared outward, paler highlight).
    for (const sz of [-1, 1]) {
      parts.push(box(rimW, 0.16, 0.08, PAPER_HI, { rx: sz * 0.5, x: 0, y: rimY + 0.04, z: sz * (BD * 0.5 + 0.02), hex2: PAPER }));
    }
    // Left + right folded flaps.
    for (const sx of [-1, 1]) {
      parts.push(box(0.08, 0.16, rimD, PAPER_HI, { rz: -sx * 0.5, x: sx * (BW * 0.5 + 0.02), y: rimY + 0.04, z: 0, hex2: PAPER }));
    }
    // Dark inner mouth — a slightly inset shadowed lip so the bag reads "open".
    parts.push(box(BW - 0.1, 0.06, BD - 0.1, PAPER_D, { y: rimY - 0.02 }));

    // Vertical crease lines down the front for that paper-bag pleat read.
    for (const cx of [-0.22, 0.22]) {
      parts.push(box(0.03, BH * 0.82, 0.02, PAPER_D, { x: cx, y: by, z: BD * 0.5 + 0.005 }));
    }

    // ---- The heap of fried chicken bites, mounding + spilling over the rim ---
    // Deterministic lattice of nugget spheres; rng only nudges scale slightly so
    // structure stays stable. Pile sits in the mouth and bulges above the rim.
    const baseY = rimY - 0.02; // top of the bag mouth
    // [x, y(above baseY), z, radius, colorHex]
    const nuggets = [
      // inner mouth cluster (lower, packed)
      [-0.18, 0.06, -0.12, 0.2, CHICK],
      [0.2, 0.04, -0.06, 0.21, CHICK_D],
      [0.04, 0.02, 0.18, 0.2, CHICK],
      [-0.22, 0.08, 0.16, 0.19, CHICK_D],
      // mid mound
      [-0.02, 0.24, -0.04, 0.23, CHICK],
      [0.26, 0.2, 0.1, 0.2, CHICK_D],
      [-0.28, 0.22, -0.08, 0.19, CHICK],
      [0.12, 0.26, 0.2, 0.2, CHICK_D],
      // crown / spill-over peak
      [-0.06, 0.42, 0.04, 0.22, CHICK_HI],
      [0.16, 0.4, -0.1, 0.19, CHICK],
      // bites spilling OVER the rim edges (read as overflowing)
      [-0.46, 0.04, 0.06, 0.18, CHICK_D],
      [0.46, 0.1, -0.04, 0.18, CHICK],
      [0.0, 0.06, 0.44, 0.18, CHICK_D],
      [-0.12, 0.0, -0.42, 0.17, CHICK],
    ];
    for (const [nx, ny, nz, nr, nc] of nuggets) {
      const s = nr * (1 + r);
      parts.push(sph(s, nc, { ws: 4, hs: 3, x: nx, y: baseY + ny, z: nz, hex2: CHICK_HI }));
    }

    return finish(parts);
  },
};

export default COL_JIGUANG_CHICKEN;
