/**
 * @file tiers.js — Engine scale constants (city-agnostic).
 *
 * The 7-tier scale ladder DATA (tier names, sky/fog palette, archetype ids) is
 * owned by the ACTIVE StagePack (src/packs/<city>/tiers.js) and read via
 * src/packs/active.js — NEVER from here. This file holds only the frozen ENGINE
 * constants every module shares, plus their DEV invariant asserts:
 *
 *   RESCALE_S      one-frame similarity rescale factor (worldScale /= S)
 *   ARCH_PER_TIER  archetype stride (ids per tier; code = tier*stride + slot)
 *   TIER_COUNT     number of scale tiers (chunk codes = TIER_COUNT*ARCH_PER_TIER)
 *
 * The pack-scoped tier-DATA authoring guards (sky/fog/moon param ranges, the
 * worst-case fog/load floor) live in each pack's validateTiersStructure() so
 * they validate the SHIPPING tiers, not a baseline copy.
 *
 * SEAMLESSNESS LAW: tierIndex drives ONLY spawn bands, sky/fog palette, HUD
 * label, bgm, celebration. Absorbability, camera, fog distances, speed and
 * despawn are continuous functions of ball radius (tuning.js) and NEVER read
 * tierIndex. See DESIGN.md.
 */

import { SIM_RADIUS_MIN, SIM_RADIUS_MAX } from './tuning.js';

/**
 * One-frame similarity rescale factor applied when simRadius >= SIM_RADIUS_MAX:
 * worldScale /= S; every sim quantity *= S. 1/S === SIM_RADIUS_MAX/SIM_RADIUS_MIN === 5,
 * so the ball lands exactly back at SIM_RADIUS_MIN (asserted below).
 */
export const RESCALE_S = 0.2;

/**
 * Archetype stride: ids per tier (slots 8/9 = chunk landmarks).
 * Archetype code = tier * ARCH_PER_TIER + slotInTier, 0..69 (7 tiers). EVERY
 * module that maps codes <-> (tier, slot) must use this constant — never a
 * literal 8 or 10. EXTRA curated codes 70..98 are NOT tier-strided.
 */
export const ARCH_PER_TIER = 10;

/**
 * Number of scale tiers (圖釘 2cm → 信義天際線 300m+, the x5 ladder). The chunk
 * code space is TIER_COUNT * ARCH_PER_TIER = 70 (codes 0..69); EXTRA curated
 * codes 70..98 append after it (world/objects.js).
 */
export const TIER_COUNT = 7;

/* ================================================================== */
/* Dev-mode invariant asserts (stripped from prod by the DEV guard)    */
/* ================================================================== */

if (import.meta.env && import.meta.env.DEV) {
  /** @param {boolean} cond @param {string} msg */
  const assert = (cond, msg) => {
    if (!cond) throw new Error(`[tiers.js invariant] ${msg}`);
  };
  assert(ARCH_PER_TIER === 10, 'ARCH_PER_TIER is frozen at 10');
  assert(TIER_COUNT === 7, 'TIER_COUNT is frozen at 7 (x5 ladder)');
  assert(
    Math.abs(1 / RESCALE_S - SIM_RADIUS_MAX / SIM_RADIUS_MIN) < 1e-9,
    '1/RESCALE_S must equal SIM_RADIUS_MAX/SIM_RADIUS_MIN (ball lands back at band min)'
  );
}
