# ===== base =====
FROM node:23-alpine AS base
WORKDIR /app

# ===== deps =====
FROM base AS deps
COPY server/package*.json ./
RUN npm ci

# ===== build =====
FROM base AS builder
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY server/ .
COPY ./.env /app/.env
RUN npm run prisma:generate \
    && npm run build

# ===== dev (mount source via volumes, only install deps here) =====
FROM base AS dev
ENV NODE_ENV=development
COPY server/package*.json ./
RUN npm ci
CMD ["sh", "-c", "npm run prisma:deploy && npm run prisma:generate && npm run start:dev"]

# ===== production =====
FROM base AS prod
ENV NODE_ENV=production
COPY server/package*.json ./
RUN npm ci --omit=dev \
    && npm install --no-save prisma
COPY server/. .
COPY ./.env /app/.env
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R node:node /app
USER node

CMD ["sh", "-c", "npm run prisma:deploy && npm run start:prod"]
