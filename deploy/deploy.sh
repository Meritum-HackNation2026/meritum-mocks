#!/usr/bin/env bash
# Build and (re)deploy the platform mocks of one environment on dellpromaxgb10.
#   deploy/deploy.sh <main|develop> [git-sha]
# Runs on the self-hosted runner `dellpromaxgb10` (on the host itself).
# Needs the platform (meritum-infra: onprem/dellpromaxgb10/platform/setup.sh):
# network `meritum`, meritum-postgres, ~/meritum/envs/mocks-<env>.env and
# meritum-gateway, which routes meritum-<platform>[-dev].gburek.app here.
set -euo pipefail
repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
branch=${1:?usage: deploy.sh <main|develop> [sha]}
sha=${2:-$(git -C "$repo" rev-parse HEAD)}
case "$branch" in main) env=prd suffix="" ;; develop) env=dev suffix="-dev" ;; *) echo "only main and develop deploy" >&2; exit 1 ;; esac
state=${M_STATE:-$HOME/meritum}
gateway=${M_GATEWAY_BIND:-172.17.0.1:18095}
envfile="$state/envs/mocks-$env.env"
container="meritum-mocks-$env"
image="meritum-mocks:$env-${sha:0:12}"
log() { printf '[meritum-mocks] %s\n' "$*" >&2; }

[ -f "$envfile" ] || { echo "::error::$envfile missing: run the platform workflow in meritum-infra"; exit 1; }

labels=(--label meritum.managed=true --label meritum.role=mocks --label meritum.env="$env" --label meritum.sha="$sha")
docker build -q -t "$image" "${labels[@]}" "$repo" >/dev/null
log "built $image"

exec 9>"$state/deploy.lock"
flock 9  # one change at a time on this host
docker rm -f "$container" >/dev/null 2>&1 || true
docker run -d --name "$container" --network meritum --restart unless-stopped \
  "${labels[@]}" --env-file "$envfile" "$image" >/dev/null
log "started $container"

for platform in x facebook instagram reddit tiktok; do
  host="meritum-$platform$suffix.gburek.app"
  for i in $(seq 30); do
    if curl -fsS -H "Host: $host" "http://$gateway/api/health" | grep -q '"database":"ok"' \
      && curl -fsS -H "Host: $host" "http://$gateway/" | grep -q '<html'; then break; fi
    [ "$i" = 30 ] && { log "$host does not answer through $gateway"; docker logs --tail 50 "$container" >&2; exit 1; }
    sleep 2
  done
  log "serving $host"
done

docker image ls meritum-mocks --filter "label=meritum.env=$env" --format '{{.Repository}}:{{.Tag}}' \
  | grep -vx "$image" | xargs -r docker rmi >/dev/null 2>&1 || true
