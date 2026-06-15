/**
 * @file hud.js — v3 mobile-first DOM HUD (docs/DESIGN-V3.md §モバイルファーストUI
 * + §フィードバック): size odometer with unit rollover, #absorbed-inline
 * counter, tier banner, progress bar, #timer (m:ss mobile / m:ss.t at >=768px,
 * capped 99:59), score panel + ABSORB-NAME floats (`+120 ネジ` with per-code
 * FLOAT_MERGE_S burst merging, cap MAX_FLOATS_MOBILE/DESKTOP), dash RING on
 * #dash-button (--gauge 0-360deg AND --gauge01 0-1 written at 10Hz, snap on
 * EVT.DASH, .flash on EVT.DASH_READY — frozen Phase-0 contract), mute button,
 * #goal-arrow screen-edge guide (EVT.GOAL_GUIDE, 🗼, exclusion zone top 64px /
 * bottom 110px + live safe-area insets), #hud-toast (queue-of-1, 3 s; own
 * band row — the popup row sits below it), #collect-popup card (EVT.COLLECT — thumbnail
 * + name + NEW + 「コレクション n/12」, auto-out COLLECT_POPUP_S), landmark
 * center toast (EVT.LANDMARK).
 *
 * Purely event-subscribed (no per-frame update call from main.js — "hud is
 * event-driven"). DOM writes are throttled/diffed: nothing is assigned unless
 * the rendered string actually changed. String allocation only happens on the
 * throttled/event paths, per the mathUtils.formatLength/splitLength contract.
 * The float path is per-SCORE-event by design (merge collapses bursts; the
 * restartable animation requires the reflow on each write — bounded by the
 * distinct-archetype count inside one merge window).
 *
 * Visibility: HUD hides on EVT.GOAL_CONTACT (finale cinema takes over) and on
 * game:win/reset; re-shows on game:start. #donack-root lives OUTSIDE #hud and
 * is not this module's concern.
 *
 * DOM contract (frozen in index.html, v3):
 *   #hud (starts .hidden), #size-value, #size-unit, #absorbed-inline,
 *   #tier-banner (.show), #tier-label, #progress-fill (style.width %),
 *   #timer, #score-value, #score-float-layer (.score-float/.fly/.rare spans),
 *   #dash-button (--gauge/--gauge01 vars + .flash), #mute-button,
 *   #hud-toast (.show), #goal-arrow (.arrow-tip, --arrow-rot),
 *   #collect-popup (.show) / #collect-popup-img / #collect-popup-name /
 *   #collect-popup-count. Visibility convention: toggle class 'hidden'.
 */

import { EVT, PAYLOADS } from '../core/events.js';
import {
  HUD_THROTTLE_HZ,
  START_RADIUS_M,
  FLOAT_MERGE_S,
  MAX_FLOATS_MOBILE,
  MAX_FLOATS_DESKTOP,
  COLLECT_POPUP_S,
} from '../config/tuning.js';
import { TIERS } from '../config/tiers.js';
import { splitLength, clamp01 } from '../core/mathUtils.js';
// Namespace import: DISPLAY_NAME_BY_CODE (string[94], frozen) lands with
// Stream C's catalog.js — namespace access keeps this module loadable either
// way (missing export -> empty table -> floats render as plain '+N').
import * as catalogModule from '../config/catalog.js';

/** @typedef {import('../core/events.js').EventBus} EventBus */
/** @typedef {import('../types.js').GrowEvent} GrowEvent */
/** @typedef {import('../types.js').AbsorbEvent} AbsorbEvent */
/** @typedef {import('../types.js').TierUpEvent} TierUpEvent */
/** @typedef {import('../types.js').TimeEvent} TimeEvent */
/** @typedef {import('../types.js').ScoreEvent} ScoreEvent */
/** @typedef {import('../types.js').DashEvent} DashEvent */
/** @typedef {import('../types.js').GoalGuideEvent} GoalGuideEvent */
/** @typedef {import('../types.js').GoalCallEvent} GoalCallEvent */
/** @typedef {import('../types.js').LandmarkEvent} LandmarkEvent */
/** @typedef {import('../types.js').CollectEvent} CollectEvent */
/** @typedef {import('../types.js').MuteChangedEvent} MuteChangedEvent */

/** Frozen display-name table (catalog.js, Stream C; boot-asserted length 94). */
const DISPLAY_NAME_BY_CODE = /** @type {string[]} */ (
  catalogModule.DISPLAY_NAME_BY_CODE !== undefined ? catalogModule.DISPLAY_NAME_BY_CODE : []
);

/** How long the tier banner stays popped (ms). Cosmetic only. */
const BANNER_SHOW_MS = 2400;
/** How long the unit rollover pop lasts (ms) — matches the CSS transition. */
const UNIT_POP_MS = 260;
/** Toast display time (ms) — queue-of-1: a new toast replaces the current. */
const TOAST_SHOW_MS = 3000;
/** Pooled floating spans (>= MAX_FLOATS_DESKTOP + headroom for merge reuse). */
const FLOAT_POOL_SIZE = 8;
/** Float visible lifetime (ms) — matches the CSS score-fly 0.9s animation. */
const FLOAT_LIFE_MS = 900;
/** Pseudo-random offsets (px) cycled per float span — no Math.random churn. */
const FLOAT_OFF_X = [0, 34, 12, 52, 22, 64, 4, 44];
const FLOAT_OFF_Y = [0, 18, 38, 8, 52, 28, 64, 46];
/** Gauge flash animation length (ms) — matches CSS gauge-flash. */
const GAUGE_FLASH_MS = 520;
/** EXTRA archetype code floor (landmarks/collectibles — priority floats). */
const EXTRA_CODE_BASE = 70;
/** #goal-arrow exclusion zones (px) — top bar strip / thumb strip. Safe-area
 *  insets (--s-t/--s-b/--s-l/--s-r) are ADDED at clamp time (read in the
 *  constructor + on breakpoint/resize) so the arrow clears the notch bar and
 *  the 76px dash button + margin on notched phones. */
const ARROW_EXCLUDE_TOP_PX = 64;
const ARROW_EXCLUDE_BOTTOM_PX = 110;
/** Half the 56px arrow square (center-anchored margins in index.html). */
const ARROW_HALF_PX = 28;
/** Timer display cap (minutes). */
const TIMER_CAP_MIN = 99;

/**
 * DOM HUD controller. Construct once at boot; subscribes to the bus and
 * never needs a per-frame tick.
 */
export class Hud {
  /**
   * @param {EventBus} bus The shared game event bus.
   * @param {{ thumbnailUrl: (id: number) => string }} [collection] v3 album —
   *   thumbnail source for the collect popup. Optional (popup degrades to
   *   name + count without an image).
   */
  constructor(bus, collection = null) {
    this._bus = bus;
    /** @type {{ thumbnailUrl: (id: number) => string }|null} */
    this._collection = collection || null;

    /* --- DOM refs (frozen ids in index.html, v3) --- */
    this._root = /** @type {HTMLElement} */ (document.getElementById('hud'));
    this._sizeValueEl = /** @type {HTMLElement} */ (document.getElementById('size-value'));
    this._sizeUnitEl = /** @type {HTMLElement} */ (document.getElementById('size-unit'));
    this._absorbedEl = /** @type {HTMLElement} */ (document.getElementById('absorbed-inline'));
    this._bannerEl = /** @type {HTMLElement} */ (document.getElementById('tier-banner'));
    this._tierLabelEl = /** @type {HTMLElement} */ (document.getElementById('tier-label'));
    this._progressFillEl = /** @type {HTMLElement} */ (document.getElementById('progress-fill'));
    this._timerEl = /** @type {HTMLElement} */ (document.getElementById('timer'));
    this._scoreValueEl = /** @type {HTMLElement} */ (document.getElementById('score-value'));
    this._floatLayerEl = /** @type {HTMLElement} */ (document.getElementById('score-float-layer'));
    this._dashBtnEl = /** @type {HTMLElement} */ (document.getElementById('dash-button'));
    this._muteBtn = /** @type {HTMLButtonElement} */ (document.getElementById('mute-button'));
    this._toastEl = /** @type {HTMLElement} */ (document.getElementById('hud-toast'));
    this._arrowEl = /** @type {HTMLElement} */ (document.getElementById('goal-arrow'));
    /** v5: the glyph text node ('🗼' / '🔩') — last child of #goal-arrow
     * (after the .arrow-tip span). Cached once; writes are kind-diffed. */
    this._arrowGlyphNode = /** @type {Text} */ (this._arrowEl.lastChild);
    /** @type {string} Current glyph kind ('goal' | 'parts') — write diff. */
    this._arrowKind = 'goal';
    // ---- v3 collect popup ----
    this._popupEl = /** @type {HTMLElement} */ (document.getElementById('collect-popup'));
    this._popupImgEl = /** @type {HTMLImageElement} */ (
      document.getElementById('collect-popup-img')
    );
    this._popupNameEl = /** @type {HTMLElement} */ (document.getElementById('collect-popup-name'));
    this._popupCountEl = /** @type {HTMLElement} */ (
      document.getElementById('collect-popup-count')
    );

    /* --- breakpoint (timer format + float cap) --- */
    /** @type {MediaQueryList|null} */
    this._mqDesktop =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(min-width: 768px)')
        : null;
    /** @type {boolean} >=768px: deciseconds + 6-float cap. */
    this._isDesktop = this._mqDesktop !== null ? this._mqDesktop.matches : true;
    this._onBreakpointChange = this._onBreakpointChange.bind(this);
    if (this._mqDesktop !== null && typeof this._mqDesktop.addEventListener === 'function') {
      this._mqDesktop.addEventListener('change', this._onBreakpointChange);
    }

    /* --- safe-area insets (goal-arrow exclusion zones) --- */
    this._safeT = 0;
    this._safeB = 0;
    this._safeL = 0;
    this._safeR = 0;
    this._readSafeInsets = this._readSafeInsets.bind(this);
    this._readSafeInsets();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      // resize covers orientation changes (the insets rotate with the notch).
      window.addEventListener('resize', this._readSafeInsets);
    }

    /* --- pooled floating '+N name' spans (created once — zero churn later) --- */
    /** @type {HTMLSpanElement[]} */
    this._floatPool = [];
    for (let i = 0; i < FLOAT_POOL_SIZE; i++) {
      const span = document.createElement('span');
      span.className = 'score-float';
      span.style.left = FLOAT_OFF_X[i] + 'px';
      span.style.top = FLOAT_OFF_Y[i] + 'px';
      this._floatLayerEl.appendChild(span);
      this._floatPool.push(span);
    }
    /* per-span merge state (parallel arrays — no per-event objects) */
    this._fCode = new Int32Array(FLOAT_POOL_SIZE).fill(-1);
    this._fSum = new Float64Array(FLOAT_POOL_SIZE);
    this._fCount = new Int32Array(FLOAT_POOL_SIZE);
    /** Animation (re)start time (ms); 0 = never used. */
    this._fStart = new Float64Array(FLOAT_POOL_SIZE);
    /** Last write time (ms) — the FLOAT_MERGE_S window anchor. */
    this._fLast = new Float64Array(FLOAT_POOL_SIZE);

    /* --- diff caches (last strings/numbers actually written to the DOM) --- */
    /** @type {{ value: string, unit: string }} reused splitLength out object */
    this._split = { value: '', unit: '' };
    this._lastValueText = '';
    this._lastUnitText = '';
    this._lastCountShown = -1;
    this._lastProgressPct = -1;
    this._lastTierLabel = '';
    this._lastTimerText = '';
    this._lastScoreShown = -1;
    this._lastGaugePct = -1;
    /** Last timeS seen — re-rendered when the breakpoint flips the format. */
    this._lastTimeS = 0;

    /* --- throttle state --- */
    this._minIntervalMs = 1000 / HUD_THROTTLE_HZ;
    this._lastGrowWriteMs = 0;
    this._lastCountWriteMs = 0;
    /** Latest absorb count seen (flushed on the next gate). */
    this._pendingCount = 0;
    /* Score PANEL writes stay 10Hz-gated (EVT.SCORE fires once per absorb
       inside the fixed-step loop); the float path runs per event with
       per-code merging instead of the v2 delta accumulator. */
    this._lastScoreWriteMs = 0;
    /** Latest total score seen (trailing flush via 'grow'). */
    this._pendingScore = -1;
    /** Cached formatter — toLocaleString re-resolves the locale every call. */
    this._numFmt =
      typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function'
        ? new Intl.NumberFormat('ja-JP')
        : null;

    /* --- timers --- */
    /** @type {ReturnType<typeof setTimeout> | 0} */
    this._bannerTimer = 0;
    /** @type {ReturnType<typeof setTimeout> | 0} */
    this._unitPopTimer = 0;
    /** @type {ReturnType<typeof setTimeout> | 0} */
    this._toastTimer = 0;
    /** @type {ReturnType<typeof setTimeout> | 0} */
    this._gaugeFlashTimer = 0;
    /** @type {ReturnType<typeof setTimeout> | 0} */
    this._popupTimer = 0;

    /** One guide toast per run (reset on game:start). */
    this._guideToastShown = false;

    /* --- prebound handlers (subscribe once, zero closures later) --- */
    this._onGrow = this._onGrow.bind(this);
    this._onAbsorb = this._onAbsorb.bind(this);
    this._onTierUp = this._onTierUp.bind(this);
    this._onStart = this._onStart.bind(this);
    this._onWin = this._onWin.bind(this);
    this._onReset = this._onReset.bind(this);
    this._onTime = this._onTime.bind(this);
    this._onScore = this._onScore.bind(this);
    this._onDash = this._onDash.bind(this);
    this._onDashReady = this._onDashReady.bind(this);
    this._onMuteChanged = this._onMuteChanged.bind(this);
    this._onGoalCall = this._onGoalCall.bind(this);
    this._onGoalGuide = this._onGoalGuide.bind(this);
    this._onGoalContact = this._onGoalContact.bind(this);
    this._onLandmark = this._onLandmark.bind(this);
    this._onCollect = this._onCollect.bind(this);
    this._onMuteClick = this._onMuteClick.bind(this);
    this._hideBanner = this._hideBanner.bind(this);
    this._endUnitPop = this._endUnitPop.bind(this);
    this._hideToast = this._hideToast.bind(this);
    this._endGaugeFlash = this._endGaugeFlash.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    bus.on(EVT.GROW, this._onGrow);
    bus.on(EVT.ABSORB, this._onAbsorb);
    bus.on(EVT.TIER_UP, this._onTierUp);
    bus.on(EVT.GAME_START, this._onStart);
    bus.on(EVT.GAME_WIN, this._onWin);
    bus.on(EVT.GAME_RESET, this._onReset);
    bus.on(EVT.TIME, this._onTime);
    bus.on(EVT.SCORE, this._onScore);
    bus.on(EVT.DASH, this._onDash);
    bus.on(EVT.DASH_READY, this._onDashReady);
    bus.on(EVT.MUTE_CHANGED, this._onMuteChanged);
    bus.on(EVT.GOAL_CALL, this._onGoalCall);
    bus.on(EVT.GOAL_GUIDE, this._onGoalGuide);
    bus.on(EVT.GOAL_CONTACT, this._onGoalContact);
    bus.on(EVT.LANDMARK, this._onLandmark);
    bus.on(EVT.COLLECT, this._onCollect);

    this._muteBtn.addEventListener('click', this._onMuteClick);

    this.reset();
  }

  /**
   * Reset all HUD readouts to a fresh run (size = START_RADIUS_M, count x0,
   * progress 0, tier label T0, timer 0:00(.0), score 0, dash ring full,
   * toast/arrow/popup hidden, float pool idle). Does NOT change visibility.
   */
  reset() {
    this._pendingCount = 0;
    this._lastCountShown = -1;
    this._lastProgressPct = -1;
    this._lastGrowWriteMs = 0;
    this._lastCountWriteMs = 0;
    this._lastScoreWriteMs = 0;
    this._pendingScore = -1;
    this._lastTimerText = '';
    this._lastScoreShown = -1;
    this._lastGaugePct = -1;
    this._guideToastShown = false;
    this._fCode.fill(-1);
    this._fStart.fill(0);
    this._fLast.fill(0);
    for (let i = 0; i < FLOAT_POOL_SIZE; i++) {
      this._floatPool[i].classList.remove('fly');
      this._floatPool[i].classList.remove('rare');
    }
    this._writeSize(START_RADIUS_M);
    this._writeCount(0);
    this._writeProgress(0);
    this._writeTierLabel(TIERS[0].name);
    this._writeTimer(0);
    this._writeScore(0);
    this._writeGauge(1);
    this._hideBanner();
    this._hideToast();
    this._hidePopup();
    this._arrowEl.classList.add('hidden');
  }

  /** Show the HUD (remove .hidden). */
  show() {
    this._root.classList.remove('hidden');
    this._root.setAttribute('aria-hidden', 'false');
  }

  /** Hide the HUD (add .hidden). */
  hide() {
    this._root.classList.add('hidden');
    this._root.setAttribute('aria-hidden', 'true');
  }

  /* ---------------------------------------------------------------- */
  /* Event handlers (payloads are reused objects — read-only, no retain) */
  /* ---------------------------------------------------------------- */

  /**
   * 'grow' — odometer + progress bar + dash ring. The emitter already
   * throttles to ~10Hz; the local gate makes the HUD robust if that changes.
   * @param {GrowEvent} p
   */
  _onGrow(p) {
    const now = performance.now();
    if (now - this._lastGrowWriteMs < this._minIntervalMs) return;
    this._lastGrowWriteMs = now;
    this._writeSize(p.trueRadius);
    this._writeProgress(p.progress01ToNextTier);
    this._writeGauge(p.dashGauge01);
    // Piggyback the absorbed counter so a burst's final value always lands.
    this._writeCount(this._pendingCount);
    // Piggyback the trailing score-panel value after a burst.
    if (this._pendingScore >= 0 && now - this._lastScoreWriteMs >= this._minIntervalMs) {
      this._lastScoreWriteMs = now;
      this._writeScore(this._pendingScore);
    }
  }

  /**
   * 'absorb' — absorbed counter (throttled; grow flushes the trailing value).
   * @param {AbsorbEvent} p
   */
  _onAbsorb(p) {
    this._pendingCount = p.count;
    const now = performance.now();
    if (now - this._lastCountWriteMs < this._minIntervalMs) return;
    this._lastCountWriteMs = now;
    this._writeCount(p.count);
  }

  /**
   * 'tierUp' — banner pop + tier label. COSMETIC ONLY.
   * @param {TierUpEvent} p
   */
  _onTierUp(p) {
    this._writeTierLabel(p.name);
    this._bannerEl.textContent = p.name;
    this._bannerEl.classList.add('show');
    if (this._bannerTimer !== 0) clearTimeout(this._bannerTimer);
    this._bannerTimer = setTimeout(this._hideBanner, BANNER_SHOW_MS);
  }

  /** 'game:start' — fresh readouts, then reveal. */
  _onStart() {
    this.reset();
    this.show();
  }

  /** 'game:win' — hide behind the win overlay. */
  _onWin() {
    this.hide();
  }

  /** 'game:reset' — back to title. */
  _onReset() {
    this.reset();
    this.hide();
  }

  /**
   * 'time' — sim clock crossed a 0.1 s boundary (10 Hz; string alloc allowed
   * on this throttled path).
   * @param {TimeEvent} p
   */
  _onTime(p) {
    this._writeTimer(p.timeS);
  }

  /**
   * 'score' — fires once PER ABSORB (inside the fixed-step loop). The score
   * PANEL write stays 10Hz-gated; the absorb-name FLOAT runs per event with
   * FLOAT_MERGE_S per-code merging (a same-code repeat rewrites the live
   * span `+${sum} ネジ x${n}` and restarts its animation — no new span).
   * @param {ScoreEvent} p
   */
  _onScore(p) {
    this._pendingScore = p.score;
    if (p.rare) this._showToast('レアはっけん！+5000');

    const now = performance.now();
    const code = typeof p.archetypeCode === 'number' ? p.archetypeCode : -1;
    // rare/collectible/landmark floats always allocate (evict oldest).
    const priority = p.rare === true || code >= EXTRA_CODE_BASE;
    if (p.delta > 0) this._float(p.delta, code, priority, now);

    if (now - this._lastScoreWriteMs < this._minIntervalMs) return; // _onGrow flushes trailing
    this._lastScoreWriteMs = now;
    this._writeScore(p.score);
  }

  /**
   * Absorb-name float: merge into the live same-code span inside the
   * FLOAT_MERGE_S window, else allocate (cap MAX_FLOATS_MOBILE/DESKTOP
   * visible; at cap the OLDEST visible span is evicted).
   * @param {number} delta Points gained.
   * @param {number} code Archetype code 0..93, or -1 (plain '+N' float).
   * @param {boolean} priority Rare/EXTRA — never merged, always allocates.
   * @param {number} now performance.now() (ms).
   */
  _float(delta, code, priority, now) {
    const mergeMs = FLOAT_MERGE_S * 1000;
    let pick = -1;

    if (!priority && code >= 0) {
      for (let i = 0; i < FLOAT_POOL_SIZE; i++) {
        if (
          this._fCode[i] === code &&
          now - this._fLast[i] <= mergeMs &&
          now - this._fStart[i] < FLOAT_LIFE_MS &&
          this._fStart[i] > 0
        ) {
          pick = i; // merge target
          break;
        }
      }
    }

    if (pick === -1) {
      /* allocate: count visible; at cap evict the oldest VISIBLE span,
         otherwise take the oldest idle span (pool 8 > cap 6 guarantees one). */
      const cap = this._isDesktop ? MAX_FLOATS_DESKTOP : MAX_FLOATS_MOBILE;
      let visible = 0;
      for (let i = 0; i < FLOAT_POOL_SIZE; i++) {
        if (this._fStart[i] > 0 && now - this._fStart[i] < FLOAT_LIFE_MS) visible++;
      }
      const wantVisible = visible >= cap;
      let oldest = Infinity;
      for (let i = 0; i < FLOAT_POOL_SIZE; i++) {
        const vis = this._fStart[i] > 0 && now - this._fStart[i] < FLOAT_LIFE_MS;
        if (vis !== wantVisible) continue;
        if (this._fStart[i] < oldest) {
          oldest = this._fStart[i];
          pick = i;
        }
      }
      if (pick === -1) pick = 0; // unreachable belt-and-suspenders
      this._fCode[pick] = code;
      this._fSum[pick] = delta;
      this._fCount[pick] = 1;
    } else {
      this._fSum[pick] += delta;
      this._fCount[pick]++;
    }
    this._fStart[pick] = now;
    this._fLast[pick] = now;

    const span = this._floatPool[pick];
    const sum = this._fSum[pick];
    let text = '+' + (this._numFmt !== null ? this._numFmt.format(sum) : String(sum));
    const name = code >= 0 ? DISPLAY_NAME_BY_CODE[code] : undefined;
    if (typeof name === 'string' && name !== '') text += ' ' + name;
    if (this._fCount[pick] > 1) text += ' x' + this._fCount[pick];
    span.textContent = text;
    if (priority) span.classList.add('rare');
    else span.classList.remove('rare');
    span.classList.remove('fly');
    void span.offsetWidth; // reflow — restarts the score-fly animation
    span.classList.add('fly');
  }

  /**
   * 'dash' — ring snaps to empty instantly (recharge refills via 'grow').
   * @param {DashEvent} p
   */
  _onDash(p) {
    this._writeGauge(p.gauge01);
  }

  /** 'dashReady' — dash-button flash (restartable CSS animation). */
  _onDashReady() {
    this._dashBtnEl.classList.remove('flash');
    void this._dashBtnEl.offsetWidth; // reflow — restart animation
    this._dashBtnEl.classList.add('flash');
    if (this._gaugeFlashTimer !== 0) clearTimeout(this._gaugeFlashTimer);
    this._gaugeFlashTimer = setTimeout(this._endGaugeFlash, GAUGE_FLASH_MS);
  }

  /** #mute-button click -> EVT.MUTE_REQUEST (main.js is the single owner). */
  _onMuteClick() {
    this._bus.emit(EVT.MUTE_REQUEST, PAYLOADS.muteRequest);
  }

  /**
   * 'muteChanged' — icon only (audio itself is driven by main.js).
   * @param {MuteChangedEvent} p
   */
  _onMuteChanged(p) {
    this._muteBtn.textContent = p.muted ? '🔇' : '🔊';
  }

  /**
   * 'goalCall' — toast (skytree beam pulse / audio handled elsewhere).
   * @param {GoalCallEvent} _p
   */
  _onGoalCall(_p) {
    this._showToast('スカイツリーが呼んでいる…！');
  }

  /**
   * 'goalGuide' — screen-edge arrow: position from x01/y01 (0..1, y 0 = top),
   * tip rotated to point from screen center toward the goal. Exclusion zones:
   * the arrow center never enters the top-bar strip (64px) or the bottom
   * thumb strip (100px).
   * @param {GoalGuideEvent} p
   */
  _onGoalGuide(p) {
    // v5: the opening parts-onboarding guide reuses this exact path with
    // kind:'parts' — swap the glyph (diffed one-line DOM write) and suppress
    // the tower toast + its once-latch (otherwise the toast fires at game
    // start and the latch eats the real finale toast later).
    const parts = p.kind === 'parts';
    const kind = parts ? 'parts' : 'goal';
    if (kind !== this._arrowKind) {
      this._arrowKind = kind;
      this._arrowGlyphNode.nodeValue = parts ? '🔩' : '🗼';
    }
    if (!p.active || p.onScreen) {
      // Inactive OR the tower itself is visible on screen — an edge arrow
      // sitting on top of the goal is noise; it returns when the goal
      // leaves the frustum (payload keeps arriving at 10 Hz).
      this._arrowEl.classList.add('hidden');
      if (p.active && !parts && !this._guideToastShown) {
        this._guideToastShown = true;
        this._showToast('スカイツリーへ向かえ！');
      }
      return;
    }
    this._arrowEl.classList.remove('hidden');
    const w = window.innerWidth;
    const h = window.innerHeight;
    let x = clamp01(p.x01) * w;
    let y = clamp01(p.y01) * h;
    const xMin = this._safeL + ARROW_HALF_PX;
    const xMax = w - this._safeR - ARROW_HALF_PX;
    if (x < xMin) x = xMin;
    else if (x > xMax) x = xMax;
    const yMin = ARROW_EXCLUDE_TOP_PX + this._safeT + ARROW_HALF_PX;
    const yMax = h - ARROW_EXCLUDE_BOTTOM_PX - this._safeB - ARROW_HALF_PX;
    if (y < yMin) y = yMin;
    else if (y > yMax) y = yMax;
    this._arrowEl.style.left = x.toFixed(0) + 'px';
    this._arrowEl.style.top = y.toFixed(0) + 'px';
    const deg = Math.atan2(p.x01 - 0.5, 0.5 - p.y01) * (180 / Math.PI);
    this._arrowEl.style.setProperty('--arrow-rot', deg.toFixed(1) + 'deg');
    if (!parts && !this._guideToastShown) {
      this._guideToastShown = true;
      this._showToast('スカイツリーへ向かえ！');
    }
  }

  /** 'goalContact' — the finale cinema owns the screen; HUD out of the way. */
  _onGoalContact() {
    this._arrowEl.classList.add('hidden');
    this._hideToast();
    this._hidePopup();
    this.hide();
  }

  /**
   * 'landmark' — center treatment toast 「「雷門」まきこんだ！」 (gold ring /
   * fanfare / Donack trivia are other modules').
   * @param {LandmarkEvent} p
   */
  _onLandmark(p) {
    this._showToast('「' + p.nameJa + '」まきこんだ！');
  }

  /**
   * 'collect' — rare-collection popup card: thumbnail + name (+NEW) +
   * 「コレクション n/12」, slide-in, auto-out COLLECT_POPUP_S. While visible
   * the toast max-width is capped to 58vw (frozen one-liner).
   * @param {CollectEvent} p
   */
  _onCollect(p) {
    const url = this._collection !== null ? this._collection.thumbnailUrl(p.collectibleId) : '';
    if (typeof url === 'string' && url !== '') {
      this._popupImgEl.src = url;
      this._popupImgEl.classList.remove('hidden');
    } else {
      this._popupImgEl.classList.add('hidden');
    }
    this._popupNameEl.textContent = p.nameJa;
    this._popupCountEl.textContent =
      (p.isNew ? 'NEW!　' : '') + 'コレクション ' + p.found + '/' + p.total;
    this._popupEl.classList.add('show');
    this._popupEl.setAttribute('aria-hidden', 'false');
    // (The popup lives on its own band row below the toast — the old 58vw
    // toast width cap is retired; geometrically it never cleared a 198px
    // right column on <=412px screens anyway.)
    if (this._popupTimer !== 0) clearTimeout(this._popupTimer);
    this._popupTimer = setTimeout(this._hidePopup, COLLECT_POPUP_S * 1000);
  }

  /** Breakpoint flip (>=768px) — float cap + timer format re-render. */
  _onBreakpointChange() {
    this._isDesktop = this._mqDesktop !== null ? this._mqDesktop.matches : true;
    this._lastTimerText = '';
    this._writeTimer(this._lastTimeS);
    this._readSafeInsets();
  }

  /** Read the --s-t/--s-b/--s-l/--s-r safe-area insets (constructor, resize,
   *  breakpoint flips — never per frame). */
  _readSafeInsets() {
    if (typeof getComputedStyle !== 'function' || typeof document === 'undefined') return;
    const cs = getComputedStyle(document.documentElement);
    this._safeT = parseFloat(cs.getPropertyValue('--s-t')) || 0;
    this._safeB = parseFloat(cs.getPropertyValue('--s-b')) || 0;
    this._safeL = parseFloat(cs.getPropertyValue('--s-l')) || 0;
    this._safeR = parseFloat(cs.getPropertyValue('--s-r')) || 0;
  }

  /* ---------------------------------------------------------------- */
  /* Diffed DOM writers                                                */
  /* ---------------------------------------------------------------- */

  /**
   * Write the size odometer; a unit change triggers the rollover pop.
   * @param {number} trueRadiusM Ball radius in real meters.
   */
  _writeSize(trueRadiusM) {
    splitLength(trueRadiusM, this._split);
    if (this._split.value !== this._lastValueText) {
      this._lastValueText = this._split.value;
      this._sizeValueEl.textContent = this._split.value;
    }
    if (this._split.unit !== this._lastUnitText) {
      this._lastUnitText = this._split.unit;
      this._sizeUnitEl.textContent = this._split.unit;
      this._popUnit();
    }
  }

  /**
   * #absorbed-inline — 'x123' (the v3 score-pill subline; the v2 standalone
   * panel + nested #absorbed-value are gone).
   * @param {number} count Total absorbed this run.
   */
  _writeCount(count) {
    if (count === this._lastCountShown) return;
    this._lastCountShown = count;
    this._absorbedEl.textContent = 'x' + count;
  }

  /**
   * @param {number} progress01 0..1 progress within the current tier band.
   */
  _writeProgress(progress01) {
    const pct = Math.round(clamp01(progress01) * 1000) / 10; // 0.1% steps
    if (pct === this._lastProgressPct) return;
    this._lastProgressPct = pct;
    this._progressFillEl.style.width = pct + '%';
  }

  /**
   * @param {string} name Tier display name -> uppercase label.
   */
  _writeTierLabel(name) {
    if (name === this._lastTierLabel) return;
    this._lastTierLabel = name;
    this._tierLabelEl.textContent = name.toUpperCase();
  }

  /**
   * #timer — m:ss on mobile, m:ss.t at >=768px (format owned here, frozen
   * Phase-0 contract); display capped at 99:59(.9). timeS arrives on 0.1 s
   * SIM boundaries.
   * @param {number} timeS Elapsed simulated seconds.
   */
  _writeTimer(timeS) {
    this._lastTimeS = timeS;
    const t10 = Math.round(timeS * 10);
    let m = (t10 / 600) | 0;
    let rem = t10 - m * 600;
    if (m > TIMER_CAP_MIN) {
      m = TIMER_CAP_MIN;
      rem = 599; // 99:59.9 — capped display
    }
    const ss = (rem / 10) | 0;
    let text = m + ':' + (ss < 10 ? '0' : '') + ss;
    if (this._isDesktop) text += '.' + (rem % 10);
    if (text === this._lastTimerText) return;
    this._lastTimerText = text;
    this._timerEl.textContent = text;
  }

  /**
   * #score-value — diffed; ja-JP grouping for readability.
   * @param {number} score Total score.
   */
  _writeScore(score) {
    if (score === this._lastScoreShown) return;
    this._lastScoreShown = score;
    this._scoreValueEl.textContent =
      this._numFmt !== null ? this._numFmt.format(score) : String(score);
  }

  /**
   * Dash ring on #dash-button — writes BOTH registered custom properties
   * (frozen Phase-0 contract): --gauge (0-360deg, conic ring) and --gauge01
   * (0-1, @supports plain-bar fallback). 1% steps, diffed.
   * @param {number} gauge01 Dash charge 0..1.
   */
  _writeGauge(gauge01) {
    const pct = Math.round(clamp01(gauge01) * 100);
    if (pct === this._lastGaugePct) return;
    this._lastGaugePct = pct;
    const style = this._dashBtnEl.style;
    style.setProperty('--gauge', (pct * 3.6).toFixed(1) + 'deg');
    style.setProperty('--gauge01', (pct / 100).toFixed(2));
  }

  /* ---------------------------------------------------------------- */
  /* Toast (queue-of-1) / popup / timer callbacks                       */
  /* ---------------------------------------------------------------- */

  /**
   * Show a toast for TOAST_SHOW_MS; a newer toast replaces the current one.
   * @param {string} text
   */
  _showToast(text) {
    this._toastEl.textContent = text;
    this._toastEl.classList.add('show');
    if (this._toastTimer !== 0) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(this._hideToast, TOAST_SHOW_MS);
  }

  /** Hides the toast (timer callback, prebound). */
  _hideToast() {
    this._toastTimer = 0;
    this._toastEl.classList.remove('show');
  }

  /** Hides the collect popup (prebound). */
  _hidePopup() {
    if (this._popupTimer !== 0) {
      clearTimeout(this._popupTimer);
      this._popupTimer = 0;
    }
    this._popupEl.classList.remove('show');
    this._popupEl.setAttribute('aria-hidden', 'true');
  }

  /** Ends the dash flash so the next one can restart cleanly (prebound). */
  _endGaugeFlash() {
    this._gaugeFlashTimer = 0;
    this._dashBtnEl.classList.remove('flash');
  }

  /** Unit rollover pop: scale kick that the CSS transition eases back. */
  _popUnit() {
    this._sizeUnitEl.style.transform = 'scale(1.5)';
    if (this._unitPopTimer !== 0) clearTimeout(this._unitPopTimer);
    this._unitPopTimer = setTimeout(this._endUnitPop, UNIT_POP_MS);
  }

  /** Ends the unit pop (timer callback, prebound). */
  _endUnitPop() {
    this._unitPopTimer = 0;
    this._sizeUnitEl.style.transform = '';
  }

  /** Hides the tier banner (timer callback, prebound). */
  _hideBanner() {
    this._bannerTimer = 0;
    this._bannerEl.classList.remove('show');
  }
}
