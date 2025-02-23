FROM public.ecr.aws/docker/library/node:latest as base
FROM base AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
#COPY .env.production.sample .env.production
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

#RUN addgroup -g 1001 -S nodejs
#3RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static

#USER nextjs

FROM base as release

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
