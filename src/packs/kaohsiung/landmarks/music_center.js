/**
 * @file packs/kaohsiung/landmarks/music_center.js — Roll Formosa Kaohsiung pack, hero LANDMARK.
 *
 * NM_MUSIC_CENTER — 高雄流行音樂中心 (Kaohsiung Music Center, 亞洲新灣區 / Asia New
 * Bay Area, 愛河出海口). Silhouette: a cluster of WHITE coral / sound-wave towers —
 * a row of tall, faceted pointed-cone volumes rising at staggered heights from a
 * low waterfront podium, the unmistakable「珊瑚礁/音浪」massing of the 海音 main
 * hall. Each tower is a slim square spire that tapers to a point; together their
 * uneven peaks read as a frozen sound wave on the bay. White coral-shell skin
 * (0xe8e8ee) over a pale stone deck, with a thin water apron at the base.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); the math is an
 * engine red line. finish() merges → recenters → normalizes to a UNIT bounding
 * sphere (radius 1), so proportions (not absolute size) carry the silhouette.
 * Square cross-sections come from cyl(...) seg=4 (a square rotated 45°), spun
 * ry=PI/4 so flat faces land on the axes. <= 600 triangles (hero budget). rng()
 * only nudges per-tower peak height so the wave never reads perfectly regular.
 */

import { box, cyl, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Landmark} Landmark */

// Palette — coral-shell white over pale bay stone.
const SHELL = 0xe8e8ee; // coral-shell white (tower body, lit upper)
const SHELL_D = 0xc4c6d2; // cool shadow side of the white shell
const STONE = 0xcfd0d6; // pale waterfront deck stone
const STONE_D = 0xa9abb4; // darker deck edge / shadow gradient
const WATER = 0x4f7f9c; // bay water apron at the base
const SEAM = 0x9aa0ae; // thin grey ridge seam between shell facets

export const NM_MUSIC_CENTER = {
  id: 'kaohsiung_music_center',
  name: '高雄流行音樂中心',
  landmarkId: 13,
  dioramaRHint: 115, // 海音中心 main-hall cluster footprint hint (metres)
  colorHex: SHELL,

  buildGeometry(rng) {
    const FACE = HALF_PI / 2; // PI/4 — orient square cyl faces onto the axes
    const parts = [];

    // ---- 1) Waterfront deck + thin bay-water apron --------------------------
    parts.push(box(3.7, 0.10, 1.7, WATER, { y: 0.05 })); // bay water apron (widest, lowest)
    parts.push(box(3.2, 0.16, 1.35, STONE, { y: 0.18, hex2: STONE_D })); // pale stone deck slab
    parts.push(box(2.9, 0.10, 1.1, STONE_D, { y: 0.31 })); // raised inner terrace the towers spring from

    // ---- 2) Row of white coral / sound-wave towers --------------------------
    // A staggered line of slim square spires that each taper to a point. The
    // peak heights ramp up then down (a「wave」), with a small rng nudge so the
    // crest never reads perfectly even. Each tower is a tapered square base +
    // a tall square needle that pinches to a tip (rt→0) — the coral spire.
    const deckTop = 0.36;
    const baseHs = [0.95, 1.45, 1.95, 1.65, 1.15, 0.8]; // sound-wave peak ramp
    const xs = [-1.25, -0.72, -0.18, 0.38, 0.92, 1.4]; // staggered along the bay (X)
    const zs = [0.12, -0.16, 0.18, -0.14, 0.14, -0.1]; // slight depth weave
    const rBase = 0.17; // tower circumradius (square) at the deck

    for (let i = 0; i < baseHs.length; i++) {
      const jitter = (rng() - 0.5) * 0.18; // per-tower crest nudge
      const peakH = baseHs[i] + jitter;
      const x = xs[i];
      const z = zs[i];
      const r = rBase * (i === 2 ? 1.18 : 1); // the tallest centre tower is a touch broader

      // lower body: gently tapering square shell shaft (wider at deck)
      const bodyH = peakH * 0.52;
      parts.push(
        cyl(r * 0.74, r, bodyH, 4, SHELL_D, {
          ry: FACE, x, z, y: deckTop + bodyH / 2, hex2: SHELL,
        })
      ); // coral shell shaft (shadow base → lit white)
      // thin ridge seam where body meets needle
      parts.push(box(r * 1.5, 0.035, r * 1.5, SEAM, { x, z, y: deckTop + bodyH }));

      // upper needle: tall square spire pinching to a point (rt = 0)
      const needleH = peakH * 0.62;
      parts.push(
        cyl(0, r * 0.74, needleH, 4, SHELL, {
          ry: FACE, x, z, y: deckTop + bodyH + needleH / 2, hex2: SHELL,
        })
      ); // tapered coral needle to the tip
    }

    // ---- 3) Two low secondary shell pods (the 鯨魚堤岸 / smaller halls) ------
    // A pair of squat, rounded-off square mounds flanking the spire row, low and
    // wide so they read as the supporting halls, not more towers.
    for (const sx of [-1, 1]) {
      const x = sx * 1.55;
      parts.push(cyl(0.16, 0.34, 0.5, 4, SHELL_D, { ry: FACE, x, z: -0.28, y: deckTop + 0.25, hex2: SHELL }));
      parts.push(cyl(0.0, 0.16, 0.26, 4, SHELL, { ry: FACE, x, z: -0.28, y: deckTop + 0.63 }));
    }

    return finish(parts);
  },
};

export default NM_MUSIC_CENTER;
