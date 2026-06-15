/**
 * @file seam.test.js — P2.5 byte-identity gate for the CONTENT seam.
 *
 * P2.5 re-pointed ~12 engine modules so they read simulation CONTENT off
 * `activePack` instead of importing `config/*` directly. While the transient
 * Tokyo pack is active, that indirection MUST be a pure rename: every content
 * field the engine now reads via `activePack.*` has to be the SAME reference
 * (===) as the legacy `config/*` export it replaced. Reference identity (not
 * deep-equality) is the strict proof — it guarantees the engine sees the exact
 * same object/array/function it saw before the seam existed, so Tokyo boots and
 * plays byte-identically. After P3 flips active.js to taipei these refs diverge
 * by design; this test is a transient-pack guard and disappears with it.
 */
import { describe, it, expect } from 'vitest';
import { activePack } from './index.js';
import { TIERS } from '../../config/tiers.js';
import {
  CATALOG,
  EXTRA_CATALOG,
  DISPLAY_NAME_BY_CODE,
  EXTRA_SIZE_CLASS_BY_CODE,
  EXTRA_POOL_CAPS,
} from '../../config/catalog.js';
import {
  LANDMARKS,
  PLACEMENTS,
  SHOP,
  SKYTREE_POS,
  bandAllowedAt,
} from '../../config/cityMap.js';
import * as cityMap from '../../config/cityMap.js';

describe('P2.5 content seam — activePack reads are byte-identical to config/*', () => {
  it('tier table is the same ref the engine read before the seam', () => {
    expect(activePack.tiers).toBe(TIERS);
  });

  it('catalog content (archetypes / extra / display names) are same refs', () => {
    expect(activePack.archetypes).toBe(CATALOG);
    expect(activePack.extraCatalog).toBe(EXTRA_CATALOG);
    expect(activePack.displayNameByCode).toBe(DISPLAY_NAME_BY_CODE);
    expect(activePack.extraSizeClassByCode).toBe(EXTRA_SIZE_CLASS_BY_CODE);
    expect(activePack.extraPoolCaps).toBe(EXTRA_POOL_CAPS);
  });

  it('city content (landmarks / placements / shop / goal pose) are same refs', () => {
    expect(activePack.landmarks).toBe(LANDMARKS);
    expect(activePack.cityMap.PLACEMENTS).toBe(PLACEMENTS);
    expect(activePack.cityMap.SHOP).toBe(SHOP);
    expect(activePack.cityMap.SKYTREE_POS).toBe(SKYTREE_POS);
  });

  it('bandAllowedAt is the same pure function ref (spawner zone-mask lookup)', () => {
    expect(activePack.cityMap.bandAllowedAt).toBe(bandAllowedAt);
  });

  it('the pack cityMap namespace is the live config/cityMap module namespace', () => {
    // The whole namespace is exposed so the seam is a rename, not a reshuffle.
    expect(activePack.cityMap).toBe(cityMap);
  });
});
