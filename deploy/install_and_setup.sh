#!/usr/bin/env bash
set -euo pipefail

# Usage: sudo ./install_and_setup.sh /home/ubuntu/nutriwell
# Installs Docker & docker compose plugin, updates systemd unit WorkingDirectory

REPO_DIR=${1:-/home/ubuntu/nutriwell}

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run as root or with sudo: sudo $0 $REPO_DIR"
  exit 1
fi

echo "Repo dir: $REPO_DIR"
if [ ! -d "$REPO_DIR" ]; then
  echo "Repository directory does not exist: $REPO_DIR"
  echo "Please clone the repo first and re-run. Example:"
  echo "  git clone <repo> $REPO_DIR"
  exit 1
fi

echo "Installing prerequisites..."
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release

echo "Installing Docker..."
curl -fsSL https://get.docker.com | sh

echo "Trying to install docker compose plugin via package manager..."
if apt-get install -y docker-compose-plugin; then
  echo "docker compose plugin installed"
else
  echo "docker-compose-plugin not available; installing docker-compose standalone"
  DOCKER_COMPOSE_BIN=/usr/local/bin/docker-compose
  curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o "$DOCKER_COMPOSE_BIN"
  chmod +x "$DOCKER_COMPOSE_BIN"
fi

echo "Enabling docker service"
systemctl enable --now docker

if [ -n "${SUDO_USER:-}" ]; then
  echo "Adding user $SUDO_USER to docker group"
  usermod -aG docker "$SUDO_USER" || true
fi

SERVICE_SRC="$REPO_DIR/deploy/nutriwell.service"
if [ -f "$SERVICE_SRC" ]; then
  echo "Configuring systemd service from $SERVICE_SRC"
  sed -n '1,200p' "$SERVICE_SRC" >/etc/systemd/system/nutriwell.service
  # Replace WorkingDirectory line
  sed -i "s|^WorkingDirectory=.*|WorkingDirectory=$REPO_DIR|" /etc/systemd/system/nutriwell.service || true
  systemctl daemon-reload
  systemctl enable --now nutriwell.service
  echo "Started nutriwell.service"
else
  echo "Systemd service template not found at $SERVICE_SRC — skipping service install"
fi

echo "Bringing up containers with docker compose"
cd "$REPO_DIR"
docker compose pull || true
docker compose up --build -d

echo "Deployment should be running. Check logs with:"
echo "  docker compose logs -f backend"
