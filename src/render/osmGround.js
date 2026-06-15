/**
 * @file osmGround.js — v4 OSM ground layer: road/rail ribbons + park patches
 * in ONE vertex-colored BatchedMesh (+1 draw) and the river/pond/moat mesh on
 * the SHARED environment.js bay-water material (+1 draw). docs/DESIGN-V4.md
 * レンダリング統合 — Stream R. The v3 authored bay quads are KEPT — OSM water
 * is ADDITIVE (rivers/ponds/moats only; the sea is not in the fetch).
 *
 * TRANSFORM IS A PURE FUNCTION (the rescale law): all geometry is authored in
 * GAME METERS (the convert-time toGame frame); the parent group carries
 *   group.scale    = 1 / scaleMgr.worldScale
 *   group.position = (-shiftX, 0, -shiftZ)   (accumulated floating-origin shift)
 * recomputed EVERY update() (which runs after ScaleManager in main step 6) —
 * the one-frame similarity rescale is therefore pixel-identical by
 * construction (same trick as the backdrop and the env bay group), and a
 * rebase is one position write. RESCALE/REBASE/GAME_RESET are additionally
 * self-subscribed so the shift trackers stay exact between updates (tests).
 *
 * DATA CONTRACT (Stream W — world/osmWorld.js): this class decodes the
 * ground sections (type 3 ROAD / type 4 POLY, format v1 — the FROZEN byte
 * layout in docs/DESIGN-V4.md Phase-0 付録 A; encoding authority:
 * scripts/osm/build-tokyo-bin.mjs) directly from the outer shard bytes.
 * OsmWorld must expose:
 *   osmWorld.ready  : boolean — both shards fetched + decoded
 *   osmWorld.failed : boolean — permanent abortAndFail() latch
 *   osmWorld.outerBytes : Uint8Array|ArrayBuffer|null — the RAW (ungzipped)
 *     bytes of tokyo-v4-outer.bin, set before OSM_READY emits and retained
 *     for the session (~333 KB). Building/tower decode stays osmWorld's.
 * The one-time ground index + river build (~1-2 ms on the shipped data) runs
 * on the first update() after ready — title-screen work in the normal path
 * (the documented boot-decode exemption; on slow networks it lands mid-T0/T1
 * as one amortized hit). If the deadline latch fires first (failed), this
 * layer stays permanently empty.
 *
 * TILE LIFECYCLE: each ground SECTION (387 road tiles / 353 poly tiles on the
 * shipped data, 200 game-m grid) becomes 1-2 BatchedMesh geometries (road
 * tiles: major+minor split for LOD; poly tiles: parks; water goes to the
 * river mesh at index time). Tiles are GEOMETRY-BUILT at most
 * OSM_GROUND_TILE_BUILDS_PER_FRAME (2) per frame, NEAREST-FIRST, when they
 * enter max(fogFarSim*1.1, load floor); ring exit HIDES via setVisibleAt
 * (visibility, not deleteGeometry — BatchedMesh space cannot be compacted
 * without optimize() stalls, and the T5+ all-resident worst case must fit
 * anyway, so capacity == whole-map is required regardless; hidden instances
 * cost zero draws/tris via multi-draw). Worst-everything measured on the
 * shipped bins: ~72.7k verts / ~38.6k tris — matches the design's ~40k flat
 * ground budget inside TRI_BUDGET.
 *
 * LOD: minor roads (secondary/tertiary — in-coverage only by pipeline rule)
 * are visible within OSM_GROUND_MINOR_LOD_FRAC (0.5) * fogFar; majors+rail+
 * parks within the full ring. DESIGN DEVIATION (documented): the spec's
 * "T5+ all tiles resident at major-roads-only LOD" tier special-case is NOT
 * implemented — measured minor-road cost is ~3.4k tris TOTAL (clsHist:
 * 512 secondary + 927 tertiary records), so the radius-continuous minor ring
 * subsumes it with negligible tri cost and zero seamlessness-law tension.
 *
 * COPLANARITY: layer y-offsets are baked into the built vertices in game
 * meters (parks +0.02 < water +0.03 < minor +0.04 < major/rail +0.06) so
 * they scale with the similarity (z-fighting law). Water sits ABOVE parks
 * (ponds/moats render over 上野公園-style patches) and BELOW roads (bridges
 * read correctly where roads cross 神田川/隅田川). polygonOffset(-1,-1) on
 * the ground batch stays as belt-and-braces vs the terrain plane only.
 *
 * Zero per-frame allocation in steady state: the per-frame pass is index
 * arithmetic over preallocated typed arrays + changed-only setVisibleAt;
 * allocation happens only at the one-time index build and inside the <=2
 * amortized tile builds (ring transitions), never per frame.
 *
 * Draw calls: +1 ground batch (visible only when any tile is visible) +1
 * river mesh (when water exists) = the 2 ground entries in the honest 68/72
 * ledger. Over-cap lever 1 (merge river into the batch) stays available.
 *
 * v5 (謎の溝 fix): the ground batch fades in with TRUE radius — fully
 * terrain-tinted below OSM_GROUND_FADE_R0, full vertex colors from
 * OSM_GROUND_FADE_R1 (smoothstep between; constants module-local). Requires
 * the integrator to late-wire setEnvironment(env) for the live tint; unwired
 * the layer renders exactly as v4. See the constants block for the rationale.
 */

import * as THREE from 'three';
import { bus, EVT } from '../core/events.js';
import {
  LOAD_RADIUS_MIN_M,
  OSM_GROUND_TILE_BUILDS_PER_FRAME,
  OSM_GROUND_MINOR_LOD_FRAC,
  OSM_GROUND_Y_PARK,
  OSM_GROUND_Y_MINOR,
  OSM_GROUND_Y_MAJOR,
} from '../config/tuning.js';

const DEV = !!(import.meta.env && import.meta.env.DEV);

/* ---- format v1 constants (FROZEN — docs/DESIGN-V4.md 付録 A; authority:
 * scripts/osm/build-tokyo-bin.mjs) ---- */
/** 'FKT4' read as little-endian u32. */
const MAGIC_FKT4 = 0x34544b46;
const FORMAT_VERSION = 1;
const SEC_ROAD = 3;
const SEC_POLY = 4;
/** Ground tile grid pitch, game meters (GROUND_TILE in the converter). */
const GROUND_TILE_M = 200;
/** ROAD/POLY vertex quantum, game meters. */
const PT_Q_M = 0.1;
/** ROAD width quantum, game meters. */
const WIDTH_Q_M = 0.25;
/** POLY kind low nibble (converter polySets). */
const KIND_WATER = 1;
const KIND_PARK = 2;

/* ---- ground LOD / streaming ---- */
/** Tile residency ring = max(fogFarSim * this, load floor) (design: 1.1). */
const RING_PAD_K = 1.1;
/** INTEGRATION FIX (lead, measured at the marunouchi/tower KeyR gate): the
 *  whole ground group is lifted by GROUND_LIFT_K * fogFarSim (sim units)
 *  above the env ground plane. The baked game-meter y-offsets shrink to
 *  ~0.06/worldScale sim at high tiers (ws 125+: ~0.0005 sim) — below the
 *  depth-buffer resolution vs the coplanar env ground plane on weak
 *  renderers (headless SwiftShader; 16-bit-depth mobile GPUs), where
 *  polygonOffset(-1,-1) alone measurably failed (layer fully terrain-
 *  occluded at ws=125; empirical full-visibility threshold ~0.05 sim at
 *  fogFarSim 28.8 -> K = 2e-3). Because the lift is PROPORTIONAL TO
 *  fogFarSim (itself proportional to sim radius, floored), it is
 *  similarity-COVARIANT: under the one-frame rescale lift and world scale
 *  change together, so pixel-identity is preserved exactly (pure function
 *  of (worldScale, shift, fogFarSim) — all rescale-covariant inputs).
 *  Intra-layer baked ordering (parks < water < minor < major) rides the
 *  group and is unaffected. True-space cost: 0.2% of fog far (~2 m at a
 *  4 m ball) — invisible in this flat-shaded art style. */
const GROUND_LIFT_K = 2e-3;
/** OSM water surface offset, game m — between parks (0.02) and minor roads
 *  (0.04): ponds/moats over park patches, roads bridge over rivers. */
const WATER_Y_GAME_M = 0.03;

/* ---- v5 謎の溝 fix: radius-driven ground-layer fade (module-local like
 * GROUND_LIFT_K — NOT tuning.js). Root cause (confirmed by live run): at the
 * 2 cm opening the 総武線 rail ribbon (warm brown 0x6b6157) and the dark-grey
 * road ribbons read as giant flat bands abutting the shop/strip exclusion
 * clip cuts — the "mystery groove" in the owner's phone screenshots. Fix:
 * the ground-batch fragment color is mixed toward the LIVE terrain ground
 * tint by (1 - smoothstep(FADE_R0, FADE_R1, trueRadius)) so ribbons/parks
 * are invisible through the whole validated opening and fade in CONTINUOUSLY
 * exactly as the band-3 OSM streetscape arrives (seamlessness law). trueRadius
 * = ballRadiusSim * worldScale is invariant under the one-frame similarity
 * rescale, so KeyR pixel-identity holds by construction. One uniform write +
 * one Color copy per frame (zero alloc); draw calls unchanged; the river mesh
 * is excluded (env-owned water material — rivers are far from the opening). */
/** trueRadius (real m) below which the ground batch is fully terrain-tinted. */
const OSM_GROUND_FADE_R0 = 0.6;
/** trueRadius (real m) at which the ground batch shows full vertex colors. */
const OSM_GROUND_FADE_R1 = 3.0;

/* ---- road class table (converter ROAD_CLASS: motorway 0, trunk 1,
 * primary 2, secondary 3, tertiary 4, rail 5) ---- */
/** Major = full-ring + T5 skyline classes (motorway/trunk/primary/rail). */
const CLASS_IS_MAJOR = [1, 1, 1, 0, 0, 1];
/** Dark asphalt grays by class; rail warm tie-brown. Boot-time Colors
 *  (sRGB hex -> working space, matching instances.js setColor). */
const CLASS_COLOR = [
  new THREE.Color(0x44474f), // motorway
  new THREE.Color(0x484b53), // trunk
  new THREE.Color(0x4e5159), // primary
  new THREE.Color(0x595c63), // secondary
  new THREE.Color(0x60636a), // tertiary
  new THREE.Color(0x6b6157), // rail
];
const PARK_COLOR = new THREE.Color(0x4d7a52);

/** Module scratch (zero per-frame allocation). Max ROAD n = 31 (5 bits). */
const _PTX = new Float64Array(32);
const _PTZ = new Float64Array(32);
const _IDENTITY = new THREE.Matrix4();

/**
 * v4 OSM ground layer. Frozen class signature (docs/DESIGN-V4.md §インター
 * フェース):
 *   constructor(scene, scaleMgr, waterMaterial, osmWorld)
 *   update(dt, ballPos, fogFarSim) / reset() / dispose()
 */
export class OsmGround {
  /**
   * @param {THREE.Scene} scene Owned by render/renderer.js.
   * @param {{worldScale: number}} scaleMgr Live ScaleManager (worldScale read per frame).
   * @param {THREE.Material} waterMaterial env.getWaterMaterial() — SHARED, never disposed here.
   * @param {{ready: boolean, failed: boolean, outerBytes?: (Uint8Array|ArrayBuffer|null)}} osmWorld
   *   Stream W OsmWorld (see DATA CONTRACT in the header).
   */
  constructor(scene, scaleMgr, waterMaterial, osmWorld) {
    /** @type {THREE.Scene} */
    this._scene = scene;
    /** @type {{worldScale: number}} */
    this._scaleMgr = scaleMgr;
    /** @type {THREE.Material} */
    this._waterMaterial = waterMaterial;
    /** @type {{ready: boolean, failed: boolean, outerBytes?: (Uint8Array|ArrayBuffer|null)}} */
    this._world = osmWorld;

    /** @type {THREE.Group} The pure-function similarity node (game m -> sim). */
    this.group = new THREE.Group();
    scene.add(this.group);

    /** Accumulated floating-origin shift (sim units; sim = game/ws - shift). */
    this._shiftX = 0;
    this._shiftZ = 0;
    /** Last fogFarSim from update() (sim units) — drives the depth-safe
     *  group lift; rescale-covariant (scaled by S in _onRescale so the
     *  between-updates transform stays exact). */
    this._lastFogFarSim = 0;
    /** Last ball radius (sim units) from update() — caps the group lift AND
     *  squashes the baked y-offsets so the ground layer can never rise
     *  above a small ball (at the 2 cm start the FOG_FAR_MIN_M floor makes
     *  fogFarSim*GROUND_LIFT_K ≈ 0.9r and the baked 0.06 game-m road
     *  offset ≈ 3r — together an opaque ceiling over the whole shop).
     *  Both clamps are CONTINUOUS in radius (seamlessness law); at r ≥
     *  ~0.6 game m they are inactive and v4 behavior is unchanged.
     *  Rescale-covariant (scaled by S in _onRescale). */
    this._lastBallRadiusSim = 0;

    /** @type {boolean} Ground index built (one-shot after osmWorld.ready). */
    this._indexed = false;
    /** @type {boolean} Permanent local disable (bad magic / missing bytes). */
    this._disabled = false;

    /** @type {THREE.BatchedMesh|null} Roads/rail/parks (1 draw). */
    this._batch = null;
    /** @type {THREE.MeshBasicMaterial|null} Owned ground material. */
    this._groundMat = null;
    /* ---- v5 radius-driven ground fade (see OSM_GROUND_FADE_R0/R1) ---- */
    /** Live uniform: 0 = fully terrain-tinted, 1 = full vertex colors.
     *  Held HERE (not on the shader object) so per-frame writes are valid
     *  before/after compile. @type {{value: number}} */
    this._uGroundFade = { value: 1 };
    /** Live uniform: terrain ground tint (working space), copied per frame
     *  from env.getGroundColorWorking while fading (palette-crossfade aware).
     *  @type {{value: THREE.Color}} */
    this._uGroundTint = { value: new THREE.Color(0x4a4a42) };
    /** Late-wired Environment (integrator: osmGround.setEnvironment(env) —
     *  the v4 constructor shape is frozen). null = fade disabled (v4 look).
     *  @type {{getGroundColorWorking: (t: THREE.Color) => THREE.Color}|null} */
    this._env = null;
    /** @type {boolean} DEV: missing-env warning emitted once. */
    this._warnedNoEnv = false;
    /** @type {THREE.Mesh|null} River/pond/moat mesh (1 draw, shared water material). */
    this._river = null;
    /** @type {DataView|null} Outer shard view (decode source for tile builds). */
    this._dv = null;

    /* ---- per-ground-section entry arrays (allocated once at index) ---- */
    /** @type {number} */ this._entryCount = 0;
    /** @type {Float32Array|null} Tile min corner X, game m. */ this._minX = null;
    /** @type {Float32Array|null} Tile min corner Z, game m. */ this._minZ = null;
    /** @type {Uint8Array|null} SEC_ROAD | SEC_POLY. */ this._type = null;
    /** @type {Uint32Array|null} Payload byte offset. */ this._off = null;
    /** @type {Uint32Array|null} Record count. */ this._cnt = null;
    /** @type {Uint8Array|null} 1 = geometry built. */ this._built = null;
    /** @type {Int32Array|null} BatchedMesh instance id: road-major / park (-1 none). */ this._instA = null;
    /** @type {Int32Array|null} BatchedMesh instance id: road-minor (-1 none). */ this._instB = null;
    /** @type {Uint8Array|null} Current visibility of instA. */ this._visA = null;
    /** @type {Uint8Array|null} Current visibility of instB. */ this._visB = null;
    /** @type {number} Currently visible instance count (mesh.visible gate). */
    this._visCount = 0;

    /* ---- self-subscribed shift bookkeeping (cosmetic-exact between updates;
     * update() recomputes the transform from live state anyway) ---- */
    /** @type {(p: {S: number}) => void} */
    this._onRescale = (p) => {
      this._shiftX *= p.S;
      this._shiftZ *= p.S;
      this._lastFogFarSim *= p.S; // fog far is a sim length — rescale-covariant
      this._lastBallRadiusSim *= p.S; // ball radius likewise
      this._applyTransform();
    };
    bus.on(EVT.RESCALE, this._onRescale);
    /** @type {(p: {sx: number, sz: number}) => void} */
    this._onRebase = (p) => {
      this._shiftX += p.sx;
      this._shiftZ += p.sz;
      this._applyTransform();
    };
    bus.on(EVT.REBASE, this._onRebase);
    /** @type {() => void} main.js resetWorld does NOT call osmGround.reset —
     *  self-reset on GAME_RESET like env (data static, only the shift clears). */
    this._onGameReset = () => this.reset();
    bus.on(EVT.GAME_RESET, this._onGameReset);

    this._applyTransform();
  }

  /**
   * Per-frame (main.js step 6, AFTER env.update — fresh fog). Streams tile
   * geometry (<= OSM_GROUND_TILE_BUILDS_PER_FRAME nearest-first builds) and
   * updates per-tile visibility (full ring majors/parks, 0.5 ring minors).
   * @param {number} dt Frame delta (s) — unused (no animation), kept for the
   *   frozen signature.
   * @param {THREE.Vector3} ballPos Ball position, SIM units.
   * @param {number} fogFarSim Floored fog far, SIM units (env.fogFarSim).
   */
  update(dt, ballPos, fogFarSim, ballRadiusSim = 0) {
    void dt;
    this._lastFogFarSim = fogFarSim;
    this._lastBallRadiusSim = ballRadiusSim;
    this._applyTransform();

    if (!this._indexed) {
      if (this._disabled || this._world.failed || !this._world.ready) return;
      const bytes = this._world.outerBytes;
      if (bytes === undefined || bytes === null) {
        // Contract miss: OsmWorld didn't retain the outer shard. Stay empty.
        if (DEV) console.warn('[osmGround] osmWorld.ready but outerBytes missing — ground layer disabled');
        this._disabled = true;
        return;
      }
      this._buildIndex(bytes);
      if (!this._indexed) return; // _buildIndex may have disabled
    }
    const n = this._entryCount;
    if (n === 0) return;

    const ws = this._scaleMgr.worldScale;

    /* v5 謎の溝 fix: radius-driven ground fade. trueRadius is rescale-
     * invariant (radiusSim * worldScale), so this is pixel-identical across
     * KeyR/auto rescale by construction. Zero alloc: one scalar uniform
     * write + one in-place Color copy. */
    if (this._groundMat !== null) {
      if (this._env !== null) {
        const trueR = ballRadiusSim * ws;
        let t = (trueR - OSM_GROUND_FADE_R0) / (OSM_GROUND_FADE_R1 - OSM_GROUND_FADE_R0);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const fade = t * t * (3 - 2 * t); // smoothstep
        this._uGroundFade.value = fade;
        if (fade < 1) this._env.getGroundColorWorking(this._uGroundTint.value);
      } else {
        this._uGroundFade.value = 1; // unwired: exact v4 look (no fade)
        if (DEV && !this._warnedNoEnv) {
          this._warnedNoEnv = true;
          console.warn(
            '[osmGround] setEnvironment(env) not wired — v5 ground fade (謎の溝 fix) inactive'
          );
        }
      }
    }
    const ballGX = (ballPos.x + this._shiftX) * ws;
    const ballGZ = (ballPos.z + this._shiftZ) * ws;
    const ringG = Math.max(fogFarSim * RING_PAD_K * ws, LOAD_RADIUS_MIN_M);
    const minorG = fogFarSim * OSM_GROUND_MINOR_LOD_FRAC * ws;
    const ringG2 = ringG * ringG;
    const minorG2 = minorG * minorG;

    /* Single pass: visibility for built entries; nearest-2 selection for
     * unbuilt entries inside the ring. Zero allocation. */
    let cand0 = -1;
    let cand1 = -1;
    let cand0D = Infinity;
    let cand1D = Infinity;
    const minX = /** @type {Float32Array} */ (this._minX);
    const minZ = /** @type {Float32Array} */ (this._minZ);
    const built = /** @type {Uint8Array} */ (this._built);
    for (let i = 0; i < n; i++) {
      // Point-to-rect distance squared (tile rect GROUND_TILE_M square).
      const x0 = minX[i];
      const z0 = minZ[i];
      let dx = 0;
      if (ballGX < x0) dx = x0 - ballGX;
      else if (ballGX > x0 + GROUND_TILE_M) dx = ballGX - (x0 + GROUND_TILE_M);
      let dz = 0;
      if (ballGZ < z0) dz = z0 - ballGZ;
      else if (ballGZ > z0 + GROUND_TILE_M) dz = ballGZ - (z0 + GROUND_TILE_M);
      const d2 = dx * dx + dz * dz;
      if (built[i] === 0) {
        if (d2 <= ringG2) {
          if (d2 < cand0D) {
            cand1 = cand0;
            cand1D = cand0D;
            cand0 = i;
            cand0D = d2;
          } else if (d2 < cand1D) {
            cand1 = i;
            cand1D = d2;
          }
        }
      } else {
        this._applyVisibility(i, d2, ringG2, minorG2);
      }
    }

    /* Amortized builds (<= OSM_GROUND_TILE_BUILDS_PER_FRAME nearest-first;
     * the constant is 2 — unrolled pair keeps this allocation-free). */
    if (cand0 !== -1) {
      this._buildEntry(cand0);
      this._applyVisibility(cand0, cand0D, ringG2, minorG2);
      if (cand1 !== -1 && OSM_GROUND_TILE_BUILDS_PER_FRAME >= 2) {
        this._buildEntry(cand1);
        this._applyVisibility(cand1, cand1D, ringG2, minorG2);
      }
    }

    if (this._batch !== null) this._batch.visible = this._visCount > 0;
  }

  /**
   * v5 late-wire hook (integrator, main.js — the v4 constructor signature is
   * frozen): inject the Environment so the radius-driven ground fade can read
   * the LIVE terrain ground tint (palette-crossfade aware). Until wired the
   * fade is inactive (exact v4 rendering).
   * @param {{getGroundColorWorking: (t: THREE.Color) => THREE.Color}} env
   */
  setEnvironment(env) {
    this._env = env && typeof env.getGroundColorWorking === 'function' ? env : null;
    if (DEV && this._env === null) {
      console.warn('[osmGround] setEnvironment: env.getGroundColorWorking(target) missing');
    }
  }

  /**
   * Game reset: clear the shift trackers (worldScale is re-read live). Built
   * geometry is STATIC session data — kept; visibility re-resolves on the
   * next update() from the fresh ball state. Idempotent.
   */
  reset() {
    this._shiftX = 0;
    this._shiftZ = 0;
    this._applyTransform();
  }

  /** Teardown (tests only in practice): unsubscribe + release GPU buffers.
   *  The shared water material is env-owned and NOT disposed here. */
  dispose() {
    bus.off(EVT.RESCALE, this._onRescale);
    bus.off(EVT.REBASE, this._onRebase);
    bus.off(EVT.GAME_RESET, this._onGameReset);
    this._scene.remove(this.group);
    if (this._batch !== null) this._batch.dispose();
    if (this._groundMat !== null) this._groundMat.dispose();
    if (this._river !== null) this._river.geometry.dispose();
    this._batch = null;
    this._river = null;
    this._dv = null;
    this._indexed = false;
    this._entryCount = 0;
  }

  /* ------------------------------------------------------------------ */
  /* Internals                                                            */
  /* ------------------------------------------------------------------ */

  /** group transform = PURE FUNCTION of (worldScale, shift, fogFarSim,
   *  ballRadiusSim) — all rescale-covariant inputs (the rescale law).
   *  The y position is the depth-safe lift above the env ground plane,
   *  capped at 10% of the ball radius; the y SCALE squashes the baked
   *  game-meter offsets so the tallest layer (OSM_GROUND_Y_MAJOR) never
   *  exceeds 10% of the ball radius. Both caps are continuous in radius
   *  and inactive at r >= ~0.6 game m (ground is flat, normals point up —
   *  non-uniform y scale is safe). */
  _applyTransform() {
    const ws = this._scaleMgr.worldScale;
    const inv = 1 / ws;
    const r = this._lastBallRadiusSim;
    const lift =
      r > 0
        ? Math.min(this._lastFogFarSim * GROUND_LIFT_K, r * 0.1)
        : this._lastFogFarSim * GROUND_LIFT_K;
    const yMaxSim = OSM_GROUND_Y_MAJOR * inv; // tallest baked offset, sim
    const ySquash = r > 0 && yMaxSim > 0 ? Math.min(1, (r * 0.1) / yMaxSim) : 1;
    this.group.scale.set(inv, inv * ySquash, inv);
    this.group.position.set(-this._shiftX, lift, -this._shiftZ);
  }

  /**
   * Changed-only visibility writes for one BUILT entry.
   * @param {number} i Entry index.
   * @param {number} d2 Ball-to-tile-rect distance squared (game m^2).
   * @param {number} ringG2 Residency ring squared.
   * @param {number} minorG2 Minor-LOD ring squared.
   */
  _applyVisibility(i, d2, ringG2, minorG2) {
    const batch = /** @type {THREE.BatchedMesh} */ (this._batch);
    const inRing = d2 <= ringG2 ? 1 : 0;
    const a = /** @type {Int32Array} */ (this._instA)[i];
    if (a !== -1 && /** @type {Uint8Array} */ (this._visA)[i] !== inRing) {
      /** @type {Uint8Array} */ (this._visA)[i] = inRing;
      batch.setVisibleAt(a, inRing === 1);
      this._visCount += inRing === 1 ? 1 : -1;
    }
    const b = /** @type {Int32Array} */ (this._instB)[i];
    if (b !== -1) {
      const minorVis = inRing === 1 && d2 <= minorG2 ? 1 : 0;
      if (/** @type {Uint8Array} */ (this._visB)[i] !== minorVis) {
        /** @type {Uint8Array} */ (this._visB)[i] = minorVis;
        batch.setVisibleAt(b, minorVis === 1);
        this._visCount += minorVis === 1 ? 1 : -1;
      }
    }
  }

  /**
   * One-time ground index (first update() after osmWorld.ready — title work
   * in the normal path): parse the section table, size the BatchedMesh from
   * an exact payload walk, build the static river mesh.
   * @param {Uint8Array|ArrayBuffer} bytes tokyo-v4-outer.bin contents.
   */
  _buildIndex(bytes) {
    const dv =
      bytes instanceof Uint8Array
        ? new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        : new DataView(bytes);
    if (dv.byteLength < 16 || dv.getUint32(0, true) !== MAGIC_FKT4 || dv.getUint16(4, true) !== FORMAT_VERSION) {
      if (DEV) console.error('[osmGround] outer shard magic/version mismatch — ground layer disabled');
      this._disabled = true;
      return;
    }
    const nSec = dv.getUint16(6, true);

    /* Pass 1 — collect ground sections + exact capacity walk. */
    let count = 0;
    let batchVerts = 0;
    let batchIdx = 0;
    let instances = 0;
    let waterVerts = 0;
    let waterIdx = 0;
    for (let s = 0; s < nSec; s++) {
      const o = 16 + s * 16;
      const type = dv.getUint8(o);
      if (type !== SEC_ROAD && type !== SEC_POLY) continue;
      count++;
      const recs = dv.getUint16(o + 6, true);
      let p = dv.getUint32(o + 8, true);
      if (type === SEC_ROAD) {
        let hasMajor = 0;
        let hasMinor = 0;
        for (let r = 0; r < recs; r++) {
          const b0 = dv.getUint8(p);
          const cls = b0 & 7;
          const ptn = (b0 >> 3) & 0x1f;
          batchVerts += 4 * (ptn - 1);
          batchIdx += 6 * (ptn - 1);
          if (cls < 6 && CLASS_IS_MAJOR[cls] === 1) hasMajor = 1;
          else hasMinor = 1;
          p += 8 + 4 * (ptn - 1);
        }
        instances += hasMajor + hasMinor;
      } else {
        let hasPark = 0;
        for (let r = 0; r < recs; r++) {
          const kind = dv.getUint8(p) & 0x0f;
          const vn = dv.getUint16(p + 2, true);
          const tn = dv.getUint16(p + 4, true);
          if (kind === KIND_WATER) {
            waterVerts += vn;
            waterIdx += tn;
          } else {
            hasPark = 1;
            batchVerts += vn;
            batchIdx += tn;
          }
          p += 6 + 4 * vn + 2 * tn;
        }
        instances += hasPark;
      }
    }

    this._dv = dv;
    this._entryCount = count;
    this._minX = new Float32Array(count);
    this._minZ = new Float32Array(count);
    this._type = new Uint8Array(count);
    this._off = new Uint32Array(count);
    this._cnt = new Uint32Array(count);
    this._built = new Uint8Array(count);
    this._instA = new Int32Array(count).fill(-1);
    this._instB = new Int32Array(count).fill(-1);
    this._visA = new Uint8Array(count);
    this._visB = new Uint8Array(count);
    let e = 0;
    for (let s = 0; s < nSec; s++) {
      const o = 16 + s * 16;
      const type = dv.getUint8(o);
      if (type !== SEC_ROAD && type !== SEC_POLY) continue;
      this._minX[e] = dv.getInt16(o + 2, true) * GROUND_TILE_M;
      this._minZ[e] = dv.getInt16(o + 4, true) * GROUND_TILE_M;
      this._type[e] = type;
      this._cnt[e] = dv.getUint16(o + 6, true);
      this._off[e] = dv.getUint32(o + 8, true);
      e++;
    }

    if (instances > 0 && batchVerts > 0) {
      this._groundMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      /* v5 ground fade: inject the uGroundFade01/uGroundTint uniform pair.
       * The uniform OBJECTS live on `this` (written per frame in update());
       * onBeforeCompile only links them into the program. The default
       * program-cache key includes onBeforeCompile.toString(), so this
       * material never collides with other MeshBasicMaterial programs. */
      const uFade = this._uGroundFade;
      const uTint = this._uGroundTint;
      this._groundMat.onBeforeCompile = (shader) => {
        shader.uniforms.uGroundFade01 = uFade;
        shader.uniforms.uGroundTint = uTint;
        shader.fragmentShader = shader.fragmentShader
          .replace(
            '#include <common>',
            '#include <common>\nuniform float uGroundFade01;\nuniform vec3 uGroundTint;'
          )
          .replace(
            '#include <color_fragment>',
            '#include <color_fragment>\n\tdiffuseColor.rgb = mix(uGroundTint, diffuseColor.rgb, uGroundFade01);'
          );
      };
      const batch = new THREE.BatchedMesh(instances, batchVerts, batchIdx, this._groundMat);
      batch.visible = false; // no tiles built yet — never cost an empty draw
      batch.frustumCulled = false;
      batch.perObjectFrustumCulled = false;
      batch.sortObjects = false;
      batch.renderOrder = 1; // after the env ground shader (design)
      this._batch = batch;
      this.group.add(batch);
    }

    if (waterVerts > 0) this._buildRiver(dv, nSec, waterVerts, waterIdx);

    this._indexed = true;
    if (DEV) {
      console.log(
        `[osmGround] indexed ${count} ground tiles — batch ${instances} inst / ` +
          `${batchVerts} verts / ${batchIdx / 3} tris; river ${waterVerts} verts / ${waterIdx / 3} tris`
      );
    }
  }

  /**
   * Static river/pond/moat mesh from EVERY water poly (one-time, ~7.4k verts
   * on shipped data). Shares the env bay-water Lambert (one program, fog on).
   * @param {DataView} dv @param {number} nSec
   * @param {number} waterVerts @param {number} waterIdx
   */
  _buildRiver(dv, nSec, waterVerts, waterIdx) {
    const pos = new Float32Array(waterVerts * 3);
    const nor = new Float32Array(waterVerts * 3);
    const idx = waterVerts > 65535 ? new Uint32Array(waterIdx) : new Uint16Array(waterIdx);
    for (let i = 0; i < waterVerts; i++) nor[i * 3 + 1] = 1; // flat +Y
    let vBase = 0;
    let iBase = 0;
    for (let s = 0; s < nSec; s++) {
      const o = 16 + s * 16;
      if (dv.getUint8(o) !== SEC_POLY) continue;
      const tileX = dv.getInt16(o + 2, true) * GROUND_TILE_M;
      const tileZ = dv.getInt16(o + 4, true) * GROUND_TILE_M;
      const recs = dv.getUint16(o + 6, true);
      let p = dv.getUint32(o + 8, true);
      for (let r = 0; r < recs; r++) {
        const kind = dv.getUint8(p) & 0x0f;
        const vn = dv.getUint16(p + 2, true);
        const tn = dv.getUint16(p + 4, true);
        if (kind !== KIND_WATER) {
          p += 6 + 4 * vn + 2 * tn;
          continue;
        }
        // Verts: first absolute u16, then cumulative i16 deltas (0.1 m ints).
        let x10 = dv.getUint16(p + 6, true);
        let z10 = dv.getUint16(p + 8, true);
        let q = p + 10;
        for (let i = 0; i < vn; i++) {
          if (i > 0) {
            x10 += dv.getInt16(q, true);
            z10 += dv.getInt16(q + 2, true);
            q += 4;
          }
          const vo = (vBase + i) * 3;
          pos[vo] = tileX + x10 * PT_Q_M;
          pos[vo + 1] = WATER_Y_GAME_M;
          pos[vo + 2] = tileZ + z10 * PT_Q_M;
        }
        for (let i = 0; i < tn; i += 3) {
          let a = dv.getUint16(q, true);
          let b = dv.getUint16(q + 2, true);
          let c = dv.getUint16(q + 4, true);
          q += 6;
          // Normalize winding up-facing (earcut follows ring orientation).
          if (windsDown(pos, vBase + a, vBase + b, vBase + c)) {
            const t = b;
            b = c;
            c = t;
          }
          idx[iBase] = vBase + a;
          idx[iBase + 1] = vBase + b;
          idx[iBase + 2] = vBase + c;
          iBase += 3;
        }
        vBase += vn;
        p = q;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    this._river = new THREE.Mesh(geo, this._waterMaterial);
    this._river.frustumCulled = false; // fog melts it; visibility is the ring's job
    this._river.renderOrder = 1;
    this.group.add(this._river);
  }

  /**
   * Build one ground entry's geometry into the BatchedMesh (amortized — at
   * most OSM_GROUND_TILE_BUILDS_PER_FRAME calls per frame). Road entries
   * produce up to 2 geometries (major / minor LOD split); poly entries one
   * (parks; water was consumed by the river at index time). New instances
   * start INVISIBLE — the caller applies ring visibility immediately.
   * @param {number} i Entry index.
   */
  _buildEntry(i) {
    const dv = /** @type {DataView} */ (this._dv);
    /** @type {Uint8Array} */ (this._built)[i] = 1;
    if (this._batch === null) return;
    const tileX = /** @type {Float32Array} */ (this._minX)[i];
    const tileZ = /** @type {Float32Array} */ (this._minZ)[i];
    const recs = /** @type {Uint32Array} */ (this._cnt)[i];
    const off = /** @type {Uint32Array} */ (this._off)[i];

    if (/** @type {Uint8Array} */ (this._type)[i] === SEC_ROAD) {
      /* Pass 1: vert/index totals per LOD class. */
      let vMaj = 0;
      let iMaj = 0;
      let vMin = 0;
      let iMin = 0;
      let p = off;
      for (let r = 0; r < recs; r++) {
        const b0 = dv.getUint8(p);
        const cls = b0 & 7;
        const ptn = (b0 >> 3) & 0x1f;
        if (cls < 6 && CLASS_IS_MAJOR[cls] === 1) {
          vMaj += 4 * (ptn - 1);
          iMaj += 6 * (ptn - 1);
        } else {
          vMin += 4 * (ptn - 1);
          iMin += 6 * (ptn - 1);
        }
        p += 8 + 4 * (ptn - 1);
      }
      const maj = vMaj > 0 ? new RibbonSink(vMaj, iMaj) : null;
      const min = vMin > 0 ? new RibbonSink(vMin, iMin) : null;
      /* Pass 2: decode + tessellate. */
      p = off;
      for (let r = 0; r < recs; r++) {
        const b0 = dv.getUint8(p);
        const cls0 = b0 & 7;
        const cls = cls0 < 6 ? cls0 : 4; // defensive: unknown -> tertiary
        const ptn = (b0 >> 3) & 0x1f;
        const halfW = (dv.getUint8(p + 1) * WIDTH_Q_M) / 2;
        let x10 = dv.getUint16(p + 4, true);
        let z10 = dv.getUint16(p + 6, true);
        let q = p + 8;
        for (let k = 0; k < ptn; k++) {
          if (k > 0) {
            x10 += dv.getInt16(q, true);
            z10 += dv.getInt16(q + 2, true);
            q += 4;
          }
          _PTX[k] = tileX + x10 * PT_Q_M;
          _PTZ[k] = tileZ + z10 * PT_Q_M;
        }
        const major = CLASS_IS_MAJOR[cls] === 1;
        const sink = major ? maj : min;
        if (sink !== null) {
          sink.addPolyline(
            ptn,
            halfW,
            major ? OSM_GROUND_Y_MAJOR : OSM_GROUND_Y_MINOR,
            CLASS_COLOR[cls]
          );
        }
        p = q;
      }
      if (maj !== null) {
        /** @type {Int32Array} */ (this._instA)[i] = this._addToBatch(maj);
      }
      if (min !== null) {
        /** @type {Int32Array} */ (this._instB)[i] = this._addToBatch(min);
      }
    } else {
      /* POLY: parks only (water handled at index). */
      let vTot = 0;
      let iTot = 0;
      let p = off;
      for (let r = 0; r < recs; r++) {
        const kind = dv.getUint8(p) & 0x0f;
        const vn = dv.getUint16(p + 2, true);
        const tn = dv.getUint16(p + 4, true);
        if (kind !== KIND_WATER) {
          vTot += vn;
          iTot += tn;
        }
        p += 6 + 4 * vn + 2 * tn;
      }
      if (vTot === 0) return;
      const sink = new RibbonSink(vTot, iTot);
      p = off;
      for (let r = 0; r < recs; r++) {
        const kind = dv.getUint8(p) & 0x0f;
        const vn = dv.getUint16(p + 2, true);
        const tn = dv.getUint16(p + 4, true);
        if (kind === KIND_WATER) {
          p += 6 + 4 * vn + 2 * tn;
          continue;
        }
        const base = sink.v;
        let x10 = dv.getUint16(p + 6, true);
        let z10 = dv.getUint16(p + 8, true);
        let q = p + 10;
        for (let k = 0; k < vn; k++) {
          if (k > 0) {
            x10 += dv.getInt16(q, true);
            z10 += dv.getInt16(q + 2, true);
            q += 4;
          }
          sink.pushVert(tileX + x10 * PT_Q_M, OSM_GROUND_Y_PARK, tileZ + z10 * PT_Q_M, PARK_COLOR);
        }
        for (let k = 0; k < tn; k += 3) {
          const a = base + dv.getUint16(q, true);
          const b = base + dv.getUint16(q + 2, true);
          const c = base + dv.getUint16(q + 4, true);
          q += 6;
          sink.pushTriUpFacing(a, b, c);
        }
        p = q;
      }
      /** @type {Int32Array} */ (this._instA)[i] = this._addToBatch(sink);
    }
  }

  /**
   * Move a filled sink into the BatchedMesh as one geometry + one instance
   * (starts hidden; caller sets ring visibility).
   * @param {RibbonSink} sink
   * @returns {number} Instance id.
   */
  _addToBatch(sink) {
    const batch = /** @type {THREE.BatchedMesh} */ (this._batch);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(sink.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(sink.col, 3));
    geo.setIndex(new THREE.BufferAttribute(sink.idx, 1));
    const gid = batch.addGeometry(geo);
    const inst = batch.addInstance(gid);
    batch.setMatrixAt(inst, _IDENTITY);
    batch.setVisibleAt(inst, false);
    geo.dispose(); // BatchedMesh copied the data — throwaway wrapper
    return inst;
  }
}

/**
 * @param {Float32Array} pos @param {number} a @param {number} b @param {number} c
 * @returns {boolean} True when triangle (a,b,c) faces -Y (needs a swap).
 *   Up-facing test in the XZ plane: cross2D = e1.x*e2.z - e1.z*e2.x < 0.
 */
function windsDown(pos, a, b, c) {
  const ax = pos[a * 3];
  const az = pos[a * 3 + 2];
  const e1x = pos[b * 3] - ax;
  const e1z = pos[b * 3 + 2] - az;
  const e2x = pos[c * 3] - ax;
  const e2z = pos[c * 3 + 2] - az;
  return e1x * e2z - e1z * e2x > 0;
}

/**
 * Exact-size vertex/color/index accumulator for one tile geometry (build-time
 * only — allocation is amortized by the per-frame build budget, never
 * steady-state). Indices are u32 only when the tile exceeds u16 (it never
 * does on shipped data — max tile measured 3,308 verts).
 */
class RibbonSink {
  /** @param {number} verts @param {number} indices */
  constructor(verts, indices) {
    /** @type {Float32Array} */ this.pos = new Float32Array(verts * 3);
    /** @type {Float32Array} */ this.col = new Float32Array(verts * 3);
    /** @type {Uint16Array|Uint32Array} */
    this.idx = verts > 65535 ? new Uint32Array(indices) : new Uint16Array(indices);
    /** @type {number} Vertex write cursor. */ this.v = 0;
    /** @type {number} Index write cursor. */ this.i = 0;
  }

  /**
   * @param {number} x @param {number} y @param {number} z
   * @param {THREE.Color} c Working-space color (module Color constants).
   */
  pushVert(x, y, z, c) {
    const o = this.v * 3;
    this.pos[o] = x;
    this.pos[o + 1] = y;
    this.pos[o + 2] = z;
    this.col[o] = c.r;
    this.col[o + 1] = c.g;
    this.col[o + 2] = c.b;
    this.v++;
  }

  /** Push a triangle, swapping to up-facing winding when needed. */
  pushTriUpFacing(a, b, c) {
    if (windsDown(this.pos, a, b, c)) {
      const t = b;
      b = c;
      c = t;
    }
    this.idx[this.i] = a;
    this.idx[this.i + 1] = b;
    this.idx[this.i + 2] = c;
    this.i += 3;
  }

  /**
   * Tessellate the module-scratch polyline (_PTX/_PTZ[0..n)) as independent
   * segment quads with square caps (each end extended by halfW — covers the
   * outer-corner gap of butt joints; overlaps are same-color/same-depth so
   * they read as one ribbon).
   * @param {number} n Point count (2..31).
   * @param {number} halfW Half width, game m.
   * @param {number} y Baked layer offset, game m.
   * @param {THREE.Color} color Class color.
   */
  addPolyline(n, halfW, y, color) {
    for (let s = 0; s < n - 1; s++) {
      const x0 = _PTX[s];
      const z0 = _PTZ[s];
      const x1 = _PTX[s + 1];
      const z1 = _PTZ[s + 1];
      let ux = x1 - x0;
      let uz = z1 - z0;
      const len = Math.sqrt(ux * ux + uz * uz);
      if (len < 1e-6) {
        ux = 1;
        uz = 0;
      } else {
        ux /= len;
        uz /= len;
      }
      const ex = ux * halfW; // square-cap extension
      const ez = uz * halfW;
      const nx = -uz * halfW; // left normal
      const nz = ux * halfW;
      const axp = x0 - ex;
      const azp = z0 - ez;
      const bxp = x1 + ex;
      const bzp = z1 + ez;
      const base = this.v;
      this.pushVert(axp + nx, y, azp + nz, color); // v0
      this.pushVert(axp - nx, y, azp - nz, color); // v1
      this.pushVert(bxp + nx, y, bzp + nz, color); // v2
      this.pushVert(bxp - nx, y, bzp - nz, color); // v3
      // Up-facing pair (derived in the header math; windsDown-verified shape).
      this.idx[this.i] = base;
      this.idx[this.i + 1] = base + 2;
      this.idx[this.i + 2] = base + 1;
      this.idx[this.i + 3] = base + 2;
      this.idx[this.i + 4] = base + 3;
      this.idx[this.i + 5] = base + 1;
      this.i += 6;
    }
  }
}
