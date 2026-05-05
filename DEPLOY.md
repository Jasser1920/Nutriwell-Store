# Deploying Nutriwell to a VPS using Docker

This guide shows a minimal, repeatable workflow to deploy this repository to a Linux VPS using Docker & systemd.

Prerequisites (Ubuntu/Debian example):

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
# install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# (optional) install docker compose plugin
sudo apt-get update && sudo apt-get install -y docker-compose-plugin
```

Steps (on the VPS):

1. Clone the repo to a suitable path, e.g. `/home/ubuntu/nutriwell`.

```bash
git clone <your-repo-url> /home/ubuntu/nutriwell
cd /home/ubuntu/nutriwell
```

2. Copy `.env.example` to `.env` and update secrets (DB passwords, root password, origins):

```bash
cp .env.example .env
# edit .env with nano or your editor
nano .env
```

3. (Optional) Use the helper script to deploy:

```bash
cd /home/ubuntu/nutriwell
bash deploy/deploy_vps.sh
```

4. Or install the systemd unit (edit the `WorkingDirectory` path first):

```bash
sudo cp deploy/nutriwell.service /etc/systemd/system/nutriwell.service
sudo systemctl daemon-reload
sudo systemctl enable --now nutriwell.service
sudo systemctl status nutriwell.service
```

Useful commands:

```bash
docker compose logs -f backend
docker compose ps
docker compose down
```

Security notes:
- Set strong passwords in `.env` and avoid committing `.env` to git.
- Consider using a managed database or external secret store for production.
