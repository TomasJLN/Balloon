#!/usr/bin/env bash
# Despliega Balloon (backend + frontend) en el servidor desde sus repositorios Git.
#
#   bash scripts/deploy.sh               actualiza lo que haya cambiado en origin
#   bash scripts/deploy.sh --force       reinstala y reinicia aunque no haya cambios
#   bash scripts/deploy.sh --solo-back   solo el backend
#   bash scripts/deploy.sh --solo-front  solo el frontend
#
# Variables opcionales:
#   BALLOON_FRONT_DIR   carpeta del frontend (por defecto ../Balloon_Front)
#   BALLOON_PM2_APP     nombre del proceso PM2 del backend (por defecto balloon)
#   BALLOON_NODE_VERSION  versión de Node para nvm (por defecto 24)
#
# Adaptado de scripts/linux/actualizar-pruebas-pm2.sh de CalzaSuite.

set -euo pipefail

# Todo va dentro de main: bash lee la función entera antes de ejecutarla, así que
# el `git pull` puede reescribir este fichero sin afectar a la ejecución en curso.
main() {
  local force=false do_back=true do_front=true
  for arg in "$@"; do
    case "$arg" in
      --force) force=true ;;
      --solo-back) do_front=false ;;
      --solo-front) do_back=false ;;
      *) echo "Opción desconocida: $arg" >&2; exit 1 ;;
    esac
  done

  local script_dir back_dir front_dir
  script_dir="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
  back_dir="$(CDPATH= cd -- "$script_dir/.." && pwd)"
  front_dir="${BALLOON_FRONT_DIR:-$back_dir/../Balloon_Front}"
  if $do_front; then
    front_dir="$(CDPATH= cd -- "$front_dir" 2>/dev/null && pwd)" || {
      echo "No existe la carpeta del frontend: ${BALLOON_FRONT_DIR:-$back_dir/../Balloon_Front}" >&2
      echo "Indícala con BALLOON_FRONT_DIR=<ruta>" >&2
      exit 1
    }
  fi
  PM2_APP="${BALLOON_PM2_APP:-balloon}"

  if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm use --silent "${BALLOON_NODE_VERSION:-24}"
  fi

  for cmd in git npm node curl; do
    command -v "$cmd" >/dev/null || { echo "Falta $cmd." >&2; exit 1; }
  done

  local node_major
  node_major="$(node -p "process.versions.node.split('.')[0]")"
  if (( node_major < 20 )); then
    echo "Balloon requiere Node.js 20.9 o superior (sharp); se ha encontrado $(node -v)." >&2
    exit 1
  fi

  if $do_back; then
    command -v pm2 >/dev/null || { echo "Falta PM2 para este usuario." >&2; exit 1; }
    if ! pm2 describe "$PM2_APP" >/dev/null 2>&1; then
      echo "PM2 no tiene ningún proceso llamado '$PM2_APP' para el usuario $(whoami)." >&2
      echo "Procesos disponibles:" >&2
      pm2 list >&2 || true
      echo "Indica el nombre con BALLOON_PM2_APP=<nombre> bash scripts/deploy.sh" >&2
      exit 1
    fi
  fi

  # Comprobar ambos repositorios antes de tocar nada
  $do_back && check_repo "$back_dir"
  if $do_front; then
    check_repo "$front_dir"
    if [[ ! -f "$front_dir/.env.production" ]]; then
      echo "Falta $front_dir/.env.production (VITE_BACKEND_URL de producción)." >&2
      exit 1
    fi
  fi

  if $do_back; then deploy_back "$back_dir" "$force"; fi
  if $do_front; then deploy_front "$front_dir" "$force"; fi

  echo "Despliegue terminado."
}

check_repo() {
  local dir="$1"
  git -C "$dir" rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
    echo "No es un repositorio Git: $dir" >&2; exit 1;
  }
  if ! git -C "$dir" diff --quiet || ! git -C "$dir" diff --cached --quiet; then
    echo "Hay cambios locales sin confirmar en $dir. Revísalos antes de desplegar." >&2
    exit 1
  fi
  if [[ -z "$(git -C "$dir" branch --show-current)" ]]; then
    echo "No hay una rama activa en $dir." >&2
    exit 1
  fi
}

# Hace pull y devuelve 0 si hay que desplegar (hubo cambios o --force)
pull_repo() {
  local dir="$1" force="$2" branch before after
  branch="$(git -C "$dir" branch --show-current)"
  before="$(git -C "$dir" rev-parse HEAD)"
  echo "[$(basename "$dir")] Buscando cambios en origin/$branch…"
  git -C "$dir" pull --ff-only origin "$branch"
  after="$(git -C "$dir" rev-parse HEAD)"

  if [[ "$before" == "$after" ]]; then
    if [[ "$force" == true ]]; then
      echo "[$(basename "$dir")] Sin cambios ($after), se fuerza el despliegue."
      return 0
    fi
    echo "[$(basename "$dir")] Ya está actualizado ($after)."
    return 1
  fi
  echo "[$(basename "$dir")] $before → $after"
}

deploy_back() {
  local dir="$1" force="$2"
  pull_repo "$dir" "$force" || return 0

  cd "$dir"

  # Si PM2 arranca el backend con nodemon hacen falta las devDependencies
  local exec_path
  exec_path="$(pm2 jlist | node -e '
    const apps = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const app = apps.find((a) => a.name === process.argv[1]);
    process.stdout.write(app ? String(app.pm2_env.pm_exec_path) : "");
  ' "$PM2_APP")"

  echo "[backend] Instalando dependencias…"
  if [[ "$exec_path" == *nodemon* ]]; then
    npm ci
  else
    npm ci --omit=dev
  fi

  # Los módulos nativos fallan al cargar, no al instalar: comprobarlo antes de
  # reiniciar para que el proceso actual siga sirviendo si algo va mal
  echo "[backend] Comprobando módulos nativos…"
  node -e "require('bcrypt'); require('sharp'); require('mysql2')"

  echo "[backend] Reiniciando $PM2_APP…"
  pm2 restart "$PM2_APP" --update-env

  local port health_url ready=false
  port="$(grep -E '^PORT=' .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]"' || true)"
  health_url="http://127.0.0.1:${port:-4000}/experience/list?limit=1"
  echo "[backend] Comprobando $health_url…"
  for _ in $(seq 1 30); do
    if curl --fail --silent --show-error --max-time 2 "$health_url" >/dev/null; then
      ready=true
      break
    fi
    sleep 1
  done

  if [[ "$ready" != true ]]; then
    echo "La API no responde en $health_url después de 30 segundos." >&2
    pm2 describe "$PM2_APP" >&2 || true
    pm2 logs "$PM2_APP" --lines 80 --nostream >&2 || true
    exit 1
  fi

  pm2 save
  echo "[backend] OK"
}

deploy_front() {
  local dir="$1" force="$2"
  pull_repo "$dir" "$force" || return 0

  cd "$dir"
  echo "[frontend] Instalando dependencias…"
  npm ci

  # Vite vacía build/ al compilar: guardar la versión actual para restaurarla
  # si la compilación falla y no dejar la web sin ficheros
  rm -rf build.prev
  if [[ -d build ]]; then cp -a build build.prev; fi

  echo "[frontend] Compilando…"
  if ! npm run build || [[ ! -f build/index.html ]]; then
    echo "La compilación del frontend ha fallado." >&2
    if [[ -d build.prev ]]; then
      rm -rf build
      mv build.prev build
      echo "Se ha restaurado el build anterior." >&2
    fi
    exit 1
  fi

  rm -rf build.prev
  echo "[frontend] OK"
}

main "$@"
