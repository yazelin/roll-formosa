/**
 * @file ball.js — The katamari group: noise-displaced icosphere core,
 * 0.15s attach-animation queue, 8 ball-parented stuck InstancedMesh pools
 * (STUCK_CAP=512 slots total, ring semantics), write-once ball-local socket
 * math, staggered burial / sub-pixel cull, and knock-off re-ejection.
 *
 * SOCKET MATH (write-once, ball-local): a stuck object's instance matrix is
 * written in the ballGroup's local frame at attach time and NEVER updated per
 * frame — 500 stuck objects cost one parent matrix multiply. With group scale
 * s_g (starts 1, *= S at each rescale via rescaleState(S)):
 *
 *   localPos  = invQuat(ball) * (dir * radiusSim * ATTACH_EMBED_K) / s_g
 *   localQuat = randomSpinAbout(dirLocal) * fromUnitVectors(up, dirLocal)
 *   localScl  = objRadiusSim / s_g            (proxy geometry has unit radius)
 *
 * Frozen absolute size is CORRECT: objects shrink relatively as the ball
 * grows, sinking toward texture; the BURIAL CULL reclaims slots once
 * attachRadiusSim + objHalfSim < BURIAL_RATIO * currentSimRadius (fully under
 * newer layers) or relative size < BURIAL_MIN_REL, staggered over
 * BURIAL_STAGGER_S so a tier jump never molts visibly.
 *
 * ARCHETYPE FAMILY: with one geometry per InstancedMesh and a hard 8-mesh
 * stuck budget, each of the 8 families renders a generic low-poly PROXY shape
 * (box/sphere/cylinder/cone/slab/pillar/ring/gem) tinted per-instance with
 * the absorbed object's color. family = (code % ARCH_PER_TIER) & 7, where the
 * ObjectStore archetype code is the flat catalog index
 * tier*ARCH_PER_TIER + slotInTier (order frozen in config/tiers.js
 * archetypeIds; landmark slots 8/9 fold onto proxy families 0/1). v3: EXTRA
 * curated codes 70..93 fold onto proxy families with the SAME
 * (code % ARCH_PER_TIER) & 7 formula (e.g. 80 ハチ公像 -> family 0).
 * v4: OSM voxel-building codes 94..109 do NOT use the modulo fold (it would
 * scatter buildings onto ring/gem/cone proxies) — they map through the
 * explicit OSM_STUCK_FAMILY table below onto the BUILDING-SHAPED proxy
 * families only (0 boxy / 4 flat slab / 5 tall pillar), so an absorbed
 * streetscape reads as masonry chunks on the ball, never donuts.
 *
 * v3 KNOCK-OFF RULE (DESIGN-V3.md MAJOR 4): knockOff() SKIPS stuck entries
 * with archetype code >= EXTRA_CODE_BASE (70) — EXTRA landmarks/collectibles
 * are PERMANENTLY stuck (credit was granted at absorb; curated identity lives
 * in its consumed bitmask, never re-injected). Chunk-coded curated placements
 * (< 70) re-enter via the normal spawner.reinject path, which strips
 * FLAG_CURATED|FLAG_RARE. v4: the SAME >= EXTRA_CODE_BASE skip covers OSM
 * codes 94..109 (94 > 70) — absorbed OSM buildings are permanently stuck,
 * no reinject path exists (DESIGN-V4 ゲームプレイ統合; boot-asserted below).
 *
 * v3 SLOT-STEAL CONVENTION (load-bearing): main.js's ABSORB attach handler
 * calls attachStuck and then sets store.instanceSlot[i] = -1 — it runs AFTER
 * curated in the frozen subscription order, and curated's deferred cleanup
 * frees a render-pool slot ONLY when instanceSlot >= 0 at cleanup time. Do
 * not reorder those subscriptions and do not stop zeroing instanceSlot.
 *
 * Zero-allocation discipline: all records, rings and scratch are
 * preallocated; per-frame code writes matrices via module-level scratch only.
 */

import * as THREE from 'three';
import {
  ATTACH_ANIM_S,
  ATTACH_SQUASH,
  ATTACH_EMBED_K,
  STUCK_CAP,
  BURIAL_RATIO,
  BURIAL_MIN_REL,
  BURIAL_STAGGER_S,
  BALL_COLOR_LERP,
  KNOCKOFF_MAX,
  KNOCKOFF_POP_SPEED_K,
} from '../config/tuning.js';
import { TIERS, ARCH_PER_TIER } from '../config/tiers.js';
import {
  ARCHETYPE_ID_BY_CODE,
  EXTRA_CODE_BASE,
  OSM_CODE_BASE,
  OSM_ARCHETYPE_IDS,
  V5_CODE_BASE,
  V5_ARCHETYPE_IDS,
} from '../world/objects.js';
import { FreeList, IntRing } from '../core/pool.js';
import { mulberry32 } from '../core/rng.js';
import { easeOutCubic, lerp, damp } from '../core/mathUtils.js';
import { bus } from '../core/events.js';

/** @typedef {import('../types.js').BallState} BallState */
/** @typedef {import('../types.js').StuckRecord} StuckRecord */
/** @typedef {import('../types.js').WorldReentry} WorldReentry */

/* ------------------------------------------------------------------ */
/* Constants / scratch                                                 */
/* ------------------------------------------------------------------ */

/** Number of stuck InstancedMesh families (draw-call ledger: 8 stuck pools). */
const FAMILY_COUNT = 8;
/** Slots per family pool (STUCK_CAP total). */
const FAMILY_CAP = STUCK_CAP / FAMILY_COUNT;
/** Ring mask — STUCK_CAP must be a power of two (512). */
const RING_MASK = STUCK_CAP - 1;
/** Icosphere subdivision for the ball core (3 -> 1280 tris, per DESIGN). */
const CORE_SUBDIV = 3;
/** Max core lumpiness amplitude (unit-sphere local units). */
const LUMP_MAX = 0.12;
/** Absorb count at which lumpiness reaches ~63% of LUMP_MAX. */
const LUMP_COUNT_SCALE = 120;
/** Halflife for the lumpiness uniform easing toward its target (s). */
const LUMP_HALFLIFE_S = 0.6;
/** Knock-off ejection clearance multiplier (just outside the surface). */
const EJECT_CLEARANCE = 1.05;
/** Upward bias added to the knock-off ejection direction. */
const EJECT_UP_BIAS = 0.8;

const UP = new THREE.Vector3(0, 1, 0);

// Module-level scratch — used only within single function bodies in this file.
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _q3 = new THREE.Quaternion();
const _m1 = new THREE.Matrix4();
const _s1 = new THREE.Vector3();
const _color = new THREE.Color();
/** Degenerate zero-scale matrix used to kill instances (pre-raster rejected). */
const _zeroM = new THREE.Matrix4().makeScale(0, 0, 0);

/** Fallback tint palettes per family (used when attachStuck gets no colorHex). */
const FAMILY_PALETTES = [
  [0xe8634a, 0xf2a65a, 0xd94f4f, 0xf7d08a],
  [0x5aa9e6, 0x7fc8f8, 0x4a7bd9, 0xa3d5ff],
  [0x7ec850, 0xa8d977, 0x4f9d3f, 0xc6e6a3],
  [0xf2c14e, 0xf7e07e, 0xe09f3e, 0xfff1b6],
  [0x9b6bd9, 0xb98ee6, 0x7d4fc0, 0xd9c2f0],
  [0xe66ba2, 0xf2a0c0, 0xd94f8a, 0xf9d0e1],
  [0x5ad0c8, 0x8ae6df, 0x3aa8a0, 0xbef2ed],
  [0xc0c5ce, 0xe3e6ea, 0x9aa1ad, 0xf5f6f8],
];

/** Flat CHUNK archetype-id table: code = tier*ARCH_PER_TIER + slot -> id
 *  (frozen in tiers.js; 70 entries incl. landmark slots 8/9 — knockOff must
 *  resolve any CHUNK code back to its catalog id; EXTRA codes >= 70 never
 *  reach the lookup because knockOff skips them). Derived independently from
 *  TIERS so the dev cross-assert below catches a tiers/objects divergence. */
const ARCHETYPE_IDS = (() => {
  const ids = new Array(TIERS.length * ARCH_PER_TIER);
  for (let t = 0; t < TIERS.length; t++) {
    const a = TIERS[t].archetypeIds;
    for (let s = 0; s < ARCH_PER_TIER; s++) ids[t * ARCH_PER_TIER + s] = a[s];
  }
  return ids;
})();

/**
 * v4 STUCK-FAMILY MAP for OSM voxel-building codes 94..109 (DESIGN-V4
 * Stream C): index = code - OSM_CODE_BASE, value = proxy family. Buildings
 * fold ONLY onto the building-shaped proxies — 0 boxy (low/square masses),
 * 4 flat slab (long row/shed masses), 5 tall pillar (towers) — never onto
 * cylinder/cone/ring/gem, which would read as absurd debris at T3-T5 where
 * buildings dominate absorbs. Order mirrors the frozen OSM_ARCHETYPE_IDS.
 */
const OSM_STUCK_FAMILY = Uint8Array.from([
  0, // 94  osm_house            -> boxy
  0, // 95  osm_shop_low         -> boxy
  5, // 96  osm_zakkyo           -> tall pillar
  5, // 97  osm_office_mid       -> tall pillar
  5, // 98  osm_office_tower     -> tall pillar
  5, // 99  osm_apartment_tower  -> tall pillar
  5, // 100 osm_hotel            -> tall pillar
  4, // 101 osm_school           -> flat slab
  0, // 102 osm_temple           -> boxy
  0, // 103 osm_shrine           -> boxy
  4, // 104 osm_station          -> flat slab
  4, // 105 osm_warehouse        -> flat slab
  0, // 106 osm_parking          -> boxy
  4, // 107 osm_merged_block     -> flat slab
  5, // 108 osm_tower_generic    -> tall pillar
  5, // 109 osm_stepped_roof     -> tall pillar
]);

/**
 * v5 STUCK-FAMILY MAP for curated codes 110..114 (objects.js V5_CODE_BASE):
 * index = code - V5_CODE_BASE, value = proxy family. Same building-proxy
 * rule as OSM (0 boxy / 4 flat slab / 5 tall pillar); stack_chan is itself
 * a cube, so the boxy proxy IS its silhouette. Order mirrors the frozen
 * V5_ARCHETYPE_IDS. Codes 110..114 are >= EXTRA_CODE_BASE, so knockOff's
 * skip keeps them permanently stuck (no reinject path).
 */
const V5_STUCK_FAMILY = Uint8Array.from([
  0, // 110 stack_chan      -> boxy (it IS a cube)
  0, // 111 game_center     -> boxy
  5, // 112 denki_retailer  -> tall pillar
  0, // 113 maid_cafe       -> boxy
  5, // 114 pc_parts_bldg   -> tall pillar
]);

/* Boot DEV cross-assert (v3 stride migration + v4 OSM codes): the chunk
   table must agree with objects.js ARCHETYPE_ID_BY_CODE entry-for-entry
   across all 70 chunk codes, and objects.js must carry the full 110
   (70 chunk + 24 EXTRA + 16 OSM — DESIGN-V4 Phase-0 appendix §B). */
if (import.meta.env && import.meta.env.DEV) {
  if (ARCHETYPE_IDS.length !== 70 || EXTRA_CODE_BASE !== 70) {
    throw new Error(
      `[ball.js invariant] chunk archetype table must have 70 entries with EXTRA_CODE_BASE 70 ` +
        `(ball ${ARCHETYPE_IDS.length}, base ${EXTRA_CODE_BASE})`
    );
  }
  if (ARCHETYPE_ID_BY_CODE.length !== 115) {
    throw new Error(
      `[ball.js invariant] objects.js ARCHETYPE_ID_BY_CODE must have 115 entries ` +
        `(70 chunk + 24 EXTRA + 16 OSM + 5 v5), found ${ARCHETYPE_ID_BY_CODE.length}`
    );
  }
  for (let c = 0; c < 70; c++) {
    if (ARCHETYPE_IDS[c] !== ARCHETYPE_ID_BY_CODE[c]) {
      throw new Error(
        `[ball.js invariant] code ${c} mismatch vs objects.js: ` +
          `'${ARCHETYPE_IDS[c]}' !== '${ARCHETYPE_ID_BY_CODE[c]}'`
      );
    }
  }
  // v4: the knockOff permanently-stuck law must keep covering OSM codes, and
  // the stuck-family table must span exactly the 16 frozen OSM codes onto
  // building proxies only (0 box / 4 slab / 5 pillar).
  if (!(OSM_CODE_BASE >= EXTRA_CODE_BASE) || OSM_CODE_BASE !== 94) {
    throw new Error(
      `[ball.js invariant] OSM_CODE_BASE must be 94 and >= EXTRA_CODE_BASE (${EXTRA_CODE_BASE}) ` +
        `so the knockOff skip keeps OSM permanently stuck — found ${OSM_CODE_BASE}`
    );
  }
  if (OSM_STUCK_FAMILY.length !== OSM_ARCHETYPE_IDS.length || OSM_STUCK_FAMILY.length !== 16) {
    throw new Error(
      `[ball.js invariant] OSM_STUCK_FAMILY must map all 16 OSM codes ` +
        `(found ${OSM_STUCK_FAMILY.length} vs ${OSM_ARCHETYPE_IDS.length} ids)`
    );
  }
  for (let o = 0; o < OSM_STUCK_FAMILY.length; o++) {
    const f = OSM_STUCK_FAMILY[o];
    if (f !== 0 && f !== 4 && f !== 5) {
      throw new Error(
        `[ball.js invariant] OSM_STUCK_FAMILY[${o}] ('${OSM_ARCHETYPE_IDS[o]}') = ${f} — ` +
          `OSM buildings may fold only onto building proxies 0/4/5`
      );
    }
  }
  // v5: codes 110..114 must stay covered by the >= EXTRA_CODE_BASE knockOff
  // skip, and the v5 stuck-family table must span exactly the 5 frozen v5
  // codes onto building proxies only (0 box / 4 slab / 5 pillar).
  if (!(V5_CODE_BASE >= EXTRA_CODE_BASE) || V5_CODE_BASE !== OSM_CODE_BASE + OSM_STUCK_FAMILY.length) {
    throw new Error(
      `[ball.js invariant] V5_CODE_BASE must be 110 (= OSM_CODE_BASE + 16) and >= EXTRA_CODE_BASE ` +
        `(${EXTRA_CODE_BASE}) so the knockOff skip keeps v5 codes permanently stuck — found ${V5_CODE_BASE}`
    );
  }
  if (V5_STUCK_FAMILY.length !== V5_ARCHETYPE_IDS.length || V5_STUCK_FAMILY.length !== 5) {
    throw new Error(
      `[ball.js invariant] V5_STUCK_FAMILY must map all 5 v5 codes ` +
        `(found ${V5_STUCK_FAMILY.length} vs ${V5_ARCHETYPE_IDS.length} ids)`
    );
  }
  for (let v = 0; v < V5_STUCK_FAMILY.length; v++) {
    const f = V5_STUCK_FAMILY[v];
    if (f !== 0 && f !== 4 && f !== 5) {
      throw new Error(
        `[ball.js invariant] V5_STUCK_FAMILY[${v}] ('${V5_ARCHETYPE_IDS[v]}') = ${f} — ` +
          `v5 codes may fold only onto building proxies 0/4/5`
      );
    }
  }
}

/**
 * Build the 8 low-poly proxy geometries (unit bounding radius each).
 * @returns {THREE.BufferGeometry[]}
 */
function buildFamilyGeometries() {
  const cube = 2 / Math.sqrt(3); // box edge whose bounding radius is 1
  return [
    new THREE.BoxGeometry(cube, cube, cube), // 0: boxy
    new THREE.IcosahedronGeometry(1, 1), // 1: roundish
    new THREE.CylinderGeometry(0.62, 0.62, 1.55, 8), // 2: cylinder
    new THREE.ConeGeometry(0.7, 1.6, 8), // 3: cone
    new THREE.BoxGeometry(1.7, 0.55, 1.05), // 4: flat slab
    new THREE.BoxGeometry(0.62, 1.8, 0.62), // 5: tall pillar
    new THREE.TorusGeometry(0.7, 0.28, 6, 10), // 6: ring
    new THREE.DodecahedronGeometry(1, 0), // 7: gem
  ];
}

/* ------------------------------------------------------------------ */
/* Ball                                                                */
/* ------------------------------------------------------------------ */

/**
 * The katamari: core mesh + stuck-object pools, all inside one Group that
 * ScaleManager rescales (group.scale *= S via rescaleState). Frame-order
 * step 5: ball.update(dt, ballState).
 */
export class Ball {
  /**
   * @param {THREE.Scene} scene Scene to attach the ball group to.
   * @param {Object<string, THREE.BufferGeometry>|null} [geos] Catalog geometries
   *   from geometryFactory — accepted for signature compatibility but unused:
   *   stuck pools render 8 internal proxy geometries (one geometry per
   *   InstancedMesh; see file header).
   * @param {import('../core/events.js').EventBus} [eventBus] Unused today (kept
   *   for symmetric wiring); ball is driven by direct calls from absorb/main.
   */
  // eslint-disable-next-line no-unused-vars
  constructor(scene, geos = null, eventBus = bus) {
    /** @type {THREE.Group} The ballGroup — ScaleManager multiplies .scale by S. */
    this.group = new THREE.Group();
    scene.add(this.group);

    /** @type {number} Live + animating stuck object count. */
    this.stuckCount = 0;

    // Deterministic cosmetic RNG (yaw spins, fallback tints).
    this._rng = mulberry32(0x9e3779b9);

    // ---- core icosphere with noise displacement + color swirl -------------
    this._uLump = { value: 0 };
    this._uColorA = { value: new THREE.Color(0x69c6c2) };
    this._uColorB = { value: new THREE.Color(0x3f7e7b) };
    this._lumpTarget = 0;
    this._absorbCount = 0;

    const coreGeo = new THREE.IcosahedronGeometry(1, CORE_SUBDIV);
    const coreMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const uLump = this._uLump;
    const uColorA = this._uColorA;
    const uColorB = this._uColorB;
    coreMat.onBeforeCompile = (shader) => {
      shader.uniforms.uLump = uLump;
      shader.uniforms.uColorA = uColorA;
      shader.uniforms.uColorB = uColorB;
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\n' +
            'uniform float uLump;\n' +
            'varying float vSwirl;\n' +
            'float ballNoise(vec3 p){return sin(p.x*5.7+p.y*3.1)*sin(p.y*6.3+p.z*2.7)*sin(p.z*4.9+p.x*3.7);}'
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n' +
            'float bn = ballNoise(position * 1.6);\n' +
            'vSwirl = 0.5 + 0.5 * sin(position.x*3.1 + position.y*2.3 + position.z*2.9 + bn*2.0);\n' +
            'transformed += normal * (bn * uLump);'
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform vec3 uColorA;\nuniform vec3 uColorB;\nvarying float vSwirl;'
        )
        .replace(
          '#include <color_fragment>',
          '#include <color_fragment>\ndiffuseColor.rgb *= mix(uColorB, uColorA, vSwirl);'
        );
    };
    coreMat.customProgramCacheKey = () => 'fable-ball-core';

    /** @type {THREE.Mesh} */
    this._core = new THREE.Mesh(coreGeo, coreMat);
    this._core.frustumCulled = false;
    this.group.add(this._core);

    // ---- 8 stuck pools ------------------------------------------------------
    const stuckMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const familyGeos = buildFamilyGeometries();
    /** @type {THREE.InstancedMesh[]} */
    this._meshes = new Array(FAMILY_COUNT);
    /** @type {FreeList[]} */
    this._slots = new Array(FAMILY_COUNT);
    for (let f = 0; f < FAMILY_COUNT; f++) {
      const mesh = new THREE.InstancedMesh(familyGeos[f], stuckMat, FAMILY_CAP);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      for (let s = 0; s < FAMILY_CAP; s++) {
        mesh.setMatrixAt(s, _zeroM); // dead slots are zero-scale
        mesh.setColorAt(s, _color.setHex(0xffffff)); // allocate instanceColor at boot
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor !== null) mesh.instanceColor.needsUpdate = true;
      this.group.add(mesh);
      this._meshes[f] = mesh;
      this._slots[f] = new FreeList(FAMILY_CAP);
    }

    // ---- records (512-slot ring) -------------------------------------------
    /** @type {Array<object>} Preallocated stuck records (see StuckRecord typedef + anim fields). */
    this._recs = new Array(STUCK_CAP);
    for (let i = 0; i < STUCK_CAP; i++) {
      this._recs[i] = {
        /** @type {StuckRecord['stage']} */ stage: 'culled',
        archetypeFamily: 0,
        slot: -1,
        attachRadiusSim: 0,
        objHalfSim: 0,
        code: 0,
        gen: 0,
        animT: 0,
        scale: 0,
        sx: 0, sy: 0, sz: 0, // anim start (ball-local)
        tx: 0, ty: 0, tz: 0, // socket (ball-local)
        qx: 0, qy: 0, qz: 0, qw: 1, // socket orientation (ball-local)
      };
    }
    /** @type {number} Monotonic ring write cursor (next record = _tail & RING_MASK). */
    this._tail = 0;
    /** @type {IntRing} Queue of packed (gen<<9 | idx) animating records. */
    this._animRing = new IntRing(STUCK_CAP);
    /** @type {number} Staggered burial sweep cursor (0..STUCK_CAP-1). */
    this._sweepIdx = 0;
    /** @type {number} Fractional sweep-step accumulator. */
    this._sweepAcc = 0;

    // Dirty instance-matrix range per family (slot indices), for updateRanges.
    this._dirtyMin = new Int32Array(FAMILY_COUNT).fill(0x7fffffff);
    this._dirtyMax = new Int32Array(FAMILY_COUNT).fill(-1);

    // ---- knock-off reentry scratch (reused, consume synchronously) ---------
    /** @type {WorldReentry[]} Backing records. */
    this._reentries = new Array(KNOCKOFF_MAX);
    for (let i = 0; i < KNOCKOFF_MAX; i++) {
      this._reentries[i] = {
        archetypeId: '',
        radiusSim: 0,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
      };
    }
    /** @type {WorldReentry[]} Reused return array (length set per call). */
    this._reentryOut = [];
  }

  /* ---------------------------------------------------------------- */
  /* Attach                                                            */
  /* ---------------------------------------------------------------- */

  /**
   * Absorb hand-off: stick store object objIndex onto the ball. Reads the SoA
   * fields synchronously (the slot may be freed by the caller right after —
   * never deref objIndex on a later frame). Starts the ATTACH_ANIM_S squash
   * animation from the object's current world position to its ball-surface
   * socket, then the matrix is final (write-once).
   * @param {number} objIndex ObjectStore index being absorbed.
   * @param {{px:Float32Array,py:Float32Array,pz:Float32Array,radius:Float32Array,archetype:Uint16Array}} store ObjectStore (SoA).
   * @param {BallState} ball Ball truth at the moment of absorb.
   * @param {number} [colorHex] Tint of the absorbed instance; -1 = pick from the family fallback palette.
   */
  attachStuck(objIndex, store, ball, colorHex = -1) {
    const code = store.archetype[objIndex];
    // Stride 10: slot-in-tier folds to the 8 proxy families; landmark slots
    // 8/9 land on families 0/1 (boxy/roundish proxies). v3 EXTRA codes
    // 70..93 fold with the same formula (and become permanently stuck —
    // knockOff skips code >= EXTRA_CODE_BASE). v4: OSM codes 94..109 map
    // through OSM_STUCK_FAMILY onto building proxies 0/4/5 only. v5: codes
    // 110..114 map through V5_STUCK_FAMILY (the OSM branch must NOT swallow
    // them — code - OSM_CODE_BASE would index out of the 16-entry table).
    const family =
      code >= V5_CODE_BASE
        ? V5_STUCK_FAMILY[code - V5_CODE_BASE]
        : code >= OSM_CODE_BASE
          ? OSM_STUCK_FAMILY[code - OSM_CODE_BASE]
          : (code % ARCH_PER_TIER) & 7;
    const objR = store.radius[objIndex];
    const sg = this.group.scale.x;

    // ---- ring slot (cull whatever the ring wrapped onto) -------------------
    const idx = this._tail & RING_MASK;
    this._tail++;
    const rec = this._recs[idx];
    if (rec.stage !== 'culled') this._cullRecord(rec);

    // ---- family instance slot (steal oldest of family when full) -----------
    let slot = this._slots[family].alloc();
    if (slot === -1) {
      this._cullOldestOfFamily(family);
      slot = this._slots[family].alloc();
      if (slot === -1) return; // family cap 0 — cannot happen with FAMILY_CAP>0
    }

    // ---- ball-local socket math (see file header) ---------------------------
    _v1.set(
      store.px[objIndex] - ball.pos.x,
      store.py[objIndex] - ball.pos.y,
      store.pz[objIndex] - ball.pos.z
    );
    _q1.copy(ball.quat).invert();
    // Anim start: current world offset, in ball-local units.
    _v2.copy(_v1).applyQuaternion(_q1).divideScalar(sg);
    // Surface direction (world): degenerate centers get a deterministic spread.
    if (_v1.lengthSq() < 1e-12) {
      const a = this._rng() * Math.PI * 2;
      _v1.set(Math.cos(a), 0.3, Math.sin(a));
    }
    _v1.normalize();
    // Socket position (ball-local).
    _v3.copy(_v1)
      .multiplyScalar(ball.radiusSim * ATTACH_EMBED_K)
      .applyQuaternion(_q1)
      .divideScalar(sg);
    // Socket orientation: object 'up' along the local surface normal + random spin.
    _v1.applyQuaternion(_q1).normalize(); // dir in ball-local
    _q2.setFromUnitVectors(UP, _v1);
    _q3.setFromAxisAngle(_v1, this._rng() * Math.PI * 2);
    _q3.multiply(_q2);

    rec.stage = 'animating';
    rec.archetypeFamily = family;
    rec.slot = slot;
    rec.attachRadiusSim = ball.radiusSim;
    rec.objHalfSim = objR;
    rec.code = code;
    rec.gen = (rec.gen + 1) & 0x3fffff;
    rec.animT = 0;
    rec.scale = objR / sg;
    rec.sx = _v2.x; rec.sy = _v2.y; rec.sz = _v2.z;
    rec.tx = _v3.x; rec.ty = _v3.y; rec.tz = _v3.z;
    rec.qx = _q3.x; rec.qy = _q3.y; rec.qz = _q3.z; rec.qw = _q3.w;
    this.stuckCount++;

    // First matrix write: start pose with the squash overshoot.
    this._writeRecMatrix(rec, rec.sx, rec.sy, rec.sz, rec.scale * ATTACH_SQUASH);

    // Tint.
    const mesh = this._meshes[family];
    if (colorHex >= 0) {
      _color.setHex(colorHex);
    } else {
      const pal = FAMILY_PALETTES[family];
      _color.setHex(pal[(this._rng() * pal.length) | 0]);
    }
    mesh.setColorAt(slot, _color);
    if (mesh.instanceColor !== null) mesh.instanceColor.needsUpdate = true;

    // Ball core remembers its history: swirl colors + lumpiness.
    this._uColorB.value.lerp(this._uColorA.value, 0.3);
    this._uColorA.value.lerp(_color, BALL_COLOR_LERP);
    this._absorbCount++;
    this._lumpTarget = LUMP_MAX * (1 - Math.exp(-this._absorbCount / LUMP_COUNT_SCALE));

    // Queue the attach animation. If the queue is saturated with stale
    // entries (attach storm with no update between), skip the animation and
    // finalize the write-once socket pose immediately — a record must never
    // be left in 'animating' with no queue entry (it would never go live or
    // be burial-culled).
    if (!this._animRing.push((rec.gen << 9) | idx)) {
      rec.stage = 'live';
      this._writeRecMatrix(rec, rec.tx, rec.ty, rec.tz, rec.scale);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Knock-off                                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Eject the NEWEST n stuck objects with a ballistic pop (hard-bonk beat).
   * Returns a REUSED array of REUSED WorldReentry records — the caller
   * (absorb.js / spawner) must consume them synchronously, never retain.
   * v3 (MAJOR 4): entries with archetype code >= EXTRA_CODE_BASE (70) are
   * SKIPPED — EXTRA landmarks/collectibles are permanently stuck trophies
   * (the ring walks past them to older chunk-coded entries instead).
   * @param {number} n How many to eject (clamped to KNOCKOFF_MAX and availability).
   * @param {BallState} ball Ball truth (ejection origin/velocity basis).
   * @returns {WorldReentry[]} 0..n reentry records.
   */
  knockOff(n, ball) {
    let want = n | 0;
    if (want > KNOCKOFF_MAX) want = KNOCKOFF_MAX;
    const sg = this.group.scale.x;
    let found = 0;
    for (let k = 1; k <= STUCK_CAP && found < want; k++) {
      const rec = this._recs[(this._tail - k) & RING_MASK];
      if (rec.stage === 'culled') continue;
      if (rec.code >= EXTRA_CODE_BASE) continue; // v3 EXTRA + v4 OSM (94+) = permanently stuck
      const re = this._reentries[found];
      // World-space socket direction from the ball-local socket.
      _v1.set(rec.tx, rec.ty, rec.tz).multiplyScalar(sg).applyQuaternion(ball.quat);
      if (_v1.lengthSq() < 1e-12) _v1.set(0, 1, 0);
      _v1.normalize();
      re.pos
        .copy(ball.pos)
        .addScaledVector(_v1, (ball.radiusSim + rec.objHalfSim) * EJECT_CLEARANCE);
      _v2.copy(_v1);
      _v2.y += EJECT_UP_BIAS;
      _v2.normalize().multiplyScalar(KNOCKOFF_POP_SPEED_K * ball.radiusSim);
      re.vel.copy(_v2);
      re.radiusSim = rec.objHalfSim;
      re.archetypeId = ARCHETYPE_IDS[rec.code];
      this._cullRecord(rec);
      found++;
    }
    this._reentryOut.length = found;
    for (let i = 0; i < found; i++) this._reentryOut[i] = this._reentries[i];
    return this._reentryOut;
  }

  /* ---------------------------------------------------------------- */
  /* Per-frame update (frame-order step 5)                             */
  /* ---------------------------------------------------------------- */

  /**
   * Sync the group to ball truth, advance attach animations, run the
   * staggered burial sweep, ease core uniforms, flush dirty instance ranges.
   * @param {number} dt Render-frame delta (s).
   * @param {BallState} ball Ball truth (read-only).
   */
  update(dt, ball) {
    const sg = this.group.scale.x;
    this.group.position.copy(ball.pos);
    this.group.quaternion.copy(ball.quat);
    const coreScale = (ball.radiusVisualSim > 0 ? ball.radiusVisualSim : ball.radiusSim) / sg;
    this._core.scale.setScalar(coreScale);

    // ---- attach animations --------------------------------------------------
    const animCount = this._animRing.length;
    for (let i = 0; i < animCount; i++) {
      const packed = this._animRing.shift();
      const idx = packed & RING_MASK;
      const rec = this._recs[idx];
      if (rec.gen !== packed >>> 9 || rec.stage !== 'animating') continue; // stale entry
      rec.animT += dt / ATTACH_ANIM_S;
      if (rec.animT >= 1) {
        // Final, write-once socket pose.
        rec.stage = 'live';
        this._writeRecMatrix(rec, rec.tx, rec.ty, rec.tz, rec.scale);
      } else {
        const e = easeOutCubic(rec.animT);
        this._writeRecMatrix(
          rec,
          lerp(rec.sx, rec.tx, e),
          lerp(rec.sy, rec.ty, e),
          lerp(rec.sz, rec.tz, e),
          rec.scale * lerp(ATTACH_SQUASH, 1, e)
        );
        this._animRing.push(packed);
      }
    }

    // ---- staggered burial / sub-pixel cull ----------------------------------
    this._sweepAcc += (STUCK_CAP * dt) / BURIAL_STAGGER_S;
    let steps = this._sweepAcc | 0;
    this._sweepAcc -= steps;
    if (steps > STUCK_CAP) steps = STUCK_CAP;
    const curR = ball.radiusSim;
    const buriedBelow = BURIAL_RATIO * curR;
    const minHalf = (BURIAL_MIN_REL * curR) / 2;
    for (let i = 0; i < steps; i++) {
      const rec = this._recs[this._sweepIdx];
      this._sweepIdx = (this._sweepIdx + 1) & RING_MASK;
      if (rec.stage !== 'live') continue;
      if (rec.attachRadiusSim + rec.objHalfSim < buriedBelow || rec.objHalfSim < minHalf) {
        this._cullRecord(rec);
      }
    }

    // ---- core uniforms -------------------------------------------------------
    this._uLump.value = damp(this._uLump.value, this._lumpTarget, LUMP_HALFLIFE_S, dt);

    // ---- flush dirty matrix ranges (one needsUpdate per touched mesh) -------
    for (let f = 0; f < FAMILY_COUNT; f++) {
      const max = this._dirtyMax[f];
      if (max < 0) continue;
      const min = this._dirtyMin[f];
      const attr = this._meshes[f].instanceMatrix;
      attr.clearUpdateRanges();
      attr.addUpdateRange(min * 16, (max - min + 1) * 16);
      attr.needsUpdate = true;
      this._dirtyMin[f] = 0x7fffffff;
      this._dirtyMax[f] = -1;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Rescale / reset                                                   */
  /* ---------------------------------------------------------------- */

  /**
   * One-frame similarity rescale hook — ScaleManager calls this synchronously
   * BETWEEN update and render. ballGroup.scale *= S makes stuck instances and
   * the core ride along for free (ball-local matrices untouched); record
   * bookkeeping radii are kept in CURRENT sim units so burial math stays direct.
   * @param {number} S Similarity factor (RESCALE_S = 0.2).
   */
  rescaleState(S) {
    this.group.scale.multiplyScalar(S);
    for (let i = 0; i < STUCK_CAP; i++) {
      const rec = this._recs[i];
      if (rec.stage === 'culled') continue;
      rec.attachRadiusSim *= S;
      rec.objHalfSim *= S;
    }
  }

  /**
   * v2 FROZEN INTERFACE (consumer: game/finale.js MERGE state): show/hide the
   * whole katamari group (core + stuck pools) in one flag flip.
   * @param {boolean} b Visible.
   */
  setVisible(b) {
    this.group.visible = b;
  }

  /** Full reset (game restart): drop all stuck objects, reset core memory. */
  reset() {
    for (let i = 0; i < STUCK_CAP; i++) {
      const rec = this._recs[i];
      if (rec.stage !== 'culled') this._cullRecord(rec);
    }
    for (let f = 0; f < FAMILY_COUNT; f++) {
      // Flush the zero-scale kills written by _cullRecord immediately.
      const attr = this._meshes[f].instanceMatrix;
      attr.clearUpdateRanges();
      attr.needsUpdate = true;
      this._dirtyMin[f] = 0x7fffffff;
      this._dirtyMax[f] = -1;
    }
    this._animRing.clear();
    this._tail = 0;
    this._sweepIdx = 0;
    this._sweepAcc = 0;
    this.stuckCount = 0;
    this._absorbCount = 0;
    this._lumpTarget = 0;
    this._uLump.value = 0;
    this._uColorA.value.setHex(0x69c6c2);
    this._uColorB.value.setHex(0x3f7e7b);
    this.group.scale.set(1, 1, 1);
    this.group.position.set(0, 0, 0);
    this.group.quaternion.identity();
    this.group.visible = true; // v2: undo finale MERGE setVisible(false) on restart
  }

  /* ---------------------------------------------------------------- */
  /* Internals                                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Compose + write one record's instance matrix (ball-local) and mark the
   * family's dirty range.
   * @param {object} rec Stuck record.
   * @param {number} x @param {number} y @param {number} z Ball-local position.
   * @param {number} scale Uniform ball-local scale.
   */
  _writeRecMatrix(rec, x, y, z, scale) {
    _q1.set(rec.qx, rec.qy, rec.qz, rec.qw);
    _v1.set(x, y, z);
    _s1.set(scale, scale, scale);
    _m1.compose(_v1, _q1, _s1);
    this._meshes[rec.archetypeFamily].setMatrixAt(rec.slot, _m1);
    this._markDirty(rec.archetypeFamily, rec.slot);
  }

  /**
   * Zero-scale a record's instance and reclaim its slot.
   * @param {object} rec Stuck record (stage !== 'culled').
   */
  _cullRecord(rec) {
    this._meshes[rec.archetypeFamily].setMatrixAt(rec.slot, _zeroM);
    this._markDirty(rec.archetypeFamily, rec.slot);
    this._slots[rec.archetypeFamily].free(rec.slot);
    rec.slot = -1;
    rec.stage = 'culled';
    this.stuckCount--;
  }

  /**
   * Free the oldest non-culled record of a family (ring pressure relief).
   * @param {number} family 0..7.
   */
  _cullOldestOfFamily(family) {
    for (let k = 0; k < STUCK_CAP; k++) {
      const rec = this._recs[(this._tail + k) & RING_MASK]; // _tail & mask = oldest position
      if (rec.stage !== 'culled' && rec.archetypeFamily === family) {
        this._cullRecord(rec);
        return;
      }
    }
  }

  /**
   * Track the min/max touched slot per family for updateRanges partial uploads.
   * @param {number} family 0..7. @param {number} slot Slot index.
   */
  _markDirty(family, slot) {
    if (slot < this._dirtyMin[family]) this._dirtyMin[family] = slot;
    if (slot > this._dirtyMax[family]) this._dirtyMax[family] = slot;
  }
}
