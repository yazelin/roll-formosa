# DESIGN-V3 — 箱庭東京アップデート（確定差分仕様）

> 生成元: ultracode 設計ワークフロー `katamari-v3-design`（設計→敵対的批評→改訂）。機械可読版: `docs/design/DESIGN-V3.json`

## 概要

V3 "Hakoniwa Tokyo" is a delta on the live v2 build that keeps every binding invariant (one-frame similarity rescale pixel-identity, seamlessness law, zero per-frame alloc in hot paths with the bounded WebAudio exemption, fixed 60Hz, InstancedMesh pooling, static Cloudflare Pages). The infinite plane becomes a FINITE 3.6x3.8km miniature Tokyo authored in src/config/cityMap.js with ORIGIN = BALL START: the run begins at 2cm inside a roofless open-front Akihabara parts shop (roofless dollhouse + interior camera profile + boom clamp solve the salvaged camera blocker; step-free h=0 everywhere makes the entire floor-semantics critique class unrepresentable), grows through the Akiba street, downtown, city core and metropolis, and absorbs 11 fixed-position landmark singletons culminating in Tokyo Tower (333m, penultimate — BINDING: absorbed normally at ~262m; its GROWTH_K=10 jump to ~406m ramps into the finale band) before the Tokyo Skytree (634m) finale: the re-themed v2 production (contact flash -> merge -> ascension into the night sky over the diorama -> result), with the Skytree rendered as a sky-dome silhouette until worldScale 0.2 then crossfading to the goalTower mesh via the KEPT v2 moon handoff machinery, and a permanent base collider so the ball never clips the goal monument. A new CuratedSpawner shares the ObjectStore with the zone-masked chunk spawner under the frozen FLAG_CURATED protocol, now including DYNAMIC RE-BANDING (curated slots re-stamped into the live tier-band window on activation and TIER_UP) so every curated object is always collidable/absorbable, 4 shared EXTRA render pools (flat +4 draws, ledger 64/72), and an explicit slot-steal convention. Tier table: 7 tiers, 2cm -> 420m goal; ONE pacing truth: GROWTH_K=10 kept, density authored at 0.45x v2, typical first clear 5:30-6:30, optimal ~3:30-4:00, ranks S240/A330/B450/C600 (Phase-3 empirical retune mandatory). Mobile-first HUD rewrite (top bar + dash-ring + safe-area insets + band-based overlap matrix) fixes the phone overlap. Every archetype gets a Japanese display name shown merged next to score popups; 12 frozen-id named collectibles persist in a localStorage album with a result-screen grid and an extended X intent text. Donack, the official pixel-art duck, commentates via 8 already-shipped first-party webp frames (~20KB, documented zero-asset-law exemption; the 16 surplus frames are deleted), a phase-gated priority+cooldown bubble system, and 42 lines of authored Japanese copy including landmark trivia. Phase 0 ships deprecated MOON_* aliases so the build never breaks mid-migration; work splits into Phase 0 + 5 zero-overlap streams with main.js integrator-only.

## モバイルファーストUI

MOBILE-FIRST HUD SPEC (index.html CSS full rewrite, Phase 0; hud.js consumes the same frozen ids). Base styles ARE the <=480px portrait layout; @media (min-width:768px) and @media (max-height:480px) and (orientation:landscape) are enhancements. Safe-area vars on :root: --s-t/--s-b/--s-l/--s-r = env(safe-area-inset-*, 0px). All fixed elements anchor with them.

=== PORTRAIT BASE (360-430px) ===
1. #top-bar (NEW wrapper replacing the three v2 corner panels): position:fixed; top:calc(8px + var(--s-t)); left:calc(8px + var(--s-l)); right:calc(8px + var(--s-r)); height:44px; display:flex; gap:6px; pointer-events:none. Children in order:
   - #size-pill (flex:1.2, min-width:0): #size-value 20px/800 tabular + #size-unit 12px; no label text on mobile (aria-label only).
   - #timer (flex:0.9, min-width:64px): 16px/800 tabular, padding 0 8px. MOBILE FORMAT m:ss — hud.js renders deciseconds ONLY at >=768px (format string owned by hud.js; display capped at 99:59). '12:34' fits the 64px slot with padding.
   - #score-pill (flex:1.4): #score-value 17px/800; subline <span id="absorbed-inline">x0</span> 10px #9aa3c0 (absorbed counter merges into the score pill on mobile; standalone panel returns at >=768px).
   - #mute-button: 36x36px fixed, flex:none, pointer-events:auto.
   360px fit proof (m:ss timer): 104+64+120+36 + 3x6 gaps + 16 margins = 358px. All pills overflow:hidden; white-space:nowrap.
2. #progress-bar: top:calc(56px + var(--s-t)); left:calc(10px + var(--s-l)); right:calc(10px + var(--s-r)); height:5px (moved from bottom — frees the thumb zone). #tier-label inside the bar, left:6px, 9px/0.2em uppercase, offset top:-12px.
3. #hud-toast: top:calc(74px + var(--s-t)); left:50%; translateX(-50%); max-width:92vw; font-size:15px; padding:7px 18px. When #collect-popup is visible hud.js caps toast max-width to 58vw (one line in hud.js).
4. #donack-root (NEW, DIRECT CHILD OF body — explicitly OUTSIDE #hud so it survives the GOAL_CONTACT hud-hide for its scripted ascension line): left:calc(8px + var(--s-l)); top:calc(118px + var(--s-t)); avatar 56x56px + bubble to its right, max-width:min(70vw,300px), 13px/1.45. Slide-in translateX(-12px)->0. Never pointer-events. Hidden by default.
5. #collect-popup (NEW rare card): right:calc(8px + var(--s-r)); top:calc(74px + var(--s-t)); width:198px; 64x64 <img> thumbnail + name 13px + 「コレクション n/12」 10px; slide-in from right, auto-out 3.5s. Opposite side from toast — no overlap by construction.
6. #score-float-layer (absorb-name + score popups): left:50%; bottom:44vh; width:0; overflow:visible — floats ('+120 ネジ', 15px) rise from below screen-center, above both thumbs, never over the top bar. MAX_FLOATS_MOBILE=3, 6 at >=768px.
7. #tier-banner: top:30vh, font-size clamp(26px,8vw,42px).
8. #dash-button: right:calc(16px + var(--s-r)); bottom:calc(20px + var(--s-b)); 76x76px (thumb target, up from 64). #dash-gauge bar DELETED; gauge becomes a RING: #dash-button::before { inset:-5px; border-radius:50%; background:conic-gradient(#8fb5ff var(--gauge,360deg), rgba(255,255,255,.12) 0); -webkit-mask:radial-gradient(closest-side, transparent calc(100% - 5px), #000 calc(100% - 4px)); transition:--gauge .12s linear; } with REGISTERED property `@property --gauge { syntax:'<angle>'; inherits:false; initial-value:0deg; }` so the 10Hz writes interpolate smoothly (iOS 16.4+/Chrome 85+). FALLBACK: `@supports not (background: conic-gradient(#000 0deg, #000 0))` OR missing @property -> a plain 4px horizontal bar inside the button bottom (same --gauge variable consumed as width %). hud.js writes --gauge (0-360deg) from GrowEvent.dashGauge01 at 10Hz, snaps to 0 on EVT.DASH, existing flash keyframe on DASH_READY.
9. #goal-arrow (renamed from #moon-arrow, glyph 🗼): unchanged screen-edge logic; exclusion zone top 64px and bottom 100px.
10. Joystick (input.js, mechanics unchanged, polish only): dynamic anchor spawn region restricted to left 65% width x bottom 55% height; ring/thumb opacity 0.5 for sunlight readability; #dash-button/#mute-button stay on the joystick exclusion list.
11. #vignette, #flash-overlay unchanged. .overlay padding: calc(12px+var(--s-t)) calc(12px+var(--s-r)) calc(12px+var(--s-b)) calc(12px+var(--s-l)). backdrop-filter:blur DROPPED below 768px (@supports + width guard) to save Android compositor time.

=== LANDSCAPE PHONE (max-height:480px and orientation:landscape) ===
#top-bar height 36px, fonts -2px, top:calc(6px+var(--s-t)); #progress-bar top:calc(46px+var(--s-t)); #hud-toast top:calc(50px + var(--s-t)), center anchor, max-width:60vw (EXPLICIT — was the spec gap); #donack-root avatar 48px at left:calc(8px+var(--s-l)), top:calc(58px+var(--s-t)); float layer bottom:38vh; #dash-button 68px bottom:calc(16px+var(--s-b)); #collect-popup width 180px. Notch insets via --s-l/--s-r on every fixed element.

=== DESKTOP ENHANCEMENT (min-width:768px) ===
Top bar dissolves into spacious corners: #size-pill = v2-style top-left panel (value 34px, label restored), #timer top-center 26px pill WITH deciseconds, #score-pill top-right (#absorbed-inline 13px), #mute-button top:104px right:16px. Progress bar returns to bottom:22px center width min(46vw,420px), #tier-label above. Dash button 64px right:24px bottom:24px keeps the RING (the bar never returns — one gauge implementation + the @supports fallback). Donack avatar 80px, bubble max-width 360px, anchored left:16px bottom:96px (no joystick on desktop). Float layer bottom:46vh, cap 6.

OVERLAP RESOLUTION MATRIX (binding): top strip = stats only; mid-left = Donack; mid-center = toast/banner/floats (stacked: toast 74px, banner 30vh, floats 44vh-up); mid-right = collect popup; bottom-left 65%x55% = joystick exclusive; bottom-right = dash exclusive. No element may be authored outside its band. HUD hide/show on GOAL_CONTACT/GAME_START unchanged (#donack-root exempt by being outside #hud). Performance: pixel-ratio cap 1.5 + dynamic-resolution governor untouched; all new UI is DOM/CSS.

DEVICE GATE (binding, Stream D): viewport matrix 360/390/430 portrait + landscape in devtools PLUS at least one real iOS and one real Android pass before ship (safe-area env(), conic-gradient ring, webp rendering).

## 箱庭東京マップ

HAKONIWA TOKYO MAP (all data in src/config/cityMap.js, REAL METERS; sim = meters/worldScale; boot worldScale = 0.02/0.5 = 0.04 so sim = meters x25 at start). Axes: +X east, +Z south. ORIGIN = BALL START (binding — keeps BallPhysics.reset's hardcoded (0,r,0) correct; the shop is authored around the origin, shop center at (+1.6,-0.8)).

=== A. PARTS SHOP 「アキバパーツ館」 — START INTERIOR ===
Roofless dollhouse (hakoniwa fiction: you look into miniature buildings), single room, FULL-WIDTH open front, floor flush with street at h=0 (zero steps anywhere in the world: stranding/step/standSimY critique class structurally unrepresentable; shelf items are reached by 3D absorb overlap as the ball grows, never by climbing).
- Interior rect: x[-1.4,+4.6] x z[-4.8,+3.2] (6x8m). OPEN FRONT = east face x=+4.6, opening z[-3.6,+2.0] (5.6m clear; gate radius 2.8m). No door object exists. NO-SEAL: validator asserts cbrt(0.02^3 + 10*SigmaR^3_interior) < 0.5*2.8 (max in-shop achievable radius ~0.55m); gate monotonicity trivially satisfied with ONE gate that nothing can occlude.
- Ball start: (0, r, 0), facing +X toward the opening — straight +X from the origin is a clear exit lane (validator asserts ball-start clearance and the exit lane; the draft's start was inside a shelf footprint — fixed here).
- TERRAIN (world/terrain.js, the only authored collision besides map bounds + skytree base): walls (thickness 0.12m, yTop 2.2m, rounded ends): W1 x=-1.4 z[-4.8,3.2]; W2 z=-4.8 x[-1.4,4.6]; W3 z=+3.2 x[-1.4,4.6]; jambs W4 x=4.6 z[-4.8,-3.6], W5 x=4.6 z[2.0,3.2]. Prisms (solid boxes, circle-vs-AABB in XZ, footprint blocked at any height): P1 shelf row A x[-1.4,+0.1] z[-4.8,-1.6] h1.4 (abuts W/N walls); P2 shelf row B x[-1.4,+0.1] z[+0.8,+3.2] h1.4 (abuts W/S walls); P3 counter x[+1.2,+3.9] z[-4.8,-3.4] h0.95 (abuts N wall); P4 low table x[+2.0,+3.4] z[+0.4,+2.0] h0.4. Verified aisles: central band z[-1.6,+0.8] full width; P1<->P3 gap 1.1m; P2/P4 gap 1.9m; P4<->E wall 1.2m; P4<->S wall 1.2m; no pocket narrower than 1.1m exists (shelves abut walls). validateCityMap() prints the aisle table and asserts min 1.1m.
- TERRAIN RELEASE: at trueRadius >= SHOP_TERRAIN_RELEASE_M (4.0): collide() early-outs for shop pieces, terrainMesh zero-scales over 0.6s, AND curated lerps every still-alive elevated interior placement's py down to restY = r*(1+yOff) over the same 0.6s (items drop as shelves dissolve — no floaters). CuratedSpawner then activates the 「アキバパーツ館」 shop-shell EXTRA (r 4.0m, absorbable @ >=6.2m) at the shop center. One-shot, documented as the single sanctioned structural handoff; the camera boom clamp deactivates only AFTER the fade completes (?at=shop&r=3.8 dev test).
- CAMERA INDOORS (salvaged BLOCKER #1, three layers): (1) roofless — boom always has open sky; (2) interior profile: terrain.interiorAt01(x,z) crossfaded 0.5s scales CAM_DIST_K*0.62 (~4.0) and CAM_HEIGHT_K*1.4 (~4.5) — closer and more top-down; at r=0.02 boom is ~8cm in a >=1.1m aisle; by exit (r~0.3-0.5) the camera already looks over the 1.4m shelves; (3) terrain.clampCameraBoom(ballPos,desired,out): segment-vs-AABB over <=9 pieces, shortens boom to nearest hit minus CAM_WALL_MARGIN_K(0.5)*radiusSim; the existing critically-damped spring smooths the clamp. clampCameraBoom is a Phase-0 contract (Stream B implements, Stream A consumes). FOG: FOG_FAR_MIN_M=9.0 real-meter floor (environment.js at query time) so the 8m shop is never fog-swallowed at 2cm; paired with LOAD_RADIUS_MIN_M=11.25 (see spawnArchitecture) so fog<load holds everywhere.
- INTERIOR CONTENT (~240 placements from ~40 seeded cluster records; ALL ITEM HEIGHTS y<=0.7): floor bins of ネジ/抵抗/コンデンサ (clusters 14-20, objR 0.6-1.2cm) along aisles; ICチップ/LED/ボタン電池 on P4 low table (y0.4); 消しゴム/クリップ near the counter base; マウス/ゲームソフト/ジャンクHDD on shelf mid-levels y0.7 ONLY (honestly late-T1 content; reachable from r~0.33 by the 3D-reach rule); ダンボール箱/雑誌たば/丸イス on the floor for T1. Collectibles inside: ①金の招き猫 P4 low-table top y0.4; ②真空管 P4 low-table y0.4; ③レトロゲーム機 floor at shelf B south end; ④秋葉原フィギュア shelf A mid y0.7. Validator: every placement inside interior rect, none inside a prism footprint, per-placement 3D-reach inequality sqrt(dXZ^2+(y-r)^2) <= 1.45r+objR with dXZ>=r at intended tier radius, no-seal budget, growth budget (SigmaR^3 supports full-clear to r~0.30m).

=== B. AKIHABARA STREET & DISTRICT ===
- Chuo-dori strip: x[4.6,18] x z[-180,+180] (h=0, no curbs). Curated dressing (~70): 自販機 rows, 放置自転車 clusters, 看板/のぼり, ネコ/ハト/イヌ, 通行人 crowds thickening near the shop, 屋台 x2, ⑤ゲーミングPC collectible at (9,-38). PLUS the EXIT-BRIDGE GUTTER LINE (~22 placements): 空き缶/ペットボトル/チラシたば/軍手 (T0/T1-scale recipes) along the gutter, dense near the shop and thinning with distance — validator growth-chain assert: for exit radii r in {0.10,0.15,0.25,0.4}, >=8 placements with objR <= 0.65r within 150m (prints the table).
- Akiba blocks: x[18,260] x z[-260,+260] — chunk bands {2,3} + curated 雑居ビル fronts. ラジオ会館風ビル singleton at (120,60).

=== C. DISTRICTS & LANDMARK SINGLETONS (geo-faithful at ~1:5 compression; absorb threshold = dioramaR/0.65) ===
| Landmark | District | Pos (x,z) m | Real size | dioramaR m | collisionScale | Absorbable @ |
| ハチ公像 (DUAL landmark+collectible ⑪) | 渋谷 | (-1150,962) | 1.6m | 1.2 | 1.0 | 1.85m |
| 西郷さん像 | 上野 | (-80,-420) | 像3.7m+台座 | 4.0 | 1.0 | 6.2m |
| 雷門 | 浅草 | (350,-600) | 高11.7m・提灯700kg | 7.0 | 0.8 | 10.8m |
| ラジオ会館風ビル | 秋葉原 | (120,60) | 高46m | 24 | 0.9 | 37m |
| 渋谷109 | 渋谷 | (-1150,950) | 高約60m | 28 | 0.9 | 43m |
| スクランブル交差点 (decal+crowd x16) | 渋谷 | (-1180,990) | — | decal r18 flat | — | crowd T2-size |
| 東京ドーム | 水道橋 | (-550,-120) | 高56m・径216m | 55 | 0.9 | 85m |
| 東京駅丸の内駅舎 | 丸の内 | (-120,480) | 全長335m・高46m | 65 (modeled L180m) | 0.55 | 100m |
| 国会議事堂 | 永田町 | (-650,650) | 高65m・幅206m | 75 | 0.7 | 115m |
| レインボーブリッジ (3 spans) | 湾岸 | (300,1380)/(440,1430)/(580,1480) | 全長798m | 90 each | 0.5 | 138m |
| 東京タワー — PENULTIMATE | 芝公園 | (-480,1050) | 333m (1:1) | 170 | 0.45 | 262m |
| 東京スカイツリー — GOAL | 押上 | (900,-520) | 634m (1:1) | finale contact only | base collider r=90*0.6 | finale |
BINDING RESOLUTION (recorded): 東京タワー absorbed normally at ~262m; its GROWTH_K=10 jump (cbrt(262^3+10*170^3)~406m) IS the ramp into the finale band; スカイツリー is contact-finale only. SKYTREE VISIBILITY (BLOCKER 2 resolution): while worldScale < SKY_SILHOUETTE_WS_MAX (0.2), the Skytree renders as a SKY-DOME SILHOUETTE via environment.js's KEPT sky-element shader slot (uniforms renamed uGoalSil*, azimuth recomputed per frame from SKYTREE_POS — cheap); the goalTower.js mesh (2 draws, fog:false sky-element exemption) takes over with the proven v2 moon crossfade at the first frame simDist < 0.8*CAMERA_FAR(4000). It is the navigation anchor from frame one in BOTH representations. SKYTREE BASE COLLIDER (MAJOR 8): permanent circle-vs-ball XZ test in terrain.collide at SKYTREE_POS, radius SKYTREE_BASE_R_M*SKYTREE_COLLIDER_K (90*0.6=54m real), emits BOUNCE, never absorbs, never released; validator asserts SKYTREE_COLLIDER_K(0.6) < GOAL_CONTACT_PAD(0.85) so the finale always wins.
District chunk-filler zone masks: 上野公園 (-300..200,-650..-250) bands{3,4}; 浅草 (200..600,-750..-450) {3,4}; 丸の内/銀座 (-350..150,300..750) {4,5}; 永田町/霞が関 (-850..-450,500..850) {4,5}; 渋谷 (-1400..-950,800..1200) {3,4,5}; 水道橋 (-750..-350,-300..50) {4,5}; 湾岸 (100..900,1100..1600) {5,6}; general fill everywhere else inside bounds {4,5}; T6 band map-wide. Chunk density = DENSITY_K_V3 (0.45) of v2 per-band counts (the ONE pacing truth; see tiers).

=== D. DIORAMA BOUNDS & EDGE ===
Bounds rect x[-1800,+1800], z[-1800,+2000]; ball center hard-clamped. Edge: (1) physics — soft deceleration band 4*radiusSim inside the edge, outward velocity *= EDGE_DAMP_PER_FRAME(0.85) per 60Hz frame (continuous in radius, seamless); (2) cosmetics — SOUTH+EAST = Tokyo Bay: one water quad (fog-on Lambert 0x2a4a6e, y=-0.3) over x[-200,1800]xz[1500,2000] and x[1400,1800]xz[-400,2000] PLUS a quay-wall strip mesh (+2 draws total, counted honestly in the ledger); WEST+NORTH = 山の手 green rim strip; Backdrop ring gets the v3 profile pair (下町屋根並み <-> 富士山+湾岸シルエット) so the horizon reads 'more Tokyo, then Fuji'; (3) Donack edge hint (cooldown 30s).

=== E. PROGRESSION GATES & DEV STARTS ===
Single un-sealable interior gate -> open world; size-gating is purely the landmark threshold ladder (1.85->6.2->10.8->37->43->85->100->115->138->262m) + zone bands; no traversal gates after the shop, no soft-lock topology (flat open plane). Travel budget: tier-N content within reach of speed 8.5r/s (T2 within 300m, T3 within 800m, T4 within 1.5km, T5+ map-wide). DEV_STARTS exported: shop(0,0,r0.02)/street(30,0,r0.3)/ueno(-150,-400,r4)/marunouchi(-100,450,r40)/tower(-420,1000,r250)/goal(700,-400,r400); consumed by devTeleport (see interfaces).

## スポーンアーキテクチャ（キュレーション vs チャンク）

TWO SPAWNERS, ONE STORE, EXPLICIT OWNERSHIP (implements the salvaged-critique resolution verbatim, plus the v3 critique's banding/steal/reinject closures).

1. CHUNK SPAWNER (world/spawner.js, kept): deterministic machinery retained but ZONE-MASKED: in _spawnPlacement AFTER the 'deterministic draws complete' marker, `if (!cityMap.bandAllowedAt(xReal, zReal, band)) return true` — static pure lookup over ~20 axis-aligned zone rects in REAL METERS via the existing native->real bridge; chunk contents remain a pure function of (seed,cx,cz,band). Mask 0 inside the shop interior rect and outside map bounds. Per-band placement counts scaled by DENSITY_K_V3 (0.45). LOAD FLOOR: effective load radius = max(loadRadiusSim, LOAD_RADIUS_MIN_M/worldScale) in the ring math (mirrors the fog floor; fog<load invariant holds at all radii — tiers.js boot assert extended to check the floored pair at each tier's worst-case ws). Stride: ARCH_PER_TIER stays 10, tiers 6->7 -> codes 0..69 (v2 stride-audit playbook reruns, owned by Stream C; boot DEV-asserts length===70 in objects.js AND ball.js). DEV assert in reinject: archIdx >= 0 for everything that reaches it.

2. CURATED SPAWNER (NEW world/curated.js): owns ~370 placements (240 shop + 70 street + 22 gutter + ~38 district dressing) + 11 landmark singletons + 12 collectibles + shop shell; all static data in cityMap.js (REAL METERS, expanded at boot from cluster records via mulberry32(0x544f4b59) — seed-INDEPENDENT so landmarks/collectibles are identical across runs; only chunk filler varies with ?seed=). Allocates from the SAME ObjectStore/InstancedPools.

OWNERSHIP PROTOCOL (Phase-0 frozen):
- FLAG_CURATED = 16 (objects.js; flags Uint8: ALIVE 1 | FADING 2 | TOMB 4 | RARE 8 | CURATED 16). Chunk spawner's _onAbsorb, _subPixelSweep, _despawnIndex, leftover cleanup ALL skip flagged slots (one bit test); its _aliveCount counts only chunk-owned objects so ALIVE_TOTAL_BUDGET stays meaningful. DEV assert (every 300 frames in dev): spawner.aliveCount + curated.aliveCount === store.aliveCount, plus assert in _despawnIndex that no chunk-owned op ever frees a flagged slot.
- DYNAMIC RE-BANDING (BLOCKER 1 resolution, binding): every curated placement has a naturalBand (its tier-table band). On slot activation AND on every EVT.TIER_UP, curated re-stamps store.tierOf[slot] = clamp(naturalBand, tierIndex-1, tierIndex+1) for every alive curated slot, amortized inside the existing <=64/frame round-robin (<=640 slots; hashes already rebuild on tier change so re-banded slots enter the live banded hashes for free). Guarantees: a T1 ball gets pushback from 雷門 (clamped down into the window); a T5 ball can still absorb ハチ公 (clamped up). DEV assert in curated.update: every alive curated slot's band is inside the live window.
- SUBSCRIPTION ORDER (frozen in events.js header): chunk spawner -> curated -> main attach (render/ball) -> runStats -> collection -> sfx/effects/hud. Curated keeps FLAG_RARE/identity valid THROUGH its ABSORB handler and defers slot bookkeeping to its next update() tick (race fix).
- SLOT-STEAL CONVENTION (MINOR 16, copied from v2): render/ball's attach handler sets store.instanceSlot[i] = -1 when it steals the world instance to animate the fly-on (it runs AFTER curated in the frozen order). Therefore curated's ABSORB handler MUST NOT read instanceSlot — only its consumed bitmask. Curated's deferred cleanup frees a render-pool slot only when instanceSlot >= 0 at cleanup time. Rotating DEV assert: for one EXTRA pool per frame, chunk-observed alloc + curated-observed alloc + ball-stuck count === pool.alive.
- KNOCK-OFF (MAJOR 4): render/ball.knockOff SKIPS stuck entries with archetype code >= 70 (EXTRA landmarks/collectibles are permanently stuck; credit granted at absorb). Curated placements using chunk codes (<70) reinject via the existing chunk path, stripping FLAG_CURATED|FLAG_RARE (credit at first absorb, no double count).

ACTIVATION: curated.update(ballPos,tierIndex,ballRadiusSim,dt) round-robins <=64 placements/frame: activate when inside max(loadRadius, LOAD_RADIUS_MIN_M/ws) AND objDiameter >= SUBPIXEL_RATIO*ballR; deactivate (consume=false, scale-fade) when outside ring OR sub-pixel. EXCEPTION (precise semantics, MAJOR 7): collectibles and not-yet-absorbable landmarks ARE ring-deactivated when far away (identity preserved by the consumed bitmask; they reactivate on approach) — only SIZE-based despawn is forbidden for them. So 'never lost' without 'always alive'.
LANDMARK SINGLETONS: placements with landmarkId; on absorb curated emits EVT.LANDMARK after the normal ABSORB chain. DUAL-TAGGED objects (ハチ公: landmarkId + collectibleId) emit EVT.COLLECT FIRST then EVT.LANDMARK in the same frame (composition rule; donack/sfx special-case it). The Skytree is NOT a store object — render/goalTower.js (finale-owned, contact-tested by finale; terrain owns its base collider).
RENDER POOLS (MAJOR 7 resolution — the lever IS the design): EXTRA archetypes render from 4 SHARED InstancedPools by size class: collectible-small (cap 12), landmark-mid (cap 4: ハチ公/西郷/雷門/ラジオ会館), landmark-large (cap 4: 109/ドーム/東京駅/議事堂), landmark-XL (cap 4: 橋スパン/タワー/shop shell), per-instance color, visible=false when empty. Worst case flat +4 draws. DRAW-CALL LEDGER v3 (honest worst, 4-band window): 40 world + 8 stuck + 6 fixed + 1 backdrop + 2 skytree + 1 terrainMesh + 2 water+quay + 4 extra = 64; DRAW_CALL_CAP = 72.
RESCALE/REBASE: curated copies the chunk spawner's origin/scaleExp handler verbatim; goalTower keeps {simX,simZ,radius} with its own RESCALE(*=S)/REBASE(-=sx,sz) subscriptions like finale._simCache; terrain likewise.

## ティア表（2cm→634m）

TIER TABLE v3 (7 tiers; START_RADIUS_M=0.02; x5 rescale ladder unchanged — rescales at true r = 0.1/0.5/2.5/12.5/62.5/312.5; TIERS.length assert 6->7; all per-tier sky arrays get a 7th entry; bgm layer map re-keyed). ONE PACING TRUTH (MAJOR 5 resolution, binding — the draft's 6-min dwell table and RANK_S_S=150 are DELETED): GROWTH_K=10 physics kept; pacing comes from authored density (chunk DENSITY_K_V3=0.45 of v2 per-band counts) + finite-map travel legs. Targets: per-tier dwell+travel ~45-55s; TYPICAL FIRST CLEAR 5:30-6:30 (owner's 5-8min band); OPTIMAL ~3:30-4:00 sim-s. Stream B/C author densities against THESE numbers; Phase-3 >=3-playthrough retune is verification only.
| T | name | enterTrueRadius | content (8 absorbables + 2 chunk landmarks, all with displayNameJa) | dwell+travel target |
| 0 | パーツ棚 Parts Bin | 0.02m | ネジ, 抵抗, コンデンサ, ICチップ, LED, ボタン電池, 消しゴム, クリップ + ジャンク基板, はんだごて | ~45s (shop floor/low table) |
| 1 | ショップ Shop Floor | 0.10m | マウス, ゲームソフト, ジャンクHDD, スピーカー, 工具箱, 雑誌たば, 丸イス, ダンボール箱 + パーツ棚ラック, アーケード筐体 | ~40s (floor + shelf-mid y0.7; full shop clear -> r~0.30) |
| 2 | 電気街 Electric Town | 0.50m | 自転車, 通行人, 看板, 自販機, ネコ, ハト, のぼり, ゴミ箱 + 電柱(cs .45), 屋台 | ~45s (gutter line bridges 0.1-0.5 exits) |
| 3 | 下町 Downtown | 2.5m | 車, タクシー, バス, トラック, 街路樹, 売店, 町家, 鳥居 + 歩道橋(.5), 銭湯の煙突(.35) | ~45s |
| 4 | 都心 City Core | 12m | 雑居ビル, マンション, コンビニ, 立体駐車場, 電車車両, ガスタンク, クレーン, 神社 + 首都高ジャンクション(.6), 観覧車 | ~50s |
| 5 | 大東京 Metropolis | 60m | 超高層ビル, タワーマンション, ホテル, デパート, 高架橋, スタジアム, 操車場, 客船 + 丘陵(.85), 湾岸コンビナート | ~55s |
| 6 | スカイライン Skyline | 300m | 街区ブロック, 公園, 埠頭, ビル群, 川面ブロック, 競技場, 森, 雲 + 大丘陵, 環状線リング | ~35s + finale |
GOAL FLOW: 東京タワー absorbable ~262m (late T5); GROWTH_K=10 jump -> ~406m -> GOAL_CALL_RADIUS_M 380 fires (「スカイツリーが呼んでいる…！」 + skytree beam pulse) -> GOAL_RADIUS_M 420 arms contact (a couple of T6 blocks if the tower jump was skipped) -> roll to Skytree -> contact -> finale.
V2 CONTENT DISPOSITION: all 60 v2 archetypes REPLACED by the 70 Tokyo ids (geometry recipes reused where shapes match: bicycle->自転車, person->通行人, car->車, skyscraper->超高層ビル, mountain->丘陵, torii->鳥居 — Stream C maps old recipe code to new ids); v2 moon finale machinery RE-THEMED not deleted (states: called/approach/contact/merge/ascension/afterglow; descent removed — goal fixed in world; night-fade, cinematic camera, skip, flash, result staging kept verbatim); the sky-element shader slot is KEPT and re-textured as the Skytree silhouette (BLOCKER 2) with the v2 sky->mesh crossfade reused; sky-dome moon disc stays as night cosmetic (uMoonFade always 1); dash/timer/score/combo/rank/X-post kept with retuned constants; LS keys bump to v3 (v2 bests retired; the COLLECTION key follows the frozen-id append rule instead — see feedback).

## フィードバック（巻き込み名/レアコレクション/Xポスト）

ABSORB-NAME DISPLAY: every archetype (70 chunk + 24 EXTRA) gets displayNameJa in catalog.js; DISPLAY_NAME_BY_CODE frozen table exported (boot assert length 94). AbsorbEvent += {archetypeCode, collectibleId(-1)} stamped by absorb.js BEFORE store.free, next to the existing rare stamp; ScoreEvent += {archetypeCode} (runStats copies). hud.js renders floats as `+${delta} ${name}` with BURST MERGING: per-archetype window FLOAT_MERGE_S=0.30 — a repeat absorb of the same code rewrites the live span to `+${sum} ネジ x3` and restarts its animation (textContent write, no new span); visible cap 3 mobile / 6 desktop from the existing 8-span pool; rare/collectible/landmark floats always allocate (evict oldest). Landmark absorbs additionally fire the center treatment: EVT.LANDMARK -> hud toast 「「雷門」まきこんだ！」, effects gold ring burst, sfx fanfare sting, Donack trivia (P3).

RARE COLLECTION (12 collectibles, FLAG_RARE|FLAG_CURATED, gold tint + existing sparkle provider): ①金の招き猫(ショップ低テーブル y0.4) ②真空管(ショップ低テーブル y0.4) ③レトロゲーム機(ショップ床・棚B脇) ④秋葉原フィギュア(棚A中段 y0.7) ⑤ゲーミングPC(アキバ路地 9,-38) ⑥特上大トロ(東京駅前寿司屋台 -100,460) ⑦だるま(上野みやげ屋 -120,-380) ⑧パンダのぬいぐるみ(上野動物園前 -260,-470) ⑨雷おこし(雷門わき 360,-585) ⑩金色のオブジェ(浅草リバーサイド 430,-560) ⑪ハチ公像(渋谷 -1150,962 — DUAL landmark+collectible) ⑫屋形船(レインボーブリッジ下 380,1340). FROZEN ID ENUM (MINOR 14, binding): cityMap exports COLLECTIBLE_IDS with EXPLICIT integer ids 0..11 (not array order); future patches append ids 12+ and bump the displayed total only; ids never reused/reordered; boot assert ids unique and < 31.
On absorb: collection.js (NEW, subscribes ABSORB after runStats per frozen order) matches via AbsorbEvent.collectibleId -> emits EVT.COLLECT {collectibleId,nameJa,isNew,found,total:12} -> #collect-popup card slides in (THUMBNAILS: all 12 archetypes pre-rendered ONCE during the title screen into 96px data-URL canvases via a throwaway scene on the main renderer — boot-time allocation, disposed after; popup and album use <img src=dataURL>) + name + 「コレクション 5/12」; RARE_SCORE_BONUS applies. DUAL-TAG RULE (MINOR 13): ハチ公 emits COLLECT first then LANDMARK same frame; sfx plays the landmark fanfare ONLY (one boolean suppresses the collect gliss when both fire within one frame); Donack shows the single merged line #42; the collect-popup card still shows (opposite screen side from the toast). PERSISTENCE: LS_COLLECTION_KEY 'fableKatamari.v3.collection' = {v:1, mask:int} bitmask keyed by FROZEN ids, ORed on collect, try/catch + shape-validated like runStats._loadBest, unknown high bits preserved (forward compat). Chunk-spawner random rares KEPT as score-only sparkles (not collection). Mobile boot-latency lever (pre-agreed): if title-tap-to-play exceeds budget on low-end Android, thumbnails lazy-render at first COLLECT instead — one call-site move.

RESULT SCREEN (screens.js + index.html): #collection-grid between rank stamp and buttons — 4x3 grid of 56px cells (48px <=360w): found = thumbnail+name(9px), unfound = dark 「？」cell; header 「コレクション <span id=result-collect-n>5</span>/12」; reveal cue at 1.9s in the staged sequence; NEW badge on cells collected this run.

X POST (extends the CURRENT working intent implementation — twitter.com/intent/tweet?text&url&hashtags, synchronous window.open(url,'_blank') || location.href=url, URL prebuilt at EVT.GOAL cache time; mechanism untouched): text template (~150 weighted chars):
`🗼FABLE KATAMARI 東京を転がした！\n⏱${mm}:${ss}.${d}／RANK ${rank}／⭐${score.toLocaleString('ja-JP')}\n🏯レア${found}/12コレクション\n#FableKatamari` + url=https://fable-katamari.pages.dev via the existing separate url=/hashtags= params. GoalEvent += {collectFound} (runStats reads collection.foundCount at GOAL emit).

## ドナック実況

DONACK COMMENTATOR (ui/donack.js + config/donackLines.js + scripts/verify-donack-assets.sh).

ASSETS (documented exemption #2 to the zero-external-asset law — own first-party character asset; RECONCILED WITH SHIPPED REALITY, MAJOR 10): public/assets/donack/ already contains 24 webp frames (120x90, ~2.5KB each, official palette: feathers #F7F5EF, cap/scarf #65B83E shadow #1F6B2C, vest #202326, beak/feet #F3A51C, mint #55E8B0). KEEP exactly 8: {idle,happy,thinking,speaking}-{0,3}.webp (~20KB total); DELETE the other 16. NO sprite sheet, NO pngquant/sips pipeline. scripts/verify-donack-assets.sh (replaces build-donack-sprites.sh): asserts the 8 files exist, total size <= DONACK_ASSET_BUDGET_KB (40), and no stray files in the directory; runs in CI/predeploy. Rendering: #donack-avatar is a 56px (desktop 80px) div with image-rendering:pixelated; 8 CSS classes .dk-idle-0 ... .dk-speaking-3 each set background-image to one webp (all 8 preloaded via <link rel=preload as=image> in index.html); expression = class swap; blink = toggling frame-0/frame-3 class at DONACK_BLINK_FPS(4) via a JS interval that runs ONLY while the bubble is visible (no rAF cost idle).

UI: #donack-root = avatar + #donack-bubble (left-tail speech bubble, rgba(10,12,22,.78) bg, 1px #65B83E44 border, 13px). DIRECT CHILD OF body, OUTSIDE #hud (binding — survives the GOAL_CONTACT hud-hide for the scripted ascension line). Hidden by default; on comment: slide-in 0.25s, auto-dismiss DONACK_SHOW_S 4.5s (landmarks/finale 6s), slide-out. Placement per mobileUi band matrix (mid-left; never over joystick/dash/score). TOGGLE: title-screen pill 「ドナック実況 ON/OFF」 (#donack-toggle), persisted LS_DONACK_KEY 'fableKatamari.v3.donackOff'; when off donack.js drops everything.

PHASE GATING (MINOR 17, binding): internal phase in {title, play, cinematic, result} driven by GAME_START('play'), GOAL_CONTACT('cinematic'), GAME_WIN('result'), GAME_RESET('title' + hard-reset ALL timers/queue/dedupe-per-run state). P0/P1/P2 emit only in 'play'; the [ascension] line is the ONLY 'cinematic' emitter; [GAME_WIN/result] the only 'result' emitter. Stream E's event-storm test includes the bubble-visible-across-GOAL_CONTACT case.

TRIGGER / PRIORITY / COOLDOWN: P3 landmark+finale (always shows, interrupts current bubble), P2 collectible/tier-up, P1 first-absorb-per-category/combo>=15/knock-off/edge, P0 idle-stuck tips. Min gap since last bubble: P0/P1 8s, P2 4s, P3 0. Queue-of-1: one pending slot holding the highest-priority candidate; equal/lower incoming discarded. Dedupe: each line id once per run except tips (30s per-id cooldown). DUAL-TAG SPECIAL CASE: when COLLECT and LANDMARK for the same object arrive in one frame, only merged line #42 fires (P3). Expression map: landmark trivia/finale->speaking, collectible/tier-up/combo->happy, tips/idle/edge->thinking, default->idle. Subscribes: LANDMARK, COLLECT, TIER_UP, SCORE(combo), KNOCK_OFF, BOUNCE(repeat-bonk counter), DASH_READY(unused-gauge timer), GOAL_CALL, GOAL_CONTACT, GAME_WIN, GAME_START, GAME_RESET + 1Hz internal idle/edge check fed by GrowEvent (gated to 'play'). Zero per-frame alloc: static strings, textContent writes on trigger only.

COMMENT TABLE (config/donackLines.js — 42 lines, frozen ids; persona: bright observant dev-partner duck, 1-2 sentences, no forced tics):
[GAME_START] 「アキバのパーツ屋からスタート！まずはネジと抵抗からね」
[TIER_UP T1] 「棚エリア卒業！つぎはお店の床を片づけよ」
[TIER_UP T2] 「お店の外へ！電気街が待ってるよ」
[TIER_UP T3] 「車もイケる大きさになった！下町へ転がろう」
[TIER_UP T4] 「ビルが食べごろに見えてきた…感覚バグってきたね」
[TIER_UP T5] 「もう東京の主役だよ。ランドマーク総ナメだ！」
[TIER_UP T6] 「ここまで来たら、あとは…あの塔だけ！」
[first ネジ系] 「ネジ1本からの東京制覇、はじまりはじまり〜」
[first 生き物] 「ネコさんごめんね！あとで返す…かも」
[first 通行人] 「人も巻き込むのがカタマリの様式美だよ」
[first 車] 「車いっちゃった！もう立派な災害だね」
[first ビル] 「ビル！？スケール感どうなってるの！最高！」
[combo>=15] 「コンボすごい！その調子その調子！」
[knock-off] 「あっ剥がれた！デカいのに突っ込むと落ちるよ」
[repeat-bonk x3/min] 「跳ね返されたら格上サイン。まわりから育てて再挑戦！」
[idle 10s no absorb] 「デカいのはまだ無理。小さいのからコツコツ行こ！」
[dash full 12s unused] 「ダッシュ満タンだよ。広い道でドーンと使お！」
[map edge] 「そっちは海！Uターン推奨〜」
[LANDMARK 西郷さん像] 「西郷さんが連れてる犬、名前は『ツン』っていうんだよ」
[LANDMARK 雷門] 「雷門の大提灯、重さ約700kgあるんだよ。いい重りだね」
[LANDMARK ラジオ会館風ビル] 「アキバのシンボル確保！ここはジャンクと電子部品の聖地なんだ」
[LANDMARK 渋谷109] 「109は『トーキュー』って読むんだよ。まるごと回収！」
[LANDMARK スクランブル交差点] 「この交差点、1回の青信号で約3000人が渡るんだって」
[LANDMARK 東京ドーム] 「やった、これで何でも『東京ドーム1個分』で説明できるね」
[LANDMARK 東京駅] 「赤レンガの丸の内駅舎は1914年完成。100年選手だよ」
[LANDMARK 国会議事堂] 「議事堂は完成まで17年かかったんだ。巻き込むのは一瞬！」
[LANDMARK レインボーブリッジ] 「レインボーブリッジ、実は歩いて渡れるって知ってた？」
[LANDMARK 東京タワー] 「333mの東京タワー！エッフェル塔より高いんだよ。…ついに巻いちゃったね」
[GOAL_CALL] 「634m…ムサシ！スカイツリーが呼んでる、行こう！」
[COLLECT 初回汎用] 「それコレクションだ！アルバムに記録したよ」
[COLLECT 金の招き猫] 「金の招き猫！商売繁盛まちがいなしだね」
[COLLECT 真空管] 「真空管だ！いまや超貴重品だよ、それ」
[COLLECT レトロゲーム機] 「レトロゲーム機！…まだ動くかな。動くといいな」
[COLLECT ゲーミングPC] 「光るPCだ！アキバの戦利品って感じ」
[COLLECT 特上大トロ] 「大トロ！転がす前にひと口…はダメだよね」
[COLLECT だるま] 「だるまゲット！願いごとは『全部巻き込む』で決まりだね」
[COLLECT パンダのぬいぐるみ] 「上野といえばパンダ！ふわふわ確保〜」
[COLLECT 雷おこし] 「雷おこし！浅草みやげの定番だよ」
[COLLECT 屋形船] 「屋形船ゲット！東京湾の夜景つき」
[DUAL ハチ公 #42] 「ハチ公ゲット！約10年ご主人を待った忠犬だよ。アルバムに記録！」
[GOAL_CONTACT] 「やった────！東京まるごと、いただき！」
[ascension (cinematic)] 「見て、東京の夜景…きれいだね」
[GAME_WIN/result] 「おつかれさま！記録、Xで自慢しちゃお」

## ファイル変更一覧

| パス | 種別 | 変更内容 |
|---|---|---|
| `src/types.js` | modify | PHASE 0. AbsorbEvent += {archetypeCode:number, collectibleId:number(-1)}; ScoreEvent += {archetypeCode}; GoalEvent += {collectFound}; 7-tier note; new typedefs LandmarkEvent{landmarkId,nameJa,sizeReal}, CollectEvent{collectibleId,nameJa,isNew,found,total}, GoalCallEvent/GoalGuideEvent/GoalContactEvent (renamed moon* shapes, old names kept as @deprecated typedef aliases), CuratedPlacement{naturalBand,...}, LandmarkDef, CollectibleDef{id frozen}, ZoneRect, TerrainWall/TerrainPrism. |
| `src/core/events.js` | modify | PHASE 0. Add EVT.GOAL_CALL/GOAL_GUIDE/GOAL_CONTACT + DEPRECATED ALIASES EVT.MOON_CALL=EVT.GOAL_CALL etc. (same string values — v2 subscribers keep working unmodified; integrator deletes the alias block last, gated by `grep -rn 'MOON_' src` == 0); add EVT.LANDMARK('landmark'), EVT.COLLECT('collect') + pooled PAYLOADS; header contract: frozen ABSORB subscription order = chunk spawner -> curated -> main attach -> runStats -> collection -> sfx/effects/hud. |
| `src/config/tuning.js` | modify | PHASE 0. START_RADIUS_M 0.05->0.02; add GOAL_* constants AND keep @deprecated re-exports MOON_GOAL_RADIUS_M=GOAL_RADIUS_M, MOON_RADIUS_K, MOON_DESCENT_S, MOON_LAND_DIST_K, MOON_LAND_VEL_FRAC, MOON_SCORE_BONUS=GOAL_SCORE_BONUS (deleted only in the integrator's final pass); add all v3 constants per tuning section (incl. LOAD_RADIUS_MIN_M, SKYTREE_COLLIDER_K, SKY_SILHOUETTE_WS_MAX, DENSITY_K_V3, rank S240/A330/B450/C600); DRAW_CALL_CAP 60->72 with the 64-worst ledger comment; LS keys v3. |
| `src/config/tiers.js` | modify | PHASE 0. 7 Tokyo tiers (70 frozen ids per tier table); asserts 6->7 and 60->70; sky arrays 7 entries (T6 dusk-violet); moonAngSize kept as night cosmetic (strictly-increasing assert relaxed to non-decreasing); fog/load boot assert EXTENDED to the floored pair: max(FOG_FAR_K*r, FOG_FAR_MIN_M/ws) < max(loadRadius, LOAD_RADIUS_MIN_M/ws) - cell at each tier's worst-case ws. |
| `index.html` | modify | PHASE 0. Mobile-first CSS rewrite per mobileUi spec (top bar, dash ring with @property --gauge registration + .12s transition + @supports plain-bar fallback, safe-area vars, landscape toast anchor, breakpoints); new DOM: #top-bar, #absorbed-inline, #donack-root(#donack-avatar/#donack-bubble) as DIRECT body child outside #hud, #collect-popup, #collection-grid in #win-overlay, #result-collect-n, #donack-toggle, #goal-arrow (renamed); 8 donack webp preload links; .dk-* expression classes; delete #dash-gauge markup; title copy 「転がして、東京まるごと。」. |
| `src/main.js` | modify | INTEGRATOR ONLY. Construct CityTerrain/CuratedSpawner/Collection/Donack/SkytreeView (replacing MoonView); frame order: terrain.collide inside fixed-step after ballPhys.step; curated.update after spawner.update (same gate); cameraRig injection {clampBoom, interior01}; subscription-order block updated; resetWorld += curated.reset/collection.resetRun; boot thumbnail pre-render during title; devTeleport(name) (~15 lines, SPECCED): snap worldScale=0.04*5^k (k minimal s.t. r/ws in [0.5,2.5)), set ball pos/radiusSim from DEV_STARTS, spawner.onTeleport(), curated.forceScan(), terrain release re-eval, one forced maybeRebase; final pass deletes the MOON_ alias block (grep gate). |
| `src/config/cityMap.js` | new | STREAM B. The hakoniwa data file, ORIGIN = BALL START: shop terrain (walls W1-W5, prisms P1-P4 in ball-origin coords per map section), ~40 cluster records -> ~240 interior placements (y<=0.7 cap), street/gutter/district placements (~130), zone rects + band masks, 11 landmark defs (pos/dioramaR/collisionScale/naturalBand/realSize trivia), COLLECTIBLE_IDS frozen enum 0..11 + 12 collectible defs, SKYTREE_POS, MAP_BOUNDS, DEV_STARTS, bandAllowedAt(); validateCityMap(): no-seal budget, ball-start + exit-lane clearance, aisle table >=1.1m, per-placement 3D-reach inequality, growth budget (shop full-clear ~0.30m), street growth-chain table (exit r 0.10/0.15/0.25/0.4 -> >=8 absorbables within 150m), landmark threshold ladder print, SKYTREE_COLLIDER_K < GOAL_CONTACT_PAD assert, collectible ids unique <31. |
| `src/world/terrain.js` | new | STREAM B. CityTerrain: shop walls/prisms circle-vs-AABB collide(state) (BOUNCE w/ 0.25s cooldown) + PERMANENT Skytree base circle collider (r = SKYTREE_BASE_R_M*0.6, never released, after the shop block); map-bounds hard clamp + 4r soft edge damping; interiorAt01(); clampCameraBoom(); flightWallTest() (pre-release only); SHOP_TERRAIN_RELEASE_M deactivation + terrainMesh 0.6s zero-scale (camera clamp deactivates only AFTER fade completes); RESCALE/REBASE handlers copied from spawner pattern; terrainMesh one merged vertex-colored mesh (+1 draw). |
| `src/world/curated.js` | new | STREAM B. CuratedSpawner per spawnArchitecture: FLAG_CURATED allocation from shared store; DYNAMIC RE-BANDING (re-stamp tierOf=clamp(naturalBand,tier-1,tier+1) on activation + TIER_UP, amortized in the 64/frame round-robin, DEV assert in-window); activation vs max(loadRadius, LOAD_RADIUS_MIN_M/ws); ring-deactivate allowed for collectibles/landmarks (consume=false, consumed-bitmask identity), size-despawn forbidden for them; own consumed bitmask + deferred ABSORB bookkeeping (frees pool slot only if instanceSlot>=0 — slot-steal convention; never reads instanceSlot in the handler); EVT.COLLECT-before-EVT.LANDMARK dual-tag order; landmark EVT.LANDMARK emission; release-time elevated-placement y-drop lerp (0.6s); shop-shell handoff; collectibleIdFor(idx); forEachAliveCollectible; forceScan(); reset(); RESCALE/REBASE verbatim copy. |
| `src/world/spawner.js` | modify | STREAM B. Zone-mask skip after the deterministic-draw marker (cityMap.bandAllowedAt, real-meter bridge); DENSITY_K_V3 per-band count scale; LOAD_RADIUS_MIN_M floor in ring math; FLAG_CURATED skips in _onAbsorb/_subPixelSweep/_despawnIndex/cleanup + DEV assert no chunk op frees a flagged slot; stat arrays 60->70; reinject strips FLAG_CURATED + DEV assert archIdx>=0. |
| `src/world/objects.js` | modify | STREAM C. export FLAG_CURATED=16; ARCHETYPE_ID_BY_CODE 60->70 + EXTRA section codes 70..93 (11 landmarks, 12 collectibles, shop shell); boot asserts updated (length 70 chunk / 94 total). |
| `src/config/catalog.js` | modify | STREAM C (largest package). Full Tokyo rewrite: 70 chunk archetypes (recipes reused/renamed from v2 where shapes match) + 24 EXTRA curated archetypes (landmarks incl. 雷門/西郷像/109/東京駅/議事堂/ドーム/タワー, 12 collectibles, shop shell); every entry displayNameJa + naturalBand; export DISPLAY_NAME_BY_CODE (string[94]) + EXTRA_CATALOG + size-class pool assignment; tri-cap 350 held (Tokyo Tower lattice via thin boxes like the v2 skytree recipe). |
| `src/render/ball.js` | modify | STREAM C. Code table 60->70 (+extras fold to proxy families via code % ARCH_PER_TIER); cross-check assert vs objects.js; knockOff SKIPS stuck entries with archetype code >= 70 (EXTRA permanently stuck — MAJOR 4); attach handler keeps setting store.instanceSlot=-1 on steal (now load-bearing for curated's deferred cleanup — documented). |
| `src/physics/absorb.js` | modify | STREAM C. Stamp AbsorbEvent.archetypeCode and collectibleId (via injected curated.collectibleIdFor) BEFORE store.free, next to the existing rare stamp. |
| `src/physics/ballPhysics.js` | modify | STREAM B (2-line scope, documented overlap exception like v2's WIN_RADIUS_M note): call injected terrain.collide(state) after XZ integration (param default-null so Phase 0 boots); reset() UNTOUCHED — origin=ball-start makes (0,r,0) correct. |
| `src/game/finale.js` | modify | STREAM A. Re-theme: states idle->called(380m)->approach(guide arrow to fixed Skytree, gameplay live)->contact(d <= ballR + towerR*GOAL_CONTACT_PAD)->merge(glow flash, ball lerp)->ascension(night fade + camera pullback over the diorama — v2 machinery verbatim)->afterglow->done; descent math deleted; _simCache {towerX,towerZ,towerR,mergeFrom*,ascendBaseY} with RESCALE/REBASE; skipCinematic kept; emits GOAL_CALL/GOAL_GUIDE/GOAL_CONTACT; consumes SkytreeView.getPosSim/radiusSim; deletes its MOON_ alias imports as it lands. |
| `src/render/goalTower.js` | new | STREAM A. SkytreeView: 634m tapered lattice + 2 observation decks (~1400 tris documented exception), fog:false sky-element exemption, 2 draws; MESH ACTIVE only when simDist < 0.8*CAMERA_FAR (worldScale >= ~0.2) — below that the environment.js sky silhouette represents it, crossfade reusing the v2 moon handoff (BLOCKER 2); setGlow01/beam pulse for called state; getPosSim/radiusSim; own RESCALE/REBASE subscriptions. |
| `src/render/moon.js` | modify | STREAM A. DELETED at the END of Stream A's work (mesh role -> goalTower.js; sky-disc role -> environment.js silhouette slot; night moon cosmetic stays in environment.js sky dome). Stays in-tree untouched until Stream A lands so the aliased Phase-0 build keeps booting. |
| `src/render/cameraRig.js` | modify | STREAM A. Interior profile: dist/height multipliers crossfaded by injected interior01 (0.5s damp, radius-continuous); boom clamp via injected clampCameraBoom before the position spring target; cinematic API unchanged. |
| `src/render/environment.js` | modify | STREAM A. 7 palettes (+env-local NIGHT); FOG_FAR_MIN_M floor at query time; bay water quad + quay strip (+2 draws, fog-on); sky-element shader slot KEPT and re-textured as Skytree silhouette (uniforms RENAMED uMoon*->uGoalSil*, azimuth from SKYTREE_POS per frame, active worldScale<0.2, v2 crossfade to mesh — NOT removed); night moon disc kept (uMoonFade always 1); getMoonDirWorld kept. |
| `src/render/effects.js` | modify | STREAM A. Landmark gold ring burst on EVT.LANDMARK; sparkle provider fed by curated.forEachAliveCollectible + chunk rares; ascension burst kept. |
| `src/render/backdrop.js` | modify | STREAM E. Profile pair re-themed: 下町屋根並み <-> 富士山+湾岸スカイライン; crossfade keyed to T3. |
| `src/game/runStats.js` | modify | STREAM D. ScoreEvent.archetypeCode pass-through; GoalEvent.collectFound (injected collection); rank constants S240/A330/B450/C600 + time bonus 240/600 (EMPIRICAL flag); LANDMARK_SCORE_BONUS on EVT.LANDMARK; LS_BEST_KEY v3; deletes its MOON_ alias consumers. |
| `src/game/collection.js` | new | STREAM D. Collection album: ABSORB(collectibleId>=0) -> EVT.COLLECT; localStorage {v:1,mask} keyed by FROZEN COLLECTIBLE_IDS (shape-validated, unknown high bits preserved, ids-never-reordered rule in header comment); foundCount/foundThisRun; prerenderThumbnails (12 archetypes -> 96px data-URLs via throwaway title-screen pass, disposed; lazy-at-first-COLLECT lever documented); resetRun(). |
| `src/ui/hud.js` | modify | STREAM D. Absorb-name floats + per-code 0.30s merge + cap 3/6; mobile timer format m:ss (<768px; deciseconds desktop only; cap 99:59); dash ring --gauge writes (10Hz, snap on DASH, flash on DASH_READY); #absorbed-inline; collect-popup driver (EVT.COLLECT) + toast 58vw cap while popup visible; goal-arrow rename + exclusion zones; deletes its EVT.MOON_* alias subscriptions. |
| `src/ui/screens.js` | modify | STREAM D. Result collection grid (4x3, thumbnails, 「？」 cells, NEW badge, reveal 1.9s); X intent text v3 (rank/score/レアn/12 — same prebuilt-URL + window.open mechanism, untouched); #donack-toggle wiring; title best line v3 key; deletes its MOON_ alias consumers. |
| `src/ui/donack.js` | new | STREAM E. Donack controller: 8-class webp avatar (expression class swap, frame-0/3 blink at 4fps only while visible), bubble show/dismiss, priority+cooldown+queue-of-1, per-id dedupe, PHASE GATING {title,play,cinematic,result} with hard reset on GAME_RESET, dual-tag merged-line special case, event subscriptions, LS_DONACK_KEY toggle, zero per-frame alloc. |
| `src/config/donackLines.js` | new | STREAM E. The 42-line frozen copy table (line id -> {text, priority, expression, once, phase}) per the donack section, incl. dual-tag line #42. |
| `scripts/verify-donack-assets.sh` | new | STREAM E. Replaces the draft's build-donack-sprites.sh: asserts public/assets/donack/ contains exactly {idle,happy,thinking,speaking}-{0,3}.webp, total <= 40KB, no strays; exits non-zero otherwise; wired into predeploy. No pngquant/sips dependency. |
| `public/assets/donack/` | modify | STREAM E. KEEP idle-0/idle-3/happy-0/happy-3/thinking-0/thinking-3/speaking-0/speaking-3.webp (~20KB total, official palette, already shipped); DELETE the other 16 frames. These 8 files are the only binary assets in the deploy (documented first-party exemption). |
| `src/audio/sfx.js` | modify | STREAM E. Landmark fanfare sting (EVT.LANDMARK), collect 5-note gliss (EVT.COLLECT) with same-frame suppression boolean when LANDMARK also fired (dual-tag rule), goal-call pad rename; node budget unchanged. |
| `src/audio/bgm.js` | modify | STREAM E. Layer-unlock map re-keyed to 7 tiers (L1 t>=2, L2 t>=3, L3 t>=5); GOAL_CONTACT duck rename (alias consumer deleted); otherwise untouched. |
| `src/world/scaleManager.js` | modify | PHASE 0 (documented cross-stream exception #1): grow-exit reads GOAL_RADIUS_M (via the alias until final pass); no other changes — _rebuildHashes untouched (dynamic re-banding lives in curated). |
| `docs/DESIGN-V3.md` | new | INTEGRATOR. This delta doc: full map spec, ownership protocol incl. dynamic re-banding + slot-steal convention, ONE pacing truth, exemptions ledger (8 donack webp, skytree fog:false + silhouette slot, boot thumbnail render, terrain-release one-shot), draw-call ledger 64/72, MOON_ alias retirement plan + grep gate, collection frozen-id rule, reset-ownership table v3. |

## インターフェース

```js
// ===== events.js (PHASE 0, frozen) =====
EVT.GOAL_CALL    'goalCall'    {trueRadius}
EVT.GOAL_GUIDE   'goalGuide'   {x01,y01,onScreen,active}            // 10Hz during approach -> #goal-arrow
EVT.GOAL_CONTACT 'goalContact' {}                                   // run end
EVT.MOON_CALL = EVT.GOAL_CALL; EVT.MOON_GUIDE = EVT.GOAL_GUIDE; EVT.MOON_CONTACT = EVT.GOAL_CONTACT  // @deprecated aliases, deleted by integrator final pass (grep -rn 'MOON_' src == 0 gate)
EVT.LANDMARK     'landmark'    {landmarkId:int, nameJa:string, sizeReal:number}
EVT.COLLECT      'collect'     {collectibleId:int, nameJa:string, isNew:boolean, found:int, total:12}
AbsorbEvent += {archetypeCode:int, collectibleId:int /* -1 */}      // absorb.js stamps BEFORE store.free
ScoreEvent  += {archetypeCode:int}
GoalEvent   += {collectFound:int}
// BINDING ABSORB order: chunk spawner -> curated -> main attach (sets instanceSlot=-1 on steal) -> runStats -> collection -> sfx/effects/hud.
// DUAL-TAG: COLLECT emitted before LANDMARK in the same frame for objects carrying both ids.

// ===== new classes =====
class CityTerrain {            // world/terrain.js (Stream B)
  constructor(bus, scaleMgr)
  collide(state:BallState): void        // shop walls/prisms + PERMANENT skytree base circle + bounds clamp + 4r edge damping; BOUNCE w/ 0.25s cooldown
  interiorAt01(x,z): number
  clampCameraBoom(ballPos:V3, desired:V3, out:V3): boolean
  flightWallTest(x0,z0,x1,z1): boolean  // pre-release only
  get released(): boolean; reset(): void // + RESCALE/REBASE self-subscribed
}
class CuratedSpawner {         // world/curated.js (Stream B)
  constructor(store, hashes, instances, extraPools/*4 shared size-class pools*/, bus, scaleMgr)
  update(ballPos:V3, tierIndex:int, ballRadiusSim:number, dt:number): void  // <=64/frame; re-bands tierOf=clamp(naturalBand,t-1,t+1) on activation+TIER_UP
  collectibleIdFor(storeIdx:int): int   // -1 or frozen id 0..11; valid THROUGH the ABSORB dispatch
  forEachAliveCollectible(cb(idx,x,y,z,r)): void
  forceScan(): void                     // devTeleport: full-placement pass ignoring the 64 budget
  get aliveCount(): int; reset(): void
}
class Collection {             // game/collection.js (Stream D)
  constructor(bus); get foundCount():int; get foundThisRun():int
  prerenderThumbnails(renderer, geos): void; thumbnailUrl(id:int): string
  resetRun(): void; static loadMask(): int   // {v:1,mask} frozen-id bits, shape-validated
}
class Donack {                 // ui/donack.js (Stream E)
  constructor(bus, initialOff:boolean); setOff(b):void  // internal: phase gate {title,play,cinematic,result}, queue-of-1, dedupe
}
class SkytreeView {            // render/goalTower.js (Stream A)
  constructor(scene, scaleMgr) // fixed pose from cityMap; mesh active when simDist < 0.8*CAMERA_FAR, crossfades with env silhouette (v2 handoff)
  setGlow01(k); setBeamPulse(on); getPosSim(out:V3): V3; get radiusSim(): number
}
// ===== changed signatures =====
new BallPhysics(bus, terrain=null)                  // terrain.collide after XZ integration; reset() UNCHANGED (origin = ball start)
new CameraRig(camera, bus, {clampBoom:fn, interior01:fn})
new Absorb(bus, scaleMgr, CATALOG, curated)
new RunStats(bus, scaleMgr, worldSeed, collection)
catalog.js: export DISPLAY_NAME_BY_CODE /* string[94] */, EXTRA_CATALOG
objects.js: export FLAG_CURATED = 16
cityMap.js: export bandAllowedAt(xReal,zReal,band):boolean, SHOP, ZONES, PLACEMENTS, LANDMARKS, COLLECTIBLE_IDS /* frozen explicit ids 0..11 */, COLLECTIBLES, SKYTREE_POS, MAP_BOUNDS, DEV_STARTS, validateCityMap()
main.js: devTeleport(name) /* integrator-owned: ws snap 0.04*5^k, ball pose, spawner.onTeleport(), curated.forceScan(), terrain re-eval, forced maybeRebase */
// ===== frame order v3 (main.js, BINDING — delta on v2) =====
// 2   fixed steps { ballPhys.step(dt,intent,yaw+PI) /* terrain.collide inside */ ; if(!finale.inputLocked) absorb.resolve(...) }
// 3   if(!finale.inputLocked){ spawner.update(...); curated.update(...) }
// 4.5 finale.update(frameDt, ballPhys.state)        // approach/contact vs SkytreeView
// 6   cameraRig.update (interior01 + boom clamp internal)
// everything else identical to v2; resetWorld += curated.reset + collection.resetRun.
```

## チューニング定数

```js
// ---- Scale / goal ----
START_RADIUS_M = 0.02
GOAL_CALL_RADIUS_M = 380; GOAL_RADIUS_M = 420
GOAL_CONTACT_PAD = 0.85             // d <= ballR + towerBaseR*PAD
SKYTREE_BASE_R_M = 90; SKYTREE_COLLIDER_K = 0.6   // permanent terrain collider; validator asserts 0.6 < 0.85
SKY_SILHOUETTE_WS_MAX = 0.2         // env silhouette below, goalTower mesh above (handoff at simDist < 0.8*CAMERA_FAR)
GOAL_MERGE_S = 1.2; GOAL_ASCEND_S = 5.0; GOAL_ASCEND_HEIGHT_K = 40; AFTERGLOW_S = 2.5; FLASH_S = 0.45
// @deprecated Phase-0 aliases (integrator deletes): MOON_GOAL_RADIUS_M=GOAL_RADIUS_M, MOON_RADIUS_K, MOON_DESCENT_S, MOON_LAND_DIST_K, MOON_LAND_VEL_FRAC, MOON_SCORE_BONUS=GOAL_SCORE_BONUS
// ---- Shop / terrain ----
SHOP_TERRAIN_RELEASE_M = 4.0        // walls fade 0.6s + elevated-item y-drop lerp 0.6s; camera clamp off AFTER fade; shop-shell absorbable @ 6.2m
INTERIOR_CAM_DIST_MUL = 0.62; INTERIOR_CAM_HEIGHT_MUL = 1.4; INTERIOR_FADE_S = 0.5
CAM_WALL_MARGIN_K = 0.5
FOG_FAR_MIN_M = 9.0; LOAD_RADIUS_MIN_M = 11.25   // 1.25*fog floor; both applied at query time (spawner ring + curated activation); tiers.js asserts the floored pair
WALL_THICK_M = 0.12; WALL_TOP_M = 2.2; INTERIOR_ITEM_Y_MAX = 0.7
// ---- Map edge ----
MAP_BOUNDS = {x:[-1800,1800], z:[-1800,2000]}
EDGE_SOFT_BAND_K = 4.0; EDGE_DAMP_PER_FRAME = 0.85
// ---- Curated / density ----
CURATED_UPDATE_BUDGET = 64; CURATED_PLACEMENT_CAP = 640
DENSITY_K_V3 = 0.45                 // chunk per-band count multiplier vs v2 (EMPIRICAL Phase-3)
// ---- Feedback ----
FLOAT_MERGE_S = 0.30; MAX_FLOATS_MOBILE = 3; MAX_FLOATS_DESKTOP = 6
COLLECT_POPUP_S = 3.5; COLLECT_TOTAL = 12; THUMB_SIZE_PX = 96
// ---- Donack ----
DONACK_SHOW_S = 4.5; DONACK_SHOW_LANDMARK_S = 6.0
DONACK_GAP_P01_S = 8; DONACK_GAP_P2_S = 4      // P3 bypasses
DONACK_TIP_COOLDOWN_S = 30; DONACK_IDLE_HINT_S = 10; DONACK_DASH_HINT_S = 12
DONACK_BLINK_FPS = 4; DONACK_ASSET_BUDGET_KB = 40   // sum of the 8 shipped webp files
// ---- Score / rank (ONE pacing truth: typical clear 5:30-6:30, optimal ~3:30-4:00; EMPIRICAL Phase-3 retune >=3 playthroughs mandatory) ----
RANK_S_S = 240; RANK_A_S = 330; RANK_B_S = 450; RANK_C_S = 600
TIME_BONUS_MAX = 30000; TIME_BONUS_FULL_S = 240; TIME_BONUS_ZERO_S = 600
GOAL_SCORE_BONUS = 20000; RARE_SCORE_BONUS = 5000; LANDMARK_SCORE_BONUS = 8000
// ---- Renderer ----
DRAW_CALL_CAP = 72                  // honest worst ledger 64: 40 world + 8 stuck + 6 fixed + 1 backdrop + 2 skytree + 1 terrain + 2 water+quay + 4 shared EXTRA pools
CAMERA_FAR = 4000                   // UNCHANGED (silhouette handoff instead of far-plane raise)
// ---- Mobile UI ----
TIMER_FORMAT_MOBILE = 'm:ss' (<768px; deciseconds desktop only; display cap 99:59); @property --gauge angle + .12s transition; @supports plain-bar fallback
// ---- Persistence ----
LS_BEST_KEY='fableKatamari.v3.best'; LS_MUTE_KEY='fableKatamari.v3.muted'; LS_COLLECTION_KEY='fableKatamari.v3.collection' /* {v:1,mask} frozen ids, append-only 12+ */; LS_DONACK_KEY='fableKatamari.v3.donackOff'
// ---- Unchanged: ABSORB_RATIO .65, GROWTH_K 10, RESCALE_S .2, sim band [.5,2.5], ACCEL_K 45, SPEED_K 8.5, dash block, spawner budgets, RARE_CHANCE .002 (chunk score-rares), PIXEL_RATIO_MAX 1.5, governor.
```

## 並列作業分割

PHASE 0 — LEAD/INTEGRATOR (~1 day, blocks everything): types.js, events.js (GOAL_* + LANDMARK/COLLECT + @deprecated MOON_ aliases), tuning.js (v3 constants + @deprecated MOON_ alias re-exports), tiers.js (7 tiers, 70 frozen ids, extended fog/load assert), index.html (full mobile-first CSS + all new DOM ids + @property + webp preloads), main.js skeleton (new call sites as no-op stubs + devTeleport; v2 keeps booting), scaleManager.js GOAL_RADIUS_M read (documented exception #1), ballPhysics terrain param default-null (exception #2), docs/DESIGN-V3.md. FREEZES: event names/payloads + subscription order, DOM ids, FLAG_CURATED=16, archetype codes 0..69 + EXTRA 70..93, DISPLAY_NAME_BY_CODE shape, landmark ids, COLLECTIBLE_IDS explicit 0..11, cityMap export signatures, dynamic re-banding rule, slot-steal convention, knockOff code>=70 skip, Donack line ids, ONE pacing truth + DENSITY_K_V3. EXIT CRITERION (restated per BLOCKER 3): npm run dev boots WITH the alias layer present and zero stream files touched.
STREAM A — FINALE & ATMOSPHERE: finale.js, render/goalTower.js (new), render/moon.js (deleted at stream end), cameraRig.js, environment.js (palettes, water+quay, fog floor, SILHOUETTE SLOT KEPT/renamed), effects.js. Tests: scripted BallState ramp idle->done; KeyR rescale + teleport rebase during approach/contact screenshot-diff; ?at=shop boot screenshot asserting the Skytree silhouette on screen at r=0.02; silhouette->mesh crossfade at ws~0.2.
STREAM B — WORLD DATA & SPAWN: config/cityMap.js (+validator), world/terrain.js, world/curated.js, world/spawner.js, physics/ballPhysics.js (2-line). Tests: validator passes (aisles, reach, no-seal, growth-chain, ball-start clearance, collider<pad); same-seed chunk determinism with masks; curated activate/deactivate + RE-BAND headless across forced TIER_UPs; ownership identity assert; ?at=shop&r=3.8 release-fade test; skytree base bounce test.
STREAM C — CONTENT: config/catalog.js (70+24+names, largest), world/objects.js, render/ball.js (incl. knockOff>=70 skip), physics/absorb.js. Owns the 60->70(+24) stride audit (grep '60|=== 6\\b|TIERS.length' checklist) + boot asserts + v2-vs-v3 absorb-proxy visual pass.
STREAM D — UI & META: ui/hud.js, ui/screens.js, game/collection.js (new), game/runStats.js. Driven by synthetic bus events; viewport matrix 360/390/430 portrait+landscape + ONE REAL iOS + ONE REAL Android pass (owner's platform); timer m:ss; ring fallback check.
STREAM E — DONACK, AUDIO & BACKDROP: scripts/verify-donack-assets.sh, public/assets/donack pruning (8 kept/16 deleted), ui/donack.js, config/donackLines.js, audio/sfx.js, audio/bgm.js, render/backdrop.js. Tests: synthetic event storm (priority/cooldown/no-spam, <=1 bubble/20s average, dual-tag merged line, bubble across GOAL_CONTACT, GAME_RESET hard-reset), asset budget script green, iOS Safari webp/pixelated rendering.
INTEGRATION (lead + B): order B (shop playable) -> C (content pass) -> D (HUD on devices) -> E (donack/audio) -> A LAST (finale e2e via devTeleport ?at=tower&r=250 / ?at=goal&r=400). Each stream deletes its own MOON_ alias consumers as it lands; integrator final pass deletes the alias blocks with the grep gate (grep -rn 'MOON_' src == 0). Then: forced-rescale screenshot diff at every tier + during approach; teleport-rebase during approach; restart-debris check; iGPU+Android profile (governor, heap-delta, draw-call watch T4->T5 with EXTRA pools active, Ueno<->Asakusa parked test); validator output review; Phase-3 pacing playthroughs (>=3) retuning ranks/density; Cloudflare Pages deploy. main.js touched by integrator only.

## リスク

- 7-tier + 70-code stride migration repeats v2's highest-blast-radius change; mitigated identically (Stream C ownership, grep checklist, dual boot asserts, visual pass) — and the MOON_ alias layer now removes the build-break failure mode, but leaves a residue risk: a stream forgetting to delete its alias consumers. The integrator grep gate (MOON_ == 0 before deploy) is the mechanical catch.
- Dynamic re-banding mutates store.tierOf for curated slots — the one store field two owners now write (chunk spawner stamps it at spawn, curated re-stamps its own slots). Safe because writes are partitioned by FLAG_CURATED, but any future code that caches tierOf across frames will desync; DEV assert (curated band always in live window) plus the 300-frame aliveCount identity check are the guards. Document tierOf as 'curated-mutable' in objects.js header.
- Pacing now hangs on DENSITY_K_V3=0.45 extrapolated from v2's empirical 95-105s optimal; the finite map's travel legs are unmeasured. Phase-3 (>=3 playthroughs) is BINDING and may move density, rank thresholds, or zone band masks — all single-file data edits by design. Watch the T2->T3 Akiba leg specifically with a worst-case vacuum run (district exhaustion is the new finite-map failure class; map-wide {4,5} fill prevents late-tier starvation).
- Draw-call ledger 64/72 now rests on the 4 shared EXTRA pools being implemented as specced (not per-archetype pools); the size-class partition must hold every landmark recipe under its pool's geometry budget — Stream C verifies per-class tri/draw cost when authoring EXTRA_CATALOG. Watch renderer.info parked between Ueno and Asakusa at r=60m.
- Skytree silhouette->mesh handoff reuses proven v2 moon math but in reverse circumstances (fixed world pose, camera roams): azimuth error between sky-dome silhouette and true mesh position grows near the handoff distance; mitigation is handing off at 0.8*CAMERA_FAR where the silhouette is small, plus the Stream A crossfade screenshot test at ws 0.18-0.25.
- Terrain release at 4.0m is a one-shot structural event (documented exemption to radius-continuity); wall fade, elevated-item y-drop, and camera-clamp deactivation are all tied to the same 0.6s window — the ?at=shop&r=3.8 dev test must cover camping the boundary.
- Mobile real-device coverage is the owner's primary platform: safe-area env(), @property --gauge support (iOS 16.4+), webp + image-rendering:pixelated, and Android compositor cost without backdrop-filter all need the mandated one-iOS + one-Android pass; the plain-bar dash fallback and the no-blur guard are the pre-built escape hatches.
- Donack volume risks spam-fatigue despite priority/cooldown; Phase-3 confirms <=1 bubble/20s mid-game average and OFF-toggle persistence (owner replays often). Phase gating eliminates the cinematic/result leak class but the 1Hz idle checker must demonstrably stop on GAME_RESET (covered in Stream E's storm test).
- Boot thumbnail pre-render (12 offscreen renders) is new title-screen work on mobile GPUs; measure title-tap-to-play on low-end Android; the lazy-render-at-first-COLLECT lever is pre-approved and is a one-call-site move.
- Tokyo Tower's jump (262->406m) intentionally skips most of T6; if playtests show T6 content never touched, shrink the tower's dioramaR or raise GOAL_RADIUS_M — both single-constant edits by design.
- The collection album persists across deploys by frozen-id contract; the contract is documentation-enforced only. The boot assert (ids unique <31) catches collisions but not reordering — DESIGN-V3.md must carry the append-only rule prominently so a v3.1 author sees it.
## Phase 0 追補 — 実装台帳（BINDING、Phase 0 lead 記入）

### 凍結: 70 チャンク・アーキタイプID（英語 snake_case ⇔ 日本語表示名）

catalog.js (Stream C) は displayNameJa をこの対応表どおりに実装する。v2 と同名の id は「形状一致の v2 レシピ再利用」指示（ティア表）の凍結形。

| T | slot 0..7 (absorbables) | slot 8/9 (chunk landmarks) |
|---|---|---|
| 0 パーツ棚 | screw=ネジ, resistor=抵抗, capacitor=コンデンサ, ic_chip=ICチップ, led=LED, button_battery=ボタン電池, eraser=消しゴム, paperclip=クリップ | junk_board=ジャンク基板, soldering_iron=はんだごて |
| 1 ショップ | mouse=マウス, game_soft=ゲームソフト, junk_hdd=ジャンクHDD, speaker=スピーカー, toolbox=工具箱, magazine_stack=雑誌たば, round_stool=丸イス, cardboard_box=ダンボール箱 | parts_rack=パーツ棚ラック, arcade_cabinet=アーケード筐体 |
| 2 電気街 | bicycle=自転車, person=通行人, signboard=看板, vending_machine=自販機, cat=ネコ, pigeon=ハト, nobori_banner=のぼり, trash_can=ゴミ箱 | utility_pole=電柱(cs .45), yatai_stall=屋台 |
| 3 下町 | car=車, taxi=タクシー, bus=バス, truck=トラック, street_tree=街路樹, kiosk=売店, machiya=町家, torii=鳥居 | footbridge=歩道橋(cs .5), sento_chimney=銭湯の煙突(cs .35) |
| 4 都心 | zakkyo_building=雑居ビル, mansion=マンション, konbini=コンビニ, parking_garage=立体駐車場, train_car=電車車両, gas_tank=ガスタンク, crane=クレーン, shrine=神社 | highway_junction=首都高ジャンクション(cs .6), ferris_wheel=観覧車 |
| 5 大東京 | skyscraper=超高層ビル, tower_mansion=タワーマンション, hotel=ホテル, department_store=デパート, viaduct=高架橋, stadium=スタジアム, rail_yard=操車場, cruise_ship=客船 | mountain=丘陵(cs .85, v2 mountain レシピ), bay_complex=湾岸コンビナート |
| 6 スカイライン | city_block=街区ブロック, park=公園, pier=埠頭, building_cluster=ビル群, river_block=川面ブロック, arena=競技場, forest=森, cloud=雲 | great_hill=大丘陵, ring_road=環状線リング |

### 凍結: EXTRA コード 70..93 / landmarkId / collectibleId

- **コレクティブル: code = 70 + COLLECTIBLE_ID（凍結写像）**
  70 金の招き猫(id0), 71 真空管(id1), 72 レトロゲーム機(id2), 73 秋葉原フィギュア(id3), 74 ゲーミングPC(id4), 75 特上大トロ(id5), 76 だるま(id6), 77 パンダのぬいぐるみ(id7), 78 雷おこし(id8), 79 金色のオブジェ(id9), **80 ハチ公像(id10 — DUAL: landmarkId 0 を併持)**, 81 屋形船(id11)
- **ランドマーク単体（非ハチ公）: code 82..91**
  82 西郷さん像, 83 雷門, 84 ラジオ会館風ビル, 85 渋谷109, 86 スクランブル交差点(デカール+群衆), 87 東京ドーム, 88 東京駅丸の内駅舎, 89 国会議事堂, 90 レインボーブリッジ橋スパン, 91 東京タワー
- **92 アキバパーツ館（shop shell）**
- **93 東京スカイツリー（display-name 専用スロット — store には絶対にスポーンしない。render/goalTower.js + env シルエットのみ。DISPLAY_NAME_BY_CODE を 94 で揃えるための予約）**
- **landmarkId 0..10（しきい値ラダー順）**: 0 ハチ公像, 1 西郷さん像, 2 雷門, 3 ラジオ会館風ビル, 4 渋谷109, 5 スクランブル交差点, 6 東京ドーム, 7 東京駅丸の内駅舎, 8 国会議事堂, 9 レインボーブリッジ, 10 東京タワー
- COLLECTIBLE_IDS は **append-only**（v3.1 以降は id 12+ を追記、再利用・並べ替え禁止。boot assert: unique かつ < 31。LS マスクの未知上位ビットは保存）。

### 例外台帳（exemptions ledger）

1. **scaleManager.js が GOAL_RADIUS_M を直接 import**（Phase 0 クロスストリーム例外 #1。grow-exit のみ、_rebuildHashes 不変）。
2. **ballPhysics.js の terrain 注入**（Phase 0 例外 #2。constructor(bus, terrain=null)、XZ 積分直後に collide(state)。reset() は不変 — ORIGIN = BALL START）。
3. **Donack 8 webp（~20KB）** — zero-external-asset 法の文書化例外（自社ファーストパーティ・キャラ資産）。scripts/verify-donack-assets.sh が 8 ファイル・40KB 上限・余剰なしを強制。
4. **Skytree fog:false + ~1400 tris**（sky-element 例外、moon.js と同型）+ env シルエットスロット再利用（uMoon* → uGoalSil* リネーム）。
5. **ブートサムネイル描画**（タイトル中の 12 回オフスクリーン描画、使い捨て。lazy-at-first-COLLECT レバー承認済み）。
6. **ショップ地形リリース（4.0m）** — 半径連続性に対する唯一の one-shot 構造ハンドオフ（0.6s 窓: 壁フェード+y-drop+カメラクランプ解除）。
7. **WebAudio 有界アロケーション**（v2 から継続、<=60 nodes/s）。

### リセット所有権表 v3

| 起点 | 担当 |
|---|---|
| main.resetWorld() | spawner.reset → store.reset → pools.reset → absorb.reset → scaleMgr.reset → hashes rebuild → ball.reset → ballPhys.reset → finale.reset → runStats.reset → **terrain.reset → curated.reset → collection.resetRun** → preloadStartArea |
| GAME_RESET (bus) | cameraRig.reset（cinematic flag）, env.setTierPaletteImmediate（v2 uniforms + night fade 取消 + uGoalSil リセット）, backdrop snap, **donack hard-reset（全タイマー/queue/dedupe/phase='title'）** |
| GAME_START (bus) | hud reset+show, **donack phase='play'** |
| 永続（リセットしない） | LS_COLLECTION_KEY（album mask）, LS_BEST_KEY, LS_MUTE_KEY, LS_DONACK_KEY |

### MOON_ エイリアス退役計画

- tuning.js: MOON_CALL_RADIUS_M/MOON_GOAL_RADIUS_M/MOON_CONTACT_PAD/MOON_MERGE_S/MOON_ASCEND_S/MOON_ASCEND_HEIGHT_K/MOON_SCORE_BONUS = GOAL_* 再export; MOON_RADIUS_K/MOON_DESCENT_S/MOON_LAND_DIST_K/MOON_LAND_VEL_FRAC/MOON_MAGNET_* は v2 降下専用の遺物定数。**MOON_DIR_MIN_ELEV のみ非deprecated（夜空の月コスメは v3 でも残る）— grep ゲートの唯一の恒久例外。**
- events.js: EVT.MOON_CALL/MOON_GUIDE/MOON_CONTACT は GOAL_* と同一ワイヤ文字列（'goalCall' 等）。PAYLOADS.moonCall/moonGuide/moonContact は PAYLOADS.goalCall 等と同一オブジェクト。
- 各ストリームは**自分の担当ファイル内のエイリアス消費だけ**を着地時に削除。**統合者が最後に** tuning.js/events.js のエイリアス定義ブロックを削除（ゲート: `grep -rn 'MOON_' src` が MOON_DIR_MIN_ELEV 以外 0 件）。

### Phase 0 移行期シム（統合時に削除するもの）

| シム | 場所 | 削除担当 |
|---|---|---|
| `#dash-gauge`/`#dash-gauge-fill`（ダッシュボタン上の移行期バー。v3 ゲージはリング） | index.html | Stream D が hud.js をリングに移行後、統合者が markup 削除 |
| `#moon-arrow`（v2 hud.js 用エイリアス要素。#goal-arrow が v3 本体） | index.html | 同上 |
| `#absorbed-inline` 内の入れ子 `#absorbed-value`（v2 hud.js 書き込み先） | index.html | Stream D 着地時に平坦化 |
| main.js の terrain/curated/collection/donack スタブ + ローカル DEV_STARTS | src/main.js | 統合者（V3-WIRE マーカー検索） |
| **DEV モード boot assert 不整合**: catalog.js（60 ids）/objects.js（length 60）の DEV assert は tiers.js の 70 ids と矛盾するため、**Stream C 着地まで `npm run dev` は boot しない**。Phase 0 の動作検証は `npm run build` + `vite preview`（prod は assert ストリップ + null フォールバックで v2 プレイ可能。未実装 id は空ジオメトリ=不可視で許容） | — | Stream C（asserts 60→70/94 更新で解消） |

### Phase 0 凍結追加分（spec 補完）

- **hud.js は `--gauge`（0–360deg, ring）と `--gauge01`（0–1, フォールバックバー）の両方を 10Hz で書く**。EVT.DASH で両方 0 スナップ、DASH_READY で `#dash-button.flash`。@property 非対応・conic 対応の帯域（旧 Chrome/Safari）はリング非補間で許容。
- collect popup 内部 id 凍結: `#collect-popup-img` / `#collect-popup-name` / `#collect-popup-count`。
- リザルトグリッド id/class 凍結: `#collection-grid-wrap` / `#collection-header` / `#result-collect-n` / `#collection-grid` / `.collect-cell`（`.unfound`, 内部 `.cell-new`）。staged 時は `#win-overlay.staged #collection-grid-wrap{opacity:0}` 済み — Stream D は 1.9s キューで `.result-reveal` を付与するだけ。
- `MAP_BOUNDS` の単一ソースは **tuning.js**。cityMap.js は同オブジェクトを re-export（値の二重保守禁止）。
- 7 ティア名（HUD バナー/ラベル凍結）: パーツ棚 / ショップ / 電気街 / 下町 / 都心 / 大東京 / スカイライン。
- ドローコール台帳 64/72 は tuning.js DRAW_CALL_CAP コメントに転記済み（正本はこの章）。
