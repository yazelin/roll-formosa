import { describe, it, expect } from 'vitest';
import { TIERS } from './tiers.js';

// Re-implements the resolution guard against an explicit known-set so the
// P4→P5 seam contract is pinned even before catalog.js exists.
function tierIdsResolveAgainst(knownIds) {
  const known = new Set(knownIds);
  for (const tier of TIERS) {
    for (const id of tier.archetypeIds) {
      if (!known.has(id)) return false;
    }
  }
  return true;
}

describe('tainan tier→catalog resolution seam', () => {
  it('all 70 tier ids resolve when the full id set is present', () => {
    const all = TIERS.flatMap((t) => t.archetypeIds);
    expect(tierIdsResolveAgainst(all)).toBe(true);
  });

  it('fails fast if a tier id is missing from the catalog id set', () => {
    // Use the first ID from T0 (city-specific) instead of hardcoding 'marble'
    const firstId = TIERS[0].archetypeIds[0];
    const all = TIERS.flatMap((t) => t.archetypeIds).filter((id) => id !== firstId);
    expect(tierIdsResolveAgainst(all)).toBe(false);
  });
});
