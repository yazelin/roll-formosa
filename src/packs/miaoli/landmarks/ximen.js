/**
 * @file packs/taipei/landmarks/ximen.js — Roll Formosa Taipei pack landmark.
 *
 * 西門紅樓 (Ximen Red House) — the 1908 octagonal two-story red-brick market
 * hall by 西門町. Authored ONLY with the engine geometry vocabulary
 * (geomHelpers.js): primitives → finish() merges, recenters and normalizes to
 * a UNIT bounding sphere (radius 1). We author proportions/silhouette in
 * unit-ish space; the integration layer drops it onto the ground.
 *
 * Silhouette to read at a glance: a DISTINCT OCTAGON footprint (八角樓), wide +
 * low (a hall, not a tower), red brick walls with a white string-course band
 * between the two floors, arched windows recessed on each of the eight faces,
 * and a low grey roof crowned by a small central cross-gable cupola.
 */

import { cyl, box, cone, finish, PI } from '../geomHelpers.js';

const RED = 0x9e3b2f; // brick red walls
const RED_DK = 0x7e2c22; // shaded brick (gradient base)
const TRIM = 0xe8e0d4; // off-white string course / arch trim
const ROOF = 0x6a6e72; // grey roof
const ROOF_DK = 0x4e5256; // grey roof shade
const GLASS = 0x3a4450; // dark recessed window glass

// Octagon geometry: an 8-sided cylinder. Apothem (flat-face center distance)
// for circumradius R is R*cos(PI/8). Rotate so a flat face points toward +Z.
const R = 1.0; // body circumradius (unit-ish)
const FACE_ROT = PI / 8; // align flat faces to the cardinal directions
const APOTHEM = R * Math.cos(PI / 8);

/** @typedef {import('three').BufferGeometry} BufferGeometry */

export const NM_XIMEN = {
  id: 'ximen_redhouse',
  name: '西門紅樓',
  landmarkId: 2,
  dioramaRHint: 24, // octagon hall ~24 m across (integration may override)
  colorHex: RED,

  /**
   * @param {() => number} rng Boot rng (tiny variation only, never structure).
   * @returns {BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // ---- octagonal two-story brick body (wide + low) ----
    // Vertical gradient (RED_DK base -> RED top) gives the brick subtle depth
    // and lets the octagon corners read without a second drum.
    const BODY_H = 1.05;
    parts.push(
      cyl(R, R, BODY_H, 8, RED_DK, { ry: FACE_ROT, y: BODY_H / 2, hex2: RED }) // floor 1+2 brick drum
    );

    // ---- white string-course band between the two floors ----
    parts.push(cyl(R * 1.03, R * 1.03, 0.08, 8, TRIM, { ry: FACE_ROT, y: BODY_H * 0.5, open: true }));
    // base plinth + top cornice (also white trim) to frame the brick
    parts.push(cyl(R * 1.05, R * 1.06, 0.1, 8, TRIM, { ry: FACE_ROT, y: 0.05, open: true }));
    parts.push(cyl(R * 1.04, R * 1.04, 0.09, 8, TRIM, { ry: FACE_ROT, y: BODY_H - 0.02, open: true }));

    // ---- arched windows recessed on each of the 8 faces, 2 floors ----
    // One window per face per floor; an arch cap (half-disc) sits on a panel.
    const WINW = 0.32;
    const PANEL_H = 0.34;
    const ARCH_R = WINW * 0.55;
    const floorsY = [BODY_H * 0.27, BODY_H * 0.74];
    for (let f = 0; f < 8; f++) {
      const ang = FACE_ROT + (f * PI) / 4; // face outward normal angle
      const nx = Math.sin(ang);
      const nz = Math.cos(ang);
      const px = nx * (APOTHEM + 0.02);
      const pz = nz * (APOTHEM + 0.02);
      for (let fl = 0; fl < 2; fl++) {
        const wy = floorsY[fl];
        // recessed dark glass panel (rotate to lie flat against the face)
        parts.push(
          box(WINW, PANEL_H, 0.05, GLASS, { ry: ang, x: px, y: wy, z: pz })
        );
        // semicircular arch cap above the panel (half-cylinder, low seg, open
        // ends to keep the tri budget down — only the curved shell is needed).
        parts.push(
          cyl(ARCH_R, ARCH_R, 0.05, 4, TRIM, {
            rx: PI / 2, ry: ang, theta0: 0, thetaLen: PI, open: true,
            x: px, y: wy + PANEL_H / 2, z: pz,
          })
        );
      }
    }

    // ---- low grey octagonal roof ----
    const ROOF_H = 0.5;
    parts.push(
      cone(R * 1.07, ROOF_H, 8, ROOF, { ry: FACE_ROT, y: BODY_H + ROOF_H / 2, hex2: ROOF_DK })
    );

    // ---- central cross-gable cupola (the rooftop crucifix-shaped lantern) ----
    const CUP_Y = BODY_H + ROOF_H + 0.12;
    // small octagon base of the cupola
    parts.push(cyl(0.26, 0.3, 0.18, 8, RED, { ry: FACE_ROT, y: BODY_H + ROOF_H - 0.02 }));
    // cross-gable: two intersecting low gable bars (read as the 十字 cross roof)
    parts.push(box(0.62, 0.16, 0.2, ROOF, { y: CUP_Y, hex2: ROOF_DK }));
    parts.push(box(0.2, 0.16, 0.62, ROOF, { y: CUP_Y, hex2: ROOF_DK }));
    // tiny finial spire on top
    parts.push(cone(0.07, 0.22, 6, TRIM, { y: CUP_Y + 0.18 }));
    // micro jitter on finial height so a row of them isn't identical
    if (rng) parts[parts.length - 1].translate(0, (rng() - 0.5) * 0.02, 0);

    return finish(parts);
  },
};

export default NM_XIMEN;
