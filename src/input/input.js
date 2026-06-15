/**
 * @file input.js — Keyboard (WASD/arrows) + optional mouse yaw drag + touch
 * joystick (with a visible base-ring + thumb-dot overlay anchored at the
 * first touch) -> normalized Intent {x, y, boost}.
 *
 * Camera-relative mapping is applied in physics/ballPhysics.js, NOT here
 * (keeps the touch path rewrite-free). Conventions:
 *   intent.y = +1 -> push the ball ALONG the camera forward direction.
 *   intent.x = +1 -> push toward screen-right.
 *   boost     -> Shift held (keyboard) or a second active touch.
 *   dash      -> v2 EDGE LATCH: Space keydown or #dash-button pointerdown
 *                sets it true for exactly ONE read() (consumed on read).
 *                No double-tap/flick recognizers (deliberately dropped).
 *
 * v2 mute edge: 'M' keyup latches a toggle request; main.js (the single mute
 * owner) drains it once per frame via takeMuteToggle().
 *
 * Mouse yaw drag: horizontal primary-button mouse drags accumulate a yaw
 * delta (radians). main.js drains it once per frame via takeYawDrag() and
 * forwards it to cameraRig.update(dt, ball, yawDrag). If never drained the
 * feature simply stays inert — safe degradation.
 *
 * Zero-allocation discipline: read() returns one REUSED Intent object;
 * handlers mutate numeric fields only.
 */

/** @typedef {import('../types.js').Intent} Intent */

/** Virtual joystick radius in CSS pixels (full deflection). */
const JOY_RADIUS_PX = 64;
/** Joystick deadzone as a fraction of JOY_RADIUS_PX. */
const JOY_DEADZONE = 0.15;
/** Mouse yaw drag sensitivity (radians per CSS pixel). Drag right = look right. */
const YAW_DRAG_SENS = 0.005;

/**
 * Player input aggregator. Construct once at boot; call read() exactly once
 * per render frame (step 1 of the frame order).
 */
export class Input {
  /**
   * @param {Window} [target] Event target (injectable for tests); defaults to window.
   */
  constructor(target = window) {
    /** @type {Window} */
    this._target = target;

    /** @type {Intent} The single reused intent object returned by read(). */
    this._intent = { x: 0, y: 0, boost: false, dash: false };

    // -- keyboard state ------------------------------------------------
    this._kUp = false;
    this._kDown = false;
    this._kLeft = false;
    this._kRight = false;
    this._kBoost = false;

    // -- v2 edge latches -------------------------------------------------
    /** @type {boolean} Dash request (Space keydown / #dash-button pointerdown); consumed by read(). */
    this._dashLatch = false;
    /** @type {boolean} Mute toggle request ('M' keyup); consumed by takeMuteToggle(). */
    this._muteLatch = false;

    // -- touch joystick state -------------------------------------------
    /** @type {number} Identifier of the joystick touch, or -1. */
    this._joyId = -1;
    this._joyAnchorX = 0;
    this._joyAnchorY = 0;
    /** Normalized joystick output in [-1,1] (y = +1 forward / screen-up). */
    this._joyX = 0;
    this._joyY = 0;
    /** @type {number} Count of active GAME touches (2nd touch = boost).
     *  Touches that began on a <button> (e.g. the DASH button) are excluded
     *  so a dash tap never rides an unintended boost along with it. */
    this._touchCount = 0;
    /** @type {boolean} Touch UI gate (false during the finale cinematic so a
     *  skip-tap can't spawn the joystick ring over the cinema). */
    this._touchUiEnabled = true;

    // -- mouse yaw drag state ---------------------------------------------
    this._mouseDown = false;
    this._mouseLastX = 0;
    /** @type {number} Accumulated yaw delta (radians) since last takeYawDrag(). */
    this._yawDragAccum = 0;

    // -- virtual joystick visual (base ring + thumb dot; pointer-events:none)
    /** @type {HTMLElement|null} */ this._joyBaseEl = null;
    /** @type {HTMLElement|null} */ this._joyThumbEl = null;
    if (typeof document !== 'undefined' && document.body) {
      const base = document.createElement('div');
      base.style.cssText =
        'position:fixed;width:128px;height:128px;margin:-64px 0 0 -64px;' +
        'border:2px solid rgba(255,255,255,0.35);border-radius:50%;' +
        'background:rgba(255,255,255,0.06);pointer-events:none;z-index:15;display:none;';
      const thumb = document.createElement('div');
      thumb.style.cssText =
        'position:fixed;width:48px;height:48px;margin:-24px 0 0 -24px;' +
        'border-radius:50%;background:rgba(255,255,255,0.45);' +
        'box-shadow:0 0 12px rgba(255,255,255,0.35);pointer-events:none;z-index:16;display:none;';
      document.body.appendChild(base);
      document.body.appendChild(thumb);
      this._joyBaseEl = base;
      this._joyThumbEl = thumb;
    }

    // -- v2 dash button (#dash-button, Phase-0 frozen DOM id) -------------
    /** @type {HTMLElement|null} */
    this._dashBtn = null;
    this._onDashPointerDown = this._handleDashPointerDown.bind(this);
    if (typeof document !== 'undefined') {
      const btn = document.getElementById('dash-button');
      if (btn !== null) {
        // It is a <button>, so the joystick/yaw-drag handlers already ignore
        // touches/clicks that begin on it (closest('button') exclusion).
        btn.addEventListener('pointerdown', this._onDashPointerDown);
        this._dashBtn = btn;
      }
    }

    // Bound handlers (kept for dispose()).
    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = this._handleKeyUp.bind(this);
    this._onTouchStart = this._handleTouchStart.bind(this);
    this._onTouchMove = this._handleTouchMove.bind(this);
    this._onTouchEnd = this._handleTouchEnd.bind(this);
    this._onMouseDown = this._handleMouseDown.bind(this);
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onMouseUp = this._handleMouseUp.bind(this);
    this._onBlur = this._handleBlur.bind(this);

    target.addEventListener('keydown', this._onKeyDown);
    target.addEventListener('keyup', this._onKeyUp);
    // passive:false so the joystick can preventDefault page scroll/zoom.
    target.addEventListener('touchstart', this._onTouchStart, { passive: false });
    target.addEventListener('touchmove', this._onTouchMove, { passive: false });
    target.addEventListener('touchend', this._onTouchEnd);
    target.addEventListener('touchcancel', this._onTouchEnd);
    target.addEventListener('mousedown', this._onMouseDown);
    target.addEventListener('mousemove', this._onMouseMove);
    target.addEventListener('mouseup', this._onMouseUp);
    target.addEventListener('blur', this._onBlur);
  }

  /**
   * Snapshot the current intent. Returns the SAME reused object every call —
   * read-only for callers, never retain across frames. Zero allocation.
   * @returns {Intent}
   */
  read() {
    const it = this._intent;
    // Keyboard axes.
    let x = (this._kRight ? 1 : 0) - (this._kLeft ? 1 : 0);
    let y = (this._kUp ? 1 : 0) - (this._kDown ? 1 : 0);
    // Touch joystick overrides keyboard when deflected past the deadzone.
    const jl = Math.sqrt(this._joyX * this._joyX + this._joyY * this._joyY);
    if (jl > JOY_DEADZONE) {
      x = this._joyX;
      y = this._joyY;
    }
    // Normalize so diagonals aren't faster.
    const len = Math.sqrt(x * x + y * y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    it.x = x;
    it.y = y;
    it.boost = this._kBoost || this._touchCount >= 2;
    // v2: dash edge latch — true for exactly this one read, then consumed.
    it.dash = this._dashLatch;
    this._dashLatch = false;
    return it;
  }

  /**
   * Drain the accumulated mouse yaw drag (radians) since the previous call.
   * Forward the return value to cameraRig.update()'s yawDrag parameter.
   * @returns {number} Accumulated yaw delta, radians (positive = look right).
   */
  takeYawDrag() {
    const v = this._yawDragAccum;
    this._yawDragAccum = 0;
    return v;
  }

  /**
   * v2: drain the mute-toggle edge ('M' keyup). main.js — the single mute
   * owner — calls this once per frame (frame step 1) and toggles bgm/sfx.
   * @returns {boolean} True exactly once per 'M' keyup.
   */
  takeMuteToggle() {
    const v = this._muteLatch;
    this._muteLatch = false;
    return v;
  }

  /** Remove all DOM listeners + joystick visuals (tests / teardown). */
  dispose() {
    if (this._joyBaseEl !== null && this._joyBaseEl.parentNode !== null) {
      this._joyBaseEl.parentNode.removeChild(this._joyBaseEl);
    }
    if (this._joyThumbEl !== null && this._joyThumbEl.parentNode !== null) {
      this._joyThumbEl.parentNode.removeChild(this._joyThumbEl);
    }
    this._joyBaseEl = null;
    this._joyThumbEl = null;
    if (this._dashBtn !== null) {
      this._dashBtn.removeEventListener('pointerdown', this._onDashPointerDown);
      this._dashBtn = null;
    }
    const t = this._target;
    t.removeEventListener('keydown', this._onKeyDown);
    t.removeEventListener('keyup', this._onKeyUp);
    t.removeEventListener('touchstart', this._onTouchStart);
    t.removeEventListener('touchmove', this._onTouchMove);
    t.removeEventListener('touchend', this._onTouchEnd);
    t.removeEventListener('touchcancel', this._onTouchEnd);
    t.removeEventListener('mousedown', this._onMouseDown);
    t.removeEventListener('mousemove', this._onMouseMove);
    t.removeEventListener('mouseup', this._onMouseUp);
    t.removeEventListener('blur', this._onBlur);
  }

  /* ---------------------------------------------------------------- */
  /* Keyboard                                                          */
  /* ---------------------------------------------------------------- */

  /** @param {KeyboardEvent} e */
  _handleKeyDown(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this._kUp = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this._kDown = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this._kLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this._kRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this._kBoost = true;
        break;
      case 'Space':
        // v2 dash edge: latch on the PHYSICAL press only — OS key repeat must
        // not re-latch (the latch is consumed every read, so repeats would
        // retrigger a dash each repeat otherwise).
        if (e.repeat !== true) this._dashLatch = true;
        e.preventDefault(); // Space scrolls the page
        return;
      default:
        return;
    }
    // Arrows/WASD handled — stop page scroll on arrow keys.
    if (e.code.indexOf('Arrow') === 0) e.preventDefault();
  }

  /** @param {KeyboardEvent} e */
  _handleKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this._kUp = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this._kDown = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this._kLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this._kRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this._kBoost = false;
        break;
      case 'KeyM':
        // v2 mute edge on KEYUP (not keydown) so holding M can't machine-gun
        // the toggle; consumed via takeMuteToggle().
        this._muteLatch = true;
        break;
    }
  }

  /** Window blur: release everything so keys don't stick across tab switches. */
  _handleBlur() {
    this._kUp = this._kDown = this._kLeft = this._kRight = this._kBoost = false;
    this._dashLatch = false;
    this._muteLatch = false;
    this._joyId = -1;
    this._joyX = this._joyY = 0;
    this._touchCount = 0;
    this._mouseDown = false;
    this._hideJoystick();
  }

  /**
   * v2: #dash-button pointerdown — latch a dash request. preventDefault stops
   * the compatibility mouse event and keeps focus off the button (Space must
   * remain a dash, not a button re-click).
   * @param {PointerEvent} e
   */
  _handleDashPointerDown(e) {
    this._dashLatch = true;
    if (e.cancelable) e.preventDefault();
  }

  /* ---------------------------------------------------------------- */
  /* Touch joystick (first touch = stick anchor, second touch = boost) */
  /* ---------------------------------------------------------------- */

  /**
   * Count touches that did NOT begin on a <button> (Touch.target is the
   * touchstart element for the touch's whole life). Zero allocation.
   * @param {TouchEvent} e
   * @returns {number}
   */
  _countGameTouches(e) {
    let n = 0;
    for (let i = 0; i < e.touches.length; i++) {
      const tgt = /** @type {Element|null} */ (e.touches[i].target);
      if (tgt !== null && typeof tgt.closest === 'function' && tgt.closest('button') !== null) {
        continue; // dash/mute/overlay buttons never count toward boost
      }
      n++;
    }
    return n;
  }

  /**
   * Gate the touch joystick/boost UI (main.js: false on EVT.GOAL_CONTACT so
   * the finale skip-tap can't spawn the joystick ring over the cinematic,
   * true again on EVT.GAME_START).
   * @param {boolean} b
   */
  setTouchUiEnabled(b) {
    this._touchUiEnabled = b === true;
    if (!this._touchUiEnabled) {
      this._joyId = -1;
      this._joyX = 0;
      this._joyY = 0;
      this._touchCount = 0;
      this._hideJoystick();
    }
  }

  /** @param {TouchEvent} e */
  _handleTouchStart(e) {
    if (!this._touchUiEnabled) return;
    this._touchCount = this._countGameTouches(e);
    if (this._joyId !== -1) return;
    // Ignore touches that begin on UI controls (title/win buttons).
    const tgt = /** @type {Element|null} */ (e.changedTouches[0].target);
    if (tgt !== null && typeof tgt.closest === 'function' && tgt.closest('button') !== null) return;
    const t = e.changedTouches[0];
    this._joyId = t.identifier;
    this._joyAnchorX = t.clientX;
    this._joyAnchorY = t.clientY;
    this._joyX = 0;
    this._joyY = 0;
    this._showJoystick(t.clientX, t.clientY);
    if (e.cancelable) e.preventDefault();
  }

  /** @param {TouchEvent} e */
  _handleTouchMove(e) {
    if (this._joyId === -1) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier !== this._joyId) continue;
      let dx = (t.clientX - this._joyAnchorX) / JOY_RADIUS_PX;
      let dy = (t.clientY - this._joyAnchorY) / JOY_RADIUS_PX;
      const l = Math.sqrt(dx * dx + dy * dy);
      if (l > 1) {
        dx /= l;
        dy /= l;
      }
      this._joyX = dx;
      this._joyY = -dy; // screen-up = forward
      if (this._joyThumbEl !== null) {
        // Thumb dot rides the (clamped) deflection in screen space.
        this._joyThumbEl.style.left = this._joyAnchorX + dx * JOY_RADIUS_PX + 'px';
        this._joyThumbEl.style.top = this._joyAnchorY + dy * JOY_RADIUS_PX + 'px';
      }
      if (e.cancelable) e.preventDefault();
      break;
    }
  }

  /** @param {TouchEvent} e */
  _handleTouchEnd(e) {
    this._touchCount = this._touchUiEnabled ? this._countGameTouches(e) : 0;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === this._joyId) {
        this._joyId = -1;
        this._joyX = 0;
        this._joyY = 0;
        this._hideJoystick();
        break;
      }
    }
  }

  /**
   * Show the joystick visual anchored at the first touch point.
   * @param {number} x Anchor clientX. @param {number} y Anchor clientY.
   */
  _showJoystick(x, y) {
    if (this._joyBaseEl === null || this._joyThumbEl === null) return;
    this._joyBaseEl.style.left = x + 'px';
    this._joyBaseEl.style.top = y + 'px';
    this._joyBaseEl.style.display = 'block';
    this._joyThumbEl.style.left = x + 'px';
    this._joyThumbEl.style.top = y + 'px';
    this._joyThumbEl.style.display = 'block';
  }

  /** Hide the joystick visual (joystick touch ended / window blur). */
  _hideJoystick() {
    if (this._joyBaseEl === null || this._joyThumbEl === null) return;
    this._joyBaseEl.style.display = 'none';
    this._joyThumbEl.style.display = 'none';
  }

  /* ---------------------------------------------------------------- */
  /* Mouse yaw drag                                                    */
  /* ---------------------------------------------------------------- */

  /** @param {MouseEvent} e */
  _handleMouseDown(e) {
    if (e.button !== 0) return;
    const tgt = /** @type {Element|null} */ (e.target);
    if (tgt !== null && typeof tgt.closest === 'function' && tgt.closest('button') !== null) return;
    this._mouseDown = true;
    this._mouseLastX = e.clientX;
  }

  /** @param {MouseEvent} e */
  _handleMouseMove(e) {
    if (!this._mouseDown) return;
    this._yawDragAccum += (e.clientX - this._mouseLastX) * YAW_DRAG_SENS;
    this._mouseLastX = e.clientX;
  }

  _handleMouseUp() {
    this._mouseDown = false;
  }
}
