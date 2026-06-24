#!/usr/bin/env bash
# Autopilot: 讀 NEXT.md 挑一條 → branch → headless Claude 做 → npm test gate → 開 PR → 停手(人工 merge)。
#            doer 順手回報 FINDINGS → 開成 autopilot-found issue(燃料自我補充)。
# ponytail: shell 管 git+test+PR+issue,Claude 只管做事+回報。先筆電手動證機制,跑順再搬常開機器掛 cron。
set -euo pipefail
cd "$(dirname "$0")/.."

gh label create autopilot --color ededed 2>/dev/null || true
gh label create autopilot-found --color fbca04 2>/dev/null || true

git fetch -q origin
git checkout -q main
git pull -q --ff-only

# #24: 切 branch 前工作樹必須乾淨,否則切換會把未提交內容帶過去、和 stash 相撞污染別檔。
# 寧可大聲中止、跳過這次,也不要默默弄壞 build。
if [ -n "$(git status --porcelain)" ]; then
  echo "工作樹不乾淨,autopilot 中止(避免切 branch 污染)。先 commit/清乾淨再跑:"; git status -s
  exit 1
fi

ITEM=$(grep -m1 -- '- \[ \]' NEXT.md || true)
[ -z "$ITEM" ] && { echo "NEXT.md backlog 空,結束。"; exit 0; }
TASK="${ITEM#*] }"
echo "本次任務: $TASK"

BR="autopilot/$(date +%Y%m%d-%H%M%S)"
git checkout -q -b "$BR"

OUT=$(claude -p "你是 roll-formosa repo 的 autopilot。先讀 NEXT.md 和 docs/ADD-A-CITY.md。\
只做這一條 backlog:${ITEM}。嚴守它寫的範圍。可以跑 scaffold/build 等指令,\
但不要 git commit/push、不要開 PR、不要 merge(外層腳本會處理)。\
**做完必須自己跑 'npx vitest run src/packs/<id>' 並修到全綠才算完成**(測試模板已 city-agnostic,\
不用改測試斷言;你若弄壞結構/幾何/locale 它會紅——修到綠;外層還會再跑 npm test,沒綠 PR 開不出來=白做)。\
**改完 src/packs/active.js / manifest.js 後,務必再跑一次完整 'npm test'(不能只跑 city-scoped vitest)**\
—— city-scoped vitest 不 import active.js,active.js 的語法錯(例如多打逗號 'pingtung,, matsu')它抓不到,\
只有完整 npm test 會紅;沒在這裡自己抓到,外層 gate 會擋下整城白做。\
**還必跑 'node scripts/check-hero-tris.mjs <id>' 修到 0 over** —— 地標/收藏 tri cap(heroTriCap 600/一般 350)是 DEV boot 期\
assert,vitest <id> 抓不到、超標會害 'npm run dev' 主遊戲開不了(preview 卻正常);超標就降 sph ws/hs、cyl segments。\
**若這條任務開頭是『加深』(deepen 既有城市街頭物,不是加新城)**:① 跑 'node scripts/check-city.mjs <city>' 看哪幾階(t0-t6)『同台北』最多;\
② 打開 src/packs/<city>/archetypes/tN.js,把『還照抄台北』的街頭小物換成這座城市真實會出現的在地版本(例:台中→宮原冰淇淋杯/太陽餅/麻芛冰;宜蘭→鴨賞/三星蔥/羅東夜市攤),\
保留『真．全台通用』物(機車/紅綠燈/便利商店/路樹/變電箱/紅白塑膠椅這類)即可;\
③ 目標把 check-city 的『同台北』壓到 ≤33/70(越低越好,金門級 ~20);第二輪要找出『上一輪還沒換的台北 chunk』再換掉,且每階(每 10 個)至少換掉幾個;\
④ 換的幾何照 geomHelpers、跑 'node scripts/check-hero-tris.mjs <city>' 修到 0 over;\
⑤ **不要動 landmarks/collectibles(已在地化好了)、不要改 active.js/manifest/ext codes**;只動 archetypes/tN.js(必要時 narration/tiers 文字);\
⑥ npm test(含 localization/city-content 守衛)要綠。做完把 NEXT.md 該行改 [x]。\
若這條是加新城市:① 把 src/packs/manifest.js 該城 status 改成 'ready'(否則 localization/river 守衛不會把關);\
② chunk 街頭物在地化必須夠深 —— 跑 'node scripts/check-city.mjs <城市 id>' 自我檢查,\
必須 ≤44/70 同台北(台中級下限,目標 ~37 高雄級),否則 npm test 會紅、PR 開不出來,等於白做;\
別只換地標/收藏就交,t0–t6 七階的街頭小物都要換成這座城市的在地版本(保留泛台灣通用物即可);\
③ 河也要在地化(cityMap.js 的 water:名稱+centerline+註解,別留台北基隆河),結尾 ending.js 不要動(共用、自動點亮);\
④ **tier 名要在地化**(tiers.js 每階 name,尤其 tier 0 別留台北『柑仔店桌頭』、別照抄機車海/信義天際線);\
⑤ **ext 地標 codes 90-98 用這座城自己的地標**(reuse 主地標、id 加 _ext 後綴避免撞 82-89,並同步 index.js 的 codeMap),別借台北故宮/美麗華/中山堂、別留『預留欄位』。city-content-localization.test.js 會擋 ④⑤。\
⑥ **所有放進 catalog(有 code 的)地標,其 landmarks/*.js 內容與幾何都要是這座城的,別只改 id 字串卻沿用台北 geometry**;改過的 landmark 檔頭 @file 要改成 packs/<本城>/...(別留 @file packs/taipei/)。新守衛會掃 catalog placed 地標的來源檔,含 @file packs/taipei/ 就 FAIL。\
⑦ **新城是 cp -r taipei 起家,把沒用到的台北 landmarks/collectibles 死檔刪掉**(該城沒 import 的就 git rm),別把台北殘檔交出來。\
天際線圖(skyline-<id>.webp)若沒能力產就別硬塞,列進 FINDINGS 讓它變 issue(人工批次補)。\
做完把 NEXT.md 該行 [ ] 改成 [x]。\
最後**精確**用這格式輸出(給腳本解析,別多話):\
第一行 'SUMMARY: <一句你改了什麼>';\
接著一行 'FINDINGS:';\
然後每行 '- <做事時順手發現、具體可執行、屬於本 repo 的事項>',最多 3 條,沒有就寫 '- none'。" \
  --dangerously-skip-permissions 2>&1)
echo "$OUT"

echo "== gate: npm test =="
npm test

git add -A
git commit -q -m "autopilot: $TASK" || { echo "沒有變更,放棄。"; git checkout -q main; exit 0; }
git push -q -u origin "$BR"
gh pr create --fill --base main --head "$BR" --label autopilot

# FINDINGS -> issues (上限 3、dedup vs 既有 open autopilot-found)
mapfile -t EXIST < <(gh issue list --state open --label autopilot-found --json title -q '.[].title' 2>/dev/null || true)
echo "$OUT" | sed -n '/^FINDINGS:/,$p' | grep -E '^- ' | sed 's/^- //' | grep -vix 'none' | head -3 | while IFS= read -r f; do
  for e in "${EXIST[@]:-}"; do [ "$e" = "$f" ] && { echo "skip dup: $f"; continue 2; }; done
  gh issue create --title "$f" --label autopilot-found \
    --body "autopilot 在做「$TASK」時發現。提案燃料,需人工 triage,核准後才進 NEXT.md。" \
    && echo "issue 開了: $f"
done

echo "完成:PR + findings 已處理,等你 review。"
