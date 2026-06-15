/**
 * @file main.js — Bootstrap + fixed-timestep 60Hz accumulator loop + game
 * state machine (title/playing/finale/win).
 *
 * main.js owns the PER-FRAME CALL ORDER (plain function calls, NOT events)
 * and wires all modules via constructor injection + the event bus.
 * NO GAME LOGIC lives here.
 *
 * ============ v4 (Real Tokyo) — BINDING FRAME ORDER ============
 * (docs/DESIGN-V4.md §インターフェース — a pure DELTA on the v3 order below;
 *  all four streams P/C/R/W are INTEGRATED.)
 *  1   intent = input.read(); if (finale.inputLocked) zero x/y/boost/dash
 *  2   fixed steps { ballPhys.step(dt, intent, yaw+PI)
 *                      // terrain.collide runs INSIDE step, after XZ
 *                      // integration (injected CityTerrain — Stream B);
 *                    if (!finale.inputLocked) absorb.resolve(...) }
 *  3   if (!finale.inputLocked) { spawner.update(...); curated.update(...);
 *                                 osmSpawner.update(...) }
 *                      // curated AFTER spawner; osmSpawner AFTER curated,
 *                      // same gate (v4 — BINDING)
 *  4   scaleMgr.maybeTierUp(...); if (!finale.inputLocked) scaleMgr.maybeRebase(...)
 *  4.5 finale.update(frameDt, ballPhys.state)   // approach/contact vs
 *      SkytreeView, cinematic camera (drives cameraRig.cinematicUpdate)
 *  5   ball.update(...)
 *  6   if (!finale.cameraOwned) cameraRig.update(...)  // interior01 + boom
 *      clamp are INTERNAL to cameraRig (injected at construction);
 *      env.update(...); osmGround.update(dt, ballPos, env.fogFarSim);
 *      backdrop.update(...); effects.update(...)
 *  6.5 runStats.addSimTime(steps * FIXED_DT)    // frozen after GOAL_CONTACT
 *  7   updateAndFlushPools(); renderer.render()
 * GameState: TITLE -> PLAYING -> FINALE (finale.inputLocked first true)
 *            -> WIN (main emits GAME_WIN at finale.state === 'done' — main
 *            is the SOLE game:win emitter).
 * v4 OSM LIFECYCLE (main is the integrator — docs/DESIGN-V4.md):
 *   - osmWorld.load(OSM_BASE_URL) kicked at title (shard fetch + decode is
 *     title-screen work — documented exemption like the thumbnail pre-render).
 *   - EVT.OSM_READY -> cityMap.setOsmCoverageActive(true) — ONE-SHOT, exactly
 *     once per session.
 *   - ONE-WAY TIER-2 DEADLINE LATCH: on TIER_UP into tier >= 2 with
 *     !osmWorld.ready, main calls osmWorld.abortAndFail() (fetches cancelled,
 *     failed latches true permanently, late data discarded) and
 *     setOsmCoverageActive(false). Testable via ?osmdelay=ms (osmWorld DEV).
 *   - resetWorld += osmSpawner.reset() (after curated.reset()); the coverage
 *     latch is PER-SESSION and is NOT re-armed by reset.
 *   - devTeleport += osmSpawner.onTeleport() + forceScan().
 * BINDING ABSORB subscription order at boot (v4, frozen in events.js):
 *   chunk spawner (bookkeeping only; skips FLAG_CURATED|FLAG_OSM slots)
 *   -> curated (CuratedSpawner constructs right after Spawner)
 *   -> osmSpawner (constructs right after CuratedSpawner — v4)
 *   -> main attach-handler (sets store.instanceSlot = -1 on steal —
 *      load-bearing for curated's/osmSpawner's deferred cleanup, slot-steal
 *      convention)
 *   -> runStats -> collection (constructs right after RunStats)
 *   -> sfx/effects/hud.
 * MUTE ownership: main is the single owner — reads LS_MUTE_KEY BEFORE
 * constructing Bgm/Sfx (initialMuted); input.takeMuteToggle() OR
 * EVT.MUTE_REQUEST -> toggle, bgm.setMuted + sfx.setMuted, persist,
 * emit EVT.MUTE_CHANGED.
 * RESET ownership (v3): finale.reset + runStats.reset + curated.reset +
 * collection.resetRun via resetWorld() below; cameraRig/env/backdrop/ball/
 * hud/donack self-reset via bus (see DESIGN-V3.md Phase-0 appendix).
 * ================================================================
 *
 * Integration notes (Phase 2):
 *  - YAW BRIDGE: ballPhysics' yaw convention (yaw=0 looks along -Z, forward
 *    = (-sin, 0, -cos)) and cameraRig's (forward = (sin, 0, cos)) differ by
 *    exactly PI; the bridge is `cameraRig.yaw + Math.PI` at the one call site.
 *  - ABSORB: absorb.js emits 'absorb' BEFORE store.free(i); the handler here
 *    reads the world-instance tint, frees the world pool slot, and hands the
 *    object to ball.attachStuck — all synchronously during the emit.
 *  - KNOCK_OFF: absorb.js emits a rolled count; the handler here (subscribed
 *    FIRST, before Effects/Sfx) ejects from the render ball, re-injects the
 *    reused WorldReentry records via spawner, then writes the ACTUAL ejected
 *    count back into the payload for the downstream cosmetic handlers.
 *  - RESCALE: ScaleManager scales BallState/store/pools/camera/env itself and
 *    emits 'rescale'; the handler here covers the two pieces ScaleManager has
 *    no reference to: ball.rescaleState(S) and ballPhys.rescaleSpring(S).
 */

import * as THREE from 'three';
import {
  FIXED_DT,
  MAX_SUBSTEPS,
  MAX_FRAME_DT,
  SPEED_K,
  SIM_RADIUS_MIN,
  SIM_RADIUS_MAX,
  START_RADIUS_M,
  GOAL_RADIUS_M,
  LS_MUTE_KEY,
  LS_DONACK_KEY,
} from './config/tuning.js';
import { bus, EVT, PAYLOADS } from './core/events.js';
import { resolveWorldSeed } from './core/rng.js';
import { TIERS } from './config/tiers.js';
import { CATALOG } from './config/catalog.js';
import { ObjectStore, EXTRA_CODE_BASE, OSM_ARCHETYPE_IDS, OSM_CODE_BASE } from './world/objects.js';
import { SpatialHash } from './world/spatialHash.js';
import { BallPhysics } from './physics/ballPhysics.js';
import { Absorb } from './physics/absorb.js';
import { Spawner, ARCHETYPE_IDS } from './world/spawner.js';
import { ScaleManager } from './world/scaleManager.js';
import { Renderer, parseStartRadius } from './render/renderer.js';
import { buildAllGeometries } from './render/geometryFactory.js';
import {
  InstancedPool,
  getSharedObjectMaterial,
  updateAndFlushPools,
} from './render/instances.js';
import { Environment } from './render/environment.js';
import { Input } from './input/input.js';
import { CameraRig } from './render/cameraRig.js';
import { Ball } from './render/ball.js';
import { Effects } from './render/effects.js';
import { Sfx } from './audio/sfx.js';
import { Hud } from './ui/hud.js';
import { Screens } from './ui/screens.js';

/* ---- v2 modules (all streams landed) -------------------------------- */
import { Finale } from './game/finale.js'; // Stream A (v3: re-themed in place)
import { RunStats } from './game/runStats.js'; // Stream D
import { Bgm } from './audio/bgm.js'; // Stream E
import { Backdrop } from './render/backdrop.js'; // Stream E (v3 profile pair)

/* ---- v3 modules (integrated) ----------------------------------------- */
import { CityTerrain } from './world/terrain.js'; // Stream B
import { CuratedSpawner } from './world/curated.js'; // Stream B
import { Collection } from './game/collection.js'; // Stream D
import { Donack } from './ui/donack.js'; // Stream E
import { SkytreeView } from './render/goalTower.js'; // Stream A (replaces MoonView)
import { DEV_STARTS } from './config/cityMap.js'; // Stream B
import * as cityMap from './config/cityMap.js'; // v4: setOsmCoverageActive guard-called via namespace (lands with Stream W)
import { buildExtraPools, extraClassIndexForCode } from './render/extraPools.js'; // integration (4 shared EXTRA pools)

/* ---- v4 modules (integrated — streams P/C/R/W all landed) ------------- */
import { OsmWorld } from './world/osmWorld.js'; // Stream W
import { OsmSpawner } from './world/osmSpawner.js'; // Stream W
import { makeOsmPools } from './render/osmPools.js'; // Stream R
import { OsmGround } from './render/osmGround.js'; // Stream R
import { makeObjectMaterial, setRimTint } from './render/objectMaterial.js'; // Stream C (rim)

/* ---- v5 modules (integrated) ------------------------------------------ */
import { Onboarding } from './game/onboarding.js'; // opening parts guide
import { EarthView } from './render/earthView.js'; // space-earth ending sky element

/* ------------------------------------------------------------------ */
/* Game state machine                                                  */
/* ------------------------------------------------------------------ */

/** @enum {string} */
const GameState = Object.freeze({
  TITLE: 'title',
  PLAYING: 'playing',
  /** v2: post-contact cinematic — sim keeps stepping, input/absorb/spawner/rebase gated off. */
  FINALE: 'finale',
  WIN: 'win',
});

/** @type {string} Current game state. */
let state = GameState.TITLE;

/** uint32 world seed (?seed= param or Date.now()); shown on win screen. */
const worldSeed = resolveWorldSeed();

/** Dev `?r=` start radius (real meters) or null. */
const startRadiusM = parseStartRadius();

/** World-instance pool capacity per archetype (free-list slots). */
const POOL_CAPACITY = 512;

/* ------------------------------------------------------------------ */
/* Boot — construct modules in dependency order.                       */
/* geometryFactory runs during the title screen (~80ms).               */
/* ------------------------------------------------------------------ */

const renderer = new Renderer(
  /** @type {HTMLCanvasElement} */ (document.getElementById('game-canvas'))
);
const store = new ObjectStore();
/**
 * 3 live tier-band hashes: hashes[i] owns band scaleMgr.tierIndex - 1 + i.
 * Each band's cell size is its NATIVE cellSizeSim converted to CURRENT sim
 * units (x5 per band step at boot, scaleExp 0) — ScaleManager._rebuildHashes
 * keeps them in sync via bandCellSizeCur on every re-band/rescale/rebase.
 */
const hashes = [
  new SpatialHash(TIERS[0].cellSizeSim / 5), // band -1 (empty at boot)
  new SpatialHash(TIERS[0].cellSizeSim), // band 0
  new SpatialHash(TIERS[1].cellSizeSim * 5), // band +1 scenery, current units
];
const geos = buildAllGeometries(CATALOG);

/* v4 (Stream C): decorate the SINGLE shared object material with the rim
 * term BEFORE the first pool/mesh is created so the first compiled program
 * already carries it. makeObjectMaterial() returns the instances.js
 * singleton — every existing getSharedObjectMaterial() call site below keeps
 * receiving the same instance (one-material law, ledger untouched). */
makeObjectMaterial();

/** @type {Map<string, InstancedPool>} World pool per archetype id. */
const instances = new Map();
/** @type {InstancedPool[]} Flat list for updateAndFlushPools / reset. */
const poolList = [];
{
  const sharedMat = getSharedObjectMaterial();
  for (let i = 0; i < ARCHETYPE_IDS.length; i++) {
    const id = ARCHETYPE_IDS[i];
    const pool = new InstancedPool(geos[id], sharedMat, POOL_CAPACITY);
    renderer.scene.add(pool.mesh);
    instances.set(id, pool);
    poolList.push(pool);
  }
}
/** CHUNK pool lookup by archetype code (= flat index tier*ARCH_PER_TIER +
 *  slotInTier, 0..69). Snapshot BEFORE the EXTRA pools are appended to
 *  poolList below — EXTRA codes (>= 70) must never resolve here. */
const POOL_BY_CODE = poolList.slice();

const env = new Environment(renderer.scene, renderer.camera);

/* ================================================================== */
/* v3 world construction (integration order is BINDING — frozen ABSORB */
/* subscription order: chunk spawner -> curated -> main attach ->       */
/* runStats -> collection -> sfx/effects/hud).                          */
/* ================================================================== */

const scaleMgr = new ScaleManager(bus, worldSeed);

/* CityTerrain (Stream B): shop walls/prisms + permanent Skytree base
 * collider + map-bounds clamp. Injected into BallPhysics (collide after XZ
 * integration) and CameraRig (clampCameraBoom / interiorAt01). The optional
 * 3rd arg adds terrain.mesh to the scene (+1 draw, ledgered). */
const terrain = new CityTerrain(bus, scaleMgr, renderer.scene);

const ballPhys = new BallPhysics(bus, terrain);
const spawner = new Spawner(worldSeed, store, hashes, instances, bus, CATALOG, scaleMgr);

/* The 4 SHARED EXTRA size-class render pools (flat +4 draws worst case,
 * ledger 64/72). Registered in the `instances` map under reserved keys so
 * ScaleManager's eachPool covers their RESCALE/REBASE (Spawner/curated only
 * ever look pools up by archetype id), and in poolList for update/flush/
 * reset. BatchedMesh-backed: per-instance geometry by EXTRA code. */
const extraPools = buildExtraPools(geos, getSharedObjectMaterial());
for (let i = 0; i < extraPools.length; i++) {
  if (extraPools[i] === null) continue;
  renderer.scene.add(extraPools[i].mesh);
  instances.set(`extra:${i}`, extraPools[i]);
  poolList.push(extraPools[i]);
}

/* CuratedSpawner (Stream B) — constructs AFTER the Spawner (its ABSORB
 * handler must run second) and BEFORE the KNOCK_OFF / ABSORB handlers below. */
const curated = new CuratedSpawner(store, hashes, instances, extraPools, bus, scaleMgr);
if (import.meta.env && import.meta.env.DEV) {
  // v4: curated's 300-frame ownership identity assert is chunk + X === store.
  // With OSM alive the chunk spawner alone no longer accounts for the rest —
  // hand curated the 3-spawner sum (spawner + osmSpawner; osmSpawner is
  // declared below, the getter only evaluates during curated.update()).
  curated.attachChunkSpawner({
    get aliveCount() {
      return spawner.aliveCount + osmSpawner.aliveCount;
    },
  });
}

/* ================================================================== */
/* v4 REAL TOKYO — integrated at the BINDING call sites                */
/* (docs/DESIGN-V4.md §インターフェース / INTEGRATION order P->C->R->W). */
/* ================================================================== */

/** OSM shard base URL (public/assets/tokyo/, immutable-cached via _headers). */
const OSM_BASE_URL = '/assets/tokyo/';

/* OsmWorld (Stream W): fetches both shards (AbortController) + decodes typed
 * arrays at title, emits EVT.OSM_READY, honors ?osmdelay=ms in DEV, drives
 * #osm-progress; abortAndFail() is the ONE-WAY failure latch. */
const osmWorld = new OsmWorld(bus);

/* osmPools (Stream R): 2 BatchedExtraPool batches — detail cap 2048 (bands
 * 2-3) / large cap 1024 (bands 4-5); OSM_ALIVE_CAP feasibility + unit-box +
 * axis-aligned-normals boot asserts live inside makeOsmPools. Registered in
 * `instances` (reserved keys) + `poolList` exactly like extraPools above so
 * ScaleManager.eachPool covers RESCALE/REBASE and updateAndFlushPools covers
 * fade stepping (+2 draws, honest ledger 68/72). */
const osmGeometries = [];
for (let i = 0; i < OSM_ARCHETYPE_IDS.length; i++) {
  osmGeometries.push({ code: OSM_CODE_BASE + i, geometry: geos[OSM_ARCHETYPE_IDS[i]] });
}
const osmPools = makeOsmPools(getSharedObjectMaterial(), osmGeometries);
renderer.scene.add(osmPools.detail.mesh);
renderer.scene.add(osmPools.large.mesh);
instances.set('osm:detail', osmPools.detail);
instances.set('osm:large', osmPools.large);
poolList.push(osmPools.detail, osmPools.large);

/* OsmSpawner (Stream W) — MUST construct EXACTLY HERE: after CuratedSpawner
 * (its ABSORB handler is THIRD in the frozen order) and before the
 * KNOCK_OFF/ABSORB attach-handlers below. <=OSM_UPDATE_BUDGET ops/frame
 * nearest-first, hard admission check (ALIVE_TOTAL_BUDGET -
 * OSM_ADMISSION_HEADROOM), consumed bitmasks, deferred ABSORB bookkeeping,
 * RESCALE/REBASE origin handlers (curated pattern verbatim); inert until
 * osmWorld.ready, forever inert if failed. */
const osmSpawner = new OsmSpawner(store, hashes, osmPools, bus, scaleMgr, osmWorld);

/* OsmGround (Stream R): tile group (scale = 1/worldScale, pos = -origin —
 * pure similarity transform), ground BatchedMesh + river mesh on the shared
 * env water material, <=2 tile builds/frame, major/minor LOD; RESCALE/
 * REBASE/GAME_RESET self-subscribed — NOT added to resetWorld (+2 draws). */
const osmGround = new OsmGround(renderer.scene, scaleMgr, env.getWaterMaterial(), osmWorld);
/* v5 謎の溝 fix: live ground tint for the radius-driven OSM ground fade —
 * unwired the ground renders exactly as v4 (and warns in DEV). REQUIRED. */
osmGround.setEnvironment(env);

/* v4 ONE-SHOT coverage latch — cityMap.setOsmCoverageActive is called
 * EXACTLY ONCE per session (on OSM_READY *or* at the tier-2 deadline),
 * always before band 3 ever matters (~80 s of slack). NOT re-armed by
 * resetWorld (per-session, docs/DESIGN-V4.md データパイプライン step 4). */
let osmCoverageDecided = false;
/** @param {boolean} active */
function decideOsmCoverage(active) {
  if (osmCoverageDecided) return;
  osmCoverageDecided = true;
  // Guarded until Stream W lands setOsmCoverageActive in cityMap.js.
  const fn = /** @type {any} */ (cityMap).setOsmCoverageActive;
  if (typeof fn === 'function') fn(active);
}
bus.on(EVT.OSM_READY, () => decideOsmCoverage(true));
/* ONE-WAY TIER-2 DEADLINE LATCH: data lost the race — flip coverage back to
 * procedural permanently (failure-path determinism caveat, documented).
 * INTEGRATION FIX (lead): gated on the RUN states — the latch protocol is
 * "the player reached tier 2 mid-run before the data" (~80 s of slack). A
 * boot-time ?at=/?r= dev teleport at r >= 0.5 emits TIER_UP synchronously
 * during TITLE (devTeleport's forced maybeTierUp), microseconds after the
 * fetch kicked — without this guard every tier>=2 dev start aborts OSM
 * before the local shards can possibly arrive, making the binding browser
 * gates (street/marunouchi/ueno with real fill) structurally impossible.
 * Title-time loads finish before play; the dev-start band-3 window is
 * served by OSM_READY -> setOsmCoverageActive(true) exactly as in a normal
 * run. The ?osmdelay=120000 deadline race (start small, PLAY through tier
 * 2) still latches via this handler. */
bus.on(EVT.TIER_UP, (p) => {
  if (state === GameState.TITLE) return; // boot/dev-start TIER_UP — not the race
  if (p.tierIndex >= 2 && !osmWorld.ready && !osmWorld.failed) {
    osmWorld.abortAndFail();
    decideOsmCoverage(false);
  }
});
/* Kick the shard fetch during the title screen (OsmWorld emits OSM_READY
 * after decode or latches failed internally; #osm-progress is its DOM). */
osmWorld.load(OSM_BASE_URL);

/* v4 (Stream C rim): the sky-tinted rim follows the tier palette — snap on
 * every TIER_UP crossfade start (any sky-ish hex works per design); the
 * immediate-palette sites (boot, resetWorld, devTeleport, ?r= dev start)
 * call setRimTint alongside env.setTierPaletteImmediate below. */
bus.on(EVT.TIER_UP, (p) => setRimTint(TIERS[p.tierIndex].skyTop));
setRimTint(TIERS[scaleMgr.tierIndex].skyTop); // boot palette (tier 0)

/* Absorb (Stream C): stamps AbsorbEvent.archetypeCode/collectibleId (via
 * curated.collectibleIdFor) BEFORE store.free. Emits only — construction
 * after curated does not affect the ABSORB dispatch order. */
const absorb = new Absorb(bus, scaleMgr, CATALOG, curated);
const ball = new Ball(renderer.scene, geos, bus);

/**
 * 'knockOff' (hard bonk): eject the newest stuck objects from the render
 * ball and re-inject them as re-absorbable world instances. The returned
 * records are REUSED — consumed synchronously here, never retained.
 *
 * REGISTERED BEFORE Effects/Sfx construct (subscription order = dispatch
 * order) so this handler runs first and can write the ACTUAL ejected count
 * back into the payload — effects burst sizing and the knock sfx then see
 * what really left the ball, not the pre-roll from absorb.js.
 * @param {import('./types.js').KnockOffEvent} p Reused payload.
 */
bus.on(EVT.KNOCK_OFF, (p) => {
  const records = ball.knockOff(p.count, ballPhys.state);
  for (let i = 0; i < records.length; i++) spawner.reinject(records[i]);
  p.count = records.length; // honesty: downstream handlers see the actual count
});

const input = new Input(window);
// v3 cameraRig injection {clampBoom, interior01}: interior camera profile +
// wall boom clamp (CityTerrain). NOTE updateIdle (title orbit) does NOT
// clamp — revisit here if the title shot ever clips the shop walls.
const cameraRig = new CameraRig(renderer.camera, bus, {
  clampBoom: terrain.clampCameraBoom.bind(terrain),
  interior01: terrain.interiorAt01.bind(terrain),
});

/* ------------------------------------------------------------------ */
/* BINDING ABSORB subscription order (v2 contract): spawner ->          */
/* main attach-handler -> runStats -> sfx/effects/hud. The Spawner      */
/* constructor (above) subscribes FIRST — its handler is bookkeeping    */
/* only (consumed bitmask / slotGen / rare-list) and MUST NOT mutate    */
/* instanceSlot/archetype/position fields, which the attach-handler     */
/* below reads intact. The attach-handler is subscribed HERE, before    */
/* any cosmetic consumer constructs (dispatch order = subscription      */
/* order).                                                              */
/* ------------------------------------------------------------------ */

/** Module scratch for instanceColor -> hex readback (linear -> sRGB). */
const SCRATCH_COLOR = new THREE.Color();

/**
 * 'absorb' (emitted by absorb.js BEFORE store.free): free the world instance
 * slot and hand the object to the render ball's attach animation, carrying
 * the instance tint along.
 * @param {import('./types.js').AbsorbEvent} p Reused payload (read-only).
 */
bus.on(EVT.ABSORB, (p) => {
  const i = p.objIndex;
  const slot = store.instanceSlot[i];
  const code = store.archetype[i];
  let colorHex = -1;
  if (code < EXTRA_CODE_BASE) {
    const pool = POOL_BY_CODE[code];
    if (pool !== undefined && slot >= 0) {
      const arr = pool.mesh.instanceColor.array;
      // instanceColor stores linear-sRGB floats (setColor used Color.setHex).
      SCRATCH_COLOR.setRGB(arr[slot * 3], arr[slot * 3 + 1], arr[slot * 3 + 2]);
      colorHex = SCRATCH_COLOR.getHex();
      pool.free(slot);
    }
  } else {
    // EXTRA (70..92): the render slot is EXCLUSIVELY curated-owned — freed
    // by curated's deferred cleanup, never here. Read the tint only.
    const k = extraClassIndexForCode(code);
    const pool = k >= 0 ? extraPools[k] : null;
    if (pool !== null && slot >= 0) colorHex = pool.getColorHex(slot);
  }
  ball.attachStuck(i, store, ballPhys.state, colorHex);
  // v3 slot-steal convention (load-bearing): mark the world instance stolen.
  // Runs AFTER curated's ABSORB handler in the frozen subscription order.
  store.instanceSlot[i] = -1;
});

/* v2 mute ownership: read the persisted flag BEFORE constructing audio so
 * Bgm/Sfx apply it inside their lazy context/master-gain creation path. */
let initialMuted = false;
try {
  initialMuted = localStorage.getItem(LS_MUTE_KEY) === '1';
} catch (_) {
  /* private mode / blocked storage — default unmuted */
}

/* RunStats (Stream D) constructs BEFORE Collection (frozen ABSORB order:
 * ... -> runStats -> collection -> sfx/effects/hud); the collection ref for
 * GoalEvent.collectFound is injected right after via setCollection. */
const runStats = new RunStats(bus, scaleMgr, worldSeed, null);
const collection = new Collection(bus);
runStats.setCollection(collection);
const effects = new Effects(renderer.scene, bus);
const sfx = new Sfx(bus, initialMuted);
const bgm = new Bgm(bus, initialMuted);
const hud = new Hud(bus, collection); // collection = collect-popup thumbnails
const screens = new Screens(bus, worldSeed, collection); // result grid + X text

/* v3 finale chain: SkytreeView (Stream A, replaces v2 MoonView) + backdrop. */
const skytree = new SkytreeView(renderer.scene, scaleMgr);
const finale = new Finale(bus, scaleMgr, skytree, env, cameraRig, ball, renderer.camera);
finale.setEffects(effects);
/* v5 space-earth ending: glowing Earth + star dome (sky element, fog:false,
 * +2 draws finale-only — ledger worst 70/72). finale.reset() owns hide(). */
const earthView = new EarthView(renderer.scene);
finale.setEarthView(earthView);
/* v5 opening onboarding: parts-trail guide (EVT.GOAL_GUIDE kind:'parts').
 * Constructed AFTER the finale (state gate injected); updated at frame-order
 * step 4.6 below; resetWorld owns reset() (plus its GAME_START self-rearm). */
const onboarding = new Onboarding(bus, renderer.camera, scaleMgr, finale);
effects.setRareProvider(spawner.forEachAliveRare.bind(spawner));
effects.setCollectibleProvider(curated.forEachAliveCollectible.bind(curated));
const backdrop = new Backdrop(renderer.scene, worldSeed);

/* ---- v3 real->sim origin bridge (Donack map-edge hint) --------------- */
/* Accumulates the floating-origin shift exactly like curated/spawner so
 * REAL meters = (sim + origin) * worldScale. Zero per-frame allocation:
 * the provider returns a reused scratch object. */
let simOriginX = 0;
let simOriginZ = 0;
bus.on(EVT.RESCALE, (p) => {
  simOriginX *= p.S;
  simOriginZ *= p.S;
});
bus.on(EVT.REBASE, (p) => {
  simOriginX += p.sx;
  simOriginZ += p.sz;
});
const BALL_REAL_SCRATCH = { x: 0, z: 0 };
/** @returns {{x: number, z: number}} Ball position in REAL meters (reused). */
function getBallPosReal() {
  const ws = scaleMgr.worldScale;
  BALL_REAL_SCRATCH.x = (ballPhys.state.pos.x + simOriginX) * ws;
  BALL_REAL_SCRATCH.z = (ballPhys.state.pos.z + simOriginZ) * ws;
  return BALL_REAL_SCRATCH;
}

/* Donack (Stream E): persisted OFF flag read BEFORE construction (like
 * LS_MUTE_KEY); screens is the single WRITER of LS_DONACK_KEY (toggle). */
let initialDonackOff = false;
try {
  initialDonackOff = localStorage.getItem(LS_DONACK_KEY) === '1';
} catch (_) {
  /* private mode / blocked storage — default ON */
}
const donack = new Donack(bus, initialDonackOff, getBallPosReal);
screens.setDonack(donack); // #donack-toggle -> donack.setOff(b)

/* Boot thumbnail pre-render during the title screen (12 collectible
 * archetypes -> 96px data-URL canvases on the main renderer, disposed
 * after; pre-approved lazy-at-first-COLLECT lever if title-tap-to-play
 * exceeds budget on low-end Android). */
collection.prerenderThumbnails(renderer, geos);

renderer.setAliveProvider(() => store.aliveCount);
renderer.onForceRescale = () => scaleMgr.forceRescale();

/* ------------------------------------------------------------------ */
/* Cross-module event glue (synchronous, zero retention)               */
/* (the ABSORB attach-handler lives above, before the cosmetic         */
/*  consumers — binding v2 subscription order)                         */
/* ------------------------------------------------------------------ */

/**
 * 'rescale' (emitted synchronously inside ScaleManager._applyRescale, after
 * BallState/store/pools/camera/env were scaled): cover the two hooks
 * ScaleManager has no reference to.
 * @param {import('./types.js').RescaleEvent} p Reused payload (read-only).
 */
bus.on(EVT.RESCALE, (p) => {
  ballPhys.rescaleSpring(p.S); // hidden ground y-spring (BallState already scaled)
  ball.rescaleState(p.S); // ballGroup.scale *= S + stuck-record radii
});

/* v2 mute ownership — main is the SINGLE owner. */
/** @type {boolean} Current mute state (persisted to LS_MUTE_KEY). */
let muted = initialMuted;

/**
 * Apply a mute state everywhere: both audio modules, persistence, and the
 * MUTE_CHANGED broadcast (hud icon).
 * @param {boolean} m New mute state.
 */
function setMutedAll(m) {
  muted = m;
  bgm.setMuted(m);
  sfx.setMuted(m);
  try {
    localStorage.setItem(LS_MUTE_KEY, m ? '1' : '0');
  } catch (_) {
    /* persistence is best-effort */
  }
  PAYLOADS.muteChanged.muted = m;
  bus.emit(EVT.MUTE_CHANGED, PAYLOADS.muteChanged);
}
bus.on(EVT.MUTE_REQUEST, () => setMutedAll(!muted)); // hud button
// Sync the HUD icon with the persisted state at boot (hud only updates the
// icon on the MUTE_CHANGED event; no toggle happens here).
setMutedAll(initialMuted);

/* ------------------------------------------------------------------ */
/* World reset / start-radius helpers                                  */
/* ------------------------------------------------------------------ */

/**
 * Starting sim radius: SIM_RADIUS_MIN normally; the dev `?r=` key maps the
 * requested true radius through the CURRENT worldScale — if it lands above
 * SIM_RADIUS_MAX, ScaleManager applies one rescale per frame until the band
 * is reached (the spawner tracks each via the 'rescale' event).
 * @returns {number} Sim radius for ballPhys.reset().
 */
function startRadiusSim() {
  if (startRadiusM === null) return SIM_RADIUS_MIN;
  return startRadiusM / scaleMgr.worldScale;
}

/**
 * Full deterministic world reset (boot + game:reset). Order matters:
 * spawner first (it owns chunk records pointing into the store), then
 * sim/render stores, then ScaleManager (worldScale must be fresh before the
 * `?r=` radius mapping), then the synchronous start-area preload.
 */
function resetWorld() {
  spawner.reset();
  store.reset();
  for (let i = 0; i < poolList.length; i++) poolList[i].reset();
  absorb.reset();
  scaleMgr.reset();
  // Re-band + re-cell the hashes from the fresh tier/scale (empty store —
  // rebuild doubles as clear and restores each band's cell size).
  for (let i = 0; i < hashes.length; i++) {
    const band = scaleMgr.tierIndex - 1 + i;
    hashes[i].rebuild(store, band, scaleMgr.bandCellSizeCur(band));
  }
  ball.reset();
  ballPhys.reset(startRadiusSim());
  // v3 (RESET OWNERSHIP, frozen): finale + runStats + curated + collection
  // (+ terrain) reset here; cameraRig / env / backdrop / hud / donack
  // self-reset via the GAME_RESET / GAME_START events.
  finale.reset();
  runStats.reset();
  terrain.reset(); // re-arms the shop terrain release latch (after scaleMgr.reset)
  curated.reset(); // frees curated slots + consumed bitmask
  osmSpawner.reset(); // v4 (BINDING: after curated.reset) — frees OSM slots +
  // consumed bitmasks; the per-SESSION coverage latch is NOT re-armed here
  collection.resetRun(); // clears foundThisRun; the album mask persists
  onboarding.reset(); // v5: rearm the opening parts guide (earthView needs no
  // entry here — finale.reset() above already calls earthView.hide())
  setRimTint(TIERS[0].skyTop); // v4 rim — env self-resets its palette to tier 0
  simOriginX = 0; // real->sim bridge follows the fresh origin/scale
  simOriginZ = 0;
  spawner.preloadStartArea(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim);
  // Curated preload mirrors the chunk preload: the title orbit shows the
  // authored shop interior and play never starts mid-materialization.
  curated.preload(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim);
}

/* ------------------------------------------------------------------ */
/* State transitions (driven by bus events from ui/screens.js)         */
/* ------------------------------------------------------------------ */

bus.on(EVT.GAME_START, onGameStart);
bus.on(EVT.GAME_RESET, onGameReset);
bus.on(EVT.GAME_WIN, onGameWin);

/* v2 cinematic skip: any pointer/key input during the FINALE fast-forwards
   the post-contact cinematic (finale.skipCinematic is a pre-contact no-op).
   Listeners are passive observers — input.js still owns gameplay input. */
function onFinaleSkipInput() {
  if (state === GameState.FINALE) finale.skipCinematic();
}
window.addEventListener('pointerdown', onFinaleSkipInput);
window.addEventListener('keydown', onFinaleSkipInput);

/** Title -> Playing. */
function onGameStart() {
  if (state === GameState.PLAYING) return;
  state = GameState.PLAYING;
  // v4: play begins ALREADY at tier >= 2 (dev ?at=/?r= start) — band 3/4
  // matter immediately, so the coverage decision deadline is NOW (one-way,
  // same latch as the mid-run TIER_UP race; normally a no-op because the
  // local shards decode during the title screen).
  if (scaleMgr.tierIndex >= 2 && !osmWorld.ready && !osmWorld.failed) {
    osmWorld.abortAndFail();
    decideOsmCoverage(false);
  }
  accumulator = 0;
  lastTime = performance.now(); // no huge first-frame dt
  input.setTouchUiEnabled(true); // re-enable after a finale lockout
}
/* Finale cinematic: a skip-tap must not spawn the joystick ring over the
   cinema or keep feeding steering intent (intent is zeroed anyway, but the
   128px ring at z-index 15 would sit on top of the shot). */
bus.on(EVT.GOAL_CONTACT, () => input.setTouchUiEnabled(false));

/** Win -> Title (full world reset). */
function onGameReset() {
  state = GameState.TITLE;
  accumulator = 0;
  resetWorld();
}

/**
 * Finale 'done' -> Win. v1: GAME_WIN comes from ScaleManager's WIN_RADIUS_M
 * latch. v2 (after Stream A removes that latch): main.js is the SOLE emitter
 * — see the V2-WIRE block at frame() step 4.5.
 */
function onGameWin() {
  state = GameState.WIN;
  sfx.setRollIntensity(0);
}

/* ------------------------------------------------------------------ */
/* v3 dev teleport (?at=name[&r=meters] / window.devTeleport in dev)    */
/* ------------------------------------------------------------------ */

/* DEV_STARTS imported from config/cityMap.js (frozen spec numbers). */

/**
 * Dev teleport (docs/DESIGN-V3.md §インターフェース, integrator-owned):
 * snaps worldScale to (START_RADIUS_M/SIM_RADIUS_MIN) * 5^k with the minimal
 * k that lands r/ws inside the sim band [0.5, 2.5), poses the ball from
 * DEV_STARTS (positions are REAL METERS — origin = ball start), then resyncs
 * the streaming machinery: spawner.onTeleport() (Stream B), curated
 * forceScan, tier/hash resync, one forced maybeRebase pass, palette snap and
 * a start-area preload. Terrain release re-evaluates itself on the next
 * fixed step (CityTerrain owns the SHOP_TERRAIN_RELEASE_M latch).
 * @param {string} name DEV_STARTS key (?at=).
 * @param {number} [rOverrideM] Optional true-radius override (?r=).
 * @returns {boolean} True if the teleport ran.
 */
function devTeleport(name, rOverrideM = 0) {
  const d = DEV_STARTS[name];
  if (d === undefined) return false;
  return devTeleportTo(d.x, d.z, rOverrideM > 0 ? rOverrideM : d.r);
}

/**
 * Arbitrary-coordinate dev teleport (the body of devTeleport; v4 also
 * exposed DEV-only as window.__v4park for the BINDING coverage-boundary
 * park test — DESIGN-V4 ゲームプレイ統合 admission check, 300-frame
 * alive<4096 assert at r~4/r~40 parked ON the coverage boundary).
 * @param {number} xRealM Real-meter X (origin = ball start).
 * @param {number} zRealM Real-meter Z.
 * @param {number} rM True ball radius (real meters).
 * @returns {boolean} True if the teleport ran.
 */
function devTeleportTo(xRealM, zRealM, rM) {
  // Finale guard: post-contact the finale owns the run (ball.pos writes,
  // camera, frozen streaming). Teleporting would re-arm the Skytree base
  // collider against the MERGE writes and permanently stall streaming
  // (step 3 stays gated on finale.inputLocked). Refuse — GAME_RESET first.
  if (finale.inputLocked) {
    console.warn('[devTeleport] refused: finale owns the run (reset first)');
    return false;
  }
  runStats.markDevRun(); // dev starts never persist bests / show NEW RECORD
  const d = { x: xRealM, z: zRealM };
  let ws = START_RADIUS_M / SIM_RADIUS_MIN; // boot worldScale (0.04)
  while (rM / ws >= SIM_RADIUS_MAX) ws *= 5; // minimal k: r/ws in [0.5, 2.5)
  scaleMgr.worldScale = ws;
  scaleMgr.rescaleCount = Math.round(Math.log(ws / (START_RADIUS_M / SIM_RADIUS_MIN)) / Math.log(5));
  scaleMgr.tierIndex = 0; // re-derived (and hashes rebuilt) by maybeTierUp below
  ballPhys.reset(rM / ws);
  ballPhys.state.pos.set(d.x / ws, rM / ws, d.z / ws);
  simOriginX = 0; // bridge re-anchors with the pos = real/ws mapping above
  simOriginZ = 0;
  // Terrain release re-eval (spec): reset re-anchors origin + mesh scale to
  // the snapped worldScale and re-arms the release latch — collide() then
  // re-evaluates SHOP_TERRAIN_RELEASE_M on the next fixed step.
  terrain.reset();
  spawner.onTeleport(); // resyncs the chunk scale exponent (scaleMgr injected)
  curated.forceScan(); // deactivate stale actives + full pass on next update()
  osmSpawner.onTeleport(); // v4: resync OSM origin/scale to the snapped pose
  osmSpawner.forceScan(); // v4: deactivate stale actives + full ring pass
  skytree.onTeleport(); // drop the stale rebase shift (no REBASE event fires here)
  scaleMgr.maybeTierUp(ballPhys.state, store, hashes, instances, cameraRig, env);
  scaleMgr.maybeRebase(ballPhys.state, store, hashes, instances, cameraRig, env, spawner); // one forced pass
  env.setTierPaletteImmediate(scaleMgr.tierIndex);
  setRimTint(TIERS[scaleMgr.tierIndex].skyTop); // v4 rim follows the palette snap
  backdrop.setProfileImmediate(scaleMgr.tierIndex);
  spawner.preloadStartArea(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim);
  // forceScan() above only SCHEDULED the full pass — run it now with the
  // fresh pose so a teleport from the title screen materializes immediately.
  curated.preload(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim);
  return true;
}
if (import.meta.env && import.meta.env.DEV) {
  /** @type {any} */ (window).devTeleport = devTeleport; // console access
  /** @type {any} */ (window).__v4park = devTeleportTo; // coverage-boundary park test
  // DEV-only integration probe (e2e harness reads sim state; never in prod).
  /** @type {any} */ (window).__v3dbg = {
    ballPhys, scaleMgr, curated, terrain, spawner, store, finale, collection,
    getBallPosReal,
    osmWorld, osmSpawner, osmGround, osmPools, // v4 (integrated)
    onboarding, earthView, // v5 (integrated)
  };
}

/* Populate the start area while the title screen is up (a few ms, once).
   Mirrors resetWorld(): the dev ?at=/?r= keys are applied BEFORE the preload
   so the preloaded world matches the actual start state, and the environment
   palette lands directly on the requested tier (per Environment's contract)
   instead of crossfading through every TIER_UP on the first playing frame. */
let devAtName = null;
try {
  devAtName = new URLSearchParams(window.location.search).get('at');
} catch (_) {
  /* exotic environments without URLSearchParams — dev key only */
}
if (devAtName === null || !devTeleport(devAtName, startRadiusM !== null ? startRadiusM : 0)) {
  if (startRadiusM !== null) {
    runStats.markDevRun(); // ?r= starts never persist bests / show NEW RECORD
    ballPhys.reset(startRadiusSim());
    let devTier = 0;
    while (devTier < TIERS.length - 1 && startRadiusM >= TIERS[devTier + 1].enterTrueRadius) {
      devTier++;
    }
    env.setTierPaletteImmediate(devTier);
    setRimTint(TIERS[devTier].skyTop); // v4 rim follows the palette snap
    backdrop.setProfileImmediate(devTier); // skip the profile crossfade too
  }
  spawner.preloadStartArea(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim);
  curated.preload(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim);
}

/* ------------------------------------------------------------------ */
/* Fixed-timestep 60Hz accumulator loop                                */
/* ------------------------------------------------------------------ */

/** @type {number} Unsimulated time (s). */
let accumulator = 0;
/** @type {number} Last RAF timestamp (ms). */
let lastTime = performance.now();

/**
 * Per-frame driver. THE CALL ORDER BELOW IS THE BINDING v2 CONTRACT
 * (docs/DESIGN-V2.md §インターフェース "BINDING frame order") — do not reorder.
 * @param {number} now RAF timestamp (ms).
 */
function frame(now) {
  requestAnimationFrame(frame);

  let frameDt = (now - lastTime) / 1000;
  lastTime = now;
  if (frameDt > MAX_FRAME_DT) frameDt = MAX_FRAME_DT; // tab-switch guard

  // v2: FINALE keeps simulating (gated below) — only TITLE/WIN idle-render.
  if (state !== GameState.PLAYING && state !== GameState.FINALE) {
    // Title/win: slow idle orbit over the preloaded world, render only.
    if (input.takeMuteToggle()) setMutedAll(!muted); // 'M' works on title/result too
    cameraRig.updateIdle(frameDt);
    env.update(frameDt, ballPhys.state);
    backdrop.update(frameDt, ballPhys.state, renderer.camera);
    ball.update(frameDt, ballPhys.state);
    effects.update(frameDt, ballPhys.state);
    updateAndFlushPools(poolList, frameDt);
    renderer.render();
    return;
  }

  /* 1) Read input once per render frame. v2: from CONTACT the finale owns  */
  /*    the run — zero the intent so physics coasts (nothing fights the     */
  /*    MERGE ball.pos writes).                                             */
  const intent = input.read();
  if (finale.inputLocked) {
    intent.x = 0;
    intent.y = 0;
    intent.boost = false;
    intent.dash = false;
  }
  if (input.takeMuteToggle()) setMutedAll(!muted); // 'M' keyup edge

  /* 2) Fixed-step physics: cap 3 substeps, drop excess debt (no tunneling, */
  /*    no spiral of death). v2: absorb gated off post-contact (growth      */
  /*    frozen => no rescale can fire during the cinematic).                */
  accumulator += frameDt;
  let steps = 0;
  while (accumulator >= FIXED_DT && steps < MAX_SUBSTEPS) {
    // +PI bridges ballPhysics' yaw convention to cameraRig's (see header).
    ballPhys.step(FIXED_DT, intent, cameraRig.yaw + Math.PI);
    if (!finale.inputLocked) absorb.resolve(ballPhys.state, hashes, store);
    accumulator -= FIXED_DT;
    steps++;
  }
  if (steps === MAX_SUBSTEPS && accumulator >= FIXED_DT) {
    accumulator = accumulator % FIXED_DT; // drop unpayable debt
  }

  /* 3) Amortized world streaming: chunk diff + spawn/despawn queues        */
  /*    (<=64 each) + sub-pixel sweep + knock-off flights, then the curated  */
  /*    round-robin (<=64 placements: activation vs the floored load radius, */
  /*    dynamic re-banding, deferred ABSORB bookkeeping), then the OSM       */
  /*    round-robin (<=OSM_UPDATE_BUDGET, nearest-first, hard admission      */
  /*    check). Curated AFTER spawner; osmSpawner AFTER curated, same gate   */
  /*    — BINDING v4 order. Frozen post-contact.                             */
  if (!finale.inputLocked) {
    spawner.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
    curated.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
    osmSpawner.update(ballPhys.state.pos, scaleMgr.tierIndex, ballPhys.state.radiusSim, frameDt);
  }

  /* 4) BETWEEN update and render — pixel-identity transforms:              */
  /*    one-frame similarity rescale (tier-up) and floating-origin rebase.  */
  /*    v2: maybeTierUp keeps running (harmless); maybeRebase is gated —    */
  /*    a rebase mid-cinematic is pointless and positions stay well inside  */
  /*    Float32 precision for the ~8.7s post-contact window.                */
  scaleMgr.maybeTierUp(ballPhys.state, store, hashes, instances, cameraRig, env);
  if (!finale.inputLocked) {
    scaleMgr.maybeRebase(ballPhys.state, store, hashes, instances, cameraRig, env, spawner);
  }

  /* 4.5) FINALE (game/finale.js): v3 = approach/contact vs SkytreeView     */
  /*      (Stream A re-theme; the v2 moon machinery runs until it lands),   */
  /*      render-frame contact test, MERGE ball.pos writes, cinematic       */
  /*      camera via cameraRig.cinematicUpdate.                             */
  finale.update(frameDt, ballPhys.state);
  if (state === GameState.PLAYING && finale.inputLocked) {
    state = GameState.FINALE; // PLAYING -> FINALE on first contact frame
  }
  /* main is the SOLE game:win emitter in v2 (ScaleManager's latch is gone). */
  if (state === GameState.FINALE && finale.state === 'done') {
    PAYLOADS.gameWin.trueRadius = ballPhys.state.radiusSim * scaleMgr.worldScale;
    PAYLOADS.gameWin.seed = worldSeed;
    bus.emit(EVT.GAME_WIN, PAYLOADS.gameWin); // -> onGameWin (state = WIN)
  }

  /* 4.6) v5 opening parts guide (game/onboarding.js) — AFTER finale.update  */
  /*      so its finale-state gate reads THIS frame's truth (no same-frame   */
  /*      GOAL_GUIDE collision with the finale by construction).             */
  onboarding.update(frameDt);

  /* 5) Ball visuals: attach animations, staggered burial cull.             */
  ball.update(frameDt, ballPhys.state);

  /* 6) Camera spring + environment + effects (all AFTER ScaleManager).     */
  /*    v2: from CONTACT the finale owns the camera (cinematicUpdate is     */
  /*    called inside finale.update at 4.5) — skip the gameplay spring.     */
  if (!finale.cameraOwned) {
    cameraRig.update(frameDt, ballPhys.state, input.takeYawDrag());
  }
  env.update(frameDt, ballPhys.state);
  // v4 (step 6, BINDING): OSM ground tile streaming AFTER env (fresh fog).
  // ballRadiusSim caps the ground lift/offsets so the road layer can never
  // rise above a tiny ball (the invisible-opening-stage hotfix).
  osmGround.update(frameDt, ballPhys.state.pos, env.fogFarSim, ballPhys.state.radiusSim);
  backdrop.update(frameDt, ballPhys.state, renderer.camera);
  effects.update(frameDt, ballPhys.state);

  /* Roll-loop audio follows ball speed (silent until first user gesture). */
  const vel = ballPhys.state.vel;
  const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
  sfx.setRollIntensity(speed / (SPEED_K * ballPhys.state.radiusSim));

  /* 6.5) v2 sim clock (game/runStats.js): deterministic SIM time — the     */
  /*      official rank clock. Internally frozen after GOAL_CONTACT.        */
  runStats.addSimTime(steps * FIXED_DT);

  /* 7) Flush instance buffers (one needsUpdate per mesh, updateRanges)     */
  /*    then render. HUD is event-driven, not called here. v3: the goal     */
  /*    lives in finale.js (contact arms at GOAL_RADIUS_M; Skytree finale).  */
  updateAndFlushPools(poolList, frameDt);
  renderer.render();
}

requestAnimationFrame(frame);

if (import.meta.env && import.meta.env.DEV) {
  console.log(
    `[fable-katamari] booted — seed=${worldSeed} goal@${GOAL_RADIUS_M}m ` +
      `alive=${store.aliveCount} pools=${poolList.length} hud=${hud !== null} screens=${screens !== null}`
  );
}
