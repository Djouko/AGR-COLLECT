# AGR-Collect Central - EasyPanel deployment guide

This guide covers deploying the unified backend container (Nginx +
Node.js backend + Enketo + PyXForm + Redis) to EasyPanel behind a
Traefik reverse proxy.

**Architecture**
```
[Internet] -> EasyPanel Traefik (HTTPS, Let's Encrypt)
            -> agr-collect-app (this container, port 80)
               - Nginx (reverse proxy + SPA)
               - Node.js backend (port 8383, loopback)
               - Enketo (port 8005, loopback)
               - PyXForm (port 8081, loopback)
               - Redis main (6379, loopback) + cache (6380, loopback)
            -> Postgres 14 service (EasyPanel-managed)
```

---

## 1. Prerequisites on EasyPanel

1. A running **PostgreSQL 14** service. Take note of:
   - Host (inside the EasyPanel network, usually `<project>_db`)
   - Port (5432)
   - Database name, user, password
2. A domain pointed at EasyPanel (e.g. `agr-collect.your-domain.com`).
3. (Optional) an SMTP account for password-reset emails. Gmail app
   password or any transactional provider works.

---

## 2. Create the service

1. **Create Service > Dockerfile**.
2. Source: link this repository, branch `master` (or a tagged release).
3. Build context: `central/` (the folder that contains the `Dockerfile`).
4. Dockerfile path: `Dockerfile` (relative to that context).

---

## 3. Environment variables

| Name                 | Required? | Example                                 | Notes                                                                                     |
| -------------------- | --------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `DOMAIN`             | **yes**   | `agr-collect.your-domain.com`           | No scheme, no trailing slash. Must match the Traefik hostname.                            |
| `SSL_TYPE`           | **yes**   | `upstream`                              | Must be `upstream` on EasyPanel (Traefik terminates SSL).                                 |
| `HTTPS_PORT`         | no        | `443`                                   | Keep 443 unless you use a custom Traefik port.                                            |
| `SYSADMIN_EMAIL`     | **yes**   | `admin@saahdel.org`                     | Shown in the UI and used for Let's Encrypt registration.                                  |
| `DB_HOST`            | **yes**   | `<project>_db`                          | Internal hostname of the Postgres service.                                                |
| `DB_USER`            | **yes**   | `odk`                                   |                                                                                           |
| `DB_PASSWORD`        | **yes**   | -                                       | Use the value from the Postgres service.                                                  |
| `DB_NAME`            | **yes**   | `odk`                                   |                                                                                           |
| `DB_SSL`             | no        | `null`                                  | Keep `null` for the internal EasyPanel network.                                           |
| `ADMIN_EMAIL`        | no        | `admin@saahdel.org`                     | Default `admin@agr-collect.local`. Created on first boot.                                 |
| `ADMIN_PASSWORD`     | no        | `(use a strong one)`                    | Default `agrcollect2025` - **change this in production**.                                 |
| `EMAIL_HOST`         | *strong recommendation* | `smtp.gmail.com`          | If left at the default `localhost`, activation emails will not be delivered.              |
| `EMAIL_PORT`         | no        | `587`                                   | `465` if using SSL.                                                                       |
| `EMAIL_SECURE`       | no        | `false`                                 | `true` if port is 465.                                                                    |
| `EMAIL_IGNORE_TLS`   | no        | `false`                                 | Keep `false` for real SMTP.                                                               |
| `EMAIL_USER`         | no        | `no-reply@saahdel.org`                  | SMTP username.                                                                            |
| `EMAIL_PASSWORD`     | no        | -                                       | Gmail app password or SMTP password.                                                      |
| `EMAIL_FROM`         | no        | `no-reply@saahdel.org`                  | Defaults to `no-reply@${DOMAIN}`.                                                         |
| `OIDC_ENABLED`       | no        | `false`                                 | Keep `false` unless you operate an OIDC provider.                                         |
| `OIDC_ISSUER_URL`    | no        | -                                       | Required only if `OIDC_ENABLED=true`.                                                     |
| `OIDC_CLIENT_ID`     | no        | -                                       | Required only if `OIDC_ENABLED=true`.                                                     |
| `OIDC_CLIENT_SECRET` | no        | -                                       | Required only if `OIDC_ENABLED=true`.                                                     |

---

## 4. Domains and routing

- **Primary domain**: `agr-collect.your-domain.com` -> container port **80**.
- **HTTPS**: let EasyPanel issue a Let's Encrypt certificate for that host.
- **HTTP -> HTTPS redirect**: enable it in EasyPanel's Traefik settings.

The container itself only listens on port 80 (Nginx). SSL is terminated
by Traefik; `X-Forwarded-Proto: https` is injected by Nginx via the
`SSL_TYPE=upstream` branch of `files/nginx/setup-odk.sh`.

---

## 5. Persistent storage (mandatory)

EasyPanel must attach persistent volumes to the container, otherwise the
encryption secrets and Redis data will be regenerated on every rebuild
and the Enketo forms will break.

| Host volume name (suggested) | Container path   | Why                                                                |
| ---------------------------- | ---------------- | ------------------------------------------------------------------ |
| `agr-collect-secrets`        | `/etc/secrets`   | Enketo encryption keys (64/32/128 bytes). **Must persist.**        |
| `agr-collect-transfer`       | `/data/transfer` | Upload staging / large file buffers.                               |
| `agr-collect-dh`             | `/etc/dh`        | Diffie-Hellman params for TLS (only used if SSL_TYPE != upstream). |
| `agr-collect-redis`          | `/var/lib/redis` | Enketo main/cache Redis databases.                                 |

---

## 6. First boot and expected logs

Trigger a deploy. The container prints, in order:

```
============================================
 AGR-Collect Central - Unified Container
============================================
  DOMAIN resolved to: agr-collect.your-domain.com
  DB_HOST: <project>_db
  SSL_TYPE: upstream
  !! WARNING: EMAIL_HOST is still 'localhost' (default).   <-- only if SMTP not configured
  ...
[1/7] Checking secrets...
[2/7] Patching configurations for unified container...
  [DIAG] Backend config.json.template key values:
    xlsform.host = "host": "127.0.0.1",
    enketo.url = "url": "http://127.0.0.1:8005/-",
    internalDomain = "internalDomain": "http://127.0.0.1",
  [DIAG] Enketo config.json.template key values:
    redis.main.host = "host": "127.0.0.1",
    ...
[3/7] Creating directories...
[4/7] Waiting for PostgreSQL at <project>_db...
  PostgreSQL is ready.
[5/7] (Enketo marker check)
[6/7] Starting all services via supervisord...
```

Then supervisord logs the 6 processes (redis-main, redis-cache,
pyxform, enketo, service, nginx). Within ~20 s the backend service
should log `starting server.` and nginx should log `starting nginx for
upstream ssl...`.

---

## 7. Post-deploy verification

Run the following checks once the container is healthy:

1. **Front page loads**: `https://agr-collect.your-domain.com/` displays the SAAHDEL login page.
2. **API sanity check**:
   ```bash
   curl -i https://agr-collect.your-domain.com/v1/config/analytics
   ```
   Must return 200.
3. **Admin login**: log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
4. **Create a web user**: Users > New. With no SMTP configured, expect:
   - A success toast in the UI.
   - A line `!! mail send failed for accountCreated:<email>` in the container logs.
   - The user appearing in the list. Set a password manually through
     "Reset password" once SMTP is configured, or share the reset link
     from the logs.
5. **Create a project and upload a form (XLSX)**. The form must
   publish, indicated by a non-null Enketo id in the form row.
6. **Download the form with ODK Collect on a phone** and submit one
   entry.
7. **View the submission in Central**: the details page must show:
   - A human title like "Soumission de {agent} - {date}" (not the
     raw UUID).
   - The submitted form values under "Données soumises".
   - The activity timeline.
8. **Click Edit on the submission**: Enketo opens inline with the form
   pre-filled. Submit; the edit saves a new version.

If any of these steps fails, open the container logs and search for the
step number above.

---

## 8. Known non-blocking items

- **Password-reset emails** require an SMTP configuration. Without it,
  user accounts are still created but invitation links only appear in
  the container logs (grep for `mail send failed`).
- **Push notifications to field agents** when admins review their
  submissions is **not yet implemented** (tracked as P4). Agents must
  re-open ODK Collect and sync to see new comments / review states.
- The `SENTRY_*` variables point to a shared Sentry project by default.
  Override them with your own Sentry DSN if you want private telemetry.

---

## 9. Updating

Push a new commit to the branch followed by the EasyPanel service, then
click **Rebuild**. Secrets and Redis persist through rebuilds thanks to
the volumes above. The backend runs database migrations automatically
at startup (`start-odk.sh` -> `node ./lib/bin/run-migrations`).

---

## 10. Troubleshooting cheat sheet

| Symptom                                                                | Likely cause                                                       | Fix                                                                                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 502 Bad Gateway from Traefik                                           | Container not yet ready, or nginx not listening on 80              | Wait ~30 s after a rebuild; verify `EXPOSE 80` maps to the Traefik route.                                                              |
| Browser CSP error "frame-src 'none'" when clicking "New submission"    | Old nginx config without the frame-src fix                         | Rebuild. The current `odk.conf.template` sets `frame-src 'self'` for form submission routes.                                           |
| "The Enketo service returned an unexpected response (code 500.4)"      | Enketo cannot reach Central's public domain from inside container  | Already fixed in submissions.js -> uses `internalDomain` for Enketo <-> Central calls. Ensure the deployed commit contains `P3`.       |
| Can't log in on first boot                                             | Default admin password was changed by `ADMIN_PASSWORD` env var     | Use the value you set.                                                                                                                  |
| "Forms are missing" after a rebuild                                    | Redis volume was lost, so Enketo survey IDs became stale           | The start script auto-clears stale IDs on first boot (`/var/lib/redis/.enketo-initialized` marker) and re-queues publish events.        |
| Activation email never arrives                                         | SMTP not configured                                                | Set `EMAIL_HOST/PORT/USER/PASSWORD` env vars (see §3).                                                                                 |
