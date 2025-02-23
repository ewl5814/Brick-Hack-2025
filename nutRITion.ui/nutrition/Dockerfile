FROM public.ecr.aws/docker/library/node:latest as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

EXPOSE 3000

USER node

FROM base as release
WORKDIR /app
RUN npm i
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next
COPY --from=base /app/src ./src
COPY --from=base /app .

EXPOSE 3000

EXPOSE 3000

ENV PORT=3000

CMD node server.js
