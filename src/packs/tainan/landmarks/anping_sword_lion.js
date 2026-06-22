/**
 * @file packs/tainan/landmarks/anping_sword_lion.js — Roll Formosa Tainan pack, landmark 0.
 *
 * 安平劍獅 — the Anping sword-lion talisman, a fierce guardian plaque hung over
 * doorways in the old Anping alleys to ward off evil. Silhouette: a square
 * brick/stone plaque backing carries a round, scowling LION face (sphere head +
 * heavy box brow + two round eyes + a bared-teeth snarling mouth) that BITES a
 * long horizontal SWORD clean across its jaws — a thin blade with a small hilt
 * and pommel jutting out to one side. It is the SMALLEST landmark (landmarkId 0),
 * so it reads as a flat wall plaque, never a building.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions carry the read: a flat plaque with
 * a bulging lion face and a sword crossing it. rng() is used only for a hair of
 * jitter — never for structure.
 *
 * Palette: warm ochre/terracotta lion + brick plaque, dark details (eyes, brow,
 * teeth gaps), steel sword blade.
 */

import { box, cyl, cone, sph, ico, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const OCHRE = 0xc77b4a; // warm terracotta lion face
const OCHRE_L = 0xd99a6a; // sunlit ochre highlight (mane / cheeks)
const OCHRE_D = 0x9c5a32; // shadowed ochre (recesses)
const BRICK = 0xa86a44; // brick/stone plaque backing
const BRICK_L = 0xc08a5e; // lit brick edge
const DARK = 0x2b211a; // near-black details (eyes, mouth void, brow)
const TEETH = 0xefe7d6; // bared ivory teeth
const STEEL = 0x9aa4ad; // sword blade
const STEEL_L = 0xc4ccd2; // blade highlight
const HILT = 0x6e4a36; // sword hilt timber

export const NM_SWORD_LION = {
  id: 'anping_sword_lion',
  name: '安平劍獅',
  landmarkId: 0,
  dioramaRHint: 11, // a flat wall talisman plaque (integration may rescale)
  colorHex: OCHRE,

  buildGeometry(rng) {
    const parts = [];
    const fz = 0.0; // plaque front face plane (everything builds toward +Z)

    // === PLAQUE BACKING ======================================================
    // Square brick/stone plaque the talisman is mounted on. Flat and shallow.
    parts.push(box(2.6, 2.6, 0.34, BRICK, { z: fz, hex2: BRICK_L })); // main plaque slab
    parts.push(box(2.84, 2.84, 0.16, BRICK_L, { z: fz - 0.12 })); // back mounting board (slightly larger)
    // Raised brick frame border (four bars) so it reads as a framed plaque.
    parts.push(box(2.84, 0.18, 0.22, BRICK_L, { y: 1.33, z: fz + 0.06 }));
    parts.push(box(2.84, 0.18, 0.22, BRICK_L, { y: -1.33, z: fz + 0.06 }));
    parts.push(box(0.18, 2.66, 0.22, BRICK_L, { x: 1.33, z: fz + 0.06 }));
    parts.push(box(0.18, 2.66, 0.22, BRICK_L, { x: -1.33, z: fz + 0.06 }));

    // === LION FACE ===========================================================
    // Bulging round head pushing out from the plaque toward the viewer.
    const HY = 0.12; // lion head vertical center
    parts.push(sph(1.0, OCHRE, { z: fz + 0.46, y: HY, sz: 0.62, ws: 8, hs: 4, hex2: OCHRE_L })); // domed face

    // Shaggy mane ring around the face — a ring of stubby ochre lobes.
    const maneN = 6;
    for (let i = 0; i < maneN; i++) {
      const a = (i / maneN) * PI * 2;
      const r = 1.04;
      // Faceted lobe (ico) reads as a shaggy mane tuft at low tri cost.
      parts.push(ico(0.26, 0, OCHRE_D, { x: Math.cos(a) * r, y: HY + Math.sin(a) * r, z: fz + 0.18, sz: 0.5 }));
    }

    // Heavy frowning brow ridge (a box angled into a scowl per side).
    parts.push(box(0.62, 0.2, 0.3, DARK, { x: -0.4, y: HY + 0.46, z: fz + 0.86, rz: 0.28 }));
    parts.push(box(0.62, 0.2, 0.3, DARK, { x: 0.4, y: HY + 0.46, z: fz + 0.86, rz: -0.28 }));

    // Two big round glaring eyes under the brow.
    for (const sx of [-1, 1]) {
      parts.push(ico(0.24, 0, TEETH, { x: sx * 0.4, y: HY + 0.18, z: fz + 0.96, sz: 0.5 })); // eye white
      parts.push(box(0.16, 0.16, 0.1, DARK, { x: sx * 0.4, y: HY + 0.16, z: fz + 1.08 })); // pupil
    }

    // Broad flat nose.
    parts.push(box(0.34, 0.26, 0.26, OCHRE_D, { y: HY - 0.12, z: fz + 1.0 }));
    parts.push(box(0.14, 0.1, 0.12, DARK, { x: -0.12, y: HY - 0.22, z: fz + 1.1 })); // L nostril
    parts.push(box(0.14, 0.1, 0.12, DARK, { x: 0.12, y: HY - 0.22, z: fz + 1.1 })); // R nostril

    // === SNARLING MOUTH + SWORD =============================================
    // Wide bared-teeth maw: a dark mouth void, a row of teeth, biting the sword.
    const my = HY - 0.62; // mouth vertical center
    parts.push(box(1.5, 0.4, 0.26, DARK, { y: my, z: fz + 0.92 })); // dark open mouth void
    // Upper + lower teeth rows (small ivory blocks).
    for (let i = -2; i <= 2; i++) {
      parts.push(box(0.16, 0.18, 0.16, TEETH, { x: i * 0.26, y: my + 0.14, z: fz + 1.0 })); // upper teeth
      parts.push(box(0.16, 0.18, 0.16, TEETH, { x: i * 0.26 + 0.13, y: my - 0.14, z: fz + 1.0 })); // lower teeth
    }
    // Two fangs at the corners.
    parts.push(box(0.16, 0.3, 0.18, TEETH, { x: -0.62, y: my + 0.04, z: fz + 1.02 }));
    parts.push(box(0.16, 0.3, 0.18, TEETH, { x: 0.62, y: my + 0.04, z: fz + 1.02 }));

    // The SWORD bitten horizontally across the mouth — long thin blade.
    const j = (rng() - 0.5) * 0.02;
    parts.push(box(2.7, 0.1, 0.12, STEEL, { y: my + j, z: fz + 1.12, hex2: STEEL_L })); // blade
    parts.push(cone(0.07, 0.5, 6, STEEL_L, { rz: -HALF_PI, x: 1.65, y: my + j, z: fz + 1.12 })); // blade tip (point at right)
    // Hilt + guard + pommel jutting out the LEFT end.
    parts.push(box(0.1, 0.42, 0.18, STEEL_L, { x: -1.4, y: my + j, z: fz + 1.12 })); // cross guard
    parts.push(cyl(0.09, 0.09, 0.4, 6, HILT, { rz: HALF_PI, x: -1.66, y: my + j, z: fz + 1.12 })); // grip
    parts.push(ico(0.12, 0, STEEL_L, { x: -1.9, y: my + j, z: fz + 1.12 })); // pommel

    return finish(parts);
  },
};

export default NM_SWORD_LION;
