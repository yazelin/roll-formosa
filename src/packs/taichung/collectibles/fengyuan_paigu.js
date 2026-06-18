/**
 * @file packs/taichung/collectibles/fengyuan_paigu.js — Roll Formosa Taichung pack,
 * collectible 10.
 *
 * 豐原排骨酥麵 — a bowl of Fengyuan-style fried-rib soup noodles. Silhouette: a
 * wide earthenware bowl (warm ceramic body flaring to a lighter glazed rim)
 * sitting on a small foot ring, brimming with a flat pale-brown broth surface.
 * Riding on the broth are 2–3 craggy deep-fried pork-rib chunks (排骨酥, dark
 * soy brown), a glimpse of noodle coil beneath, and a sprinkle of green scallion
 * flecks (蔥花) scattered across the top.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js: box/cyl/sph +
 * paint/xf + finish); the math is an engine red line. finish() merges →
 * recenters → normalizes to a UNIT bounding sphere (radius 1), so RELATIVE
 * proportions carry the read, not absolute size. Tri budget kept well under 350
 * via low radial segment counts. rng() is used only for tiny deterministic
 * nudges to the loose ribs and scallion — never for structure.
 *
 * Build orientation: bowl axis on +Y; the broth surface sits just below the rim
 * so the ribs read as floating in soup from a 3/4 view.
 */

import { box, cyl, sph, finish, PI } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const BOWL = 0xc99b6e; // warm earthenware ceramic body
const BOWL_RIM = 0xe3c39a; // lighter glazed rim (top gradient)
const BOWL_IN = 0xb07f52; // shadowed inner wall
const FOOT = 0xa9794c; // darker foot ring at the base
const BROTH = 0xcaa06a; // pale-brown rib-soup broth surface
const NOODLE = 0xe9d6a8; // wheat-noodle coil peeking through
const RIB = 0x6b3d1f; // deep-fried pork rib (dark soy brown)
const RIB_L = 0x8a5326; // sunlit crispy highlight on the ribs
const RIB_D = 0x4a2a14; // charred fried underside / crag shadow
const SCALLION = 0x4f8a3a; // 蔥花 green scallion fleck

export const COL_FENGYUAN_PAIGU = {
  id: 'fengyuan_paigu',
  name: '豐原排骨酥麵',
  collectibleId: 10,
  colorHex: BOWL,

  /**
   * @param {() => number} rng Boot rng — tiny cosmetic jitter only.
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];
    const j = (a) => (rng() - 0.5) * a; // signed jitter, never structural

    // === BOWL ================================================================
    // Wide earthenware bowl: a tapered open cylinder flaring outward, warm
    // ceramic body (shadowed inner tone at the foot) grading up to a lighter
    // glazed rim. Open-bottomed so the broth shows.
    parts.push(
      cyl(1.55, 0.85, 1.2, 12, BOWL_IN, { y: -0.05, open: true, hex2: BOWL_RIM }),
    );
    // Closed disc base capping the bowl bottom (cheaper than a sphere cap).
    parts.push(
      cyl(0.85, 0.7, 0.12, 10, BOWL_IN, { y: -0.62 }),
    );
    // Small foot ring the bowl stands on.
    parts.push(
      cyl(0.55, 0.62, 0.22, 10, FOOT, { y: -0.86 }),
    );

    // === BROTH SURFACE =======================================================
    // A flat pale-brown disc just below the rim — the soup the ribs float on.
    parts.push(
      cyl(1.34, 1.34, 0.08, 10, BROTH, { y: 0.4 }),
    );

    // === NOODLE GLIMPSE ======================================================
    // A couple of low coiled wheat-noodle nubs poking through the broth so the
    // dish reads as 麵 (noodles), not just soup. Flattened spheres, low-poly.
    parts.push(
      sph(0.5, NOODLE, { ws: 6, hs: 3, x: -0.35, y: 0.44, z: 0.45, sy: 0.32 }),
    );
    parts.push(
      sph(0.42, NOODLE, { ws: 6, hs: 3, x: 0.5, y: 0.44, z: -0.2, sy: 0.3 }),
    );

    // === FRIED RIB CHUNKS (排骨酥) ===========================================
    // 3 craggy dark-brown deep-fried pork-rib chunks riding the broth, each a
    // tilted box with a lighter crispy top and a darker char nub, rotated apart
    // so the cluster looks hand-piled. y just above the broth surface (0.4).
    const ribs = [
      { x: -0.4, z: -0.3, ry: 0.5, w: 0.78, h: 0.52, d: 0.6 },
      { x: 0.45, z: 0.35, ry: -0.7, w: 0.7, h: 0.5, d: 0.66 },
      { x: 0.0, z: 0.0, ry: 0.15, w: 0.74, h: 0.58, d: 0.56 },
    ];
    for (let i = 0; i < ribs.length; i++) {
      const r = ribs[i];
      const rx = r.x + j(0.08);
      const rz = r.z + j(0.08);
      const ry = r.ry + j(0.2);
      const yb = 0.56 + i * 0.06; // slight stagger so they stack readably
      // main fried-rib body — dark soy brown, lighter crispy top via gradient
      parts.push(
        box(r.w, r.h, r.d, RIB, { x: rx, y: yb, z: rz, ry, hex2: RIB_L }),
      );
      // charred craggy nub on one corner to sell "deep fried".
      parts.push(
        box(r.w * 0.42, r.h * 0.5, r.d * 0.4, RIB_D, {
          x: rx + 0.18, y: yb + r.h * 0.42, z: rz - 0.12, ry,
        }),
      );
    }

    // === SCALLION (蔥花) =====================================================
    // Small green flecks scattered across the top — the finishing garnish.
    const flecks = [
      [-0.65, 0.5], [0.7, 0.45], [-0.1, 0.62], [0.35, -0.6], [-0.45, 0.65], [0.6, 0.7],
    ];
    for (let i = 0; i < flecks.length; i++) {
      const [fx, fz] = flecks[i];
      parts.push(
        box(0.16, 0.07, 0.16, SCALLION, {
          x: fx + j(0.1), y: 0.46 + j(0.04), z: fz + j(0.1), ry: rng() * PI,
        }),
      );
    }

    return finish(parts);
  },
};

export default COL_FENGYUAN_PAIGU;
