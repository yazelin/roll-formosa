/**
 * @file packs/taipei/collectibles/maokong_gondola.js — Roll Formosa Taipei pack.
 *
 * 貓空纜車 (Maokong Gondola) — collectibleId 10. A small hand-held cable-car
 * cabin the ball can roll up: a cute rounded-box cabin sitting on its own, with
 * a wraparound window band on all four sides, a slightly domed grey roof, a thin
 * hanger arm rising from the roof, and a hook/grip at the very top that would
 * clamp onto the cable. The arm + hook crowning the rounded cabin is the read.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (squat rounded cabin + tall thin
 * hanger arm) carry the silhouette, not absolute size.
 *
 * Palette: red cabin body (0xd24a3a) with a dark glass window band
 * (0x2b3a4a / sky-sheen 0x6fa8c8), pale-grey domed roof (0xcdd2d6), and a
 * metallic-grey hanger arm + hook (0x9aa1a6). rng only nudges window sheen +
 * a tiny cabin sway. <= 350 triangles.
 */

import { box, cyl, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

const CABIN = 0xd24a3a;       // red cabin body
const CABIN_DK = 0xb33828;    // body shading (gradient bottom)
const GLASS = 0x223240;       // dark window glass
const GLASS_SHEEN = 0x6fa8c8; // sky reflection on glass (top of gradient)
const ROOF = 0xcdd2d6;        // pale grey roof
const ROOF_DK = 0xa9b0b5;     // roof shading
const METAL = 0x9aa1a6;       // hanger arm + hook metal
const METAL_DK = 0x7a8186;    // darker metal accent
const FLOOR = 0x4a4f52;       // dark cabin underside

export const COL_GONDOLA = {
  id: 'maokong_gondola',
  name: '貓空纜車',
  collectibleId: 10,
  colorHex: CABIN, // red cabin — the body read color
  buildGeometry(rng) {
    const parts = [];

    // tiny deterministic variation: window sheen + faint cabin sway
    const sheen = GLASS_SHEEN; // keep concrete; rng only tweaks lean below
    const lean = (rng() - 0.5) * 0.06; // small rocking lean (radians)

    // cabin footprint (squat rounded box) — half extents
    const W = 0.62, H = 0.66, D = 0.5;

    // =================================================================
    // CABIN BODY — rounded box read: a core box flanked by rounded
    // edge cylinders + corner spheres so the silhouette is soft, not boxy.
    // =================================================================
    const bodyY = 0.0; // cabin centered near origin; arm extends up

    // core body block (red): two crossed boxes give chamfered (octagon-ish)
    // corners cheaply, so the cabin reads rounded without corner cylinders.
    parts.push(box(W * 2, H * 2, D * 2 - 0.2, CABIN, { y: bodyY, hex2: CABIN_DK }));
    parts.push(box(W * 2 - 0.2, H * 2, D * 2, CABIN, { y: bodyY, hex2: CABIN_DK }));

    // dark cabin floor underside
    parts.push(box(W * 2 - 0.16, 0.1, D * 2 - 0.16, FLOOR, { y: -H + 0.04 }));

    // =================================================================
    // WINDOW BAND — wraparound dark glass on all four faces, the
    // signature "panorama cabin" read, with a sky sheen gradient.
    // =================================================================
    const winY = bodyY + 0.05;
    const winH = H * 1.05;
    // front + back glass panels
    for (const szn of [-1, 1]) {
      parts.push(box(W * 2 - 0.28, winH, 0.04, GLASS, {
        z: szn * (D + 0.005), y: winY, hex2: sheen,
      }));
    }
    // left + right glass panels
    for (const sxn of [-1, 1]) {
      parts.push(box(0.04, winH, D * 2 - 0.28, GLASS, {
        x: sxn * (W + 0.005), y: winY, hex2: sheen,
      }));
    }
    // thin red window-frame lip running around the cabin below the glass (sill),
    // a single wrap band (one box) so it reads as a panorama-window sill cheaply.
    parts.push(box(W * 2 - 0.06, 0.07, D * 2 - 0.06, CABIN, { y: winY - winH / 2 - 0.03 }));

    // =================================================================
    // ROOF — pale grey, gently domed, with a thin grey eave rim that
    // overhangs the body so the cabin reads as "capped".
    // =================================================================
    const roofBaseY = H + 0.02;
    // eave rim (flat overhanging slab)
    parts.push(box(W * 2 + 0.12, 0.08, D * 2 + 0.12, ROOF_DK, { y: roofBaseY }));
    // domed roof — a shallow wide hemisphere flattened in Y (low seg)
    parts.push(sph(1.0, ROOF, {
      sx: W + 0.02, sy: 0.34, sz: D + 0.02,
      y: roofBaseY + 0.02, hex2: ROOF, ws: 8, hs: 2, thetaLen: HALF_PI,
    }));
    // small roof crown disc where the arm meets the roof (open cyl)
    parts.push(cyl(0.13, 0.16, 0.06, 6, ROOF_DK, { open: true, y: roofBaseY + 0.18 }));

    // =================================================================
    // HANGER ARM + HOOK — thin metal arm rising from the roof, bending
    // to a clamp/hook at the top that grips the cable. The crowning read.
    // (whole arm given the small rng lean about Z for a hand-held tilt)
    // =================================================================
    const armBaseY = roofBaseY + 0.2;
    // vertical arm shaft
    parts.push(cyl(0.05, 0.06, 0.62, 6, METAL, { y: armBaseY + 0.31, rz: lean }));
    // small collar at base of arm
    parts.push(cyl(0.09, 0.1, 0.05, 6, METAL_DK, { y: armBaseY + 0.03, rz: lean }));
    // arm top hub
    const hubY = armBaseY + 0.62;
    parts.push(sph(0.1, METAL, { y: hubY, sx: 1, sy: 0.9, sz: 1, ws: 6, hs: 4 }));

    // grip/clamp body (small block hugging the cable line) atop the hub
    parts.push(box(0.26, 0.12, 0.14, METAL_DK, { y: hubY + 0.1 }));

    // the HOOK: an open torus arc opening upward, sitting on the clamp,
    // so it reads as hooking over the (absent) cable.
    parts.push(torus(0.13, 0.04, 5, 8, METAL, {
      y: hubY + 0.24, rx: HALF_PI, ry: 0, arc: PI * 1.25, rz: -PI * 0.62,
    }));
    // tiny cable stub hint through the hook (light grey), horizontal
    parts.push(cyl(0.022, 0.022, 0.5, 4, 0xc4c9cc, { y: hubY + 0.3, rz: HALF_PI }));

    return finish(parts);
  },
};

export default COL_GONDOLA;
