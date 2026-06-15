# DESIGN-V2 — 月ゴール拡張（確定差分仕様）

> 生成元: ultracode 設計ワークフロー `katamari-v2-moon-design`（設計→敵対的批評→改訂）。機械可読版: `docs/design/DESIGN-V2.json`

## 概要

v2-moon is a pure delta on the live v1 architecture: every v1 invariant (one-frame similarity rescale pixel-identity, seamlessness law, zero per-frame alloc in hot paths, fixed 60Hz, InstancedMesh pooling, deterministic seeded spawning, WebAudio-only, no assets, static Cloudflare Pages) survives. Eight features land as 5 new modules (game/finale.js, render/moon.js, game/runStats.js, audio/bgm.js, render/backdrop.js) plus surgical edits to 15 existing files and index.html. The moon is telegraphed from frame one as a disc inside the existing sky-dome shader (direction-only => rescale-trivial, zero extra draw calls), becomes a real fog-exempt sim-space mesh only for the finale, with an exact angular-size/direction-matched handoff so the crossfade cannot pop. The finale is a small state machine (idle->called->descent->landed->contact->merge->ascension->afterglow->done) that owns one _simCache struct (the ONLY rescale/rebase-sensitive finale state) and two booleans main.js gates on. Dash/timer/score/rares/rank/result/X-post reuse the salvaged statue-design specs with rares moved into deterministic chunk-spawner promotion. The archetype stride goes 8->10 per tier (60 codes) — a verified cross-cutting change owned entirely by Stream C (catalog/objects/spawner/ball). DRAW_CALL_CAP rises 55->60 against the honest 4-band worst case of 56. Phase 0 freezes types/events/tuning/tiers/index.html/main.js skeleton; then 5 zero-file-overlap streams run in parallel exactly like v1's build.

## 月エンディング

SKY MOON (telegraph, tier 0 onward — Stream B): rendered INSIDE the existing sky-dome fragment shader in environment.js, zero extra draw calls. New uniforms: uMoonDir (vec3, normalized; per-tier values in tiers.js, crossfaded by the existing palette fade; elevation component >= MOON_DIR_MIN_ELEV 0.15 rad, asserted), uMoonAngSize (angular radius, per tier [0.018,0.022,0.028,0.035,0.046,0.062] rad T0->T5 — the moon visibly approaches as you grow), uMoonGlow (halo strength + 'called' pulse), uMoonFade (0..1, finale crossfade, default 1). Disc = smoothstep on acos-free dot(normalize(vDir), uMoonDir) vs cos(uMoonAngSize); 3 crater dots via cheap hash on the disc-local coords; halo = pow falloff * uMoonGlow. Direction-only math => rescale/rebase-invariant for free. env.getMoonDirWorld(outV3) exposes the CURRENT blended direction; env.setSkyMoonPulse(on) drives a 0.5Hz uMoonGlow breathing; env.setSkyMoonFade(k01) scales disc+halo.

REAL MOON (render/moon.js, MoonView — Stream A): icosphere detail 3 (~1280 tris — documented as the one exception to the 350-tri ARCHETYPE cap: it is NOT a catalog archetype, never pooled, finale-only, 2 draw calls). Vertex-colored crater noise baked once at boot (mulberry32(worldSeed^0x4d4f4f4e)); MeshLambertMaterial({vertexColors:true, fog:false}) + additive backside glow shell (MeshBasicMaterial({fog:false, transparent, blending:AdditiveBlending}), scale 1.18). fog:false on BOTH materials is a documented seamlessness-law exemption: the moon is a sky element like the dome (which is already fog:false at environment.js:210/231/248), never world scenery. API: setPose(x,y,z,radiusSim), setVisible(b), setGlow01(k), setSpin(rad), dispose(). Exists in sim space only from DESCENT onward.

FINALE STATE MACHINE (game/finale.js — Stream A; owns goal logic; ScaleManager's WIN latch at scaleManager.js:191-197 is REMOVED):
- _simCache struct — THE exhaustive list of rescale/rebase-sensitive finale state: { startX,startY,startZ (descent start pose), landX,landY,landZ (landing point), moonR (frozen moon radius), mergeFromX,mergeFromY,mergeFromZ (ball pos at merge start), ascendBaseY }. finale.js subscribes EVT.RESCALE itself: every field *= S. Subscribes EVT.REBASE: every X/Z field -= sx/sz. Nothing else in the finale caches sim-space numbers; camera targets are derived per-frame (below).
- IDLE: trueRadius < MOON_CALL_RADIUS_M (420). Nothing. DEV watchdog: trueRadius > 1.2*MOON_GOAL_RADIUS_M while still idle => console.error + force DESCENT (covers a NaN/ordering bug ever killing the only end-of-game path).
- CALLED (trueRadius >= 420, once): emit EVT.MOON_CALL {trueRadius} -> HUD toast 「月が呼んでいる…！」, env.setSkyMoonPulse(true), sfx pad swell, bgm shimmer. Pure cosmetics.
- DESCENT (trueRadius >= MOON_GOAL_RADIUS_M 500, once): freeze moonR = MOON_RADIUS_K(2.6) * ball.radiusSim. Landing direction d = horizontal vel dir if |vel| >= MOON_LAND_VEL_FRAC(0.5)*speedCap else camera forward; landing point = ballPos + d * MOON_LAND_DIST_K(45)*r, y = moonR. Descent START pose = cameraPos + env.getMoonDirWorld() * (MOON_RADIUS_K * r / tan(moonAngSize[tier])) — the mesh's angular size and screen direction EXACTLY match the shader disc at fade start (T5: ~41.9r away), so the 2.0s env.setSkyMoonFade 1->0 crossfade cannot pop. Over MOON_DESCENT_S(6.0) MoonView lerps start->landing with easeInOutCubic + 0.4s settle bounce; setSpin slow. Gameplay FULLY live (steer/absorb/bounce); the moon does not collide. HUD: finale emits EVT.MOON_GUIDE {x01,y01,onScreen,active:true} at 10Hz (finale projects moon center through the injected camera into NDC with a scratch Vector3) -> hud screen-edge arrow + 「月へ向かえ！」 toast.
- LANDED: moon rests on y=moonR; effects dust ring once. Render-frame contact test in finale.update (step 4.5): dist(ball,moonCenter) <= ball.radiusSim + moonR * MOON_CONTACT_PAD(0.85) => CONTACT. The moon is pushback-free (rolling in always succeeds). Soft magnet: when dist < MOON_MAGNET_RANGE_K(20)*r, vel += dirToMoon * MOON_MAGNET_ACCEL_FRAC(0.15) * ACCEL_K * r * dt — bias only, never overrides input. Rescale/rebase still possible here: covered by _simCache handlers; regression-tested by KeyR force-rescale AND the dev teleport (forced rebase) during DESCENT/LANDED with the screenshot diff.
- CONTACT (= CLEAR TIME instant, once): emit EVT.MOON_CONTACT {} -> runStats freezes time + computes result (see gameSystems), bgm ducks then stops, sfx grand fanfare, hud hides (incl. MOON_GUIDE {active:false}), #flash-overlay white fades in 0.12s out FLASH_S(0.45). finale.inputLocked and finale.cameraOwned become true => from this frame main.js zeroes intent, skips absorb.resolve, spawner.update AND scaleMgr.maybeRebase (growth frozen => no rescale can fire; rebase is pointless for a <10s cinematic and positions stay well inside Float32 precision; this closes the post-contact rebase/teleport hole). maybeTierUp keeps running (harmless). finale records mergeFrom = ball.pos into _simCache.
- MERGE (MOON_MERGE_S 1.2): finale writes ball.pos directly, lerping mergeFrom -> moon center (physics intent is zeroed so nothing fights); at t >= 0.6s ball.setVisible(false); moon scale pops 1.0->1.06->1.0.
- ASCENSION (MOON_ASCEND_S 5.0): moon rises ease-in to y = ascendBaseY + MOON_ASCEND_HEIGHT_K(40)*r with slow spin; env.beginNightFade(5.0) crossfades to the env-local NIGHT palette (index 6: sky 0x101030/0x06061a, fog 0x1a1838, uStarIntensity->1.0); effects.moonBurst() golden sparkle fountain (reuses pooled quads). CAMERA: finale calls cameraRig.cinematicUpdate(dt, camPosTarget, lookTarget, fovTarget) per frame; targets DERIVED each frame: camPosTarget = moonPos + back*14r + up*4r, lookTarget = moonPos, fov eases 60->52 (telephoto big-moon shot) — pure functions of current moon pose and r, so rescale-safe with zero cached camera state; existing springs keep it buttery.
- AFTERGLOW (AFTERGLOW_S 2.5): moon hangs as THE moon in the night sky, glow breathing; then state='done'. main.js (sole GAME_WIN emitter now) fills PAYLOADS.gameWin {trueRadius, seed} and emits EVT.GAME_WIN; screens.js reveals the result from its cached EVT.GOAL payload. Total post-contact ~8.7s.
- RESET: GAME_RESET -> finale.reset(): state idle, MoonView hidden, env.setSkyMoonFade(1) + setSkyMoonPulse(false), _simCache zeroed. (GAME_RESET is unreachable mid-finale: screens.js is the sole emitter and the button only exists on the result screen.) Restart-debris ownership: ball.reset() restores group.visible (Stream C), cameraRig.reset() clears the cinematic flag (already runs on GAME_RESET, cameraRig.js:135), env.setTierPaletteImmediate resets all v2 uniforms + cancels night fade, hud re-shows on GAME_START.
DEV path: ?r=480 start reaches the finale in <60s; ?r=740 forces a rescale seconds into DESCENT.

## 背景強化

All Stream B: environment.js + new render/backdrop.js. No postprocessing pipeline; shader-dome work, one vertex-colored static mesh, one CSS overlay.

SKY SHADER v2 (rewrite of the sky dome fragment shader, same mesh, still 1 draw call): (a) vertical gradient as today; (b) SUN: uSunDir/uSunIntensity per tier — disc smoothstep + pow(dot,k) glare lobe in lieu of god-rays (T4 golden-hour low fat sun, T5 dusk dims it); (c) MOON disc + craters + halo with uMoonFade/uMoonGlow (see moonEnding); (d) STARS: hash(floor(dir*N)) sparkle grid, twinkle via uTime, gated by uStarIntensity per tier [0,0,0,0,0.15,0.5] (NIGHT palette 1.0) and by elevation (only above horizon); (e) CLOUDS: 2-octave analytic value noise on the dir.xz/max(dir.y,0.05) projection, drifting by uTime*uCloudDrift, color uCloudHex, density uCloudDensity per tier (puffy T2-3, amber streaks T4, none T5/NIGHT). uTime is a plain accumulating float advanced in env.update(dt) — direction-space, rescale-invariant. All per-tier sky params (sunDir[3], sunIntensity, moonAngSize, starIntensity, cloudDensity, cloudHex, moonDir[3]) live in tiers.js (frozen Phase 0) and ride the EXISTING _palettes crossfade — tier evolution stays a 2s cosmetic fade. NIGHT palette is appended ENV-LOCALLY as _palettes index 6 (tiers.js keeps exactly 6 tiers; its asserts untouched), reachable only via env.beginNightFade(seconds) which drives the same _toIndex crossfade machinery with a custom duration — so setTierPaletteImmediate's existing snap structurally cancels an in-flight night fade, and it additionally resets uMoonFade=1, pulse off, uStarIntensity to the palette value.

BACKDROP (new render/backdrop.js, 1 draw call): camera-centered horizon silhouette ring — cylinder strip, 96 segments x 2 jagged-top layers (~1.5k tris), vertex-colored, built once at boot from mulberry32(worldSeed^0x42444b); radius BACKDROP_DIST_K(48)*r, height BACKDROP_HEIGHT_K(10)*r, poking above the fog band; tiny ShaderMaterial mixes silhouette color toward the live fog color at BACKDROP_FOG_MIX(0.82) so it reads as hazy distant mountains/skyline, never a hard edge. Two height/color profiles baked as two vertex-attribute sets blended by uProfile01: rolling hills (T0-2) <-> tower skyline (T3-5), crossfaded on EVT.TIER_UP alongside the palette fade; fades toward near-black silhouette during night fade (reads live fog color, free). update(dt, ball, camera): position.set(cam.x, 0, cam.z); scale.setScalar(ball.radiusSim) — a pure function of radius+camera => pixel-identical at rescale, nothing to do on rebase (camera-relative). frustumCulled=false, renderOrder after sky/before world, depthWrite=false. Subscribes TIER_UP + GAME_RESET itself.

VIGNETTE: static DOM div #vignette (CSS radial-gradient transparent -> rgba(10,8,30,0.32), pointer-events:none), added in index.html by Phase 0, always on, zero GPU cost. GROUND: unchanged. Draw-call delta for this section: +1.

## 景観（巻き込めない）オブジェクト

MECHANISM: each tier's archetypeIds grows 8 -> 10 (ARCH_PER_TIER=10 exported from tiers.js, Phase 0). Slots [8],[9] are LANDMARKS: radiusNominal ~2.5-4x the tier's largest absorbable, built like every catalog entry (<=350 tris merged vertex-colored primitives), absorbed normally once outgrown late in the NEXT tier — they ARE the growth telegraph and use the existing pushback/bonk/knock-off physics untouched. Spawning rule (deterministic, Stream C, spawner.js): landmark slots are archRoll-eligible ONLY for placement j === 0 of a chunk — two per-band cumulative weight tables (_cumW8 over slots 0-7 for j>0, _cumW10 over all 10 for j===0; ONE archRoll draw either way, same draw position). Because eligibility depends only on j, a scenery chunk later upgraded to target role regenerates identically — determinism survives role changes. Expected density at landmark weights 0.25-0.35 (total ~0.6 of ~9.2): ~6.5% of chunks => ~2 alive in the target band, ~4 per scenery band — looming but rare. Landmarks in N+1/N+2 bands give the through-the-fog skyline (a T3 player sees T4 castles and T5 mountains). SUBGRID interpenetration by landmarks over small neighbors is accepted and documented (objects nestle at their base; collisionScale governs physics).

NEW ARCHETYPES (12, ids FROZEN in tiers.js Phase 0; catalog.js Stream C implements):
- T0: 'soda_bottle' (cylinder+cone+cap, radiusNominal 0.12m), 'desk_globe' (sphere+arc+stand, 0.15m)
- T1: 'bookshelf' (frame + 12 colored book boxes, 0.9m), 'grandfather_clock' (tall box+face+pendulum, 1.0m)
- T2: 'utility_pole' (cylinder+crossarms+insulators, 4.5m, collisionScale 0.45), 'torii' (2 pillars + 2 lintels, vermilion 0xd2402a, 3.5m, collisionScale 0.8)
- T3: 'pylon' (tapered lattice of thin boxes, 18m, collisionScale 0.5), 'giant_tree' (thick trunk + 3 icosphere canopies, 14m)
- T4: 'castle' (3 stacked flared boxes + roof cones, 55m), 'pagoda' (5 box+roof tiers, 45m, collisionScale 0.7)
- T5: 'mountain' (3 merged cones, snow-cap vertex gradient, 600m, collisionScale 0.85), 'skytree' (tapered lattice + 2 observation rings, 500m, collisionScale 0.4)

STRIDE 8->10 AUDIT (Stream C owns ALL of it): objects.js (lines 55/69: t*8+i -> t*ARCH_PER_TIER+i, table 48->60, header comment); spawner.js (:874-879 weighted pick, :1144-1145 _resolveCatalog, all 48-entry stat arrays -> 60, header comment); ball.js (:106-111 flat id table -> 60 entries via t*ARCH_PER_TIER+s incl. slots 8/9; :299 family = (code % ARCH_PER_TIER) & 7 — landmarks fold onto proxy families 0/1); tiers.js asserts (Phase 0): 10 ids/tier, 60 unique. Boot DEV-asserts: ARCHETYPE_ID_BY_CODE.length === 60 cross-checked from objects.js AND ball.js. Stream C checklist task: grep '\* 8\b|=== 8|< 8|& 7|48' across spawner/objects/absorb/ball.

DENSITY: SCENERY_OBJECTS_PER_CHUNK 8 -> 10 (not 12: peak population arithmetic 2000 target + 600 scenery + ~250 capped pre-warm + <=1200 leftovers ≈ 4050 < ALIVE_TOTAL_BUDGET 4096). ALIVE_SCENERY_BUDGET is DELETED (verified dead constant — spawner never imports it). New DEV warn when aliveCount > 0.9 * ALIVE_TOTAL_BUDGET so spawn-queue stall is visible early.

RARES (Stream C, spawner.js): in _spawnPlacement, rareRoll = this._srand() drawn LAST (after optional tumble x3), UNCONDITIONALLY for every placement; updated determinism contract comment '(jx, jz, archRoll, sizeRoll, yawRoll, paletteRoll[, tumble x3], rareRoll)'. If rareRoll < RARE_CHANCE(0.002) and the slot is not a landmark: flags |= FLAG_RARE(8), instanceColor overridden to RARE_TINT 0xffd84a, scale *= RARE_SCALE_MUL(1.15). The alive-rare list is Int32Array(2*RARE_LIST_CAP) of (storeIdx, slotGen) pairs; pushed ONLY after both store.alloc and pool.alloc succeed (after the :921 drop path); compacted in exactly three hooks: _onAbsorb, _despawnIndex, reset(); stale entries self-invalidate via slotGen compare. spawner.forEachAliveRare(cb(idx,x,y,z,r)) exposed; effects polls it via setRareProvider for golden twinkles (~3/s per rare within fog range). Sub-pixel sweep skips FLAG_RARE ONLY while tierOf >= tierIndex-1 (older rares despawn normally — no immortal invisible sparklers). Knocked-off rares reinject as ordinary objects (reinject never sets FLAG_RARE; score credit was granted at absorb — documented, no double count). Same seed => same rares. DESIGN.md note: v1 seed URLs produce different v2 worlds (stride/weights/density changed).

## ゲームシステム（ダッシュ/タイム/スコア/ランク/Xポスト）

DASH (Stream D, salvage-adapted): Intent += dash (edge-latched in input.js: Space keydown + #dash-button pointerdown, one read via consumption in input.read(); double-tap/flick deliberately dropped). BallState += dashGauge01 (starts 1.0), dashTimer. ballPhysics.step: gauge += dt/DASH_RECHARGE_S(4.0) clamp 1; on crossing 1.0 emit EVT.DASH_READY once per refill; absorb.js adds gauge += DASH_ABSORB_GAIN(0.03) per absorb (one line). On intent.dash && gauge >= 1: gauge=0, dashTimer=DASH_DURATION_S(0.8), dir = horizontal vel dir if |vel| >= DASH_DIR_SPEED_K(0.3)*speedCap else camera forward; vel += dir * DASH_IMPULSE_K(7.0) * radiusSim; emit EVT.DASH {gauge01:0}. While dashTimer>0: speedCap *= DASH_CAP_MUL(2.2), accel *= DASH_ACCEL_MUL(1.8). Gauge/timer dimensionless/seconds => rescale-invariant, no hooks needed. BallPhysics gains an injected bus (null-safe for headless tests). Feel via frozen events: cameraRig DASH_FOV_BONUS(8deg) additive kick decaying over 0.8s (Stream A, same idiom as the tierUp kick); effects 10-speed-line burst (Stream A); sfx whoosh (Stream E); hud gauge zero (Stream E). Dashing into too-big objects bonks harder and knocks stuck objects off — existing physics, no change.

TIMER (game/runStats.js, Stream D): elapsed = accumulated fixed steps; main.js calls runStats.addSimTime(steps*FIXED_DT) each frame — deterministic, naturally pauses in TITLE/WIN, freezes via internal flag on EVT.MOON_CONTACT. SIM-TIME is the official clock (documented in DESIGN.md: slow devices simulate slower wall-time but ranks stay deterministic and fair per simulated second). EVT.TIME {timeS} emitted when timeS crosses the next 0.1s sim boundary (never performance.now) -> HUD mm:ss.t.

SCORE (runStats, on EVT.ABSORB): objScore = max(1, round(SCORE_SIZE_BASE(100) * sizeReal^SCORE_SIZE_POW(1.4))); comboMul = min(1 + COMBO_SCORE_K(0.10)*(combo-1), COMBO_SCORE_MAX_MUL(3.0)); delta = round(objScore*comboMul) + (p.rare ? RARE_SCORE_BONUS(5000) : 0). absorb.js stamps AbsorbEvent.rare from (store.flags[i] & FLAG_RARE) BEFORE store.free/emit. BINDING subscription order in main.js boot: main attach-handler -> runStats -> sfx/effects/hud. runStats emits EVT.SCORE {score,delta,combo,rare} -> hud score panel + pooled floating '+N' + rare toast 「レアはっけん！+5000」; raresFound counter increments on rare absorbs (infinite world => result shows レア n コ, no denominator).

GOAL FLOW: EVT.MOON_CONTACT -> runStats freezes timeS, adds MOON_SCORE_BONUS(20000) + timeBonus = round(lerp(TIME_BONUS_MAX 30000, 0, clamp01((timeS-120)/(420-120)))); rank: S <= 120 / A <= 180 / B <= 280 / C <= 420 / else D (EMPIRICAL Phase-3 retune: measured in-browser optimal driver runs put a continuous-absorb dash run at ~95-105 sim-s for the full 5cm->moon-call; S=1.2x optimal, A=1.8x, B=2.8x decent first run, C=4x slow exploration). Persists best to localStorage LS_BEST_KEY 'fableKatamari.v2.best' schema {v:1, bestTime:{timeS,score,rank,seed}, bestScore:{timeS,score,rank,seed}} — each sub-record replaced ATOMICALLY when its metric improves (internally consistent lines; no field mixing). loadBest() wraps getItem+JSON.parse+type-validation in one try/catch, returns null on any anomaly (private mode safe). Emits EVT.GOAL once {timeS, score, rank, trueRadius, absorbed, raresFound, seed, newRecordTime, newRecordScore}.

RESULT SCREEN (screens.js, Stream E, same #win-overlay): staged CSS reveals — 0.0s ⏱TIME slides in; 0.4s ⭐SCORE rAF count-up 0.8s; 0.9s 📏size + まきこんだ n こ + レア n コ; 1.6s RANK letter stamp (scale 3->1 bounce + white flash + sfx thud); 2.2s NEW RECORD! badge if either flag, plus ベスト line and SEED line. Buttons: #post-x-button (primary yellow) + #restart-button.

X POST (screens.js): the intent URL is built ONCE when EVT.GOAL is cached (values from the payload, never the animating DOM). Click handler (synchronous gesture): const w = window.open(url, '_blank'); if (w === null) location.href = url; — no 'noopener' in features (kills the null-ambiguity; gives in-app webviews a same-tab fallback). Text template:
`🌕FABLE KATAMARI 月まで転がした！\n⏱タイム ${mm}:${ss}.${d} ／ RANK ${rank}\n⭐スコア ${score.toLocaleString('ja-JP')}\n📏さいごの大きさ ${sizeStr}（まきこんだ ${absorbed}こ・レア${rares}コ）\n#FableKatamari\nhttps://fable-katamari.pages.dev` (~170/280 weighted chars — safe). Title screen shows 自己ベスト via RunStats.loadBest().

HUD (hud.js, Stream E): #timer (EVT.TIME), #score-value + floating-delta layer (EVT.SCORE), #dash-gauge/#dash-gauge-fill (smooth via GrowEvent.dashGauge01 at 10Hz — scaleManager copies it from ball state when emitting GROW; DASH zeroes instantly; DASH_READY flashes), #mute-button (🔊/🔇 -> EVT.MUTE_REQUEST, icon on MUTE_CHANGED), #moon-arrow screen-edge indicator (EVT.MOON_GUIDE), #hud-toast (MOON_CALL / rare / 月へ向かえ, 3s, queue-of-1). HUD hides on MOON_CONTACT, re-shows on GAME_START.

## オーディオ（BGM/SE）

NEW src/audio/bgm.js (Stream E) — class Bgm(bus, initialMuted). Zero assets, standard two-clock lookahead scheduler: setInterval(TICK_MS 25) schedules notes up to LOOKAHEAD_S 0.12 ahead of ctx.currentTime. Bgm owns its OWN AudioContext (separate from sfx), created/resumed via its own gesture listeners AND on GAME_START (the start click is the gesture; iOS verified on-device). Title silent; GAME_RESET stops+rewinds.

TAB VISIBILITY (binding): document.visibilitychange — on hidden: clearInterval(tick) + ctx.suspend() (sfx unaffected); on visible: ctx.resume(), re-anchor nextNoteTime = ctx.currentTime + LOOKAHEAD_S, keep the bar/beat counter (skip missed beats, NEVER burst catch-up). ALL delayed gain moves (duck ramp, full-stop, layer fades) are scheduled in ctx time via setTargetAtTime/linearRampToValueAtTime — setTimeout is banned in bgm.js. setMuted(true) stops note-node creation entirely (not just gain=0) to honor the node budget.

ALLOCATION LAW AMENDMENT (bgm.js header + DESIGN.md v2 chapter): WebAudio node creation (sfx+bgm) is an explicit BOUNDED EXEMPTION to the zero-alloc law — budget <=60 short-lived nodes/s; expensive allocations hoisted (ONE persistent shared noise AudioBuffer for hats/shaker/whoosh, PeriodicWaves at init); verified via the debug-overlay heap-delta line in the Phase-3 profile pass.

MUSIC: 128 BPM, swung 8ths, 4-bar loop, A major, 16-bar chord cycle |AM7|D9|F#m7|E7sus4->E7| — sunny Katamari-spirited bossa-pop. Chain: layerGains -> bgmMaster(BGM_GAIN 0.32) -> DynamicsCompressor -> destination. LAYERS (GainNodes; unlock = LAYER_FADE_S 1.5 ramp on EVT.TIER_UP — cosmetic-only law holds): L0 (GAME_START): triangle bass root-5th-octave bossa (.18) + sine-drop kick 110->40Hz beats 1/3 + soft rimshot noise tick. L1 (tier>=1): detuned-saw offbeat chord stabs through lowpass 1200Hz (.10) + noise hi-hats (60ms highpassed bursts, swung). L2 (tier>=2): lead saw+lowpass-2400 pentatonic melody table (64 entries incl. rests, 30ms portamento, .12). L3 (tier>=4): bandpass-noise shaker 16ths (.04) + sparkle sine arp on chord root +2 oct (.05). DUCKING: EVT.MOON_CALL -> momentary shimmer swell; EVT.MOON_CONTACT -> master setTargetAtTime to DUCK_GAIN 0.12 over 0.3s, then linearRamp to 0 ending 1.5s later (ctx-time scheduled). CPU ~0.2ms/tick.

MUTE: single source of truth in main.js — input.takeMuteToggle() ('M' keyup edge) OR EVT.MUTE_REQUEST (hud button) -> main toggles, calls bgm.setMuted + sfx.setMuted, persists LS_MUTE_KEY, emits EVT.MUTE_CHANGED {muted}. BOOT ORDER: main reads LS_MUTE_KEY BEFORE constructing Bgm/Sfx and passes initialMuted; both apply it inside their lazy context/master-gain creation path (a pre-context setMuted is otherwise a no-op — verified gap in sfx.js's gesture pattern).

NEW SE (sfx.js, Stream E, same _note idioms + the shared noise buffer; Sfx constructor gains initialMuted and a setMuted(b)): DASH whoosh (EVT.DASH): 0.3s highpassed noise w/ bandpass sweep 300->2400Hz + saw rise 180->420Hz, gain .14. DASH_READY: two-note chime E5->A5, .06. RARE sparkle (EVT.SCORE rare:true): 5-note ascending sine gliss (E6 pentatonic, 40ms apart) + 2.5kHz shimmer. MOON_CALL: lowpassed swelling pad chord 1.2s, .08. MOON_CONTACT grand fanfare: FANFARE_NOTES extended to 8 (adds G6 A6 C7) over a sustained AM9 triangle pad 2.5s, .24 — the existing GAME_WIN fanfare handler (sfx.js:88) is REMOVED (fanfare already happened at contact). Rank stamp thud on EVT.GAME_WIN: 70Hz sine thump + noise tick scheduled +1.6s in ctx time, matching screens.js CUE_RANK_MS (1600ms after the same GAME_WIN) exactly. (EVT.GOAL fires at the CONTACT instant, ~8.7s before the stamp — wrong cue.)

## ファイル変更一覧

| パス | 種別 | 変更内容 |
|---|---|---|
| `src/types.js` | modify | PHASE 0 (integrator). Intent += {dash:boolean}; BallState += {dashGauge01:number, dashTimer:number}; GrowEvent += {dashGauge01:number}; AbsorbEvent += {rare:boolean}; Tier += {sunDir:[n,n,n], sunIntensity:number, moonDir:[n,n,n], moonAngSize:number, starIntensity:number, cloudDensity:number, cloudHex:number}; new typedefs ScoreEvent/TimeEvent/DashEvent/MoonCallEvent/MoonGuideEvent/GoalEvent/MuteChangedEvent/BestRecord. |
| `src/core/events.js` | modify | PHASE 0. Add EVT.DASH/DASH_READY/SCORE/TIME/MOON_CALL/MOON_GUIDE/MOON_CONTACT/GOAL/MUTE_REQUEST/MUTE_CHANGED + reused PAYLOADS entries. Header contract updated: binding ABSORB subscription order (main -> runStats -> sfx/effects/hud); 'game:win' now emitted by main.js at finale 'done' (payload unchanged). |
| `src/config/tuning.js` | modify | PHASE 0. Add every constant in the tuning section. WIN_RADIUS_M marked deprecated (kept exported until integration, then deleted). SCENERY_OBJECTS_PER_CHUNK 8->10. DELETE ALIVE_SCENERY_BUDGET (dead — never imported). DRAW_CALL_CAP 55->60 with the 4-band worst-case ledger comment (40 world + 8 stuck + 6 fixed + 1 backdrop = 56). |
| `src/config/tiers.js` | modify | PHASE 0. Each tier's archetypeIds 8->10 (append the 12 frozen landmark ids per the scenery section); export ARCH_PER_TIER=10; add per-tier sky params (sunDir/sunIntensity/moonDir/moonAngSize [0.018,0.022,0.028,0.035,0.046,0.062]/starIntensity [0,0,0,0,0.15,0.5]/cloudDensity/cloudHex); asserts updated: 10 ids/tier, 60 unique, moonDir elevation >= MOON_DIR_MIN_ELEV. NIGHT palette is NOT here (env-local index 6) — tier count stays 6. |
| `index.html` | modify | PHASE 0. Add #timer, #score-panel (#score-value + float layer), #dash-gauge/#dash-gauge-fill, #dash-button (64px round, bottom-right), #mute-button (top-right), #hud-toast, #moon-arrow, #flash-overlay, #vignette. Rework #win-overlay into the staged result layout (#result-time/-score/-size/-absorbed/-rares/-rank, #new-record-badge, #result-best, #result-seed, #post-x-button, #restart-button). CSS keyframes: reveal stagger, rank stamp (scale 3->1 cubic-bezier bounce + flash), toast, gauge flash. |
| `src/main.js` | modify | INTEGRATOR ONLY. GameState += FINALE. Construct MoonView/Finale/RunStats/Bgm/Backdrop; read LS_MUTE_KEY before constructing audio (initialMuted). New frame order (see interfaces): finale.update at step 4.5, runStats.addSimTime at 6.5; gates — if finale.inputLocked: zero intent fields, skip absorb.resolve, spawner.update AND scaleMgr.maybeRebase; if finale.cameraOwned: skip cameraRig.update (finale drives cinematicUpdate). Mute ownership (takeMuteToggle + MUTE_REQUEST -> setMuted both + persist + MUTE_CHANGED). Emit GAME_WIN when finale.state==='done' (sole emitter). Wire effects.setRareProvider(spawner.forEachAliveRare.bind(spawner)). resetWorld() += finale.reset/runStats.reset (backdrop/cameraRig/env self-reset via bus). Delete WIN_RADIUS_M usage at integration. |
| `docs/DESIGN.md` | modify | INTEGRATOR. Append v2-moon chapter: this delta, allocation-law amendment (bounded WebAudio exemption), updated draw-call ledger (cap 60, worst 56, finale window 40), sim-time-rank note, v1/v2 seed incompatibility note, moon fog:false exemption, new event contract, reset-ownership table. |
| `src/game/finale.js` | new | STREAM A. Moon-ending state machine (idle/called/descent/landed/contact/merge/ascension/afterglow/done) per moonEnding section: _simCache struct (exhaustive field list) with own EVT.RESCALE (*=S) / EVT.REBASE (-=sx,sz) subscriptions; angular-matched descent start pose via env.getMoonDirWorld + tan(moonAngSize); vel-dir landing point; LANDED soft magnet; render-frame contact test; EVT.MOON_CALL/MOON_GUIDE(10Hz NDC projection)/MOON_CONTACT emission; MERGE ball.pos lerp + ball.setVisible(false); per-frame derived cinematic camera targets -> cameraRig.cinematicUpdate; env.setSkyMoonFade/setSkyMoonPulse/beginNightFade calls; effects.moonBurst; DEV watchdog (idle past 1.2x goal => force descent); reset(). |
| `src/render/moon.js` | new | STREAM A. MoonView: icosphere detail 3, baked crater vertex colors (seeded), MeshLambert({vertexColors,fog:false}) + additive backside glow shell (fog:false) — 2 draw calls, finale-only, never pooled. setPose(x,y,z,radiusSim)/setVisible/setGlow01/setSpin/dispose. |
| `src/world/scaleManager.js` | modify | STREAM A. REMOVE the win latch (lines 191-197) and the EVT.GAME_WIN import-side payload fill (finale/main own the goal now); grow-progress last-tier exit (line 181) uses MOON_GOAL_RADIUS_M instead of WIN_RADIUS_M; copy ball.dashGauge01 onto PAYLOADS.grow at the 10Hz emit. |
| `src/render/cameraRig.js` | modify | STREAM A. EVT.DASH additive FOV kick (8deg, 0.8s decay, same idiom as the tierUp kick); beginCinematic() (latch flag, springs keep state) / cinematicUpdate(dt, posTarget, lookTarget, fovTarget) (drives existing pos/look springs + fov ease toward injected targets) / endCinematic(); reset() (already on GAME_RESET, line 135) clears the cinematic flag. |
| `src/render/effects.js` | modify | STREAM A. EVT.DASH 10-speed-line burst; setRareProvider(fn) + per-update golden twinkles (~3/s per alive rare within fog range, pooled quads); moonBurst() ascension golden sparkle fountain; LANDED dust ring helper; rebase/rescale behavior unchanged (already subscribed). |
| `src/render/environment.js` | modify | STREAM B. Sky shader v2 (sun disc+glare, moon disc+craters+halo with uMoonFade/uMoonGlow, hash stars+twinkle gated by uStarIntensity+elevation, 2-octave drifting clouds, uTime accumulator); _palettes built from extended tiers.js params + env-local NIGHT palette appended as index 6; beginNightFade(seconds) rides the existing _toIndex crossfade; setSkyMoonFade(k01)/setSkyMoonPulse(on)/getMoonDirWorld(outV3); setTierPaletteImmediate also resets uMoonFade=1, pulse off, star intensity (cancels night fade structurally). |
| `src/render/backdrop.js` | new | STREAM B. Backdrop class: camera-centered silhouette ring (96seg x 2 layers ~1.5k tris, seeded vertex colors, hills<->skyline dual profile blended by uProfile01 on TIER_UP crossfade, fog-color mix shader BACKDROP_FOG_MIX); update(dt,ball,camera) sets position to cam.xz and scale to radiusSim (pure function => rescale pixel-identical, rebase-free); frustumCulled=false, depthWrite=false; subscribes TIER_UP + GAME_RESET; dispose(). |
| `src/config/catalog.js` | modify | STREAM C. 12 landmark archetypes (soda_bottle, desk_globe, bookshelf, grandfather_clock, utility_pole, torii, pylon, giant_tree, castle, pagoda, mountain, skytree): merged vertex-colored primitives <=350 tris each, radiusNominal/collisionScale per the scenery section, spawnWeight 0.25-0.35, upright=true. |
| `src/world/objects.js` | modify | STREAM C. export FLAG_RARE = 8; code mapping t*8+i -> t*ARCH_PER_TIER+i (lines 55/69), ARCHETYPE_ID_BY_CODE table 48->60, header comment updated, boot DEV-assert length===60. |
| `src/world/spawner.js` | modify | STREAM C. Stride rework: _resolveCatalog (:1144) and all per-archetype stat arrays sized 60, loops over ARCH_PER_TIER; _spawnPlacement weighted pick (:874-879) uses dual cumulative tables (_cumW8 for j>0, _cumW10 for j===0 — landmark eligibility rule); rareRoll drawn LAST unconditionally + updated draw-order contract comment (:851); rare promotion (RARE_CHANCE/FLAG_RARE/RARE_TINT instanceColor/RARE_SCALE_MUL, landmarks excluded); alive-rare list Int32Array(2*RARE_LIST_CAP) of (idx,slotGen) pairs, push only after both allocs succeed, compaction in _onAbsorb/_despawnIndex/reset; forEachAliveRare(cb); sub-pixel sweep skips FLAG_RARE only while tierOf >= tier-1; reinject never sets FLAG_RARE; DEV warn aliveCount > 0.9*ALIVE_TOTAL_BUDGET; header comment 0..47 -> 0..59. |
| `src/render/ball.js` | modify | STREAM C. Stride fix: flat id table (:106-111) sized 60 filled with t*ARCH_PER_TIER+s for all 10 slots; family mapping (:299) -> (code % ARCH_PER_TIER) & 7 (landmark slots fold to families 0/1); boot DEV-assert cross-check vs objects.js. setVisible(b) (group.visible — frozen interface for finale MERGE); reset() additionally restores group.visible=true. |
| `src/physics/ballPhysics.js` | modify | STREAM D. Constructor gains optional bus (null-safe headless). dashGauge01/dashTimer on state; recharge dt/DASH_RECHARGE_S; EVT.DASH_READY edge on refill; dash trigger (gauge>=1): impulse along vel-dir/cam-forward per DASH_DIR_SPEED_K, emit EVT.DASH; cap/accel multipliers while dashTimer>0; reset() seeds gauge=1, timer=0. |
| `src/physics/absorb.js` | modify | STREAM D. Stamp AbsorbEvent.rare = (store.flags[i] & FLAG_RARE) !== 0 BEFORE store.free/emit; ball.state.dashGauge01 += DASH_ABSORB_GAIN per absorb (clamped 1, DASH_READY edge stays in ballPhysics' next step — single emitter). |
| `src/input/input.js` | modify | STREAM D. Space keydown -> dash edge latch (intent.dash true for exactly one read); #dash-button pointerdown likewise (excluded from joystick region like existing buttons); 'M' keyup -> takeMuteToggle() edge. No double-tap/flick recognizers. |
| `src/game/runStats.js` | new | STREAM D. RunStats(bus, scaleMgr, worldSeed): addSimTime accumulation + freeze flag on MOON_CONTACT; EVT.TIME on 0.1s sim-boundary crossings; score/combo/rare accounting on ABSORB -> EVT.SCORE; on MOON_CONTACT: moon+time bonuses, rank table, localStorage best (schema v:1 {bestTime:{...},bestScore:{...}}, atomic per-record improve, full try/catch incl. parse+validate), newRecord flags, emit EVT.GOAL once; reset(); static loadBest(). |
| `src/audio/bgm.js` | new | STREAM E. Bgm(bus, initialMuted): own AudioContext + gesture bootstrap; two-clock lookahead scheduler (25ms tick, 0.12s lookahead); 4 tier-unlocked layers (128BPM A-major bossa-pop per audio section); visibilitychange suspend/resume + nextNoteTime re-anchor (skip missed beats); all gain automation in ctx time (no setTimeout); MOON_CONTACT duck->stop; MOON_CALL swell; GAME_RESET stop+rewind; setMuted halts node creation; shared persistent noise buffer + init-time PeriodicWaves; bounded-alloc exemption header; dispose(). |
| `src/audio/sfx.js` | modify | STREAM E. Constructor gains initialMuted; setMuted(b) (master gain 0 + skip node creation). New SE: dash whoosh (EVT.DASH), dash-ready chime, rare gliss (EVT.SCORE rare), moon-call pad, MOON_CONTACT 8-note grand fanfare + AM9 pad (the GAME_WIN fanfare handler at :88 is removed), rank-stamp thud on EVT.GAME_WIN at +1.6s ctx-time (lands on the CSS rank-stamp reveal). All via existing _note idioms + one shared noise AudioBuffer. |
| `src/ui/hud.js` | modify | STREAM E. #timer mm:ss.t (EVT.TIME); #score-value + pooled floating '+N' spans (EVT.SCORE); dash gauge fill from GrowEvent.dashGauge01 / instant zero on DASH / flash on DASH_READY; #mute-button -> EVT.MUTE_REQUEST, icon on MUTE_CHANGED; #moon-arrow positioning/visibility from EVT.MOON_GUIDE; toasts (MOON_CALL 「月が呼んでいる…！」, rare, 月へ向かえ); hide all on MOON_CONTACT, show on GAME_START. |
| `src/ui/screens.js` | modify | STREAM E. Cache EVT.GOAL payload (copy fields — payloads are reused) + prebuild the X intent URL immediately; staged result reveal on GAME_WIN (count-up score from cached values, rank stamp, NEW RECORD badge, best + seed lines); #post-x-button: w=window.open(url,'_blank'); if null location.href=url; title screen shows 自己ベスト via RunStats.loadBest(). |

## インターフェース

```js
// ===== types.js additions (PHASE 0, frozen) =====
Intent      += { dash: boolean }                 // edge-latched, consumed by one read
BallState   += { dashGauge01: number, dashTimer: number }
GrowEvent   += { dashGauge01: number }           // scaleManager copies from ball at the 10Hz emit
AbsorbEvent += { rare: boolean }                 // absorb.js stamps from FLAG_RARE BEFORE store.free
Tier        += { sunDir:[n,n,n], sunIntensity:number, moonDir:[n,n,n] /*elev>=0.15*/, moonAngSize:number, starIntensity:number, cloudDensity:number, cloudHex:number }

// ===== events.js EVT additions (reused PAYLOADS, read-only in handlers) =====
EVT.DASH         'dash'         { gauge01:number }   // ballPhysics -> cameraRig kick, effects burst, sfx whoosh, hud zero
EVT.DASH_READY   'dashReady'    {}                   // ballPhysics, once per refill -> hud flash, sfx chime
EVT.SCORE        'score'        { score:number, delta:number, combo:number, rare:boolean } // runStats -> hud, sfx(rare)
EVT.TIME         'time'         { timeS:number }     // runStats, on 0.1s sim-boundary -> hud
EVT.MOON_CALL    'moonCall'     { trueRadius:number }// finale once -> hud toast, env pulse, bgm swell, sfx pad
EVT.MOON_GUIDE   'moonGuide'    { x01:number, y01:number, onScreen:boolean, active:boolean } // finale 10Hz during DESCENT/LANDED (+one active:false on CONTACT) -> hud arrow
EVT.MOON_CONTACT 'moonContact'  {}                   // finale once = run end -> runStats(freeze+GOAL), bgm duck, sfx fanfare, hud hide, screens flash
EVT.GOAL         'goal'         { timeS, score, rank:string, trueRadius, absorbed, raresFound, seed, newRecordTime:boolean, newRecordScore:boolean } // runStats once -> screens cache+URL build
EVT.MUTE_REQUEST 'ui:muteRequest' {}                 // hud -> main
EVT.MUTE_CHANGED 'muteChanged'  { muted:boolean }    // main -> hud
// 'game:win' { trueRadius, seed } now emitted by MAIN when finale.state==='done' (was ScaleManager).

// ===== new classes =====
// game/finale.js (Stream A)
class Finale {
  constructor(bus, scaleMgr, moonView, env, cameraRig, ballView /*render Ball*/, camera /*THREE.PerspectiveCamera*/)
  update(frameDt:number, ball:BallState): void   // step 4.5; render-frame contact test; drives MoonView + (from contact) cameraRig.cinematicUpdate
  get state(): 'idle'|'called'|'descent'|'landed'|'contact'|'merge'|'ascension'|'afterglow'|'done'
  get inputLocked(): boolean   // true from CONTACT; main gates intent/absorb/spawner/maybeRebase
  get cameraOwned(): boolean   // true from CONTACT; main skips cameraRig.update
  reset(): void                // GAME_RESET via main.resetWorld
  // subscribes EVT.RESCALE/EVT.REBASE itself; ALL sensitive state in _simCache {startX,startY,startZ,landX,landY,landZ,moonR,mergeFromX,mergeFromY,mergeFromZ,ascendBaseY}
}
// render/moon.js (Stream A)
class MoonView { constructor(scene, worldSeed); setPose(x,y,z,radiusSim); setVisible(b); setGlow01(k); setSpin(rad); dispose() } // 2 draw calls, fog:false, finale-only
// game/runStats.js (Stream D)
class RunStats {
  constructor(bus, scaleMgr, worldSeed)
  addSimTime(s:number): void; reset(): void
  get timeS(): number; get score(): number; get absorbed(): number; get raresFound(): number
  static loadBest(): {v:number, bestTime:BestRecord|null, bestScore:BestRecord|null}|null // BestRecord {timeS,score,rank,seed}
}
// audio/bgm.js (Stream E)
class Bgm { constructor(bus, initialMuted:boolean); setMuted(b):void; dispose():void }
// render/backdrop.js (Stream B)
class Backdrop { constructor(scene, worldSeed); update(dt, ball:BallState, camera):void; dispose():void } // subscribes TIER_UP + GAME_RESET itself

// ===== changed signatures / new methods on EXISTING classes =====
new Sfx(bus, initialMuted=false); sfx.setMuted(b)
input.takeMuteToggle(): boolean              // 'M' keyup edge
// intent.dash: edge-latched by input.js (Space + #dash-button), cleared on read
cameraRig.beginCinematic(): void; cameraRig.cinematicUpdate(dt, posTarget:V3, lookTarget:V3, fovTarget:number): void; cameraRig.endCinematic(): void // reset() clears the flag too
env.setSkyMoonFade(k01): void; env.setSkyMoonPulse(on): void; env.beginNightFade(seconds): void; env.getMoonDirWorld(out:V3): V3
ball.setVisible(b): void                     // render Ball group visibility; ball.reset() restores true
spawner.forEachAliveRare(cb:(idx,x,y,z,r)=>void): void
effects.setRareProvider(fn:(cb)=>void): void; effects.moonBurst(): void
objects.js: export FLAG_RARE = 8;  tiers.js: export ARCH_PER_TIER = 10
scaleManager: win latch REMOVED; grow payload carries dashGauge01; last-tier progress exit = MOON_GOAL_RADIUS_M

// ===== BINDING frame order (main.js, v2) =====
// 1   intent = input.read(); if (finale.inputLocked) { intent.x=intent.y=0; intent.dash=false; intent.boost=false }
// 2   fixed steps { ballPhys.step(dt,intent,yaw+PI); if (!finale.inputLocked) absorb.resolve(...) }
// 3   if (!finale.inputLocked) spawner.update(...)
// 4   scaleMgr.maybeTierUp(...); if (!finale.inputLocked) scaleMgr.maybeRebase(...)
// 4.5 finale.update(frameDt, ballPhys.state)        // NEW — moon drive, render-frame contact test, cinematic camera
// 5   ball.update(...)
// 6   if (!finale.cameraOwned) cameraRig.update(...); env.update(...); backdrop.update(...); effects.update(...)
// 6.5 runStats.addSimTime(steps * FIXED_DT)         // NEW (internally frozen after MOON_CONTACT)
// 7   updateAndFlushPools(); renderer.render()
// GameState: TITLE -> PLAYING -> FINALE (when finale.inputLocked first true) -> WIN (main emits GAME_WIN at finale 'done').
// BINDING ABSORB subscription order at boot: main attach-handler -> runStats -> sfx/effects/hud.
// RESET OWNERSHIP (frozen): finale.reset+runStats.reset via main.resetWorld; cameraRig.reset (GAME_RESET, clears cinematic); env.setTierPaletteImmediate (GAME_RESET, resets v2 uniforms + cancels night fade); backdrop (GAME_RESET snap); ball.reset restores visibility; hud shows on GAME_START.
```

## チューニング定数

```js
// ---- Moon / finale ----
MOON_CALL_RADIUS_M = 420
MOON_GOAL_RADIUS_M = 500            // replaces WIN_RADIUS_M (deprecated until integration, then deleted)
MOON_RADIUS_K = 2.6                 // moonRadiusSim = K * ball.radiusSim, frozen at descent
MOON_DESCENT_S = 6.0
MOON_LAND_DIST_K = 45               // landing = ballPos + dir * K * r
MOON_LAND_VEL_FRAC = 0.5            // landing dir = vel dir if |vel| >= frac*speedCap else camForward
MOON_DIR_MIN_ELEV = 0.15            // rad, tiers.js moonDir elevation floor (assert)
MOON_CONTACT_PAD = 0.85             // contact: d <= ballR + moonR*PAD
MOON_MAGNET_ACCEL_FRAC = 0.15       // * ACCEL_K * r, LANDED only
MOON_MAGNET_RANGE_K = 20            // * r
FLASH_S = 0.45
MOON_MERGE_S = 1.2
MOON_ASCEND_S = 5.0
MOON_ASCEND_HEIGHT_K = 40           // * r
AFTERGLOW_S = 2.5
// ---- Dash ----
DASH_RECHARGE_S = 4.0
DASH_ABSORB_GAIN = 0.03
DASH_DURATION_S = 0.8
DASH_CAP_MUL = 2.2
DASH_ACCEL_MUL = 1.8
DASH_IMPULSE_K = 7.0                // * radiusSim
DASH_DIR_SPEED_K = 0.3              // vel-dir vs camForward threshold
DASH_FOV_BONUS = 8                  // deg
// ---- Score / rank ----
SCORE_SIZE_BASE = 100; SCORE_SIZE_POW = 1.4
COMBO_SCORE_K = 0.10; COMBO_SCORE_MAX_MUL = 3.0
RARE_SCORE_BONUS = 5000; MOON_SCORE_BONUS = 20000
TIME_BONUS_MAX = 30000; TIME_BONUS_FULL_S = 300; TIME_BONUS_ZERO_S = 720
RANK_S_S = 300; RANK_A_S = 400; RANK_B_S = 540; RANK_C_S = 720   // else D; re-tune from >=3 playthroughs in Phase 3
// ---- Rares ----
RARE_CHANCE = 0.002                 // per placement, rareRoll drawn LAST
RARE_SCALE_MUL = 1.15
RARE_TINT = 0xffd84a
RARE_LIST_CAP = 32                  // entries; backing Int32Array(64) of (idx,slotGen)
// ---- Scenery / population ----
SCENERY_OBJECTS_PER_CHUNK = 10      // was 8 (peak arithmetic: 2000+600+~250+<=1200 ≈ 4050 < 4096)
// ALIVE_SCENERY_BUDGET DELETED (dead constant)
// ---- Renderer ----
DRAW_CALL_CAP = 60                  // was 55; honest 4-band transition worst case = 56
// ---- Persistence ----
LS_BEST_KEY = 'fableKatamari.v2.best'; LS_MUTE_KEY = 'fableKatamari.v2.muted'
// ---- Backdrop (module-local, backdrop.js) ----
BACKDROP_DIST_K = 48; BACKDROP_HEIGHT_K = 10; BACKDROP_FOG_MIX = 0.82
// ---- Bgm (module-local, bgm.js) ----
BPM = 128; LOOKAHEAD_S = 0.12; TICK_MS = 25; LAYER_FADE_S = 1.5; DUCK_GAIN = 0.12; BGM_GAIN = 0.32; NODE_BUDGET_PER_S = 60
// ---- tiers.js (Phase 0) ----
ARCH_PER_TIER = 10 (export); per-tier sky params incl. moonAngSize [0.018,0.022,0.028,0.035,0.046,0.062], starIntensity [0,0,0,0,0.15,0.5]
// ---- Unchanged: ABSORB_RATIO 0.65, GROWTH_K 10, RESCALE_S 0.2, SIM band [0.5,2.5], REBASE_DISTANCE_SIM 1500, all v1 camera/physics/spawner budgets
```

## 並列作業分割

PHASE 0 — INTEGRATOR/LEAD (~half day, blocks everything): src/types.js, src/core/events.js, src/config/tuning.js, src/config/tiers.js, index.html, src/main.js (frame-order skeleton with finale/runStats call sites as no-op stubs), docs/DESIGN.md v2 chapter. Freezes every cross-stream contract: event names+payload shapes, all signatures in interfaces, DOM ids, the 12 landmark ids + ARCH_PER_TIER=10 + FLAG_RARE=8 values, the rareRoll-LAST draw-order rule, the j===0 landmark rule, reset-ownership table, binding ABSORB subscription order. main.js is touched by NO ONE else.

STREAM A — MOON & FINALE: src/game/finale.js (new), src/render/moon.js (new), src/world/scaleManager.js, src/render/cameraRig.js, src/render/effects.js. Standalone test: scripted BallState + fake scaleMgr ({worldScale, trueRadius ramp}) drives the full state machine headless; KeyR force-rescale + dev-teleport rebase during DESCENT/LANDED with screenshot diff is the rescale-safety gate.

STREAM B — BACKGROUNDS: src/render/environment.js, src/render/backdrop.js (new). Test with the v1 scene + ?r= per tier: palette crossfade, forced-rescale pixel diff (sky is direction-only; backdrop is a pure K*r function of camera+radius), night fade + reset snap.

STREAM C — SCENERY, RARES & STRIDE: src/config/catalog.js, src/world/objects.js, src/world/spawner.js, src/render/ball.js. Owns the ENTIRE 8->10 stride migration (the grep audit '\* 8|=== 8|< 8|& 7|48' across these files is a named checklist item) + boot asserts (60 codes, tri caps) + rare determinism (same seed twice => identical rare set, headless). Implements ball.setVisible against the frozen interface (consumer is Stream A, wired at integration).

STREAM D — GAME SYSTEMS: src/physics/ballPhysics.js, src/physics/absorb.js, src/input/input.js, src/game/runStats.js (new). Fully headless: scripted intents through the fixed-step loop verify dash gauge/impulse/caps; runStats fed synthetic ABSORB/MOON_CONTACT verifies score/rank/localStorage schema (mock storage).

STREAM E — AUDIO & UI: src/audio/bgm.js (new), src/audio/sfx.js, src/ui/hud.js, src/ui/screens.js. Driven by synthetic bus events: fake TIER_UP unlocks layers, fake GOAL+GAME_WIN drives the result reveal + X URL; tab-hide/show test for the bgm re-anchor; iOS-device gesture/resume check.

INTEGRATION (lead + Stream A): wire in order D (dash feel) -> C (stride+rares; run boot asserts + a v1-vs-v2 visual sanity pass) -> E (bgm/hud/result) -> B (visual pass) -> A LAST (finale end-to-end via ?r=480 and ?r=740). Then: delete WIN_RADIUS_M, forced-rescale screenshot diff at every tier AND during DESCENT, forced-rebase (teleport) during DESCENT, full-run restart-debris check (play to result, restart, verify title scene clean), iGPU profile with bgm on (heap-delta line, node budget), draw-call DEV warn watch across a tier transition, Cloudflare Pages deploy. Cross-stream constants (FLAG_RARE, ARCH_PER_TIER, landmark ids, event payloads) are all VALUE-frozen in Phase 0 so no stream waits on another.

## リスク

- Stride 8->10 is the highest-blast-radius change: any missed hardcoded 8/48/&7 silently corrupts code<->pool<->family mapping. Mitigations: ALL four affected files owned by one stream (C), grep checklist, boot DEV-asserts in objects.js AND ball.js (length 60 cross-check), plus an integration visual pass comparing T1-T3 absorb proxies against v1 footage.
- Mid-finale rescale/rebase remains the most fragile new path even with the _simCache rule: the field list must stay exhaustive as finale.js evolves. Gate: KeyR (rescale) AND dev-teleport (rebase) during DESCENT and LANDED must pass the screenshot diff before ship; any new finale state field MUST be added to _simCache or derived per-frame.
- Removing the ScaleManager win latch makes finale the only end-of-game path; a finale bug means the run never ends. The DEV watchdog (idle past 1.2x goal => force descent + console.error) covers dev; ship builds rely on the descent trigger being a plain >= compare on the same trueRadius the old latch used.
- Draw-call cap raised to 60 on arithmetic (worst 56 in the 4-band transition window), not measurement. The renderer.info DEV warn must be watched across a real T3->T4 transition with backdrop on; if measured calls exceed 56, first lever is dropping the moon glow shell (-1) and forcing N+2 pre-warm pools hidden until tier-up (-up to 10).
- Population peak ~4050 of 4096 is tight; pathological leftover retention (player camping a tier boundary) could stall the spawn queue via the retry path. The new 0.9-budget DEV warn plus Phase-3 monitoring decide whether SCENERY_OBJECTS_PER_CHUNK drops back to 8 — a one-line revert by design.
- BGM is a standing bounded exemption to the zero-alloc law (~40-60 nodes/s). If the heap-delta line shows GC pressure on low-end devices, fallback is pre-rendered per-bar AudioBuffer loops. iOS resume must be verified on-device inside the actual START tap; the visibilitychange suspend/resume path needs explicit mobile-Safari testing (pagehide quirks).
- Sky-moon handoff math assumes the camera is near the dome center (it is — dome follows camera) and that moonDir elevation >= 0.15 rad holds after the per-tier crossfade lerp (lerp of two valid dirs can dip slightly: assert the POST-normalization elevation of all crossfade endpoints, and clamp in env.getMoonDirWorld as belt-and-suspenders).
- Rank thresholds (S300/A400/B540/C720) and the time-bonus curve are estimates off v1 pacing + dash; binding Phase-3 task: >=3 full playthroughs (casual/normal/optimized) re-tune them — one-line edits by design.
- Dash at 2.2x cap stresses the front-of-motion spawn budget (64/frame); 0.8s duration + 4s recharge bounds it, but back-to-back dashes at ?r=150 must show no fog-wall pop-in; if it does, dash-while-active raises spawner's front-of-motion priority weighting, not the budget.
- X intent same-tab fallback (location.href) abandons the result screen in exotic webviews — acceptable (state is already persisted to localStorage; restart re-shows best), documented so it is not treated as a bug.
- Rare list cap 32: overflow policy is 'oldest entry stops sparkling' (object remains absorbable and scorable — only the twinkle provider misses it); deterministic pathological seeds could exceed it; documented as cosmetic-only degradation.
- effects.js (Stream A file) consumes Stream C's forEachAliveRare and Stream D's EVT.DASH — both Phase-0 value-frozen, but integration order D -> C -> E -> B -> A must be respected to avoid dead-event confusion during bring-up.