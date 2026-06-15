/**
 * @file goalTower.js — GoalMonumentView: the pack-driven goal monument mesh
 * for the v3 finale (docs/DESIGN-V3.md 箱庭東京マップ C / ファイル変更一覧,
 * Stream A).
 *
 * P6a: re-pointed to activePack.goalMonument so the active pack (Taipei)
 * drives the geometry (台北101 eight-segment bamboo tower) and world position.
 * The public API — SkytreeView class name, getPosSim/radiusSim/heightSim/
 * silFade01/meshActive/setGlow01/setBeamPulse/update/dispose/onTeleport —
 * is UNCHANGED so game/finale.js and main.js call sites need no edits.
 *
 * Monument height: 台北101 = 508 m real (vs Skytree 634 m). The unit-sphere
 * normalized buildGeometry from the pack maps y∈[0,1] to physical height, so
 * MONUMENT_HEIGHT_M = 508 is used for the sim-space scale and heightSim.
 * baseRadiusM comes from activePack.goalMonument.baseRadiusM (72 m for 101).
 *
 * Everything else (handoff latch, crossfade, glow/beam, EVT subscriptions,
 * floating-origin tracking) is identical to the original Skytree version.
 *
 * Exactly 2 draw calls: merged vertex-colored body (self-lit Basic, fog:false)
 * + additive glow/beam (fog:false). Both are sky-element exemptions.
 *
 * Zero per-frame allocation: scratch vectors + uniform/scalar writes only.
 */

import * as THREE from 'three';
import { activePack } from '../packs/active.js'; // P2.5: simulation CONTENT seam

/* --- Pack-driven goal monument (P6a seam) -------------------------------- */
const _monument = activePack.goalMonument;
/** Goal monument real-meter position (from active pack, not hardcoded). */
const MONUMENT_POS = _monument.pos;
/** Goal monument height, REAL meters (台北101 = 508 m). */
export const MONUMENT_HEIGHT_M = 508;
/** @deprecated Legacy alias kept so any import of SKYTREE_HEIGHT_M still resolves. */
export const SKYTREE_HEIGHT_M = MONUMENT_HEIGHT_M;
/** Monument base radius, REAL meters (from pack; 72 m for 101). */
const MONUMENT_BASE_R_M = _monument.baseRadiusM;

import { SKY_SILHOUETTE_WS_MAX } from '../config/tuning.js';
import { bus, EVT } from '../core/events.js';
import { clamp01 } from '../core/mathUtils.js';

// Module-level scratch (zero per-frame allocation).
const _pos = new THREE.Vector3();

/* MONUMENT_POS shape guard: accept {x,z} or [x,z] so the contract cannot
 * silently misread regardless of pack authoring style. */
const SK_X = MONUMENT_POS.x !== undefined ? MONUMENT_POS.x : MONUMENT_POS[0];
const SK_Z = MONUMENT_POS.z !== undefined ? MONUMENT_POS.z : MONUMENT_POS[1];

/** Mesh-active distance: 0.8 * CAMERA_FAR (render/renderer.js, 4000 sim). */
const HANDOFF_DIST_SIM = 0.8 * 4000;
/** Release hysteresis (the boundary can never flicker). */
const HANDOFF_RELEASE_SIM = HANDOFF_DIST_SIM * 1.1;
/** Mesh <-> silhouette opacity crossfade duration (s) — v2 handoff pacing. */
const CROSSFADE_S = 2.0;
/** CALLED beam pulse frequency (Hz) and additive strengths. */
const BEAM_PULSE_HZ = 0.5;
const GLOW_OPACITY_K = 0.5; // glow shell opacity at setGlow01(1)
const BEAM_OPACITY_MAX = 0.55; // beam opacity at pulse peak
/** Glow beam color (teal-cyan, reads well on the 101 glass facade). */
const GLOW_COLOR = 0x68e8c8;

/**
 * Build the additive glow/beam composite for 台北101 (unit height, one draw
 * call): a vertical spire beam + tip-beacon halo + observation-floor glow ring.
 * Proportions tuned to 101's slender bamboo silhouette.
 * @returns {THREE.BufferGeometry}
 */
function buildGlowGeometry() {
  /** @type {THREE.BufferGeometry[]} */
  const geos = [];
  // Vertical beam: two crossed planes from the spire top (y≈1.52 in 101 geom)
  // rising into the sky.
  for (let i = 0; i < 2; i++) {
    const g = new THREE.PlaneGeometry(0.04, 0.8);
    g.rotateY(i * Math.PI * 0.5);
    g.translate(0, 1.52 + 0.4, 0);
    geos.push(g);
  }
  // Tip beacon: three crossed quads at the spire tip (y≈1.52).
  for (let i = 0; i < 3; i++) {
    const g = new THREE.PlaneGeometry(0.10, 0.10);
    g.rotateY((i / 3) * Math.PI);
    g.translate(0, 1.52, 0);
    geos.push(g);
  }
  // Observation-floor glow ring at the top bamboo segment (y≈0.85 unit).
  {
    const g = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 12, 1, true);
    g.translate(0, 0.85, 0);
    geos.push(g);
  }
  // Manual merge (positions only — glow material doesn't need normals/uvs).
  let total = 0;
  for (const g of geos) total += g.getAttribute('position').count;
  const pos = new Float32Array(total * 3);
  let o = 0;
  /** @type {number[]} */
  const index = [];
  let vBase = 0;
  for (const g of geos) {
    const p = g.getAttribute('position');
    pos.set(p.array, o);
    o += p.count * 3;
    const idx = g.getIndex();
    if (idx !== null) {
      for (let i = 0; i < idx.count; i++) index.push(vBase + idx.getX(i));
    }
    vBase += p.count;
    g.dispose();
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  merged.setIndex(index);
  return merged;
}

/**
 * The v3 goal monument. Construct once at boot; game/finale.js drives
 * update(dt, cameraPos) every frame (step 4.5) and reads
 * getPosSim/radiusSim/heightSim/silFade01. Subscribes EVT.RESCALE /
 * EVT.REBASE / EVT.GAME_RESET itself (rebase-shift tracking + handoff reset).
 */
export class SkytreeView {
  /**
   * @param {THREE.Scene} scene Scene to attach the tower group to.
   * @param {import('../world/scaleManager.js').ScaleManager} scaleMgr
   *   worldScale source (read LIVE every update — dev-teleport safe).
   */
  constructor(scene, scaleMgr) {
    this._scene = scene;
    this._scaleMgr = scaleMgr;

    /** Accumulated floating-origin shift (sim units; sim = real/ws - shift). */
    this._shiftX = 0;
    this._shiftZ = 0;

    /** Mesh takeover latch + 0..1 crossfade (0 = silhouette, 1 = mesh). */
    this._meshActive = false;
    this._fade01 = 0;

    /** Glow drive: base level (finale setGlow01) + CALLED beam pulse. */
    this._glow01 = 0;
    this._beamPulse = false;
    this._pulsePhase = 0;

    /* ---- draw 1: pack-driven monument geometry (台北101 bamboo tower) ---- */
    // buildGeometry(rng) from the pack; rng is unused by taipei101.js.
    this._geo = _monument.buildGeometry(null);
    /** @type {THREE.MeshBasicMaterial} fog:false sky-element exemption. */
    this._mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      fog: false,
      transparent: true, // crossfade opacity (depthWrite stays on)
      opacity: 0,
    });
    this._mesh = new THREE.Mesh(this._geo, this._mat);
    this._mesh.frustumCulled = false; // huge, always meant to be seen when active

    /* ---- draw 2: additive glow/beam composite ---- */
    this._glowGeo = buildGlowGeometry();
    /** @type {THREE.MeshBasicMaterial} */
    this._glowMat = new THREE.MeshBasicMaterial({
      color: GLOW_COLOR,
      fog: false,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this._glow = new THREE.Mesh(this._glowGeo, this._glowMat);
    this._glow.frustumCulled = false;

    /** @type {THREE.Group} Pose target (position + uniform height scale). */
    this.group = new THREE.Group();
    this.group.add(this._mesh);
    this.group.add(this._glow);
    this.group.visible = false; // silhouette-only until the handoff
    scene.add(this.group);

    bus.on(EVT.RESCALE, (p) => {
      this._shiftX *= p.S;
      this._shiftZ *= p.S;
    });
    bus.on(EVT.REBASE, (p) => {
      this._shiftX += p.sx;
      this._shiftZ += p.sz;
    });
    bus.on(EVT.GAME_RESET, () => {
      // World origin is rebuilt from scratch (scaleMgr.reset) — drop the
      // shift and return to the silhouette representation immediately.
      this._shiftX = 0;
      this._shiftZ = 0;
      this._meshActive = false;
      this._fade01 = 0;
      this._glow01 = 0;
      this._beamPulse = false;
      this._pulsePhase = 0;
      this.group.visible = false;
      this._mat.opacity = 0;
      this._glowMat.opacity = 0;
    });
  }

  /* ---------------------------------------------------------------- */
  /* Frozen public surface (docs/DESIGN-V3.md §インターフェース)         */
  /* ---------------------------------------------------------------- */

  /**
   * devTeleport hook (main.js, next to spawner.onTeleport / curated
   * forceScan): the teleport re-anchors the world with `pos = real / ws`
   * and origin 0 WITHOUT emitting RESCALE/REBASE, so the accumulated
   * rebase shift here is stale in the new frame (the tower rendered tens
   * of thousands of sim units off after a teleport). Drop the shift; the
   * handoff latch re-evaluates from the fresh pose on the next update.
   */
  onTeleport() {
    this._shiftX = 0;
    this._shiftZ = 0;
  }

  /**
   * Tower BASE CENTER in current sim units (y = 0; ground plane).
   * @param {THREE.Vector3} out Receives the position.
   * @returns {THREE.Vector3} The same out.
   */
  getPosSim(out) {
    const ws = this._scaleMgr.worldScale;
    out.set(SK_X / ws - this._shiftX, 0, SK_Z / ws - this._shiftZ);
    return out;
  }

  /** Monument BASE radius in current sim units (finale contact + guide math). */
  get radiusSim() {
    return MONUMENT_BASE_R_M / this._scaleMgr.worldScale;
  }

  /** Monument height in current sim units (guide arrow aims at the upper tower). */
  get heightSim() {
    return MONUMENT_HEIGHT_M / this._scaleMgr.worldScale;
  }

  /**
   * Base glow level 0..1 (finale: ramps through APPROACH, pops at MERGE,
   * breathes in AFTERGLOW).
   * @param {number} k
   */
  setGlow01(k) {
    this._glow01 = clamp01(k);
  }

  /**
   * CALLED-state beacon: toggle the 0.5 Hz beam pulse (cosine ramp from 0 —
   * never snaps).
   * @param {boolean} on
   */
  setBeamPulse(on) {
    if (on && !this._beamPulse) this._pulsePhase = 0;
    this._beamPulse = on;
  }

  /**
   * Sky-silhouette weight 0..1 for environment.setGoalSilFade — exactly
   * (1 - mesh crossfade). The finale forwards this every frame, mirroring
   * the v2 sky-fade drive.
   * @returns {number}
   */
  get silFade01() {
    return 1 - this._fade01;
  }

  /** True once the mesh representation owns the tower (post-handoff latch). */
  get meshActive() {
    return this._meshActive;
  }

  /**
   * Per-frame drive (called by game/finale.js at step 4.5): derive the sim
   * pose from the LIVE worldScale, advance the silhouette<->mesh handoff
   * latch + crossfade, and animate the glow/beam.
   * @param {number} dt Render-frame delta (s).
   * @param {THREE.Vector3} cameraPos Render camera position (sim units).
   */
  update(dt, cameraPos) {
    const ws = this._scaleMgr.worldScale;
    this.getPosSim(_pos);

    // Handoff latch (10% release hysteresis; ws gate per SKY_SILHOUETTE_WS_MAX
    // — below it the env silhouette is the SOLE representation).
    const dx = _pos.x - cameraPos.x;
    const dz = _pos.z - cameraPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (!this._meshActive) {
      if (ws >= SKY_SILHOUETTE_WS_MAX && dist < HANDOFF_DIST_SIM) this._meshActive = true;
    } else if (ws < SKY_SILHOUETTE_WS_MAX || dist > HANDOFF_RELEASE_SIM) {
      this._meshActive = false;
    }

    // Crossfade toward the latch (v2 handoff pacing: 2 s, linear like the
    // v2 sky-fade drive).
    const target = this._meshActive ? 1 : 0;
    if (this._fade01 !== target) {
      const step = dt / CROSSFADE_S;
      this._fade01 = target > this._fade01
        ? Math.min(target, this._fade01 + step)
        : Math.max(target, this._fade01 - step);
    }

    // Pose: fixed real-meter footprint, unit-height geometry scaled to sim.
    const h = MONUMENT_HEIGHT_M / ws;
    this.group.position.set(_pos.x, 0, _pos.z);
    this.group.scale.setScalar(h);

    // Glow/beam: base glow shell + CALLED 0.5 Hz pulse (cosine ramp).
    let pulse = 0;
    if (this._beamPulse) {
      this._pulsePhase += dt;
      pulse = 0.5 * (1 - Math.cos(Math.PI * 2 * BEAM_PULSE_HZ * this._pulsePhase));
    }
    const vis = this._fade01 > 0;
    this.group.visible = vis;
    if (vis) {
      this._mat.opacity = this._fade01;
      this._glowMat.opacity =
        this._fade01 * (GLOW_OPACITY_K * this._glow01 + BEAM_OPACITY_MAX * pulse);
      this._glow.visible = this._glowMat.opacity > 0.004;
    }
  }

  /** Remove from the scene and free GPU resources (teardown / tests). */
  dispose() {
    this._scene.remove(this.group);
    this._geo.dispose();
    this._mat.dispose();
    this._glowGeo.dispose();
    this._glowMat.dispose();
  }
}

/* DEV sanity: the budgeted tri count (<= 600 for 台北101, same HERO_TRI_CAP
 * bound) is asserted by the Stream A headless smoke test (scripts side), not
 * at boot — geometry is built once and the count is deterministic. */
