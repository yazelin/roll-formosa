/**
 * @file packs/tainan/landmarks/koxinga_shrine.js — Roll Formosa Tainan pack, hero landmark.
 *
 * 鄭成功祖廟 (Koxinga's Ancestral Shrine) — a southern-Min 閩南 temple in 臺南
 * honouring 鄭成功. Signature read: red plastered walls, a broad tiled
 * hip-and-gable (歇山) roof crowned by an upturned SWALLOWTAIL ridge (燕尾脊) with
 * a decorated ridge spine, a front row of red columns, and a central doorway with
 * painted door-god panels.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so this is authored WIDE + LOW with a single broad
 * swallowtail roof carrying the read. rng() is hair-fine finial jitter only.
 * Hero model budget: <= 600 triangles.
 */

import { box, cyl, finish } from '../geomHelpers.js';

// ---- palette ----------------------------------------------------------------
const STONE = 0xc3bdae; // pale stone courtyard / base
const STONE_D = 0xa39d8e; // darker stone for steps / shadow
const RED = 0xb23a2e; // 朱紅 lacquered red wall / column (hero color)
const RED_L = 0xc8503e; // sunlit red
const RED_D = 0x8a261d; // deep red shadow / recess
const TILE = 0x4a4038; // grey-brown glazed roof tile
const TILE_D = 0x352d27; // deep eave underside
const GOLD = 0xcfa247; // 燙金 ridge spine / finial
const DOORGOD = 0x2c5a3f; // dark-green door-god panel ground
const DOORGOD_A = 0xd8b24a; // gold door-god accent

/**
 * Author one broad swallowtail (燕尾) tile roof centered at (0,y), pushing parts
 * into `out`: a low wide tile mass, a wider darker eave band, a sloped two-plane
 * crown, a gold decorated ridge spine, and four corner spurs sweeping UP and OUT
 * into forked gold tips — the unmistakable southern-Min temple silhouette.
 */
function swallowRoof(out, y, hw, hd, th, ridgeH) {
  out.push(box(hw * 2, th * 0.55, hd * 2, TILE, { y: y + th * 0.72, hex2: TILE_D }));
  out.push(box(hw * 2 + 0.12, th * 0.42, hd * 2 + 0.12, TILE_D, { y: y + th * 0.2 }));
  const slopeLen = hd * 1.2;
  for (const s of [-1, 1]) {
    out.push(box(hw * 2 - 0.06, 0.04, slopeLen, TILE, { rx: s * 0.6, y: y + th + ridgeH * 0.5, z: s * hd * 0.42 }));
  }
  // Decorated gold ridge spine running side-to-side.
  out.push(box(hw * 2 - 0.04, ridgeH * 0.5, 0.12, GOLD, { y: y + th + ridgeH * 0.75 }));
  out.push(box(hw * 2 - 0.04, ridgeH * 0.2, 0.06, RED, { y: y + th + ridgeH * 0.95 })); // ridge decoration crest

  // Four swallowtail corner spurs.
  const sweep = 0.58;
  const spurLen = hw * 0.66;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cornerX = sx * hw;
      const cornerZ = sz * hd;
      out.push(box(spurLen, 0.07, 0.12, TILE, {
        rz: sx * sweep, x: cornerX - sx * spurLen * 0.32, y: y + th * 0.5 + spurLen * 0.2, z: cornerZ,
      }));
      out.push(box(0.2, 0.06, 0.1, GOLD, {
        rz: sx * (sweep + 0.32), x: cornerX + sx * 0.18, y: y + th * 0.5 + spurLen * 0.48, z: cornerZ,
      }));
    }
  }
}

export const NM_KOXINGA = {
  id: 'koxinga_shrine',
  name: '鄭成功祖廟',
  landmarkId: 9,
  dioramaRHint: 34,
  colorHex: RED,

  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02; // tiny non-structural jitter on the finial
    const parts = [];

    // ---- Wide stone courtyard platform (broad + low) -------------------
    parts.push(box(5.0, 0.3, 3.4, STONE, { y: 0.15, hex2: STONE_D }));
    parts.push(box(3.6, 0.24, 2.2, STONE_D, { y: 0.32 }));
    parts.push(box(3.0, 0.14, 0.42, STONE, { y: 0.39, z: 1.18 })); // front steps

    // ---- Broad red hall body -------------------------------------------
    const bodyY = 0.44;
    const bodyH = 1.05;
    parts.push(box(3.4, bodyH, 1.9, RED, { y: bodyY + bodyH / 2, hex2: RED_L })); // red wall mass
    // Red base course / waist band.
    parts.push(box(3.5, 0.16, 2.0, RED_D, { y: bodyY + 0.08 }));

    // ---- Central doorway with door-god panels --------------------------
    const porchZ = 0.95;
    // Dark doorway recess.
    parts.push(box(1.0, bodyH * 0.7, 0.12, RED_D, { y: bodyY + bodyH * 0.35, z: porchZ + 0.01 }));
    // Twin door-god leaf panels.
    for (const sx of [-1, 1]) {
      parts.push(box(0.42, bodyH * 0.62, 0.06, DOORGOD, {
        x: sx * 0.26, y: bodyY + bodyH * 0.33, z: porchZ + 0.08, hex2: 0x1f4530,
      }));
      // Gold door-god figure accent.
      parts.push(box(0.18, bodyH * 0.36, 0.04, DOORGOD_A, { x: sx * 0.26, y: bodyY + bodyH * 0.36, z: porchZ + 0.12 }));
    }
    // Door lintel + gold trim.
    parts.push(box(1.2, 0.14, 0.16, RED_D, { y: bodyY + bodyH * 0.72, z: porchZ + 0.04 }));
    parts.push(box(1.3, 0.06, 0.18, GOLD, { y: bodyY + bodyH * 0.8, z: porchZ + 0.04 }));

    // ---- Front row of red columns --------------------------------------
    const colSpan = 3.0;
    const nCol = 6;
    for (let i = 0; i < nCol; i++) {
      const cx = -colSpan / 2 + (colSpan / (nCol - 1)) * i;
      parts.push(cyl(0.11, 0.12, bodyH + 0.05, 6, RED, { x: cx, y: bodyY + bodyH / 2 + 0.02, z: porchZ, hex2: RED_D }));
    }
    // Two rear corner columns for depth read.
    for (const cx of [-1.5, 1.5]) {
      parts.push(cyl(0.1, 0.11, bodyH + 0.05, 6, RED, { x: cx, y: bodyY + bodyH / 2 + 0.02, z: -0.85, hex2: RED_D }));
    }
    // Column-head beam (架枋) tying the colonnade — red with a gold band.
    parts.push(box(3.5, 0.16, 0.16, RED, { y: bodyY + bodyH + 0.04, z: porchZ }));
    parts.push(box(3.5, 0.06, 0.18, GOLD, { y: bodyY + bodyH + 0.14, z: porchZ }));

    // ---- THE single dominant swallowtail roof (visual hero) -------------
    swallowRoof(parts, bodyY + bodyH + 0.16, 2.35, 1.42, 0.2, 0.56);

    // ---- Crowning ridge gourd finial -----------------------------------
    const topY = bodyY + bodyH + 0.16 + 0.2 + 0.56;
    parts.push(box(0.8, 0.12, 0.2, GOLD, { y: topY + 0.06 }));
    parts.push(cyl(0.05, 0.09, 0.24, 8, GOLD, { y: topY + 0.22 }));
    parts.push(cyl(0.07, 0.0, 0.18, 8, GOLD, { y: topY + 0.42 + r }));

    return finish(parts);
  },
};

export default NM_KOXINGA;
