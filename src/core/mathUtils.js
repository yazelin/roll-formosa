/**
 * @file mathUtils.js — Critically-damped springs, damp(), easing,
 * formatLength(), and SHARED scratch temps.
 *
 * The scratch temps (TMP_*) are module-level singletons for zero-allocation
 * per-frame math. Rules: use only WITHIN one function body, never hold across
 * a call into another module (callees may use the same temps).
 */

import * as THREE from 'three';

/* ================================================================== */
/* Shared scratch temps — never allocate Vector3/Quaternion per frame  */
/* ================================================================== */

/** @type {THREE.Vector3} */ export const TMP_V3A = new THREE.Vector3();
/** @type {THREE.Vector3} */ export const TMP_V3B = new THREE.Vector3();
/** @type {THREE.Vector3} */ export const TMP_V3C = new THREE.Vector3();
/** @type {THREE.Quaternion} */ export const TMP_QA = new THREE.Quaternion();
/** @type {THREE.Quaternion} */ export const TMP_QB = new THREE.Quaternion();
/** @type {THREE.Matrix4} */ export const TMP_M4 = new THREE.Matrix4();

/* ================================================================== */
/* Springs                                                             */
/* ================================================================== */

/**
 * Advance a critically-damped scalar spring one step (stable analytic form,
 * never overshoots, frame-rate independent). Mutates `state` in place.
 * @param {{ value: number, vel: number }} state Spring state (value + velocity).
 * @param {number} target Target value.
 * @param {number} omega  Stiffness / natural frequency (rad/s) — e.g. CAM_POS_OMEGA.
 * @param {number} dt     Timestep (s).
 * @returns {{ value: number, vel: number }} The same state object.
 */
export function springScalar(state, target, omega, dt) {
  const e = Math.exp(-omega * dt);
  const dx = state.value - target;
  const tmp = (state.vel + omega * dx) * dt;
  state.value = target + (dx + tmp) * e;
  state.vel = (state.vel - omega * tmp) * e;
  return state;
}

/**
 * Critically-damped Vector3 spring: mutates `pos` and `vel` in place toward
 * `target`. Zero allocation. Used by cameraRig for position and look targets;
 * both pos and vel live in sim space and must be multiplied by S at rescale.
 * @param {THREE.Vector3} pos    Current value (mutated).
 * @param {THREE.Vector3} vel    Current velocity (mutated).
 * @param {THREE.Vector3} target Target value (read-only).
 * @param {number} omega Stiffness (rad/s).
 * @param {number} dt    Timestep (s).
 */
export function springVec3(pos, vel, target, omega, dt) {
  const e = Math.exp(-omega * dt);
  // per-component to stay allocation-free
  let dx = pos.x - target.x;
  let tmp = (vel.x + omega * dx) * dt;
  pos.x = target.x + (dx + tmp) * e;
  vel.x = (vel.x - omega * tmp) * e;

  dx = pos.y - target.y;
  tmp = (vel.y + omega * dx) * dt;
  pos.y = target.y + (dx + tmp) * e;
  vel.y = (vel.y - omega * tmp) * e;

  dx = pos.z - target.z;
  tmp = (vel.z + omega * dx) * dt;
  pos.z = target.z + (dx + tmp) * e;
  vel.z = (vel.z - omega * tmp) * e;
}

/**
 * Advance an UNDERDAMPED scalar spring (zeta < 1 gives overshoot 'pop' —
 * used for the ball ground y-spring, BALL_Y_OMEGA/BALL_Y_ZETA).
 * Semi-implicit Euler: stable at 60Hz fixed step for our omega range.
 * @param {{ value: number, vel: number }} state Spring state (mutated).
 * @param {number} target Target value.
 * @param {number} omega  Natural frequency (rad/s).
 * @param {number} zeta   Damping ratio (<1 underdamped, 1 critical).
 * @param {number} dt     Timestep (s).
 * @returns {{ value: number, vel: number }} The same state object.
 */
export function springDamped(state, target, omega, zeta, dt) {
  const accel = -2 * zeta * omega * state.vel - omega * omega * (state.value - target);
  state.vel += accel * dt;
  state.value += state.vel * dt;
  return state;
}

/* ================================================================== */
/* Interpolation / easing                                              */
/* ================================================================== */

/**
 * Frame-rate-independent exponential approach: returns the new value moved
 * from `current` toward `target`, halving the remaining distance every
 * `halflife` seconds.
 * @param {number} current  Current value.
 * @param {number} target   Target value.
 * @param {number} halflife Seconds to cover half the remaining distance.
 * @param {number} dt       Timestep (s).
 * @returns {number} New value.
 */
export function damp(current, target, halflife, dt) {
  return target + (current - target) * Math.pow(2, -dt / halflife);
}

/**
 * Linear interpolation.
 * @param {number} a @param {number} b @param {number} t
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp to [0, 1].
 * @param {number} x
 * @returns {number}
 */
export function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Clamp to [min, max].
 * @param {number} x @param {number} min @param {number} max
 * @returns {number}
 */
export function clamp(x, min, max) {
  return x < min ? min : x > max ? max : x;
}

/**
 * Ease-out cubic (decelerating) — attach animation, fades.
 * @param {number} t 0..1
 * @returns {number}
 */
export function easeOutCubic(t) {
  const u = 1 - t;
  return 1 - u * u * u;
}

/**
 * Ease-in-out cubic — palette crossfades, FOV kick.
 * @param {number} t 0..1
 * @returns {number}
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Ease-out back (slight overshoot) — squash-and-settle accents.
 * @param {number} t 0..1
 * @returns {number}
 */
export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

/* ================================================================== */
/* Display formatting                                                  */
/* ================================================================== */

/**
 * Format a real-meter length for the HUD odometer: mm / cm / m / km with
 * sensible precision (e.g. 8.2mm, 5.3cm, 1.25m, 24.8m, 312m, 1.2km).
 * Allocates a string — call only from throttled UI paths (10Hz), never
 * per-frame in hot loops.
 * @param {number} meters Length in real meters.
 * @returns {string} Human-readable length with unit.
 */
export function formatLength(meters) {
  if (meters < 0.01) {
    return `${(meters * 1000).toFixed(1)}mm`;
  }
  if (meters < 1) {
    return `${(meters * 100).toFixed(1)}cm`;
  }
  if (meters < 1000) {
    return meters < 100 ? `${meters.toFixed(2)}m` : `${meters.toFixed(0)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
}

/**
 * Split a real-meter length into {value, unit} for the HUD's separate
 * value/unit DOM nodes (unit rollover animation hooks #size-value/#size-unit).
 * Mutates and returns the provided out object — zero allocation when reused.
 * @param {number} meters Length in real meters.
 * @param {{ value: string, unit: string }} out Reused output object.
 * @returns {{ value: string, unit: string }} The same out object.
 */
export function splitLength(meters, out) {
  if (meters < 0.01) {
    out.value = (meters * 1000).toFixed(1);
    out.unit = 'mm';
  } else if (meters < 1) {
    out.value = (meters * 100).toFixed(1);
    out.unit = 'cm';
  } else if (meters < 1000) {
    out.value = meters < 100 ? meters.toFixed(2) : meters.toFixed(0);
    out.unit = 'm';
  } else {
    out.value = (meters / 1000).toFixed(2);
    out.unit = 'km';
  }
  return out;
}
