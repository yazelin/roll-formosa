/**
 * @file packs/yilan/collectibles/suao_fish.js — Roll Formosa Yilan pack.
 *
 * 蘇澳鮮魚 (Suao Fresh Fish) — collectibleId 5. A fresh fish from Suao
 * fishing port, famous for its seafood. Silver-scaled mackerel on ice.
 *
 * Authored with ONLY the engine geometry vocabulary (geomHelpers.js).
 * <= 350 triangles.
 */

import { cyl, cone, sph, box, finish, PI, HALF_PI } from '../geomHelpers.js';

const FISH_SILVER = 0xa8b8c8;   // silver fish scales
const FISH_BLUE = 0x6080a0;    // blue back
const FISH_BELLY = 0xe8e0d8;   // white belly
const EYE = 0x202020;          // fish eye
const FIN = 0x8898a8;          // fins
const ICE = 0xd0e8f8;          // ice chips

export const COL_SUAO_FISH = {
  id: 'col_suao_fish',
  name: '蘇澳鮮魚',
  collectibleId: 5,
  colorHex: 0xa8b8c8, // silver fish — the read color

  buildGeometry(rng) {
    const parts = [];

    // Ice bed
    parts.push(
      box(0.9, 0.08, 0.5, ICE, {
        y: 0.04,
      })
    );

    // Fish body - elongated oval
    parts.push(
      sph(0.35, FISH_SILVER, {
        y: 0.22,
        sx: 2.0,
        sy: 0.8,
        sz: 0.7,
        ws: 8,
        hs: 5,
        hex2: FISH_BLUE,
      })
    );

    // Fish belly (lighter underside)
    parts.push(
      sph(0.28, FISH_BELLY, {
        y: 0.16,
        sx: 1.8,
        sy: 0.4,
        sz: 0.5,
        ws: 7,
        hs: 4,
      })
    );

    // Fish head (larger front)
    parts.push(
      sph(0.18, FISH_SILVER, {
        x: 0.55,
        y: 0.22,
        sx: 1.2,
        ws: 6,
        hs: 4,
        hex2: FISH_BLUE,
      })
    );

    // Fish tail
    parts.push(
      cone(0.20, 0.25, 6, FIN, {
        x: -0.65,
        y: 0.22,
        rz: -HALF_PI,
        sx: 0.3,
      })
    );

    // Dorsal fin
    parts.push(
      cone(0.12, 0.18, 4, FIN, {
        x: 0.0,
        y: 0.40,
        rx: 0.2,
        sx: 0.3,
      })
    );

    // Eye
    parts.push(
      sph(0.04, EYE, {
        x: 0.62,
        y: 0.26,
        z: 0.12,
        ws: 4,
        hs: 3,
      })
    );

    // Ice chips around
    for (let i = 0; i < 5; i++) {
      const x = -0.3 + (rng ? rng() * 0.6 : i * 0.15);
      const z = -0.15 + (rng ? rng() * 0.3 : i * 0.05);
      parts.push(
        box(0.06, 0.04, 0.05, ICE, {
          x: x,
          y: 0.08,
          z: z,
        })
      );
    }

    return finish(parts);
  },
};

export default COL_SUAO_FISH;
