import { describe, it, expect } from 'vitest';
import { ribbonQuads } from './waterRibbon.js';

describe('waterRibbon', () => {
  it('a 2-point straight centerline (width 10) makes one quad (4 verts) offset perpendicular', () => {
    // centerline along +X; perpendicular is ±Z; width 10 -> ±5 in Z.
    const verts = ribbonQuads([{ x: 0, z: 0 }, { x: 100, z: 0 }], 10);
    // 1 segment -> 6 vertices (2 triangles), each [x,y,z]; y filled by caller (0 here).
    expect(verts.length).toBe(6 * 3);
    const zs = [];
    for (let i = 0; i < verts.length; i += 3) zs.push(verts[i + 2]);
    expect(Math.max(...zs)).toBeCloseTo(5, 5);
    expect(Math.min(...zs)).toBeCloseTo(-5, 5);
  });

  it('N-point centerline makes N-1 segments', () => {
    const v = ribbonQuads([{ x: 0, z: 0 }, { x: 50, z: 0 }, { x: 50, z: 50 }], 8);
    expect(v.length).toBe(2 * 6 * 3); // 2 segments
  });
});
