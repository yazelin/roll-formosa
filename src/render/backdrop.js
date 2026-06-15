/**
 * @file backdrop.js — camera-centered horizon silhouette ring (1 draw call).
 *
 * Two jagged-top cylinder-strip layers (96 segments x 4 quad rows each,
 * 1536 tris total), vertex-colored, built ONCE at boot from
 * mulberry32(worldSeed ^ 0x42444b). Two height/color profiles are baked as
 * two vertex-attribute sets blended by uProfile01 — v3 Hakoniwa-Tokyo pair
 * (docs/DESIGN-V3.md §箱庭東京マップ D): 下町屋根並み low shitamachi
 * rooflines with sento-chimney spikes (T0-2) <-> 富士山+湾岸スカイライン
 * one broad Mt. Fuji silhouette on the back layer over a bayside tower
 * skyline (T3+), crossfaded on EVT.TIER_UP at T3 alongside the env palette
 * fade so the horizon reads 'more Tokyo, then Fuji'. A tiny ShaderMaterial
 * mixes the silhouette color toward the LIVE fog color (read from scene.fog
 * each update — zero alloc) at BACKDROP_FOG_MIX, so it reads as a hazy
 * distant skyline, never a hard edge — and it fades toward near-black
 * silhouette during the finale night fade for free (the night palette's fog
 * color is 0x1a1838).
 *
 * PIXEL-IDENTITY AT RESCALE / REBASE-FREE (binding, DESIGN-V2.md 背景強化):
 * update(dt, ball, camera) sets position = (cam.x, 0, cam.z) and
 * scale = ball.radiusSim — a PURE function of current radius + camera, with
 * geometry radius BACKDROP_DIST_K * r and height BACKDROP_HEIGHT_K * r.
 * Rescale multiplies both camera position and radius by S => identical
 * pixels; rebase shifts camera and ring together => nothing to do.
 * update() runs in main.js step 6 AFTER cameraRig.update.
 *
 * Render state: frustumCulled = false (always around the camera),
 * renderOrder = -5 (after the sky dome at -10, before the world at 0),
 * depthWrite = false (world geometry always paints over it).
 *
 * Zero per-frame allocation; all geometry/material allocation at boot.
 * Subscribes EVT.TIER_UP + EVT.GAME_RESET itself on the singleton bus.
 */

import * as THREE from 'three';
import { PALETTE_FADE_S } from '../config/tuning.js';
import { bus, EVT } from '../core/events.js';
import { mulberry32 } from '../core/rng.js';
import { easeInOutCubic, clamp01, lerp } from '../core/mathUtils.js';

/** @typedef {import('../types.js').BallState} BallState */
/** @typedef {import('../types.js').TierUpEvent} TierUpEvent */

/* ---- module-local tuning (DESIGN-V2.md チューニング定数) ---- */
/** Ring radius = BACKDROP_DIST_K * ball.radiusSim (between fog near 14r and far 55r). */
const BACKDROP_DIST_K = 48;
/** Peak silhouette height = BACKDROP_HEIGHT_K * ball.radiusSim — pokes above the fog band. */
const BACKDROP_HEIGHT_K = 10;
/** Front-layer mix toward the live fog color (back layer is slightly hazier). */
const BACKDROP_FOG_MIX = 0.82;
/** Back layer sits deeper in the haze. */
const BACKDROP_FOG_MIX_BACK = 0.9;

/** Ring segments around the circle. */
const SEG = 96;
/** Vertical quad rows per layer (4 rows x 96 seg x 2 layers = 1536 tris). */
const ROWS = 4;
/** First tier whose profile is 富士山+湾岸スカイライン (v3 binding: crossfade
 *  keyed to T3 下町 — T0-2 show the 下町屋根並み rooflines). */
const SKYLINE_FROM_TIER = 3;
/** Mt. Fuji silhouette half-width (columns) and peak height fraction (back
 *  layer of profile B only — one broad cone dominating one bearing). */
const FUJI_HALF_W = 9;
const FUJI_PEAK_H = 1.0;
/** Backdrop generation seed salt ('BDK'). */
const SEED_SALT = 0x42444b;

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

const BACKDROP_VERT = /* glsl */ `
attribute float aHeightA;  // 下町屋根並み profile (0..~1, per column; layer amp baked in)
attribute float aHeightB;  // 富士山+湾岸スカイライン profile
attribute vec3 aColorA;    // roofline silhouette color (per column)
attribute vec3 aColorB;    // Fuji/bay silhouette color
attribute float aFog;      // per-layer fog-mix factor
uniform float uProfile01;  // 0 = 下町屋根並み (T0-2), 1 = 富士山+湾岸 (T3+)
uniform float uHeight;     // BACKDROP_HEIGHT_K
varying vec3 vColor;
varying float vFog;
void main() {
  vColor = mix(aColorA, aColorB, uProfile01);
  vFog = aFog;
  // position.y is the row fraction (-0.04 .. 1); the blended profile scales it.
  float hk = mix(aHeightA, aHeightB, uProfile01);
  vec3 p = vec3(position.x, position.y * hk * uHeight, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const BACKDROP_FRAG = /* glsl */ `
uniform vec3 uFogColor;
varying vec3 vColor;
varying float vFog;
void main() {
  gl_FragColor = vec4(mix(vColor, uFogColor, vFog), 1.0);
}
`;

/* ------------------------------------------------------------------ */
/* Seeded profile generators (boot only — allocation allowed)           */
/* ------------------------------------------------------------------ */

/**
 * 下町屋根並み profile + colors (v3 profile A): runs of 2-4 columns share one
 * LOW flat roofline (machiya/nagaya blocks, 0.22-0.5) with a tiny per-column
 * ridge jitter (tiled-roof texture); ~4% of runs are 銭湯の煙突 spikes.
 * Per-run warm roof-tile color jitter. Wrap seam duplicated; heights scaled
 * by `amp`.
 * @param {() => number} rnd Seeded PRNG (fixed draw order — deterministic).
 * @param {number} amp Layer amplitude.
 * @param {number} r @param {number} g @param {number} b Base roof color.
 * @returns {{heights: Float32Array, colors: Float32Array}}
 */
function genShitamachi(rnd, amp, r, g, b) {
  const heights = new Float32Array(SEG + 1);
  const colors = new Float32Array((SEG + 1) * 3);
  let c = 0;
  while (c < SEG) {
    const run = 2 + Math.floor(rnd() * 3); // 2-4 columns per roof block
    let h = 0.22 + rnd() * 0.28; // low rooflines — the hakoniwa reads close
    if (rnd() < 0.04) h = 0.65 + rnd() * 0.2; // 銭湯の煙突 spike
    const j = (rnd() - 0.5) * 0.05;
    const cr = Math.max(0, r + j * 1.3); // warm jitter (tile/wood tones)
    const cg = Math.max(0, g + j);
    const cb = Math.max(0, b + j * 0.7);
    for (let i = 0; i < run && c < SEG; i++, c++) {
      // Tiny ridge jitter per column so long roofs read as tiled, not flat.
      heights[c] = Math.min(1, h + (rnd() - 0.5) * 0.03) * amp;
      colors[c * 3 + 0] = cr;
      colors[c * 3 + 1] = cg;
      colors[c * 3 + 2] = cb;
    }
  }
  heights[SEG] = heights[0];
  colors[SEG * 3 + 0] = colors[0];
  colors[SEG * 3 + 1] = colors[1];
  colors[SEG * 3 + 2] = colors[2];
  return { heights, colors };
}

/**
 * 富士山+湾岸スカイライン profile + colors (v3 profile B): bayside tower
 * skyline — runs of 2-5 columns share one height (0.2-0.7), ~7% of runs are
 * tall tower spires — and, when `withFuji`, ONE broad smooth Mt. Fuji cone
 * (cosine flank, FUJI_HALF_W columns each side) max-composited over the
 * skyline at a seeded bearing, in a lighter blue-grey so it reads as the
 * distant mountain behind the bay. Wrap-safe (modulo columns). Heights
 * scaled by `amp`; wrap seam duplicated.
 * @param {() => number} rnd Seeded PRNG (fixed draw order — deterministic).
 * @param {number} amp Layer amplitude.
 * @param {number} r @param {number} g @param {number} b Skyline base color.
 * @param {number[]} fujiCol Fuji silhouette RGB.
 * @param {boolean} withFuji Back layer only — the front layer is pure bay skyline.
 * @returns {{heights: Float32Array, colors: Float32Array}}
 */
function genFujiBay(rnd, amp, r, g, b, fujiCol, withFuji) {
  const heights = new Float32Array(SEG + 1);
  const colors = new Float32Array((SEG + 1) * 3);
  let c = 0;
  while (c < SEG) {
    const run = 2 + Math.floor(rnd() * 4); // 2-5 columns per building
    let h = 0.2 + rnd() * 0.5;
    if (rnd() < 0.07) h = 0.78 + rnd() * 0.18; // waterfront tower spire
    const j = (rnd() - 0.5) * 0.05;
    const cr = Math.max(0, r + j);
    const cg = Math.max(0, g + j);
    const cb = Math.max(0, b + j * 1.4);
    for (let i = 0; i < run && c < SEG; i++, c++) {
      heights[c] = h * amp;
      colors[c * 3 + 0] = cr;
      colors[c * 3 + 1] = cg;
      colors[c * 3 + 2] = cb;
    }
  }
  if (withFuji) {
    // One broad cone, max-composited (never cuts a tower short).
    const center = Math.floor(rnd() * SEG);
    for (let k = -FUJI_HALF_W; k <= FUJI_HALF_W; k++) {
      const col = ((center + k) % SEG + SEG) % SEG;
      const flank = 0.5 + 0.5 * Math.cos((k / FUJI_HALF_W) * Math.PI); // 1 at peak -> 0 at edge
      const fh = FUJI_PEAK_H * (0.25 + 0.75 * flank) * amp;
      if (fh > heights[col]) {
        heights[col] = fh;
        colors[col * 3 + 0] = fujiCol[0];
        colors[col * 3 + 1] = fujiCol[1];
        colors[col * 3 + 2] = fujiCol[2];
      }
    }
  }
  heights[SEG] = heights[0];
  colors[SEG * 3 + 0] = colors[0];
  colors[SEG * 3 + 1] = colors[1];
  colors[SEG * 3 + 2] = colors[2];
  return { heights, colors };
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                              */
/* ------------------------------------------------------------------ */

/**
 * Backdrop — the camera-centered horizon silhouette ring.
 *
 * Integration (main.js):
 *   const backdrop = new Backdrop(renderer.scene, worldSeed);
 *   ...per frame (step 6, AFTER cameraRig.update):
 *   backdrop.update(frameDt, ballPhys.state, renderer.camera);
 *   ?r= dev start (optional cosmetic): backdrop.setProfileImmediate(startTierIndex);
 * Subscribes 'tierUp' (profile crossfade at T3) + 'game:reset' (snap to the
 * 下町屋根並み profile) on the singleton bus. dispose() for teardown/tests.
 */
export class Backdrop {
  /**
   * @param {THREE.Scene} scene Owned by render/renderer.js.
   * @param {number} worldSeed uint32 world seed (silhouette is seeded cosmetics).
   */
  constructor(scene, worldSeed) {
    /** @type {THREE.Scene} */
    this._scene = scene;

    /* --- profile crossfade state (0 = 下町屋根並み, 1 = 富士山+湾岸) --- */
    /** @type {number} */ this._prof = 0;
    /** @type {number} */ this._profFrom = 0;
    /** @type {number} */ this._profTo = 0;
    /** @type {number} */ this._fadeT = 0;
    /** @type {number} */ this._fadeDur = 0; // 0 = not fading

    /* --- geometry (boot-only allocation) --- */
    const rnd = mulberry32((worldSeed ^ SEED_SALT) >>> 0);
    const geo = this._buildGeometry(rnd);

    /** @type {{[k:string]: {value: *}}} */
    this._uniforms = {
      uProfile01: { value: 0 },
      uHeight: { value: BACKDROP_HEIGHT_K },
      uFogColor: { value: new THREE.Color(0xffffff) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader: BACKDROP_VERT,
      fragmentShader: BACKDROP_FRAG,
      side: THREE.DoubleSide,
      depthWrite: false,
      fog: false, // fixed-haze mix above (the ring never moves relative to the camera)
    });

    /** @type {THREE.Mesh} */
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -5; // after sky (-10), before world (0)
    scene.add(this.mesh);

    /* --- bus subscriptions (cosmetic only) --- */
    /** @type {(p: TierUpEvent) => void} */
    this._onTierUp = (p) => this._startProfileFade(p.tierIndex >= SKYLINE_FROM_TIER ? 1 : 0);
    bus.on(EVT.TIER_UP, this._onTierUp);
    /** @type {() => void} */
    this._onGameReset = () => this.setProfileImmediate(0);
    bus.on(EVT.GAME_RESET, this._onGameReset);

    if (import.meta.env && import.meta.env.DEV) {
      const tris = /** @type {THREE.BufferGeometry} */ (geo).index.count / 3;
      if (tris > 1600) throw new Error(`[backdrop] tri budget exceeded: ${tris} > 1600`);
    }
  }

  /**
   * Per-frame update — main.js step 6, AFTER cameraRig.update (and after
   * ScaleManager). A pure function of (radius, camera): position follows the
   * camera XZ at ground level, uniform scale = radiusSim => pixel-identical
   * at rescale, nothing to do on rebase. Reads the LIVE fog color from
   * scene.fog so tier palette fades and the finale night fade come free.
   * Zero allocation.
   * @param {number} dt Frame delta (s).
   * @param {BallState} ball The single source of ball truth.
   * @param {THREE.PerspectiveCamera} camera The render camera.
   */
  update(dt, ball, camera) {
    // Profile crossfade (cosmetic, rides EVT.TIER_UP alongside the palette fade).
    if (this._fadeDur > 0) {
      this._fadeT += dt;
      const k = easeInOutCubic(clamp01(this._fadeT / this._fadeDur));
      this._prof = lerp(this._profFrom, this._profTo, k);
      this._uniforms.uProfile01.value = this._prof;
      if (this._fadeT >= this._fadeDur) this._fadeDur = 0;
    }

    // Live fog color (environment.js mutates scene.fog.color in place).
    const fog = this._scene.fog;
    if (fog !== null) this._uniforms.uFogColor.value.copy(fog.color);

    // Pure function of camera + radius (the rescale/rebase law of this file).
    this.mesh.position.set(camera.position.x, 0, camera.position.z);
    this.mesh.scale.setScalar(ball.radiusSim);
  }

  /**
   * Snap the profile blend with no fade (game reset; optional ?r= dev start).
   * @param {number} tierIndex 0..6 (v3 7-tier table).
   */
  setProfileImmediate(tierIndex) {
    this._prof = tierIndex >= SKYLINE_FROM_TIER ? 1 : 0;
    this._profFrom = this._prof;
    this._profTo = this._prof;
    this._fadeDur = 0;
    this._uniforms.uProfile01.value = this._prof;
  }

  /** Unsubscribe + release GPU resources (teardown / tests). */
  dispose() {
    bus.off(EVT.TIER_UP, this._onTierUp);
    bus.off(EVT.GAME_RESET, this._onGameReset);
    this._scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    /** @type {THREE.ShaderMaterial} */ (this.mesh.material).dispose();
  }

  /* ------------------------------------------------------------------ */
  /* Internals                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Begin a PALETTE_FADE_S crossfade toward a profile blend target.
   * @param {number} to 0 (下町屋根並み) or 1 (富士山+湾岸スカイライン).
   */
  _startProfileFade(to) {
    if (to === this._profTo && this._fadeDur === 0 && this._prof === to) return; // already there
    this._profFrom = this._prof;
    this._profTo = to;
    this._fadeT = 0;
    this._fadeDur = PALETTE_FADE_S;
  }

  /**
   * Build the 2-layer ring geometry (boot only — allocates).
   * Layer 0 (back): radius 48, full height, hazier, carries the Mt. Fuji
   * cone on profile B; layer 1 (front): radius 38.4, ~0.62 height,
   * BACKDROP_FOG_MIX, pure rooflines/bay skyline. Both profiles + both color
   * sets are baked as attributes; the vertex shader blends them by uProfile01.
   * @param {() => number} rnd Seeded PRNG (consumed in a fixed order — deterministic).
   * @returns {THREE.BufferGeometry}
   */
  _buildGeometry(rnd) {
    const layers = [
      // roofCol: warm dark tile/wood; bayCol: cool blue towers; fujiCol: pale blue-grey mountain.
      { radius: BACKDROP_DIST_K, amp: 1.0, fogMix: BACKDROP_FOG_MIX_BACK, roofCol: [0.20, 0.17, 0.15], bayCol: [0.15, 0.17, 0.23], fujiCol: [0.30, 0.33, 0.42], withFuji: true },
      { radius: BACKDROP_DIST_K * 0.8, amp: 0.62, fogMix: BACKDROP_FOG_MIX, roofCol: [0.11, 0.09, 0.08], bayCol: [0.07, 0.08, 0.12], fujiCol: [0.30, 0.33, 0.42], withFuji: false },
    ];
    const cols = SEG + 1;
    const rows = ROWS + 1;
    const vertsPerLayer = cols * rows;
    const vertCount = vertsPerLayer * layers.length;

    const positions = new Float32Array(vertCount * 3);
    const heightA = new Float32Array(vertCount);
    const heightB = new Float32Array(vertCount);
    const colorA = new Float32Array(vertCount * 3);
    const colorB = new Float32Array(vertCount * 3);
    const fogMix = new Float32Array(vertCount);
    const indices = new Uint16Array(layers.length * SEG * ROWS * 6);

    let ii = 0;
    for (let L = 0; L < layers.length; L++) {
      const lay = layers[L];
      // Fixed draw order from one rnd stream => deterministic per worldSeed.
      const roofs = genShitamachi(rnd, lay.amp, lay.roofCol[0], lay.roofCol[1], lay.roofCol[2]);
      const fujiBay = genFujiBay(rnd, lay.amp, lay.bayCol[0], lay.bayCol[1], lay.bayCol[2], lay.fujiCol, lay.withFuji);
      const base = L * vertsPerLayer;

      for (let row = 0; row < rows; row++) {
        // Row 0 dips slightly below ground level to seal against the plane.
        const rowFrac = row === 0 ? -0.04 : row / ROWS;
        for (let c = 0; c < cols; c++) {
          const v = base + row * cols + c;
          const ang = (c / SEG) * Math.PI * 2;
          positions[v * 3 + 0] = Math.cos(ang) * lay.radius;
          positions[v * 3 + 1] = rowFrac;
          positions[v * 3 + 2] = Math.sin(ang) * lay.radius;
          heightA[v] = roofs.heights[c];
          heightB[v] = fujiBay.heights[c];
          colorA[v * 3 + 0] = roofs.colors[c * 3 + 0];
          colorA[v * 3 + 1] = roofs.colors[c * 3 + 1];
          colorA[v * 3 + 2] = roofs.colors[c * 3 + 2];
          colorB[v * 3 + 0] = fujiBay.colors[c * 3 + 0];
          colorB[v * 3 + 1] = fujiBay.colors[c * 3 + 1];
          colorB[v * 3 + 2] = fujiBay.colors[c * 3 + 2];
          fogMix[v] = lay.fogMix;
        }
      }

      for (let row = 0; row < ROWS; row++) {
        for (let c = 0; c < SEG; c++) {
          const a = base + row * cols + c;
          const b = a + 1;
          const d = a + cols;
          const e = d + 1;
          indices[ii++] = a; indices[ii++] = d; indices[ii++] = b;
          indices[ii++] = b; indices[ii++] = d; indices[ii++] = e;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aHeightA', new THREE.BufferAttribute(heightA, 1));
    geo.setAttribute('aHeightB', new THREE.BufferAttribute(heightB, 1));
    geo.setAttribute('aColorA', new THREE.BufferAttribute(colorA, 3));
    geo.setAttribute('aColorB', new THREE.BufferAttribute(colorB, 3));
    geo.setAttribute('aFog', new THREE.BufferAttribute(fogMix, 1));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }
}
