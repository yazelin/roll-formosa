# Roll Formosa — 高雄關 + 縣市選單 + Agent 可讀架構文件 設計

> **For agentic workers:** 下一步用 `superpowers:writing-plans` 把本設計轉成逐步實作計畫。

**目標:** 把**高雄**做成 Roll Formosa 的第二座可玩城市,加一個**縣市選單**讓玩家在台北/高雄間選擇;並把 **StagePack 架構寫成 agent 可讀的文件**(AGENTS.md / CLAUDE.md),讓 repo 分享出去時別人的 Claude/Codex 看得懂架構、能正確貢獻新城市;順手把水體從「軸對齊方框」改成「**河道緞帶**」,修掉台北基隆河那條怪 L、讓高雄愛河一開始就是正確河形。

**架構:** 沿用既有 StagePack seam(引擎只讀 `activePack`、`config/` 零城市內容)。高雄是「複製 taipei pack 契約」的第二個實例;縣市選單用「選擇驅動 + 重載」(做法 A,不做 runtime 熱切換);水體升級是一個自足的引擎小改 + pack 形狀變更。

**技術棧:** Three.js r177 + Vite 6 + vanilla ESM JS + vitest;靜態部署 GitHub Pages。

---

## 背景與現況

- Roll Formosa:台灣風 Katamari(滾物成球)3D 網頁遊戲,2026-06-16 已**完全去東京化**(檔案層級零東京/零日文,只剩 `// DE-TOKYO` 標記 + test 守衛)。
- **StagePack 架構**:每座城市 = `src/packs/<city>/`;引擎只讀 `src/packs/active.js` 指的 active pack;`src/config/` 只剩引擎常數(`tuning.js` + `tiers.js` 3 個常數),零城市內容。
- **taipei pack 樣板**(~50 檔):`index.js`(pack 物件)、`tiers.js`、`catalog.js`、`cityData.js`(烤好的 layout 資料)、`cityMap.js`、`geomHelpers.js`、`locale.js`、`monument.js`(終點)、`narration.js`、`ending.js`、`archetypes/t0–t6.js`(70 個 chunk 幾何)、`landmarks/*.js`(9 核心 + 8 延伸)、`collectibles/*.js`(13)、`*.test.js`。
- `active.js`:靜態 `export { activePack } from './taipei/index.js'` — **目前無選單**。
- **水體**:`render/environment.js` 讀 `activePack.cityMap.water.rects`(軸對齊方框陣列),每個方框鋪 2 個三角形成一塊平面水 quad + 第一個方框邊的 quay 牆。彎曲河流(基隆河)被軸對齊方框逼近 → 變成 L 型。

## Pack 契約(§0 文件化、§1 必須實作)

一個 `src/packs/<city>/index.js` 必須匯出 `activePack` 物件,欄位(對照 taipei):

- 身份:`id`, `displayName`, `region`, `locale{t,fmt}`
- 尺度:`tiers`, `rescaleS`, `archPerTier`
- 內容:`archetypes`(CATALOG), `extraCatalog`, `extraSizeClassByCode`, `extraPoolCaps`, `displayNameByCode`, `extraIds`, `collectibleExtraIndex`
- 地圖:`cityMap{ PLACEMENTS, SHOP, ZONES, bandAllowedAt, MAP_BOUNDS, GOAL_POS, DEV_STARTS, LANDMARKS, water }`, `map.bounds`
- 其他:`landmarks`, `absorbRatio`, `seeds{primary,v5}`, `goalMonument`, `narration`, `ending`
- `validate()`(boot 時跑;結構不變式 + 地標梯 + 99-code map)
- 由 `buildCodeMap(pack)` 掛上的 code-map 方法:`archetypeIdByCode`, `codeByArchetypeId`, `codeForCollectibleId`, `codeToArchetypeId`

**Code 結構**:99 個 code(0–69 chunk = 7 tier × 10、70–93 EXTRA、94–98 v5)。全域 `world/objects.js` 是**中性 placeholder**(`chunk_N`/`extra_N`/`v5_N`);每個 pack 用自己的 `archetypeIdByCode` 覆蓋全部 99 個。引擎拿內容**一律走 active pack**,從不靠全域字串。

---

## 元件

### §0 — Agent 可讀架構文件(**先做**:這份文件就是 §1 要照的契約)

- **`AGENTS.md`(根目錄,正本)** — 給 Codex 與多數 AI 工具自動讀。內容:
  - 專案一段話簡介 + live URL。
  - StagePack 架構(引擎/pack seam、`config/` 零城市內容、去東京後的中性 code 結構)。
  - **Pack 契約**(上節:一個 pack 必須提供的欄位/exports)。
  - **怎麼加一座城市**(逐步):複製 `src/packs/taipei/` → 改 `id`/`displayName`/`seeds`/全部內容 → 寫測試 → 在城市登錄表 + `active.js` 註冊。
  - **驗證關卡**:`npm run build`、`npx vitest run`(pack 測試 + no-Tokyo/no-kana 守衛)、`node scripts/headless-check.mjs`(開局渲染 + 0 console error)。
  - 目錄地圖(哪個檔做什麼)。
- **`CLAUDE.md`(根目錄)** — 給 Claude Code 自動讀;一行 `@AGENTS.md`(單一事實來源,同使用者全域 `@RTK.md` 手法)。
- **`README.md`** — 擴一個「貢獻一座城市」段落,指向 AGENTS.md。
- **`docs/` 舊東京文件**(`DESIGN.md`/`DESIGN-V2/3/4.md`/`design/*.json`)— 移到 `docs/legacy-fable-engine/`,開頭加註「原版 Fable / 箱庭東京引擎的歷史設計文件,**不代表現行架構**」,避免貢獻者的 agent 被帶回東京/OSM 老路。
- 文字風格:沿用 repo 的 zh-TW(agent 讀 zh-TW 無礙)。

### §2 — 河道緞帶水體(引擎升級 + 修台北 + enables 高雄愛河)

- **新 water 形狀**(pack 提供):`{ name, color, yM, centerline:[{x,z}, …], width }`。保留 `rects` 向下相容。
- **`render/environment.js` 水體 builder**:若 `water.centerline` 存在 → 沿中心線鋪**緞帶**(相鄰兩中心點之間一個四邊形 = 2 三角形,沿線段垂直方向各外擴 `width/2`,**可斜可彎**);否則退回現有 `rects` 路徑。quay 牆沿緞帶其中一岸(或本版先簡化/省略,視 seam 是否露)。維持「fog-on Lambert、rescale/rebase exact、無水時 0 draw」現有性質。
- **遷移台北基隆河** → `centerline`(順真實河道彎,修掉 L)。
- **高雄愛河** → `centerline`(穿城,§1 用)。

### §1 — 高雄 pack(`src/packs/kaohsiung/`,鏡射 taipei 結構)

- **終點建物:高雄 85 大樓**。`monument.js`:`KAOHSIUNG85_POS`、`goalMonument`(`buildGeometry`/`pos`/真實高度 ~378m/`winToast`)。「高」字形雙塔造型。
- **seeds**:`primary 0x4B414F48`('KAOH')、`v5 0x56354B41`('V5KA')—— 與台北(TAIP/V5TA)不同。
- **7 階尺度梯**(`tiers.js`,港都暮色調 sky/fog;band edges/`cellSizeSim`/`loadRadiusSim` 沿用 taipei 數值以過 fog/load floor 守衛):

  | 階 | 主題 | 內容方向 |
  |---|---|---|
  | T0 | 鹽埕柑仔店桌頭 | 彈珠/圖釘/瓶蓋…(通用小物) |
  | T1 | 六合夜市 | 木瓜牛奶杯/烤魷魚/鹽水雞/香腸 |
  | T2 | 鹽埕騎樓 | 紅椅/海產攤/安全帽/機車 |
  | T3 | 機車海＋港邊 | 機車/小貨車/**貨櫃**/鐵捲門/變電箱 |
  | T4 | 鹽埕街屋與廟 | 透天/鐵皮屋/三鳳宮量體/駁二倉庫 |
  | T5 | 港區與商業 | 貨櫃吊車/夢時代/商辦/港灣 |
  | T6 | 亞洲新灣區天際線 | 85大樓/高雄展覽館/海音 |

- **70 chunk archetypes**(`archetypes/t0–t6.js`,各 10 個,slot 8/9 = chunk landmark):照上表主題手作低面數幾何(tri cap 350 chunk;沿用 `geomHelpers` 詞彙)。
- **8 手作地標 + 85 終點**(`landmarks/*.js`,dioramaR 由小到大嚴格遞增):
  美麗島站光之穹頂 → 駁二(倉庫+大公仔)→ 龍虎塔(蓮池潭)→ 三鳳宮 → 高雄流行音樂中心(海音)→ 大港橋(真愛碼頭旋轉橋)→ 旗津燈塔 → 夢時代摩天輪 → **85 大樓(goal)**。每個 `NM_* = { id, name, colorHex, dioramaRHint, buildGeometry(rng) }`,hero tri cap 600。
- **13 收藏冊**(`collectibles/*.js`,curated-only):**月牙黑熊**(0 號,宇宙共用吉祥物,沿用台北的 black_bear)+ 木瓜牛奶、大碗公冰、旗鼓餅、鹽埕鴨肉、黑輪、烤魷魚、旗津渡輪、高捷少女、旗津三輪車、旗山香蕉、貨櫃(mini 港都象徵)。
- **愛河 water**:`centerline` 版(§2),穿城。
- **`narration.js`**:月牙在高雄關的 zh-TW 旁白(+一點台語味)。**`locale.js`**:zh-TW。**`ending.js`**:福爾摩沙島**南部「高雄」點亮**(台北仍亮、其餘即將推出)。
- **`cityData.js`**:高雄 layout(`SHOP`=鹽埕/港邊柑仔店、`ZONES`、`bandAllowedAt`、`PLACEMENTS` chunk dressing + collectible 位置)。可從 taipei 的 cityData 座標起步微調,或重作;街道布局是中性座標(非城市內容)。
- **測試**:鏡射 taipei(`pack.test`/`catalog.test`/`tiers.test`/`locale.test`/`validate.test`)+ no-Tokyo/no-kana 守衛(全 99 名稱無日文、`displayNameByCode` 全 zh-TW)。

### §3 — 縣市選單(做法 A:選擇驅動 + 重載)

- **城市登錄表 manifest**:`[{ id:'taipei', displayName:'台北', status:'ready' }, { id:'kaohsiung', displayName:'高雄', status:'ready' }, …'即將推出']`(單一事實來源,選單 + active.js 共用)。
- **`active.js` 改成選擇驅動**:在引擎模組 evaluate 前,從 `?city=` 網址參數 + `localStorage('rf_city')` 決定 active pack(對應 manifest → 靜態挑該 pack 的 index),預設 taipei。**關鍵**:引擎頂層 `const X = activePack…` 是「load 即烤」,所以選擇必須在 active.js 解析完成(reload 模型,不做 runtime 熱切換)。
- **選單畫面**:霓虹風(沿用既有 title/HUD 的 `var(--c-*)` / Bungee / 霓虹 class),台北/高雄 卡片 +「即將推出」灰卡;點卡 → 寫 `localStorage` + 帶 `?city=<id>` **重載**進遊戲。手機可觸控。
- **持久化**:`localStorage` 記住上次選的城市;再進站直接回到該城市(或回選單,二選一,spec 預設「記住上次」)。

## 資料流 / seam

開機 → `active.js` 在引擎任何模組 evaluate 前,從 `?city=` / `localStorage` 決定 active pack → 引擎照常讀 `activePack`(完全不變)。切城市 = 寫 localStorage + 帶新 `?city=` **重載**(對玩家無感)。選單是 HTML/CSS 畫面(類比現有 title bar),只負責設定選擇 + 重載。

## 測試 / 驗證(鏡射去東京關卡)

- `npm run build`(過)、`npx vitest run`(高雄 pack 測試 + 全守衛綠)。
- `node scripts/headless-check.mjs`:對 `?city=taipei` 與 `?city=kaohsiung` 各開局,確認 canvas 渲染 + **0 console error** + tier 標籤正確。
- 每 pack:`validate()` true、99 codes、名稱無日文/無東京。
- 水體:headless 觀察河形(緞帶順河道、不再 L)。
- 選單:headless 點高雄卡 → 重載 → 進到高雄關(tier 標籤 = 高雄 T0)。

## 建造順序

**§0 文件 → §2 水體緞帶 → §1 高雄 pack(含愛河)→ §3 縣市選單。**
理由:§0 定契約(§1 照做);§2 是小引擎改且 enables §1 的愛河 + 順修台北;§1 是內容主體(可先用 `?city=kaohsiung` 邊做邊驗);§3 最後收口讓兩城市可選。

## 不做(YAGNI)

- **runtime 熱切換(不重載)** — 否決(要重構整個引擎頂層讀取,CP 值低)。
- **台灣地圖點選版選單** — 之後;這次是卡片式選單。
- **世界/地球版** — 未來。
- **台中/台南等其他城市** — 未來;本次的 pack 契約 + 選單 manifest 已 enable。
