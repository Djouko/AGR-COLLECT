#!/bin/bash -eu
set -o pipefail

echo "============================================"
echo " AGR-Collect Central - Unified Container"
echo "============================================"

# ---- 1. Set defaults for environment variables ----

# CRITICAL: EasyPanel/container platforms inject PORT=80.
# Our services each have their own ports (nginx:80, backend:8383, enketo:8005).
# Unset PORT so Node.js apps don't override their configured ports.
unset PORT 2>/dev/null || true

export DOMAIN="${DOMAIN:-localhost}"
# Strip protocol prefix and trailing slash from DOMAIN (EasyPanel passes full URL)
DOMAIN=$(echo "$DOMAIN" | sed 's|^https://||;s|^http://||;s|/$||')
export DOMAIN

export SYSADMIN_EMAIL="${SYSADMIN_EMAIL:-admin@agr-collect.local}"
export SSL_TYPE="${SSL_TYPE:-upstream}"
export HTTPS_PORT="${HTTPS_PORT:-443}"
export HTTP_PORT="${HTTP_PORT:-80}"
export OIDC_ENABLED="${OIDC_ENABLED:-false}"
export OIDC_ISSUER_URL="${OIDC_ISSUER_URL:-}"
export OIDC_CLIENT_ID="${OIDC_CLIENT_ID:-}"
export OIDC_CLIENT_SECRET="${OIDC_CLIENT_SECRET:-}"

# Node.js options (from docker-compose SERVICE_NODE_OPTIONS)
export NODE_OPTIONS="${NODE_OPTIONS:-${SERVICE_NODE_OPTIONS:-}}"
export PGAPPNAME="${PGAPPNAME:-odkcentral}"

export DB_HOST="${DB_HOST:-localhost}"
export DB_USER="${DB_USER:-odk}"
export DB_PASSWORD="${DB_PASSWORD:-odk}"
export DB_NAME="${DB_NAME:-odk}"
export DB_SSL="${DB_SSL:-null}"
export DB_POOL_SIZE="${DB_POOL_SIZE:-10}"

export EMAIL_FROM="${EMAIL_FROM:-no-reply@${DOMAIN}}"
export EMAIL_HOST="${EMAIL_HOST:-localhost}"
export EMAIL_PORT="${EMAIL_PORT:-25}"
# Port 465 is implicit TLS; every other port negotiates STARTTLS.
if [ "${EMAIL_PORT}" = "465" ]; then
    export EMAIL_SECURE="${EMAIL_SECURE:-true}"
else
    export EMAIL_SECURE="${EMAIL_SECURE:-false}"
fi
# STARTTLS may only be skipped for the local, unauthenticated relay: real
# providers (Brevo, SendGrid, Gmail...) refuse AUTH over a plaintext channel.
if [ "${EMAIL_HOST}" = "localhost" ]; then
    export EMAIL_IGNORE_TLS="${EMAIL_IGNORE_TLS:-true}"
else
    export EMAIL_IGNORE_TLS="${EMAIL_IGNORE_TLS:-false}"
fi
export EMAIL_USER="${EMAIL_USER:-}"
export EMAIL_PASSWORD="${EMAIL_PASSWORD:-}"

# Backend worker processes. All services share this container (and usually the
# Droplet with Postgres and EasyPanel), so default to 2 instead of the upstream
# memory-based value. Override with WORKER_COUNT.
export WORKER_COUNT="${WORKER_COUNT:-2}"

export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@agr-collect.local}"
if [ -z "${ADMIN_PASSWORD:-}" ]; then
    echo "  !! WARNING: ADMIN_PASSWORD is not set: the publicly documented default"
    echo "  !! password is used if the admin account has to be created. Set it in EasyPanel."
fi
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-agrcollect2025}"

export SENTRY_ORG_SUBDOMAIN="${SENTRY_ORG_SUBDOMAIN:-o130137}"
export SENTRY_KEY="${SENTRY_KEY:-3cf75f54983e473da6bd07daddf0d2ee}"
export SENTRY_PROJECT="${SENTRY_PROJECT:-1298632}"
export SENTRY_TRACE_RATE="${SENTRY_TRACE_RATE:-0.1}"

export SESSION_LIFETIME="${SESSION_LIFETIME:-86400}"

# Enketo needs these
export SUPPORT_EMAIL="${SUPPORT_EMAIL:-${SYSADMIN_EMAIL}}"
export ENKETO_SRC_DIR="/srv/src/enketo/packages/enketo-express"

# S3 defaults (empty = disabled)
export S3_SERVER="${S3_SERVER:-}"
export S3_ACCESS_KEY="${S3_ACCESS_KEY:-}"
export S3_SECRET_KEY="${S3_SECRET_KEY:-}"
export S3_BUCKET_NAME="${S3_BUCKET_NAME:-}"

export CERTBOT_EMAIL="${SYSADMIN_EMAIL}"

# Nginx needs these
export CERT_DOMAIN="${DOMAIN}"

echo "  DOMAIN resolved to: ${DOMAIN}"
echo "  DB_HOST: ${DB_HOST}"
echo "  SSL_TYPE: ${SSL_TYPE}"

# SMTP configuration warning: if the host is still the default (localhost), no
# email can actually be delivered. User creation still works (the backend has
# been made resilient to SMTP failures) but admins will need to read password
# reset links from the service logs until SMTP is configured.
if [ "${EMAIL_HOST}" = "localhost" ]; then
    echo ""
    echo "  ================================================================"
    echo "  !! WARNING: EMAIL_HOST is still 'localhost' (default)."
    echo "  !! Activation and password-reset emails will NOT be delivered."
    echo "  !! New web users can then sign in only if the admin sets an initial"
    echo "  !! password when creating them. DigitalOcean blocks outbound ports 25, 465 and 587,"
    echo "  !! so use a provider reachable on port 2525, e.g. Brevo:"
    echo "  !!   EMAIL_HOST=smtp-relay.brevo.com"
    echo "  !!   EMAIL_PORT=2525"
    echo "  !!   EMAIL_USER=<brevo-smtp-login>"
    echo "  !!   EMAIL_PASSWORD=<brevo-smtp-key>"
    echo "  !!   EMAIL_FROM=<sender verified in Brevo>"
    echo "  ================================================================"
    echo ""
fi

# Docker only gives VOLUME paths anonymous volumes, which EasyPanel drops on
# every redeploy: Enketo secrets and Redis data would then be lost each time.
for dir in /etc/secrets /var/lib/redis; do
    mount_root=$(awk -v d="$dir" '$5 == d { print $4 }' /proc/self/mountinfo)
    if [ -z "$mount_root" ] || echo "$mount_root" | grep -Eq '/volumes/[0-9a-f]{64}/_data$'; then
        echo "  !! WARNING: $dir is not a persistent volume. Add a volume mount for it"
        echo "  !! in EasyPanel (Service > Mounts), see EASYPANEL-DEPLOY.md section 5."
    fi
done

# ---- 2. Generate secrets if not exist ----
echo "[1/7] Checking secrets..."
if [ ! -f /etc/secrets/enketo-secret ] || [ ! -f /etc/secrets/enketo-less-secret ] || [ ! -f /etc/secrets/enketo-api-key ]; then
    echo "  Generating encryption secrets..."
    /scripts/generate-secrets.sh
    echo "  Secrets generated."
else
    echo "  Secrets already exist."
fi

# ---- 3. Patch configs for unified container (localhost) ----
echo "[2/7] Patching configurations for unified container..."

# -- Nginx: proxy to localhost instead of Docker service names --
sed -i 's|proxy_pass http://service:8383|proxy_pass http://127.0.0.1:8383|g' /usr/share/odk/nginx/backend.conf
sed -i 's|proxy_pass http://enketo:8005|proxy_pass http://127.0.0.1:8005|g' /usr/share/odk/nginx/odk.conf.template
sed -i 's|proxy_pass http://service:8383|proxy_pass http://127.0.0.1:8383|g' /usr/share/odk/nginx/redirector.conf

# Remove http2 directive (apt nginx may not support 'http2 on;' syntax)
sed -i '/http2 on;/d' /usr/share/odk/nginx/odk.conf.template

# -- Service config: pyxform, enketo, internal domain to localhost --
sed -i 's|"host": "pyxform"|"host": "127.0.0.1"|g' /usr/share/odk/config.json.template
# Change pyxform port 80 → 8081 (avoid conflict with nginx)
python3 -c "
import re
with open('/usr/share/odk/config.json.template', 'r') as f:
    content = f.read()
content = re.sub(
    r'(\"xlsform\"[^}]*\"port\":\s*)80(\s*[}\n])',
    r'\g<1>8081\2',
    content,
    flags=re.DOTALL
)
with open('/usr/share/odk/config.json.template', 'w') as f:
    f.write(content)
"
sed -i 's|"url": "http://enketo:8005/-"|"url": "http://127.0.0.1:8005/-"|g' /usr/share/odk/config.json.template
sed -i 's|"internalDomain": "https://nginx"|"internalDomain": "http://127.0.0.1"|g' /usr/share/odk/config.json.template

# -- Enketo config: redis hosts and server url to localhost --
ENKETO_CFG="/srv/src/enketo/packages/enketo-express/config/config.json.template"
sed -i 's|"host": "enketo_redis_main"|"host": "127.0.0.1"|g' "$ENKETO_CFG"
sed -i 's|"host": "enketo_redis_cache"|"host": "127.0.0.1"|g' "$ENKETO_CFG"
sed -i 's|"server url": "nginx"|"server url": "127.0.0.1"|g' "$ENKETO_CFG"
# Also patch the initial copy used at build time
cp "$ENKETO_CFG" "${ENKETO_CFG%.template}"

echo "  Configuration patched for localhost."

# ---- Diagnostic: show critical config values after patching ----
echo "  [DIAG] Backend config.json.template key values:"
echo "    xlsform.host = $(grep -o '"host":.*' /usr/share/odk/config.json.template | head -1)"
echo "    enketo.url = $(grep -o '"url":.*"http[^"]*"' /usr/share/odk/config.json.template | head -1)"
echo "    internalDomain = $(grep -o '"internalDomain":.*' /usr/share/odk/config.json.template | head -1)"
echo "  [DIAG] Enketo config.json.template key values:"
echo "    redis.main.host = $(grep -A1 '"main"' "$ENKETO_CFG" | grep host)"
echo "    redis.cache.host = $(grep -A1 '"cache"' "$ENKETO_CFG" | grep host)"
echo "    server url = $(grep '"server url"' "$ENKETO_CFG")"

# ---- 4. Create required directories ----
echo "[3/7] Creating directories..."
mkdir -p /var/log/supervisor /usr/odk/config /var/lib/redis/main /var/lib/redis/cache /data/transfer /etc/dh /etc/selfsign /etc/secrets

# ---- 5. Wait for PostgreSQL ----
echo "[4/7] Waiting for PostgreSQL at ${DB_HOST}..."
PGPORT="${PGPORT:-5432}"
for i in $(seq 1 60); do
    if nc -z "$DB_HOST" "$PGPORT" 2>/dev/null; then
        echo "  PostgreSQL is ready."
        break
    fi
    if [ "$i" -eq 60 ]; then
        echo "  WARNING: Could not connect to PostgreSQL at ${DB_HOST}:${PGPORT} after 60s. Starting anyway..."
    fi
    sleep 1
done

# ---- 6. Repair stale Enketo IDs if Redis was wiped ----
# When the container is rebuilt, Redis loses survey data but PostgreSQL keeps
# stale Enketo IDs → "survey not found" errors. Detect this via a marker file
# in the Redis volume and repair automatically.
ENKETO_MARKER="/var/lib/redis/.enketo-initialized"
psql_agr() { PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${PGPORT}" -U "${DB_USER}" -d "${DB_NAME}" "$@"; }
if [ ! -f "$ENKETO_MARKER" ]; then
    echo "[5/7] Fresh Redis detected - checking for stale Enketo survey IDs..."
    # The marker is only written once the check succeeded, so a database that
    # is not reachable yet is checked again on the next start.
    if ! forms_table=$(psql_agr -tAc "select to_regclass('public.forms')" 2>&1); then
        echo "  WARNING: database not reachable (${forms_table}); will retry on next start."
    elif [ -z "$forms_table" ]; then
        echo "  Fresh database: nothing to repair."
        touch "$ENKETO_MARKER"
    elif psql_agr -q -v ON_ERROR_STOP=1 --single-transaction <<'EOSQL'
-- Clear stale Enketo IDs from published forms
UPDATE forms SET "enketoId" = NULL, "enketoOnceId" = NULL
  WHERE "enketoId" IS NOT NULL OR "enketoOnceId" IS NOT NULL;
-- Clear stale Enketo IDs from draft form defs
UPDATE form_defs SET "enketoId" = NULL WHERE "enketoId" IS NOT NULL;
-- Re-queue worker events so backend re-creates Enketo surveys automatically
INSERT INTO audits (action, "acteeId", "loggedAt", processed, claimed, failures)
  SELECT 'form.update.publish', "acteeId", now(), NULL, NULL, 0
  FROM forms WHERE "currentDefId" IS NOT NULL AND "deletedAt" IS NULL;
EOSQL
    then
        echo "  Enketo IDs cleared. Worker will re-create surveys on startup."
        touch "$ENKETO_MARKER"
    else
        echo "  WARNING: could not clear stale Enketo IDs; will retry on next start."
    fi
else
    echo "[5/7] Enketo marker found - Redis data should be intact."
fi

# ---- 7. Start all services via supervisord ----
echo "[6/7] Starting all services via supervisord..."
echo "============================================"
echo " Services: nginx, service, enketo, pyxform, redis-main, redis-cache"
echo " Domain: ${DOMAIN}"
echo " SSL: ${SSL_TYPE} (handled by reverse proxy)"
echo " Database: ${DB_HOST}"
echo " Admin: ${ADMIN_EMAIL}"
echo "============================================"

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/agr-collect.conf
