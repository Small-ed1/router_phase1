#!/usr/bin/env bash
set -euo pipefail

ZIM_DIR="/mnt/zims"
PORT="8081"

exec /usr/bin/kiwix-serve --library --port="${PORT}" "${ZIM_DIR}/library.xml"