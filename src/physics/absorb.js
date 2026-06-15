/**
 * @file absorb.js — Narrowphase per fixed substep: 3-tier-band hash queries,
 * absorb-vs-pushback dispatch, growth, bounce, bonk + knock-off.
 *
 * Called from main.js inside the fixed-step loop, AFTER ballPhysics.step:
 *   absorb.resolve(ballPhys.state, hashes, store)
 *
 * Dispatch per overlapping candidate (overlap test uses the archetype's
 * collisionScale fudge; absorbability uses the RAW bounding radius — both
 * CONTINUOUS in ball radius, never tier-gated):
 *   objRadius <= ABSORB_RATIO * ballRadius  -> ABSORB:
 *     newR = cbrt(R^3 + K * r^3) with K = growthKForObjR(objRealRadius)
 *     (curated landmark/collectible slots keep K = GROWTH_K — authored
 *     ladder exemption); sluggish *= SLUGGISH_FACTOR;
 *     hash.remove -> emit 'absorb' (handlers may read store fields
 *     synchronously during the emit; render/ball steals instanceSlot for the
 *     attach animation) -> store.free.
 *   else -> PUSHBACK: position-correct along the XZ contact normal (planar —
 *     the ball is ground-constrained), reflect normal velocity
 *     * BOUNCE_RESTITUTION, tangential preserved; emit 'bounce'; if approach
 *     speed > BONK_SPEED_FRAC * speedCap also emit 'knockOff' (render/ball
 *     ejects 1-3 newest stuck objects).
 *
 * Also owns: visual radius slew (radiusVisualSim -> radiusSim at
 * <= RADIUS_SLEW_K * r per second) and the rapid-absorb combo counter
 * (COMBO_WINDOW_S). Zero allocation per call: preallocated candidate scratch,
 * reused event payloads.
 *
 * v2 (docs/DESIGN-V2.md): each absorb also (a) stamps AbsorbEvent.rare from
 * (store.flags[i] & FLAG_RARE) BEFORE store.free, and (b) adds
 * DASH_ABSORB_GAIN to ball.dashGauge01 (clamped to 1 — the 'dashReady' edge
 * is emitted by ballPhysics on its next step; single-emitter rule).
 *
 * v3 (docs/DESIGN-V3.md フィードバック): each absorb additionally stamps,
 * BEFORE store.free and next to the rare stamp:
 *   AbsorbEvent.archetypeCode = store.archetype[i]   (0..93; 70..93 = EXTRA)
 *   AbsorbEvent.collectibleId = curated.collectibleIdFor(i)  (frozen id 0..11
 *     or -1; the injected CuratedSpawner keeps the mapping valid THROUGH the
 *     ABSORB dispatch — frozen subscription-order contract in events.js).
 */

import {
  FIXED_DT,
  ABSORB_RATIO,
  GROWTH_K,
  growthKForObjR,
  PICKUP_FORGIVE_K,
  PICKUP_FORGIVE_MAX_RATIO,
  RADIUS_SLEW_K,
  BOUNCE_RESTITUTION,
  BONK_SPEED_FRAC,
  KNOCKOFF_MIN,
  KNOCKOFF_MAX,
  COMBO_WINDOW_S,
  SPEED_K,
  SLUGGISH_FACTOR,
  SLUGGISH_MIN,
  SIM_RADIUS_MIN,
  START_RADIUS_M,
  DASH_ABSORB_GAIN,
} from '../config/tuning.js';
import { EVT, PAYLOADS } from '../core/events.js';
import { mulberry32 } from '../core/rng.js';
import {
  FLAG_ALIVE,
  FLAG_TOMB,
  FLAG_RARE,
  ARCHETYPE_ID_BY_CODE,
  ARCHETYPE_CODE_BY_ID,
} from '../world/objects.js';

/** @typedef {import('../types.js').BallState} BallState */
/** @typedef {import('../types.js').Archetype} Archetype */

/** Candidate scratch size (per-query overlaps are typically 5-40). */
const CANDIDATE_CAP = 1024;
/** Bounces softer than this fraction of speedCap are resting contact — no event spam. */
const BOUNCE_EMIT_MIN_FRAC = 0.05;
/** Min seconds between knock-off ejections (one bonk = one knock-off, not one per substep). */
const BONK_COOLDOWN_S = 0.25;
/** worldScale fallback when no provider is injected (START_RADIUS_M at SIM_RADIUS_MIN). */
const DEFAULT_WORLD_SCALE = START_RADIUS_M / SIM_RADIUS_MIN;
/** Fixed seed for the (cosmetic-only) knock-off count roll — reproducible runs. */
const KNOCKOFF_RNG_SEED = 0xb04b5eed;

/**
 * Narrowphase resolver. Construct once at boot:
 *   const absorb = new Absorb(bus, scaleMgr, CATALOG, curated);
 *
 * @example
 * // per fixed substep (main.js):
 * absorb.resolve(ballPhys.state, hashes, store);
 */
export class Absorb {
  /**
   * @param {import('../core/events.js').EventBus} bus The shared event bus.
   * @param {{ worldScale: number }} [scaleProvider] ScaleManager (read for
   *   trueRadius/sizeReal in event payloads). Falls back to the tier-0
   *   starting worldScale (0.04) when absent — headless tests.
   * @param {Record<string, Archetype>} [catalog] CATALOG from config/catalog.js
   *   — only collisionScale is read, at construction (covers all 94 codes:
   *   chunk + EXTRA curated entries share the CATALOG). Defaults to 1 for
   *   all archetypes when absent.
   * @param {{ collectibleIdFor: (storeIdx: number) => number }} [curated]
   *   v3: the CuratedSpawner (or the Phase-0 stub) — collectibleIdFor(i) is
   *   queried per absorb to stamp AbsorbEvent.collectibleId BEFORE store.free.
   *   Defaults to -1 stamping when absent (headless tests).
   */
  constructor(bus, scaleProvider, catalog, curated) {
    /** @type {import('../core/events.js').EventBus} */
    this._bus = bus;
    /** @type {{ worldScale: number } | null} */
    this._scale = scaleProvider || null;
    /** @type {{ collectibleIdFor: (storeIdx: number) => number } | null} */
    this._curated = curated || null;

    /** @type {Float32Array} collisionScale per archetype code (sized from ARCHETYPE_ID_BY_CODE). */
    this._collisionScale = new Float32Array(ARCHETYPE_ID_BY_CODE.length).fill(1);
    if (catalog) {
      for (let code = 0; code < ARCHETYPE_ID_BY_CODE.length; code++) {
        const arch = catalog[ARCHETYPE_ID_BY_CODE[code]];
        if (arch && typeof arch.collisionScale === 'number') {
          this._collisionScale[code] = arch.collisionScale;
        }
      }
    }

    /** @type {Int32Array} queryBall output scratch. */
    this._candidates = new Int32Array(CANDIDATE_CAP);
    /** @type {() => number} Cosmetic RNG for the knock-off count (1..3). */
    this._rng = mulberry32(KNOCKOFF_RNG_SEED);

    /** @type {number} Current rapid-absorb combo count. */
    this._combo = 0;
    /** @type {number} Seconds left in the combo window. */
    this._comboTimer = 0;
    /** @type {number} Total objects absorbed this run. */
    this._count = 0;
    /** @type {number} Seconds left on the knock-off cooldown. */
    this._bonkCooldown = 0;
  }

  /** Total objects absorbed this run (for frameStats/HUD pulls). @returns {number} */
  get absorbedCount() {
    return this._count;
  }

  /** Current worldScale (injected provider or the tier-0 default). @returns {number} */
  _worldScale() {
    return this._scale !== null ? this._scale.worldScale : DEFAULT_WORLD_SCALE;
  }

  /**
   * Resolve one fixed substep of ball-vs-world contacts. dt is implicitly
   * FIXED_DT (this runs only inside the fixed-step loop).
   * @param {BallState} ball The ball state (mutated: radiusSim, radiusVisualSim, sluggish, pos, vel).
   * @param {import('../world/spatialHash.js').SpatialHash[]} hashes The 3 live-band hashes [N-1, N, N+1].
   * @param {import('../world/objects.js').ObjectStore} store The SoA object store.
   */
  resolve(ball, hashes, store) {
    const dt = FIXED_DT;

    /* --- Timers ------------------------------------------------------ */
    if (this._comboTimer > 0) {
      this._comboTimer -= dt;
      if (this._comboTimer <= 0) this._combo = 0;
    }
    if (this._bonkCooldown > 0) this._bonkCooldown -= dt;

    /* --- Visual radius slew (<= RADIUS_SLEW_K * r per second) -------- */
    const dr = ball.radiusSim - ball.radiusVisualSim;
    if (dr !== 0) {
      const maxStep = RADIUS_SLEW_K * ball.radiusVisualSim * dt;
      if (dr > maxStep) ball.radiusVisualSim += maxStep;
      else if (dr < -maxStep) ball.radiusVisualSim -= maxStep;
      else ball.radiusVisualSim = ball.radiusSim;
    }

    /* --- Broadphase + narrowphase over the 3 live tier bands --------- */
    const pos = ball.pos;
    const cand = this._candidates;
    const flags = store.flags;
    const radius = store.radius;
    const px = store.px;
    const py = store.py;
    const pz = store.pz;
    const collisionScale = this._collisionScale;

    for (let h = 0; h < hashes.length; h++) {
      const hash = hashes[h];
      if (hash.size === 0) continue;
      const n = hash.queryBall(pos.x, pos.y, pos.z, ball.radiusSim, hash.cellSize * 0.5, cand);
      for (let k = 0; k < n; k++) {
        const i = cand[k];
        const f = flags[i];
        if ((f & FLAG_ALIVE) === 0 || (f & FLAG_TOMB) !== 0) continue;

        const ballR = ball.radiusSim; // re-read: grows mid-loop on absorbs
        const r = radius[i];
        const rEff = r * collisionScale[store.archetype[i]];
        const sum = ballR + rEff;
        // Pickup forgiveness: clearly-smaller objects (always absorbable,
        // since PICKUP_FORGIVE_MAX_RATIO < ABSORB_RATIO) get a widened
        // overlap test; pushback candidates keep the honest `sum`.
        const reach =
          r <= PICKUP_FORGIVE_MAX_RATIO * ballR ? sum + PICKUP_FORGIVE_K * ballR : sum;
        const dx = pos.x - px[i];
        const dy = pos.y - py[i];
        const dz = pos.z - pz[i];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= reach * reach) continue;

        if (r <= ABSORB_RATIO * ballR) {
          this._absorbOne(i, hash, store, ball);
        } else {
          this._pushback(ball, dx, dy, dz, sum);
        }
      }
    }
  }

  /**
   * Absorb one object: volume growth, sluggish hit, combo, hash remove,
   * 'absorb' emit (store fields still intact during the emit), store free.
   * @param {number} i Object store index.
   * @param {import('../world/spatialHash.js').SpatialHash} hash The hash the candidate came from.
   * @param {import('../world/objects.js').ObjectStore} store
   * @param {BallState} ball
   */
  _absorbOne(i, hash, store, ball) {
    const r = store.radius[i];
    const R = ball.radiusSim;
    const ws = this._worldScale();
    // v3 Phase-3 pacing: growth multiplier tapers with OBJECT REAL RADIUS
    // (continuous — seamlessness-law compliant). Curated landmark/collectible
    // slots are EXEMPT: the authored ladder keeps its designed x1.554 jumps
    // (incl. the BINDING Tokyo Tower 262->406 finale ramp). The ids are read
    // BEFORE store.free and reused for the event payload below.
    const collectibleId = this._curated !== null ? this._curated.collectibleIdFor(i) : -1;
    const landmarkId =
      this._curated !== null && typeof this._curated.landmarkIdFor === 'function'
        ? this._curated.landmarkIdFor(i)
        : -1;
    const k =
      collectibleId >= 0 || landmarkId >= 0 ? GROWTH_K : growthKForObjR(r * ws);
    ball.radiusSim = Math.cbrt(R * R * R + k * r * r * r);
    ball.sluggish *= SLUGGISH_FACTOR;
    if (ball.sluggish < SLUGGISH_MIN) ball.sluggish = SLUGGISH_MIN;

    // v2: dash gauge gain per absorb (clamped; 'dashReady' edge fires in
    // ballPhysics' next step — ballPhysics is the single emitter).
    ball.dashGauge01 += DASH_ABSORB_GAIN;
    if (ball.dashGauge01 > 1) ball.dashGauge01 = 1;

    this._combo = this._comboTimer > 0 ? this._combo + 1 : 1;
    this._comboTimer = COMBO_WINDOW_S;
    this._count++;

    hash.remove(i);

    const p = PAYLOADS.absorb;
    p.objIndex = i;
    p.archetypeId = ARCHETYPE_ID_BY_CODE[store.archetype[i]] || '';
    p.sizeReal = 2 * r * ws;
    p.combo = this._combo;
    p.trueRadius = ball.radiusSim * ws;
    p.count = this._count;
    // v2: rare stamped from the flags byte BEFORE store.free clears it.
    p.rare = (store.flags[i] & FLAG_RARE) !== 0;
    // v3: archetype code + frozen collectible id stamped BEFORE store.free
    // (collection.js matches on collectibleId >= 0; hud renders
    // DISPLAY_NAME_BY_CODE[archetypeCode] floats).
    p.archetypeCode = store.archetype[i];
    p.collectibleId = collectibleId;
    // Emit BEFORE freeing: render/ball reads px/py/pz/radius/instanceSlot
    // synchronously to start the attach animation. Handlers must not retain.
    this._bus.emit(EVT.ABSORB, p);

    store.free(i);
  }

  /**
   * Pushback off a too-big object: planar (XZ) position correction +
   * restitution bounce; 'bounce' / 'knockOff' emits.
   *
   * The ball is ground-constrained, so the correction normal is the XZ
   * projection of the contact direction; the planar separation target is
   * sqrt(sum^2 - dy^2) so the corrected 3D distance exactly equals the radius
   * sum (works for elevated bounding spheres like buildings).
   * @param {BallState} ball
   * @param {number} dx ballPos.x - objPos.x
   * @param {number} dy ballPos.y - objPos.y
   * @param {number} dz ballPos.z - objPos.z
   * @param {number} sum ballRadius + effective object radius.
   */
  _pushback(ball, dx, dy, dz, sum) {
    const targetPlanar2 = sum * sum - dy * dy;
    if (targetPlanar2 <= 0) return; // ball clears it vertically (degenerate)
    const targetPlanar = Math.sqrt(targetPlanar2);
    const dPlanar = Math.sqrt(dx * dx + dz * dz);

    let nx;
    let nz;
    if (dPlanar > 1e-6) {
      nx = dx / dPlanar;
      nz = dz / dPlanar;
    } else {
      // Dead-center degenerate: push opposite to velocity, or +X at rest.
      const vel = ball.vel;
      const v = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      if (v > 1e-6) {
        nx = -vel.x / v;
        nz = -vel.z / v;
      } else {
        nx = 1;
        nz = 0;
      }
    }

    // Position correction (full de-penetration along the planar normal).
    const pen = targetPlanar - dPlanar;
    ball.pos.x += nx * pen;
    ball.pos.z += nz * pen;

    // Velocity: reflect the normal component * restitution, keep tangential.
    const vel = ball.vel;
    const vn = vel.x * nx + vel.z * nz;
    if (vn >= 0) return; // already separating

    vel.x -= nx * vn * (1 + BOUNCE_RESTITUTION);
    vel.z -= nz * vn * (1 + BOUNCE_RESTITUTION);

    const impact = -vn;
    const speedCap = SPEED_K * ball.radiusSim;
    const frac = impact / speedCap;
    if (frac <= BOUNCE_EMIT_MIN_FRAC) return; // resting contact — no spam

    PAYLOADS.bounce.impactSpeed01 = frac > 1 ? 1 : frac;
    this._bus.emit(EVT.BOUNCE, PAYLOADS.bounce);

    if (frac > BONK_SPEED_FRAC && this._bonkCooldown <= 0) {
      this._bonkCooldown = BONK_COOLDOWN_S;
      const span = KNOCKOFF_MAX - KNOCKOFF_MIN + 1;
      PAYLOADS.knockOff.count = KNOCKOFF_MIN + ((this._rng() * span) | 0);
      this._bus.emit(EVT.KNOCK_OFF, PAYLOADS.knockOff);
    }
  }

  /** Reset run-scoped counters (game reset). */
  reset() {
    this._combo = 0;
    this._comboTimer = 0;
    this._count = 0;
    this._bonkCooldown = 0;
    this._rng = mulberry32(KNOCKOFF_RNG_SEED);
  }
}

// Re-export the id<->code mapping next to the system that consumes it most,
// for spawner/HUD convenience (single import site either way).
export { ARCHETYPE_ID_BY_CODE, ARCHETYPE_CODE_BY_ID };
