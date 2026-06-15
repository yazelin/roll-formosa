# Phase 5 作業ログ: v2 差分設計（ワークフロー `katamari-v2-moon-design`）

## 要件の変遷（重要な意思決定記録）

1. **当初のv2要件**（ユーザー指示）: 背景・陸地・段差の追加、民家の中→街の銅像をゴールにするデモ構成、BGM/SE、ダッシュ、タイムアタック、レアアイテム、スコア/ランク、Xポスト。
2. **設計ワークフロー第1回**（`katamari-v2-design`、3エージェント・約42.8万トークン・約33分）: 家→銅像スコープで設計→敵対的批評→改訂まで完了。批評エージェントは「家屋内カメラの破綻（ブロッカー）」「一回の吸収でドア通過不能になるソフトロック（ブロッカー）」「床クエリ意味論の破れ」「2スポナーのObjectStore所有権競合」等、15件の重大問題を検出していた。
3. **要件変更**（ユーザー、プレイ後）: 「ゴールは月に変更。家の中案は取り下げ。BGM・背景・巻き込めない大物オブジェクトでクオリティアップ。Xポストは維持。バズ狙い」。
   - → 地形・壁・段差システム（最も リスクが高かった部分）はキャンセル。v1の無限平面+ティア構造を維持したまま品質向上に集中する方針に転換。
4. **サルベージ判断**: 旧設計のうちゴールに依存しない節（ダッシュ/タイマー/スコア/レア/ランク/Xポスト/BGM設計）を `docs/design/v2-statue-obsolete-salvage.json` に抽出し、新設計ワークフローへ入力素材として渡した。設計トークンの再利用で無駄を最小化。

## 第2回設計ワークフロー（`katamari-v2-moon-design`）

**手法**: 設計者→敵対的批評→改訂の3段パイプライン（v1のjudge panelと異なり、既存コードベースが制約として効くため「1案を徹底的に叩く」方式を採用）。

**v2スコープ**:
- ゴール=月: 序盤から空に見える月が最終ティアで降りてきて接触→エンディング→リザルト
- WebAudio合成BGM（ティア連動レイヤー、ミュート、フェード/ダッキング）
- 背景強化: 空（太陽/月/星/雲）、遠景（山並み/スカイライン）、ティア連動パレット
- 巻き込めない景観オブジェクト増強（鳥居、鉄塔、巨木、スタジアム等の新アーキタイプ）
- ダッシュ（ゲージ式バースト）、タイムアタック、スコア/コンボ/レアアイテム、クリアタイムランク（S〜D）
- リザルト画面+X intent URLポスト（日本語シェアテキスト、#FableKatamari）、localStorageベスト記録

結果は本ファイル追記および `docs/DESIGN-V2.md` に記録。

---

## 第2回設計ワークフロー結果

**実行実績**: エージェント3体 / 約436,001トークン / 約28分

**批評エージェントが検出した主要問題（改訂で解決済み）**:

- [blocker] **Design's claim 'ball.js needs nothing' is false — stride-8 is hardcoded in ball.js family math**
- [blocker] **Spawner is NOT 'no logic change' — `band * 8` weighted-pick and catalog tables are hardcoded, and the rare roll's position in the frozen draw order is unspecified**
- [major] **Draw-call ledger undercounts: 4 bands are alive during every tier-transition window, busting the 55 cap**
- [major] **Mid-finale rescale/rebase coverage is incomplete: descent start pose, merge lerp endpoints, and cinematic camera targets are not in the handler list — and a rebase CAN fire after CONTACT**
- [major] **Sky-moon to real-moon handoff has no angular-size/direction matching spec — the crossfade will visibly pop**
- [major] **LANDED has no guidance and no failure path: player can dash away from a moon that landed behind them**
- [major] **BGM has no tab-visibility spec: setInterval throttling + free-running AudioContext means music plays over a frozen game, then note-bursts on return**
- [major] **Restart-from-result leaves finale debris: invisible ball, cinematic camera, night sky, hidden HUD are not all in the reset spec**
- [major] **Landmark density contradicts 'rare, 1-3 per loaded area': in the TARGET band they spawn ~4/chunk across ~30+ chunks**
- [major] **Rare lifecycle holes: sub-pixel sweep exemption creates immortal invisible sparklers, and list compaction hooks are unenumerated**
- [minor] **Timer is sim-time: slow devices play slow-motion against the same rank thresholds, and EVT.TIME throttling must not use wall clock**
- [minor] **localStorage best schema mixes fields from different runs: seed and rank become meaningless**
- [minor] **X intent handler: window.open with 'noopener' returns null on success — don't treat null as popup-blocked, and provide a same-tab fallback**
- [minor] **ALIVE_SCENERY_BUDGET is dead tuning — bumping 600→900 changes nothing**
- [minor] **Small spec gaps an implementer will invent divergently: dash direction threshold, finale update rate wording, mute-at-boot ordering**

**改訂時の意思決定**:

1. BLOCKER ball.js stride-8: VERIFIED in source (ball.js:106-111 `ids[t*8+s]` over a 48-entry table; ball.js:299 `family = code & 7`). Adopted the critic's fix exactly: table sized 6*ARCH_PER_TIER=60 filled with `ids[t*ARCH_PER_TIER+s]` for s<8 (slots 8/9 of each tier also filled so landmark codes resolve), family = (code % ARCH_PER_TIER) & 7 (landmark slots 8/9 fold onto proxy families 0/1 — acceptable proxies: sphere-ish/box-ish). ball.js is added to fileChanges and assigned to STREAM C (not A) so all stride-8 knowledge lives in one stream; the finale-facing ball.setVisible(b) and reset-restores-visibility are implemented by Stream C against the Phase-0 frozen interface, consumed by Stream A only at integration. Boot DEV-assert extended: ARCHETYPE_ID_BY_CODE.length === 60 in objects.js AND ball.js's flat table cross-checked against it.

2. BLOCKER spawner stride + rare draw position: VERIFIED (spawner.js:874-879 `base = band*8; for i<8`, spawner.js:1144-1145 `archIdx = t*8+i`, 48-entry stat arrays at :207, draw-order contract comment at :851-852). The draft's 'no spawner logic change' claim is retracted; _resolveCatalog/_spawnPlacement rework is an explicit named Stream C task (stat arrays sized 60, loops over ARCH_PER_TIER, dual cumulative-weight tables). Adopted the critic's freeze: rareRoll is drawn LAST, after the optional tumble x3, drawn UNCONDITIONALLY for every placement (simplest invariant), and the contract comment is updated to `(jx, jz, archRoll, sizeRoll, yawRoll, paletteRoll[, tumble x3], rareRoll)`. DESIGN.md notes v1 seeds produce different v2 worlds (weights + density changed) — seed URLs are not cross-version comparable.

3. MAJOR draw-call ledger: adopted critic's option (a) — DRAW_CALL_CAP 55 -> 60 with documented rationale, rejecting option (b) (merged landmark pool) because InstancedPool is strictly per-geometry and a shared landmark pool would special-case the whole instancing pipeline for ~4 calls. Recomputed honest worst case: tier-transition window has 4 materialized bands = 40 world + 8 stuck + ball + ground + sky + blob shadow + 3 effects + 1 backdrop = 56 (the draft's 47 dropped the blob shadow and ignored the 4th band). Finale window proven disjoint: at 500m only bands T4/T5 exist (band >= TIERS.length never materializes), so 38 + 2 moon meshes. renderer.js's existing renderer.info DEV warn is the regression check.

4. MAJOR mid-finale rescale/rebase: adopted both critic rules. (a) From CONTACT onward main.js skips scaleMgr.maybeRebase as well as absorb/spawner (growth frozen => no rescale; positions stay < ~1700 sim units, full Float32 precision for the <10s cinematic); maybeTierUp keeps running (harmless, and keeps the dev force-rescale key honest pre-contact). (b) ALL cached finale sim-space quantities live in ONE exhaustively-listed _simCache struct; the single RESCALE handler multiplies every field by S, the single REBASE handler shifts every x/z field; cinematic camera targets are derived per-frame from current moon pose with K*r coefficients (nothing cached => nothing to patch). Test matrix: KeyR force-rescale during DESCENT + dev teleport (forced rebase) during DESCENT, both pixel-diff verified.

5. MAJOR sky-moon handoff pop: adopted the critic's exact formula — descent start pose = cameraPos + moonDirWorld * (MOON_RADIUS_K * r / tan(moonAngSize[tier])), which makes the mesh's angular size and screen direction match the shader disc at fade start (T5: 2.6r/tan(0.062) ≈ 41.9r, conveniently near MOON_LAND_DIST_K=45). moonDir elevation clamped >= MOON_DIR_MIN_ELEV 0.15 rad in tiers.js data (assert added). Both MoonView materials get fog:false, documented as a deliberate seamlessness-law exemption matching the sky dome's existing fog:false pattern (environment.js:210/231/248): the moon is a sky element, not world scenery.

6. MAJOR LANDED guidance/failure path: adopted all three critic one-liners. (1) landing direction = horizontal velocity dir if |vel| >= MOON_LAND_VEL_FRAC(0.5)*speedCap else camera forward. (2) HUD guidance: new throttled EVT.MOON_GUIDE event emitted by finale (finale has the camera and moon pose; hud.js has neither) driving a screen-edge arrow div + 「月へ向かえ！」 toast. (3) soft magnet in finale.update during LANDED: vel += dirToMoon * MOON_MAGNET_ACCEL_FRAC(0.15) * ACCEL_K * r * dt within MOON_MAGNET_RANGE_K(20)*r — additive bias, never overrides input. No timeout state needed.

7. MAJOR BGM tab-visibility: adopted critic's resolution verbatim — bgm owns its OWN AudioContext; document.visibilitychange: on hidden cancel the tick interval + ctx.suspend() (sfx unaffected); on visible ctx.resume() + re-anchor nextNoteTime = ctx.currentTime + LOOKAHEAD_S keeping the bar/beat counter (skip missed beats, never burst catch-up). ALL delayed gain moves (duck, 1.5s full stop, layer fades) are scheduled in ctx time via setTargetAtTime/linearRampToValueAtTime — setTimeout is banned in bgm.js. setMuted(true) stops note-node creation entirely, not just gain=0.

8. MAJOR restart debris: adopted explicit reset ownership, frozen in Phase 0: ball.reset() restores group.visible=true (Stream C); cameraRig.reset() — already bound to GAME_RESET at cameraRig.js:135 — clears the cinematic flag (endCinematic folded into reset, Stream A); env.setTierPaletteImmediate() additionally resets ALL v2 sky uniforms (uMoonFade=1, uStarIntensity=palette value, pulse off, uTime untouched) and cancels night fade — beginNightFade rides the existing _toIndex crossfade state with NIGHT as env-local palette index 6, so the existing snap covers it structurally (Stream B); HUD re-shows on GAME_START not GAME_RESET (Stream E). Documented: GAME_RESET is unreachable mid-finale (screens.js is the sole emitter, button exists only on the result screen).

9. MAJOR landmark density: adopted a STRONGER deterministic rule than either critic option — landmark slots 8/9 are archRoll-eligible only for placement j === 0, via two per-band cumulative tables (_cumW8 excludes slots 8/9, _cumW10 includes them; one archRoll either way, same draw position). The critic's 'j === wantK-1' variant is rejected because wantK differs between scenery (10/chunk) and target (72/chunk) roles for the same chunk key, so role upgrades would re-roll placements and break determinism; j===0 depends on nothing role-varying. Expected density: landmark weight ~0.6/9.2 ≈ 6.5% of chunks => ~2 alive in the target band, ~4 per scenery band — matches '1-3 per loaded area'. SUBGRID interpenetration by giant landmarks is ACCEPTED and documented (small objects nestling at a landmark's base reads naturally; physics uses collisionScale).

10. MAJOR rare lifecycle: sweep exemption narrowed — sub-pixel sweep skips FLAG_RARE only while store.tierOf[i] >= tierIndex - 1; older rares despawn normally (no immortal invisible sparklers; rares get a one-tier grace which is already generous). The three compaction hooks are enumerated in the spawner.js change entry (_onAbsorb, _despawnIndex, reset) plus the ordering rule: the rare-list push happens only AFTER both store.alloc and pool.alloc succeed (after spawner.js:921's drop path). Rare list entries are (storeIdx, slotGen) pairs in an Int32Array(2*RARE_LIST_CAP) so stale indices self-invalidate, mirroring the flight-pool pattern.

11. MINOR->adopted scenery density revision: draft's 12/chunk is reduced to 10/chunk because the honest peak arithmetic (verified objectsPerChunk=72, scenery load radius 140 => ~60 chunks/band) gives 2000 target + 600 scenery + ~250 capped pre-warm + <=1200 leftovers ≈ 4050 < ALIVE_TOTAL_BUDGET 4096; 12/chunk risks spawn-queue stall via the retry path at spawner.js:808-810. ALIVE_SCENERY_BUDGET is DELETED (verified dead — never imported); a DEV warn fires at aliveCount > 0.9*ALIVE_TOTAL_BUDGET.

12. MINOR timer: sim-time accepted and documented in DESIGN.md (deterministic, matches the fixed-step law; wall clock would punish slow devices instead — a worse trade). EVT.TIME 10Hz throttle is sim-time-boundary based (emit when timeS crosses the next 0.1s), never performance.now, so displayed tenths freeze exactly with the timer.

13. MINOR localStorage: adopted critic schema {v:1, bestTime:{timeS,score,rank,seed}, bestScore:{timeS,score,rank,seed}} — each sub-record replaced atomically when its metric improves so every displayed line is internally consistent; loadBest() wraps getItem AND JSON.parse AND field-type validation in one try/catch, returns null on any anomaly.

14. MINOR X intent: adopted — intent URL built ONCE when EVT.GOAL is cached (never from animating DOM); click handler: `const w = window.open(url, '_blank'); if (w === null) location.href = url;` — 'noopener' dropped from the features string so the null-return ambiguity disappears and in-app webviews (LINE/Instagram) get a same-tab fallback; x.com is a trusted top-level target.

15. MINOR spec gaps frozen in Phase 0: DASH_DIR_SPEED_K = 0.3 (dash dir = horizontal vel dir if |vel| >= 0.3*speedCap else camera forward); finale contact test reworded to 'render-frame contact test in finale.update (step 4.5)' — the per-fixed-frame wording is deleted (at dash speed the ball moves ~0.14r per render frame, ample vs the 0.85 contact pad); mute-at-boot: main reads LS_MUTE_KEY BEFORE constructing audio, passes initialMuted into both constructors (new Bgm(bus, initialMuted), Sfx gains an initialMuted param), and both apply it inside their lazy context/master-gain creation path.

16. Dash input surface: Space keydown + #dash-button pointerdown only; the requirement's 'double-tap direction or flick' alternative is dropped — two extra gesture recognizers, accidental-trigger risk on the joystick, zero coverage gain over a thumb-reachable button. Recorded as a deliberate scope cut.

17. Salvage reuse: dash/timer/score/rare/rank/X-post/BGM specs from v2-statue-obsolete-salvage.json adopted with these adaptations — rares move from the cancelled LevelSpawner into deterministic chunk-spawner promotion (FLAG_RARE=8 kept, FLAG_LEVEL dropped); rank thresholds re-derived for the longer 500m+moon run (S 300/A 400/B 540/C 720 vs the statue level's 240/330/450/600); dash recharge tightened 6.0->4.0s and duration 0.6->0.8s for the bigger open world; DUCK trigger moves from EVT.GOAL to EVT.MOON_CONTACT; all terrain/walls/steps/house/statue content excluded per instruction.
