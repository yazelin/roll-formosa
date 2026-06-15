/**
 * @file runStats.js — run clock, score/combo/rare accounting, rank,
 * localStorage best records, and the single 'goal' emission
 * (docs/DESIGN-V2.md §ゲームシステム + docs/DESIGN-V3.md v3 deltas).
 *
 * SIM-TIME IS THE OFFICIAL CLOCK: main.js calls addSimTime(steps * FIXED_DT)
 * once per render frame (frame step 6.5) — deterministic, naturally paused in
 * TITLE/WIN, frozen by an internal flag on 'goalContact'. Slow devices
 * simulate slower in wall time but ranks stay deterministic and fair per
 * simulated second. 'time' {timeS} is emitted whenever timeS crosses the next
 * 0.1 s SIM boundary (never performance.now) -> HUD timer.
 *
 * SCORE (on 'absorb' — BINDING v3 subscription order at boot: chunk spawner
 * -> curated -> main attach-handler -> THIS -> collection -> sfx/effects/hud):
 *   objScore = max(1, round(SCORE_SIZE_BASE * (sizeReal/trueRadius)^SCORE_SIZE_POW))
 *   comboMul = min(1 + COMBO_SCORE_K * (combo - 1), COMBO_SCORE_MAX_MUL)
 *   delta    = round(objScore * comboMul) + (rare ? RARE_SCORE_BONUS : 0)
 * then 'score' {score, delta, combo, rare, archetypeCode} is emitted (reused
 * payload; archetypeCode is the v3 pass-through from AbsorbEvent — hud renders
 * the absorb-name floats from it). objScore is RELATIVE (object size / ball
 * radius) — every tier band contributes comparably, totals land in 6 digits,
 * and the flat RARE/LANDMARK/GOAL/TIME bonuses stay meaningful at goal.
 *
 * v3 LANDMARK BONUS (on 'landmark', emitted by curated AFTER the normal
 * ABSORB chain): score += LANDMARK_SCORE_BONUS, then one extra 'score' emit
 * (delta = the bonus, combo 1, rare false, archetypeCode -1) so the HUD panel
 * + a plain '+8,000' float update immediately; cosmetic consumers keyed on
 * rare/combo see neutral values.
 *
 * GOAL FLOW (on 'goalContact', once): freeze the clock, add GOAL_SCORE_BONUS
 * + timeBonus = round(lerp(TIME_BONUS_MAX, 0, clamp01((timeS - FULL) /
 * (ZERO - FULL)))), rank S/A/B/C/D by RANK_*_S (v3: S240/A330/B450/C600 —
 * EMPIRICAL, Phase-3 >= 3-playthrough retune mandatory), stamp
 * GoalEvent.collectFound from the injected collection, persist bests to
 * localStorage LS_BEST_KEY (v3 key; schema {v:1, bestTime:BestRecord|null,
 * bestScore:BestRecord|null} — each sub-record replaced ATOMICALLY when its
 * metric improves, so fields within one record always come from the same
 * run), emit 'goal' once.
 *
 * Persistence is fully try/catch-wrapped (private-mode / quota / no-DOM safe)
 * and loadBest() returns null on ANY anomaly (parse error, wrong version,
 * malformed records). Zero per-frame allocation: the hot paths (addSimTime,
 * the absorb handler) are arithmetic + reused PAYLOADS only; the goal path
 * runs once per run and may allocate freely.
 */

import {
  SCORE_SIZE_BASE,
  SCORE_SIZE_POW,
  COMBO_SCORE_K,
  COMBO_SCORE_MAX_MUL,
  RARE_SCORE_BONUS,
  GOAL_SCORE_BONUS,
  LANDMARK_SCORE_BONUS,
  TIME_BONUS_MAX,
  TIME_BONUS_FULL_S,
  TIME_BONUS_ZERO_S,
  RANK_S_S,
  RANK_A_S,
  RANK_B_S,
  RANK_C_S,
  LS_BEST_KEY,
} from '../config/tuning.js';
import { EVT, PAYLOADS } from '../core/events.js';

/** @typedef {import('../types.js').BestRecord} BestRecord */
/** @typedef {import('../types.js').AbsorbEvent} AbsorbEvent */

/** Valid rank letters (loadBest validation). */
const RANKS = 'SABCD';

/**
 * Validate one persisted best record.
 * @param {*} r Candidate from JSON.parse.
 * @returns {BestRecord|null|undefined} Normalized record, null (legitimately
 *   absent), or undefined when MALFORMED (caller treats the whole blob as bad).
 */
function validateRecord(r) {
  if (r === null || r === undefined) return null;
  if (typeof r !== 'object') return undefined;
  if (typeof r.timeS !== 'number' || !Number.isFinite(r.timeS) || r.timeS < 0) return undefined;
  if (typeof r.score !== 'number' || !Number.isFinite(r.score)) return undefined;
  if (typeof r.rank !== 'string' || r.rank.length !== 1 || RANKS.indexOf(r.rank) === -1) {
    return undefined;
  }
  if (typeof r.seed !== 'number' || !Number.isFinite(r.seed)) return undefined;
  return { timeS: r.timeS, score: r.score, rank: r.rank, seed: r.seed >>> 0 };
}

/**
 * Run statistics: sim clock, score, rares, rank, best persistence, 'goal'.
 *
 * Construction order is BINDING: main.js constructs this AFTER its own
 * 'absorb' attach-handler subscription and BEFORE sfx/effects/hud, so the
 * 'score' emit (synchronous, inside the 'absorb' dispatch) is observed by the
 * cosmetic consumers in the frozen order.
 */
export class RunStats {
  /**
   * @param {import('../core/events.js').EventBus} bus Shared event bus.
   * @param {{ trueRadiusMeters?: () => number }} [scaleMgr] ScaleManager —
   *   read once at goal for the final trueRadius. Optional (headless tests
   *   fall back to the last AbsorbEvent.trueRadius).
   * @param {number} [worldSeed] uint32 world seed (stamped onto 'goal' + bests).
   * @param {{ foundCount: number }} [collection] v3 injected Collection —
   *   read once at goal for GoalEvent.collectFound. Optional (0 fallback).
   */
  constructor(bus, scaleMgr, worldSeed = 0, collection = null) {
    /** @type {import('../core/events.js').EventBus} */
    this._bus = bus;
    /** @type {{ trueRadiusMeters?: () => number }|null} */
    this._scaleMgr = scaleMgr || null;
    /** @type {number} uint32 world seed. */
    this._seed = worldSeed >>> 0;
    /** @type {{ foundCount: number }|null} v3 album (GoalEvent.collectFound). */
    this._collection = collection || null;
    /** @type {boolean} Dev-start taint (?at=/?r= applied): records from such
     *  runs are never persisted as bests and never flagged NEW RECORD —
     *  keeps the shareable leaderboard honest while leaving the dev URLs
     *  usable on the live site. Deliberately NOT cleared by reset(): the dev
     *  params live in the URL and re-apply on every restart anyway. */
    this._devTainted = false;

    /** @type {number} Elapsed SIM seconds (the official clock). */
    this._timeS = 0;
    /** @type {number} Last 0.1s boundary index reported via 'time'. */
    this._lastTenth = 0;
    /** @type {boolean} Clock + score frozen (after 'goalContact'). */
    this._frozen = false;
    /** @type {boolean} 'goal' emitted (once-per-run latch). */
    this._goalEmitted = false;

    /** @type {number} Total score (combo + rare + landmark + goal bonuses included). */
    this._score = 0;
    /** @type {number} Total objects absorbed this run. */
    this._absorbed = 0;
    /** @type {number} Rare objects absorbed this run. */
    this._raresFound = 0;
    /** @type {number} Last seen trueRadius (m) — goal fallback when no scaleMgr. */
    this._lastTrueRadius = 0;

    bus.on(EVT.ABSORB, this._onAbsorb.bind(this));
    bus.on(EVT.LANDMARK, this._onLandmark.bind(this));
    bus.on(EVT.GOAL_CONTACT, this._onGoalContact.bind(this));
  }

  /**
   * Late-bind the v3 Collection (read once at goal). The frozen ABSORB order
   * constructs Collection AFTER RunStats, so main.js wires it here right
   * after `new Collection(bus)` instead of through the constructor arg.
   * @param {{ foundCount: number }} collection
   */
  setCollection(collection) {
    this._collection = collection || null;
  }

  /**
   * Mark this session as a dev start (?at=/?r= applied): best records are
   * not persisted and NEW RECORD never shows. Sticky for the session.
   */
  markDevRun() {
    this._devTainted = true;
  }

  /* ---------------------------------------------------------------- */
  /* Read-only accessors                                               */
  /* ---------------------------------------------------------------- */

  /** Elapsed sim seconds (frozen after contact). @returns {number} */
  get timeS() {
    return this._timeS;
  }

  /** Current total score. @returns {number} */
  get score() {
    return this._score;
  }

  /** Objects absorbed this run. @returns {number} */
  get absorbed() {
    return this._absorbed;
  }

  /** Rares absorbed this run. @returns {number} */
  get raresFound() {
    return this._raresFound;
  }

  /* ---------------------------------------------------------------- */
  /* Sim clock (main.js frame step 6.5)                                */
  /* ---------------------------------------------------------------- */

  /**
   * Accumulate simulated time and emit 'time' when a 0.1s sim boundary is
   * crossed. A frame adds at most MAX_SUBSTEPS * FIXED_DT = 0.05s, so at most
   * one boundary per call in practice (a larger jump still emits exactly one
   * 'time' carrying the latest timeS — the HUD only displays it).
   * @param {number} s Simulated seconds advanced this frame (steps * FIXED_DT).
   */
  addSimTime(s) {
    if (this._frozen || !(s > 0)) return;
    this._timeS += s;
    const tenth = Math.floor(this._timeS * 10);
    if (tenth !== this._lastTenth) {
      this._lastTenth = tenth;
      PAYLOADS.time.timeS = this._timeS;
      this._bus.emit(EVT.TIME, PAYLOADS.time);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Score accounting ('absorb' handler — hot path, zero allocation)   */
  /* ---------------------------------------------------------------- */

  /**
   * @param {AbsorbEvent} p Reused payload (read-only, not retained).
   */
  _onAbsorb(p) {
    if (this._frozen) return; // post-contact absorbs are impossible by gating, belt-and-suspenders
    // RELATIVE size: sizeReal is the object DIAMETER (m), trueRadius the ball
    // radius (m) — ratio range (0, ~1.3] (ABSORB_RATIO 0.65 on radii). The
    // ratio is scale-free, so a T0 eraser and a T5 stadium that look the same
    // on screen score the same — every band contributes comparably.
    const rel = p.trueRadius > 0 ? p.sizeReal / p.trueRadius : 0;
    const objScore = Math.max(1, Math.round(SCORE_SIZE_BASE * Math.pow(rel, SCORE_SIZE_POW)));
    let comboMul = 1 + COMBO_SCORE_K * (p.combo - 1);
    if (comboMul > COMBO_SCORE_MAX_MUL) comboMul = COMBO_SCORE_MAX_MUL;
    const rare = p.rare === true;
    const delta = Math.round(objScore * comboMul) + (rare ? RARE_SCORE_BONUS : 0);

    this._score += delta;
    this._absorbed = p.count;
    if (rare) this._raresFound++;
    this._lastTrueRadius = p.trueRadius;

    const sp = PAYLOADS.score;
    sp.score = this._score;
    sp.delta = delta;
    sp.combo = p.combo;
    sp.rare = rare;
    // v3 pass-through: hud renders `+${delta} ${DISPLAY_NAME_BY_CODE[code]}`.
    sp.archetypeCode = typeof p.archetypeCode === 'number' ? p.archetypeCode : -1;
    this._bus.emit(EVT.SCORE, sp);
  }

  /* ---------------------------------------------------------------- */
  /* v3 'landmark' handler (curated emits AFTER the normal ABSORB      */
  /* chain — the landmark's own absorb already scored above)           */
  /* ---------------------------------------------------------------- */

  /**
   * Flat LANDMARK_SCORE_BONUS + one 'score' emit so the HUD panel and a
   * plain bonus float update immediately. Neutral combo/rare/archetypeCode
   * (the named float for the landmark itself came from its absorb 'score').
   * @param {import('../types.js').LandmarkEvent} _p Reused payload (unused).
   */
  _onLandmark(_p) {
    if (this._frozen) return;
    this._score += LANDMARK_SCORE_BONUS;
    const sp = PAYLOADS.score;
    sp.score = this._score;
    sp.delta = LANDMARK_SCORE_BONUS;
    sp.combo = 1;
    sp.rare = false;
    sp.archetypeCode = -1;
    this._bus.emit(EVT.SCORE, sp);
  }

  /* ---------------------------------------------------------------- */
  /* Goal ('goalContact' handler — once per run, may allocate)         */
  /* ---------------------------------------------------------------- */

  _onGoalContact() {
    if (this._goalEmitted) return;
    this._goalEmitted = true;
    this._frozen = true; // CLEAR TIME instant — clock + score freeze here

    const timeS = this._timeS;

    /* Bonuses: flat goal bonus + linear time bonus. */
    let u = (timeS - TIME_BONUS_FULL_S) / (TIME_BONUS_ZERO_S - TIME_BONUS_FULL_S);
    if (u < 0) u = 0;
    else if (u > 1) u = 1;
    const timeBonus = Math.round(TIME_BONUS_MAX * (1 - u));
    this._score += GOAL_SCORE_BONUS + timeBonus;

    /* Rank table (sim seconds). */
    const rank =
      timeS <= RANK_S_S ? 'S' : timeS <= RANK_A_S ? 'A' : timeS <= RANK_B_S ? 'B' : timeS <= RANK_C_S ? 'C' : 'D';

    const trueRadius =
      this._scaleMgr !== null && typeof this._scaleMgr.trueRadiusMeters === 'function'
        ? this._scaleMgr.trueRadiusMeters()
        : this._lastTrueRadius;

    /* Best records: each sub-record replaced ATOMICALLY when its metric
       improves — never mix fields across runs. */
    const prev = RunStats.loadBest();
    const bestTime = prev !== null ? prev.bestTime : null;
    const bestScore = prev !== null ? prev.bestScore : null;
    /** @type {BestRecord} */
    const rec = { timeS, score: this._score, rank, seed: this._seed };
    const newRecordTime =
      !this._devTainted && (bestTime === null || timeS < bestTime.timeS);
    const newRecordScore =
      !this._devTainted && (bestScore === null || this._score > bestScore.score);
    if (newRecordTime || newRecordScore) {
      const next = {
        v: 1,
        bestTime: newRecordTime ? rec : bestTime,
        bestScore: newRecordScore ? rec : bestScore,
      };
      try {
        localStorage.setItem(LS_BEST_KEY, JSON.stringify(next));
      } catch (_) {
        /* private mode / quota — records just don't persist */
      }
    }

    const g = PAYLOADS.goal;
    g.timeS = timeS;
    g.score = this._score;
    g.rank = rank;
    g.trueRadius = trueRadius;
    g.absorbed = this._absorbed;
    g.raresFound = this._raresFound;
    g.seed = this._seed;
    g.newRecordTime = newRecordTime;
    g.newRecordScore = newRecordScore;
    // v3: album count at goal (X intent 「レアn/12」 + result grid header).
    g.collectFound =
      this._collection !== null && typeof this._collection.foundCount === 'number'
        ? this._collection.foundCount
        : 0;
    this._bus.emit(EVT.GOAL, g);
  }

  /* ---------------------------------------------------------------- */
  /* Reset (main.resetWorld — frozen reset-ownership table)            */
  /* ---------------------------------------------------------------- */

  /** Reset to a fresh run. Best records persist (localStorage, not run state). */
  reset() {
    this._timeS = 0;
    this._lastTenth = 0;
    this._frozen = false;
    this._goalEmitted = false;
    this._score = 0;
    this._absorbed = 0;
    this._raresFound = 0;
    this._lastTrueRadius = 0;
  }

  /* ---------------------------------------------------------------- */
  /* Persistence                                                       */
  /* ---------------------------------------------------------------- */

  /**
   * Load the persisted best records. Returns null on ANY anomaly: no storage
   * (private mode / headless), missing key, JSON parse error, wrong schema
   * version, or malformed record fields — callers need no try/catch.
   * @returns {{v: number, bestTime: BestRecord|null, bestScore: BestRecord|null}|null}
   */
  static loadBest() {
    try {
      const raw = localStorage.getItem(LS_BEST_KEY);
      if (typeof raw !== 'string') return null;
      const obj = JSON.parse(raw);
      if (obj === null || typeof obj !== 'object' || obj.v !== 1) return null;
      const bestTime = validateRecord(obj.bestTime);
      const bestScore = validateRecord(obj.bestScore);
      if (bestTime === undefined || bestScore === undefined) return null;
      return { v: 1, bestTime, bestScore };
    } catch (_) {
      return null;
    }
  }
}
