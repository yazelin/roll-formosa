/**
 * @file onboarding.js — v5 opening parts-guide (Stream A).
 *
 * For the first ~30 s of a fresh run (score still 0, finale 'idle') a 10 Hz
 * EVT.GOAL_GUIDE stream points the existing HUD #goal-arrow at the nearest
 * UNCONSUMED waypoint of a static breadcrumb list — interior parts bins ->
 * open-front gate -> gutter/exit-lane carpet — so a 2 cm player is never
 * staring at an empty floor wondering where the parts are (v5 owner
 * requirement 2; pairs with the V5_OPENING_CLUSTERS / V5_TRAIL_CLUSTERS
 * spawn carpet in config/cityMap.js and the new Donack start line
 * 「…光る矢印の先にパーツがあるよ」).
 *
 * REUSES the finale GOAL_GUIDE path verbatim (same payload object, same HUD
 * subscriber): projection math is copied from finale._projectAndEmitGuide
 * (module scratch Vector3 — zero per-frame allocation). The payload gains a
 * `kind` field: 'parts' while this guide is live, restored to 'goal' on the
 * final {active:false} emit so the HUD can swap the arrow glyph (🗼 -> 🔩)
 * and suppress the 「スカイツリーへ向かえ！」 toast for parts guides — see
 * hud.js _onGoalGuide (integrator wiring).
 *
 * NO COLLISION with the finale's GOAL_GUIDE by construction: the finale
 * emits only from APPROACH (trueRadius >= GOAL_RADIUS_M 420 m) which is
 * unreachable with score 0 inside 30 s; a DEV assert enforces it anyway and
 * any non-'idle' finale state hard-deactivates this guide first.
 *
 * COORDINATES: waypoints are authored in REAL METERS (origin = ball start —
 * the cityMap convention) and converted to sim via the LIVE worldScale at
 * every emit, so a rescale can never leave a stale target. A REBASE shifts
 * the sim origin away from the real origin, which would invalidate that
 * conversion — rebase cannot fire in the legit opening window (the ball is
 * meters from the origin), so the guide simply hard-deactivates if one ever
 * does (dev teleports). The camera position (sim) is used as the ball proxy
 * for waypoint consumption — its horizontal offset from the ball at opening
 * scale (~0.2 real m) is far below the consume radii.
 *
 * Lifecycle: constructed once at boot by main.js (AFTER finale — the finale
 * reference is injected via the constructor or setFinale, mirroring the
 * finale.setEffects late-wire precedent); onboarding.update(frameDt) runs at
 * frame-order step 4.6 (right after finale.update); main.resetWorld() calls
 * reset(). Also self-rearms on EVT.GAME_START so title-screen idle time
 * never eats the 30 s budget.
 *
 * Zero per-frame allocation; static data only at module init.
 */

import * as THREE from 'three';
import { EVT, PAYLOADS } from '../core/events.js';
import { clamp01 } from '../core/mathUtils.js';

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/* ---- onboarding-local tunables (cosmetic — not in tuning.js) -------- */
/** EVT.GOAL_GUIDE emission interval (10 Hz — finale parity). */
const GUIDE_INTERVAL_S = 0.1;
/** Guide hard-stops this long after the run starts (s). */
const ONBOARD_MAX_S = 30;

/**
 * Breadcrumb waypoints, REAL METERS (origin = ball start), consumed in
 * order (the lane is monotone +X, so "nearest unconsumed" == current index):
 *   0. interior parts bins (the densest V5_OPENING_CLUSTERS/V4 bin overlap),
 *   1. the open-front gate (x=4.6 face, exit-lane center),
 *   2. the gutter/exit-lane carpet outside.
 * consumeR: camera-proxy distance (real m) at which the waypoint is "reached"
 * and the arrow advances. y is the floor (items rest at ySurf 0).
 */
const WAYPOINTS = Object.freeze([
  Object.freeze({ x: 1.5, z: -1.0, consumeR: 1.0 }),
  Object.freeze({ x: 5.0, z: 0.0, consumeR: 1.6 }),
  Object.freeze({ x: 11.0, z: 0.0, consumeR: 2.0 }),
]);

// Module-level scratch (zero per-frame allocation).
const _v3 = new THREE.Vector3();

/**
 * Opening parts-guide emitter. Active iff no absorb yet (score == 0) AND
 * elapsed < ONBOARD_MAX_S AND finale.state === 'idle'; emits one final
 * {active:false} on first ABSORB / timeout / waypoint exhaustion, then stays
 * silent until reset().
 */
export class Onboarding {
  /**
   * @param {import('../core/events.js').EventBus} bus Shared event bus.
   * @param {THREE.PerspectiveCamera} camera Render camera (NDC projection —
   *   matrixWorldInverse freshness = last render, fine for a 10 Hz guide).
   * @param {import('../world/scaleManager.js').ScaleManager} scaleMgr Live
   *   worldScale source (real -> sim conversion at every emit).
   * @param {import('./finale.js').Finale|null} [finale] Finale state machine
   *   (gate + DEV no-collision assert; also injectable via setFinale).
   */
  constructor(bus, camera, scaleMgr, finale = null) {
    this._bus = bus;
    this._camera = camera;
    this._scaleMgr = scaleMgr;
    this._finale = finale;

    /** @type {boolean} Final {active:false} emitted — guide retired until reset(). */
    this._done = false;
    /** @type {boolean} First EVT.ABSORB seen this run (== score > 0). */
    this._absorbed = false;
    /** @type {boolean} A rebase broke the real->sim conversion — hard stop. */
    this._rebased = false;
    /** @type {number} Time since run start / reset (s). */
    this._elapsed = 0;
    /** @type {number} 10 Hz accumulator. */
    this._guideAcc = 0;
    /** @type {number} Next unconsumed waypoint index. */
    this._wpIndex = 0;
    /** @type {boolean} At least one active guide emitted (gates the off-emit). */
    this._everEmitted = false;
    /** @type {boolean} Rescale fired this frame — the camera matrix is still
     * pre-transform (render is step 7), so skip one 10 Hz tick instead of
     * flashing a mis-projected arrow (finale._skipGuideOnce precedent). */
    this._skipGuideOnce = false;

    bus.on(EVT.ABSORB, () => {
      this._absorbed = true;
    });
    bus.on(EVT.RESCALE, () => {
      this._skipGuideOnce = true; // conversion self-heals via live worldScale
    });
    bus.on(EVT.REBASE, () => {
      this._rebased = true; // real origin != sim origin now — retire the guide
    });
    // Belt-and-suspenders rearm: main.resetWorld() owns reset(), but the run
    // clock must also restart on GAME_START so title-screen time is free.
    bus.on(EVT.GAME_START, () => {
      this.reset();
    });
  }

  /**
   * Late wiring hook (finale.setEffects precedent) — main constructs the
   * finale first, then injects it here if not passed to the constructor.
   * @param {import('./finale.js').Finale} finale
   */
  setFinale(finale) {
    this._finale = finale;
  }

  /** Rearm for a fresh run (main.resetWorld + EVT.GAME_START). */
  reset() {
    this._done = false;
    this._absorbed = false;
    this._rebased = false;
    this._elapsed = 0;
    this._guideAcc = 0;
    this._wpIndex = 0;
    this._everEmitted = false;
    this._skipGuideOnce = false;
  }

  /**
   * Per-frame drive (main.js frame-order step 4.6, AFTER finale.update so
   * the finale-state gate reads this frame's truth).
   * @param {number} frameDt Render-frame delta (s).
   */
  update(frameDt) {
    if (this._done) return;
    this._elapsed += frameDt;

    if (
      this._absorbed ||
      this._rebased ||
      this._elapsed >= ONBOARD_MAX_S ||
      (this._finale !== null && this._finale.state !== 'idle')
    ) {
      this._finish();
      return;
    }

    // Waypoint consumption (camera = ball proxy, REAL meters, in-order lane).
    const ws = this._scaleMgr.worldScale;
    const camX = this._camera.position.x * ws;
    const camZ = this._camera.position.z * ws;
    while (this._wpIndex < WAYPOINTS.length) {
      const wp = WAYPOINTS[this._wpIndex];
      const dx = wp.x - camX;
      const dz = wp.z - camZ;
      if (dx * dx + dz * dz > wp.consumeR * wp.consumeR) break;
      this._wpIndex++;
    }
    if (this._wpIndex >= WAYPOINTS.length) {
      this._finish(); // lane walked end-to-end — the player has the idea
      return;
    }

    // 10 Hz throttle (finale parity, incl. hitch no-catch-up).
    this._guideAcc += frameDt;
    if (this._guideAcc < GUIDE_INTERVAL_S) return;
    this._guideAcc -= GUIDE_INTERVAL_S;
    if (this._guideAcc > GUIDE_INTERVAL_S) this._guideAcc = 0;
    if (this._skipGuideOnce) {
      this._skipGuideOnce = false;
      return;
    }

    if (DEV && this._finale !== null && this._finale.state !== 'idle') {
      // Structurally unreachable (gated above, same frame) — keep it loud.
      throw new Error('[onboarding] GOAL_GUIDE collision: finale not idle while parts guide active');
    }

    const wp = WAYPOINTS[this._wpIndex];
    this._emitGuide(wp.x / ws, 0, wp.z / ws, true);
  }

  /** One final {active:false, kind:'goal'} (only if we ever showed the arrow). */
  _finish() {
    if (this._everEmitted) {
      // Restore kind:'goal' on the SHARED payload so every later finale emit
      // (which never writes kind) reads as the tower guide again.
      this._emitGuide(0, 0, 0, false);
    }
    this._done = true;
  }

  /**
   * Project a sim-space point through the render camera into 0..1 screen
   * coords and emit EVT.GOAL_GUIDE (copied from finale._projectAndEmitGuide
   * — behind-camera points mirrored so the edge arrow points the short way).
   * @param {number} sx @param {number} sy @param {number} sz Sim coords.
   * @param {boolean} active False = the one retirement emit.
   */
  _emitGuide(sx, sy, sz, active) {
    const cam = this._camera;
    _v3.set(sx, sy, sz).applyMatrix4(cam.matrixWorldInverse);
    const behind = _v3.z >= 0; // camera looks down -Z in view space
    _v3.applyMatrix4(cam.projectionMatrix); // perspective divide included
    let nx = _v3.x;
    let ny = _v3.y;
    if (behind) {
      nx = -nx;
      ny = -ny;
    }
    const p = PAYLOADS.goalGuide;
    p.x01 = clamp01((nx + 1) * 0.5);
    p.y01 = clamp01((1 - ny) * 0.5); // 0 = top
    p.onScreen = !behind && nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
    p.active = active;
    p.kind = active ? 'parts' : 'goal'; // hud glyph/toast switch (v5)
    this._bus.emit(EVT.GOAL_GUIDE, p);
    if (active) this._everEmitted = true;
  }
}
