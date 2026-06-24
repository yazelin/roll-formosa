/**
 * @file packs/penghu/collectibles/youbike.js — Roll Formosa Penghu pack, collectible 8.
 *
 * COL_SEA_URCHIN — 海膽 (sea urchin). A prized Penghu delicacy, the spiny
 * sea urchin is harvested from the clear waters around the islands. Silhouette:
 * a round spiny ball with radiating spines all around, sitting on its base.
 * The deep purple-black body with lighter spine tips is the signature read.
 * Often displayed whole or with the top cut open to show the golden roe inside.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges -> recenters -> normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read, not absolute size:
 * a spherical body with radiating spines.
 *
 * Palette: deep purple-black body, lighter purple spine tips, golden roe visible
 * on top if cut open. rng() is used only for a hair of spine angle variation.
 */

import { cyl, sph, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const BODY = 0x2a1a30;       // deep purple-black body
const BODY_HI = 0x3a2a42;    // lighter body highlight
const SPINE = 0x4a3a58;      // purple-grey spine base
const SPINE_TIP = 0x6a5a78;  // lighter spine tips
const ROE = 0xe8a830;        // golden sea urchin roe
const ROE_DK = 0xc88820;     // darker roe shadow
const SHELL = 0x1a0a1a;      // dark shell interior

export const COL_SEA_URCHIN = {
  id: 'sea_urchin',
  name: '海膽',
  collectibleId: 8,
  colorHex: BODY,

  buildGeometry(rng) {
    const parts = [];

    // === MAIN BODY (spherical shell) =========================================
    parts.push(sph(0.65, BODY, { ws: 6, hs: 4, y: 0.0, hex2: BODY_HI }));

    // Cut-open top showing interior
    parts.push(cyl(0.35, 0.35, 0.15, 6, SHELL, { y: 0.55 }));

    // === GOLDEN ROE (visible inside - simplified) ============================
    parts.push(sph(0.25, ROE, { ws: 4, hs: 3, sy: 0.5, y: 0.52, hex2: ROE_DK }));

    // === SPINES (radiating outward - reduced count) ==========================
    // Upper spines
    const upperCount = 6;
    for (let i = 0; i < upperCount; i++) {
      const angle = (i / upperCount) * PI * 2;
      parts.push(cone(0.03, 0.35, 3, SPINE, {
        x: Math.cos(angle) * 0.38,
        y: 0.45,
        z: Math.sin(angle) * 0.38,
        rx: Math.cos(angle) * 0.4,
        rz: -Math.sin(angle) * 0.4,
        hex2: SPINE_TIP
      }));
    }

    // Middle row spines (equator)
    const midCount = 8;
    for (let i = 0; i < midCount; i++) {
      const angle = (i / midCount) * PI * 2;
      parts.push(cone(0.035, 0.4, 3, SPINE, {
        x: Math.cos(angle) * 0.62,
        y: 0.0,
        z: Math.sin(angle) * 0.62,
        rx: Math.cos(angle) * 0.8,
        rz: -Math.sin(angle) * 0.8,
        hex2: SPINE_TIP
      }));
    }

    // Lower row spines
    const lowerCount = 6;
    for (let i = 0; i < lowerCount; i++) {
      const angle = (i / lowerCount) * PI * 2;
      parts.push(cone(0.03, 0.32, 3, SPINE, {
        x: Math.cos(angle) * 0.5,
        y: -0.35,
        z: Math.sin(angle) * 0.5,
        rx: Math.cos(angle) * 1.2,
        rz: -Math.sin(angle) * 1.2,
        hex2: SPINE_TIP
      }));
    }

    return finish(parts);
  },
};

// Backward compatibility export
export const COL_YOUBIKE = COL_SEA_URCHIN;

export default COL_SEA_URCHIN;
