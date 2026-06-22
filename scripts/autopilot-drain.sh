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

  # 乾淨 slate,對齊最新 origin/main
  git checkout -q main
  git fetch -q origin
  git reset -q --hard origin/main
  git clean -qfd

  BR="autopilot/$(date +%Y%m%d-%H%M%S)"
  git checkout -q -b "$BR"

  OUT=$(timeout 3600 claude -p "你是 roll-formosa repo 的 autopilot。先讀 NEXT.md 和 docs/ADD-A-CITY.md。\
只做這一條 backlog:${ITEM}。嚴守它寫的範圍。可以跑 scaffold/build 等指令,\
但不要 git commit/push、不要開 PR、不要 merge(外層腳本會處理)。\
**做完必須自己跑 'npx vitest run src/packs/<id>' 並修到全綠才算完成**(測試模板已是 city-agnostic,\
不用改測試斷言,但你若弄壞結構/幾何/locale 它會紅——修到綠;外層還會再跑一次 npm test,你沒綠 PR 開不出來=白做)。\
若這條是加新城市:① 把 src/packs/manifest.js 該城 status 改成 'ready'(否則 localization/river 守衛不會把關);\
② chunk 街頭物在地化必須夠深 —— 跑 'node scripts/check-city.mjs <城市 id>' 自我檢查,\
必須 ≤44/70 同台北(台中級下限,目標 ~37 高雄級),否則 npm test 會紅、PR 開不出來,等於白做;\
別只換地標/收藏就交,t0–t6 七階的街頭小物都要換成這座城市的在地版本(保留泛台灣通用物即可);\
③ 河也要在地化(cityMap.js 的 water:名稱+centerline+註解,別留台北基隆河),結尾 ending.js 不要動(共用、自動點亮)。\
天際線圖(skyline-<id>.webp)若沒能力產就別硬塞,列進 FINDINGS。\
做完把 NEXT.md 該行 [ ] 改成 [x]。\
最後**精確**輸出:第一行 'SUMMARY: <一句你改了什麼>';接著 'FINDINGS:';每行 '- <...>' 最多3條,沒有寫 '- none'。" \
    --dangerously-skip-permissions 2>&1) || true
  echo "$OUT" | tail -25 >> "$LOG"

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
