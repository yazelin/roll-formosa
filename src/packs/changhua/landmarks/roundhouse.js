/**
 * @file packs/changhua/landmarks/roundhouse.js — Roll Formosa Changhua pack.
 *
 * 扇形車庫 (Changhua Roundhouse / Fan-shaped Locomotive Depot). Built in 1922,
 * the only remaining operational fan-shaped roundhouse in Taiwan. Features a
 * semicircular building with 12 locomotive bays arranged in a fan pattern
 * around a central turntable. The roof is a series of triangular trusses
 * following the fan shape. Steam locomotives are serviced here.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 * <= 600 triangles (hero budget).
 */

import { box, cyl, finish, PI, HALF_PI } from '../geomHelpers.js';

const BRICK = 0x8c5a42;     // red brick wall
const BRICK_D = 0x6a4632;   // darker brick
const STEEL = 0x606870;     // steel truss / rail
const STEEL_D = 0x484e54;   // darker steel
const CONCRETE = 0xb0a898;  // concrete floor / base
const ROOF = 0x5a5048;      // dark roof tiles
const TRACK = 0x3a3838;     // rail track
const WINDOW = 0x85a8c0;    // window glass

export const NM_ROUNDHOUSE = {
  id: 'roundhouse',
  name: '扇形車庫',
  landmarkId: 10,
  dioramaRHint: 48,
  colorHex: BRICK,

  buildGeometry(rng) {
    const parts = [];

    // Central turntable platform (reduced segments)
    parts.push(cyl(0.55, 0.58, 0.12, 8, CONCRETE, { y: 0.06 }));
    parts.push(cyl(0.50, 0.50, 0.04, 8, TRACK, { y: 0.16 }));

    // Fan-shaped building - simplified to 6 bays
    const outerR = 1.6;
    const innerR = 0.75;
    const bayAngle = PI / 6;
    const startAngle = -HALF_PI + bayAngle * 0.5;

    for (let i = 0; i < 6; i++) {
      const angle = startAngle + i * bayAngle;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const midR = (outerR + innerR) / 2;
      const bayDepth = outerR - innerR;

      // Bay wall section
      parts.push(box(0.04, 0.42, bayDepth * 0.9, BRICK, {
        x: cosA * (midR + 0.10),
        z: sinA * (midR + 0.10),
        y: 0.27, ry: angle, hex2: BRICK_D,
      }));
    }

    // Curved back wall (reduced to 8 segments)
    for (let i = 0; i < 8; i++) {
      const angle = -HALF_PI + (i / 8) * PI;
      const x = Math.cos(angle) * outerR;
      const z = Math.sin(angle) * outerR;
      parts.push(box(0.40, 0.48, 0.08, BRICK, {
        x, z, y: 0.30, ry: angle, hex2: BRICK_D,
      }));
    }

    // Roof (single curved piece approximation)
    parts.push(cyl(1.55, 0.80, 0.10, 8, ROOF, {
      y: 0.72, thetaLen: PI, theta0: -HALF_PI,
    }));

    // Windows (reduced to 3)
    for (let i = 0; i < 3; i++) {
      const angle = startAngle + (i * 2 + 1) * bayAngle;
      const x = Math.cos(angle) * (outerR - 0.04);
      const z = Math.sin(angle) * (outerR - 0.04);
      parts.push(box(0.14, 0.18, 0.03, WINDOW, {
        x, z, y: 0.38, ry: angle,
      }));
    }

    // Simplified steam locomotive on turntable
    parts.push(box(0.30, 0.14, 0.12, 0x2a2a2a, { y: 0.24, z: 0 }));
    parts.push(box(0.12, 0.10, 0.12, 0x3a3a3a, { y: 0.22, z: 0.14 }));
    parts.push(cyl(0.04, 0.04, 0.08, 4, 0x444444, { y: 0.34, z: -0.08 }));

    return finish(parts);
  },
};

export default NM_ROUNDHOUSE;
