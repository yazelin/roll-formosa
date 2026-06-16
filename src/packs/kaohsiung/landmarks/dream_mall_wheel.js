/**
 * @file packs/kaohsiung/landmarks/dream_mall_wheel.js — Roll Formosa Kaohsiung pack, hero LANDMARK.
 *
 * NM_DREAM_WHEEL — 夢時代摩天輪 (Dream Mall Ferris Wheel, 統一夢時代購物中心 rooftop,
 * 前鎮區). Kaohsiung's signature ROOFTOP Ferris wheel: a big upright wheel — bold
 * outer rim ring + radial spokes meeting a golden hub + candy gondola cabins dotted
 * round the rim — but unlike a ground wheel it rides on top of a broad shopping-mall
 * roof block, not splayed A-frame legs. The read is "a giant lit wheel perched on a
 * mall roof above the city." A short twin pylon under the hub carries the wheel up
 * off the rooftop slab.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so PROPORTIONS (not absolute size) are authored here: a near-
 * circular wheel that fills the upper silhouette, sitting on a wide low mall roof.
 * <= 600 triangles (hero budget). rng() only nudges cabin/light tint — never
 * structure (spoke/cabin counts are fixed so the wheel always reads round).
 *
 * Palette: white/silver steel ring with bright candy cabins and a colourful lit rim,
 * gold hub, over a cool blue-grey glazed mall roof block (the harbour-mall tint that
 * matches the landmark colorHex 0x6ac0d0).
 */

import { box, cyl, torus, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** Concrete hexes (not tinted) — steel wheel, gold hub/lights, candy cabins, mall roof. */
const RIM_WHITE = 0xeef3f7;
const RIM_INNER = 0xcfd8de;
const STEEL = 0x9aa2a9;
const STEEL_DK = 0x6f777e;
const HUB_GOLD = 0xf2c14e;
const HUB_DK = 0xc9952c;
const NODE_LIGHT = 0xffd86b;
const MALL_GLASS = 0x6ac0d0; // cool harbour-mall glazed wall (the landmark read color)
const MALL_GLASS_D = 0x3f8c9a; // shadowed lower band of the mall block
const MALL_ROOF = 0x4a5a64; // dark roof deck the wheel stands on
const MALL_TRIM = 0xd7e2e8; // pale parapet / sign band trim

/** Cabin candy colours, picked round the rim for a festive read. */
const CABINS = [0xe9534b, 0xf2a23c, 0xf4d24a, 0x6fc46b, 0x46b3d6, 0x5a7fd6, 0xa86fd6, 0xe06fae];

export const NM_DREAM_WHEEL = {
  id: 'dream_mall_wheel',
  name: '夢時代摩天輪',
  dioramaRHint: 190, // rooftop wheel ~ 102.5 m at its high point above the mall
  colorHex: 0x6ac0d0, // cool harbour-mall glazed tint — the read color

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x080404; // tiny per-instance light nudge
    const lightHex = NODE_LIGHT - tint;

    const parts = [];

    // The wheel lives in the X-Y plane (faces camera along +Z). Torus default
    // axis is Z, so no rotation needed for the rim/spoke rings.
    const R = 1.15;        // wheel radius (dominant upper silhouette element)
    const wheelY = 1.65;   // hub height — wheel rides high above the mall roof
    const z0 = 0;          // wheel centre plane

    // ===================================================================
    // MALL ROOF BLOCK — broad low glazed shopping-mall mass the wheel sits on
    // ===================================================================
    const roofTopY = 0.62;  // y of the rooftop deck surface
    parts.push(box(2.6, 0.14, 2.0, MALL_ROOF, { y: 0.07 }));                 // ground/podium slab
    parts.push(box(2.4, 0.5, 1.8, MALL_GLASS, { y: 0.39, hex2: MALL_GLASS_D })); // glazed mall body
    parts.push(box(2.5, 0.06, 1.9, MALL_TRIM, { y: 0.55 }));                 // pale sign / parapet band
    parts.push(box(2.3, 0.1, 1.7, MALL_ROOF, { y: roofTopY }));              // dark rooftop deck

    // ===================================================================
    // SUPPORT PYLONS — short twin posts off the roof deck up to the hub
    // (rooftop wheels stand on stubby pylons, not splayed ground legs)
    // ===================================================================
    const pylY = wheelY - roofTopY;
    for (const sz of [-1, 1]) {
      parts.push(box(0.12, pylY, 0.12, STEEL, {
        x: 0, y: roofTopY + pylY / 2, z: sz * 0.34, hex2: STEEL_DK,
      })); // 12 tris each → 24
    }
    // footing pads on the deck under the pylons
    for (const sz of [-1, 1]) {
      parts.push(box(0.3, 0.08, 0.22, STEEL_DK, { x: 0, y: roofTopY + 0.04, z: sz * 0.34 })); // 12 → 24
    }

    // ===================================================================
    // RIM — the bold outer ring (the single most important read)
    // ===================================================================
    parts.push(torus(R, 0.06, 3, 22, RIM_WHITE, { y: wheelY, z: z0, hex2: RIM_INNER })); // 132 tris
    // inner concentric structural ring (truss read) — thinner, smaller radius
    parts.push(torus(R - 0.2, 0.03, 2, 14, RIM_INNER, { y: wheelY, z: z0 })); // 56 tris

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
    parts.push(cyl(0.22, 0.22, 0.12, 10, HUB_GOLD, { rx: HALF_PI, y: wheelY, z: z0, hex2: HUB_DK })); // gold hub face (40)
    parts.push(cyl(0.09, 0.09, 0.78, 6, STEEL_DK, { rx: HALF_PI, y: wheelY, z: z0 })); // axle through the pylons (24)

    // ===================================================================
    // GONDOLA CABINS — small candy boxes riding round the rim line
    // ===================================================================
    const nCab = CABINS.length; // 8
    const Rc = R - 0.02;
    for (let i = 0; i < nCab; i++) {
      const a = (i / nCab) * PI * 2 + 0.18; // offset so cabins sit between top/sides
      const cx = Math.cos(a) * Rc;
      const cy = Math.sin(a) * Rc;
      parts.push(box(0.17, 0.17, 0.15, CABINS[i], {
        x: cx, y: wheelY + cy, z: z0 + 0.04,
        hex2: 0xffffff, // top edge catches light
      })); // 12 tris each → 96
    }

    // ===================================================================
    // RIM LIGHT ACCENT — a single bright crown node at the top of the wheel
    // ===================================================================
    parts.push(box(0.1, 0.1, 0.1, lightHex, { x: 0, y: wheelY + R, z: z0 - 0.04 })); // 12

    // apex pin where the pylons meet the hub
    parts.push(sph(0.1, STEEL_DK, { ws: 6, hs: 4, y: wheelY - 0.02, z: 0 })); // small sphere

    return finish(parts);
  },
};

export default NM_DREAM_WHEEL;
