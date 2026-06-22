/**
 * @file packs/newtaipei/landmarks/lover_bridge.js — Roll Formosa New Taipei pack, GOAL LANDMARK.
 *
 * NM_LOVER_BRIDGE — 淡水漁人碼頭情人橋 (Tamsui Fisherman's Wharf Lover's Bridge).
 * A distinctive white cable-stayed pedestrian bridge: a long curved white deck
 * spanning over the harbor entrance, with a single tall leaning white mast at one
 * end and elegant stay cables fanning out to the curved span — the romantic
 * sunset viewing spot of 淡水漁人碼頭, glowing in pastel lights at night.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so PROPORTIONS (a sweeping horizontal arc, a tall leaning
 * mast, radiating cables) carry the silhouette. <= 600 triangles (hero budget);
 * rng() only nudges the deck sheen so it is non-structural.
 */

import { box, cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — romantic white bridge glowing at sunset/night.
const DECK = 0xf0f2f8;        // bright white deck plate
const DECK_D = 0xd8dce6;      // cooler grey underside
const RAIL = 0xffffff;        // pure white balustrade
const MAST = 0xf8faff;        // white steel mast (the signature tall mast)
const CABLE = 0xf0f4ff;       // pale cable lines
const PIER = 0xc4c8d0;        // grey concrete pier
const LIGHT_WARM = 0xffd080;  // warm accent light (sunset glow)
const LIGHT_PINK = 0xffb0c0;  // pink romantic LED accent

export const NM_LOVER_BRIDGE = {
  id: 'lover_bridge',
  name: '淡水漁人碼頭情人橋',
  dioramaRHint: 165, // real span ~165 m long
  colorHex: 0xf0f2ff, // pale white-lilac of the curved deck

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x020304; // tiny per-instance deck-sheen nudge
    const deckHi = DECK - tint;
    const parts = [];

    // ---- 1) Curved white deck — a graceful sweeping ARC ----------------
    // The span is faked as a chord of short rotated deck segments stepping
    // around a gentle arc in the X-Z plane: each segment is yawed (ry) a little
    // so the chain reads as a sweeping curved walkway over the harbor.
    const nSeg = 9; // deck segments along the arc
    const segLen = 0.48; // length of one straight deck plank
    const segW = 0.26; // deck width
    const arcSpan = 1.2; // total yaw across the whole arc (radians)
    const radius = 1.65; // arc radius in the X-Z plane
    const deckY = 0.42; // deck height above the water line
    for (let i = 0; i < nSeg; i++) {
      const t = i / (nSeg - 1) - 0.5; // -0.5 .. 0.5 along the arc
      const a = t * arcSpan; // yaw of this segment
      const cx = Math.sin(a) * radius;
      const cz = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius;
      // deck plate
      parts.push(
        box(segLen, 0.08, segW, deckHi, { ry: a, x: cx, y: deckY, z: cz, hex2: DECK_D })
      );
      // outer balustrade (the white rail line that defines the sweep)
      parts.push(box(segLen, 0.04, 0.02, RAIL, { ry: a, x: cx, y: deckY + 0.06, z: cz + segW * 0.48 }));
      parts.push(box(segLen, 0.04, 0.02, RAIL, { ry: a, x: cx, y: deckY + 0.06, z: cz - segW * 0.48 }));
    }

    // ---- 2) Support piers under the deck -----------------------------
    for (const pt of [-0.32, 0.0, 0.32]) {
      const a = pt * arcSpan;
      const cx = Math.sin(a) * radius;
      const cz = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius;
      parts.push(cyl(0.05, 0.06, deckY, 6, PIER, { x: cx, y: deckY * 0.5, z: cz }));
    }

    // ---- 3) The signature TALL LEANING MAST at one end ---------------
    // The Lover's Bridge has a distinctive tall white mast that leans outward.
    const endA = 0.5 * arcSpan;
    const mastBaseX = Math.sin(endA) * radius;
    const mastBaseZ = (Math.cos(endA) - Math.cos(arcSpan * 0.5)) * radius;
    const mastBaseY = deckY + 0.02;
    const mastH = 1.6; // tall mast, signature element
    const lean = 0.35; // outward lean
    // main mast column (tapered)
    parts.push(
      cyl(0.04, 0.08, mastH, 8, MAST, { rz: lean, x: mastBaseX - 0.05, y: mastBaseY + mastH * 0.5, z: mastBaseZ })
    );
    // mast tip position for cable attachment
    const tipX = mastBaseX - 0.05 - Math.sin(lean) * (mastH * 0.5);
    const tipY = mastBaseY + Math.cos(lean) * (mastH * 0.5) + mastH * 0.45;
    const tipZ = mastBaseZ;
    // small mast-tip cap
    parts.push(sph(0.05, MAST, { ws: 6, hs: 4, x: tipX, y: tipY, z: tipZ }));

    // ---- 4) Radiating stay cables from mast tip to deck --------------
    for (let k = 0; k < 7; k++) {
      const t = 0.46 - k * 0.14;
      const a = t * arcSpan;
      const ax = Math.sin(a) * radius;
      const az = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius;
      const ay = deckY + 0.06;
      const dx = ax - tipX;
      const dy = ay - tipY;
      const dz = az - tipZ;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const midX = (tipX + ax) * 0.5;
      const midY = (tipY + ay) * 0.5;
      const midZ = (tipZ + az) * 0.5;
      const rz = Math.atan2(dx, -dy);
      const rx = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy));
      parts.push(cyl(0.006, 0.006, len, 3, CABLE, { rz, rx, x: midX, y: midY, z: midZ }));
    }

    // ---- 5) Approach ramp pads at both ends --------------------------
    const farA = -0.5 * arcSpan;
    const farX = Math.sin(farA) * radius;
    const farZ = (Math.cos(farA) - Math.cos(arcSpan * 0.5)) * radius;
    parts.push(box(0.4, 0.06, 0.35, DECK_D, { ry: farA, x: farX - 0.08, y: deckY - 0.02, z: farZ }));
    parts.push(box(0.4, 0.06, 0.35, DECK_D, { ry: endA, x: mastBaseX + 0.1, y: deckY - 0.02, z: mastBaseZ }));

    // ---- 6) Romantic LED accent lights along the deck ----------------
    // Pink/warm lights that make the bridge glow at sunset/night.
    for (let i = 0; i < 5; i++) {
      const t = (i / 4 - 0.5) * 0.9;
      const a = t * arcSpan;
      const lx = Math.sin(a) * radius;
      const lz = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius;
      const color = i % 2 === 0 ? LIGHT_WARM : LIGHT_PINK;
      parts.push(sph(0.02, color, { ws: 4, hs: 3, x: lx, y: deckY + 0.1, z: lz }));
    }

    // ---- 7) Harbor water base hint ----------------------------------
    parts.push(cyl(0.8, 0.8, 0.02, 12, 0x2a4a6e, { y: 0.01 })); // water plane hint

    return finish(parts);
  },
};

export default NM_LOVER_BRIDGE;
