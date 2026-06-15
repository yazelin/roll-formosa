/**
 * @file osmWorld.js — v4 Real-Tokyo OSM shard loader + decoder (Stream W,
 * docs/DESIGN-V4.md データパイプライン step 4 / §インターフェース — frozen
 * class signature).
 *
 * Responsibilities:
 *  - fetch() both committed shards (public/assets/tokyo/tokyo-v4-core.bin +
 *    tokyo-v4-outer.bin, immutable-cached via _headers) in parallel at the
 *    title screen, with ONE AbortController covering both.
 *  - Decode binary tile format v1 (Phase-0 appendix §A, the authority) into
 *    flat parallel typed arrays in one pass (~5-10 ms — title-screen work,
 *    documented exemption alongside the thumbnail pre-render).
 *  - Emit EVT.OSM_READY {buildings} EXACTLY ONCE, never after abortAndFail().
 *  - ONE-WAY FAILURE LATCH: abortAndFail() cancels in-flight fetches, latches
 *    failed = true permanently for the session, and discards any
 *    late-arriving data (a decode that completes after the latch is dropped).
 *    Internal fetch/decode errors latch the same way (main's TIER_UP deadline
 *    handler checks `!ready && !failed`; an early internal failure simply
 *    leaves the coverage latch undecided = procedural default).
 *  - DEV `?osmdelay=ms` artificially delays the fetch so the tier-2 deadline
 *    race is testable.
 *  - OWNS #osm-progress (title screen): bytes/total while loading, EMPTY
 *    STRING once done or failed (element exists in index.html, empty default).
 *
 * BYTE LAYOUT v1 (little-endian, frozen — DESIGN-V4 Phase-0 appendix §A):
 *   HEADER (16 B):  magic 'FKT4' u32 | version u16 (=1) | sectionCount u16
 *                   | flags u32 | reserved u32
 *   SECTION (16 B): type u8 (1=detail,2=tower,3=road,4=poly) | pad u8
 *                   | tileX i16 | tileZ i16 | count u16
 *                   | byteOffset u32 (absolute) | byteLen u32
 *   DETAIL (10 B):  cx u16, cz u16 (tile-local, 0.05 m) | w u8, d u8 (0.25 m)
 *                   | h u8 (0.5 m) | yaw u8 (pi/128)
 *                   | type u8 (bits 0-4 = code-94; bit 5 = MERGED) | tint u8
 *   TOWER (12 B):   cx u16, cz u16 | w u8, d u8 | h u16 (0.25 m) | yaw u8
 *                   | type u8 | tint u8 | pad u8
 *   Detail tiles = 100 game m grid (core shard); tower tiles = 400 m grid
 *   (outer shard). Tile-local coords are relative to tileX * tileSize.
 *   Records within a tile are BAND-SORTED (OsmTile.bandStart contract).
 *
 * COORDINATES: decoded x/z/w/d/h are GAME METERS (= the v3 "real meters"
 * convention, origin = ball start = the geo anchor). Sim conversion is the
 * OsmSpawner's job (live worldScale + origin shift — curated pattern).
 *
 * ROAD/POLY sections (types 3/4, outer shard, 200 m ground grid) are NOT
 * decoded here — they are indexed into `groundSections` (+ `outerView`
 * DataView) for Stream R's OsmGround to decode lazily (<= 2 tile builds per
 * frame). Building decode never touches them beyond the section table.
 *
 * Zero-allocation discipline: ALL allocation happens inside decodeBuffers()
 * (title-screen, once). forEachTileInRing / tileRecords / consumedMask /
 * markConsumedRec are allocation-free per call (consumedMask allocates its
 * Uint32Array lazily on FIRST touch of a tile — bounded, event-driven).
 */

import { EVT, PAYLOADS } from '../core/events.js';
import { OSM_CODE_BASE } from './objects.js';
import {
  OSM_COLLIDE_MIN,
  OSM_Q_CENTER_M,
  OSM_Q_WD_M,
  OSM_Q_H_M,
  OSM_Q_YAW,
  osmBandForReff,
} from '../config/tuning.js';

const DEV = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

/** 'FKT4' as little-endian u32. */
const MAGIC_FKT4 = 0x34544b46;
const FORMAT_VERSION = 1;
const HEADER_BYTES = 16;
const SECTION_BYTES = 16;
/** Section types (frozen format v1). */
const SEC_DETAIL = 1;
const SEC_TOWER = 2;
const SEC_ROAD = 3;
const SEC_POLY = 4;
/** Tile grid sizes, game meters (frozen format v1). */
const DETAIL_TILE_M = 100;
const TOWER_TILE_M = 400;
/** Tower height quantum (0.25 m — u16; detail uses OSM_Q_H_M = 0.5 u8). */
const Q_H_TOWER = 0.25;
/** Shard file names under the load baseUrl. */
export const OSM_CORE_FILE = 'tokyo-v4-core.bin';
export const OSM_OUTER_FILE = 'tokyo-v4-outer.bin';

/**
 * Parse a shard's header + section table.
 * @param {DataView} view Whole-shard DataView.
 * @param {string} label Shard label for error messages.
 * @returns {{type:number,tileX:number,tileZ:number,count:number,byteOffset:number,byteLen:number}[]}
 */
function readSectionTable(view, label) {
  if (view.byteLength < HEADER_BYTES) throw new Error(`[osmWorld] ${label}: truncated header`);
  const magic = view.getUint32(0, true);
  if (magic !== MAGIC_FKT4) {
    throw new Error(`[osmWorld] ${label}: bad magic 0x${magic.toString(16)} (want FKT4)`);
  }
  const version = view.getUint16(4, true);
  if (version !== FORMAT_VERSION) {
    throw new Error(`[osmWorld] ${label}: format version ${version} (want ${FORMAT_VERSION})`);
  }
  const sectionCount = view.getUint16(6, true);
  const sections = new Array(sectionCount);
  for (let i = 0; i < sectionCount; i++) {
    const o = HEADER_BYTES + i * SECTION_BYTES;
    sections[i] = {
      type: view.getUint8(o),
      tileX: view.getInt16(o + 2, true),
      tileZ: view.getInt16(o + 4, true),
      count: view.getUint16(o + 6, true),
      byteOffset: view.getUint32(o + 8, true),
      byteLen: view.getUint32(o + 12, true),
    };
    if (sections[i].byteOffset + sections[i].byteLen > view.byteLength) {
      throw new Error(`[osmWorld] ${label}: section ${i} overruns the shard`);
    }
  }
  return sections;
}

/**
 * v4 OSM world data. Construct once at boot (main.js, the marked stub slot):
 *   const osmWorld = new OsmWorld(bus);
 *   osmWorld.load('/assets/tokyo/');           // kicked at title screen
 */
export class OsmWorld {
  /**
   * @param {import('../core/events.js').EventBus} bus Shared event bus.
   */
  constructor(bus) {
    this._bus = bus;

    /** @type {boolean} True once both shards decoded (OSM_READY emitted). */
    this._ready = false;
    /** @type {boolean} ONE-WAY: permanent for the session once latched. */
    this._failed = false;
    /** @type {boolean} load() entered (idempotence guard). */
    this._loadStarted = false;
    /** @type {AbortController|null} Covers both shard fetches. */
    this._abortCtl = null;
    /** @type {Promise<void>|null} */
    this._loadPromise = null;

    /* ---- progress (title screen #osm-progress — this class is the OWNER) */
    this._gotBytes = 0;
    this._totalBytes = 0;
    /** @type {HTMLElement|null|undefined} undefined = not looked up yet. */
    this._progressEl = undefined;

    /* ---- decoded building SoA (allocated in decodeBuffers) ----
     * PUBLIC READ-ONLY for world/osmSpawner.js (documented friend access —
     * zero-allocation per-record reads; OsmBuildingRecord in types.js is the
     * logical view of one index). All length `count`. */
    /** @type {number} Total decoded building records (detail + tower). */
    this.count = 0;
    /** @type {Float32Array} Footprint center X, game m (+X east). */
    this.bx = null;
    /** @type {Float32Array} Footprint center Z, game m (+Z south). */
    this.bz = null;
    /** @type {Float32Array} OBB width (X at yaw=0), game m. */
    this.bw = null;
    /** @type {Float32Array} OBB depth (Z at yaw=0), game m. */
    this.bd = null;
    /** @type {Float32Array} Height, game m. */
    this.bh = null;
    /** @type {Float32Array} OBB yaw, rad (quantized pi/128). */
    this.byaw = null;
    /** @type {Uint8Array} Archetype code 94..109 (OSM_CODE_BASE + type bits). */
    this.bcode = null;
    /** @type {Uint8Array} Palette row index (hashed by source wayId at convert). */
    this.btint = null;
    /** @type {Uint8Array} 1 = MERGED flag (type byte bit 5). */
    this.bmerged = null;
    /** @type {Uint8Array} Band 2..5, derived from rEff (frozen edges). */
    this.bband = null;
    /** @type {Float32Array} rEff = 0.5*sqrt(w^2+d^2+h^2), game m (store radius). */
    this.brEff = null;
    /** @type {Float32Array} clamp(0.5*sqrt(w^2+d^2)/rEff, 0.35, 1.0) — per-record
     *  collision honesty (informational at runtime: the physics path reads the
     *  per-CODE catalog collisionScale; see notesForIntegration). */
    this.bcollide = null;

    /* ---- tile index (building tiles: detail + tower) ---- */
    this._tileCount = 0;
    this._tcx = null; // Float32Array tile center X (game m)
    this._tcz = null; // Float32Array tile center Z
    this._thalf = null; // Float32Array tile half-diagonal (ring margin)
    this._toffset = null; // Int32Array first record index
    this._tcount = null; // Int32Array record count
    this._tbandStart = null; // Int32Array tileCount*7 (OsmTile.bandStart layout)
    this._tileOfRecord = null; // Int32Array(count) record -> tile index
    /** @type {Array<Uint32Array|null>} lazily allocated per-tile consumed masks. */
    this._consumed = null;
    /** @type {Array<{tileX:number,tileZ:number,offset:number,count:number,bandStart:Int32Array}>}
     *  Prebuilt OsmTile objects (tileRecords return values — built once). */
    this._tiles = null;

    /* ---- nearest-first ring scratch (allocated in decodeBuffers) ---- */
    this._ringIdx = null; // Int32Array(tileCount)
    this._ringD2 = null; // Float64Array(tileCount)

    /* ---- ground data handoff for Stream R (render/osmGround.js) ----
     * Road (type 3) / poly (type 4) sections are indexed, not decoded:
     * groundSections[i] = {type, tileX, tileZ, count, byteOffset, byteLen}
     * with byteOffset absolute into outerView. 200 game m ground grid. */
    /** @type {Array<{type:number,tileX:number,tileZ:number,count:number,byteOffset:number,byteLen:number}>} */
    this.groundSections = null;
    /** @type {DataView|null} Outer-shard view (road/poly payload source). */
    this.outerView = null;
  }

  /**
   * INTEGRATION FIX (lead): render/osmGround.js's frozen handoff contract
   * names this `outerBytes` (raw ungzipped tokyo-v4-outer.bin, set before
   * OSM_READY emits, retained for the session) — outerView IS that buffer
   * (whole-buffer DataView, byteOffset 0), exposed here under the name the
   * R-stream consumer reads. Null until ready; permanently null if failed.
   * @returns {ArrayBuffer|null} Raw outer-shard bytes.
   */
  get outerBytes() {
    return this.outerView !== null ? this.outerView.buffer : null;
  }

  /* ---------------------------------------------------------------- */
  /* Frozen public interface                                           */
  /* ---------------------------------------------------------------- */

  /** @returns {boolean} True once both shards are decoded (OSM_READY emitted). */
  get ready() {
    return this._ready;
  }

  /** @returns {boolean} Permanent for the session once abortAndFail() ran. */
  get failed() {
    return this._failed;
  }

  /**
   * Kick the shard fetch (title screen). Resolves when decode finished OR the
   * failure latch closed — NEVER rejects (errors latch failed internally).
   * Idempotent: repeat calls return the first promise.
   * @param {string} baseUrl e.g. '/assets/tokyo/'.
   * @returns {Promise<void>}
   */
  load(baseUrl) {
    if (this._loadStarted) return this._loadPromise;
    this._loadStarted = true;
    this._loadPromise = this._load(baseUrl).catch((e) => {
      // Internal failure latch (one-way; same semantics as abortAndFail but
      // without an external caller). Late TIER_UP sees failed=true and skips.
      if (!this._failed) {
        this._failed = true;
        if (DEV) console.warn('[osmWorld] load failed — coverage stays procedural:', e);
      }
      this._setProgress('');
    });
    return this._loadPromise;
  }

  /**
   * ONE-WAY deadline latch (main.js, TIER_UP into tier >= 2 with !ready):
   * cancels in-flight fetches, latches failed = true permanently, discards
   * late data. Never un-latches; OSM_READY can never fire after this.
   */
  abortAndFail() {
    if (this._failed) return;
    if (DEV && this._ready) {
      // Protocol misuse — main only calls this on the !ready deadline path.
      console.warn('[osmWorld] abortAndFail() after ready — latching anyway (one-way)');
    }
    this._failed = true;
    if (this._abortCtl !== null) this._abortCtl.abort();
    this._setProgress('');
  }

  /**
   * Iterate building tiles that intersect the ring, NEAREST-FIRST (ascending
   * center distance), restricted to tiles with >= 1 record in `band`.
   * Allocation-free (preallocated scratch + insertion sort; do not allocate
   * inside cb, do not retain tile indices across frames).
   * @param {number} band Band 2..5.
   * @param {number} cxReal Ring center X, game meters (real-meter convention).
   * @param {number} czReal Ring center Z, game meters.
   * @param {number} rReal Ring radius, game meters (caller adds any objR margin).
   * @param {(tileIdx: number) => void} cb
   */
  forEachTileInRing(band, cxReal, czReal, rReal, cb) {
    if (!this._ready) return;
    const n = this._tileCount;
    const bs = this._tbandStart;
    const idxArr = this._ringIdx;
    const d2Arr = this._ringD2;
    let m = 0;
    for (let t = 0; t < n; t++) {
      const b7 = t * 7;
      if (bs[b7 + band + 1] <= bs[b7 + band]) continue; // no records in band
      const dx = this._tcx[t] - cxReal;
      const dz = this._tcz[t] - czReal;
      const d2 = dx * dx + dz * dz;
      const reach = rReal + this._thalf[t];
      if (d2 > reach * reach) continue;
      // Insertion sort by distance (ring sets are small; zero allocation).
      let j = m - 1;
      while (j >= 0 && d2Arr[j] > d2) {
        d2Arr[j + 1] = d2Arr[j];
        idxArr[j + 1] = idxArr[j];
        j--;
      }
      d2Arr[j + 1] = d2;
      idxArr[j + 1] = t;
      m++;
    }
    for (let k = 0; k < m; k++) cb(idxArr[k]);
  }

  /**
   * Tile record ranges (frozen interface; prebuilt object — treat READ-ONLY).
   * bandStart layout per src/types.js OsmTile: length 7, band b's records are
   * [bandStart[b], bandStart[b+1]) for b <= 4 and [bandStart[5], bandStart[6])
   * for band 5 (bandStart[6] === offset + count; OSM ships bands 2..5 only).
   * @param {number} tileIdx
   * @returns {{tileX:number,tileZ:number,offset:number,count:number,bandStart:Int32Array}}
   */
  tileRecords(tileIdx) {
    return this._tiles[tileIdx];
  }

  /**
   * Per-tile consumed bitmask, lazily allocated (bit i = record
   * offset+i absorbed — permanent for the run; survives deactivation,
   * rescale, rebase; cleared by osmSpawner.reset() via resetConsumedMasks()).
   * @param {number} tileIdx
   * @returns {Uint32Array}
   */
  consumedMask(tileIdx) {
    let mask = this._consumed[tileIdx];
    if (mask === null) {
      mask = new Uint32Array((this._tcount[tileIdx] + 31) >> 5);
      this._consumed[tileIdx] = mask;
    }
    return mask;
  }

  /* ---------------------------------------------------------------- */
  /* Friend accessors (world/osmSpawner.js — zero-allocation paths)    */
  /* ---------------------------------------------------------------- */

  /** Band-range accessor: first record index of `band` in tile (b 0..6). */
  bandStartOf(tileIdx, band) {
    return this._tbandStart[tileIdx * 7 + band];
  }

  /** @param {number} rec @returns {number} Owning tile index. */
  tileOf(rec) {
    return this._tileOfRecord[rec];
  }

  /** Mark one RECORD consumed (ABSORB bookkeeping). @param {number} rec */
  markConsumedRec(rec) {
    const t = this._tileOfRecord[rec];
    const bit = rec - this._toffset[t];
    const mask = this.consumedMask(t);
    mask[bit >> 5] |= 1 << (bit & 31);
  }

  /** @param {number} rec @returns {boolean} Record was absorbed this run. */
  isConsumedRec(rec) {
    const t = this._tileOfRecord[rec];
    const mask = this._consumed[t];
    if (mask === null) return false;
    const bit = rec - this._toffset[t];
    return (mask[bit >> 5] & (1 << (bit & 31))) !== 0;
  }

  /** Clear every allocated consumed mask (osmSpawner.reset()). */
  resetConsumedMasks() {
    if (this._consumed === null) return;
    for (let i = 0; i < this._consumed.length; i++) {
      const mask = this._consumed[i];
      if (mask !== null) mask.fill(0);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Decode (title-screen work — documented exemption)                 */
  /* ---------------------------------------------------------------- */

  /**
   * Decode both shards into the flat SoA + tile index, then latch ready and
   * emit EVT.OSM_READY (once). DISCARDED silently if the failure latch closed
   * first (late-data rule) or if already ready. load() calls this; headless
   * tests call it directly with fs-read ArrayBuffers.
   * @param {ArrayBuffer} coreBuf tokyo-v4-core.bin bytes.
   * @param {ArrayBuffer} outerBuf tokyo-v4-outer.bin bytes.
   */
  decodeBuffers(coreBuf, outerBuf) {
    if (this._failed || this._ready) return; // late data discarded / once-only

    const coreView = new DataView(coreBuf);
    const outerView = new DataView(outerBuf);
    const coreSecs = readSectionTable(coreView, 'core');
    const outerSecs = readSectionTable(outerView, 'outer');

    /* Pass 1: size everything. Building tiles = detail (core) + tower (outer);
       road/poly sections are indexed for Stream R, never decoded here. */
    let nRec = 0;
    let nTile = 0;
    const ground = [];
    for (let i = 0; i < coreSecs.length; i++) {
      const s = coreSecs[i];
      if (s.type === SEC_DETAIL) {
        nRec += s.count;
        nTile++;
      } else if (DEV) {
        throw new Error(`[osmWorld] core: unexpected section type ${s.type}`);
      }
    }
    for (let i = 0; i < outerSecs.length; i++) {
      const s = outerSecs[i];
      if (s.type === SEC_TOWER) {
        nRec += s.count;
        nTile++;
      } else if (s.type === SEC_ROAD || s.type === SEC_POLY) {
        ground.push(s);
      } else if (DEV) {
        throw new Error(`[osmWorld] outer: unexpected section type ${s.type}`);
      }
    }

    this.count = nRec;
    this.bx = new Float32Array(nRec);
    this.bz = new Float32Array(nRec);
    this.bw = new Float32Array(nRec);
    this.bd = new Float32Array(nRec);
    this.bh = new Float32Array(nRec);
    this.byaw = new Float32Array(nRec);
    this.bcode = new Uint8Array(nRec);
    this.btint = new Uint8Array(nRec);
    this.bmerged = new Uint8Array(nRec);
    this.bband = new Uint8Array(nRec);
    this.brEff = new Float32Array(nRec);
    this.bcollide = new Float32Array(nRec);

    this._tileCount = nTile;
    this._tcx = new Float32Array(nTile);
    this._tcz = new Float32Array(nTile);
    this._thalf = new Float32Array(nTile);
    this._toffset = new Int32Array(nTile);
    this._tcount = new Int32Array(nTile);
    this._tbandStart = new Int32Array(nTile * 7);
    this._tileOfRecord = new Int32Array(nRec);
    this._consumed = new Array(nTile).fill(null);
    this._tiles = new Array(nTile);
    this._ringIdx = new Int32Array(nTile);
    this._ringD2 = new Float64Array(nTile);

    /* Pass 2: decode records (detail tiles first, then tower tiles — the
       within-shard section order is the builder's deterministic tile order). */
    let rec = 0;
    let tile = 0;
    for (let i = 0; i < coreSecs.length; i++) {
      const s = coreSecs[i];
      if (s.type !== SEC_DETAIL) continue;
      rec = this._decodeBuildingTile(coreView, s, tile, rec, /* tower */ false);
      tile++;
    }
    for (let i = 0; i < outerSecs.length; i++) {
      const s = outerSecs[i];
      if (s.type !== SEC_TOWER) continue;
      rec = this._decodeBuildingTile(outerView, s, tile, rec, /* tower */ true);
      tile++;
    }
    if (DEV && rec !== nRec) {
      throw new Error(`[osmWorld] decode count desync: ${rec} != ${nRec}`);
    }

    this.groundSections = ground;
    this.outerView = outerView;

    this._ready = true;
    this._setProgress('');
    PAYLOADS.osmReady.buildings = nRec;
    this._bus.emit(EVT.OSM_READY, PAYLOADS.osmReady);
    if (DEV) {
      console.log(
        `[osmWorld] ready — ${nRec} buildings / ${nTile} tiles ` +
          `(+${ground.length} ground sections for osmGround)`
      );
    }
  }

  /**
   * Decode one DETAIL or TOWER section into the SoA at write cursor `rec`.
   * @param {DataView} view Owning shard view.
   * @param {object} s Section descriptor.
   * @param {number} tile Tile index being filled.
   * @param {number} rec First record index.
   * @param {boolean} tower True = TOWER layout (12 B), else DETAIL (10 B).
   * @returns {number} Next record write cursor.
   */
  _decodeBuildingTile(view, s, tile, rec, tower) {
    const tileSize = tower ? TOWER_TILE_M : DETAIL_TILE_M;
    const stride = tower ? 12 : 10;
    const baseX = s.tileX * tileSize;
    const baseZ = s.tileZ * tileSize;
    if (DEV && s.byteLen !== s.count * stride) {
      throw new Error(`[osmWorld] section byteLen ${s.byteLen} != count*stride ${s.count * stride}`);
    }
    const off0 = s.byteOffset;
    const first = rec;
    let prevBand = 0;
    for (let k = 0; k < s.count; k++) {
      const o = off0 + k * stride;
      const x = baseX + view.getUint16(o, true) * OSM_Q_CENTER_M;
      const z = baseZ + view.getUint16(o + 2, true) * OSM_Q_CENTER_M;
      const w = view.getUint8(o + 4) * OSM_Q_WD_M;
      const d = view.getUint8(o + 5) * OSM_Q_WD_M;
      let h;
      let yawByte;
      let typeByte;
      let tint;
      if (tower) {
        h = view.getUint16(o + 6, true) * Q_H_TOWER;
        yawByte = view.getUint8(o + 8);
        typeByte = view.getUint8(o + 9);
        tint = view.getUint8(o + 10);
      } else {
        h = view.getUint8(o + 6) * OSM_Q_H_M;
        yawByte = view.getUint8(o + 7);
        typeByte = view.getUint8(o + 8);
        tint = view.getUint8(o + 9);
      }
      const rEff = 0.5 * Math.sqrt(w * w + d * d + h * h);
      const band = osmBandForReff(rEff);
      if (DEV) {
        if (band < 2) throw new Error(`[osmWorld] record under the r_eff drop floor (rEff ${rEff})`);
        if (band < prevBand) {
          throw new Error(`[osmWorld] tile ${tile} records not band-sorted (bandStart contract)`);
        }
      }
      prevBand = band;
      this.bx[rec] = x;
      this.bz[rec] = z;
      this.bw[rec] = w;
      this.bd[rec] = d;
      this.bh[rec] = h;
      this.byaw[rec] = yawByte * OSM_Q_YAW;
      this.bcode[rec] = OSM_CODE_BASE + (typeByte & 0x1f);
      this.bmerged[rec] = (typeByte & 0x20) !== 0 ? 1 : 0;
      this.btint[rec] = tint;
      this.bband[rec] = band;
      this.brEff[rec] = rEff;
      const cs = (0.5 * Math.sqrt(w * w + d * d)) / rEff;
      this.bcollide[rec] = cs < OSM_COLLIDE_MIN ? OSM_COLLIDE_MIN : cs > 1 ? 1 : cs;
      this._tileOfRecord[rec] = tile;
      rec++;
    }

    /* Tile index entry + bandStart (records are band-sorted: bandStart[b] =
       first record with band >= b; bandStart[6] = end sentinel — band 6 is
       never shipped/queried). */
    this._tcx[tile] = baseX + tileSize * 0.5;
    this._tcz[tile] = baseZ + tileSize * 0.5;
    this._thalf[tile] = tileSize * Math.SQRT2 * 0.5;
    this._toffset[tile] = first;
    this._tcount[tile] = s.count;
    const bs = this._tbandStart;
    let p = first;
    for (let b = 0; b <= 6; b++) {
      while (p < rec && this.bband[p] < b) p++;
      bs[tile * 7 + b] = p;
    }
    this._tiles[tile] = {
      tileX: s.tileX,
      tileZ: s.tileZ,
      offset: first,
      count: s.count,
      bandStart: bs.subarray(tile * 7, tile * 7 + 7),
    };
    return rec;
  }

  /* ---------------------------------------------------------------- */
  /* Fetch internals                                                   */
  /* ---------------------------------------------------------------- */

  /** @param {string} baseUrl */
  async _load(baseUrl) {
    /* DEV ?osmdelay=ms — makes the tier-2 deadline race testable. */
    if (DEV && typeof window !== 'undefined' && window.location) {
      let delayMs = 0;
      try {
        delayMs = parseInt(new URLSearchParams(window.location.search).get('osmdelay'), 10) || 0;
      } catch (_) {
        /* exotic environments — no delay */
      }
      if (delayMs > 0) {
        this._setProgress(`リアル東京 osmdelay ${delayMs}ms…`);
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
    if (this._failed) return; // deadline closed during the delay

    this._abortCtl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const signal = this._abortCtl !== null ? this._abortCtl.signal : undefined;
    this._setProgress('リアル東京 読み込み中…');
    const [core, outer] = await Promise.all([
      this._fetchShard(baseUrl + OSM_CORE_FILE, signal),
      this._fetchShard(baseUrl + OSM_OUTER_FILE, signal),
    ]);
    if (this._failed) {
      this._setProgress(''); // late data discarded (one-way latch)
      return;
    }
    this.decodeBuffers(core, outer);
  }

  /**
   * Fetch one shard with streaming byte progress (#osm-progress).
   * @param {string} url
   * @param {AbortSignal|undefined} signal
   * @returns {Promise<ArrayBuffer>}
   */
  async _fetchShard(url, signal) {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`[osmWorld] ${url}: HTTP ${res.status}`);
    const len = Number(res.headers.get('content-length')) || 0;
    this._totalBytes += len;
    if (!res.body || typeof res.body.getReader !== 'function') {
      const buf = await res.arrayBuffer();
      this._gotBytes += buf.byteLength;
      this._renderProgress();
      return buf;
    }
    const reader = res.body.getReader();
    const chunks = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
      this._gotBytes += value.length;
      this._renderProgress();
    }
    const out = new Uint8Array(size);
    let o = 0;
    for (let i = 0; i < chunks.length; i++) {
      out.set(chunks[i], o);
      o += chunks[i].length;
    }
    return out.buffer;
  }

  /* ---------------------------------------------------------------- */
  /* #osm-progress ownership                                           */
  /* ---------------------------------------------------------------- */

  /** Bytes/total line while loading (totals are transfer-size best-effort). */
  _renderProgress() {
    if (this._failed || this._ready) return;
    const got = (this._gotBytes / 1024) | 0;
    const total = (this._totalBytes / 1024) | 0;
    this._setProgress(
      total > 0 ? `リアル東京 読み込み中… ${got} / ${total} KB` : `リアル東京 読み込み中… ${got} KB`
    );
  }

  /** @param {string} text '' once done or failed (contract). */
  _setProgress(text) {
    if (this._progressEl === undefined) {
      this._progressEl =
        typeof document !== 'undefined' ? document.getElementById('osm-progress') : null;
    }
    if (this._progressEl !== null) this._progressEl.textContent = text;
  }
}
