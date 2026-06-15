#!/bin/sh
# verify-donack-assets.sh — Donack webp asset gate (v3, docs/DESIGN-V3.md
# §ドナック実況 / exemptions ledger #3).
#
# The 8 first-party Donack frames are the ONLY binary assets in the deploy
# (documented exemption to the zero-external-asset law). This script asserts:
#   1. public/assets/donack/ contains EXACTLY the 8 kept frames
#      ({idle,happy,thinking,speaking}-{0,3}.webp) — no missing, no strays;
#   2. their total size is <= DONACK_ASSET_BUDGET_KB (40 KB, tuning.js).
# Exits non-zero on any violation. Wire into CI / predeploy:
#   "predeploy": "sh scripts/verify-donack-assets.sh && ..."
# No external tooling (replaces the draft's build-donack-sprites.sh —
# no pngquant/sips dependency). POSIX sh; runs from any cwd.

set -u

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/assets/donack"
BUDGET_KB=40
BUDGET_BYTES=$((BUDGET_KB * 1024))

EXPECTED="idle-0.webp idle-3.webp happy-0.webp happy-3.webp thinking-0.webp thinking-3.webp speaking-0.webp speaking-3.webp"

fail=0

if [ ! -d "$DIR" ]; then
  echo "[donack-assets] FAIL: directory not found: $DIR" >&2
  exit 1
fi

# 1a. Every expected frame exists; sum sizes (portable: wc -c).
total=0
for f in $EXPECTED; do
  p="$DIR/$f"
  if [ ! -f "$p" ]; then
    echo "[donack-assets] FAIL: missing frame: $f" >&2
    fail=1
    continue
  fi
  size=$(wc -c < "$p" | tr -d '[:space:]')
  total=$((total + size))
done

# 1b. No stray files in the directory (exactly the 8 kept frames).
for p in "$DIR"/* "$DIR"/.[!.]*; do
  [ -e "$p" ] || continue
  name=$(basename "$p")
  keep=0
  for f in $EXPECTED; do
    [ "$name" = "$f" ] && keep=1 && break
  done
  if [ "$keep" -eq 0 ]; then
    echo "[donack-assets] FAIL: stray file in donack assets: $name" >&2
    fail=1
  fi
done

# 2. Total size budget (DONACK_ASSET_BUDGET_KB).
if [ "$total" -gt "$BUDGET_BYTES" ]; then
  echo "[donack-assets] FAIL: total ${total} bytes > budget ${BUDGET_BYTES} bytes (${BUDGET_KB} KB)" >&2
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  exit 1
fi

echo "[donack-assets] OK: 8 frames, ${total} bytes <= ${BUDGET_BYTES} bytes (${BUDGET_KB} KB budget)"
exit 0
