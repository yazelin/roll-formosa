/**
 * @file objects.js — ObjectStore: SoA typed arrays, capacity 8192.
 *
 * The single source of truth for every world object (targets, scenery,
 * leftovers). Structure-of-Arrays layout so the rescale loop and the
 * sub-pixel sweep are tight, branch-light, cache-friendly passes.
 *
 * Flags byte (bitwise OR-able):
 *   FLAG_ALIVE  (1) — slot is allocated and the object exists in the world.
 *   FLAG_FADING (2) — despawn/sub-pixel scale-fade in progress (still alive).
 *   FLAG_TOMB   (4) — pending reclaim; ignored by collision/queries.
 *   FLAG_RARE   (8) — v2: deterministic rare promotion (golden tint, score
 *                 bonus). Set ONLY by the spawner at placement time; absorb.js
 *                 stamps AbsorbEvent.rare from it BEFORE store.free.
 *   FLAG_CURATED (16) — v3: slot owned by world/curated.js (CuratedSpawner).
 *                 The chunk spawner's _onAbsorb / _subPixelSweep /
 *                 _despawnIndex / leftover cleanup ALL skip flagged slots and
 *                 its _aliveCount counts only chunk-owned objects. Curated
 *                 collectibles additionally carry FLAG_RARE (gold tint).
 *
 * Archetype encoding: store.archetype holds a uint16 CODE
 *   code = tierIndex * ARCH_PER_TIER + indexWithinTier   (0..69, v3 stride 10)
 * derived from the FROZEN Tier.archetypeIds lists in config/tiers.js
 * (slots [8]/[9] of every tier are chunk landmarks), PLUS the 24 EXTRA
 * curated codes 70..93 (frozen by docs/DESIGN-V3.md Phase-0 appendix:
 * 70..81 collectibles where code = 70 + COLLECTIBLE_ID, 82..91 landmark
 * singletons, 92 shop shell, 93 Skytree display-name reservation — code 93
 * must NEVER be spawned into the store), PLUS the 5 v5 curated codes 94..98
 * (V5_CODE_BASE — stack_chan collectible id 12 + 4 Akihabara buildings,
 * append-only). render/ball.knockOff skips everything >= EXTRA_CODE_BASE (70),
 * so absorbed v5 objects are PERMANENTLY STUCK — no reinject path exists.
 * Use archetypeCode() / ARCHETYPE_ID_BY_CODE / ARCHETYPE_CODE_BY_ID below —
 * spawner/curated write codes, absorb/hud read ids/names back.
 *
 * tierOf is CURATED-MUTABLE (docs/DESIGN-V3.md dynamic re-banding): the chunk
 * spawner stamps it once at spawn; CuratedSpawner re-stamps its OWN flagged
 * slots to clamp(naturalBand, tierIndex-1, tierIndex+1) on activation and on
 * every TIER_UP. Writes are partitioned by FLAG_CURATED — never cache tierOf
 * across frames.
 */

import { STORE_CAPACITY } from '../config/tuning.js';
import { TIER_COUNT, ARCH_PER_TIER } from '../config/tiers.js';
import { FreeList } from '../core/pool.js';
import { buildCodeMap } from '../packs/_engine/codeMap.js';

/* ================================================================== */
/* Flags                                                               */
/* ================================================================== */

/** Slot is allocated and the object exists in the world. */
export const FLAG_ALIVE = 1;
/** Despawn / sub-pixel scale-fade in progress (object is still alive). */
export const FLAG_FADING = 2;
/** Pending reclaim — collision/queries must skip it. */
export const FLAG_TOMB = 4;
/**
 * v2: rare promotion (golden tint, RARE_SCORE_BONUS). VALUE FROZEN at 8 by
 * DESIGN-V2.md Phase 0 — set only by spawner._spawnPlacement (never by
 * reinject), read by absorb.js (AbsorbEvent.rare) and the sub-pixel sweep.
 */
export const FLAG_RARE = 8;
/**
 * v3: slot owned by the CuratedSpawner (world/curated.js). VALUE FROZEN at 16
 * by DESIGN-V3.md Phase 0. Chunk-spawner bookkeeping skips flagged slots; the
 * knock-off reinject path STRIPS FLAG_CURATED|FLAG_RARE (chunk codes < 70
 * re-enter the chunk path; EXTRA codes >= EXTRA_CODE_BASE never knock off).
 */
export const FLAG_CURATED = 16;
/* (Flag bit 32 — the former v4 OSM real-Tokyo building-slot flag — was removed
 * in P2 along with the OSM subsystem; no flag uses bit 32 now.) */

/* ================================================================== */
/* Archetype code <-> id mapping (derived from the frozen tier table)  */
/* ================================================================== */

/**
 * First EXTRA curated code == number of chunk codes
 * (TIER_COUNT * ARCH_PER_TIER = 70). render/ball.knockOff skips stuck
 * entries with code >= EXTRA_CODE_BASE (EXTRA objects are permanently stuck).
 */
export const EXTRA_CODE_BASE = TIER_COUNT * ARCH_PER_TIER;

/**
 * The 24 EXTRA curated archetype ids, FROZEN in code order 70..93 (append-only,
 * never reorder). These are CITY-AGNOSTIC placeholder ids for the engine's
 * frozen code STRUCTURE only — the active StagePack overrides every code with
 * its own archetype id (activePack.archetypeIdByCode). Slot layout:
 *   70..81 collectibles, 82..91 landmark singletons (threshold-ladder order),
 *   92 shop shell, 93 goal-monument display-name slot.
 * @type {string[]}
 */
export const EXTRA_ARCHETYPE_IDS = Array.from(
  { length: 24 },
  (_, i) => `extra_${EXTRA_CODE_BASE + i}`
);

/**
 * First v5 curated code (94). The collectible code = 70 + id rule cannot extend
 * past id 11 (code 82 is a landmark), so the v5 codes — the 13th collectible
 * (id 12) plus 4 extra curated buildings — append after the 24 EXTRA codes:
 * codes 94..98 = V5_CODE_BASE + index below. Like EXTRA codes they are
 * >= EXTRA_CODE_BASE, so render/ball.knockOff's skip keeps every absorbed v5
 * object permanently stuck.
 */
export const V5_CODE_BASE = EXTRA_CODE_BASE + EXTRA_ARCHETYPE_IDS.length; // 94

/**
 * The 5 v5 curated archetype ids, FROZEN in code order 94..98 (append-only).
 * City-agnostic placeholders for the frozen code STRUCTURE — the active
 * StagePack overrides every code. 94 is collectible id 12 (collectibleCodeForId
 * below); 95..98 are curated buildings (landmark-mid pool).
 * @type {string[]}
 */
export const V5_ARCHETYPE_IDS = Array.from(
  { length: 5 },
  (_, i) => `v5_${V5_CODE_BASE + i}`
);

/**
 * Archetype code of a FROZEN collectible id. ids 0..11 use the frozen rule
 * code = 70 + id; ids 12+ append after the EXTRA table at V5_CODE_BASE (the
 * 70 + id rule is unextendable — code 82 is the first landmark singleton).
 * collection.js / screens.js MUST route every id -> code lookup through this
 * (never hand-roll 70 + id).
 * @param {number} id Frozen collectible id 0..COLLECT_TOTAL-1.
 * @returns {number} uint16 archetype code.
 */
export function collectibleCodeForId(id) {
  return id <= 11 ? EXTRA_CODE_BASE + id : V5_CODE_BASE + (id - 12);
}

/* The code<->id table is built by the pack-agnostic buildCodeMap()
 * (src/packs/_engine/codeMap.js) — the SAME builder the active StagePack uses
 * (P2 seam). We feed it a CITY-AGNOSTIC descriptor: TIER_COUNT*ARCH_PER_TIER
 * neutral chunk ids (chunk_0..chunk_69), then the EXTRA appendix (24 + 5 v5).
 * This is the engine's frozen code STRUCTURE; the active pack supplies the real
 * ids via activePack.archetypeIdByCode. objects.js must NOT import activePack
 * here (import cycle); buildCodeMap is a pure leaf, so this stays cycle-free. */
const _NEUTRAL_TIERS = Array.from({ length: TIER_COUNT }, (_, t) => ({
  archetypeIds: Array.from(
    { length: ARCH_PER_TIER },
    (_, i) => `chunk_${t * ARCH_PER_TIER + i}`
  ),
}));
const _CODE_MAP = buildCodeMap({
  tiers: _NEUTRAL_TIERS,
  extraIds: [...EXTRA_ARCHETYPE_IDS, ...V5_ARCHETYPE_IDS],
});

/**
 * Flat archetype id table (99 entries):
 * codes 0..69: chunk_<code> (neutral); codes 70..93: EXTRA_ARCHETYPE_IDS[code - 70];
 * codes 94..98: V5_ARCHETYPE_IDS[code - V5_CODE_BASE]. The active pack overrides
 * all 99 with its real ids via activePack.archetypeIdByCode.
 * @type {string[]}
 */
export const ARCHETYPE_ID_BY_CODE = _CODE_MAP.idByCode;

/**
 * Reverse lookup: catalog id -> uint16 archetype code (chunk + EXTRA).
 * @type {Record<string, number>}
 */
export const ARCHETYPE_CODE_BY_ID = _CODE_MAP.codeById;

/**
 * Compose a uint16 archetype code from tier index + index within the tier's
 * frozen ARCH_PER_TIER-id list. CHUNK CODES ONLY (0..69) — EXTRA curated
 * codes 70..93 are not tier-strided.
 * @param {number} tierIndex   Home tier 0..6.
 * @param {number} indexInTier Index 0..ARCH_PER_TIER-1 within the tier's id list.
 * @returns {number} Code 0..69 for ObjectStore.archetype.
 */
export function archetypeCode(tierIndex, indexInTier) {
  return tierIndex * ARCH_PER_TIER + indexInTier;
}

/**
 * Home tier of a CHUNK archetype code. Valid ONLY for codes <
 * EXTRA_CODE_BASE (EXTRA codes carry naturalBand in catalog/cityMap data
 * instead — never derive a tier from an EXTRA code with this).
 * @param {number} code Chunk archetype code 0..69.
 * @returns {number} Tier index 0..6.
 */
export function archetypeTierOfCode(code) {
  return (code / ARCH_PER_TIER) | 0;
}

/* P2: the old global frozen-table DEV assert block (99-entry count, hole-free,
 * id<->code round-trip, collectibleCodeForId rule) moved to the pack-scoped
 * seam. Hole-freeness + uniqueness are now GUARANTEED BY CONSTRUCTION in
 * buildCodeMap (src/packs/_engine/codeMap.js, unit-tested) and the per-pack
 * count/ladder invariants run via activePack.validate() (validatePack) at boot
 * (main.js). The Tokyo wrap is additionally covered by
 * src/packs/_tokyo_transient/pack.test.js (chunkCount === 70, hole-free over
 * the real pack, legacy collectible codes preserved) and
 * src/world/objects.test.js (99 entries, v5 base 94, round-trip). */

/* ================================================================== */
/* ObjectStore                                                         */
/* ================================================================== */

/**
 * SoA object store, capacity STORE_CAPACITY (8192). All positions/radii are
 * SIM UNITS. Zero allocation after construction; alloc()/free() are O(1)
 * free-list operations; rescaleAll() is four tight Float32 passes.
 *
 * Field ownership: spawner writes px/py/pz/radius/archetype/tierOf at spawn;
 * render layer owns instanceSlot; flags is the alive/dead source of truth.
 */
export class ObjectStore {
  /**
   * @param {number} [capacity=STORE_CAPACITY] Slot count (default 8192).
   */
  constructor(capacity = STORE_CAPACITY) {
    /** @type {number} Total slot count. */
    this.capacity = capacity;
    /** @type {Float32Array} X position, sim units. */
    this.px = new Float32Array(capacity);
    /** @type {Float32Array} Y position, sim units. */
    this.py = new Float32Array(capacity);
    /** @type {Float32Array} Z position, sim units. */
    this.pz = new Float32Array(capacity);
    /** @type {Float32Array} Bounding-sphere radius, sim units (jitter applied). */
    this.radius = new Float32Array(capacity);
    /** @type {Uint16Array} Archetype code (tier*ARCH_PER_TIER + indexInTier, see archetypeCode()). */
    this.archetype = new Uint16Array(capacity);
    /** @type {Uint8Array} Home tier band 0..6 (which spatial hash owns it).
     *  CURATED-MUTABLE: curated re-stamps its FLAG_CURATED slots on
     *  activation/TIER_UP (dynamic re-banding) — never cache across frames. */
    this.tierOf = new Uint8Array(capacity);
    /** @type {Uint8Array} FLAG_ALIVE | FLAG_FADING | FLAG_TOMB | FLAG_RARE | FLAG_CURATED bits. */
    this.flags = new Uint8Array(capacity);
    /** @type {Int32Array} InstancedPool slot, or -1 when not instanced. */
    this.instanceSlot = new Int32Array(capacity).fill(-1);

    /** @type {FreeList} */
    this._free = new FreeList(capacity);
    /** @type {number} */
    this._alive = 0;
  }

  /** Number of currently allocated (alive) slots. @returns {number} */
  get aliveCount() {
    return this._alive;
  }

  /**
   * Allocate a slot. Sets flags = FLAG_ALIVE and instanceSlot = -1; the caller
   * (spawner) must fill px/py/pz/radius/archetype/tierOf before the object is
   * inserted into a spatial hash.
   * @returns {number} Slot index, or -1 if the store is full.
   */
  alloc() {
    const i = this._free.alloc();
    if (i === -1) return -1;
    this.flags[i] = FLAG_ALIVE;
    this.instanceSlot[i] = -1;
    this._alive++;
    return i;
  }

  /**
   * Free a slot (absorb, despawn-fade end, knock-off consumption). Idempotent:
   * double-free on an already-dead slot is a no-op (flags byte is the source
   * of truth). The caller must have removed the index from its spatial hash
   * BEFORE freeing.
   * @param {number} i Slot index.
   */
  free(i) {
    if (this.flags[i] === 0) return;
    this.flags[i] = 0;
    this.instanceSlot[i] = -1;
    this._alive--;
    this._free.free(i);
  }

  /**
   * Invoke cb(index) for every alive slot (FLAG_ALIVE set, including FADING).
   * Plain indexed scan over the flags byte array — do not allocate inside cb.
   * @param {(index: number) => void} cb Callback receiving the slot index.
   */
  forEachAlive(cb) {
    const flags = this.flags;
    const n = this.capacity;
    for (let i = 0; i < n; i++) {
      if ((flags[i] & FLAG_ALIVE) !== 0) cb(i);
    }
  }

  /**
   * The one-frame similarity rescale: multiply every position and radius by S.
   * Runs unconditionally over the FULL capacity (scaling dead slots is harmless
   * and the branchless pass is faster than testing flags). Called by
   * ScaleManager between physics update and render; the caller then rebuilds
   * the spatial hashes and rewrites instance matrices.
   * @param {number} S Similarity factor (RESCALE_S = 0.2).
   */
  rescaleAll(S) {
    const n = this.capacity;
    const px = this.px;
    for (let i = 0; i < n; i++) px[i] *= S;
    const py = this.py;
    for (let i = 0; i < n; i++) py[i] *= S;
    const pz = this.pz;
    for (let i = 0; i < n; i++) pz[i] *= S;
    const radius = this.radius;
    for (let i = 0; i < n; i++) radius[i] *= S;
  }

  /**
   * Floating-origin rebase: subtract (dx, dz) from every position. Same
   * full-capacity branchless pass rationale as rescaleAll(). Called by
   * ScaleManager in the between-update-and-render slot.
   * @param {number} dx Integer-snapped X shift, sim units.
   * @param {number} dz Integer-snapped Z shift, sim units.
   */
  rebaseAll(dx, dz) {
    const n = this.capacity;
    const px = this.px;
    for (let i = 0; i < n; i++) px[i] -= dx;
    const pz = this.pz;
    for (let i = 0; i < n; i++) pz[i] -= dz;
  }

  /** Full reset to empty (game reset). */
  reset() {
    this.flags.fill(0);
    this.instanceSlot.fill(-1);
    this._free.reset();
    this._alive = 0;
  }
}
