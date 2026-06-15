/**
 * @file finale.js — The v3 東京スカイツリー finale state machine (Stream A
 * re-theme of the v2 production; the goal monument is FIXED in the world, so
 * the v2 descent/landing math is DELETED).
 *
 * States: idle -> called -> approach -> contact -> merge -> ascension ->
 *         afterglow -> done
 *
 *  - IDLE/CALLED: threshold watches on trueRadius (GOAL_CALL_RADIUS_M 380 /
 *    GOAL_RADIUS_M 420). CALLED is pure cosmetics (EVT.GOAL_CALL toast
 *    「スカイツリーが呼んでいる…！」, skytree beam pulse, bgm swell, sfx pad).
 *  - APPROACH (trueRadius >= GOAL_RADIUS_M): contact is ARMED. Gameplay stays
 *    FULLY live (steer/absorb/bounce — the tower's permanent base collider in
 *    world/terrain.js keeps the ball honest at SKYTREE_COLLIDER_K 0.6 < the
 *    0.85 contact pad, so rolling in always reaches contact first).
 *    EVT.GOAL_GUIDE at 10 Hz drives the HUD #goal-arrow toward the upper
 *    tower. Render-frame contact test:
 *      distXZ(ball, towerAxis) <= ballR + towerBaseR * GOAL_CONTACT_PAD.
 *  - CONTACT (clear-time instant, once): EVT.GOAL_GUIDE {active:false} +
 *    EVT.GOAL_CONTACT; inputLocked/cameraOwned latch true (main gates
 *    intent/absorb/spawner/curated/maybeRebase and skips cameraRig.update);
 *    cameraRig.beginCinematic().
 *  - MERGE: finale writes ball.pos (lerp into the glowing tower axis); ball
 *    view hidden at t >= 0.6 s; tower glow flash across the merge.
 *  - ASCENSION (v5: the LIFTOFF): the (hidden) anchor point rises ease-in to
 *    ascendBaseY + GOAL_ASCEND_HEIGHT_K * r; env.beginNightFade(GOAL_ASCEND_S)
 *    + effects.ascensionBurst() golden fountain ride the anchor (ball.pos is
 *    parked on it). v5 space-earth ending: earthView.show() at entry, then per
 *    frame u drives env.setSpaceFade01(u) (sky zenith -> space black), the
 *    EarthView fade/parallax-sink (glowing night globe below) and the camera
 *    pullback ramp (CINE_BACK_K 14->30, CINE_UP_K 4->8, look biasing down for
 *    u > 0.5) — leaving Earth instead of merely rising over night Tokyo.
 *  - AFTERGLOW: tower glow breathing over the twinkling globe (earthView
 *    stays, spaceFade held 1), then state = 'done' — main.js (the SOLE
 *    'game:win' emitter) fires EVT.GAME_WIN.
 *
 * SILHOUETTE -> MESH HANDOFF (BLOCKER 2): finale.update drives
 * skytree.update(dt, cameraPos) every frame and forwards
 * env.setGoalSilFade(skytree.silFade01) — the env sky-dome silhouette and
 * the goalTower mesh crossfade with the kept v2 handoff pacing (the two
 * representations are angle-matched by construction: both derive from the
 * same SKYTREE_POS real-meter pose).
 *
 * RESCALE/REBASE SAFETY (binding): _simCache is THE exhaustive list of
 * rescale/rebase-sensitive finale state — finale subscribes EVT.RESCALE
 * (every field *= S) and EVT.REBASE (every X/Z field -= sx/sz) itself.
 * towerX/towerZ/towerR are additionally REFRESHED from SkytreeView every
 * pre-contact frame (SkytreeView derives them from the live worldScale, so a
 * mid-APPROACH rescale or teleport-rebase stays pixel-identical either way);
 * post-contact no rescale/rebase can fire (growth frozen, maybeRebase gated)
 * and the cached fields carry the cinematic. ANY new finale state field MUST
 * be added to _simCache or be derived per-frame (DESIGN-V2.md リスク, kept).
 *
 * Camera: from CONTACT the finale derives camPosTarget/lookTarget/fovTarget
 * per frame (pure functions of the anchor pose + frozen ball radius — zero
 * cached camera state) and drives cameraRig.cinematicUpdate.
 *
 * Zero per-frame allocation: module scratch vectors, reused PAYLOADS.
 */

import * as THREE from 'three';
import { EVT, PAYLOADS } from '../core/events.js';
import { clamp01, easeInOutCubic } from '../core/mathUtils.js';
import {
  AFTERGLOW_S,
  FOV_BASE,
  GOAL_ASCEND_HEIGHT_K,
  GOAL_ASCEND_S,
  GOAL_CALL_RADIUS_M,
  GOAL_CONTACT_PAD,
  GOAL_MERGE_S,
  GOAL_RADIUS_M,
} from '../config/tuning.js';

/** @typedef {import('../types.js').BallState} BallState */

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/* ---- finale-local cosmetic tunables (not in tuning.js) -------------- */
/** EVT.GOAL_GUIDE emission interval (10Hz). */
const GUIDE_INTERVAL_S = 0.1;
/** Guide arrow aims at this fraction of the tower height (upper tower). */
const GUIDE_HEIGHT_FRAC = 0.55;
/** Ball view hidden this far into MERGE (s). */
const BALL_HIDE_AT_S = 0.6;
/** Cinematic shot: camPos = anchor + back*BACK_K*r + up*UP_K*r; FOV 60 -> 52. */
const CINE_BACK_K = 14;
const CINE_UP_K = 4;
const CINE_FOV_END = 52;
/* ---- v5 space-earth liftoff (ASCENSION reads as leaving the planet) ----
 * Over ascension u the pullback/raise ramp CINE_BACK_K -> CINE_BACK_END_K and
 * CINE_UP_K -> CINE_UP_END_K (eased), and for u > 0.5 the look target biases
 * down toward anchor - (0, CINE_LOOK_DOWN_K * r, 0) so the EarthView globe
 * fills the lower frame while the sparkle column keeps rising at center.
 * All dimensionless multiples of the frozen post-contact r — rescale-moot. */
const CINE_BACK_END_K = 30;
const CINE_UP_END_K = 8;
const CINE_LOOK_DOWN_K = 6;
/** APPROACH tower glow breathing (base level + amp, Hz). */
const APPROACH_GLOW_BASE = 0.45;
const APPROACH_GLOW_AMP = 0.15;
const GLOW_BREATH_HZ = 0.5;
/** skipCinematic() time multiplier — MERGE+ASCENSION+AFTERGLOW
 *  (GOAL_MERGE_S + GOAL_ASCEND_S + AFTERGLOW_S) compress by 5x (~2.1 s at
 *  the v5 timings). A fast-forward, not a hard cut: every phase still runs
 *  (night fade, space fade, earth reveal, ball hide, GAME_WIN emission order
 *  all preserved). */
const SKIP_TIME_SCALE = 5;

const TWO_PI = Math.PI * 2;

// Module-level scratch (zero per-frame allocation).
const _v3a = new THREE.Vector3();
const _v3b = new THREE.Vector3();

/**
 * Skytree-ending state machine. Construct once at boot; main.js calls
 * update(frameDt, ballPhys.state) at frame-order step 4.5 and reset() inside
 * resetWorld(). Subscribes EVT.RESCALE / EVT.REBASE itself (for _simCache).
 */
export class Finale {
  /**
   * @param {import('../core/events.js').EventBus} bus Shared event bus.
   * @param {import('../world/scaleManager.js').ScaleManager} scaleMgr worldScale/tierIndex source.
   * @param {import('../render/goalTower.js').SkytreeView} goalView The goal
   *   monument (v3: takes the v2 goal-view slot in the frozen 7-arg shape).
   * @param {object} env Environment — setGoalSilFade/beginNightFade
   *   (typeof-guarded for bring-up).
   * @param {import('../render/cameraRig.js').CameraRig} cameraRig Camera rig
   *   (cinematic drive from CONTACT).
   * @param {object} ballView render/ball.js Ball — setVisible(b).
   * @param {THREE.PerspectiveCamera} camera Render camera (NDC projection for
   *   GOAL_GUIDE + skytree handoff distance; matrixWorldInverse freshness =
   *   last render, which is fine for a 10Hz guide).
   * @param {object} [effects] render/effects.js Effects — ascensionBurst()
   *   (optional; also injectable later via setEffects).
   */
  constructor(bus, scaleMgr, goalView, env, cameraRig, ballView, camera, effects = null) {
    this._bus = bus;
    this._scaleMgr = scaleMgr;
    this._goalView = goalView;
    this._env = env;
    this._cameraRig = cameraRig;
    this._ballView = ballView;
    this._camera = camera;
    this._effects = effects;
    /** v5 space-earth view (render/earthView.js) — injected via setEarthView
     *  (the 7-arg constructor shape is frozen; setEffects precedent).
     *  @type {object|null} */
    this._earthView = null;

    /** @type {'idle'|'called'|'approach'|'contact'|'merge'|'ascension'|'afterglow'|'done'} */
    this._state = 'idle';
    this._inputLocked = false;
    this._cameraOwned = false;

    /**
     * THE exhaustive list of rescale/rebase-sensitive finale state
     * (docs/DESIGN-V3.md ファイル変更一覧 — binding). EVT.RESCALE: every
     * field *= S. EVT.REBASE: every X/Z field -= sx/sz. Nothing else in the
     * finale caches sim-space numbers; all poses/targets are derived per
     * frame from here (towerX/Z/R additionally refreshed from SkytreeView
     * every pre-contact frame).
     */
    this._simCache = {
      towerX: 0, towerZ: 0, // tower axis (base center)
      towerR: 0, // tower base radius (sim units)
      mergeFromX: 0, mergeFromY: 0, mergeFromZ: 0, // ball pos at merge start
      ascendBaseY: 0, // anchor y at ascension start (= ball y at contact)
    };

    /** @type {number} Clock within the current phase (s). */
    this._phaseT = 0;
    /** @type {number} Clock since CONTACT (cinematic FOV ease). */
    this._cineT = 0;
    /** @type {number} GOAL_GUIDE 10Hz accumulator. */
    this._guideAcc = 0;
    /** @type {boolean} Ball view hidden during MERGE. */
    this._ballHidden = false;
    /** @type {boolean} DEV: missing-env-API warning emitted once. */
    this._warnedEnv = false;
    /** @type {boolean} A rescale/rebase fired this frame — the camera's
     * matrixWorldInverse is still pre-transform (render is step 7), so one
     * 10Hz guide projection is skipped instead of flashing a wrong arrow. */
    this._skipGuideOnce = false;
    /** @type {number} Post-contact cinematic time multiplier (1 = normal;
     * skipCinematic() sets SKIP_TIME_SCALE — replayers fast-forward). */
    this._timeScale = 1;
    /** @type {number} Last forwarded env silhouette fade (skip no-op calls). */
    this._lastSilFade = -1;
    /** @type {number} v5 liftoff progress 0..1 (ASCENSION u; 1 in AFTERGLOW).
     * DIMENSIONLESS — needs no _simCache entry (the rescale/rebase law covers
     * sim-space lengths only; this is a pure phase fraction). */
    this._liftU = 0;

    // Current cinematic anchor — DERIVED, rewritten every post-contact frame
    // BEFORE any consumer (cinematic targets) reads it, so it needs no
    // rescale/rebase handling of its own. Pre-contact the guide projects the
    // tower itself (see _updateApproach).
    this._anchorX = 0;
    this._anchorY = 0;
    this._anchorZ = 0;

    bus.on(EVT.RESCALE, (p) => {
      const S = p.S;
      const c = this._simCache;
      c.towerX *= S; c.towerZ *= S;
      c.towerR *= S;
      c.mergeFromX *= S; c.mergeFromY *= S; c.mergeFromZ *= S;
      c.ascendBaseY *= S;
      this._skipGuideOnce = true; // camera matrix is stale this frame
    });
    bus.on(EVT.REBASE, (p) => {
      const c = this._simCache;
      c.towerX -= p.sx; c.towerZ -= p.sz;
      c.mergeFromX -= p.sx; c.mergeFromZ -= p.sz;
      this._skipGuideOnce = true; // camera matrix is stale this frame
    });
  }

  /* ---------------------------------------------------------------- */
  /* Public surface (frozen interface)                                 */
  /* ---------------------------------------------------------------- */

  /** @returns {'idle'|'called'|'approach'|'contact'|'merge'|'ascension'|'afterglow'|'done'} */
  get state() {
    return this._state;
  }

  /** True from CONTACT — main gates intent/absorb/spawner/curated/maybeRebase. */
  get inputLocked() {
    return this._inputLocked;
  }

  /** True from CONTACT — main skips cameraRig.update (finale drives cinematicUpdate). */
  get cameraOwned() {
    return this._cameraOwned;
  }

  /**
   * Late wiring hook for render/effects.js (ascensionBurst) — the 7-arg
   * constructor shape is frozen, so the integrator may inject effects here
   * instead of as the optional 8th argument.
   * @param {object} effects
   */
  setEffects(effects) {
    this._effects = effects;
  }

  /**
   * v5 late wiring hook for render/earthView.js (the space-earth ending) —
   * same precedent as setEffects: the frozen 7-arg constructor survives and
   * the integrator injects the view after construction. Optional: without it
   * the finale degrades to the v4 night-sky ending (every call is guarded).
   * @param {object} earthView render/earthView.js EarthView.
   */
  setEarthView(earthView) {
    this._earthView = earthView;
  }

  /**
   * Replay-friction fix (kept from v2): fast-forward the post-contact
   * cinematic (MERGE/ASCENSION/AFTERGLOW run at SKIP_TIME_SCALE). main.js
   * calls this on any pointerdown/keydown while in the FINALE state. A no-op
   * pre-contact — the approach is live gameplay and must never accelerate.
   * Idempotent.
   */
  skipCinematic() {
    if (!this._inputLocked || this._state === 'done') return;
    this._timeScale = SKIP_TIME_SCALE;
  }

  /**
   * Per-frame finale drive (main.js frame-order step 4.5, AFTER
   * scaleMgr.maybeTierUp/maybeRebase so _simCache and BallState agree).
   * Also the per-frame driver of the SkytreeView handoff (every state).
   * @param {number} frameDt Render-frame delta (s).
   * @param {BallState} ball Single source of ball truth (pos written
   *   directly during MERGE..AFTERGLOW).
   */
  update(frameDt, ball) {
    const tr = ball.radiusSim * this._scaleMgr.worldScale;
    // Post-contact fast-forward (skipCinematic). Pre-contact phases always
    // run at 1x — _timeScale only ever rises after inputLocked latches.
    const cineDt = frameDt * this._timeScale;

    // ---- skytree handoff drive (every frame, every state) -----------------
    // The mesh<->silhouette crossfade is gameplay-wide (not finale-gated):
    // SkytreeView owns the latch; we forward its silhouette weight to the
    // environment sky shader (mirrors the v2 sky-fade drive).
    this._goalView.update(frameDt, this._camera.position);
    const sil = this._goalView.silFade01;
    if (sil !== this._lastSilFade) {
      this._lastSilFade = sil;
      this._envCall('setGoalSilFade', sil);
    }

    // ---- threshold ladder (both may fire in one frame, e.g. ?at=goal) -----
    if (this._state === 'idle' && tr >= GOAL_CALL_RADIUS_M) this._enterCalled(tr);
    if (this._state === 'called' && tr >= GOAL_RADIUS_M) this._beginApproach();

    // DEV watchdog: the finale is the ONLY end-of-game path — if the run grew
    // past 1.2x goal while still pre-approach, something ate the trigger.
    if (
      DEV &&
      (this._state === 'idle' || this._state === 'called') &&
      tr > 1.2 * GOAL_RADIUS_M
    ) {
      console.error(
        `[finale] watchdog: trueRadius ${tr.toFixed(1)}m > 1.2x goal while '${this._state}' — forcing APPROACH`
      );
      if (this._state === 'idle') this._enterCalled(tr);
      this._beginApproach();
    }

    switch (this._state) {
      case 'approach':
        this._updateApproach(frameDt, ball);
        break;
      case 'contact': // one observable frame, then the merge begins
        this._state = 'merge';
        this._phaseT = 0;
        this._updateMerge(cineDt, ball);
        break;
      case 'merge':
        this._updateMerge(cineDt, ball);
        break;
      case 'ascension':
        this._updateAscension(cineDt, ball);
        break;
      case 'afterglow':
        this._updateAfterglow(cineDt, ball);
        break;
      default:
        break; // idle / called / done
    }

    // From CONTACT: derive cinematic camera targets per frame (pure function
    // of current anchor pose + frozen ball radius => rescale-safe, zero
    // cached camera state) and drive the rig springs.
    if (this._cameraOwned) this._driveCinematic(frameDt, ball);
  }

  /**
   * Back to a fresh run (called directly by main.resetWorld — frozen reset
   * ownership; ball visibility is restored by ball.reset(), camera latch by
   * cameraRig.reset() on GAME_RESET, SkytreeView handoff/shift by its own
   * GAME_RESET handler, env uGoalSil/night fade by setTierPaletteImmediate).
   */
  reset() {
    this._state = 'idle';
    this._inputLocked = false;
    this._cameraOwned = false;
    this._phaseT = 0;
    this._cineT = 0;
    this._guideAcc = 0;
    this._ballHidden = false;
    this._skipGuideOnce = false;
    this._timeScale = 1;
    this._lastSilFade = -1; // re-forward on the first update
    this._liftU = 0;
    // v5: hide the space-earth view (env uSpaceFade is cleared by
    // setTierPaletteImmediate on GAME_RESET — env's own reset ownership).
    if (this._earthView !== null && typeof this._earthView.hide === 'function') {
      this._earthView.hide();
    }
    const c = this._simCache;
    c.towerX = 0; c.towerZ = 0;
    c.towerR = 0;
    c.mergeFromX = 0; c.mergeFromY = 0; c.mergeFromZ = 0;
    c.ascendBaseY = 0;
    this._anchorX = 0; this._anchorY = 0; this._anchorZ = 0;
    this._goalView.setGlow01(0);
    this._goalView.setBeamPulse(false);
    // Belt-and-suspenders: cameraRig.reset() (GAME_RESET) clears this too.
    if (this._cameraRig && typeof this._cameraRig.endCinematic === 'function') {
      this._cameraRig.endCinematic();
    }
  }

  /* ---------------------------------------------------------------- */
  /* Phase transitions                                                 */
  /* ---------------------------------------------------------------- */

  /** @param {number} tr Current trueRadius (m). */
  _enterCalled(tr) {
    this._state = 'called';
    PAYLOADS.goalCall.trueRadius = tr;
    this._bus.emit(EVT.GOAL_CALL, PAYLOADS.goalCall);
    this._goalView.setBeamPulse(true); // 0.5Hz beacon — 「スカイツリーが呼んでいる…！」
  }

  /** APPROACH start: arm the contact test + the 10Hz guide arrow. */
  _beginApproach() {
    this._state = 'approach';
    this._phaseT = 0;
    this._guideAcc = GUIDE_INTERVAL_S; // first guide emits immediately
    this._skipGuideOnce = false; // any pre-approach staleness flag is moot
    this._refreshTowerCache();
  }

  /**
   * CONTACT: the clear-time instant. Latches input/camera ownership, records
   * mergeFrom, emits the guide-off + GOAL_CONTACT pair.
   * @param {BallState} ball
   */
  _onContact(ball) {
    this._state = 'contact';
    this._phaseT = 0;
    this._cineT = 0;
    this._inputLocked = true;
    this._cameraOwned = true;
    const c = this._simCache;
    c.mergeFromX = ball.pos.x;
    c.mergeFromY = ball.pos.y;
    c.mergeFromZ = ball.pos.z;
    c.ascendBaseY = ball.pos.y;
    this._ballHidden = false;
    this._goalView.setBeamPulse(false);
    this._goalView.setGlow01(1); // contact flash on the monument

    // Hide the HUD arrow first, then announce the clear (subscribers: runStats
    // freeze+GOAL, bgm duck->stop, sfx fanfare, hud hide, screens flash;
    // #donack-root survives — it lives outside #hud).
    this._setGuidePoint(c.towerX, this._goalView.heightSim * GUIDE_HEIGHT_FRAC, c.towerZ);
    this._projectAndEmitGuide(false);
    this._bus.emit(EVT.GOAL_CONTACT, PAYLOADS.goalContact);

    // Seed the cinematic anchor at the ball so the same-frame cinematic
    // drive continues from the gameplay shot (no 1-frame target hop).
    this._setAnchor(ball.pos.x, ball.pos.y, ball.pos.z);

    if (this._cameraRig && typeof this._cameraRig.beginCinematic === 'function') {
      this._cameraRig.beginCinematic();
    } else if (DEV) {
      console.warn('[finale] cameraRig.beginCinematic() missing');
    }
  }

  /* ---------------------------------------------------------------- */
  /* Phase updates                                                     */
  /* ---------------------------------------------------------------- */

  /** @param {number} dt @param {BallState} ball */
  _updateApproach(dt, ball) {
    this._phaseT += dt;
    const c = this._simCache;
    const r = ball.radiusSim;

    // Refresh the tower cache from the live SkytreeView pose every pre-contact
    // frame (derived => exactly right on the frame a rescale/rebase or dev
    // teleport rewrote the world; the _simCache handlers cover post-contact).
    this._refreshTowerCache();

    // Monument glow breathes while armed (ramps in over the first 1.5 s).
    this._goalView.setGlow01(
      (APPROACH_GLOW_BASE + APPROACH_GLOW_AMP * Math.sin(TWO_PI * GLOW_BREATH_HZ * this._phaseT)) *
        clamp01(this._phaseT / 1.5)
    );

    // 10Hz guide arrow toward the upper tower.
    this._setGuidePoint(c.towerX, this._goalView.heightSim * GUIDE_HEIGHT_FRAC, c.towerZ);
    this._updateGuide(dt);

    // Render-frame contact test (XZ vs the tower AXIS — the tower is a
    // vertical monument; the terrain base collider at SKYTREE_COLLIDER_K 0.6
    // < GOAL_CONTACT_PAD 0.85 guarantees contact wins before any bounce):
    //   distXZ <= ballR + towerBaseR * PAD.
    const dx = c.towerX - ball.pos.x;
    const dz = c.towerZ - ball.pos.z;
    const reach = r + c.towerR * GOAL_CONTACT_PAD;
    if (dx * dx + dz * dz <= reach * reach) {
      this._onContact(ball);
    }
  }

  /** @param {number} dt @param {BallState} ball */
  _updateMerge(dt, ball) {
    this._phaseT += dt;
    this._cineT += dt;
    const c = this._simCache;

    // Finale owns ball.pos now (intent is zeroed by main, so nothing fights):
    // lerp into the tower axis at contact height — the ball sinks into the
    // glowing monument.
    const t01 = clamp01(this._phaseT / GOAL_MERGE_S);
    const e = easeInOutCubic(t01);
    ball.pos.x = c.mergeFromX + (c.towerX - c.mergeFromX) * e;
    ball.pos.y = c.mergeFromY;
    ball.pos.z = c.mergeFromZ + (c.towerZ - c.mergeFromZ) * e;
    ball.vel.set(0, 0, 0);
    this._setAnchor(ball.pos.x, ball.pos.y, ball.pos.z);

    if (!this._ballHidden && this._phaseT >= BALL_HIDE_AT_S) {
      this._ballHidden = true;
      if (this._ballView && typeof this._ballView.setVisible === 'function') {
        this._ballView.setVisible(false); // restored by ball.reset()
      } else if (DEV) {
        console.warn('[finale] ballView.setVisible(b) missing (Stream C)');
      }
    }

    // Swallow flash: monument glow swells and settles across the merge.
    this._goalView.setGlow01(0.6 + 0.4 * Math.sin(Math.PI * t01));

    if (this._phaseT >= GOAL_MERGE_S) {
      this._state = 'ascension';
      this._phaseT = 0;
      this._envCall('beginNightFade', GOAL_ASCEND_S); // dusk -> NIGHT palette
      if (this._effects && typeof this._effects.ascensionBurst === 'function') {
        this._effects.ascensionBurst(); // golden sparkle fountain
      }
      // v5 SPACE-EARTH: reveal the globe + star shell (faded in over u by
      // _driveEarth) — the liftoff reading of the same ascension timings.
      if (this._earthView !== null && typeof this._earthView.show === 'function') {
        this._earthView.show();
        this._driveEarth(0, ball.pos.x, ball.pos.y, ball.pos.z, ball.radiusSim);
      }
    }
  }

  /** @param {number} dt @param {BallState} ball */
  _updateAscension(dt, ball) {
    this._phaseT += dt;
    this._cineT += dt;
    const c = this._simCache;
    const r = ball.radiusSim;

    // The (hidden) anchor rises ease-in above the tower; the camera pullback
    // (below) reveals the night diorama. ball.pos is parked on the anchor so
    // position-anchored systems (effects fountain, blob shadow) ride the
    // ascent — v2 machinery verbatim, minus the monument motion.
    const u = clamp01(this._phaseT / GOAL_ASCEND_S);
    const ay = c.ascendBaseY + GOAL_ASCEND_HEIGHT_K * r * u * u; // ease-in rise
    this._goalView.setGlow01(0.7);
    this._setAnchor(c.towerX, ay, c.towerZ);

    ball.pos.x = c.towerX;
    ball.pos.y = ay;
    ball.pos.z = c.towerZ;
    ball.vel.set(0, 0, 0);

    // v5 liftoff: u drives the camera ramp (_driveCinematic), the sky's
    // space darkening, and the EarthView fade/sink — all continuous in u.
    this._liftU = u;
    this._envCall('setSpaceFade01', u);
    this._driveEarth(u, c.towerX, ay, c.towerZ, r);

    if (this._phaseT >= GOAL_ASCEND_S) {
      this._state = 'afterglow';
      this._phaseT = 0;
    }
  }

  /** @param {number} dt @param {BallState} ball */
  _updateAfterglow(dt, ball) {
    this._phaseT += dt;
    this._cineT += dt;
    const c = this._simCache;
    const r = ball.radiusSim;

    const ay = c.ascendBaseY + GOAL_ASCEND_HEIGHT_K * r; // hangs over the Earth
    this._goalView.setGlow01(0.55 + 0.25 * Math.sin(TWO_PI * GLOW_BREATH_HZ * this._phaseT));
    this._setAnchor(c.towerX, ay, c.towerZ);

    ball.pos.x = c.towerX;
    ball.pos.y = ay;
    ball.pos.z = c.towerZ;
    ball.vel.set(0, 0, 0);

    // v5: the EarthView stays (twinkling globe below the breathing glow).
    this._liftU = 1;
    this._envCall('setSpaceFade01', 1);
    this._driveEarth(1, c.towerX, ay, c.towerZ, r);

    if (this._phaseT >= AFTERGLOW_S) {
      this._state = 'done'; // main emits EVT.GAME_WIN (sole emitter)
    }
  }

  /* ---------------------------------------------------------------- */
  /* Per-frame derived helpers                                         */
  /* ---------------------------------------------------------------- */

  /** Refresh _simCache.towerX/Z/R from the live SkytreeView pose. */
  _refreshTowerCache() {
    const c = this._simCache;
    this._goalView.getPosSim(_v3a);
    c.towerX = _v3a.x;
    c.towerZ = _v3a.z;
    c.towerR = this._goalView.radiusSim;
  }

  /**
   * Write the current cinematic anchor (derived state).
   * @param {number} x @param {number} y @param {number} z
   */
  _setAnchor(x, y, z) {
    this._anchorX = x;
    this._anchorY = y;
    this._anchorZ = z;
  }

  /**
   * Set the guide projection point (also reuses the anchor slot — the guide
   * and the cinematic never run in the same state).
   * @param {number} x @param {number} y @param {number} z
   */
  _setGuidePoint(x, y, z) {
    this._setAnchor(x, y, z);
  }

  /**
   * 10Hz GOAL_GUIDE throttle (APPROACH).
   * @param {number} dt
   */
  _updateGuide(dt) {
    this._guideAcc += dt;
    if (this._guideAcc < GUIDE_INTERVAL_S) return;
    this._guideAcc -= GUIDE_INTERVAL_S;
    if (this._guideAcc > GUIDE_INTERVAL_S) this._guideAcc = 0; // no catch-up burst after hitches
    if (this._skipGuideOnce) {
      // A rescale/rebase rewrote _simCache this frame but the camera's
      // matrixWorldInverse is still last frame's (pre-transform) — projecting
      // NEW-space coords through the OLD-space matrix would snap the arrow
      // wildly for 100 ms. Skip this tick; the next one is consistent.
      this._skipGuideOnce = false;
      return;
    }
    this._projectAndEmitGuide(true);
  }

  /**
   * Project the guide point (upper tower) through the render camera into
   * 0..1 screen coords and emit EVT.GOAL_GUIDE. Behind-camera points are
   * mirrored so the HUD edge arrow still points the shorter way around.
   * @param {boolean} active False = the one final hide on CONTACT.
   */
  _projectAndEmitGuide(active) {
    const cam = this._camera;
    _v3a.set(this._anchorX, this._anchorY, this._anchorZ).applyMatrix4(cam.matrixWorldInverse);
    const behind = _v3a.z >= 0; // camera looks down -Z in view space
    _v3a.applyMatrix4(cam.projectionMatrix); // perspective divide included
    let nx = _v3a.x;
    let ny = _v3a.y;
    if (behind) {
      nx = -nx;
      ny = -ny;
    }
    const p = PAYLOADS.goalGuide;
    p.x01 = clamp01((nx + 1) * 0.5);
    p.y01 = clamp01((1 - ny) * 0.5); // 0 = top
    p.onScreen = !behind && nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
    p.active = active;
    this._bus.emit(EVT.GOAL_GUIDE, p);
  }

  /**
   * v5 — guarded EarthView drive (progress, pose, twinkle clock). One call
   * site per phase; every value is derived from the rescale-safe _simCache /
   * frozen ball radius, so the view needs no bus subscriptions of its own.
   * @param {number} u Liftoff progress 0..1.
   * @param {number} ax Anchor x (sim). @param {number} ay Anchor y (sim).
   * @param {number} az Anchor z (sim). @param {number} r Ball radius (sim).
   */
  _driveEarth(u, ax, ay, az, r) {
    const v = this._earthView;
    if (v === null || typeof v.setAnchor !== 'function') return;
    v.setProgress01(u);
    v.setAnchor(ax, ay, az, r);
    v.setTime(this._cineT);
  }

  /**
   * Cinematic camera targets, derived fresh every frame: camPos = anchor +
   * back*backK*r + up*upK*r (back = horizontal tower->mergeFrom direction,
   * all from _simCache), look = anchor, FOV eases 60 -> 52 over
   * merge+ascension. v5 liftoff: backK ramps CINE_BACK_K -> CINE_BACK_END_K
   * and upK CINE_UP_K -> CINE_UP_END_K over eased _liftU, and for u > 0.5
   * the look target slides down toward anchor - (0, CINE_LOOK_DOWN_K*r, 0)
   * so the EarthView globe fills the lower frame — all continuous in u, and
   * the rig springs smooth the targets anyway.
   * @param {number} dt @param {BallState} ball
   */
  _driveCinematic(dt, ball) {
    const c = this._simCache;
    const r = ball.radiusSim;
    let bx = c.mergeFromX - c.towerX;
    let bz = c.mergeFromZ - c.towerZ;
    const bl = Math.sqrt(bx * bx + bz * bz);
    if (bl > 1e-6) {
      bx /= bl;
      bz /= bl;
    } else {
      bx = 0;
      bz = 1;
    }
    const lift = easeInOutCubic(this._liftU);
    const backK = CINE_BACK_K + (CINE_BACK_END_K - CINE_BACK_K) * lift;
    const upK = CINE_UP_K + (CINE_UP_END_K - CINE_UP_K) * lift;
    const lookDown =
      CINE_LOOK_DOWN_K * r * easeInOutCubic(clamp01((this._liftU - 0.5) * 2));
    _v3a.set(
      this._anchorX + bx * backK * r,
      this._anchorY + upK * r,
      this._anchorZ + bz * backK * r
    );
    _v3b.set(this._anchorX, this._anchorY - lookDown, this._anchorZ);
    const fovTarget =
      FOV_BASE +
      (CINE_FOV_END - FOV_BASE) *
        easeInOutCubic(clamp01(this._cineT / (GOAL_MERGE_S + GOAL_ASCEND_S)));
    if (this._cameraRig && typeof this._cameraRig.cinematicUpdate === 'function') {
      this._cameraRig.cinematicUpdate(dt, _v3a, _v3b, fovTarget);
    } else if (DEV) {
      console.warn('[finale] cameraRig.cinematicUpdate(...) missing');
    }
  }

  /**
   * Guarded env call (setGoalSilFade / beginNightFade) — no-op with one DEV
   * warn if the environment build predates the v3 API.
   * @param {string} method
   * @param {*} arg
   */
  _envCall(method, arg) {
    const env = this._env;
    if (env && typeof env[method] === 'function') {
      env[method](arg);
      return;
    }
    if (DEV && !this._warnedEnv) {
      this._warnedEnv = true;
      console.warn(`[finale] env.${method}(...) missing — finale continues without it`);
    }
  }
}
