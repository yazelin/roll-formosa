#!/usr/bin/env bash
# Regenerate the self-hosted, repo-subset web fonts in public/assets/fonts/.
# Why: the UI uses Bungee (latin display) + Noto Sans TC (CJK). Pulling the full
# Noto TC from Google's CDN is multi-MB AND cross-origin (the service worker
# can't cache it → not offline). Instead we subset to ONLY the glyphs that
# appear anywhere in src/ + the root HTML (all displayed text is static repo
# strings — the player can't type), so the whole UI renders offline from a
# ~0.6MB same-origin file the SW precaches.
#
# Run this after adding text that introduces new CJK glyphs (new city, narration,
# collectible names). Needs: fonttools + brotli (pip install 'fonttools[woff]').
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/assets/fonts; mkdir -p "$out"; tmp=$(mktemp -d)

echo "→ fetching source fonts"
curl -sL --max-time 60 -o "$tmp/Bungee.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/bungee/Bungee-Regular.ttf"
curl -sL --max-time 120 -o "$tmp/NotoSansTC.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf"

echo "→ enumerating glyphs used in repo"
python3 - "$tmp/charset.txt" <<'PY'
import glob, sys
chars = set(chr(c) for c in range(0x20, 0x7f))  # ASCII printable always
for fp in glob.glob('src/**/*.js', recursive=True) + glob.glob('*.html') + glob.glob('src/**/*.html', recursive=True):
    try: chars.update(open(fp, encoding='utf-8').read())
    except Exception: pass
chars.update('，。、！？：；「」『』（）《》〈〉…—‧·．～％　〔〕【】')  # fullwidth punctuation safety net
for ws in '\n\r\t': chars.discard(ws)
open(sys.argv[1], 'w', encoding='utf-8').write(''.join(sorted(chars)))
cjk = sum('一' <= c <= '鿿' for c in chars)
print(f"  {len(chars)} glyphs ({cjk} CJK)")
PY

echo "→ subsetting → woff2"
# Noto: keep the wght variable axis (one file covers weights 500/700/900).
pyftsubset "$tmp/NotoSansTC.ttf" --text-file="$tmp/charset.txt" --flavor=woff2 \
  --output-file="$out/notosanstc.woff2" --layout-features='*' --no-hinting --desubroutinize
pyftsubset "$tmp/Bungee.ttf" --text-file="$tmp/charset.txt" --flavor=woff2 \
  --output-file="$out/bungee.woff2" --layout-features='*' --no-hinting

rm -rf "$tmp"
ls -la "$out"
