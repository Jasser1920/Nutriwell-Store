#!/usr/bin/env bash
set -euo pipefail

# Simple deploy helper for VPS (edit paths before use)
REPO_DIR="/home/ubuntu/nutriwell" # <- set this to your repo path on the VPS

if [ "$(id -u)" -ne 0 ]; then
  echo "Warning: It's recommended to run this script as a user in the 'docker' group or with sudo."
fi

echo "Using repo dir: $REPO_DIR"
cd "$REPO_DIR"

if [ ! -f .env ]; then
  echo ".env not found — copying .env.example to .env (please edit .env before proceeding)"
  cp .env.example .env || true
  echo "Edit .env and re-run the script when values are set. Exiting."
  exit 1
fi

echo "Pulling images and building services..."
docker compose pull || true
docker compose up --build -d

echo "Deployment started. Use 'docker compose logs -f' to follow logs."
