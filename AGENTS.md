# Roll Formosa — AGENTS.md

給 AI 工具(Claude Code / Codex / Gemini 等)與貢獻者的架構導覽。**動手前先讀這份。**

## 這是什麼
台灣風 Katamari(滾物成球)3D 網頁遊戲。圖釘 2cm 一路滾到城市地標。Three.js r177 +
Vite 6 + vanilla ESM JS,靜態部署 GitHub Pages。Live:https://yazelin.github.io/roll-formosa/

> 重要:本專案 fork 自一個東京 OSM 遊戲,但**已完全去東京化**。`src/` 不得出現
> 任何 tokyo / 東京 / 日文 / skytree —— 有測試守衛把關(`npm test` 會紅)。
> `docs/legacy-fable-engine/` 是原版歷史文件,**不代表現行架構,別照它做**。

## 架構:StagePack
- 每座城市 = 一個自足資料夾 `src/packs/<city>/`。
- 引擎只讀 `src/packs/active.js` 指的 active pack。`src/config/` 只有引擎常數
  (`tuning.js`、`tiers.js` 的 RESCALE_S/ARCH_PER_TIER/TIER_COUNT),**零城市內容**。
- 引擎拿內容一律走 `activePack`;`world/objects.js` 的全域 code 表是中性 placeholder
  (`chunk_N`/`extra_N`/`v5_N`),每個 pack 用自己的 `archetypeIdByCode` 覆蓋。

## Pack 契約(`src/packs/<city>/index.js` 匯出的 activePack 物件)

一個 `src/packs/<city>/index.js` 必須匯出 `activePack` 物件,欄位(對照 taipei):

- 身份:`id`, `displayName`, `region`, `locale{t,fmt}`
- 尺度:`tiers`, `rescaleS`, `archPerTier`
- 內容:`archetypes`(CATALOG), `extraCatalog`, `extraSizeClassByCode`, `extraPoolCaps`, `displayNameByCode`, `extraIds`, `collectibleExtraIndex`
- 地圖:`cityMap{ PLACEMENTS, SHOP, ZONES, bandAllowedAt, MAP_BOUNDS, GOAL_POS, DEV_STARTS, LANDMARKS, water }`, `map.bounds`
- 其他:`landmarks`, `absorbRatio`, `seeds{primary,v5}`, `goalMonument`, `narration`, `ending`
- `validate()`(boot 時跑;結構不變式 + 地標梯 + 99-code map)
- 由 `buildCodeMap(pack)` 掛上的 code-map 方法:`archetypeIdByCode`, `codeByArchetypeId`, `codeForCollectibleId`, `codeToArchetypeId`

**Code 結構**:99 個 code(0–69 chunk = 7 tier × 10、70–93 EXTRA、94–98 v5)。全域 `world/objects.js` 是**中性 placeholder**(`chunk_N`/`extra_N`/`v5_N`);每個 pack 用自己的 `archetypeIdByCode` 覆蓋全部 99 個。引擎拿內容**一律走 active pack**,從不靠全域字串。

## 怎麼加一座城市
1. `cp -r src/packs/taipei src/packs/<city>`,改 `id`/`displayName`/`seeds`(四字 ASCII hex,需與其他城市不同)。
2. 換內容:`tiers.js`(7 階主題)、`monument.js`(終點建物)、`landmarks/`、`collectibles/`、
   `archetypes/t0–t6.js`(70 chunk 幾何)、`narration.js`、`locale.js`、`ending.js`、
   `cityData.js`/`cityMap.js`(SHOP/ZONES/PLACEMENTS/water/GOAL_POS/DEV_STARTS)。
   也放一張 `public/assets/title/skyline-<id>.webp`(標題頁霓虹天際線剪影,透明背景;
   `main.js` 依 active pack id 自動切換,缺檔自動退回 `skyline-taipei.webp`)。
   注意:curated 收藏(collectibles)若幾何 > 350 tris 要在 `catalog.js` 設
   `heroTriCap: HERO_TRI_CAP`(同地標),否則 DEV boot 會被 geometryFactory 擋。
3. 在 `src/packs/manifest.js` 城市登錄表加一筆(`{ id, displayName, tagline, status }`,`status:'ready'` 才可玩、`'soon'` 在選單顯示「即將推出」);`active.js` 會自動可選,**縣市選單**(`src/ui/citySelect.js`)也會自動長出對應卡片。
4. 寫測試(鏡射 `src/packs/<city>/*.test.js`),含 no-Tokyo/no-kana 守衛。

### 選城市(`?city=` + 縣市選單)
- 玩家選城市走 **`src/ui/citySelect.js`** 的 `#city-select` overlay(夜市霓虹風,卡片由 `manifest.js` 的 `CITIES` 渲染)。
- 進站決策(`src/main.js` boot):**網址 `?city=` 最優先** → 否則讀 `localStorage` 的 `rf_city` 直接進該城市 → 都沒有(首次造訪)才跳選單。選城市 = `rf_city` 寫入 + 用新的 `?city=` 重新載入(引擎在載入時烘 active pack,**無執行期熱抽換**)。
- **城市感字串**:`document.title`、標題頁副標(`title.subtitle`)、結算頁標題(`win.title`/`win.subtitle`)在 `main.js` boot 時從 `activePack.locale.t()` 覆寫 —— index.html 的硬寫值是 taipei 預設,別在那裡改死城市名,改 pack 的 `locale.js`。

## 驗證關卡(動完必過)
- `npm run build` 過、`npx vitest run` 全綠。
- `node scripts/headless-check.mjs http://localhost:4173/?city=<city> /tmp/x.png` → 0 console error、tier 標籤正確。
- pack:`validate()` true、99 codes、`displayNameByCode` 全 zh-TW 無日文。

## 目錄地圖
- `src/main.js` 引擎入口;`src/world/` 物理/地形/spawner;`src/render/` 渲染;
  `src/packs/<city>/` 城市內容;`src/config/tuning.js`/`tiers.js` 引擎常數。
