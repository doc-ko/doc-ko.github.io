#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLAYBOOK="${PLAYBOOK:-antora-playbook.yml}"
OUTPUT_DIR="${OUTPUT_DIR:-docs/build/site}"
ANTORA_IMAGE="${ANTORA_IMAGE:-antora/antora}"
SERVER_IMAGE="${SERVER_IMAGE:-nginx:alpine}"
PORT="${PORT:-8080}"
SERVE=1

usage() {
  cat <<EOF
Usage: scripts/view-docs.sh [--build-only]

Build the Antora docs with Docker, then serve the generated site.

Environment:
  ANTORA_IMAGE   Docker image used to run Antora (default: antora/antora)
  SERVER_IMAGE   Docker image used to serve the site (default: nginx:alpine)
  PLAYBOOK       Antora playbook path (default: antora-playbook.yml)
  OUTPUT_DIR     Generated site directory (default: docs/build/site)
  PORT           Local server port (default: 8080)
EOF
}

case "${1:-}" in
  "")
    ;;
  "--build-only")
    SERVE=0
    ;;
  "-h" | "--help")
    usage
    exit 0
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to build the Antora docs." >&2
  exit 1
fi

echo "Building Antora docs with ${ANTORA_IMAGE}..."
docker run --rm \
  -u "$(id -u):$(id -g)" \
  -e HOME=/antora \
  -e XDG_CACHE_HOME=/antora/.cache \
  -v "${ROOT_DIR}:/antora" \
  -w /antora \
  "${ANTORA_IMAGE}" "${PLAYBOOK}"

if [[ "${SERVE}" -eq 0 ]]; then
  echo "Antora docs built at ${OUTPUT_DIR}."
  exit 0
fi

echo "Serving Antora docs at http://localhost:${PORT}"
echo "Press Ctrl+C to stop the server."
docker run --rm \
  -p "${PORT}:80" \
  -v "${ROOT_DIR}/${OUTPUT_DIR}:/usr/share/nginx/html:ro" \
  "${SERVER_IMAGE}"
