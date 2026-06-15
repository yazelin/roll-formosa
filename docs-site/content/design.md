# 設計書 — Fable Katamari 統合アーキテクチャ

> 本ページは v1（基盤）/ v2（月アップデート）/ v3（箱庭東京アップデート）の確定設計
> （`docs/DESIGN.md` / `docs/DESIGN-V2.md` / `docs/DESIGN-V3.md`）をエンジニア向けに統合した一次資料です。
> 各バージョンの設計は ultracode ワークフロー（3視点並列提案→審査統合 / 設計→敵対的批評→改訂）で確定しています。

**技術スタック**: Three.js r177（固定）+ Vite / 純粋静的サイト（Cloudflare Pages）/ ランタイムアセットほぼゼロ（ジオメトリ・テクスチャ・音声をすべてコード生成）/ ~30個の小さなESモジュール + JSDoc型 + 単一イベントバス。

**全バージョン共通の不変条件（binding invariants）**:

| 不変条件 | 内容 |
|---|---|
| リスケールのピクセル同一性 | ティア昇格の相似変換フレームは、変換なしフレームとピクセル単位で同一に描画される |
| シームレスネス法 | 吸収判定・カメラ・フォグ・速度はすべて**半径の連続関数**。ティア番号は見た目のみを駆動 |
| ゼロアロケーション | ホットパスでのフレーム毎のGCごみは0バイト（WebAudioのみ有界例外 ≦60ノード/秒） |
| 固定60Hz | アキュムレータ式固定タイムステップ、最大3サブステップ |
| 決定論スポーン | シード付きPRNGで同シード=同世界（チャンク内容はシードの純関数） |
| ドローコール台帳 | 上限をコメント付き台帳で管理（v1: 55 → v2: 60 → v3: 72） |

---

<!-- SECTION: architecture -->
## 1. 全体アーキテクチャ

### 何を / なぜ

「画鋲(2cm)からスカイツリー(634m)まで5桁のスケール変化を60fpsで」という要件に対し、
**物理・ワールド・レンダリング・ゲームシステム・UIを完全に分離した約30モジュール構成**を採用。
モジュール間の結合は (a) コンストラクタ注入と (b) 再利用ペイロードのイベントバス（`src/core/events.js`）の2経路のみに限定し、
契約（型・イベント名・定数）を `src/types.js` / `src/config/*` に凍結することで5並列ストリームでの同時実装を可能にした。

<!-- DIAGRAM: modules -->
*（図: モジュール構成図 — main.js を中心に core / config / world / physics / render / game / input / audio / ui の9グループを配置し、イベントバスを横断レイヤとして描く。矢印は「main.jsが直接呼ぶ」実線と「バス経由」点線で区別）*

### 主要モジュールマップ

| グループ | ファイル | 責務 |
|---|---|---|
| 起動/ループ | `src/main.js` | フレーム順序の唯一の所有者。状態機械 TITLE→PLAYING→FINALE→WIN。ゲームロジックは持たない |
| コア | `src/core/events.js` `rng.js` `pool.js` `mathUtils.js` | イベントバス（ゼロアロケーションemit）/ mulberry32 PRNG / フリーリスト / スプリング・イージング |
| 設定 | `src/config/tiers.js` `catalog.js` `tuning.js` `cityMap.js`(v3) `donackLines.js`(v3) | ティア表 / アーキタイプカタログ / **全フィール定数の単一ファイル** / 箱庭東京データ / 実況コピー |
| ワールド | `src/world/objects.js` `spatialHash.js` `spawner.js` `scaleManager.js` `curated.js`(v3) `terrain.js`(v3) | SoAストア / 空間ハッシュ / チャンクスポーナー / スケール管理 / キュレーションスポーナー / 地形 |
| 物理 | `src/physics/ballPhysics.js` `absorb.js` | ボール運動学 / 吸収・押し戻し判定 |
| 描画 | `src/render/renderer.js` `geometryFactory.js` `instances.js` `extraPools.js`(v3) `ball.js` `cameraRig.js` `environment.js` `effects.js` `backdrop.js`(v2) `goalTower.js`(v3) | レンダラ / ジオメトリ生成 / InstancedMeshプール / BatchedMeshプール / 塊本体 / カメラ / 空・フォグ / エフェクト / 遠景 / スカイツリー |
| ゲーム | `src/game/finale.js`(v2) `runStats.js`(v2) `collection.js`(v3) | フィナーレ状態機械 / タイム・スコア・ランク / コレクション図鑑 |
| 入出力 | `src/input/input.js` / `src/audio/sfx.js` `bgm.js`(v2) / `src/ui/hud.js` `screens.js` `donack.js`(v3) | 入力正規化 / 合成SE / 合成BGM / HUD / タイトル・リザルト / ドナック実況 |

### フレームループ順序（v3最終形・BINDING）

main.js ヘッダコメントと同一。**プレーンな関数呼び出し**であり、イベントではない（順序が契約）。

<!-- DIAGRAM: frame-order -->
*（図: フレームループのフローチャート — 入力読み取り→固定ステップ(物理+地形+吸収)→スポーナー2系統→スケール管理→フィナーレ→塊更新→カメラ/環境/エフェクト→sim時間積算→フラッシュ&描画 の縦フロー。finale.inputLocked / cameraOwned のゲート分岐を脇に描く）*

```
1    intent = input.read()              // inputLocked時はゼロ化
2    while (accumulator >= 1/60, max3):
        ballPhys.step(dt, intent, yaw)  // terrain.collide を内包(v3)
        absorb.resolve(...)             // inputLocked時スキップ
3    spawner.update(...); curated.update(...)   // 同上ゲート
4    scaleMgr.maybeTierUp(...); scaleMgr.maybeRebase(...)
4.5  finale.update(frameDt, ballState)  // 接触判定・シネマカメラ(v2+)
5    ball.update(dt)                    // アタッチアニメ・埋没カリング
6    cameraRig.update(...)              // cameraOwned時はfinaleが駆動
     env.update(); backdrop.update(); effects.update()
6.5  runStats.addSimTime(steps * FIXED_DT)      // (v2+)
7    instances.flush(); renderer.render()        // HUDはイベント駆動
```

<!-- ACCORDION: 並列開発を可能にした「契約凍結」の仕組み -->
各バージョンの実装は「Phase 0（リード約半日〜1日）→ 5並列ストリーム → 統合」で行われた。
Phase 0 が凍結するもの: `types.js` のJSDoc型 / `events.js` のイベント名+ペイロード形 / `tuning.js` の全定数 /
`tiers.js` のティア・アーキタイプID / `index.html` のDOM id / `main.js` のフレーム順序スケルトン。
各ストリームはファイル単位でゼロオーバーラップに分割され、main.js は統合者しか触れない。
クロスストリーム例外（v3では scaleManager の GOAL_RADIUS_M 直接import、ballPhysics の terrain 注入の2件）は
すべて設計書の例外台帳に明記される。v3 ではさらに `@deprecated MOON_*` エイリアス層を Phase 0 が用意し、
移行中もビルドが壊れない構造（退役は `grep -rn 'MOON_' src` == 0 のゲートで統合者が最後に実施）。
<!-- /ACCORDION -->

---

<!-- SECTION: scale-system -->
## 2. スケールシステム — 相似変換リスケールとシームレスネス法

### 何を / なぜ

塊が5桁成長してもFloat32精度と60fpsを保つため、**2つの数値系**を分離した:

- **(a) シミュレーション単位**: 物理・座標・描画行列のすべて。ボール半径は常に `[0.5, 2.5]` の帯域、ワールド座標は常に ±2048 sim 以内 → どのスケールでもFloat32仮数精度がフルに使える（ジッタなし）。
- **(b) 実寸メートル**: 表示専用。`trueRadius = simRadius × worldScale`。`worldScale` は ScaleManager が持つただのJS double。

### リスケール（=ティア昇格）の仕組み

`simRadius >= 2.5` に達したフレームの **物理更新と描画の間** に、1フレームで一様相似変換 `S = 0.2` を適用する:

<!-- DIAGRAM: rescale -->
*（図: リスケールの前後比較 — 左「世界が大きくなりすぎた状態(ボール半径2.5)」右「全体を1/5に縮めた状態(半径0.5)」。カメラから見た画は両者で完全に同一であることを示す重ね合わせ表現）*

```
worldScale /= S                       // 実寸の辻褄はdouble側で合わせる
ball の pos/radius/vel *= S           // 角速度はスケール不変
全生存オブジェクト(~4000)の px/py/pz/radius *= S   // SoA密ループ <0.3ms
ballGroup.scale *= S                  // くっ付き済みオブジェクトはボール子階層なので自動追従
空間ハッシュ3つを再構築
インスタンス行列を一括書き直し（meshごとに needsUpdate 1回）
フォグ/ライト/影/カメラスプリング状態 *= S
```

これは一様相似変換であり、**すべての視覚量が半径比例**なので、リスケールしたフレームはしなかったフレームとピクセル同一に描画される。
dev では強制リスケールキー + スクリーンショット差分で恒常的に検証される。

### シームレスネス法（構造的ルール）

「閾値で何かがポップする」ことを**構造的に不可能**にする法則:

- 吸収可能判定 `objR <= 0.65 × ballR`、カメラ距離 `6.5r`・高さ `3.2r`、フォグ `14r/55r`、速度上限 `8.5r/s`、サブピクセル消滅 `objD < 0.04 × ballR` — すべて**半径の連続関数**で、tierIndex を一切参照しない。
- tierIndex（実寸半径から導出、±10%ヒステリシス）が駆動してよいのは: スポーン内容帯・空/フォグパレットの2秒クロスフェード・HUD表記単位・お祝い演出（FOVキック+アルペジオ+バナー）**のみ**。
- 補助ガードとして**フローティングオリジン**: `|ball.pos| > 1500 sim` で全座標からボール位置を整数スナップで減算（チャンクキーと消費ビットマスクはシフト前のグローバル座標を維持し決定論を守る）。

関連: `src/world/scaleManager.js` `src/config/tiers.js` `src/config/tuning.js`

<!-- ACCORDION: ティア表の変遷（v1: 6ティア5cm→750m / v3: 7ティア2cm→634m） -->
**v1/v2（6ティア、×5/ティア）**: T0 Desk 5cm–25cm / T1 Room –1.25m / T2 Street –6m / T3 Town –30m / T4 City –150m / T5 Skyline –750m。
v1 は 500m でWINバナー、v2 は 420m で「月が呼ぶ」→500m で月降臨。

**v3（7ティア、開始0.02m）**: T0 パーツ棚 0.02m / T1 ショップ 0.10m / T2 電気街 0.50m / T3 下町 2.5m / T4 都心 12m / T5 大東京 60m / T6 スカイライン 300m。
リスケール梯子（実寸 0.1/0.5/2.5/12.5/62.5/312.5m）は不変。GOAL_CALL 380m → GOAL_RADIUS 420m で接触アーム。
ペーシングの単一真実: 典型初回クリア5:30–6:30、最適~3:30–4:00（Phase-3 実測リチューン済み）。
<!-- /ACCORDION -->

---

<!-- SECTION: physics -->
## 3. 物理 — 自作アーケード物理と空間ハッシュ

### 何を / なぜ

物理ライブラリは**不採用**（3提案全会一致）。rapier3d は ~1.7MB wasm でリスケール時の全ボディのテレポートスケーリングと相性最悪、
cannon-es は1k超ボディでJSソルバが遅くアーケード調整と衝突する。このゲームの動体は**ボール1個だけ**
（解析平面 y=0 上のキネマティック球）で、他はすべて吸収されるまで静的バウンディング球 —— 約400行・依存ゼロ・シードPRNGと併せて決定論的。

### どう実装したか

- **タイムステップ**: 固定60Hz + アキュムレータ、上限3サブステップ（可変dtとトンネリングパッチは却下）。
- **ボール運動**: 加速 `22r`（v3で `ACCEL_K=45`）、速度上限 `8.5r`、摩擦 `vel *= 0.92^(dt·60)` — 全部半径比例なので、どのスケールでも画面上の操作感が同一。
- **滑りなし転がり**（操作感の生命線）: `axis = up × v̂`, `angle = |v|·dt / r` の四元数積分。スクラッチ四元数でゼロアロケーション。
- **質量感**: 吸収のたびに加速度×0.97の鈍りを1.5秒かけて回復。地面接地はわずかなオーバーシュート付きyスプリング（吸収時の「ポン」）。
- **ブロードフェーズ**: **生存ティア帯ごとに1つ、計3つの空間ハッシュ**。実装はフラット型付き配列
  （counting sort による `cellStart Int32Array` + `cellEntries Int32Array`、2Dハッシュキー `((xi·73856093)^(zi·19349663))&16383`、
  トゥームストーン削除+25%超で日和見再構築）。ティア間で25倍のサイズ差があってもクエリ範囲が常にタイトに保たれる。
  オブジェクトは静的なので「スポーン時insert・吸収/消滅時remove」だけ — フレーム毎メンテナンスはゼロ。
- **ナローフェーズ**: 3ハッシュへ `queryBall`（事前確保Int32スクラッチ、~9–25セル、5–40候補、数マイクロ秒）。
  各オーバーラップで `objR <= 0.65·ballR` なら**吸収**、それ以外は**押し戻し**
  （接触法線方向に位置補正+法線速度×0.35反射）。衝突速度が `0.7×速度上限` を超えると bonk →
  カメラ微シェイク+合成クロンク音+**ノックオフ**（最新のくっ付きオブジェクト1–3個を弾道放出して再吸収可能に戻す。
  塊魂らしさの肝で、物理が自作だから自明に実装できる）。
- **GC**: SoAストア（`px/py/pz/radius` Float32Array(8192)、`archetype` U16、`tierOf/flags` U8、`instanceSlot` I32、フリーリスト）+
  モジュールレベルのスクラッチベクトル + 再利用イベントペイロードでフレーム毎アロケーションゼロ。

v3 追加: `world/terrain.js` の **CityTerrain** — ショップの壁/棚（円vs AABB判定、半径4.0mで一斉解除）、
スカイツリー基部の恒久円コライダ（r=54m実寸、絶対に吸収されない）、マップ境界クランプ+ 4r ソフト減速帯。

関連: `src/physics/ballPhysics.js` `src/physics/absorb.js` `src/world/spatialHash.js` `src/world/objects.js` `src/world/terrain.js`

---

<!-- SECTION: rendering -->
## 4. レンダリング — InstancedMeshプールとドローコール台帳

### 何を / なぜ

数千オブジェクトを統合GPUで60fps描画するため、**ドローコールを台帳で管理**し、マテリアル3種・シャドウマップなしに徹底。
すべてのスポーン/フェード/消滅遷移は**行列スケールのアニメーション**で表現し、不透明度（=ソート発生）は一切使わない。

### ドローコール台帳（正直な最悪値で管理）

| バージョン | 内訳 | 最悪値 / 上限 |
|---|---|---|
| v1 | 8アーキタイプ×3ティア=24ワールド + 8スタック + ボール/地面/空/影 + エフェクト~3 | 〜38 / **55** |
| v2 | 4帯遷移窓 40ワールド + 8スタック + 固定6（月本体+グロー含む）+ 遠景1 | 56 / **60** |
| v3 | 40 + 8 + 固定6 + 遠景1 + スカイツリー2 + 地形1 + 水面/岸壁2 + EXTRAプール4 | 64 / **72** |

### どう実装したか

- **InstancedPool**（`render/instances.js`）: (アーキタイプ, ティア) ごとに容量128–512のプール。
  死スロットは**ゼロスケール行列**（スワップ圧縮より単純、縮退三角形はラスタ前に棄却される）。
  `DynamicDrawUsage` + r177 の `updateRanges` で部分アップロード、meshごとに needsUpdate は毎フレーム最大1回、書き込み≦64インスタンス/フレーム。
  `frustumCulled=false` — カリングはゲームプレイ駆動（スポーンリングが生存集合を限定し、フォグ 14r/55r が両端を隠す）。
- **ジオメトリ**: 各アーキタイプは2–6個の低分割プリミティブを頂点カラー込みで事前マージした複合体（≦350tris）。
  起動時にタイトル画面の裏で全アーキタイプを一括生成（~80ms）。マテリアルは Lambert(vertexColors) / 地面+空のShaderMaterial / 影のBasic の3つだけ。
- **くっ付きオブジェクト**: 吸収時に 0.15s のアタッチアニメ（ボール表面ソケットへ lerp + 1.15→1.0 スカッシュ）後、
  ボール子階層の8スタックプール（512リングバッファ）へ移管。行列は**アタッチ時に1回だけ**ボールローカル座標で書く
  （8%埋め込み）— 以後500個くっ付いていてもフレーム毎コストは親の行列乗算1回。
  完全に下層へ埋もれた・相対2%未満になったオブジェクトは**埋没カリング**でスロット回収（~1秒に分散し脱皮が見えない）。
  ランタイムのジオメトリマージは一切なし → ベイクスパイクなし。
- **ボールコア**: 頂点シェーダノイズ変位付きicosphere。変位量は累計吸収数で増加、ベース色は吸収色へ10%ずつlerp —
  リングバッファの回転を「塊が履歴を覚えている」見た目で覆う。
- **カメラ**（`render/cameraRig.js`、操作感の中核）: 距離`6.5r`/高さ`3.2r`+速度×0.4の先読み注視を臨界減衰スプリングで追従。
  スプリングの**遅れ自体が成長フィードバック**（大物を吸うと世界が0.5秒かけて引いて見える）。FOVはティア昇格・ダッシュ・高速時にキック。
  スプリング状態はsim空間に置き、リスケール時に S を掛ける（恒等変換保証の一部）。
  v3で屋内プロファイル（距離×0.62/高さ×1.4を interiorAt01 でクロスフェード）+ 壁ブームクランプを注入。
- **BatchedMesh（v3）**: ランドマーク・コレクティブル等のEXTRAアーキタイプ（コード70..92）は
  **サイズクラス別4つの共有プール**を `THREE.BatchedMesh` で実装（`render/extraPools.js`）。
  1プール=異種ジオメトリ混載で1ドローコール — InstancedMesh では不可能な「雷門と西郷像を同じプールから」を実現し、
  ワーストでもフラット+4ドローに収めた。
- **動的解像度ガバナ**: 3秒移動平均フレームタイム>17msでpixelRatioを1.0へ向けて低下（上限はmin(dpr,1.5)）。

関連: `src/render/instances.js` `extraPools.js` `ball.js` `cameraRig.js` `environment.js` `geometryFactory.js` `renderer.js`

<!-- ACCORDION: なぜシャドウマップを捨ててブロブシャドウにしたか -->
ライトはヘミスフィア+ディレクショナルの2灯のみで、影は canvas のラジアルグラデーションを貼った Basic マテリアルのデカール1枚。
シャドウマップはレンダーパスが丸ごと1本増える上に、5桁のスケール変化に対してカスケード設定が破綻する。
ブロブシャドウは半径比例でスケールするだけなので**どのスケールでも読みやすく**、リスケールのピクセル同一性も自明に保たれる。
v2 の空（太陽・月・星・雲）はすべてスカイドームのフラグメントシェーダ内で完結し（方向ベースの計算なのでリスケール不変）、
ドローコール増加ゼロで実装された。
<!-- /ACCORDION -->

---

<!-- SECTION: world-gen -->
## 5. ワールド生成 — チャンクスポーナーとキュレーションの併存

### 何を / なぜ

v1/v2 は無限平面の**決定論的チャンク生成**のみ。v3 で「実在の東京を再現した有限の箱庭」が要件になり、
手続き生成（チャンク）と手作業配置（キュレーション）を**同じ ObjectStore 上で共存**させる必要が生じた。
2つのスポーナーがスロットの所有権を取り違えると即メモリ破壊級のバグになるため、所有権プロトコルを Phase 0 で凍結した。

### チャンクスポーナー（v1から継続）

- ティアごとに32 sim単位のチャンクグリッド。チャンク `(cx, cz, tier)` の内容は `mulberry32(hash(worldSeed, cx, cz, tier))` の**純関数**
  （ジッタ付きサブグリッド配置、重み付きアーキタイプ、サイズ/ヨー/パレットのロール）。同じチャンクは常に同一再生成され、
  吸収済みは消費ビットマスク（`Map<chunkKey, Uint32Array>`）で記憶。
- 毎フレーム: 欲しいチャンク集合と読込済み集合をdiff → リングキューへ → **≦64スポーン+64デスポーン/フレームに償却**、進行方向優先。
  スポーンはフォグ遠面（55r < 読込半径96sim）の外で実体化するので見えない。
- ティア引き継ぎ: 閾値の70%で次々ティアのチャンクをフォグの外にプリウォーム。古いティアの残骸はサブピクセル則
  （`objD < 0.04·ballR`、200個/フレームのラウンドロビン掃引）で**個別に**排水 — 一斉削除フレームが存在しない。
- v3 のゾーンマスク: 決定論ドロー完了後に `cityMap.bandAllowedAt(xReal, zReal, band)` で棄却するだけ
  （約20個の軸平行ゾーン矩形の静的参照）。チャンク内容の純関数性は保たれる。密度は `DENSITY_K_BY_BAND = [0.45,0.45,0.3,0.3,0.2,0.2,0.15]`。

### キュレーションスポーナー（v3新規 `world/curated.js`）

約370の固定配置（ショップ内装240 + 街路70 + 出口導線22 + 街区装飾~38）+ ランドマーク11 + コレクティブル12 + ショップ外殻を所有。
データは `src/config/cityMap.js`（実寸メートル）にあり、`mulberry32(0x544f4b59)` で展開 — **シード非依存**なので
ランドマーク/コレクティブルは全プレイで同一位置（チャンクフィラーだけが `?seed=` で変わる）。

<!-- DIAGRAM: spawn-ownership -->
*（図: 2スポーナー所有権 — 中央に共有ObjectStore(8192スロット)を置き、左からチャンクスポーナー、右からCuratedSpawnerが各自のスロットにフラグ(FLAG_CURATED=16)で旗を立てる図。下にABSORB購読順チェーン: chunk→curated→ball→runStats→collection→sfx/effects/hud）*

**FLAG_CURATED 所有権プロトコル（凍結）**:

- `FLAG_CURATED = 16`（flags U8: ALIVE 1 / FADING 2 / TOMB 4 / RARE 8 / CURATED 16）。
  チャンク側の `_onAbsorb` / サブピクセル掃引 / `_despawnIndex` / 残骸掃除は旗付きスロットを**1ビットテストで全スキップ**。
  devでは300フレームごとに `spawner.aliveCount + curated.aliveCount === store.aliveCount` の恒等式をassert。
- **動的リバンディング**: 各キュレーション配置は naturalBand を持ち、起動時と毎 TIER_UP に
  `tierOf = clamp(naturalBand, tier-1, tier+1)` へ再スタンプ（既存の64/フレーム償却に同乗）。
  これにより T1 の玉でも雷門から押し戻しを受け、T5 の玉でもハチ公を吸える — キュレーション物は**常に衝突/吸収可能**。
- **スロット強奪規約**: render/ball のアタッチハンドラはワールドインスタンスを奪って飛び付きアニメに使う際
  `store.instanceSlot[i] = -1` を書く。CuratedSpawner は ABSORB ハンドラ内で instanceSlot を**読んではならず**、
  自分の消費ビットマスクだけ見て、スロット清掃は次の update() に遅延する（凍結された購読順がこの規約を成立させる）。
- **ノックオフ**: コード≧70（EXTRA=ランドマーク/コレクティブル）は永久にくっ付いたまま剥がれない。
  チャンク系コードの再注入は FLAG_CURATED|FLAG_RARE を剥がして既存経路へ（スコアは初回吸収時のみ、二重計上なし）。

### レアアイテム（v2導入）

`_spawnPlacement` で全配置に対し rareRoll を**最後に無条件で**ドロー（決定論契約を維持）。`RARE_CHANCE=0.002` で
金色ティント+1.15倍スケール+`FLAG_RARE`。生存レアは `(storeIdx, slotGen)` ペアの Int32Array で追跡し、
effects が金色のきらめきをポーリング。同シード=同レア配置。

関連: `src/world/spawner.js` `curated.js` `objects.js` `src/config/cityMap.js`

<!-- ACCORDION: 箱庭東京マップの構造とバリデータ -->
マップは 3.6×3.8km の矩形（`MAP_BOUNDS x[-1800,1800] z[-1800,2000]`、単一ソースは tuning.js）。
**原点=ボール開始点**（BallPhysics.reset のハードコード (0,r,0) をそのまま正にする設計判断）。
開始地点は屋根なし・全面開口のアキバパーツ館（6×8m、ドールハウス的フィクション）: 壁5枚+棚/カウンター等プリズム4個だけが
authored衝突で、**全世界に段差ゼロ**（h=0）— 「床の意味論」系の批評クラスを構造的に表現不能にした。
半径4.0mで地形一斉解除（壁0.6sフェード+棚上アイテムのy降下lerp+カメラクランプ解除の単発構造ハンドオフ、文書化例外）。

ランドマーク11基は約1:5圧縮の地理忠実配置（ハチ公1.85m→西郷像6.2m→雷門10.8m→ラジオ会館37m→109 43m→ドーム85m→
東京駅135m→議事堂215m→レインボーブリッジ231m→**東京タワー262m**の吸収閾値ラダー。東京タワーのGROWTH_K=10ジャンプ
262→406mがフィナーレ帯への公式ランプ）。スカイツリーはストアに存在せず接触フィナーレ専用。

`validateCityMap()` がブートで検証するもの: 通路最低幅1.1m / ボール開始クリアランスと出口レーン / 棚アイテムの3D到達不等式 /
ショップが密閉不能であること（最大到達半径 < ゲート半径の半分）/ 出口導線の成長チェーン（出口半径0.10–0.4mで150m以内に
吸収可能物≧8）/ ランドマークラダーの単調増加 / `SKYTREE_COLLIDER_K(0.6) < GOAL_CONTACT_PAD(0.85)`（フィナーレが必ず勝つ）。
<!-- /ACCORDION -->

---

<!-- SECTION: game-systems -->
## 6. ゲームシステム — 成長式・ダッシュ・スコア/ランク

### 成長式と growthKForObjR テーパー

基本式（v1から）: 吸収時 `newR = cbrt(R³ + K·r³)`、`ABSORB_RATIO = 0.65`、`GROWTH_K = 10`。
見た目の半径は ≦1.5r/s でスルー（大物を吸うと「段差」でなく「膨らむ」）。

**v3 の臨界ペーシング修正**: K=10 と吸収比0.65の組合せは、閾値ギリギリの吸収1回で半径×1.554、
捕獲レートは ~R² でスケールするため、同帯域の供給が連続している場所では成長が**超指数的**になる
（実測で秋葉原にて 4m→117m を3秒の暴走）。修正は**オブジェクト実半径の連続関数**による有効K のテーパー
（`src/config/tuning.js:353`）:

```js
export function growthKForObjR(objRealM) {
  if (objRealM <= GROWTH_NORM_REF_M /*0.1m*/) return GROWTH_K;        // 10
  const k = GROWTH_K * Math.pow(GROWTH_NORM_REF_M / objRealM, GROWTH_NORM_POW /*0.65*/);
  return k < GROWTH_K_FLOOR /*2*/ ? GROWTH_K_FLOOR : k;
}
```

- ≦0.1m は K=10 のまま（ショップ内の authored ~60秒予算を保護）、~3.6m以上で床値2へ漸減。
- **連続関数なのでシームレスネス法に適合**（ティアゲートではない）。
- 例外: ランドマーク/コレクティブルのキュレーションスロットは absorb.js で除外され K=10 を維持
  （東京タワー262→406mを含む authored ラダーの×1.554ジャンプは設計どおり残る）。
- ペアの密度調整 `DENSITY_K_BY_BAND` と合わせて Phase-3 で実走検証（最適走243秒の実測にランクを合わせた）。

関連: `src/config/tuning.js` `src/physics/absorb.js:239-246` `src/world/spawner.js:801`

### ダッシュ（v2導入）

ゲージ式（`dashGauge01` 開始1.0、`dt/4.0s` で回復+吸収ごとに+0.03）。発動で速度上限×2.2・加速×1.8 が0.8秒、
インパルス `7.0×r` を速度方向（低速時はカメラ前方）へ。ゲージ/タイマーは無次元/秒なので**リスケール不変、フックは不要**。
演出はイベント駆動: FOV+8°キック、スピードライン10本、合成 whoosh、HUDゲージリング即ゼロ。

### タイム・スコア・ランク（v2導入 `game/runStats.js`）

- **SIM時間が公式時計**: `runStats.addSimTime(steps × FIXED_DT)` の積算。低速端末では壁時計上ゆっくり進むが、
  シミュレート秒あたりの成果は決定論的 — ランクが端末性能に依存しない。
- スコア: `objScore = max(1, round(100 × sizeReal^1.4))` × コンボ係数 `min(1+0.10(combo-1), 3.0)`。
  レア+5000 / ランドマーク+8000(v3) / ゴール+20000 + タイムボーナス（240sフル→600sゼロのlerp）。
- ランク（v3、実測ベース）: S≦240 / A≦330 / B≦450 / C≦600 sim秒 / else D。
- リザルト: 段階CSSリビール（タイム→スコアカウントアップ→サイズ→ランクスタンプ→コレクション図鑑→NEW RECORD）+
  X intent URL は EVT.GOAL キャッシュ時に**1回だけ**構築し、クリックは同期ジェスチャで `window.open || location.href`。

関連: `src/game/runStats.js` `src/physics/ballPhysics.js` `src/ui/screens.js`

---

<!-- SECTION: audio -->
## 7. オーディオ — 完全合成BGMとSE

### 何を / なぜ

音声アセットはゼロ。SE（v1）も BGM（v2）も WebAudio でリアルタイム合成する。
これは「ホットパスのゼロアロケーション法」に対する唯一の**有界例外**（≦60短命ノード/秒、
高コスト確保は初期化時にホイスト: ハット/シェイカー/whoosh 用ノイズ AudioBuffer は1個を永続共有、PeriodicWave は init 時生成）。

### BGMスケジューラ（`src/audio/bgm.js`）

- 標準の**2クロック・ルックアヘッド**方式: `setInterval(25ms)` のティックが `ctx.currentTime + 0.12s` 先までノートをスケジュール。
  bgm.js 内で **setTimeout は禁止** — ダッキング・停止・レイヤフェードなどすべてのゲイン操作は
  `setTargetAtTime / linearRampToValueAtTime` で ctx 時間にスケジュールする。
- 楽曲: 128BPM スウィング8分・4小節ループ・Aメジャー・16小節コード循環 |AM7|D9|F#m7|E7sus4→E7| のボサポップ。
  チェーン: layerGains → bgmMaster(0.32) → DynamicsCompressor → destination。
- **ティア解放レイヤ**（cosmetic-only法に適合、TIER_UPで1.5sフェードイン）:
  L0 ベース+キック+リムショット → L1 オフビートコードスタブ+ハイハット → L2 ペンタトニックリード → L3 シェイカー+スパークルアルペジオ。
  v3 は7ティアに再キー（L1 t≧2 / L2 t≧3 / L3 t≧5）。
- **タブ可視性**: hidden でティック停止+`ctx.suspend()`、復帰で `ctx.resume()` + `nextNoteTime` 再アンカー
  （逃した拍はスキップ、バーストキャッチアップは絶対にしない）。
- ミュートの単一真実は main.js（'M'キー or HUDボタン → 両コンテキストへ setMuted + localStorage 永続 + MUTE_CHANGED）。
  setMuted(true) はゲイン0でなく**ノード生成自体を停止**してノード予算を守る。Bgm は sfx と別の自前 AudioContext を持ち、
  ジェスチャ起動は START タップ（iOS実機検証済み）。

### SE（`src/audio/sfx.js`）

すべてオシレータ+ノイズの合成: ピッチ上昇する吸収コンボブリップ / bonk クロンク / ロールループ / ティアアップ・アルペジオ /
ダッシュ whoosh（ノイズのバンドパススイープ300→2400Hz）/ レア5音グリス / ランドマークファンファーレ（v3）/
接触グランドファンファーレ8音+AM9パッド / ランクスタンプの70Hzサイン thud（GAME_WIN の **+1.6s を ctx 時間で**予約し、
CSSのスタンプ演出 1600ms と正確に同期）。デュアルタグ（ハチ公=ランドマーク+コレクティブル）が同フレームで発火した場合は
コレクトグリスを抑制してファンファーレのみ鳴らす。

関連: `src/audio/bgm.js` `src/audio/sfx.js`

---

<!-- SECTION: finale -->
## 8. フィナーレ — スカイツリー状態機械

### 何を / なぜ

v2 で「ゴール=月との接触シネマ」を導入する際、ScaleManager の WIN ラッチを撤去し、ゲーム終了の唯一の経路を
`game/finale.js` の小さな状態機械に集約した。v3 はこれを**機械ごと再テーマ**（月→固定位置のスカイツリー、降下フェーズ削除）。

<!-- DIAGRAM: finale-states -->
*（図: フィナーレ状態遷移図 — idle → called(380m) → approach → contact → merge → ascension → afterglow → done の横一列遷移。contact以降に inputLocked / cameraOwned のフラグが立つ帯を下に重ねる。v2では called と approach の間に descent/landed があった旨を脚注）*

### 状態と各フェーズの実装（v3）

| 状態 | トリガ / 内容 |
|---|---|
| idle | trueRadius < 380m。devウォッチドッグ: ゴール×1.2を超えても idle なら console.error + 強制遷移（終了経路が死ぬバグへの保険） |
| called | ≧380m で1回。EVT.GOAL_CALL → HUDトースト・スカイツリービームパルス・BGMシマー。純コスメ |
| approach | ゲームプレイ完全継続。finale が10HzでスカイツリーをNDC投影し EVT.GOAL_GUIDE → 画面端🗼矢印 |
| contact | `dist ≤ ballR + towerR×0.85` の描画フレーム判定 = クリアタイム確定の瞬間。EVT.GOAL_CONTACT → runStats凍結+リザルト計算、BGMダック→停止、ファンファーレ、HUD全隠し、白フラッシュ。**ここから inputLocked / cameraOwned が true** |
| merge | 1.2s。finale が ball.pos を直接 lerp（intentはゼロ化済みで物理と喧嘩しない）、0.6s でボール非表示 |
| ascension | 5.0s。タワーが `+40r` までイーズ上昇、`env.beginNightFade(5.0)` で夜パレットへ、金色スパークル噴水。カメラは毎フレーム導出のターゲットで `cameraRig.cinematicUpdate`（**キャッシュゼロ=リスケール安全**） |
| afterglow | 2.5s 余韻 → done。main.js（GAME_WIN の唯一のemitter）がリザルトへ |

### リスケール/リベース安全性の設計

フィナーレ中も rescale/rebase は起こり得る（contact 以降は成長凍結でrescale不可、rebaseはスキップ）。
sim空間の数値をキャッシュしてよい場所は **`_simCache` 構造体ただ1つ**（v3: towerX/Z, towerR, mergeFrom*, ascendBaseY）で、
finale 自身が EVT.RESCALE（全フィールド×S）/ EVT.REBASE（X/Z -= shift）を購読する。それ以外のカメラターゲット等は
**毎フレーム現在ポーズから導出**。新しい状態フィールドは「_simCache に入れるか毎フレーム導出するか」の二択が規約。
`goalTower.js` / `terrain.js` も同型の自前購読を持つ。

### スカイツリーの2表現ハンドオフ

worldScale < 0.2 の間、スカイツリーは environment.js の**スカイドームシェーダ内のシルエット**（uGoalSil* ユニフォーム、
方位を SKYTREE_POS から毎フレーム再計算）として描画され、ゲーム開始の1フレーム目から航法アンカーになる。
simDist < 0.8×CAMERA_FAR に入った最初のフレームで、v2 の月で実証済みの**角サイズ・方向一致クロスフェード**により
`render/goalTower.js` の実メッシュ（~1400tris、fog:false の空要素例外、2ドロー）へ引き継ぐ — ポップが原理的に起きない。

関連: `src/game/finale.js` `src/render/goalTower.js` `src/render/environment.js` `src/render/cameraRig.js`

<!-- ACCORDION: v2 月フィナーレとの差分（descent/landed の削除） -->
v2 の状態列は idle→called(420m)→**descent**(500m)→**landed**→contact→merge→ascension→afterglow→done。
月は空のシェーダディスクとして序盤から見えており、降下開始時に「カメラ位置 + 月方向 × (月半径/tan(角サイズ))」で
メッシュの角サイズと画面方向をシェーダディスクに正確に一致させてから 2.0s クロスフェード — 月が6秒かけて
ボール前方 `45r` へ降りてきて着地し、ソフトマグネット（入力を上書きしない速度バイアス）で誘導していた。
v3 はゴールが世界に固定されたので降下の数学を丸ごと削除し、called/approach/contact 以降の演出機械
（夜フェード・シネマカメラ・フラッシュ・リザルト段階表示）を逐語的に再利用した。
状態機械・_simCache・ハンドオフという**構造**が再テーマのコストを1ストリームに閉じ込めた好例。
<!-- /ACCORDION -->

---

<!-- SECTION: mobile-ui -->
## 9. モバイルUI — バンドレイアウト

### 何を / なぜ

v2 までの「四隅パネル」HUDはスマホ縦持ちで重なりが発生していた（オーナーの主用端末はスマホ）。
v3 で **モバイルファーストに全面書き直し**: ベーススタイルが≦480px縦持ちで、768px以上と横持ちは@mediaの「追加装飾」。

### バンド重なり解決マトリクス（binding）

画面を横帯に分割し、**各要素は自分の帯の外に置いてはならない**というルールで重なりを構造的に排除:

| 帯 | 占有者 |
|---|---|
| 上端ストリップ | #top-bar（サイズピル+タイマー+スコアピル+ミュート）→ その下に進捗バー |
| 中段左 | ドナック（アバター+吹き出し） |
| 中段中央 | トースト(74px) / ティアバナー(30vh) / スコアフロート(44vh〜上昇) |
| 中段右 | コレクションポップアップ（トーストの反対側 — 構造的に非重複） |
| 下段左 65%×55% | ジョイスティック専有（動的アンカー出現域） |
| 下段右 | ダッシュボタン専有（76px、サムターゲット） |

### 実装の要点

- 全固定要素は `env(safe-area-inset-*)` のCSS変数でアンカー（ノッチ/ホームバー対応）。
  360px幅での収まりは設計書内で**ピクセル算術の証明付き**（104+64+120+36+ギャップ+マージン=358px）。
- タイマーはモバイル `m:ss`（デシ秒はデスクトップのみ、上限99:59表示）。
- **ダッシュゲージはリング化**: `#dash-button::before` の conic-gradient + radial-gradient マスク。
  `@property --gauge { syntax:'<angle>' }` 登録により10Hzの書き込みが0.12sで滑らかに補間（iOS16.4+/Chrome85+）。
  `@supports` フォールバックでconic非対応環境はボタン内の水平バーに自動降格（hud.js は `--gauge` と `--gauge01` の両方を書く）。
- `#donack-root` は **#hud の外（bodyの直下）**: GOAL_CONTACT のHUD全隠しを生き延びて昇天シーンの台詞を出すため。
- backdrop-filter のblurは768px未満で停止（Androidコンポジタ節約）。新規UIはすべてDOM/CSSで、GPU側予算（pixelRatio 1.5上限+ガバナ）に触れない。
- 出荷ゲート: 360/390/430縦+横のビューポートマトリクス + **実機 iOS / Android 各1台**のパスが必須。

関連: `index.html`（CSS本体）`src/ui/hud.js` `src/input/input.js`

---

<!-- SECTION: donack -->
## 10. ドナック実況 — トリガー優先度系

### 何を / なぜ

公式ピクセルアートキャラ「ドナック」（緑帽子のアヒル）が吹き出しでランドマーク豆知識・コツ・お祝いを実況する。
課題は**スパム化の防止**: イベントは秒間数十発生するが、吹き出しは平均20秒に1個以下に抑えたい。
解決は優先度+クールダウン+queue-of-1 の小さなスケジューラ。

### トリガー優先度系（`src/ui/donack.js`）

| 優先度 | トリガ | 最小間隔 |
|---|---|---|
| P3 | ランドマーク吸収・フィナーレ | 0（現在の吹き出しに割り込む） |
| P2 | コレクティブル・ティアアップ | 4s |
| P1 | カテゴリ初回吸収・コンボ≧15・ノックオフ・マップ端 | 8s |
| P0 | 行き詰まりヒント（10秒無吸収・ダッシュ12秒未使用） | 8s |

- **queue-of-1**: 保留スロットは1つだけで、最高優先度の候補のみ保持。同位以下の新着は捨てる。
- **デデュープ**: 各行IDは1ランに1回（tips系のみ30秒/IDのクールダウンで再可）。
- **フェーズゲート**: 内部フェーズ {title, play, cinematic, result}。P0–P2 は play のみ、
  昇天の台詞だけが cinematic、リザルト台詞だけが result で発火可能。GAME_RESET で全タイマー/キュー/デデュープをハードリセット。
- **デュアルタグ規約**: ハチ公（ランドマーク+コレクティブル両属性）は同フレームの COLLECT→LANDMARK に対し、
  統合された専用行 #42 のみを P3 で発火。
- 台詞は `src/config/donackLines.js` に**42行を凍結ID付きで** authored（ランドマーク豆知識12行を含む。
  例:「雷門の大提灯、重さ約700kgあるんだよ。いい重りだね」）。表情マップ: 豆知識→speaking / お祝い→happy / ヒント→thinking。

### アセット（ゼロアセット法の文書化例外 #2）

`public/assets/donack/` の **webp 8枚（~20KB）だけ**がデプロイ内の唯一のバイナリアセット
（{idle,happy,thinking,speaking}-{0,3}、120×90、自社ファーストパーティ資産）。
スプライトシート化もビルドパイプラインもなし — 表情=CSSクラス交換、まばたき=吹き出し表示中のみ動く4fpsのフレーム0/3トグル。
`scripts/verify-donack-assets.sh` が「ちょうど8ファイル・合計40KB以下・余剰なし」をCI/predeployで強制する。

関連: `src/ui/donack.js` `src/config/donackLines.js` `scripts/verify-donack-assets.sh` `public/assets/donack/`

---

<!-- SECTION: persistence -->
## 11. 永続化 — localStorage スキーマ

すべて try/catch + 形状バリデーション付き（プライベートモードや破損JSONで null を返し、絶対に throw しない）。

| キー | スキーマ | 規約 |
|---|---|---|
| `fableKatamari.v3.best` | `{v:1, bestTime:{timeS,score,rank,seed}, bestScore:{...}}` | サブレコードは各指標が更新されたとき**アトミックに丸ごと差し替え**（行内整合性、フィールド混在なし）。v2キーは退役 |
| `fableKatamari.v3.collection` | `{v:1, mask:int}` | **凍結整数ID（0..11）のビットマスク**をORで蓄積。IDは append-only（v3.1以降は12+を追記、再利用・並べ替え禁止、boot assertでunique且つ<31）。**未知の上位ビットは保存**（前方互換） |
| `fableKatamari.v3.muted` | boolean相当 | main.js が Bgm/Sfx 構築**前**に読み、initialMuted として注入（構築後のsetMutedは遅延コンテキストでno-opになる既知の穴を回避） |
| `fableKatamari.v3.donackOff` | boolean相当 | タイトル画面のトグルピルが永続化。OFF時は donack.js が全イベントを破棄 |

リセット所有権（v3凍結）: `main.resetWorld()` がスポーナー→ストア→プール→物理→finale→runStats→terrain→curated→
collection.resetRun の直接呼び出しチェーンを所有し、バス購読側（cameraRig / env / backdrop / donack / hud）は
GAME_RESET / GAME_START で自己リセットする。**localStorage の4キーはリセットの対象外**（周回を跨ぐのが目的）。

関連: `src/game/runStats.js` `src/game/collection.js` `src/main.js`

---

<!-- SECTION: version-diff -->
## 12. バージョン差分早見表

| 領域 | v1（基盤） | v2（月アップデート） | v3（箱庭東京） |
|---|---|---|---|
| ワールド | 無限平面・決定論チャンクのみ | 同左 + 巻き込めないランドマーク12種（アーキタイプ8→10/ティア） | **有限3.6×3.8km東京**・ゾーンマスク + CuratedSpawner（FLAG_CURATED・動的リバンディング） |
| スケール | 6ティア 5cm→750m・500mでWINバナー | 同ティア・420m月コール→500m降臨 | **7ティア 2cm→**・380mコール→420mアーム→**スカイツリー634m接触** |
| ゴール | ScaleManager の WIN ラッチ | **フィナーレ状態機械**（月降下→着地→接触→合体→昇天） | 同機械を再テーマ（降下削除・固定ゴール・シルエット⇔メッシュハンドオフ・基部恒久コライダ） |
| 成長 | `cbrt(R³+K·r³)` 一律 | 同左（K=10に調整） | **growthKForObjR テーパー**（K=10→床2、ランドマーク/コレクティブル除外）+ 帯別密度 |
| 操作 | WASD+タッチジョイスティック | **+ダッシュ**（ゲージ式、Space/ボタン） | 同左（ジョイスティック出現域・透明度を調整） |
| スコア | なし | **タイム/スコア/コンボ/レア/ランクS–D/X共有/自己ベスト** | ランク実測リチューン（S240）+ ランドマークボーナス + コレクション数 |
| 収集 | なし | ランダムレア（金ティント、スコアのみ） | **コレクション図鑑12種**（凍結ID・サムネイル・周回永続）+ ランダムレア併存 |
| 音 | 合成SEのみ | **+合成BGM**（ボサポップ・ティアレイヤ解放・2クロックスケジューラ）+ ミュート | 7ティア再キー + ランドマーク/コレクトSE |
| 空・遠景 | グラデーションドーム+フォグ | **太陽/月/星/雲のスカイシェーダ + 遠景シルエットリング + 夜フェード** | スカイツリーシルエットスロット + 東京湾の水面/岸壁 + 富士山遠景 |
| UI | HUD+タイトル/WIN | タイマー/スコア/ゲージ/トースト/月矢印/リザルト段階表示 | **モバイルファースト全面書き直し**（バンドマトリクス・ダッシュリング・セーフエリア）+ 巻き込み名フロート + 図鑑グリッド |
| キャラ | なし | なし | **ドナック実況**（webp8枚・42行・優先度+クールダウン） |
| 描画上限 | 55（典型~38） | 60（最悪56） | 72（最悪64、**BatchedMesh** EXTRAプール+4を含む） |
| 物理 | 自作400行・空間ハッシュ3面 | 不変 | + CityTerrain（ショップ壁/棚・スカイツリー基部・境界ソフト減速） |
| 永続化 | なし（?seed= URLのみ） | best / mute（v2キー） | best / mute / **collection** / donackOff（v3キー、図鑑はappend-only契約） |
| 例外台帳 | — | WebAudio有界アロケーション・月の fog:false・月メッシュ1280tris | + ドナックwebp・スカイツリー fog:false~1400tris・ブートサムネイル描画・ショップ地形リリース |

> シード互換性: ストライドや密度・ドロー列が変わるため、**v1/v2のシードURLは v3 では別の世界**を生む。同一ビルド内では従来どおり同シード=同世界（レア・ランドマーク配置含む）。

---

## 参考資料

- 確定設計書: [docs/DESIGN.md](https://github.com/aieo-product/fableDemoGame/blob/main/docs/DESIGN.md) / [DESIGN-V2.md](https://github.com/aieo-product/fableDemoGame/blob/main/docs/DESIGN-V2.md) / [DESIGN-V3.md](https://github.com/aieo-product/fableDemoGame/blob/main/docs/DESIGN-V3.md)
- 全作業ログ（各フェーズの意思決定・レビュー結果）: [docs/worklog/](https://github.com/aieo-product/fableDemoGame/tree/main/docs/worklog)
- プレイ: https://fable-katamari.pages.dev
