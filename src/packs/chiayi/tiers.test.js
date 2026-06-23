import { describe, it, expect } from 'vitest';
import { ARCH_PER_TIER } from '../../config/tiers.js';
import { START_RADIUS_M, MOON_DIR_MIN_ELEV } from '../../config/tuning.js';
import { TIERS } from './tiers.js';

describe('taipei tier ladder', () => {
  it('has exactly 7 tiers with monotonic indices', () => {
    expect(TIERS).toHaveLength(7);
    TIERS.forEach((t, i) => expect(t.index).toBe(i));
  });

  it('keeps the x5 enterTrueRadius band edges (engine fog/load-floor contract)', () => {
    const edges = TIERS.map((t) => t.enterTrueRadius);
    expect(edges).toEqual([0.02, 0.1, 0.5, 2.5, 12, 60, 300]);
    expect(TIERS[0].enterTrueRadius).toBe(START_RADIUS_M);
    for (let t = 1; t < TIERS.length; t++) {
      expect(TIERS[t].enterTrueRadius).toBeGreaterThan(TIERS[t - 1].enterTrueRadius);
    }
  });

  it('keeps cellSizeSim/loadRadiusSim/objectsPerChunk identical to the engine baseline', () => {
    TIERS.forEach((t) => {
      expect(t.cellSizeSim).toBe(32);
      expect(t.loadRadiusSim).toBe(96);
      expect(t.objectsPerChunk).toBe(72);
    });
  });

  it('has exactly 10 archetypeIds per tier and 70 unique ids total', () => {
    const seen = new Set();
    TIERS.forEach((t, i) => {
      expect(t.archetypeIds, `tier ${i}`).toHaveLength(ARCH_PER_TIER);
      t.archetypeIds.forEach((id) => {
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
        expect(seen.has(id), `duplicate id ${id}`).toBe(false);
        seen.add(id);
      });
    });
    expect(seen.size).toBe(70);
  });

  it('has zh-TW (non-Japanese, non-ASCII) tier names', () => {
    // City-agnostic: 7 non-empty names, each with CJK and no Japanese kana.
    const names = TIERS.map((t) => t.name);
    expect(names).toHaveLength(7);
    for (const n of names) {
      expect(typeof n).toBe('string');
      expect(n.length).toBeGreaterThan(0);
      expect(/[一-鿿]/.test(n), `must contain CJK: ${n}`).toBe(true);
      expect(/[぀-ヿ]/.test(n), `no Japanese kana: ${n}`).toBe(false);
    }
  });

  it('has well-formed sky params within engine-asserted ranges', () => {
    let prevMoon = -Infinity;
    TIERS.forEach((t, i) => {
      for (const k of ['fogColor', 'skyTop', 'skyBottom', 'cloudHex']) {
        expect(Number.isInteger(t[k]), `tier ${i} ${k}`).toBe(true);
        expect(t[k]).toBeGreaterThanOrEqual(0);
        expect(t[k]).toBeLessThanOrEqual(0xffffff);
      }
      expect(t.sunDir).toHaveLength(3);
      expect(t.moonDir).toHaveLength(3);
      const m = t.moonDir;
      const len = Math.hypot(m[0], m[1], m[2]);
      expect(len).toBeGreaterThan(1e-6);
      expect(Math.asin(m[1] / len)).toBeGreaterThanOrEqual(MOON_DIR_MIN_ELEV);
      expect(t.moonAngSize).toBeGreaterThan(0);
      expect(t.moonAngSize).toBeLessThan(0.2);
      expect(t.moonAngSize).toBeGreaterThanOrEqual(prevMoon); // non-decreasing
      prevMoon = t.moonAngSize;
      expect(t.starIntensity).toBeGreaterThanOrEqual(0);
      expect(t.starIntensity).toBeLessThanOrEqual(1);
      expect(t.cloudDensity).toBeGreaterThanOrEqual(0);
      expect(t.cloudDensity).toBeLessThanOrEqual(1);
      expect(t.sunIntensity).toBeGreaterThanOrEqual(0);
    });
  });
});
