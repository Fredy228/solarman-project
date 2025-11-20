# ===== base =====
FROM node:23-alpine AS base
WORKDIR /app

# ===== dev =====
FROM base AS dev

# ===== prod =====
FROM base AS prod
COPY ./server /app

COPY ./.env /app/.env

RUN npm i
RUN npm run prisma:generate
RUN pnpm run build
