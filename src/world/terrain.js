/**
 * @file terrain.js — CityTerrain: the ONLY authored collision in v3 besides
 * absorb pushback (Stream B; docs/DESIGN-V3.md §箱庭東京マップ A/D).
 *
 * Owns, in collide() order (called once per fixed substep by BallPhysics
 * AFTER XZ integration — Phase-0 documented exception #2):
 *  1. Shop walls W1-W5 + prisms P1-P4 (circle-vs-AABB in XZ, footprint
 *     blocked at any height) — PRE-RELEASE ONLY. At trueRadius >=
 *     SHOP_TERRAIN_RELEASE_M the shop collision early-outs, the terrainMesh
 *     zero-scales over RELEASE_FADE_S and the camera boom clamp deactivates
 *     only AFTER the fade completes (one-shot — the single sanctioned
 *     structural handoff, exemptions ledger #6; world/curated.js mirrors the
 *     same latch for the elevated-item y-drop + shop-shell activation).
 *  2. PERMANENT Skytree base circle (SKYTREE_BASE_R_M * SKYTREE_COLLIDER_K =
 *     54 m real) — BOUNCE, never absorbs, never released. The validator
 *     asserts SKYTREE_COLLIDER_K < GOAL_CONTACT_PAD so the finale contact
 *     always fires before the ball can reach the collider; after
 *     EVT.GOAL_CONTACT the base test is skipped so the MERGE ball-lerp is
 *     never fought (re-armed by reset()).
 *  3. Map-bounds hard clamp + soft edge band: outward velocity *=
 *     EDGE_DAMP_PER_FRAME per 60 Hz substep within EDGE_SOFT_BAND_K * r of
 *     the edge (continuous in radius — seamless).
 *
 * Camera services (Stream A consumes via injection):
 *  - interiorAt01(x, z): 1 inside the shop interior, smooth 0 over a ~1.5 m
 *    band outside, 0 once the release fade completed (cameraRig crossfades
 *    with its own INTERIOR_FADE_S damp).
 *  - clampCameraBoom(ballPos, desired, out): 3D segment-vs-AABB over <= 9
 *    shop pieces; shortens the boom to the nearest hit minus
 *    CAM_WALL_MARGIN_K * radiusSim. False (no clamp) post-release-fade.
 *  - flightWallTest(x0, z0, x1, z1): XZ segment-vs-AABB, pre-release only.
 *
 * SCALE MODEL: all authored data is REAL METERS with ORIGIN = BALL START.
 * sim = real / worldScale - origin. worldScale is read LIVE from the injected
 * ScaleManager every collide (auto-correct across rescales AND devTeleport's
 * direct worldScale writes); the accumulated floating-origin shift is
 * tracked via the EVT.REBASE subscription (RESCALE scales it — the spawner
 * pattern, copied verbatim). The merged terrainMesh rides the same transform:
 * geometry in real meters, mesh.scale = 1/worldScale (* release fade),
 * mesh.position = (-originX, 0, -originZ).
 *
 * Zero per-frame allocation: every box is a flat preallocated array; collide
 * touches no heap. BOUNCE is emitted via the reused payload with a 0.25 s
 * cooldown (matches absorb.js's bonk cadence).
 */

import * as THREE from 'three';
import { SHOP, SKYTREE_POS, MAP_BOUNDS } from '../config/cityMap.js';
import { EVT, PAYLOADS } from '../core/events.js';
import {
  BOUNCE_RESTITUTION,
  CAM_WALL_MARGIN_K,
  EDGE_DAMP_PER_FRAME,
  EDGE_SOFT_BAND_K,
  FIXED_DT,
  SHOP_TERRAIN_RELEASE_M,
  SKYTREE_BASE_R_M,
  SKYTREE_COLLIDER_K,
  SPEED_K,
} from '../config/tuning.js';

/** @typedef {import('../types.js').BallState} BallState */

/** Release fade window (s): wall zero-scale + curated y-drop share it. */
const RELEASE_FADE_S = 0.6;
/** Min seconds between terrain BOUNCE emissions (matches absorb's bonk cooldown). */
const BOUNCE_COOLDOWN_S = 0.25;
/** Bounces softer than this fraction of speedCap emit nothing (resting contact). */
const BOUNCE_EMIT_MIN_FRAC = 0.05;
/** interiorAt01 falloff band OUTSIDE the interior rect (real meters). */
const INTERIOR_FALLOFF_M = 1.5;
/** Shop piece count: 5 walls + 4 prisms. */
const PIECE_CAP = 9;

/* Terrain mesh palette (vertex colors; warm shop-fixture tones). */
const WALL_COLOR = 0xcfc4ae;
const PRISM_COLORS = [0x8a7d68, 0x8a7d68, 0x9c8a6e, 0xa9906c]; // P1 P2 P3 P4

/**
 * v3 CityTerrain. Construct AFTER ScaleManager:
 *   const terrain = new CityTerrain(bus, scaleMgr);
 *   renderer.scene.add(terrain.mesh);   // +1 draw (ledger: 1 terrainMesh)
 * then inject into BallPhysics (collide) and CameraRig (clampBoom/interior01).
 */
export class CityTerrain {
  /**
   * @param {import('../core/events.js').EventBus} bus Shared bus (REBASE/RESCALE/GOAL_CONTACT).
   * @param {{ worldScale: number }} scaleMgr ScaleManager (worldScale read live).
   * @param {THREE.Scene|null} [scene] Optional convenience: adds this.mesh.
   */
  constructor(bus, scaleMgr, scene = null) {
    this._scale = scaleMgr;

    /* ---- shop pieces as real-meter AABBs (x0,z0,x1,z1,h) ---- */
    const n = SHOP.walls.length + SHOP.prisms.length;
    if (n > PIECE_CAP) throw new Error('[terrain] shop piece count exceeds PIECE_CAP');
    /** @type {Float64Array} packed [x0,z0,x1,z1,h] per piece, REAL meters. */
    this._box = new Float64Array(n * 5);
    let w = 0;
    for (const wall of SHOP.walls) {
      const ht = wall.thickness * 0.5;
      this._box[w++] = Math.min(wall.x0, wall.x1) - ht;
      this._box[w++] = Math.min(wall.z0, wall.z1) - ht;
      this._box[w++] = Math.max(wall.x0, wall.x1) + ht;
      this._box[w++] = Math.max(wall.z0, wall.z1) + ht;
      this._box[w++] = wall.yTop;
    }
    for (const p of SHOP.prisms) {
      this._box[w++] = p.x0;
      this._box[w++] = p.z0;
      this._box[w++] = p.x1;
      this._box[w++] = p.z1;
      this._box[w++] = p.h;
    }
    /** @type {number} Piece count. */
    this._pieces = n;

    /* ---- release latch + fade ---- */
    /** @type {boolean} */
    this._released = false;
    /** @type {number} Fade elapsed (s) once released. */
    this._releaseT = 0;
    /** @type {boolean} True from EVT.GOAL_CONTACT (skip the skytree base so
     *  the finale MERGE ball-lerp is never fought); reset() re-arms. */
    this._goalContacted = false;

    /* ---- bounce cooldown ---- */
    this._bounceCooldown = 0;

    /* ---- floating-origin shift (CURRENT sim units; spawner pattern) ---- */
    this._originX = 0;
    this._originZ = 0;

    /** @type {number} Last seen ball radius (sim) — camera margin input. */
    this._lastBallR = 1;

    /** @type {THREE.Mesh} One merged vertex-colored mesh (+1 draw). */
    this.mesh = this._buildMesh();
    if (scene !== null) scene.add(this.mesh);
    this._syncMesh();

    /* ---- bus subscriptions (bound once) ---- */
    bus.on(EVT.RESCALE, (p) => {
      this._originX *= p.S;
      this._originZ *= p.S;
      this._syncMesh();
    });
    bus.on(EVT.REBASE, (p) => {
      this._originX += p.sx;
      this._originZ += p.sz;
      this._syncMesh();
    });
    bus.on(EVT.GOAL_CONTACT, () => {
      this._goalContacted = true;
    });
    this._bus = bus;
  }

  /* ---------------------------------------------------------------- */
  /* Public state                                                      */
  /* ---------------------------------------------------------------- */

  /** True once the shop terrain released (trueRadius >= SHOP_TERRAIN_RELEASE_M). */
  get released() {
    return this._released;
  }

  /** True once the release fade window finished (camera clamp off AFTER this). */
  get releaseFadeDone() {
    return this._released && this._releaseT >= RELEASE_FADE_S;
  }

  /**
   * Full reset (resetWorld — runs AFTER scaleMgr.reset so worldScale is
   * fresh): re-arm the release latch, restore the mesh, clear the origin.
   */
  reset() {
    this._released = false;
    this._releaseT = 0;
    this._goalContacted = false;
    this._bounceCooldown = 0;
    this._originX = 0;
    this._originZ = 0;
    this.mesh.visible = true;
    this._syncMesh();
  }

  /* ---------------------------------------------------------------- */
  /* collide — once per fixed substep, AFTER XZ integration            */
  /* ---------------------------------------------------------------- */

  /**
   * Resolve ball-vs-terrain. Mutates state.pos / state.vel in place.
   * @param {BallState} state Ball truth (radiusSim, pos, vel).
   */
  collide(state) {
    const ws = this._scale.worldScale;
    const invWS = 1 / ws;
    const ox = this._originX;
    const oz = this._originZ;
    const pos = state.pos;
    const vel = state.vel;
    const r = state.radiusSim;
    this._lastBallR = r;

    if (this._bounceCooldown > 0) this._bounceCooldown -= FIXED_DT;

    /* --- release latch + fade clock (one-shot structural handoff) --- */
    if (!this._released) {
      if (r * ws >= SHOP_TERRAIN_RELEASE_M) {
        this._released = true;
        this._releaseT = 0;
      }
    } else if (this._releaseT < RELEASE_FADE_S) {
      this._releaseT += FIXED_DT;
      this._syncMesh(); // zero-scale fade (cheap scalar writes)
      if (this._releaseT >= RELEASE_FADE_S) this.mesh.visible = false;
    }

    /* --- 1. shop walls/prisms (pre-release only) --------------------- */
    if (!this._released) {
      const box = this._box;
      for (let i = 0; i < this._pieces; i++) {
        const o = i * 5;
        const x0 = box[o] * invWS - ox;
        const z0 = box[o + 1] * invWS - oz;
        const x1 = box[o + 2] * invWS - ox;
        const z1 = box[o + 3] * invWS - oz;
        this._circleVsAabb(state, x0, z0, x1, z1, r);
      }
    }

    /* --- 2. permanent Skytree base circle (never absorbs/releases) --- */
    if (!this._goalContacted) {
      const bx = SKYTREE_POS.x * invWS - ox;
      const bz = SKYTREE_POS.z * invWS - oz;
      const baseR = SKYTREE_BASE_R_M * SKYTREE_COLLIDER_K * invWS;
      const dx = pos.x - bx;
      const dz = pos.z - bz;
      const minD = r + baseR;
      const d2 = dx * dx + dz * dz;
      if (d2 < minD * minD) {
        const d = Math.sqrt(d2);
        let nx;
        let nz;
        if (d > 1e-9) {
          nx = dx / d;
          nz = dz / d;
        } else {
          nx = 1;
          nz = 0;
        }
        pos.x = bx + nx * minD;
        pos.z = bz + nz * minD;
        this._reflect(state, nx, nz);
      }
    }

    /* --- 3. map bounds: soft edge damping band + hard clamp ---------- */
    const minX = MAP_BOUNDS.x[0] * invWS - ox;
    const maxX = MAP_BOUNDS.x[1] * invWS - ox;
    const minZ = MAP_BOUNDS.z[0] * invWS - oz;
    const maxZ = MAP_BOUNDS.z[1] * invWS - oz;
    const band = EDGE_SOFT_BAND_K * r;

    if (pos.x < minX + band && vel.x < 0) vel.x *= EDGE_DAMP_PER_FRAME;
    else if (pos.x > maxX - band && vel.x > 0) vel.x *= EDGE_DAMP_PER_FRAME;
    if (pos.z < minZ + band && vel.z < 0) vel.z *= EDGE_DAMP_PER_FRAME;
    else if (pos.z > maxZ - band && vel.z > 0) vel.z *= EDGE_DAMP_PER_FRAME;

    if (pos.x < minX) {
      pos.x = minX;
      if (vel.x < 0) vel.x = 0;
    } else if (pos.x > maxX) {
      pos.x = maxX;
      if (vel.x > 0) vel.x = 0;
    }
    if (pos.z < minZ) {
      pos.z = minZ;
      if (vel.z < 0) vel.z = 0;
    } else if (pos.z > maxZ) {
      pos.z = maxZ;
      if (vel.z > 0) vel.z = 0;
    }
  }

  /**
   * One circle-vs-AABB resolution in XZ (footprint blocked at any height).
   * @param {BallState} state @param {number} x0 @param {number} z0
   * @param {number} x1 @param {number} z1 @param {number} r Ball radius (sim).
   */
  _circleVsAabb(state, x0, z0, x1, z1, r) {
    const pos = state.pos;
    // Closest point on the box to the ball center.
    const cx = pos.x < x0 ? x0 : pos.x > x1 ? x1 : pos.x;
    const cz = pos.z < z0 ? z0 : pos.z > z1 ? z1 : pos.z;
    const dx = pos.x - cx;
    const dz = pos.z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) return;

    let nx;
    let nz;
    let pen;
    if (d2 > 1e-12) {
      // Center outside the box: push along the closest-point normal
      // (rounded corners/ends for free).
      const d = Math.sqrt(d2);
      nx = dx / d;
      nz = dz / d;
      pen = r - d;
    } else {
      // Center inside the box (deep tunnel guard): exit via the nearest face.
      const dxMin = pos.x - x0;
      const dxMax = x1 - pos.x;
      const dzMin = pos.z - z0;
      const dzMax = z1 - pos.z;
      let best = dxMin;
      nx = -1;
      nz = 0;
      if (dxMax < best) {
        best = dxMax;
        nx = 1;
        nz = 0;
      }
      if (dzMin < best) {
        best = dzMin;
        nx = 0;
        nz = -1;
      }
      if (dzMax < best) {
        best = dzMax;
        nx = 0;
        nz = 1;
      }
      pen = best + r;
    }
    pos.x += nx * pen;
    pos.z += nz * pen;
    this._reflect(state, nx, nz);
  }

  /**
   * Reflect the normal velocity component (* BOUNCE_RESTITUTION, tangential
   * preserved) and emit EVT.BOUNCE under the cooldown.
   * @param {BallState} state @param {number} nx @param {number} nz
   */
  _reflect(state, nx, nz) {
    const vel = state.vel;
    const vn = vel.x * nx + vel.z * nz;
    if (vn >= 0) return; // already separating
    vel.x -= nx * vn * (1 + BOUNCE_RESTITUTION);
    vel.z -= nz * vn * (1 + BOUNCE_RESTITUTION);

    const frac = -vn / (SPEED_K * state.radiusSim);
    if (frac <= BOUNCE_EMIT_MIN_FRAC || this._bounceCooldown > 0) return;
    this._bounceCooldown = BOUNCE_COOLDOWN_S;
    PAYLOADS.bounce.impactSpeed01 = frac > 1 ? 1 : frac;
    this._bus.emit(EVT.BOUNCE, PAYLOADS.bounce);
  }

  /* ---------------------------------------------------------------- */
  /* Camera services (Stream A consumes)                               */
  /* ---------------------------------------------------------------- */

  /**
   * Interior factor at a SIM-space point: 1 deep inside the shop rect,
   * falling to 0 over INTERIOR_FALLOFF_M outside it; 0 once the release fade
   * completed. Radius-continuous; cameraRig crossfades the result over
   * INTERIOR_FADE_S.
   * @param {number} x Sim X. @param {number} z Sim Z.
   * @returns {number} 0..1
   */
  interiorAt01(x, z) {
    if (this.releaseFadeDone) return 0;
    const ws = this._scale.worldScale;
    const rx = (x + this._originX) * ws;
    const rz = (z + this._originZ) * ws;
    const sh = SHOP.interior;
    const dx = Math.max(sh.x0 - rx, 0, rx - sh.x1);
    const dz = Math.max(sh.z0 - rz, 0, rz - sh.z1);
    const d = Math.hypot(dx, dz); // 0 inside, meters outside
    if (d >= INTERIOR_FALLOFF_M) return 0;
    return 1 - d / INTERIOR_FALLOFF_M;
  }

  /**
   * Clamp the camera boom against the shop pieces: 3D segment from ballPos
   * to `desired` vs <= 9 AABBs (y in [0, pieceTop]); on hit, `out` is set to
   * the hit point pulled back by CAM_WALL_MARGIN_K * radiusSim along the
   * boom. Inactive (returns false) once the release fade completed —
   * deactivates only AFTER the fade (binding ordering).
   * @param {THREE.Vector3} ballPos Sim-space ball center.
   * @param {THREE.Vector3} desired Sim-space desired camera position.
   * @param {THREE.Vector3} out     Receives the clamped position on hit.
   * @returns {boolean} True if clamped (out written).
   */
  clampCameraBoom(ballPos, desired, out) {
    if (this.releaseFadeDone) return false;
    const ws = this._scale.worldScale;
    const invWS = 1 / ws;
    const ox = this._originX;
    const oz = this._originZ;
    const dx = desired.x - ballPos.x;
    const dy = desired.y - ballPos.y;
    const dz = desired.z - ballPos.z;
    const len2 = dx * dx + dy * dy + dz * dz;
    if (len2 < 1e-12) return false;

    let tHit = 1;
    const box = this._box;
    for (let i = 0; i < this._pieces; i++) {
      const o = i * 5;
      const t = segmentVsAabb3D(
        ballPos.x, ballPos.y, ballPos.z, dx, dy, dz,
        box[o] * invWS - ox, 0, box[o + 1] * invWS - oz,
        box[o + 2] * invWS - ox, box[o + 4] * invWS, box[o + 3] * invWS - oz
      );
      if (t >= 0 && t < tHit) tHit = t;
    }
    if (tHit >= 1) return false;

    const margin = CAM_WALL_MARGIN_K * this._lastBallR;
    const len = Math.sqrt(len2);
    let t = tHit - margin / len;
    if (t < 0) t = 0;
    out.set(ballPos.x + dx * t, ballPos.y + dy * t, ballPos.z + dz * t);
    return true;
  }

  /**
   * XZ segment-vs-shop test (sim coords) — pre-release only (false after).
   * Knock-off / effects helpers use it to avoid ejecting through walls.
   * @param {number} x0 @param {number} z0 Segment start (sim).
   * @param {number} x1 @param {number} z1 Segment end (sim).
   * @returns {boolean} True if the segment crosses any wall/prism footprint.
   */
  flightWallTest(x0, z0, x1, z1) {
    if (this._released) return false;
    const invWS = 1 / this._scale.worldScale;
    const ox = this._originX;
    const oz = this._originZ;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const box = this._box;
    for (let i = 0; i < this._pieces; i++) {
      const o = i * 5;
      const t = segmentVsAabb3D(
        x0, 0.5, z0, dx, 0, dz,
        box[o] * invWS - ox, 0, box[o + 1] * invWS - oz,
        box[o + 2] * invWS - ox, 1, box[o + 3] * invWS - oz
      );
      if (t >= 0 && t <= 1) return true;
    }
    return false;
  }

  /* ---------------------------------------------------------------- */
  /* Terrain mesh                                                      */
  /* ---------------------------------------------------------------- */

  /**
   * Keep the mesh transform in sync with worldScale / origin / release fade:
   * geometry is REAL METERS, so scale = (1/worldScale) * fade and position =
   * (-originX, 0, -originZ) — pixel-exact with the store transforms.
   */
  _syncMesh() {
    const invWS = 1 / this._scale.worldScale;
    let fade = 1;
    if (this._released) {
      fade = 1 - this._releaseT / RELEASE_FADE_S;
      if (fade < 0) fade = 0;
    }
    const s = invWS * fade;
    this.mesh.scale.setScalar(s <= 0 ? 1e-9 : s);
    this.mesh.position.set(-this._originX, 0, -this._originZ);
  }

  /**
   * Build the one merged vertex-colored shop mesh (9 boxes, 108 tris) in
   * REAL-METER geometry. Built once at boot; +1 draw in the v3 ledger.
   * @returns {THREE.Mesh}
   */
  _buildMesh() {
    const n = this._pieces;
    const positions = new Float32Array(n * 24 * 3);
    const normals = new Float32Array(n * 24 * 3);
    const colors = new Float32Array(n * 24 * 3);
    const indices = new Uint16Array(n * 36);
    const color = new THREE.Color();
    const wallCount = SHOP.walls.length;

    for (let i = 0; i < n; i++) {
      const o = i * 5;
      const x0 = this._box[o];
      const z0 = this._box[o + 1];
      const x1 = this._box[o + 2];
      const z1 = this._box[o + 3];
      const h = this._box[o + 4];
      color.setHex(i < wallCount ? WALL_COLOR : PRISM_COLORS[i - wallCount] || WALL_COLOR);
      writeBox(positions, normals, colors, indices, i, x0, 0, z0, x1, h, z1, color);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
    mesh.frustumCulled = false; // tiny; lives at the start area
    return mesh;
  }
}

/* ================================================================== */
/* Geometry helpers (boot / rare paths)                                */
/* ================================================================== */

/* Box face layout: +X -X +Y -Y +Z -Z, 4 verts each, CCW from outside. */
const FACE_DIRS = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
];

/**
 * Append one axis-aligned box (24 verts / 36 indices) at block index `bi`.
 * Boot-time only.
 */
function writeBox(positions, normals, colors, indices, bi, x0, y0, z0, x1, y1, z1, color) {
  const corners = [
    // per face: 4 corners (a, b, c, d) -> tris (a,b,c)(a,c,d)
    [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], // +X
    [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], // -X
    [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], // +Y
    [[x0, y0, z1], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]], // -Y
    [[x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1]], // +Z
    [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], // -Z
  ];
  const vBase = bi * 24;
  let vp = vBase * 3;
  for (let f = 0; f < 6; f++) {
    const dir = FACE_DIRS[f];
    for (let c = 0; c < 4; c++) {
      const p = corners[f][c];
      positions[vp] = p[0];
      normals[vp] = dir[0];
      colors[vp] = color.r;
      vp++;
      positions[vp] = p[1];
      normals[vp] = dir[1];
      colors[vp] = color.g;
      vp++;
      positions[vp] = p[2];
      normals[vp] = dir[2];
      colors[vp] = color.b;
      vp++;
    }
  }
  let ip = bi * 36;
  for (let f = 0; f < 6; f++) {
    const a = vBase + f * 4;
    indices[ip++] = a;
    indices[ip++] = a + 1;
    indices[ip++] = a + 2;
    indices[ip++] = a;
    indices[ip++] = a + 2;
    indices[ip++] = a + 3;
  }
}

/**
 * Slab-method segment-vs-AABB: returns entry t in [0, 1], or -1 on miss.
 * Segment = origin + t * delta. Zero allocation, pure scalars.
 * @returns {number}
 */
function segmentVsAabb3D(px, py, pz, dx, dy, dz, x0, y0, z0, x1, y1, z1) {
  let tMin = 0;
  let tMax = 1;

  // X slab
  if (Math.abs(dx) < 1e-12) {
    if (px < x0 || px > x1) return -1;
  } else {
    let t1 = (x0 - px) / dx;
    let t2 = (x1 - px) / dx;
    if (t1 > t2) {
      const tt = t1;
      t1 = t2;
      t2 = tt;
    }
    if (t1 > tMin) tMin = t1;
    if (t2 < tMax) tMax = t2;
    if (tMin > tMax) return -1;
  }
  // Y slab
  if (Math.abs(dy) < 1e-12) {
    if (py < y0 || py > y1) return -1;
  } else {
    let t1 = (y0 - py) / dy;
    let t2 = (y1 - py) / dy;
    if (t1 > t2) {
      const tt = t1;
      t1 = t2;
      t2 = tt;
    }
    if (t1 > tMin) tMin = t1;
    if (t2 < tMax) tMax = t2;
    if (tMin > tMax) return -1;
  }
  // Z slab
  if (Math.abs(dz) < 1e-12) {
    if (pz < z0 || pz > z1) return -1;
  } else {
    let t1 = (z0 - pz) / dz;
    let t2 = (z1 - pz) / dz;
    if (t1 > t2) {
      const tt = t1;
      t1 = t2;
      t2 = tt;
    }
    if (t1 > tMin) tMin = t1;
    if (t2 < tMax) tMax = t2;
    if (tMin > tMax) return -1;
  }
  return tMin;
}
