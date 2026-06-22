/**
 * @file packs/taipei/collectibles/youbike.js — Roll Formosa Taipei pack, collectible 8.
 *
 * YouBike(微笑單車) — Taipei's ubiquitous public-share bicycle, the bright
 * yellow-orange city bike parked at docking stations on nearly every block.
 * As a small hand-rollable collectible it reads as a cute low-poly side-view
 * bicycle: two spoked wheels, a step-through city frame, swept-back handlebars,
 * a saddle, pedals, and — the unmistakable YouBike tell — a wire FRONT BASKET
 * over the front wheel.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read, not absolute size:
 * two equal wheels spaced a wheelbase apart, frame sitting between them, basket
 * perched forward and high over the front wheel.
 *
 * The bike lies in the X–Y plane (X = forward/back, Y = up), thin along Z so it
 * keeps a crisp side-profile silhouette. Palette: signature YouBike
 * yellow-orange frame/basket, dark tyres, light grey rims and components.
 * rng() is used only for a hair of saddle/basket jitter — never for structure.
 */

import { box, cone, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const YB = 0xf7a823; // signature YouBike yellow-orange (frame + basket)
const YB_L = 0xffc14d; // sunlit highlight of the yellow-orange
const YB_D = 0xc77f12; // shadowed yellow-orange
const TYRE = 0x2c2b29; // near-black rubber tyre
const TYRE_L = 0x3d3b38; // tyre highlight
const STEEL = 0x9a9ea4; // grey steel spokes / forks / bars
const STEEL_D = 0x76797e; // shadowed steel
const SADDLE = 0x232323; // black saddle + grips
const HUB = 0xd9dadc; // bright hub / bell

// Wheel centres (authored units; side profile in X–Y).
const WR = 0.62; // wheel radius
const FRONT_X = 1.02; // front wheel centre X (+X = front of bike)
const REAR_X = -1.02; // rear wheel centre X
const WHEEL_Z = 0; // bike sits centred on Z, thin in depth

/**
 * One spoked wheel: a dark tyre torus plus two crossing hub-coloured spoke
 * bars (a 4-spoke star whose overlap reads as the hub). Authored centred on the
 * origin in X–Y, then the caller translates it to its wheel position.
 * @param {number} cx wheel centre X
 * @param {() => number} rng
 * @returns {THREE.BufferGeometry[]}
 */
function wheel(cx, rng) {
  const p = [];
  // Tyre: a single thin torus in the X–Y plane carries the dark rubber ring and
  // the round silhouette. Cheapest closed tube (rs=2); radial segments (ts=7)
  // give a smooth-enough circle. A lighter top→bottom gradient hints at the rim.
  p.push(torus(WR, 0.08, 2, 7, TYRE, { x: cx, z: WHEEL_Z, hex2: TYRE_L }));
  // Spokes: two crossing bars (→ 4-spoke star); their bright-hub-coloured centre
  // overlap reads as the wheel hub, so no separate hub part is spent.
  const sj = (rng() - 0.5) * 0.06; // tiny rotational jitter (variation only)
  for (let i = 0; i < 2; i++) {
    const a = (i / 2) * PI + sj + 0.3;
    p.push(box(0.05, (WR - 0.07) * 2, 0.05, STEEL, { rz: a, x: cx, z: WHEEL_Z, hex2: HUB }));
  }
  return p;
}

export const COL_YOUBIKE = {
  id: 'youbike',
  name: 'YouBike(微笑單車)',
  collectibleId: 8,
  colorHex: YB,

  buildGeometry(rng) {
    const parts = [];

    // === WHEELS ==============================================================
    parts.push(...wheel(FRONT_X, rng));
    parts.push(...wheel(REAR_X, rng));

    // === FRAME ===============================================================
    // A step-through city-bike frame in yellow-orange. Key tubes:
    //  - bottom bracket near origin (between/below the wheels)
    //  - sloping down/top tube up to the head tube above the front wheel
    //  - seat tube up to the saddle
    //  - chainstays back to the rear hub
    const BB = { x: 0, y: -0.06 }; // bottom bracket (pedal crank centre)
    const HEAD = { x: 0.74, y: 0.66 }; // head tube top (front)
    const SEAT = { x: -0.34, y: 0.7 }; // seat-tube top (saddle base)

    /** push a frame tube between two points as a thin box rotated to align. */
    const tube = (ax, ay, bx, by, w, hex, hi) => {
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx) - HALF_PI; // box long axis is +Y → rotate to dir
      parts.push(
        box(w, len, w, hex, {
          rz: ang,
          x: (ax + bx) / 2,
          y: (ay + by) / 2,
          hex2: hi !== undefined ? hi : YB_L,
        })
      );
    };

    // Down/top tube: bottom bracket → head tube (the long sweeping spine).
    tube(BB.x, BB.y, HEAD.x, HEAD.y, 0.1, YB);
    // Lower "step-through" tube: a second curve cue, bottom bracket → seat base.
    tube(BB.x, BB.y, SEAT.x, SEAT.y, 0.1, YB);
    // Top connecting tube: seat top → head tube (gives the diamond read).
    tube(SEAT.x, SEAT.y, HEAD.x, HEAD.y, 0.085, YB_D, YB);
    // Rear triangle: a single seatstay run, seat top → rear hub, doubles as the
    // chainstay read in side profile (one tube spent instead of two).
    tube(SEAT.x, SEAT.y, REAR_X, 0.0, 0.07, YB_D, YB);

    // Front fork: head tube → front hub (grey steel).
    tube(HEAD.x, HEAD.y, FRONT_X, 0.0, 0.07, STEEL, STEEL_D);

    // === HANDLEBARS ==========================================================
    // Stem up from head tube, then swept-back bars (city-bike upright posture).
    parts.push(box(0.07, 0.3, 0.07, STEEL, { x: HEAD.x, y: HEAD.y + 0.2, hex2: STEEL_D }));
    // Cross handlebar (a thin box along X, sweeping back — cheaper than a cyl).
    // A short dark grip cap at the rider end finishes the bar.
    parts.push(box(0.62, 0.08, 0.08, STEEL, { x: HEAD.x - 0.18, y: HEAD.y + 0.36, hex2: STEEL_D }));
    parts.push(box(0.1, 0.09, 0.09, SADDLE, { x: HEAD.x - 0.46, y: HEAD.y + 0.36 })); // grip

    // === SADDLE ==============================================================
    // Seat post + cushy black saddle, with a hair of fore-aft jitter.
    const sj = (rng() - 0.5) * 0.04;
    parts.push(box(0.06, 0.26, 0.06, STEEL, { x: SEAT.x, y: SEAT.y + 0.14, hex2: STEEL_D }));
    parts.push(
      box(0.36, 0.08, 0.16, SADDLE, {
        x: SEAT.x - 0.05 + sj,
        y: SEAT.y + 0.3,
        rz: 0.08,
      })
    );
    parts.push(cone(0.07, 0.18, 5, SADDLE, { rz: -HALF_PI, x: SEAT.x - 0.26 + sj, y: SEAT.y + 0.3 })); // tapered nose

    // === CRANK + PEDALS ======================================================
    // Chainring (grey) — kept as a small flat box to stay under budget; the
    // crank arm + pedal sell the drivetrain in side profile.
    parts.push(box(0.28, 0.28, 0.05, STEEL_D, { rz: PI / 4, x: BB.x, y: BB.y }));
    // Crank arm + pedal (one visible on the near side).
    parts.push(box(0.05, 0.26, 0.05, STEEL, { rz: 0.9, x: BB.x + 0.08, y: BB.y - 0.1 }));
    parts.push(box(0.14, 0.04, 0.1, SADDLE, { x: BB.x + 0.18, y: BB.y - 0.2 })); // pedal block

    // === FRONT BASKET (the YouBike tell) ====================================
    // A bright yellow-orange wire basket perched over the front wheel, mounted
    // off the head tube. An open-top box (floor + the side-on long wall + a front
    // end wall) reads as the signature share-bike carrier without spending tris
    // on real wire mesh.
    const bx = HEAD.x + 0.18; // basket centre X (forward, over front wheel)
    const by = HEAD.y + 0.16; // basket centre Y (above the bars line)
    const bj = (rng() - 0.5) * 0.02;
    parts.push(box(0.42, 0.05, 0.34, YB, { x: bx, y: by - 0.13 + bj, hex2: YB_L })); // floor
    parts.push(box(0.42, 0.28, 0.04, YB, { x: bx, y: by, z: 0.16, hex2: YB_L })); // near long wall (+Z, side-on face)
    parts.push(box(0.04, 0.26, 0.34, YB_D, { x: bx + 0.2, y: by, hex2: YB })); // front end wall
    // (back end wall omitted — hidden behind the head tube in side profile)
    // Basket mount strut down to the head tube.
    parts.push(box(0.05, 0.2, 0.05, STEEL, { rz: 0.4, x: bx - 0.12, y: by - 0.2, hex2: STEEL_D }));

    // === FENDER (low-tri arc hugging the front tyre) ========================
    // A short curved mudguard cap over the FRONT wheel top, in frame colour
    // (rs=2, ts=5 keeps it cheap; it only needs to read as a thin overhead arc).
    // Only the front guard is spent — it sits under the basket where the eye
    // goes, and the rear stays clean to respect the tri budget.
    parts.push(torus(WR + 0.03, 0.04, 2, 5, YB, { x: FRONT_X, arc: PI * 0.5, rz: PI * 0.25, hex2: YB_L }));

    return finish(parts);
  },
};

export default COL_YOUBIKE;
