/**
 * @file packs/taipei/landmarks/beimen.js — Roll Formosa Taipei pack, landmark 0.
 *
 * 北門(承恩門) — the only surviving Qing-era stone gate of the Taipei City
 * Wall, restored after the elevated expressway over it was removed in 2016.
 * Silhouette: a squat square STONE base block pierced by a single arched
 * gateway, capped by a tiered hip-and-gable TILE roof whose eaves sweep up at
 * the corners (升簷翹角). It is the SMALLEST landmark on the ladder (landmarkId
 * 0), so it reads as a wide-and-LOW gate, never a tower.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is
 * an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so proportions (not absolute size) carry the
 * read: base wider than tall, roof overhanging on all four sides.
 *
 * Palette: stone grey base/parapet, dark slate-grey tiled roof, near-black
 * arch recess. rng() is used only for a hair of roof-ridge jitter — never for
 * structure.
 */

import { box, cyl, cone, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const STONE = 0x9c958a; // weathered grey ashlar (base block)
const STONE_D = 0x837c72; // shadowed stone (plinth / recessed band)
const STONE_L = 0xb0a99e; // sunlit stone (cornice / coping)
const ROOF = 0x4a4e52; // dark slate-grey glazed tile
const ROOF_D = 0x393c40; // roof underside / deep eave shadow
const RIDGE = 0x5a5e63; // ridge tiles (slightly lighter than field)
const ARCH = 0x21201e; // near-black gateway opening (recessed)
const WOOD = 0x6e4a36; // timber door leaves inside the arch

export const NM_BEIMEN = {
  id: 'beimen',
  name: '北門(承恩門)',
  landmarkId: 0,
  dioramaRHint: 11, // ~13 m wide, ~12 m tall stone gate (integration may rescale)
  colorHex: STONE,

  buildGeometry(rng) {
    const parts = [];

    // === STONE BASE ==========================================================
    // Squat square gate block: clearly wider than tall (a 牌樓/城門, not a tower).
    // Authored span ~2.4 wide x ~1.7 tall x ~1.6 deep.
    parts.push(box(3.0, 0.24, 1.96, STONE_D, { y: 0.12, hex2: STONE })); // plinth foot (battered, wider than wall)
    parts.push(box(2.8, 1.3, 1.7, STONE, { y: 0.89, hex2: STONE_L })); // main ashlar block (wide+low, lighter toward top)

    // Corner pilasters to break the flat faces and read as masonry quoins.
    for (const sx of [-1, 1]) {
      parts.push(box(0.18, 1.3, 0.18, STONE_L, { x: sx * 1.36, y: 0.89, z: 0.83 }));
      parts.push(box(0.18, 1.3, 0.18, STONE_L, { x: sx * 1.36, y: 0.89, z: -0.83 }));
    }

    // Stone cornice / coping course capping the wall just under the roof.
    parts.push(box(2.96, 0.16, 1.84, STONE_L, { y: 1.6 }));
    parts.push(box(3.12, 0.1, 2.0, STONE_D, { y: 1.7 })); // wider drip course (roof seat)

    // Two small recessed bands (string courses) for masonry texture.
    parts.push(box(2.82, 0.06, 1.72, STONE_D, { y: 0.46 }));
    parts.push(box(2.82, 0.06, 1.72, STONE_D, { y: 1.1 }));

    // === ARCHED GATEWAY (front, +Z) =========================================
    // Dark recessed pier-and-arch opening: two jambs + a semicircular head,
    // built from a half-cylinder so the silhouette truly reads as an arch.
    // Opening ~0.84 wide, jambs to y≈0.95, arch radius ≈0.42.
    const aZ = 0.78; // sit slightly proud of the front face so the recess is visible
    // Recess backing slab (the dark void seen through the opening).
    parts.push(box(0.96, 1.36, 0.18, ARCH, { y: 0.72, z: aZ - 0.08 }));
    // Square jambs of the opening.
    parts.push(box(0.84, 0.88, 0.22, ARCH, { y: 0.5, z: aZ }));
    // Semicircular arch head: half-cylinder lying on its side, flat face front.
    parts.push(
      cyl(0.42, 0.42, 0.22, 12, ARCH, {
        rx: HALF_PI, // lay the disc to face +Z
        rz: 0, // keep the flat (cut) side toward the viewer
        theta0: 0,
        thetaLen: PI, // half disc → the rounded arch top
        y: 0.94,
        z: aZ,
      })
    );
    // Stone archivolt (raised arched moulding framing the opening) — STONE ring.
    parts.push(
      cyl(0.56, 0.56, 0.12, 12, STONE_L, {
        rx: HALF_PI,
        theta0: 0,
        thetaLen: PI,
        open: true,
        y: 0.94,
        z: aZ + 0.05,
      })
    );
    parts.push(box(0.14, 0.88, 0.1, STONE_L, { x: -0.55, y: 0.5, z: aZ + 0.05 })); // L impost jamb trim
    parts.push(box(0.14, 0.88, 0.1, STONE_L, { x: 0.55, y: 0.5, z: aZ + 0.05 })); // R impost jamb trim
    // Timber door leaves recessed inside the lower opening.
    parts.push(box(0.4, 0.84, 0.06, WOOD, { x: -0.21, y: 0.48, z: aZ - 0.02 }));
    parts.push(box(0.4, 0.84, 0.06, WOOD, { x: 0.21, y: 0.48, z: aZ - 0.02 }));

    // Matching shallow blind arch on the rear (−Z) so both long faces read.
    parts.push(box(0.84, 1.1, 0.12, STONE_D, { y: 0.6, z: -aZ }));

    // === TIERED TILE ROOF ====================================================
    // Hip-and-gable roof in two tiers (重簷), each a flat low pyramid (cone with
    // few sides = faceted hip) overhanging the wall, plus eave fascia boards and
    // upturned corner spurs. This is the recognizable crown of 承恩門.

    // Lower (larger) eave: broad overhang skirt + faceted hip slope.
    parts.push(box(3.5, 0.08, 2.5, ROOF_D, { y: 1.78 })); // lower eave underside (deep shadow, big overhang)
    parts.push(box(3.46, 0.14, 2.46, ROOF, { y: 1.86, hex2: RIDGE })); // lower eave course (tile)
    parts.push(cone(2.0, 0.42, 4, ROOF, { ry: PI / 4, y: 2.12, sx: 1.22, sz: 0.86, hex2: RIDGE })); // lower hip slope (flat, rect footprint)

    // Upper (smaller) eave + slightly steeper hip — the second tier.
    const j = (rng() - 0.5) * 0.02; // tiny ridge jitter (variation only)
    parts.push(box(2.5, 0.12, 1.78, ROOF, { y: 2.32, hex2: RIDGE })); // upper eave course
    parts.push(box(2.46, 0.06, 1.74, ROOF_D, { y: 2.25 })); // upper eave underside
    parts.push(cone(1.55, 0.5, 4, ROOF, { ry: PI / 4, y: 2.6, sx: 1.2, sz: 0.84, hex2: RIDGE })); // upper hip slope

    // Main ridge beam running along the long axis, with a touch of jitter.
    parts.push(box(2.3, 0.13, 0.16, RIDGE, { y: 2.86 + j, hex2: STONE_L }));
    // Ridge end ornaments (鴟尾-ish blocks) at each gable end.
    parts.push(box(0.2, 0.24, 0.22, RIDGE, { x: -1.18, y: 2.94 }));
    parts.push(box(0.2, 0.24, 0.22, RIDGE, { x: 1.18, y: 2.94 }));

    // Upturned corner eave spurs (翹角): short angled bars at the four lower
    // eave corners that lift the silhouette — the signature swallowtail flick.
    const ex = 1.7;
    const ez = 1.2;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(
          box(0.4, 0.08, 0.08, ROOF, {
            rz: sx * 0.5, // lift outward end upward
            ry: sx * sz * 0.5, // splay toward the diagonal corner
            x: sx * ex,
            y: 1.92,
            z: sz * ez,
            hex2: RIDGE,
          })
        );
      }
    }
    // Upper-tier corner flicks (smaller).
    const ux = 1.24;
    const uz = 0.88;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        parts.push(
          box(0.3, 0.07, 0.07, ROOF, {
            rz: sx * 0.55,
            ry: sx * sz * 0.5,
            x: sx * ux,
            y: 2.38,
            z: sz * uz,
            hex2: RIDGE,
          })
        );
      }
    }

    return finish(parts);
  },
};

export default NM_BEIMEN;
