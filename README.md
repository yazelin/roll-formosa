# Roll Formosa（搖滾・福爾摩沙）

一款**台灣風味的 Katamari（滾物成球）瀏覽器 3D 遊戲**。從一顆 2 公分的圖釘開始,在台北街頭一路黏滾長大 —— 柑仔店桌頭的彈珠、夜市攤、機車海、萬華街屋宮廟,最後滾成跨越信義區、撞上**台北 101** 的巨球。

> 滾啊滾,捲遍全台灣。

**線上試玩 ▶** https://yazelin.github.io/roll-formosa/

## 目前進度與路線圖

這是一款以**縣市為單位**逐步擴張的台灣巡迴遊戲。

- **現在(可玩)**:**全台 20 城**,每座是一座獨立關卡,終點都是該城地標 ——
  台北(台北101)、新北(淡水情人橋)、基隆(正濱漁港彩色屋)、桃園(大溪老街)、新竹(城隍廟)、苗栗(龍騰斷橋)、台中(台中之鑽)、彰化(八卦山大佛)、南投(日月潭)、雲林(西螺大橋)、嘉義(射日塔)、台南(林百貨)、高雄(85 大樓)、屏東(鵝鑾鼻燈塔)、宜蘭(龜山島)、花蓮(太魯閣)、台東(三仙台)、澎湖(跨海大橋)、金門(莒光樓)、馬祖(媽祖巨神像)。進站時用**縣市選單**選城市。
- **在地化深度**:每座城的地標、終點、收藏冊、街頭可滾物都是該城在地版 —— 收藏冊各城最多保留 3 個全台通用物(黑熊/媽祖等)、其餘全在地;70 個街頭小物與台北重複的壓到 ≤25(童玩、攤食、店招、街屋全換成在地版),只留機車/紅綠燈/超商/公車這類真．全台共通的街景。
- **更遠**:世界版 —— 地球選單,台灣節點展開成縣市地圖,再往外是各國。

之所以能這樣長,是因為**每一座城市的內容都裝在一個獨立的 StagePack 資料夾**(`src/packs/<city>/`):尺度階梯、可滾物件、地標、終點 monument、收藏冊、旁白、吉祥物、河流、結尾、在地化字串全包在裡面,引擎只讀當前 active pack。**加一座新城市 = 複製 `src/packs/taipei/`、換內容、把 `active.js` 指過去** —— 引擎一行不用改。

## 貢獻一座城市

架構與「怎麼加一座城市」的完整契約寫在 [`AGENTS.md`](AGENTS.md)(你的 Claude/Codex
打開 repo 會自動讀到)。簡言之:複製 `src/packs/taipei/`、換內容、在
`src/packs/manifest.js` 登錄、寫測試。引擎一行不用改。

## 特色

- **無縫縮放**:畫面手感固定,世界每長大就做一次 5 倍相似縮放 + 浮動原點,從 2cm 滾到 300m 天際線都不會 pop(沿用上游引擎的王牌)。
- **每城一套在地內容**:7 層尺度場景、約 70 個該城街頭可滾物、8+ 手作地標(終點是城市招牌建築)、13 格稀有收藏冊(各城在地名物,最多 3 個全台通用物)、在地河流/旁白/吉祥物 —— 全裝在獨立 StagePack 裡。
- **台灣黑熊「月牙」** 旁白,全繁體中文,夜市霓虹風 UI。
- 結尾拉遠成**福爾摩沙島**,玩過的城市發亮 —— 指向縣市/世界巡迴。

## 操作

WASD / 方向鍵移動;Space 衝刺;Shift 加速。手機可觸控(拖曳移動 + Dash 鍵)。開發傳送點:網址加 `?at=shop|night-market|scooter-sea|wanhua|xinyi|goal`。

### 選城市

- **縣市選單**:第一次造訪(網址沒有 `?city=`、瀏覽器也沒記錄)會先跳出**縣市選單**,從**全台 20 城**任選一座。選過之後會記在 `localStorage`,下次直接進上次玩的城市。標題頁與結算頁右下角有「換城市」鈕可隨時叫回選單。
- **網址直接指定**:`?city=taipei` 或 `?city=kaohsiung` 會直接進該城市並跳過選單(網址參數優先於記錄)。換城市 = 用新的 `?city=` 重新載入(引擎在載入時就把該城市的 StagePack 烘進去,不做執行期熱抽換)。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # 靜態輸出到 dist/
npm test         # vitest
```

### 加城市 / 開發工具
- **加一座城市**:`node scripts/new-city.mjs <id> <displayName> <tagline>` 起骨架,完整 SOP 見 [`docs/ADD-A-CITY.md`](docs/ADD-A-CITY.md)。
- **物件圖鑑 / 幾何藝廊**(玩家可見 —— 標題畫面「物件圖鑑」鈕進入;同時是 dev 幾何檢視工具):某城市的**全部** 3D 物件分區展示(終點 / 地標 / 收藏 / 70 街頭物),可切城市、捲動瀏覽、點物件放大。`/preview.html?city=<id>`;dev 用 `&kind=chunk` 篩一類、`&item=<id>` 放大。隨遊戲一起 build(Vite 第二入口)。
- **在地化檢查**:`node scripts/check-city.mjs <id>` —— 報該城 70 街頭物還與台北相同的數量(現行各城已壓到 ≤25;沿用台北太多會 FAIL,`localization.test.js` 也會把關)。
- **幾何 tri cap**:`node scripts/check-hero-tris.mjs <id>` —— 地標/收藏超 tri cap(DEV boot assert)會列出來。
- **無頭驗證**:`node scripts/headless-check.mjs <url> out.png`(自帶 headless chrome,輸出截圖)。
- **自動化(加城 / 加深)**:`scripts/autopilot.sh`(單條)/`scripts/autopilot-drain.sh`(整批)讀 `NEXT.md` backlog,讓 headless agent 自動加新城或加深既有城街頭物,過 `npm test` gate 後開 PR(人工 merge)。
- **天際線素材**:`public/assets/title/skyline-<id>.webp`(20 城各一張霓虹剪影,標題頁用;缺檔會 fallback 台北)。
- **OG 分享卡(可重現)**:`og-card.html` 是 1200×630 的 HTML 排版卡(多城天際線底圖 `public/assets/og-skyline.webp` + 真字型標題/副標/月牙);用 headless chrome 截圖 → `public/assets/og.jpg`。要改 OG 就改 HTML 重截,不必動 AI 圖。

## 部署

純靜態(Vite build,`base: './'`)。內附 `.github/workflows/deploy.yml`,推上 `main` 即自動 build + 發佈到 GitHub Pages(已上線:https://yazelin.github.io/roll-formosa/ )。

## 作者與支持

由 **林亞澤 Yaze Lin** 開發。覺得好玩,歡迎分享給朋友,或請我喝杯咖啡。

- 原始碼 GitHub:<https://github.com/yazelin/roll-formosa>
- Facebook:<https://www.facebook.com/yaze.lin.gm>
- Buy Me a Coffee:<https://buymeacoffee.com/yazelin>

遊戲結算頁可一鍵把成績分享到 **LINE / Threads / X / Facebook**。

## 致謝與授權

- Fork 自 [`aieo-product/fableDemoGame`](https://github.com/aieo-product/fableDemoGame)("Fable Katamari",MIT),保留其無縫縮放引擎;**移除了原版的真實東京 OpenStreetMap 圖層**,改為純程序化台北 + 手作地標,因此本專案**不附帶、也不依賴任何 OSM 資料**。
- 授權:MIT。原引擎 © 2026 aieo-product;台灣 fork（Roll Formosa）© 2026 林亞澤 Yaze Lin。見 [LICENSE](LICENSE)。
- 角色「月牙」(台灣黑熊)為本專案原創。
