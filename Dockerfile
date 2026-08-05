# Multi-stage build for client and server
FROM node:20-slim AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-slim AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN node prisma/setup.js && npx prisma generate
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

# Copy built server code, schema, and node_modules
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/prisma ./server/prisma
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/prisma.config.ts ./server/
COPY --from=server-builder /app/server/tsconfig.json ./server/

# Copy built client static assets
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server

# Expose game port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV OFFLINE_MODE=true

# Prepare db schema and launch server conditionally (only push DB schema automatically in offline mode)
CMD ["sh", "-c", "node prisma/setup.js && npx prisma generate && { if [ \"$OFFLINE_MODE\" != \"false\" ]; then npx prisma db push; else echo '[Prisma Setup] Skipping automatic db push in online mode'; fi; } && node dist/index.js"]
