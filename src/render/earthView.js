/**
 * @file earthView.js — v5 space-earth finale sky element (Stream C): a
 * procedural night-side EARTH globe (dark oceans, faint continent patches,
 * twinkling city-light speckles concentrated in a Japan-arc region — all
 * vertex colors from seeded noise, NO textures) plus a ~700-point star dome.
 * The moon-mesh precedent (the deleted v2 render/moon.js): fog:false,
 * frustumCulled:false, NOT part of the world rescale — the view is only ever
 * visible post-GOAL_CONTACT, where rescale/rebase structurally cannot fire
 * (growth frozen, maybeRebase gated), and every pose is rewritten per frame
 * by the finale from its rescale-safe _simCache, so no bus subscription is
 * needed.
 *
 * RENDER LAYERING (the trick that makes "Earth below the diorama" work
 * without touching any world mesh): both meshes are TRANSPARENT with
 * depthTest:false/depthWrite:false, so they render in the transparent pass
 * AFTER the whole opaque world, painting OVER the (by then fully night-
 * fogged / space-faded) ground plane, ribbons and buildings below — exactly
 * the screen region the liftoff camera points at. renderOrder slots them
 * between the existing transparent elements:
 *   blob shadow (1) < stars (4) < earth (5) < effects sparkles (10)
 * so the Earth covers the parked blob shadow and the lower-hemisphere stars
 * (paint-order occlusion — no depth reads needed), while the golden
 * ascension fountain stays in front. The sky dome (opaque pass, renderOrder
 * -10, depthWrite:false) is behind everything by construction.
 *
 * BUDGETS: Earth sphere 48x32 segments (~3.0k tris) + one Points draw =
 * +2 draw calls, FINALE-ONLY (group.visible) — worst-case ledger 68+2 =
 * 70 <= DRAW_CALL_CAP 72. Geometry/colors are boot-built once from
 * mulberry32(0x45415254); per-frame cost is ONE shared uTime uniform write,
 * two opacity scalars and two object transforms — zero allocation.
 *
 * SIZING: everything is proportional to the frozen post-contact ball radius
 * r (sim units), passed by the finale on every setAnchor call. Worst case
 * r = 12.5 sim: earth far point (GAP1+2R)*r ≈ 1500 sim, star shell 160r =
 * 2000 sim — both safely inside CAMERA_FAR 4000.
 *
 * API (finale.js, via the setEarthView late-wire):
 *   show() / hide()           — group visibility (hide() on finale.reset()).
 *   setProgress01(u)          — fade-in + parallax sink of the globe.
 *   setAnchor(x, y, z, r)     — sim-space anchor pose + frozen ball radius,
 *                               called every ASCENSION/AFTERGLOW frame.
 *   setTime(t)                — twinkle clock (one uniform) + slow spin.
 *   dispose()                 — teardown (tests).
 */

import * as THREE from 'three';
import { mulberry32 } from '../core/rng.js';

/* ---- module-local tunables (cosmetic; not tuning.js) ---------------- */
/** Earth radius = EARTH_R_K * ballRadiusSim. */
const EARTH_R_K = 45;
/** Camera-to-globe gap (in r) at ascension start / end — the parallax sink:
 *  the globe drops away as the ball "lifts off". Center depth below the
 *  anchor = (EARTH_R_K + lerp(GAP0,GAP1,u)) * r. */
const EARTH_GAP0_K = 12;
const EARTH_GAP1_K = 30;
/** Star shell radius = STAR_SHELL_K * ballRadiusSim (beyond the globe's far
 *  point ~120r so paint-order occlusion reads correctly). */
const STAR_SHELL_K = 160;
const STAR_COUNT = 700;
/** Transparent-pass paint order (see header layering note). */
const STAR_RENDER_ORDER = 4;
const EARTH_RENDER_ORDER = 5;
/** Slow globe spin (rad/s) — barely perceptible drift, adds life for free. */
const SPIN_RADPS = 0.006;
/** Deterministic seed ('EART' LE) — boot-built once, identical every run. */
const EARTH_SEED = 0x45415254;
/** Palette (sRGB hex -> working space via THREE.Color, like the rest of the
 *  art): dark ocean, faint continents, warm sodium city lights. */
const OCEAN_HEX = 0x06101e;
const LAND_HEX = 0x16261c;
const CITY_HEX = 0xffd27a;
/** Land threshold on the 3-octave fbm (tuned for ~30% land coverage). */
const LAND_T = 0.565;
/** Japan-arc light-density boost: region around this direction. The camera
 *  always looks DOWN at the globe's upper cap, so the arc lives near +Y
 *  (slightly tilted for asymmetry) — view-correct without knowing the
 *  approach azimuth. */
const JAPAN_DIR = new THREE.Vector3(0.34, 0.88, 0.33).normalize();
const TWO_PI = Math.PI * 2;

/* ---- boot-time scratch (constructor only — never per frame) ---------- */
const _cOcean = new THREE.Color(OCEAN_HEX);
const _cLand = new THREE.Color(LAND_HEX);
const _cCity = new THREE.Color(CITY_HEX);
const _cTmp = new THREE.Color();

/**
 * Integer-lattice hash -> [0,1) (deterministic across platforms — integer
 * ops only until the final divide). Seeded per-instance from mulberry32.
 * @param {number} x @param {number} y @param {number} z @param {number} seed
 * @returns {number}
 */
function hash3(x, y, z, seed) {
  let h = Math.imul(x | 0, 0x8da6b343) ^ Math.imul(y | 0, 0xd8163841) ^ Math.imul(z | 0, 0xcb1ab31f) ^ (seed | 0);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/** Smootherstep weight for the trilinear noise blend. @param {number} t */
function sm(t) {
  return t * t * (3 - 2 * t);
}

/**
 * One octave of 3D value noise (trilinear-blended lattice hash).
 * @param {number} x @param {number} y @param {number} z @param {number} seed
 * @returns {number} [0,1)
 */
function vnoise3(x, y, z, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = sm(x - ix);
  const fy = sm(y - iy);
  const fz = sm(z - iz);
  const c000 = hash3(ix, iy, iz, seed);
  const c100 = hash3(ix + 1, iy, iz, seed);
  const c010 = hash3(ix, iy + 1, iz, seed);
  const c110 = hash3(ix + 1, iy + 1, iz, seed);
  const c001 = hash3(ix, iy, iz + 1, seed);
  const c101 = hash3(ix + 1, iy, iz + 1, seed);
  const c011 = hash3(ix, iy + 1, iz + 1, seed);
  const c111 = hash3(ix + 1, iy + 1, iz + 1, seed);
  const x00 = c000 + (c100 - c000) * fx;
  const x10 = c010 + (c110 - c010) * fx;
  const x01 = c001 + (c101 - c001) * fx;
  const x11 = c011 + (c111 - c011) * fx;
  const y0 = x00 + (x10 - x00) * fy;
  const y1 = x01 + (x11 - x01) * fy;
  return y0 + (y1 - y0) * fz;
}

/**
 * 3-octave fbm on the unit sphere (continent mask).
 * @param {number} x @param {number} y @param {number} z @param {number} seed
 * @returns {number} ~[0,1)
 */
function fbm3(x, y, z, seed) {
  return (
    0.52 * vnoise3(x * 2.1 + 13.7, y * 2.1 + 7.3, z * 2.1 + 3.1, seed) +
    0.30 * vnoise3(x * 4.5 + 31.1, y * 4.5 + 17.9, z * 4.5 + 11.4, seed) +
    0.18 * vnoise3(x * 9.2 + 53.9, y * 9.2 + 41.2, z * 9.2 + 23.8, seed)
  );
}

/**
 * v5 space-earth finale view. Construct once at boot (integrator), inject
 * into the finale via finale.setEarthView(earthView). Starts hidden; +2
 * draws only while shown (finale-only).
 */
export class EarthView {
  /**
   * @param {THREE.Scene} scene Owned by render/renderer.js.
   */
  constructor(scene) {
    /** @type {THREE.Scene} */
    this._scene = scene;
    /** @type {THREE.Group} */
    this.group = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);

    /** Shared twinkle clock uniform (earth + stars — ONE write per frame).
     *  @type {{value: number}} */
    this._uTime = { value: 0 };
    /** @type {number} Current progress (setProgress01). */
    this._u = 0;

    const rng = mulberry32(EARTH_SEED);
    const noiseSeed = (rng() * 4294967296) | 0;

    /* ---- Earth globe: vertex-colored unit sphere (scaled per frame) ---- */
    const geo = new THREE.SphereGeometry(1, 48, 32); // ~3.0k tris
    const pos = geo.getAttribute('position');
    const count = pos.count;
    const col = new Float32Array(count * 3);
    const twk = new Float32Array(count * 2); // (amplitude, phase)
    for (let i = 0; i < count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = pos.getZ(i);
      const n = fbm3(px, py, pz, noiseSeed);
      let amp = 0;
      let phase = 0;
      if (n <= LAND_T) {
        // OCEAN — dark, mildly mottled.
        const shade = 0.78 + 0.45 * vnoise3(px * 6.3, py * 6.3, pz * 6.3, noiseSeed ^ 0x55aa);
        _cTmp.copy(_cOcean).multiplyScalar(shade);
      } else {
        // LAND — faint continent tone; city lights speckle the verts.
        const shade = 0.8 + 0.5 * vnoise3(px * 7.1 + 9.0, py * 7.1, pz * 7.1, noiseSeed ^ 0x33cc);
        _cTmp.copy(_cLand).multiplyScalar(shade);
        // Coastal bias (real night lights hug the coast) + Japan-arc boost.
        const coastK = 1 - Math.min(1, (n - LAND_T) / 0.12);
        let pLight = 0.10 + 0.16 * coastK;
        const jd = px * JAPAN_DIR.x + py * JAPAN_DIR.y + pz * JAPAN_DIR.z;
        if (jd > 0.90) pLight = Math.min(0.85, pLight * 4 + 0.22);
        if (rng() < pLight) {
          const glow = 0.55 + 0.75 * rng();
          _cTmp.lerp(_cCity, 0.88).multiplyScalar(glow);
          amp = 0.35 + 0.5 * rng(); // twinkle: factor dips to (1 - amp)
          phase = rng() * TWO_PI;
        }
      }
      col[i * 3] = _cTmp.r;
      col[i * 3 + 1] = _cTmp.g;
      col[i * 3 + 2] = _cTmp.b;
      twk[i * 2] = amp;
      twk[i * 2 + 1] = phase;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aTwinkle', new THREE.BufferAttribute(twk, 2));

    /** @type {THREE.MeshBasicMaterial} */
    this._earthMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true, // transparent pass => paints over the fogged world
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      fog: false, // sky-element exemption (moon precedent)
    });
    this._earthMat.onBeforeCompile = makeTwinkleInjector(this._uTime);
    /** @type {THREE.Mesh} */
    this._earth = new THREE.Mesh(geo, this._earthMat);
    this._earth.frustumCulled = false;
    this._earth.renderOrder = EARTH_RENDER_ORDER;
    this.group.add(this._earth);

    /* ---- Star dome: Points on a unit shell (scaled per frame) ---- */
    const sPos = new Float32Array(STAR_COUNT * 3);
    const sCol = new Float32Array(STAR_COUNT * 3);
    const sTwk = new Float32Array(STAR_COUNT * 2);
    for (let i = 0; i < STAR_COUNT; i++) {
      // Uniform on the sphere (cosine-of-elevation method).
      const y = 2 * rng() - 1;
      const az = rng() * TWO_PI;
      const hr = Math.sqrt(Math.max(0, 1 - y * y));
      sPos[i * 3] = Math.cos(az) * hr;
      sPos[i * 3 + 1] = y;
      sPos[i * 3 + 2] = Math.sin(az) * hr;
      // Subtle blue/warm tint variation around white.
      const t = rng();
      const b = 0.7 + 0.3 * rng();
      sCol[i * 3] = (0.85 + 0.15 * t) * b;
      sCol[i * 3 + 1] = (0.88 + 0.10 * t) * b;
      sCol[i * 3 + 2] = (1.0 - 0.12 * t) * b;
      sTwk[i * 2] = 0.3 + 0.6 * rng();
      sTwk[i * 2 + 1] = rng() * TWO_PI;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(sTwk, 2));
    /** @type {THREE.PointsMaterial} */
    this._starMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 2.2,
      sizeAttenuation: false, // constant pixel size at any shell scale
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this._starMat.onBeforeCompile = makeTwinkleInjector(this._uTime);
    /** @type {THREE.Points} */
    this._stars = new THREE.Points(starGeo, this._starMat);
    this._stars.frustumCulled = false;
    this._stars.renderOrder = STAR_RENDER_ORDER; // behind the globe (paint order)
    this.group.add(this._stars);
  }

  /** Make the view visible (finale: ASCENSION entry). Idempotent. */
  show() {
    this.group.visible = true;
  }

  /** Hide (finale.reset()). Also rewinds the fade so a replay starts clean. */
  hide() {
    this.group.visible = false;
    this._u = 0;
    this._earthMat.opacity = 0;
    this._starMat.opacity = 0;
  }

  /**
   * Liftoff progress 0..1 (finale ASCENSION u; held at 1 in AFTERGLOW).
   * Drives the fade-in (earth from u 0.15, stars from u 0.25) and is read by
   * setAnchor for the parallax sink. Scalar writes only.
   * @param {number} u
   */
  setProgress01(u) {
    this._u = u < 0 ? 0 : u > 1 ? 1 : u;
    const eo = (this._u - 0.15) / 0.45;
    this._earthMat.opacity = eo < 0 ? 0 : eo > 1 ? 1 : eo;
    const so = (this._u - 0.25) / 0.5;
    this._starMat.opacity = so < 0 ? 0 : so > 1 ? 1 : so;
  }

  /**
   * Per-frame pose drive (finale ASCENSION/AFTERGLOW): the globe hangs
   * (EARTH_R_K + gap(u)) * r below the rising anchor — the gap widens with
   * progress so the planet visibly drops away; the star shell is centered on
   * the anchor. All inputs come from the finale's rescale-safe _simCache, so
   * this view needs no RESCALE/REBASE handling of its own (and neither can
   * fire post-contact). Zero allocation.
   * @param {number} x Anchor x (sim). @param {number} y Anchor y (sim).
   * @param {number} z Anchor z (sim).
   * @param {number} r Frozen post-contact ball radius (sim units).
   */
  setAnchor(x, y, z, r) {
    const gap = EARTH_GAP0_K + (EARTH_GAP1_K - EARTH_GAP0_K) * this._u;
    this._earth.position.set(x, y - (EARTH_R_K + gap) * r, z);
    this._earth.scale.setScalar(EARTH_R_K * r);
    this._stars.position.set(x, y, z);
    this._stars.scale.setScalar(STAR_SHELL_K * r);
  }

  /**
   * Twinkle clock (finale forwards its cinematic clock) — ONE shared uniform
   * write + the slow globe spin.
   * @param {number} t Seconds.
   */
  setTime(t) {
    this._uTime.value = t;
    this._earth.rotation.y = t * SPIN_RADPS;
  }

  /** Teardown (tests): remove + release GPU resources. */
  dispose() {
    this._scene.remove(this.group);
    this._earth.geometry.dispose();
    this._earthMat.dispose();
    this._stars.geometry.dispose();
    this._starMat.dispose();
  }
}

/**
 * Shared onBeforeCompile injector: links the ONE uTime uniform and modulates
 * the vertex color by the per-vertex aTwinkle = (amplitude, phase) attribute
 * — brightness dips to (1 - amplitude) on a per-vertex sine. Works for both
 * MeshBasicMaterial and PointsMaterial (both build vColor via
 * `#include <color_vertex>`). The default material program-cache key includes
 * onBeforeCompile.toString(), so these programs never collide with the stock
 * basic/points programs.
 * @param {{value: number}} uTime Shared clock uniform object.
 * @returns {(shader: {uniforms: object, vertexShader: string}) => void}
 */
function makeTwinkleInjector(uTime) {
  return (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nattribute vec2 aTwinkle;'
      )
      .replace(
        '#include <color_vertex>',
        '#include <color_vertex>\n\tvColor *= 1.0 + aTwinkle.x * 0.5 * (sin(uTime * 2.6 + aTwinkle.y) - 1.0);'
      );
  };
}
