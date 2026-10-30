#!/usr/bin/env bash
# Runs on the server inside /opt/bassir-website.
# Removes the old container + image of this project only, loads the new tar and starts it.
set -euo pipefail

cd "$(dirname "$0")"

IMAGE="bassir-website"
CONTAINER="bassir-website"
TAR="bassir-website.tar"
HOST_PORT="${HOST_PORT:-8090}"

[ -f "$TAR" ] || { echo "Missing $TAR in $(pwd)"; exit 1; }

echo "==> Stopping and removing old container"
docker rm -f "$CONTAINER" 2>/dev/null || true

echo "==> Removing old image"
docker rmi -f "$IMAGE:latest" 2>/dev/null || true

echo "==> Loading new image from $TAR"
docker load -i "$TAR"

echo "==> Starting container on port $HOST_PORT"
docker run -d --name "$CONTAINER" --restart unless-stopped -p "$HOST_PORT:80" "$IMAGE:latest"

echo "==> Cleaning up tar"
rm -f "$TAR"

docker ps --filter "name=$CONTAINER"
echo "Done. Site is live on port $HOST_PORT"
