# Etapa de build
FROM node:20-alpine AS builder

# Se añade libc6-compat porque es requerido por algunos módulos nativos en Alpine (como SWC de Next.js)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Las NEXT_PUBLIC_* se hornean en el bundle del navegador EN EL BUILD.
# Dokploy las inyecta como build args (p. ej. https://api.tudominio.com).
ARG NEXT_PUBLIC_DB_HOST
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_DB_HOST=${NEXT_PUBLIC_DB_HOST} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm install

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

EXPOSE 3000

CMD ["npm", "start"]
