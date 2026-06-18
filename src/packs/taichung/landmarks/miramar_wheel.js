/**
 * @file packs/taipei/landmarks/miramar_wheel.js — Roll Formosa Taipei pack, hero LANDMARK.
 *
 * NM_WHEEL — 美麗華摩天輪 (Miramar Ferris Wheel). Silhouette: a big UPRIGHT
 * Ferris wheel — a large vertical ring (rim) with radial spokes meeting a
 * central hub, small gondola cabins dotted around the rim, all carried on a
 * splayed A-frame support straddling the wheel. The iconic read is the bold
 * circular wheel standing tall above its angled legs.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS (not absolute size) are authored
 * here: a near-circular wheel that fills the silhouette, legs ~half its height.
 * <= 600 triangles (hero budget). rng() only nudges cabin/light tint — never
 * structure (spoke/cabin counts are fixed so the wheel always reads round).
 *
 * Palette: the Miramar wheel is a white/silver steel ring with bright cabins
 * and a colourful lit rim. White rim (0xeef3f7) + steel-grey A-frame
 * (0x8d959c) + warm gold hub/lights (0xf2c14e) + candy cabins.
 */

import { box, cyl, torus, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** Concrete hexes (not tinted) — steel wheel, gold lights, candy cabins. */
const RIM_WHITE = 0xeef3f7;
const RIM_INNER = 0xcfd8de;
const STEEL = 0x9aa2a9;
const STEEL_DK = 0x6f777e;
const HUB_GOLD = 0xf2c14e;
const HUB_DK = 0xc9952c;
const NODE_LIGHT = 0xffd86b;
const BASE_STONE = 0xb9b3a6;

/** Cabin candy colours, picked round the rim for a festive read. */
const CABINS = [0xe9534b, 0xf2a23c, 0xf4d24a, 0x6fc46b, 0x46b3d6, 0x5a7fd6, 0xa86fd6, 0xe06fae];

export const NM_WHEEL = {
  id: 'miramar_wheel',
  name: '美麗華摩天輪',
  dioramaRHint: 50, // real Miramar wheel ~ 100 m diameter, ~ 70 m above ground
  colorHex: 0xeef3f7, // white steel rim — the read color

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x080404; // tiny per-instance light nudge
    const lightHex = NODE_LIGHT - tint;

    const parts = [];

    // The wheel lives in the X-Y plane (faces camera along +Z). Torus default
    // axis is Z, so no rotation needed for the rim/spoke rings.
    const R = 1.45;          // wheel radius (dominant silhouette element)
    const wheelY = 1.5;      // hub height above ground — wheel sits high on legs
    const z0 = 0;            // wheel centre plane

    // ===================================================================
    // RIM — the bold outer ring (the single most important read)
    // ===================================================================
    parts.push(torus(R, 0.07, 3, 22, RIM_WHITE, { y: wheelY, z: z0, hex2: RIM_INNER })); // 132 tris
    // inner concentric structural ring (truss read) — thinner, smaller radius
    parts.push(torus(R - 0.22, 0.035, 2, 14, RIM_INNER, { y: wheelY, z: z0 })); // 56 tris

    // ===================================================================
    // SPOKES — radial struts from hub to rim (thin flat boxes)
    // ===================================================================
    const nSpoke = 8;
    for (let i = 0; i < nSpoke; i++) {
      const a = (i / nSpoke) * PI * 2;
      const mx = Math.cos(a) * (R / 2);
      const my = Math.sin(a) * (R / 2);
      parts.push(box(0.045, R, 0.045, STEEL, {
        rz: a - HALF_PI, // align the box's long (Y) axis along the radius
        x: mx, y: wheelY + my, z: z0,
      })); // 12 tris each → 108
    }

    // ===================================================================
    // HUB — central golden disc + axle (the wheel's bright core)
    // ===================================================================
    parts.push(cyl(0.26, 0.26, 0.14, 10, HUB_GOLD, { rx: HALF_PI, y: wheelY, z: z0, hex2: HUB_DK })); // gold hub face
    parts.push(cyl(0.1, 0.1, 0.5, 6, STEEL_DK, { rx: HALF_PI, y: wheelY, z: z0 })); // axle through the legs

    // ===================================================================
    // GONDOLA CABINS — small candy boxes hanging just inside the rim
    // ===================================================================
    const nCab = CABINS.length; // 8
    const Rc = R - 0.02; // cabins ride right at the rim line
    for (let i = 0; i < nCab; i++) {
      const a = (i / nCab) * PI * 2 + 0.18; // offset so cabins sit between top/sides
      const cx = Math.cos(a) * Rc;
      const cy = Math.sin(a) * Rc;
      parts.push(box(0.2, 0.2, 0.17, CABINS[i], {
        x: cx, y: wheelY + cy, z: z0 + 0.04,
        hex2: 0xffffff, // top edge catches light
      })); // 12 tris each → 96
    }

    // ===================================================================
    // RIM LIGHT ACCENT — a single bright crown node at the top of the wheel
    // (festive accent; budget reserves polys for the round rim + cabins)
    // ===================================================================
    parts.push(box(0.1, 0.1, 0.1, lightHex, { x: 0, y: wheelY + R, z: z0 - 0.05 })); // 12

    // ===================================================================
    // A-FRAME SUPPORT — two splayed legs each side, straddling the wheel,
    // meeting near the hub. Half the wheel height; the structural read.
    // ===================================================================
    const legBottomY = 0.05;
    const legSpanX = 1.0;   // how far the feet splay out sideways
    const legZ = 0.42;      // front/back A-frame offset (axle straddle)
    const legLen = wheelY - legBottomY + 0.1;
    // angle so the leg rises from a splayed foot up to just below the hub
    const legAng = Math.atan2(legSpanX, legLen);
    for (const sx of [-1, 1]) {       // left / right A
      for (const sz of [-1, 1]) {     // front / back leg of each A
        parts.push(box(0.075, legLen, 0.075, STEEL, {
          rz: sx * legAng,
          x: sx * (legSpanX / 2), y: legBottomY + legLen / 2, z: sz * legZ,
          hex2: STEEL_DK,
        }));
      }
    }
    // cross-brace tying each side's A together (horizontal strut mid-leg)
    for (const sx of [-1, 1]) {
      parts.push(box(0.05, 0.05, legZ * 2, STEEL_DK, { x: sx * (legSpanX * 0.35), y: wheelY * 0.55, z: 0 }));
    }
    // concrete footing pads spanning each side's splayed feet (one pad per A)
    for (const sx of [-1, 1]) {
      parts.push(box(0.34, 0.12, legZ * 2 + 0.3, BASE_STONE, { x: sx * (legSpanX / 2 + 0.05), y: legBottomY + 0.04, z: 0 }));
    }

    // apex pin where the two A-frames converge under the hub
    parts.push(sph(0.12, STEEL_DK, { ws: 6, hs: 4, y: wheelY - 0.02, z: 0 }));

    return finish(parts);
  },
};

export default NM_WHEEL;
