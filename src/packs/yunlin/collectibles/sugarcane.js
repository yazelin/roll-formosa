/**
 * @file packs/yunlin/collectibles/sugarcane.js — Roll Formosa Yunlin pack, COLLECTIBLE.
 *
 * COL_SUGARCANE — 甘蔗 (Sugarcane). Yunlin has a long history of sugarcane cultivation,
 * with the old Huwei Sugar Factory as a historic landmark. A bundle of purple-red
 * sugarcane stalks with characteristic nodes and green leaves.
 *
 * Built ONLY with the engine geometry vocabulary (geomHelpers.js).
 */

import { cyl, cone, box, finish, PI, HALF_PI } from '../geomHelpers.js';

/** @typedef {import('../../../types.js').Collectible} Collectible */

const CANE = 0x6a2838;        // purple-red sugarcane
const CANE_HI = 0x8a3848;     // cane highlight
const NODE = 0x5a2030;        // darker nodes
const LEAF = 0x4a8a38;        // green leaves
const LEAF_HI = 0x6aaa58;     // leaf highlight

export const COL_SUGARCANE = {
  id: 'sugarcane',
  name: '甘蔗',
  colorHex: 0x6a2838,

  buildGeometry(rng) {
    const j = (rng() - 0.5) * 0.02;
    const parts = [];

    // Main stalk 1 (center)
    parts.push(cyl(0.1, 0.1, 0.9, 6, CANE, { y: 0.45, hex2: CANE_HI }));
    // Nodes on stalk 1
    parts.push(cyl(0.12, 0.12, 0.04, 6, NODE, { y: 0.2 }));
    parts.push(cyl(0.12, 0.12, 0.04, 6, NODE, { y: 0.5 }));
    parts.push(cyl(0.12, 0.12, 0.04, 6, NODE, { y: 0.8 }));

    // Main stalk 2 (left)
    parts.push(cyl(0.09, 0.09, 0.8, 6, CANE, { x: -0.18, y: 0.4, rz: 0.08, hex2: CANE_HI }));
    // Nodes on stalk 2
    parts.push(cyl(0.11, 0.11, 0.035, 6, NODE, { x: -0.16, y: 0.18 }));
    parts.push(cyl(0.11, 0.11, 0.035, 6, NODE, { x: -0.18, y: 0.45 }));
    parts.push(cyl(0.11, 0.11, 0.035, 6, NODE, { x: -0.2, y: 0.72 }));

    // Main stalk 3 (right)
    parts.push(cyl(0.085, 0.085, 0.75, 6, CANE, { x: 0.16, y: 0.375, rz: -0.06, hex2: CANE_HI }));
    // Nodes on stalk 3
    parts.push(cyl(0.105, 0.105, 0.03, 6, NODE, { x: 0.15, y: 0.15 }));
    parts.push(cyl(0.105, 0.105, 0.03, 6, NODE, { x: 0.16, y: 0.42 }));
    parts.push(cyl(0.105, 0.105, 0.03, 6, NODE, { x: 0.17, y: 0.68 }));

    // Leaves on top
    // Central leaf cluster
    parts.push(box(0.06, 0.35, 0.02, LEAF, { y: 1.05 + j, rz: 0.1, hex2: LEAF_HI }));
    parts.push(box(0.05, 0.3, 0.02, LEAF, { y: 1.0, rz: -0.15, ry: 0.4, hex2: LEAF_HI }));
    parts.push(box(0.05, 0.28, 0.02, LEAF, { y: 0.98, rz: 0.2, ry: -0.5, hex2: LEAF_HI }));

    // Left stalk leaves
    parts.push(box(0.05, 0.25, 0.02, LEAF, { x: -0.22, y: 0.92, rz: 0.3, hex2: LEAF_HI }));
    parts.push(box(0.04, 0.22, 0.02, LEAF, { x: -0.2, y: 0.88, rz: -0.25, ry: 0.3, hex2: LEAF_HI }));

    // Right stalk leaves
    parts.push(box(0.045, 0.23, 0.02, LEAF, { x: 0.2, y: 0.88, rz: -0.28, hex2: LEAF_HI }));
    parts.push(box(0.04, 0.2, 0.02, LEAF, { x: 0.18, y: 0.85, rz: 0.22, ry: -0.35, hex2: LEAF_HI }));

    // Binding string/tie around bundle
    parts.push(cyl(0.22, 0.22, 0.03, 6, 0x8a6a4a, { y: 0.3 }));

    return finish(parts);
  },
};

export default COL_SUGARCANE;
