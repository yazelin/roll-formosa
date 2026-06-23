/**
 * @file packs/changhua/landmarks/baguashan_buddha.js — Roll Formosa hero landmark.
 *
 * NM_BAGUASHAN_BUDDHA — 八卦山大佛, THE GOAL MONUMENT for 彰化.
 * The iconic 22.5m seated Amitabha Buddha statue atop Bagua Mountain (八卦山),
 * built in 1961. The statue sits in lotus position on a two-tiered octagonal
 * lotus pedestal, with a black perm-like hair (螺髮) topknot, serene face,
 * and flowing robes. Hands rest in a meditation mudra on the lap.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * silhouette. <= 600 triangles (hero budget).
 */

import { cyl, box, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// 八卦山大佛 color palette — golden Buddha with dark hair and stone pedestal
const GOLD_BODY = 0xd4a84b;    // golden bronze body
const GOLD_ROBE = 0xc49a3a;    // slightly darker robe folds
const GOLD_FACE = 0xe8c06a;    // lighter face / hands
const HAIR_BLACK = 0x1a1a1a;  // black perm-style hair (螺髮)
const PEDESTAL_STONE = 0x9a8a78; // pale stone lotus pedestal
const PEDESTAL_DARK = 0x706050; // darker stone tiers

export const NM_BAGUASHAN_BUDDHA = {
  id: 'baguashan_buddha',
  name: '八卦山大佛',
  landmarkId: 8,
  dioramaRHint: 22.5, // real height ≈ 22.5 m (Buddha statue)
  colorHex: GOLD_BODY,

  buildGeometry(rng) {
    const parts = [];

    // ---- 1) Two-tier octagonal lotus pedestal -----------------------------
    // Lower tier — wide octagonal platform
    parts.push(cyl(1.2, 1.3, 0.25, 8, PEDESTAL_DARK, { y: 0.125 }));
    // Upper tier — slightly narrower
    parts.push(cyl(1.0, 1.1, 0.22, 8, PEDESTAL_STONE, { y: 0.36 }));
    // Lotus ring detail on pedestal top
    parts.push(cyl(0.92, 0.95, 0.08, 8, PEDESTAL_DARK, { y: 0.51 }));

    // ---- 2) Seated Buddha body (lotus position) ---------------------------
    const bodyBase = 0.55; // y where the body starts

    // Crossed legs (lotus sitting posture) — wide base
    parts.push(cyl(0.72, 0.75, 0.30, 12, GOLD_ROBE, { y: bodyBase + 0.15 }));
    // Robe draping over knees
    parts.push(cyl(0.68, 0.72, 0.18, 12, GOLD_ROBE, { y: bodyBase + 0.39 }));

    // Torso — slightly tapered upward
    const torsoBot = bodyBase + 0.48;
    parts.push(cyl(0.42, 0.52, 0.70, 10, GOLD_BODY, { y: torsoBot + 0.35 }));

    // Shoulders — widening at the top
    const shoulderY = torsoBot + 0.70;
    parts.push(cyl(0.50, 0.42, 0.25, 10, GOLD_BODY, { y: shoulderY + 0.125 }));

    // Arms resting on lap (meditation pose, simplified)
    // Left arm
    parts.push(cyl(0.12, 0.10, 0.35, 6, GOLD_BODY, {
      x: -0.38, y: bodyBase + 0.50, rz: 0.4,
    }));
    // Right arm
    parts.push(cyl(0.12, 0.10, 0.35, 6, GOLD_BODY, {
      x: 0.38, y: bodyBase + 0.50, rz: -0.4,
    }));
    // Hands together in lap (Dhyana mudra)
    parts.push(sph(0.18, GOLD_FACE, { ws: 8, hs: 5, y: bodyBase + 0.42, z: 0.20 }));

    // ---- 3) Head and face -------------------------------------------------
    const headY = shoulderY + 0.38;

    // Neck
    parts.push(cyl(0.16, 0.18, 0.15, 8, GOLD_FACE, { y: headY - 0.08 }));

    // Head (slightly elongated sphere)
    parts.push(sph(0.28, GOLD_FACE, { ws: 10, hs: 8, y: headY + 0.14, scaleY: 1.15 }));

    // Ears (Buddha's long earlobes)
    parts.push(sph(0.08, GOLD_FACE, { ws: 5, hs: 4, x: -0.26, y: headY + 0.10 }));
    parts.push(sph(0.08, GOLD_FACE, { ws: 5, hs: 4, x: 0.26, y: headY + 0.10 }));

    // ---- 4) Hair (螺髮 perm-style topknot) --------------------------------
    // The distinctive black curly hair pattern
    parts.push(sph(0.24, HAIR_BLACK, { ws: 8, hs: 6, y: headY + 0.32 }));
    // Ushnisha (頂髻, crown protrusion)
    parts.push(sph(0.12, HAIR_BLACK, { ws: 6, hs: 5, y: headY + 0.52 }));

    // ---- 5) Robe details --------------------------------------------------
    // Collar fold detail
    parts.push(cyl(0.48, 0.46, 0.06, 10, GOLD_ROBE, { y: shoulderY - 0.05 }));

    return finish(parts);
  },
};

export default NM_BAGUASHAN_BUDDHA;
