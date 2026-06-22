# Roll Formosa（搖滾・福爾摩沙）

一款**台灣風味的 Katamari（滾物成球）瀏覽器 3D 遊戲**。從一顆 2 公分的圖釘開始,在台北街頭一路黏滾長大 —— 柑仔店桌頭的彈珠、夜市攤、機車海、萬華街屋宮廟,最後滾成跨越信義區、撞上**台北 101** 的巨球。

> 滾啊滾,捲遍全台北。

**線上試玩 ▶** https://yazelin.github.io/roll-formosa/

## 目前進度與路線圖

這是一款以**縣市為單位**逐步擴張的台灣巡迴遊戲。

- **現在(可玩)**:**台北關**(圖釘 → 夜市 → 機車海 → 萬華街屋宮廟 → 信義天際線 → **台北 101**)、**高雄關**(鹽埕 → 六合夜市 → 駁二 → 旗津 → **高雄 85 大樓**)、**台中關**(中區老城 → 逢甲夜市 → 一中商圈 → 台灣大道 → 南屯老街 → 七期 → **台中之鑽**)、**台南關**(府城柑仔店 → 花園夜市 → 正興街騎樓 → 神農老街 → 孔廟街屋與廟 → 東區商圈 → 安平港天際線 → **林百貨**)。進站時用**縣市選單**選城市。
- **接下來**:**其他縣市**(台南 / 台東…)—— 沿用縣市選單,每個縣市是一座獨立的關卡。
- **更遠**:世界版 —— 地球選單,台灣節點展開成縣市地圖,再往外是各國。

之所以能這樣長,是因為**每一座城市的內容都裝在一個獨立的 StagePack 資料夾**(`src/packs/<city>/`):尺度階梯、可滾物件、地標、終點 monument、收藏冊、旁白、吉祥物、河流、結尾、在地化字串全包在裡面,引擎只讀當前 active pack。**加一座新城市 = 複製 `src/packs/taipei/`、換內容、把 `active.js` 指過去** —— 引擎一行不用改。

## 貢獻一座城市

架構與「怎麼加一座城市」的完整契約寫在 [`AGENTS.md`](AGENTS.md)(你的 Claude/Codex
打開 repo 會自動讀到)。簡言之:複製 `src/packs/taipei/`、換內容、在
`src/packs/manifest.js` 登錄、寫測試。引擎一行不用改。

## 特色

- **無縫縮放**:畫面手感固定,世界每長大就做一次 5 倍相似縮放 + 浮動原點,從 2cm 滾到 300m 天際線都不會 pop(沿用上游引擎的王牌)。
- **全程台北**:7 層尺度場景、約 70 個台北可滾物件、手作地標(北門 / 龍山寺 / 西門紅樓 / 圓山 / 總統府 / 中正紀念堂 / 自由廣場牌樓 / 小巨蛋 →**台北 101** 終點)、13 格稀有收藏冊(珍奶 / 雞排 / 三太子 / 媽祖…)。
- **台灣黑熊「月牙」** 旁白,全繁體中文,夜市霓虹風 UI。
- 結尾拉遠成**福爾摩沙島**,台北發亮、其他縣市為「即將推出」—— 指向上面的縣市/世界巡迴。

## 操作

WASD / 方向鍵移動;Space 衝刺;Shift 加速。手機可觸控(拖曳移動 + Dash 鍵)。開發傳送點:網址加 `?at=shop|night-market|scooter-sea|wanhua|xinyi|goal`。

### 選城市

- **縣市選單**:第一次造訪(網址沒有 `?city=`、瀏覽器也沒記錄)會先跳出**縣市選單**,選 **台北**、**高雄**、**台中** 或 **台南**。選過之後會記在 `localStorage`,下次直接進上次玩的城市。標題頁與結算頁右下角有「換城市」鈕可隨時叫回選單。
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
- **在地化檢查**:`node scripts/check-city.mjs <id>` —— chunk 街頭物還是台北的會 FAIL。
- **無頭驗證**:`node scripts/headless-check.mjs <url> out.png`(自帶 headless chrome,輸出截圖)。

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
