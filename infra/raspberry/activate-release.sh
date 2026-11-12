#!/usr/bin/env bash
set -euo pipefail

release=${1:-}
[[ $release =~ ^[0-9]{8}T[0-9]{6}-[a-f0-9]+(-local)?$ ]] || { echo 'Identificador de versión inválido.' >&2; exit 1; }
base=/var/www/portfolio
candidate="$base/releases/$release"
helpers=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
site=/etc/nginx/sites-available/portfolio
enabled=/etc/nginx/sites-enabled/portfolio
exec 9>"$base/.deploy.lock"
flock -n 9 || { echo 'Ya hay una publicación en curso.' >&2; exit 1; }

for page in en/index.html es/index.html cv/Camilo_Puentes_CV.pdf; do
  [[ -s "$candidate/$page" ]] || { echo "Falta $page en la versión candidata." >&2; exit 1; }
done
[[ ! -e "$base/current" || -L "$base/current" ]] || { echo 'current debe ser un enlace simbólico.' >&2; exit 1; }
if [[ -e "$enabled" || -L "$enabled" ]]; then
  [[ -L "$enabled" && $(readlink "$enabled") == "$site" ]] || { echo 'El sitio Nginx existente no pertenece a este despliegue.' >&2; exit 1; }
fi
previous=$(readlink "$base/current" || true)
had_config=false
had_enabled=false
[[ ! -L "$enabled" ]] || had_enabled=true
if sudo -n test -f "$site"; then
  sudo -n cp -p "$site" "$helpers/previous-nginx.conf"
  had_config=true
fi
completed=false
rollback() {
  result=$?
  trap - EXIT
  if [[ $completed != true ]]; then
    if [[ -n $previous ]]; then
      ln -s "$previous" "$base/rollback-$release"
      mv -Tf "$base/rollback-$release" "$base/current"
    else
      rm -f "$base/current"
    fi
    if [[ $had_config == true ]]; then
      sudo -n cp -p "$helpers/previous-nginx.conf" "$site"
    else
      sudo -n rm -f "$site"
    fi
    [[ $had_enabled == true ]] || sudo -n rm -f "$enabled"
    if sudo -n /usr/sbin/nginx -t; then sudo -n systemctl reload nginx; fi
    echo 'No se activó la versión: se restauró la configuración anterior.' >&2
  fi
  exit "$result"
}
trap rollback EXIT
sudo -n install -m 644 "$helpers/nginx.conf" "$site"
if [[ $had_enabled != true ]]; then sudo -n ln -s "$site" "$enabled"; fi
ln -s "$candidate" "$base/current-$release"
mv -Tf "$base/current-$release" "$base/current"
sudo -n /usr/sbin/nginx -t
sudo -n systemctl reload nginx

for attempt in {1..10}; do
  if curl --fail --silent --max-time 5 http://127.0.0.1:3003/en/ | grep -F 'Camilo Puentes Portfolio' >/dev/null \
    && curl --fail --silent --max-time 5 http://127.0.0.1:3003/es/ | grep -F 'Portafolio Camilo Puentes' >/dev/null; then
    curl --fail --silent --max-time 5 -o /dev/null http://127.0.0.1:3003/cv/Camilo_Puentes_CV.pdf
    completed=true
    printf 'Versión activa: %s\n' "$release"
    [[ -z $previous ]] || printf 'Versión anterior conservada: %s\n' "$previous"
    exit 0
  fi
  sleep 1
done
echo 'Nginx no respondió con el portafolio esperado.' >&2
exit 1
