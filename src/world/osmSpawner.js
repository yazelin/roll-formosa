/**
 * @file osmSpawner.js — v4 OSM building spawner (Stream W, docs/DESIGN-V4.md
 * §ゲームプレイ統合 / §インターフェース — frozen class signature). Feeds the
 * decoded OsmWorld records into the SAME ObjectStore / spatial hashes as the
 * chunk + curated spawners, under the frozen FLAG_OSM ownership protocol —
 * the CURATED ORIGIN/SCALE PATTERN VERBATIM.
 *
 * OWNERSHIP PROTOCOL (v4, frozen):
 *  - FLAG_OSM = 32 (world/objects.js). The chunk spawner skips
 *    (FLAG_CURATED|FLAG_OSM) slots in _onAbsorb/_subPixelSweep/_despawnIndex;
 *    its aliveCount counts only chunk-owned objects. aliveCount here counts
 *    only OSM-owned objects (3-spawner identity: chunk + curated + osm ===
 *    store.aliveCount — headless-tested 300 frames).
 *  - SUBSCRIPTION ORDER (frozen in events.js): chunk spawner -> curated ->
 *    osmSpawner -> main attach -> runStats -> collection -> sfx/effects/hud.
 *    CONSTRUCT THIS CLASS DIRECTLY AFTER CuratedSpawner (the marked stub slot
 *    in main.js) — subscription order is dispatch order.
 *  - SLOT-STEAL CONVENTION: the ABSORB handler here NEVER reads
 *    store.instanceSlot — it only sets the consumed bit (per-tile bitmask in
 *    OsmWorld) and defers ALL slot bookkeeping to the next update() tick.
 *    OSM render slots live in osmPools (render/osmPools.js), invisible to
 *    main's chunk-code POOL_BY_CODE — exclusive ownership like EXTRA codes
 *    (main's attach handler resolves extraClassIndexForCode(94+) = -1 and
 *    touches nothing). knockOff skips codes >= EXTRA_CODE_BASE(70) — absorbed
 *    OSM buildings are permanently stuck (no reinject path).
 *  - DYNAMIC RE-BANDING: activation stamps store.tierOf = clamp(band,
 *    tier-1, tier+1); the EVT.TIER_UP handler re-stamps every alive OSM slot
 *    SYNCHRONOUSLY (ScaleManager rebuilds the banded hashes right after the
 *    emit returns — curated.js precedent, binding).
 *  - HARD ADMISSION CHECK: activation is SKIPPED entirely whenever
 *    store.aliveCount > ALIVE_TOTAL_BUDGET - OSM_ADMISSION_HEADROOM (3968).
 *    At the coverage boundary the chunk spawner runs procedural bands 3/4 at
 *    full density outside while OSM holds its caps inside — enforcement is
 *    runtime, designed as "OSM thins first at the boundary".
 *  - BUDGET: <= OSM_UPDATE_BUDGET (64) slot ops/frame (activations +
 *    deactivations), tiles processed NEAREST-FIRST per live band so close
 *    streetscape wins when throttled. Bands are processed 2 -> 5 (band-2
 *    kiosks are 102 records total — starvation-free by size).
 *  - LIVE WINDOW: only bands within [tier-1, tier+1] (∩ 2..5) activate —
 *    v3's accepted N+2 semantics: buildings outside the window don't exist
 *    yet. Procedural bands 5/6 keep filling the skyline map-wide.
 *  - OSM_ALIVE_CAP per band (192/1536/768/128) — pool feasibility is
 *    boot-asserted in render/osmPools.js (b2+b3 <= 2048, b4+b5 <= 1024).
 *  - RING DEACTIVATION (consume = false): identity lives ONLY in the
 *    consumed bitmasks; ring-outs reactivate on approach. OWN sub-pixel
 *    sweep: objDiameter < SUBPIXEL_RATIO * ballR scale-fades out and simply
 *    never re-passes the activation gate (the ball only grows).
 *  - INERT until osmWorld.ready; FOREVER INERT if osmWorld.failed (the
 *    tier-2 deadline latch — bands 3/4 inside coverage flip back to
 *    procedural via cityMap.setOsmCoverageActive(false), main's job).
 *
 * SCALE MODEL (curated verbatim): record data is GAME METERS (= v3 real
 * meters, ORIGIN = BALL START); sim = game / worldScale - origin. worldScale
 * is read LIVE from ScaleManager each update (auto-corrects across
 * devTeleport's direct writes); the origin shift rides EVT.RESCALE (*= S) /
 * EVT.REBASE (+= sx, sz).
 *
 * RENDER: unit-box convention — render scale = (w/2, h/2, d/2) sim while
 * store radius stays rEff (= 0.5*sqrt(w^2+d^2+h^2)); store/render center y =
 * h/2 (the exact circumscribed sphere of the box). Null pools degrade to
 * invisible-but-collidable slots (curated precedent) until Stream R lands.
 *
 * Zero per-frame allocation: flat typed arrays sized at OSM_READY (title-
 * screen work, one-time), fixed queues, module scratch, pre-bound callbacks.
 */

import * as THREE from 'three';
import { TIERS } from '../config/tiers.js';
import { CATALOG } from '../config/catalog.js';
import { ARCHETYPE_ID_BY_CODE, FLAG_ALIVE, FLAG_OSM } from './objects.js';
import { EVT } from '../core/events.js';
import {
  ALIVE_TOTAL_BUDGET,
  DESPAWN_FADE_S,
  FOG_FAR_K,
  FOG_FAR_MIN_M,
  LOAD_RADIUS_MIN_M,
  OSM_ADMISSION_HEADROOM,
  OSM_ALIVE_CAP,
  OSM_UPDATE_BUDGET,
  SPAWN_FADE_S,
  STORE_CAPACITY,
  SUBPIXEL_FADE_S,
  SUBPIXEL_RATIO,
} from '../config/tuning.js';

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/** Ring-deactivation hysteresis multiplier (curated.js value). */
const RING_HYSTERESIS = 1.15;
/** Deferred-absorb queue capacity (overflow drains oldest inline — curated). */
const DEFER_CAP = 256;
/** Active-list deactivation checks per frame (checks are cheap; slot OPS are
 *  what OSM_UPDATE_BUDGET caps). Full active set is <= 2,624. */
const SWEEP_CHECKS = 512;
/** DEV identity-check cadence (updates). */
const DEV_CHECK_INTERVAL = 300;
/** Per-band OSM alive caps as a band-indexed array (frozen tuning values). */
const CAP_BY_BAND = [0, 0, OSM_ALIVE_CAP.b2, OSM_ALIVE_CAP.b3, OSM_ALIVE_CAP.b4, OSM_ALIVE_CAP.b5];
/** Ring margin per band: upper r_eff bound (game m) added to the tile-ring
 *  radius so `effLoad + objR` reaches are conservatively covered at the tile
 *  level (band 5 is open-ended; 130 covers the detail/tower height ceilings). */
const BAND_MAX_REFF = [0, 0, 1.6, 10, 60, 130];
/** Total active capacity = sum of caps (+ slack for transient fade overlap). */
const ACTIVE_CAP = CAP_BY_BAND[2] + CAP_BY_BAND[3] + CAP_BY_BAND[4] + CAP_BY_BAND[5] + 64;
/** Admission limit (frozen arithmetic: 4096 - 128 = 3968). */
const ADMISSION_LIMIT = ALIVE_TOTAL_BUDGET - OSM_ADMISSION_HEADROOM;

/* Module scratch — zero per-frame allocation. */
const _POS = new THREE.Vector3();
const _QUAT = new THREE.Quaternion();
const _AXIS = new THREE.Vector3(0, 1, 0);
const FALLBACK_PALETTE = [0x9aa3ad, 0xb5bdc6, 0x7d8790, 0xcfd6dd];

/**
 * Dynamic re-banding clamp (curated.js convention, binding): tierOf =
 * clamp(band, tier-1, tier+1), floored at 0 — every OSM slot lives inside
 * the 3 live banded hashes (pushback from not-yet-absorbable towers AND
 * late absorbs of small houses both stay possible at every tier).
 * @param {number} band @param {number} tier @returns {number}
 */
function clampBand(band, tier) {
  let lo = tier - 1;
  if (lo < 0) lo = 0;
  const hi = tier + 1;
  return band < lo ? lo : band > hi ? hi : band;
}

/**
 * The OSM spawner. Construct DIRECTLY AFTER CuratedSpawner (frozen ABSORB
 * subscription order) and BEFORE main's attach handler:
 *   const osmSpawner = new OsmSpawner(store, hashes, osmPools, bus, scaleMgr, osmWorld);
 */
export class OsmSpawner {
  /**
   * @param {import('./objects.js').ObjectStore} store Shared SoA store.
   * @param {object[]} hashes 3 SpatialHash, hashes[i] = band tierIndex-1+i.
   * @param {{detail: object|null, large: object|null}} osmPools The two OSM
   *   BatchedExtraPool instances (render/osmPools.js): detail = bands 2-3,
   *   large = bands 4-5. Read LAZILY per use; null pools degrade to
   *   invisible-but-collidable slots (never a crash).
   * @param {import('../core/events.js').EventBus} bus Shared bus.
   * @param {{ worldScale: number, tierIndex: number }} scaleMgr ScaleManager.
   * @param {import('./osmWorld.js').OsmWorld} osmWorld Decoded OSM data.
   */
  constructor(store, hashes, osmPools, bus, scaleMgr, osmWorld) {
    this._store = store;
    this._hashes = hashes;
    this._pools = osmPools || { detail: null, large: null };
    this._bus = bus;
    this._scale = scaleMgr;
    this._osm = osmWorld;

    /* ---- per-code palette snapshot (boot; OSM codes 94..109) ---- */
    const codeCount = ARCHETYPE_ID_BY_CODE.length;
    /** @type {Array<number[]>} indexed by code (sparse below 94). */
    this._palettes = new Array(codeCount).fill(null);
    for (let c = 94; c < codeCount; c++) {
      const a = CATALOG ? CATALOG[ARCHETYPE_ID_BY_CODE[c]] : undefined;
      this._palettes[c] = a && a.palette && a.palette.length > 0 ? a.palette : FALLBACK_PALETTE;
    }

    /* ---- record-indexed state (allocated on OSM_READY — _arm) ---- */
    this._armed = false;
    /** @type {Int32Array|null} record -> store slot (-1 inactive). */
    this._slotOf = null;
    /** @type {Int32Array|null} record -> render pool slot (-1 none). */
    this._renderSlot = null;
    /** @type {Int32Array|null} record -> active-list position (-1). */
    this._activeIdxOf = null;
    /** @type {Int32Array} store slot -> record (-1). */
    this._recordOfSlot = new Int32Array(STORE_CAPACITY).fill(-1);
    /** @type {Int32Array} Compact active record list (swap-remove). */
    this._active = new Int32Array(ACTIVE_CAP);
    this._activeN = 0;

    /* ---- runtime state ---- */
    this._alive = 0;
    /** @type {Int32Array} Alive count per band 0..5 (OSM_ALIVE_CAP gate). */
    this._aliveByBand = new Int32Array(6);
    this._originX = 0;
    this._originZ = 0;
    this._forceScanPending = false;
    this._sweepCursor = 0;
    this._devTick = 0;
    this._poolWarned = false;
    /* Deferred ABSORB bookkeeping queue (record indices). */
    this._deferQ = new Int32Array(DEFER_CAP);
    this._deferN = 0;

    /* ---- per-update activation context (pre-bound cb, zero alloc) ---- */
    this._ctxBand = 0;
    this._ctxTier = 0;
    this._ctxBallR = 0;
    this._ctxInvWS = 0;
    this._ctxEffLoad = 0;
    this._ctxBallX = 0; // sim
    this._ctxBallZ = 0;
    this._ctxBudget = 0;
    this._ctxBlocked = false; // admission latch for the current pass
    this._visitTileBound = this._visitTile.bind(this);

    /* ---- bus subscriptions (constructor order = frozen dispatch order) ---- */
    bus.on(EVT.ABSORB, this._onAbsorb.bind(this));
    bus.on(EVT.TIER_UP, this._onTierUp.bind(this));
    bus.on(EVT.OSM_READY, this._arm.bind(this));
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

  /** Alive OSM-owned objects (3-spawner identity term). @returns {number} */
  get aliveCount() {
    return this._alive;
  }

  /**
   * Per-frame round-robin (main.js step 3, AFTER curated.update, same
   * finale.inputLocked gate). <= OSM_UPDATE_BUDGET slot ops, nearest-first;
   * inert until osmWorld.ready, forever inert if osmWorld.failed.
   * @param {THREE.Vector3} ballPos Ball center, CURRENT sim units.
   * @param {number} tierIndex Current tier (ScaleManager).
   * @param {number} ballRadiusSim Ball simRadius.
   * @param {number} dt Render-frame delta (s) — reserved (fades live in pools).
   */
  update(ballPos, tierIndex, ballRadiusSim, dt) {
    void dt;
    if (!this._armed || this._osm.failed) return;

    /* 1. Deferred ABSORB bookkeeping (slot-steal-safe; curated pattern). */
    this._flushDeferred();

    const ws = this._scale.worldScale;
    const invWS = 1 / ws;
    const effLoad = this._effLoad(tierIndex, invWS);
    const full = this._forceScanPending;
    this._forceScanPending = false;
    let budget = full ? 0x7fffffff : OSM_UPDATE_BUDGET;

    /* 2. Deactivation sweep over the active list (ring-out + sub-pixel). */
    budget = this._sweepActive(ballPos, tierIndex, ballRadiusSim, effLoad, budget, full);

    /* 3. Activation: NEAREST-FIRST tiles per live band (2..5 ∩ window). */
    if (budget > 0) {
      this._ctxTier = tierIndex;
      this._ctxBallR = ballRadiusSim;
      this._ctxInvWS = invWS;
      this._ctxEffLoad = effLoad;
      this._ctxBallX = ballPos.x;
      this._ctxBallZ = ballPos.z;
      this._ctxBudget = budget;
      this._ctxBlocked = false;
      const ballRealX = (ballPos.x + this._originX) * ws;
      const ballRealZ = (ballPos.z + this._originZ) * ws;
      const loadReal = effLoad * ws;
      for (let band = 2; band <= 5; band++) {
        if (band < tierIndex - 1 || band > tierIndex + 1) continue; // live window only
        if (this._aliveByBand[band] >= CAP_BY_BAND[band]) continue;
        if (this._ctxBudget <= 0 || this._ctxBlocked) break;
        this._ctxBand = band;
        this._osm.forEachTileInRing(
          band, ballRealX, ballRealZ, loadReal + BAND_MAX_REFF[band], this._visitTileBound
        );
      }
    }

    /* 4. DEV ownership identity check (every 300 updates). */
    if (DEV && ++this._devTick >= DEV_CHECK_INTERVAL) {
      this._devTick = 0;
      let counted = 0;
      for (let i = 0; i < this._activeN; i++) {
        if (this._slotOf[this._active[i]] >= 0) counted++;
      }
      if (counted !== this._alive || counted !== this._activeN) {
        throw new Error(
          `[osmSpawner] alive bookkeeping desync: active ${this._activeN} counted ${counted} != alive ${this._alive}`
        );
      }
      let bandSum = 0;
      for (let b = 2; b <= 5; b++) bandSum += this._aliveByBand[b];
      if (bandSum !== this._alive) {
        throw new Error(`[osmSpawner] per-band sum ${bandSum} != alive ${this._alive}`);
      }
    }
  }

  /**
   * devTeleport hook (main calls onTeleport() THEN forceScan()): re-anchor
   * the game->sim mapping at origin 0 (devTeleport maps pos = game/ws) and
   * deactivate every still-active record — survivors carry PRE-teleport
   * coordinates (devTeleport writes worldScale directly, no RESCALE event).
   * Identity lives in the consumed bitmasks; the next update() runs one full
   * unbudgeted pass with the fresh pose. Idempotent (forceScan = same body).
   */
  onTeleport() {
    this._resync();
  }

  /** Deactivate stale actives + schedule one full unbudgeted ring pass. */
  forceScan() {
    this._resync();
  }

  /**
   * Full reset (resetWorld, AFTER curated.reset — binding order). The
   * integrator already reset the ObjectStore/hashes/pools (osmPools are
   * registered in poolList); this clears ONLY osm-owned state. The per-
   * SESSION coverage latch (cityMap.setOsmCoverageActive) is NOT re-armed.
   */
  reset() {
    if (this._armed) {
      this._slotOf.fill(-1);
      this._renderSlot.fill(-1);
      this._activeIdxOf.fill(-1);
      this._osm.resetConsumedMasks();
    }
    this._recordOfSlot.fill(-1);
    this._activeN = 0;
    this._alive = 0;
    this._aliveByBand.fill(0);
    this._originX = 0;
    this._originZ = 0;
    this._forceScanPending = false;
    this._sweepCursor = 0;
    this._deferN = 0;
  }

  /* ---------------------------------------------------------------- */
  /* Bus handlers                                                      */
  /* ---------------------------------------------------------------- */

  /** EVT.OSM_READY — allocate the record-indexed state (title-screen work,
   *  once; same exemption ledger entry as the decode). Never after failed. */
  _arm() {
    if (this._armed || this._osm.failed) return;
    const n = this._osm.count;
    this._slotOf = new Int32Array(n).fill(-1);
    this._renderSlot = new Int32Array(n).fill(-1);
    this._activeIdxOf = new Int32Array(n).fill(-1);
    this._armed = true;
  }

  /**
   * EVT.ABSORB (subscribed THIRD — after chunk spawner and curated, before
   * main's attach handler). BOOKKEEPING IS DEFERRED: only the consumed bit is
   * set here; instanceSlot is NEVER read (slot-steal convention — main's
   * attach handler runs after us and steals/clears it).
   * @param {import('../types.js').AbsorbEvent} p Reused payload (read-only).
   */
  _onAbsorb(p) {
    if (!this._armed) return;
    const idx = p.objIndex;
    if (idx < 0 || idx >= STORE_CAPACITY) return;
    const rec = this._recordOfSlot[idx];
    if (rec < 0) return; // not osm-owned
    if (DEV && (this._store.flags[idx] & FLAG_OSM) === 0) {
      throw new Error(`[osmSpawner] slot ${idx} mapped to record ${rec} but FLAG_OSM is clear`);
    }
    this._osm.markConsumedRec(rec);
    if (this._deferN < DEFER_CAP) {
      this._deferQ[this._deferN++] = rec;
    } else {
      // Overflow (>256 OSM absorbs in ONE render frame): drain the OLDEST
      // deferred entry inline — its own ABSORB dispatch already completed,
      // so the deferral contract holds for the record currently mid-dispatch
      // (curated.js overflow policy verbatim).
      this._cleanupAbsorbed(this._deferQ[0]);
      this._deferQ.copyWithin(0, 1, this._deferN);
      this._deferQ[this._deferN - 1] = rec;
    }
  }

  /**
   * EVT.TIER_UP — SYNCHRONOUS dynamic re-banding: re-stamp every alive OSM
   * slot's tierOf into the new live window BEFORE ScaleManager rebuilds the
   * banded hashes (right after this emit returns — curated.js precedent).
   * @param {import('../types.js').TierUpEvent} p
   */
  _onTierUp(p) {
    if (!this._armed) return;
    const t = p.tierIndex;
    const store = this._store;
    const band = this._osm.bband;
    for (let i = 0; i < this._activeN; i++) {
      const rec = this._active[i];
      const idx = this._slotOf[rec];
      if (idx >= 0) store.tierOf[idx] = clampBand(band[rec], t);
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
   * Post-absorb slot bookkeeping for one record. The store slot was freed by
   * absorb.js (and may have been re-allocated since) — touch only OUR maps.
   * The render slot is EXCLUSIVELY osm-owned (invisible to main's attach
   * handler) and is freed from our remembered slot here.
   * @param {number} rec Record index.
   */
  _cleanupAbsorbed(rec) {
    const idx = this._slotOf[rec];
    if (idx < 0) return; // already cleaned (defensive)
    const slot = this._renderSlot[rec];
    if (slot >= 0) {
      const pool = this._poolForBand(this._osm.bband[rec]);
      if (pool) pool.free(slot); // zero-scale reclaim (object is on the ball now)
    }
    this._unmap(rec, idx);
  }

  /** Clear record<->slot maps + active list + counters for one record. */
  _unmap(rec, idx) {
    this._slotOf[rec] = -1;
    this._renderSlot[rec] = -1;
    if (this._recordOfSlot[idx] === rec) this._recordOfSlot[idx] = -1;
    const ai = this._activeIdxOf[rec];
    if (ai >= 0) {
      const last = this._active[this._activeN - 1];
      this._active[ai] = last;
      this._activeIdxOf[last] = ai;
      this._activeN--;
      this._activeIdxOf[rec] = -1;
    }
    const b = this._osm.bband[rec];
    if (this._aliveByBand[b] > 0) this._aliveByBand[b]--;
    if (this._alive > 0) this._alive--;
  }

  /* ---------------------------------------------------------------- */
  /* Deactivation sweep                                                */
  /* ---------------------------------------------------------------- */

  /**
   * Round-robin over the active list: ring-out (hysteresis *1.15) and
   * sub-pixel deactivation. Checks are cheap (<= SWEEP_CHECKS/frame, or the
   * whole list on a forced full pass); each DEACTIVATION costs budget.
   * @returns {number} Remaining slot-op budget.
   */
  _sweepActive(ballPos, tier, ballR, effLoad, budget, full) {
    const store = this._store;
    const checks = full ? this._activeN : Math.min(this._activeN, SWEEP_CHECKS);
    const subThresh = 0.5 * SUBPIXEL_RATIO * ballR; // radius form of the diameter rule
    let i = 0;
    if (this._sweepCursor >= this._activeN) this._sweepCursor = 0;
    let pos = full ? 0 : this._sweepCursor;
    while (i < checks && this._activeN > 0 && budget > 0) {
      if (pos >= this._activeN) pos = 0;
      const rec = this._active[pos];
      const idx = this._slotOf[rec];
      i++;
      if (idx < 0) {
        pos++;
        continue; // mid-cleanup transient (defensive)
      }
      if (DEV) {
        const b = store.tierOf[idx];
        if (b < Math.max(0, tier - 1) || b > tier + 1) {
          throw new Error(`[osmSpawner] slot ${idx} band ${b} outside live window at tier ${tier}`);
        }
      }
      const objR = store.radius[idx];
      const dx = store.px[idx] - ballPos.x;
      const dz = store.pz[idx] - ballPos.z;
      const reach = (effLoad + objR) * RING_HYSTERESIS;
      const out = dx * dx + dz * dz > reach * reach;
      const subPixel = objR < subThresh;
      if (out || subPixel) {
        this._deactivate(rec, subPixel ? SUBPIXEL_FADE_S : DESPAWN_FADE_S, tier);
        budget--;
        // swap-remove pulled a new record into `pos` — re-check it next loop.
      } else {
        pos++;
      }
    }
    this._sweepCursor = pos;
    return budget;
  }

  /**
   * Ring/sub-pixel deactivation (consume = false): scale-fade the render
   * slot, remove from the hash, free the store slot, clear maps. Identity is
   * preserved by the consumed bitmasks alone (absorbs only).
   * @param {number} rec @param {number} fadeS @param {number} tier
   */
  _deactivate(rec, fadeS, tier) {
    const store = this._store;
    const idx = this._slotOf[rec];
    if (idx < 0) return;
    const slot = this._renderSlot[rec];
    if (slot >= 0) {
      const pool = this._poolForBand(this._osm.bband[rec]);
      if (pool) pool.fadeOut(slot, fadeS);
    }
    const rel = store.tierOf[idx] - tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].remove(idx);
    }
    store.free(idx);
    this._unmap(rec, idx);
  }

  /* ---------------------------------------------------------------- */
  /* Activation (nearest-first tile visit)                             */
  /* ---------------------------------------------------------------- */

  /**
   * Pre-bound forEachTileInRing callback: visit one tile's records in the
   * current band range, activating until the budget / band cap / admission
   * limit stops us. Zero allocation.
   * @param {number} tileIdx
   */
  _visitTile(tileIdx) {
    if (this._ctxBudget <= 0 || this._ctxBlocked) return;
    const osm = this._osm;
    const band = this._ctxBand;
    if (this._aliveByBand[band] >= CAP_BY_BAND[band]) return;
    const s = osm.bandStartOf(tileIdx, band);
    const e = osm.bandStartOf(tileIdx, band + 1);
    const invWS = this._ctxInvWS;
    const tier = this._ctxTier;
    const ballR = this._ctxBallR;
    const effLoad = this._ctxEffLoad;
    const subThresh = 0.5 * SUBPIXEL_RATIO * ballR;
    for (let rec = s; rec < e; rec++) {
      if (this._slotOf[rec] >= 0) continue; // already active
      if (osm.isConsumedRec(rec)) continue; // absorbed this run
      const objR = osm.brEff[rec] * invWS;
      if (objR < subThresh) continue; // sub-pixel gate (the ball only grows)
      const sx = osm.bx[rec] * invWS - this._originX;
      const sz = osm.bz[rec] * invWS - this._originZ;
      const dx = sx - this._ctxBallX;
      const dz = sz - this._ctxBallZ;
      const reach = effLoad + objR;
      if (dx * dx + dz * dz > reach * reach) continue;
      /* HARD ADMISSION CHECK (binding): OSM thins first at the boundary. */
      if (this._store.aliveCount > ADMISSION_LIMIT) {
        this._ctxBlocked = true;
        return;
      }
      if (!this._activate(rec, band, sx, sz, objR, tier, invWS)) return; // store full
      this._ctxBudget--;
      if (this._ctxBudget <= 0) return;
      if (this._aliveByBand[band] >= CAP_BY_BAND[band]) return; // band capped
    }
  }

  /**
   * Materialize one record into the shared store (+hash +osm render slot).
   * @param {number} rec @param {number} band Record band 2..5.
   * @param {number} sx @param {number} sz Sim position.
   * @param {number} objR Sim radius (rEff). @param {number} tier
   * @param {number} invWS
   * @returns {boolean} False only when the ObjectStore is exhausted.
   */
  _activate(rec, band, sx, sz, objR, tier, invWS) {
    const store = this._store;
    const idx = store.alloc();
    if (idx < 0) return false; // store exhausted — ring pass retries next frame

    const osm = this._osm;
    const code = osm.bcode[rec];
    const clamped = clampBand(band, tier);
    const py = 0.5 * osm.bh[rec] * invWS; // box center (circumscribed sphere)

    store.px[idx] = sx;
    store.py[idx] = py;
    store.pz[idx] = sz;
    store.radius[idx] = objR;
    store.archetype[idx] = code;
    store.tierOf[idx] = clamped;
    store.flags[idx] = FLAG_ALIVE | FLAG_OSM;

    const pool = this._poolForBand(band);
    // alloc(code): BatchedExtraPool picks the member geometry by code.
    const slot = pool ? pool.alloc(code) : -1;
    store.instanceSlot[idx] = slot;
    if (slot >= 0) {
      const pal = this._palettes[code] || FALLBACK_PALETTE;
      pool.setColor(slot, pal[osm.btint[rec] % pal.length]);
      _QUAT.setFromAxisAngle(_AXIS, osm.byaw[rec]);
      _POS.set(sx, py, sz);
      // Unit-box convention: per-instance NON-UNIFORM scale (w/2, h/2, d/2)
      // sim; store radius stays rEff (no code may derive radius from scale).
      pool.setTransform(
        slot, _POS, _QUAT,
        0.5 * osm.bw[rec] * invWS, 0.5 * osm.bh[rec] * invWS, 0.5 * osm.bd[rec] * invWS
      );
      // Belt-and-suspenders: anything inside the floored fog range fades in.
      const fogFar = Math.max(FOG_FAR_K * this._ctxBallR, FOG_FAR_MIN_M * invWS);
      const dx = sx - this._ctxBallX;
      const dz = sz - this._ctxBallZ;
      if (dx * dx + dz * dz < fogFar * fogFar) pool.fadeIn(slot, SPAWN_FADE_S);
    } else if (DEV && pool && !this._poolWarned) {
      this._poolWarned = true; // structurally impossible (pool feasibility assert)
      console.warn(`[osmSpawner] osm pool exhausted for code ${code} — invisible but collidable`);
    }

    const rel = clamped - tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].insert(idx, sx, sz);
    }

    this._slotOf[rec] = idx;
    this._renderSlot[rec] = slot;
    this._recordOfSlot[idx] = rec;
    this._activeIdxOf[rec] = this._activeN;
    this._active[this._activeN++] = rec;
    this._aliveByBand[band]++;
    this._alive++;
    return true;
  }

  /* ---------------------------------------------------------------- */
  /* Helpers                                                           */
  /* ---------------------------------------------------------------- */

  /** Pool membership is PER-BAND AND FROZEN: bands 2-3 detail, 4-5 large. */
  _poolForBand(band) {
    return band <= 3 ? this._pools.detail : this._pools.large;
  }

  /**
   * Effective load radius in CURRENT sim units (curated.js formula — the
   * LOAD_RADIUS_MIN_M floor mirrors the fog floor so fog < load holds at
   * every worldScale).
   * @param {number} tierIndex @param {number} invWS @returns {number}
   */
  _effLoad(tierIndex, invWS) {
    const t = tierIndex < TIERS.length ? tierIndex : TIERS.length - 1;
    const lr = TIERS[t].loadRadiusSim;
    const floor = LOAD_RADIUS_MIN_M * invWS;
    return lr > floor ? lr : floor;
  }

  /**
   * Teleport/forceScan resync: flush deferred bookkeeping first (absorbed
   * records must not be 'deactivated'), deactivate every active record
   * (consume = false; defensive hash clears across all 3 bands — the re-band
   * rel may be stale at teleport time, remove() is a no-op when absent),
   * re-anchor origin at 0, schedule one full unbudgeted pass.
   */
  _resync() {
    if (!this._armed) return;
    this._flushDeferred();
    const tier = this._scale.tierIndex;
    while (this._activeN > 0) {
      const rec = this._active[this._activeN - 1];
      const idx = this._slotOf[rec];
      if (idx < 0) {
        // Stale active entry (impossible by invariant — drop defensively so
        // the loop can never stall).
        this._activeIdxOf[rec] = -1;
        this._activeN--;
        continue;
      }
      if (this._hashes) {
        for (let h = 0; h < 3; h++) {
          if (this._hashes[h]) this._hashes[h].remove(idx);
        }
      }
      this._deactivate(rec, 0, tier);
    }
    this._originX = 0;
    this._originZ = 0;
    this._sweepCursor = 0;
    this._forceScanPending = true;
  }
}
