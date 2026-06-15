# DESIGN — Fable Katamari (確定アーキテクチャ)

> 生成元: ultracode 設計ワークフロー `katamari-design`（3視点並列提案 → 審査統合）。
> 機械可読版: `docs/design/DESIGN.json` / 元提案: `docs/design/proposals.json`

## 概要

Synthesis: Proposal 1 (PERFORMANCE-FIRST) is the base — its sim-unit band + one-frame similarity rescale, SoA object store, flat-array spatial hash, per-archetype InstancedMesh rendering, write-once ball-parented stuck instances, and deterministic amortized chunk spawning are all retained. Onto that base we graft Proposal 2's governing design law — tierIndex drives ONLY cosmetics and spawn-content selection; absorbability, camera, fog, speed, and despawn are continuous functions of ball radius, so nothing CAN pop at a threshold — plus its entire feel layer (attach animation, spring camera with look-ahead, FOV kick celebration, knock-off bounce, WebAudio-synthesized sfx, tuning.js, dynamic-resolution governor). From Proposal 3 we take the unifying simplifications: zero-scale matrices instead of slot compaction, burial culling as the stuck-object cost limiter (replacing P2's crust baking entirely), per-live-tier spatial hash instances, tier hysteresis, and dev-mode testability keys (start-at-radius param, forced-rescale screenshot diff). Stack: Three.js r177 (pinned) + Vite, pure static deploy to Cloudflare Pages, zero runtime assets (all geometry/textures/audio procedural), ~28 small ES modules with JSDoc types, one tiny event bus. Budgets: <=55 draw calls (typical ~38), <=600k tris, 0 B/frame steady-state GC garbage, 60fps on integrated GPUs, ~150 kB gzipped JS. Ball: 5 cm -> 500 m win condition across 6 tiers (Desk/Room/Street/Town/City/Skyline).

## スケールシステム（シームレス遷移 + 浮動小数点精度）

TWO NUMBER SYSTEMS. (a) SIM UNITS: all physics, positions, and render matrices. Ball simRadius lives in [0.5, 2.5]; all world coordinates stay within ~+-2048 sim units forever -> full Float32 mantissa precision at every scale, no jitter. (b) REAL METERS for display only: trueRadius = simRadius * worldScale, where worldScale is a plain JS double owned by ScaleManager. TIER TABLE (true ball radius, x5/tier): T0 Desk 5cm-25cm, T1 Room 25cm-1.25m, T2 Street 1.25m-6m, T3 Town 6m-30m, T4 City 30m-150m, T5 Skyline 150m-750m, win banner at 500m. RESCALE (= tier-up, P1's algorithm verbatim): when simRadius >= 2.5, in ONE frame between physics update and render: S=0.2; worldScale /= S; scale ball pos/radius/vel by S (angular velocity is scale-free); tight SoA loop scales px/py/pz/radius for ~4000 alive objects (<0.3ms); ballGroup.scale *= S (stuck instances and ball core ride along for free, ball-local); rebuild the three per-tier spatial hashes; batch-rewrite instance matrices with one needsUpdate per mesh; scale fog/light/blob-shadow params; camera rig spring state (position + look offsets, stored in sim space) is multiplied by S so the camera pose remains a pure function of scaled state. Because this is a uniform similarity transform and every visual quantity is radius-proportional, the rescale frame renders pixel-identical to the no-rescale frame — verified in dev by a debug key that forces a rescale and diffs a readback screenshot (P2/P3's testability graft). SEAMLESSNESS LAW (P2, structural): absorbability (objRadius <= 0.65 * ballRadius), camera distance (6.5r) and height (3.2r), fog near/far (14r/55r), speed caps, and sub-pixel despawn (objDiameter < 0.04 * ballRadius -> 0.6s scale-fade) are all CONTINUOUS in radius and never reference tierIndex. tierIndex (derived from trueRadius, +-10% hysteresis from P3 even though shrinking can't happen — guards float edge cases) drives ONLY: spawner content bands, fog/sky palette 2s crossfade, HUD label/unit, and the CELEBRATION (FOV 60->68->60 over 0.8s, camera spring loosened for an overshoot breath, sparkle ring burst, 3-note WebAudio arpeggio, HUD banner + odometer unit roll). POPULATION: three tiers live at all times — N-1 leftovers (continuously absorbed or sub-pixel-faded, never mass-deleted), N targets, N+1 scenery/obstacles that become targets next tier; at 70% of the tier threshold the spawner pre-warms N+2 chunks beyond the fog wall (amortized <=64 spawns/frame over ~2s, invisible). Nothing spawns, despawns, or unlocks AT the threshold; the rescale is invisible; the celebration is garnish that gameplay never branches on. FLOATING ORIGIN (secondary guard, P1+P3): if |ball.pos| > 1500 sim units, subtract integer-snapped ball.pos from everything in the same between-update-and-render slot; chunk keys and consumed bitmasks are kept in origin-unshifted global coordinates so determinism survives; exercised by a dev teleport key so it can't rot.

## 物理

CUSTOM ARCADE PHYSICS, no library — unanimous across all three proposals and correct: the only dynamic body is one kinematic sphere on the analytic plane y=0; everything else is a static bounding sphere until absorbed. rapier3d (~1.7MB wasm, async init, hates teleport-scaling all bodies at rescale) and cannon-es (slow JS solver past ~1k bodies, fights arcade tuning) solve problems this game does not have. ~400 LOC, 0 dependency bytes, deterministic with the seeded PRNG. TIMESTEP: fixed 60Hz with accumulator, cap 3 substeps (P1/P2; rejects P3's variable dt and its tunneling patch). BALL: accel = 22*simRadius along camera-relative input, speedCap = 8.5*simRadius, friction vel *= 0.92^(dt*60) — radius-proportional so screen-space feel is identical across tiers and rescales. Rolling without slipping (non-negotiable for feel): axis = up x v-hat, angle = |v|*dt/simRadius, quat = axisAngle o quat, scratch quaternion, zero allocation. Ground: center y springs to simRadius with slight overshoot (P2's absorb 'pop'). Mass feel: each absorb applies a transient accel *0.97 sluggishness recovering over 1.5s. BROADPHASE: three SpatialHash instances, one per live tier band (P3's structure), each P1's flat-typed-array implementation — cellStart Int32Array via counting sort, cellEntries Int32Array, 2D hash key ((xi*73856093)^(zi*19349663))&16383, tombstone removes with opportunistic rebuild at >25% tombstones, full rebuild at tier-up (mandatory then anyway). Per-tier hashes keep query reach tight despite the 25x size spread across live tiers. Objects are static: insert once at spawn, remove on absorb/despawn — zero per-frame maintenance. NARROWPHASE per frame: queryBall on all three hashes into a preallocated Int32 scratch (~9-25 cells, 5-40 candidates, microseconds); for each overlap: if objRadius <= 0.65*ballRadius -> ABSORB: newR = cbrt(R^3 + GROWTH_K * r^3), GROWTH_K ~0.45 in tuning.js (tuned so each tier takes 60-90s); trueRadius additionally slewed visually at <=1.5r/s (P3) so big meals swell instead of step; remove from store/hash, hand to ball.attachStuck, emit absorb. Else -> PUSHBACK: position-correct along contact normal, reflect normal velocity *0.35, tangential preserved; if impact speed > 0.7*speedCap emit bonk -> camera micro-shake (0.15*simRadius amp, 0.25s decay), synthesized clonk, and KNOCK-OFF: eject 1-3 newest stuck objects with a ballistic pop, re-entering the world as re-absorbable instances (P2/P3's signature Katamari beat, trivially possible only because physics is custom). GC: zero per-frame allocations — SoA store (px/py/pz/radius Float32Array(8192), archetype Uint16Array, tierOf/flags Uint8Array, instanceSlot Int32Array, free-list allocator), module-level scratch vectors/quats, reused event payloads.

## レンダリング

DRAW-CALL LEDGER (hard cap 55, typical ~38): 8 archetypes x 3 live tiers = 24 world InstancedMeshes + 8 stuck pools + 1 ball core + 1 ground + 1 sky dome + 1 blob shadow + ~3 effect meshes (sparkle ring, absorb-pop quads, speed lines — instanced, pooled). MATERIALS: exactly 3 — MeshLambertMaterial({vertexColors:true}) for all objects + ball, ShaderMaterial for ground (radius-scaled procedural grid so it reads at every tier) + sky gradient, MeshBasicMaterial(transparent) for the canvas-radial-gradient blob shadow. NO shadow maps — 1 hemisphere + 1 directional light; the blob shadow reads better at every scale and saves a full render pass. GEOMETRY: each archetype is one pre-merged composite of 2-6 low-seg primitives (<=350 tris) with colors baked as a vertex attribute, built once at boot by geometryFactory (~80ms during title screen). WORLD INSTANCES: InstancedPool per (archetype, tier), capacity 128-512, free-list slots; dead/hidden slots get a ZERO-SCALE matrix and count stays at high-water mark (P3 — simpler than P1's swap-compaction, degenerate tris are pre-raster rejected); all spawn/fade/despawn transitions animate per-instance matrix SCALE, never material opacity (one opaque shader program, no sorting); instanceMatrix uses DynamicDrawUsage + r177 updateRanges for partial uploads (P2 risk mitigation), needsUpdate at most once per mesh per frame, <=64 instance writes/frame. frustumCulled=false on all pools — culling is gameplay-driven: spawn ring bounds the live set and fog (near 14r / far 55r, inside the 80r spawn ring — invariant asserted in dev mode) hides both edges. STUCK OBJECTS — P1's mechanism with P2's money shot and P3's cull: (1) ATTACH ANIMATION: on absorb the object's world-pool slot lerps 0.15s to its ball-surface socket with ease-out and 1.15->1.0 squash while the ball y-spring pops, THEN transfers to a stuck pool. (2) STUCK POOLS: 8 InstancedMeshes (one per archetype family, 512 slots total ring buffer) parented to the ball Object3D; matrix written ONCE at attach in ball-local space: localPos = invQuat(ball) * dir * simRadius*0.92 (8% embedded), localQuat = invQuat * lookAlong(dir) * randomYaw. Per-frame cost of 500 stuck objects = the parent's one matrix multiply. Frozen absolute size is CORRECT: objects shrink relatively as you grow, sinking toward texture. (3) BURIAL CULL replaces crust baking: when attachRadiusSim + objHalfSim < 0.98 * currentSimRadius (fully under newer layers) OR relative size < 2% (sub-pixel), zero-scale and reclaim the slot — staggered over ~1s so a tier jump never molts visibly (P3 risk note). No runtime geometry merging anywhere -> no multi-ms bake spikes, no rescale/bake scheduling constraints. (4) BALL CORE: icosphere (3 subdiv) with vertex-shader noise displacement whose amplitude grows with total absorb count, base color lerping 10% toward each absorbed color — the ball permanently remembers its history as lumpy swirl, covering ring-buffer turnover. CAMERA (cameraRig.js, feel centerpiece): target = ballPos - moveDir*(6.5*simRadius) + up*(3.2*simRadius), look target = ballPos + vel*0.4 (look-ahead sells speed); both through critically-damped springs (stiffness ~6.0/4.5) whose LAG is the growth feedback — big absorbs make the world visibly recede over half a second; lazy yaw-follow with optional mouse-drag offset; FOV base 60, +kick on tierUp, +4 above 80% speed; micro-shake on bonk. Spring state lives in sim space and is rescaled by S at tier-up (preserves the identity-transform guarantee). RENDERER: antialias on, pixelRatio min(dpr, 1.5), powerPreference high-performance, dynamic-resolution governor (drop toward 1.0 if 3s rolling frame avg > 17ms — P2). Debug overlay (backquote): fps, renderer.info draw calls/tris, alive count, heap delta, force-rescale and start-at-radius dev keys.

## スポーン / カタログ

CATALOG: 48 archetypes (8 per tier x 6 tiers) in src/config/catalog.js, fully code-generated. Shape per entry: { id, tier, buildGeometry(rng) -> merged vertex-colored BufferGeometry (<=350 tris), radiusNominal (real m), radiusJitter (+-25%), spawnWeight, palette (4-6 instanceColor tints), yOffset, upright flag, collisionScale (P2's fudge for long/flat objects like benches/buses) }. Examples: T0 thumbtack/coin/die/eraser/paperclip/candy/battery/key; T2 bicycle/person/bench/mailbox/sign/dog/cart/hydrant; T3 car (2 boxes + 4 cylinder wheels)/truck/tree/kiosk/house/bus/fountain/shed; T5 skyscraper (stacked boxes, vertex-color window bands)/stadium/ferris wheel (torus+cylinders)/hill/bridge span. All 48 geometries built once at boot. PLACEMENT — deterministic chunk grid (P1): per-tier chunks of 32 sim units; chunk (cx, cz, tier) contents are a pure function of mulberry32(hash(worldSeed, cx, cz, tier)): N = tier.objectsPerChunk placements on a jittered sub-grid (Poisson-quality spacing, zero overlap tests), each with weighted archetype, jittered size, yaw, palette index. Same chunk always regenerates identically; absorbed objects are remembered in a per-chunk consumed bitmask (Map<chunkKey, Uint32Array>, keys in origin-unshifted global coords; bitmasks for tiers >=2 below current are forgotten — bounded memory, those objects are sub-pixel anyway). worldSeed from ?seed= or Date.now(), shown on win screen for shareable runs. BUDGETS (alive): tier N ~2000 (load radius 96 sim units, ~72/chunk), N+1 scenery ~600 (radius 140, 8/chunk), N-1 leftovers <=1200 and falling; total <=4096 alive in an 8192-capacity store. PER FRAME: compute ball chunk coords per live tier; diff wanted-vs-loaded chunk sets (~30 entries, churns only on chunk-boundary crossing); enqueue into ring queues; drain <=64 spawns + 64 despawns/frame, front-of-motion chunks first. Spawn-in materializes beyond the fog far plane (55r < 96-unit load radius — asserted); belt-and-suspenders 0.4s scale-up for any spawn that lands inside fog range. DESPAWN: ring exit -> 0.4s scale-fade -> free slot + hash remove; sub-pixel rule (objDiameter < 0.04*ballRadius, round-robin sweep of 200 objects/frame) drains old-tier leftovers continuously, per-object, so a tier change never causes a mass-deletion frame. TIER HANDOFF: at 70% of threshold, pre-warm N+2 chunks sparsely beyond fog; on tierIndex increment, N-2 chunks simply stop being wanted.

## ファイル構成

| パス | 責務 |
|---|---|
| `index.html` | Static shell: canvas mount, HUD/title/win DOM skeleton, loads /src/main.js as module. |
| `vite.config.js` | Vite config: base './', target es2022, single-chunk build for Cloudflare Pages; three pinned to exact r177 in package.json. |
| `public/_headers` | Cloudflare Pages immutable cache headers for hashed assets. |
| `src/main.js` | Bootstrap + fixed-timestep 60Hz accumulator loop + game state machine (title/playing/win); owns the per-frame call order; wires all modules via constructor injection + event bus. No game logic. |
| `src/types.js` | JSDoc typedefs for Tier, Archetype, BallState, Intent, StuckRecord, event payloads (no runtime code) — the parallel-work contract file. |
| `src/core/events.js` | Tiny pub/sub bus (on/off/emit) with REUSED payload objects — zero-allocation emit; the only cross-module channel besides injection. |
| `src/core/rng.js` | mulberry32 seeded PRNG + integer hash(seed, cx, cz, tier) for deterministic chunk seeding. |
| `src/core/pool.js` | Free-list index allocator and ring-buffer helpers over typed arrays. |
| `src/core/mathUtils.js` | Critically-damped spring, easing, damp(current,target,halflife,dt), formatLength(meters) -> mm/cm/m/km string, shared scratch Vector3/Quaternion/Matrix4 temps. |
| `src/config/tiers.js` | TIERS array (6 tiers: names, enterTrueRadius, cellSizeSim, loadRadiusSim, objectsPerChunk, archetypeIds, fog/sky palettes) + RESCALE_S=0.2 + dev-mode invariant asserts (fog < loadRadius - chunk). |
| `src/config/catalog.js` | 48 archetype definitions (8/tier): buildGeometry recipes, radii, jitter, weights, palettes, collisionScale, upright flags. |
| `src/config/tuning.js` | THE designer's file: every feel constant (ACCEL_K=22, SPEED_K=8.5, ABSORB_RATIO=0.65, GROWTH_K=0.45, camera 6.5/3.2, fog 14/55, FOV kick, spring stiffness, fade times, frame budgets, stuck cap 512, burial 0.98). |
| `src/world/objects.js` | ObjectStore: SoA typed arrays capacity 8192 (px/py/pz/radius F32, archetype U16, tierOf/flags U8, instanceSlot I32), alloc/free/forEachAlive, the batch rescale loop. |
| `src/world/spatialHash.js` | SpatialHash class on flat Int32Arrays (counting-sort rebuild, insert, tombstone remove, queryBall into scratch); instantiated 3x, one per live tier band. |
| `src/world/spawner.js` | Deterministic chunk placement, wanted-vs-loaded diffing, amortized spawn/despawn ring queues (<=64/frame), consumed bitmasks, sub-pixel despawn sweep, N+2 pre-warm, origin-shift re-keying. |
| `src/world/scaleManager.js` | worldScale double, tierIndex with hysteresis, one-frame similarity rescale orchestration (store/hashes/ball/camera-spring/instances/env), floating-origin rebase, trueRadius + formatSize, emits tierUp/rescale. |
| `src/physics/ballPhysics.js` | Ball kinematics: camera-relative accel/friction/speed cap (all *simRadius), rolling-without-slipping quaternion integration, ground y-spring with overshoot, transient sluggishness. |
| `src/physics/absorb.js` | Per-step hash queries (3 tiers), absorb-vs-pushback dispatch (0.65 rule + collisionScale), cbrt volume growth + visual radius slew, bounce response, bonk detection + knock-off ejection; emits absorb/bounce/knockOff. |
| `src/render/renderer.js` | WebGLRenderer setup, resize, pixelRatio cap 1.5, dynamic-resolution governor, debug overlay (fps/calls/tris/heap, force-rescale + ?r= dev keys). |
| `src/render/geometryFactory.js` | Builds all 48 merged vertex-colored composite geometries from catalog recipes once at boot via BufferGeometryUtils.mergeGeometries. |
| `src/render/instances.js` | InstancedPool per (archetype,tier): free-list slots, setTransform/setColor, zero-scale kill, scale-fade animator (interleaved cohorts), updateRanges partial uploads, batched needsUpdate, rewriteAll for rescale. |
| `src/render/ball.js` | Katamari group: noise-displaced icosphere core (lumpiness + color-swirl uniforms), 0.15s attach animation queue, 8 ball-parented stuck pools (512 ring), write-once ball-local socket math, staggered burial/sub-pixel cull, knock-off re-ejection. |
| `src/render/cameraRig.js` | Spring-damped follow camera: distance/height pure functions of simRadius, velocity look-ahead, lazy yaw + optional mouse offset, FOV kicks, bonk micro-shake; exposes rescaleState(S) hook for ScaleManager. |
| `src/render/environment.js` | Ground shader plane (radius-scaled procedural grid), sky gradient dome, fog (14r/55r) + tier palette crossfade, hemisphere + directional lights, blob shadow decal. |
| `src/render/effects.js` | Pooled instanced effects: absorb pop quads, tierUp sparkle ring, speed lines — all procedural, zero assets. |
| `src/input/input.js` | Keyboard (WASD/arrows) + optional mouse yaw + touch joystick -> normalized Intent {x, y, boost}; camera-relative mapping lives in physics, not here (keeps touch path rewrite-free). |
| `src/audio/sfx.js` | WebAudio-synthesized SFX: rising-pitch absorb combo blips, clonk, roll loop, tierUp arpeggio — zero audio assets; subscribes to bus only. |
| `src/ui/hud.js` | DOM HUD: size odometer with unit rollover animation, absorbed counter, tier banner, progress bar; event-subscribed, 10Hz throttled, textContent-diffed. |
| `src/ui/screens.js` | Title/win/restart overlays, seed display for shareable runs; emits game:start / game:reset. |

## モジュール間インターフェース

```js
// ALL types are JSDoc typedefs centralized in src/types.js (tooling only, no runtime cost).

// ---- Tier (config/tiers.js)
/** @typedef {{ index:number, name:string, enterTrueRadius:number /*m*/, cellSizeSim:number, loadRadiusSim:number, objectsPerChunk:number, archetypeIds:string[], fogColor:number, skyTop:number, skyBottom:number }} Tier */
export const TIERS /** @type {Tier[]} */; export const RESCALE_S = 0.2;

// ---- Archetype (config/catalog.js)
/** @typedef {{ id:string, tier:number, buildGeometry:(rng:()=>number)=>THREE.BufferGeometry, radiusNominal:number /*real m*/, radiusJitter:number, spawnWeight:number, palette:number[], yOffset:number, upright:boolean, collisionScale:number }} Archetype */
export const CATALOG /** @type {Record<string,Archetype>} */;

// ---- ObjectStore (world/objects.js) — SoA, capacity 8192; flags: ALIVE=1, FADING=2, TOMB=4
class ObjectStore { px;py;pz;radius /*F32*/; archetype /*U16*/; tierOf;flags /*U8*/; instanceSlot /*I32*/; alloc():int; free(i); forEachAlive(cb); rescaleAll(S); }

// ---- SpatialHash (world/spatialHash.js) — 3 instances, one per live tier band
class SpatialHash { constructor(cellSizeSim); rebuild(store, tierBand); insert(i,x,z); remove(i) /*tombstone*/; queryBall(x,y,z,r,maxObjR,outI32):count; }

// ---- ScaleManager (world/scaleManager.js)
class ScaleManager { worldScale /*double*/; tierIndex; maybeTierUp(ball, store, hashes, instances, cameraRig, env):boolean; maybeRebase(...):boolean; trueRadiusMeters():number; formatSize():string; }

// ---- BallState (physics/ballPhysics.js) — single source of ball truth
/** @typedef {{ pos:THREE.Vector3, vel:THREE.Vector3, quat:THREE.Quaternion, radiusSim:number, radiusVisualSim:number /*slewed <=1.5r/s*/, sluggish:number }} BallState */

// ---- StuckRecord (render/ball.js) — written once at attach, ball-local
/** @typedef {{ archetypeFamily:number, slot:number, attachRadiusSim:number, objHalfSim:number, stage:'animating'|'live'|'culled' }} StuckRecord */
ball.attachStuck(objIndex, store, ballState) // 0.15s anim then one setMatrixAt in ball-local space
ball.knockOff(n):WorldReentry[] // newest n records -> spawner re-injects as WORLD instances

// ---- InstancedPool (render/instances.js)
new InstancedPool(geometry, material, capacity)
alloc():slot|-1; free(slot) /*zero-scale*/; setTransform(slot,pos,quat,scale); setColor(slot,hex); fadeIn(slot,s); fadeOut(slot,s); rewriteAll(fn) /*rescale only*/; flush() /*one needsUpdate + updateRanges*/

// ---- Intent (input/input.js)
/** @typedef {{ x:number, y:number, boost:boolean }} Intent */ // [-1,1], camera-relative mapping applied in ballPhysics

// ---- Event bus contract (core/events.js) — exhaustive; payloads are reused objects, read-only in handlers, never retained
'game:start' {}                     'game:reset' {}                'game:win' { trueRadius, seed }
'absorb'    { objIndex, archetypeId, sizeReal, combo, trueRadius, count } // -> hud, sfx, effects, ball core swirl
'grow'      { trueRadius, simRadius, progress01ToNextTier }               // throttled 10Hz -> hud odometer
'bounce'    { impactSpeed01 }                                             // -> cameraRig shake, sfx clonk
'knockOff'  { count }                                                      // -> effects, sfx
'tierUp'    { tierIndex, name, trueRadius }   // -> cameraRig FOV kick, hud banner+unit roll, environment palette fade, sfx arpeggio, effects ring  (COSMETIC ONLY)
'rescale'   { S }                              // -> debug overlay; all systems already handled synchronously inside ScaleManager (visually a no-op)
'frameStats'{ ms, drawCalls, tris, alive }     // dev builds -> debug overlay

// ---- Per-frame call order (main.js owns this; plain function calls, NOT events)
// intent = input.read()
// while (accumulator >= 1/60, max 3): ballPhysics.step(dt, intent, camYaw); absorb.resolve(ball, hashes, store)
// spawner.update(ball.pos, scaleMgr.tierIndex)   // amortized chunk diff + queues + sub-pixel sweep
// scaleMgr.maybeTierUp(...); scaleMgr.maybeRebase(...)   // BETWEEN update and render: pixel-identity transforms
// ball.update(dt)  // attach anims, staggered burial cull
// cameraRig.update(dt, ball); effects.update(dt)
// instances.flush(); renderer.render(); hud is event-driven
```

## 実装順序（並列化計画）

PHASE 0 (lead, ~half day, blocks everything): src/types.js, config/tiers.js + config/tuning.js (constants stubbed), core/events.js, core/rng.js, core/pool.js, core/mathUtils.js, main.js skeleton with the frame-order comments, index.html, vite.config.js. These freeze the contracts. PHASE 1 (5 parallel streams, no cross-dependencies beyond types.js): DEV A (sim data + physics): world/objects.js -> world/spatialHash.js -> physics/ballPhysics.js -> physics/absorb.js (testable headless against a fake store). DEV B (world): world/spawner.js -> world/scaleManager.js (spawner only needs ObjectStore/SpatialHash/InstancedPool SIGNATURES from types.js; scaleManager is last in the stream because it touches the most interfaces). DEV C (render core): render/renderer.js -> render/geometryFactory.js -> render/instances.js -> render/environment.js (testable with a standalone scene of hardcoded instances). DEV D (feel): input/input.js -> render/cameraRig.js -> render/ball.js -> render/effects.js -> audio/sfx.js (camera/ball testable against a scripted fake BallState driving a circle). DEV E (content + UI): config/catalog.js (48 archetypes — the largest single workpackage, pure and independent) -> ui/hud.js -> ui/screens.js (driven by synthetic bus events). PHASE 2 (integration, lead + Dev A): wire real modules through main.js in order physics -> instances -> spawner -> scaleManager (rescale is integrated LAST, behind the force-rescale debug key, verified by screenshot diff). PHASE 3 (all hands): tuning.js passes with the ?r= start-at-radius key per tier, stress scene profiling on an Intel iGPU, Cloudflare Pages deploy. Critical-path note: ObjectStore + InstancedPool interfaces are the two contracts most modules touch — any change to them must go through the lead and types.js first.
## v2 — 月アップデート（moon update）差分章

v2 の確定差分仕様は **`docs/DESIGN-V2.md`**（イベント契約・インターフェース・チューニング定数・作業分割すべてそこが BINDING）。本章は v1 本文に対する法改正・台帳更新だけを記す。v1 の不変条件（リスケールのピクセル同一性、シームレスネス法、ホットパスのゼロアロケーション、固定 60Hz、決定論スポーン）はすべて存続する。

### アロケーション法 改正（BOUNDED WebAudio EXEMPTION）
WebAudio ノード生成（sfx + 新規 bgm.js）は「ホットパスでのフレーム毎アロケーション禁止」に対する**明示的な有界例外**とする: 予算 <= 60 短命ノード/秒。高コストな確保は初期化時にホイスト（ハット/シェイカー/whoosh 用の共有ノイズ AudioBuffer は 1 個を永続共有、PeriodicWave は init 時生成）。Phase-3 プロファイルパスでデバッグオーバーレイの heap-delta 行により検証する。bgm.js 内では setTimeout 禁止 — すべてのゲイン操作は ctx 時間でスケジュールする。

### ドローコール台帳 v2（DRAW_CALL_CAP 55 -> 60）
4 バンド遷移ウィンドウの正直な最悪値: ワールド InstancedMesh 40（4 バンド x 10 アーキタイプ）+ スタック 8 ファミリー + 固定 6（スカイドーム/地面/ボールコア/エフェクト/月本体+グロー 2）+ バックドロップ 1 = **56**。キャップ 60。超過時の第一レバーは月グローシェル削除（-1）、次に N+2 プリウォームプールの非表示化。月メッシュ（icosphere detail 3, ~1280 tris）は ARCHETYPE_TRI_CAP 350 の文書化された唯一の例外（カタログ外・非プール・フィナーレ限定）。

### イベント契約（v2）
新イベント名と再利用 PAYLOADS は `src/core/events.js` の EVT/PAYLOADS と `docs/DESIGN-V2.md` §インターフェース が正。BINDING: (a) ABSORB 購読順 = main アタッチハンドラ -> runStats -> sfx/effects/hud。(b) `game:win` は v2 では **main.js が唯一の emitter**（finale.state === 'done' 時。ScaleManager の WIN_RADIUS_M ラッチは撤去）。(c) `goal` ペイロードも再利用 — 購読側はフィールドコピー必須。

### シームレスネス法 例外（fog:false）
render/moon.js の月マテリアル 2 種（Lambert 本体 + 加算グローシェル）は fog:false — 月はスカイドーム同様の「空の要素」であり地上シーンリーではない（environment.js のドーム群が既に fog:false であるのと同じ扱い）。文書化された例外であり、ワールドオブジェクトへの適用は引き続き禁止。

### SIM-TIME がランクの公式時計
runStats の elapsed は固定ステップの積算（main.js が毎フレーム `runStats.addSimTime(steps * FIXED_DT)`）。低速端末は壁時計上ゆっくり進むがシミュレート秒あたりの成果は決定論的・公平 — ランク（S<=300 / A<=400 / B<=540 / C<=720 / else D, sim 秒）は端末性能に依存しない。

### シード互換性
v1 のシード URL は v2 では**別の世界**を生む（アーキタイプストライド 8->10、ウェイトテーブル、SCENERY_OBJECTS_PER_CHUNK 8->10、レアロール追加によりドロー列が変わる）。同一 v2 ビルド内では従来どおり同シード=同世界（レア配置含む）。

### リセット所有権テーブル（v2 凍結）
| 所有者 | 経路 | 内容 |
|---|---|---|
| main.resetWorld | 直接呼び出し | finale.reset()（状態 idle / MoonView 非表示 / _simCache ゼロ）+ runStats.reset() |
| cameraRig | GAME_RESET | reset() がシネマティックフラグも解除 |
| env | GAME_RESET (setTierPaletteImmediate) | v2 ユニフォーム復帰（uMoonFade=1, パルス停止, 星強度）+ ナイトフェード構造的キャンセル |
| backdrop | GAME_RESET（自己購読） | プロファイル/色スナップ |
| ball | ball.reset() | group.visible = true 復元（MERGE で非表示化されるため） |
| hud | GAME_START | 再表示（MOON_CONTACT で全非表示） |
| bgm | GAME_RESET | 停止 + 巻き戻し |

### フレーム順序 v2（BINDING — main.js ヘッダと同一）
v1 の順序に対する追加: step 4.5 `finale.update(frameDt, ballPhys.state)`、step 6.5 `runStats.addSimTime(steps * FIXED_DT)`。ゲート: finale.inputLocked で intent ゼロ化 / absorb.resolve / spawner.update / scaleMgr.maybeRebase をスキップ（maybeTierUp は継続）。finale.cameraOwned で cameraRig.update をスキップ（finale が cinematicUpdate を駆動）。GameState は TITLE -> PLAYING -> FINALE -> WIN。
