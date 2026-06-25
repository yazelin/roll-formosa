/* Title-first bootstrap — load order is a PRIORITY, not all-at-once.
 *
 * The 3D engine (three.js + the ~900ms world build that used to run at boot)
 * now lives in ./engine.js, a SEPARATE chunk loaded lazily from here. So:
 *
 *   1. The static title screen paints instantly — its visuals come from the
 *      HTML + the pre-paint city-chrome inline script in index.html, NOT from
 *      this bundle. three.js no longer has to download/parse/build the world
 *      before the first screen appears.
 *   2. Right after that first paint we kick the engine load IN THE BACKGROUND,
 *      so while the player reads the title the 3D scene is already being built.
 *   3. 開始 shows a "preparing…" loading state until the engine is ready, then
 *      enables — so there's no dead click and no perceived delay (the build
 *      normally finishes while the player is still reading the title).
 *
 * Engine boot runs at engine.js's top level — importing it IS starting it; we
 * just choose WHEN. */

const startBtn = document.getElementById('start-button');
const startLabel = startBtn ? startBtn.textContent : '';

function setLoading(on) {
  if (!startBtn) return;
  startBtn.disabled = on;
  startBtn.classList.toggle('is-loading', on);
  startBtn.textContent = on ? '場景準備中… / PREPARING' : startLabel;
}

let _engineP = null;
function loadEngine() {
  if (_engineP) return _engineP;
  _engineP = import('./engine.js')
    .then((m) => { setLoading(false); return m; }) // engine live → Screens wires START
    .catch((e) => {
      _engineP = null; // allow a retry (e.g. offline + not yet precached)
      setLoading(false);
      console.error('[roll-formosa] engine chunk failed to load', e);
    });
  return _engineP;
}

// 開始 is gated until the engine is ready (we always load it, so show the
// loading state from the first paint — honest, and usually over in a blink).
setLoading(true);

// Prefetch the engine once the browser has painted the title and gone idle;
// any first pointer interaction also kicks it (covers a tap before idle fires).
function schedule() {
  if ('requestIdleCallback' in window) requestIdleCallback(loadEngine, { timeout: 1500 });
  else requestAnimationFrame(() => requestAnimationFrame(loadEngine));
}
if (document.readyState === 'complete') schedule();
else addEventListener('load', schedule, { once: true });
addEventListener('pointerdown', loadEngine, { once: true, capture: true });
