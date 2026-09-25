FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
# Path the inbox is served under (nginx: location /inbox on the admin hosts).
# Baked into the client bundle and the standalone server at build time.
ARG NEXT_PUBLIC_BASE_PATH=/inbox
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ARG NEXT_PUBLIC_BASE_PATH=/inbox
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH \
    PORT=4000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app

# Standalone output: server.js plus only the node_modules it traces.
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

USER app
EXPOSE 4000

CMD ["node", "server.js"]
