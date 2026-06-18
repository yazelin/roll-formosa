/**
 * @file packs/taichung/landmarks/lihpao_wheel.js — Roll Formosa Taichung pack, hero LANDMARK.
 *
 * NM_LIHPAO_WHEEL — 天空之夢摩天輪 (Sky Dream Ferris Wheel, 麗寶樂園 / 后里區).
 * Taichung's signature giant UPRIGHT Ferris wheel: a bold vertical ring (rim)
 * with radial spokes meeting a bright central hub, candy gondola cabins dotted
 * round the rim, all straddled by a splayed A-frame support that carries the
 * wheel axle up off the ground. The iconic read is the big lit circle standing
 * tall above its angled legs — the tallest wheel in Taiwan, a theme-park beacon.
 * Wheel face points +Z (towards camera), as the brief requires.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) are authored
 * here: a near-circular wheel that fills the silhouette, legs ~half its height.
 * <= 600 triangles (hero budget). rng() only nudges the crown-light tint —
 * never structure (spoke/cabin counts are fixed so the wheel always reads round).
 *
 * Palette: a white/silver steel ring with a warm gold hub and a festive ring of
 * candy cabins, carried on a steel-grey A-frame on pale concrete footings.
 */

import { box, cyl, torus, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** Concrete hexes (not tinted) — steel wheel, gold hub/lights, candy cabins. */
const RIM_WHITE = 0xeef3f7;
const RIM_INNER = 0xcfd8de;
const STEEL = 0x9aa2a9;
const STEEL_DK = 0x6f777e;
const HUB_GOLD = 0xf2c14e;
const HUB_DK = 0xc9952c;
const NODE_LIGHT = 0xffd86b;
const BASE_STONE = 0xb9b3a6;

/** Cabin candy colours, picked round the rim for a festive theme-park read. */
const CABINS = [0xe9534b, 0xf2a23c, 0xf4d24a, 0x6fc46b, 0x46b3d6, 0x5a7fd6, 0xa86fd6, 0xe06fae];

export const NM_LIHPAO_WHEEL = {
  id: 'lihpao_wheel',
  name: '天空之夢摩天輪',
  dioramaRHint: 60, // real Lihpao wheel ~ 120 m tall — Taiwan's tallest Ferris wheel
  colorHex: 0xeef3f7, // white steel rim — the read color

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x080404; // tiny per-instance light nudge
    const lightHex = NODE_LIGHT - tint;

    const parts = [];

    // The wheel lives in the X-Y plane (faces camera along +Z). Torus default
    // axis is Z, so no rotation needed for the rim/spoke rings.
    const R = 1.4;        // wheel radius (dominant silhouette element)
    const wheelY = 1.55;  // hub height above ground — wheel rides high on legs
    const z0 = 0;         // wheel centre plane

    // ===================================================================
    // RIM — the bold outer ring (the single most important read)
    // ===================================================================
    parts.push(torus(R, 0.06, 3, 18, RIM_WHITE, { y: wheelY, z: z0, hex2: RIM_INNER })); // 108 tris
    // inner concentric structural ring (truss read) — thinner, smaller radius
    parts.push(torus(R - 0.2, 0.03, 2, 12, RIM_INNER, { y: wheelY, z: z0 })); // 48 tris

    // ===================================================================
    // SPOKES — radial struts from hub to rim (thin flat boxes)
    // ===================================================================
    const nSpoke = 8;
    for (let i = 0; i < nSpoke; i++) {
      const a = (i / nSpoke) * PI * 2;
      const mx = Math.cos(a) * (R / 2);
      const my = Math.sin(a) * (R / 2);
      parts.push(box(0.04, R, 0.04, STEEL, {
        rz: a - HALF_PI, // align the box's long (Y) axis along the radius
        x: mx, y: wheelY + my, z: z0,
      })); // 12 tris each → 96
    }

    // ===================================================================
    // HUB — central golden disc + axle (the wheel's bright core)
    // ===================================================================
    parts.push(cyl(0.24, 0.24, 0.13, 8, HUB_GOLD, { rx: HALF_PI, y: wheelY, z: z0, hex2: HUB_DK })); // gold hub face (32)
    parts.push(cyl(0.09, 0.09, 0.52, 6, STEEL_DK, { rx: HALF_PI, y: wheelY, z: z0 })); // axle through the legs (24)

    // ===================================================================
    // GONDOLA CABINS — small candy boxes riding round the rim line
    // ===================================================================
    const nCab = CABINS.length; // 8 base colours, cycled round the ring
    const cabCount = 12;        // 12 cabins reads as a full festive ring
    const Rc = R - 0.02; // cabins ride right at the rim line
    for (let i = 0; i < cabCount; i++) {
      const a = (i / cabCount) * PI * 2 + 0.13; // offset so cabins sit between top/sides
      const cx = Math.cos(a) * Rc;
      const cy = Math.sin(a) * Rc;
      parts.push(box(0.17, 0.17, 0.15, CABINS[i % nCab], {
        x: cx, y: wheelY + cy, z: z0 + 0.04,
        hex2: 0xffffff, // top edge catches light
      })); // 12 tris each → 144
    }

    // ===================================================================
    // RIM LIGHT ACCENT — a single bright crown node at the top of the wheel
    // (festive accent; budget reserves polys for the round rim + cabins)
    // ===================================================================
    parts.push(box(0.1, 0.1, 0.1, lightHex, { x: 0, y: wheelY + R, z: z0 - 0.05 })); // 12

    // ===================================================================
    // A-FRAME SUPPORT — two splayed legs each side, straddling the wheel,
    // meeting near the hub. Roughly half the wheel height; the structural read.
    // ===================================================================
    const legBottomY = 0.05;
    const legSpanX = 1.0;   // how far the feet splay out sideways
    const legZ = 0.4;       // front/back A-frame offset (axle straddle)
    const legLen = wheelY - legBottomY + 0.1;
    // angle so the leg rises from a splayed foot up to just below the hub
    const legAng = Math.atan2(legSpanX, legLen);
    for (const sx of [-1, 1]) {       // left / right A
      for (const sz of [-1, 1]) {     // front / back leg of each A
        parts.push(box(0.07, legLen, 0.07, STEEL, {
          rz: sx * legAng,
          x: sx * (legSpanX / 2), y: legBottomY + legLen / 2, z: sz * legZ,
          hex2: STEEL_DK,
        })); // 12 tris each → 48
      }
    }
    // cross-brace tying each side's A together (horizontal strut mid-leg)
    for (const sx of [-1, 1]) {
      parts.push(box(0.05, 0.05, legZ * 2, STEEL_DK, { x: sx * (legSpanX * 0.35), y: wheelY * 0.55, z: 0 })); // 12 each → 24
    }
    // concrete footing pads spanning each side's splayed feet (one pad per A)
    for (const sx of [-1, 1]) {
      parts.push(box(0.32, 0.12, legZ * 2 + 0.28, BASE_STONE, { x: sx * (legSpanX / 2 + 0.05), y: legBottomY + 0.04, z: 0 })); // 12 each → 24
    }

    // apex pin where the two A-frames converge under the hub
    parts.push(sph(0.11, STEEL_DK, { ws: 6, hs: 4, y: wheelY - 0.02, z: 0 })); // ~36 tris

    return finish(parts);
  },
};

export default NM_LIHPAO_WHEEL;
