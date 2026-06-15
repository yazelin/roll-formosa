# Phase 14 作業ログ: v4設計（ワークフロー `katamari-v4-design`）

**要件（ユーザー指示）**: ①GoogleMapのデータで街並みをゲームに反映（テクスチャは重いのでプリミティブ/ボクセル風でOK）②キャラクターデータの品質向上

**データソースの意思決定（メインループ）**: Google Maps Platform ToSは地図データの派生データセット化・再配布を禁止しているため、**OpenStreetMap (Overpass API, ODbL)** を採用。帰属表示のみで合法に「実在の東京の街並み」を実現できる。事前にOverpass疎通とフットプリント取得を確認（POSTは406、GET+User-Agentで成功）。

**手法**: 設計→敵対的批評→改訂。実行実績: エージェント3体 / 約397,653トークン / 約38分

**特筆**: 批評エージェントは設計の数値を信用せず**自らOverpassでカウントクエリを再実行**し、詳細エリアの建物数58,155棟（設計の1.5倍）、道路+鉄道16,712本などの実測値で全予算を再導出させた。

## 批評が検出した主要問題（改訂で解決）

- [blocker] **Measured data-volume baselines are wrong; every downstream budget inherits the error**
- [blocker] **Detail-set spatial definition is inconsistent three ways: fetch square vs coverage disc vs count math**
- [blocker] **osm-large pool capacity (512) < worst-case alive demand (b4 800 + b5 128 = 928)**
- [blocker] **Alive ledger ignores the coverage-boundary straddle; chunk + OSM worst cases can sum past 4,096**
- [major] **Tokyo Bay does not exist in the water fetch — natural=water/riverbank queries never return the sea**
- [major] **No element-dedupe or multipolygon ring-assembly step in CONVERT**
- [major] **POLY record vertex count is u8 — large river/park polygons exceed 255 vertices with no split path**
- [major] **Most detached houses land in band 2 (cap 200, KEEP 0.5), contradicting the design's own band narrative**
- [major] **Navigability: at 1:5 the real street network is narrower than the ball for most of T2–T4**
- [major] **COMPOSITE/FOLLOW two-box buildings have undefined absorb semantics**
- [major] **Landmark reconciliation table contains hand-typed errors — Rainbow Bridge is 2.6× too long**
- [major] **Tier-2 data race: the failure fallback can fire (or still be pending) after the player needs band 3**
- [minor] **Tower if-filter loses unit-suffixed heights and relation towers; counts are overestimated anyway**
- [minor] **Overpass fetch plan will hit rate limits as specified**
- [minor] **Draw/ground accounting: bay-quad replacement is double-counted and intra-batch z-fighting is unaddressed**
- [minor] **Non-uniform instance scale breaks normals for any non-axis-aligned OSM face (temple/shrine roofs)**
- [minor] **ODbL compliance is attribution-only; derivative-database and notice obligations are unstated**
- [minor] **Hero/rim perf claims are plausible but the rim's approval risk and the +25KB-not-12KB bundle delta are understated**

## 改訂時の意思決定

1. BLOCKER 'measured baselines wrong': adopted the critique's re-measured numbers as binding (58,155 detail-square buildings @2,321/km^2; 16,712 roads+rail; 4,272 water+parks; 1,946 towers), committed them as EXPECTED_COUNTS in geo.mjs (re-derived via cheap `out count;` queries at fetch time), and made verify-tokyo-data.mjs assert manifest per-band counts within +/-20% of those baselines. All downstream budgets (size table now ~0.8-1.0 MB raw / 0.55-0.75 MB gz, alive caps, pacing multiplier corrected 2.2x -> 2.8x with KEEP_K[3] lowered 0.75 -> 0.6) are recomputed, and the pacing model reads the manifest, never prose.

2. BLOCKER 'detail set inconsistent three ways': geo.mjs is now the single source of coverage geometry (disc r=500 game m + Shibuya patch + new Asakusa patch); fetch cells are DERIVED as the covering cell set, convert CLIPS by footprint centroid to coverage, and verify asserts zero records outside coverage and that cityMap's exported rects equal the geo.mjs values. The Shibuya rect is regenerated from its bbox (x[-1397,-1090]xz[726,1036], fixing the draft's wrong hand-typed rect). 国会議事堂 is accepted as outside detail coverage (procedural fill remains correct there); 雷門/浅草 (561 game m from origin, outside the disc) gets a dedicated Asakusa patch so the iconic district has real fill.

3. BLOCKER 'osm-large 512 < 928 worst demand': pool membership is per-band and frozen Phase 0 with a boot-asserted feasibility invariant sum(OSM_ALIVE_CAP[member bands]) <= pool capacity; osm-large raised to 1024 and caps re-cut to {192,1536,768,128} so b2+b3=1728<=2048 and b4+b5=896<=1024. Slot exhaustion is now structurally impossible rather than probabilistically unlikely.

4. BLOCKER 'coverage-boundary alive straddle can exceed 4096': added a hard runtime admission check — OsmSpawner skips activation while store.aliveCount() > ALIVE_TOTAL_BUDGET - OSM_ADMISSION_HEADROOM(128), processing tiles nearest-first so close streetscape wins. Boundary degradation ('OSM thins first') is documented as designed behavior, and a binding integration test parks ON the boundary at r~4 and r~40 asserting alive<4096 for 300 frames. Static arithmetic alone provably cannot cover the straddle, so enforcement moved to runtime.

5. MAJOR 'Tokyo Bay absent from the water fetch': the v3 authored bay quads and bay-edge cosmetics are KEPT (the sea is natural=coastline, not water polygons; coastline ring assembly is explicitly out of v4 scope). OSM water is rivers/ponds/moats only; the river mesh is honestly ADDITIVE (+1 draw on the env water material), and the ledger no longer claims a replacement that never frees a slot.

6. MAJOR 'no dedupe / multipolygon assembly': added CONVERT step 0 — global (type,id) map deduping across cells AND fetch sets (tower set wins for >=50 m buildings), multipolygon outer-ring stitching with inner rings ignored (voxel boxes need no holes) and member ways removed from the standalone set; unstitchable relations drop+log. verify asserts zero duplicate source ids across both shards.

7. MAJOR 'POLY u8 vertex cap': POLY n and t are both u16 in format v1 (no minor-version dance — v1 simply ships u16), rings are Douglas-Peucker simplified (eps=1 game m) BEFORE earcut, and verify prints the max-n histogram to prove the ceiling. The poly size line was redone honestly (~1.2k records, ~150 B avg, ~180 KB).

8. MAJOR 'houses land in band 2': convert order fixed to dedupe -> assemble -> OBB -> height -> quantize -> MERGE -> clearance -> band -> thin (merge before banding/thinning so rowhouse merge candidates survive), and the band-2/3 boundary re-cut from r_eff 2.0 to 1.6 so a typical 8x8x6.5 m house (r_eff 1.72) is band 3 as the narrative requires. OSM_ALIVE_CAP initials re-derived accordingly, with the verify band histogram (not prose) authoritative for the Phase-3 re-cut.

9. MAJOR 'navigability at 1:5': added a pipeline clearance bake — residential/unclassified roads are fetched inside coverage (build-time only, never shipped) and every building OBB intruding into a road corridor (halfwidth = roadWidth/2 + 1.0 game m) is inset up to 30% or dropped (post-inset min(w,d)<0.5 drops). verify gains a navigability report (0.5 game m raster, erode-by-ball-radius flood fill from (30,0)) with a binding Phase-3 gate of >=95% reachability at ball-radius brackets 1 and 3. KEEP_K thinning is explicitly disclaimed as a navigability tool.

10. MAJOR 'COMPOSITE/FOLLOW absorb semantics undefined': composite two-box decomposition is CUT from format v1 (per the critique's own preferred alternative) — 1 record = 1 building everywhere, keeping stats, dedupe, and collection coherent. Convert measures the would-have-decomposed area rate and logs it; decomposition returns only if >3% of total area is affected, as a future format rev with semantics designed then. Type-byte flag space now carries MERGED only.

11. MAJOR 'hand-typed landmark table errors (Rainbow Bridge 2.6x too long)': hand arithmetic is banned — geo.mjs computes all mapped coordinates from committed real lat/lon (landmarks fetched once by OSM element id into data/osm-raw/landmarks.json), the doc table is generated output, and validateCityMap asserts inter-landmark REAL distances against ground truth (bridge span 798 m -> ~160 game m; ハチ公<->109 ~120 m). The bridge row is corrected: deck segments generated from actual bridge way geometry, midpoint ~(-240,1296), SSW orientation.

12. MAJOR 'tier-2 data race': the OSM/procedural switch is one-way and deadline-driven — at TIER_UP into tier 2 with !osmWorld.ready, main calls abortAndFail() (AbortController cancels fetches, failed latches permanently, late data discarded) and setOsmCoverageActive(false) flips masks to procedural for the whole session; setOsmCoverageActive is a one-shot latch called exactly once per session, eliminating both the empty-streetscape window and the double-fill case. DEV ?osmdelay=ms makes the race testable, and the integration checklist includes a forced-race run.

13. MINOR 'tower if-filter loses suffixed heights': tower cells fetch with a suffix-safe server-side REGEX coarse filter (height ~ ^(5-9x|100+), levels ~ ^(13+)) instead of number() if-filters, with authoritative numeric parsing and the >=50 m / >=13 levels threshold applied client-side at convert. EXPECTED_COUNTS records the measured 1,946 baseline (draft's 3-5k corrected).

14. MINOR 'rate limits + 406 misdiagnosis': fetch-osm.mjs is resumable (skips cells with existing raw files), polls /api/status for slot availability, treats 429/rate_limited as retry-after sleeps outside the 3 hard retries, and prefers the kumi mirror for bulk runs. The 406 is documented as a missing User-Agent issue (UA header mandatory), not a GET-vs-POST issue.

15. MINOR 'ledger double-count + intra-batch z-fighting': ledger restated honestly as v3's 64 (bay intact) + 2 building batches + 1 ground + 1 river = 68 of cap 72, with two pre-approved -1 levers. Ground coplanarity is solved by convert-baked layer y-offsets (parks +0.02 / minor +0.04 / major+rail +0.06 game m) that scale with the similarity transform — preserving the rescale pixel-identity — rather than relying on polygonOffset within a single batch.

16. MINOR 'non-uniform scale breaks normals on sloped faces': a Phase-0 catalog constraint + boot assert requires axis-aligned normals on every unitBox:true geometry (BatchedMesh applies no inverse-transpose). All 16 OSM archetypes are flat/stepped boxes in v1; temple/shrine ship flat-roofed with vermilion/wood banding, with fixed-aspect sloped variants documented as a post-ship option. The constraint is documented next to the new setTransform signatures.

17. MINOR 'ODbL beyond attribution': compliance is a release gate — the in-app credit links to openstreetmap.org/copyright on title and result screens, README and the manifest carry the ODbL license link and Overpass extraction timestamp, and the public repo's data/osm-raw/ + scripts/osm/ are explicitly designated the ODbL 4.4(b) derivative-database offer; the credit joins any result-screen screenshot composition.

18. MINOR 'JS budget optimistic + rim approval risk': JS_GZ_BUDGET_KB is set FINAL from a Phase-0 measured stub spike (provisional 240, honestly expecting +20-30 KB over v3's ~205, not +12). The model-quality pass ships as 3 separable commits behind independent kill switches (uRimK=0, AO_BAKE_DEFAULT=0, palette regrade isolated), and the A/B screenshot sheet must be owner-approved BEFORE Stream W integration so Requirement-2 sign-off is bisectable and decoupled from the map review (integration order P -> C -> R -> W enforces this).

19. RETAINED from the draft (verified against src/): OSM buildings as pure ObjectStore absorbables with no separate scenery mesh (fog 55r < load radius makes double representation unnecessary); the 1:5 / 1:2.5 scale mapping with MAP_BOUNDS kept; FLAG_OSM=32 / codes 94..109 atop the verified EXTRA_CODE_BASE=70 knockOff skip; the curated origin/rescale/rebase pattern verbatim; BatchedExtraPool reuse with optional non-uniform scale; the 10/12-byte building records and tile sharding; the deterministic KEEP_K hash thinning as the data-only pacing lever; the 12-id hero list and rim/AO techniques (verified sound on three r177); byte-identical shop/strip/gutter as the opening-minute no-regress gate.

20. Codebase verification performed before finalizing: catalog.js asserts exactly 94 codes (so OSM_CODE_BASE=94 and the 110 assert are correct); FLAG_CURATED=16 (objects.js:65) makes 32 the next free flag bit; tuning.js:442-446 confirms the 2000/1200/4096/8192 budgets the admission check builds on; tuning.js:515-516 confirms DRAW_CALL_CAP=72 / TRI_BUDGET=600000; extraPools.js confirms the BatchedExtraPool API (setTransform/rescaleAll/rebaseAll/reset) being extended; cityMap.js confirms bandAllowedAt, LANDMARKS (11, frozen ids), SKYTREE_POS=(900,-520) re-export, and the validator structure receiving the v4 asserts; events.js confirms the frozen ABSORB order pattern being extended.
