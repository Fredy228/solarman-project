# ===== base =====
FROM node:23-alpine AS base
WORKDIR /app

# ===== deps =====
FROM base AS deps
COPY client/package*.json ./
RUN npm ci

# ===== build =====
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY client/ .
COPY ./.env /app/.env
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# ===== production =====
FROM base AS prod
ENV NODE_ENV=production
COPY client/package*.json ./
RUN npm ci --omit=dev
COPY client/. .
COPY ./.env /app/.env
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

USER node

CMD ["npm", "run", "start"]
