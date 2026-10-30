# Deployment Guide

Flow: build the Docker image locally → save it as a tar → upload the tar to the server → run `deploy.sh`, which removes the old image/container of this project only and serves the new one.

| Item | Value |
|---|---|
| Server | `root@13.140.138.252` |
| Server folder | `/opt/bassir-website` |
| Image / container name | `bassir-website` |
| Host port | `8090` (override with `HOST_PORT=...`) |

> Do not commit the server password. Prefer SSH keys (`ssh-copy-id root@13.140.138.252`) so no password is needed.

## One-time server setup

```bash
ssh root@13.140.138.252
mkdir -p /opt/bassir-website
exit
```

Upload the deploy script once (and again whenever it changes):

```bash
scp deploy/deploy.sh root@13.140.138.252:/opt/bassir-website/deploy.sh
ssh root@13.140.138.252 "chmod +x /opt/bassir-website/deploy.sh"
```

Docker must be installed on the server (`docker --version`). If port 8090 is taken, pick another via `HOST_PORT`.

## Every deployment (run from the project root)

### 1. Delete the existing image locally

```bash
docker rmi -f bassir-website:latest
```

(It is fine if this reports "No such image".)

### 2. Build the new image

```bash
docker build -t bassir-website:latest .
```

If your machine is not linux/amd64 (e.g. Apple Silicon), use:

```bash
docker build --platform linux/amd64 -t bassir-website:latest .
```

### 3. Create the tar file

```bash
docker save -o bassir-website.tar bassir-website:latest
```

### 4. Ship the tar to the server

```bash
scp bassir-website.tar root@13.140.138.252:/opt/bassir-website/
```

### 5. Run the script on the server

```bash
ssh root@13.140.138.252 "cd /opt/bassir-website && ./deploy.sh"
```

The script will:
1. Stop and remove the old `bassir-website` container
2. Remove the old `bassir-website` image
3. `docker load` the new tar
4. Start the new container (`--restart unless-stopped`) on port 8090
5. Delete the uploaded tar

### 6. Verify

```bash
curl -I http://13.140.138.252:8090
ssh root@13.140.138.252 "docker ps --filter name=bassir-website && docker logs --tail 20 bassir-website"
```

### 7. Clean up locally

```bash
rm bassir-website.tar
```

## Rollback

Keep the previous tar locally (rename it, e.g. `bassir-website-prev.tar`), then repeat steps 4–5 with that file renamed back to `bassir-website.tar`.

## Domain / HTTPS

To serve `www.bassir.net`, point DNS to `13.140.138.252` and put a reverse proxy (nginx/Caddy/Traefik) with TLS in front of `127.0.0.1:8090`.
