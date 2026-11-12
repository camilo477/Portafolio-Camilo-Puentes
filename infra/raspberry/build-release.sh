#!/usr/bin/env bash
set -euo pipefail

repo=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)
revision=$(git -C "$repo" rev-parse --short HEAD)
base=/var/www/portfolio
current=$(readlink "$base/current" || true)
if [[ $current == *-"$revision" ]] \
  && curl --fail --silent --max-time 5 http://127.0.0.1:3003/en/ | grep -F 'Camilo Puentes Portfolio' >/dev/null; then
  printf 'La versión %s ya está publicada en https://camiska.lat/\n' "$revision"
  exit 0
fi
for tool in docker curl flock; do
  command -v "$tool" >/dev/null || { echo "Falta $tool." >&2; exit 1; }
done
sudo -n test -x /usr/sbin/nginx
node_version=$(tr -d '\r\n' < "$repo/.nvmrc")
[[ $node_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo 'Versión de Node inválida.' >&2; exit 1; }
image="portfolio-build:$revision"
printf 'Compilando %s en la Raspberry con Node %s...\n' "$revision" "$node_version"
docker build --pull --build-arg "NODE_VERSION=$node_version" \
  -f "$repo/infra/raspberry/Dockerfile" -t "$image" "$repo"

release="$(date -u +%Y%m%dT%H%M%S)-$revision"
candidate="$base/releases/$release"
helpers="$base/.deployment/$release"
sudo -n install -d -m 755 -o "$(id -u)" -g "$(id -g)" \
  "$base" "$base/releases" "$base/.deployment"
mkdir "$candidate" "$helpers"
container=''
cleanup() {
  [[ -z $container ]] || docker rm "$container" >/dev/null
}
trap cleanup EXIT
container=$(docker create "$image")
docker cp "$container:/app/web/dist/." "$candidate/"
if [[ -n $(find "$candidate" -type l -print -quit) ]]; then
  echo 'El artefacto no debe contener enlaces simbólicos.' >&2
  exit 1
fi
chmod -R a+rX "$candidate"
cp "$repo/infra/raspberry/nginx.conf" "$repo/infra/raspberry/activate-release.sh" "$helpers/"
bash "$helpers/activate-release.sh" "$release"
install -d "$HOME/bin"
install -m 755 "$repo/scripts/pullportafolio" "$HOME/bin/pullportafolio"
printf 'Portafolio actualizado: https://camiska.lat/\n'
