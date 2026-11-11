# Etapa de build
FROM node:20-alpine AS builder

# Se añade libc6-compat porque es requerido por algunos módulos nativos en Alpine (como SWC de Next.js)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# La URL del navegador se resuelve en runtime con DB_HOST: el entrypoint
# genera public/runtime-config.js al arrancar. Estos ARG quedan solo como
# fallback opcional para builds que no usen el entrypoint.
ARG NEXT_PUBLIC_DB_HOST
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DB_HOST=${NEXT_PUBLIC_DB_HOST} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public

# Publica DB_HOST al navegador en public/runtime-config.js en cada arranque.
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
