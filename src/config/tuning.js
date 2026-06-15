/**
 * @file tuning.js — THE designer's file. Every feel constant in the game.
 *
 * All `*_K` constants are COEFFICIENTS OF BALL simRadius — the SEAMLESSNESS
 * LAW (DESIGN.md): absorbability, camera, fog, speed, despawn are continuous
 * functions of radius and NEVER reference tierIndex, so nothing can pop at a
 * threshold. Phase-3 tuning passes edit this file only.
 *
 * Units: sim = sim units, m = real meters, s = seconds.
 */

/* ================================================================== */
/* Scale system                                                        */
/* ================================================================== */

/** Lower edge of the ball's sim-radius band. simRadius lives in [MIN, MAX]. */
export const SIM_RADIUS_MIN = 0.5;
/** Upper edge — reaching it triggers the one-frame similarity rescale (S = RESCALE_S). */
export const SIM_RADIUS_MAX = 2.5;
/** Starting ball radius in real meters (v3: 2 cm — センゴク電子 parts-bin tier). */
export const START_RADIUS_M = 0.02;
/* v2: WIN_RADIUS_M deleted — replaced by the goal radius (finale owns the goal).
 * v3: GOAL_RADIUS_M arms the Skytree finale contact. */
/** Tier-index hysteresis (+-10% of enterTrueRadius) — guards float edge cases. */
export const TIER_HYSTERESIS = 0.10;
/** Floating-origin rebase when |ball.pos| exceeds this many sim units (integer-snapped shift). */
export const REBASE_DISTANCE_SIM = 1500;

/* ================================================================== */
/* v3 Goal — 東京スカイツリー finale (game/finale.js, render/goalTower.js) */
/* ================================================================== */

/** Finale CALLED state: emit 'goalCall' (toast + skytree beam pulse) at this true radius (m). */
export const GOAL_CALL_RADIUS_M = 380;
/** Goal: Skytree contact arms at this true radius (m). */
export const GOAL_RADIUS_M = 420;
/** Contact when dist(ball, towerBase) <= ballR + towerBaseR * GOAL_CONTACT_PAD.
 *  Validator asserts SKYTREE_COLLIDER_K (0.6) < GOAL_CONTACT_PAD so the finale always wins. */
export const GOAL_CONTACT_PAD = 0.85;
/** Skytree base radius (REAL meters) — terrain.js permanent base circle collider. */
export const SKYTREE_BASE_R_M = 90;
/** Base collider radius = SKYTREE_BASE_R_M * SKYTREE_COLLIDER_K (54 m real); BOUNCE, never absorbs. */
export const SKYTREE_COLLIDER_K = 0.6;
/** While worldScale < this, the Skytree renders as the environment.js sky-dome
 *  silhouette (uGoalSil*); the goalTower.js mesh takes over via the kept v2
 *  moon crossfade at the first frame simDist < 0.8 * CAMERA_FAR. */
export const SKY_SILHOUETTE_WS_MAX = 0.2;
/** Contact white flash: 0.12s in, FLASH_S out (#flash-overlay). */
export const FLASH_S = 0.45;
/** MERGE: ball.pos lerps into the tower glow over this (s); ball hidden at t >= 0.6s. */
export const GOAL_MERGE_S = 1.2;
/** ASCENSION duration (s): camera pullback over the night diorama (v2
 *  machinery re-themed). v5: 5.0 -> 7.0 — the liftoff-into-space ending
 *  (finale.js + render/earthView.js) needs the longer pull to read; skip
 *  path unchanged (SKIP_TIME_SCALE compresses the full sequence). */
export const GOAL_ASCEND_S = 7.0;
/** Ascension target height = ascendBaseY + GOAL_ASCEND_HEIGHT_K * radiusSim. */
export const GOAL_ASCEND_HEIGHT_K = 40;
/** AFTERGLOW hang time (s) before finale.state === 'done' (main emits game:win). */
export const AFTERGLOW_S = 2.5;
/** Min POST-normalization elevation (rad) of every tiers.js moonDir (asserted there).
 *  v3: the sky-dome moon stays as a NIGHT COSMETIC (uMoonFade always 1) — not deprecated. */
export const MOON_DIR_MIN_ELEV = 0.15;

/* v3 integration: the @deprecated moon-era alias block (Phase-0 migration
 * protocol) is RETIRED. MOON_DIR_MIN_ELEV above is the single permanent
 * exemption (night-sky moon cosmetic — see docs/DESIGN-V3.md 退役計画). */

/* ================================================================== */
/* v3 Shop / terrain (world/terrain.js, render/cameraRig.js)           */
/* ================================================================== */

/** Shop walls/prisms release at this true radius (m): collide() early-outs,
 *  terrainMesh zero-scales over 0.6s, curated y-drops elevated placements over
 *  the same 0.6s; camera boom clamp deactivates only AFTER the fade completes.
 *  One-shot — the single sanctioned structural handoff (exemptions ledger). */
export const SHOP_TERRAIN_RELEASE_M = 4.0;
/** Interior camera profile: CAM_DIST_K * this (~4.0) while interiorAt01 = 1. */
export const INTERIOR_CAM_DIST_MUL = 0.62;
/** Interior camera profile: CAM_HEIGHT_K * this (~4.5) — closer and more top-down. */
export const INTERIOR_CAM_HEIGHT_MUL = 1.4;
/** interiorAt01 crossfade time constant (s). */
export const INTERIOR_FADE_S = 0.5;
/** clampCameraBoom shortens the boom to nearest hit minus this * radiusSim. */
export const CAM_WALL_MARGIN_K = 0.5;
/** Real-meter fog-far floor (environment.js applies at query time): the 8m
 *  shop is never fog-swallowed at r = 2cm. Pairs with LOAD_RADIUS_MIN_M. */
export const FOG_FAR_MIN_M = 9.0;
/** Real-meter load-radius floor (spawner ring math + curated activation):
 *  1.25 * FOG_FAR_MIN_M so fog < load holds everywhere (tiers.js asserts the
 *  floored pair at each tier's worst-case worldScale). */
export const LOAD_RADIUS_MIN_M = 11.25;
/** Shop wall thickness (REAL meters). */
export const WALL_THICK_M = 0.12;
/** Shop wall top height (REAL meters) — roofless above. */
export const WALL_TOP_M = 2.2;
/** Interior item height cap (REAL meters): ALL shop placements have y <= this. */
export const INTERIOR_ITEM_Y_MAX = 0.7;

/* ================================================================== */
/* v3 Map bounds / edge (config/cityMap.js re-exports MAP_BOUNDS)      */
/* ================================================================== */

/** Diorama bounds rect (REAL meters); ball center hard-clamped by terrain.js.
 *  Single source of truth — cityMap.js re-exports this object verbatim. */
export const MAP_BOUNDS = Object.freeze({
  x: Object.freeze([-1800, 1800]),
  z: Object.freeze([-1800, 2000]),
});
/** Soft deceleration band starts this many * radiusSim inside the edge. */
export const EDGE_SOFT_BAND_K = 4.0;
/** Outward velocity *= this per 60Hz frame inside the soft band (continuous in radius). */
export const EDGE_DAMP_PER_FRAME = 0.85;

/* ================================================================== */
/* v3 Curated spawner / density (world/curated.js, world/spawner.js)   */
/* ================================================================== */

/** Curated round-robin: <= this many placements examined per frame. */
export const CURATED_UPDATE_BUDGET = 64;
/** Hard cap on total curated placements (validator-checked in cityMap.js). */
export const CURATED_PLACEMENT_CAP = 640;
/** Chunk-spawner per-band placement-count multiplier vs v2 (base value —
 *  bands 0..3; see DENSITY_K_BY_BAND for the Phase-3 per-band retune). */
export const DENSITY_K_V3 = 0.45;
/** Phase-3 retune (empirical, pacing model + driven runs): per-BAND density
 *  multipliers. Bands 2-3 keep 0.45 (the Akiba ramp needs supply); bands 4-6
 *  drop to 0.2 — paired with the growthKForObjR normalization below this is
 *  what keeps the 12m->420m half of the run inside the 5-8 min target. */
export const DENSITY_K_BY_BAND = Object.freeze([0.45, 0.45, 0.3, 0.3, 0.2, 0.2, 0.15]);
/** @param {number} band Chunk band 0..6. @returns {number} Density multiplier. */
export function densityKForBand(band) {
  return band >= 0 && band < DENSITY_K_BY_BAND.length ? DENSITY_K_BY_BAND[band] : DENSITY_K_V3;
}

/* ================================================================== */
/* v2 Dash (physics/ballPhysics.js, input/input.js)                    */
/* ================================================================== */

/** Gauge recharge: dashGauge01 += dt / DASH_RECHARGE_S (clamped 1; 'dashReady' on crossing). */
export const DASH_RECHARGE_S = 4.0;
/** Gauge gain per absorb (absorb.js, clamped 1; 'dashReady' edge stays in ballPhysics). */
export const DASH_ABSORB_GAIN = 0.03;
/** Dash burst duration (s) — cap/accel multipliers apply while dashTimer > 0. */
export const DASH_DURATION_S = 0.8;
/** Speed-cap multiplier while dashing. */
export const DASH_CAP_MUL = 2.2;
/** Acceleration multiplier while dashing. */
export const DASH_ACCEL_MUL = 1.8;
/** Dash impulse: vel += dir * DASH_IMPULSE_K * radiusSim. */
export const DASH_IMPULSE_K = 7.0;
/** Impulse dir = horizontal vel dir if |vel| >= frac * speedCap, else camera forward. */
export const DASH_DIR_SPEED_K = 0.3;
/** cameraRig additive FOV kick on 'dash' (deg, decays over DASH_DURATION_S). */
export const DASH_FOV_BONUS = 8;
/** Over-cap speed bleed: when |vel| > speedCap the EXCESS is retained by this
 *  factor per 60Hz frame instead of being clamped away in one substep —
 *  a dash tail glides out over ~0.25s (7r excess -> <0.5r in ~16 frames)
 *  instead of snapping -45% the instant dashTimer expires. Steady-state
 *  cruise sits ~0.5% above the cap (negligible; still radius-proportional). */
export const OVERCAP_BLEED_PER_FRAME = 0.85;

/* ================================================================== */
/* v2 Score / rank (game/runStats.js)                                  */
/* ================================================================== */

/** Per-object score = max(1, round(SCORE_SIZE_BASE * rel^SCORE_SIZE_POW))
 *  where rel = sizeReal / ballTrueRadius (scale-FREE — v2 retune: absolute
 *  meters made T5 worth >99% of the total and floored T0 at '+1'; relative
 *  size scores every band comparably: rel in (0, 1.3], typical absorb
 *  ~90-700pt, run totals ~200-600k so the flat bonuses below stay visible). */
export const SCORE_SIZE_BASE = 500;
export const SCORE_SIZE_POW = 1.4;
/** Combo multiplier = min(1 + COMBO_SCORE_K * (combo - 1), COMBO_SCORE_MAX_MUL). */
export const COMBO_SCORE_K = 0.10;
export const COMBO_SCORE_MAX_MUL = 3.0;
/** Flat bonus added when AbsorbEvent.rare (after combo multiplication). */
export const RARE_SCORE_BONUS = 5000;
/** Flat bonus on 'goalContact' (Skytree finale). */
export const GOAL_SCORE_BONUS = 20000;
/** Flat bonus per landmark singleton absorbed (EVT.LANDMARK, runStats). */
export const LANDMARK_SCORE_BONUS = 8000;
/** Time bonus = round(lerp(TIME_BONUS_MAX, 0, clamp01((timeS - FULL) / (ZERO - FULL)))). */
export const TIME_BONUS_MAX = 30000;
export const TIME_BONUS_FULL_S = 290;
export const TIME_BONUS_ZERO_S = 720;
/** Rank thresholds (sim seconds): S <= 290, A <= 400, B <= 540, C <= 720, else D.
 *  v3 ONE PACING TRUTH (docs/DESIGN-V3.md ティア表): GROWTH_K=10 kept; pacing
 *  authored via chunk density (DENSITY_K_BY_BAND) + the growthKForObjR
 *  normalization + finite-map travel legs.
 *  EMPIRICAL (Phase-3 driven-run retune, 2026-06-11): a frame-perfect greedy
 *  driven full run (agent-browser, seed 12345) reached goal contact at
 *  4:03 sim (243 s) — the practical optimal. S = ~1.2x optimal = 290 s;
 *  A = brisk clear (~1.65x), B/C = relaxed first-clear band (the 5-8 min
 *  first-clear target lands in A/B). TIME_BONUS spans the S edge (full at
 *  290 s) to the C edge (zero at 720 s). */
export const RANK_S_S = 290;
export const RANK_A_S = 400;
export const RANK_B_S = 540;
export const RANK_C_S = 720;

/* ================================================================== */
/* v3 Feedback — absorb names / collection (ui/hud.js, game/collection.js) */
/* ================================================================== */

/** Per-archetype float merge window (s): a repeat absorb of the same code
 *  rewrites the live span to `+${sum} ネジ x3` and restarts its animation. */
export const FLOAT_MERGE_S = 0.30;
/** Visible float-span caps (rare/collectible/landmark always allocate, evict oldest). */
export const MAX_FLOATS_MOBILE = 3;
export const MAX_FLOATS_DESKTOP = 6;
/** #collect-popup card auto-out (s). */
export const COLLECT_POPUP_S = 3.5;
/** Collection denominator shown in UI (album mask is append-only beyond it).
 *  v5: 12 -> 13 (id 12 スタックチャン, code 110 via collectibleCodeForId —
 *  old 12-bit masks load unchanged, bit 12 simply starts unfound). */
export const COLLECT_TOTAL = 13;
/** Pre-rendered collectible thumbnail size (px, data-URL canvases). */
export const THUMB_SIZE_PX = 96;

/* ================================================================== */
/* v3 Donack commentator (ui/donack.js, config/donackLines.js)         */
/* ================================================================== */

/** Bubble auto-dismiss (s); landmarks/finale use the longer show. */
export const DONACK_SHOW_S = 4.5;
export const DONACK_SHOW_LANDMARK_S = 6.0;
/** Min gap since last bubble DISMISSED (s) per priority class (P3 bypasses).
 *  Phase-3 cadence retune (driven-run measurement, 2026-06-11): at 8/4 an
 *  absorb-dense run averaged a 12 s show-to-show gap (felt like spam); with
 *  16/10 the show-to-show floor is DONACK_SHOW_S + gap = ~20.5 s for P0/P1
 *  and ~14.5 s for P2, putting the mid-game average at/above 20 s. */
export const DONACK_GAP_P01_S = 16;
export const DONACK_GAP_P2_S = 10;
/** Per-id tip cooldown (s) — tips are the only repeatable lines. */
export const DONACK_TIP_COOLDOWN_S = 30;
/** Idle-stuck hint after this long with no absorb (s, 1Hz internal check). */
export const DONACK_IDLE_HINT_S = 10;
/** Full-dash-gauge-unused hint after this long (s). */
export const DONACK_DASH_HINT_S = 12;
/** Blink frame toggle rate (frame-0/frame-3 class swap, only while visible). */
export const DONACK_BLINK_FPS = 4;
/** scripts/verify-donack-assets.sh: sum of the 8 shipped webp files <= this. */
export const DONACK_ASSET_BUDGET_KB = 40;

/* ================================================================== */
/* v2 Rares (world/spawner.js)                                         */
/* ================================================================== */

/** Rare promotion chance per placement. rareRoll is drawn LAST in the
 *  per-placement draw order '(jx, jz, archRoll, sizeRoll, yawRoll,
 *  paletteRoll[, tumble x3], rareRoll)', UNCONDITIONALLY for every placement
 *  (determinism survives role changes). Landmark slots [8]/[9] are excluded. */
export const RARE_CHANCE = 0.002;
/** Rare instances are scaled up by this. */
export const RARE_SCALE_MUL = 1.15;
/** Rare instanceColor override (golden). */
export const RARE_TINT = 0xffd84a;
/** Alive-rare list capacity (entries; backing Int32Array(2 * CAP) of (storeIdx, slotGen)).
 *  Overflow policy: oldest entry stops sparkling — cosmetic-only degradation. */
export const RARE_LIST_CAP = 32;

/* ================================================================== */
/* v3 Persistence (localStorage)                                       */
/* ================================================================== */

/** Best records, schema {v:1, bestTime:BestRecord|null, bestScore:BestRecord|null}.
 *  v3 key bump — v2 bests retired (pacing/ranks incomparable). */
export const LS_BEST_KEY = 'fableKatamari.v3.best';
/** Mute flag ('1'/'0') — read by main.js BEFORE constructing Bgm/Sfx. */
export const LS_MUTE_KEY = 'fableKatamari.v3.muted';
/** Collection album, schema {v:1, mask:int} keyed by the FROZEN COLLECTIBLE_IDS
 *  (append-only ids 12+; ids never reused/reordered; unknown high bits preserved). */
export const LS_COLLECTION_KEY = 'fableKatamari.v3.collection';
/** Donack commentary OFF flag ('1' = off) — title-screen #donack-toggle. */
export const LS_DONACK_KEY = 'fableKatamari.v3.donackOff';

/* ================================================================== */
/* Timestep                                                            */
/* ================================================================== */

/** Fixed physics timestep: 60 Hz with accumulator. */
export const FIXED_DT = 1 / 60;
/** Max physics substeps per render frame (excess accumulator time is dropped). */
export const MAX_SUBSTEPS = 3;
/** Clamp on raw frame delta (s) so tab-switch pauses don't explode the accumulator. */
export const MAX_FRAME_DT = 0.1;

/* ================================================================== */
/* Ball physics (physics/ballPhysics.js)                               */
/* ================================================================== */

/**
 * Acceleration = ACCEL_K * simRadius along camera-relative input (sim/s^2 per r).
 * MUST satisfy ACCEL_K * FIXED_DT * f/(1-f) >= SPEED_K (f = FRICTION_PER_FRAME)
 * or the SPEED_K cap is unreachable and cruise speed silently drops below it
 * (at 22 the ball cruised at ~4.2r, half the 8.5r cap — pickup rate halved).
 * 45 * (1/60) * 0.92/0.08 = 8.6r, so the cap binds (~0.6s ramp to cruise).
 */
export const ACCEL_K = 45;
/** Speed cap = SPEED_K * simRadius (sim/s per r) — identical screen-space feel at every scale. */
export const SPEED_K = 8.5;
/** Friction: vel *= FRICTION_PER_FRAME ^ (dt * 60). */
export const FRICTION_PER_FRAME = 0.92;
/** Ground y-spring natural frequency (rad/s): center y springs to radiusSim. */
export const BALL_Y_OMEGA = 16;
/** Ground y-spring damping ratio (<1 = slight overshoot for the absorb 'pop'). */
export const BALL_Y_ZETA = 0.6;
/** Each absorb multiplies the transient accel factor by this (mass feel). */
export const SLUGGISH_FACTOR = 0.97;
/**
 * Sluggishness returns toward 1.0 PROPORTIONALLY with this time constant (s):
 * ds/dt = (1 - s) / SLUGGISH_RECOVERY_S — a single dip recovers in ~1.5s and
 * deep dips recover fast at first, so absorb streaks never park the ball.
 */
export const SLUGGISH_RECOVERY_S = 1.5;
/** Hard floor on the sluggish multiplier — burst absorbs can never zero out accel. */
export const SLUGGISH_MIN = 0.6;
/** Boost (Shift / second touch): acceleration multiplier while held. */
export const BOOST_ACCEL_MUL = 1.5;
/** Boost: speed-cap multiplier while held. */
export const BOOST_CAP_MUL = 1.25;

/* ================================================================== */
/* Absorb / collision (physics/absorb.js)                              */
/* ================================================================== */

/** Absorbable when objRadius <= ABSORB_RATIO * ballRadius. NEVER tier-gated. */
export const ABSORB_RATIO = 0.65;
/**
 * Volume growth: newR = cbrt(R^3 + GROWTH_K * r^3). With the T0 catalog
 * (mean r^3 ~ 0.0076 sim^3) and PICKUP_FORGIVE_K below, GROWTH_K = 10 puts
 * tier 0 at ~60s / ~170 absorbs (mean gap ~0.35s, so combos actually fire).
 * Retune against a measured tier-0 playthrough, not arithmetic alone.
 */
export const GROWTH_K = 10;
/**
 * v3 Phase-3 growth normalization (CRITICAL pacing fix — the 4m->117m/3s
 * cascade): GROWTH_K=10 with ABSORB_RATIO 0.65 makes every near-threshold
 * absorb a x1.554 radius jump, and the capture rate scales ~R^2, so growth
 * was super-exponential wherever same-band supply was contiguous. The fix
 * tapers the effective volume multiplier by OBJECT REAL RADIUS — a
 * CONTINUOUS function of size (never tier-gated; seamlessness-law
 * compliant): K = 10 for objects <= 0.1 m (the whole shop interior keeps
 * its authored ~60s budget), easing down to a floor of 2 for objects
 * >= ~3.6 m. Curated LANDMARK/COLLECTIBLE slots are EXEMPT in absorb.js
 * (the authored ladder keeps its designed x1.554 jumps, incl. the BINDING
 * Tokyo Tower 262->406 finale ramp).
 */
export const GROWTH_K_FLOOR = 2;
export const GROWTH_NORM_REF_M = 0.1;
export const GROWTH_NORM_POW = 0.65;
/**
 * Effective growth multiplier for one absorbed object.
 * @param {number} objRealM Object bounding radius in REAL meters.
 * @returns {number} K in [GROWTH_K_FLOOR, GROWTH_K].
 */
export function growthKForObjR(objRealM) {
  if (objRealM <= GROWTH_NORM_REF_M) return GROWTH_K;
  const k = GROWTH_K * Math.pow(GROWTH_NORM_REF_M / objRealM, GROWTH_NORM_POW);
  return k < GROWTH_K_FLOOR ? GROWTH_K_FLOOR : k;
}
/**
 * Pickup forgiveness: for objects whose radius <= PICKUP_FORGIVE_MAX_RATIO *
 * ballRadius the absorb overlap test is widened by PICKUP_FORGIVE_K *
 * ballRadius — generous for clearly-smaller objects, honest near the
 * ABSORB_RATIO threshold (forgiven objects are always absorbable, so the
 * widened reach can never trigger a pushback). Continuous in radius.
 */
export const PICKUP_FORGIVE_K = 0.45;
export const PICKUP_FORGIVE_MAX_RATIO = 0.5;
/** Visual radius slew limit: radiusVisualSim approaches radiusSim at <= RADIUS_SLEW_K * r per second. */
export const RADIUS_SLEW_K = 1.5;
/** Pushback: normal velocity reflected * this; tangential preserved. */
export const BOUNCE_RESTITUTION = 0.35;
/** Impact speed > BONK_SPEED_FRAC * speedCap => bonk (shake + clonk + knock-off). */
export const BONK_SPEED_FRAC = 0.7;
/** Knock-off ejects between MIN and MAX of the NEWEST stuck objects. */
export const KNOCKOFF_MIN = 1;
export const KNOCKOFF_MAX = 3;
/** Ballistic pop speed of ejected objects, in ball simRadius units per second. */
export const KNOCKOFF_POP_SPEED_K = 2.5;
/** Rapid-absorb combo resets after this gap (drives rising-pitch sfx + HUD combo). */
export const COMBO_WINDOW_S = 1.5;

/* ================================================================== */
/* Camera (render/cameraRig.js)                                        */
/* ================================================================== */

/** Camera distance behind ball = CAM_DIST_K * simRadius. */
export const CAM_DIST_K = 6.5;
/** Camera height above ball = CAM_HEIGHT_K * simRadius. */
export const CAM_HEIGHT_K = 3.2;
/** Look target = ballPos + vel * CAM_LOOKAHEAD_S (look-ahead sells speed). */
export const CAM_LOOKAHEAD_S = 0.4;
/** Critically-damped spring stiffness (omega, rad/s) for camera POSITION. The LAG is the growth feedback. */
export const CAM_POS_OMEGA = 6.0;
/** Spring stiffness for camera LOOK target. */
export const CAM_LOOK_OMEGA = 4.5;
/** Base vertical FOV in degrees. */
export const FOV_BASE = 60;
/** tierUp celebration: FOV kicks FOV_BASE -> FOV_KICK_PEAK -> FOV_BASE over FOV_KICK_S. */
export const FOV_KICK_PEAK = 68;
export const FOV_KICK_S = 0.8;
/** Extra FOV degrees added above FOV_SPEED_FRAC of speed cap. */
export const FOV_SPEED_BONUS = 4;
export const FOV_SPEED_FRAC = 0.8;
/** Bonk micro-shake: amplitude = SHAKE_AMP_K * simRadius, exponential decay over SHAKE_DECAY_S. */
export const SHAKE_AMP_K = 0.15;
export const SHAKE_DECAY_S = 0.25;

/* ================================================================== */
/* Environment / fog (render/environment.js)                           */
/* ================================================================== */

/** Fog near = FOG_NEAR_K * simRadius. */
export const FOG_NEAR_K = 14;
/** Fog far = FOG_FAR_K * simRadius. Must stay inside the spawn ring (asserted in config/tiers.js). */
export const FOG_FAR_K = 55;
/** Tier palette (fog/sky) crossfade duration on tierUp. Cosmetic only. */
export const PALETTE_FADE_S = 2.0;

/* ================================================================== */
/* Spawner (world/spawner.js)                                          */
/* ================================================================== */

/** Amortization budgets — hard per-frame caps. */
export const SPAWN_BUDGET_PER_FRAME = 64;
export const DESPAWN_BUDGET_PER_FRAME = 64;
/** Max InstancedMesh per-instance matrix writes per frame (render-side budget). */
export const INSTANCE_WRITE_BUDGET = 64;
/** Sub-pixel despawn: objDiameter < SUBPIXEL_RATIO * ballRadius => 0.6s scale-fade out. */
export const SUBPIXEL_RATIO = 0.04;
/** Round-robin sub-pixel sweep examines this many objects per frame. */
export const SUBPIXEL_SWEEP_BUDGET = 200;
/** Pre-warm N+2 chunks beyond the fog wall at this fraction of the tier threshold. */
export const PREWARM_FRACTION = 0.70;
/** N+1 scenery band: load radius (sim units) and per-chunk density.
 *  v2: 8 -> 10 (peak population arithmetic: 2000 target + ~600 scenery +
 *  ~250 capped pre-warm + <=1200 leftovers ≈ 4050 < ALIVE_TOTAL_BUDGET 4096).
 *  One-line revert to 8 if the 0.9-budget DEV warn fires in Phase 3. */
export const SCENERY_LOAD_RADIUS_SIM = 140;
export const SCENERY_OBJECTS_PER_CHUNK = 10;
/** Alive-population budgets (soft, monitored in dev overlay).
 *  v2: ALIVE_SCENERY_BUDGET deleted (dead constant — never imported).
 *  Spawner DEV-warns when aliveCount > 0.9 * ALIVE_TOTAL_BUDGET. */
export const ALIVE_TARGET_BUDGET = 2000;   // tier N targets
export const ALIVE_LEFTOVER_BUDGET = 1200; // tier N-1 leftovers, falling
export const ALIVE_TOTAL_BUDGET = 4096;    // hard total
/** ObjectStore SoA capacity. */
export const STORE_CAPACITY = 8192;

/* ================================================================== */
/* Fades / transitions (all animate instance-matrix SCALE, never opacity) */
/* ================================================================== */

/** Belt-and-suspenders scale-up for any spawn landing inside fog range. */
export const SPAWN_FADE_S = 0.4;
/** Ring-exit despawn scale-fade. */
export const DESPAWN_FADE_S = 0.4;
/** Sub-pixel despawn scale-fade. */
export const SUBPIXEL_FADE_S = 0.6;

/* ================================================================== */
/* Stuck objects / ball (render/ball.js)                               */
/* ================================================================== */

/** Attach animation: world slot lerps to ball-surface socket over this, ease-out. */
export const ATTACH_ANIM_S = 0.15;
/** Squash scale at attach start (1.15 -> 1.0). */
export const ATTACH_SQUASH = 1.15;
/** Socket distance = simRadius * ATTACH_EMBED_K (8% embedded). */
export const ATTACH_EMBED_K = 0.92;
/** Total stuck-pool ring-buffer capacity across the 8 archetype families. */
export const STUCK_CAP = 512;
/** Burial cull: attachRadiusSim + objHalfSim < BURIAL_RATIO * currentSimRadius => reclaim. */
export const BURIAL_RATIO = 0.98;
/** Also cull stuck objects whose relative size drops below this (sub-pixel on ball). */
export const BURIAL_MIN_REL = 0.02;
/** Burial culls are staggered over this window so a tier jump never molts visibly. */
export const BURIAL_STAGGER_S = 1.0;
/** Ball core base color lerps this fraction toward each absorbed object's color. */
export const BALL_COLOR_LERP = 0.10;

/* ================================================================== */
/* Spatial hash (world/spatialHash.js)                                 */
/* ================================================================== */

/** Hash table size (power of two; key & (SIZE-1)). */
export const HASH_TABLE_SIZE = 16384;
/** 2D hash key primes: ((xi * PRIME_X) ^ (zi * PRIME_Z)) & (HASH_TABLE_SIZE - 1). */
export const HASH_PRIME_X = 73856093;
export const HASH_PRIME_Z = 19349663;
/** Opportunistic rebuild when tombstones exceed this fraction of entries. */
export const TOMBSTONE_REBUILD_FRAC = 0.25;

/* ================================================================== */
/* Renderer (render/renderer.js)                                       */
/* ================================================================== */

/** devicePixelRatio cap. */
export const PIXEL_RATIO_MAX = 1.5;
/** Dynamic-resolution governor: drop toward 1.0 if rolling avg frame > this (ms). */
export const FRAME_BUDGET_MS = 17;
/** Rolling window for the governor (s). */
export const GOVERNOR_WINDOW_S = 3;
/** Budget ceilings (dev-overlay warnings, not runtime behavior).
 *  Worst-case ledger (4-band tier-transition):
 *    40 world InstancedMesh (4 live bands x 10 archetypes)
 *  +  8 stuck-on-ball families
 *  +  6 fixed (sky dome, ground, ball core, effects quads, ... )
 *  +  1 backdrop silhouette ring
 *  +  2 skytree (goalTower mesh + glow, fog:false sky-element exemption)
 *  +  1 terrainMesh (shop walls/prisms, one merged vertex-colored mesh)
 *  +  2 bay water quad + quay-wall strip
 *  +  4 shared EXTRA InstancedPools (collectible-small / landmark-mid /
 *       landmark-large / landmark-XL — size-class partition, NOT per-archetype)
 *  = 64 worst case -> CAP 72 (headroom for future passes). */
export const DRAW_CALL_CAP = 72;
export const TRI_BUDGET = 600000;
/** Per-archetype merged-geometry triangle cap (asserted at boot in dev). */
export const ARCHETYPE_TRI_CAP = 350;

/* ================================================================== */
/* UI                                                                  */
/* ================================================================== */

/** HUD odometer update throttle ('grow' event emission rate). */
export const HUD_THROTTLE_HZ = 10;

/* ================================================================== */
/* Model quality (catalog.js, geometryFactory.js, objectMaterial.js)   */
/* ================================================================== */

/** Hero-pass per-id tri cap (the 12 frozen HERO_ARCHETYPE_IDS in catalog.js;
 *  all other archetypes keep ARCHETYPE_TRI_CAP 350). Asserted per id at boot
 *  in dev. First over-budget lever: 600 -> 500. */
export const HERO_TRI_CAP = 600;
/** Shared-material rim term (objectMaterial.js onBeforeCompile):
 *  color.rgb += uRimK * pow(1-max(dot(n,v),0), 3) * uRimTint (sky-tinted,
 *  updated on palette crossfade). View/normal-direction-dependent only ->
 *  invariant under the uniform similarity rescale. KILL SWITCH: 0. */
export const RIM_K = 0.18;
/** bakeSimpleAO default strength k (geometryFactory, boot-time only —
 *  vertical occlusion gradient + underside -25% value; per catalog entry
 *  override). GLOBAL KILL SWITCH: 0. */
export const AO_BAKE_DEFAULT = 0.3;

/* ------------------------------------------------------------------ */
/* v4 JS bundle budget                                                 */
/* ------------------------------------------------------------------ */

/** Gzipped JS bundle budget (KB), measured at `npm run build`.
 *  FINAL (Phase-0 measured stub spike, 2026-06-11):
 *    v3 baseline                          205.42 KB gz
 *    + Phase-0 skeleton (no-op stubs)     205.65 KB gz (+0.2)
 *    + realistic-structure stub classes   209.52 KB gz (+3.9 — condensed
 *      OsmWorld decode/fetch + OsmSpawner ring/admission + osmPools +
 *      OsmGround + rim material + 16 voxel builders, ~600 source lines)
 *  Real implementations run ~3-5x the stub's source density (comments,
 *  asserts, full LOD/bitmask/fade paths) -> extrapolated full v4 delta
 *  +15-25 KB, consistent with the design's honest +20-30 KB expectation.
 *  BUDGET FROZEN AT 240 (= baseline + ~34 KB headroom). Checked at every
 *  integration build; first lever if threatened: strip DEV-only asserts
 *  behind import.meta.env.DEV (tree-shaken in prod already). */
export const JS_GZ_BUDGET_KB = 240;
