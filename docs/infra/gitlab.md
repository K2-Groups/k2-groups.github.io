---
layout: default
title: Gitlab
parent: Infra
---

# Gitlab

git is deployed at 37.221.17.230 with docker compose at `/opt/git/`.

We do not use any special configuration for our gitlab, but here are a few notes:
1. gitlab is not runnig on TLS. So we are actually using port 80 of the container (8000 of the host) for handling http requests.
2. data is stored in that same directory and **no back up plan** is available for it.

Make sure to check logs of the container with below command if gitlab is not healty:
```bash
docker compose logs  --tail 100 -f
```

if you get permission denied error in the container, this might help:
```bash
docker-compose run git update-permissions
```
