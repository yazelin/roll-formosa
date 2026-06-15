/**
 * @file bgm.js — Procedural WebAudio BGM: 128 BPM swung-8ths A-major
 * bossa-pop, 4 tier-unlocked layers, zero audio assets (DESIGN-V2.md §オーディオ).
 *
 * ALLOCATION-LAW BOUNDED EXEMPTION (binding, see DESIGN.md v2 chapter):
 * WebAudio node creation in sfx.js + bgm.js is an explicit, BOUNDED exemption
 * to the zero-per-frame-allocation law. Budget: <= NODE_BUDGET_PER_S (60)
 * short-lived nodes per second for BGM ALONE (worst case here, all layers
 * unlocked, is ~52.3/s: bass 8 + kick 4 + rim 4 + hats 16 + stabs 14 +
 * lead 12 (densest MELODY bar has 6 notes x osc+gain) + shaker 32 + arp 8
 * = 98 per 1.875 s bar; the one-shot GOAL_CALL shimmer adds 6 in one
 * second). sfx.js has its own allowance and rate-caps its absorb blips
 * (BLIP_MIN_INTERVAL_S) so combined creation stays bounded even during
 * dense-cluster dashes. Expensive allocations are HOISTED: ONE persistent
 * shared noise AudioBuffer (hats/rim/shaker) and the lead PeriodicWave are
 * created once at context init; per-layer filters are persistent nodes.
 * Verified via the debug-overlay heap-delta line in the Phase-3 profile pass.
 *
 * Scheduling: standard two-clock lookahead — setInterval(TICK_MS 25) walks a
 * step counter and schedules every note up to LOOKAHEAD_S (0.12 s) ahead of
 * ctx.currentTime. ALL delayed gain moves (layer fades, duck->stop, swells)
 * are scheduled in CONTEXT TIME via setValueAtTime / linearRampToValueAtTime /
 * setTargetAtTime — setTimeout is BANNED in this file.
 *
 * Lifecycle (bus-driven):
 *   GAME_START   -> (re)create+resume ctx (the start click IS the gesture),
 *                   rewind to bar 0, restore master gain, start the scheduler.
 *   TIER_UP      -> layer unlock fades (LAYER_FADE_S ramps; cosmetic only —
 *                   v3: re-keyed to the 7-tier table, L1 t>=2 / L2 t>=3 /
 *                   L3 t>=5 so unlocks land on 電気街 / 下町 / 大東京).
 *   GOAL_CALL    -> momentary shimmer swell.
 *   GOAL_CONTACT -> master ducks to DUCK_GAIN over 0.3 s then linear-ramps to
 *                   0 ending 1.5 s later; scheduler stops (run is over).
 *   GAME_RESET   -> stop + rewind (title is silent).
 *
 * TAB VISIBILITY (binding): on hidden -> clearInterval + ctx.suspend() (sfx
 * unaffected — Bgm owns its OWN AudioContext); on visible -> ctx.resume() and
 * RE-ANCHOR nextNoteTime = ctx.currentTime + LOOKAHEAD_S keeping the bar/beat
 * counter (missed beats are SKIPPED, never burst-scheduled).
 *
 * setMuted(true) stops note-node creation entirely (scheduler halted), not
 * just gain = 0, to honor the node budget.
 */

import { bus as defaultBus, EVT } from '../core/events.js';

/* ---- module-local tuning (DESIGN-V2.md チューニング定数) ---- */
const BPM = 128;
const LOOKAHEAD_S = 0.12;
const TICK_MS = 25;
const LAYER_FADE_S = 1.5;
const DUCK_GAIN = 0.12;
const BGM_GAIN = 0.32;
/** Documented short-lived node budget — BGM-ONLY scope (worst case ~52.3/s,
 *  see header). sfx.js is budgeted separately and rate-caps its absorb blips. */
export const NODE_BUDGET_PER_S = 60;

/* ---- musical grid ---- */
const BEAT_S = 60 / BPM;
/** Swing: on-beat 8th lasts SWING*beat, off-beat 8th (1-SWING)*beat. */
const SWING = 0.58;
const STEPS_PER_BAR = 8; // 8th notes
const BARS_PER_CYCLE = 16; // |AM7|D9|F#m7|E7sus4->E7| x 4 bars each
const STEPS_PER_CYCLE = STEPS_PER_BAR * BARS_PER_CYCLE; // 128

/* ---- harmony: 16-bar chord cycle in A major ---- */
/** Chord shapes: bass root (Hz, ~2nd octave) + stab/pad tones (mid register). */
const CHORDS = [
  { bass: 110.0, tones: [220.0, 277.18, 329.63, 415.3] }, // AM7  (A C# E G#)
  { bass: 73.42, tones: [293.66, 369.99, 440.0, 329.63] }, // D9   (D F# A +E)
  { bass: 92.5, tones: [185.0, 220.0, 277.18, 329.63] }, // F#m7 (F# A C# E)
  { bass: 82.41, tones: [164.81, 220.0, 246.94, 293.66] }, // E7sus4 (E A B D)
  { bass: 82.41, tones: [164.81, 207.65, 246.94, 293.66] }, // E7   (E G# B D)
];
/** Per-bar chord index into CHORDS — E7sus4 resolves to E7 on bars 14-15. */
const BAR_CHORD = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4];

/* ---- L2 lead: A-major pentatonic melody table, 64 8th-steps (8 bars,
 * loops twice per 16-bar cycle), -1 = rest. 30ms portamento between notes. */
const PENT = [440.0, 493.88, 554.37, 659.25, 739.99, 880.0, 987.77, 1108.73, 1318.51];
// prettier-ignore
const MELODY = [
  0, -1,  2,  3, -1,  3,  2,  1,   // bar 1
  0, -1, -1,  0,  2, -1,  1, -1,   // bar 2
  2, -1,  3,  4, -1,  4,  3,  2,   // bar 3
  3, -1, -1, -1,  2,  1,  0, -1,   // bar 4
  5, -1,  4,  3, -1,  3,  4,  5,   // bar 5
  3, -1, -1,  2,  3, -1,  1, -1,   // bar 6
  0, -1,  1,  2,  3, -1,  4,  3,   // bar 7
  2, -1,  1, -1,  0, -1, -1, -1,   // bar 8
];

/** Tier gates for layers L1..L3 (L0 plays from GAME_START).
 *  v3 (7-tier table, docs/DESIGN-V3.md): L1 at T2 電気街 (out of the shop),
 *  L2 at T3 下町, L3 at T5 大東京 — the unlock arc spans the longer run. */
const L1_TIER = 2;
const L2_TIER = 3;
const L3_TIER = 5;

/**
 * Tier-layered lookahead-scheduled BGM. Construct once at boot; main.js owns
 * mute (calls setMuted) and passes the persisted initial state.
 */
export class Bgm {
  /**
   * @param {import('../core/events.js').EventBus} [eventBus] Bus; defaults to the singleton.
   * @param {boolean} [initialMuted] Persisted mute state, read by main.js from
   *   LS_MUTE_KEY BEFORE construction (applied inside the lazy ctx path).
   */
  constructor(eventBus = defaultBus, initialMuted = false) {
    this._bus = eventBus;
    /** @type {boolean} */
    this._muted = initialMuted === true;

    /** @type {AudioContext|null} Bgm owns its OWN context (separate from sfx). */
    this._ctx = null;
    /** @type {GainNode|null} */
    this._master = null;
    /** @type {GainNode[]|null} Layer gains L0..L3 -> master. */
    this._layers = null;
    /** @type {BiquadFilterNode|null} persistent stab lowpass (1200 Hz) -> L1. */
    this._stabLP = null;
    /** @type {BiquadFilterNode|null} persistent hi-hat highpass -> L1. */
    this._hatHP = null;
    /** @type {BiquadFilterNode|null} persistent lead lowpass (2400 Hz) -> L2. */
    this._leadLP = null;
    /** @type {BiquadFilterNode|null} persistent shaker bandpass -> L3. */
    this._shakerBP = null;
    /** @type {AudioBuffer|null} ONE shared noise buffer (hats/rim/shaker). */
    this._noiseBuf = null;
    /** @type {PeriodicWave|null} soft-saw lead wave, built once at init. */
    this._leadWave = null;

    /** @type {boolean} Music logically running (GAME_START..contact/reset). */
    this._playing = false;
    /** @type {number} Global 8th-step counter, 0..STEPS_PER_CYCLE-1. */
    this._step = 0;
    /** @type {number} Ctx time of the next unscheduled step. */
    this._nextNoteTime = 0;
    /** @type {number} Current tier (TIER_UP), gates layer note creation. */
    this._tier = 0;
    /** @type {number} Last lead frequency for the 30ms portamento (0 = none). */
    this._lastLeadFreq = 0;
    /** @type {ReturnType<typeof setInterval>|0} */
    this._tickId = 0;
    /** @type {boolean} dispose() called — _ensureCtx must never resurrect. */
    this._disposed = false;

    /* --- prebound handlers --- */
    this._onTick = this._onTick.bind(this);
    this._onGesture = this._onGesture.bind(this);
    this._onVisibility = this._onVisibility.bind(this);
    this._onGameStart = this._onGameStart.bind(this);
    this._onGameReset = this._onGameReset.bind(this);
    this._onTierUp = this._onTierUp.bind(this);
    this._onGoalCall = this._onGoalCall.bind(this);
    this._onGoalContact = this._onGoalContact.bind(this);

    /* --- first-gesture AudioContext bootstrap (own listeners; the START
     * click also routes here via GAME_START) --- */
    window.addEventListener('pointerdown', this._onGesture);
    window.addEventListener('keydown', this._onGesture);
    window.addEventListener('touchstart', this._onGesture);
    document.addEventListener('visibilitychange', this._onVisibility);

    eventBus.on(EVT.GAME_START, this._onGameStart);
    eventBus.on(EVT.GAME_RESET, this._onGameReset);
    eventBus.on(EVT.TIER_UP, this._onTierUp);
    eventBus.on(EVT.GOAL_CALL, this._onGoalCall);
    eventBus.on(EVT.GOAL_CONTACT, this._onGoalContact);
  }

  /* ---------------------------------------------------------------- */
  /* Public API                                                         */
  /* ---------------------------------------------------------------- */

  /**
   * Mute/unmute. Muting HALTS note-node creation (scheduler stopped), not
   * just gain — honors the node budget. Unmuting re-anchors and resumes if
   * a run is in progress.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this._muted = muted === true;
    const ctx = this._ctx;
    if (ctx === null || this._master === null) return;
    const t = ctx.currentTime;
    if (this._muted) {
      this._stopTick();
      this._master.gain.cancelScheduledValues(t);
      this._master.gain.setTargetAtTime(0, t, 0.02);
    } else {
      if (this._playing) {
        this._master.gain.cancelScheduledValues(t);
        this._master.gain.setTargetAtTime(BGM_GAIN, t, 0.02);
        this._nextNoteTime = t + LOOKAHEAD_S; // re-anchor, skip missed beats
        this._startTick();
      }
    }
  }

  /** Tear down listeners, bus subscriptions, scheduler and the context
   *  (tests / teardown). A disposed Bgm can never resurrect a context:
   *  the bus handlers are unsubscribed AND _ensureCtx checks _disposed. */
  dispose() {
    this._disposed = true;
    window.removeEventListener('pointerdown', this._onGesture);
    window.removeEventListener('keydown', this._onGesture);
    window.removeEventListener('touchstart', this._onGesture);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._bus.off(EVT.GAME_START, this._onGameStart);
    this._bus.off(EVT.GAME_RESET, this._onGameReset);
    this._bus.off(EVT.TIER_UP, this._onTierUp);
    this._bus.off(EVT.GOAL_CALL, this._onGoalCall);
    this._bus.off(EVT.GOAL_CONTACT, this._onGoalContact);
    this._stopTick();
    this._playing = false;
    if (this._ctx !== null) {
      this._ctx.close();
      this._ctx = null;
      this._master = null;
      this._layers = null;
      this._noiseBuf = null;
      this._leadWave = null;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Bus / DOM handlers                                                 */
  /* ---------------------------------------------------------------- */

  /** Any user gesture: lazily create + resume our context. The guard is
   *  `state !== 'running'` (not `=== 'suspended'`) so the non-standard iOS
   *  'interrupted' state (phone call / Siri / media takeover) also resumes —
   *  resume() from 'interrupted' requires a user gesture, which this is. */
  _onGesture() {
    this._ensureCtx();
    if (this._ctx !== null && this._ctx.state !== 'running') {
      this._ctx.resume();
    }
  }

  /**
   * Tab visibility (binding): hidden -> stop tick + suspend (sfx unaffected);
   * visible -> resume + re-anchor nextNoteTime keeping the step counter
   * (missed beats are skipped, NEVER burst catch-up scheduled).
   */
  _onVisibility() {
    const ctx = this._ctx;
    if (document.visibilityState === 'hidden') {
      this._stopTick();
      if (ctx !== null && ctx.state === 'running') ctx.suspend();
    } else {
      // `!== 'running'` also covers iOS Safari's non-standard 'interrupted'
      // state (phone call / Siri); the nextNoteTime re-anchor below stays
      // unconditional so a later gesture-resume never bursts backlogged steps.
      if (ctx !== null && ctx.state !== 'running') ctx.resume();
      if (ctx !== null && this._playing && !this._muted) {
        this._nextNoteTime = ctx.currentTime + LOOKAHEAD_S;
        this._startTick();
      }
    }
  }

  /** 'game:start' — the click IS the gesture; rewind and start the loop. */
  _onGameStart() {
    this._onGesture();
    const ctx = this._ctx;
    if (ctx === null || this._master === null) return; // no WebAudio: silent
    this._stopTick();
    this._step = 0;
    this._tier = 0;
    this._lastLeadFreq = 0;
    this._playing = true;
    const t = ctx.currentTime;
    this._master.gain.cancelScheduledValues(t);
    this._master.gain.setValueAtTime(this._muted ? 0 : BGM_GAIN, t);
    this._applyLayerGains(t, true);
    if (!this._muted) {
      this._nextNoteTime = t + 0.06;
      this._startTick();
    }
  }

  /** 'game:reset' — stop + rewind (title is silent). */
  _onGameReset() {
    this._playing = false;
    this._stopTick();
    this._step = 0;
    this._tier = 0;
    this._lastLeadFreq = 0;
    const ctx = this._ctx;
    if (ctx !== null && this._master !== null) {
      const t = ctx.currentTime;
      this._master.gain.cancelScheduledValues(t);
      this._master.gain.setTargetAtTime(0, t, 0.05);
      this._applyLayerGains(t, true);
    }
  }

  /**
   * 'tierUp' — cosmetic-only layer unlock: LAYER_FADE_S linear ramps in ctx
   * time. Node creation for a layer is gated on the same tier compare.
   * @param {import('../types.js').TierUpEvent} p
   */
  _onTierUp(p) {
    this._tier = p.tierIndex;
    const ctx = this._ctx;
    if (ctx === null || this._layers === null || !this._playing) return;
    this._applyLayerGains(ctx.currentTime, false);
  }

  /** 'goalCall' — momentary shimmer swell (high sine arp, swelling gain). */
  _onGoalCall() {
    const ctx = this._ctx;
    if (ctx === null || this._master === null || this._muted || !this._playing) return;
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.6);
    g.gain.linearRampToValueAtTime(0, t + 1.4);
    g.connect(this._master);
    // E6 A6 C#7 E7 A7 rising shimmer, 0.18s apart.
    const notes = [1318.51, 1760.0, 2217.46, 2637.02, 3520.0];
    for (let i = 0; i < notes.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], t + i * 0.18);
      osc.connect(g);
      osc.start(t + i * 0.18);
      osc.stop(t + i * 0.18 + 0.9);
    }
  }

  /**
   * 'goalContact' — duck then stop, all in ctx time: master linear-ramps to
   * DUCK_GAIN by +0.3s, then to 0 ending 1.5s later (+1.8s total). The
   * scheduler stops immediately (the run is over; GAME_RESET rewinds).
   */
  _onGoalContact() {
    this._playing = false;
    this._stopTick();
    const ctx = this._ctx;
    if (ctx === null || this._master === null) return;
    const t = ctx.currentTime;
    const gain = this._master.gain;
    gain.cancelScheduledValues(t);
    gain.setValueAtTime(this._muted ? 0 : gain.value, t);
    if (!this._muted) {
      gain.linearRampToValueAtTime(DUCK_GAIN, t + 0.3);
      gain.linearRampToValueAtTime(0, t + 1.8);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Context / graph bootstrap (hoisted allocations live here)          */
  /* ---------------------------------------------------------------- */

  /** Create the AudioContext + persistent graph (idempotent). */
  _ensureCtx() {
    if (this._ctx !== null || this._disposed) return;
    const AC = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
    if (AC === undefined) return; // no WebAudio — stay silent forever
    const ctx = new AC();
    this._ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0; // silent until GAME_START (title is silent)
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ctx.destination);
    this._master = master;

    // Layer gains L0..L3 -> master.
    const layers = [];
    for (let i = 0; i < 4; i++) {
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 1 : 0;
      g.connect(master);
      layers.push(g);
    }
    this._layers = layers;

    // Persistent per-voice filters (hoisted — never created per note).
    const stabLP = ctx.createBiquadFilter();
    stabLP.type = 'lowpass';
    stabLP.frequency.value = 1200;
    stabLP.Q.value = 0.5;
    stabLP.connect(layers[1]);
    this._stabLP = stabLP;

    const hatHP = ctx.createBiquadFilter();
    hatHP.type = 'highpass';
    hatHP.frequency.value = 7000;
    hatHP.connect(layers[1]);
    this._hatHP = hatHP;

    const leadLP = ctx.createBiquadFilter();
    leadLP.type = 'lowpass';
    leadLP.frequency.value = 2400;
    leadLP.Q.value = 0.7;
    leadLP.connect(layers[2]);
    this._leadLP = leadLP;

    const shakerBP = ctx.createBiquadFilter();
    shakerBP.type = 'bandpass';
    shakerBP.frequency.value = 5500;
    shakerBP.Q.value = 1.4;
    shakerBP.connect(layers[3]);
    this._shakerBP = shakerBP;

    // ONE persistent shared noise buffer (hats / rimshot / shaker) — the
    // hoisted expensive allocation of the bounded exemption.
    const len = (ctx.sampleRate * 1.0) | 0;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let seed = 0x6d6f6f6e; // legacy v2 noise seed (value kept — same noise texture)
    for (let i = 0; i < len; i++) {
      seed = (seed * 1664525 + 1013904223) | 0;
      data[i] = ((seed >>> 9) / 0x3fffff - 1) * 0.8;
    }
    this._noiseBuf = buf;

    // Lead PeriodicWave (soft saw, 8 harmonics at 1/n) — built once at init.
    const N = 9;
    const real = new Float32Array(N);
    const imag = new Float32Array(N);
    for (let n = 1; n < N; n++) imag[n] = 1 / n;
    this._leadWave = ctx.createPeriodicWave(real, imag);
  }

  /**
   * Drive layer gains toward their tier targets.
   * @param {number} t Ctx time to anchor at.
   * @param {boolean} snap True = setValueAtTime (reset/start), false = LAYER_FADE_S ramp.
   */
  _applyLayerGains(t, snap) {
    const layers = this._layers;
    if (layers === null) return;
    const targets = [
      1,
      this._tier >= L1_TIER ? 1 : 0,
      this._tier >= L2_TIER ? 1 : 0,
      this._tier >= L3_TIER ? 1 : 0,
    ];
    for (let i = 0; i < 4; i++) {
      const g = layers[i].gain;
      g.cancelScheduledValues(t);
      if (snap) {
        g.setValueAtTime(targets[i], t);
      } else {
        g.setValueAtTime(g.value, t);
        g.linearRampToValueAtTime(targets[i], t + LAYER_FADE_S);
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Two-clock lookahead scheduler                                      */
  /* ---------------------------------------------------------------- */

  _startTick() {
    if (this._tickId !== 0) return;
    this._tickId = setInterval(this._onTick, TICK_MS);
  }

  _stopTick() {
    if (this._tickId !== 0) {
      clearInterval(this._tickId);
      this._tickId = 0;
    }
  }

  /** Scheduler tick: schedule every step inside the lookahead window. */
  _onTick() {
    const ctx = this._ctx;
    if (ctx === null || !this._playing || this._muted) return;
    const horizon = ctx.currentTime + LOOKAHEAD_S;
    let guard = 0; // belt-and-suspenders: never burst more than a bar
    while (this._nextNoteTime < horizon && guard < STEPS_PER_BAR) {
      this._scheduleStep(this._step, this._nextNoteTime);
      const dur = (this._step & 1) === 0 ? SWING * BEAT_S : (1 - SWING) * BEAT_S;
      this._nextNoteTime += dur;
      this._step = (this._step + 1) % STEPS_PER_CYCLE;
      guard++;
    }
  }

  /**
   * Schedule one swung 8th-step. Layer node creation is gated on this._tier
   * (gain ramps make unlocks smooth); ~51 nodes/s worst case — see header.
   * @param {number} step Global step 0..127.
   * @param {number} t Ctx start time.
   */
  _scheduleStep(step, t) {
    const bar = (step / STEPS_PER_BAR) | 0; // 0..15
    const sub = step & 7; // 0..7 within bar
    const chord = CHORDS[BAR_CHORD[bar]];
    const stepDur = (sub & 1) === 0 ? SWING * BEAT_S : (1 - SWING) * BEAT_S;

    /* ---- L0: bossa bass + sine-drop kick + soft rimshot ---- */
    if (sub === 0) this._bass(chord.bass, t, 0.5);
    else if (sub === 3) this._bass(chord.bass * 1.5, t, 0.32);
    else if (sub === 4) this._bass(chord.bass * 2, t, 0.4);
    else if (sub === 7) this._bass(chord.bass * 1.5, t, 0.26);
    if (sub === 0 || sub === 4) this._kick(t);
    if (sub === 3 || sub === 6) this._rim(t);

    /* ---- L1: detuned-saw offbeat chord stabs + swung noise hats ---- */
    if (this._tier >= L1_TIER) {
      this._hat(t, (sub & 1) === 0);
      if (sub === 1 || sub === 5) this._stab(chord, t);
    }

    /* ---- L2: pentatonic lead (64-entry table incl. rests) ---- */
    if (this._tier >= L2_TIER) {
      const mi = MELODY[step % 64];
      if (mi >= 0) this._lead(PENT[mi], t, stepDur * 1.8);
    }

    /* ---- L3: bandpass shaker 16ths + sparkle sine arp ---- */
    if (this._tier >= L3_TIER) {
      this._shaker(t, (sub & 1) === 0);
      this._shaker(t + stepDur * 0.5, false);
      if ((sub & 1) === 0) {
        const tone = chord.tones[((bar << 2) + (sub >> 1)) & 3] * 4; // +2 oct
        this._arpNote(tone, t);
      }
    }
  }

  /* ---------------------------------------------------------------- */
  /* Voices (short-lived nodes — counted against the bounded budget)    */
  /* ---------------------------------------------------------------- */

  /**
   * Triangle bossa bass note (.18) -> L0.
   * @param {number} freq @param {number} t @param {number} dur
   */
  _bass(freq, t, dur) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(/** @type {GainNode[]} */ (this._layers)[0]);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  /** Sine-drop kick 110->40 Hz (beats 1/3) -> L0. @param {number} t */
  _kick(t) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.11);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.32, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(g);
    g.connect(/** @type {GainNode[]} */ (this._layers)[0]);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  /** Soft rimshot noise tick -> L0. @param {number} t */
  _rim(t) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.06, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    src.connect(g);
    g.connect(/** @type {GainNode[]} */ (this._layers)[0]);
    src.start(t, 0.137, 0.05);
  }

  /**
   * Swung noise hi-hat (60 ms highpassed burst) -> hatHP -> L1.
   * @param {number} t @param {boolean} accent
   */
  _hat(t, accent) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const g = ctx.createGain();
    const peak = accent ? 0.05 : 0.028;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(g);
    g.connect(/** @type {BiquadFilterNode} */ (this._hatHP));
    src.start(t, 0.311, 0.07);
  }

  /**
   * Detuned-saw offbeat chord stab (.10) -> stabLP(1200) -> L1.
   * 3 upper chord tones x 2 detuned saws share ONE gain envelope.
   * @param {{bass:number, tones:number[]}} chord @param {number} t
   */
  _stab(chord, t) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    g.connect(/** @type {BiquadFilterNode} */ (this._stabLP));
    for (let i = 1; i < 4; i++) {
      const f = chord.tones[i];
      for (let d = 0; d < 2; d++) {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);
        osc.detune.setValueAtTime(d === 0 ? -7 : 7, t);
        osc.connect(g);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    }
  }

  /**
   * Lead note (soft-saw PeriodicWave, 30 ms portamento, .12) -> leadLP -> L2.
   * @param {number} freq @param {number} t @param {number} dur
   */
  _lead(freq, t, dur) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    if (this._leadWave !== null) osc.setPeriodicWave(this._leadWave);
    else osc.type = 'sawtooth';
    const from = this._lastLeadFreq > 0 ? this._lastLeadFreq : freq;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.linearRampToValueAtTime(freq, t + 0.03); // portamento
    this._lastLeadFreq = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.02);
    g.gain.setTargetAtTime(0.05, t + 0.1, 0.12);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(g);
    g.connect(/** @type {BiquadFilterNode} */ (this._leadLP));
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  /**
   * Bandpass-noise shaker 16th (.04) -> shakerBP -> L3.
   * @param {number} t @param {boolean} accent
   */
  _shaker(t, accent) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const g = ctx.createGain();
    const peak = accent ? 0.04 : 0.022;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(g);
    g.connect(/** @type {BiquadFilterNode} */ (this._shakerBP));
    src.start(t, 0.523, 0.06);
  }

  /** Sparkle sine arp note (+2 oct, .05) -> L3. @param {number} freq @param {number} t */
  _arpNote(freq, t) {
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g);
    g.connect(/** @type {GainNode[]} */ (this._layers)[3]);
    osc.start(t);
    osc.stop(t + 0.2);
  }
}
