#!/usr/bin/env bash
# Converts the in-game stills into the web sizes under img/ (ImageMagick 7 with libwebp).
# SRC is the folder the source shots were rendered into (the game repo's screenshot runs);
# each line below is "<output slug> <source path relative to SRC> [crop geometry]".
# Every image gets a "-1920" (1920 px, or its native width if smaller: the plume crop is 1080) and a 960 px WebP.
set -euo pipefail
SRC=${SRC:?set SRC to the folder with the source shots}
OUT=$(cd "$(dirname "$0")/.." && pwd)/img
mkdir -p "$OUT"

while read -r slug path crop; do
  [ -z "$slug" ] && continue
  case "$slug" in \#*) continue ;; esac
  args=()
  if [ -n "${crop:-}" ]; then args+=(-crop "$crop" +repage); fi
  for w in 1920 960; do
    magick "$SRC/$path" "${args[@]}" -resize "${w}x>" -strip -quality 80 -define webp:method=6 "$OUT/$slug-$w.webp" &
  done
done <<'EOF'
surface-low-sun     surfacehero/final/surface-hero-2-low-wide.png
surface-into-sun    surfacehero/final/surface-hero-1-into-sun.png
jupiter-rise        surfacehero/final/surface-hero-5-jupiter-tele.png
jupiter-night       surfacehero/final/surface-hero-7-night-flank.png
rig-jupiter         keyart2/final/k1-rig-jupiter.png
rig-low-sun         keyart2/final/k1b-pad-low-sun.png
reactor-glow        keyart2/final/k3-reactor-glow.png
rig-slope           keyart2/final/k4-melt-drill-plume.png
# plume-clean.png: plume/shots/p3-sun-far.png with the HUD cropped away and the crosshair blurred:
#   magick p3-sun-far.png -crop 1080x608+460+352 +repage -region 28x28+526+195 -blur 0x10 +region plume-clean.png
plume               plume-clean.png
dome-ledge          keyart2/final/k9-dome-ledge.png
minnow-gardens      keyart2/final/k6-glow-gardens.png
narwhal-reefs       keyart2/final/k10-b6-lodestone-reefs.png
b2-snowfall         oceanhero/shots/after-stack-B2-snowfall-terraces-wide.jpg
b3-mirror           oceanhero/shots/after-stack-B3-mirror-pool.jpg
b4-ember            oceanhero/shots/after-stack-B4-ember-vents.jpg
b5-clathrate        oceanhero/shots/after-stack-B5-clathrate-galleries-close.jpg
b6-lodestone        oceanhero/shots/after-stack-B6-lodestone-reefs.jpg
b7-opal             oceanhero/shots/after-stack-B7-opal-cathedrals-close.jpg
b8-hollow           oceanhero/shots/after-stack-B8-the-hollow.jpg
b9-lattice          oceanhero/shots/after-stack-B9-lattice-floor.jpg
b10-root            oceanhero/shots/after-stack-B10-root-threshold.jpg
EOF
wait

# The hero also gets a 2560 px version for large screens.
magick "$SRC/surfacehero/final/surface-hero-2-low-wide.png" -resize 2560x -strip -quality 78 -define webp:method=6 "$OUT/surface-low-sun-2560.webp"

# The share card img/og-share.jpg is rendered from tools/og.html (see README, "Images"), not here.

du -sh "$OUT"
