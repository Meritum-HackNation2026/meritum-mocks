#!/usr/bin/env bash
# Refresh platforms/ from the design system, the source of the mock pages
# (design-system/demo/platforms/, including the DOM contract SELECTORS.md).
#   scripts/sync-platforms.sh [path-to-design-system]   (default: ../design-system)
# Never edit platforms/ here; change the design system, then run this script.
set -euo pipefail
cd "$(dirname "$0")/.."
ds=${1:-../design-system}
src="$ds/demo/platforms"
[ -f "$src/SELECTORS.md" ] || { echo "no $src/SELECTORS.md: pass the path to a design-system checkout" >&2; exit 1; }
rm -rf platforms
cp -R "$src" platforms
find platforms -name .DS_Store -delete
printf 'meritum-design-system %s\n' "$(git -C "$ds" rev-parse HEAD)" >platforms/SOURCE
echo "platforms synced from $(cat platforms/SOURCE)"
