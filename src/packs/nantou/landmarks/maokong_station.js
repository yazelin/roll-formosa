/**
 * @file packs/taipei/landmarks/maokong_station.js — Roll Formosa Taipei pack.
 *
 * 貓空纜車站 (Maokong Gondola station) — the hillside cable-car station above
 * 木柵 / 貓空. Silhouette: a low station building seated on a green hillside
 * wedge, with a single-pitch SLANTED roof, a tall support MAST / cable arm
 * rising beside it, twin CABLE lines running off downhill, and one boxy
 * GONDOLA CABIN hanging from the cable on a hanger arm. Station + cable read.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so the recipe is authored in unit-ish space and
 * the silhouette (slope + slanted-roof station + mast + cable + hanging cabin)
 * carries the read. <= 600 triangles (hero budget). rng() only nudges cabin tint.
 *
 * Palette: green hillside (0x4f7a3a) + cream/concrete station (0xe7e0d2) with a
 * teal slanted roof (0x3f8a86), dark-grey steel mast & cables (0x55606a), and a
 * red gondola cabin (0xd23b34) — the hanging cabin is the eye-catch.
 */

import { box, cyl, cone, sph, torus, finish, PI, HALF_PI } from '../geomHelpers.js';

/* Concrete hexes (not tinted). */
const HILL = 0x4f7a3a;     // green hillside
const HILL_DK = 0x3c5f2c;  // shaded slope
const STN_BODY = 0xe7e0d2; // cream station walls
const STN_BASE = 0xb7b1a2; // concrete podium
const ROOF = 0x3f8a86;     // teal slanted roof
const ROOF_LIP = 0x2f6c69; // roof edge shadow
const GLASS = 0x7fb8d4;    // station window strip
const STEEL = 0x55606a;    // mast + cable steel
const STEEL_LT = 0x79838c;
const CABLE = 0x42484f;    // cable lines (dark)
const CABIN = 0xd23b34;    // red gondola cabin
const CABIN_RF = 0x9c2a24; // cabin roof
const CABIN_GL = 0xbfe2ef; // cabin glazing

export const NM_MK_STATION = {
  id: 'maokong_station',
  name: '貓空纜車站',
  colorHex: 0xd23b34, // red gondola cabin — the eye-catch read color

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x080404; // tiny per-instance cabin tint nudge
    const cabin = CABIN - tint;

    const parts = [];

    // ===================================================================
    // HILLSIDE WEDGE — the slope the station perches on (slants up to +X)
    // ===================================================================
    // A box sheared into a ramp by scaling a 4-sided cone is overkill; instead a
    // wide flat box gives the ground, and a triangular prism (rotated thin box
    // ... use a cone with 3 facets gives messy normals) — use a box tilted.
    parts.push(box(3.4, 0.5, 2.0, HILL_DK, { y: -0.95, hex2: HILL })); // buried base
    // sloped grass deck: a thin wide box tilted so the terrain rises toward +X
    parts.push(box(3.6, 0.34, 2.1, HILL, { rz: -0.22, y: -0.5, hex2: 0x5c8a45 }));
    // a couple of darker terrace steps cut into the slope (retaining walls)
    parts.push(box(3.5, 0.16, 2.0, HILL_DK, { rz: -0.22, x: 0.1, y: -0.74 }));

    // ===================================================================
    // STATION BUILDING — low cream body on a concrete podium, sits up-slope
    // ===================================================================
    const stnX = 0.62, stnY = -0.02;
    parts.push(box(1.9, 0.22, 1.6, STN_BASE, { x: stnX, y: stnY - 0.5 })); // podium
    const bodyH = 0.96;
    parts.push(box(1.78, bodyH, 1.42, STN_BODY, { x: stnX, y: stnY, hex2: 0xf2ecdf }));
    // continuous window strip (the boarding hall glazing) on the down-slope face
    parts.push(box(1.66, 0.4, 0.06, GLASS, { x: stnX, y: stnY + 0.08, z: 0.72, hex2: 0xaee0f4 }));
    parts.push(box(1.66, 0.4, 0.06, GLASS, { x: stnX, y: stnY + 0.08, z: -0.72, hex2: 0xaee0f4 }));

    // --- SLANTED single-pitch roof: a thin box tilted across the body ---
    const roofY = stnY + bodyH / 2 + 0.18;
    parts.push(box(2.06, 0.12, 1.7, ROOF, { rz: -0.3, x: stnX, y: roofY + 0.05, hex2: 0x4fa39e }));
    parts.push(box(2.1, 0.05, 1.74, ROOF_LIP, { rz: -0.3, x: stnX, y: roofY - 0.04 })); // eave shadow lip

    // ===================================================================
    // CABLE ARM / MAST — tall steel support beside the station (down-slope)
    // ===================================================================
    const mastX = -0.85, mastTop = 1.62;
    parts.push(cyl(0.07, 0.11, 2.5, 7, STEEL, { x: mastX, y: 0.35, hex2: STEEL_LT })); // main mast pole
    parts.push(box(0.16, 0.16, 0.16, STEEL_LT, { x: mastX, y: mastTop })); // mast head block
    // the cable ARM cantilevering out over the cabin track
    parts.push(box(0.9, 0.1, 0.12, STEEL_LT, { x: mastX + 0.42, y: mastTop + 0.06 }));
    parts.push(cyl(0.05, 0.07, 0.5, 6, STEEL, { rz: -0.5, x: mastX - 0.18, y: mastTop - 0.28 })); // back stay
    // small support tower foot
    parts.push(box(0.3, 0.18, 0.3, STN_BASE, { x: mastX, y: -0.78 }));

    // ===================================================================
    // CABLE LINES — twin lines running off down-slope (the gondola track)
    // ===================================================================
    // Carrier cable: a long thin cylinder angled down toward -X (down the hill),
    // anchored at the mast arm. Two parallel lines (haul + carry).
    const armEnd = { x: mastX + 0.85, y: mastTop + 0.06 };
    // line running OUT past the cabin and off the down-slope edge
    parts.push(cyl(0.022, 0.022, 3.5, 4, CABLE, { rz: 0.16, x: armEnd.x - 1.55, y: armEnd.y - 0.28 }));
    parts.push(cyl(0.022, 0.022, 3.5, 4, CABLE, { rz: 0.16, x: armEnd.x - 1.55, y: armEnd.y - 0.16 }));
    // short up-slope line span toward the station roof (continuing the route)
    parts.push(cyl(0.022, 0.022, 1.7, 4, CABLE, { rz: -0.18, x: mastX + 0.95, y: mastTop + 0.18 }));

    // ===================================================================
    // GONDOLA CABIN — boxy red car hanging from the cable on a hanger arm
    // ===================================================================
    const cabX = armEnd.x - 0.55, cabHangY = armEnd.y - 0.12;
    // hanger: thin steel arm from the cable down to the cabin roof
    parts.push(cyl(0.03, 0.03, 0.42, 5, STEEL, { x: cabX, y: cabHangY - 0.18 }));
    parts.push(torus(0.05, 0.018, 4, 8, STEEL_LT, { rx: HALF_PI, x: cabX, y: cabHangY })); // grip wheel on cable
    // cabin body (rounded-ish box) — the hero hanging car
    const cabY = cabHangY - 0.62;
    parts.push(box(0.5, 0.56, 0.46, cabin, { x: cabX, y: cabY, hex2: 0xe85d3d }));
    parts.push(box(0.52, 0.1, 0.48, CABIN_RF, { x: cabX, y: cabY + 0.32 })); // cabin roof cap
    parts.push(box(0.06, 0.5, 0.4, CABIN_RF, { x: cabX, y: cabY + 0.24 })); // top hanger bracket
    // cabin windows (glazing band wrapping front/back)
    parts.push(box(0.42, 0.3, 0.02, CABIN_GL, { x: cabX, y: cabY + 0.04, z: 0.24 }));
    parts.push(box(0.42, 0.3, 0.02, CABIN_GL, { x: cabX, y: cabY + 0.04, z: -0.24 }));
    parts.push(box(0.02, 0.3, 0.36, CABIN_GL, { x: cabX + 0.26, y: cabY + 0.04 }));

    return finish(parts);
  },
};

export default NM_MK_STATION;
