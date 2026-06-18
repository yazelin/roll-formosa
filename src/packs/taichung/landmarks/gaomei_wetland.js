/**
 * @file packs/taichung/landmarks/gaomei_wetland.js — Roll Formosa Taichung pack, hero LANDMARK.
 *
 * NM_GAOMEI_WETLAND — 高美濕地 (Gaomei Wetland, 清水區). The seaside read is the
 * iconic slender WHITE WIND TURBINE standing over the tidal mudflat: one tall,
 * gently tapered white tower (NO rotation) carrying a small nacelle hub at its
 * very top, and EXACTLY THREE long thin white blades that all originate AT the
 * hub centre and fan 120° apart in the camera-facing X-Y rotor plane. At its
 * foot run a few low wooden boardwalk planks (the famous 木棧道) over a thin
 * sheet of reflective blue wetland water. Tall + slender + three-bladed so the
 * turbine silhouette reads instantly against the 台中海線 horizon.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the geometry
 * math is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so this is authored with the correct PROPORTIONS
 * (a thin tower roughly as tall as one blade is long, a tiny nacelle, a low
 * boardwalk) — absolute size is owned by the integration size-ladder.
 * <= 600 triangles (hero budget); rng() only nudges the rotor roll + water
 * sheen so it is non-structural (blade COUNT/spacing stay fixed: always 3 @ 120°).
 */

import { box, cyl, finish, PI } from '../geomHelpers.js'; // import only what we use

// Palette — coastal wind turbine over a tidal wetland.
const WHITE = 0xeef0f2; // signature off-white turbine tower / blades
const WHITE_D = 0xd6dade; // cool shaded band (vertical gradient bottom) on the tower
const NACELLE = 0xe2e6ea; // pale grey nacelle / hub housing
const NACELLE_D = 0xbcc2c8; // shadow side of the nacelle
const WOOD = 0x8a6b45; // weathered timber boardwalk planks
const WOOD_D = 0x6f5436; // darker plank underside (gradient shadow)
const WATER = 0x4a7fa6; // blue reflective tidal-flat water sheet
const WATER_D = 0x3a6589; // deeper blue channel in the mud (gradient bottom)

export const NM_GAOMEI_WETLAND = {
  id: 'gaomei_wetland',
  name: '高美濕地',
  landmarkId: 7,
  dioramaRHint: 90, // turbine + boardwalk footprint hint in metres (海濱地標)
  colorHex: 0xeef0f2, // the turbine's signature off-white

  buildGeometry(rng) {
    // Non-structural per-instance nudges only: a tiny rotor roll + faint water
    // sheen shift. Blade COUNT/spacing stay fixed (always 3 @ 120°).
    const roll = (rng() - 0.5) * 0.10; // small rotor roll so instances differ
    const waterTint = rng() < 0.5 ? 0x0 : 0x040608; // faint water-sheen nudge

    const parts = [];

    // ===================================================================
    // 1) BLUE WETLAND WATER PAD + WOODEN BOARDWALK (木棧道) — low base read
    // ===================================================================
    // A low wide flat blue sheet the turbine and walkway sit on, with a deeper
    // blue channel implied by the vertical gradient.
    parts.push(box(2.4, 0.05, 1.7, WATER - waterTint, { y: 0.025, hex2: WATER_D })); // wetland water slab

    // Boardwalk: a short run of low timber planks stepping across the water
    // toward the turbine base — the signature 木棧道.
    const walkX0 = -0.92; // walkway starts near the near edge
    const plankY = 0.10;  // deck height above the water sheet
    const nPlank = 5;
    const plankStep = 0.34;
    for (let i = 0; i < nPlank; i++) {
      const px = walkX0 + i * plankStep; // step the planks along +X toward the tower
      parts.push(box(0.30, 0.05, 0.46, WOOD, { x: px, y: plankY, z: 0.18, hex2: WOOD_D })); // deck plank
    }

    // ===================================================================
    // 2) SLENDER TAPERED WHITE TOWER — the dominant vertical element
    // ===================================================================
    // Narrower at the top (rTop < rBot) so it reads as a real turbine mast.
    // Stands perfectly upright — NO rotation on the tower.
    const towerH = 2.3;
    const towerBaseY = 0.07; // sits on the water slab
    const towerX = 0.55;     // turbine stands at the +X end (boardwalk leads to it)
    const towerY = towerBaseY + towerH / 2;
    const towerTopY = towerBaseY + towerH;
    parts.push(cyl(0.05, 0.075, towerH, 12, WHITE, { x: towerX, y: towerY, hex2: WHITE })); // tapered white mast
    parts.push(cyl(0.075, 0.12, 0.16, 12, WHITE_D, { x: towerX, y: towerBaseY + 0.08, hex2: WHITE })); // base flange

    // ===================================================================
    // 3) NACELLE / HUB — a small box at the VERY TOP, on the tower axis
    // ===================================================================
    // This is the hub: a small white/grey box centred on the tower axis where
    // all three blades meet. Its long axis runs along Z (front-to-back of the
    // machine) so the rotor plane faces the camera (+Z).
    const hubX = towerX;
    const hubY = towerTopY + 0.05;
    const hubZ = 0.12; // a touch in front of the tower, so the rotor faces +Z
    parts.push(box(0.15, 0.14, 0.30, NACELLE, { x: hubX, y: hubY, z: hubZ - 0.05, hex2: NACELLE_D })); // nacelle hub box

    // ===================================================================
    // 4) THREE LONG THIN BLADES — all originating AT the hub centre
    // ===================================================================
    // Each blade is a long thin tapered box authored along +Y (its long axis).
    // To guarantee the inner end sits EXACTLY at the hub: a Y-long box rotated
    // by rz=a has its +Y axis mapped to dir = (-sin a, cos a). We place the box
    // CENTRE at hub + dir * (L/2) so the box spans hub → hub + dir*L, i.e. the
    // inner tip is pinned at the hub and the blade radiates outward. With a =
    // 0, 120°, 240° (+ tiny roll) the three blades meet cleanly at the hub and
    // form one recognizable 3-blade rotor — no stray detached sticks.
    const bladeLen = 1.75;       // long blade — about tower height
    const bladeW = 0.085;        // slim chord — thin blade
    const bladeZ = hubZ + 0.08;  // blades ride just in front of the hub face
    const half = bladeLen / 2;
    for (let i = 0; i < 3; i++) {
      const a = roll + i * (PI * 2 / 3); // 0°, 120°, 240° + tiny non-structural roll
      const dx = -Math.sin(a);           // unit outward direction (+Y under rz=a)
      const dy = Math.cos(a);
      parts.push(box(bladeW, bladeLen, 0.03, WHITE, {
        rz: a,
        x: hubX + dx * half, // centre offset by L/2 along the blade's long axis
        y: hubY + dy * half, //   → inner tip lands EXACTLY on the hub
        z: bladeZ,
        hex2: WHITE_D, // faint tip-ward shading via the box's local-Y gradient
      })); // blade i — inner end pinned at the hub, radiating outward
    }

    return finish(parts);
  },
};

export default NM_GAOMEI_WETLAND;
