# 加一座城市 SOP — Roll Formosa

權威步驟書。`AGENTS.md` 講「契約」,這份講「怎麼一步步做、做完怎麼驗、會踩什麼雷」。
對應甲方思維三段:**開規格 → 下發包 → 做驗收**。

> 已驗證範本:`台北` `高雄`。新城市照這份做,理論上零 context 的 AI 也跟得了。
> 引導式流程見 skill `add-city`(`.claude/skills/add-city/SKILL.md`)。

---

## 一鍵起骨架

```bash
node scripts/new-city.mjs <id> <displayName> <tagline>
# 例:node scripts/new-city.mjs taichung 台中 "歌劇院終點"
```

CLI 會:`cp -r src/packs/taipei src/packs/<id>` → 改 `id`/`displayName`/`seeds`
→ 在 `manifest.js` 登錄一筆 `status:'soon'`(尚不可玩)→ 印出 TODO 清單。
**它只生骨架(內容仍是台北的),其餘是你的內容工。**

---

## Phase 0 — 開規格(動 code 前先想清楚)

這遊戲的高潮是「滾進一座**城市招牌地標**」。先決定:

1. **終點 monument**：選這座城市**最具代表**的東西,不是硬湊高塔。
   - 有國際級超高樓 → 用它(台北 101 / 高雄 85)。
   - 沒有 → 用文化招牌(台中可用國家歌劇院、台南可用林百貨/赤崁樓)。三城 finale 各有性格是好事。
2. **七階主題弧**：柑仔店 → 夜市 → 街 → 街屋/廟 → 商業 → 天際線,但**換成這座城市的版本**
   (高雄是 鹽埕→六合夜市→鹽埕騎樓→哈瑪星港邊→鹽埕街屋→港區→亞洲新灣區)。
3. **8 個地標 + 13 個收藏**:都要**真在地**。收藏冊主打在地小吃/文化(台南就靠美食封頂)。
4. **每階調性 + 霓虹色**(`tiers.js` 的 fog/sky/cloudHex)。

### 文化正確性鐵則(踩過的雷)

- **別借別城市的招牌**。「機車海/機車瀑布」是**台北**(台北橋)的招牌意象 —— 別給別城市用。
  每座城市的關名/旁白要用**自己的**典故。
- **旁白用在地語感**。高雄整套用台語(「佇遮」「運將大哥免閣開矣」),很對味;
  寫前先想這座城市的語感,別套台北的腔。
- **不准出現** tokyo / 東京 / 日文假名 / skytree —— 有測試守衛(no-Tokyo / no-kana),`npm test` 會紅。
- **數字要查**(85 大樓「378m」是含天線總高,查過才寫;別憑印象)。

---

## Phase 1 — 下發包(scaffold)

跑上面的 CLI。完成後 `src/packs/<id>/` 是台北的複本、`manifest.js` 多一筆 `'soon'`。

---

## Phase 2 — 換內容(逐檔)

`src/packs/<id>/` 裡要改的(對照台北):

| 檔 | 換什麼 |
|---|---|
| `tiers.js` | 7 階關名 + 每階 10 個 `archetypeIds`(slots 0–7 可滾、8/9 chunk 地標)+ 調色 |
| `monument.js` | 終點建物幾何 + 位置常數 |
| `landmarks/` | 8 個 curated 單例地標(幾何) |
| `collectibles/` | 13 個收藏品(幾何) |
| `archetypes/t0–t6.js` | 70 個 chunk 幾何(每階 10);curated 收藏 >350 tris 要設 `heroTriCap` |
| `narration.js` | 月牙旁白(在地語感) |
| `locale.js` | zh-TW 字串(關名/分享文字/結算等);`donack.on/off` 已是「月牙·導遊」 |
| `cityMap.js` / `cityData.js` | `SHOP`/`ZONES`/`PLACEMENTS`/`water`/`GOAL_POS`/`DEV_STARTS`/`bandAllowedAt` |
| `ending.js` | 結尾島嶼圖,本城市點亮、其他城市 `lit:false`(即將推出) |
| `*.test.js` | **改期望值**(tier 名陣列、locale 等)—— CLI 複製來的還是台北的,會紅 |

幾何全是**程式碼**(無模型檔)。引擎一行不用改。

---

## Phase 3 — 素材(唯一要手做的圖檔)

**首頁天際線剪影** `public/assets/title/skyline-<id>.webp`。

> ⚠️ **沒做的話標題頁會默默顯示台北的天際線**(silent fallback,不報錯)。每座城市必做一張。

用 **codex-imagegen**(Codex CLI `$imagegen`,見全域 skill `codex-imagegen`)產,規格對齊現有:

- **RGBA、透明背景**、`.webp`,寬幅約 **3:1**(台北 1600×510、高雄 2172×677)。
- 風格:**霓虹線稿剪影**,這座城市的天際線 + 招牌地標,深色近透明底,夜市/夜店霓虹色。

可重用 prompt 配方(填入城市專屬地標):

```
A wide panoramic neon-outlined silhouette of the {城市} skyline at night,
featuring {該城市的招牌地標,如 國家歌劇院、台中車站、勤美}, glowing cyan /
magenta / warm-amber neon line art, flat 2D silhouette, fully TRANSPARENT
background (alpha), no ground, no text, no sky — just the glowing skyline
strip. Aspect ratio ~3:1, crisp vector-like neon edges, dark interior fill.
```

產完轉 webp、確認透明、放進 `public/assets/title/`。檔名必須是 `skyline-<id>.webp`。

---

## Phase 4 — 做驗收(動完必過)

```bash
npm run build                                  # 過
npx vitest run                                 # 全綠(含你改過的 *.test.js)
node scripts/headless-check.mjs http://localhost:4173/?city=<id> /tmp/x.png   # 0 console error、tier 標籤正確
```

- pack `validate()` true、99 codes、`displayNameByCode` 全 zh-TW 無日文。
- **`npm run dev` 親眼看**(不是 prod preview —— 有 DEV-only assert);兩件事要確認:
  - 物件貼地、不懸空(curated 抬高物件要落地)。
  - skyline 是這座城市的、標題/結算字串是這座城市的。
- 全部過 → 把 `manifest.js` 該城市 `status:'soon'` 改成 `'ready'`(這時才可玩)。
- 更新 README 的「現在(可玩)」清單。

---

## 速查:會踩的雷

- skyline 沒做 → silent 顯示台北(Phase 3)。
- 複製來的 `*.test.js` 期望值沒改 → 測試紅(Phase 2)。
- 借了別城市的招牌典故(機車海…)→ 文化錯(Phase 0)。
- 出現日文假名/東京字樣 → no-kana/no-Tokyo 守衛紅。
- 在 prod preview 驗而非 `npm run dev` → 看不到 DEV assert。
- 數字憑印象 → 先查。
