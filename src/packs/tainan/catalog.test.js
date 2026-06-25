import { describe, it, expect } from 'vitest';
import { CHUNK_ARCHETYPES, CATALOG, DISPLAY_NAME_BY_CODE } from './catalog.js';
import { TIERS } from './tiers.js';

const ARCHETYPE_TRI_CAP = 350;
const HERO_TRI_CAP = 600;

function triCount(geo) {
  const idx = geo.getIndex();
  if (idx !== null) return idx.count / 3;
  const pos = geo.getAttribute('position');
  return pos ? pos.count / 3 : 0;
}

// Mirror geometryFactory: ensure normals/color then normalize to unit sphere.
function buildNormalized(arch) {
  const rng = (() => {
    let s = 0x9e3779b9;
    return () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  })();
  const geo = arch.buildGeometry(rng);
  if (geo.getAttribute('normal') === undefined) geo.computeVertexNormals();
  geo.computeBoundingSphere();
  const bs = geo.boundingSphere;
  if (bs && bs.radius > 1e-8) {
    geo.translate(-bs.center.x, -bs.center.y, -bs.center.z);
    geo.scale(1 / bs.radius, 1 / bs.radius, 1 / bs.radius);
  }
  geo.computeBoundingSphere();
  return geo;
}

describe('tainan chunk archetypes', () => {
  it('implements exactly the 70 ids the tiers reference', () => {
    const tierIds = TIERS.flatMap((t) => t.archetypeIds);
    expect(tierIds.length).toBe(70);
    for (const id of tierIds) {
      expect(CHUNK_ARCHETYPES[id], `missing chunk archetype '${id}'`).toBeDefined();
    }
    expect(Object.keys(CHUNK_ARCHETYPES).length).toBe(70);
  });

  it('every chunk geometry stays under its tri cap and normalizes to a finite unit sphere', () => {
    for (const id of Object.keys(CHUNK_ARCHETYPES)) {
      const arch = CHUNK_ARCHETYPES[id];
      const geo = buildNormalized(arch);
      const cap = arch.heroTriCap !== undefined ? HERO_TRI_CAP : ARCHETYPE_TRI_CAP;
      expect(triCount(geo), `${id} over tri cap (${triCount(geo)} > ${cap})`).toBeLessThanOrEqual(cap);
      expect(Math.abs(geo.boundingSphere.radius - 1), `${id} not unit sphere`).toBeLessThan(1e-3);
      expect(arch.radiusNominal, `${id} radiusNominal`).toBeGreaterThan(0);
      geo.dispose();
    }
  });

  it('every chunk archetype satisfies the engine ArchetypeDef shape contract', () => {
    for (let t = 0; t < TIERS.length; t++) {
      for (const id of TIERS[t].archetypeIds) {
        const a = CHUNK_ARCHETYPES[id];
        expect(a.id, `${id} id field`).toBe(id);
        expect(a.tier, `${id} tier`).toBe(t);
        expect(a.naturalBand, `${id} naturalBand`).toBe(t);
        expect(a.spawnWeight, `${id} spawnWeight > 0`).toBeGreaterThan(0);
        expect(a.palette.length, `${id} palette 4-6 tints`).toBeGreaterThanOrEqual(4);
        expect(a.palette.length, `${id} palette 4-6 tints`).toBeLessThanOrEqual(6);
        expect(a.yOffset, `${id} yOffset sane`).toBeGreaterThan(-1.01);
        expect(a.yOffset, `${id} yOffset sane`).toBeLessThanOrEqual(0.5);
        expect(a.collisionScale, `${id} collisionScale`).toBeGreaterThan(0);
        expect(a.collisionScale, `${id} collisionScale`).toBeLessThanOrEqual(1);
        expect(typeof a.displayName, `${id} displayName`).toBe('string');
        expect(a.displayName.length, `${id} displayName non-empty`).toBeGreaterThan(0);
        expect(typeof a.buildGeometry, `${id} buildGeometry`).toBe('function');
      }
    }
  });
});

describe('tainan catalog surface', () => {
  it('merges chunk + Tainan EXTRA into a full CATALOG keyed by id (99 ids resolve)', () => {
    // 70 chunk + 24 EXTRA (70..93) + 5 v5 (94..98) = 99 archetype ids.
    expect(Object.keys(CATALOG).length).toBe(99);
    for (const id of TIERS.flatMap((t) => t.archetypeIds)) {
      expect(CATALOG[id], `chunk id '${id}' missing from CATALOG`).toBeDefined();
    }
    // Tainan collectibles + landmarks resolve.
    expect(CATALOG['black_bear']).toBeDefined();
    expect(CATALOG['mazu']).toBeDefined();
    expect(CATALOG['qigu_salt_mountain']).toBeDefined();
  });

  it('DISPLAY_NAME_BY_CODE has zh-TW names at every code (de-Tokyo: no Japanese kana)', () => {
    expect(DISPLAY_NAME_BY_CODE.length).toBe(99);
    // EVERY code (0..98) is non-empty AND contains no Japanese kana (zero Tokyo).
    const kana = /[぀-ゟ゠-ヿ]/;
    for (let c = 0; c < 99; c++) {
      const n = DISPLAY_NAME_BY_CODE[c];
      expect(n.length, `code ${c} name`).toBeGreaterThan(0);
      expect(kana.test(n), `code ${c} name '${n}' has Japanese kana`).toBe(false);
    }
    // code 93 is now a Tainan extended landmark (was the goal-tower slot).
    expect(DISPLAY_NAME_BY_CODE[93]).toBe('七股鹽山');
  });
});
