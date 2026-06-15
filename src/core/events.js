/**
 * @file events.js — Tiny pub/sub bus with REUSED payload objects.
 *
 * The ONLY cross-module channel besides constructor injection. Zero-allocation
 * discipline: emitters mutate the matching pre-allocated object in PAYLOADS
 * and pass it to emit(); handlers treat payloads as READ-ONLY and must never
 * retain them (the same object is reused on the next emit).
 *
 * Contract (exhaustive — see src/types.js for payload typedefs):
 *   'game:start' {}   'game:reset' {}   'game:win' {trueRadius, seed}
 *   'absorb'   {objIndex, archetypeId, sizeReal, combo, trueRadius, count, rare}
 *   'grow'     {trueRadius, simRadius, progress01ToNextTier, dashGauge01} (throttled 10Hz)
 *   'bounce'   {impactSpeed01}
 *   'knockOff' {count}
 *   'tierUp'   {tierIndex, name, trueRadius}                    (COSMETIC ONLY)
 *   'rescale'  {S}
 *   'rebase'   {sx, sz}   (floating-origin shift subtracted from the world)
 *   'frameStats' {ms, drawCalls, tris, alive}                   (dev builds)
 *   ---- v2 (moon update — docs/DESIGN-V2.md §インターフェース) ----
 *   'dash'        {gauge01}                       (ballPhysics -> cameraRig kick, effects burst, sfx whoosh, hud zero)
 *   'dashReady'   {}                              (ballPhysics, once per refill -> hud flash, sfx chime)
 *   'score'       {score, delta, combo, rare, archetypeCode} (runStats -> hud, sfx when rare)
 *   'time'        {timeS}                         (runStats, on 0.1s SIM-boundary -> hud)
 *   'goal'        {timeS, score, rank, trueRadius, absorbed, raresFound, seed, newRecordTime, newRecordScore, collectFound} (runStats once -> screens cache + X URL build)
 *   'ui:muteRequest' {}                           (hud -> main, the single mute owner)
 *   'muteChanged' {muted}                         (main -> hud icon)
 *   ---- v3 (Hakoniwa Tokyo — docs/DESIGN-V3.md §インターフェース) ----
 *   'goalCall'    {trueRadius}                    (finale once -> hud toast 「スカイツリーが呼んでいる…！」, skytree beam pulse, bgm swell, sfx pad)
 *   'goalGuide'   {x01, y01, onScreen, active, kind} (finale 10Hz during APPROACH, +one active:false on CONTACT -> hud #goal-arrow; v5: onboarding emits kind:'parts' for the opening parts guide — hud swaps 🗼->🔩 and suppresses the tower toast)
 *   'goalContact' {}                              (finale once = run end -> runStats freeze+GOAL, bgm duck, sfx fanfare, hud hide, screens flash; #donack-root survives — outside #hud)
 *   'landmark'    {landmarkId, nameJa, sizeReal}  (curated, AFTER the normal ABSORB chain -> hud toast, effects gold ring, sfx fanfare sting, Donack trivia, runStats bonus)
 *   'collect'     {collectibleId, nameJa, isNew, found, total} (collection -> #collect-popup, Donack, sfx gliss)
 *   ---- v4 (Real Tokyo — docs/DESIGN-V4.md §インターフェース) ----
 *   'osmReady'    {buildings}                     (osmWorld, once after both shards decode -> main: cityMap.setOsmCoverageActive(true) + arms osmSpawner; debug overlay)
 *
 * v3 CONTRACT NOTES (binding — docs/DESIGN-V3.md; v4 EXTENDS the order):
 *  - FROZEN ABSORB subscription order at boot (v4, docs/DESIGN-V4.md):
 *      chunk spawner -> curated -> osmSpawner -> main attach (render/ball;
 *      sets store.instanceSlot = -1 when it steals the world instance) ->
 *      runStats -> collection -> sfx/effects/hud.
 *    The chunk spawner's handler is bookkeeping ONLY and skips
 *    FLAG_CURATED|FLAG_OSM slots; curated keeps FLAG_RARE/identity valid
 *    THROUGH its ABSORB handler and defers slot bookkeeping to its next
 *    update() tick; osmSpawner follows the SAME deferred convention (sets
 *    its consumed bit, defers slot bookkeeping one tick); because main's
 *    attach-handler runs AFTER curated/osmSpawner, neither curated's nor
 *    osmSpawner's ABSORB handler may read instanceSlot — only their
 *    consumed bitmasks (slot-steal convention). OSM render slots live in
 *    osmPools (render/osmPools.js), invisible to main's chunk-code
 *    POOL_BY_CODE — exclusive ownership like EXTRA codes.
 *  - DUAL-TAG rule: an object carrying BOTH collectibleId and landmarkId
 *    (ハチ公像) emits EVT.COLLECT FIRST, then EVT.LANDMARK, in the same
 *    frame. sfx plays the landmark fanfare ONLY (one boolean suppresses the
 *    collect gliss when both fire within one frame); Donack shows the single
 *    merged line #42.
 *  - 'game:win' is emitted by MAIN.JS when finale.state === 'done'.
 *  - 'goal' fields must be COPIED by subscribers (payload is reused like all
 *    others; screens.js caches a field-by-field copy).
 *  - v3 integration: the @deprecated moon-era alias layer (Phase-0 migration
 *    protocol) has been RETIRED — use the GOAL_* names only.
 */

/** Frozen event-name constants — always use these, never string literals. */
export const EVT = Object.freeze({
  GAME_START: 'game:start',
  GAME_RESET: 'game:reset',
  GAME_WIN: 'game:win',
  ABSORB: 'absorb',
  GROW: 'grow',
  BOUNCE: 'bounce',
  KNOCK_OFF: 'knockOff',
  TIER_UP: 'tierUp',
  RESCALE: 'rescale',
  REBASE: 'rebase',
  FRAME_STATS: 'frameStats',
  // ---- v2 (moon update) ----
  DASH: 'dash',
  DASH_READY: 'dashReady',
  SCORE: 'score',
  TIME: 'time',
  GOAL: 'goal',
  MUTE_REQUEST: 'ui:muteRequest',
  MUTE_CHANGED: 'muteChanged',
  // ---- v3 (Hakoniwa Tokyo) ----
  GOAL_CALL: 'goalCall',
  GOAL_GUIDE: 'goalGuide',
  GOAL_CONTACT: 'goalContact',
  LANDMARK: 'landmark',
  COLLECT: 'collect',
  // ---- v4 (Real Tokyo) ----
  OSM_READY: 'osmReady',
});

/**
 * Pre-allocated, reused payload objects — one per event type. Emitters write
 * fields then call bus.emit(EVT.X, PAYLOADS.x). NEVER allocate payloads in
 * per-frame code. (Shapes mirror the typedefs in src/types.js.)
 */
export const PAYLOADS = {
  /** @type {import('../types.js').GameStartEvent} */
  gameStart: {},
  /** @type {import('../types.js').GameResetEvent} */
  gameReset: {},
  /** @type {import('../types.js').GameWinEvent} */
  gameWin: { trueRadius: 0, seed: 0 },
  /** @type {import('../types.js').AbsorbEvent} */
  absorb: {
    objIndex: 0,
    archetypeId: '',
    sizeReal: 0,
    combo: 0,
    trueRadius: 0,
    count: 0,
    rare: false,
    // v3: stamped by absorb.js BEFORE store.free, next to the rare stamp.
    archetypeCode: -1,
    collectibleId: -1,
  },
  /** @type {import('../types.js').GrowEvent} */
  grow: { trueRadius: 0, simRadius: 0, progress01ToNextTier: 0, dashGauge01: 1 },
  /** @type {import('../types.js').BounceEvent} */
  bounce: { impactSpeed01: 0 },
  /** @type {import('../types.js').KnockOffEvent} */
  knockOff: { count: 0 },
  /** @type {import('../types.js').TierUpEvent} */
  tierUp: { tierIndex: 0, name: '', trueRadius: 0 },
  /** @type {import('../types.js').RescaleEvent} */
  rescale: { S: 0 },
  /** @type {{sx: number, sz: number}} Floating-origin rebase shift (integer-snapped sim units). */
  rebase: { sx: 0, sz: 0 },
  /** @type {import('../types.js').FrameStatsEvent} */
  frameStats: { ms: 0, drawCalls: 0, tris: 0, alive: 0 },
  // ---- v2 (moon update) ----
  /** @type {import('../types.js').DashEvent} */
  dash: { gauge01: 0 },
  /** @type {import('../types.js').DashReadyEvent} */
  dashReady: {},
  /** @type {import('../types.js').ScoreEvent} */
  score: { score: 0, delta: 0, combo: 0, rare: false, archetypeCode: -1 },
  /** @type {import('../types.js').TimeEvent} */
  time: { timeS: 0 },
  // ---- v3 (Hakoniwa Tokyo) ----
  /** @type {import('../types.js').GoalCallEvent} */
  goalCall: { trueRadius: 0 },
  /** @type {import('../types.js').GoalGuideEvent} */
  goalGuide: { x01: 0, y01: 0, onScreen: false, active: false, kind: 'goal' },
  /** @type {import('../types.js').GoalContactEvent} */
  goalContact: {},
  /** @type {import('../types.js').LandmarkEvent} */
  landmark: { landmarkId: -1, nameJa: '', sizeReal: 0 },
  /** @type {import('../types.js').CollectEvent} */
  collect: { collectibleId: -1, nameJa: '', isNew: false, found: 0, total: 12 },
  /** @type {import('../types.js').GoalEvent} */
  goal: {
    timeS: 0,
    score: 0,
    rank: '',
    trueRadius: 0,
    absorbed: 0,
    raresFound: 0,
    seed: 0,
    newRecordTime: false,
    newRecordScore: false,
    collectFound: 0, // v3: collection.foundCount at GOAL emit
  },
  /** @type {import('../types.js').MuteRequestEvent} */
  muteRequest: {},
  /** @type {import('../types.js').MuteChangedEvent} */
  muteChanged: { muted: false },
  // ---- v4 (Real Tokyo) ----
  /** @type {import('../types.js').OsmReadyEvent} */
  osmReady: { buildings: 0 },
};

/**
 * Minimal synchronous pub/sub. Handlers are invoked in subscription order.
 * NOTE: do not on()/off() the SAME event from inside one of its handlers
 * during dispatch (takes effect immediately and may skip/repeat — none of
 * our subscribers need this; subscribe once at boot).
 */
export class EventBus {
  constructor() {
    /** @type {Map<string, Function[]>} */
    this._handlers = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} name Event name (use EVT constants).
   * @param {(payload: object) => void} handler Receives the REUSED payload — read-only, never retain.
   * @returns {(payload: object) => void} The handler (for symmetric off()).
   */
  on(name, handler) {
    let arr = this._handlers.get(name);
    if (arr === undefined) {
      arr = [];
      this._handlers.set(name, arr);
    }
    arr.push(handler);
    return handler;
  }

  /**
   * Unsubscribe a handler.
   * @param {string} name Event name.
   * @param {(payload: object) => void} handler Previously registered handler.
   */
  off(name, handler) {
    const arr = this._handlers.get(name);
    if (arr === undefined) return;
    const idx = arr.indexOf(handler);
    if (idx !== -1) arr.splice(idx, 1);
  }

  /**
   * Emit an event synchronously. Zero allocation: plain indexed loop, no
   * snapshot, no spread, no arguments juggling.
   * @param {string} name Event name (use EVT constants).
   * @param {object} [payload] The matching PAYLOADS object (mutated in place by the emitter).
   */
  emit(name, payload) {
    const arr = this._handlers.get(name);
    if (arr === undefined) return;
    for (let i = 0; i < arr.length; i++) {
      arr[i](payload);
    }
  }
}

/** The single shared bus instance — inject this everywhere (one bus per game). */
export const bus = new EventBus();
