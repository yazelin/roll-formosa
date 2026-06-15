# Roll Formosa — Phase 1：台北關 設計文件

- 日期：2026-06-15
- 狀態：設計定案，待使用者複審 → 進實作規劃
- 作者：林亞澤 + Claude
- 參考來源：`aieo-product/fableDemoGame`（Fable Katamari，MIT）

---

## 1. 願景與定位

**Roll Formosa（福爾摩沙）** 是一款台灣風味的 Katamari（滾物成球）瀏覽器 3D 遊戲：玩家從一顆 2 公分的小球(圖釘尺度)開始,在台北街頭一路黏滾長大,從柑仔店桌頭的彈珠、夜市攤、機車海、街屋宮廟,最後滾成跨越信義區、撞上**台北 101** 的巨球。

產品以**縣市**為巡迴單位:台北首發,未來擴充台中、高雄、台南、彰化(八卦山大佛)等。更遠程可在最外圈包一層地球選單,台灣節點 zoom 進「Formosa 縣市地圖」,各國再成獨立 pack — 使用者最初「在地球上滾、收世界各國地標」的願景活在這一層。

整個層級地圖是**遞迴的**:地球 → 國家 → (可選)縣市 → 一關。**「縣市」與「國家」在程式上是同一個抽象**(一趟 pushpin→monument 滾動 + 一份 pack),所以未來世界版直接複用本期建立的 pack 架構。

### 本期(Phase 1)交付

一個完整可玩、可上線的**台北一關**:

- 圖釘(2 cm)→ 台北 101 的連續無縫滾動
- 程序化台北街景(不抓真實 OSM)
- 全繁體中文 UI + 旁白
- 吉祥物:台灣黑熊「月牙」(替換原版鴨子 Donack)
- 結尾鏡頭升空、拉遠成**福爾摩沙島** teaser(台北發光、其他縣市為「即將推出」暗點)

---

## 2. 範圍與非目標

### In scope（Phase 1）

1. Fork `fableDemoGame`,保留其無縫縮放引擎與物理。
2. 移除 v4 真實東京 OSM 整層。
3. 建立 `StagePack` 介面,把台北內容裝成一包;引擎暫時單包寫死指向台北。
4. 重寫內容:7 層階梯、可滾物件幾何、地標、終點 101、收藏冊、旁白(全繁中)。
5. 終點 monument 從晴空塔換成台北 101;結尾從「離開地球」改成「福爾摩沙島」teaser。
6. 台灣黑熊吉祥物(頭像 + 台詞)。
7. i18n 薄層 + 部署。

### Out of scope（留待 Phase 2 / 3，本期只留接縫）

- 縣市/國家**選單地圖**與 pack 載入器切換(P2)。
- 台中 / 高雄 / 台南 / 彰化(八卦山大佛)等其他縣市關(P2)。
- 地球選單與各國 packs、世界版(P3)。
- 解鎖/進度系統。

**本期必須留開的接縫**:① `StagePack` manifest 介面;② pack 範圍的 code 對照表(非全域凍結);③ 結尾的「島嶼/地圖 teaser」掛點(P2 把它變成可點選單)。

---

## 3. 背景:參考引擎的關鍵事實

實作者必須先理解原版這些「不可破壞的契約」,因為我們只動內容、不動引擎:

- **雙數系無縫縮放(王牌)**:所有物理/render 數學留在有界的「sim 單位」,一個 `worldScale` double 換算成「真實公尺」。當 `simRadius` 觸頂(`SIM_RADIUS_MAX=2.5`)就做一次**單幀 5 倍相似縮放**(`RESCALE_S=0.2`)+ 浮動原點 rebase,世界看起來連續長大而不會 pop。`1/RESCALE_S === SIM_RADIUS_MAX/SIM_RADIUS_MIN === 5` 由斷言鎖死,三個常數要一起改。
- **Seamlessness law**:`tierIndex` 只驅動「生成內容帶、天空/霧色、HUD 標籤、bgm、慶祝」。可吸收性、相機、霧、速度、despawn 一律是**ball radius 的連續函數**,永不參照 tierIndex。
- **尺度帶**:`START_RADIUS_M=0.02`;7 層 `enterTrueRadius` = 0.02 / 0.10 / 0.50 / 2.5 / 12 / 60 / 300 m。**恰好 7 層、恰好 70 個 chunk archetype id(10×7)** 由 dev 斷言鎖死。
- **終點寫死晴空塔**:`GOAL_RADIUS_M=420`、`GOAL_CALL_RADIUS_M=380`、`SKYTREE_BASE_R_M=90`、`GOAL_ASCEND_HEIGHT_K=40`;由 `render/goalTower.js`(SkytreeView)+ `cityMap.js` 的 `SKYTREE_POS` + `terrain.js` 永久底座 collider + `game/finale.js` 過場驅動。
- **Draw-call cap = 72**(原版誠實最壞 68);**zero per-frame allocation**;固定 60Hz;**決定性生成**(mulberry32 種子 `0x544f4b59` v4 / `0x56355041` v5)。
- **單一共用材質**:一顆 `MeshLambertMaterial({vertexColors:true})` 畫所有世界物件,rim 光經 `onBeforeCompile` 注入且只能依視線/法線(不可帶世界座標),否則破壞 rescale 像素一致性。
- **幾何規範**:`buildGeometry` 用 box/cyl/cone/sph/torus 等原始體手搭,`finish([...])` 合併並正規化到**單位包圍球**(instance scale = 放置半徑);三角面上限 350(hero 600)。
- **無 i18n**:所有字串是散落的日文字面值(`donackLines.js / hud.js / screens.js / tiers.js 名稱 / catalog.js displayNameJa / index.html`),數字用 `Intl.NumberFormat('ja-JP')`。

---

## 4. 架構

### 4.1 Fork 策略

- Fork `aieo-product/fableDemoGame`(MIT)。保留:`three.js` 引擎、`scaleManager`、`physics/{ballPhysics,absorb}`、`render/{objectMaterial,effects,instances,geometryFactory}`、`main.js` 迴圈骨架、`audio/*`、`ui/*` 機制(只換字串/吉祥物)。
- 授權:保留原作者 MIT(`aieo-product 2026`)並追加「林亞澤」copyright(衍生)。
- 移除 OSM 後不再附帶 OSM 資料 → **無 ODbL 義務**。

### 4.2 移除 v4 真實東京 OSM 層(乾淨刪除)

刪除/拆線下列(全部 Tokyo-only,程序化台北用不到):

- 檔案:`src/world/osmWorld.js`、`src/world/osmSpawner.js`、`src/world/osmGround.js`(若有)、`scripts/osm/` 整個、`data/osm-raw/` 整個、`public/assets/tokyo/` 整個。
- `package.json`:移除 `osm:fetch / osm:build / osm:verify` 與 `predeploy` 對它們的依賴。
- `main.js`:移除 OSM 載入/spawner 接線與 ABSORB 訂閱中的 osmSpawner。
- `cityMap.js`:移除 `setOsmCoverageActive` 覆蓋 latch。
- 碼表:回收/刪除 OSM archetype codes(94..109)、OSM pools、draw-call ledger 中的 2 個 OSM building batch + OSM ground + river。
- 對應 dev 斷言(碼總數、OSM 計數)同步調整。

> 結果:draw-call 預算從 68/72 大幅下降,給台北程序化內容留出充裕餘裕。Overpass 依賴與整套 ground-truth 距離斷言一併消失。

### 4.3 `StagePack` 介面(核心新增)

一個關 = 一份 pack 模組,放在 `src/packs/taipei/`。Manifest 形狀(欄位即現有資料表的「裝箱版」):

```
StagePack {
  id: 'taipei',
  displayName: '台北',
  region: 'TW',                       // 未來縣市/國家共用
  tiers:        [ TierDef × 7 ],       // 名稱(繁中)/enterTrueRadius/palette/archetypeIds[10]
  archetypes:   { id -> ArchetypeDef },// chunk + curated + collectible 幾何 + 繁中名
  map:          CityMapDef,            // zones / clusters / collectibles / shop interior / 地標座標(手寫 game m)
  landmarks:    [ LandmarkDef × N ],   // 含 goal 旗標
  goalMonument: MonumentDef,           // 台北101 模型 + pose + contact 半徑 + 結尾 toast
  ending:       EndingDef,             // 拉遠成福爾摩沙島 teaser 參數
  narration:    NarrationTable,        // 旁白 + tier-up + landmark 冷知識(繁中)
  mascot:       MascotDef,             // 台灣黑熊 頭像 frames + 台詞表
  locale:       LocaleStrings,         // 該包所有 UI 字串(繁中)
  seeds:        { primary, ... },      // 決定性生成種子
  validate():   void,                  // 每包自驗(取代 Tokyo 全域斷言)
}
```

設計原則:**每個 stage 自帶從圖釘到天際線的完整物件集**,不共用籠統的「台灣物件池」。日後台中/台南關連夜市、騎樓尺度的物件都不同。

### 4.4 凍結契約 → 每包自驗(本期主要引擎改動)

原版「恰好 7 tier / 恰好 70 id / 全域凍結 code 表 / Tokyo 距離 ground-truth」改成**由 active pack 內容推導 + 每包自己驗自己**:

- code↔id 對照表在**開機載入 pack 時建立**(pack-scoped),不再是全域 append-only 凍結表。
- 「7 tier / 每 tier 10 id / id 唯一」等斷言改為對 `pack.tiers` 驗證(仍鼓勵 7 層以維持 5 倍階梯)。
- `validateCityMap` 的硬編 11 地標數、Tokyo 距離窗口 → 改成台北版的 pack-local 斷言(地標數由 `pack.landmarks.length` 推導;距離斷言用台北手寫座標的合理窗口或放寬)。
- **存檔相容**:收藏冊 bitmask 在 pack 內維持 append-only frozen id(台北玩家的存檔日後仍可讀)。pack 之間 id 各自獨立。

> 這是本期最需要小心的重構。其餘都是內容替換。

---

## 5. 內容設計(台北)

### 5.1 七層尺度階梯

對齊真實尺度帶(0.02 / 0.10 / 0.50 / 2.5 / 12 / 60 / 300 m),日轉夜,終點是夜裡點燈的 101。每層 10 個 archetype(slot 0–7 一般可吸收 / slot 8–9 chunk 地標)。下表為內容提案(實作時可微調命名/比例):

| Tier | 尺度 | 場景 | 可滾物件(slot 0–7 範例) | chunk 地標(slot 8–9) |
|---|---|---|---|---|
| T0 | 2 cm | 柑仔店/文具桌頭 | 彈珠、橡皮擦、圖釘、瓶蓋、糖果、尪仔標、鉛筆、鈕扣 | 戳戳樂板、籤筒 |
| T1 | 10 cm | 台北夜市(饒河/士林) | 養樂多、寶特瓶、檳榔、香、金紙、滷味夾、紅白塑膠袋、胡椒餅 | 攤車燈籠、彈珠台 |
| T2 | 0.5 m | 騎樓邊 | 紅塑膠椅、安全帽、電鍋、瓦斯桶、三角錐、消防栓、招財貓、YouBike 樁 | 攤販推車、廟前香爐 |
| T3 | 2.5 m | 機車海 | 機車(多色,數量感)、小貨車、變電箱、霓虹招牌、鐵捲門、路樹、棚架、石獅 | 夜市拱門、廟前牌樓 |
| T4 | 12 m | 萬華街屋與廟 | 透天厝、鐵皮屋、公寓、小七/全家、公車、垃圾車(放少女的祈禱)、加油站、騎樓柱 | 公寓街屋量體、宮廟量體 |
| T5 | 60 m | 商業文教區 | 商辦大樓、百貨、捷運高架、天橋、停車塔、巨型看板、玻璃帷幕街屋、銀行 | 商辦塔樓、百貨量體 |
| T6 | 300 m+ | 信義天際線 | 玻璃帷幕高樓群、跨橋、其他摩天樓、巨型廣告牆、商辦塔、空橋、屋頂機房 | 跨街空橋、屋頂機房塔 |

> **兩套地標系統別混淆**:上表「chunk 地標(slot 8–9)」是**可重複出現的較大量體**(每 chunk 至多一個,屬於那 70 個 chunk archetype id 之一)。而 §5.2 的**具名招牌地標**(龍山寺、中正紀念堂、圓山、101)是**唯一、由 cityMap 擺放一次的 curated singleton**,走 EXTRA/v5 碼空間,**不計入** 70 個 chunk id。兩者是引擎裡分開的機制,實作時勿混。

### 5.2 地標(手工做到一眼認得出)

核心:**台北 101(終點)**、龍山寺、中正紀念堂、圓山大飯店。候補(可加入):西門紅樓、總統府、台北車站。

- 地標皆為手搭幾何(非 OSM),沿用原版 curated landmark 機制(`addExtra` + `cityMap.LANDMARKS` + pack-scoped code)。
- 地標的 `dioramaR` 決定吸收門檻(`dioramaR / ABSORB_RATIO`),門檻階梯需嚴格遞增 → **101 最高、排最後**,自然成為該帶的終點。

### 5.3 終點 monument:台北 101

- 手搭模型:**八節竹節塔身**(上寬下窄的倒梯形節堆疊)、塔尖、頂端**金色調諧質量阻尼器球**意象、夜間藍綠點燈。替換 `render/goalTower.js`(SkytreeView → `Taipei101View`)。
- 常數重調:`SKYTREE_POS → TAIPEI101_POS`(pack 手寫 game m);因 101(508 m)比晴空塔(634 m)矮,需重調 `GOAL_RADIUS_M / GOAL_CALL_RADIUS_M / 底座半徑與 collider`,以及 curated 地標的 `GROWTH_K` 收尾坡度,讓最後逼近 101 的手感對。
- `terrain.js` 的永久底座 collider 重新指向 101。
- 勝利過場:保留 approach→contact→merge→ascension 結構;可加 101 跨年煙火 + 黑熊歡呼 toast。

### 5.4 結尾:福爾摩沙島 teaser

- 把 `render/earthView.js`(原本一顆程序化夜地球)**改成福爾摩沙島**:鏡頭隨球升空後拉遠,呈現台灣島輪廓,台北一點發亮、其他縣市為暗點(「即將推出」)。
- 這是 P1→P2 的鉤子,也是 pack `ending` 參數的掛點;P2 把它升級成可點選單。原版那顆地球留給 P3 世界版。

### 5.5 收藏冊(稀有彩蛋,約 13 格)

台灣黑熊本尊、珍奶、雞排、刈包、小籠包、鳳梨酥、電音三太子、布袋戲偶、YouBike、總統府、貓空纜車、士林大雞排、媽祖。沿用 `game/collection.js` 的 frozen-id bitmask(pack-scoped)+ 開機縮圖預渲染。

### 5.6 吉祥物:台灣黑熊「月牙」

- 替換鴨子 Donack:沿用 `ui/donack.js` 控制器與 `#donack-root` DOM(在 `#hud` 外,過場時仍可說話)、`donackLines.js` 機制。
- 需新美術:像素風台灣黑熊(胸前白色月牙 V),約 5 種表情(idle/happy/thinking/speaking/surprised)、每表情數格動畫。命名「月牙」(暫;候補 阿熊/烏熊)。
- 台詞表全繁中,帶台北冷知識與梗(「這台機車是你的嗎?」)。

---

## 6. 在地化

- 補一層**薄 i18n**:把散落字串集中到 `packs/taipei/locale.js`,以 key 查表。不引入重型 i18n 框架。
- 數字格式 `Intl.NumberFormat('zh-TW')`。
- 分享文(X / 社群)改繁中,例:「我在《Roll Formosa》滾出了台北 101!」。
- `index.html` 靜態標題/HUD DOM 的字面值一併在地化。

---

## 7. 美術資產管線

- **絕大多數零美術**:沿用原版「程序化幾何 + vertex color」風格,所有物件/地標/101 都是手搭幾何。
- **唯一需要外部生成的美術**:台灣黑熊吉祥物頭像 frames。用使用者既有的 `codex-imagegen` skill 或 `nanobanana` MCP 生像素風 webp,沿用原版 `dk-{expr}-{n}` 命名與 CSS 切換機制。

---

## 8. Repo 與部署

- 個人公開 repo(沿用使用者慣例),工作名 `roll-formosa`。
- 授權:`LICENSE` 保留原版 MIT 文字 + 追加林亞澤(衍生 copyright 行)。
- 部署:預設 **GitHub Pages**(沿用 k-rider 慣例);Cloudflare Pages 亦可。Vite 靜態 build。
- README 重寫:遊戲介紹、操作、致謝原作者(fableDemoGame, MIT)、本機開發指令。
- Fork 落地建議:`git clone` 上游 → 新 repo,將本 spec 一併納入版控(或以 upstream remote `--allow-unrelated-histories` 合併,細節由實作規劃決定)。

---

## 9. 必須保留的引擎不變量(實作紅線)

實作時若動到下列任一,等於破壞王牌,需在 PR 明確標註並通過對應驗證:

1. 單幀 5 倍相似 rescale 的**像素一致性**(原版有 forced-rescale diff 截圖驗證)。
2. Seamlessness law(吸收/相機/霧/速度/despawn 不得參照 tierIndex)。
3. Zero per-frame allocation。
4. 固定 60Hz、決定性生成(新內容 append 在既有種子流之後,勿插隊打亂下游 RNG)。
5. Draw-call cap(移除 OSM 後餘裕變大,但新內容仍要復用 instanced/batched pool,勿無謂新增 draw)。
6. 單一共用材質 + rim 光只依視線/法線。

---

## 10. 測試與驗證

- **pack-validate**:台北包開機自驗(7 層 / id 集 / 地標門檻階梯嚴格遞增 / 座標在 MAP_BOUNDS 內)。
- **可玩 smoke**:從圖釘一路滾到撞上 101、觸發勝利;onboarding 導引正常。
- **繁中覆蓋**:全程無殘留日文字串(grep + 實機掃 HUD/結果/旁白)。
- **rescale diff**:每層強制 rescale 的像素一致性仍過(引擎未動,應自然通過)。
- **draw-call 預算**:含台北全部內容仍在 cap 內。
- **像素級特效驗證**:用 `chrome-devtools` MCP 截圖、數非透明像素(沿用使用者既有作法),確認 101 點燈、結尾島嶼 teaser 正確呈現。

---

## 11. 風險與棘手點

1. **凍結契約重構**(§4.4):全域 frozen code → pack-scoped,牽動 `tiers.js / catalog.js / objects.js / cityMap.js validate / curated.js` 多處斷言。是本期最大技術風險,需先把 code 對照表改成 pack 載入時建立。
2. **101 收尾手感**:101 比晴空塔矮,`GOAL_RADIUS_M / GROWTH_K` 收尾坡度需重調,否則最後一段成長/逼近會怪。
3. **移除 OSM 的牽連**:draw-call ledger、frozen OSM 碼、predeploy、main.js 接線多點,需一次清乾淨避免半殘。
4. **決定性種子**:新台北內容必須 append 在既有種子流之後,否則開場數十秒的生成回歸會飄。
5. **地標座標**:原版由真實經緯度生 + 距離斷言;台北改成手寫 game m + 台北版斷言,需自訂合理窗口。

---

## 12. 路線圖

- **P1(本期)** 台北一關:圖釘 → 台北 101,程序化、全繁中、黑熊、島嶼 teaser 結尾。
- **P2** Roll Formosa 台灣地圖選單 + pack 載入器 + 台中 / 高雄 / 台南 / 彰化(八卦山大佛)… 各縣市關。
- **P3(遠程)** Roll the World:地球選單,台灣節點 zoom 進 Formosa 地圖,各國 packs(法/埃/美…);使用者最初「在地球上滾、收世界各國地標」的願景落在此層。

---

## 13. 已定預設(複審時可調)

| 項目 | 預設 | 可調 |
|---|---|---|
| 遊戲名 | Roll Formosa(福爾摩沙) | 是 |
| 本期關 | 台北 | 否(已定) |
| 黑熊名 | 月牙 | 是 |
| 核心地標 | 101 / 龍山寺 / 中正紀念堂 / 圓山飯店 | 是(可加西門紅樓/總統府/台北車站) |
| 收藏冊 | 上列 13 格 | 是 |
| 部署 | GitHub Pages | 是(可改 Cloudflare Pages) |
| 真實度 | 全程序化 + 手工地標 | 否(已定) |
| 八卦山大佛 | 移至 P2 中部/彰化關 | 否(已定) |
