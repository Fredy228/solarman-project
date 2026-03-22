# ===== base =====
FROM node:23-alpine AS base
WORKDIR /app

# ===== deps =====
FROM base AS deps
COPY client/package*.json ./
RUN npm install

# ===== build (production build artifacts) =====
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY client/ .
# COPY ./.env /app/.env
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# ===== dev (only deps, source mounted via volumes) =====
FROM base AS dev
ENV NODE_ENV=development
COPY client/package*.json ./
RUN npm install
CMD ["npm", "run", "dev"]

# ===== production =====
FROM base AS prod
ENV NODE_ENV=production
COPY client/package*.json ./
RUN npm install --omit=dev
COPY client/. .
# COPY ./.env /app/.env
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

USER node

CMD ["npm", "run", "start"]
