/**
 * @file packs/taichung/landmarks/miyahara.js — Roll Formosa Taichung pack, landmark 1.
 *
 * 宮原眼科 (Miyahara) — a 1927 Japanese-colonial red-brick 街屋 (shophouse)
 * facade in central Taichung, reborn as a lavish ice-cream / gift emporium.
 * The icon is the FACADE itself: a tall, narrow red-brick wall pierced by two
 * orderly tiers of white-rimmed ARCHED windows, divided by white horizontal
 * string courses, framed by slender brick pilasters, and capped by a flat,
 * straight parapet (女兒牆) with a small central crest. It reads as one
 * ornate brick WALL-FACE — wider read of the front than its depth.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read (tall+narrow front,
 * shallow depth, two horizontal bands of arches), not absolute size. Arched
 * heads are half-cylinders (thetaLen=PI) laid to face +Z, exactly as the gate
 * arch is built. rng() adds only a hair of crest jitter — never structure.
 * <= 600 tris.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// ---- palette ----------------------------------------------------------------
const BRICK = 0x9c4a36; // 清水紅磚 — the signature red brick field
const BRICK_D = 0x7e3829; // shadowed brick (recessed bays / side-wall shade)
const BRICK_L = 0xb05a44; // sunlit brick (pilaster faces / top gradient)
const WHITE = 0xeae2d4; // pale plaster string courses / arch surrounds
const WHITE_D = 0xcdc4b2; // shadowed plaster (cornice underside)
const VOID = 0x241a16; // near-black window / doorway opening (recess)
const WOOD = 0x5e3a28; // timber shop doors in the ground arcade

export const NM_MIYAHARA = {
  id: 'miyahara',
  name: '宮原眼科',
  landmarkId: 1,
  dioramaRHint: 15, // ~ shophouse-front footprint radius in metres
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];

    // Front face sits at +Z; the facade is wide-and-tall but shallow in depth,
    // so a 3/4 view shows the broad brick front and a thin brick return.
    const FZ = 0.62; // front-face plane (half-depth of the main slab)
    const BAYS = [-0.6, 0, 0.6]; // three window-bay centres (x)
    const PIERS = [-0.92, -0.3, 0.3, 0.92]; // four pilasters framing the bays

    // === 1) BASE + MAIN BRICK SLAB ==========================================
    parts.push(box(2.3, 0.18, 1.34, BRICK_D, { y: 0.09, hex2: BRICK })); // plinth foot (battered, slightly proud)
    parts.push(box(2.06, 3.04, 1.24, BRICK, { y: 1.7, hex2: BRICK_L })); // tall narrow brick facade mass (lighter toward parapet)
    // Shaded brick side-return so the corner reads as a building, not a card.
    parts.push(box(0.06, 3.0, 1.18, BRICK_D, { x: 1.03, y: 1.7, hex2: 0x8e4030 }));

    // === 2) BRICK PILASTERS (vertical piers framing the 3 bays) =============
    // Slightly proud, lighter brick — the ornate vertical rhythm of the wall.
    for (const px of PIERS) {
      parts.push(box(0.14, 2.86, 0.1, BRICK_L, { x: px, y: 1.66, z: FZ }));
    }

    // === 3) WHITE HORIZONTAL STRING COURSES (女兒牆/腰線分層) ================
    // These both divide the floors AND act as the window sills/lintels.
    const courses = [
      { y: 0.52, w: 2.18, t: 0.1 }, // above the ground arcade (1F sill line)
      { y: 1.06, w: 2.14, t: 0.09 }, // 1F lintel band
      { y: 1.96, w: 2.14, t: 0.09 }, // 2F sill band
      { y: 2.62, w: 2.16, t: 0.1 }, // 2F lintel band
    ];
    for (const c of courses) {
      parts.push(box(c.w, c.t, 1.3, WHITE, { y: c.y, hex2: WHITE_D }));
    }

    // === 4) ARCHED WINDOWS — two tiers (the recognizable feature) ===========
    // Each window = a dark rectangular recess + a dark semicircular arch head
    // (half-cylinder facing +Z) + a slim WHITE archivolt ring over it. The
    // white rims against the red brick are what make this read as Miyahara.
    const aW = 0.38; // window opening width
    const aR = aW / 2; // arch radius
    const winRows = [
      { y0: 1.18, h: 0.62 }, // first (lower / 1F) window tier
      { y0: 2.08, h: 0.5 }, // second (upper / 2F) window tier, a touch shorter
    ];
    for (const row of winRows) {
      const cy = row.y0 + row.h / 2; // recess centre
      const headY = row.y0 + row.h; // arch springs from the top of the recess
      for (const bx of BAYS) {
        // rectangular dark recess (the window void)
        parts.push(box(aW, row.h, 0.14, VOID, { x: bx, y: cy, z: FZ - 0.05 }));
        // semicircular dark arch head (half-cyl laid to face +Z, flat side down)
        parts.push(
          cyl(aR, aR, 0.14, 6, VOID, {
            rx: HALF_PI,
            theta0: 0,
            thetaLen: PI,
            x: bx,
            y: headY,
            z: FZ - 0.05,
          })
        );
        // white archivolt ring (open half-cyl rim) framing the arch — the
        // pale-on-brick surround that defines the Miyahara window.
        parts.push(
          cyl(aR + 0.08, aR + 0.08, 0.1, 6, WHITE, {
            rx: HALF_PI,
            theta0: 0,
            thetaLen: PI,
            open: true,
            x: bx,
            y: headY,
            z: FZ + 0.02,
          })
        );
      }
    }

    // === 5) GROUND-FLOOR ARCADE (shop entrances) ============================
    // Three tall recessed openings read as a dark colonnade base; the centre is
    // the doorway with timber leaves. Kept rectangular (the UPPER tiers carry
    // the arch motif) so the model stays well under the triangle cap.
    const gY0 = 0.18;
    const gH = 1.0;
    for (let i = 0; i < BAYS.length; i++) {
      const bx = BAYS[i];
      parts.push(box(0.46, gH, 0.16, VOID, { x: bx, y: gY0 + gH / 2, z: FZ - 0.06 }));
      // timber shop doors / display behind the openings
      parts.push(box(0.4, gH - 0.06, 0.04, WOOD, { x: bx, y: gY0 + gH / 2, z: FZ - 0.16 }));
    }

    // === 6) FLAT STRAIGHT PARAPET (女兒牆) + central crest ===================
    // A plain straight coping caps the wall; a small raised central panel with a
    // tiny pediment gives the dressed brick front its finishing crown.
    parts.push(box(2.2, 0.16, 1.34, WHITE, { y: 3.3, hex2: WHITE_D })); // main parapet coping (flat top)
    parts.push(box(2.1, 0.1, 1.26, BRICK_L, { y: 3.16 })); // brick frieze just under the coping
    // central raised crest panel
    parts.push(box(0.66, 0.34, 0.16, BRICK, { y: 3.5, z: FZ - 0.02, hex2: BRICK_L }));
    parts.push(box(0.74, 0.07, 0.2, WHITE, { y: 3.7, z: FZ - 0.02 })); // crest cap band
    const j = (rng() - 0.5) * 0.02; // tiny non-structural crest jitter
    parts.push(box(0.18, 0.16, 0.18, WHITE, { y: 3.82 + j, z: FZ - 0.02 })); // small finial block atop the crest
    // two small parapet end-piers (squared brick caps at the wall corners)
    for (const sx of [-1, 1]) {
      parts.push(box(0.2, 0.26, 0.22, BRICK_L, { x: sx * 0.96, y: 3.45, z: FZ - 0.04 }));
    }

    return finish(parts);
  },
};

export default NM_MIYAHARA;
