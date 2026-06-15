/**
 * @file sfx.js — WebAudio-synthesized SFX, zero audio assets.
 *
 * Sounds: rising-pitch absorb combo blips, bonk clonk, knock-off plink,
 * tierUp 3-note arpeggio, a continuous filtered-noise roll loop whose
 * gain/brightness follow ball speed, the v2 set: dash whoosh, dash-ready
 * chime, rare sparkle gliss, goal-call pad (renamed from v2), the
 * GOAL_CONTACT 8-note grand fanfare + AM9 pad (replaces the v1 GAME_WIN
 * fanfare — the fanfare already happened at contact), the rank-stamp thud
 * scheduled +1.6 s in CTX TIME on EVT.GAME_WIN — GAME_WIN fires when the
 * finale cinematic completes, and screens.js reveals the rank stamp at
 * CUE_RANK_MS = 1600 ms after the same event, so the thud lands exactly on
 * the CSS rank-stamp reveal (EVT.GOAL fires ~8.7 s earlier, at the contact
 * instant — wrong cue for the stamp) — and the v3 pair: a landmark fanfare
 * STING on EVT.LANDMARK and a 5-note collect gliss on EVT.COLLECT.
 *
 * v3 DUAL-TAG RULE (binding, docs/DESIGN-V3.md): an object carrying BOTH
 * collectibleId and landmarkId (ハチ公像) emits COLLECT FIRST then LANDMARK
 * in the same frame, and sfx must play the landmark fanfare ONLY. Because
 * COLLECT arrives first, the collect gliss is DEFERRED one microtask
 * (_collectPending + the prebound _flushCollectGliss): both emissions are
 * synchronous inside the same task, so a LANDMARK in the same frame clears
 * the flag before the flush runs — one boolean, no timers. Collect events
 * are rare (<= 12/run) so the microtask is bounded (allocation law).
 * Curated collectibles are also FLAG_RARE -> their ScoreEvent has rare:true;
 * the rare sparkle gliss is gated to archetypeCode < 70 (chunk score-rares)
 * so the collect gliss doesn't double with it (EXTRA codes are 70..93).
 *
 * Bus-driven: subscribes to ABSORB / BOUNCE / KNOCK_OFF / TIER_UP / DASH /
 * DASH_READY / SCORE(rare) / LANDMARK / COLLECT / GOAL_CALL / GOAL_CONTACT /
 * GAME_WIN / GAME_START / GAME_RESET. The AudioContext is created and resumed on the FIRST user input
 * (pointerdown / keydown / touchstart on window) — browser autoplay policy.
 * Until then every trigger is a silent no-op.
 *
 * MUTE (v2): main.js is the single mute owner — it reads LS_MUTE_KEY before
 * construction and passes initialMuted; later toggles call setMuted(b).
 * Muted = master gain 0 AND node creation skipped (bounded-budget law).
 *
 * Roll loop: speed is not on the bus, so main.js feeds it per frame:
 *   sfx.setRollIntensity(speed01)   // speed01 = |vel| / (SPEED_K * radiusSim)
 *
 * ALLOCATION-LAW BOUNDED EXEMPTION (shared with bgm.js, see DESIGN.md v2
 * chapter): one-shot oscillator/gain nodes are created per trigger —
 * event-driven, never in the per-frame loop; the only per-frame path,
 * setRollIntensity, allocates nothing. ONE persistent shared noise
 * AudioBuffer feeds the roll loop, dash whoosh and percussive ticks.
 */

import { bus, EVT } from '../core/events.js';
import { clamp01 } from '../core/mathUtils.js';

/** Master output gain. */
const MASTER_GAIN = 0.5;
/** Absorb blip base frequency (Hz); combo adds semitones. */
const BLIP_BASE_HZ = 392; // G4
/** Combo semitone cap for the rising pitch. */
const BLIP_SEMITONE_CAP = 14;
/** tierUp arpeggio (C5-E5-G5), seconds apart. */
const ARP_NOTES = [523.25, 659.25, 783.99];
const ARP_SPACING_S = 0.09;
/** v2 grand fanfare — extended to 8 notes (C5 E5 G5 C6 E6 + G6 A6 C7). */
const FANFARE_NOTES = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 1760.0, 2093.0];
const FANFARE_SPACING_S = 0.13;
/** AM9 pad under the grand fanfare (A2 root: A C# E G# B), 2.5 s sustain. */
const AM9_PAD_NOTES = [220.0, 277.18, 329.63, 415.3, 493.88];
/** Rare sparkle gliss — 5 ascending E6-pentatonic notes, 40 ms apart. */
const RARE_GLISS_NOTES = [1318.51, 1479.98, 1760.0, 1975.53, 2217.46];
/** v3 collect gliss ('collect') — 5 ascending C-major notes (C6 E6 G6 A6 C7),
 *  brighter/rounder than the rare sparkle so the album pickup reads distinct. */
const COLLECT_GLISS_NOTES = [1046.5, 1318.51, 1567.98, 1760.0, 2093.0];
/** v3 landmark fanfare sting ('landmark') — short rising E5 G5 B5 E6 brass-ish
 *  call under the gold-ring burst; the GRAND fanfare stays GOAL_CONTACT-only. */
const LANDMARK_STING_NOTES = [659.25, 783.99, 987.77, 1318.51];
const LANDMARK_STING_SPACING_S = 0.1;
/** Goal-call pad chord (A major, low-mid) — renamed from the v2 call pad. */
const GOAL_PAD_NOTES = [220.0, 277.18, 329.63, 440.0];
/** First EXTRA curated archetype code (landmarks/collectibles, frozen 70..93):
 *  ScoreEvent rares at >= this are curated collectibles — the COLLECT gliss
 *  handles them, the chunk score-rare sparkle is skipped (no doubling). */
const EXTRA_CODE_MIN = 70;
/** Roll loop maximum gain / lowpass sweep. */
const ROLL_GAIN_MAX = 0.14;
const ROLL_FREQ_MIN = 180;
const ROLL_FREQ_MAX = 1100;
/** Min interval between absorb blips (s) — rate cap so dense-cluster dashes
 *  (3-5 absorbs/s x 4 nodes each) cannot push sfx+bgm past the bounded
 *  WebAudio node budget. Stacked same-frame blips are inaudible anyway;
 *  the latest (highest) combo pitch wins. */
const BLIP_MIN_INTERVAL_S = 0.08;

/**
 * Synthesized sound effects. Construct once at boot (subscribes to the bus
 * and installs first-gesture AudioContext bootstrapping).
 */
export class Sfx {
  /**
   * @param {import('../core/events.js').EventBus} [eventBus] Bus; defaults to the singleton.
   * @param {boolean} [initialMuted] v2: persisted mute state (main.js reads
   *   LS_MUTE_KEY BEFORE construction) — applied inside the lazy ctx path.
   */
  constructor(eventBus = bus, initialMuted = false) {
    /** @type {AudioContext|null} */
    this._ctx = null;
    /** @type {GainNode|null} */
    this._master = null;
    /** @type {GainNode|null} */
    this._rollGain = null;
    /** @type {BiquadFilterNode|null} */
    this._rollFilter = null;
    /** @type {AudioBuffer|null} ONE shared noise buffer (roll/whoosh/ticks). */
    this._noiseBuf = null;
    /** @type {number} Cached roll intensity to skip redundant param writes. */
    this._rollLevel = -1;
    /** @type {boolean} */
    this._muted = initialMuted === true;
    /** @type {boolean} Run-over latch (GOAL_CONTACT..GAME_START) — gameplay
     *  chimes (dash-ready) must not play over the finale cinematic. */
    this._runOver = false;
    /** @type {number} Ctx time of the last absorb blip (rate cap). */
    this._lastBlipAt = -1;
    /** @type {boolean} v3 dual-tag: collect gliss deferred one microtask; a
     *  same-frame LANDMARK clears it (fanfare only — see header). */
    this._collectPending = false;
    /** Prebound microtask flush (reused — no per-event closure). */
    this._flushCollectGliss = () => {
      if (this._collectPending) {
        this._collectPending = false;
        this._collectGliss();
      }
    };
    /** @type {import('../core/events.js').EventBus} */
    this._bus = eventBus;
    /** @type {Array<[string, (p?: object) => void]>} Bus subscriptions (for dispose). */
    this._subs = [];
    /** @type {boolean} dispose() called — _ensureCtx must never resurrect. */
    this._disposed = false;

    // --- first-gesture AudioContext bootstrap ---------------------------
    this._onGesture = () => {
      this._ensureCtx();
      // `!== 'running'` also covers iOS Safari's non-standard 'interrupted'
      // state (phone call / Siri) — resume() from it needs a gesture (this is one).
      if (this._ctx !== null && this._ctx.state !== 'running') {
        this._ctx.resume();
      }
    };
    window.addEventListener('pointerdown', this._onGesture);
    window.addEventListener('keydown', this._onGesture);
    window.addEventListener('touchstart', this._onGesture);

    // --- bus subscriptions (payloads reused — read fields only) -----------
    // Recorded in _subs so dispose() can unsubscribe (mirrors Backdrop/Env).
    /** @type {(name: string, h: (p?: object) => void) => void} */
    const sub = (name, h) => {
      eventBus.on(name, h);
      this._subs.push([name, h]);
    };
    sub(EVT.ABSORB, (p) => {
      this._blip(p.combo);
    });
    sub(EVT.BOUNCE, (p) => {
      this._clonk(p.impactSpeed01);
    });
    sub(EVT.KNOCK_OFF, (p) => {
      this._knock(p.count);
    });
    sub(EVT.TIER_UP, () => {
      this._arpeggio(ARP_NOTES, ARP_SPACING_S, 0.22, 0.4);
    });
    // ---- v2 ----
    sub(EVT.DASH, () => {
      this._whoosh();
    });
    sub(EVT.DASH_READY, () => {
      // The gauge keeps recharging during the finale cinematic (main keeps
      // stepping physics) — suppress the chime once the run is over.
      if (!this._runOver) this._readyChime();
    });
    sub(EVT.SCORE, (p) => {
      // v3: curated collectibles (EXTRA codes >= 70) are FLAG_RARE too — the
      // COLLECT gliss owns them; chunk score-rares keep the sparkle. Until
      // Stream D lands, v2 runStats leaves archetypeCode at -1 (< 70), so
      // chunk rares keep sparkling through the transition.
      if (p.rare && p.archetypeCode < EXTRA_CODE_MIN) this._rareGliss();
    });
    // ---- v3 ----
    sub(EVT.LANDMARK, () => {
      // Dual-tag rule: COLLECT (same frame, already dispatched) is silenced —
      // the landmark fanfare sting is the single sound for ハチ公像.
      this._collectPending = false;
      this._landmarkSting();
    });
    sub(EVT.COLLECT, () => {
      if (this._silent()) return;
      // Defer one microtask: a LANDMARK later in this same frame suppresses
      // the gliss (dual-tag rule — see header). Bounded: <= 12 collects/run.
      this._collectPending = true;
      queueMicrotask(this._flushCollectGliss);
    });
    sub(EVT.GOAL_CALL, () => {
      this._goalPad();
    });
    // The grand fanfare fires at GOAL_CONTACT (= clear instant). The v1
    // GAME_WIN fanfare handler is REMOVED — the fanfare already happened.
    sub(EVT.GOAL_CONTACT, () => {
      this._runOver = true; // gameplay chimes off until the next run
      this._grandFanfare();
      this.setRollIntensity(0);
    });
    // Rank-stamp thud: GAME_WIN (finale 'done'), NOT GOAL (contact instant) —
    // screens.js reveals the stamp at CUE_RANK_MS = 1600 ms after GAME_WIN,
    // matching the +1.6 s ctx-time offset inside _rankThud exactly.
    sub(EVT.GAME_WIN, () => {
      this._rankThud();
    });
    sub(EVT.GAME_START, () => {
      this._runOver = false;
      // The start click is itself a user gesture — safe to (re)create here.
      this._onGesture();
      this._pluck();
    });
    sub(EVT.GAME_RESET, () => {
      this.setRollIntensity(0);
    });
  }

  /**
   * Drive the rolling-noise loop. Call per frame (or 10Hz) from main.js with
   * speed01 = horizontal |vel| / (SPEED_K * radiusSim). Zero allocation.
   * @param {number} speed01 Normalized ball speed, 0..1.
   */
  setRollIntensity(speed01) {
    if (this._ctx === null || this._rollGain === null || this._rollFilter === null) return;
    const v = clamp01(speed01);
    if (Math.abs(v - this._rollLevel) < 0.01) return;
    this._rollLevel = v;
    const t = this._ctx.currentTime;
    const gain = this._muted ? 0 : ROLL_GAIN_MAX * v * v; // quadratic — quiet at low speed
    this._rollGain.gain.setTargetAtTime(gain, t, 0.08);
    this._rollFilter.frequency.setTargetAtTime(
      ROLL_FREQ_MIN + (ROLL_FREQ_MAX - ROLL_FREQ_MIN) * v,
      t,
      0.1
    );
  }

  /**
   * Mute/unmute everything. While muted, one-shot node creation is SKIPPED
   * entirely (not just gain = 0) — honors the bounded node budget.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this._muted = muted === true;
    if (this._master !== null && this._ctx !== null) {
      this._master.gain.setTargetAtTime(this._muted ? 0 : MASTER_GAIN, this._ctx.currentTime, 0.02);
      // Re-sync the roll gain against the new mute state.
      this._rollLevel = -1;
    }
  }

  /** Tear down listeners, bus subscriptions and the context (tests / teardown). */
  dispose() {
    this._disposed = true;
    window.removeEventListener('pointerdown', this._onGesture);
    window.removeEventListener('keydown', this._onGesture);
    window.removeEventListener('touchstart', this._onGesture);
    for (let i = 0; i < this._subs.length; i++) {
      this._bus.off(this._subs[i][0], this._subs[i][1]);
    }
    this._subs.length = 0;
    if (this._ctx !== null) {
      this._ctx.close();
      this._ctx = null;
      this._noiseBuf = null;
      this._master = null;
      this._rollGain = null;
      this._rollFilter = null;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Context / graph bootstrap                                          */
  /* ---------------------------------------------------------------- */

  /** Create the AudioContext + master chain + roll loop (idempotent). */
  _ensureCtx() {
    if (this._ctx !== null || this._disposed) return;
    const AC = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
    if (AC === undefined) return; // no WebAudio — stay silent forever
    const ctx = new AC();
    this._ctx = ctx;

    const master = ctx.createGain();
    // initialMuted is applied here, inside the lazy creation path — a
    // pre-context setMuted alone would otherwise be a no-op.
    master.gain.value = this._muted ? 0 : MASTER_GAIN;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ctx.destination);
    this._master = master;

    // ONE shared noise buffer: roll loop + dash whoosh + percussive ticks.
    const len = (ctx.sampleRate * 1.5) | 0;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let seed = 0x2f6e2b1;
    for (let i = 0; i < len; i++) {
      // Cheap LCG noise (deterministic, no Math.random churn).
      seed = (seed * 1664525 + 1013904223) | 0;
      data[i] = ((seed >>> 9) / 0x3fffff - 1) * 0.8;
    }
    this._noiseBuf = buf;

    // Roll loop: looping shared noise -> lowpass -> gain(0) -> master.
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = ROLL_FREQ_MIN;
    filter.Q.value = 0.4;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start();
    this._rollFilter = filter;
    this._rollGain = gain;
    this._rollLevel = -1;
  }

  /**
   * True when triggers must stay silent (no context yet, or muted — muted
   * skips node creation entirely per the bounded budget).
   * @returns {boolean}
   */
  _silent() {
    return this._ctx === null || this._master === null || this._muted;
  }

  /**
   * Schedule one enveloped oscillator note.
   * @param {number} freq Start frequency (Hz).
   * @param {number} endFreq End frequency (Hz, exponential glide).
   * @param {OscillatorType} type Oscillator type.
   * @param {number} when Start time (ctx time, s).
   * @param {number} dur Note length (s).
   * @param {number} peak Peak gain.
   */
  _note(freq, endFreq, type, when, dur, peak) {
    const ctx = this._ctx;
    if (ctx === null || this._master === null || this._muted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    if (endFreq !== freq) osc.frequency.exponentialRampToValueAtTime(endFreq, when + dur);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g);
    g.connect(this._master);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  /**
   * Schedule one enveloped burst of the shared noise buffer.
   * @param {number} when Start time (ctx time, s).
   * @param {number} dur Burst length (s).
   * @param {number} peak Peak gain.
   * @param {AudioNode} [dest] Destination (defaults to master).
   * @param {number} [offset] Read offset into the shared buffer (s).
   */
  _noiseBurst(when, dur, peak, dest, offset = 0.2) {
    const ctx = this._ctx;
    if (ctx === null || this._master === null || this._muted || this._noiseBuf === null) return;
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(g);
    g.connect(dest !== undefined ? dest : this._master);
    src.start(when, offset, dur + 0.05);
  }

  /* ---------------------------------------------------------------- */
  /* Triggers                                                           */
  /* ---------------------------------------------------------------- */

  /**
   * Absorb blip — pitch rises one semitone per combo step.
   * @param {number} combo Current rapid-absorb combo count.
   */
  _blip(combo) {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    // Rate cap (node budget): coalesce burst absorbs — skip if a blip played
    // within BLIP_MIN_INTERVAL_S; the next allowed blip carries the (higher)
    // current combo pitch, so the rising-pitch feel is preserved.
    if (this._lastBlipAt >= 0 && t - this._lastBlipAt < BLIP_MIN_INTERVAL_S) return;
    this._lastBlipAt = t;
    const semis = combo < BLIP_SEMITONE_CAP ? combo : BLIP_SEMITONE_CAP;
    const f = BLIP_BASE_HZ * Math.pow(2, semis / 12);
    this._note(f, f * 1.35, 'triangle', t, 0.12, 0.22);
    this._note(f * 2, f * 2.4, 'sine', t, 0.08, 0.07); // sparkle overtone
  }

  /**
   * Bonk clonk — pitch-dropping thud + noise burst, volume by impact.
   * @param {number} impact01 Impact speed normalized 0..1.
   */
  _clonk(impact01) {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    const v = 0.1 + 0.3 * clamp01(impact01);
    this._note(150 + 80 * impact01, 55, 'sine', t, 0.16, v);
    this._note(95, 50, 'triangle', t, 0.1, v * 0.6);
  }

  /**
   * Knock-off plink — short descending square per ejection burst.
   * @param {number} count Ejected stuck objects (1..3).
   */
  _knock(count) {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    const n = count < 3 ? count : 3;
    for (let i = 0; i < n; i++) {
      this._note(330 - i * 40, 165 - i * 20, 'square', t + i * 0.05, 0.12, 0.08);
    }
  }

  /**
   * Celebration arpeggio / fanfare.
   * @param {number[]} notes Frequencies (Hz).
   * @param {number} spacing Seconds between note starts.
   * @param {number} peak Per-note peak gain.
   * @param {number} dur Per-note duration (s).
   * @param {number} [when] Start time (ctx time; defaults to now).
   */
  _arpeggio(notes, spacing, peak, dur, when) {
    if (this._silent()) return;
    const t = when !== undefined ? when : /** @type {AudioContext} */ (this._ctx).currentTime;
    for (let i = 0; i < notes.length; i++) {
      const at = t + i * spacing;
      this._note(notes[i], notes[i], 'triangle', at, dur, peak);
      this._note(notes[i] * 2.001, notes[i] * 2.001, 'sine', at, dur * 0.7, peak * 0.25);
    }
  }

  /** Soft start pluck on game start. */
  _pluck() {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    this._note(261.63, 523.25, 'triangle', t, 0.25, 0.15);
  }

  /* ---------------------------------------------------------------- */
  /* v2 triggers                                                        */
  /* ---------------------------------------------------------------- */

  /**
   * Dash whoosh ('dash'): 0.3 s noise through a bandpass sweeping
   * 300 -> 2400 Hz (gain .14) + a rising saw 180 -> 420 Hz.
   */
  _whoosh() {
    if (this._silent()) return;
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const t = ctx.currentTime;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.3);
    bp.connect(/** @type {GainNode} */ (this._master));
    this._noiseBurst(t, 0.3, 0.14, bp, 0.41);
    this._note(180, 420, 'sawtooth', t, 0.3, 0.05);
  }

  /** Dash-ready chime ('dashReady'): two-note E5 -> A5, .06. */
  _readyChime() {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    this._note(659.25, 659.25, 'sine', t, 0.16, 0.06);
    this._note(880.0, 880.0, 'sine', t + 0.09, 0.28, 0.06);
  }

  /**
   * Rare sparkle ('score' with rare:true): 5-note ascending sine gliss
   * (E6 pentatonic, 40 ms apart) + a 2.5 kHz shimmer.
   */
  _rareGliss() {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    for (let i = 0; i < RARE_GLISS_NOTES.length; i++) {
      this._note(RARE_GLISS_NOTES[i], RARE_GLISS_NOTES[i], 'sine', t + i * 0.04, 0.22, 0.09);
    }
    this._note(2500, 2500, 'sine', t, 0.5, 0.035);
  }

  /** Goal-call pad ('goalCall' — renamed from v2): lowpassed swelling
   *  A-major chord, 1.2 s, .08. */
  _goalPad() {
    if (this._silent()) return;
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const t = ctx.currentTime;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.6);
    g.gain.linearRampToValueAtTime(0, t + 1.2);
    lp.connect(g);
    g.connect(/** @type {GainNode} */ (this._master));
    for (let i = 0; i < GOAL_PAD_NOTES.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(GOAL_PAD_NOTES[i], t);
      osc.connect(lp);
      osc.start(t);
      osc.stop(t + 1.25);
    }
  }

  /* ---------------------------------------------------------------- */
  /* v3 triggers                                                        */
  /* ---------------------------------------------------------------- */

  /**
   * Landmark fanfare sting ('landmark'): short rising 4-note triangle call
   * (E5 G5 B5 E6) + a low E root swell — celebratory but clearly smaller
   * than the GOAL_CONTACT grand fanfare. ~11 nodes, landmark absorbs are
   * singletons (11/run max) — bounded.
   */
  _landmarkSting() {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    this._arpeggio(LANDMARK_STING_NOTES, LANDMARK_STING_SPACING_S, 0.2, 0.5, t);
    this._note(164.81, 164.81, 'triangle', t, 0.55, 0.1); // E3 root under the call
  }

  /**
   * Collect gliss ('collect', microtask-deferred — dual-tag rule): 5-note
   * ascending C-major sine gliss + a soft high shimmer. Distinct from the
   * chunk score-rare sparkle (which is gated to codes < 70 above).
   */
  _collectGliss() {
    if (this._silent()) return;
    const t = /** @type {AudioContext} */ (this._ctx).currentTime;
    for (let i = 0; i < COLLECT_GLISS_NOTES.length; i++) {
      this._note(COLLECT_GLISS_NOTES[i], COLLECT_GLISS_NOTES[i], 'sine', t + i * 0.04, 0.24, 0.1);
    }
    this._note(3135.96, 3135.96, 'sine', t + 0.16, 0.45, 0.03); // G7 shimmer tail
  }

  /**
   * Grand fanfare ('goalContact' = the clear instant): 8-note arpeggio
   * (.24) over a sustained AM9 triangle pad (2.5 s).
   */
  _grandFanfare() {
    if (this._silent()) return;
    const ctx = /** @type {AudioContext} */ (this._ctx);
    const t = ctx.currentTime;
    this._arpeggio(FANFARE_NOTES, FANFARE_SPACING_S, 0.24, 0.9, t);
    // AM9 pad: one shared swell envelope under the arpeggio.
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.35);
    g.gain.setValueAtTime(0.07, t + 1.6);
    g.gain.linearRampToValueAtTime(0, t + 2.5);
    g.connect(/** @type {GainNode} */ (this._master));
    for (let i = 0; i < AM9_PAD_NOTES.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(AM9_PAD_NOTES[i], t);
      osc.connect(g);
      osc.start(t);
      osc.stop(t + 2.55);
    }
  }

  /**
   * Rank-stamp thud ('game:win'): 70 Hz sine thump + noise tick scheduled
   * +1.6 s in ctx time to land on the CSS rank-stamp reveal (screens.js
   * CUE_RANK_MS = 1600 ms after the same GAME_WIN event).
   */
  _rankThud() {
    if (this._silent()) return;
    const when = /** @type {AudioContext} */ (this._ctx).currentTime + 1.6;
    this._note(70, 38, 'sine', when, 0.35, 0.5);
    this._noiseBurst(when, 0.07, 0.12, undefined, 0.83);
  }
}
