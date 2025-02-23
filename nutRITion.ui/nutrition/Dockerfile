FROM public.ecr.aws/docker/library/node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

FROM public.ecr.aws/nginx/nginx:1.22 as production-stage
RUN mkdir /app
COPY --from=builder /app/public ./public
COPY nginx.conf /etc/nginx/nginx.conf

