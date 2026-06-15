/**
 * @file spawner.js — Deterministic chunk streaming (Dev B / world stream).
 *
 * Responsibilities (DESIGN.md スポーン / カタログ):
 *  - Deterministic chunk placement: chunk (cx, cz, band) contents are a pure
 *    function of hash(worldSeed, cx, cz, band) + a per-placement sub-seed, so
 *    the same chunk ALWAYS regenerates identically (mulberry32 sequence).
 *  - Wanted-vs-loaded chunk diffing per live band (N targets, N+1 scenery,
 *    N+2 pre-warm at PREWARM_FRACTION), recomputed only on chunk-boundary
 *    crossings / tier changes — steady-state frames do zero diffing work.
 *  - Amortized spawn/despawn ring queues, <= SPAWN_BUDGET_PER_FRAME and
 *    <= DESPAWN_BUDGET_PER_FRAME per frame, front-of-motion chunks first.
 *  - Consumed bitmasks: Map<packedChunkKey, Uint32Array> in ORIGIN-UNSHIFTED
 *    global chunk coordinates (survive rebase + rescale). Bitmasks for bands
 *    <= currentTier-2 are forgotten (bounded memory).
 *  - Sub-pixel despawn sweep: round-robin scan of SUBPIXEL_SWEEP_BUDGET store
 *    slots per frame; objDiameter < SUBPIXEL_RATIO * ballRadius => scale-fade.
 *  - Origin-shift re-keying: chunk keys are global; the spawner keeps the
 *    accumulated origin shift (originX/originZ, current sim units) and the
 *    rescale exponent so global<->current conversions stay exact.
 *  - Knock-off re-injection: ball.knockOff() WorldReentry records re-enter as
 *    ballistic world instances (small fixed flight pool, then static).
 *  - v2 LANDMARKS: archetype slots [8]/[9] of every tier are archRoll-eligible
 *    ONLY for placement j === 0 of a chunk (dual cumulative weight tables
 *    _cumW8 / _cumW10, ONE archRoll draw either way at the same draw position
 *    — eligibility depends only on j, so a scenery chunk later upgraded to
 *    target role regenerates identically).
 *  - v2 RARES: rareRoll is drawn LAST, UNCONDITIONALLY, for every placement;
 *    rareRoll < RARE_CHANCE on a non-landmark slot promotes the placement
 *    (FLAG_RARE, RARE_TINT instanceColor, scale * RARE_SCALE_MUL). Alive rares
 *    are tracked in a bounded (storeIdx, slotGen) Int32Array list exposed via
 *    forEachAliveRare() (effects golden twinkles); reinjected knock-offs are
 *    NEVER rare (score credit was granted at absorb — no double count).
 *  - v3 ZONE MASKS (docs/DESIGN-V3.md スポーンアーキテクチャ): AFTER the
 *    deterministic draws complete, a placement is dropped unless
 *    cityMap.bandAllowedAt(xReal, zReal, band) — a static pure lookup over
 *    the authored district rects in REAL METERS (native coords ARE real
 *    meters / worldScale_band, so the bridge is one multiply). Chunk
 *    contents remain a pure function of (seed, cx, cz, band).
 *  - v3 DENSITY: per-band placement counts are scaled by densityKForBand(band)
 *    (0.45 — the ONE pacing truth; wantK only truncates the placement list,
 *    the per-placement draw sequence is untouched).
 *  - v3 LOAD FLOOR: effective load radius = max(loadRadiusSim,
 *    LOAD_RADIUS_MIN_M / worldScale) in the ring math (mirrors the fog
 *    floor; fog < load holds at all radii — asserted in config/tiers.js).
 *  - v3 FLAG_CURATED ownership: world/curated.js allocates from the SAME
 *    store under FLAG_CURATED (16). _onAbsorb, _subPixelSweep and every
 *    chunk-side free SKIP flagged slots (one bit test); _aliveCount counts
 *    only chunk-owned objects. DEV assert: no chunk op ever frees a flagged
 *    slot (_despawnIndex). NOTE store.tierOf is 'curated-mutable' for
 *    flagged slots (dynamic re-banding) — never cache it across frames.
 *
 * SCALE MODEL: band b's chunk grid lives in b's NATIVE sim units (the sim
 * scale when b is the current tier, worldScale_b = 0.1 * 5^b). Conversion
 * native->current is *5^(b - k) where k = rescale count (worldScale = 0.1*5^k).
 * Native chunk coordinates are INVARIANT under rescale ((x+origin) scales by
 * S exactly as 5^-1, k increments) and under rebase (origin absorbs the shift),
 * which is what keeps the consumed bitmasks deterministic forever.
 *
 * Zero-allocation discipline: all queues/records/scratch are preallocated;
 * steady-state update() allocates nothing. Map iteration / tiny sorts happen
 * only on chunk-boundary crossings and tier changes (seconds apart).
 */

import * as THREE from 'three';
import { TIERS, ARCH_PER_TIER } from '../config/tiers.js';
import { hash } from '../core/rng.js';
import { FreeList, IntRing } from '../core/pool.js';
import { EVT } from '../core/events.js';
import { FLAG_RARE, FLAG_CURATED, FLAG_OSM } from './objects.js';
import { bandAllowedAt } from '../config/cityMap.js';
import {
  ALIVE_TOTAL_BUDGET,
  densityKForBand,
  DESPAWN_BUDGET_PER_FRAME,
  DESPAWN_FADE_S,
  FIXED_DT,
  FOG_FAR_K,
  FOG_FAR_MIN_M,
  LOAD_RADIUS_MIN_M,
  PREWARM_FRACTION,
  RARE_CHANCE,
  RARE_LIST_CAP,
  RARE_SCALE_MUL,
  RARE_TINT,
  SCENERY_LOAD_RADIUS_SIM,
  SCENERY_OBJECTS_PER_CHUNK,
  SIM_RADIUS_MAX,
  SIM_RADIUS_MIN,
  SPAWN_BUDGET_PER_FRAME,
  SPAWN_FADE_S,
  START_RADIUS_M,
  STORE_CAPACITY,
  SUBPIXEL_FADE_S,
  SUBPIXEL_RATIO,
  SUBPIXEL_SWEEP_BUDGET,
} from '../config/tuning.js';

/** @typedef {import('../types.js').Archetype} Archetype */
/** @typedef {import('../types.js').WorldReentry} WorldReentry */

/* ================================================================== */
/* Module constants                                                    */
/* ================================================================== */

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/** Max simultaneously loaded chunk records across all bands. */
const MAX_RECORDS = 512;
/** Per-record spawned-entry capacity (>= max objectsPerChunk). */
const MAX_PLACEMENTS = 128;
/** Jittered sub-grid: SUBGRID x SUBGRID cells per chunk (Poisson-quality spacing). */
const SUBGRID = 9;
const SUBGRID_CELLS = SUBGRID * SUBGRID;
/** Stride coprime with 81 so consecutive placement indices scatter across the sub-grid. */
const SUBGRID_STRIDE = 37;
/** Knock-off ballistic flight pool size. */
const REENTRY_CAP = 16;
/** Arcade sim-space gravity for knock-off pops (scale-free, sim/s^2). */
const REENTRY_GRAVITY = 30;
/** Hard cap (current sim units) on how far out the N+2 pre-warm ring reaches. */
const PREWARM_CAP_CUR = 1200;
/** Max actual sub-pixel despawns per frame (scan budget is SUBPIXEL_SWEEP_BUDGET). */
const SUBPIXEL_KILL_CAP = 32;
/** Leftover-band (N-1) record cleanup checks per frame (round-robin). */
const CLEANUP_RECORDS_PER_FRAME = 16;
/** Store slot index mask (STORE_CAPACITY is a power of two). */
const STORE_MASK = STORE_CAPACITY - 1;
/** Powers of five for exact native<->current conversion (|exponent| <= 12 —
 *  v3 headroom for KeyR force-rescale spam past the natural k <= 6 ladder). */
const POW5 = [1, 5, 25, 125, 625, 3125, 15625, 78125, 390625, 1953125, 9765625, 48828125, 244140625];
/* FLAG_CURATED (16, frozen) now imported from objects.js — unified at
 * integration per the Phase-0 note. */
/** v4 skip-bit widening (docs/DESIGN-V4.md spawner ownership, the ONE
 *  spawner.js change): every chunk-side ownership test that skipped
 *  FLAG_CURATED slots now skips FLAG_OSM (32) slots too — osmSpawner owns
 *  their bookkeeping exactly like curated owns its own. No other logic
 *  change (zone masking is data-driven via bandAllowedAt). */
const SKIP_FLAGS = FLAG_CURATED | FLAG_OSM;
/** Boot worldScale (band-native real meters per native sim unit at band 0). */
const WS0 = START_RADIUS_M / SIM_RADIUS_MIN;

const TWO_PI = Math.PI * 2;

/* ================================================================== */
/* Frozen archetype index convention                                   */
/* ================================================================== */

/**
 * Global numeric archetype index convention (shared with ObjectStore.archetype
 * U16 and absorb.js): index = tier * ARCH_PER_TIER + positionInTier (0..69,
 * v3: 7 tiers), derived from the FROZEN TIERS[t].archetypeIds order (slots
 * 8/9 = chunk landmarks). EXTRA curated codes 70..93 are NOT spawner-known —
 * world/curated.js owns them.
 * @type {string[]}
 */
export const ARCHETYPE_IDS = [];
/** @type {Map<string, number>} id -> global archetype index. */
const ARCH_INDEX = new Map();
for (let t = 0; t < TIERS.length; t++) {
  const ids = TIERS[t].archetypeIds;
  for (let i = 0; i < ids.length; i++) {
    ARCH_INDEX.set(ids[i], ARCHETYPE_IDS.length);
    ARCHETYPE_IDS.push(ids[i]);
  }
}

/**
 * Resolve a catalog id to its global numeric archetype index
 * (tier*ARCH_PER_TIER + pos).
 * @param {string} id Catalog id.
 * @returns {number} Index 0..69, or -1 if unknown.
 */
export function archetypeIndexFor(id) {
  const i = ARCH_INDEX.get(id);
  return i === undefined ? -1 : i;
}

/**
 * Resolve a global numeric archetype index back to its catalog id.
 * @param {number} index Index 0..69.
 * @returns {string} Catalog id, or '' if out of range.
 */
export function archetypeIdFor(index) {
  return index >= 0 && index < ARCHETYPE_IDS.length ? ARCHETYPE_IDS[index] : '';
}

/* ================================================================== */
/* Module scratch (zero per-frame allocation)                          */
/* ================================================================== */

const _POS = new THREE.Vector3();
const _QUAT = new THREE.Quaternion();
const _AXIS = new THREE.Vector3(0, 1, 0);

/**
 * Pack a global chunk key: band (3 bits) | cx+8192 (14 bits) | cz+8192 (14 bits).
 * Keys are ORIGIN-UNSHIFTED and rescale-invariant.
 * @param {number} band Tier band 0..7.
 * @param {number} cx Global native chunk x (|cx| < 8192).
 * @param {number} cz Global native chunk z (|cz| < 8192).
 * @returns {number} Packed positive int31 key.
 */
function packKey(band, cx, cz) {
  if (DEV && (cx < -8192 || cx >= 8192 || cz < -8192 || cz >= 8192)) {
    throw new Error(`[spawner] chunk coord out of key range: ${cx},${cz}`);
  }
  return (band << 28) | (((cx + 8192) & 0x3fff) << 14) | ((cz + 8192) & 0x3fff);
}

/** @param {number} key @returns {number} Band bits of a packed key. */
function keyBand(key) {
  return (key >>> 28) & 7;
}

/** @param {number} d Exponent in [-7, 7]. @returns {number} 5^d. */
function pow5(d) {
  return d >= 0 ? POW5[d] : 1 / POW5[-d];
}

/* ================================================================== */
/* Spawner                                                             */
/* ================================================================== */

/**
 * Deterministic amortized world streamer. Owns chunk records, spawn/despawn
 * queues, consumed bitmasks, the sub-pixel sweep, and knock-off re-injection.
 *
 * External contracts used (signatures only — DESIGN.md):
 *  - ObjectStore: px/py/pz/radius (F32), archetype (U16), tierOf/flags (U8),
 *    instanceSlot (I32), alloc():int, free(i).
 *  - SpatialHash[3]: hashes[i] holds band (currentTier - 1 + i);
 *    insert(i,x,z), remove(i). (Rebuilds are ScaleManager's job.)
 *  - InstancedPool per archetype id: alloc(), free(), setTransform(slot,
 *    posV3, quat, uniformScale:number), setColor(slot,hex), fadeIn(slot,s),
 *    fadeOut(slot,s) — fadeOut reclaims the instance slot when done.
 */
export class Spawner {
  /**
   * @param {number} worldSeed uint32 world seed (resolveWorldSeed()).
   * @param {object} store ObjectStore (Dev A).
   * @param {object[]} hashes 3 SpatialHash instances, hashes[i] = band tier-1+i.
   * @param {Map<string, object>|Object<string, object>} instances InstancedPool
   *   per archetype id (Map or plain record; looked up lazily so pools may be
   *   created after construction).
   * @param {import('../core/events.js').EventBus} bus Shared event bus.
   * @param {Object<string, Archetype>|null} [catalog] CATALOG from
   *   config/catalog.js. Optional so this module integrates before Dev E
   *   lands; missing entries get neutral placeholder stats.
   * @param {{ worldScale: number, rescaleCount: number }|null} [scaleMgr]
   *   v3 OPTIONAL ScaleManager reference — used ONLY by onTeleport() to
   *   resync the scale exponent after devTeleport's direct worldScale write
   *   (steady-state scale tracking stays event-driven via EVT.RESCALE).
   */
  constructor(worldSeed, store, hashes, instances, bus, catalog = null, scaleMgr = null) {
    /** @type {{ worldScale: number, rescaleCount: number }|null} */
    this._scaleMgr = scaleMgr;
    /** @type {number} uint32 world seed. */
    this.worldSeed = worldSeed >>> 0;
    this._store = store;
    this._hashes = hashes;
    this._instances = instances;
    this._bus = bus;

    /* ---- resolved per-archetype stats (70 entries v3, fallback defaults) ---- */
    const n = ARCHETYPE_IDS.length;
    this._radNom = new Float64Array(n);
    this._jit = new Float64Array(n);
    this._yOff = new Float64Array(n);
    this._upright = new Uint8Array(n);
    this._tierOfArch = new Uint8Array(n);
    /** @type {Array<number[]>} */
    this._palettes = new Array(n);
    /** @type {Array<object|null>} Lazily resolved InstancedPool per archetype. */
    this._poolOf = new Array(n);
    /**
     * Dual cumulative spawn-weight tables (v2 landmark eligibility rule):
     * _cumW8 spans slots 0-7 only (used for placements j > 0); _cumW10 spans
     * all ARCH_PER_TIER slots incl. landmarks 8/9 (used ONLY for j === 0).
     * Both row-major per tier; matching totals in _wTot8/_wTot10.
     */
    this._cumW8 = new Float64Array(TIERS.length * 8);
    this._cumW10 = new Float64Array(TIERS.length * ARCH_PER_TIER);
    this._wTot8 = new Float64Array(TIERS.length);
    this._wTot10 = new Float64Array(TIERS.length);
    this._resolveCatalog(catalog);

    /* ---- alive-rare list: (storeIdx, slotGen) pairs, bounded (v2) ---- */
    /** @type {Int32Array} Pairs [idx0, gen0, idx1, gen1, ...]. */
    this._rareList = new Int32Array(2 * RARE_LIST_CAP);
    /** @type {number} Live pair count (<= RARE_LIST_CAP). */
    this._rareCount = 0;
    /** @type {boolean} DEV: 0.9 * ALIVE_TOTAL_BUDGET warning latch. */
    this._aliveWarned = false;

    /* ---- chunk records ---- */
    /** @type {Array<{active:boolean,key:number,band:number,cx:number,cz:number,seed:number,sub:number,gen:number,stamp:number,wantK:number,enqueuedThrough:number,count:number,entries:Int32Array}>} */
    this._records = new Array(MAX_RECORDS);
    for (let i = 0; i < MAX_RECORDS; i++) {
      this._records[i] = {
        active: false, key: 0, band: 0, cx: 0, cz: 0, seed: 0, sub: 0,
        gen: 0, stamp: 0, wantK: 0, enqueuedThrough: 0, count: 0,
        entries: new Int32Array(MAX_PLACEMENTS),
      };
    }
    this._recordFree = new FreeList(MAX_RECORDS);
    /** @type {Map<number, number>} packed key -> record index. */
    this._recordByKey = new Map();

    /* ---- amortized queues ---- */
    /** Spawn entries: recIdx (9b) | placement (7b)<<9 | recGen (8b)<<16. */
    this._spawnQ = new IntRing(8192);
    /** Despawn entries: storeIdx (13b) | slotGen (8b)<<13. */
    this._despawnQ = new IntRing(8192);

    /* ---- consumed bitmasks (global keys, survive unload/rebase/rescale) ---- */
    /** @type {Map<number, Uint32Array>} */
    this._consumed = new Map();

    /* ---- per-store-slot bookkeeping ---- */
    this._chunkKeyOf = new Int32Array(STORE_CAPACITY).fill(-1);
    this._placementOf = new Int16Array(STORE_CAPACITY).fill(-1);
    this._slotGen = new Uint8Array(STORE_CAPACITY);

    /* ---- scale / origin state ---- */
    /** Rescale count k: worldScale = (START_RADIUS_M/SIM_RADIUS_MIN) * 5^k. */
    this._scaleExp = 0;
    /** 1 / worldScale (current). simRadius = radiusRealMeters * this. */
    this._invWorldScale = SIM_RADIUS_MIN / START_RADIUS_M;
    /** Accumulated floating-origin shift, CURRENT sim units (global = render + origin). */
    this._originX = 0;
    this._originZ = 0;

    /* ---- band caches (slots 0..2 = bands tier, tier+1, tier+2) ---- */
    this._bandBX = new Int32Array(3);
    this._bandBZ = new Int32Array(3);
    this._bandValid = new Uint8Array(3);
    this._prewarmActive = false;
    this._lastTier = 0;
    this._stamp = 0;

    /* ---- per-update ball snapshot ---- */
    this._tier = 0;
    this._ballX = 0;
    this._ballZ = 0;
    this._ballR = SIM_RADIUS_MIN;
    this._lastBX = 0;
    this._lastBZ = 0;
    this._haveLastBall = false;
    this._dirX = 1;
    this._dirZ = 0;

    /* ---- cursors / counters ---- */
    this._sweepCursor = 0;
    this._cleanupCursor = 0;
    this._aliveCount = 0;
    this._droppedSpawns = 0; // dev: pool/store-full placements lost until chunk reload

    /* ---- new-chunk sort scratch ---- */
    this._newCx = new Int32Array(MAX_RECORDS);
    this._newCz = new Int32Array(MAX_RECORDS);
    this._newDist = new Float64Array(MAX_RECORDS);

    /* ---- knock-off flight pool ---- */
    /** @type {Array<{active:boolean,idx:number,gen:number,archIdx:number,x:number,y:number,z:number,vx:number,vy:number,vz:number,restY:number,yaw:number}>} */
    this._flights = new Array(REENTRY_CAP);
    for (let i = 0; i < REENTRY_CAP; i++) {
      this._flights[i] = {
        active: false, idx: -1, gen: 0, archIdx: 0,
        x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, restY: 0, yaw: 0,
      };
    }

    /* ---- inline mulberry32 state (no closure allocation per spawn) ---- */
    this._rngA = 0;

    /* ---- bus subscriptions (bound once; payloads never retained) ---- */
    this._onAbsorbBound = this._onAbsorb.bind(this);
    this._onRescaleBound = this._onRescale.bind(this);
    bus.on(EVT.ABSORB, this._onAbsorbBound);
    bus.on(EVT.RESCALE, this._onRescaleBound);
  }

  /* ---------------------------------------------------------------- */
  /* Public API                                                        */
  /* ---------------------------------------------------------------- */

  /** Total alive world objects this spawner believes exist. @returns {number} */
  get aliveCount() {
    return this._aliveCount;
  }

  /** Currently loaded chunk records (debug overlay). @returns {number} */
  get loadedChunkCount() {
    return this._recordFree.allocatedCount;
  }

  /**
   * Per-frame streaming step (main.js step 3 — called once per render frame).
   * Order: tier handoff -> wanted/loaded diff (crossing-gated) -> leftover
   * cleanup -> despawn drain -> spawn drain -> sub-pixel sweep -> flights.
   * @param {THREE.Vector3} ballPos Ball center, CURRENT sim units.
   * @param {number} tierIndex Current tier from ScaleManager.
   * @param {number} [ballRadiusSim] Ball simRadius (fog/sub-pixel/pre-warm rules).
   * @param {number} [dt] Render-frame delta seconds (flight integration).
   */
  update(ballPos, tierIndex, ballRadiusSim = SIM_RADIUS_MIN, dt = FIXED_DT) {
    this._tier = tierIndex;
    this._ballX = ballPos.x;
    this._ballZ = ballPos.z;
    this._ballR = ballRadiusSim;

    /* Move direction for front-of-motion spawn ordering. */
    if (this._haveLastBall) {
      const dx = ballPos.x - this._lastBX;
      const dz = ballPos.z - this._lastBZ;
      const len = Math.sqrt(dx * dx + dz * dz);
      if (len > 1e-5) {
        this._dirX = dx / len;
        this._dirZ = dz / len;
      }
    } else {
      this._haveLastBall = true;
    }
    this._lastBX = ballPos.x;
    this._lastBZ = ballPos.z;

    /* Tier handoff: forget N-2 (chunks + bitmasks), re-band everything. */
    if (tierIndex !== this._lastTier) this._onTierChange(tierIndex);

    /* Pre-warm N+2 beyond fog at PREWARM_FRACTION of the band. */
    const progress = (ballRadiusSim - SIM_RADIUS_MIN) / (SIM_RADIUS_MAX - SIM_RADIUS_MIN);
    const prewarm = progress >= PREWARM_FRACTION;
    if (prewarm !== this._prewarmActive) {
      this._prewarmActive = prewarm;
      this._bandValid[2] = 0;
    }

    /* Wanted-vs-loaded diff per band — only when the ball crosses a chunk
       boundary in that band's native grid (or caches were invalidated). */
    for (let s = 0; s < 3; s++) {
      const band = tierIndex + s;
      if (band >= TIERS.length) break;
      if (s === 2 && !prewarm) continue;
      const cell = TIERS[band].cellSizeSim;
      const toNative = pow5(this._scaleExp - band);
      const nx = (ballPos.x + this._originX) * toNative;
      const nz = (ballPos.z + this._originZ) * toNative;
      const bx = Math.floor(nx / cell);
      const bz = Math.floor(nz / cell);
      if (this._bandValid[s] === 0 || bx !== this._bandBX[s] || bz !== this._bandBZ[s]) {
        this._bandBX[s] = bx;
        this._bandBZ[s] = bz;
        this._bandValid[s] = 1;
        this._recomputeBand(s, band, nx, nz, cell);
      }
    }

    this._cleanupLeftovers();
    this._drainDespawn(DESPAWN_BUDGET_PER_FRAME);
    this._drainSpawn(SPAWN_BUDGET_PER_FRAME);
    this._subPixelSweep();
    this._updateFlights(dt);

    /* v2 DEV: surface spawn-queue stall risk early (population peak ~4050 of
       4096 is tight — see DESIGN-V2.md density arithmetic). Latched warn,
       re-arms after the population falls back below 85%. */
    if (DEV) {
      if (this._aliveCount > 0.9 * ALIVE_TOTAL_BUDGET) {
        if (!this._aliveWarned) {
          this._aliveWarned = true;
          console.warn(
            `[spawner] aliveCount ${this._aliveCount} > 90% of ALIVE_TOTAL_BUDGET ` +
              `(${ALIVE_TOTAL_BUDGET}) — spawn queue may stall (consider SCENERY_OBJECTS_PER_CHUNK 10 -> 8)`
          );
        }
      } else if (this._aliveWarned && this._aliveCount < 0.85 * ALIVE_TOTAL_BUDGET) {
        this._aliveWarned = false;
      }
    }
  }

  /**
   * Re-inject a knocked-off stuck object as a re-absorbable world instance
   * (ballistic pop, then static + hash insert on landing). Copies the
   * WorldReentry — caller may reuse its vectors.
   * @param {WorldReentry} re Reentry record from ball.knockOff().
   * @returns {boolean} False only if the store (or archetype id) refused it —
   *   render-pool exhaustion falls back to an invisible-but-collidable
   *   instance and flight-pool exhaustion lands the object immediately.
   */
  reinject(re) {
    const archIdx = archetypeIndexFor(re.archetypeId);
    /* v3 DEV assert: everything that reaches reinject must resolve — EXTRA
       codes (>= 70) never get here (render/ball.knockOff skips them, they
       are permanently stuck), and chunk-coded CURATED placements reinject
       through this path as ORDINARY objects (flags = ALIVE below strips
       FLAG_CURATED|FLAG_RARE; credit was granted at absorb — no recount). */
    if (DEV && archIdx < 0) {
      throw new Error(`[spawner] reinject: unknown archetype id '${re.archetypeId}' (archIdx must be >= 0)`);
    }
    if (archIdx < 0) return false;
    const store = this._store;
    const idx = store.alloc();
    if (idx < 0) return false;
    const pool = this._getPool(archIdx);
    // Pool exhausted: fall back to instanceSlot = -1 (invisible but
    // collidable/re-absorbable) — the ejected object must not silently
    // vanish just because the archetype's render pool is full.
    const slot = pool !== null ? pool.alloc() : -1;
    const r = re.radiusSim;
    const restY = r * (1 + this._yOff[archIdx]);
    store.px[idx] = re.pos.x;
    store.py[idx] = re.pos.y;
    store.pz[idx] = re.pos.z;
    store.radius[idx] = r;
    store.archetype[idx] = archIdx;
    store.tierOf[idx] = this._tierOfArch[archIdx];
    store.flags[idx] = 1; // ALIVE — reinject NEVER sets FLAG_RARE (v2: score credit was granted at absorb)
    store.instanceSlot[idx] = slot;
    this._chunkKeyOf[idx] = -1; // not chunk-tied: never touches consumed bitmasks
    this._placementOf[idx] = -1;
    this._aliveCount++;

    const yaw = (idx * 2.399963) % TWO_PI; // deterministic-ish golden-angle yaw
    if (pool !== null && slot >= 0) {
      const pal = this._palettes[archIdx];
      pool.setColor(slot, pal[idx % pal.length]);
      _QUAT.setFromAxisAngle(_AXIS, yaw);
      _POS.set(re.pos.x, re.pos.y, re.pos.z);
      pool.setTransform(slot, _POS, _QUAT, r);
    }

    /* Find a flight slot; if none free, land it immediately. */
    for (let i = 0; i < REENTRY_CAP; i++) {
      const f = this._flights[i];
      if (f.active) continue;
      f.active = true;
      f.idx = idx;
      f.gen = this._slotGen[idx];
      f.archIdx = archIdx;
      f.x = re.pos.x; f.y = re.pos.y; f.z = re.pos.z;
      f.vx = re.vel.x; f.vy = re.vel.y; f.vz = re.vel.z;
      f.restY = restY;
      f.yaw = yaw;
      return true;
    }
    this._landObject(idx, re.pos.x, restY, re.pos.z, slot, archIdx, yaw);
    return true;
  }

  /**
   * Floating-origin rebase hook (called by ScaleManager.maybeRebase AFTER the
   * ball/store/instances were shifted). Chunk keys are global, so only the
   * accumulated origin offset and in-flight reentries need re-keying.
   * @param {number} sx Integer-snapped x shift subtracted from the world.
   * @param {number} sz Integer-snapped z shift subtracted from the world.
   */
  onRebase(sx, sz) {
    this._originX += sx;
    this._originZ += sz;
    this._lastBX -= sx;
    this._lastBZ -= sz;
    for (let i = 0; i < REENTRY_CAP; i++) {
      const f = this._flights[i];
      if (!f.active) continue;
      f.x -= sx;
      f.z -= sz;
    }
    /* Native ball chunk coords are invariant ((x+origin) unchanged) — band
       caches stay valid by construction. */
  }

  /**
   * v3 devTeleport hook (main.js calls this after writing scaleMgr.worldScale
   * and the ball pose DIRECTLY — no EVT.RESCALE fires, so the event-driven
   * _scaleExp/_invWorldScale must be resynced here). Unloads every chunk
   * record (immediate despawn — stale-scale debris must not linger), clears
   * the queues and band caches, re-anchors the origin at 0 (devTeleport maps
   * real meters with origin = 0) and snaps the scale exponent from the
   * injected ScaleManager (or the explicit argument). Consumed bitmasks are
   * KEPT — their keys are global and scale-independent.
   * @param {number} [rescaleCount] Explicit ScaleManager.rescaleCount when no
   *   scaleMgr was injected at construction.
   */
  onTeleport(rescaleCount = -1) {
    let k = rescaleCount;
    if (k < 0 && this._scaleMgr !== null) k = this._scaleMgr.rescaleCount;
    if (k < 0) {
      if (DEV) {
        console.warn(
          '[spawner] onTeleport without a scale source — pass scaleMgr at construction ' +
            '(7th arg) or rescaleCount; keeping the current (possibly stale) exponent'
        );
      }
      k = this._scaleExp;
    }
    for (let i = 0; i < MAX_RECORDS; i++) {
      const rec = this._records[i];
      if (!rec.active) continue;
      for (let e = 0; e < rec.count; e++) {
        const packed = rec.entries[e];
        const idx = packed & STORE_MASK;
        const j = packed >> 13;
        if (this._chunkKeyOf[idx] !== rec.key || this._placementOf[idx] !== j) continue;
        this._despawnIndex(idx, 0.05, false); // immediate — regenerates on revisit
      }
      this._recordByKey.delete(rec.key);
      rec.active = false;
      rec.gen = (rec.gen + 1) & 0xff;
      rec.count = 0;
      this._recordFree.free(i);
    }
    this._spawnQ.clear();
    this._despawnQ.clear();
    this._scaleExp = k;
    this._invWorldScale = (SIM_RADIUS_MIN / START_RADIUS_M) / pow5(k);
    this._originX = 0;
    this._originZ = 0;
    this._bandValid.fill(0);
    this._haveLastBall = false;
    for (let i = 0; i < REENTRY_CAP; i++) this._flights[i].active = false;
  }

  /**
   * Synchronously stream in the full start area (call once during the title
   * screen so play begins in a populated world; drains the spawn queue
   * ignoring the per-frame budget).
   * @param {THREE.Vector3} ballPos Ball start position (current sim units).
   * @param {number} [tierIndex] Starting tier.
   * @param {number} [ballRadiusSim] Starting sim radius.
   */
  preloadStartArea(ballPos, tierIndex = 0, ballRadiusSim = SIM_RADIUS_MIN) {
    this.update(ballPos, tierIndex, ballRadiusSim, FIXED_DT);
    let guard = 0;
    while (this._spawnQ.length > 0 && guard < 4096) {
      const before = this._spawnQ.length;
      this._drainSpawn(256);
      if (this._spawnQ.length >= before) break; // store/pool exhausted
      guard++;
    }
  }

  /**
   * v2: invoke cb(storeIdx, x, y, z, radiusSim) for every alive rare.
   * Bounded by RARE_LIST_CAP; stale (recycled/absorbed) entries self-skip via
   * the slotGen compare. effects.js polls this via setRareProvider for the
   * golden twinkles — zero allocation, do not allocate inside cb.
   * @param {(idx: number, x: number, y: number, z: number, r: number) => void} cb
   */
  forEachAliveRare(cb) {
    const store = this._store;
    const list = this._rareList;
    const n = this._rareCount;
    for (let i = 0; i < n; i++) {
      const idx = list[2 * i];
      if ((this._slotGen[idx] & 0xff) !== list[2 * i + 1]) continue; // stale
      if ((store.flags[idx] & 1) === 0) continue;
      cb(idx, store.px[idx], store.py[idx], store.pz[idx], store.radius[idx]);
    }
  }

  /**
   * Full reset (game restart). Assumes the integrator ALSO resets the
   * ObjectStore, the spatial hashes and the InstancedPools — this clears only
   * spawner-owned state (records, queues, bitmasks, origin, scale exponent).
   */
  reset() {
    for (let i = 0; i < MAX_RECORDS; i++) {
      const r = this._records[i];
      r.active = false;
      r.gen = (r.gen + 1) & 0xff;
      r.count = 0;
    }
    this._recordFree.reset();
    this._recordByKey.clear();
    this._spawnQ.clear();
    this._despawnQ.clear();
    this._consumed.clear();
    this._chunkKeyOf.fill(-1);
    this._placementOf.fill(-1);
    this._scaleExp = 0;
    this._invWorldScale = SIM_RADIUS_MIN / START_RADIUS_M;
    this._originX = 0;
    this._originZ = 0;
    this._bandValid.fill(0);
    this._prewarmActive = false;
    this._lastTier = 0;
    this._tier = 0;
    this._haveLastBall = false;
    this._sweepCursor = 0;
    this._cleanupCursor = 0;
    this._aliveCount = 0;
    this._droppedSpawns = 0;
    this._rareCount = 0; // rare-list compaction hook 3 of 3 (with _onAbsorb/_despawnIndex)
    this._aliveWarned = false;
    for (let i = 0; i < REENTRY_CAP; i++) this._flights[i].active = false;
  }

  /* ---------------------------------------------------------------- */
  /* Bus handlers                                                      */
  /* ---------------------------------------------------------------- */

  /**
   * EVT.ABSORB — absorb.js already freed the store slot and removed it from
   * its hash; we record consumption in the global bitmask and invalidate any
   * queued despawn entries for the recycled slot.
   * @param {import('../types.js').AbsorbEvent} p Reused payload (read-only).
   */
  _onAbsorb(p) {
    const idx = p.objIndex;
    if (idx < 0 || idx >= STORE_CAPACITY) return;
    /* v3/v4 OWNERSHIP: curated- and osm-owned slots are none of our business
       — their bookkeeping (consumed bitmasks, alive counts, render slots)
       lives in world/curated.js / world/osmSpawner.js. Flags are still
       intact here: absorb.js emits BEFORE store.free and this handler is
       subscribed FIRST. */
    if ((this._store.flags[idx] & SKIP_FLAGS) !== 0) return;
    const key = this._chunkKeyOf[idx];
    if (key >= 0) this._markConsumed(key, this._placementOf[idx]);
    this._chunkKeyOf[idx] = -1;
    this._placementOf[idx] = -1;
    this._slotGen[idx] = (this._slotGen[idx] + 1) & 0xff;
    if (this._aliveCount > 0) this._aliveCount--;
    this._compactRares(); // rare-list compaction hook 1 of 3
  }

  /**
   * EVT.RESCALE — emitted synchronously by ScaleManager AFTER ball/store/
   * instances were scaled by S. Current sim units shrank by S = 0.2 exactly,
   * so the origin offset scales and the exponent increments; global native
   * chunk coordinates are invariant.
   * @param {import('../types.js').RescaleEvent} p Reused payload (read-only).
   */
  _onRescale(p) {
    const S = p.S;
    this._originX *= S;
    this._originZ *= S;
    this._lastBX *= S;
    this._lastBZ *= S;
    this._scaleExp++;
    this._invWorldScale *= S;
    for (let i = 0; i < REENTRY_CAP; i++) {
      const f = this._flights[i];
      if (!f.active) continue;
      f.x *= S; f.y *= S; f.z *= S;
      f.vx *= S; f.vy *= S; f.vz *= S;
      f.restY *= S;
    }
    if (DEV && Math.abs(S - 0.2) > 1e-12) {
      throw new Error('[spawner] rescale S must be RESCALE_S=0.2 (scaleExp tracking)');
    }
  }

  /* ---------------------------------------------------------------- */
  /* Tier handoff                                                      */
  /* ---------------------------------------------------------------- */

  /**
   * tierIndex changed: bands <= newTier-2 stop being wanted (records unload
   * via the amortized despawn queue; bitmasks forgotten), N-1 leftovers stay
   * frozen, wanted sets recompute next loop with shifted roles.
   * @param {number} newTier
   */
  _onTierChange(newTier) {
    for (let i = 0; i < MAX_RECORDS; i++) {
      const rec = this._records[i];
      if (rec.active && rec.band <= newTier - 2) this._unloadRecord(i);
    }
    /* Forget consumed bitmasks for bands <= newTier-2 (bounded memory;
       those objects are sub-pixel anyway). Rare path: Map iteration OK. */
    for (const key of this._consumed.keys()) {
      if (keyBand(key) <= newTier - 2) this._consumed.delete(key);
    }
    this._bandValid.fill(0);
    this._lastTier = newTier;
  }

  /* ---------------------------------------------------------------- */
  /* Wanted-vs-loaded diffing                                          */
  /* ---------------------------------------------------------------- */

  /**
   * Recompute the wanted chunk set for one band and diff against loaded
   * records: stamp survivors, top up densities (scenery->target role
   * upgrades), enqueue new chunks front-of-motion first, unload stale ones.
   * Runs only on chunk-boundary crossings / tier changes.
   * @param {number} s Band slot 0..2 (band = tier + s).
   * @param {number} band Absolute tier band.
   * @param {number} nx Ball x in band-native units (origin-unshifted).
   * @param {number} nz Ball z in band-native units.
   * @param {number} cell Chunk size in band-native units.
   */
  _recomputeBand(s, band, nx, nz, cell) {
    const tierCfg = TIERS[band];
    /* v3 LOAD FLOOR: the real-meter minimum in band-NATIVE units. At T0
       (worldScale 0.04) the floor dominates: 281.25 native vs 96 — the 8 m
       shop street stays loaded at r = 2 cm while fog (FOG_FAR_MIN_M floor)
       still hides the spawn edge (config/tiers.js asserts the pair). */
    const loadFloorNative = LOAD_RADIUS_MIN_M / (WS0 * pow5(band));
    let radius;
    let wantK;
    if (s === 0) {
      radius = Math.max(tierCfg.loadRadiusSim, loadFloorNative);
      /* v3 DENSITY (Phase-3 retune): per-BAND counts — 0.45x v2 for bands
         0-3, 0.2x for bands 4-6 (paired with the absorb.js growthKForObjR
         normalization; see tuning.js DENSITY_K_BY_BAND). */
      wantK = Math.max(1, Math.round(tierCfg.objectsPerChunk * densityKForBand(band)));
    } else {
      radius = Math.max(SCENERY_LOAD_RADIUS_SIM, loadFloorNative);
      wantK = Math.max(1, Math.round(SCENERY_OBJECTS_PER_CHUNK * densityKForBand(band)));
      if (s === 2) {
        /* Pre-warm ring capped in CURRENT units so positions stay bounded. */
        const toNative = pow5(this._scaleExp - band);
        const cap = PREWARM_CAP_CUR * toNative;
        if (cap < radius) radius = cap;
      }
    }
    if (DEV && wantK > MAX_PLACEMENTS) throw new Error('[spawner] objectsPerChunk > MAX_PLACEMENTS');

    const stamp = ++this._stamp;
    const bx = this._bandBX[s];
    const bz = this._bandBZ[s];
    const R = Math.ceil(radius / cell);
    const r2 = radius * radius;
    /* Front-of-motion focus point (native units; direction is unitless). */
    const ax = nx + this._dirX * cell * 1.5;
    const az = nz + this._dirZ * cell * 1.5;

    let newCount = 0;
    for (let cx = bx - R; cx <= bx + R; cx++) {
      for (let cz = bz - R; cz <= bz + R; cz++) {
        const ccx = (cx + 0.5) * cell;
        const ccz = (cz + 0.5) * cell;
        const dx = ccx - nx;
        const dz = ccz - nz;
        if (dx * dx + dz * dz > r2) continue;
        const key = packKey(band, cx, cz);
        const recIdx = this._recordByKey.get(key);
        if (recIdx !== undefined) {
          const rec = this._records[recIdx];
          rec.stamp = stamp;
          if (wantK > rec.wantK) rec.wantK = wantK;
          if (rec.enqueuedThrough < rec.wantK) this._enqueueChunkSpawns(recIdx);
        } else if (newCount < MAX_RECORDS) {
          const adx = ccx - ax;
          const adz = ccz - az;
          this._newCx[newCount] = cx;
          this._newCz[newCount] = cz;
          this._newDist[newCount] = adx * adx + adz * adz;
          newCount++;
        }
      }
    }

    /* Insertion sort new chunks by distance-ahead (tiny set, no allocation). */
    for (let i = 1; i < newCount; i++) {
      const d = this._newDist[i];
      const x = this._newCx[i];
      const z = this._newCz[i];
      let j = i - 1;
      while (j >= 0 && this._newDist[j] > d) {
        this._newDist[j + 1] = this._newDist[j];
        this._newCx[j + 1] = this._newCx[j];
        this._newCz[j + 1] = this._newCz[j];
        j--;
      }
      this._newDist[j + 1] = d;
      this._newCx[j + 1] = x;
      this._newCz[j + 1] = z;
    }
    for (let i = 0; i < newCount; i++) {
      this._loadChunk(band, this._newCx[i], this._newCz[i], wantK, stamp);
    }

    /* Unload records of THIS band that fell out of the wanted set. */
    for (let i = 0; i < MAX_RECORDS; i++) {
      const rec = this._records[i];
      if (rec.active && rec.band === band && rec.stamp !== stamp) this._unloadRecord(i);
    }
  }

  /**
   * Create a chunk record and enqueue its placements.
   * @param {number} band @param {number} cx @param {number} cz
   * @param {number} wantK Placements wanted under the current role.
   * @param {number} stamp Wanted-set stamp.
   */
  _loadChunk(band, cx, cz, wantK, stamp) {
    const recIdx = this._recordFree.alloc();
    if (recIdx < 0) {
      if (DEV) console.warn('[spawner] chunk record pool exhausted');
      return;
    }
    const rec = this._records[recIdx];
    rec.active = true;
    rec.key = packKey(band, cx, cz);
    rec.band = band;
    rec.cx = cx;
    rec.cz = cz;
    rec.seed = hash(this.worldSeed, cx, cz, band);
    rec.sub = rec.seed % SUBGRID_CELLS;
    rec.stamp = stamp;
    rec.wantK = wantK;
    rec.enqueuedThrough = 0;
    rec.count = 0;
    this._recordByKey.set(rec.key, recIdx);
    this._enqueueChunkSpawns(recIdx);
  }

  /**
   * Push placements [enqueuedThrough, wantK) of a record onto the spawn ring.
   * Consumed-bitmask filtering happens at drain time.
   * @param {number} recIdx
   */
  _enqueueChunkSpawns(recIdx) {
    const rec = this._records[recIdx];
    const gen = rec.gen & 0xff;
    while (rec.enqueuedThrough < rec.wantK) {
      const entry = recIdx | (rec.enqueuedThrough << 9) | (gen << 16);
      if (!this._spawnQ.push(entry)) return; // ring full — topped up on a later recompute
      rec.enqueuedThrough++;
    }
  }

  /**
   * Unload a chunk record: enqueue all still-owned objects for fade-out
   * despawn (NOT marked consumed — they regenerate on re-entry) and release
   * the record. The consumed bitmask persists in the global map.
   * @param {number} recIdx
   */
  _unloadRecord(recIdx) {
    const rec = this._records[recIdx];
    for (let e = 0; e < rec.count; e++) {
      const packed = rec.entries[e];
      const idx = packed & STORE_MASK;
      const j = packed >> 13;
      if (this._chunkKeyOf[idx] !== rec.key || this._placementOf[idx] !== j) continue; // stale
      const dEntry = idx | ((this._slotGen[idx] & 0xff) << 13);
      if (!this._despawnQ.push(dEntry)) this._despawnIndex(idx, DESPAWN_FADE_S, false);
    }
    this._recordByKey.delete(rec.key);
    rec.active = false;
    rec.gen = (rec.gen + 1) & 0xff;
    rec.count = 0;
    this._recordFree.free(recIdx);
  }

  /* ---------------------------------------------------------------- */
  /* Leftover (N-1) distance cleanup                                   */
  /* ---------------------------------------------------------------- */

  /**
   * N-1 leftover chunks have no wanted set (they are never re-spawned) but
   * must unload once the ball rolls far enough away. Round-robin check of a
   * few records per frame keeps this free of spikes.
   */
  _cleanupLeftovers() {
    const tier = this._tier;
    if (tier === 0) return;
    const keep = TIERS[tier].loadRadiusSim + TIERS[tier].cellSizeSim; // current units
    const keep2 = keep * keep;
    for (let n = 0; n < CLEANUP_RECORDS_PER_FRAME; n++) {
      const i = this._cleanupCursor;
      this._cleanupCursor = (this._cleanupCursor + 1) % MAX_RECORDS;
      const rec = this._records[i];
      if (!rec.active || rec.band >= tier) continue;
      const cell = TIERS[rec.band].cellSizeSim;
      const toCur = pow5(rec.band - this._scaleExp);
      const cx = (rec.cx + 0.5) * cell * toCur - this._originX;
      const cz = (rec.cz + 0.5) * cell * toCur - this._originZ;
      const dx = cx - this._ballX;
      const dz = cz - this._ballZ;
      if (dx * dx + dz * dz > keep2) this._unloadRecord(i);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Queue drains                                                      */
  /* ---------------------------------------------------------------- */

  /** @param {number} budget Max spawns this call. */
  _drainSpawn(budget) {
    while (budget > 0) {
      const entry = this._spawnQ.shift();
      if (entry < 0) return;
      const recIdx = entry & 0x1ff;
      const j = (entry >> 9) & 0x7f;
      const gen = (entry >> 16) & 0xff;
      const rec = this._records[recIdx];
      if (!rec.active || (rec.gen & 0xff) !== gen) continue; // chunk unloaded meanwhile
      if (this._isConsumed(rec.key, j)) continue;
      if (this._aliveCount >= ALIVE_TOTAL_BUDGET) {
        this._spawnQ.push(entry); // retry when population falls
        return;
      }
      const ok = this._spawnPlacement(rec, j);
      if (!ok) {
        this._spawnQ.push(entry); // store exhausted — retry later
        return;
      }
      budget--;
    }
  }

  /** @param {number} budget Max despawns this call. */
  _drainDespawn(budget) {
    while (budget > 0) {
      const entry = this._despawnQ.shift();
      if (entry < 0) return;
      const idx = entry & STORE_MASK;
      const gen = (entry >> 13) & 0xff;
      if ((this._slotGen[idx] & 0xff) !== gen) continue; // slot recycled meanwhile
      this._despawnIndex(idx, DESPAWN_FADE_S, false);
      budget--;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Placement generation (the deterministic core)                     */
  /* ---------------------------------------------------------------- */

  /** Advance the inline mulberry32 state (same sequence as core/rng.js). @returns {number} [0,1) */
  _srand() {
    this._rngA = (this._rngA + 0x6d2b79f5) | 0;
    let t = this._rngA;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Materialize placement j of a chunk. O(1) per placement: a per-placement
   * sub-seed hash(chunkSeed, j, ...) avoids replaying the chunk rng stream,
   * and a strided sub-grid cell gives Poisson-quality spacing with zero
   * overlap tests. Draw order is FIXED (jx, jz, archRoll, sizeRoll, yawRoll,
   * paletteRoll[, tumble x3], rareRoll) — never reorder, it is the
   * determinism contract. rareRoll is drawn LAST, UNCONDITIONALLY, for every
   * placement (even ones that promote to landmarks or get fog-skipped), so
   * the sequence consumed per placement is invariant under role changes.
   * @param {object} rec Chunk record.
   * @param {number} j Placement index 0..wantK-1.
   * @returns {boolean} False only when the ObjectStore is exhausted (retry).
   */
  _spawnPlacement(rec, j) {
    const band = rec.band;
    const cell = TIERS[band].cellSizeSim;
    this._rngA = hash(rec.seed, j, 0x5bd1, band) | 0;

    /* Jittered sub-grid position (band-native units, global). */
    const cellIdx = (j * SUBGRID_STRIDE + rec.sub) % SUBGRID_CELLS;
    const sub = cell / SUBGRID;
    const sgx = cellIdx % SUBGRID;
    const sgz = (cellIdx / SUBGRID) | 0;
    const jx = (this._srand() - 0.5) * 0.8;
    const jz = (this._srand() - 0.5) * 0.8;
    const gxN = rec.cx * cell + (sgx + 0.5 + jx) * sub;
    const gzN = rec.cz * cell + (sgz + 0.5 + jz) * sub;

    /* Weighted archetype pick. ONE raw archRoll draw at a fixed position;
       landmark slots [8]/[9] are eligible ONLY for placement j === 0
       (_cumW10), every other placement picks within slots 0-7 (_cumW8).
       Eligibility depends only on j => deterministic across role upgrades. */
    const archRoll = this._srand();
    let ai;
    if (j === 0) {
      const r = archRoll * this._wTot10[band];
      const base10 = band * ARCH_PER_TIER;
      ai = ARCH_PER_TIER - 1;
      for (let i = 0; i < ARCH_PER_TIER; i++) {
        if (r < this._cumW10[base10 + i]) { ai = i; break; }
      }
    } else {
      const r = archRoll * this._wTot8[band];
      const base8 = band * 8;
      ai = 7;
      for (let i = 0; i < 8; i++) {
        if (r < this._cumW8[base8 + i]) { ai = i; break; }
      }
    }
    const archIdx = band * ARCH_PER_TIER + ai;

    const sizeRoll = this._srand();
    const yawRoll = this._srand();
    const paletteRoll = this._srand();
    const upright = this._upright[archIdx] === 1;
    let tq0 = 0, tq1 = 0, tq2 = 0;
    if (!upright) {
      tq0 = this._srand();
      tq1 = this._srand();
      tq2 = this._srand();
    }
    /* rareRoll: ALWAYS the final draw (see draw-order contract above).
       Landmarks (ai >= 8) consume the roll but are never promoted. */
    const rareRoll = this._srand();
    const isRare = rareRoll < RARE_CHANCE && ai < 8;
    /* === all deterministic draws complete — runtime-dependent checks below === */

    /* v3 ZONE MASK: native chunk coords are real meters / worldScale_band
       (ORIGIN = BALL START), so the real-meter bridge is one multiply.
       Dropped placements consumed their full draw sequence above — chunk
       contents stay a pure function of (seed, cx, cz, band). */
    const wsBand = WS0 * pow5(band);
    if (!bandAllowedAt(gxN * wsBand, gzN * wsBand, band)) return true;

    const toCur = pow5(band - this._scaleExp);
    const x = gxN * toCur - this._originX;
    const z = gzN * toCur - this._originZ;
    const radiusReal = this._radNom[archIdx] * (1 + (sizeRoll * 2 - 1) * this._jit[archIdx]);
    let simR = radiusReal * this._invWorldScale;
    if (isRare) simR *= RARE_SCALE_MUL;
    const y = simR * (1 + this._yOff[archIdx]);

    const dx = x - this._ballX;
    const dz = z - this._ballZ;
    const distSq = dx * dx + dz * dz;

    /* Pre-warm band (tier+2): only materialize beyond the fog wall so giant
       future-tier objects never pop into view. Skipped placements are lost
       until the chunk reloads — beyond-fog by definition, invisible.
       v3: the fog wall is FLOORED at FOG_FAR_MIN_M real meters (environment
       applies the same floor), so the skip radius takes the max too. */
    if (band - this._tier >= 2) {
      const fogSkip = Math.max(FOG_FAR_K * SIM_RADIUS_MAX, FOG_FAR_MIN_M * this._invWorldScale) * 1.2;
      if (distSq < fogSkip * fogSkip) return true;
    }

    const store = this._store;
    const idx = store.alloc();
    if (idx < 0) return false;
    const pool = this._getPool(archIdx);
    const slot = pool !== null ? pool.alloc() : -1;
    if (slot < 0) {
      store.free(idx);
      this._droppedSpawns++;
      return true; // pool full: drop placement (not consumed; back on reload)
    }

    store.px[idx] = x;
    store.py[idx] = y;
    store.pz[idx] = z;
    store.radius[idx] = simR;
    store.archetype[idx] = archIdx;
    store.tierOf[idx] = band;
    store.flags[idx] = isRare ? 1 | FLAG_RARE : 1; // ALIVE (| RARE)
    store.instanceSlot[idx] = slot;
    this._chunkKeyOf[idx] = rec.key;
    this._placementOf[idx] = j;
    this._aliveCount++;
    /* Rare list push happens here — AFTER both store.alloc and pool.alloc
       succeeded (the pool-full drop path above never reaches this point). */
    if (isRare) this._pushRare(idx);

    if (upright) {
      _QUAT.setFromAxisAngle(_AXIS, yawRoll * TWO_PI);
    } else {
      /* Cheap uniform-ish tumble (Shoemake from 3 uniforms). */
      const s1 = Math.sqrt(1 - tq0);
      const s2 = Math.sqrt(tq0);
      const a1 = TWO_PI * tq1;
      const a2 = TWO_PI * tq2;
      _QUAT.set(s1 * Math.sin(a1), s1 * Math.cos(a1), s2 * Math.sin(a2), s2 * Math.cos(a2));
    }
    _POS.set(x, y, z);
    pool.setTransform(slot, _POS, _QUAT, simR);
    if (isRare) {
      pool.setColor(slot, RARE_TINT); // golden override (paletteRoll still consumed)
    } else {
      const pal = this._palettes[archIdx];
      pool.setColor(slot, pal[(paletteRoll * pal.length) | 0]);
    }

    /* Belt-and-suspenders: anything landing inside fog range scale-fades in
       (v3: floored fog — matches environment's FOG_FAR_MIN_M query floor). */
    const fogFar = Math.max(FOG_FAR_K * this._ballR, FOG_FAR_MIN_M * this._invWorldScale);
    if (distSq < fogFar * fogFar) pool.fadeIn(slot, SPAWN_FADE_S);

    /* Spatial hash insert. hashes[i] = band tier-1+i; pre-warm (rel 3) stays
       out — the mandatory tier-up rebuild picks those up when they become
       collidable scenery. */
    const rel = band - this._tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].insert(idx, x, z);
    }

    if (rec.count < MAX_PLACEMENTS) rec.entries[rec.count++] = idx | (j << 13);
    return true;
  }

  /* ---------------------------------------------------------------- */
  /* Despawn primitive                                                 */
  /* ---------------------------------------------------------------- */

  /**
   * Immediately remove one object from sim (store + hash) and start its
   * visual scale-fade (the InstancedPool reclaims the slot when done).
   * @param {number} idx Store index.
   * @param {number} fadeS Scale-fade duration.
   * @param {boolean} consume True to mark the consumed bitmask (sub-pixel
   *   drains are permanent; ring-exit despawns regenerate on re-entry).
   */
  _despawnIndex(idx, fadeS, consume) {
    const store = this._store;
    if ((store.flags[idx] & 1) === 0) return; // already gone
    /* v3/v4 DEV assert: no chunk-owned operation may ever free a curated or
       osm slot. Those slots never enter chunk records/queues (chunkKeyOf
       stays -1 and slotGen guards recycled indices) — reaching here flagged
       means the ownership protocol broke. */
    if (DEV && (store.flags[idx] & SKIP_FLAGS) !== 0) {
      throw new Error(`[spawner] chunk op tried to free FLAG_CURATED|FLAG_OSM slot ${idx}`);
    }
    if ((store.flags[idx] & SKIP_FLAGS) !== 0) return; // prod: refuse quietly
    if (consume) {
      const key = this._chunkKeyOf[idx];
      if (key >= 0) this._markConsumed(key, this._placementOf[idx]);
    }
    const slot = store.instanceSlot[idx];
    const pool = this._getPool(store.archetype[idx]);
    if (pool !== null && slot >= 0) pool.fadeOut(slot, fadeS);
    const rel = store.tierOf[idx] - this._tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].remove(idx);
    }
    store.free(idx);
    store.flags[idx] = 0;
    this._chunkKeyOf[idx] = -1;
    this._placementOf[idx] = -1;
    this._slotGen[idx] = (this._slotGen[idx] + 1) & 0xff;
    if (this._aliveCount > 0) this._aliveCount--;
    this._compactRares(); // rare-list compaction hook 2 of 3
  }

  /* ---------------------------------------------------------------- */
  /* Alive-rare list (v2)                                              */
  /* ---------------------------------------------------------------- */

  /**
   * Append a freshly spawned rare to the (storeIdx, slotGen) list. Called
   * ONLY from _spawnPlacement after both store.alloc and pool.alloc
   * succeeded. Overflow policy (documented, cosmetic-only): the OLDEST entry
   * stops sparkling — the object stays absorbable and scorable, only the
   * twinkle provider misses it.
   * @param {number} idx Store slot index.
   */
  _pushRare(idx) {
    if (this._rareCount >= RARE_LIST_CAP) {
      this._rareList.copyWithin(0, 2, 2 * this._rareCount);
      this._rareCount--;
    }
    const o = 2 * this._rareCount;
    this._rareList[o] = idx;
    this._rareList[o + 1] = this._slotGen[idx] & 0xff;
    this._rareCount++;
  }

  /**
   * Drop stale rare entries in place (slotGen mismatch / slot no longer an
   * alive rare). Called from exactly three hooks: _onAbsorb, _despawnIndex,
   * reset() (reset just zeroes the count). <= RARE_LIST_CAP iterations.
   */
  _compactRares() {
    const store = this._store;
    const list = this._rareList;
    let w = 0;
    const n = this._rareCount;
    for (let i = 0; i < n; i++) {
      const idx = list[2 * i];
      const gen = list[2 * i + 1];
      if ((this._slotGen[idx] & 0xff) !== gen) continue;
      const f = store.flags[idx];
      if ((f & 1) === 0 || (f & FLAG_RARE) === 0) continue;
      if (w !== i) {
        list[2 * w] = idx;
        list[2 * w + 1] = gen;
      }
      w++;
    }
    this._rareCount = w;
  }

  /* ---------------------------------------------------------------- */
  /* Sub-pixel sweep                                                   */
  /* ---------------------------------------------------------------- */

  /**
   * Continuous leftover drain: round-robin scan of SUBPIXEL_SWEEP_BUDGET store
   * slots per frame; any alive object with diameter < SUBPIXEL_RATIO * ballR
   * scale-fades out permanently (marked consumed). Size-based only — NEVER
   * tier-gated (seamlessness law). v2 EXCEPTION (cosmetic-only): FLAG_RARE
   * objects are skipped ONLY while their home band is still live
   * (tierOf >= tier-1) so a sparkling rare never vanishes mid-hunt; older
   * rares despawn normally — no immortal invisible sparklers.
   */
  _subPixelSweep() {
    const store = this._store;
    const flags = store.flags;
    const radius = store.radius;
    const tierOf = store.tierOf;
    const rareKeepBand = this._tier - 1;
    const threshR = 0.5 * SUBPIXEL_RATIO * this._ballR; // radius form of the diameter rule
    let kills = 0;
    for (let n = 0; n < SUBPIXEL_SWEEP_BUDGET; n++) {
      const i = this._sweepCursor;
      this._sweepCursor = (this._sweepCursor + 1) & STORE_MASK;
      if ((flags[i] & 1) !== 0 && radius[i] < threshR) {
        if ((flags[i] & SKIP_FLAGS) !== 0) continue; // v3/v4: curated/osm own their own sweeps
        if ((flags[i] & FLAG_RARE) !== 0 && tierOf[i] >= rareKeepBand) continue;
        this._despawnIndex(i, SUBPIXEL_FADE_S, true);
        if (++kills >= SUBPIXEL_KILL_CAP) return;
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Knock-off flights                                                 */
  /* ---------------------------------------------------------------- */

  /**
   * Integrate ballistic knock-off reentries; on landing, snap to rest height
   * and insert into the matching spatial hash (re-absorbable from then on).
   * @param {number} dt Frame delta (s).
   */
  _updateFlights(dt) {
    const store = this._store;
    for (let i = 0; i < REENTRY_CAP; i++) {
      const f = this._flights[i];
      if (!f.active) continue;
      if ((this._slotGen[f.idx] & 0xff) !== (f.gen & 0xff) || (store.flags[f.idx] & 1) === 0) {
        f.active = false; // object was despawned/absorbed out from under us
        continue;
      }
      f.vy -= REENTRY_GRAVITY * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.z += f.vz * dt;
      const landed = f.y <= f.restY && f.vy <= 0;
      if (landed) f.y = f.restY;
      store.px[f.idx] = f.x;
      store.py[f.idx] = f.y;
      store.pz[f.idx] = f.z;
      const slot = store.instanceSlot[f.idx];
      const pool = this._getPool(f.archIdx);
      if (pool !== null && slot >= 0) {
        _QUAT.setFromAxisAngle(_AXIS, f.yaw);
        _POS.set(f.x, f.y, f.z);
        pool.setTransform(slot, _POS, _QUAT, store.radius[f.idx]);
      }
      if (landed) {
        const rel = store.tierOf[f.idx] - this._tier + 1;
        if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
          this._hashes[rel].insert(f.idx, f.x, f.z);
        }
        f.active = false;
      }
    }
  }

  /** Land a reentry instantly (flight pool full). */
  _landObject(idx, x, y, z, slot, archIdx, yaw) {
    const store = this._store;
    store.px[idx] = x;
    store.py[idx] = y;
    store.pz[idx] = z;
    const pool = this._getPool(archIdx);
    if (pool !== null && slot >= 0) {
      _QUAT.setFromAxisAngle(_AXIS, yaw);
      _POS.set(x, y, z);
      pool.setTransform(slot, _POS, _QUAT, store.radius[idx]);
    }
    const rel = store.tierOf[idx] - this._tier + 1;
    if (rel >= 0 && rel <= 2 && this._hashes && this._hashes[rel]) {
      this._hashes[rel].insert(idx, x, z);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Consumed bitmasks                                                 */
  /* ---------------------------------------------------------------- */

  /** @param {number} key Global chunk key. @param {number} j Placement index. */
  _markConsumed(key, j) {
    if (j < 0) return;
    let bits = this._consumed.get(key);
    if (bits === undefined) {
      bits = new Uint32Array(MAX_PLACEMENTS >> 5); // event-driven, tiny, infrequent
      this._consumed.set(key, bits);
    }
    bits[j >>> 5] |= 1 << (j & 31);
  }

  /** @param {number} key @param {number} j @returns {boolean} */
  _isConsumed(key, j) {
    const bits = this._consumed.get(key);
    if (bits === undefined) return false;
    return (bits[j >>> 5] & (1 << (j & 31))) !== 0;
  }

  /* ---------------------------------------------------------------- */
  /* Catalog / pool resolution                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Lazily resolve the InstancedPool for an archetype (pools may be created
   * after Spawner construction). Map.get / property read — allocation-free.
   * @param {number} archIdx
   * @returns {object|null}
   */
  _getPool(archIdx) {
    let pool = this._poolOf[archIdx];
    if (pool === null || pool === undefined) {
      const src = this._instances;
      if (src) {
        const id = ARCHETYPE_IDS[archIdx];
        pool = typeof src.get === 'function' ? src.get(id) : src[id];
        if (pool) this._poolOf[archIdx] = pool;
        else pool = null;
      } else {
        pool = null;
      }
    }
    return pool;
  }

  /**
   * Snapshot catalog stats into flat arrays (boot-time only). Missing entries
   * get neutral placeholders scaled to their tier so partial integration runs.
   * Builds BOTH cumulative weight tables: _cumW8 over slots 0-7 (j > 0) and
   * _cumW10 over all ARCH_PER_TIER slots incl. landmarks (j === 0 only).
   * @param {Object<string, Archetype>|null} catalog
   */
  _resolveCatalog(catalog) {
    for (let t = 0; t < TIERS.length; t++) {
      let acc8 = 0;
      let acc10 = 0;
      for (let i = 0; i < ARCH_PER_TIER; i++) {
        const archIdx = t * ARCH_PER_TIER + i;
        const id = ARCHETYPE_IDS[archIdx];
        const a = catalog ? catalog[id] : undefined;
        this._radNom[archIdx] = a && a.radiusNominal > 0 ? a.radiusNominal : TIERS[t].enterTrueRadius * 0.4;
        this._jit[archIdx] = a ? a.radiusJitter : 0.25;
        this._yOff[archIdx] = a ? a.yOffset : 0;
        this._upright[archIdx] = a ? (a.upright ? 1 : 0) : 1;
        this._tierOfArch[archIdx] = t;
        this._palettes[archIdx] =
          a && a.palette && a.palette.length > 0 ? a.palette : [0x9aa3ad, 0xb5bdc6, 0x7d8790, 0xcfd6dd];
        this._poolOf[archIdx] = null;
        // Landmark fallback weight is 0.3 (design band 0.25-0.35), absorbable
        // slots fall back to 1 — keeps partial-catalog boots representative.
        const w = a && a.spawnWeight > 0 ? a.spawnWeight : i >= 8 ? 0.3 : 1;
        acc10 += w;
        this._cumW10[archIdx] = acc10;
        if (i < 8) {
          acc8 += w;
          this._cumW8[t * 8 + i] = acc8;
        }
      }
      this._wTot8[t] = acc8;
      this._wTot10[t] = acc10;
    }
  }
}
