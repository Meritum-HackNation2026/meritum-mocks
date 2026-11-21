#!/usr/bin/env bash
# Refresh the copies of meritum-design-system, the single source of copy, tokens,
# contracts and mock pages (skill meritum-ui, ADR-33):
#   contracts/meritum.ts, copy/pl.json, tokens/meritum.css, brand/meritum-app-icon.svg,
#   platforms/ (demo/platforms)
#   pnpm sync              copy from the design system's main
#   pnpm sync <ref>        copy from another branch, tag or commit
# Never edit the copies by hand: pnpm test (tests/design-system-copy.test.ts) checks
# them against SHA256SUMS. Change the design system, then run this script.
# Mirrors scripts/sync.sh in meritum-extension (plus platforms/ from the tarball).
# Needs `gh` signed in with read access to Meritum-HackNation2026/meritum-design-system.
set -euo pipefail
cd "$(dirname "$0")/.."
repo=Meritum-HackNation2026/meritum-design-system
ref=$(gh api "repos/$repo/commits/${1:-main}" --jq .sha)

files=(
  contracts/meritum.ts
  copy/pl.json
  tokens/meritum.css
  brand/meritum-app-icon.svg
)
for f in "${files[@]}"; do
  mkdir -p "$(dirname "$f")"
  # The contents API path is a URL: encode spaces, the array keeps names whole.
  gh api -H 'Accept: application/vnd.github.raw' "repos/$repo/contents/${f// /%20}?ref=$ref" >"$f"
done

# platforms/ is a whole folder: take it from the tarball of the same commit.
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
gh api "repos/$repo/tarball/$ref" | tar -xz -C "$tmp" --strip-components=1
rm -rf platforms
cp -R "$tmp/demo/platforms" platforms
find platforms -name .DS_Store -delete

printf 'meritum-design-system %s\n' "$ref" >SOURCE
{
  sha256sum "${files[@]}"
  find platforms -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum
} >SHA256SUMS
echo "design system copies synced from $repo@${ref:0:12}"
