/**
 * @file screens.js — Title / win / restart overlays, staged result reveal,
 * X share intent, goal-contact flash, title 自己ベスト line, v3 result
 * collection grid + #donack-toggle (docs/DESIGN-V3.md §フィードバック).
 *
 * Owns the #title-overlay and #win-overlay DOM (frozen in index.html) and is
 * the ONLY emitter of 'game:start' and 'game:reset'. Overlay visibility is
 * driven by bus events (not directly by the clicks), so debug-key starts and
 * programmatic resets keep the DOM consistent for free:
 *
 *   #start-button click   -> emit game:start
 *   #restart-button click -> emit game:reset (then game:start)
 *   #donack-toggle click  -> flip + persist LS_DONACK_KEY, donack.setOff(b)
 *   on game:start -> hide title + win, clear staged result state
 *   on game:reset -> hide win, show title (refresh 自己ベスト line)
 *   on goal       -> cache a field-by-field COPY of the payload (payloads are
 *                    reused!) + prebuild the X intent URL immediately
 *   on goalContact-> #flash-overlay white pop (.flash class)
 *   on game:win   -> staged reveal from the CACHED goal (0.0s time / 0.4s
 *                    score count-up / 0.9s size+counts / 1.6s rank stamp /
 *                    1.9s collection grid / 2.2s record badge + best + seed +
 *                    buttons). If no goal was cached (legacy v1 win path),
 *                    everything shows immediately without .staged.
 *
 * v3 COLLECTION GRID (#collection-grid-wrap, frozen ids/classes):
 * COLLECT_TOTAL (v5: 13) .collect-cell cells in frozen-id order (the 13th
 * cell centers on row 4 via index.html nth-child CSS) — found = thumbnail + name, unfound
 * = dark .unfound 「？」 cell, .cell-new badge on first-ever finds of this
 * run; header n = GoalEvent.collectFound. Built once per win (one-shot
 * allocation path). Reveal rides the 1.9s cue (index.html pre-wires
 * #win-overlay.staged #collection-grid-wrap{opacity:0}).
 *
 * X POST (v3 text, SAME battle-tested mechanism — text/url/hashtags params
 * untouched): the intent URL is built ONCE when EVT.GOAL is cached (values
 * from the payload, never the animating DOM). The click handler runs
 * synchronously in the gesture: const w = window.open(url, '_blank'); if
 * (w === null) location.href = url; — no 'noopener' in features (kills the
 * null-ambiguity and gives in-app webviews a same-tab fallback; abandoning
 * the result screen there is accepted — state is already persisted).
 *
 * NOTE for the integrator: main.js contains a TEMPORARY #start-button click
 * block ("TEMPORARY title wiring — REMOVE") — it must be deleted when this
 * module is wired, or game:start will double-emit.
 */

import { EVT, PAYLOADS } from '../core/events.js';
import { COLLECT_TOTAL, LS_DONACK_KEY } from '../config/tuning.js';
import { collectibleCodeForId } from '../world/objects.js';
import { formatLength } from '../core/mathUtils.js';
import { RunStats } from '../game/runStats.js';
// Namespace import: DISPLAY_NAME_BY_CODE (string[94], frozen) lands with
// Stream C's catalog.js — namespace access keeps this module loadable either
// way (missing export -> empty table -> cells render without names).
import * as catalogModule from '../config/catalog.js';

/** @typedef {import('../core/events.js').EventBus} EventBus */
/** @typedef {import('../types.js').GameWinEvent} GameWinEvent */
/** @typedef {import('../types.js').GoalEvent} GoalEvent */

/** Frozen display-name table (catalog.js, Stream C; boot-asserted length 94). */
const DISPLAY_NAME_BY_CODE = /** @type {string[]} */ (
  catalogModule.DISPLAY_NAME_BY_CODE !== undefined ? catalogModule.DISPLAY_NAME_BY_CODE : []
);
/* v5: collectible id -> code goes through objects.js collectibleCodeForId
   (ids 0..11 -> 70..81 frozen v3 rule, id 12+ -> V5_CODE_BASE 110+). The old
   local `70 + id` hand-roll is BANNED — for id 12 it resolves to code 82
   (西郷さん像). collection.js boot-asserts every displayed id resolves. */

/** Share target shown in the post + the intent text (live deployment). */
const SHARE_URL = 'https://fable-katamari.pages.dev';
/**
 * X web intent endpoint. twitter.com/intent/tweet is the most battle-tested
 * variant: it works logged-out, survives the x.com redirect, and is the URL
 * scheme mobile X apps register deep-link handlers for (x.com/intent/post
 * was observed erroring in production on some sessions/devices).
 */
const X_INTENT = 'https://twitter.com/intent/tweet';
/** Staged reveal cues (ms) — match the index.html comment + sfx rank thud (+1.6s). */
const CUE_TIME_MS = 0;
const CUE_SCORE_MS = 400;
const CUE_SIZE_MS = 900;
const CUE_RANK_MS = 1600;
/** v3: collection grid reveal cue (between rank stamp and record badge). */
const CUE_COLLECT_MS = 1900;
const CUE_RECORD_MS = 2200;
/** Score count-up duration (ms, rAF-driven). */
const COUNTUP_MS = 800;
/** Reveal-skip: delay before the buttons become live so the skipping tap's
 *  own click can never hit a button that appeared under the pointer. */
const SKIP_BUTTONS_DELAY_MS = 250;

/**
 * Format sim seconds as mm:ss.t (2-digit minutes — result screen / X post).
 * @param {number} timeS
 * @returns {string}
 */
function formatTime(timeS) {
  const t10 = Math.round(timeS * 10);
  const m = (t10 / 600) | 0;
  const rem = t10 - m * 600;
  const ss = (rem / 10) | 0;
  return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss + '.' + (rem % 10);
}

/**
 * Title/win overlay controller and game:start / game:reset emitter.
 */
export class Screens {
  /**
   * @param {EventBus} bus The shared game event bus.
   * @param {number} worldSeed uint32 world seed (from resolveWorldSeed()) —
   *   shown on the win screen for shareable ?seed= runs; used as a fallback
   *   when the game:win payload carries no seed.
   * @param {{ foundCount: number, isFound: (id: number) => boolean,
   *   isNewThisRun: (id: number) => boolean,
   *   thumbnailUrl: (id: number) => string }} [collection] v3 album — result
   *   grid source. Optional (grid renders all-unfound without it).
   */
  constructor(bus, worldSeed, collection = null) {
    this._bus = bus;
    this._seed = worldSeed >>> 0;
    /** @type {object|null} v3 album (result collection grid). */
    this._collection = collection || null;
    /** @type {{ setOff: (b: boolean) => void }|null} Donack (constructed
     *  later — integrator wires via setDonack()). */
    this._donack = null;

    /* --- DOM refs (frozen ids in index.html) --- */
    this._titleEl = /** @type {HTMLElement} */ (document.getElementById('title-overlay'));
    this._winEl = /** @type {HTMLElement} */ (document.getElementById('win-overlay'));
    this._startBtn = /** @type {HTMLButtonElement} */ (document.getElementById('start-button'));
    this._restartBtn = /** @type {HTMLButtonElement} */ (document.getElementById('restart-button'));
    this._winSizeEl = /** @type {HTMLElement} */ (document.getElementById('win-size'));
    this._winSeedEl = /** @type {HTMLElement} */ (document.getElementById('win-seed'));
    // ---- v2 result ----
    this._rowTimeEl = /** @type {HTMLElement} */ (document.getElementById('result-row-time'));
    this._rowScoreEl = /** @type {HTMLElement} */ (document.getElementById('result-row-score'));
    this._rowSizeEl = /** @type {HTMLElement} */ (document.getElementById('result-row-size'));
    this._rowDetailEl = /** @type {HTMLElement} */ (document.getElementById('result-detail'));
    this._timeEl = /** @type {HTMLElement} */ (document.getElementById('result-time'));
    this._scoreEl = /** @type {HTMLElement} */ (document.getElementById('result-score'));
    this._absorbedEl = /** @type {HTMLElement} */ (document.getElementById('result-absorbed'));
    this._raresEl = /** @type {HTMLElement} */ (document.getElementById('result-rares'));
    this._rankEl = /** @type {HTMLElement} */ (document.getElementById('result-rank'));
    this._badgeEl = /** @type {HTMLElement} */ (document.getElementById('new-record-badge'));
    this._bestEl = /** @type {HTMLElement} */ (document.getElementById('result-best'));
    this._seedLineEl = /** @type {HTMLElement} */ (document.getElementById('result-seed'));
    this._postXBtn = /** @type {HTMLButtonElement} */ (document.getElementById('post-x-button'));
    this._buttonsEl = /** @type {HTMLElement} */ (
      this._winEl.querySelector('.result-buttons')
    );
    this._flashEl = /** @type {HTMLElement} */ (document.getElementById('flash-overlay'));
    this._titleBestLineEl = /** @type {HTMLElement} */ (document.getElementById('title-best-line'));
    this._titleBestValueEl = /** @type {HTMLElement} */ (
      document.getElementById('title-best-value')
    );
    // ---- v3 collection grid (frozen ids/classes) ----
    this._collectWrapEl = /** @type {HTMLElement} */ (
      document.getElementById('collection-grid-wrap')
    );
    this._collectNEl = /** @type {HTMLElement} */ (document.getElementById('result-collect-n'));
    this._collectGridEl = /** @type {HTMLElement} */ (document.getElementById('collection-grid'));
    // ---- v3 Donack toggle (title screen) ----
    this._donackToggleBtn = /** @type {HTMLButtonElement} */ (
      document.getElementById('donack-toggle')
    );

    /**
     * Field-by-field COPY of the last EVT.GOAL payload (payloads are reused —
     * never retain them). null until the first goal of a run.
     * @type {GoalEvent|null}
     */
    this._goal = null;
    /** Prebuilt X intent URL (built once per goal, never from the DOM). */
    this._xUrl = '';

    /* --- staged reveal timers / rAF --- */
    /** @type {ReturnType<typeof setTimeout>[]} */
    this._revealTimers = [];
    /** @type {number} */
    this._countupRaf = 0;

    /* --- v3 Donack-commentary OFF flag (persisted; donack.js reads the same
       key at construction — this button is the single WRITE owner) --- */
    /** @type {boolean} */
    this._donackOff = false;
    try {
      this._donackOff = localStorage.getItem(LS_DONACK_KEY) === '1';
    } catch (_) {
      /* private mode — default ON */
    }

    /* --- prebound listeners --- */
    this._onStartClick = this._onStartClick.bind(this);
    this._onRestartClick = this._onRestartClick.bind(this);
    this._onPostXClick = this._onPostXClick.bind(this);
    this._onDonackToggleClick = this._onDonackToggleClick.bind(this);
    this._onGameStart = this._onGameStart.bind(this);
    this._onGameReset = this._onGameReset.bind(this);
    this._onGameWin = this._onGameWin.bind(this);
    this._onGoal = this._onGoal.bind(this);
    this._onGoalContact = this._onGoalContact.bind(this);
    this._onWinPointerDown = this._onWinPointerDown.bind(this);

    this._startBtn.addEventListener('click', this._onStartClick);
    this._restartBtn.addEventListener('click', this._onRestartClick);
    this._postXBtn.addEventListener('click', this._onPostXClick);
    if (this._donackToggleBtn !== null) {
      this._donackToggleBtn.addEventListener('click', this._onDonackToggleClick);
      this._renderDonackToggle();
    }
    // Replay-friction fix: a tap anywhere on the result overlay flushes the
    // 2.2s staged reveal (no-op once all cues have fired).
    this._winEl.addEventListener('pointerdown', this._onWinPointerDown);

    /* Touch devices get touch controls guidance instead of the keyboard rows
       (the drag joystick is otherwise undiscoverable on phones). */
    const hints = document.getElementById('key-hints');
    if (hints !== null && typeof window !== 'undefined' && 'ontouchstart' in window) {
      hints.innerHTML =
        '<span><kbd>ドラッグ / Drag</kbd>うごく / Move</span>' +
        '<span><kbd>2本指 / 2nd finger</kbd>ブースト / Boost</span>' +
        '<span><kbd>DASH</kbd>ダッシュ / Dash</span>';
    }

    bus.on(EVT.GAME_START, this._onGameStart);
    bus.on(EVT.GAME_RESET, this._onGameReset);
    bus.on(EVT.GAME_WIN, this._onGameWin);
    bus.on(EVT.GOAL, this._onGoal);
    bus.on(EVT.GOAL_CONTACT, this._onGoalContact);

    this._refreshTitleBest();
  }

  /**
   * Wire the Donack controller (constructed AFTER screens in main.js boot
   * order — integrator calls this once). Pushes the persisted OFF state so
   * button and controller agree from frame one.
   * @param {{ setOff: (b: boolean) => void }} donack
   */
  setDonack(donack) {
    this._donack = donack || null;
    if (this._donack !== null) this._donack.setOff(this._donackOff);
  }

  /* ---------------------------------------------------------------- */
  /* Button handlers — emit only; visibility reacts to the bus          */
  /* ---------------------------------------------------------------- */

  /** START — title screen dismissed; the state machine takes it from here. */
  _onStartClick() {
    this._bus.emit(EVT.GAME_START, PAYLOADS.gameStart);
  }

  /**
   * ROLL AGAIN — the label promises an immediate replay, so emit reset THEN
   * start (well-ordered: reset rebuilds the world and shows the title, start
   * hides the overlays and play resumes in the freshly preloaded world).
   */
  _onRestartClick() {
    this._bus.emit(EVT.GAME_RESET, PAYLOADS.gameReset);
    this._bus.emit(EVT.GAME_START, PAYLOADS.gameStart);
  }

  /**
   * Xでシェア — synchronous inside the click gesture. window.open WITHOUT
   * 'noopener' so null reliably means "blocked / webview" -> same-tab
   * fallback via location.href (accepted result-screen abandonment).
   */
  _onPostXClick() {
    if (this._xUrl === '') return;
    const w = window.open(this._xUrl, '_blank');
    if (w === null) location.href = this._xUrl;
  }

  /**
   * 🦆 ドナック実況 ON/OFF — flip, persist LS_DONACK_KEY ('1' = off), update
   * the pill label and tell the controller (drops everything while off).
   */
  _onDonackToggleClick() {
    this._donackOff = !this._donackOff;
    try {
      localStorage.setItem(LS_DONACK_KEY, this._donackOff ? '1' : '0');
    } catch (_) {
      /* private mode — the toggle still works for this session */
    }
    this._renderDonackToggle();
    if (this._donack !== null) this._donack.setOff(this._donackOff);
  }

  /** Sync the #donack-toggle label/aria with the persisted state. */
  _renderDonackToggle() {
    this._donackToggleBtn.textContent = this._donackOff
      ? '🦆 ドナック実況 OFF'
      : '🦆 ドナック実況 ON';
    this._donackToggleBtn.setAttribute('aria-pressed', this._donackOff ? 'false' : 'true');
  }

  /* ---------------------------------------------------------------- */
  /* Bus handlers (payloads are reused objects — read-only, no retain)  */
  /* ---------------------------------------------------------------- */

  /** 'game:start' — both overlays out of the way; clear staged result state. */
  _onGameStart() {
    this._clearReveal();
    this._titleEl.classList.add('hidden');
    this._winEl.classList.add('hidden');
    this._goal = null;
    this._xUrl = '';
  }

  /** 'game:reset' — back to the title screen (refresh 自己ベスト). */
  _onGameReset() {
    this._clearReveal();
    this._winEl.classList.add('hidden');
    this._titleEl.classList.remove('hidden');
    this._refreshTitleBest();
  }

  /**
   * 'goal' — copy every field (the payload object is reused!) and prebuild
   * the X intent URL immediately, from these values, never the animated DOM.
   * @param {GoalEvent} p
   */
  _onGoal(p) {
    this._goal = {
      timeS: p.timeS,
      score: p.score,
      rank: p.rank,
      trueRadius: p.trueRadius,
      absorbed: p.absorbed,
      raresFound: p.raresFound,
      seed: p.seed >>> 0,
      newRecordTime: p.newRecordTime === true,
      newRecordScore: p.newRecordScore === true,
      collectFound: typeof p.collectFound === 'number' ? p.collectFound : 0,
    };
    this._xUrl = this._buildXUrl(this._goal);
  }

  /**
   * Pointerdown on #win-overlay during the staged reveal — skip straight to
   * the fully-revealed result. The buttons get their .result-reveal slightly
   * LATE (SKIP_BUTTONS_DELAY_MS) so the skipping tap's own click can never
   * land on a button that became clickable mid-gesture.
   */
  _onWinPointerDown() {
    if (this._revealTimers.length === 0) return; // reveal already complete
    const g = this._goal;
    if (g === null) return;
    for (let i = 0; i < this._revealTimers.length; i++) {
      clearTimeout(this._revealTimers[i]);
    }
    this._revealTimers.length = 0;
    if (this._countupRaf !== 0) {
      cancelAnimationFrame(this._countupRaf);
      this._countupRaf = 0;
    }
    this._scoreEl.textContent = g.score.toLocaleString('ja-JP');
    this._rowTimeEl.classList.add('result-reveal');
    this._rowScoreEl.classList.add('result-reveal');
    this._rowSizeEl.classList.add('result-reveal');
    this._rowDetailEl.classList.add('result-reveal');
    this._rankEl.classList.add('stamp');
    this._collectWrapEl.classList.add('result-reveal');
    if (g.newRecordTime || g.newRecordScore) this._badgeEl.classList.remove('hidden');
    this._bestEl.classList.add('result-reveal');
    this._seedLineEl.classList.add('result-reveal');
    this._schedule(SKIP_BUTTONS_DELAY_MS, () => {
      this._buttonsEl.classList.add('result-reveal');
    });
  }

  /** 'goalContact' — white flash pop (0.12 s in / FLASH_S out via CSS). */
  _onGoalContact() {
    this._flashEl.classList.remove('flash');
    void this._flashEl.offsetWidth; // reflow — restartable animation
    this._flashEl.classList.add('flash');
  }

  /**
   * 'game:win' — staged result reveal from the cached goal. Falls back to
   * the immediate v1 layout (no .staged) if no goal was cached.
   * @param {GameWinEvent} p
   */
  _onGameWin(p) {
    const g = this._goal;
    this._clearReveal();

    if (g === null) {
      // Legacy/v1 path: fill what the win payload carries, show instantly.
      const seed = p !== undefined && p.seed ? p.seed >>> 0 : this._seed;
      this._winSizeEl.textContent = formatLength(p !== undefined ? p.trueRadius : 0);
      this._winSeedEl.textContent = String(seed);
      this._buildCollectionGrid(
        this._collection !== null && typeof this._collection.foundCount === 'number'
          ? this._collection.foundCount
          : 0
      );
      this._winEl.classList.remove('hidden');
      return;
    }

    /* ---- fill static values from the cached goal ---- */
    this._timeEl.textContent = formatTime(g.timeS);
    this._scoreEl.textContent = '0'; // counts up at its cue
    this._winSizeEl.textContent = formatLength(g.trueRadius);
    this._absorbedEl.textContent = String(g.absorbed);
    this._raresEl.textContent = String(g.raresFound);
    this._rankEl.textContent = g.rank;
    this._winSeedEl.textContent = String(g.seed);
    this._bestEl.textContent = this._buildBestLine();
    this._buildCollectionGrid(g.collectFound);

    /* ---- staged reveal ---- */
    this._winEl.classList.add('staged');
    this._winEl.classList.remove('hidden');
    this._schedule(CUE_TIME_MS, () => {
      this._rowTimeEl.classList.add('result-reveal');
    });
    this._schedule(CUE_SCORE_MS, () => {
      this._rowScoreEl.classList.add('result-reveal');
      this._startCountup(g.score);
    });
    this._schedule(CUE_SIZE_MS, () => {
      this._rowSizeEl.classList.add('result-reveal');
      this._rowDetailEl.classList.add('result-reveal');
    });
    this._schedule(CUE_RANK_MS, () => {
      this._rankEl.classList.add('stamp'); // sfx thud lands here (+1.6s ctx)
    });
    this._schedule(CUE_COLLECT_MS, () => {
      this._collectWrapEl.classList.add('result-reveal'); // v3 album cue
    });
    this._schedule(CUE_RECORD_MS, () => {
      if (g.newRecordTime || g.newRecordScore) {
        this._badgeEl.classList.remove('hidden');
      }
      this._bestEl.classList.add('result-reveal');
      this._seedLineEl.classList.add('result-reveal');
      this._buttonsEl.classList.add('result-reveal');
    });
  }

  /**
   * Build the COLLECT_TOTAL-cell collection grid (one-shot per win — allocation OK).
   * Cells in frozen-id order: found = thumbnail + name, unfound = .unfound
   * 「？」, .cell-new badge on first-ever finds of this run.
   * @param {number} foundCount Header n (GoalEvent.collectFound).
   */
  _buildCollectionGrid(foundCount) {
    this._collectNEl.textContent = String(foundCount);
    const grid = this._collectGridEl;
    grid.textContent = ''; // drop last run's cells
    const c = this._collection;
    const hasAlbum = c !== null && typeof c.isFound === 'function';
    for (let id = 0; id < COLLECT_TOTAL; id++) {
      const cell = document.createElement('div');
      cell.className = 'collect-cell';
      if (hasAlbum && c.isFound(id)) {
        const url = typeof c.thumbnailUrl === 'function' ? c.thumbnailUrl(id) : '';
        if (typeof url === 'string' && url !== '') {
          const img = document.createElement('img');
          img.src = url;
          img.alt = '';
          cell.appendChild(img);
        }
        const name = document.createElement('span');
        const nameJa = DISPLAY_NAME_BY_CODE[collectibleCodeForId(id)];
        name.textContent = typeof nameJa === 'string' ? nameJa : '';
        cell.appendChild(name);
        if (typeof c.isNewThisRun === 'function' && c.isNewThisRun(id)) {
          const badge = document.createElement('span');
          badge.className = 'cell-new';
          badge.textContent = 'NEW';
          cell.appendChild(badge);
        }
      } else {
        cell.classList.add('unfound');
      }
      grid.appendChild(cell);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Staged-reveal machinery                                            */
  /* ---------------------------------------------------------------- */

  /**
   * @param {number} ms Delay.
   * @param {() => void} fn Reveal step.
   */
  _schedule(ms, fn) {
    this._revealTimers.push(setTimeout(fn, ms));
  }

  /** Cancel pending reveals + count-up and strip all staged classes. */
  _clearReveal() {
    for (let i = 0; i < this._revealTimers.length; i++) {
      clearTimeout(this._revealTimers[i]);
    }
    this._revealTimers.length = 0;
    if (this._countupRaf !== 0) {
      cancelAnimationFrame(this._countupRaf);
      this._countupRaf = 0;
    }
    this._winEl.classList.remove('staged');
    this._rowTimeEl.classList.remove('result-reveal');
    this._rowScoreEl.classList.remove('result-reveal');
    this._rowSizeEl.classList.remove('result-reveal');
    this._rowDetailEl.classList.remove('result-reveal');
    this._collectWrapEl.classList.remove('result-reveal');
    this._bestEl.classList.remove('result-reveal');
    this._seedLineEl.classList.remove('result-reveal');
    this._buttonsEl.classList.remove('result-reveal');
    this._rankEl.classList.remove('stamp');
    this._badgeEl.classList.add('hidden');
    this._flashEl.classList.remove('flash');
  }

  /**
   * rAF count-up of #result-score, 0 -> finalScore over COUNTUP_MS, ease-out.
   * @param {number} finalScore
   */
  _startCountup(finalScore) {
    const startMs = performance.now();
    const el = this._scoreEl;
    const tick = () => {
      const k = Math.min((performance.now() - startMs) / COUNTUP_MS, 1);
      const eased = 1 - (1 - k) * (1 - k) * (1 - k); // easeOutCubic
      el.textContent = Math.round(finalScore * eased).toLocaleString('ja-JP');
      if (k < 1) {
        this._countupRaf = requestAnimationFrame(tick);
      } else {
        this._countupRaf = 0;
      }
    };
    this._countupRaf = requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------------- */
  /* Best records / X intent                                            */
  /* ---------------------------------------------------------------- */

  /**
   * Title 自己ベスト line via RunStats.loadBest() (static — never construct
   * RunStats here). Hidden when no valid best exists (private mode etc.).
   */
  _refreshTitleBest() {
    let best = null;
    try {
      best = RunStats.loadBest();
    } catch (_) {
      best = null;
    }
    const rec = best !== null ? (best.bestTime !== null ? best.bestTime : best.bestScore) : null;
    if (rec === null) {
      this._titleBestLineEl.classList.add('hidden');
      return;
    }
    this._titleBestValueEl.textContent =
      'RANK ' + rec.rank + ' ・ ' + formatTime(rec.timeS) + ' ・ ' +
      rec.score.toLocaleString('ja-JP') + 'pt';
    this._titleBestLineEl.classList.remove('hidden');
  }

  /**
   * Result ベスト line — read AFTER runStats persisted this run (GOAL is
   * emitted after the atomic best update, so loadBest reflects it).
   * @returns {string}
   */
  _buildBestLine() {
    let best = null;
    try {
      best = RunStats.loadBest();
    } catch (_) {
      best = null;
    }
    if (best === null) return '';
    let line = '';
    if (best.bestTime !== null) {
      line += 'ベストタイム ' + formatTime(best.bestTime.timeS) + ' (RANK ' + best.bestTime.rank + ')';
    }
    if (best.bestScore !== null) {
      if (line !== '') line += ' ／ ';
      line += 'ベストスコア ' + best.bestScore.score.toLocaleString('ja-JP');
    }
    return line === '' ? '' : '自己ベスト: ' + line;
  }

  /**
   * Build the X web-intent URL from a goal COPY (v3 text template,
   * DESIGN-V3.md §フィードバック — ~150/280 weighted chars; the #FableKatamari
   * tag rides the existing `hashtags=` param, NOT the text, so it is never
   * doubled).
   * @param {GoalEvent} g
   * @returns {string}
   */
  _buildXUrl(g) {
    // SAME battle-tested mechanism as v2: time/rank/score/collection in
    // `text`, hashtag via `hashtags=`, link via `url=` (separate params
    // avoid encoding pitfalls and let X count the URL at its fixed weight).
    const text =
      '🗼FABLE KATAMARI 東京を転がした！\n' +
      '⏱' + formatTime(g.timeS) +
      '／RANK ' + g.rank +
      '／⭐' + g.score.toLocaleString('ja-JP') + '\n' +
      '🏯レア' + g.collectFound + '/' + COLLECT_TOTAL + 'コレクション';
    return X_INTENT +
      '?text=' + encodeURIComponent(text) +
      '&url=' + encodeURIComponent(SHARE_URL) +
      '&hashtags=' + encodeURIComponent('FableKatamari');
  }
}
