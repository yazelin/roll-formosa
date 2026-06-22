/**
 * @file packs/taoyuan/landmarks/daxi_oldstreet.js — Roll Formosa Taoyuan pack.
 *
 * 大溪老街和平老街 (Daxi Old Street / Heping Old Street) — the most famous
 * historic street in Taoyuan, lined with stunning baroque-style shophouse
 * facades (閩南巴洛克) built during the Japanese colonial era. The ornate
 * parapets feature Western-style decorations mixed with traditional Chinese
 * motifs. The street is renowned for its dried tofu (豆乾) and wood crafts.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js); finish()
 * merges → recenters → normalizes to a UNIT bounding sphere (radius 1).
 *
 * Palette: warm cream facades, terracotta accents, ornate stone decorations.
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Archetype} Archetype */

// ---- palette ----------------------------------------------------------------
const FACADE = 0xe8dcc8; // cream baroque facade
const FACADE_D = 0xd0c4b0; // shadowed facade
const TERRACOTTA = 0xc87848; // terracotta decorations
const STONE = 0xc8c0b0; // stone trim
const ROOF = 0x4a4642; // dark tile roof
const WOOD = 0x6a4a30; // wood shopfront

export const NM_DAXI_OLDSTREET = {
  id: 'daxi_oldstreet',
  name: '大溪老街',
  landmarkId: 1, // small-medium landmark
  dioramaRHint: 25, // ~30 m row of baroque shophouses
  colorHex: FACADE,

  buildGeometry(rng) {
    const parts = [];

    // === ROW OF BAROQUE SHOPHOUSES ==========================================
    // Three connected shophouse units with ornate parapets
    const shopX = [-1.2, 0, 1.2];
    const parapetH = [0.7, 0.85, 0.65]; // varying parapet heights

    for (let i = 0; i < 3; i++) {
      const x = shopX[i];
      const h = parapetH[i];

      // Main building body
      parts.push(box(1.1, 1.4, 1.2, FACADE, { x, y: 0.7, hex2: FACADE_D }));

      // Baroque parapet (raised decorative wall above roofline)
      parts.push(box(1.15, h, 0.15, FACADE, { x, y: 1.4 + h / 2, z: 0.55 }));

      // Curved pediment on top of parapet
      parts.push(cyl(0.45, 0.45, 0.12, 8, FACADE, {
        rx: HALF_PI,
        theta0: 0,
        thetaLen: PI,
        x,
        y: 1.4 + h + 0.15,
        z: 0.55,
      }));

      // Decorative pilasters on parapet
      parts.push(box(0.1, h + 0.2, 0.08, STONE, { x: x - 0.48, y: 1.45 + h / 2, z: 0.6 }));
      parts.push(box(0.1, h + 0.2, 0.08, STONE, { x: x + 0.48, y: 1.45 + h / 2, z: 0.6 }));

      // Terracotta decorative band
      parts.push(box(1.0, 0.08, 0.06, TERRACOTTA, { x, y: 1.55, z: 0.6 }));

      // Shop arcade (騎樓)
      parts.push(box(1.0, 0.08, 0.5, FACADE_D, { x, y: 1.42, z: 0.85 })); // arcade ceiling
      parts.push(cyl(0.08, 0.08, 1.35, 6, STONE, { x: x - 0.45, y: 0.68, z: 1.05 })); // column
      parts.push(cyl(0.08, 0.08, 1.35, 6, STONE, { x: x + 0.45, y: 0.68, z: 1.05 })); // column

      // Wood shopfront
      parts.push(box(0.9, 0.7, 0.08, WOOD, { x, y: 0.35, z: 0.58 }));
    }

    // === ROOF (behind parapets) ==============================================
    parts.push(box(4.0, 0.4, 1.0, ROOF, { y: 1.65, z: -0.1 }));

    // === STREET / GROUND =====================================================
    parts.push(box(4.2, 0.1, 1.6, 0x9a9088, { y: 0.05, z: 1.4 })); // stone street

    // === SHOP SIGNS ==========================================================
    parts.push(box(0.4, 0.2, 0.04, 0xc83020, { x: -1.2, y: 1.15, z: 0.65 })); // red sign
    parts.push(box(0.35, 0.18, 0.04, 0x2860a0, { x: 0, y: 1.12, z: 0.65 })); // blue sign
    parts.push(box(0.38, 0.2, 0.04, 0x38a038, { x: 1.2, y: 1.18, z: 0.65 })); // green sign

    return finish(parts);
  },
};

export default NM_DAXI_OLDSTREET;
