/**
 * @file endingView.js — v6 Formosa-island finale sky element (pack-driven,
 * replaces v5 earthView.js): a flat Taiwan ("番薯") island silhouette seen
 * from above, with lit/dim city-pin Points and the same ~700-point star dome
 * retained from earthView.js. Island shape, city pins, and color palette all
 * come from activePack.ending — zero hardcoded geography.
 *
 * RENDER LAYERING: same transparent-pass trick as earthView.js.
 * renderOrder slots:  stars (4) < island (5) < effects sparkles (10).
 * depthTest:false, depthWrite:false — paints over the fogged/space-faded
 * world below, in the screen region the liftoff camera points at.
 *
 * BUDGETS: island ShapeGeometry (~60 tris for 28-point outline) + city Points
 * (1 draw call, 9 points) + star Points = +3 draw calls, FINALE-ONLY
 * (group.visible). Ledger worst-case 68+3 = 71 <= DRAW_CALL_CAP 72.
 *
 * SIZING: identical to earthView.js — every dimension is a multiple of the
 * frozen post-contact ball radius r (sim units), passed via setAnchor().
 *   island scale: ISLAND_R_K * r (fits within ~45r sphere the globe used)
 *   star shell: STAR_SHELL_K * r = 160 r (safely inside CAMERA_FAR 4000)
 *
 * API (finale.js, same as EarthView — drop-in replacement):
 *   show() / hide()           — group visibility; hide() also rewinds fade.
 *   setProgress01(u)          — fade-in (island from u 0.15, stars from u 0.25)
 *                               + parallax sink (island drops away as u→1).
 *   setAnchor(x, y, z, r)    — sim-space anchor + frozen ball radius.
 *   setTime(t)                — twinkle clock (one uniform) + slow island drift.
 *   dispose()                 — teardown (tests).
 *
 * @param {object} ending activePack.ending — { islandOutline, cities, colors }
 * @param {THREE.Scene} scene
 */

import * as THREE from 'three';
import { mulberry32 } from '../core/rng.js';

/* ---- tunables --------------------------------------------------------- */
/** Island half-size in sim-space = ISLAND_R_K * ballRadiusSim. The v5 globe
 *  was EARTH_R_K=45; the flat island needs less, feels better at ~32. */
// ponytail: was 32 — far too big to fit the 52° ascension FOV (only the top tip
// showed → read as a "green triangle"). 11 fits the whole island in frame.
const ISLAND_R_K = 11;
/** Island depth below the rising anchor (in r) at ascension start / end. The
 *  finale camera looks at anchorY - CINE_LOOK_DOWN_K(=6)*r, so the island centre
 *  must sit near that depth to be framed (was 44..62 r below → off-screen). */
const ISLAND_GAP0_K = 7;
const ISLAND_GAP1_K = 13;
/** Island tilts slightly toward the camera for a birds-eye read. */
// ponytail: was 0.08 (~14°) — too flat for the oblique ~25° ascension camera, so
// the tall Taiwan foreshortened into a blob. ~58° stands it up to face the camera
// so the silhouette reads as Taiwan.
const ISLAND_TILT_RAD = Math.PI * 0.32; // ~58 degrees — face the descending camera
/** Extrusion depth (sim units relative to r) — gives the flat shape a little
 *  thickness so it catches the ambient light. */
const EXTRUDE_DEPTH_K = 0.6;
/** Star shell radius (same as earthView.js). */
const STAR_SHELL_K = 160;
const STAR_COUNT = 700;
/** Render-order slots (same as earthView.js to maintain layering contract). */
const STAR_RENDER_ORDER = 4;
const ISLAND_RENDER_ORDER = 5;
const CITY_RENDER_ORDER = 6; // just above island, below effects
/** Slow drift (rad/s) — replaces the globe spin with a gentle island sway. */
const DRIFT_RADPS = 0.004;
/** Deterministic seed for star placement ('FORM'). */
const ENDING_SEED = 0x464f524d; // FORM
/** Lit city point size (px, sizeAttenuation:false). */
const CITY_LIT_SIZE = 5.0;
/** Dim city point size (px). */
const CITY_DIM_SIZE = 2.5;

const TWO_PI = Math.PI * 2;

/* ---- boot-time scratch (constructor only) ----------------------------- */
const _cTmp = new THREE.Color();

/**
 * v6 Formosa-island finale view. Construct once at boot; inject into the
 * finale via finale.setEarthView(endingView) — same late-wire hook. Starts
 * hidden; +3 draws only while shown (finale-only).
 *
 * @param {THREE.Scene} scene
 * @param {object} ending activePack.ending { islandOutline, cities, colors }
 */
export class EndingView {
  /**
   * @param {THREE.Scene} scene
   * @param {object} ending
   */
  constructor(scene, ending, litCityId = '') {
    /** @type {THREE.Scene} */
    this._scene = scene;
    /** @type {THREE.Group} */
    this.group = new THREE.Group();
    this.group.visible = false;
    scene.add(this.group);

    /** Shared twinkle clock uniform (island + city + stars — ONE write/frame). */
    this._uTime = { value: 0 };
    /** @type {number} Current liftoff progress (setProgress01). */
    this._u = 0;

    const { islandOutline, cities, colors } = ending;
    const rng = mulberry32(ENDING_SEED);

    /* ---- Island mesh: flat ExtrudeGeometry from the polygon outline ------ */
    const shape = new THREE.Shape();
    // islandOutline is [x, z] pairs; THREE.Shape lives in the XY plane,
    // so we map: shapeX = outline[i][0], shapeY = outline[i][1] (= world Z).
    // The group rotation will pivot it into the XZ plane.
    shape.moveTo(islandOutline[0][0], islandOutline[0][1]);
    for (let i = 1; i < islandOutline.length; i++) {
      shape.lineTo(islandOutline[i][0], islandOutline[i][1]);
    }
    shape.closePath();

    const extrudeSettings = {
      depth: EXTRUDE_DEPTH_K,       // in local units; scaled per setAnchor
      bevelEnabled: false,
    };
    const islandGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // ExtrudeGeometry sits in XY — rotate to XZ plane (island lies flat).
    // +90 (was -90) maps shapeY (z, south+) → world +Z, matching the city pins
    // (which use city.z directly). -90 flipped N/S so the island rendered upside
    // down and pins landed on the wrong half. DoubleSide below covers the flipped
    // winding so the cap still draws.
    islandGeo.rotateX(Math.PI / 2);

    const islandColor = new THREE.Color(colors.island);
    const islandEmissive = new THREE.Color(colors.islandEmissive);

    /** @type {THREE.MeshBasicMaterial} */
    this._islandMat = new THREE.MeshBasicMaterial({
      color: islandColor,
      side: THREE.DoubleSide, // N/S flip reverses winding — draw both faces
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      fog: false,
    });
    // Tint the emissive into the color via lerp (MeshBasicMaterial has no
    // emissive; we bake a mid-toned blend).
    _cTmp.copy(islandColor).lerp(islandEmissive, 0.3);
    this._islandMat.color.copy(_cTmp);

    /** @type {THREE.Mesh} */
    this._island = new THREE.Mesh(islandGeo, this._islandMat);
    this._island.frustumCulled = false;
    this._island.renderOrder = ISLAND_RENDER_ORDER;
    // Tilt slightly forward so the island reads as a shape from the camera.
    this._island.rotation.x = ISLAND_TILT_RAD;
    this.group.add(this._island);

    /* ---- City pin Points (lit + dim in ONE geometry, tinted by vColor) --- */
    const cityCount = cities.length;
    const cPos = new Float32Array(cityCount * 3);
    const cCol = new Float32Array(cityCount * 3);
    const cTwk = new Float32Array(cityCount * 2); // (amplitude, phase)
    const litColor = new THREE.Color(colors.cityLit);
    const dimColor = new THREE.Color(colors.cityDim);

    for (let i = 0; i < cityCount; i++) {
      const city = cities[i];
      // City x/z normalized coords map to 3D: x stays x, z stays z, y = 0
      // (flat on the island surface, lifted slightly by the extrude).
      cPos[i * 3]     = city.x;
      cPos[i * 3 + 1] = 0.02; // just above the island face
      cPos[i * 3 + 2] = city.z;
      // Engine decides "lit" from the active city id (doer-proof) — falls back
      // to a per-city `lit` flag if a pack still ships one.
      const isLit = litCityId ? city.id === litCityId : !!city.lit;
      const c = isLit ? litColor : dimColor;
      cCol[i * 3]     = c.r;
      cCol[i * 3 + 1] = c.g;
      cCol[i * 3 + 2] = c.b;
      // Lit cities twinkle brightly; dim cities barely flicker.
      cTwk[i * 2]     = isLit ? (0.5 + 0.4 * rng()) : (0.05 + 0.05 * rng());
      cTwk[i * 2 + 1] = rng() * TWO_PI;
    }
    const cityGeo = new THREE.BufferGeometry();
    cityGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
    cityGeo.setAttribute('color',    new THREE.BufferAttribute(cCol, 3));
    cityGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(cTwk, 2));

    /** @type {THREE.PointsMaterial} */
    this._cityMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: CITY_LIT_SIZE,        // uses max size; dim points are just darker
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this._cityMat.onBeforeCompile = _makeTwinkleInjector(this._uTime);

    /** @type {THREE.Points} */
    this._cities = new THREE.Points(cityGeo, this._cityMat);
    this._cities.frustumCulled = false;
    this._cities.renderOrder = CITY_RENDER_ORDER;
    // Tilt city points the same as the island mesh.
    this._cities.rotation.x = ISLAND_TILT_RAD;
    this.group.add(this._cities);

    /* ---- Star dome: identical to earthView.js (retained) ---------------- */
    const sPos = new Float32Array(STAR_COUNT * 3);
    const sCol = new Float32Array(STAR_COUNT * 3);
    const sTwk = new Float32Array(STAR_COUNT * 2);
    for (let i = 0; i < STAR_COUNT; i++) {
      const y = 2 * rng() - 1;
      const az = rng() * TWO_PI;
      const hr = Math.sqrt(Math.max(0, 1 - y * y));
      sPos[i * 3]     = Math.cos(az) * hr;
      sPos[i * 3 + 1] = y;
      sPos[i * 3 + 2] = Math.sin(az) * hr;
      const t = rng();
      const b = 0.7 + 0.3 * rng();
      sCol[i * 3]     = (0.85 + 0.15 * t) * b;
      sCol[i * 3 + 1] = (0.88 + 0.10 * t) * b;
      sCol[i * 3 + 2] = (1.0  - 0.12 * t) * b;
      sTwk[i * 2]     = 0.3 + 0.6 * rng();
      sTwk[i * 2 + 1] = rng() * TWO_PI;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3));
    starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(sTwk, 2));

    /** @type {THREE.PointsMaterial} */
    this._starMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 2.2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    this._starMat.onBeforeCompile = _makeTwinkleInjector(this._uTime);

    /** @type {THREE.Points} */
    this._stars = new THREE.Points(starGeo, this._starMat);
    this._stars.frustumCulled = false;
    this._stars.renderOrder = STAR_RENDER_ORDER;
    this.group.add(this._stars);
  }

  /* ------------------------------------------------------------------ */
  /* Public API (drop-in for EarthView)                                  */
  /* ------------------------------------------------------------------ */

  /** Make visible (finale ASCENSION entry). Idempotent. */
  show() {
    this.group.visible = true;
  }

  /** Hide and rewind fade (finale.reset()). Idempotent. */
  hide() {
    this.group.visible = false;
    this._u = 0;
    this._islandMat.opacity = 0;
    this._cityMat.opacity = 0;
    this._starMat.opacity = 0;
  }

  /**
   * Liftoff progress 0..1. Drives fade-in and parallax sink (island drops
   * away from the rising camera as u→1, mirroring the globe parallax).
   * Scalar writes only — zero allocation.
   * @param {number} u
   */
  setProgress01(u) {
    this._u = u < 0 ? 0 : u > 1 ? 1 : u;
    // Island fades in from u=0.15 (same onset as the globe).
    const io = (this._u - 0.15) / 0.45;
    this._islandMat.opacity = io < 0 ? 0 : io > 1 ? 1 : io;
    // City pins slightly delayed (appear after island outline resolves).
    const co = (this._u - 0.22) / 0.40;
    this._cityMat.opacity = co < 0 ? 0 : co > 1 ? 1 : co;
    // Stars same as earthView.js (from u=0.25).
    const so = (this._u - 0.25) / 0.5;
    this._starMat.opacity = so < 0 ? 0 : so > 1 ? 1 : so;
  }

  /**
   * Per-frame pose drive (finale ASCENSION/AFTERGLOW). Zero allocation.
   * @param {number} x Anchor x (sim). @param {number} y Anchor y (sim).
   * @param {number} z Anchor z (sim). @param {number} r Ball radius (sim).
   */
  setAnchor(x, y, z, r) {
    // Island hangs below the rising anchor, same gap law as the globe.
    const gap = ISLAND_GAP0_K + (ISLAND_GAP1_K - ISLAND_GAP0_K) * this._u;
    const islandY = y - gap * r;
    const islandScale = ISLAND_R_K * r;

    this._island.position.set(x, islandY, z);
    this._island.scale.setScalar(islandScale);

    this._cities.position.set(x, islandY, z);
    this._cities.scale.setScalar(islandScale);

    this._stars.position.set(x, y, z);
    this._stars.scale.setScalar(STAR_SHELL_K * r);
  }

  /**
   * Twinkle clock + slow island drift. ONE shared uniform write per frame.
   * @param {number} t Seconds.
   */
  setTime(t) {
    this._uTime.value = t;
    // Gentle yaw drift instead of globe spin — the island rotates in place.
    this._island.rotation.y = t * DRIFT_RADPS;
    this._cities.rotation.y = t * DRIFT_RADPS;
  }

  /** Teardown (tests): remove from scene and release GPU resources. */
  dispose() {
    this._scene.remove(this.group);
    this._island.geometry.dispose();
    this._islandMat.dispose();
    this._cities.geometry.dispose();
    this._cityMat.dispose();
    this._stars.geometry.dispose();
    this._starMat.dispose();
  }
}

/**
 * Shared onBeforeCompile twinkle injector (identical to earthView.js):
 * links the uTime uniform and modulates vertex color by per-vertex
 * aTwinkle=(amplitude, phase). Works for both MeshBasicMaterial and
 * PointsMaterial (both use `#include <color_vertex>`).
 * @param {{value: number}} uTime
 * @returns {(shader: object) => void}
 */
function _makeTwinkleInjector(uTime) {
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
