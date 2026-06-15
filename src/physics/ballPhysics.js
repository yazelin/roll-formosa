/**
 * @file ballPhysics.js — Ball kinematics on the analytic plane y = 0.
 *
 * The only dynamic body in the game. Owns the BallState (single source of
 * ball truth). Everything is radius-proportional (SEAMLESSNESS LAW) so
 * screen-space feel is identical at every tier and across rescales:
 *   accel    = ACCEL_K * simRadius * sluggish  (camera-relative input)
 *   speedCap = SPEED_K * simRadius
 *   friction = vel *= FRICTION_PER_FRAME ^ (dt * 60)
 *
 * v2 DASH (docs/DESIGN-V2.md §ゲームシステム): BallState gains dashGauge01
 * (starts 1.0; += dt / DASH_RECHARGE_S, clamped; absorb.js adds
 * DASH_ABSORB_GAIN per absorb) and dashTimer. On intent.dash (edge-latched by
 * input.js) with a full gauge: vel += dir * DASH_IMPULSE_K * radiusSim where
 * dir = horizontal vel dir if |vel| >= DASH_DIR_SPEED_K * speedCap else
 * camera forward; 'dash' emitted; while dashTimer > 0 speedCap *= DASH_CAP_MUL
 * and accel *= DASH_ACCEL_MUL. 'dashReady' fires ONCE per refill (this class
 * is the SINGLE emitter — absorb.js only adds gauge). Gauge is dimensionless
 * and the timer is seconds, so the dash state is rescale/rebase-invariant —
 * no hooks needed. The injected bus is optional (null-safe headless tests).
 *
 * Rolling without slipping: axis = up x v-hat, angle = |v| * dt / simRadius,
 * quat = axisAngle o quat — module scratch, zero allocation.
 *
 * Ground: center y is an UNDERDAMPED spring toward radiusSim
 * (BALL_Y_OMEGA / BALL_Y_ZETA) — radius growth from absorbs makes the ball
 * visibly 'pop' upward. Velocity stays strictly horizontal (vel.y === 0);
 * pos.y is cosmetic spring output.
 *
 * CAMERA-RELATIVE CONVENTION (binding for render/cameraRig.js):
 *   camYaw is rotation about +Y; yaw = 0 means the camera looks along -Z.
 *   forward (intent.y = +1) = (-sin yaw, 0, -cos yaw)
 *   right   (intent.x = +1) = ( cos yaw, 0, -sin yaw)
 */

import * as THREE from 'three';
import {
  ACCEL_K,
  SPEED_K,
  BOOST_ACCEL_MUL,
  BOOST_CAP_MUL,
  FRICTION_PER_FRAME,
  BALL_Y_OMEGA,
  BALL_Y_ZETA,
  SLUGGISH_RECOVERY_S,
  SIM_RADIUS_MIN,
  DASH_RECHARGE_S,
  DASH_DURATION_S,
  DASH_CAP_MUL,
  DASH_ACCEL_MUL,
  DASH_IMPULSE_K,
  DASH_DIR_SPEED_K,
  OVERCAP_BLEED_PER_FRAME,
} from '../config/tuning.js';
import { EVT, PAYLOADS } from '../core/events.js';
import { springDamped } from '../core/mathUtils.js';

/** @typedef {import('../types.js').BallState} BallState */
/** @typedef {import('../types.js').Intent} Intent */
/** Below this horizontal speed (sim/s) we skip the rolling quaternion update. */
const ROLL_SPEED_EPS = 1e-5;

/* Module-level scratch — never allocated per frame. */
const SCRATCH_AXIS = new THREE.Vector3();
const SCRATCH_ROLL_Q = new THREE.Quaternion();

/**
 * Kinematic ball integrator. Construct once; main.js calls step() inside the
 * fixed-timestep loop (before absorb.resolve). ScaleManager calls rescale(S)
 * at tier-up (it also scales the hidden ground-spring state — do NOT scale
 * state fields directly or the y-spring will pop).
 */
export class BallPhysics {
  /**
   * @param {import('../core/events.js').EventBus} [bus] Shared event bus for
   *   'dash' / 'dashReady' emission. Optional — null-safe for headless tests
   *   (dash mechanics run, events are simply not emitted).
   * @param {{ collide(state: BallState): void }} [terrain] v3 PHASE-0
   *   DOCUMENTED OVERLAP EXCEPTION #2 (docs/DESIGN-V3.md, like v2's
   *   WIN_RADIUS_M note): the injected CityTerrain (world/terrain.js,
   *   Stream B). When present, terrain.collide(state) runs once per substep
   *   AFTER XZ integration (shop walls/prisms + permanent Skytree base
   *   circle + map-bounds clamp + soft edge damping). Default null so the
   *   Phase-0 build boots unchanged; reset() is deliberately UNTOUCHED —
   *   the v3 map is authored with ORIGIN = BALL START so (0, r, 0) stays
   *   correct.
   */
  constructor(bus = null, terrain = null) {
    /** @type {import('../core/events.js').EventBus|null} */
    this._bus = bus;
    /** @type {{ collide(state: BallState): void }|null} */
    this._terrain = terrain;
    /**
     * Single source of ball truth — absorb.js mutates radiusSim/sluggish/
     * dashGauge01, bounce response mutates pos/vel; everyone else reads only.
     * @type {BallState}
     */
    this.state = {
      pos: new THREE.Vector3(0, SIM_RADIUS_MIN, 0),
      vel: new THREE.Vector3(0, 0, 0),
      quat: new THREE.Quaternion(),
      radiusSim: SIM_RADIUS_MIN,
      radiusVisualSim: SIM_RADIUS_MIN,
      sluggish: 1,
      dashGauge01: 1,
      dashTimer: 0,
    };
    /** @type {{ value: number, vel: number }} Ground y-spring (underdamped). */
    this._ySpring = { value: SIM_RADIUS_MIN, vel: 0 };
    /**
     * @type {boolean} 'dashReady' edge guard — true once announced for the
     * current refill (starts true: the gauge starts full, no chime at boot).
     * Cleared on dash trigger; absorb.js gauge gains are announced here on
     * the NEXT step (single-emitter rule).
     */
    this._dashReadyAnnounced = true;
  }

  /**
   * Advance one fixed physics substep.
   * @param {number} dt     Fixed timestep (FIXED_DT).
   * @param {Intent} intent Normalized input axes in [-1, 1] (clamped to unit length here).
   * @param {number} camYaw Camera yaw (rad, about +Y; 0 = looking along -Z).
   */
  step(dt, intent, camYaw) {
    const s = this.state;
    const vel = s.vel;
    const boost = intent.boost === true;

    /* --- Dash gauge recharge + 'dashReady' edge ---------------------- */
    if (s.dashGauge01 < 1) {
      s.dashGauge01 += dt / DASH_RECHARGE_S;
      if (s.dashGauge01 > 1) s.dashGauge01 = 1;
    }
    if (s.dashGauge01 >= 1 && !this._dashReadyAnnounced) {
      this._dashReadyAnnounced = true;
      if (this._bus !== null) this._bus.emit(EVT.DASH_READY, PAYLOADS.dashReady);
    }

    /* --- Dash trigger (intent.dash is edge-latched by input.js) ------ */
    if (intent.dash === true && s.dashGauge01 >= 1) {
      s.dashGauge01 = 0;
      s.dashTimer = DASH_DURATION_S;
      this._dashReadyAnnounced = false;
      // dir = horizontal vel dir if moving past the threshold, else camera
      // forward (same forward convention as the intent mapping below).
      const sp = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
      let dx;
      let dz;
      if (sp >= DASH_DIR_SPEED_K * SPEED_K * s.radiusSim) {
        dx = vel.x / sp;
        dz = vel.z / sp;
      } else {
        dx = -Math.sin(camYaw);
        dz = -Math.cos(camYaw);
      }
      const imp = DASH_IMPULSE_K * s.radiusSim;
      vel.x += dx * imp;
      vel.z += dz * imp;
      if (this._bus !== null) {
        PAYLOADS.dash.gauge01 = 0;
        this._bus.emit(EVT.DASH, PAYLOADS.dash);
      }
    }
    const dashing = s.dashTimer > 0;

    /* --- Camera-relative acceleration ------------------------------- */
    let ix = intent.x;
    let iy = intent.y;
    const inLen2 = ix * ix + iy * iy;
    if (inLen2 > 1) {
      const inv = 1 / Math.sqrt(inLen2);
      ix *= inv;
      iy *= inv;
    }
    if (inLen2 > 0) {
      const sinY = Math.sin(camYaw);
      const cosY = Math.cos(camYaw);
      // world dir = right * ix + forward * iy (see convention in file header)
      const dirX = cosY * ix - sinY * iy;
      const dirZ = -sinY * ix - cosY * iy;
      const a =
        ACCEL_K *
        s.radiusSim *
        s.sluggish *
        (boost ? BOOST_ACCEL_MUL : 1) *
        (dashing ? DASH_ACCEL_MUL : 1);
      vel.x += dirX * a * dt;
      vel.z += dirZ * a * dt;
    }

    /* --- Friction + speed cap (horizontal only) --------------------- */
    const f = Math.pow(FRICTION_PER_FRAME, dt * 60);
    vel.x *= f;
    vel.z *= f;

    const cap =
      SPEED_K * s.radiusSim * (boost ? BOOST_CAP_MUL : 1) * (dashing ? DASH_CAP_MUL : 1);
    let speed2 = vel.x * vel.x + vel.z * vel.z;
    if (speed2 > cap * cap) {
      // Soft cap: bleed the over-cap EXCESS by OVERCAP_BLEED_PER_FRAME per
      // 60Hz frame instead of snapping to the cap in one substep — the dash
      // tail (cap drops 18.7r -> 8.5r when dashTimer expires) glides out
      // over ~0.25s instead of a visible -45% hitch.
      const sp = Math.sqrt(speed2);
      const target = cap + (sp - cap) * Math.pow(OVERCAP_BLEED_PER_FRAME, dt * 60);
      const k = target / sp;
      vel.x *= k;
      vel.z *= k;
      speed2 = target * target;
    }

    /* --- Dash burst timer -------------------------------------------- */
    if (dashing) {
      s.dashTimer -= dt;
      if (s.dashTimer < 0) s.dashTimer = 0;
    }

    /* --- Integrate position ----------------------------------------- */
    s.pos.x += vel.x * dt;
    s.pos.z += vel.z * dt;

    /* --- v3 terrain collision (AFTER XZ integration — binding order) --
       CityTerrain resolves shop walls/prisms (circle-vs-AABB, BOUNCE with
       cooldown), the permanent Skytree base circle, the map-bounds hard
       clamp and the soft edge damping. Mutates pos/vel in place; no-op
       until main.js injects the real terrain (Phase-0 stub is null). */
    if (this._terrain !== null) this._terrain.collide(s);

    /* --- Ground y-spring (underdamped 'pop' on growth) -------------- */
    springDamped(this._ySpring, s.radiusSim, BALL_Y_OMEGA, BALL_Y_ZETA, dt);
    s.pos.y = this._ySpring.value;

    /* --- Rolling without slipping ------------------------------------ */
    const speed = Math.sqrt(speed2);
    if (speed > ROLL_SPEED_EPS) {
      const invSpeed = 1 / speed;
      // axis = up x v-hat = (vz, 0, -vx) / |v|
      SCRATCH_AXIS.set(vel.z * invSpeed, 0, -vel.x * invSpeed);
      SCRATCH_ROLL_Q.setFromAxisAngle(SCRATCH_AXIS, (speed * dt) / s.radiusSim);
      s.quat.premultiply(SCRATCH_ROLL_Q);
      s.quat.normalize();
    }

    /* --- Sluggishness recovery (mass feel) ---------------------------
       Proportional return toward 1 with time constant SLUGGISH_RECOVERY_S:
       a single absorb's dip recovers in ~1.5s and deep multiplicative dips
       (absorb streaks) recover fast at first instead of crawling linearly. */
    if (s.sluggish < 1) {
      s.sluggish += (1 - s.sluggish) * (dt / SLUGGISH_RECOVERY_S);
      if (s.sluggish > 1) s.sluggish = 1;
    }
  }

  /**
   * One-frame similarity rescale hook (ScaleManager calls this with
   * S = RESCALE_S between physics update and render). Scales position,
   * velocity, both radii AND the hidden ground-spring state so the rescale
   * frame renders pixel-identical. Angular state (quat) is scale-free.
   * @param {number} S Similarity factor (0.2).
   */
  rescale(S) {
    const s = this.state;
    s.pos.multiplyScalar(S);
    s.vel.multiplyScalar(S);
    s.radiusSim *= S;
    s.radiusVisualSim *= S;
    this._ySpring.value *= S;
    this._ySpring.vel *= S;
  }

  /**
   * Companion hook for orchestrators that scale the PUBLIC BallState fields
   * themselves (ScaleManager._applyRescale mutates pos/vel/radii directly):
   * scales ONLY the hidden ground-spring state so the y-spring stays
   * pixel-identical across the rescale. Do NOT call together with rescale(S)
   * — that would double-scale the spring.
   * @param {number} S Similarity factor (0.2).
   */
  rescaleSpring(S) {
    this._ySpring.value *= S;
    this._ySpring.vel *= S;
  }

  /**
   * Floating-origin rebase hook: subtract the integer-snapped shift from the
   * ball position (ScaleManager applies the same shift to the store/camera).
   * @param {number} dx Sim-unit X shift.
   * @param {number} dz Sim-unit Z shift.
   */
  rebase(dx, dz) {
    this.state.pos.x -= dx;
    this.state.pos.z -= dz;
  }

  /**
   * Reset to a fresh run (game reset / dev ?r= start-at-radius key).
   * @param {number} [radiusSim=SIM_RADIUS_MIN] Starting sim radius.
   */
  reset(radiusSim = SIM_RADIUS_MIN) {
    const s = this.state;
    s.pos.set(0, radiusSim, 0);
    s.vel.set(0, 0, 0);
    s.quat.identity();
    s.radiusSim = radiusSim;
    s.radiusVisualSim = radiusSim;
    s.sluggish = 1;
    s.dashGauge01 = 1; // fresh run starts with a full gauge
    s.dashTimer = 0;
    this._dashReadyAnnounced = true; // full at boot — no spurious chime
    this._ySpring.value = radiusSim;
    this._ySpring.vel = 0;
  }
}
