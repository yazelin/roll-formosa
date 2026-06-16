/**
 * @file waterRibbon.js — build a flat (XZ-plane) ribbon mesh from a centerline
 * polyline + width. Each segment between consecutive centerline points becomes
 * a quad (2 triangles), offset perpendicular to the segment by ±width/2. Y is
 * left 0 (the caller sets the water plane height). Real-meter coordinates.
 */

/**
 * @param {{x:number,z:number}[]} centerline >= 2 points, real meters.
 * @param {number} width ribbon width (real meters).
 * @returns {number[]} flat [x,y,z] triples, 6 verts (2 tris) per segment, y=0.
 */
export function ribbonQuads(centerline, width) {
  const out = [];
  const h = width / 2;
  for (let i = 0; i < centerline.length - 1; i++) {
    const a = centerline[i];
    const b = centerline[i + 1];
    let dx = b.x - a.x;
    let dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    dx /= len; dz /= len;
    // perpendicular in XZ: (-dz, dx)
    const px = -dz * h;
    const pz = dx * h;
    const a0x = a.x + px, a0z = a.z + pz;
    const a1x = a.x - px, a1z = a.z - pz;
    const b0x = b.x + px, b0z = b.z + pz;
    const b1x = b.x - px, b1z = b.z - pz;
    // tri 1: a0,b0,b1   tri 2: a0,b1,a1   (CCW from +Y)
    out.push(a0x, 0, a0z, b0x, 0, b0z, b1x, 0, b1z);
    out.push(a0x, 0, a0z, b1x, 0, b1z, a1x, 0, a1z);
  }
  return out;
}
