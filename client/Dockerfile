# ===== base =====
FROM node:23-alpine AS base
WORKDIR /app

# ===== dev =====
FROM base AS dev

# ===== prod =====
FROM base AS prod
COPY ./client /app

COPY ./.env /app/.env

RUN npm i
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build
