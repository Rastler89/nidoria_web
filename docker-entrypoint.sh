#!/bin/sh
set -e

# La URL de la API se resuelve en runtime con DB_HOST y se publica al
# navegador en un script estático. Así el bundle no depende de build args
# de Next y cambiar la URL no obliga a reconstruir la imagen.
if [ -n "${DB_HOST:-}" ]; then
  printf 'window.__NIDORIA_CONFIG__ = { apiHost: "%s" };\n' "$DB_HOST" > /app/public/runtime-config.js
fi

exec "$@"
