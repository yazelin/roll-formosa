/**
 * @file packs/taipei/archetypes/t3.js — Roll Formosa Taipei pack, Tier 3
 * (機車海 / scooter-sea street). 10 ArchetypeDefs in the FROZEN slot order
 * declared by tiers.js T3.archetypeIds. Size band 0.5–2.5 m.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js): every
 * buildGeometry returns finish([...painted primitives]) — merged, recentered,
 * normalized to a UNIT bounding sphere (radius 1). Tri budget <= 350 per id
 * (cyl/sph radial segs kept at 6–10). rng() drives only small cosmetic
 * variation, never structure (determinism).
 *
 * Palette mood: 暮色機車海 藍紫起調 (dusk street, blue-purple onset) — but each
 * object keeps its own true-to-life Taipei street colors so it stays legible.
 *
 * Slots [0..7] absorbable street objects; slots [8..9] (夜市拱門 / 廟前牌樓)
 * are repeatable CHUNK LANDMARKS (lower spawnWeight, bigger).
 */

import {
  box, cyl, cone, sph, torus, finish, PI, HALF_PI,
} from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} ArchetypeDef */

/* yOffset note: finish() recenters on the bounding-sphere center, so an object
 * built symmetric about y=0 ends roughly centered. The engine rest convention
 * is yOffset = -1 - minY_normalized; for our ground-sitting builds (taller than
 * wide, base near sphere bottom) that lands around -0.5..-0.85. Small tumbling
 * items use 0. Values below are tuned per build's vertical mass distribution. */

/** @type {ArchetypeDef[]} */
export const T3_ARCHETYPES = [
  /* 0 ── 機車 scooter ─────────────────────────────────────────────────── */
  {
    id: 'scooter',
    displayName: '機車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.9,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x2b2f4a, 0xc4203a, 0xe8e8ee, 0x1a1c2a, 0x7a8090],
    yOffset: -0.33,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const body = rng() < 0.5 ? 0xc4203a : 0x2f6db0; // red or blue scooter
      const parts = [];
      // floorboard / step-through deck
      parts.push(box(1.5, 0.12, 0.5, 0x1a1c2a, { x: 0, y: 0.32 }));
      // rear body / seat hump
      parts.push(box(0.9, 0.45, 0.46, body, { x: 0.45, y: 0.62 }));
      parts.push(box(0.72, 0.16, 0.42, 0x14151f, { x: 0.42, y: 0.9 })); // seat
      // front leg-shield rising to handlebars
      parts.push(box(0.34, 0.95, 0.44, body, { x: -0.62, y: 0.72 }));
      // headlight nacelle
      parts.push(box(0.22, 0.26, 0.4, 0xe8e8ee, { x: -0.78, y: 1.12 }));
      // handlebars
      parts.push(cyl(0.035, 0.035, 0.62, 6, 0x7a8090, { x: -0.74, y: 1.32, rx: HALF_PI }));
      // mirror stalks
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: 0.3, ws: 6, hs: 4 }));
      parts.push(sph(0.07, 0x1a1c2a, { x: -0.74, y: 1.42, z: -0.3, ws: 6, hs: 4 }));
      // two wheels (z-axis cylinders -> rotate so round face faces side)
      const wheel = (wx) => [
        cyl(0.3, 0.3, 0.16, 10, 0x14151f, { x: wx, y: 0.3, rx: HALF_PI }),
        cyl(0.13, 0.13, 0.17, 8, 0x7a8090, { x: wx, y: 0.3, rx: HALF_PI }),
      ];
      parts.push(...wheel(-0.66));
      parts.push(...wheel(0.66));
      return finish(parts);
    },
  },

  /* 1 ── 小貨車 mini truck (blue Kei-style pickup) ─────────────────────── */
  {
    id: 'mini_truck',
    displayName: '小貨車',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.6,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0x2f6db0, 0xd8dde4, 0x1a1c2a, 0x9aa0ac, 0x3a3f52],
    yOffset: -0.61,
    upright: true,
    collisionScale: 0.78,
    buildGeometry(rng) {
      const cab = rng() < 0.5 ? 0x2f6db0 : 0xd8dde4;
      const parts = [];
      // flatbed deck
      parts.push(box(2.0, 0.22, 1.0, 0x9aa0ac, { x: 0.35, y: 0.55 }));
      // bed side rails
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: 0.47 }));
      parts.push(box(2.0, 0.3, 0.06, 0x7d828e, { x: 0.35, y: 0.78, z: -0.47 }));
      parts.push(box(0.06, 0.3, 1.0, 0x7d828e, { x: 1.32, y: 0.78 })); // tailgate
      // cab
      parts.push(box(0.85, 0.7, 1.0, cab, { x: -0.95, y: 0.85 }));
      // windshield (darker)
      parts.push(box(0.06, 0.42, 0.86, 0x1a2330, { x: -0.55, y: 1.0 }));
      // front bumper / face
      parts.push(box(0.18, 0.4, 1.02, 0x3a3f52, { x: -1.42, y: 0.55 }));
      // headlights
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: 0.34 }));
      parts.push(box(0.06, 0.12, 0.18, 0xfff2cc, { x: -1.46, y: 0.62, z: -0.34 }));
      // 4 wheels
      const wheel = (wx, wz) => cyl(0.28, 0.28, 0.18, 10, 0x14151f, { x: wx, y: 0.28, z: wz, rx: HALF_PI });
      parts.push(wheel(-0.9, 0.52), wheel(-0.9, -0.52), wheel(0.9, 0.52), wheel(0.9, -0.52));
      return finish(parts);
    },
  },

  /* 2 ── 老街木招牌 Shennong-St wooden hanging shop sign on a bracket ──── */
  {
    id: 'oldstreet_wood_sign',
    displayName: '老街木招牌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 0.7,
    radiusJitter: 0.14,
    spawnWeight: 1.0,
    palette: [0x7a4a24, 0x5e3818, 0xc8a050, 0xb01f2e, 0xe8d8b0],
    yOffset: -0.18,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const wood = 0x7a4a24; // dark aged wood
      const dark = 0x5e3818;
      const gold = 0xc8a050;
      const parts = [];
      // upright wall post the bracket bolts onto
      parts.push(box(0.22, 2.4, 0.22, dark, { x: -0.7, y: 1.2, hex2: wood }));
      // horizontal bracket arm jutting out
      parts.push(box(1.0, 0.16, 0.16, wood, { x: -0.2, y: 2.1 }));
      // little diagonal brace under the arm
      parts.push(box(0.7, 0.1, 0.1, dark, { x: -0.35, y: 1.78, rz: 0.7 }));
      // two short chains/hooks holding the board
      parts.push(cyl(0.03, 0.03, 0.34, 5, gold, { x: -0.05, y: 1.86 }));
      parts.push(cyl(0.03, 0.03, 0.34, 5, gold, { x: 0.5, y: 1.86 }));
      // tall hanging wooden sign board (calligraphy shop sign)
      parts.push(box(0.66, 1.4, 0.12, wood, { x: 0.22, y: 1.0, hex2: 0x8a5a30 }));
      // carved gold frame edge
      parts.push(box(0.7, 0.1, 0.14, gold, { x: 0.22, y: 1.68 }));
      parts.push(box(0.7, 0.1, 0.14, gold, { x: 0.22, y: 0.32 }));
      // red lacquer character panel down the middle
      parts.push(box(0.32, 1.0, 0.16, 0xb01f2e, { x: 0.22, y: 1.0, hex2: 0x8a1822 }));
      // three gold "character" blocks suggesting carved text
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.2, 0.18, 0.04, gold, { x: 0.22, y: 1.34 - i * 0.34, z: 0.1 }));
      }
      return finish(parts);
    },
  },

  /* 3 ── 海安路彩繪牆 free-standing street-art mural wall ──────────────── */
  {
    id: 'haian_mural',
    displayName: '海安路彩繪牆',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.1,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xb8b0a2, 0xff5c5c, 0x32a0d8, 0xffcf3a, 0x4fb86a, 0x9a5cc4],
    yOffset: -0.2044,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const concrete = 0xb8b0a2;
      const frame = 0x8c857a;
      const colors = [0xff5c5c, 0x32a0d8, 0xffcf3a, 0x4fb86a, 0x9a5cc4];
      const parts = [];
      // rough concrete wall panel (tall rectangle)
      parts.push(box(0.18, 2.6, 1.9, concrete, { x: 0, y: 1.3, hex2: 0xa39b8e }));
      // concrete frame edges
      parts.push(box(0.24, 2.7, 0.14, frame, { x: 0, y: 1.3, z: 0.95 }));
      parts.push(box(0.24, 2.7, 0.14, frame, { x: 0, y: 1.3, z: -0.95 }));
      parts.push(box(0.24, 0.16, 1.9, frame, { x: 0, y: 2.55 }));
      parts.push(box(0.24, 0.16, 1.9, frame, { x: 0, y: 0.08 }));
      // colorful blocky mural patches on the wall face
      const patches = [
        [2.1, 0.5, 0.7, 0.7],
        [1.6, -0.45, 0.55, 0.6],
        [1.1, 0.35, 0.5, 0.45],
        [0.7, -0.3, 0.45, 0.5],
        [1.85, -0.15, 0.4, 0.4],
        [0.35, 0.3, 0.4, 0.45],
      ];
      for (let i = 0; i < patches.length; i++) {
        const [py, pz, ph, pd] = patches[i];
        parts.push(box(0.05, ph, pd, colors[i % colors.length], { x: 0.11, y: py, z: pz }));
      }
      return finish(parts);
    },
  },

  /* 4 ── 鐵捲門 roll-up shutter (shopfront) ────────────────────────────── */
  {
    id: 'roll_shutter',
    displayName: '鐵捲門',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.8,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xa9adb6, 0x7c818c, 0x5a5e68, 0xc9ccd2, 0x3a3d46],
    yOffset: -0.3,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const metal = rng() < 0.5 ? 0xa9adb6 : 0xb0a878; // grey or beige shutter
      const parts = [];
      // side frame channels
      parts.push(box(0.14, 2.4, 0.14, 0x5a5e68, { x: -1.3, y: 1.2 }));
      parts.push(box(0.14, 2.4, 0.14, 0x5a5e68, { x: 1.3, y: 1.2 }));
      // shutter face = stack of horizontal slats (alternating shade)
      const slats = 11;
      for (let i = 0; i < slats; i++) {
        const y = 0.25 + i * 0.2;
        const shade = i % 2 === 0 ? metal : 0x7c818c;
        parts.push(box(2.5, 0.18, 0.08, shade, { x: 0, y, z: 0 }));
      }
      // roll housing box on top
      parts.push(box(2.7, 0.4, 0.34, 0x3a3d46, { x: 0, y: 2.5 }));
      parts.push(cyl(0.18, 0.18, 2.5, 8, 0x4a4e58, { x: 0, y: 2.5, rz: HALF_PI }));
      // bottom rail
      parts.push(box(2.6, 0.16, 0.14, 0x3a3d46, { x: 0, y: 0.12 }));
      return finish(parts);
    },
  },

  /* 5 ── 鳳凰木 flame tree (Tainan's city tree, fiery orange-red bloom) ── */
  {
    id: 'flame_tree',
    displayName: '鳳凰木',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.4,
    radiusJitter: 0.18,
    spawnWeight: 1.0,
    palette: [0x5a3d28, 0xe0461f, 0xf26a28, 0x2f6b39, 0x7a5a3a],
    yOffset: -0.05,
    upright: true,
    collisionScale: 0.62,
    buildGeometry(rng) {
      const parts = [];
      // trunk
      parts.push(cyl(0.18, 0.26, 1.3, 7, 0x5a3d28, { x: 0, y: 0.65, hex2: 0x7a5a3a }));
      // a couple of spreading branches (flame trees have a wide flat crown)
      parts.push(cyl(0.1, 0.14, 1.0, 6, 0x6a4a2c, { x: -0.5, y: 1.5, rz: 0.6 }));
      parts.push(cyl(0.1, 0.14, 1.0, 6, 0x6a4a2c, { x: 0.5, y: 1.5, rz: -0.6 }));
      // broad, flat-topped canopy of fiery red-orange blossom blobs
      const fire = [0xe0461f, 0xf26a28, 0xd83518];
      const blobs = [
        [0, 2.1, 0, 1.0],
        [0.85, 1.95, 0.25, 0.62],
        [-0.85, 2.0, -0.2, 0.64],
        [0.3, 2.25, -0.6, 0.58],
        [-0.35, 2.2, 0.6, 0.56],
        [0.0, 2.4, 0.0, 0.52],
      ];
      for (let i = 0; i < blobs.length; i++) {
        const [bx, by, bz, br] = blobs[i];
        const c = fire[i % fire.length];
        parts.push(sph(br, c, { x: bx, y: by, z: bz, ws: 6, hs: 4, hex2: 0xf2843a }));
      }
      // a few green leaf clumps peeking under the blossoms
      parts.push(sph(0.42, 0x2f6b39, { x: 0.6, y: 1.7, z: -0.3, ws: 5, hs: 3 }));
      parts.push(sph(0.4, 0x245029, { x: -0.55, y: 1.72, z: 0.34, ws: 5, hs: 3 }));
      return finish(parts);
    },
  },

  /* 6 ── 老街燈籠串 Shennong-St red lantern string strung across the lane ─ */
  {
    id: 'oldstreet_lantern',
    displayName: '老街燈籠串',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.7,
    radiusJitter: 0.16,
    spawnWeight: 1.0,
    palette: [0xb01f2e, 0xe04a2a, 0xf0c040, 0x5e3818, 0x3a2a22],
    yOffset: -0.43,
    upright: true,
    collisionScale: 0.6,
    buildGeometry(rng) {
      const wood = 0x5e3818;
      const red = 0xb01f2e;
      const gold = 0xf0c040;
      const parts = [];
      // two wooden poles either side of the lane
      parts.push(cyl(0.1, 0.12, 2.6, 6, wood, { x: -1.9, y: 1.3, hex2: 0x7a4a24 }));
      parts.push(cyl(0.1, 0.12, 2.6, 6, wood, { x: 1.9, y: 1.3, hex2: 0x7a4a24 }));
      // the strung wire/beam across the top (slight sag look via flat beam)
      parts.push(box(3.9, 0.06, 0.06, 0x2a1c14, { x: 0, y: 2.5 }));
      // row of red lanterns hanging from the wire (kept low-tri)
      const xs = [-1.3, 0.0, 1.3];
      for (let i = 0; i < xs.length; i++) {
        const lx = xs[i];
        const drop = 0.1 + (i % 2) * 0.12; // slight stagger
        const cy = 2.0 - drop;
        // cord
        parts.push(cyl(0.025, 0.025, 0.3, 4, 0x2a1c14, { x: lx, y: cy + 0.42 }));
        // bulbous lantern body (low seg count)
        parts.push(sph(0.32, red, { ws: 6, hs: 4, sy: 1.15, x: lx, y: cy, hex2: 0xe04a2a }));
        // gold top cap + tassel
        parts.push(cyl(0.13, 0.13, 0.06, 6, gold, { x: lx, y: cy + 0.32 }));
        parts.push(cone(0.07, 0.16, 5, gold, { x: lx, y: cy - 0.46 }));
      }
      return finish(parts);
    },
  },

  /* 7 ── 劍獅門牌 Anping sword-lion door plaque (fierce face biting blade) ─ */
  {
    id: 'sword_lion_plaque',
    displayName: '劍獅門牌',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 1.0,
    radiusJitter: 0.13,
    spawnWeight: 1.0,
    palette: [0xd8c9a8, 0xc24a30, 0xf0c040, 0x2a2c34, 0xb8b0a2],
    yOffset: -0.16,
    upright: true,
    collisionScale: 0.7,
    buildGeometry(rng) {
      const plaster = 0xd8c9a8; // pale plaster wall
      const face = 0xc24a30;    // ruddy painted lion face
      const gold = 0xf0c040;
      const dark = 0x2a2c34;
      const parts = [];
      // small whitewashed wall section the plaque is mounted on
      parts.push(box(1.7, 1.9, 0.3, plaster, { x: 0, y: 0.95, hex2: 0xe6dcc4 }));
      // brick coping along the top of the wall
      parts.push(box(1.8, 0.18, 0.4, 0x9a5a3a, { x: 0, y: 1.96 }));
      // round lion-face medallion (disc facing forward)
      parts.push(cyl(0.7, 0.7, 0.16, 10, face, { x: 0, y: 1.15, z: 0.2, rx: HALF_PI, hex2: 0xd85a3a }));
      // domed lion face
      parts.push(sph(0.6, face, { x: 0, y: 1.15, z: 0.28, ws: 8, hs: 5, hex2: 0xd85a3a }));
      // curly mane bumps around the face (8 around)
      const mane = 8;
      for (let i = 0; i < mane; i++) {
        const a = (i / mane) * PI * 2;
        parts.push(sph(0.16, gold, { x: Math.cos(a) * 0.66, y: 1.15 + Math.sin(a) * 0.66, z: 0.18, ws: 4, hs: 3 }));
      }
      // fierce round eyes + nose
      parts.push(sph(0.11, dark, { x: -0.2, y: 1.26, z: 0.6, ws: 4, hs: 3 }));
      parts.push(sph(0.11, dark, { x: 0.2, y: 1.26, z: 0.6, ws: 4, hs: 3 }));
      parts.push(sph(0.1, 0x8a1822, { x: 0, y: 1.08, z: 0.62, ws: 4, hs: 3 }));
      // the sword clenched across the mouth (diagonal blade + hilt)
      parts.push(box(1.5, 0.1, 0.1, 0xc8ccd4, { x: 0, y: 0.95, z: 0.62, rz: 0.5 }));
      parts.push(box(0.3, 0.16, 0.12, gold, { x: -0.56, y: 0.7, z: 0.62, rz: 0.5 })); // hilt guard
      return finish(parts);
    },
  },

  /* 8 ── 神農街牌坊 Shennong St paifang gateway (CHUNK LANDMARK) ───────── */
  {
    id: 'shennong_arch',
    displayName: '神農街牌坊',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xb01f2e, 0xe8b53a, 0x1f5c3a, 0xd8d3c5, 0x6e6a5e, 0x2a2c34],
    yOffset: -0.3207,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const red = 0xb01f2e;
      const gold = 0xe8b53a;
      const green = 0x1f5c3a;
      const stone = 0xd8d3c5;
      const parts = [];
      // four upright posts (two pairs, fore & aft)
      const posts = [[-1.9, 0.4], [1.9, 0.4], [-1.9, -0.4], [1.9, -0.4]];
      for (const [px, pz] of posts) {
        parts.push(cyl(0.2, 0.24, 3.2, 8, red, { x: px, y: 1.9, z: pz }));
        // stone plinth foot
        parts.push(box(0.6, 0.4, 0.6, stone, { x: px, y: 0.2, z: pz, hex2: 0x6e6a5e }));
      }
      // horizontal cross beams joining the posts
      parts.push(box(4.4, 0.3, 0.4, gold, { x: 0, y: 3.5 }));
      parts.push(box(4.0, 0.2, 0.34, red, { x: 0, y: 3.16 }));
      // central plaque board
      parts.push(box(1.1, 0.6, 0.16, 0x2a2c34, { x: 0, y: 3.5, z: 0.42 }));
      parts.push(box(0.9, 0.44, 0.04, gold, { x: 0, y: 3.5, z: 0.51 }));
      // small tiled roof crown on top (two pitched slabs)
      parts.push(box(4.6, 0.16, 0.8, green, { x: 0, y: 3.86, z: 0.36, rx: -0.34 }));
      parts.push(box(4.6, 0.16, 0.8, green, { x: 0, y: 3.86, z: -0.36, rx: 0.34 }));
      // ridge with swallowtail eave tips
      parts.push(box(4.6, 0.14, 0.16, gold, { x: 0, y: 4.12 }));
      parts.push(cone(0.16, 0.44, 6, gold, { x: -2.3, y: 4.26, rz: 0.5 }));
      parts.push(cone(0.16, 0.44, 6, gold, { x: 2.3, y: 4.26, rz: -0.5 }));
      return finish(parts);
    },
  },

  /* 9 ── 劍獅柱 sword-lion pillar (CHUNK LANDMARK) ─────────────────────── */
  {
    id: 'sword_lion_pillar',
    displayName: '劍獅柱',
    tier: 3,
    naturalBand: 3,
    radiusNominal: 2.5,
    radiusJitter: 0.12,
    spawnWeight: 0.3,
    palette: [0xc6bfae, 0x9c9686, 0xd8d3c5, 0xb01f2e, 0x6e6a5e, 0xe8b53a],
    yOffset: -0.054,
    upright: true,
    collisionScale: 0.55,
    buildGeometry(rng) {
      const stone = 0xc6bfae;
      const stone2 = 0xd8d3c5;
      const dark = 0x6e6a5e;
      const parts = [];
      // stone plinth base
      parts.push(box(1.0, 0.5, 1.0, 0x9c9686, { x: 0, y: 0.25, hex2: dark }));
      // tapered stone column
      parts.push(cyl(0.42, 0.55, 2.6, 8, stone, { x: 0, y: 1.8, hex2: stone2 }));
      // capital ring under the medallion
      parts.push(cyl(0.6, 0.5, 0.24, 8, stone2, { x: 0, y: 3.2 }));
      // round sword-lion medallion (disc facing forward)
      parts.push(cyl(0.7, 0.7, 0.22, 8, stone2, { x: 0, y: 3.7, z: 0.12, rx: HALF_PI }));
      // fierce little lion face on the medallion
      parts.push(sph(0.5, stone, { x: 0, y: 3.7, z: 0.24, ws: 7, hs: 4 }));
      // mane bumps around the face
      parts.push(sph(0.2, dark, { x: -0.4, y: 4.0, z: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.2, dark, { x: 0.4, y: 4.0, z: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.2, dark, { x: -0.4, y: 3.4, z: 0.15, ws: 5, hs: 3 }));
      parts.push(sph(0.2, dark, { x: 0.4, y: 3.4, z: 0.15, ws: 5, hs: 3 }));
      // eyes
      parts.push(sph(0.1, 0x2a2c34, { x: -0.16, y: 3.82, z: 0.6, ws: 4, hs: 3 }));
      parts.push(sph(0.1, 0x2a2c34, { x: 0.16, y: 3.82, z: 0.6, ws: 4, hs: 3 }));
      // sword the lion bites (crossing the mouth, diagonal)
      parts.push(box(1.3, 0.1, 0.1, 0xb8c0c8, { x: 0, y: 3.5, z: 0.55, rz: 0.5 }));
      parts.push(box(0.34, 0.18, 0.12, 0xe8b53a, { x: -0.5, y: 3.22, z: 0.55, rz: 0.5 })); // hilt guard
      return finish(parts);
    },
  },
];

export default T3_ARCHETYPES;
