FROM node:23-alpine3.20 AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM base AS dev

COPY . .

EXPOSE 80  

CMD ["npm", "run", "dev"]


FROM base AS builder

ARG ENV_FILE=.env.production

COPY ${ENV_FILE} .env

COPY . .

RUN npm run build


FROM nginx:stable-alpine AS production


RUN rm /etc/nginx/conf.d/default.conf


COPY ./nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]

