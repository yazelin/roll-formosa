/**
 * @file objectMaterial.js — v4 shared object material + rim-light term
 * (docs/DESIGN-V4.md モデル品質パス technique 2 — Stream C).
 *
 * THE binding material law is unchanged: exactly ONE
 * MeshLambertMaterial({vertexColors:true}) renders all world objects
 * (chunk pools, EXTRA pools, OSM pools, ball-stuck proxies excepted — the
 * stuck pools and ball core own their separate materials). makeObjectMaterial()
 * therefore DECORATES the render/instances.js singleton
 * (getSharedObjectMaterial()) with one onBeforeCompile injection and returns
 * that same instance — it never creates a second material, so the draw-call
 * ledger, the program count and every existing InstancedPool/BatchedExtraPool
 * caller (all of which default to the singleton internally) stay untouched.
 *
 * RIM TERM (v4, owner-approvable + bisectable):
 *   outgoingLight += uRimK * pow(1.0 - max(dot(n, v), 0.0), 3.0) * uRimTint
 * injected immediately before <opaque_fragment> in the Lambert fragment
 * shader (per-fragment Lambert since r155; `normal` and vViewPosition are in
 * scope there). Properties, all binding:
 *   - VIEW/NORMAL-DIRECTION-DEPENDENT ONLY — no world-position term, so it is
 *     invariant under the one-frame uniform similarity rescale by
 *     construction (the KeyR force-rescale diff test remains the proof);
 *   - injected BEFORE <fog_fragment>, so fog attenuates the rim exactly like
 *     every other lit term (silhouette law unchanged);
 *   - ONE program (customProgramCacheKey 'fable-object-rim'), no transparency
 *     or sorting change, zero per-frame JS cost;
 *   - KILL SWITCH: setRimK(0) (or tuning RIM_K = 0) zeroes the uniform — the
 *     term compiles to an add of vec3(0), pixel-identical to v3.
 *
 * PALETTE-CROSSFADE HOOK: main.js (integrator) calls setRimTint(hex) whenever
 * the environment tier palette crossfades (sky-tinted rim per DESIGN-V4);
 * setRimK/setRimTint write shared uniform objects, valid before AND after
 * shader compilation, surviving program rebuilds.
 *
 * Boot-time only; nothing here runs per frame.
 */

import * as THREE from 'three';
import { RIM_K } from '../config/tuning.js';
import { getSharedObjectMaterial } from './instances.js';

/** Default rim tint — soft daylight sky (tier-1 skyTop 0xbcd6ee); the
 *  integrator re-tints on every palette crossfade via setRimTint(). */
const DEFAULT_RIM_TINT = 0xbcd6ee;

/** Shared uniform objects (referenced by the compiled program — mutate
 *  .value, never replace the holders). */
const _uRimK = { value: RIM_K };
const _uRimTint = { value: new THREE.Color(DEFAULT_RIM_TINT) };

/** One-shot guard: the injection must decorate the singleton exactly once. */
let _injected = false;

/**
 * The v4 shared object material: render/instances.js's singleton
 * MeshLambertMaterial({vertexColors:true}) decorated with the rim-term
 * onBeforeCompile injection (idempotent — safe to call from multiple wiring
 * sites; every call returns the SAME instance).
 * @returns {THREE.MeshLambertMaterial} The shared object material.
 */
export function makeObjectMaterial() {
  const mat = getSharedObjectMaterial();
  if (_injected) return mat;
  _injected = true;

  const prev = mat.onBeforeCompile; // defensive chain (none today)
  mat.onBeforeCompile = (shader, renderer) => {
    if (typeof prev === 'function') prev(shader, renderer);
    shader.uniforms.uRimK = _uRimK;
    shader.uniforms.uRimTint = _uRimTint;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uRimK;\nuniform vec3 uRimTint;'
      )
      .replace(
        '#include <opaque_fragment>',
        // n = lit fragment normal, v = view dir; pow3 falloff, sky-tinted.
        'outgoingLight += uRimK * pow(1.0 - max(dot(normal, normalize(vViewPosition)), 0.0), 3.0) * uRimTint;\n' +
          '\t#include <opaque_fragment>'
      );
  };
  mat.customProgramCacheKey = () => 'fable-object-rim';
  return mat;
}

/**
 * Set the rim strength (uRimK). KILL SWITCH: 0 restores v3-identical output.
 * Valid before and after compilation; zero allocation.
 * @param {number} k Rim strength (tuning RIM_K = 0.18 nominal, 0 = off).
 */
export function setRimK(k) {
  _uRimK.value = k;
}

/**
 * Set the rim tint (uRimTint) — the palette-crossfade hook. main.js calls
 * this with the active tier's sky tone whenever the environment palette
 * crossfades. Zero allocation (mutates the shared Color).
 * @param {number} hex Tint, e.g. 0xbcd6ee.
 */
export function setRimTint(hex) {
  _uRimTint.value.setHex(hex);
}
