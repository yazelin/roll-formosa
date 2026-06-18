/**
 * @file packs/taichung/collectibles/dajia_taro.js — Roll Formosa Taichung pack,
 * COLLECTIBLE (album item the ball rolls up).
 *
 * COL_DAJIA_TARO — 大甲芋頭 (Dajia taro root). Silhouette: one plump, ELONGATED
 * taro lying on its side — a stretched ovoid body with dark purple-brown earthy
 * skin (~0x6b5563), a few thin dark root-whisker lines raked across the surface,
 * and a sliced face on the lower/rear end exposing pale lilac-white taro flesh
 * (~0xc9b6cf). The read from a 3/4 view is an earthy root vegetable, freshly
 * trimmed, resting on its side — no plate, no stand, just the tuber.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js) — the math
 * is an engine red line. finish() merges → recenters → normalizes to a UNIT
 * bounding sphere (radius 1), so PROPORTIONS carry the read (a long ovoid with a
 * pale cut end), not absolute size. <= 350 triangles (~324). rng nudges only the
 * skin tone — never structure.
 */

import { sph, cyl, box, finish, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').CollectibleDef} CollectibleDef */

/** Concrete hexes — earthy taro skin, pale lilac cut flesh, dark root whiskers. */
const SKIN = 0x6b5563; // dark purple-brown outer skin (body read color)
const SKIN_HI = 0x847088; // dusty lighter top of the tuber
const SKIN_LO = 0x4f4049; // deeper shaded underside (sits in the soil)
const FLESH = 0xc9b6cf; // pale lilac-white taro flesh at the cut face
const FLESH_HI = 0xe3d6e8; // brighter cut-face center
const WHISKER = 0x33282e; // thin dark root-whisker line

export const COL_DAJIA_TARO = {
  id: 'dajia_taro',
  name: '大甲芋頭',
  collectibleId: 4,
  colorHex: 0x6b5563, // earthy purple-brown skin — the body read color

  /**
   * Build the taro-root geometry (low-poly, vertex-colored).
   * @param {() => number} rng Boot rng — tiny variation only (skin tone).
   * @returns {import('three').BufferGeometry}
   */
  buildGeometry(rng) {
    const parts = [];

    // Faint jitter so a basket of taros isn't identical (tone only).
    const skinJit = rng() < 0.5 ? 0x000000 : 0x040304;
    const skin = SKIN - skinJit;

    // --- BODY: a plump elongated ovoid lying on its side (long axis = X).
    //     Vertical gradient = darker underside (SKIN_LO) up to a dusty top
    //     (SKIN_HI) so the tuber reads rounded and earthy. ---
    parts.push(
      sph(0.78, SKIN_LO, {
        ws: 11,
        hs: 7,
        sx: 1.5,
        sy: 0.94,
        sz: 0.94,
        hex2: SKIN_HI,
      }),
    );
    // Tapered tail lobe at +X so it reads as a root, not a ball.
    parts.push(
      sph(0.46, skin, {
        ws: 8,
        hs: 4,
        sx: 1.05,
        sy: 0.86,
        sz: 0.86,
        x: 0.82,
        hex2: SKIN_HI,
      }),
    );

    // --- CUT FACE: the lower-rear end sliced flat, exposing pale taro flesh.
    //     A thin lilac disc set against the body (cylinder laid on its side so
    //     its flat cap faces -X), plus a brighter raised core so the flesh
    //     reads from afar. ---
    // pale flesh disc (the trimmed cross-section)
    parts.push(cyl(0.62, 0.6, 0.1, 14, FLESH, { x: -1.06, rz: HALF_PI, hex2: FLESH_HI }));
    // brighter inner core of the cut face
    parts.push(cyl(0.4, 0.42, 0.08, 10, FLESH_HI, { x: -1.11, rz: HALF_PI, hex2: FLESH }));

    // --- ROOT WHISKERS: a few thin dark lines raked across the skin, the
    //     wispy fibres a freshly pulled corm keeps. Long thin boxes hugging the
    //     surface at varied angles. ---
    parts.push(box(1.5, 0.06, 0.06, WHISKER, { x: 0.0, y: 0.18, z: 0.5, rx: 0.18, ry: 0.06 }));
    parts.push(box(1.3, 0.05, 0.05, WHISKER, { x: 0.1, y: 0.5, z: 0.18, rz: 0.1, ry: -0.12 }));
    parts.push(box(1.2, 0.05, 0.05, WHISKER, { x: -0.05, y: 0.34, z: -0.42, rx: -0.14, ry: 0.1 }));
    parts.push(box(0.9, 0.05, 0.05, WHISKER, { x: 0.55, y: -0.1, z: 0.36, rz: -0.12, ry: 0.2 }));

    return finish(parts);
  },
};

export default COL_DAJIA_TARO;
