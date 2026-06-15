/**
 * @file effects.js — Pooled instanced effects: absorb pop quads, tierUp
 * sparkle ring, speed lines. All procedural, zero assets, exactly 3 draw
 * calls (one InstancedMesh per effect, additive MeshBasicMaterial).
 *
 * Particles live in preallocated SoA Float32Arrays with overwrite-oldest
 * ring cursors — zero per-frame allocation. All sizes/velocities are
 * proportional to ball simRadius (SEAMLESSNESS LAW) so effects read
 * identically at every tier.
 *
 * Event-driven (bus): ABSORB / KNOCK_OFF / TIER_UP queue bursts which are
 * materialized at the ball's surface in update(dt, ballState); RESCALE
 * multiplies live particle state by S (world sim positions); REBASE shifts
 * live particle positions by (sx, sz); GAME_RESET kills everything.
 *
 * v2 (kept) + v3 (Hakoniwa Tokyo) — still exactly 3 draw calls (everything
 * reuses the same three pools):
 *  - EVT.DASH -> 10-speed-line burst along the dash direction (lines pool).
 *  - setRareProvider(fn): fn is spawner.forEachAliveRare (wired by main at
 *    integration); polled each update to spawn ~3 golden twinkles/s per
 *    alive rare within fog range (ring pool).
 *  - v3 setCollectibleProvider(fn): fn is curated.forEachAliveCollectible
 *    (same (idx,x,y,z,r) callback contract) — the 12 named collectibles
 *    sparkle with the SAME golden twinkle as chunk rares (ring pool).
 *  - v3 EVT.LANDMARK -> one-shot GOLD RING BURST at the ball (ring pool;
 *    the landmark absorb center treatment, alongside the hud toast + sfx
 *    fanfare sting).
 *  - ascensionBurst(): finale ASCENSION golden sparkle fountain rising from
 *    the ball position (the finale parks ball.pos on the rising anchor over
 *    the night diorama, so the fountain rides the ascent) (pops pool).
 *
 * NOTE for integration: update needs the ball — call
 * effects.update(frameDt, ballPhys.state) in frame-order step 6.
 */

import * as THREE from 'three';
import { SPEED_K, FOV_SPEED_FRAC, FOG_FAR_K, KNOCKOFF_MAX } from '../config/tuning.js';
import { bus, EVT } from '../core/events.js';
import { clamp01 } from '../core/mathUtils.js';
import { mulberry32 } from '../core/rng.js';

/** @typedef {import('../types.js').BallState} BallState */

/* ------------------------------------------------------------------ */
/* Tunables (cosmetic-local, not in tuning.js)                          */
/* ------------------------------------------------------------------ */

const POP_CAP = 96;
const RING_CAP = 64;
const LINE_CAP = 32;
/** Quads spawned per absorb pop. */
const POP_PER_ABSORB = 6;
/** Max queued pop quads (burst floods clamp here). */
const POP_QUEUE_MAX = 48;
/** Pop quads materialized per frame at most. */
const POP_SPAWN_BUDGET = 24;
/** Sparkles in the tierUp ring. */
const RING_SPARKLES = 36;
/** Speed-line spawn rate at full speed (per second). */
const LINE_RATE_MAX = 45;
/** Gravity on pop/sparkle particles, in ball radii per s^2. */
const GRAVITY_K = 9.0;
/** Velocity drag per second (vel *= DRAG^dt ~ implemented per frame). */
const DRAG_PER_S = 0.88;

/** Warm celebratory tints for pops / sparkles. */
const POP_COLORS = [0xfff3b0, 0xffd166, 0xffffff, 0xffa8e2, 0xa8e6ff];
const RING_COLORS = [0xffe9a0, 0xfff7d6, 0xffc46b, 0xffffff];
const LINE_COLOR = 0xcfe8ff;

/* ---- v2/v3 cosmetic-local tunables ---------------------------------- */
/** Speed lines spawned per EVT.DASH. */
const DASH_LINE_BURST = 10;
/** Golden twinkle spawn rate per alive rare/collectible (per second). */
const TWINKLE_RATE_PER_S = 3;
/** Golden tints shared by twinkles, the landmark ring and the fountain. */
const GOLD_COLORS = [0xffd84a, 0xfff3b0, 0xffe9a0, 0xffffff];
/** ascensionBurst(): fountain duration (s) and emission rate (sparkles/s). */
const ASCEND_BURST_S = 4.5;
const ASCEND_BURST_RATE = 26;
/** v3 EVT.LANDMARK gold ring burst: sparkle count (ring pool). */
const LANDMARK_RING_SPARKLES = 48;

const UP = new THREE.Vector3(0, 1, 0);

// Module-level scratch.
const _v1 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _s1 = new THREE.Vector3();
const _m1 = new THREE.Matrix4();
const _color = new THREE.Color();
const _zeroM = new THREE.Matrix4().makeScale(0, 0, 0);

/* ------------------------------------------------------------------ */
/* Internal particle pool                                               */
/* ------------------------------------------------------------------ */

/**
 * One InstancedMesh + SoA particle state. Orientation modes:
 * tumble (random axis, spinning) or velocity-aligned (quad Y axis along vel).
 */
class QuadPool {
  /**
   * @param {THREE.Scene} scene Parent scene.
   * @param {THREE.BufferGeometry} geometry Shared quad geometry.
   * @param {number} capacity Max simultaneous particles.
   * @param {boolean} alignVel True = orient along velocity (speed lines).
   * @param {number} stretchX X-scale factor relative to size (thin streaks < 1).
   */
  constructor(scene, geometry, capacity, alignVel, stretchX) {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    /** @type {THREE.InstancedMesh} */
    this.mesh = new THREE.InstancedMesh(geometry, material, capacity);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 10;
    for (let i = 0; i < capacity; i++) {
      this.mesh.setMatrixAt(i, _zeroM);
      this.mesh.setColorAt(i, _color.setHex(0xffffff));
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor !== null) this.mesh.instanceColor.needsUpdate = true;
    scene.add(this.mesh);

    this.cap = capacity;
    this.alignVel = alignVel;
    this.stretchX = stretchX;
    this.px = new Float32Array(capacity);
    this.py = new Float32Array(capacity);
    this.pz = new Float32Array(capacity);
    this.vx = new Float32Array(capacity);
    this.vy = new Float32Array(capacity);
    this.vz = new Float32Array(capacity);
    this.life = new Float32Array(capacity);
    this.maxLife = new Float32Array(capacity);
    this.size = new Float32Array(capacity);
    this.ax = new Float32Array(capacity); // tumble axis
    this.ay = new Float32Array(capacity);
    this.az = new Float32Array(capacity);
    this.rot = new Float32Array(capacity);
    this.spin = new Float32Array(capacity);
    this.alive = new Uint8Array(capacity);
    this.cursor = 0;
    this.aliveCount = 0;
  }

  /**
   * Spawn one particle (overwrites the oldest slot when full).
   * @param {number} px @param {number} py @param {number} pz World sim position.
   * @param {number} vx @param {number} vy @param {number} vz Sim velocity.
   * @param {number} life Lifetime (s). @param {number} size Base size (sim units).
   * @param {number} colorHex Tint. @param {number} spin Tumble speed (rad/s).
   * @param {number} ax @param {number} ay @param {number} az Tumble axis (normalized).
   */
  spawn(px, py, pz, vx, vy, vz, life, size, colorHex, spin, ax, ay, az) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.cap;
    if (this.alive[i] === 0) this.aliveCount++;
    this.alive[i] = 1;
    this.px[i] = px; this.py[i] = py; this.pz[i] = pz;
    this.vx[i] = vx; this.vy[i] = vy; this.vz[i] = vz;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.size[i] = size;
    this.spin[i] = spin;
    this.rot[i] = 0;
    this.ax[i] = ax; this.ay[i] = ay; this.az[i] = az;
    this.mesh.setColorAt(i, _color.setHex(colorHex));
    if (this.mesh.instanceColor !== null) this.mesh.instanceColor.needsUpdate = true;
  }

  /**
   * Integrate + rewrite matrices for alive particles (small caps — full
   * needsUpdate per touched frame is cheap).
   * @param {number} dt Frame delta (s).
   * @param {number} gravity Downward accel (sim/s^2).
   */
  update(dt, gravity) {
    if (this.aliveCount === 0) return;
    const drag = Math.pow(DRAG_PER_S, dt);
    for (let i = 0; i < this.cap; i++) {
      if (this.alive[i] === 0) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.alive[i] = 0;
        this.aliveCount--;
        this.mesh.setMatrixAt(i, _zeroM);
        continue;
      }
      this.vy[i] -= gravity * dt;
      this.vx[i] *= drag; this.vy[i] *= drag; this.vz[i] *= drag;
      this.px[i] += this.vx[i] * dt;
      this.py[i] += this.vy[i] * dt;
      this.pz[i] += this.vz[i] * dt;
      this.rot[i] += this.spin[i] * dt;

      const t = 1 - this.life[i] / this.maxLife[i];
      const s = this.size[i] * (1 - t * t);
      if (this.alignVel) {
        _v1.set(this.vx[i], this.vy[i], this.vz[i]);
        if (_v1.lengthSq() < 1e-12) _v1.set(0, 1, 0);
        _v1.normalize();
        _q1.setFromUnitVectors(UP, _v1);
      } else {
        _v1.set(this.ax[i], this.ay[i], this.az[i]);
        _q1.setFromAxisAngle(_v1, this.rot[i]);
      }
      _s1.set(s * this.stretchX, s, s * this.stretchX);
      _v1.set(this.px[i], this.py[i], this.pz[i]);
      _m1.compose(_v1, _q1, _s1);
      this.mesh.setMatrixAt(i, _m1);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /** Kill every particle (game reset). */
  killAll() {
    for (let i = 0; i < this.cap; i++) {
      if (this.alive[i] === 1) this.mesh.setMatrixAt(i, _zeroM);
      this.alive[i] = 0;
    }
    this.aliveCount = 0;
    this.cursor = 0;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /**
   * Similarity rescale: particle state is world sim space — multiply by S.
   * @param {number} S Rescale factor.
   */
  rescale(S) {
    for (let i = 0; i < this.cap; i++) {
      if (this.alive[i] === 0) continue;
      this.px[i] *= S; this.py[i] *= S; this.pz[i] *= S;
      this.vx[i] *= S; this.vy[i] *= S; this.vz[i] *= S;
      this.size[i] *= S;
    }
  }

  /**
   * Floating-origin rebase: shift live particle positions. (sx, sz) scalar
   * convention matches every other rebase hook; y is unaffected by rebase.
   * @param {number} sx Integer-snapped X shift, sim units.
   * @param {number} sz Integer-snapped Z shift, sim units.
   */
  rebase(sx, sz) {
    for (let i = 0; i < this.cap; i++) {
      if (this.alive[i] === 0) continue;
      this.px[i] -= sx;
      this.pz[i] -= sz;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Effects                                                              */
/* ------------------------------------------------------------------ */

/**
 * Pooled effects coordinator. Construct once; call update(dt, ballState)
 * once per render frame (frame-order step 6). 3 draw calls total.
 */
export class Effects {
  /**
   * @param {THREE.Scene} scene Scene to attach effect meshes to.
   * @param {import('../core/events.js').EventBus} [eventBus] Bus; defaults to the singleton.
   */
  constructor(scene, eventBus = bus) {
    const quad = new THREE.PlaneGeometry(1, 1);
    /** @type {QuadPool} Absorb pop confetti. */
    this._pops = new QuadPool(scene, quad, POP_CAP, false, 1);
    /** @type {QuadPool} TierUp sparkle ring. */
    this._ring = new QuadPool(scene, quad, RING_CAP, false, 1);
    /** @type {QuadPool} Speed lines (thin streaks along velocity). */
    this._lines = new QuadPool(scene, quad, LINE_CAP, true, 0.08);

    this._rng = mulberry32(0xdecafbad);
    /** @type {number} Pop quads waiting to materialize at the ball surface. */
    this._popQueue = 0;
    /** @type {boolean} A tierUp ring burst is pending. */
    this._ringPending = false;
    /** @type {number} Speed-line emission accumulator. */
    this._lineAcc = 0;

    /* ---- v2/v3 state --------------------------------------------------- */
    /** @type {number} Speed lines pending from EVT.DASH. */
    this._dashPending = 0;
    /** @type {?(cb: (idx:number,x:number,y:number,z:number,r:number)=>void)=>void}
     *  spawner.forEachAliveRare, injected via setRareProvider at integration. */
    this._rareProvider = null;
    /** @type {?(cb: (idx:number,x:number,y:number,z:number,r:number)=>void)=>void}
     *  v3: curated.forEachAliveCollectible, injected via
     *  setCollectibleProvider at integration (same callback contract). */
    this._collectibleProvider = null;
    /** @type {(idx:number,x:number,y:number,z:number,r:number)=>void}
     *  Pre-bound twinkle callback (allocated ONCE — zero per-frame alloc). */
    this._twinkleCb = this._spawnTwinkle.bind(this);
    // Per-update twinkle context (set before calling the providers).
    this._twDt = 0;
    this._twBX = 0;
    this._twBY = 0;
    this._twBZ = 0;
    this._twRange2 = 0;
    /** @type {number} ascensionBurst fountain time remaining (s). */
    this._fountainT = 0;
    /** @type {number} Fountain emission accumulator. */
    this._fountainAcc = 0;
    /** @type {boolean} v3: a landmark gold ring burst is pending. */
    this._landmarkPending = false;

    eventBus.on(EVT.DASH, () => {
      this._dashPending = DASH_LINE_BURST;
    });
    eventBus.on(EVT.LANDMARK, () => {
      this._landmarkPending = true; // materialized at the ball next update
    });
    eventBus.on(EVT.ABSORB, () => {
      this._popQueue += POP_PER_ABSORB;
      if (this._popQueue > POP_QUEUE_MAX) this._popQueue = POP_QUEUE_MAX;
    });
    eventBus.on(EVT.KNOCK_OFF, (p) => {
      const c = p.count > KNOCKOFF_MAX ? KNOCKOFF_MAX : p.count;
      this._popQueue += c * 3;
      if (this._popQueue > POP_QUEUE_MAX) this._popQueue = POP_QUEUE_MAX;
    });
    eventBus.on(EVT.TIER_UP, () => {
      this._ringPending = true;
    });
    eventBus.on(EVT.RESCALE, (p) => {
      this._pops.rescale(p.S);
      this._ring.rescale(p.S);
      this._lines.rescale(p.S);
    });
    eventBus.on(EVT.REBASE, (p) => {
      this.rebase(p.sx, p.sz);
    });
    eventBus.on(EVT.GAME_RESET, () => {
      this.reset();
    });
  }

  /**
   * Materialize queued bursts at the ball surface + integrate all pools.
   * @param {number} dt Render-frame delta (s).
   * @param {BallState} [ball] Ball truth — REQUIRED for spawning (bursts stay
   *   queued if omitted); pass ballPhys.state from main.js.
   */
  update(dt, ball) {
    let r = 1;
    if (ball !== undefined && ball !== null) {
      r = ball.radiusSim;

      // ---- absorb / knock-off pops ----------------------------------------
      let n = this._popQueue < POP_SPAWN_BUDGET ? this._popQueue : POP_SPAWN_BUDGET;
      this._popQueue -= n;
      while (n > 0) {
        n--;
        const a = this._rng() * Math.PI * 2;
        const y = 0.25 + 0.7 * this._rng();
        const h = Math.sqrt(1 - y * y);
        const dx = Math.cos(a) * h;
        const dz = Math.sin(a) * h;
        const speed = r * (1.8 + 1.6 * this._rng());
        this._pops.spawn(
          ball.pos.x + dx * r, ball.pos.y + y * r, ball.pos.z + dz * r,
          dx * speed, y * speed + r * 1.2, dz * speed,
          0.45 + 0.3 * this._rng(),
          r * (0.1 + 0.16 * this._rng()),
          POP_COLORS[(this._rng() * POP_COLORS.length) | 0],
          (this._rng() - 0.5) * 14,
          Math.sin(a), 0.5, Math.cos(a)
        );
      }

      // ---- tierUp sparkle ring ---------------------------------------------
      if (this._ringPending) {
        this._ringPending = false;
        for (let i = 0; i < RING_SPARKLES; i++) {
          const a = (i / RING_SPARKLES) * Math.PI * 2;
          const dx = Math.sin(a);
          const dz = Math.cos(a);
          this._ring.spawn(
            ball.pos.x + dx * r * 1.3, ball.pos.y + r * 0.15, ball.pos.z + dz * r * 1.3,
            dx * r * 2.8, r * (0.8 + 0.8 * this._rng()), dz * r * 2.8,
            0.7 + 0.35 * this._rng(),
            r * (0.14 + 0.1 * this._rng()),
            RING_COLORS[(this._rng() * RING_COLORS.length) | 0],
            (this._rng() - 0.5) * 10,
            dz, 0.4, -dx
          );
        }
      }

      // ---- v3: landmark gold ring burst (EVT.LANDMARK center treatment) ----
      // Bigger, denser and golden vs the tierUp ring — 「雷門」まきこんだ！
      if (this._landmarkPending) {
        this._landmarkPending = false;
        for (let i = 0; i < LANDMARK_RING_SPARKLES; i++) {
          const a = (i / LANDMARK_RING_SPARKLES) * Math.PI * 2;
          const dx = Math.sin(a);
          const dz = Math.cos(a);
          this._ring.spawn(
            ball.pos.x + dx * r * 1.4, ball.pos.y + r * 0.2, ball.pos.z + dz * r * 1.4,
            dx * r * 3.4, r * (1.0 + 1.0 * this._rng()), dz * r * 3.4,
            0.8 + 0.4 * this._rng(),
            r * (0.16 + 0.12 * this._rng()),
            GOLD_COLORS[(this._rng() * GOLD_COLORS.length) | 0],
            (this._rng() - 0.5) * 12,
            dz, 0.4, -dx
          );
        }
      }

      // ---- speed lines --------------------------------------------------------
      const vx = ball.vel.x;
      const vz = ball.vel.z;
      const speed = Math.sqrt(vx * vx + vz * vz);
      const speed01 = clamp01(speed / (SPEED_K * r));
      if (speed01 > FOV_SPEED_FRAC && speed > 1e-6) {
        const rate = (LINE_RATE_MAX * (speed01 - FOV_SPEED_FRAC)) / (1 - FOV_SPEED_FRAC);
        this._lineAcc += rate * dt;
        const fx = vx / speed;
        const fz = vz / speed;
        while (this._lineAcc >= 1) {
          this._lineAcc -= 1;
          // Perpendicular offset around the path of motion.
          const side = this._rng() < 0.5 ? -1 : 1;
          const off = r * (1.2 + 1.2 * this._rng());
          const ox = -fz * side * off;
          const oz = fx * side * off;
          this._lines.spawn(
            ball.pos.x + fx * r * 2.0 + ox,
            ball.pos.y + r * (0.3 + 1.0 * this._rng()),
            ball.pos.z + fz * r * 2.0 + oz,
            -vx * 0.25, 0, -vz * 0.25,
            0.22 + 0.1 * this._rng(),
            r * (1.0 + 1.4 * speed01),
            LINE_COLOR,
            0, 0, 1, 0
          );
        }
      } else {
        this._lineAcc = 0;
      }

      // ---- v2: dash speed-line burst (EVT.DASH fired inside the physics ----
      // step; vel already carries the impulse, so the burst aligns with it).
      if (this._dashPending > 0) {
        if (speed > 1e-6) {
          const fx = vx / speed;
          const fz = vz / speed;
          let n = this._dashPending;
          while (n > 0) {
            n--;
            const side = this._rng() < 0.5 ? -1 : 1;
            const off = r * (0.9 + 1.4 * this._rng());
            this._lines.spawn(
              ball.pos.x + fx * r * (1.5 + 1.5 * this._rng()) - fz * side * off,
              ball.pos.y + r * (0.2 + 1.2 * this._rng()),
              ball.pos.z + fz * r * (1.5 + 1.5 * this._rng()) + fx * side * off,
              -vx * 0.35, 0, -vz * 0.35,
              0.25 + 0.12 * this._rng(),
              r * (1.6 + 1.2 * this._rng()),
              LINE_COLOR,
              0, 0, 1, 0
            );
          }
        }
        this._dashPending = 0; // burst (or drop if somehow stationary)
      }

      // ---- golden twinkles on alive rares + named collectibles (providers --
      // = spawner.forEachAliveRare / curated.forEachAliveCollectible; context
      // fields set once so the shared pre-bound callback stays allocation-
      // free for both passes).
      if (this._rareProvider !== null || this._collectibleProvider !== null) {
        this._twDt = dt;
        this._twBX = ball.pos.x;
        this._twBY = ball.pos.y;
        this._twBZ = ball.pos.z;
        const range = FOG_FAR_K * r;
        this._twRange2 = range * range;
        if (this._rareProvider !== null) this._rareProvider(this._twinkleCb);
        if (this._collectibleProvider !== null) this._collectibleProvider(this._twinkleCb);
      }

      // ---- ascensionBurst golden fountain (finale ASCENSION; the finale ----
      // parks ball.pos on the rising anchor so the fountain rides the ascent).
      if (this._fountainT > 0) {
        this._fountainT -= dt;
        this._fountainAcc += ASCEND_BURST_RATE * dt;
        while (this._fountainAcc >= 1) {
          this._fountainAcc -= 1;
          const a = this._rng() * Math.PI * 2;
          const y = 0.55 + 0.45 * this._rng();
          const h = Math.sqrt(1 - y * y);
          const dx = Math.cos(a) * h;
          const dz = Math.sin(a) * h;
          const speedF = r * (2.2 + 2.6 * this._rng());
          this._pops.spawn(
            ball.pos.x + dx * r * 2.4, ball.pos.y + y * r * 2.4, ball.pos.z + dz * r * 2.4,
            dx * speedF, y * speedF + r * 2.0, dz * speedF,
            0.8 + 0.5 * this._rng(),
            r * (0.14 + 0.2 * this._rng()),
            GOLD_COLORS[(this._rng() * GOLD_COLORS.length) | 0],
            (this._rng() - 0.5) * 12,
            Math.sin(a), 0.5, Math.cos(a)
          );
        }
      }
    }

    const g = GRAVITY_K * r;
    this._pops.update(dt, g);
    this._ring.update(dt, g * 0.6);
    this._lines.update(dt, 0);
  }

  /* ---------------------------------------------------------------- */
  /* v2/v3 public API                                                  */
  /* ---------------------------------------------------------------- */

  /**
   * Inject the alive-rare iterator (main wires
   * effects.setRareProvider(spawner.forEachAliveRare.bind(spawner)) at
   * integration). Polled once per update for golden twinkles.
   * @param {(cb: (idx:number, x:number, y:number, z:number, r:number) => void) => void} fn
   */
  setRareProvider(fn) {
    this._rareProvider = fn;
  }

  /**
   * v3: inject the alive-collectible iterator (main wires
   * effects.setCollectibleProvider(curated.forEachAliveCollectible.bind(curated))
   * at integration — same (idx,x,y,z,r) callback contract as the rare
   * provider). The 12 named collectibles share the golden twinkle.
   * @param {(cb: (idx:number, x:number, y:number, z:number, r:number) => void) => void} fn
   */
  setCollectibleProvider(fn) {
    this._collectibleProvider = fn;
  }

  /**
   * Start the finale ASCENSION golden sparkle fountain (called once by
   * game/finale.js when ascension begins). Emits from ball.pos — the finale
   * parks ball.pos on the rising anchor during ascension/afterglow.
   */
  ascensionBurst() {
    this._fountainT = ASCEND_BURST_S;
    this._fountainAcc = 0;
  }

  /**
   * Pre-bound per-target callback handed to both providers. Spawns a golden
   * twinkle at ~TWINKLE_RATE_PER_S per rare/collectible, only within fog
   * range of the ball. Context (_tw*) is set by update() right before the
   * provider calls.
   * @param {number} _idx Store index (unused — identity comes from position).
   * @param {number} x @param {number} y @param {number} z Target position (sim).
   * @param {number} r Target bounding radius (sim units).
   */
  _spawnTwinkle(_idx, x, y, z, r) {
    const dx = x - this._twBX;
    const dz = z - this._twBZ;
    if (dx * dx + dz * dz > this._twRange2) return;
    if (this._rng() >= TWINKLE_RATE_PER_S * this._twDt) return;
    const a = this._rng() * Math.PI * 2;
    this._ring.spawn(
      x + (this._rng() - 0.5) * r * 1.4,
      y + r * (0.4 + 0.9 * this._rng()),
      z + (this._rng() - 0.5) * r * 1.4,
      0, r * (0.5 + 0.5 * this._rng()), 0,
      0.4 + 0.3 * this._rng(),
      r * (0.25 + 0.25 * this._rng()),
      GOLD_COLORS[(this._rng() * GOLD_COLORS.length) | 0],
      (this._rng() - 0.5) * 10,
      Math.sin(a), 0.5, Math.cos(a)
    );
  }

  /**
   * Floating-origin rebase hook — driven by EVT.REBASE (emitted by
   * ScaleManager.maybeRebase after all direct world mutations) so live
   * particles never teleport on the rebase frame.
   * @param {number} sx Integer-snapped X shift, sim units.
   * @param {number} sz Integer-snapped Z shift, sim units.
   */
  rebase(sx, sz) {
    this._pops.rebase(sx, sz);
    this._ring.rebase(sx, sz);
    this._lines.rebase(sx, sz);
  }

  /** Kill all live particles and pending bursts (game reset). The rare /
   *  collectible providers are wiring-level and survive reset. */
  reset() {
    this._pops.killAll();
    this._ring.killAll();
    this._lines.killAll();
    this._popQueue = 0;
    this._ringPending = false;
    this._lineAcc = 0;
    this._dashPending = 0;
    this._fountainT = 0;
    this._fountainAcc = 0;
    this._landmarkPending = false;
  }
}
