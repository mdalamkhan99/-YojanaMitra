FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
COPY shared/package.json shared/package.json
RUN npm ci
COPY . .
RUN npx prisma generate --schema server/prisma/schema.prisma && npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/server/dist ./server/dist
COPY --from=build --chown=node:node /app/server/prisma ./server/prisma
COPY --from=build --chown=node:node /app/client/dist ./client/dist
COPY --from=build --chown=node:node /app/shared ./shared
RUN mkdir -p /var/lib/yojanamitra && chown node:node /var/lib/yojanamitra
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s CMD node -e "fetch('http://127.0.0.1:4000/api/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["sh","-c","npx prisma migrate deploy --schema server/prisma/schema.prisma && node server/dist/src/index.js"]
