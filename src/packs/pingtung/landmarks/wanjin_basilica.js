/**
 * @file packs/pingtung/landmarks/wanjin_basilica.js — Roll Formosa Pingtung pack.
 *
 * 萬金聖母聖殿 (Wanjin Basilica / Immaculate Conception Church, 萬巒 Wanluan, 屏東).
 * Taiwan's oldest Catholic church (1870), a striking white Spanish colonial-style
 * facade with a prominent central bell tower flanked by two shorter corner turrets,
 * featuring a distinctive cream-white stucco exterior.
 *
 * Built with engine geometry vocabulary (geomHelpers.js). finish() merges → recenters
 * → normalizes to a UNIT bounding sphere (radius 1). <= 600 triangles (hero budget).
 */

import { box, cyl, cone, sph, finish, PI, HALF_PI } from '../geomHelpers.js';

// Palette — Spanish colonial church (白色灰泥牆 + 磚紅屋瓦).
const WHITE = 0xf5f2ea;      // cream-white stucco facade
const WHITE_D = 0xd8d5cc;    // shadow side
const TILE = 0xb86b4a;       // terracotta roof tiles
const TILE_D = 0x8f523a;     // darker tile underside
const PORTAL = 0x5a4a3a;     // dark wooden door
const CROSS = 0xd4af37;      // golden cross

const OCT = HALF_PI / 4;     // PI/8 — orient octagon flat faces forward

export const NM_WANJIN_BASILICA = {
  id: 'wanjin_basilica',
  name: '萬金聖母聖殿',
  dioramaRHint: 15,
  colorHex: 0xf5f2ea,
  buildGeometry(rng) {
    const r = (rng() - 0.5) * 0.02;
    const parts = [];

    // ---- Main nave body ----
    parts.push(box(0.9, 0.55, 1.2, WHITE, { y: 0.275, z: -0.3, hex2: WHITE_D }));
    // Gabled roof over nave
    parts.push(cyl(0.0, 0.52, 1.2, 4, TILE, { rz: HALF_PI, ry: HALF_PI, y: 0.55 + 0.15, z: -0.3, hex2: TILE_D }));

    // ---- Western facade wall ----
    parts.push(box(1.1, 0.7, 0.15, WHITE, { y: 0.35, z: 0.35, hex2: WHITE_D }));

    // ---- Central bell tower ----
    parts.push(box(0.32, 0.55, 0.28, WHITE, { y: 0.7 + 0.275, z: 0.3, hex2: WHITE_D }));
    // Bell opening (dark recess)
    parts.push(box(0.14, 0.12, 0.06, PORTAL, { y: 1.05, z: 0.44 }));
    // Tower roof (pyramidal)
    parts.push(cone(0.22, 0.35, 4, TILE, { ry: OCT, y: 0.7 + 0.55 + 0.175, z: 0.3, hex2: TILE_D }));
    // Cross on central tower
    parts.push(box(0.025, 0.14, 0.025, CROSS, { x: r, y: 1.62, z: 0.3 }));
    parts.push(box(0.08, 0.025, 0.025, CROSS, { x: r, y: 1.65, z: 0.3 }));

    // ---- Left corner turret ----
    parts.push(cyl(0.12, 0.13, 0.55, 8, WHITE, { ry: OCT, x: -0.48, y: 0.275, z: 0.35, hex2: WHITE_D }));
    parts.push(cone(0.16, 0.25, 8, TILE, { ry: OCT, x: -0.48, y: 0.55 + 0.125, z: 0.35, hex2: TILE_D }));
    parts.push(sph(0.03, CROSS, { x: -0.48, y: 0.8, z: 0.35 }));

    // ---- Right corner turret ----
    parts.push(cyl(0.12, 0.13, 0.55, 8, WHITE, { ry: OCT, x: 0.48, y: 0.275, z: 0.35, hex2: WHITE_D }));
    parts.push(cone(0.16, 0.25, 8, TILE, { ry: OCT, x: 0.48, y: 0.55 + 0.125, z: 0.35, hex2: TILE_D }));
    parts.push(sph(0.03, CROSS, { x: 0.48, y: 0.8, z: 0.35 }));

    // ---- Entrance portal (arched doorway) ----
    parts.push(box(0.22, 0.32, 0.08, PORTAL, { y: 0.16, z: 0.42 }));
    parts.push(cyl(0.11, 0.11, 0.08, 8, PORTAL, { rx: HALF_PI, y: 0.32, z: 0.42 }));

    // ---- Decorative circular window above portal ----
    parts.push(cyl(0.08, 0.08, 0.04, 12, 0xb8d4e8, { rx: HALF_PI, y: 0.52, z: 0.43 }));

    return finish(parts);
  },
};

export default NM_WANJIN_BASILICA;
