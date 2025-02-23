FROM public.ecr.aws/docker/library/node:latest as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
COPY . .
RUN npm run build

EXPOSE 3000

USER node

CMD [ "npm start" ]
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

#FROM public.ecr.aws/nginx/nginx:1.22 as production-stage
#RUN mkdir /app
#COPY --from=runner /app/public ./public
#COPY nginx.conf /etc/nginx/nginx.conf

