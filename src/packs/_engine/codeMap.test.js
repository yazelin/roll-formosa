import { describe, it, expect } from 'vitest';
import { buildCodeMap, validatePack } from './codeMap.js';

/** Minimal fake pack: 2 tiers x 3 chunk ids + 2 EXTRA (1 collectible, 1 landmark). */
function fakePack() {
  return {
    tiers: [
      { index: 0, archetypeIds: ['a0', 'a1', 'a2'] },
      { index: 1, archetypeIds: ['b0', 'b1', 'b2'] },
    ],
    // EXTRA list is pack-scoped, append-only; collectibles first per convention.
    extraIds: ['col_x', 'lm_y'],
    // collectible id -> position in extraIds (append-only album order)
    collectibleExtraIndex: { 0: 0 }, // collectible id 0 == extraIds[0]
  };
}

describe('buildCodeMap', () => {
  it('assigns chunk codes 0..N-1 in tier-major order', () => {
    const m = buildCodeMap(fakePack());
    expect(m.chunkCount).toBe(6);
    expect(m.extraBase).toBe(6);
    expect(m.idByCode.slice(0, 6)).toEqual(['a0', 'a1', 'a2', 'b0', 'b1', 'b2']);
    expect(m.codeById['a0']).toBe(0);
    expect(m.codeById['b2']).toBe(5);
  });

  it('appends EXTRA ids after the chunk block', () => {
    const m = buildCodeMap(fakePack());
    expect(m.idByCode[6]).toBe('col_x');
    expect(m.idByCode[7]).toBe('lm_y');
    expect(m.codeById['lm_y']).toBe(7);
  });

  it('is hole-free and unique over the whole table', () => {
    const m = buildCodeMap(fakePack());
    const seen = new Set();
    for (let c = 0; c < m.idByCode.length; c++) {
      expect(typeof m.idByCode[c]).toBe('string');
      expect(seen.has(m.idByCode[c])).toBe(false);
      seen.add(m.idByCode[c]);
      expect(m.codeById[m.idByCode[c]]).toBe(c);
    }
  });

  it('maps collectible id -> extraBase + appendix index (pack-scoped)', () => {
    const m = buildCodeMap(fakePack());
    expect(m.collectibleCodeForId(0)).toBe(6); // extraBase + 0
  });
});

/** A fuller fake pack good enough to PASS validatePack. */
function validFakePack() {
  const tiers = [];
  for (let t = 0; t < 7; t++) {
    const ids = [];
    for (let s = 0; s < 10; s++) ids.push(`t${t}_s${s}`);
    tiers.push({ index: t, archetypeIds: ids, enterTrueRadius: 0.02 * Math.pow(5, t) });
  }
  const archetypes = {};
  for (const tr of tiers) for (const id of tr.archetypeIds) archetypes[id] = { id };
  // 2 landmarks, strictly increasing dioramaR ladder, goal = largest.
  const landmarks = [
    { landmarkId: 0, name: 'small', x: 10, z: 0, dioramaR: 5, isGoal: false },
    { landmarkId: 1, name: 'goal', x: 20, z: 0, dioramaR: 50, isGoal: true },
  ];
  const extraIds = ['lm_small', 'lm_goal'];
  return {
    id: 'fake', tiers, archetypes, landmarks, extraIds,
    collectibleExtraIndex: {},
    map: { bounds: { x: [-100, 100], z: [-100, 100] } },
    absorbRatio: 0.65,
  };
}

describe('validatePack', () => {
  it('passes a well-formed pack', () => {
    expect(validatePack(validFakePack())).toBe(true);
  });

  it('rejects != 7 tiers', () => {
    const p = validFakePack(); p.tiers.pop();
    expect(() => validatePack(p)).toThrow(/exactly 7 tiers/);
  });

  it('rejects a tier without 10 archetypeIds', () => {
    const p = validFakePack(); p.tiers[3].archetypeIds.pop();
    expect(() => validatePack(p)).toThrow(/10 archetypeIds/);
  });

  it('rejects an archetypeId that does not resolve', () => {
    const p = validFakePack(); p.tiers[2].archetypeIds[0] = 'ghost';
    expect(() => validatePack(p)).toThrow(/ghost/);
  });

  it('rejects a non-strictly-increasing dioramaR ladder', () => {
    const p = validFakePack(); p.landmarks[1].dioramaR = 5; // equal to small
    expect(() => validatePack(p)).toThrow(/strictly increasing/);
  });

  it('rejects when the goal landmark is not the largest', () => {
    const p = validFakePack();
    p.landmarks[0].dioramaR = 999; // non-goal bigger than goal
    expect(() => validatePack(p)).toThrow(/goal.*largest|largest.*goal/i);
  });

  it('rejects a landmark outside map bounds', () => {
    const p = validFakePack(); p.landmarks[0].x = 9999;
    expect(() => validatePack(p)).toThrow(/bounds/i);
  });
});
