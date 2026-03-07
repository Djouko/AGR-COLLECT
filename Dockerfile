# ============================================
# AGR-Collect Central - Unified Dockerfile
# For EasyPanel / single-container deployment
# ============================================
# This Dockerfile bundles ALL services into one container:
#   - Nginx (frontend + reverse proxy)
#   - Node.js backend (ODK Central API)
#   - Enketo (web forms engine)
#   - PyXForm (XLSForm to XML converter)
#   - Redis x2 (Enketo data + cache)
#
# External dependencies:
#   - PostgreSQL 14+ (EasyPanel database service)
#   - SMTP server (Gmail or other)
#
# SSL is handled by EasyPanel's Traefik (SSL_TYPE=upstream)
# ============================================

ARG node_version=22.21.1

# ---------- Stage 1: PostgreSQL APT repository ----------
FROM node:${node_version}-slim AS pgdg
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates curl gpg \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ $(grep -oP 'VERSION_CODENAME=\K\w+' /etc/os-release)-pgdg main" \
      | tee /etc/apt/sources.list.d/pgdg.list \
    && curl https://www.postgresql.org/media/keys/ACCC4CF8.asc \
      | gpg --dearmor > /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg

# ---------- Stage 2: Build Frontend ----------
FROM node:${node_version}-slim AS frontend
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*
COPY ./ ./
RUN find . -name '*.sh' -exec sed -i 's/\r$//' {} + \
    && find . -name '*.sh' -exec chmod +x {} +
RUN files/prebuild/write-version.sh
RUN files/prebuild/build-frontend.sh

# ---------- Stage 3: Git Version Tags ----------
FROM node:${node_version}-slim AS versions
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*
COPY . .
RUN mkdir -p /tmp/sentry-versions \
    && (git describe --tags --dirty 2>/dev/null || echo "unknown") > /tmp/sentry-versions/central
WORKDIR /server
RUN (git describe --tags --dirty 2>/dev/null || echo "unknown") > /tmp/sentry-versions/server
WORKDIR /client
RUN (git describe --tags --dirty 2>/dev/null || echo "unknown") > /tmp/sentry-versions/client

# ---------- Stage 4: Enketo from official image ----------
FROM ghcr.io/enketo/enketo:7.5.1 AS enketo-src

# ============================================
# FINAL STAGE - Unified Container
# ============================================
FROM node:${node_version}-slim

LABEL maintainer="SAAHDEL <emmanueljuniordequa2@gmail.com>"
LABEL description="AGR-Collect Central - Unified deployment"

# -- System packages --
COPY --from=pgdg /etc/apt/sources.list.d/pgdg.list /etc/apt/sources.list.d/
COPY --from=pgdg /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg /etc/apt/trusted.gpg.d/

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    redis-server \
    supervisor \
    postgresql-client-14 \
    wait-for-it \
    cron \
    procps \
    netcat-openbsd \
    openssl \
    gpg \
    perl \
    mawk \
    python3 \
    python3-pip \
    python3-lxml \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && mkdir -p /etc/nginx/conf.d /etc/nginx/ssl

# -- Install PyXForm (Python) --
RUN pip3 install --break-system-packages --no-cache-dir \
    pyxform==4.2.0 flask gunicorn

# -- Backend Service (Node.js API) --
WORKDIR /usr/odk

COPY server/package*.json ./
RUN npm clean-install --omit=dev --no-audit --fund=false --update-notifier=false

COPY server/ ./
COPY files/shared/envsub.awk /scripts/
COPY files/service/scripts/ ./
COPY files/service/config.json.template /usr/share/odk/
COPY files/service/crontab /etc/cron.d/odk
RUN sed -i 's/\r$//' /etc/cron.d/odk && chmod 644 /etc/cron.d/odk
COPY files/service/odk-cmd /usr/bin/
RUN find /usr/odk -name '*.sh' -exec sed -i 's/\r$//' {} + \
    && find /usr/odk -name '*.sh' -exec chmod +x {} + \
    && sed -i 's/\r$//' /scripts/envsub.awk \
    && sed -i 's/\r$//' /usr/bin/odk-cmd && chmod +x /usr/bin/odk-cmd
COPY --from=versions /tmp/sentry-versions/ ./sentry-versions

# -- Nginx (Frontend + Reverse Proxy) --
RUN mkdir -p /usr/share/odk/nginx/

COPY files/nginx/setup-odk.sh /scripts/
COPY files/nginx/redirector.conf /usr/share/odk/nginx/
COPY files/nginx/backend.conf /usr/share/odk/nginx/
COPY files/nginx/common-headers.conf /usr/share/odk/nginx/
COPY files/nginx/robots.txt /usr/share/nginx/html
COPY files/nginx/odk.conf.template /usr/share/odk/nginx/
COPY files/nginx/client-config.json.template /usr/share/odk/nginx/
COPY --from=frontend client/dist/ /usr/share/nginx/html/
COPY --from=frontend /tmp/version.txt /usr/share/nginx/html/

# -- Enketo (Web Forms Engine) --
COPY --from=enketo-src /srv/src/enketo/ /srv/src/enketo/
COPY files/enketo/config.json.template /srv/src/enketo/packages/enketo-express/config/config.json.template
COPY files/enketo/config.json.template /srv/src/enketo/packages/enketo-express/config/config.json
COPY files/enketo/start-enketo.sh /srv/src/enketo/packages/enketo-express/start-enketo.sh
RUN sed -i 's/\r$//' /srv/src/enketo/packages/enketo-express/start-enketo.sh \
    && chmod +x /srv/src/enketo/packages/enketo-express/start-enketo.sh

# -- Redis configs --
COPY files/enketo/redis-enketo-main.conf /etc/redis/redis-main.conf
COPY files/enketo/redis-enketo-cache.conf /etc/redis/redis-cache.conf

# -- Secrets generator --
COPY files/enketo/generate-secrets.sh /scripts/generate-secrets.sh
RUN sed -i 's/\r$//' /scripts/generate-secrets.sh && chmod +x /scripts/generate-secrets.sh

# -- PyXForm server --
COPY files/easypanel/pyxform-server.py /opt/pyxform/pyxform-server.py

# -- Supervisord config --
COPY files/easypanel/supervisord.conf /etc/supervisor/conf.d/agr-collect.conf

# -- Startup script --
COPY files/easypanel/start-all.sh /scripts/start-all.sh
RUN sed -i 's/\r$//' /scripts/start-all.sh && chmod +x /scripts/start-all.sh \
    && sed -i 's/\r$//' /scripts/setup-odk.sh && chmod +x /scripts/setup-odk.sh \
    && sed -i 's/\r$//' /scripts/envsub.awk && chmod +x /scripts/envsub.awk

# -- Create required directories --
RUN mkdir -p \
    /var/log/supervisor \
    /usr/odk/config \
    /var/lib/redis/main \
    /var/lib/redis/cache \
    /data/transfer \
    /etc/dh \
    /etc/selfsign \
    /etc/secrets

# -- Remove default nginx config to avoid conflicts --
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

# -- Persistent volumes --
VOLUME ["/etc/secrets", "/data/transfer", "/etc/dh", "/var/lib/redis"]

EXPOSE 80

ENTRYPOINT ["/scripts/start-all.sh"]
