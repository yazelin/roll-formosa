/**
 * @file storm-test-donack.mjs — headless synthetic event-storm test for the
 * Donack commentator (Stream E, docs/DESIGN-V3.md §ドナック実況 / 並列作業分割).
 *
 * Run: node scripts/storm-test-donack.mjs   (exits non-zero on failure)
 *
 * Covers the binding behaviors:
 *   - phase gating {title, play, cinematic, result} (no leaks)
 *   - priority classes + min-gap cooldowns + queue-of-1 (equal/lower discard)
 *   - per-id once-per-run dedupe + 30 s tip cooldown
 *   - no-spam under a dense SCORE storm (bounded bubbles, <=1/20 s average)
 *   - DUAL-TAG: COLLECT(10) + LANDMARK(0) same frame -> only merged line
 *   - bubble visible ACROSS GOAL_CONTACT (P3 interrupt) -> ascension -> result
 *   - GAME_RESET hard reset (1 Hz checker demonstrably stopped, queue/dedupe cleared)
 *   - setOff drops everything / re-enable works mid-run
 *
 * Time is VIRTUAL: the instance _now() is patched and the blink/1 Hz interval
 * callbacks are driven manually (_onBlinkTick / _onRunTick) — the real
 * setInterval handles are inert during the test and cleared via dispose().
 */

/* ---- minimal DOM mock (before constructing Donack) ------------------- */
function makeEl() {
  const cls = new Set();
  return {
    className: '',
    textContent: '',
    classList: {
      add: (c) => cls.add(c),
      remove: (c) => cls.delete(c),
      contains: (c) => cls.has(c),
    },
    setAttribute() {},
    _cls: cls,
  };
}
const ELS = {
  'donack-root': makeEl(),
  'donack-avatar': makeEl(),
  'donack-bubble': makeEl(),
};
globalThis.document = { getElementById: (id) => (id in ELS ? ELS[id] : null) };

const { EventBus, EVT } = await import('../src/core/events.js');
const { Donack } = await import('../src/ui/donack.js');
const { DONACK_LINES } = await import('../src/config/donackLines.js');

/* ---- harness ---------------------------------------------------------- */
let failures = 0;
let checks = 0;
function assert(cond, msg) {
  checks++;
  if (!cond) {
    failures++;
    console.error(`  FAIL: ${msg}`);
  }
}

let nowS = 0;
/** @type {InstanceType<typeof Donack>} */
let d;
/** @type {InstanceType<typeof EventBus>} */
let bus;
/** @type {string[]} every line id actually SHOWN, in order */
let shows;

function fresh(initialOff = false, getBallPosReal = null) {
  if (d !== undefined) d.dispose();
  bus = new EventBus();
  nowS = 0;
  d = new Donack(bus, initialOff, getBallPosReal);
  d._now = () => nowS;
  shows = [];
  const origShow = d._show.bind(d);
  d._show = (id, line) => {
    shows.push(id);
    origShow(id, line);
  };
}

/** Advance virtual time, driving blink (4 Hz while visible) + 1 Hz ticks. */
function step(seconds, perQuarter = null) {
  const n = Math.round(seconds * 4);
  for (let i = 0; i < n; i++) {
    nowS += 0.25;
    if (perQuarter !== null) perQuarter(i);
    if (d._visible) d._onBlinkTick();
    if (d._tickId !== 0 && i % 4 === 3) d._onRunTick();
  }
}

const visible = () => ELS['donack-root']._cls.has('show');
const bubbleText = () => ELS['donack-bubble'].textContent;

/* ---- payload scratch (handlers read fields only) ----------------------- */
const P = {
  score: { score: 0, delta: 0, combo: 0, rare: false, archetypeCode: -1 },
  grow: { trueRadius: 0, simRadius: 1, progress01ToNextTier: 0, dashGauge01: 0.5 },
  tierUp: { tierIndex: 0, name: '', trueRadius: 0 },
  landmark: { landmarkId: -1, nameJa: '', sizeReal: 0 },
  collect: { collectibleId: -1, nameJa: '', isNew: true, found: 1, total: 12 },
  bounce: { impactSpeed01: 0 },
  knockOff: { count: 1 },
};

/* ======================================================================= */
console.log('[storm-test-donack]');

/* ---- 1. phase gating: title emits nothing ----------------------------- */
fresh();
P.tierUp.tierIndex = 2;
bus.emit(EVT.TIER_UP, P.tierUp);
P.score.archetypeCode = 0;
bus.emit(EVT.SCORE, P.score);
P.landmark.landmarkId = 2;
bus.emit(EVT.LANDMARK, P.landmark);
step(30);
assert(shows.length === 0, `title phase leaked: ${shows}`);
assert(d._tickId === 0, 'ticker must not run on the title screen');

/* ---- 2. GAME_START shows the start line ------------------------------- */
bus.emit(EVT.GAME_START, {});
assert(shows.length === 1 && shows[0] === 'start', `expected start line, got ${shows}`);
assert(visible() && bubbleText() === DONACK_LINES.start.text, 'start bubble visible w/ text');
assert(d._tickId !== 0, '1 Hz ticker running in play');

/* ---- 3. dense SCORE storm: queue-of-1, dedupe, no spam ----------------- */
// 120 s of an absorb every 250 ms (combo ramps past 15, code 0 = first_neji).
let combo = 0;
step(120, () => {
  combo++;
  P.score.combo = combo;
  P.score.archetypeCode = 0;
  bus.emit(EVT.SCORE, P.score);
});
// Expected: start (already), then first_neji + combo15 exactly once each
// (queue-of-1 + once-per-run); constant absorbs keep tip_idle silent.
assert(shows.filter((s) => s === 'first_neji').length === 1, `first_neji once, got ${shows}`);
assert(shows.filter((s) => s === 'combo15').length === 1, `combo15 once, got ${shows}`);
assert(!shows.includes('tip_idle'), 'tip_idle must not fire while absorbing');
const uniq = new Set(shows);
assert(uniq.size === shows.length, `once-per-run dedupe violated: ${shows}`);
assert(shows.length <= Math.ceil(120 / 20) + 1, `no-spam: ${shows.length} bubbles in 120 s`);

/* ---- 4. tip cooldown: idle hint at 10 s, repeat only after 30 s -------- */
fresh();
bus.emit(EVT.GAME_START, {});
step(6); // dismiss the start bubble (4.5 s show)
const before = shows.length;
step(80); // total idle
const idleShows = shows.slice(before).filter((s) => s === 'tip_idle');
assert(idleShows.length >= 2, `idle tip should repeat: ${shows}`);
assert(idleShows.length <= 3, `idle tip 30 s cooldown: ${idleShows.length} in 80 s`);

/* ---- 5. dash-ready unused-gauge hint + GROW cancel --------------------- */
fresh();
bus.emit(EVT.GAME_START, {});
step(6);
bus.emit(EVT.DASH_READY, {});
P.grow.dashGauge01 = 1;
P.grow.trueRadius = 1; // growth keeps tip_idle quiet
const tick = () => {
  P.grow.trueRadius += 0.01;
  bus.emit(EVT.GROW, P.grow);
};
step(14, tick);
assert(shows.includes('tip_dash'), `dash hint after 12 s full gauge: ${shows}`);
fresh();
bus.emit(EVT.GAME_START, {});
step(6);
bus.emit(EVT.DASH_READY, {});
P.grow.dashGauge01 = 0.2; // gauge spent -> timer cancelled
P.grow.trueRadius = 1;
step(20, tick);
assert(!shows.includes('tip_dash'), `dash hint must cancel when gauge drops: ${shows}`);

/* ---- 6. DUAL-TAG: only the merged line fires --------------------------- */
fresh();
bus.emit(EVT.GAME_START, {});
step(20); // clear the start bubble + gap
const preDual = shows.length;
P.collect.collectibleId = 10; // ハチ公像 (DUAL)
bus.emit(EVT.COLLECT, P.collect);
P.landmark.landmarkId = 0; // same frame
bus.emit(EVT.LANDMARK, P.landmark);
const dualShows = shows.slice(preDual);
assert(
  dualShows.length === 1 && dualShows[0] === 'dual_hachiko',
  `dual-tag merged line only, got ${dualShows}`
);
assert(bubbleText() === DONACK_LINES.dual_hachiko.text, 'merged line text');

/* ---- 7. P3 landmark interrupts a live bubble; queue-of-1 priority ------ */
fresh();
bus.emit(EVT.GAME_START, {});
assert(visible(), 'start bubble live');
// P1 + P2 while visible: queue keeps the HIGHER (P2 tier-up), discards P1.
P.score.combo = 0;
P.score.archetypeCode = 21; // first_person (P1)
bus.emit(EVT.SCORE, P.score);
P.tierUp.tierIndex = 1; // tier1 (P2)
bus.emit(EVT.TIER_UP, P.tierUp);
assert(d._pendingId === 'tier1', `pending should hold P2 over P1, got ${d._pendingId}`);
// P3 interrupts immediately.
P.landmark.landmarkId = 2;
bus.emit(EVT.LANDMARK, P.landmark);
assert(shows[shows.length - 1] === 'lm_kaminarimon', 'P3 interrupts the live bubble');
assert(bubbleText() === DONACK_LINES.lm_kaminarimon.text, 'interrupt swapped the text');

/* ---- 8. bubble across GOAL_CONTACT -> ascension -> result -------------- */
bus.emit(EVT.GOAL_CONTACT, {}); // while the landmark bubble is still visible
assert(d._phase === 'cinematic', 'phase -> cinematic');
assert(shows[shows.length - 1] === 'goal_contact', 'contact shout interrupts (P3)');
// Pending play-phase line (tier1) must be DROPPED by the phase gate, never shown.
step(5); // ascension line scheduled at +3.5 s via the 1 Hz tick
assert(shows[shows.length - 1] === 'ascension', `ascension line in cinematic: ${shows}`);
bus.emit(EVT.GAME_WIN, {});
assert(d._phase === 'result', 'phase -> result');
assert(shows[shows.length - 1] === 'result', 'result line on GAME_WIN');
step(30);
assert(!shows.includes('tier1'), `stale play line leaked across phases: ${shows}`);
// P0/P1/P2 stay dead in cinematic/result.
P.score.archetypeCode = 30;
bus.emit(EVT.SCORE, P.score);
assert(!shows.includes('first_car'), 'play lines gated off after contact');

/* ---- 9. GAME_RESET hard reset ------------------------------------------ */
bus.emit(EVT.GAME_RESET, {});
assert(d._phase === 'title', 'phase -> title');
assert(d._tickId === 0, '1 Hz checker demonstrably stopped on GAME_RESET');
assert(d._blinkId === 0 && !visible(), 'bubble hidden + blink stopped');
assert(d._pendingId === null, 'queue cleared');
assert(d._shownOnce.size === 0 && d._tipShownAt.size === 0, 'dedupe cleared');
const preTitle = shows.length;
step(120);
assert(shows.length === preTitle, 'no idle checker activity after reset');
// New run: once-per-run lines are fresh again.
bus.emit(EVT.GAME_START, {});
assert(shows[shows.length - 1] === 'start', 'start line fresh on the next run');

/* ---- 10. repeat-bonk counter ------------------------------------------- */
fresh();
bus.emit(EVT.GAME_START, {});
step(20);
P.bounce.impactSpeed01 = 0.8;
bus.emit(EVT.BOUNCE, P.bounce);
bus.emit(EVT.BOUNCE, P.bounce);
assert(!shows.includes('repeat_bonk'), '2 bonks: below threshold');
bus.emit(EVT.BOUNCE, P.bounce);
step(12); // queued behind the P0/P1 8 s gap -> flushed by the 1 Hz tick
assert(shows.includes('repeat_bonk'), '3rd hard bonk inside the window fires the line');

/* ---- 11. edge hint (optional position provider) ------------------------ */
fresh(false, () => ({ x: 1799, z: 0 })); // 1 m from the +x bound
bus.emit(EVT.GAME_START, {});
step(6);
P.grow.trueRadius = 5; // band = 4 * 5 = 20 m -> inside
P.grow.dashGauge01 = 0.5;
bus.emit(EVT.GROW, P.grow);
step(12, tick); // past the P0/P1 8 s gap after the start bubble
assert(shows.includes('tip_edge'), `edge hint with provider: ${shows}`);
fresh(); // no provider -> never fires, no crash
bus.emit(EVT.GAME_START, {});
step(30);
assert(!shows.includes('tip_edge'), 'edge hint silent without provider');

/* ---- 12. setOff drops everything / re-enable --------------------------- */
fresh();
bus.emit(EVT.GAME_START, {});
d.setOff(true);
assert(!visible() && d._pendingId === null, 'setOff(true) hides + drops queue');
P.landmark.landmarkId = 6;
bus.emit(EVT.LANDMARK, P.landmark); // even P3 dropped at the door
assert(!shows.includes('lm_dome'), 'OFF drops P3 too');
d.setOff(false);
P.landmark.landmarkId = 7;
bus.emit(EVT.LANDMARK, P.landmark);
assert(shows.includes('lm_tokyo_station'), 're-enabled mid-run');

/* ---- 13. collect mapping: bespoke / generic / future ids --------------- */
fresh();
bus.emit(EVT.GAME_START, {});
step(20);
P.collect.collectibleId = 0;
bus.emit(EVT.COLLECT, P.collect);
step(6); // P2 gap 4 s after the previous bubble -> flushed
assert(shows.includes('col_manekineko'), 'bespoke collect line');
step(20);
P.collect.collectibleId = 3; // no bespoke line -> generic
bus.emit(EVT.COLLECT, P.collect);
step(6);
assert(shows.includes('col_generic'), 'generic fallback for id 3');
step(40);
P.collect.collectibleId = 25; // future append-only id
bus.emit(EVT.COLLECT, P.collect); // generic already shown once -> deduped, no crash
assert(shows.filter((s) => s === 'col_generic').length === 1, 'generic once per run');

/* ---- line-table sanity -------------------------------------------------- */
const ids = Object.keys(DONACK_LINES);
// 44 = the original 43 + appended 'col_golden_objet' (collectible id 9 fix:
// ids 3/9 previously shared the once:true col_generic line).
assert(ids.length === 44, `line table size 44, got ${ids.length}`);
for (const id of ids) {
  const l = DONACK_LINES[id];
  assert(typeof l.text === 'string' && l.text.length > 0, `${id} text`);
  assert(l.priority >= 0 && l.priority <= 3, `${id} priority`);
  assert(['idle', 'happy', 'thinking', 'speaking'].includes(l.expression), `${id} expression`);
  assert(['title', 'play', 'cinematic', 'result'].includes(l.phase), `${id} phase`);
}

d.dispose();
console.log(`  ${checks} checks, ${failures} failures`);
if (failures > 0) process.exit(1);
console.log('[storm-test-donack] OK');
