/**
 * @file donack.js — Donack (ドナック), the official pixel-art duck commentator
 * (v3, docs/DESIGN-V3.md §ドナック実況).
 *
 * DOM (frozen ids, index.html Phase 0): #donack-root (DIRECT CHILD OF body,
 * OUTSIDE #hud — binding: it survives the GOAL_CONTACT hud-hide so the
 * scripted ascension line can show during the cinematic) containing
 * #donack-avatar + #donack-bubble. The avatar renders 8 first-party webp
 * frames via CSS class swap (.dk-{idle,happy,thinking,speaking}-{0,3});
 * blink = frame-0 <-> frame-3 toggle at DONACK_BLINK_FPS (4), driven by a JS
 * interval that runs ONLY while the bubble is visible (no rAF/idle cost).
 * The same interval counts show time and auto-dismisses the bubble
 * (DONACK_SHOW_S, landmarks/finale DONACK_SHOW_LANDMARK_S).
 *
 * TRIGGER / PRIORITY / COOLDOWN (binding):
 *  - P3 landmark+finale: always shows, INTERRUPTS the current bubble.
 *  - P2 collectible / tier-up; P1 first-absorb-per-category / combo>=15 /
 *    knock-off / edge; P0 idle-stuck tips.
 *  - Min gap since the last bubble DISMISSED: P0/P1 8 s, P2 4 s, P3 0.
 *  - Queue-of-1: one pending slot holding the highest-priority blocked
 *    candidate; equal/lower-priority incoming candidates are discarded.
 *    The pending line is re-checked on dismiss and on the 1 Hz tick.
 *  - Dedupe: each line id once per RUN, except tips (once:false lines) which
 *    repeat on a per-id DONACK_TIP_COOLDOWN_S (30 s) cooldown.
 *  - DUAL-TAG (MINOR 13): ハチ公像 emits COLLECT (collectibleId 10) FIRST then
 *    LANDMARK (landmarkId 0) in the same frame; only the merged line
 *    'dual_hachiko' fires — COLLECT id 10 maps to it in the frozen table and
 *    the LANDMARK id 0 emission is skipped here.
 *
 * PHASE GATING (binding, MINOR 17): internal phase in {title, play,
 * cinematic, result}: GAME_START -> 'play', GOAL_CONTACT -> 'cinematic',
 * GAME_WIN -> 'result', GAME_RESET -> 'title' + HARD RESET of every timer /
 * queue / per-run dedupe (the 1 Hz checker demonstrably stops — its interval
 * is cleared). P0/P1/P2 lines are 'play'-tagged; 'goal_contact' shows the
 * same frame the phase flips to 'cinematic'; 'ascension' is scheduled
 * ASCENSION_LINE_DELAY_S after contact by the 1 Hz tick; 'result' fires on
 * GAME_WIN only.
 *
 * Subscribes: LANDMARK, COLLECT, TIER_UP, SCORE (combo + first-category),
 * KNOCK_OFF, BOUNCE (repeat-bonk counter), DASH_READY (unused-gauge timer,
 * cancelled via GROW.dashGauge01), GOAL_CALL, GOAL_CONTACT, GAME_WIN,
 * GAME_START, GAME_RESET, GROW (10 Hz: idle/edge bookkeeping for the 1 Hz
 * internal check, 'play' only).
 *
 * EDGE HINT: GrowEvent carries no position, so the map-edge check needs the
 * OPTIONAL third constructor arg getBallPosReal() -> {x,z} in REAL meters
 * (integrator wiring; see DESIGN-V3.md map §D). Without it the 'tip_edge'
 * line simply never fires — every other behavior is self-contained.
 *
 * OFF TOGGLE: constructor takes initialOff (main.js reads LS_DONACK_KEY
 * before construction); setOff(b) persists the flag back to LS_DONACK_KEY
 * ('1' = off) and, when turning off, hides the bubble and drops the queue.
 * While off every trigger is dropped at the door (phase tracking continues).
 *
 * ZERO PER-FRAME ALLOCATION: no rAF hook at all; handlers are prebound at
 * construction, all strings are static (config/donackLines.js), display is
 * textContent/className writes on trigger only; the only timers are the 1 Hz
 * run ticker and the 4 Hz blink interval while a bubble is visible.
 */

import { bus as defaultBus, EVT } from '../core/events.js';
import {
  DONACK_SHOW_S,
  DONACK_SHOW_LANDMARK_S,
  DONACK_GAP_P01_S,
  DONACK_GAP_P2_S,
  DONACK_TIP_COOLDOWN_S,
  DONACK_IDLE_HINT_S,
  DONACK_DASH_HINT_S,
  DONACK_BLINK_FPS,
  LS_DONACK_KEY,
  MAP_BOUNDS,
  EDGE_SOFT_BAND_K,
} from '../config/tuning.js';
import {
  DONACK_LINES,
  TIER_UP_LINE_IDS,
  LANDMARK_LINE_IDS,
  COLLECT_LINE_IDS,
  DUAL_LANDMARK_ID,
  FIRST_LINE_BY_CODE,
} from '../config/donackLines.js';

/* ---- module-local tuning (DESIGN-V3.md §ドナック実況) ---- */
/** Combo line threshold (ScoreEvent.combo). */
const COMBO_LINE_AT = 15;
/** repeat-bonk: this many hard bounces inside BONK_WINDOW_S triggers the line. */
const BONK_LINE_COUNT = 3;
const BONK_WINDOW_S = 60;
/** Only bounces at least this hard count toward repeat-bonk (impactSpeed01). */
const BONK_MIN_IMPACT = 0.5;
/** 'ascension' line delay after GOAL_CONTACT (s): the contact shout runs
 *  first, then this line lands mid-ascension (merge 1.2 s + ~2.3 s in). */
const ASCENSION_LINE_DELAY_S = 3.5;

/** Precomputed avatar class strings (expression x frame) — never built per swap. */
const AVATAR_CLASSES = Object.freeze({
  idle: Object.freeze(['dk-idle-0', 'dk-idle-3']),
  happy: Object.freeze(['dk-happy-0', 'dk-happy-3']),
  thinking: Object.freeze(['dk-thinking-0', 'dk-thinking-3']),
  speaking: Object.freeze(['dk-speaking-0', 'dk-speaking-3']),
});

/** Blink/auto-dismiss interval period (ms). */
const BLINK_PERIOD_MS = 1000 / DONACK_BLINK_FPS;

/**
 * Donack controller. Construct once at boot (after hud/screens):
 *   const donack = new Donack(bus, initialDonackOff);
 * setOff(b) is the single runtime switch (title #donack-toggle, Stream D).
 */
export class Donack {
  /**
   * @param {import('../core/events.js').EventBus} [eventBus] Bus; defaults to the singleton.
   * @param {boolean} [initialOff] Persisted LS_DONACK_KEY state (main.js reads
   *   it BEFORE construction — '1' = commentary off).
   * @param {(() => {x: number, z: number})|null} [getBallPosReal] OPTIONAL
   *   ball-position provider in REAL meters for the map-edge hint (GrowEvent
   *   has no position). null (default) disables 'tip_edge' gracefully.
   */
  constructor(eventBus = defaultBus, initialOff = false, getBallPosReal = null) {
    /** @type {import('../core/events.js').EventBus} */
    this._bus = eventBus;
    /** @type {boolean} */
    this._off = initialOff === true;
    /** @type {(() => {x: number, z: number})|null} */
    this._getBallPosReal = getBallPosReal;

    /* --- DOM (frozen Phase-0 ids) --- */
    /** @type {HTMLElement|null} */
    this._root = document.getElementById('donack-root');
    /** @type {HTMLElement|null} */
    this._avatar = document.getElementById('donack-avatar');
    /** @type {HTMLElement|null} */
    this._bubble = document.getElementById('donack-bubble');

    /* --- phase gate --- */
    /** @type {string} 'title' | 'play' | 'cinematic' | 'result' */
    this._phase = 'title';

    /* --- bubble display state --- */
    /** @type {boolean} */
    this._visible = false;
    /** @type {number} Priority of the LIVE bubble (goal_call deferral rule). */
    this._visiblePriority = -1;
    /** @type {string} Current expression key into AVATAR_CLASSES. */
    this._expr = 'idle';
    /** @type {number} Blink frame toggle (0 -> frame-0, 1 -> frame-3). */
    this._frame = 0;
    /** @type {number} Blink ticks elapsed for the live bubble. */
    this._showTicks = 0;
    /** @type {number} Blink ticks until auto-dismiss. */
    this._showTicksMax = 0;
    /** @type {ReturnType<typeof setInterval>|0} 4 Hz blink/dismiss interval (visible only). */
    this._blinkId = 0;

    /* --- priority / cooldown / queue-of-1 --- */
    /** @type {string|null} Pending line id (highest-priority blocked candidate). */
    this._pendingId = null;
    /** @type {number} Time (s) the last bubble was dismissed (gap anchor). */
    this._lastBubbleEndAt = -1e9;
    /** @type {Set<string>} once:true line ids already shown this run. */
    this._shownOnce = new Set();
    /** @type {Map<string, number>} once:false (tip) id -> last shown time (s). */
    this._tipShownAt = new Map();

    /* --- 1 Hz run ticker (started on GAME_START, STOPPED on GAME_RESET) --- */
    /** @type {ReturnType<typeof setInterval>|0} */
    this._tickId = 0;

    /* --- play-phase bookkeeping (fed by SCORE/GROW/BOUNCE/DASH_READY) --- */
    /** @type {number} Last time (s) the ball made progress (absorb/growth). */
    this._lastProgressAt = 0;
    /** @type {number} Last GROW trueRadius (real m) — growth + edge band. */
    this._lastTrueRadius = 0;
    /** @type {number} DASH_READY time (s); -1 while gauge not full. */
    this._dashReadyAt = -1;
    /** @type {number} repeat-bonk window anchor (s). */
    this._bonkWindowAt = 0;
    /** @type {number} Hard bounces inside the current window. */
    this._bonkCount = 0;

    /* --- cinematic scheduling --- */
    /** @type {number} GOAL_CONTACT time (s); -1 = none. */
    this._contactAt = -1;
    /** @type {boolean} 'ascension' line already dispatched. */
    this._ascensionDone = false;

    /* --- prebound handlers (subscribed once; zero per-event closures) --- */
    this._onBlinkTick = this._onBlinkTick.bind(this);
    this._onRunTick = this._onRunTick.bind(this);
    this._onGameStart = this._onGameStart.bind(this);
    this._onGameReset = this._onGameReset.bind(this);
    this._onTierUp = this._onTierUp.bind(this);
    this._onScore = this._onScore.bind(this);
    this._onKnockOff = this._onKnockOff.bind(this);
    this._onBounce = this._onBounce.bind(this);
    this._onDashReady = this._onDashReady.bind(this);
    this._onGrow = this._onGrow.bind(this);
    this._onLandmark = this._onLandmark.bind(this);
    this._onCollect = this._onCollect.bind(this);
    this._onGoalCall = this._onGoalCall.bind(this);
    this._onGoalContact = this._onGoalContact.bind(this);
    this._onGameWin = this._onGameWin.bind(this);

    eventBus.on(EVT.GAME_START, this._onGameStart);
    eventBus.on(EVT.GAME_RESET, this._onGameReset);
    eventBus.on(EVT.TIER_UP, this._onTierUp);
    eventBus.on(EVT.SCORE, this._onScore);
    eventBus.on(EVT.KNOCK_OFF, this._onKnockOff);
    eventBus.on(EVT.BOUNCE, this._onBounce);
    eventBus.on(EVT.DASH_READY, this._onDashReady);
    eventBus.on(EVT.GROW, this._onGrow);
    eventBus.on(EVT.LANDMARK, this._onLandmark);
    eventBus.on(EVT.COLLECT, this._onCollect);
    eventBus.on(EVT.GOAL_CALL, this._onGoalCall);
    eventBus.on(EVT.GOAL_CONTACT, this._onGoalContact);
    eventBus.on(EVT.GAME_WIN, this._onGameWin);
  }

  /* ---------------------------------------------------------------- */
  /* Public API                                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Toggle commentary off/on (title-screen #donack-toggle — Stream D wires
   * the button; this persists LS_DONACK_KEY). Turning off hides the live
   * bubble and drops the pending queue; while off every trigger is dropped.
   * Phase tracking continues either way so re-enabling mid-run just works.
   * @param {boolean} b True = commentary OFF.
   */
  setOff(b) {
    this._off = b === true;
    try {
      localStorage.setItem(LS_DONACK_KEY, this._off ? '1' : '0');
    } catch (_) {
      /* private mode / blocked storage — non-fatal */
    }
    if (this._off) {
      this._pendingId = null;
      this._hideNow();
    }
    this._updateTicker();
  }

  /** Unsubscribe + stop all timers (teardown / tests). */
  dispose() {
    const b = this._bus;
    b.off(EVT.GAME_START, this._onGameStart);
    b.off(EVT.GAME_RESET, this._onGameReset);
    b.off(EVT.TIER_UP, this._onTierUp);
    b.off(EVT.SCORE, this._onScore);
    b.off(EVT.KNOCK_OFF, this._onKnockOff);
    b.off(EVT.BOUNCE, this._onBounce);
    b.off(EVT.DASH_READY, this._onDashReady);
    b.off(EVT.GROW, this._onGrow);
    b.off(EVT.LANDMARK, this._onLandmark);
    b.off(EVT.COLLECT, this._onCollect);
    b.off(EVT.GOAL_CALL, this._onGoalCall);
    b.off(EVT.GOAL_CONTACT, this._onGoalContact);
    b.off(EVT.GAME_WIN, this._onGameWin);
    this._stopTicker();
    this._hideNow();
  }

  /* ---------------------------------------------------------------- */
  /* Bus handlers                                                       */
  /* ---------------------------------------------------------------- */

  /** 'game:start' -> phase 'play', fresh per-run state, ticker on, start line. */
  _onGameStart() {
    this._phase = 'play';
    this._resetRunState();
    this._updateTicker();
    this._trigger('start');
  }

  /** 'game:reset' -> HARD RESET: ticker stopped, bubble hidden, queue/dedupe/
   *  timers cleared, phase 'title' (binding — reset-ownership table v3). */
  _onGameReset() {
    this._phase = 'title';
    this._stopTicker();
    this._pendingId = null;
    this._hideNow();
    this._resetRunState();
  }

  /** @param {import('../types.js').TierUpEvent} p */
  _onTierUp(p) {
    const id = TIER_UP_LINE_IDS[p.tierIndex];
    if (id !== undefined && id !== '') this._trigger(id);
  }

  /**
   * 'score' (every absorb): idle anchor + first-absorb-per-category + combo.
   * @param {import('../types.js').ScoreEvent} p
   */
  _onScore(p) {
    this._lastProgressAt = this._now();
    const firstId = FIRST_LINE_BY_CODE[p.archetypeCode];
    if (firstId !== undefined) this._trigger(firstId);
    if (p.combo >= COMBO_LINE_AT) this._trigger('combo15');
  }

  _onKnockOff() {
    this._trigger('knockoff');
  }

  /**
   * 'bounce': hard bounces accumulate toward the repeat-bonk hint
   * (BONK_LINE_COUNT inside BONK_WINDOW_S).
   * @param {import('../types.js').BounceEvent} p
   */
  _onBounce(p) {
    if (this._phase !== 'play' || p.impactSpeed01 < BONK_MIN_IMPACT) return;
    const now = this._now();
    if (now - this._bonkWindowAt > BONK_WINDOW_S) {
      this._bonkWindowAt = now;
      this._bonkCount = 0;
    }
    this._bonkCount++;
    if (this._bonkCount >= BONK_LINE_COUNT) {
      this._bonkCount = 0;
      this._bonkWindowAt = now;
      this._trigger('repeat_bonk');
    }
  }

  /** 'dashReady': arm the unused-full-gauge timer (1 Hz check fires the tip). */
  _onDashReady() {
    this._dashReadyAt = this._now();
  }

  /**
   * 'grow' (10 Hz): growth = progress (idle anchor), radius for the edge
   * band, and gauge-drop cancels the dash-hint timer. Reads fields only —
   * zero allocation.
   * @param {import('../types.js').GrowEvent} p
   */
  _onGrow(p) {
    if (p.trueRadius > this._lastTrueRadius) this._lastProgressAt = this._now();
    this._lastTrueRadius = p.trueRadius;
    if (p.dashGauge01 < 0.999) this._dashReadyAt = -1; // gauge used / not full
  }

  /**
   * 'landmark' (curated, after the ABSORB chain). landmarkId 0 (ハチ公像) is
   * DUAL-tagged: its COLLECT (id 10) already fired the merged 'dual_hachiko'
   * line this same frame — skip it here (single-line rule, MINOR 13).
   * @param {import('../types.js').LandmarkEvent} p
   */
  _onLandmark(p) {
    if (p.landmarkId === DUAL_LANDMARK_ID) return;
    const id = LANDMARK_LINE_IDS[p.landmarkId];
    if (id !== undefined && id !== '') this._trigger(id);
  }

  /**
   * 'collect' (collection.js). Id 10 maps to the merged dual line; unknown
   * future ids (append-only 12+) fall back to the generic line.
   * @param {import('../types.js').CollectEvent} p
   */
  _onCollect(p) {
    const id = COLLECT_LINE_IDS[p.collectibleId];
    this._trigger(id !== undefined ? id : 'col_generic');
  }

  _onGoalCall() {
    this._trigger('goal_call');
  }

  /** 'goalContact' -> phase 'cinematic' + the contact shout (P3 interrupts a
   *  live play bubble); 'ascension' is scheduled via the 1 Hz tick. */
  _onGoalContact() {
    this._phase = 'cinematic';
    this._contactAt = this._now();
    this._ascensionDone = false;
    this._trigger('goal_contact');
  }

  /** 'game:win' -> phase 'result' + the result line. */
  _onGameWin() {
    this._phase = 'result';
    this._trigger('result');
  }

  /* ---------------------------------------------------------------- */
  /* 1 Hz internal ticker (GAME_START..GAME_RESET)                      */
  /* ---------------------------------------------------------------- */

  /** Start/stop the 1 Hz ticker per (off, phase) — never runs on the title. */
  _updateTicker() {
    const want = !this._off && this._phase !== 'title';
    if (want) this._startTicker();
    else this._stopTicker();
  }

  _startTicker() {
    if (this._tickId !== 0) return;
    this._tickId = setInterval(this._onRunTick, 1000);
  }

  _stopTicker() {
    if (this._tickId !== 0) {
      clearInterval(this._tickId);
      this._tickId = 0;
    }
  }

  /** 1 Hz: pending-queue retry + play-phase idle/dash/edge checks +
   *  cinematic ascension-line scheduling. Zero allocation. */
  _onRunTick() {
    if (!this._visible) this._flushPending();
    const now = this._now();
    if (this._phase === 'play') {
      // Idle-stuck tip: no absorb/growth for DONACK_IDLE_HINT_S.
      if (now - this._lastProgressAt >= DONACK_IDLE_HINT_S) {
        this._lastProgressAt = now; // re-arm (per-id 30 s cooldown also gates)
        this._trigger('tip_idle');
      }
      // Full-dash-gauge-unused tip.
      if (this._dashReadyAt >= 0 && now - this._dashReadyAt >= DONACK_DASH_HINT_S) {
        this._dashReadyAt = now; // re-arm
        this._trigger('tip_dash');
      }
      // Map-edge hint (only when the integrator wired the position provider).
      if (this._getBallPosReal !== null) {
        const pos = this._getBallPosReal();
        const band = EDGE_SOFT_BAND_K * this._lastTrueRadius;
        if (
          pos.x < MAP_BOUNDS.x[0] + band ||
          pos.x > MAP_BOUNDS.x[1] - band ||
          pos.z < MAP_BOUNDS.z[0] + band ||
          pos.z > MAP_BOUNDS.z[1] - band
        ) {
          this._trigger('tip_edge');
        }
      }
    } else if (this._phase === 'cinematic') {
      if (!this._ascensionDone && this._contactAt >= 0 && now - this._contactAt >= ASCENSION_LINE_DELAY_S) {
        this._ascensionDone = true;
        this._trigger('ascension');
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Trigger pipeline: gate -> dedupe -> show / queue-of-1              */
  /* ---------------------------------------------------------------- */

  /**
   * Route one line id through the off/phase/dedupe/priority pipeline.
   * @param {string} id Frozen line id (config/donackLines.js).
   */
  _trigger(id) {
    if (this._off) return;
    const line = DONACK_LINES[id];
    if (line === undefined || line.phase !== this._phase) return;
    if (!this._eligible(id, line)) return;
    if (line.priority === 3) {
      // goal_call deferral: the Tokyo Tower absorb (262->406m) crosses
      // GOAL_CALL_RADIUS_M in the SAME fixed step that shows the 'lm_tower'
      // trivia (P3, 6s) — letting goal_call interrupt would blank the
      // game's penultimate beat after ~0 frames. goal_call stays perfectly
      // relevant for the whole finale approach, so QUEUE it behind a live
      // P3 bubble instead of interrupting (P3 gap is 0 — it flushes the
      // moment the trivia dismisses).
      if (id === 'goal_call' && this._visible && this._visiblePriority === 3) {
        this._enqueue(id, line);
        return;
      }
      // P3: gap 0, always shows, interrupts the current bubble.
      this._show(id, line);
      return;
    }
    if (this._visible || !this._gapOk(line.priority)) {
      this._enqueue(id, line);
      return;
    }
    this._show(id, line);
  }

  /**
   * Per-id dedupe: once-per-run, or the 30 s tip cooldown for once:false.
   * @param {string} id @param {{once: boolean}} line
   * @returns {boolean}
   */
  _eligible(id, line) {
    if (line.once) return !this._shownOnce.has(id);
    const last = this._tipShownAt.get(id);
    return last === undefined || this._now() - last >= DONACK_TIP_COOLDOWN_S;
  }

  /**
   * Min gap since the last bubble was dismissed: P0/P1 8 s, P2 4 s.
   * @param {number} priority 0..2 (P3 never reaches here).
   * @returns {boolean}
   */
  _gapOk(priority) {
    if (priority >= 3) return true; // P3 gap is 0 (queued goal_call flush)
    const gap = priority === 2 ? DONACK_GAP_P2_S : DONACK_GAP_P01_S;
    return this._now() - this._lastBubbleEndAt >= gap;
  }

  /**
   * Queue-of-1: keep only the highest-priority blocked candidate; an
   * equal/lower-priority incoming candidate is discarded.
   * @param {string} id @param {{priority: number}} line
   */
  _enqueue(id, line) {
    if (this._pendingId !== null) {
      const cur = DONACK_LINES[this._pendingId];
      if (line.priority <= cur.priority) return;
    }
    this._pendingId = id;
  }

  /** Dismiss-time / 1 Hz retry of the pending slot (phase re-checked — a
   *  stale 'play' line pending across GOAL_CONTACT is dropped here). */
  _flushPending() {
    const id = this._pendingId;
    if (id === null || this._off) return;
    const line = DONACK_LINES[id];
    if (line === undefined || line.phase !== this._phase || !this._eligible(id, line)) {
      this._pendingId = null; // stale — drop
      return;
    }
    if (!this._gapOk(line.priority)) return; // keep; ticker retries
    this._pendingId = null;
    this._show(id, line);
  }

  /* ---------------------------------------------------------------- */
  /* Bubble display (textContent/className writes only)                 */
  /* ---------------------------------------------------------------- */

  /**
   * Show a line NOW (replaces any live bubble — only P3 and the pending
   * flush reach here while visible). Marks dedupe at show time.
   * @param {string} id @param {import('../config/donackLines.js').DonackLine} line
   */
  _show(id, line) {
    if (line.once) this._shownOnce.add(id);
    else this._tipShownAt.set(id, this._now());
    if (this._pendingId === id) this._pendingId = null;

    this._expr = line.expression;
    this._visiblePriority = line.priority;
    this._frame = 0;
    this._showTicks = 0;
    const showS = line.priority === 3 ? DONACK_SHOW_LANDMARK_S : DONACK_SHOW_S;
    this._showTicksMax = Math.max(1, Math.round(showS * DONACK_BLINK_FPS));

    if (this._bubble !== null) this._bubble.textContent = line.text;
    this._applyAvatarFrame();
    if (this._root !== null) {
      this._root.classList.add('show');
      this._root.setAttribute('aria-hidden', 'false');
    }
    this._visible = true;
    if (this._blinkId === 0) this._blinkId = setInterval(this._onBlinkTick, BLINK_PERIOD_MS);
  }

  /** 4 Hz while visible: frame-0/3 blink toggle + auto-dismiss countdown. */
  _onBlinkTick() {
    if (!this._visible) {
      this._stopBlink();
      return;
    }
    this._frame = this._frame === 0 ? 1 : 0;
    this._applyAvatarFrame();
    this._showTicks++;
    if (this._showTicks >= this._showTicksMax) {
      this._hideNow();
      this._lastBubbleEndAt = this._now();
      this._flushPending();
    }
  }

  /** Write the precomputed expression/frame class (zero allocation). */
  _applyAvatarFrame() {
    if (this._avatar === null) return;
    const pair = AVATAR_CLASSES[this._expr];
    this._avatar.className = (pair !== undefined ? pair : AVATAR_CLASSES.idle)[this._frame];
  }

  /** Hide immediately WITHOUT touching the gap anchor or pending queue
   *  (reset/off paths; the dismiss path stamps _lastBubbleEndAt itself). */
  _hideNow() {
    this._stopBlink();
    this._visible = false;
    this._visiblePriority = -1;
    if (this._root !== null) {
      this._root.classList.remove('show');
      this._root.setAttribute('aria-hidden', 'true');
    }
  }

  _stopBlink() {
    if (this._blinkId !== 0) {
      clearInterval(this._blinkId);
      this._blinkId = 0;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Internals                                                          */
  /* ---------------------------------------------------------------- */

  /** Clear every per-run timer/counter/dedupe (GAME_START + GAME_RESET). */
  _resetRunState() {
    this._shownOnce.clear();
    this._tipShownAt.clear();
    this._pendingId = null;
    this._lastBubbleEndAt = -1e9;
    this._lastProgressAt = this._now();
    this._lastTrueRadius = 0;
    this._dashReadyAt = -1;
    this._bonkWindowAt = 0;
    this._bonkCount = 0;
    this._contactAt = -1;
    this._ascensionDone = false;
  }

  /** Wall-clock seconds (UI cosmetics — sim time not needed). Patchable in
   *  the headless storm test. @returns {number} */
  _now() {
    return performance.now() / 1000;
  }
}
