ARG NODE_VERSION=24.22.2
FROM node:${NODE_VERSION}-bookworm-slim

WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=768

COPY package.json package-lock.json ./
COPY web/package.json ./web/package.json
RUN npm ci --no-audit --no-fund

COPY .prettierrc.json ./
COPY .github ./.github
COPY web ./web
RUN npm run lint && npm run check && npm run build
