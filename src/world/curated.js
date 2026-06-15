/**
 * @file curated.js — CuratedSpawner (Stream B; docs/DESIGN-V3.md
 * §スポーンアーキテクチャ). Owns the ~410 authored cityMap placements
 * (shop interior, street/gutter/district dressing, 11 landmark singletons,
 * 12 collectibles, shop shell) and allocates them from the SAME ObjectStore /
 * spatial hashes / InstancedPools as the chunk spawner under the frozen
 * FLAG_CURATED ownership protocol.
 *
 * OWNERSHIP PROTOCOL (Phase-0 frozen):
 *  - FLAG_CURATED = 16 (VALUE FROZEN; objects.js exports it once Stream C
 *    lands — the local constant below is bit-identical). The chunk spawner
 *    skips flagged slots in _onAbsorb / _subPixelSweep / _despawnIndex /
 *    cleanup; its aliveCount counts only chunk-owned objects.
 *  - DYNAMIC RE-BANDING (binding): every placement has a naturalBand; on slot
 *    activation AND on every EVT.TIER_UP this spawner re-stamps
 *    store.tierOf[slot] = clamp(naturalBand, tierIndex-1, tierIndex+1) for
 *    every alive curated slot. The TIER_UP re-stamp is SYNCHRONOUS inside the
 *    handler (a tight <= aliveCount byte loop) because ScaleManager rebuilds
 *    the banded hashes immediately AFTER the TIER_UP emit returns — stamping
 *    first is what makes the re-banded slots enter the live hashes for free.
 *    The 64/frame round-robin re-stamps again on visit (belt & suspenders)
 *    and DEV-asserts every visited alive band is inside the live window.
 *    tierOf is 'curated-mutable' for flagged slots (documented risk ledger).
 *  - SUBSCRIPTION ORDER (frozen in events.js): chunk spawner -> curated ->
 *    main attach -> runStats -> collection -> sfx/effects/hud. Construct this
 *    class right after the chunk Spawner.
 *  - SLOT-STEAL CONVENTION: the main attach handler (running AFTER curated)
 *    owns/frees the WORLD pool slot for chunk-coded objects and may steal it;
 *    therefore the ABSORB handler here NEVER reads store.instanceSlot — it
 *    only sets the consumed bit and defers ALL slot bookkeeping to the next
 *    update() tick (race fix). EXTRA pool slots (codes >= 70) are invisible
 *    to the main attach handler (POOL_BY_CODE covers chunk codes only), so
 *    curated frees those from its OWN remembered slot in the deferred tick —
 *    exclusive ownership, no steal possible.
 *  - ACTIVATION: round-robin <= CURATED_UPDATE_BUDGET placements/frame;
 *    activate when inside max(loadRadiusSim, LOAD_RADIUS_MIN_M / worldScale)
 *    (+ objR) AND objDiameter >= SUBPIXEL_RATIO * ballR; deactivate
 *    (consume = false, scale-fade) outside the ring (*1.15 hysteresis) or
 *    sub-pixel. EXCEPTION (precise semantics): collectibles and landmarks
 *    ARE ring-deactivated when far (identity preserved by the consumed
 *    bitmask; they reactivate on approach) — only SIZE-based gating is
 *    skipped for them, both on despawn AND activation ('never lost' without
 *    'always alive').
 *  - LANDMARKS: EVT.LANDMARK is queued in the ABSORB handler and emitted at
 *    the START of the next update() — same render frame (absorb runs in
 *    step 2, curated.update in step 3), strictly AFTER the whole ABSORB
 *    dispatch chain. DUAL-TAG (ハチ公像): EVT.COLLECT is emitted by
 *    collection.js DURING the ABSORB dispatch, so COLLECT precedes LANDMARK
 *    in the same frame by construction (binding order).
 *  - TERRAIN RELEASE MIRROR: this class independently latches trueRadius >=
 *    SHOP_TERRAIN_RELEASE_M (same condition as world/terrain.js) and (a)
 *    lerps every still-alive elevated interior placement's py down to
 *    restY over the same 0.6 s window (items drop as shelves dissolve), (b)
 *    unlocks the release-gated shop-shell placement (absorbable @ ~6.2 m).
 *
 * SCALE MODEL: placement data is REAL METERS (ORIGIN = BALL START); sim =
 * real / worldScale - origin. worldScale is read LIVE from ScaleManager each
 * update (auto-correct across devTeleport's direct writes); the origin shift
 * rides EVT.RESCALE (*= S) / EVT.REBASE (+= sx, sz) — spawner pattern.
 *
 * Zero per-frame allocation: flat typed arrays, fixed queues, module scratch.
 */

import * as THREE from 'three';
import { PLACEMENTS, LANDMARKS } from '../config/cityMap.js';
import { TIERS } from '../config/tiers.js';
import { CATALOG } from '../config/catalog.js';
import { ARCHETYPE_ID_BY_CODE, FLAG_ALIVE, FLAG_RARE, FLAG_CURATED } from './objects.js';
import { EVT, PAYLOADS } from '../core/events.js';
import {
  CURATED_PLACEMENT_CAP,
  CURATED_UPDATE_BUDGET,
  DESPAWN_FADE_S,
  FOG_FAR_K,
  FOG_FAR_MIN_M,
  LOAD_RADIUS_MIN_M,
  SHOP_TERRAIN_RELEASE_M,
  SPAWN_FADE_S,
  STORE_CAPACITY,
  SUBPIXEL_FADE_S,
  SUBPIXEL_RATIO,
} from '../config/tuning.js';

/** @typedef {import('../types.js').CuratedPlacement} CuratedPlacement */

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/* FLAG_CURATED (16, frozen) now imported from objects.js — unified at
 * integration per the Phase-0 note. */

/** First EXTRA code (70..93; 93 = Skytree display slot, never spawned). */
const EXTRA_BASE = 70;
/** Chunk-code count (70 = 7 tiers x ARCH_PER_TIER). */
const CHUNK_CODES = 70;

/**
 * EXTRA code -> shared size-class pool index (frozen partition,
 * docs/DESIGN-V3.md spawnArchitecture RENDER POOLS; catalog.js EXTRA_CATALOG
 * carries the same assignment for Stream C's geometry authoring):
 *   0 collectible-small (cap 12): codes 70..79, 81
 *   1 landmark-mid      (cap 4+): 80 ハチ公, 82 西郷, 83 雷門, 84 ラジオ会館,
 *                                 86 スクランブル交差点デカール
 *   2 landmark-large    (cap 4):  85 渋谷109, 87 ドーム, 88 東京駅, 89 議事堂
 *   3 landmark-XL       (cap 4+): 90 橋スパン x3, 91 タワー, 92 shop shell
 */
const EXTRA_POOL_CLASS = Int8Array.from([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 70..79 collectibles
  1, // 80 ハチ公像 (dual)
  0, // 81 屋形船
  1, 1, 1, // 82 西郷 83 雷門 84 ラジオ会館
  2, // 85 渋谷109
  1, // 86 スクランブル交差点 (decal)
  2, 2, 2, // 87 ドーム 88 東京駅 89 議事堂
  3, 3, 3, // 90 橋スパン 91 東京タワー 92 shop shell
]);

/** First v5 curated code (objects.js V5_CODE_BASE — codes 110..114 append
 *  AFTER the frozen v4 table; `code - EXTRA_BASE` would index OUT of
 *  EXTRA_POOL_CLASS for them, so _activate dispatches v5 codes through the
 *  table below instead). Mirrors catalog.js EXTRA_SIZE_CLASS_BY_CODE. */
const V5_BASE = 110;
/** v5 code -> shared size-class pool index (frozen order = V5_ARCHETYPE_IDS):
 *  0 collectible-small: 110 スタックチャン (collectible id 12);
 *  1 landmark-mid: 111 ゲームセンター 112 家電量販店 113 メイドカフェ
 *  114 PCパーツショップビル (6 Akihabara placements — landmark-mid cap 12). */
const V5_POOL_CLASS = Int8Array.from([
  0, // 110 stack_chan
  1, 1, 1, 1, // 111..114 akiba buildings
]);

/** Release fade / y-drop window (s) — must match terrain.js RELEASE_FADE_S. */
const RELEASE_FADE_S = 0.6;
/** Ring-deactivation hysteresis multiplier. */
const RING_HYSTERESIS = 1.15;
/** Deferred-absorb / landmark queue capacities (overflow handled inline). */
const DEFER_CAP = 256;
const LM_QUEUE_CAP = 16;
/** DEV identity-check cadence (updates). */
const DEV_CHECK_INTERVAL = 300;

/* Placement flag bits (internal). */
const PF_INTERIOR = 1;
const PF_ELEVATED = 2;
const PF_RELEASE_GATED = 4;

/* Module scratch — zero per-frame allocation. */
const _POS = new THREE.Vector3();
const _QUAT = new THREE.Quaternion();
const _AXIS = new THREE.Vector3(0, 1, 0);
const FALLBACK_PALETTE = [0x9aa3ad, 0xb5bdc6, 0x7d8790, 0xcfd6dd];

/**
 * The curated spawner. Construct right AFTER the chunk Spawner (frozen
 * ABSORB subscription order) and BEFORE the main attach handler:
 *   const curated = new CuratedSpawner(store, hashes, instances, extraPools, bus, scaleMgr);
 */
export class CuratedSpawner {
  /**
   * @param {import('./objects.js').ObjectStore} store Shared SoA store.
   * @param {object[]} hashes 3 SpatialHash, hashes[i] = band tierIndex-1+i.
   * @param {Map<string, object>|Object<string, object>} instances Chunk
   *   InstancedPool per archetype id (chunk-coded placements render here).
   * @param {Array<object|null>|null} extraPools The 4 SHARED size-class pools
   *   [collectible-small, landmark-mid, landmark-large, landmark-XL]
   *   (InstancedPool interface). Null/missing pools degrade to invisible-but-
   *   collidable slots (instanceSlot -1) — never a crash.
   * @param {import('../core/events.js').EventBus} bus Shared bus.
   * @param {{ worldScale: number, tierIndex: number }} scaleMgr ScaleManager.
   */
  constructor(store, hashes, instances, extraPools, bus, scaleMgr) {
    this._store = store;
    this._hashes = hashes;
    this._instances = instances;
    this._extraPools = extraPools || [null, null, null, null];
    this._bus = bus;
    this._scale = scaleMgr;
    /** @type {object|null} Optional chunk Spawner ref (DEV identity check). */
    this._chunkSpawner = null;

    /* ---- flatten cityMap.PLACEMENTS into SoA (boot only) ---- */
    const N = PLACEMENTS.length;
    if (N > CURATED_PLACEMENT_CAP) {
      throw new Error(`[curated] ${N} placements exceed CURATED_PLACEMENT_CAP ${CURATED_PLACEMENT_CAP}`);
    }
    /** @type {number} */
    this._count = N;
    this._x = new Float64Array(N);
    this._ySurf = new Float64Array(N);
    this._z = new Float64Array(N);
    this._rReal = new Float64Array(N);
    this._yaw = new Float32Array(N);
    this._yK = new Float32Array(N);
    this._code = new Uint8Array(N);
    this._nb = new Uint8Array(N);
    this._lm = new Int8Array(N);
    this._col = new Int8Array(N);
    this._pflags = new Uint8Array(N);
    this._colorHex = new Int32Array(N);
    /** @type {Int32Array} placement -> store slot (-1 inactive). */
    this._slotOf = new Int32Array(N).fill(-1);
    /** @type {Int32Array} placement -> render pool slot (-1 none). */
    this._renderSlot = new Int32Array(N).fill(-1);
    /** @type {Int8Array} placement -> pool kind: -1 none, 0..3 extra class, 4 chunk pool. */
    this._renderPool = new Int8Array(N).fill(-1);
    /** @type {Uint32Array} OWN consumed bitmask (absorbed placements stay consumed). */
    this._consumed = new Uint32Array((N + 31) >> 5);
    /** @type {Int32Array} store slot -> placement (-1). */
    this._placementOfSlot = new Int32Array(STORE_CAPACITY).fill(-1);
    /** @type {Int32Array} Elevated-interior placement indices (release y-drop). */
    const elevated = [];
    /** @type {Int32Array} Collectible placement indices (forEachAliveCollectible). */
    const collectibles = [];

    for (let i = 0; i < N; i++) {
      const p = PLACEMENTS[i];
      this._x[i] = p.x;
      this._ySurf[i] = p.y;
      this._z[i] = p.z;
      this._rReal[i] = p.radiusReal;
      this._yaw[i] = p.yaw;
      this._yK[i] = p.yK !== undefined ? p.yK : 1;
      this._code[i] = p.archetypeCode;
      this._nb[i] = p.naturalBand;
      this._lm[i] = p.landmarkId;
      this._col[i] = p.collectibleId;
      this._colorHex[i] = p.colorHex !== undefined ? p.colorHex : -1;
      let f = 0;
      if (p.interior) f |= PF_INTERIOR;
      if (p.interiorElevated) f |= PF_ELEVATED;
      if (p.releaseGated) f |= PF_RELEASE_GATED;
      this._pflags[i] = f;
      if (p.interiorElevated) elevated.push(i);
      if (p.collectibleId >= 0) collectibles.push(i);
    }
    this._elevatedList = Int32Array.from(elevated);
    this._collectibleList = Int32Array.from(collectibles);

    /* ---- chunk-code render stats (palette/yOffset) with catalog fallback ---- */
    this._chunkPalette = new Array(CHUNK_CODES);
    this._chunkYOff = new Float32Array(CHUNK_CODES);
    this._chunkPool = new Array(CHUNK_CODES).fill(null);
    for (let c = 0; c < CHUNK_CODES; c++) {
      const a = CATALOG ? CATALOG[ARCHETYPE_ID_BY_CODE[c]] : undefined;
      this._chunkPalette[c] = a && a.palette && a.palette.length > 0 ? a.palette : FALLBACK_PALETTE;
      this._chunkYOff[c] = a ? a.yOffset || 0 : 0;
    }

    /* ---- landmark metadata (EVT.LANDMARK payload source) ---- */
    this._lmName = new Array(LANDMARKS.length);
    this._lmSizeReal = new Float64Array(LANDMARKS.length);
    for (const ld of LANDMARKS) {
      this._lmName[ld.landmarkId] = ld.nameJa;
      this._lmSizeReal[ld.landmarkId] = ld.sizeReal;
    }

    /* ---- runtime state ---- */
    this._alive = 0;
    this._cursor = 0;
    this._originX = 0;
    this._originZ = 0;
    this._released = false;
    this._dropT = 0;
    this._forceScanPending = false;
    this._devTick = 0;
    /* Deferred ABSORB bookkeeping queue (placement indices). */
    this._deferQ = new Int32Array(DEFER_CAP);
    this._deferN = 0;
    /* Landmark emission queue (placement indices). */
    this._lmQ = new Int32Array(LM_QUEUE_CAP);
    this._lmN = 0;
    /* Last-update ball snapshot (forceScan deferral target). */
    this._haveBall = false;

    /* ---- bus subscriptions (constructor order = frozen dispatch order) ---- */
    bus.on(EVT.ABSORB, this._onAbsorb.bind(this));
    bus.on(EVT.TIER_UP, this._onTierUp.bind(this));
    bus.on(EVT.RESCALE, (p) => {
      this._originX *= p.S;
      this._originZ *= p.S;
    });
    bus.on(EVT.REBASE, (p) => {
      this._originX += p.sx;
      this._originZ += p.sz;
    });
  }

  /* ---------------------------------------------------------------- */
  /* Public API (frozen interface)                                     */
  /* ---------------------------------------------------------------- */

  /** Alive curated objects (chunk spawner counts only its own). @returns {number} */
  get aliveCount() {
    return this._alive;
  }

  /**
   * Optional DEV wiring (integrator one-liner): enables the 300-frame
   * ownership identity assert spawner.alive + curated.alive === store.alive.
   * @param {object} spawner The chunk Spawner.
   */
  attachChunkSpawner(spawner) {
    this._chunkSpawner = spawner;
  }

  /**
   * Frozen collectible id for a store slot, or -1. Valid THROUGH the ABSORB
   * dispatch: absorb.js stamps AbsorbEvent.collectibleId via this BEFORE the
   * emit, and the deferred-bookkeeping rule keeps the slot->placement map
   * intact until the next update() tick.
   * @param {number} storeIdx
   * @returns {number} 0..11 or -1.
   */
  collectibleIdFor(storeIdx) {
    if (storeIdx < 0 || storeIdx >= STORE_CAPACITY) return -1;
    const pi = this._placementOfSlot[storeIdx];
    return pi >= 0 ? this._col[pi] : -1;
  }

  /**
   * Frozen landmark id for a store slot, or -1 (mirror of collectibleIdFor;
   * same validity window). absorb.js queries this to EXEMPT landmark slots
   * from the growthKForObjR pacing normalization (authored-ladder jumps).
   * @param {number} storeIdx
   * @returns {number} 0..10 or -1.
   */
  landmarkIdFor(storeIdx) {
    if (storeIdx < 0 || storeIdx >= STORE_CAPACITY) return -1;
    const pi = this._placementOfSlot[storeIdx];
    return pi >= 0 ? this._lm[pi] : -1;
  }

  /**
   * Invoke cb(storeIdx, x, y, z, radiusSim) for every ALIVE collectible
   * (effects gold sparkle provider). Zero allocation; <= 12 iterations.
   * @param {(idx: number, x: number, y: number, z: number, r: number) => void} cb
   */
  forEachAliveCollectible(cb) {
    const store = this._store;
    const list = this._collectibleList;
    for (let i = 0; i < list.length; i++) {
      const idx = this._slotOf[list[i]];
      if (idx < 0) continue;
      if ((store.flags[idx] & FLAG_ALIVE) === 0) continue;
      cb(idx, store.px[idx], store.py[idx], store.pz[idx], store.radius[idx]);
    }
  }

  /**
   * devTeleport hook: re-anchor the real->sim mapping (origin = 0, matching
   * devTeleport's `pos = real / worldScale` mapping) and schedule ONE
   * full-placement pass ignoring the 64 budget on the next update() (the
   * fresh post-teleport ball pose arrives there).
   *
   * INTEGRATION FIX (mid-run teleport correctness): every still-ACTIVE
   * placement carries store/sim coordinates from the PRE-teleport
   * worldScale/origin mapping — devTeleport snaps worldScale directly
   * (no RESCALE event), so in-ring survivors would stay collidable at
   * stale positions. Deactivate them all here (consume = false; identity
   * lives in the consumed bitmask) and let the full pass re-materialize
   * everything in fresh coordinates. Hash entries are cleared from all 3
   * bands defensively (remove() is a no-op when absent) because the
   * re-band rel may be stale at teleport time; devTeleport's forced
   * maybeTierUp/maybeRebase rebuilds the hashes right after anyway.
   */
  forceScan() {
    const tier = this._scale.tierIndex;
    for (let pi = 0; pi < this._count; pi++) {
      const idx = this._slotOf[pi];
      if (idx < 0) continue;
      if (this._hashes) {
        for (let h = 0; h < 3; h++) {
          if (this._hashes[h]) this._hashes[h].remove(idx);
        }
      }
      this._deactivate(pi, 0, tier);
    }
    this._originX = 0;
    this._originZ = 0;
    // Mirror terrain.reset(): re-arm the SHOP_TERRAIN_RELEASE_M latch so a
    // big->small devTeleport restores the pre-release shop (the gated shell
    // stays inactive, elevated items rematerialize back on the shelves).
    // update() re-latches from the live ballRadiusSim * worldScale on the
    // next tick — a small->big teleport still releases correctly.
    this._released = false;
    this._dropT = 0;
    this._forceScanPending = true;
  }

  /**
   * Synchronous start-area preload (boot / resetWorld — mirrors
   * spawner.preloadStartArea): one full-placement pass ignoring the 64/frame
   * budget so the title-screen orbit shows the authored shop interior and
   * GAME_START never begins with a 7-frame staggered materialization.
   * Reuses the _forceScanPending machinery (update consumes the flag).
   * @param {THREE.Vector3} ballPos Ball center, CURRENT sim units.
   * @param {number} tierIndex Current tier (ScaleManager).
   * @param {number} ballRadiusSim Ball simRadius.
   */
  preload(ballPos, tierIndex, ballRadiusSim) {
    this._forceScanPending = true;
    this.update(ballPos, tierIndex, ballRadiusSim, 0);
  }

  /**
   * Full reset (resetWorld). The integrator already reset the ObjectStore,
   * hashes and InstancedPools — like Spawner.reset(), this clears ONLY
   * curated-owned state (maps, consumed bitmask, queues, latches, origin).
   */
  reset() {
    this._slotOf.fill(-1);
    this._renderSlot.fill(-1);
    this._renderPool.fill(-1);
    this._placementOfSlot.fill(-1);
    this._consumed.fill(0);
    this._alive = 0;
    this._cursor = 0;
    this._originX = 0;
    this._originZ = 0;
    this._released = false;
    this._dropT = 0;
    this._forceScanPending = false;
    this._deferN = 0;
    this._lmN = 0;
    this._haveBall = false;
  }

  /* ---------------------------------------------------------------- */
  /* Per-frame update (main.js step 3, AFTER spawner.update)           */
  /* ---------------------------------------------------------------- */

  /**
   * Round-robin activation/deactivation + deferred ABSORB bookkeeping +
   * queued EVT.LANDMARK emission + release y-drop.
   * @param {THREE.Vector3} ballPos Ball center, CURRENT sim units.
   * @param {number} tierIndex Current tier (ScaleManager).
   * @param {number} ballRadiusSim Ball simRadius.
   * @param {number} dt Render-frame delta (s).
   */
  update(ballPos, tierIndex, ballRadiusSim, dt) {
    const ws = this._scale.worldScale;
    const invWS = 1 / ws;
    this._haveBall = true;

    /* 1. Deferred ABSORB bookkeeping (slot-steal-safe), then the queued
       LANDMARK emissions — strictly after the full ABSORB chain (step 2),
       same render frame. */
    this._flushDeferred();
    this._flushLandmarks();

    /* 2. Terrain-release mirror: latch + elevated-item y-drop (0.6 s). */
    if (!this._released && ballRadiusSim * ws >= SHOP_TERRAIN_RELEASE_M) {
      this._released = true;
      this._dropT = 0;
    }
    if (this._released && this._dropT < RELEASE_FADE_S) {
      this._dropT += dt;
      if (this._dropT > RELEASE_FADE_S) this._dropT = RELEASE_FADE_S;
      this._applyYDrop(invWS);
    }

    /* 3. Round-robin (or the deferred forceScan full pass). */
    const effLoad = this._effLoad(tierIndex, invWS);
    let budget = CURATED_UPDATE_BUDGET;
    let visits = this._count;
    if (this._forceScanPending) {
      this._forceScanPending = false;
      budget = this._count; // ignore the per-frame budget once
      this._cursor = 0;
    }
    while (visits > 0 && budget > 0) {
      const pi = this._cursor;
      this._cursor = (this._cursor + 1) % this._count;
      visits--;
      budget--;
      this._visit(pi, ballPos, tierIndex, ballRadiusSim, effLoad, invWS);
    }

    /* 4. DEV ownership identity check (every 300 updates). */
    if (DEV && ++this._devTick >= DEV_CHECK_INTERVAL) {
      this._devTick = 0;
      let counted = 0;
      for (let i = 0; i < this._count; i++) if (this._slotOf[i] >= 0) counted++;
      if (counted !== this._alive) {
        throw new Error(`[curated] alive bookkeeping desync: counted ${counted} != ${this._alive}`);
      }
      if (this._chunkSpawner !== null) {
        const sum = this._chunkSpawner.aliveCount + this._alive;
        if (sum !== this._store.aliveCount) {
          throw new Error(
            `[curated] ownership identity broken: chunk ${this._chunkSpawner.aliveCount} + ` +
              `curated ${this._alive} != store ${this._store.aliveCount}`
          );
        }
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Bus handlers                                                      */
  /* ---------------------------------------------------------------- */

  /**
   * EVT.ABSORB (subscribed second — after the chunk spawner, before the main
   * attach handler). BOOKKEEPING IS DEFERRED: only the consumed bit is set
   * here; the slot->placement map stays valid through the dispatch (so the
   * already-stamped collectibleId stays coherent) and instanceSlot is NEVER
   * read (slot-steal convention).
   * @param {import('../types.js').AbsorbEvent} p Reused payload (read-only).
   */
  _onAbsorb(p) {
    const idx = p.objIndex;
    if (idx < 0 || idx >= STORE_CAPACITY) return;
    const pi = this._placementOfSlot[idx];
    if (pi < 0) return; // not curated-owned
    if (DEV && (this._store.flags[idx] & FLAG_CURATED) === 0) {
      throw new Error(`[curated] slot ${idx} mapped to placement ${pi} but FLAG_CURATED is clear`);
    }
    this._consumed[pi >> 5] |= 1 << (pi & 31);
    if (this._lm[pi] >= 0) {
      if (this._lmN < LM_QUEUE_CAP) {
        this._lmQ[this._lmN++] = pi;
      } else if (DEV) {
        // Only 11 landmarks exist — >16 queued in one frame is a protocol
        // bug, never a load condition. Emitting inline here would violate
        // the binding 'LANDMARK strictly after the whole ABSORB chain' order,
        // so assert in DEV and drop (unreachable) in prod.
        throw new Error(`[curated] landmark queue overflow (${this._lmN}) — protocol bug`);
      }
    }
    if (this._deferN < DEFER_CAP) {
      this._deferQ[this._deferN++] = pi;
    } else {
      // Overflow (>256 curated absorbs in ONE render frame): drain the
      // OLDEST deferred entry — its own ABSORB dispatch already completed
      // (only the current emit is mid-dispatch), so cleaning it inline
      // preserves the deferral contract for the placement currently
      // mid-dispatch (which takes the freed queue tail).
      this._cleanupAbsorbed(this._deferQ[0]);
      this._deferQ.copyWithin(0, 1, this._deferN);
      this._deferQ[this._deferN - 1] = pi;
    }
  }

  /**
   * EVT.TIER_UP — SYNCHRONOUS dynamic re-banding: re-stamp every alive
   * curated slot's tierOf into the new live window BEFORE ScaleManager
   * rebuilds the banded hashes (which happens right after this emit returns).
   * @param {import('../types.js').TierUpEvent} p
   */
  _onTierUp(p) {
    const t = p.tierIndex;
    const store = this._store;
    for (let pi = 0; pi < this._count; pi++) {
      const idx = this._slotOf[pi];
      if (idx < 0) continue;
      store.tierOf[idx] = clampBand(this._nb[pi], t);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Deferred bookkeeping                                              */
  /* ---------------------------------------------------------------- */

  /** Drain the deferred-absorb queue (next-update tick after the dispatch). */
  _flushDeferred() {
    for (let i = 0; i < this._deferN; i++) this._cleanupAbsorbed(this._deferQ[i]);
    this._deferN = 0;
  }

  /**
   * Post-absorb slot bookkeeping for one placement. The store slot was freed
   * by absorb.js (and possibly re-allocated by the chunk spawner since) — we
   * touch only OUR maps. Render slot: chunk-coded objects were freed/stolen
   * by the main attach handler (it can see chunk pools), EXTRA pool slots are
   * exclusively curated-owned and are freed from the remembered slot here.
   * @param {number} pi Placement index.
   */
  _cleanupAbsorbed(pi) {
    const idx = this._slotOf[pi];
    if (idx < 0) return; // already cleaned (double absorb impossible; defensive)
    const kind = this._renderPool[pi];
    const slot = this._renderSlot[pi];
    if (kind >= 0 && kind < 4 && slot >= 0) {
      const pool = this._extraPools[kind];
      if (pool) pool.free(slot); // zero-scale reclaim (object is on the ball now)
    }
    this._renderPool[pi] = -1;
    this._renderSlot[pi] = -1;
    this._slotOf[pi] = -1;
    if (this._placementOfSlot[idx] === pi) this._placementOfSlot[idx] = -1;
    if (this._alive > 0) this._alive--;
  }

  /** Emit the queued EVT.LANDMARK events (after the full ABSORB chain). */
  _flushLandmarks() {
    for (let i = 0; i < this._lmN; i++) this._emitLandmark(this._lmQ[i]);
    this._lmN = 0;
  }

  /** @param {number} pi Placement index carrying landmarkId >= 0. */
  _emitLandmark(pi) {
    const id = this._lm[pi];
    PAYLOADS.landmark.landmarkId = id;
    PAYLOADS.landmark.nameJa = this._lmName[id] || '';
    PAYLOADS.landmark.sizeReal = this._lmSizeReal[id] || 0;
    this._bus.emit(EVT.LANDMARK, PAYLOADS.landmark);
  }

  /* ---------------------------------------------------------------- */
  /* Activation / deactivation                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Effective load radius (CURRENT sim units): the LOAD_RADIUS_MIN_M floor
   * mirrors the fog floor so fog < load holds at every worldScale.
   * @param {number} tierIndex @param {number} invWS
   * @returns {number}
   */
  _effLoad(tierIndex, invWS) {
    const t = tierIndex < TIERS.length ? tierIndex : TIERS.length - 1;
    const lr = TIERS[t].loadRadiusSim;
    const floor = LOAD_RADIUS_MIN_M * invWS;
    return lr > floor ? lr : floor;
  }

  /**
   * Visit one placement: activate / deactivate / re-stamp band.
   * @param {number} pi @param {THREE.Vector3} ballPos @param {number} tier
   * @param {number} ballR @param {number} effLoad @param {number} invWS
   */
  _visit(pi, ballPos, tier, ballR, effLoad, invWS) {
    if ((this._consumed[pi >> 5] & (1 << (pi & 31))) !== 0) return;
    const store = this._store;
    const idx = this._slotOf[pi];
    const objR = this._rReal[pi] * invWS;
    const sx = this._x[pi] * invWS - this._originX;
    const sz = this._z[pi] * invWS - this._originZ;
    const dx = sx - ballPos.x;
    const dz = sz - ballPos.z;
    const dist2 = dx * dx + dz * dz;
    const isSpecial = this._col[pi] >= 0 || this._lm[pi] >= 0; // collectible/landmark
    const reach = effLoad + objR;

    if (idx >= 0) {
      /* ---- active: re-stamp band (belt & suspenders) + deactivation ---- */
      if (DEV) {
        // The synchronous TIER_UP re-stamp must keep every alive curated
        // slot inside the live window at all times — finding one outside
        // here means the re-banding protocol broke (assert BEFORE the
        // belt-and-suspenders fix below, or it could never fire).
        const b = store.tierOf[idx];
        if (b < Math.max(0, tier - 1) || b > tier + 1) {
          throw new Error(`[curated] slot ${idx} band ${b} outside live window at tier ${tier}`);
        }
      }
      const band = clampBand(this._nb[pi], tier);
      if (store.tierOf[idx] !== band) store.tierOf[idx] = band;
      const out = dist2 > reach * reach * (RING_HYSTERESIS * RING_HYSTERESIS);
      const subPixel = !isSpecial && 2 * objR < SUBPIXEL_RATIO * ballR;
      if (out || subPixel) {
        // consume = false ALWAYS: identity lives in the consumed bitmask
        // only; ring-outs reactivate on approach, sub-pixel dressing simply
        // never re-passes the activation gate (the ball only grows).
        this._deactivate(pi, subPixel ? SUBPIXEL_FADE_S : DESPAWN_FADE_S, tier);
      }
      return;
    }

    /* ---- inactive: activation gate ---- */
    if ((this._pflags[pi] & PF_RELEASE_GATED) !== 0 && !this._released) return;
    if (dist2 > reach * reach) return;
    if (!isSpecial && 2 * objR < SUBPIXEL_RATIO * ballR) return; // sub-pixel gate (skipped for specials — 'never lost')
    this._activate(pi, sx, sz, objR, tier, ballPos, ballR, invWS);
  }

  /**
   * Materialize one placement into the shared store (+hash +render slot).
   * @param {number} pi @param {number} sx @param {number} sz Sim position.
   * @param {number} objR Sim radius. @param {number} tier Current tier.
   * @param {THREE.Vector3} ballPos @param {number} ballR @param {number} invWS
   */
  _activate(pi, sx, sz, objR, tier, ballPos, ballR, invWS) {
    const store = this._store;
    const idx = store.alloc();
    if (idx < 0) return; // store exhausted — round-robin retries naturally

    const code = this._code[pi];
    const band = clampBand(this._nb[pi], tier);
    const py = this._restY(pi, objR, invWS);

    store.px[idx] = sx;
    store.py[idx] = py;
    store.pz[idx] = sz;
    store.radius[idx] = objR;
    store.archetype[idx] = code;
    store.tierOf[idx] = band;
    store.flags[idx] = FLAG_ALIVE | FLAG_CURATED | (this._col[pi] >= 0 ? FLAG_RARE : 0);

    /* render slot: chunk pool (codes < 70) or shared EXTRA size-class pool */
    let pool = null;
    let kind = -1;
    if (code < CHUNK_CODES) {
      pool = this._getChunkPool(code);
      kind = 4;
    } else {
      kind = code >= V5_BASE ? V5_POOL_CLASS[code - V5_BASE] : EXTRA_POOL_CLASS[code - EXTRA_BASE];
      pool = this._extraPools[kind];
    }
    // alloc(code): the shared EXTRA pools (render/extraPools.js BatchedMesh
    // adapters) pick the member geometry by code; chunk InstancedPools
    // ignore the argument (integration-time contract).
    const slot = pool ? pool.alloc(code) : -1;
    store.instanceSlot[idx] = slot;
    if (slot >= 0) {
      let hex = this._colorHex[pi];
      if (hex < 0) {
        const pal = code < CHUNK_CODES ? this._chunkPalette[code] : FALLBACK_PALETTE;
        hex = pal[pi % pal.length];
      }
      pool.setColor(slot, hex);
      _QUAT.setFromAxisAngle(_AXIS, this._yaw[pi]);
      _POS.set(sx, py, sz);
      pool.setTransform(slot, _POS, _QUAT, objR);
      // Belt-and-suspenders: anything inside the floored fog range fades in.
      const fogFar = Math.max(FOG_FAR_K * ballR, FOG_FAR_MIN_M * invWS);
      const dx = sx - ballPos.x;
      const dz = sz - ballPos.z;
      if (dx * dx + dz * dz < fogFar * fogFar) pool.fadeIn(slot, SPAWN_FADE_S);
    } else if (DEV && pool) {
      console.warn(`[curated] render pool exhausted for code ${code} (kind ${kind}) — invisible but collidable`);
    }

    const rel = band - tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].insert(idx, sx, sz);
    }

    this._slotOf[pi] = idx;
    this._renderSlot[pi] = slot;
    this._renderPool[pi] = kind;
    this._placementOfSlot[idx] = pi;
    this._alive++;
  }

  /**
   * Ring/sub-pixel deactivation (consume = false): scale-fade the render
   * slot, remove from the hash, free the store slot, clear maps. Identity is
   * preserved by the consumed bitmask alone.
   * @param {number} pi @param {number} fadeS @param {number} tier
   */
  _deactivate(pi, fadeS, tier) {
    const store = this._store;
    const idx = this._slotOf[pi];
    if (idx < 0) return;
    const kind = this._renderPool[pi];
    const slot = this._renderSlot[pi];
    let pool = null;
    if (kind === 4) pool = this._getChunkPool(this._code[pi]);
    else if (kind >= 0) pool = this._extraPools[kind];
    if (pool && slot >= 0) pool.fadeOut(slot, fadeS);

    const rel = store.tierOf[idx] - tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].remove(idx);
    }
    store.free(idx);
    this._slotOf[pi] = -1;
    this._renderSlot[pi] = -1;
    this._renderPool[pi] = -1;
    this._placementOfSlot[idx] = -1;
    if (this._alive > 0) this._alive--;
  }

  /* ---------------------------------------------------------------- */
  /* Helpers                                                           */
  /* ---------------------------------------------------------------- */

  /**
   * Rest height (sim) of a placement: surface height (lerped to 0 during the
   * release y-drop for elevated interior items) + radius * yK (yK flattens
   * the decal/bridge profiles) + catalog yOffset for chunk codes.
   * @param {number} pi @param {number} objR @param {number} invWS
   * @returns {number}
   */
  _restY(pi, objR, invWS) {
    let ySurf = this._ySurf[pi];
    if ((this._pflags[pi] & PF_ELEVATED) !== 0 && this._released) {
      ySurf *= 1 - (this._dropT < RELEASE_FADE_S ? this._dropT / RELEASE_FADE_S : 1);
    }
    const code = this._code[pi];
    const yOff = code < CHUNK_CODES ? this._chunkYOff[code] : 0;
    return ySurf * invWS + objR * (1 + yOff) * this._yK[pi];
  }

  /** Release y-drop: lerp every alive elevated item down with the wall fade. */
  _applyYDrop(invWS) {
    const store = this._store;
    const list = this._elevatedList;
    for (let i = 0; i < list.length; i++) {
      const pi = list[i];
      const idx = this._slotOf[pi];
      if (idx < 0) continue;
      const objR = store.radius[idx];
      const py = this._restY(pi, objR, invWS);
      store.py[idx] = py;
      const kind = this._renderPool[pi];
      const slot = this._renderSlot[pi];
      let pool = null;
      if (kind === 4) pool = this._getChunkPool(this._code[pi]);
      else if (kind >= 0) pool = this._extraPools[kind];
      if (pool && slot >= 0) {
        _QUAT.setFromAxisAngle(_AXIS, this._yaw[pi]);
        _POS.set(store.px[idx], py, store.pz[idx]);
        pool.setTransform(slot, _POS, _QUAT, objR);
      }
    }
  }

  /**
   * Lazily resolve a chunk InstancedPool by archetype code (pools may be
   * created after construction). Allocation-free.
   * @param {number} code @returns {object|null}
   */
  _getChunkPool(code) {
    let pool = this._chunkPool[code];
    if (pool === null || pool === undefined) {
      const src = this._instances;
      if (src) {
        const id = ARCHETYPE_ID_BY_CODE[code];
        pool = typeof src.get === 'function' ? src.get(id) : src[id];
        if (pool) this._chunkPool[code] = pool;
        else pool = null;
      } else {
        pool = null;
      }
    }
    return pool;
  }
}

/**
 * Dynamic re-banding clamp: tierOf = clamp(naturalBand, tier-1, tier+1),
 * floored at band 0 (BINDING — guarantees every curated slot lives inside
 * the 3 live banded hashes: pushback from not-yet-absorbable landmarks AND
 * late absorbs of small collectibles both stay possible at every tier).
 * @param {number} naturalBand @param {number} tier
 * @returns {number}
 */
function clampBand(naturalBand, tier) {
  let lo = tier - 1;
  if (lo < 0) lo = 0;
  const hi = tier + 1;
  return naturalBand < lo ? lo : naturalBand > hi ? hi : naturalBand;
}
