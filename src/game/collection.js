/**
 * @file collection.js — v3 rare-collection album (Stream D, docs/DESIGN-V3.md
 * §フィードバック).
 *
 * Subscribes EVT.ABSORB (BINDING boot order: chunk spawner -> curated -> main
 * attach -> runStats -> THIS -> sfx/effects/hud — main.js constructs this
 * right after RunStats). When AbsorbEvent.collectibleId >= 0 it ORs the
 * frozen-id bit into the album mask, persists, and emits EVT.COLLECT
 * {collectibleId, nameJa, isNew, found, total} on the reused payload.
 * DUAL-TAG rule holds for free: curated emits EVT.LANDMARK AFTER the ABSORB
 * chain, so the COLLECT for ハチ公像 always precedes its LANDMARK.
 *
 * PERSISTENCE (LS_COLLECTION_KEY, schema {v:1, mask:int}) — FROZEN-ID RULE
 * (binding, docs/DESIGN-V3.md §フィードバック + Phase-0 appendix):
 *   - bit N of mask == collectible with FROZEN id N (COLLECTIBLE_IDS).
 *   - ids are APPEND-ONLY: v5 added id 12 スタックチャン (code 110 via
 *     objects.js collectibleCodeForId — the 70 + id rule is unextendable);
 *     later builds may add ids 13..30 and bump the displayed total, but ids
 *     are NEVER reused or reordered. Old 12-bit masks load unchanged (bit 12
 *     simply reads unfound).
 *   - UNKNOWN HIGH BITS (ids this build doesn't know) are PRESERVED across
 *     load/collect/save (forward compat with newer-build saves).
 *   - shape-validated like RunStats._loadBest: any anomaly -> mask 0.
 * The album mask survives GAME_RESET / resetWorld (resetRun clears only the
 * per-run NEW state).
 *
 * THUMBNAILS: prerenderThumbnails(renderer, geos) renders the COLLECT_TOTAL
 * (13) collectible archetypes ONCE into THUMB_SIZE_PX data-URL canvases via a throwaway scene
 * on the main renderer (boot-time allocation, exemptions ledger #5; the
 * render target + scratch canvas are disposed after). PRE-APPROVED LAZY
 * LEVER: if title-tap-to-play exceeds budget on low-end Android, move the
 * single main.js call site from boot to the first EVT.COLLECT — the method
 * is idempotent and safe to call at any time.
 *
 * Zero per-frame alloc: the ABSORB handler is bit math + reused PAYLOADS
 * (persist + popup paths run only on actual collects — 12 per run worst
 * case). Thumbnail rendering is a sanctioned one-shot boot allocation.
 */

import * as THREE from 'three';
import { EVT, PAYLOADS } from '../core/events.js';
import { LS_COLLECTION_KEY, COLLECT_TOTAL, THUMB_SIZE_PX } from '../config/tuning.js';
import { ARCHETYPE_ID_BY_CODE, collectibleCodeForId } from '../world/objects.js';
import { getSharedObjectMaterial } from '../render/instances.js';
// Namespace import: DISPLAY_NAME_BY_CODE (string[94], frozen) lands with
// Stream C's catalog.js — the namespace access keeps this module loadable
// either way (undefined -> empty table -> nameJa '').
import * as catalogModule from '../config/catalog.js';

/** @typedef {import('../core/events.js').EventBus} EventBus */
/** @typedef {import('../types.js').AbsorbEvent} AbsorbEvent */

/** Frozen display-name table (catalog.js, Stream C; boot-asserted length 94). */
const DISPLAY_NAME_BY_CODE = /** @type {string[]} */ (
  catalogModule.DISPLAY_NAME_BY_CODE !== undefined ? catalogModule.DISPLAY_NAME_BY_CODE : []
);

/** Mask of the ids this build displays (bits 0..COLLECT_TOTAL-1). */
const KNOWN_MASK = (1 << COLLECT_TOTAL) - 1;
/** Hard id ceiling (boot assert in cityMap.js: ids unique and < 31). */
const MAX_ID = 30;

/**
 * Population count over a uint32 (album mask cardinality).
 * @param {number} x
 * @returns {number}
 */
function popcount32(x) {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = (x + (x >>> 4)) & 0x0f0f0f0f;
  return (x * 0x01010101) >>> 24;
}

/**
 * Display name for a frozen collectible id (via the frozen code mapping —
 * v5: objects.js collectibleCodeForId, ids 0..11 -> codes 70..81, id 12+
 * -> V5_CODE_BASE 110+; NEVER hand-roll 70 + id).
 * @param {number} id Frozen collectible id.
 * @returns {string} displayNameJa or '' until Stream C's table lands.
 */
function nameForId(id) {
  const name = DISPLAY_NAME_BY_CODE[collectibleCodeForId(id)];
  return typeof name === 'string' ? name : '';
}

/* Boot DEV-assert (v5): every displayed collectible id must resolve through
   collectibleCodeForId to a real archetype with a display name — catches any
   future reintroduction of the broken 70 + id hand-roll (code 82 = 西郷さん像)
   and any id/total drift between tuning.js and the code tables. */
if (import.meta.env && import.meta.env.DEV) {
  for (let id = 0; id < COLLECT_TOTAL; id++) {
    const code = collectibleCodeForId(id);
    const archId = ARCHETYPE_ID_BY_CODE[code];
    const nameJa = DISPLAY_NAME_BY_CODE[code];
    if (typeof archId !== 'string' || archId.length === 0) {
      throw new Error(`[collection.js invariant] collectible id ${id} -> code ${code} has no archetype`);
    }
    if (DISPLAY_NAME_BY_CODE.length > 0 && (typeof nameJa !== 'string' || nameJa.length === 0)) {
      throw new Error(`[collection.js invariant] collectible id ${id} -> code ${code} has no display name`);
    }
    if (id <= 11 && code !== 70 + id) {
      throw new Error(`[collection.js invariant] frozen v3 rule broken: id ${id} must map to code ${70 + id}`);
    }
  }
}

/**
 * The rare-collection album: persistence, EVT.COLLECT emission, thumbnails.
 *
 * Frozen interface (DESIGN-V3.md §インターフェース):
 *   constructor(bus); get foundCount(); get foundThisRun();
 *   prerenderThumbnails(renderer, geos); thumbnailUrl(id); resetRun();
 *   static loadMask()
 * Stream-D extras consumed by screens.js (result grid): isFound(id),
 * isNewThisRun(id).
 */
export class Collection {
  /**
   * @param {EventBus} bus Shared event bus (subscribe AFTER RunStats —
   *   integrator constructs this in the frozen ABSORB order).
   */
  constructor(bus) {
    /** @type {EventBus} */
    this._bus = bus;
    /** @type {number} Album bitmask (uint32) — persisted, unknown high bits preserved. */
    this._mask = Collection.loadMask();
    /** @type {number} Bits collected THIS run (NEW badges); cleared by resetRun(). */
    this._runMask = 0;
    /** @type {string[]} Data-URL thumbnails by frozen id ('' until rendered). */
    this._urls = new Array(MAX_ID + 1).fill('');
    /** @type {boolean} prerenderThumbnails ran (idempotence latch). */
    this._thumbed = false;

    bus.on(EVT.ABSORB, this._onAbsorb.bind(this));
  }

  /* ---------------------------------------------------------------- */
  /* Read-only accessors                                               */
  /* ---------------------------------------------------------------- */

  /** Found across ALL runs, counted over the displayed ids. @returns {number} */
  get foundCount() {
    return popcount32(this._mask & KNOWN_MASK);
  }

  /** Found THIS run (NEW-badge candidates incl. re-collects of old finds is
   *  false — runMask only ever receives first-of-run bits, see _onAbsorb).
   *  @returns {number} */
  get foundThisRun() {
    return popcount32(this._runMask & KNOWN_MASK);
  }

  /**
   * Album membership for one frozen id (result grid cells).
   * @param {number} id Frozen collectible id 0..COLLECT_TOTAL-1.
   * @returns {boolean}
   */
  isFound(id) {
    return id >= 0 && id <= MAX_ID && (this._mask & (1 << id)) !== 0;
  }

  /**
   * First-ever collected during THIS run (result-grid NEW badge).
   * @param {number} id Frozen collectible id.
   * @returns {boolean}
   */
  isNewThisRun(id) {
    return id >= 0 && id <= MAX_ID && (this._runMask & (1 << id)) !== 0;
  }

  /**
   * Pre-rendered thumbnail data-URL ('' when unavailable — callers hide the
   * <img> then).
   * @param {number} id Frozen collectible id.
   * @returns {string}
   */
  thumbnailUrl(id) {
    return id >= 0 && id <= MAX_ID ? this._urls[id] : '';
  }

  /* ---------------------------------------------------------------- */
  /* 'absorb' handler (hot path — bit math + reused payload only)      */
  /* ---------------------------------------------------------------- */

  /**
   * @param {AbsorbEvent} p Reused payload (read-only, never retained).
   */
  _onAbsorb(p) {
    const id = p.collectibleId;
    if (typeof id !== 'number' || id < 0 || id > MAX_ID) return;
    const bit = 1 << id;
    const isNew = (this._mask & bit) === 0;
    this._mask = (this._mask | bit) >>> 0;
    if (isNew) {
      this._runMask |= bit; // NEW badges are first-ever finds only
      this._save();
    }

    const c = PAYLOADS.collect;
    c.collectibleId = id;
    c.nameJa = nameForId(id);
    c.isNew = isNew;
    c.found = this.foundCount;
    c.total = COLLECT_TOTAL;
    this._bus.emit(EVT.COLLECT, c);
  }

  /* ---------------------------------------------------------------- */
  /* Reset (main.resetWorld — frozen reset-ownership table v3)         */
  /* ---------------------------------------------------------------- */

  /** Clear per-run NEW state. The album mask PERSISTS (localStorage row of
   *  the reset-ownership table). */
  resetRun() {
    this._runMask = 0;
  }

  /* ---------------------------------------------------------------- */
  /* Persistence                                                       */
  /* ---------------------------------------------------------------- */

  /** Persist {v:1, mask} — try/catch like runStats (private mode / quota). */
  _save() {
    try {
      localStorage.setItem(LS_COLLECTION_KEY, JSON.stringify({ v: 1, mask: this._mask }));
    } catch (_) {
      /* private mode / quota — the album just doesn't persist */
    }
  }

  /**
   * Load the persisted album mask. 0 on ANY anomaly (no storage, missing key,
   * parse error, wrong version, non-integer/negative/oversized mask) —
   * callers need no try/catch. Unknown high bits pass through untouched.
   * @returns {number} uint32 album mask.
   */
  static loadMask() {
    try {
      const raw = localStorage.getItem(LS_COLLECTION_KEY);
      if (typeof raw !== 'string') return 0;
      const obj = JSON.parse(raw);
      if (obj === null || typeof obj !== 'object' || obj.v !== 1) return 0;
      const mask = obj.mask;
      if (typeof mask !== 'number' || !Number.isFinite(mask) || !Number.isInteger(mask)) return 0;
      if (mask < 0 || mask > 0xffffffff) return 0;
      return mask >>> 0;
    } catch (_) {
      return 0;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Thumbnails (one-shot boot render — exemptions ledger #5)          */
  /* ---------------------------------------------------------------- */

  /**
   * Render the 12 collectible archetypes into THUMB_SIZE_PX data-URLs via a
   * throwaway scene on the main renderer. Idempotent; never throws (a WebGL/
   * headless failure leaves urls '' and the popup/grid degrade gracefully).
   * Call during the title screen (main.js) — or at first COLLECT if the
   * pre-approved lazy lever is pulled (one call-site move).
   *
   * @param {{ renderer: THREE.WebGLRenderer }} renderer The main Renderer
   *   wrapper (render/renderer.js) — only .renderer is used.
   * @param {Record<string, THREE.BufferGeometry>} geos buildAllGeometries()
   *   result (unit-radius, vertex-colored) keyed by archetype id.
   */
  prerenderThumbnails(renderer, geos) {
    if (this._thumbed) return;
    if (
      renderer === null ||
      renderer === undefined ||
      renderer.renderer === undefined ||
      typeof document === 'undefined'
    ) {
      return; // headless — stay un-thumbed so a later (wired) call can run
    }
    this._thumbed = true;

    const gl = renderer.renderer;
    const size = THUMB_SIZE_PX;
    /** @type {THREE.WebGLRenderTarget|null} */
    let rt = null;
    const prevTarget = gl.getRenderTarget();
    const prevColor = new THREE.Color();
    gl.getClearColor(prevColor);
    const prevAlpha = gl.getClearAlpha();

    try {
      rt = new THREE.WebGLRenderTarget(size, size, { stencilBuffer: false });
      const scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(1.2, 1.8, 1.4);
      scene.add(key);
      const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 20);
      // 3/4 view at a distance that fits the unit bounding sphere in a 35° fov.
      camera.position.set(1.7, 1.25, 2.65);
      camera.lookAt(0, 0, 0);
      const mesh = new THREE.Mesh(undefined, getSharedObjectMaterial());
      scene.add(mesh);

      const pixels = new Uint8Array(size * size * 4);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx === null) return;
      const image = ctx.createImageData(size, size);

      gl.setClearColor(0x000000, 0); // transparent card background

      for (let id = 0; id < COLLECT_TOTAL; id++) {
        const archId = ARCHETYPE_ID_BY_CODE[collectibleCodeForId(id)];
        const geo = archId !== undefined ? geos[archId] : undefined;
        if (geo === undefined || geo === null) continue; // pre-Stream-C / unknown id
        mesh.geometry = geo;
        gl.setRenderTarget(rt);
        gl.clear();
        gl.render(scene, camera);
        gl.readRenderTargetPixels(rt, 0, 0, size, size, pixels);
        // GL rows are bottom-up — flip into the ImageData.
        const rowBytes = size * 4;
        for (let y = 0; y < size; y++) {
          const src = (size - 1 - y) * rowBytes;
          image.data.set(pixels.subarray(src, src + rowBytes), y * rowBytes);
        }
        ctx.putImageData(image, 0, 0);
        this._urls[id] = canvas.toDataURL('image/png');
      }
    } catch (_) {
      /* context loss / readback failure — thumbnails stay '' (graceful) */
    } finally {
      gl.setRenderTarget(prevTarget);
      gl.setClearColor(prevColor, prevAlpha);
      if (rt !== null) rt.dispose();
      // scratch canvas / scene / lights drop out of scope — GC reclaims them
      // (geometries belong to the shared geos table and are NOT disposed).
    }
  }
}
