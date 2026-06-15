import { describe, it, expect } from 'vitest';

/**
 * DEV-boot regression guard.
 *
 * Several modules run module-load invariant asserts that are GATED behind
 * `import.meta.env.DEV` (stripped from prod builds, so `vite build` cannot
 * catch a violation). No production smoke test imports them either, so a
 * mismatch between the code-table base in `world/objects.js` and the codes
 * registered/validated in the active pack (`packs/taipei/catalog.js` +
 * `packs/taipei/index.js`) is a LATENT breakage: the prod build is green and
 * the existing tests are green, but the DEV game throws at boot.
 *
 * This test reproduces a DEV boot (vitest sets `import.meta.env.DEV === true`)
 * by dynamically importing the three modules that own those invariants, and
 * asserts none of them throw. It is the floor proof that the DEV game boots
 * clean — any future re-base/append that desyncs the code tables turns this
 * red in `npm test`.
 */
describe('DEV-boot module-load invariants', () => {
  it('runs under DEV (so the gated asserts are live)', () => {
    expect(import.meta.env.DEV).toBe(true);
  });

  it('world/objects.js loads without throwing (code table + round-trip asserts)', async () => {
    await expect(import('../world/objects.js')).resolves.toBeDefined();
  });

  it('packs/taipei/catalog.js loads without throwing (EXTRA/v5 registration asserts)', async () => {
    await expect(import('../packs/taipei/catalog.js')).resolves.toBeDefined();
  });

  it('packs/taipei/index.js loads without throwing (buildCodeMap + validatePack at load)', async () => {
    await expect(import('../packs/taipei/index.js')).resolves.toBeDefined();
  });

  it('packs/taipei/cityMap.js loads without throwing (placements + landmark ladder)', async () => {
    await expect(import('../packs/taipei/cityMap.js')).resolves.toBeDefined();
  });
});
