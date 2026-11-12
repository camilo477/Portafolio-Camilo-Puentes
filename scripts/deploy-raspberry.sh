#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
destination=${PORTFOLIO_SSH:-}
if [[ ! $destination =~ ^[a-zA-Z0-9_][a-zA-Z0-9_.@-]*$ ]]; then
  echo 'Indica el destino: make deploy PORTFOLIO_SSH=usuario@servidor' >&2
  exit 1
fi
for tool in ssh rsync; do
  command -v "$tool" >/dev/null || { echo "Falta $tool." >&2; exit 1; }
done
dist="$repo_dir/web/dist"
for page in en/index.html es/index.html cv/Camilo_Puentes_CV.pdf; do
  [[ -s "$dist/$page" ]] || { echo 'Primero compila el sitio con make build.' >&2; exit 1; }
done
if [[ -n $(find "$dist" -type l -print -quit) ]]; then
  echo 'El artefacto de publicación no debe contener enlaces simbólicos.' >&2
  exit 1
fi
release="$(date -u +%Y%m%dT%H%M%S)-$(git -C "$repo_dir" rev-parse --short HEAD)"
if [[ -n $(git -C "$repo_dir" status --porcelain) ]]; then release+="-local"; fi
remote_root=/var/www/portfolio
ssh_options=(-o BatchMode=yes -o ConnectTimeout=10)

# Upload only the compiled public site and these deployment helpers.
ssh "${ssh_options[@]}" "$destination" 'bash -s' <<'REMOTE'
set -euo pipefail
command -v rsync >/dev/null
command -v curl >/dev/null
command -v flock >/dev/null
sudo -n test -x /usr/sbin/nginx
sudo -n install -d -m 755 -o "$(id -u)" -g "$(id -g)" \
  /var/www/portfolio /var/www/portfolio/releases /var/www/portfolio/.deployment
REMOTE
ssh "${ssh_options[@]}" "$destination" \
  "mkdir '$remote_root/releases/$release' '$remote_root/.deployment/$release'"
rsync -rlt --chmod=D755,F644 -e 'ssh -o BatchMode=yes -o ConnectTimeout=10' \
  "$dist/" "$destination:$remote_root/releases/$release/"
rsync -rlt --chmod=D755,F644 -e 'ssh -o BatchMode=yes -o ConnectTimeout=10' \
  "$repo_dir/infra/raspberry/" "$destination:$remote_root/.deployment/$release/"
ssh "${ssh_options[@]}" "$destination" \
  "bash '$remote_root/.deployment/$release/activate-release.sh' '$release'"
printf 'Publicación completada: %s\n' "$release"
