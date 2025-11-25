#!/bin/bash
set -e

KEYFILE_PATH="/data/keyfile/mongo.key"

if [[ "$@" =~ "--keyFile" ]] && [ ! -f "$KEYFILE_PATH" ]; then
    echo "Entrypoint wrapper: Keyfile specified but not found. Generating a new one..."

    mkdir -p "$(dirname "$KEYFILE_PATH")"

    openssl rand -base64 756 > "$KEYFILE_PATH"

    chmod 400 "$KEYFILE_PATH"

    chown 999:999 "$KEYFILE_PATH"

    echo "Entrypoint wrapper: Keyfile successfully generated at $KEYFILE_PATH."
fi

exec /usr/local/bin/docker-entrypoint.sh "$@"
