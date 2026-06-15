/**
 * @file types.js — THE parallel-work contract file.
 *
 * ALL cross-module JSDoc typedefs live here. NO RUNTIME CODE (tooling only,
 * zero runtime cost). Every other module imports these types via:
 *
 *   /** @typedef {import('../types.js').BallState} BallState *\/
 *
 * Any change to this file must go through the lead (Phase 0 owner).
 * See docs/DESIGN.md §モジュール間インターフェース for the binding v1 spec,
 * docs/DESIGN-V2.md §インターフェース for the v2 delta (moon update),
 * docs/DESIGN-V3.md §インターフェース for the BINDING v3 delta (Hakoniwa
 * Tokyo: GOAL_* + LANDMARK + COLLECT events, curated spawner shapes, 7 tiers),
 * and docs/DESIGN-V4.md §インターフェース for the BINDING v4 delta (Real
 * Tokyo: OSM_READY event, OSM data shapes, unit-box archetypes, hero pass).
 *
 * v4 BINDING ABSORB subscription order (extends v3 — frozen):
 *   chunk spawner -> curated -> osmSpawner -> main attach -> runStats ->
 *   collection -> sfx/effects/hud. (See core/events.js header for the
 *   slot-steal/deferred-bookkeeping conventions; osmSpawner mirrors curated.)
 */

/* ------------------------------------------------------------------ */
/* Config shapes                                                       */
/* ------------------------------------------------------------------ */

/**
 * One scale tier (config/tiers.js). tierIndex drives ONLY cosmetics and
 * spawn-content selection — never physics/camera/fog math (those are
 * continuous functions of ball radius; see DESIGN.md SEAMLESSNESS LAW).
 *
 * v2: per-tier SKY PARAMS (sun/moon/stars/clouds) ride the existing
 * environment palette crossfade — still cosmetic-only. The env-local NIGHT
 * palette (finale ascension) is NOT a tier.
 * v3 (Hakoniwa Tokyo): SEVEN tiers (パーツ棚 0.02m .. スカイライン 300m);
 * tiers.js keeps exactly 7 entries, NIGHT stays env-local. moonAngSize is a
 * night cosmetic in v3 (non-decreasing, no longer strictly increasing).
 *
 * @typedef {Object} Tier
 * @property {number}   index           0..6 (パーツ棚..スカイライン).
 * @property {string}   name            Display name for HUD banner.
 * @property {number}   enterTrueRadius Real-meter ball radius at which this tier begins.
 * @property {number}   cellSizeSim     Chunk/spatial-hash cell size in sim units (this tier's native scale, i.e. when it is the CURRENT tier).
 * @property {number}   loadRadiusSim   Chunk load radius in sim units when this tier is the target (N) band.
 * @property {number}   objectsPerChunk Placements per chunk when this tier is the target band.
 * @property {string[]} archetypeIds    Exactly ARCH_PER_TIER (10) catalog ids (frozen — config/catalog.js must implement these). Slots [8],[9] are LANDMARKS (landmark eligibility rule: archRoll over all 10 ONLY at placement j === 0 of a chunk).
 * @property {number}   fogColor        Hex color for fog while this tier is current.
 * @property {number}   skyTop          Hex color, sky-dome gradient top.
 * @property {number}   skyBottom       Hex color, sky-dome gradient bottom.
 * @property {number[]} sunDir          [x,y,z] sky-dome sun direction (normalized by env at build).
 * @property {number}   sunIntensity    Sun disc + glare lobe strength (0..~1.2).
 * @property {number[]} moonDir         [x,y,z] sky-dome moon direction. POST-normalization elevation asin(y/|v|) >= MOON_DIR_MIN_ELEV (0.15 rad), asserted in tiers.js.
 * @property {number}   moonAngSize     Moon angular RADIUS in radians (grows per tier — the moon visibly approaches).
 * @property {number}   starIntensity   Star sparkle gate 0..1 (NIGHT palette uses 1.0 env-locally).
 * @property {number}   cloudDensity    Analytic cloud coverage 0..1 (0 = clear).
 * @property {number}   cloudHex        Hex tint for the cloud layer.
 */

/**
 * One spawnable object archetype (config/catalog.js).
 * v3: 70 chunk codes (ARCH_PER_TIER 10 x 7 tiers, slots 8/9 = chunk landmarks)
 * + 24 EXTRA curated codes 70..93 (12 collectibles, 10 landmark singletons,
 * shop shell, Skytree display slot) = DISPLAY_NAME_BY_CODE length 94.
 * Every entry additionally carries displayNameJa (Stream C, catalog.js).
 *
 * @typedef {Object} Archetype
 * @property {string}  id              Unique id, lowercase snake_case (must match Tier.archetypeIds).
 * @property {number}  tier            Home tier index 0..6 (EXTRA codes: naturalBand).
 * @property {(rng: () => number) => import('three').BufferGeometry} buildGeometry
 *   Builds the merged, vertex-colored composite geometry (<=350 tris). Called once at boot.
 * @property {number}   radiusNominal  Nominal bounding-sphere radius in REAL METERS.
 * @property {number}   radiusJitter   Fractional size jitter, e.g. 0.25 = +-25%.
 * @property {number}   spawnWeight    Relative weighted-pick weight within its tier.
 * @property {number[]} palette        4-6 hex tints applied via instanceColor.
 * @property {number}   yOffset        Rest height offset as a fraction of radius (0 = sphere sits on ground).
 * @property {boolean}  upright        True = yaw-only random rotation; false = free tumble.
 * @property {number}   collisionScale Collision-radius fudge for long/flat objects (benches, buses); 1 = exact.
 * @property {boolean}  [unitBox]      v4 (OSM archetypes, codes 94..109): geometry uses the UNIT-BOX
 *   convention (half-extents 1) so render scale = (w/2, h/2, d/2) NON-UNIFORM while the store radius
 *   stays r_eff. BINDING NORMALS CONSTRAINT (boot-asserted in geometryFactory): every unitBox
 *   geometry's normals must be axis-aligned (+-X/Y/Z) — BatchedMesh applies no inverse-transpose,
 *   so non-uniform scale would mislight sloped faces. All other archetypes keep the unit-SPHERE
 *   convention (uniform scale).
 * @property {number}   [heroTriCap]   v4 hero pass: per-id tri-cap override (HERO_TRI_CAP=600 for the
 *   12 frozen HERO_ARCHETYPE_IDS; absent = ARCHETYPE_TRI_CAP 350). Boot-asserted per id in dev.
 */

/* ------------------------------------------------------------------ */
/* Live state shapes                                                   */
/* ------------------------------------------------------------------ */

/**
 * Single source of ball truth (physics/ballPhysics.js owns and mutates it).
 * All values in SIM UNITS / sim space. trueRadius = radiusSim * worldScale.
 *
 * @typedef {Object} BallState
 * @property {import('three').Vector3}    pos             Center position, sim units. y springs to radiusSim.
 * @property {import('three').Vector3}    vel             Linear velocity, sim units/s.
 * @property {import('three').Quaternion} quat            Rolling orientation (rolling without slipping).
 * @property {number} radiusSim        Physics radius, lives in [SIM_RADIUS_MIN, SIM_RADIUS_MAX] = [0.5, 2.5].
 * @property {number} radiusVisualSim  Display radius, slewed toward radiusSim at <= RADIUS_SLEW_K * r per second.
 * @property {number} sluggish         Transient accel multiplier in (0,1]; *= SLUGGISH_FACTOR per absorb, recovers over SLUGGISH_RECOVERY_S.
 * @property {number} dashGauge01      Dash charge 0..1 (starts 1.0); +dt/DASH_RECHARGE_S, +DASH_ABSORB_GAIN per absorb. Dimensionless => rescale-invariant.
 * @property {number} dashTimer        Seconds of dash burst remaining (DASH_DURATION_S on trigger; cap/accel multiplied while > 0).
 */

/**
 * Normalized player input (input/input.js). Camera-relative mapping is applied
 * in ballPhysics, NOT here (keeps the touch path rewrite-free).
 *
 * @typedef {Object} Intent
 * @property {number}  x     Strafe axis in [-1, 1].
 * @property {number}  y     Forward axis in [-1, 1].
 * @property {boolean} boost Boost held (Shift / second touch): ballPhysics applies BOOST_ACCEL_MUL / BOOST_CAP_MUL.
 * @property {boolean} dash  Edge-latched dash request (Space keydown / #dash-button pointerdown); true for exactly ONE input.read(), consumed on read.
 */

/**
 * One stuck-on-ball object record (render/ball.js). Written ONCE at attach,
 * in ball-local space; never updated per frame.
 *
 * @typedef {Object} StuckRecord
 * @property {number} archetypeFamily Index of the stuck InstancedMesh family (0..7; v2 landmark slots fold onto proxy families 0/1 via (code % ARCH_PER_TIER) & 7).
 * @property {number} slot            Instance slot inside that family's stuck pool.
 * @property {number} attachRadiusSim Ball simRadius at the moment of attach (ball-local; rides ballGroup.scale).
 * @property {number} objHalfSim      Object half-size in the same ball-local sim frame (for burial cull test).
 * @property {'animating'|'live'|'culled'} stage Lifecycle stage.
 */

/**
 * A knocked-off stuck object re-entering the world as a re-absorbable
 * instance. Returned by ball.knockOff(n); spawner re-injects them.
 * v2: reinject NEVER sets FLAG_RARE (score credit was granted at absorb).
 *
 * @typedef {Object} WorldReentry
 * @property {string} archetypeId Catalog id to respawn as.
 * @property {number} radiusSim   Bounding radius in CURRENT sim units.
 * @property {import('three').Vector3} pos Sim-space ejection position (ballistic pop start).
 * @property {import('three').Vector3} vel Sim-space ejection velocity.
 */

/**
 * One persisted best record line (game/runStats.js, localStorage LS_BEST_KEY,
 * schema {v:1, bestTime:BestRecord|null, bestScore:BestRecord|null}).
 * Each sub-record is replaced ATOMICALLY when its metric improves — fields
 * within one record are always from the same run (no field mixing).
 *
 * @typedef {Object} BestRecord
 * @property {number} timeS Clear time in SIM seconds.
 * @property {number} score Final score (incl. moon + time bonuses).
 * @property {string} rank  'S'|'A'|'B'|'C'|'D'.
 * @property {number} seed  World seed (uint32) of the run.
 */

/* ------------------------------------------------------------------ */
/* Event bus payload shapes (core/events.js)                           */
/* ------------------------------------------------------------------ */
/* Payloads are REUSED module-level objects: read-only in handlers,    */
/* never retained across frames. The exhaustive name list is EVT in    */
/* core/events.js; the reusable instances are PAYLOADS there.          */

/** 'game:start' — title screen dismissed. @typedef {Object} GameStartEvent */

/** 'game:reset' — restart requested from win screen. @typedef {Object} GameResetEvent */

/**
 * 'game:win' — v2: emitted by MAIN.JS when finale.state === 'done'
 * (was ScaleManager's WIN_RADIUS_M latch in v1; payload unchanged).
 * @typedef {Object} GameWinEvent
 * @property {number} trueRadius Final ball radius in real meters.
 * @property {number} seed       World seed (uint32) for shareable runs.
 */

/**
 * 'absorb' — an object was absorbed. -> main attach-handler, runStats, hud,
 * sfx, effects (BINDING subscription order: main -> runStats -> sfx/effects/hud).
 * @typedef {Object} AbsorbEvent
 * @property {number} objIndex    ObjectStore index that was consumed (already freed; do not deref next frame).
 * @property {string} archetypeId Catalog id of the absorbed object.
 * @property {number} sizeReal    Object diameter in real meters (for HUD ticker).
 * @property {number} combo       Current rapid-absorb combo count (resets after COMBO_WINDOW_S).
 * @property {number} trueRadius  Ball radius in real meters AFTER the absorb.
 * @property {number} count       Total objects absorbed this run.
 * @property {boolean} rare       v2: absorb.js stamps (store.flags[i] & FLAG_RARE) !== 0 BEFORE store.free.
 * @property {number} archetypeCode v3: store.archetype[i], stamped by absorb.js BEFORE store.free (next to the rare stamp). 0..93 (70..93 = EXTRA curated).
 * @property {number} collectibleId  v3: frozen collectible id 0..11 via injected curated.collectibleIdFor(i), or -1. Stamped BEFORE store.free.
 */

/**
 * 'grow' — throttled ~10Hz -> hud odometer + dash gauge fill.
 * @typedef {Object} GrowEvent
 * @property {number} trueRadius           Real meters.
 * @property {number} simRadius            Sim units.
 * @property {number} progress01ToNextTier 0..1 progress within current tier band.
 * @property {number} dashGauge01          v2: copied from BallState.dashGauge01 by ScaleManager at the 10Hz emit.
 */

/**
 * 'bounce' — pushback off a too-big object. -> cameraRig shake, sfx clonk.
 * @typedef {Object} BounceEvent
 * @property {number} impactSpeed01 Impact speed normalized by speedCap, 0..1.
 */

/**
 * 'knockOff' — hard bonk ejected stuck objects. -> effects, sfx.
 * @typedef {Object} KnockOffEvent
 * @property {number} count How many stuck objects were ejected (1..3).
 */

/**
 * 'tierUp' — tierIndex incremented. COSMETIC ONLY (FOV kick, banner,
 * palette fade, arpeggio, sparkle ring; v2: + bgm layer unlock, backdrop
 * profile crossfade). Gameplay never branches on it.
 * @typedef {Object} TierUpEvent
 * @property {number} tierIndex  New tier index.
 * @property {string} name       New tier display name.
 * @property {number} trueRadius Ball radius in real meters at the moment of tier-up.
 */

/**
 * 'rescale' — one-frame similarity rescale happened (debug overlay; v2: also
 * finale._simCache *= S — finale.js subscribes itself).
 * @typedef {Object} RescaleEvent
 * @property {number} S Similarity factor applied (RESCALE_S = 0.2).
 */

/**
 * 'frameStats' — dev builds only -> debug overlay.
 * @typedef {Object} FrameStatsEvent
 * @property {number} ms        Last frame CPU ms.
 * @property {number} drawCalls renderer.info.render.calls.
 * @property {number} tris      renderer.info.render.triangles.
 * @property {number} alive     ObjectStore alive count.
 */

/* ------------------------------------------------------------------ */
/* v2 event payload shapes (moon update — see docs/DESIGN-V2.md)       */
/* ------------------------------------------------------------------ */

/**
 * 'dash' — dash impulse fired (ballPhysics). -> cameraRig FOV kick, effects
 * speed-line burst, sfx whoosh, hud gauge zero.
 * @typedef {Object} DashEvent
 * @property {number} gauge01 Gauge value after the trigger (0).
 */

/**
 * 'dashReady' — gauge crossed 1.0, once per refill (ballPhysics, the SINGLE
 * emitter — absorb.js only adds gauge, never emits). -> hud flash, sfx chime.
 * @typedef {Object} DashReadyEvent
 */

/**
 * 'score' — score changed (game/runStats.js on each absorb). -> hud score
 * panel + floating '+N', sfx rare gliss when rare.
 * @typedef {Object} ScoreEvent
 * @property {number}  score Total score after the delta.
 * @property {number}  delta Points just gained (combo + rare bonus included).
 * @property {number}  combo Combo count used for the multiplier.
 * @property {boolean} rare  This absorb was a rare (RARE_SCORE_BONUS applied).
 * @property {number}  archetypeCode v3: copied from AbsorbEvent by runStats — hud renders `+${delta} ${DISPLAY_NAME_BY_CODE[code]}` with FLOAT_MERGE_S burst merging.
 */

/**
 * 'time' — sim clock crossed the next 0.1s boundary (game/runStats.js;
 * SIM time, never performance.now). -> hud #timer mm:ss.t.
 * @typedef {Object} TimeEvent
 * @property {number} timeS Elapsed simulated seconds.
 */

/**
 * 'goalCall' — trueRadius crossed GOAL_CALL_RADIUS_M, once (game/finale.js).
 * v3: 「スカイツリーが呼んでいる…！」 toast + skytree beam pulse, bgm swell, sfx pad.
 * @typedef {Object} GoalCallEvent
 * @property {number} trueRadius Ball radius in real meters at the call.
 */
/** @typedef {GoalCallEvent} MoonCallEvent @deprecated v3: use GoalCallEvent (same shape, wire name 'goalCall'). */

/**
 * 'goalGuide' — goal screen-position guide, 10Hz during APPROACH plus one
 * final {active:false} on CONTACT (game/finale.js). -> hud #goal-arrow.
 * @typedef {Object} GoalGuideEvent
 * @property {number}  x01      Goal center NDC x mapped to 0..1 (clamped).
 * @property {number}  y01      Goal center NDC y mapped to 0..1 (clamped, 0 = top).
 * @property {boolean} onScreen Goal center is inside the frustum.
 * @property {boolean} active   Guide visible; false = hide the arrow.
 * @property {string}  kind     'goal' (finale tower guide, default) | 'parts'
 *   (v5 opening onboarding guide — hud swaps the glyph 🗼->🔩 and suppresses
 *   the 「スカイツリーへ向かえ！」 toast + its once-latch).
 */
/** @typedef {GoalGuideEvent} MoonGuideEvent @deprecated v3: use GoalGuideEvent (same shape, wire name 'goalGuide'). */

/**
 * 'goalContact' — ball touched the Skytree = CLEAR TIME instant, once
 * (game/finale.js). -> runStats (freeze + GOAL), bgm duck->stop, sfx grand
 * fanfare, hud hide (#donack-root survives — it lives OUTSIDE #hud), screens
 * flash. From this frame finale.inputLocked and finale.cameraOwned are true.
 * @typedef {Object} GoalContactEvent
 */
/** @typedef {GoalContactEvent} MoonContactEvent @deprecated v3: use GoalContactEvent (same shape, wire name 'goalContact'). */

/**
 * 'landmark' — a fixed-position landmark singleton was absorbed (emitted by
 * world/curated.js AFTER the normal ABSORB chain). -> hud center toast,
 * effects gold ring burst, sfx fanfare sting, Donack trivia (P3), runStats
 * LANDMARK_SCORE_BONUS. DUAL-TAG rule: for objects carrying BOTH ids
 * (ハチ公像), EVT.COLLECT is emitted FIRST, then EVT.LANDMARK, same frame.
 * @typedef {Object} LandmarkEvent
 * @property {number} landmarkId Frozen landmark id 0..10 (docs/DESIGN-V3.md Phase-0 appendix).
 * @property {string} nameJa     Display name, e.g. '雷門'.
 * @property {number} sizeReal   Real-world size (m) for HUD/trivia flavor.
 */

/**
 * 'collect' — a frozen-id collectible was absorbed for the album (emitted by
 * game/collection.js on ABSORB with collectibleId >= 0). -> #collect-popup
 * card, Donack (P2), sfx 5-note gliss (suppressed when LANDMARK fired the
 * same frame — dual-tag rule).
 * @typedef {Object} CollectEvent
 * @property {number}  collectibleId Frozen id 0..11 (COLLECTIBLE_IDS — append-only, never reordered).
 * @property {string}  nameJa        Display name, e.g. '金の招き猫'.
 * @property {boolean} isNew         First time across ALL runs (localStorage mask bit was 0).
 * @property {number}  found         Total found across all runs AFTER this collect.
 * @property {number}  total         COLLECT_TOTAL (12).
 */

/**
 * 'goal' — final results computed + best persisted, once (game/runStats.js,
 * synchronously inside the GOAL_CONTACT dispatch). -> screens caches a COPY
 * and prebuilds the X intent URL.
 * @typedef {Object} GoalEvent
 * @property {number}  timeS          Clear time, sim seconds.
 * @property {number}  score          Final score incl. GOAL_SCORE_BONUS + time bonus.
 * @property {string}  rank           'S'|'A'|'B'|'C'|'D' (RANK_*_S thresholds).
 * @property {number}  trueRadius     Final ball radius in real meters.
 * @property {number}  absorbed       Total objects absorbed this run.
 * @property {number}  raresFound     Rare objects absorbed this run.
 * @property {number}  seed           World seed (uint32).
 * @property {boolean} newRecordTime  bestTime record was replaced this run.
 * @property {boolean} newRecordScore bestScore record was replaced this run.
 * @property {number}  collectFound   v3: collection.foundCount at GOAL emit (X intent 「レア${found}/12」 + result grid header).
 */

/**
 * 'ui:muteRequest' — hud mute button clicked. -> main.js (single mute owner).
 * @typedef {Object} MuteRequestEvent
 */

/**
 * 'muteChanged' — mute state toggled + persisted by main.js. -> hud icon,
 * (bgm/sfx are called directly by main via setMuted, not via this event).
 * @typedef {Object} MuteChangedEvent
 * @property {boolean} muted New mute state.
 */

/* ------------------------------------------------------------------ */
/* v3 city-map data shapes (config/cityMap.js — Stream B implements    */
/* against these FROZEN shapes; Phase-0 contract)                      */
/* ------------------------------------------------------------------ */

/**
 * One curated placement record (world/curated.js slot source; expanded at
 * boot from cityMap.js cluster records via mulberry32(0x544f4b59) —
 * seed-INDEPENDENT). All coordinates in REAL METERS, ORIGIN = BALL START.
 *
 * @typedef {Object} CuratedPlacement
 * @property {number} archetypeCode Code 0..93 (chunk codes < 70 reinject via the chunk path on knock-off, stripping FLAG_CURATED|FLAG_RARE).
 * @property {number} x             Real-meter X (+X east).
 * @property {number} y             Real-meter rest height of the object CENTER offset base (interior shelf items <= INTERIOR_ITEM_Y_MAX; 0 = floor).
 * @property {number} z             Real-meter Z (+Z south).
 * @property {number} radiusReal    Bounding radius in REAL METERS.
 * @property {number} yaw           Y rotation (rad).
 * @property {number} naturalBand   Tier-table band 0..6; re-stamped live as store.tierOf[slot] = clamp(naturalBand, tierIndex-1, tierIndex+1) on activation + TIER_UP (dynamic re-banding, BINDING).
 * @property {number} landmarkId    Frozen landmark id 0..10, or -1.
 * @property {number} collectibleId Frozen collectible id 0..11, or -1 (ハチ公像 carries BOTH — dual-tag).
 */

/**
 * One landmark singleton definition (cityMap.js LANDMARKS, frozen ids 0..10).
 * @typedef {Object} LandmarkDef
 * @property {number} landmarkId     Frozen id 0..10.
 * @property {string} nameJa         Display name (toast/Donack).
 * @property {number} x              Real-meter X.
 * @property {number} z              Real-meter Z.
 * @property {number} dioramaR       Authored diorama bounding radius (m).
 * @property {number} collisionScale Collision fudge (catalog convention).
 * @property {number} absorbableAtM  Threshold ladder entry = dioramaR / ABSORB_RATIO (display/validator).
 * @property {number} sizeReal       Real-world size (m) for EVT.LANDMARK.sizeReal.
 * @property {number} archetypeCode  EXTRA code 70..93 (docs/DESIGN-V3.md Phase-0 appendix).
 */

/**
 * One collectible definition (cityMap.js COLLECTIBLES; COLLECTIBLE_IDS is the
 * EXPLICIT frozen-id enum 0..11 — ids append-only 12+, never reused/reordered;
 * boot assert: unique and < 31).
 * @typedef {Object} CollectibleDef
 * @property {number} id            FROZEN collectible id 0..11.
 * @property {string} nameJa        Display name (popup/album/Donack).
 * @property {number} x             Real-meter X.
 * @property {number} y             Real-meter rest height (shop shelf/table items).
 * @property {number} z             Real-meter Z.
 * @property {number} radiusReal    Bounding radius (m).
 * @property {number} archetypeCode EXTRA code = 70 + id (frozen mapping).
 * @property {number} landmarkId    -1 except ハチ公像 (dual-tag: COLLECT before LANDMARK).
 */

/**
 * One zone-mask rect (cityMap.js ZONES; bandAllowedAt(xReal, zReal, band)
 * is a static pure lookup over ~20 of these — chunk contents stay a pure
 * function of (seed, cx, cz, band)).
 * @typedef {Object} ZoneRect
 * @property {number} x0 West edge (real m).  @property {number} x1 East edge.
 * @property {number} z0 North edge (real m). @property {number} z1 South edge.
 * @property {number} bandMask Bitmask of allowed bands (bit b = band b allowed).
 */

/**
 * One shop wall segment (world/terrain.js, circle-vs-AABB in XZ, rounded ends).
 * @typedef {Object} TerrainWall
 * @property {number} x0 @property {number} z0 Segment start (real m).
 * @property {number} x1 @property {number} z1 Segment end (real m).
 * @property {number} thickness WALL_THICK_M unless overridden.
 * @property {number} yTop WALL_TOP_M unless overridden (roofless above).
 */

/**
 * One solid interior prism (shelves/counter/table — footprint blocked at any
 * height; items on top are reached by 3D absorb overlap, never by climbing).
 * @typedef {Object} TerrainPrism
 * @property {number} x0 @property {number} z0 Min corner (real m).
 * @property {number} x1 @property {number} z1 Max corner (real m).
 * @property {number} h  Prism height (real m).
 */

/* ------------------------------------------------------------------ */
/* v4 Real-Tokyo OSM data shapes (docs/DESIGN-V4.md — Streams P/W/R    */
/* implement against these FROZEN shapes; Phase-0 contract)            */
/* ------------------------------------------------------------------ */

/**
 * 'osmReady' — both OSM shards fetched + decoded (world/osmWorld.js, ONCE per
 * session, never after abortAndFail()). -> main.js (calls
 * cityMap.setOsmCoverageActive(true) — the one-shot latch — and arms the
 * osmSpawner), debug overlay.
 * @typedef {Object} OsmReadyEvent
 * @property {number} buildings Total decoded building records (detail + tower).
 */

/**
 * One decoded OSM building record — a LOGICAL view: osmWorld.js decodes the
 * binary tiles into flat parallel typed arrays (SoA, one pass at title
 * screen); this typedef documents the per-index fields, not a JS object that
 * exists at runtime (zero per-record allocation).
 *
 * Coordinates: GAME METERS (= the v3 "real meters" convention, origin = ball
 * start) — the 1:5 / 1:2.5 mapping is baked at convert time by
 * scripts/osm/geo.mjs toGame(); runtime code treats them exactly like
 * CuratedPlacement.x/z. Sim conversion via live ScaleManager.worldScale +
 * origin shift (curated origin/scale pattern verbatim).
 *
 * @typedef {Object} OsmBuildingRecord
 * @property {number} x       Footprint center X, game m (+X east). Quantized 0.05 m.
 * @property {number} z       Footprint center Z, game m (+Z south). Quantized 0.05 m.
 * @property {number} w       OBB width  (X at yaw=0), game m. Quantized 0.25 m (detail max 63.75).
 * @property {number} d       OBB depth  (Z at yaw=0), game m. Quantized 0.25 m (detail max 63.75).
 * @property {number} h       Height, game m. Quantized 0.5 m detail (max 127.5) / 0.25 m tower.
 * @property {number} yaw     OBB yaw (rad). Quantized pi/128.
 * @property {number} code    Archetype code 94..109 (OSM_CODE_BASE + type; 16 frozen archetypes).
 * @property {boolean} merged MERGED flag (type byte bit 5): convert merged >=2 small neighbors.
 * @property {number} tint    Palette row index (type palette hashed by source wayId at convert).
 * @property {number} rEff    DERIVED at decode: 0.5*sqrt(w^2+d^2+h^2) game m — the ObjectStore radius.
 * @property {number} band    DERIVED at decode from rEff: [1.2,1.6)->2, [1.6,10)->3, [10,60)->4, >=60->5.
 * @property {number} collisionScale DERIVED: clamp(0.5*sqrt(w^2+d^2)/rEff, OSM_COLLIDE_MIN 0.35, 1.0).
 */

/**
 * One OSM tile-index entry (world/osmWorld.js). Tiles partition the decoded
 * record arrays: detail tiles 100 game m grid (tokyo-v4-core.bin), tower
 * tiles 400 m / ground tiles 200 m grid (tokyo-v4-outer.bin). Records within
 * a tile are SORTED BY BAND at convert so per-band ranges are contiguous.
 *
 * @typedef {Object} OsmTile
 * @property {number} tileX     Tile grid X (i16 from the section header).
 * @property {number} tileZ     Tile grid Z (i16).
 * @property {number} offset    First record index into the flat decoded arrays.
 * @property {number} count     Record count in this tile.
 * @property {Int32Array} bandStart Per-band start offsets within [offset, offset+count)
 *   (length 7, indexed by band; bandStart[b]..bandStart[b+1] = band b's range).
 */

/**
 * public/assets/tokyo/tokyo-v4-manifest.json (emitted by
 * scripts/osm/build-tokyo-bin.mjs, asserted by verify-tokyo-data.mjs, read
 * by scripts/pacing-model.mjs — pacing math reads THIS, never design prose).
 *
 * @typedef {Object} OsmManifest
 * @property {number} version        Format version (1).
 * @property {{core: number, outer: number}} shardGzBytes Gzipped shard sizes (budget gate input).
 * @property {Object<string, number>} perBandCounts Shipped building counts keyed 'band2'..'band5'.
 * @property {number[]} bandHistogram Post-thin per-band histogram (authoritative input to the
 *   Phase-3 OSM_ALIVE_CAP re-cut).
 * @property {Object} tileIndexSummary Tile counts + max records/tile per section type.
 * @property {string} extractionDate ISO timestamp of the committed Overpass fetch (ODbL gate).
 * @property {string} attribution    "© OpenStreetMap contributors" (ODbL gate).
 * @property {string} license        "ODbL".
 * @property {string} licenseUrl     "https://opendatacommons.org/licenses/odbl/".
 */

/**
 * v4 OSM voxel archetype = a regular Archetype with the unit-box convention
 * (catalog.js, codes 94..109, Stream C). Constraints (boot-asserted):
 * unitBox === true; axis-aligned normals only (flat/stepped roofs in v1);
 * <=72 tris; tier field carries the naturalBand convention like EXTRA codes.
 * @typedef {Archetype} OsmArchetype
 */

// Make this file an ES module so typedefs are importable via import('./types.js').X
export {};
