#!/usr/bin/env bash
# Regenerate the self-hosted, repo-subset web fonts in public/assets/fonts/.
#
# Why self-hosted: the UI uses Bungee (latin display) + Noto Sans TC (CJK).
# Pulling the full Noto TC from Google's CDN is multi-MB AND cross-origin (the
# service worker can't cache it → not offline). We subset to ONLY the glyphs
# that appear anywhere in src/ + the root HTML (all displayed text is static
# repo strings — the player can't type) → ~0.6MB same-origin, SW-precached.
#
# Why split Noto into TWO files (load order = priority, not all-at-once):
#   - notosanstc-ui.woff2  = only title/menu/result glyphs → tiny → PRELOADED,
#     so the first screen's Chinese renders instantly even on a fresh visit.
#   - notosanstc.woff2     = every in-game glyph → the browser only fetches it
#     when text outside the UI subset is shown (i.e. once you're in the game).
# Both are @font-face family 'Noto Sans TC'; the UI one carries a unicode-range
# that this script injects into index.html (between the RF_UI_RANGE markers).
#
# Run after adding text that introduces new glyphs (new city, narration,
# collectible names). Needs: fonttools + brotli (pip install 'fonttools[woff]').
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/assets/fonts; mkdir -p "$out"; tmp=$(mktemp -d)

echo "→ fetching source fonts"
curl -sL --max-time 60 -o "$tmp/Bungee.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/bungee/Bungee-Regular.ttf"
curl -sL --max-time 120 -o "$tmp/NotoSansTC.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf"

echo "→ enumerating glyphs"
python3 - "$tmp" <<'PY'
import glob, sys
tmp = sys.argv[1]
ASCII = set(chr(c) for c in range(0x20, 0x7f))
FW_PUNCT = set('，。、！？：；「」『』（）《》〈〉…—‧·．～％　〔〕【】')  # fullwidth safety net

# FULL charset = everything displayed anywhere in the app.
full = set(ASCII)
for fp in glob.glob('src/**/*.js', recursive=True) + glob.glob('*.html') + glob.glob('src/**/*.html', recursive=True):
    try: full.update(open(fp, encoding='utf-8').read())
    except Exception: pass
full |= FW_PUNCT

# UI charset = only the title/menu/result screens: index.html (static title +
# the RF_CHROME city names/subtitles), the manifest (displayName + tagline),
# and each pack's locale 'title.*' / 'win.*' strings. NOT in-game narration /
# collectible names — those stay in the full font and load when the game opens.
ui = set(ASCII) | FW_PUNCT
ui.update(open('index.html', encoding='utf-8').read())
ui.update(open('src/packs/manifest.js', encoding='utf-8').read())
import re
for lf in glob.glob('src/packs/*/locale.js'):
    for line in open(lf, encoding='utf-8'):
        if re.search(r"'(title|win)\.", line):
            ui.update(line)

for s in (full, ui):
    for ws in '\n\r\t': s.discard(ws)
ui &= full  # never ask the UI subset for a glyph the source font lacks

open(tmp + '/charset-full.txt', 'w', encoding='utf-8').write(''.join(sorted(full)))
open(tmp + '/charset-ui.txt',   'w', encoding='utf-8').write(''.join(sorted(ui)))

# Collapse UI codepoints → a compact CSS unicode-range, and patch index.html.
cps = sorted(ord(c) for c in ui)
ranges, i = [], 0
while i < len(cps):
    j = i
    while j + 1 < len(cps) and cps[j + 1] == cps[j] + 1: j += 1
    ranges.append(f"U+{cps[i]:04X}" if i == j else f"U+{cps[i]:04X}-{cps[j]:04X}")
    i = j + 1
rng = ','.join(ranges)
html = open('index.html', encoding='utf-8').read()
new = re.sub(r'/\*RF_UI_RANGE_START\*/.*?/\*RF_UI_RANGE_END\*/',
             f'/*RF_UI_RANGE_START*/{rng}/*RF_UI_RANGE_END*/', html, count=1, flags=re.S)
assert new != html, 'RF_UI_RANGE markers not found in index.html'
open('index.html', 'w', encoding='utf-8').write(new)

cjk = lambda s: sum('一' <= c <= '鿿' for c in s)
print(f"  full: {len(full)} glyphs ({cjk(full)} CJK)   ui: {len(ui)} glyphs ({cjk(ui)} CJK), {len(ranges)} ranges")
PY

echo "→ subsetting → woff2 (Noto keeps its wght variable axis → one file = 500/700/900)"
pyftsubset "$tmp/NotoSansTC.ttf" --text-file="$tmp/charset-full.txt" --flavor=woff2 \
  --output-file="$out/notosanstc.woff2"    --layout-features='*' --no-hinting --desubroutinize
pyftsubset "$tmp/NotoSansTC.ttf" --text-file="$tmp/charset-ui.txt" --flavor=woff2 \
  --output-file="$out/notosanstc-ui.woff2" --layout-features='*' --no-hinting --desubroutinize
pyftsubset "$tmp/Bungee.ttf" --text-file="$tmp/charset-full.txt" --flavor=woff2 \
  --output-file="$out/bungee.woff2" --layout-features='*' --no-hinting

rm -rf "$tmp"
ls -la "$out"
