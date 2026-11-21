#!/usr/bin/env bash
# Check the design-system copies against SHA256SUMS (written by scripts/sync.sh),
# offline. Fails with the name of each file that was edited by hand.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "source: $(cat SOURCE)"
sha256sum --check --quiet --strict SHA256SUMS || {
  echo "::error file=SHA256SUMS::a design-system copy differs from SHA256SUMS; change meritum-design-system and run pnpm sync" >&2
  exit 1
}
