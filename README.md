# Roll Formosa（滾・福爾摩沙）

一款**台灣風味的 Katamari（滾物成球）瀏覽器 3D 遊戲**。從一顆 2 公分的圖釘開始,在台北街頭一路黏滾長大 —— 柑仔店桌頭的彈珠、夜市攤、機車海、萬華街屋宮廟,最後滾成跨越信義區、撞上**台北 101** 的巨球。

> 滾啊滾,捲遍全台北。

## 特色

- **無縫縮放**:畫面手感固定,世界每長大就做一次 5 倍相似縮放 + 浮動原點,從 2cm 滾到 300m 天際線都不會 pop(沿用上游引擎的王牌)。
- **全程台北**:7 層尺度場景(柑仔店 → 夜市 → 騎樓 → 機車海 → 萬華街屋與廟 → 商業文教區 → 信義天際線)、70 個台北可滾物件、9 個手作地標(北門 / 龍山寺 / 西門紅樓 / 圓山 / 總統府 / 中正紀念堂 / 自由廣場牌樓 / 小巨蛋 → **台北 101** 終點)、13 格稀有收藏冊(珍奶 / 雞排 / 三太子 / 媽祖…)。
- **台灣黑熊「月牙」** 旁白,全繁體中文。
- 結尾拉遠成**福爾摩沙島**,台北發亮、其他縣市為「即將推出」—— 指向未來的縣市/世界巡迴。
- **可擴充的 StagePack 架構**:每個城市的內容(尺度階梯、物件、地標、終點、收藏冊、旁白、吉祥物、河流、結尾、在地化字串)都裝在 `src/packs/<city>/` 一個獨立資料夾,引擎只讀 active pack。未來加台中 / 高雄 / 法國 / 埃及就是「再做一個 pack」。

## 操作

WASD / 方向鍵移動;Space 衝刺;Shift 加速。開發傳送點:網址加 `?at=shop|night-market|scooter-sea|wanhua|xinyi|goal`。

## 開發

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # 靜態輸出到 dist/
npm test         # vitest
```

## 部署

純靜態(Vite build,`base: './'`),可部署到 GitHub Pages / Cloudflare Pages 等。內附 `.github/workflows/deploy.yml`(推上 GitHub 並啟用 Pages 後自動 build + 發佈)。

## 致謝與授權

- Fork 自 [`aieo-product/fableDemoGame`](https://github.com/aieo-product/fableDemoGame)("Fable Katamari",MIT),保留其無縫縮放引擎;**移除了原版的真實東京 OpenStreetMap 圖層**,改為純程序化台北 + 手作地標,因此本專案**不附帶、也不依賴任何 OSM 資料**。
- 授權:MIT。原引擎 © 2026 aieo-product;台灣 fork（Roll Formosa）© 2026 林亞澤 Yaze Lin。見 [LICENSE](LICENSE)。
- 角色「月牙」(台灣黑熊)為本專案原創。
