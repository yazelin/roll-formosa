/**
 * @file environment.js — Ground shader plane (radius-scaled procedural grid),
 * sky dome (v2 shader: gradient + sun disc/glare + moon disc/craters/halo +
 * hashed twinkling stars + 2-octave drifting clouds), linear fog
 * (FOG_NEAR_K*r / FOG_FAR_K*r), tier palette 2s crossfade, hemisphere +
 * directional lights (NO shadow maps), and the blob shadow decal.
 *
 * SEAMLESSNESS LAW: fog distances, grid cell size and blob-shadow size are
 * continuous functions of ball radiusVisualSim — never tierIndex. tierIndex
 * drives ONLY the cosmetic palette crossfade (via the 'tierUp' bus event).
 * The v2 sky params (sunDir/sunIntensity/moonDir/moonAngSize/starIntensity/
 * cloudDensity/cloudHex from tiers.js) ride that SAME cosmetic crossfade.
 *
 * PIXEL-IDENTITY AT RESCALE: everything here is recomputed each update() from
 * current ball state, and update() runs AFTER ScaleManager in the frame order
 * — so the rescale frame renders identically. The v2 sky features are pure
 * functions of view DIRECTION + accumulated uTime (seconds, not sim units),
 * so they are rescale/rebase-invariant for free. The ONLY accumulated
 * sim-space state is the grid-phase origin, which rescale(S)/rebase(dx,dz)
 * keep continuous:
 *   grid phase = (worldXZ + gridOrigin) / (GRID_CELL_K * r)
 *   rescale: worldXZ *= S, r *= S      => gridOrigin *= S
 *   rebase:  worldXZ -= offset         => gridOrigin += offset
 *
 * SKY MOON (v3: NIGHT COSMETIC ONLY — uMoonFade stays 1): the moon disc is
 * rendered INSIDE the sky-dome fragment shader (zero extra draw calls).
 * uMoonDir / uMoonAngSize crossfade per tier; getMoonDirWorld(out) exposes
 * the CURRENT blended direction with a MOON_DIR_MIN_ELEV elevation clamp.
 * setSkyMoonFade/setSkyMoonPulse are kept (inert in v3 play — nothing drives
 * them; the v3 goal beacon lives on render/goalTower.js).
 *
 * v3 SKYTREE SILHOUETTE (BLOCKER 2 — the KEPT v2 sky-element slot,
 * re-textured; uniforms uGoalSil*): while the ball is small the 634 m goal
 * tower at SKYTREE_POS is far outside the fog/load rings, so the sky dome
 * paints a hazy tapered tower silhouette whose azimuth AND angular size are
 * recomputed per frame from the camera -> SKYTREE_POS real-meter geometry
 * (cheap CPU math; angle-matched to the goalTower mesh by construction —
 * the proven v2 angular-matched handoff in reverse). The finale forwards
 * setGoalSilFade(SkytreeView.silFade01) every frame: 1 = silhouette owns the
 * tower, fading to 0 over 2 s as the mesh takes over at
 * simDist < 0.8*CAMERA_FAR. setTierPaletteImmediate resets the fade to 1.
 *
 * v3 BAY (map-edge cosmetics, +2 draw calls, counted in the 64/72 ledger):
 * one merged two-rect water quad (fog-on Lambert 0x2a4a6e) over Tokyo Bay
 * (south x[-200,1800] z[1500,2000] + east x[1400,1800] z[-400,1500]) plus an
 * L-shaped quay-wall strip along the shoreline. Both are authored in REAL
 * METERS and ride a group whose scale (1/worldScale) and position (rebase
 * shift) are refreshed every update — radius-continuous, rescale/rebase
 * exact. (The water sits at +0.3 m: the v1 ground plane is opaque at y = 0
 * and would occlude a submerged quad; the quay wall hides the seam.)
 *
 * v4 (Stream R): the bay quads + quay strip are KEPT UNCHANGED (the sea is
 * not derivable from the OSM water fetch — coastline assembly is out of v4
 * scope). Two additive exports for render/osmGround.js: getWaterMaterial()
 * (the OSM river mesh shares the bay Lambert — one program, no freed slot)
 * and the fogFarSim getter (floored sim-space fog far for ground streaming).
 *
 * v3 FOG FLOOR (FOG_FAR_MIN_M, applied at query time): fog.far =
 * max(FOG_FAR_K * rv, FOG_FAR_MIN_M / worldScale) so the 8 m shop is never
 * fog-swallowed at r = 2 cm. worldScale is tracked locally: boot value
 * 0.04, exact resync from every 10 Hz 'grow' payload (trueRadius/simRadius),
 * /= S on each rescale hook — never read from a foreign module.
 *
 * NIGHT PALETTE (kept): appended ENV-LOCALLY as _palettes[TIERS.length]
 * (tiers.js keeps exactly 7 tiers). Reachable only via beginNightFade
 * (seconds), which drives the SAME _toIndex crossfade machinery with a
 * custom duration — so setTierPaletteImmediate's snap structurally cancels
 * an in-flight night fade, and it additionally resets uMoonFade=1, pulse
 * off, star intensity, and the uGoalSil fade.
 *
 * Custom fog uniforms on the ground shader replicate THREE.Fog's LINEAR
 * factor exactly, so the ground fogs identically to the Lambert instances.
 *
 * Zero-allocation: update() mutates preallocated Colors/Vector3s/uniform
 * values only. All Color/Vector3/geometry/texture allocation happens at
 * construction (boot).
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TIERS } from '../config/tiers.js';
import {
  FOG_NEAR_K,
  FOG_FAR_K,
  FOG_FAR_MIN_M,
  PALETTE_FADE_S,
  MOON_DIR_MIN_ELEV,
  SIM_RADIUS_MIN,
  SKYTREE_BASE_R_M,
  START_RADIUS_M,
} from '../config/tuning.js';
import { SKYTREE_POS } from '../config/cityMap.js';
import { bus, EVT } from '../core/events.js';
import { easeInOutCubic, clamp01, lerp } from '../core/mathUtils.js';
import { SKYTREE_HEIGHT_M } from './goalTower.js';

/** @typedef {import('../types.js').BallState} BallState */
/** @typedef {import('../types.js').TierUpEvent} TierUpEvent */

/** Minor grid cell size = GRID_CELL_K * radiusVisualSim (ball diameter reads well). */
const GRID_CELL_K = 2.0;
/** Ground plane extent (sim units). World coords stay within ~±2048 (rebase at 1500). */
const GROUND_SIZE = 4096;
/** Sky dome radius (sim units) — inside the camera far plane (4000). */
const SKY_RADIUS = 1800;
/** Blob shadow radius = SHADOW_SCALE_K * radiusVisualSim. */
const SHADOW_SCALE_K = 1.15;
/** Blob shadow hover height (fraction of radius) — avoids z-fighting the ground. */
const SHADOW_Y_K = 0.02;
/** Directional light direction (normalized at module load — boot-time alloc). */
const LIGHT_DIR = new THREE.Vector3(0.45, 1.0, 0.3).normalize();
/** World up (moon tangent-frame derivation — boot-time alloc). */
const UP_VEC = new THREE.Vector3(0, 1, 0);
/** Directional light distance from ball = LIGHT_DIST_K * radiusVisualSim. */
const LIGHT_DIST_K = 40;

/* ---- v2 sky constants (env-local) ---- */
/** Cloud drift speed in noise-space units per second (uTime * uCloudDrift). */
const CLOUD_DRIFT = 0.010;
/** CALLED pulse: uMoonGlow breathes 1.0 -> 1.0 + GLOW_PULSE_AMP at 0.5 Hz. */
const GLOW_PULSE_AMP = 0.7;

/* ---- v3 constants (env-local) ---- */
/** Boot worldScale — the local tracker's start value (resynced from 'grow'). */
const BOOT_WORLD_SCALE = START_RADIUS_M / SIM_RADIUS_MIN;
/** Bay water surface height, REAL meters. SPEC NOTE: DESIGN-V3.md says
 *  y = -0.3, but the v1 ground plane is opaque at y = 0 and would fully
 *  occlude a submerged quad — the surface sits at +0.3 instead and the quay
 *  wall hides the shoreline seam (documented deviation). */
const WATER_Y_M = 0.3;
/** Water color (fog-on Lambert — DESIGN-V3.md 箱庭東京マップ D). */
const WATER_COLOR = 0x2a4a6e;
/** Quay wall: concrete strip along the shoreline (REAL meters). */
const QUAY_COLOR = 0x767e8a;
const QUAY_H_M = 3.0;
const QUAY_W_M = 6.0;
/** Bay rects (REAL meters; union = the spec coverage, authored non-overlapping):
 *  south band x[-200,1800] z[1500,2000]; east band x[1400,1800] z[-400,1500]. */
const BAY_SOUTH = { x0: -200, x1: 1800, z0: 1500, z1: 2000 };
const BAY_EAST = { x0: 1400, x1: 1800, z0: -400, z1: 1500 };
/** Skytree silhouette tint -> fog mix factor, baked into the GLSL below. */
const SIL_FOG_MIX_GLSL = (0.45).toFixed(2);

/* SKYTREE_POS shape guard (cityMap.js, Stream B): accept {x,z} or [x,z]. */
const SK_X = SKYTREE_POS.x !== undefined ? SKYTREE_POS.x : SKYTREE_POS[0];
const SK_Z = SKYTREE_POS.z !== undefined ? SKYTREE_POS.z : SKYTREE_POS[1];
/**
 * Env-LOCAL night palette source (finale ascension; _palettes[TIERS.length]).
 * Same shape as a tiers.js entry's sky fields. starIntensity 1.0, sun off,
 * clear sky. moonDir/moonAngSize continue from the last tier — v3: the sky
 * moon is the NIGHT COSMETIC (uMoonFade stays 1), so the full moon hangs
 * over the ascended night diorama.
 */
const NIGHT = {
  fogColor: 0x1a1838,
  skyTop: 0x101030,
  skyBottom: 0x06061a,
  sunDir: TIERS[TIERS.length - 1].sunDir,
  sunIntensity: 0,
  moonDir: TIERS[TIERS.length - 1].moonDir,
  moonAngSize: TIERS[TIERS.length - 1].moonAngSize,
  starIntensity: 1.0,
  cloudDensity: 0,
  cloudHex: 0x1a1838,
};
/** Night palette index inside _palettes (== TIERS.length, v3: 7; NEVER in tiers.js). */
const NIGHT_INDEX = TIERS.length;

/* ------------------------------------------------------------------ */
/* Shaders                                                              */
/* ------------------------------------------------------------------ */

const GROUND_VERT = /* glsl */ `
varying vec3 vWorldPos;
varying float vFogDepth;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vFogDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const GROUND_FRAG = /* glsl */ `
uniform vec3 uGroundColor;
uniform vec3 uLineColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uCell;
uniform vec2 uGridOrigin;
varying vec3 vWorldPos;
varying float vFogDepth;

float gridLine(vec2 coord) {
  vec2 g = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  return 1.0 - min(min(g.x, g.y), 1.0);
}

void main() {
  vec2 p = (vWorldPos.xz + uGridOrigin) / uCell;
  float minor = gridLine(p);
  float major = gridLine(p / 5.0);
  vec3 col = mix(uGroundColor, uLineColor, max(minor * 0.40, major * 0.75));
  // Linear fog — EXACTLY THREE.Fog's factor so ground matches the Lambert objects.
  float fogF = clamp((vFogDepth - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
  gl_FragColor = vec4(mix(col, uFogColor, fogF), 1.0);
}
`;

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position; // unit sphere: object-space position == view direction
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * v2 sky fragment shader — same dome mesh, still 1 draw call. All features
 * are functions of the unit view direction (+ uTime seconds), so the dome is
 * pixel-identical under rescale/rebase. Layer order: gradient -> stars ->
 * clouds (occlude stars) -> sun (additive) -> moon disc (opaque mix) + halo
 * (additive) -> horizon fog melt LAST (the fog wall always wins — the
 * seamlessness law's spawn-edge cover).
 */
const SKY_FRAG = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uBottom;
uniform vec3 uFogColor;
uniform vec3 uSunDir;
uniform float uSunIntensity;
uniform vec3 uMoonDir;
uniform vec3 uMoonTan;  // CPU-hoisted moon tangent frame (was per-fragment
uniform vec3 uMoonBit;  // normalize+2x cross of uniform-constant exprs)
uniform float uMoonAngSize;
uniform float uMoonGlow;
uniform float uMoonFade;
uniform float uStarIntensity;
uniform float uCloudDensity;
uniform vec3 uCloudColor;
uniform float uCloudDrift;
uniform float uTime;
// v3 Skytree silhouette (uGoalSil* — the kept sky-element slot, re-textured)
uniform vec3 uGoalSilDir;   // horizontal unit dir camera -> tower
uniform float uGoalSilTanH; // tan(angular height) = towerHeightSim / dist
uniform float uGoalSilTanW; // tan(angular half-width at base) = baseRSim / dist
uniform float uGoalSilFade; // 1 = silhouette owns the tower, 0 = mesh does
// v5 space-earth finale: zenith -> space-black darkening (finale-only).
uniform float uSpaceFade;
varying vec3 vDir;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

// 2D value noise (one octave) — analytic, no textures.
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec3 dir = normalize(vDir);
  float h = dir.y;

  // (a) vertical gradient — as v1.
  vec3 sky = mix(uBottom, uTop, pow(clamp(h, 0.0, 1.0), 0.65));

  // (a') v5 SPACE FADE (finale ascension only; uSpaceFade 0 in play): the
  // zenith darkens toward space black, elevation-weighted so the horizon
  // band keeps the (night) fog color — it reads as the atmospheric limb
  // over the EarthView globe. Applied BEFORE stars so the star layer
  // brightens against true space. Radius-independent (uniform-driven).
  sky = mix(sky, vec3(0.001, 0.0015, 0.004), uSpaceFade * smoothstep(0.0, 0.5, h));

  // (d) STARS — hashed sparkle grid, per-star twinkle phase/speed, gated by
  // uStarIntensity (per tier; NIGHT 1.0) and by elevation (above horizon only).
  vec3 cell = floor(dir * 56.0);
  float sh = hash31(cell);
  vec3 fp = fract(dir * 56.0) - 0.5;
  float dotf = 1.0 - smoothstep(0.004, 0.06, dot(fp, fp));
  float tw = 0.55 + 0.45 * sin(uTime * (1.5 + 4.0 * fract(sh * 9.7)) + sh * 41.0);
  sky += vec3(0.90, 0.93, 1.0)
       * (step(0.984, sh) * dotf * tw * uStarIntensity * smoothstep(0.02, 0.18, h));

  // (e) CLOUDS — 2-octave value noise on the dir.xz / max(dir.y, 0.05)
  // horizontal projection, drifting by uTime * uCloudDrift. Density gates
  // coverage; horizon-faded (the fog melt owns the horizon band).
  vec2 cp = dir.xz / max(h, 0.05) * 1.4;
  float ct = uTime * uCloudDrift;
  float n = vnoise(cp + vec2(ct, ct * 0.6)) * 0.65
          + vnoise(cp * 2.3 + vec2(ct * 1.7, -ct)) * 0.35;
  float clo = 1.0 - uCloudDensity * 0.9;
  float cov = smoothstep(clo, clo + 0.3, n) * smoothstep(0.03, 0.18, h);
  sky = mix(sky, uCloudColor, cov * 0.85);

  // (b) SUN — disc + pow glare lobe in lieu of god-rays. Disc fattens
  // slightly with intensity (T4 golden-hour low fat sun; T5 dusk dims it).
  float sd = dot(dir, uSunDir);
  float sunAng = 0.035 + 0.02 * clamp(uSunIntensity - 0.5, 0.0, 1.0);
  float sunDisc = smoothstep(cos(sunAng), cos(sunAng * 0.8), sd);
  float glare = pow(max(sd, 0.0), 32.0) * 0.45 + pow(max(sd, 0.0), 8.0) * 0.12;
  sky += vec3(1.0, 0.93, 0.80) * ((sunDisc * 0.9 + glare) * uSunIntensity);

  // (c) MOON — acos-free disc via dot vs cos(angSize); 3 crater dots in
  // disc-local tangent coords; exp halo * uMoonGlow; uMoonFade scales both
  // (finale handoff crossfade). Disc is an opaque mix => occludes stars.
  float md = dot(dir, uMoonDir);
  float disc = smoothstep(cos(uMoonAngSize), cos(uMoonAngSize * 0.82), md) * uMoonFade;
  vec2 lc = vec2(dot(dir, uMoonTan), dot(dir, uMoonBit)) / uMoonAngSize;
  float cr = (1.0 - smoothstep(0.16, 0.30, length(lc - vec2(0.33, 0.18))))
           + (1.0 - smoothstep(0.10, 0.22, length(lc - vec2(-0.28, -0.30))))
           + (1.0 - smoothstep(0.07, 0.17, length(lc - vec2(-0.02, 0.42))));
  vec3 moonCol = vec3(0.94, 0.93, 0.85) * (1.0 - 0.16 * clamp(cr, 0.0, 1.0));
  sky = mix(sky, moonCol, disc);
  float halo = exp(-(1.0 - md) / max(uMoonAngSize * uMoonAngSize * 3.0, 1e-6));
  sky += vec3(0.62, 0.68, 0.85) * (halo * 0.35 * uMoonGlow * uMoonFade);

  // (f) v3 SKYTREE SILHOUETTE — hazy tapered tower at the true azimuth +
  // angular size (uniforms recomputed per frame on the CPU from the camera ->
  // SKYTREE_POS geometry, so the goalTower mesh handoff is angle-matched by
  // construction). Tangent-space math: tanE = dir.y / |dir.xz| vs uGoalSilTanH;
  // azimuthal offset sinAz vs the tapered width profile; two Gaussian bumps
  // for the observation decks. Drawn after sun/moon (the tower silhouettes
  // against them), before the horizon melt (its base melts into the haze).
  float hl = max(length(dir.xz), 1e-4);
  vec2 hdir = dir.xz / hl;
  float caz = dot(hdir, uGoalSilDir.xz);
  float sinAz = abs(hdir.x * uGoalSilDir.z - hdir.y * uGoalSilDir.x);
  float tanE = h / hl;
  float st01 = clamp(tanE / max(uGoalSilTanH, 1e-5), 0.0, 1.0);
  float silW = uGoalSilTanW * (mix(1.0, 0.10, pow(st01, 0.55))
             + 0.50 * exp(-pow((st01 - 0.552) * 16.0, 2.0))
             + 0.32 * exp(-pow((st01 - 0.710) * 20.0, 2.0)));
  float silM = (1.0 - smoothstep(silW * 0.72, silW, sinAz))
             * step(0.5, caz)
             * (1.0 - smoothstep(uGoalSilTanH * 0.94, uGoalSilTanH, tanE))
             * smoothstep(-0.01, 0.01, tanE)
             * uGoalSilFade;
  vec3 silCol = mix(vec3(0.42, 0.47, 0.56), uFogColor, ${SIL_FOG_MIX_GLSL});
  sky = mix(sky, silCol, silM);

  // Horizon fog melt LAST so distant objects vanish seamlessly.
  float horizon = 1.0 - smoothstep(0.02, 0.20, h);
  gl_FragColor = vec4(mix(sky, uFogColor, horizon), 1.0);
}
`;

/**
 * Environment — fog, palette, sky dome (v2 shader), ground grid, lights, and
 * the blob shadow.
 *
 * Integration (main.js):
 *   const env = new Environment(renderer.scene, renderer.camera);
 *   ...per frame (step 6, after ScaleManager): env.update(frameDt, ballPhys.state);
 *   ScaleManager hooks: env.rescale(S); env.rebase(offsetX, offsetZ);
 *   ?at=/?r= dev start: env.setTierPaletteImmediate(startTierIndex);
 *   Finale (Stream A, v3): env.setGoalSilFade(skytree.silFade01) every frame
 *     (silhouette <-> goalTower mesh handoff);
 *     env.beginNightFade(GOAL_ASCEND_S) on ASCENSION;
 *     v5: env.setSpaceFade01(u) per ASCENSION frame (zenith -> space black);
 *   OsmGround (v5): osmGround.setEnvironment(env) late-wire reads
 *     getGroundColorWorking(target) per frame (謎の溝 ground fade).
 * Subscribes to 'tierUp' (palette crossfade), 'game:reset' (snap to T0,
 * resets all uniforms + ws/shift trackers) and 'grow' (10 Hz worldScale
 * resync) on the singleton bus.
 */
export class Environment {
  /**
   * @param {THREE.Scene} scene Owned by render/renderer.js.
   * @param {THREE.PerspectiveCamera} [camera] Optional — the sky dome follows
   *   the camera (exact pixel-identity at rescale); falls back to ball-follow.
   */
  constructor(scene, camera) {
    /** @type {THREE.Scene} */
    this._scene = scene;
    /** @type {THREE.PerspectiveCamera|null} */
    this._camera = camera !== undefined ? camera : null;

    /* --- per-tier derived palettes + env-local NIGHT at index 6 (boot alloc) --- */
    /** @type {Array<{fog:THREE.Color, skyTop:THREE.Color, skyBottom:THREE.Color, ground:THREE.Color, line:THREE.Color, hemiSky:THREE.Color, hemiGround:THREE.Color, sunDir:THREE.Vector3, sunIntensity:number, moonDir:THREE.Vector3, moonAngSize:number, starIntensity:number, cloudDensity:number, cloudColor:THREE.Color}>} */
    this._palettes = [];
    for (let i = 0; i < TIERS.length; i++) {
      this._palettes.push(this._buildPalette(TIERS[i]));
    }
    this._palettes.push(this._buildPalette(NIGHT)); // index 6 — env-local

    /* --- LIVE colors (mutated in place; referenced by fog/uniforms/lights) --- */
    /** @type {THREE.Color} */ this._cFog = new THREE.Color();
    /** @type {THREE.Color} */ this._cSkyTop = new THREE.Color();
    /** @type {THREE.Color} */ this._cSkyBottom = new THREE.Color();
    /** @type {THREE.Color} */ this._cGround = new THREE.Color();
    /** @type {THREE.Color} */ this._cLine = new THREE.Color();
    /** @type {THREE.Color} */ this._cHemiSky = new THREE.Color();
    /** @type {THREE.Color} */ this._cHemiGround = new THREE.Color();
    /* --- LIVE v2 sky params (blended by the same crossfade) --- */
    /** @type {THREE.Color} */ this._cCloud = new THREE.Color();
    /** @type {THREE.Vector3} */ this._vSunDir = new THREE.Vector3(0, 1, 0);
    /** @type {THREE.Vector3} */ this._vMoonDir = new THREE.Vector3(0, 1, 0);
    /* CPU-hoisted moon tangent frame (shader uniforms uMoonTan/uMoonBit) —
       recomputed in _updateMoonFrame whenever moonDir can have changed. */
    /** @type {THREE.Vector3} */ this._vMoonTan = new THREE.Vector3(1, 0, 0);
    /** @type {THREE.Vector3} */ this._vMoonBit = new THREE.Vector3(0, 0, 1);
    /** @type {number} */ this._sunIntensity = 0;
    /** @type {number} */ this._moonAngSize = 0.02;
    /** @type {number} */ this._starIntensity = 0;
    /** @type {number} */ this._cloudDensity = 0;

    /* --- crossfade FROM snapshot --- */
    /** @type {THREE.Color} */ this._fFog = new THREE.Color();
    /** @type {THREE.Color} */ this._fSkyTop = new THREE.Color();
    /** @type {THREE.Color} */ this._fSkyBottom = new THREE.Color();
    /** @type {THREE.Color} */ this._fGround = new THREE.Color();
    /** @type {THREE.Color} */ this._fLine = new THREE.Color();
    /** @type {THREE.Color} */ this._fHemiSky = new THREE.Color();
    /** @type {THREE.Color} */ this._fHemiGround = new THREE.Color();
    /** @type {THREE.Color} */ this._fCloud = new THREE.Color();
    /** @type {THREE.Vector3} */ this._fSunDir = new THREE.Vector3(0, 1, 0);
    /** @type {THREE.Vector3} */ this._fMoonDir = new THREE.Vector3(0, 1, 0);
    /** @type {number} */ this._fSunIntensity = 0;
    /** @type {number} */ this._fMoonAngSize = 0.02;
    /** @type {number} */ this._fStarIntensity = 0;
    /** @type {number} */ this._fCloudDensity = 0;
    /** @type {number} */ this._fadeT = 0;
    /** @type {number} */ this._fadeDur = 0; // 0 = not fading
    /** @type {number} */ this._toIndex = 0;

    /* --- v2 moon control state (v3: night cosmetic; uMoonFade stays 1) --- */
    /** Sky-moon disc+halo fade 0..1 (1 = fully shader moon). @type {number} */
    this._moonFade = 1;
    /** Pulse flag (0.5Hz uMoonGlow breathing — inert in v3 play). @type {boolean} */
    this._pulseOn = false;
    /** Pulse phase accumulator (s) — starts at glow 1.0 so it never snaps. @type {number} */
    this._pulsePhase = 0;
    /** Plain accumulating shader clock (s) — direction-space, rescale-invariant. @type {number} */
    this._time = 0;

    /* --- v3 worldScale + rebase-shift trackers (real-meter cosmetics) --- */
    /** Local worldScale estimate: boot 0.04; exact resync from every 10 Hz
     *  'grow' payload (trueRadius/simRadius); /= S on each rescale() hook.
     *  Used ONLY by the fog floor, the bay group and the silhouette size —
     *  all cosmetic, all self-correcting within 0.1 s. @type {number} */
    this._ws = BOOT_WORLD_SCALE;
    /** Accumulated floating-origin shift (sim units; sim = real/ws - shift). */
    this._shiftX = 0;
    this._shiftZ = 0;
    /** v3 Skytree silhouette fade (finale-driven via setGoalSilFade). */
    this._goalSilFade = 1;
    /** v5 space fade (finale-driven via setSpaceFade01; 0 in play). */
    this._spaceFade = 0;
    /** Hoisted silhouette direction (uniform holds the live ref). */
    this._vGoalSilDir = new THREE.Vector3(0, 0, 1);

    /* --- fog --- */
    /** @type {THREE.Fog} */
    this.fog = new THREE.Fog(0xffffff, 10, 100);
    this.fog.color = this._cFog; // live ref — palette fade propagates automatically
    scene.fog = this.fog;

    /* --- lights (no shadow maps — the blob shadow reads better at every scale) --- */
    /** @type {THREE.HemisphereLight} */
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.15);
    this.hemiLight.color = this._cHemiSky;
    this.hemiLight.groundColor = this._cHemiGround;
    scene.add(this.hemiLight);

    /** @type {THREE.DirectionalLight} */
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.dirLight.position.set(LIGHT_DIR.x * 50, LIGHT_DIR.y * 50, LIGHT_DIR.z * 50);
    scene.add(this.dirLight);
    scene.add(this.dirLight.target);

    /* --- ground plane (1 draw call; grid is procedural in world XZ) --- */
    const groundGeo = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
    groundGeo.rotateX(-Math.PI / 2);
    /** @type {{[k:string]: {value: *}}} */
    this._groundUniforms = {
      uGroundColor: { value: this._cGround },
      uLineColor: { value: this._cLine },
      uFogColor: { value: this._cFog },
      uFogNear: { value: 10 },
      uFogFar: { value: 100 },
      uCell: { value: GRID_CELL_K },
      uGridOrigin: { value: new THREE.Vector2(0, 0) },
    };
    const groundMat = new THREE.ShaderMaterial({
      uniforms: this._groundUniforms,
      vertexShader: GROUND_VERT,
      fragmentShader: GROUND_FRAG,
      fog: false, // custom fog uniforms above
    });
    /** @type {THREE.Mesh} */
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.frustumCulled = false;
    scene.add(this.ground);

    /* --- sky dome (v2 shader; follows camera; all features direction-only) --- */
    const skyGeo = new THREE.SphereGeometry(1, 32, 16);
    /** @type {{[k:string]: {value: *}}} */
    this._skyUniforms = {
      uTop: { value: this._cSkyTop },
      uBottom: { value: this._cSkyBottom },
      uFogColor: { value: this._cFog },
      uSunDir: { value: this._vSunDir },
      uSunIntensity: { value: 0 },
      uMoonDir: { value: this._vMoonDir },
      uMoonTan: { value: this._vMoonTan },
      uMoonBit: { value: this._vMoonBit },
      uMoonAngSize: { value: 0.02 },
      uMoonGlow: { value: 1 },
      uMoonFade: { value: 1 },
      uStarIntensity: { value: 0 },
      uCloudDensity: { value: 0 },
      uCloudColor: { value: this._cCloud },
      uCloudDrift: { value: CLOUD_DRIFT },
      uTime: { value: 0 },
      // v3 Skytree silhouette (live ref + per-frame scalars).
      uGoalSilDir: { value: this._vGoalSilDir },
      uGoalSilTanH: { value: 0 },
      uGoalSilTanW: { value: 0 },
      uGoalSilFade: { value: 1 },
      // v5 space-earth finale (setSpaceFade01; 0 in play).
      uSpaceFade: { value: 0 },
    };
    const skyMat = new THREE.ShaderMaterial({
      uniforms: this._skyUniforms,
      vertexShader: SKY_VERT,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    /** @type {THREE.Mesh} */
    this.sky = new THREE.Mesh(skyGeo, skyMat);
    this.sky.scale.setScalar(SKY_RADIUS);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -10; // paint first; depthWrite off
    scene.add(this.sky);

    /* --- blob shadow decal (canvas radial gradient, MeshBasic transparent) --- */
    const shadowTex = this._makeShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(2, 2, 1, 1);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      fog: false,
    });
    /** @type {THREE.Mesh} */
    this.blobShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.blobShadow.frustumCulled = false;
    this.blobShadow.renderOrder = 1; // over the ground
    scene.add(this.blobShadow);

    /* --- v3 Tokyo Bay: water quad pair (1 draw) + quay-wall strip (1 draw).
     * Authored in REAL METERS inside this._bay; the group's scale (1/ws) and
     * position (-shift) are refreshed every update() — radius-continuous,
     * pixel-exact across rescale/rebase, and self-correcting after a dev
     * teleport (live ws). Both materials are fog:true (Lambert default):
     * beyond the fog wall the bay simply melts away like world scenery. --- */
    /** @type {THREE.Group} */
    this._bay = new THREE.Group();
    {
      const water = new THREE.BufferGeometry();
      // Two horizontal rects (4 tris) at WATER_Y_M.
      const w = new Float32Array([
        // south band
        BAY_SOUTH.x0, WATER_Y_M, BAY_SOUTH.z0, BAY_SOUTH.x0, WATER_Y_M, BAY_SOUTH.z1,
        BAY_SOUTH.x1, WATER_Y_M, BAY_SOUTH.z1, BAY_SOUTH.x0, WATER_Y_M, BAY_SOUTH.z0,
        BAY_SOUTH.x1, WATER_Y_M, BAY_SOUTH.z1, BAY_SOUTH.x1, WATER_Y_M, BAY_SOUTH.z0,
        // east band
        BAY_EAST.x0, WATER_Y_M, BAY_EAST.z0, BAY_EAST.x0, WATER_Y_M, BAY_EAST.z1,
        BAY_EAST.x1, WATER_Y_M, BAY_EAST.z1, BAY_EAST.x0, WATER_Y_M, BAY_EAST.z0,
        BAY_EAST.x1, WATER_Y_M, BAY_EAST.z1, BAY_EAST.x1, WATER_Y_M, BAY_EAST.z0,
      ]);
      water.setAttribute('position', new THREE.BufferAttribute(w, 3));
      water.computeVertexNormals();
      /** @type {THREE.Mesh} */
      this._bayWater = new THREE.Mesh(
        water,
        new THREE.MeshLambertMaterial({ color: WATER_COLOR })
      );
      this._bayWater.frustumCulled = false;
      this._bay.add(this._bayWater);

      // Quay wall: L-strip along the two shorelines (2 boxes merged by hand
      // into one geometry via two BoxGeometries in a single mesh group would
      // cost a draw each — use one geometry with both boxes baked).
      const south = new THREE.BoxGeometry(BAY_SOUTH.x1 - BAY_SOUTH.x0, QUAY_H_M, QUAY_W_M);
      south.translate(
        (BAY_SOUTH.x0 + BAY_SOUTH.x1) / 2,
        QUAY_H_M / 2,
        BAY_SOUTH.z0 - QUAY_W_M / 2
      );
      const east = new THREE.BoxGeometry(QUAY_W_M, QUAY_H_M, BAY_EAST.z1 - BAY_EAST.z0);
      east.translate(
        BAY_EAST.x0 - QUAY_W_M / 2,
        QUAY_H_M / 2,
        (BAY_EAST.z0 + BAY_EAST.z1) / 2
      );
      const quay = mergeGeometries([south, east], false);
      south.dispose();
      east.dispose();
      /** @type {THREE.Mesh} */
      this._bayQuay = new THREE.Mesh(quay, new THREE.MeshLambertMaterial({ color: QUAY_COLOR }));
      this._bayQuay.frustumCulled = false;
      this._bay.add(this._bayQuay);
    }
    this._bay.scale.setScalar(1 / this._ws);
    scene.add(this._bay);

    this.setTierPaletteImmediate(0);

    /* --- bus subscriptions (cosmetic only) --- */
    /** @type {(p: TierUpEvent) => void} */
    this._onTierUp = (p) => this.startPaletteFade(p.tierIndex);
    bus.on(EVT.TIER_UP, this._onTierUp);
    /** @type {() => void} */
    this._onGameReset = () => {
      // World origin + scale are rebuilt from scratch (scaleMgr.reset).
      this._ws = BOOT_WORLD_SCALE;
      this._shiftX = 0;
      this._shiftZ = 0;
      this.setTierPaletteImmediate(0);
    };
    bus.on(EVT.GAME_RESET, this._onGameReset);
    /** v3: exact worldScale resync at 10 Hz (covers dev-teleport snaps too).
     * @type {(p: import('../types.js').GrowEvent) => void} */
    this._onGrow = (p) => {
      if (p.simRadius > 0) this._ws = p.trueRadius / p.simRadius;
    };
    bus.on(EVT.GROW, this._onGrow);

    if (import.meta.env && import.meta.env.DEV) {
      if (this._palettes.length !== NIGHT_INDEX + 1) {
        throw new Error('[environment] _palettes must be TIERS.length tiers + NIGHT appended');
      }
    }
  }

  /**
   * Per-frame update — call in main.js step 6 (with cameraRig/effects), i.e.
   * AFTER ScaleManager so the rescale frame is recomputed from scaled state.
   * Continuous in radius: fog 14r/55r, grid cell 2r, shadow 1.15r.
   * Zero allocation.
   * @param {number} dt Frame delta (s).
   * @param {BallState} ball The single source of ball truth.
   */
  update(dt, ball) {
    const rv = ball.radiusVisualSim;
    const gu = this._groundUniforms;

    // Fog — continuous in radius (SEAMLESSNESS LAW). v3: floored at
    // FOG_FAR_MIN_M real meters (applied AT QUERY TIME — the 8 m shop is
    // never fog-swallowed at r = 2 cm; pairs with LOAD_RADIUS_MIN_M so
    // fog < load holds everywhere, asserted in tiers.js).
    this.fog.near = FOG_NEAR_K * rv;
    this.fog.far = Math.max(FOG_FAR_K * rv, FOG_FAR_MIN_M / this._ws);
    gu.uFogNear.value = this.fog.near;
    gu.uFogFar.value = this.fog.far;
    gu.uCell.value = GRID_CELL_K * rv;

    // v3 bay group: real-meter geometry mapped into the current sim frame
    // (sim = real / ws - shift). Cheap scalar writes every frame; exact on
    // the rescale/rebase frame because rescale()/rebase() update _ws/_shift
    // synchronously before the render.
    const invWs = 1 / this._ws;
    this._bay.scale.setScalar(invWs);
    this._bay.position.set(-this._shiftX, 0, -this._shiftZ);

    // Blob shadow under the ball.
    const ss = SHADOW_SCALE_K * rv;
    this.blobShadow.position.set(ball.pos.x, SHADOW_Y_K * rv, ball.pos.z);
    this.blobShadow.scale.set(ss, 1, ss);

    // Sky dome follows the camera (direction-only gradient => rescale identity).
    if (this._camera !== null) {
      this.sky.position.copy(this._camera.position);
    } else {
      this.sky.position.set(ball.pos.x, 0, ball.pos.z);
    }

    // Directional light tracks the ball at a constant direction.
    const ld = LIGHT_DIST_K * rv;
    this.dirLight.position.set(
      ball.pos.x + LIGHT_DIR.x * ld,
      ball.pos.y + LIGHT_DIR.y * ld,
      ball.pos.z + LIGHT_DIR.z * ld
    );
    this.dirLight.target.position.set(ball.pos.x, ball.pos.y, ball.pos.z);

    // Palette crossfade (cosmetic; PALETTE_FADE_S on tierUp, custom duration
    // for beginNightFade — same machinery, v2 sky params ride along).
    if (this._fadeDur > 0) {
      this._fadeT += dt;
      const k = easeInOutCubic(clamp01(this._fadeT / this._fadeDur));
      const p = this._palettes[this._toIndex];
      this._cFog.lerpColors(this._fFog, p.fog, k);
      this._cSkyTop.lerpColors(this._fSkyTop, p.skyTop, k);
      this._cSkyBottom.lerpColors(this._fSkyBottom, p.skyBottom, k);
      this._cGround.lerpColors(this._fGround, p.ground, k);
      this._cLine.lerpColors(this._fLine, p.line, k);
      this._cHemiSky.lerpColors(this._fHemiSky, p.hemiSky, k);
      this._cHemiGround.lerpColors(this._fHemiGround, p.hemiGround, k);
      this._cCloud.lerpColors(this._fCloud, p.cloudColor, k);
      // Direction lerps re-normalize every frame; adjacent tier dirs share a
      // sky quadrant (tiers.js assert), so the blend can never degenerate.
      this._vSunDir.lerpVectors(this._fSunDir, p.sunDir, k).normalize();
      this._vMoonDir.lerpVectors(this._fMoonDir, p.moonDir, k).normalize();
      this._updateMoonFrame(); // keep the hoisted tangent frame in sync
      this._sunIntensity = lerp(this._fSunIntensity, p.sunIntensity, k);
      this._moonAngSize = lerp(this._fMoonAngSize, p.moonAngSize, k);
      this._starIntensity = lerp(this._fStarIntensity, p.starIntensity, k);
      this._cloudDensity = lerp(this._fCloudDensity, p.cloudDensity, k);
      if (this._fadeT >= this._fadeDur) this._fadeDur = 0;
    }

    // v2 sky clock + CALLED pulse (0.5Hz: glow 1 .. 1+GLOW_PULSE_AMP).
    this._time += dt;
    let glow = 1;
    if (this._pulseOn) {
      this._pulsePhase += dt;
      glow = 1 + GLOW_PULSE_AMP * 0.5 * (1 - Math.cos(Math.PI * this._pulsePhase));
    }

    // Scalar sky uniforms (vec3/Color uniforms hold live refs — no write needed).
    const su = this._skyUniforms;
    su.uTime.value = this._time;
    su.uMoonGlow.value = glow;
    su.uMoonFade.value = this._moonFade;
    su.uSunIntensity.value = this._sunIntensity;
    su.uMoonAngSize.value = this._moonAngSize;
    su.uStarIntensity.value = this._starIntensity;
    su.uCloudDensity.value = this._cloudDensity;
    su.uSpaceFade.value = this._spaceFade; // v5 (0 outside the finale)

    // v3 Skytree silhouette: azimuth + angular size recomputed per frame
    // from the camera -> SKYTREE_POS real-meter geometry (BLOCKER 2). The
    // dome is camera-centred, so view direction == world direction.
    su.uGoalSilFade.value = this._goalSilFade;
    if (this._goalSilFade > 0) {
      const tx = SK_X * invWs - this._shiftX;
      const tz = SK_Z * invWs - this._shiftZ;
      let cx = 0;
      let cz = 0;
      if (this._camera !== null) {
        cx = this._camera.position.x;
        cz = this._camera.position.z;
      } else {
        cx = ball.pos.x;
        cz = ball.pos.z;
      }
      const dx = tx - cx;
      const dz = tz - cz;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist > 1e-3) {
        this._vGoalSilDir.set(dx / dist, 0, dz / dist);
        su.uGoalSilTanH.value = (SKYTREE_HEIGHT_M * invWs) / dist;
        su.uGoalSilTanW.value = (SKYTREE_BASE_R_M * invWs) / dist;
      } else {
        su.uGoalSilTanH.value = 0; // degenerate: standing on the axis
      }
    }
  }

  /**
   * v4 (Stream R) — the floored fog-far distance in SIM units, exactly as
   * applied to scene fog this frame: max(FOG_FAR_K * rv, FOG_FAR_MIN_M / ws).
   * Consumed by main.js step 6 as osmGround.update(dt, ballPos, env.fogFarSim)
   * (the call site feature-detects this getter and falls back to
   * FOG_FAR_K * radiusSim until it lands). Valid after the first update();
   * the constructor's setTierPaletteImmediate leaves fog at its boot value,
   * but update() runs before the first render so consumers never see it.
   * @returns {number} Fog far, sim units.
   */
  get fogFarSim() {
    return this.fog.far;
  }

  /**
   * v4 (Stream R) — THE shared water material: the OSM river/pond/moat mesh
   * (render/osmGround.js) renders on the SAME MeshLambertMaterial as the
   * authored Tokyo Bay quads (one program; fog-on; the bay stays owned by
   * environment.js — OSM water is ADDITIVE, docs/DESIGN-V4.md レンダリング統合).
   * Lifetime: owned and disposed HERE; borrowers must not dispose it.
   * @returns {THREE.Material}
   */
  getWaterMaterial() {
    return /** @type {THREE.Material} */ (this._bayWater.material);
  }

  /**
   * ScaleManager hook — one-frame similarity rescale by S (RESCALE_S).
   * Grid phase origin is the only accumulated state and MUST scale; the
   * radius-derived values are also scaled defensively (update() recomputes
   * them from scaled ball state the same frame). The v2 sky is direction-only
   * (+ uTime in seconds) — nothing to do.
   * @param {number} S Similarity factor (0.2).
   */
  rescale(S) {
    this._groundUniforms.uGridOrigin.value.multiplyScalar(S);
    this.fog.near *= S;
    this.fog.far *= S;
    this._groundUniforms.uFogNear.value *= S;
    this._groundUniforms.uFogFar.value *= S;
    this._groundUniforms.uCell.value *= S;
    this.blobShadow.position.multiplyScalar(S);
    this.blobShadow.scale.x *= S;
    this.blobShadow.scale.z *= S;
    this.dirLight.position.multiplyScalar(S);
    this.dirLight.target.position.multiplyScalar(S);
    // v3: worldScale tracker (ws /= S, matching ScaleManager) + shift and the
    // real-meter bay group (update() re-derives both the same frame — these
    // direct writes keep the hook self-contained for tests).
    this._ws /= S;
    this._shiftX *= S;
    this._shiftZ *= S;
    this._bay.scale.multiplyScalar(S);
    this._bay.position.multiplyScalar(S);
  }

  /**
   * ScaleManager hook — floating-origin rebase. (offsetX, offsetZ) is the
   * integer-snapped shift SUBTRACTED from every world position; the grid
   * origin absorbs it so the ground pattern under the ball never jumps.
   * The v2 sky is direction-only — nothing to do.
   * @param {number} offsetX Sim units subtracted from all world x.
   * @param {number} offsetZ Sim units subtracted from all world z.
   */
  rebase(offsetX, offsetZ) {
    this._groundUniforms.uGridOrigin.value.x += offsetX;
    this._groundUniforms.uGridOrigin.value.y += offsetZ;
    this.blobShadow.position.x -= offsetX;
    this.blobShadow.position.z -= offsetZ;
    this.dirLight.position.x -= offsetX;
    this.dirLight.position.z -= offsetZ;
    this.dirLight.target.position.x -= offsetX;
    this.dirLight.target.position.z -= offsetZ;
    // v3: shift tracker + the real-meter bay group ride the rebase.
    this._shiftX += offsetX;
    this._shiftZ += offsetZ;
    this._bay.position.x -= offsetX;
    this._bay.position.z -= offsetZ;
  }

  /**
   * Begin the PALETTE_FADE_S crossfade toward a tier's palette ('tierUp').
   * @param {number} tierIndex 0..TIERS.length-1.
   */
  startPaletteFade(tierIndex) {
    this._beginFade(tierIndex, PALETTE_FADE_S);
  }

  /**
   * v2 finale ASCENSION — crossfade to the env-local NIGHT palette (index 6:
   * sky 0x101030/0x06061a, fog 0x1a1838, starIntensity -> 1.0) over a custom
   * duration, riding the SAME machinery as the tier fade. Cancelled
   * structurally by setTierPaletteImmediate (game reset / dev start).
   * @param {number} seconds Fade duration (finale passes GOAL_ASCEND_S).
   */
  beginNightFade(seconds) {
    this._beginFade(NIGHT_INDEX, Math.max(seconds, 1e-3));
  }

  /**
   * v3 Skytree silhouette weight (uGoalSilFade 0..1). The finale forwards
   * SkytreeView.silFade01 every frame: 1 while the sky silhouette owns the
   * tower, fading to 0 over 2 s as the goalTower mesh takes over (the kept
   * v2 angular-matched handoff). Default 1; reset by setTierPaletteImmediate.
   * @param {number} k01 0..1.
   */
  setGoalSilFade(k01) {
    this._goalSilFade = clamp01(k01);
  }

  /**
   * v5 (Stream C) — the LIVE terrain ground color (working space, palette-
   * crossfade aware: mid-fade it is the blended value). Copied into `target`
   * — zero allocation, caller owns the destination. Consumed per frame by
   * render/osmGround.js for the radius-driven ground-layer fade (謎の溝 fix).
   * @param {THREE.Color} target Receives the color.
   * @returns {THREE.Color} The same `target`.
   */
  getGroundColorWorking(target) {
    return target.copy(this._cGround);
  }

  /**
   * v5 space-earth finale — darken the sky-dome zenith toward space black
   * (uSpaceFade, elevation-weighted in the shader so the horizon keeps the
   * night-fog color as an atmospheric limb over the EarthView globe).
   * Driven per frame by the finale during ASCENSION (u 0..1) and held at 1
   * through AFTERGLOW; finale-only — nothing else writes it, and
   * setTierPaletteImmediate (game reset / dev start) clears it back to 0.
   * Radius-independent (pure uniform), so the seamlessness law is untouched.
   * @param {number} k01 0..1.
   */
  setSpaceFade01(k01) {
    this._spaceFade = clamp01(k01);
  }

  /**
   * Sky-moon disc + halo scale (uMoonFade 0..1). v3: the moon is a NIGHT
   * COSMETIC — nothing drives this in play (it stays 1); kept for tests.
   * @param {number} k01 0..1.
   */
  setSkyMoonFade(k01) {
    this._moonFade = clamp01(k01);
  }

  /**
   * Toggle the 0.5Hz uMoonGlow breathing pulse (cosine ramp — never snaps).
   * v3: inert in play (the goal beacon lives on render/goalTower.js); kept.
   * @param {boolean} on
   */
  setSkyMoonPulse(on) {
    this._pulseOn = on;
    if (!on) this._pulsePhase = 0;
  }

  /**
   * v2 — copy the CURRENT blended (crossfade-live) moon direction into `out`
   * (unit length, world space — directions are world==sim invariant).
   * Elevation is clamped to >= MOON_DIR_MIN_ELEV rad as belt-and-suspenders
   * (tiers.js asserts every endpoint; a lerp of two valid dirs could in
   * principle dip). Zero allocation.
   * @param {THREE.Vector3} out Receives the direction.
   * @returns {THREE.Vector3} The same `out`.
   */
  getMoonDirWorld(out) {
    out.copy(this._vMoonDir).normalize();
    const sinMin = Math.sin(MOON_DIR_MIN_ELEV);
    if (out.y < sinMin) {
      const hLen = Math.hypot(out.x, out.z);
      const cosMin = Math.cos(MOON_DIR_MIN_ELEV);
      if (hLen > 1e-9) {
        out.x = (out.x / hLen) * cosMin;
        out.z = (out.z / hLen) * cosMin;
      } else {
        out.x = cosMin;
        out.z = 0;
      }
      out.y = sinMin;
    }
    return out;
  }

  /**
   * v2 (optional helper, additive to the frozen interface) — the CURRENT
   * blended sky-moon angular RADIUS (rad). Matches the shader disc exactly,
   * including mid-crossfade — lets the finale's angular-size-matched handoff
   * stay pop-free even if DESCENT triggers during a palette fade.
   * @returns {number} Angular radius in radians.
   */
  getMoonAngSize() {
    return this._moonAngSize;
  }

  /**
   * Snap to a tier's palette with no fade (boot, game reset, ?at=/?r= dev
   * start). Also resets every finale-driven sky control — uMoonFade=1, pulse
   * off, star intensity to the palette value, uGoalSilFade=1 (the silhouette
   * owns the tower again) — which structurally cancels an in-flight night
   * fade (same _fadeDur machinery).
   * @param {number} tierIndex 0..TIERS.length-1.
   */
  setTierPaletteImmediate(tierIndex) {
    const p = this._palettes[tierIndex];
    this._cFog.copy(p.fog);
    this._cSkyTop.copy(p.skyTop);
    this._cSkyBottom.copy(p.skyBottom);
    this._cGround.copy(p.ground);
    this._cLine.copy(p.line);
    this._cHemiSky.copy(p.hemiSky);
    this._cHemiGround.copy(p.hemiGround);
    this._cCloud.copy(p.cloudColor);
    this._vSunDir.copy(p.sunDir);
    this._vMoonDir.copy(p.moonDir);
    this._updateMoonFrame();
    this._sunIntensity = p.sunIntensity;
    this._moonAngSize = p.moonAngSize;
    this._starIntensity = p.starIntensity;
    this._cloudDensity = p.cloudDensity;
    this._toIndex = tierIndex;
    this._fadeDur = 0; // cancels any in-flight fade (incl. night fade)
    // Finale-control reset (v2 moon controls + v3 silhouette + v5 space fade).
    this._moonFade = 1;
    this._pulseOn = false;
    this._pulsePhase = 0;
    this._goalSilFade = 1;
    this._spaceFade = 0;
    const su = this._skyUniforms;
    su.uMoonFade.value = 1;
    su.uMoonGlow.value = 1;
    su.uGoalSilFade.value = 1;
    su.uSpaceFade.value = 0;
    su.uSunIntensity.value = this._sunIntensity;
    su.uMoonAngSize.value = this._moonAngSize;
    su.uStarIntensity.value = this._starIntensity;
    su.uCloudDensity.value = this._cloudDensity;
  }

  /** Unsubscribe + release GPU resources (teardown / tests). */
  dispose() {
    bus.off(EVT.TIER_UP, this._onTierUp);
    bus.off(EVT.GAME_RESET, this._onGameReset);
    bus.off(EVT.GROW, this._onGrow);
    this._scene.remove(this.sky, this.ground, this.blobShadow, this.hemiLight, this.dirLight, this.dirLight.target, this._bay);
    this._bayWater.geometry.dispose();
    /** @type {THREE.MeshLambertMaterial} */ (this._bayWater.material).dispose();
    this._bayQuay.geometry.dispose();
    /** @type {THREE.MeshLambertMaterial} */ (this._bayQuay.material).dispose();
    this.ground.geometry.dispose();
    /** @type {THREE.ShaderMaterial} */ (this.ground.material).dispose();
    this.sky.geometry.dispose();
    /** @type {THREE.ShaderMaterial} */ (this.sky.material).dispose();
    this.blobShadow.geometry.dispose();
    const sm = /** @type {THREE.MeshBasicMaterial} */ (this.blobShadow.material);
    if (sm.map !== null) sm.map.dispose();
    sm.dispose();
  }

  /* ------------------------------------------------------------------ */
  /* Internals                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * Recompute the CPU-hoisted moon tangent frame (shader: mTan =
   * normalize(cross(moonDir, up)), mBit = cross(moonDir, mTan)) — formerly
   * rebuilt per FRAGMENT from uniform-constant expressions. moonDir elevation
   * is asserted >= MOON_DIR_MIN_ELEV, so the cross with +Y never degenerates.
   * Zero allocation.
   */
  _updateMoonFrame() {
    this._vMoonTan.crossVectors(this._vMoonDir, UP_VEC).normalize();
    this._vMoonBit.crossVectors(this._vMoonDir, this._vMoonTan);
  }

  /**
   * Derive one palette entry (boot only — allocates). `src` is a tiers.js
   * entry or the env-local NIGHT object (same sky-field shape).
   * @param {{fogColor:number, skyTop:number, skyBottom:number, sunDir:number[], sunIntensity:number, moonDir:number[], moonAngSize:number, starIntensity:number, cloudDensity:number, cloudHex:number}} src
   * @returns {{fog:THREE.Color, skyTop:THREE.Color, skyBottom:THREE.Color, ground:THREE.Color, line:THREE.Color, hemiSky:THREE.Color, hemiGround:THREE.Color, sunDir:THREE.Vector3, sunIntensity:number, moonDir:THREE.Vector3, moonAngSize:number, starIntensity:number, cloudDensity:number, cloudColor:THREE.Color}}
   */
  _buildPalette(src) {
    const fog = new THREE.Color(src.fogColor);
    const skyTop = new THREE.Color(src.skyTop);
    const skyBottom = new THREE.Color(src.skyBottom);
    const ground = new THREE.Color(src.skyBottom).lerp(fog, 0.45).multiplyScalar(0.8);
    const line = ground.clone().multiplyScalar(0.72);
    const hemiSky = skyTop.clone();
    const hemiGround = ground.clone().multiplyScalar(0.9);
    return {
      fog,
      skyTop,
      skyBottom,
      ground,
      line,
      hemiSky,
      hemiGround,
      sunDir: new THREE.Vector3(src.sunDir[0], src.sunDir[1], src.sunDir[2]).normalize(),
      sunIntensity: src.sunIntensity,
      moonDir: new THREE.Vector3(src.moonDir[0], src.moonDir[1], src.moonDir[2]).normalize(),
      moonAngSize: src.moonAngSize,
      starIntensity: src.starIntensity,
      cloudDensity: src.cloudDensity,
      cloudColor: new THREE.Color(src.cloudHex),
    };
  }

  /**
   * Snapshot the live palette as the crossfade FROM state and start a fade.
   * @param {number} toIndex Palette index 0..6 (6 = env-local NIGHT).
   * @param {number} duration Fade duration (s).
   */
  _beginFade(toIndex, duration) {
    this._fFog.copy(this._cFog);
    this._fSkyTop.copy(this._cSkyTop);
    this._fSkyBottom.copy(this._cSkyBottom);
    this._fGround.copy(this._cGround);
    this._fLine.copy(this._cLine);
    this._fHemiSky.copy(this._cHemiSky);
    this._fHemiGround.copy(this._cHemiGround);
    this._fCloud.copy(this._cCloud);
    this._fSunDir.copy(this._vSunDir);
    this._fMoonDir.copy(this._vMoonDir);
    this._fSunIntensity = this._sunIntensity;
    this._fMoonAngSize = this._moonAngSize;
    this._fStarIntensity = this._starIntensity;
    this._fCloudDensity = this._cloudDensity;
    this._toIndex = toIndex;
    this._fadeT = 0;
    this._fadeDur = duration;
  }

  /**
   * Canvas radial-gradient blob shadow texture (boot only). Returns null in
   * non-DOM environments (headless tests).
   * @returns {THREE.CanvasTexture|null}
   */
  _makeShadowTexture() {
    if (typeof document === 'undefined') return null;
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return null;
    const half = size / 2;
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0, 'rgba(0,0,0,0.42)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.30)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}
