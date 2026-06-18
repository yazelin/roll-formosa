/**
 * @file packs/taichung/landmarks/caowu_path.js — Roll Formosa Taichung pack, hero LANDMARK.
 *
 * NM_CAOWU_PATH — 草悟道 (Calligraphy Greenway, 西區). A linear tree-shaded
 * cultural promenade. The recognizable read is a LOW pale-stone walkway platform
 * (a long flat paved strip, +Z is the show face) flanked by a small ROW of
 * stylised trees — chunky brown cylinder trunks under round green sphere canopies
 * — with one piece of MODERN PUBLIC ART standing on a low pedestal at the centre
 * of the path: a bright TILTED TORUS ring (abstract sculpture). Green + leisure +
 * a splash of design-district colour, so a player reads "林蔭綠廊 + 文創地景" from
 * a 3/4 view: a paved lane, trees down both sides, an art ring in the middle.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): box + cyl +
 * sph + torus. The geometry math is an engine red line. finish() merges →
 * recenters → normalizes to a UNIT bounding sphere (radius 1), so this is authored
 * with the correct PROPORTIONS (a wide LOW platform, trees a couple of platform-
 * heights tall, a human-scale art ring) and absolute size is owned by the size
 * ladder. <= 600 triangles. rng() only nudges each tree's canopy size/lean and the
 * art ring's tilt, so every instance differs slightly — the tree COUNT/layout and
 * the central ring stay fixed so the greenway silhouette is always recognizable.
 */

import { box, cyl, sph, torus, finish, PI } from '../geomHelpers.js'; // import only what we use

// Palette — a stone greenway promenade with a colourful art installation.
const STONE = 0xcfc8ba; // pale limestone / granite paving of the walkway
const STONE_D = 0xb1a994; // shadowed paving edge (vertical gradient bottom)
const KERB = 0xb1a994; // raised kerb strip down each long edge of the lane
const SOIL = 0x6f5a3e; // dark planting-bed soil the trees rise from
const TRUNK = 0x7a5a3a; // warm brown tree trunk
const TRUNK_D = 0x5d4329; // shaded lower trunk (gradient bottom)
const LEAF_HI = 0x7ec46a; // sunlit crown highlight (canopy gradient top)
const LEAF_DK = 0x3f7d3d; // deeper inner-foliage green (canopy gradient bottom)
const ART_A = 0xe8513a; // vermilion art ring (文創 splash of colour)
const ART_B = 0xf2a81e; // warm-amber gradient on the ring
const PED = 0xb8b0a2; // pale stone pedestal under the sculpture

export const NM_CAOWU_PATH = {
  id: 'caowu_path',
  name: '草悟道',
  landmarkId: 9,
  dioramaRHint: 5, // a short stretch of the林蔭綠廊 — only a few metres across
  colorHex: 0x4f9e4a, // the greenway reads as leafy promenade green

  buildGeometry(rng) {
    const parts = [];

    // ===================================================================
    // 1) LOW PALE-STONE WALKWAY PLATFORM — the long flat paved lane
    // ===================================================================
    // Wide along X (the lane runs left↔right), shallow along Z, very LOW: this
    // is a promenade, never a building. Slightly proud kerb strips run down each
    // long edge so it reads as a raised paved path, not a slab of ground.
    const padW = 3.6;  // lane length (X)
    const padD = 1.9;  // lane depth (Z)
    const padH = 0.18; // platform thickness — kept low
    const padTop = padH; // top surface of the paving
    parts.push(box(padW, padH, padD, STONE, { y: padH / 2, hex2: STONE_D })); // paved lane

    // raised kerb strips along the two long (Z) edges of the lane
    parts.push(box(padW, 0.06, 0.12, KERB, { y: padTop + 0.02, z: padD / 2 - 0.06 })); // front kerb
    parts.push(box(padW, 0.06, 0.12, KERB, { y: padTop + 0.02, z: -padD / 2 + 0.06 })); // back kerb

    // a couple of faint paving seams across the lane (low, just for read)
    for (const sx of [-1, 1]) {
      parts.push(box(0.04, 0.02, padD * 0.9, STONE_D, { x: sx * (padW * 0.26), y: padTop + 0.01 })); // paving joint
    }

    // ===================================================================
    // 2) STYLISED TREES — chunky brown trunk + round green canopy
    // ===================================================================
    // A fixed ROW of trees: two near the back edge, two near the front edge,
    // staggered so the central sculpture stays visible from a 3/4 view. Each
    // tree = a small soil mound + a tapered trunk + one big round canopy sphere.
    // rng() only nudges canopy radius + a slight trunk lean per tree, so the
    // tree COUNT/layout stays fixed (always four, framing the path).
    const treePts = [
      { x: -1.25, z: 0.62 },  // front-left
      { x: 1.25, z: 0.62 },   // front-right
      { x: -0.55, z: -0.6 },  // back-left (staggered inward)
      { x: 0.55, z: -0.6 },   // back-right
    ];
    for (let i = 0; i < treePts.length; i++) {
      const tx = treePts[i].x;
      const tz = treePts[i].z;
      const lean = (rng() - 0.5) * 0.12;       // small per-tree trunk lean
      const crownR = 0.46 + rng() * 0.12;      // canopy size varies a little
      const trunkH = 0.62;
      const trunkY = padTop + trunkH / 2;

      // soil planting bed the tree rises from (a small dark mound)
      parts.push(cyl(0.22, 0.28, 0.07, 6, SOIL, { x: tx, y: padTop + 0.03, z: tz })); // planting bed

      // tapered trunk (slightly thinner at the top), with a tiny lean
      parts.push(cyl(0.07, 0.1, trunkH, 5, TRUNK, {
        x: tx,
        y: trunkY,
        z: tz,
        rz: lean,
        hex2: TRUNK_D,
      })); // trunk

      // canopy: one big round green sphere sitting on the trunk top, gradient
      // from a deep inner green up to a sunlit crown.
      const crownY = padTop + trunkH + crownR * 0.62;
      parts.push(sph(crownR, LEAF_DK, { ws: 6, hs: 4, x: tx, y: crownY, z: tz, hex2: LEAF_HI })); // canopy
    }

    // ===================================================================
    // 3) CENTRAL MODERN PUBLIC ART — a tilted bright torus ring on a plinth
    // ===================================================================
    // Stands dead-centre on the lane: a low pale stone pedestal carrying a bold
    // TILTED torus ring (abstract 文創 sculpture, the eye-catch). rng() nudges
    // the ring's tilt so each instance is a little different, but it always reads
    // as a single bright ring standing upright-ish in the middle of the path.
    const pedH = 0.34;
    const pedY = padTop + pedH / 2;
    const pedTopY = padTop + pedH;
    parts.push(cyl(0.16, 0.22, pedH, 6, PED, { y: pedY, ry: PI / 6, hex2: STONE })); // hexagonal stone plinth
    parts.push(box(0.5, 0.05, 0.5, STONE_D, { y: padTop + 0.025 })); // plinth footing slab

    // the ring: a torus standing in the X-Y plane (faces the camera), tilted a
    // little off-vertical so it reads as a designed sculpture, not a wheel. Its
    // bottom is lifted to sit ON the pedestal top by ringR + a small margin.
    const ringR = 0.5;   // ring radius
    const ringTube = 0.1; // ring thickness
    const tilt = 0.32 + (rng() - 0.5) * 0.18; // mostly-upright lean, slight per-instance
    const ringY = pedTopY + ringR + 0.02; // lift so the ring rests on the plinth
    // default torus lies in the X-Y plane (hole faces +Z) — exactly camera-facing;
    // rz tilts it sideways and a touch of rx gives it depth so it never looks flat.
    parts.push(torus(ringR, ringTube, 5, 12, ART_A, {
      x: 0,
      y: ringY,
      z: 0,
      rz: tilt,
      rx: 0.22,
      hex2: ART_B,
    })); // tilted art ring

    // a small bright accent orb threaded near the ring's lower rim, connecting
    // the ring to the pedestal so nothing reads as floating.
    parts.push(sph(0.13, ART_B, {
      ws: 7,
      hs: 5,
      x: ringR * Math.sin(tilt) * -0.2,
      y: pedTopY + 0.06,
      z: 0.04,
      hex2: ART_A,
    })); // accent orb at the ring foot

    return finish(parts);
  },
};

export default NM_CAOWU_PATH;
