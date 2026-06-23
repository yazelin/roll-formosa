#!/usr/bin/env bash
# Roll Formosa overnight drain — 把 NEXT.md 每條 backlog 都跑掉,各開一個 PR,不 merge。
# 刻意放 repo 外:doer 會跑 `git add -A`,放 repo 內會被包進某個 PR。
# ponytail: 一夜性 driver。沿用 autopilot.sh 的 doer prompt,但一次抓完清單再逐條跑
#   —— 純 loop autopilot.sh 會因為 PR 不 merge、main 的 NEXT.md 不變而把第一條重做 16 次。
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="${AUTOPILOT_LOG:-/tmp/autopilot-drain.log}"
# 下一個即將到來的 07:00(過了午夜也正確):07:00 後不再開新城市,讓你早上來時是停手狀態
DEADLINE=$(date -d 'today 07:00' +%s)
[ "$DEADLINE" -le "$(date +%s)" ] && DEADLINE=$(date -d 'tomorrow 07:00' +%s)

log(){ echo "[$(date '+%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

# log claude account usage (5h/7d window utilization) — the autopilot's throttle.
# Endpoint reverse-engineered in yazelin/claude-auth-switcher.
log_usage(){
  local tok msg
  tok=$(node -e 'try{process.stdout.write(JSON.parse(require("fs").readFileSync(process.env.HOME+"/.claude/.credentials.json")).claudeAiOauth.accessToken)}catch(e){}' 2>/dev/null)
  [ -z "$tok" ] && return 0
  msg=$(curl -s --max-time 10 https://api.anthropic.com/api/oauth/usage \
        -H "Authorization: Bearer $tok" -H "anthropic-beta: oauth-2025-04-20" \
      | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const j=JSON.parse(d),f=j.five_hour||{},s=j.seven_day||{};process.stdout.write(`額度 5h=${f.utilization??"?"}%(resets ${f.resets_at||"?"}) 7d=${s.utilization??"?"}%`)}catch(e){process.stdout.write("額度查詢失敗")}})' 2>/dev/null)
  [ -n "$msg" ] && log "$msg"
}

# run the doer for one backlog ITEM ($1); echoes its output. Retried by the caller
# on a claude usage-limit hit.
run_doer(){
  timeout 3600 claude -p "你是 roll-formosa repo 的 autopilot。先讀 NEXT.md 和 docs/ADD-A-CITY.md。\
只做這一條 backlog:${1}。嚴守它寫的範圍。可以跑 scaffold/build 等指令,\
但不要 git commit/push、不要開 PR、不要 merge(外層腳本會處理)。\
**做完必須自己跑 'npx vitest run src/packs/<id>' 並修到全綠才算完成**(測試模板已是 city-agnostic,\
不用改測試斷言,但你若弄壞結構/幾何/locale 它會紅——修到綠;外層還會再跑一次 npm test,你沒綠 PR 開不出來=白做)。\
**還必跑 'node scripts/check-hero-tris.mjs <id>' 修到 0 over** —— 地標/收藏 tri cap(heroTriCap 600/一般 350)是 DEV boot 期\
assert,vitest <id> 抓不到、超標會害 'npm run dev' 主遊戲開不了(preview 卻正常);超標就降 sph ws/hs、cyl segments。\
若這條是加新城市:① 把 src/packs/manifest.js 該城 status 改成 'ready'(否則 localization/river 守衛不會把關);\
② chunk 街頭物在地化必須夠深 —— 跑 'node scripts/check-city.mjs <城市 id>' 自我檢查,\
必須 ≤44/70 同台北(台中級下限,目標 ~37 高雄級),否則 npm test 會紅、PR 開不出來,等於白做;\
別只換地標/收藏就交,t0–t6 七階的街頭小物都要換成這座城市的在地版本(保留泛台灣通用物即可);\
③ 河也要在地化(cityMap.js 的 water:名稱+centerline+註解,別留台北基隆河),結尾 ending.js 不要動(共用、自動點亮);\
④ **tier 名要在地化**(tiers.js 每階 name,尤其 tier 0 別留台北『柑仔店桌頭』、別照抄機車海/信義天際線);\
⑤ **ext 地標 codes 90-98 用這座城自己的地標**(reuse 主地標、id 加 _ext 後綴避免撞 82-89,並同步 index.js 的 codeMap),別借台北故宮/美麗華/中山堂、別留『預留欄位』。city-content-localization.test.js 會擋 ④⑤。\
天際線圖(skyline-<id>.webp)若沒能力產就別硬塞,列進 FINDINGS。\
做完把 NEXT.md 該行 [ ] 改成 [x]。\
最後**精確**輸出:第一行 'SUMMARY: <一句你改了什麼>';接著 'FINDINGS:';每行 '- <...>' 最多3條,沒有寫 '- none'。" \
    --dangerously-skip-permissions 2>&1 || true
}

cd "$REPO" || { echo "no repo"; exit 1; }
gh label create autopilot --color ededed 2>/dev/null || true
log "=== drain start. deadline=$(date -d @"$DEADLINE" '+%m-%d %H:%M') ==="

# 一次抓完 backlog(run 中 main 的 NEXT.md 不會變,不能邊跑邊 re-grep)
mapfile -t ITEMS < <(grep -F -- '- [ ]' NEXT.md)
log "backlog: ${#ITEMS[@]} items"

DONE=0; SKIP=0
for ITEM in "${ITEMS[@]}"; do
  if [ "$(date +%s)" -ge "$DEADLINE" ]; then log "到 07:00 deadline,停止開新城市。"; break; fi
  TASK="${ITEM#*] }"
  log "---- START: $TASK"
  log_usage

  # 乾淨 slate,對齊最新 origin/main
  git checkout -q main
  git fetch -q origin
  git reset -q --hard origin/main
  git clean -qfd

  BR="autopilot/$(date +%Y%m%d-%H%M%S)"
  git checkout -q -b "$BR"

  OUT=$(run_doer "$ITEM"); echo "$OUT" | tail -25 >> "$LOG"
  # claude usage-limit recovery: if the doer came back with "hit your limit · resets HH:MMpm",
  # sleep until reset then retry the SAME city (so an overnight run finishes unattended).
  while echo "$OUT" | grep -qiE "hit your limit|usage limit"; do
    rt=$(echo "$OUT" | grep -oiE "resets [0-9]{1,2}:[0-9]{2} ?[ap]m" | head -1 | sed -E 's/[Rr]esets //')
    tgt=$(date -d "$rt" +%s 2>/dev/null); now=$(date +%s); sl=3600
    if [ -n "$tgt" ]; then d=$((tgt-now+120)); [ "$d" -lt 0 ] && d=$((d+86400)); [ "$d" -ge 60 ] && [ "$d" -le 21600 ] && sl=$d; fi
    if [ $((now+sl)) -ge "$DEADLINE" ]; then log "額度重置($rt)超過 deadline,停止整批。"; break 2; fi
    log "撞 claude 額度上限(resets $rt),睡 ${sl}s 後重試:$TASK"
    sleep "$sl"
    OUT=$(run_doer "$ITEM"); echo "$OUT" | tail -25 >> "$LOG"
  done

  if ! npm test >>"$LOG" 2>&1; then
    log "npm test FAIL → 跳過(無 PR): $TASK"; SKIP=$((SKIP+1))
    git checkout -q main; git reset -q --hard origin/main; git clean -qfd
    git branch -qD "$BR" 2>/dev/null || true
    continue
  fi

  git add -A
  if ! git commit -q -m "autopilot: $TASK"; then
    log "無變更 → 跳過: $TASK"; SKIP=$((SKIP+1))
    git checkout -q main; git reset -q --hard origin/main; git clean -qfd
    git branch -qD "$BR" 2>/dev/null || true
    continue
  fi
  git push -q -u origin "$BR" >>"$LOG" 2>&1
  if gh pr create --fill --base main --head "$BR" --label autopilot >>"$LOG" 2>&1; then
    log "PR opened: $TASK"; DONE=$((DONE+1))
  else
    log "PR 開失敗(branch 已推 $BR): $TASK"; SKIP=$((SKIP+1))
  fi
  git checkout -q main
done

log "=== drain done. PR=$DONE skip=$SKIP ==="
