/**
 * @file goalTower.js — SkytreeView: the 東京スカイツリー goal monument mesh
 * for the v3 finale (docs/DESIGN-V3.md 箱庭東京マップ C / ファイル変更一覧,
 * Stream A).
 *
 * 634 m tapered lattice + 2 observation decks, <= 1400 tris (documented
 * sky-element exception to the 350-tri archetype cap — same ledger entry as
 * the v2 sky body it replaces). Exactly 2 draw calls: the merged
 * vertex-colored lattice body (self-lit Basic — reads as the lit white tower
 * at dusk/night) + one additive glow/beam mesh (beacon halo + vertical beam
 * for the CALLED pulse). Both materials are fog:false — a DOCUMENTED
 * seamlessness-law exemption: the tower is a SKY ELEMENT (navigation anchor
 * visible across the whole map) like the v2 sky bodies, never world scenery.
 *
 * FIXED WORLD POSE: the tower stands at SKYTREE_POS (REAL meters, frozen in
 * config/cityMap.js) at 1:1 height. Sim pose is DERIVED per update as
 *   sim = real / scaleMgr.worldScale - rebaseShift
 * where rebaseShift is the accumulated floating-origin shift, self-tracked
 * via EVT.REBASE (shift += sx/sz), EVT.RESCALE (shift *= S) and
 * EVT.GAME_RESET (shift = 0). Reading worldScale LIVE (instead of caching
 * simX/simZ) makes the pose equally correct after a dev teleport's direct
 * worldScale snap (?at=goal&r=400) — mathematically identical to the
 * cached-_simCache form under RESCALE/REBASE, strictly more robust at boot.
 *
 * SILHOUETTE -> MESH HANDOFF (BLOCKER 2, kept v2 handoff math): below
 * SKY_SILHOUETTE_WS_MAX the tower is represented by environment.js's
 * sky-dome silhouette (uGoalSil*, azimuth/angular size computed from the
 * SAME real-meter pose — so the two representations are angle-matched by
 * construction, exactly like the v2 angular-size-matched sky handoff). The
 * MESH takes over at the first frame
 *   worldScale >= SKY_SILHOUETTE_WS_MAX && simDist < 0.8 * CAMERA_FAR
 * with a 2 s opacity crossfade (mesh 0 -> 1 while the finale drives
 * env.setGoalSilFade(silFade01) 1 -> 0); it releases with 10% distance
 * hysteresis so the boundary can never flicker. update(dt, cameraPos) is
 * driven by game/finale.js every frame (frame-order step 4.5).
 *
 * Zero per-frame allocation: scratch vectors + uniform/scalar writes only.
 */

import * as THREE from 'three';
import { SKYTREE_POS } from '../config/cityMap.js';
import { SKY_SILHOUETTE_WS_MAX, SKYTREE_BASE_R_M } from '../config/tuning.js';
import { bus, EVT } from '../core/events.js';
import { clamp01 } from '../core/mathUtils.js';
import { mergeColoredParts } from './geometryFactory.js';

/** Tokyo Skytree height, REAL meters (1:1 — the one un-compressed landmark). */
export const SKYTREE_HEIGHT_M = 634;

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
/** Body palette (スカイツリーホワイト — pale steel blue-white). */
const BODY_TOP = 0xeef3f8;
const BODY_BOTTOM = 0x9fb0c2;
const DECK_COLOR = 0xdfe9f2;
const ANTENNA_COLOR = 0xcdd8e4;
const GLOW_COLOR = 0xaee6ff;

// Module-level scratch (zero per-frame allocation).
const _pos = new THREE.Vector3();

/* SKYTREE_POS shape guard: cityMap.js (Stream B) exports the frozen real-
 * meter position; accept {x,z} or [x,z] so the contract cannot silently
 * misread. */
const SK_X = SKYTREE_POS.x !== undefined ? SKYTREE_POS.x : SKYTREE_POS[0];
const SK_Z = SKYTREE_POS.z !== undefined ? SKYTREE_POS.z : SKYTREE_POS[1];

/**
 * Build the unit-height (y in [0,1]) tower body parts. Proportions are real:
 * base half-width = SKYTREE_BASE_R_M / SKYTREE_HEIGHT_M (~0.142), decks at
 * 350 m / 450 m. All thin boxes + 2 low-poly cylinders, well under 1400 tris.
 * @returns {THREE.BufferGeometry} Merged vertex-colored composite.
 */
function buildTowerGeometry() {
  /** @type {Array<{geometry: THREE.BufferGeometry, color: number}>} */
  const parts = [];
  const baseR = SKYTREE_BASE_R_M / SKYTREE_HEIGHT_M; // 0.1420 (unit height)

  /** Leg lattice radius at height fraction f (taper to the antenna root). */
  const radiusAt = (f) => baseR * (1 - 0.88 * Math.pow(f, 0.72)) + 0.012;
  /** Vertical-gradient steel tint at height fraction f. */
  const tintAt = (f) => {
    const a = new THREE.Color(BODY_BOTTOM);
    a.lerp(new THREE.Color(BODY_TOP), clamp01(f));
    return a.getHex();
  };

  // ---- 4 corner legs x 4 tapered segments (thin boxes, slightly tilted in
  // via per-segment radius steps — reads as the tapering lattice). ----------
  const LEG_SEGS = [0, 0.24, 0.48, 0.7, 0.88];
  for (let s = 0; s < LEG_SEGS.length - 1; s++) {
    const f0 = LEG_SEGS[s];
    const f1 = LEG_SEGS[s + 1];
    const rMid = (radiusAt(f0) + radiusAt(f1)) * 0.5;
    const h = f1 - f0;
    const thick = 0.016 - 0.008 * f0;
    for (let l = 0; l < 4; l++) {
      const a = (l / 4) * Math.PI * 2 + Math.PI / 4;
      const g = new THREE.BoxGeometry(thick, h, thick);
      g.translate(Math.cos(a) * rMid * 0.82, f0 + h * 0.5, Math.sin(a) * rMid * 0.82);
      parts.push({ geometry: g, color: tintAt((f0 + f1) * 0.5) });
    }
  }

  // ---- horizontal cross-brace rings (4 sides x 5 levels of thin boxes) ----
  const BRACE_LEVELS = [0.08, 0.22, 0.38, 0.52, 0.66];
  for (let b = 0; b < BRACE_LEVELS.length; b++) {
    const f = BRACE_LEVELS[b];
    const r = radiusAt(f) * 0.82;
    for (let l = 0; l < 4; l++) {
      const a = (l / 4) * Math.PI * 2;
      const g = new THREE.BoxGeometry(r * 2.05, 0.008, 0.008);
      g.rotateY(a);
      g.translate(0, f, 0);
      parts.push({ geometry: g, color: tintAt(f) });
    }
  }

  // ---- core column (shaft behind the lattice) -----------------------------
  {
    const g = new THREE.CylinderGeometry(baseR * 0.30, baseR * 0.46, 0.88, 8, 1);
    g.translate(0, 0.44, 0);
    parts.push({ geometry: g, color: tintAt(0.4) });
  }

  // ---- observation decks: 天望デッキ 350m, 天望回廊 450m ------------------
  {
    const g1 = new THREE.CylinderGeometry(baseR * 0.52, baseR * 0.46, 0.022, 14, 1);
    g1.translate(0, 350 / SKYTREE_HEIGHT_M, 0);
    parts.push({ geometry: g1, color: DECK_COLOR });
    const g2 = new THREE.CylinderGeometry(baseR * 0.38, baseR * 0.34, 0.018, 14, 1);
    g2.translate(0, 450 / SKYTREE_HEIGHT_M, 0);
    parts.push({ geometry: g2, color: DECK_COLOR });
  }

  // ---- antenna gain tower (0.88 -> 1.0) -----------------------------------
  {
    const g = new THREE.CylinderGeometry(0.006, 0.016, 0.12, 6, 1);
    g.translate(0, 0.94, 0);
    parts.push({ geometry: g, color: ANTENNA_COLOR });
  }

  return mergeColoredParts(parts);
}

/**
 * Build the additive glow/beam composite (unit height, one draw call):
 * a vertical light beam rising from the antenna + a tip-beacon halo of three
 * crossed quads + a soft deck-band glow.
 * @returns {THREE.BufferGeometry}
 */
function buildGlowGeometry() {
  /** @type {THREE.BufferGeometry[]} */
  const geos = [];
  // Vertical beam: two crossed planes from the antenna root up into the sky.
  for (let i = 0; i < 2; i++) {
    const g = new THREE.PlaneGeometry(0.05, 0.9);
    g.rotateY(i * Math.PI * 0.5);
    g.translate(0, 0.9 + 0.45, 0);
    geos.push(g);
  }
  // Tip beacon: three crossed quads at the antenna top.
  for (let i = 0; i < 3; i++) {
    const g = new THREE.PlaneGeometry(0.12, 0.12);
    g.rotateY((i / 3) * Math.PI);
    g.translate(0, 1.0, 0);
    geos.push(g);
  }
  // Deck-band glow ring (a short, slightly flared open cylinder at deck 1).
  {
    const g = new THREE.CylinderGeometry(0.085, 0.085, 0.05, 12, 1, true);
    g.translate(0, 350 / SKYTREE_HEIGHT_M, 0);
    geos.push(g);
  }
  // Manual merge (positions/normals/uvs all present and consistent).
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

    /* ---- draw 1: merged vertex-colored lattice body (self-lit) ---- */
    this._geo = buildTowerGeometry();
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

  /** Tower BASE radius in current sim units (finale contact + guide math). */
  get radiusSim() {
    return SKYTREE_BASE_R_M / this._scaleMgr.worldScale;
  }

  /** Tower height in current sim units (guide arrow aims at the upper tower). */
  get heightSim() {
    return SKYTREE_HEIGHT_M / this._scaleMgr.worldScale;
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
    const h = SKYTREE_HEIGHT_M / ws;
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

/* DEV sanity: the budgeted tri count (<= 1400) is asserted by the Stream A
 * headless smoke test (scripts side), not at boot — geometry is built once
 * and the count is deterministic. */
