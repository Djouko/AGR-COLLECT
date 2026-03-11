#!/bin/bash -eu
set -o pipefail

echo "============================================"
echo " AGR-Collect Central - Unified Container"
echo "============================================"

# ---- 1. Set defaults for environment variables ----
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
export EMAIL_SECURE="${EMAIL_SECURE:-false}"
export EMAIL_IGNORE_TLS="${EMAIL_IGNORE_TLS:-true}"
export EMAIL_USER="${EMAIL_USER:-}"
export EMAIL_PASSWORD="${EMAIL_PASSWORD:-}"

export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@agr-collect.local}"
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

# ---- 2. Generate secrets if not exist ----
echo "[1/5] Checking secrets..."
if [ ! -f /etc/secrets/enketo-secret ] || [ ! -f /etc/secrets/enketo-less-secret ] || [ ! -f /etc/secrets/enketo-api-key ]; then
    echo "  Generating encryption secrets..."
    /scripts/generate-secrets.sh
    echo "  Secrets generated."
else
    echo "  Secrets already exist."
fi

# ---- 3. Patch configs for unified container (localhost) ----
echo "[2/5] Patching configurations for unified container..."

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

# ---- 4. Create required directories ----
echo "[3/5] Creating directories..."
mkdir -p /var/log/supervisor /usr/odk/config /var/lib/redis/main /var/lib/redis/cache /data/transfer /etc/dh /etc/selfsign /etc/secrets

# ---- 5. Wait for PostgreSQL ----
echo "[4/5] Waiting for PostgreSQL at ${DB_HOST}..."
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

# ---- 6. Start all services via supervisord ----
echo "[5/5] Starting all services via supervisord..."
echo "============================================"
echo " Services: nginx, service, enketo, pyxform, redis-main, redis-cache"
echo " Domain: ${DOMAIN}"
echo " SSL: ${SSL_TYPE} (handled by reverse proxy)"
echo " Database: ${DB_HOST}"
echo " Admin: ${ADMIN_EMAIL}"
echo "============================================"

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/agr-collect.conf
