FROM public.ecr.aws/docker/library/node:latest as base
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

#FROM public.ecr.aws/nginx/nginx:1.22 as production-stage
#RUN mkdir /app
#COPY --from=runner /app/public ./public
#COPY nginx.conf /etc/nginx/nginx.conf

