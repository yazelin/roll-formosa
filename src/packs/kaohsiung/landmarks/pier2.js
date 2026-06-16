/**
 * @file packs/kaohsiung/landmarks/pier2.js — Roll Formosa Kaohsiung pack, curated landmark.
 *
 * 駁二藝術特區 (Pier-2 Art Center, 鹽埕 Yancheng). A curated hero geometry, not a
 * repeatable chunk archetype: a cluster of low RED-BRICK former harbour warehouses
 * — long shallow sheds with shallow saw-tooth / gable roofs and rows of square
 * windows — fronted by an OPEN PLAZA on which stands a large public installation:
 * a chunky low-poly FIGURE (公仔 / 裝置藝術), the kind of oversized sculpture that
 * defines the Pier-2 silhouette. Warehouse brick + plaza concrete + a bold accent
 * figure — the converted-port art-district read of 高雄's waterfront.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored in unit-ish space with correct PROPORTIONS
 * (wide + low warehouse rows, NOT a tower; figure stands proud of the sheds). The
 * integration step owns the size-ladder; dioramaRHint is the real-world footprint
 * hint. <= 600 triangles (hero budget).
 */

import { box, cyl, sph, ico, finish, PI } from '../geomHelpers.js';

// Palette — port-warehouse art district materials.
const BRICK = 0xc06a4a; // 紅磚 warehouse brick (signature accent)
const BRICK_D = 0x9c5238; // deeper brick shadow / weathered course
const ROOF = 0x55504c; // dark grey corrugated / asphalt shed roof
const ROOF_D = 0x3e3a37; // roof shadow underside band
const TRIM = 0xe4d9c8; // pale concrete lintel / window frame trim
const PLAZA = 0xb8b0a2; // concrete plaza apron
const PLAZA_D = 0xa39a8c; // darker plaza joint / shadow
const WIN = 0x2f4250; // dark glazing in window openings
// Installation figure — a bold, friendly accent so it pops off the brick.
const FIG = 0xf0b840; // warm yellow figure body (公仔)
const FIG_D = 0xd49a28; // figure shadow side
const FIG_TRIM = 0xc23a32; // red accent trim on the figure
const FIG_DARK = 0x33302d; // figure eyes / dark detail

/**
 * Author one long red-brick warehouse shed centered at (x,0,z), pushing parts
 * into `out`. A shallow brick box body with a course line, two rows of square
 * windows on the long (front) face, and a low gable tile roof.
 * @param {THREE.BufferGeometry[]} out
 * @param {number} x      shed center X
 * @param {number} z      shed center Z
 * @param {number} w      shed width (long axis, along X)
 * @param {number} d      shed depth (along Z)
 * @param {number} h      wall height
 */
function warehouse(out, x, z, w, d, h) {
  // Brick body — slightly graded bottom(shadow)->top(brick) for a weathered read.
  out.push(box(w, h, d, BRICK_D, { x, y: h * 0.5, z, hex2: BRICK }));
  // Plinth course at the base (darker brick band).
  out.push(box(w + 0.02, 0.08, d + 0.02, BRICK_D, { x, y: 0.05, z }));
  // Concrete lintel band capping the wall under the eave.
  out.push(box(w + 0.04, 0.07, d + 0.04, TRIM, { x, y: h + 0.01, z }));

  // Low gable roof: two tile planes leaning to a central ridge along X.
  const slope = 0.5;
  const half = d * 0.5;
  for (const s of [-1, 1]) {
    out.push(
      box(w + 0.06, 0.05, half * 1.16, ROOF, {
        rx: s * slope,
        x,
        y: h + 0.12,
        z: z + s * half * 0.45,
        hex2: ROOF_D,
      })
    );
  }
  // Ridge cap beam.
  out.push(box(w + 0.02, 0.06, 0.06, ROOF_D, { x, y: h + 0.24, z }));

  // Front glazing band: one continuous dark window strip set into the brick
  // frontage (a glazed warehouse loading face, cheap on tris).
  const frontZ = z + d * 0.5 + 0.01;
  const wy = h * 0.55;
  out.push(box(w * 0.82, 0.2, 0.03, WIN, { x, y: wy, z: frontZ })); // glazing band
}

export const NM_PIER2 = {
  id: 'pier2_art',
  name: '駁二藝術特區',
  dioramaRHint: 28, // ~ warehouse-cluster-to-plaza footprint radius in metres
  colorHex: 0xc06a4a, // 紅磚 — Pier-2's signature warehouse brick
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.04; // tiny non-structural jitter on the figure's tilt
    const parts = [];

    // ---- Plaza apron (wide + low concrete deck the cluster sits on) ------
    parts.push(box(4.4, 0.12, 2.8, PLAZA, { y: 0.06, hex2: PLAZA_D })); // main plaza slab

    // ---- Red-brick warehouse cluster (the converted port sheds) ---------
    // A back row of two longer sheds and a shorter front-left shed, staggered so
    // the cluster reads as a little harbour-warehouse street, not one big block.
    warehouse(parts, -0.95, -0.75, 1.7, 0.95, 0.74); // back-left long shed
    warehouse(parts, 1.05, -0.85, 1.55, 0.85, 0.66); // back-right shed (lower)
    warehouse(parts, -1.35, 0.45, 1.05, 0.7, 0.5); // front-left small shed

    // A short connecting brick wall (gateway) between the two back sheds.
    parts.push(box(0.5, 0.42, 0.7, BRICK_D, { x: 0.05, y: 0.21, z: -0.8, hex2: BRICK }));

    // ---- The big installation art FIGURE on the plaza --------------------
    // A chunky low-poly standing figure (公仔): rounded body, head with simple
    // face, stubby arms, a bold accent band — oversized so it stands proud of the
    // sheds and anchors the plaza, the unmistakable Pier-2 silhouette.
    const fx = 0.85; // figure stands on the open right-front of the plaza
    const fz = 0.65;
    const baseY = 0.12; // top of the plaza slab

    // Pedestal plinth the figure stands on.
    parts.push(cyl(0.3, 0.34, 0.12, 5, PLAZA_D, { x: fx, y: baseY + 0.06, z: fz }));

    // Rounded body — a slightly squashed sphere belly, warm yellow with shadow.
    const bodyY = baseY + 0.12 + 0.34;
    parts.push(sph(0.36, FIG_D, { ws: 6, hs: 4, x: fx, y: bodyY, z: fz, sy: 1.25, hex2: FIG }));
    // Accent belt band around the belly.
    parts.push(cyl(0.34, 0.34, 0.08, 5, FIG_TRIM, { x: fx, y: bodyY - 0.06, z: fz, rz: r }));

    // Head — a sphere atop the body with a simple dark-eyed face.
    const headY = bodyY + 0.5;
    parts.push(sph(0.26, FIG_D, { ws: 6, hs: 4, x: fx, y: headY, z: fz, hex2: FIG }));
    // Two eyes on the front of the head.
    for (const sx of [-1, 1]) {
      parts.push(sph(0.045, FIG_DARK, { ws: 5, hs: 3, x: fx + sx * 0.09, y: headY + 0.04, z: fz + 0.235 }));
    }
    // A little antenna / topknot finial so the head reads as a character — a slim
    // tapered prong (its own pointed tip is the finial, no extra orb needed).
    parts.push(cyl(0.0, 0.04, 0.2, 5, FIG_TRIM, { x: fx, y: headY + 0.34, z: fz }));

    // Stubby arms — short cylinders angled out from the body sides, tipped with a
    // small red ico mitt (cheap on tris vs a sphere).
    for (const sx of [-1, 1]) {
      parts.push(
        cyl(0.07, 0.08, 0.34, 5, FIG, {
          x: fx + sx * 0.34,
          y: bodyY + 0.02,
          z: fz,
          rz: sx * (PI / 2.6),
          hex2: FIG_D,
        })
      );
      parts.push(ico(0.085, 0, FIG_TRIM, { x: fx + sx * 0.5, y: bodyY + 0.12, z: fz })); // hand mitt
    }
    // Two stubby feet under the body (low ico nubs).
    for (const sx of [-1, 1]) {
      parts.push(ico(0.1, 0, FIG_D, { x: fx + sx * 0.16, y: baseY + 0.15, z: fz + 0.06, sy: 0.7 }));
    }

    // A second small accent installation — a slim painted post sculpture near the
    // front-left shed, capped by a bright faceted orb, to balance the plaza.
    parts.push(cyl(0.05, 0.07, 0.66, 5, FIG_TRIM, { x: -1.45, y: baseY + 0.33, z: 0.95, hex2: FIG }));
    parts.push(ico(0.11, 0, FIG, { x: -1.45, y: baseY + 0.74, z: 0.95 }));

    return finish(parts);
  },
};

export default NM_PIER2;
