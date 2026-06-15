/**
 * @file scaleManager.js — worldScale double, tierIndex with hysteresis,
 * one-frame similarity rescale orchestration, floating-origin rebase,
 * trueRadius/formatSize, tierUp/rescale/grow emission (Dev B).
 *
 * v2 (moon update): the v1 'game:win' WIN_RADIUS_M latch is REMOVED — the
 * goal now lives in game/finale.js (v3: contact arms at GOAL_RADIUS_M)
 * and main.js is the SOLE 'game:win' emitter (at finale.state === 'done').
 * The throttled 'grow' payload additionally carries BallState.dashGauge01
 * for the HUD dash gauge (smooth 10Hz fill).
 *
 * TWO NUMBER SYSTEMS (DESIGN.md スケールシステム): all sim/physics/render
 * math lives in SIM UNITS; REAL METERS exist only as
 * trueRadius = simRadius * worldScale, where worldScale is a plain JS double
 * owned here. worldScale starts at START_RADIUS_M / SIM_RADIUS_MIN (= 0.1)
 * and is divided by RESCALE_S (= x5) at each rescale, so it is always exactly
 * 0.1 * 5^k.
 *
 * RESCALE (one frame, BETWEEN physics update and render — main.js step 4):
 * when simRadius >= SIM_RADIUS_MAX, apply the uniform similarity S = RESCALE_S
 * to every sim quantity: ball pos/vel/radius (angular velocity is scale-free),
 * the SoA store (store.rescaleAll), every InstancedPool matrix
 * (pool.rewriteAll(S): elements [0..14] *= S, one needsUpdate), the camera
 * spring state (cameraRig.rescaleState(S)), and optional environment params
 * (env.rescale(S)); then rebuild the three per-band spatial hashes. Because
 * every visual quantity is radius-proportional (SEAMLESSNESS LAW), the rescale
 * frame renders pixel-identical to the no-rescale frame. The spawner and the
 * render ball ride along via the synchronous EVT.RESCALE emission.
 *
 * tierIndex is derived from trueRadius with +-TIER_HYSTERESIS and drives ONLY
 * cosmetics + spawn-content bands. It normally flips in the same frame as the
 * rescale (tier thresholds are ~x5 apart) but is deliberately independent —
 * e.g. T3 enters at 6 m while the rescale fires at 6.25 m. Either event forces
 * a spatial-hash re-band/rebuild.
 *
 * FLOATING ORIGIN (secondary guard): when |ball.pos| (horizontal) exceeds
 * REBASE_DISTANCE_SIM, subtract the integer-snapped ball position from the
 * ball, the store, every instance matrix and the camera springs in the same
 * between-update-and-render slot. Chunk keys/bitmasks are global — the
 * spawner just accumulates the shift (spawner.onRebase).
 */

import { TIERS, RESCALE_S } from '../config/tiers.js';
import { EVT, PAYLOADS } from '../core/events.js';
import { formatLength } from '../core/mathUtils.js';
import {
  HUD_THROTTLE_HZ,
  // v3 PHASE-0 DOCUMENTED CROSS-STREAM EXCEPTION #1 (docs/DESIGN-V3.md
  // 並列作業分割): the grow-progress last-tier exit reads GOAL_RADIUS_M
  // directly (the Phase-0 alias layer is retired).
  // No other scaleManager change in v3 — _rebuildHashes untouched (dynamic
  // re-banding lives in world/curated.js).
  GOAL_RADIUS_M,
  REBASE_DISTANCE_SIM,
  SIM_RADIUS_MAX,
  SIM_RADIUS_MIN,
  START_RADIUS_M,
  TIER_HYSTERESIS,
} from '../config/tuning.js';

/** @typedef {import('../types.js').BallState} BallState */

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/**
 * Owns the sim-units <-> real-meters bridge and the two pixel-identity
 * transforms (similarity rescale + floating-origin rebase). Also the game's
 * single source of trueRadius-derived events: 'tierUp', 'rescale' and the
 * throttled 'grow' ('game:win' moved to main.js/finale in v2).
 */
export class ScaleManager {
  /**
   * @param {import('../core/events.js').EventBus} bus Shared event bus.
   * @param {number} [worldSeed] uint32 world seed (kept for dev tooling /
   *   debug overlay; the 'game:win' payload is filled by main.js in v2).
   */
  constructor(bus, worldSeed = 0) {
    this._bus = bus;
    /** @type {number} uint32 world seed for the win screen. */
    this.worldSeed = worldSeed >>> 0;
    /** @type {number} REAL METERS per sim unit (plain double; exactly 0.1 * 5^k). */
    this.worldScale = START_RADIUS_M / SIM_RADIUS_MIN;
    /** @type {number} Current tier 0..TIERS.length-1 (cosmetics + spawn bands ONLY). */
    this.tierIndex = 0;
    /** @type {number} How many similarity rescales have been applied. */
    this.rescaleCount = 0;
    this._lastSimRadius = SIM_RADIUS_MIN;
    this._forceRescale = false;
    this._lastGrowMs = -Infinity; // first grow emits immediately
    this._growIntervalMs = 1000 / HUD_THROTTLE_HZ;
  }

  /* ---------------------------------------------------------------- */
  /* Display helpers                                                   */
  /* ---------------------------------------------------------------- */

  /**
   * Ball radius in real meters (display only — never used in sim math).
   * @returns {number}
   */
  trueRadiusMeters() {
    return this._lastSimRadius * this.worldScale;
  }

  /**
   * Human-readable ball size (mm/cm/m/km). Allocates a string — UI paths only.
   * @returns {string}
   */
  formatSize() {
    return formatLength(this.trueRadiusMeters());
  }

  /**
   * Debug hook (renderer debug overlay key): force one similarity rescale on
   * the next maybeTierUp regardless of simRadius — used by the dev
   * screenshot-diff that verifies the rescale frame is pixel-identical.
   */
  forceRescale() {
    this._forceRescale = true;
  }

  /** Reset to a fresh run (game:reset). */
  reset() {
    this.worldScale = START_RADIUS_M / SIM_RADIUS_MIN;
    this.tierIndex = 0;
    this.rescaleCount = 0;
    this._lastSimRadius = SIM_RADIUS_MIN;
    this._forceRescale = false;
    this._lastGrowMs = -Infinity;
  }

  /* ---------------------------------------------------------------- */
  /* Per-frame: rescale + tier + grow + win (main.js step 4, call 1)   */
  /* ---------------------------------------------------------------- */

  /**
   * Called once per render frame BETWEEN physics update and render. Applies
   * the one-frame similarity rescale when simRadius >= SIM_RADIUS_MAX,
   * advances tierIndex (hysteresis), rebuilds the per-band hashes when either
   * happened, and emits rescale/tierUp/grow (v2: 'game:win' is main's — the
   * finale owns the goal at GOAL_RADIUS_M).
   *
   * Steady-state cost: a handful of float compares — zero allocation. The
   * rescale path (once per ~60-90 s) may touch Map iterators.
   *
   * @param {BallState} ball Single source of ball truth (mutated on rescale).
   * @param {object} store ObjectStore — rescaleAll(S).
   * @param {object[]} hashes 3 SpatialHash — rebuild(store, band), banded
   *   hashes[i] = tierIndex - 1 + i.
   * @param {Map<string, object>|Object<string, object>} instances
   *   InstancedPool per archetype id — rewriteAll(S).
   * @param {object} cameraRig Camera rig — rescaleState(S) (optional until wired).
   * @param {object} env Environment — rescale(S) (optional hook).
   * @returns {boolean} True if a rescale and/or tier change happened.
   */
  maybeTierUp(ball, store, hashes, instances, cameraRig, env) {
    this._lastSimRadius = ball.radiusSim;

    let rescaled = false;
    if (ball.radiusSim >= SIM_RADIUS_MAX || this._forceRescale) {
      this._forceRescale = false;
      this._applyRescale(ball, store, instances, cameraRig, env);
      rescaled = true;
    }

    /* tierIndex from trueRadius with hysteresis. trueRadius is invariant
       under the rescale, so the order of the two checks does not matter. */
    const tr = ball.radiusSim * this.worldScale;
    let tierChanged = false;
    while (this.tierIndex < TIERS.length - 1 && tr >= TIERS[this.tierIndex + 1].enterTrueRadius) {
      this.tierIndex++;
      tierChanged = true;
      this._emitTierUp(tr);
    }
    while (this.tierIndex > 0 && tr < TIERS[this.tierIndex].enterTrueRadius * (1 - TIER_HYSTERESIS)) {
      this.tierIndex--; // float-edge guard; shrinking cannot happen in play
      tierChanged = true;
      this._emitTierUp(tr);
    }

    if (rescaled || tierChanged) this._rebuildHashes(store, hashes);

    /* Throttled 'grow' for the HUD odometer + dash gauge. */
    const now = performance.now();
    if (now - this._lastGrowMs >= this._growIntervalMs) {
      this._lastGrowMs = now;
      const enter = TIERS[this.tierIndex].enterTrueRadius;
      // Last tier's progress target is the goal radius (v3: Skytree contact
      // arms at GOAL_RADIUS_M) so the bar hits exactly 100% as it arms.
      const exit =
        this.tierIndex < TIERS.length - 1
          ? TIERS[this.tierIndex + 1].enterTrueRadius
          : GOAL_RADIUS_M;
      let p = (tr - enter) / (exit - enter);
      if (p < 0) p = 0;
      else if (p > 1) p = 1;
      PAYLOADS.grow.trueRadius = tr;
      PAYLOADS.grow.simRadius = ball.radiusSim;
      PAYLOADS.grow.progress01ToNextTier = p;
      // v2: copy BallState.dashGauge01 onto the 10Hz grow payload (HUD gauge
      // fill). Tolerates a pre-Stream-D BallState without the field.
      const dg = ball.dashGauge01;
      PAYLOADS.grow.dashGauge01 = dg >= 0 ? dg : 1;
      this._bus.emit(EVT.GROW, PAYLOADS.grow);
    }

    return rescaled || tierChanged;
  }

  /* ---------------------------------------------------------------- */
  /* Per-frame: floating-origin rebase (main.js step 4, call 2)        */
  /* ---------------------------------------------------------------- */

  /**
   * Floating-origin rebase: when the ball's horizontal distance from origin
   * exceeds REBASE_DISTANCE_SIM, subtract the integer-snapped ball position
   * from the ball, the SoA store, every instance matrix and the camera spring
   * state, then rebuild the hashes. Integer snap keeps the shift exactly
   * representable, and chunk keys/bitmasks are global so determinism survives
   * (spawner.onRebase only accumulates the offset). Pixel-identical by
   * construction (uniform translation of everything the camera derives from).
   *
   * @param {BallState} ball Ball truth (pos mutated).
   * @param {object} store ObjectStore (px/pz typed arrays shifted in place).
   * @param {object[]} hashes 3 SpatialHash — rebuilt.
   * @param {Map<string, object>|Object<string, object>} instances
   *   InstancedPool per archetype id — rebaseAll(sx, sz) (translation-only
   *   matrix rewrite; REQUIRED on the pool for rebase to work).
   * @param {object} cameraRig Camera rig — rebaseState(sx, sz) (optional hook).
   * @param {object} env Environment — rebase(sx, sz) (optional hook).
   * @param {object} spawner Spawner — onRebase(sx, sz) origin re-keying.
   * @returns {boolean} True if a rebase happened this frame.
   */
  maybeRebase(ball, store, hashes, instances, cameraRig, env, spawner) {
    const px = ball.pos.x;
    const pz = ball.pos.z;
    if (px * px + pz * pz <= REBASE_DISTANCE_SIM * REBASE_DISTANCE_SIM) return false;

    const sx = Math.round(px);
    const sz = Math.round(pz);
    ball.pos.x -= sx;
    ball.pos.z -= sz;

    if (store && store.px) {
      const ax = store.px;
      const az = store.pz;
      const n = ax.length;
      for (let i = 0; i < n; i++) {
        ax[i] -= sx;
        az[i] -= sz;
      }
    }

    eachPool(instances, rebasePool, sx, sz);
    this._rebuildHashes(store, hashes);
    if (cameraRig && typeof cameraRig.rebaseState === 'function') cameraRig.rebaseState(sx, sz);
    else if (DEV && cameraRig) console.warn('[scaleManager] cameraRig.rebaseState(sx, sz) missing');
    if (env && typeof env.rebase === 'function') env.rebase(sx, sz);
    else if (DEV && env) console.warn('[scaleManager] env.rebase(sx, sz) missing');
    if (spawner && typeof spawner.onRebase === 'function') spawner.onRebase(sx, sz);
    else if (DEV && spawner) console.warn('[scaleManager] spawner.onRebase(sx, sz) missing');

    /* Emitted AFTER all direct mutations (mirrors EVT.RESCALE) so listeners
       with world-sim-space state (effects particle pools) ride along. */
    PAYLOADS.rebase.sx = sx;
    PAYLOADS.rebase.sz = sz;
    this._bus.emit(EVT.REBASE, PAYLOADS.rebase);
    return true;
  }

  /* ---------------------------------------------------------------- */
  /* Internals                                                         */
  /* ---------------------------------------------------------------- */

  /**
   * The one-frame uniform similarity transform S = RESCALE_S. Order matters
   * only in that EVT.RESCALE fires after all direct mutations so listeners
   * (spawner origin/exponent, render ball group scale) observe a consistent
   * post-rescale world.
   * @param {BallState} ball
   * @param {object} store
   * @param {Map<string, object>|Object<string, object>} instances
   * @param {object} cameraRig
   * @param {object} env
   */
  _applyRescale(ball, store, instances, cameraRig, env) {
    const S = RESCALE_S;
    this.worldScale /= S;
    this.rescaleCount++;

    ball.pos.multiplyScalar(S);
    ball.vel.multiplyScalar(S); // angular velocity / quat are scale-free
    ball.radiusSim *= S;
    ball.radiusVisualSim *= S;
    this._lastSimRadius = ball.radiusSim;

    if (store && typeof store.rescaleAll === 'function') store.rescaleAll(S);
    eachPool(instances, rescalePool, S, 0);
    if (cameraRig && typeof cameraRig.rescaleState === 'function') cameraRig.rescaleState(S);
    else if (DEV && cameraRig) console.warn('[scaleManager] cameraRig.rescaleState(S) missing');
    if (env && typeof env.rescale === 'function') env.rescale(S);
    else if (DEV && env) console.warn('[scaleManager] env.rescale(S) missing');

    PAYLOADS.rescale.S = S;
    this._bus.emit(EVT.RESCALE, PAYLOADS.rescale);
  }

  /**
   * Cell size of a tier band in CURRENT sim units: the band's native
   * cellSizeSim (defined for when it is the current tier, worldScale_b =
   * 0.1 * 5^b) converted by 5^(band - rescaleCount). Out-of-range bands
   * (e.g. -1 at tier 0 — always empty) borrow the nearest tier's native cell.
   * @param {number} band Tier band (may be tierIndex - 1 .. tierIndex + 1).
   * @returns {number} Cell size in current sim units.
   */
  bandCellSizeCur(band) {
    const b = band < 0 ? 0 : band >= TIERS.length ? TIERS.length - 1 : band;
    return TIERS[b].cellSizeSim * Math.pow(5, band - this.rescaleCount);
  }

  /**
   * Re-band + rebuild the three live spatial hashes:
   * hashes[i] holds band tierIndex - 1 + i, at that band's CURRENT-unit cell
   * size. Mandatory after any rescale (positions changed), tier change
   * (bands shifted) or rebase (cells moved).
   * @param {object} store
   * @param {object[]} hashes
   */
  _rebuildHashes(store, hashes) {
    if (!store || !hashes) return;
    for (let i = 0; i < 3; i++) {
      const h = hashes[i];
      const band = this.tierIndex - 1 + i;
      if (h && typeof h.rebuild === 'function') h.rebuild(store, band, this.bandCellSizeCur(band));
    }
  }

  /** Emit 'tierUp' (COSMETIC ONLY — gameplay never branches on it). @param {number} tr */
  _emitTierUp(tr) {
    PAYLOADS.tierUp.tierIndex = this.tierIndex;
    PAYLOADS.tierUp.name = TIERS[this.tierIndex].name;
    PAYLOADS.tierUp.trueRadius = tr;
    this._bus.emit(EVT.TIER_UP, PAYLOADS.tierUp);
  }
}

/* ================================================================== */
/* Pool iteration helpers (rare paths: rescale / rebase only)          */
/* ================================================================== */

/** @param {object} pool @param {number} S */
function rescalePool(pool, S) {
  // rescaleAll(S) is the pool's tight similarity loop; rewriteAll takes a
  // CALLBACK (rewriteAll(fn)) and must not be handed a scalar.
  if (typeof pool.rescaleAll === 'function') pool.rescaleAll(S);
  else if (DEV) console.warn('[scaleManager] InstancedPool.rescaleAll(S) missing');
}

/** @param {object} pool @param {number} sx @param {number} sz */
function rebasePool(pool, sx, sz) {
  if (typeof pool.rebaseAll === 'function') pool.rebaseAll(sx, sz);
  else if (DEV) console.warn('[scaleManager] InstancedPool.rebaseAll(sx, sz) missing — rebase will drift');
}

/**
 * Visit every InstancedPool in a Map / array / plain record. Only called on
 * the rare rescale/rebase paths, so iterator allocation is acceptable.
 * @param {Map<string, object>|object[]|Object<string, object>|null|undefined} instances
 * @param {(pool: object, a: number, b: number) => void} fn
 * @param {number} a @param {number} b
 */
function eachPool(instances, fn, a, b) {
  if (!instances) return;
  if (typeof instances.forEach === 'function') {
    instances.forEach((pool) => {
      if (pool) fn(pool, a, b);
    });
    return;
  }
  const keys = Object.keys(instances);
  for (let i = 0; i < keys.length; i++) {
    const pool = instances[keys[i]];
    if (pool) fn(pool, a, b);
  }
}
