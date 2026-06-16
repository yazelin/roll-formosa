/**
 * @file packs/kaohsiung/landmarks/dagang_bridge.js — Roll Formosa Kaohsiung pack, hero LANDMARK.
 *
 * NM_DAGANG_BRIDGE — 大港橋 (Dagang Bridge), 真愛碼頭. Taiwan's first horizontal
 * SWING bridge: a long curved white pedestrian deck that pivots about one end to
 * open the harbour channel. The silhouette is a low, wide ARC of pale deck riding
 * on slim piers, with a single leaning pylon at the pivot end fanning a set of
 * white STAY CABLES (斜拉) down to the curved span — the unmistakable seaside
 * profile over 高雄港 真愛碼頭. Wide + low + curved, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so PROPORTIONS (a sweeping horizontal arc, a leaning mast,
 * radiating cables) carry the silhouette. <= 600 triangles (hero budget); rng()
 * only nudges the deck sheen so it is non-structural.
 */

import { box, cyl, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — pale rotating bridge over the harbour.
const DECK = 0xe6e8ee; // bright white deck plate (catches sea light)
const DECK_D = 0xc4c8d2; // cooler grey underside / shadow gradient
const RAIL = 0xf2f4f8; // near-white balustrade / rail
const PIER = 0xb6bcc6; // grey concrete pivot pier / piles
const MAST = 0xd0d4dc; // leaning steel pylon
const CABLE = 0xeef0f4; // pale stay cable
const DECK_GLINT = 0x9aa6b6; // cool tint nudge floor

export const NM_DAGANG_BRIDGE = {
  id: 'dagang_bridge',
  name: '大港橋',
  dioramaRHint: 150, // real swing span ~ 110 m long; harbour-scale footprint hint
  colorHex: 0xd8d8e0, // pale white-lilac of the curved deck

  buildGeometry(rng) {
    const tint = rng() < 0.5 ? 0x0 : 0x040608; // tiny per-instance deck-sheen nudge
    const deckHi = DECK - tint;
    const parts = [];

    // ---- 1) Curved white deck — a shallow horizontal ARC ------------------
    // The span is faked as a chord of short rotated deck segments stepping
    // around a gentle arc in the X-Z plane: each segment is yawed (ry) a little
    // so the chain reads as a sweeping curved walkway, low over the water.
    const nSeg = 7; // deck segments along the arc
    const segLen = 0.58; // length of one straight deck plank
    const segW = 0.30; // deck width
    const arcSpan = 1.1; // total yaw across the whole arc (radians)
    const radius = 1.55; // arc radius in the X-Z plane
    const deckY = 0.62; // deck height above the water line
    for (let i = 0; i < nSeg; i++) {
      const t = i / (nSeg - 1) - 0.5; // -0.5 .. 0.5 along the arc
      const a = t * arcSpan; // yaw of this segment
      const cx = Math.sin(a) * radius;
      const cz = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius; // bow the arc in Z
      // deck plate (thicker top read, cool underside via hex2 gradient — the
      // gradient alone reads as deck-over-shadow so no separate under-beam).
      parts.push(
        box(segLen, 0.10, segW, deckHi, { ry: a, x: cx, y: deckY, z: cz, hex2: DECK_D })
      );
      // outer balustrade lip (the white rail line that defines the sweep)
      parts.push(box(segLen, 0.05, 0.03, RAIL, { ry: a, x: cx, y: deckY + 0.08, z: cz + segW * 0.5 }));
      parts.push(box(segLen, 0.05, 0.03, RAIL, { ry: a, x: cx, y: deckY + 0.08, z: cz - segW * 0.5 }));
    }

    // ---- 2) Mid-span support piers / harbour piles ------------------------
    // A couple of slim grey piers drop from the deck to the water line.
    for (const pt of [-0.28, 0.16]) {
      const a = pt * arcSpan;
      const cx = Math.sin(a) * radius;
      const cz = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius;
      parts.push(cyl(0.06, 0.08, deckY, 6, PIER, { x: cx, y: deckY * 0.5, z: cz }));
    }

    // ---- 3) Pivot pier (the rotation drum at one end) ---------------------
    // The big round caisson the whole span swings about — at the +X arc end.
    const endA = 0.5 * arcSpan;
    const pivotX = Math.sin(endA) * radius;
    const pivotZ = (Math.cos(endA) - Math.cos(arcSpan * 0.5)) * radius;
    parts.push(cyl(0.24, 0.30, deckY + 0.02, 12, PIER, { x: pivotX, y: (deckY + 0.02) * 0.5, z: pivotZ })); // pivot drum
    parts.push(cyl(0.30, 0.34, 0.06, 12, DECK_D, { x: pivotX, y: 0.03, z: pivotZ })); // base ring on the water

    // ---- 4) Leaning pylon + radiating stay cables (斜拉) ------------------
    // A single white mast leans outward from the pivot end; pale cables fan
    // from its tip down to points along the curved deck — the cable-stay read.
    const mastBaseY = deckY + 0.05;
    const mastH = 1.05;
    const lean = 0.42; // outward lean (rz) of the mast
    parts.push(
      cyl(0.025, 0.05, mastH, 6, MAST, { rz: lean, x: pivotX - 0.08, y: mastBaseY + mastH * 0.5, z: pivotZ })
    );
    // mast tip position (account for the lean so cables anchor correctly)
    const tipX = pivotX - 0.08 - Math.sin(lean) * (mastH * 0.5);
    const tipY = mastBaseY + Math.cos(lean) * (mastH * 0.5) + mastH * 0.45;
    const tipZ = pivotZ;
    // fan of stay cables to deck anchor points stepping back along the arc
    for (let k = 0; k < 5; k++) {
      const t = 0.45 - k * 0.16; // anchor positions along the arc toward far end
      const a = t * arcSpan;
      const ax = Math.sin(a) * radius;
      const az = (Math.cos(a) - Math.cos(arcSpan * 0.5)) * radius;
      const ay = deckY + 0.08;
      const dx = ax - tipX;
      const dy = ay - tipY;
      const dz = az - tipZ;
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const midX = (tipX + ax) * 0.5;
      const midY = (tipY + ay) * 0.5;
      const midZ = (tipZ + az) * 0.5;
      // rotate a thin vertical cylinder to align with the cable direction.
      const rz = Math.atan2(dx, -dy); // tilt within X-Y
      const rx = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)); // tilt toward Z
      parts.push(cyl(0.008, 0.008, len, 3, CABLE, { rz, rx, x: midX, y: midY, z: midZ }));
    }
    // small mast-tip cap so the cable fan converges on a visible node
    parts.push(sph(0.04, MAST, { ws: 6, hs: 4, x: tipX, y: tipY, z: tipZ }));

    // ---- 5) Approach ramp pad at the far (non-pivot) deck end -------------
    const farA = -0.5 * arcSpan;
    const farX = Math.sin(farA) * radius;
    const farZ = (Math.cos(farA) - Math.cos(arcSpan * 0.5)) * radius;
    parts.push(box(0.5, 0.08, 0.42, DECK_GLINT, { ry: farA, x: farX - 0.1, y: deckY - 0.02, z: farZ }));

    return finish(parts);
  },
};

export default NM_DAGANG_BRIDGE;
